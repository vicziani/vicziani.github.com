---
layout: post
title: JPA több one-to-many kapcsolat
date: '2013-03-17T22:03:00.001+01:00'
author: István Viczián
tags:
- performance
- Hibernate
- JPA
modified_time: '2013-03-17T22:03:19.451+01:00'
blogger_id: tag:blogger.com,1999:blog-7370998606556338092.post-4963379818802072423
blogger_orig_url: http://www.jtechlog.hu/2013/03/jpa-tobb-one-to-many-kapcsolat.html
---

Felhasznált technológiák: Spring 4.1.6, Hibernate 4.3.9

Már írtam egy [posztot](/2012/04/22/jpa-lazy-loading.html) a JPA
teljesítményhangolásával, valamint a lazy loadinggal kapcsolatban. Ott
egy entitáshoz egy másik kapcsolódott, one-to-many kapcsolattal. Ott
folytatom, ahol abbahagytam, de most egy entitáshoz két másik entitás
kapcsolódik ugyanazon, one-to-many kapcsolattal. Egyrészt megvizsgálom a
Hibernate egy jellegzetes hibaüzenetét, valamint elemzek több megoldást
is performancia szempontból.

Az adatmodell a következő osztálydiagramon látható. Egy `Employee`
példányhoz több `Phone` és több `Address` példány kapcsolódik.

[![](http://yuml.me/d2a0e90e)](http://yuml.me/d2a0e90e)

A posthoz tartozó példaprogram [letölthető a
GitHub-ról](https://github.com/vicziani/jtechlog-jpa-descartes). A
projekt letöltése után az `mvn test` paranccsal futtatható a teszt eset.
Ez egy JUnit teszt eset, mely felépíti a Spring contextet, elindít egy
beépített HSQLDB adatbázis-kezelőt, létrehozza a táblákat, feltölti
adatokkal, majd meghívja a service-t, mely JPA lekérdezéseket használ,
és a visszatérési értéket Hamcresttel ellenőrzi. A projekt ebben a
posztban bemutatott legutolsó megoldást tartalmazza, de megjegyzésben
ott van a többi megoldás is.

Amennyiben elkészítjük a három entitást, és csak a kötelező
annotációkkal látjuk el, és azok kötelező paramétereivel, a következő
kivételt kapjuk:
`org.hibernate.LazyInitializationException: failed to lazily initialize a collection of role: jtechlog.descartes.Employee.phones, could not initialize proxy - no Session`.
Az előző posztból tudhatjuk, hogy ez azért van, mert a `@OneToMany`
annotáció használatakor a kapcsolódó entitásokat csak akkor tölti be,
mikor szükség van rá (default a lazy loading). De mivel a teszt eset
kéri le először a kapcsolódó entitásokat, a persistence context már
zárva, a session zárva, így a Hibernate ezeket már nem tudja lekérdezni.

Első megoldás, mely eszünkbe juthat, hogy egészítsük ki a `@OneToMany`
annotációkat a `fetch = FetchType.EAGER` paraméterrel. Ekkor a következő
kivételt kapjuk, már akkor, mikor elindul a Hibernate:
`Deploy time: Caused by: org.hibernate.loader.MultipleBagFetchException: cannot simultaneously fetch multiple bags`.

Ennek az az oka, hogy a Hibernate ebben az esetben egy joint tartalmazó
select utasítást ad ki, és nem tudja kiválasztani, hogy melyik rekord
melyik entitáshoz tartozik. A select a következő.

{% highlight sql %}
SELECT ...
FROM Employee employee0_
LEFT OUTER JOIN Address addresses1_ 
  ON employee0_.id = addresses1_.employee_id
LEFT OUTER JOIN Phone phones2_ 
  ON employee0_.id = phones2_.employee_id
WHERE employee0_.id = ?
{% endhighlight %}

Ezen kivétel mögött igen nagy irodalom áll, és több megoldási javaslatot
is találhatunk. Egyrészt használjuk a Hibernate `@IndexColumn`
annotációját, vagy ha nem akarunk provider függőek lenni, akkor a JPA
2.0-ban megjelent szabványos `@OrderColumn` annotációt. Ezt a `@OneToMany`
annotációk mellé kell tenni, valamint a `phone` és az `address` táblába kell
egy-egy új mező, mely az adott entitás listában elfoglalt pozícióját
jelzi, és a JPA provider automatikusan karbantartja (, ahogy a
példaprogramban is látható).

A másik megoldás, hogy mind a két esetben a `List` típust átírjuk
`Set`-re. Az előbbi és ezen megoldás esetében is megmarad a join a
lekérdezésben.

Van még egy megoldás. A `@OneToMany` annotációk mellé Hibernate specifikus
`@Fetch` annotációt helyezünk el. Ez azt mondja meg, hogy a kapcsolódó
rekordokat hogyan töltse be. Paraméterként több módot is meg lehet adni,
az alapértelmezett mód a fentebb leírt `JOIN`, de használhatunk `SELECT`
vagy `SUBSELECT` értékeket is.

Mindkettő használata esetén a persistence provider három select
utasítást ad ki.

{% highlight sql %}
select ... from Employee employee0_ where employee0_.id=?
select ... from Phone phones0_ where phones0_.employee_id=?
select ... from Address addresses0_ where addresses0_.employee_id=?
{% endhighlight %}

Itt tehát a két mód között nem látszik különbség. Azonban ha azt a
metódust nézzük, mely az összes `Employee` példányt visszaadja
(`findEmployees()`), azonnal láthatjuk a különbséget. A `SELECT` mód esetén
a `phone` és az `address` táblára annyi select utasítást ad ki, amennyi
rekordot az `employee` tábla tartalmazott. A `SUBSELECT` mód esetén mindig
három select utasítást futtat, méghozzá a következőket.

{% highlight sql %}
select ... from Employee employee0_ order by employee0_.id
select ... from Phone phones0_ 
  where phones0_.employee_id 
    in (select employee0_.id from Employee employee0_ )
select ... from Address addresses0_ 
  where addresses0_.employee_id 
    in (select employee0_.id from Employee employee0_ )
{% endhighlight %}

Láthattuk, hogy hogy működik az eager fetch esetén de én ezt nem
szeretem használni, mert ilyenkor mindig eager jönnek le a kapcsolódó
entitások, nem tudok választani. Viszont finomabban szabályozható, ha a
lekérdezésben adom meg, hogy mit akarok betölteni. Erre a join fetch
való. Írjuk is át a lekérdezést, hogy a következő lekérdezést használja:

	select distinct e from Employee e 
	  join fetch e.phones 
	  join fetch e.addresses where e.id = :id


A helyzet ugyanaz, mint az eager fetch esetén,
`MultipleBagFetchException`-t kapunk. Persze megint átállhatunk `Set`-re,
és ekkor ugyanoda lyukadunk, hogy joint tartalmazó select utasítást
kapunk. Mi ezzel a probléma?

{% highlight sql %}
select distinct ... from Employee employee0_ 
  inner join Phone phones1_ 
    on employee0_.id=phones1_.employee_id 
  inner join Address addresses2_ 
    on employee0_.id=addresses2_.employee_id 
  where employee0_.id=?
{% endhighlight %}

Igen, jól látható, hogy a fenti select utasítás eredménye egy
Descartes-szorzat. Azaz ha a `phone` táblában van tíz rekord, és a `address`
táblában is van tíz rekord egy adott `employee` rekordhoz, a lekérdezés
száz rekordot fog visszaadni. Ez a probléma az eager fetch-nél is
fennáll `JOIN` mód esetén.

Mi lehet erre a megoldás? Tudjuk azt, hogy amíg él a persistence
context, addig a JPA provider a memóriában tárolja, hogy mik lettek
betöltve, és azokat nem kéri be újra. Tehát egyrészt lekérdezzük az
`Employee` entitást joinnal összekötve a `Phone` entitásokkal, majd egy
külön lekérdezésben az `Employee` entitást joinnal összekötve az `Address`
entitásokkal. Ez a következőkben látszik.

{% highlight java %}
@Transactional(readOnly = true)
public Employee findEmployeeById(long id) {
    em.createQuery("select e from Employee e " +
      "join fetch e.phones where e.id = :id", Employee.class)
        .setParameter("id", id)
        .getSingleResult();
    return em.createQuery("select e from Employee e " +
      "join fetch e.addresses where e.id = :id", Employee.class)
        .setParameter("id", id)
        .getSingleResult();
    }
{% endhighlight %}

Megfigyelhetjük, hogy az első lekérdezés eredményével nem csinálunk
semmit. Csupán csak arra való, hogy az `Employee` és a `Phone` entitásokat a
persistence contextbe töltse. A második query igaz, hogy csak a `Address`
entitásokat kéri le, de mivel a `Phone` entitások már a persistence
contextben vannak, hozzáköti őket. Ehhez persze kell a `@Transactional`
annotáció (`readOnly = true` paraméterrel a sebesség érdekében),
különben mindkét lekérdezéshez külön persistence contextet nyitna, így
ugyanúgy `LazyInitializationException` lenne a jutalmunk. A lefuttatott
két select utasítás a következő.

{% highlight sql %}
select ... from Employee employee0_ 
  inner join Phone phones1_ 
    on employee0_.id=phones1_.employee_id where employee0_.id=?
select ... from Employee employee0_ 
  inner join Address addresses1_ 
    on employee0_.id=addresses1_.employee_id where employee0_.id=?
{% endhighlight %}

Látható, hogy két select fut le, mindegyik eredménye tíz-tíz rekord,
szemben a join változattal, ahogy egy select adott vissza száz rekordot.

A performancia hangolás érdekében még jó tisztában lenni a kiadható
hintekkel is, mely persistence providerenként más és más, [Hibernate
esetén](http://docs.jboss.org/hibernate/stable/entitymanager/reference/en/html/objectstate.html#d0e1215)
hasznos lehet a `org.hibernate.fetchSize` hint, amivel azt állíthatjuk
be, hogy hány rekordonként forduljon az adatbázishoz, azaz egyszerre
mennyi rekord menjen át Java oldalra. Ennek használatával sikerült akár
kétszeres sebességjavulást is elérnem.
