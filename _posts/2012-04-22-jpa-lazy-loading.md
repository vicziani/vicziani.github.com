---
layout: post
title: JPA lazy loading
date: '2012-04-22T23:14:00.001+02:00'
author: István Viczián
tags:
- EclipseLink
- Hibernate
- JPA
modified_time: '2018-02-08T20:31:00.000+01:00'
---

Technológiák: JPA 2.1, EclipseLink 2.6.0, Hibernate 4.3.9, Spring 4.1.6.RELEASE

Gyakorta találkozunk JPA használatakor a lazy loading fogalmával (vagy
más néven deferred loading, lazy fetching, on-demand fetching,
just-in-time reading, indirection, stb.), azonban használata koránt sem
olyan triviális, mint amilyennek tűnik. A [JSR 317: Java Persistence
API, Version
2.0](http://download.oracle.com/otndocs/jcp/persistence-2.0-fr-eval-oth-JSpec/)
specifikáció is viszonylag szűkszavúan nyilatkozik róla. Annyit ír, hogy
`@Basic`, `@OneToOne`, `@OneToMany`, `@ManyToOne`, `@ManyToMany` és az
`@ElementCollection` annotációknál használatos, és ez egy hint a
perzisztencia megvalósításnak, hogy az adott property-t vagy kapcsolatot
nem kell azonnal betölteni, csak az első hozzáférés alkalmával. Egy
helyen emeli még ki, amikor deszerializált objektumot kell merge-ölni,
és lazy loading van megadva, akkor a különböző implementációk máshogy
viselkedhetnek, ezért amennyiben a persistence providert cserélgetni
szeretnénk, nem érdemes lazy loadingolt mezőn merge-öt használni. A JPA
megfogalmazásában a fetch type lazy késleltetett betöltés esetén, és
eager, ha azonnal be kell tölteni.

Miért is érdemes lazy loadingot alkalmazni? Alapvetően
teljesítménynövelés céljából. Először meg kell különböztetni a két
esetet, mikor egy entitás egy mezőjére, vagy egy kapcsolatra tesszük rá.
Az előbbi akkor lehet hasznos, amennyiben egy entitás nem minden mezőjét
akarjuk mindig betölteni, mert vagy túl sok van neki, vagy túl nagyok.
Utóbbi esetre egy példa egy hallgatói nyilvántartásban a hallgatóhoz
tartozhat egy fénykép is, de ez nagy, blobban tároljuk, és egy listázó
képernyőn nem akarjuk megjeleníteni, csak a részletek képernyőn. Ezzel
vigyázni kell, mert ha nem megfelelően használjuk, azaz nincs nagy
mennyiségű mező vagy nem nagy méretű, akkor többet ártunk, mint
használunk. Ugyanis az újbóli adatbázishoz fordulás erőforrás igényesebb
lehet, mint pár plusz adat lekérése. Kapcsolódó entitások esetében
példa, ha egy listázó képernyőn nem akarjuk a számlához tartozó
tételeket megjeleníteni, kivéve a részletek képernyőn, ahol szükséges
őket felsorolni. Háttérben ez úgy történik, hogy egy proxy osztály kerül
generálásra (EclipseLink és Hibernate esetében eltérően), és nem tölti
be a lekérdezés esetén a megfelelő mezőt vagy kapcsolatot, és így kerül
példányosításra a proxy objektum. Amikor a proxy objektumtól mégis
elkérésre kerül a nem betöltött mező vagy osztály, akkor próbálkozik a
persistence provider a betöltéssel.

Postomban a lazy loading viselkedését vizsgálom a két legelterjedtebb
provider, az [EclipseLink](http://www.eclipse.org/eclipselink/) és a
[Hibernate](http://hibernate.org/) esetében. A [Hibernate
EclipseLink átállás](/2009/05/10/hibernate-eclipselink-atallas.html)
poszt részletesen leírja, hogyan lehet átállni Hibernate-ről
EclipseLinkre, valamint ebben leírom, mi az a weaving, Java agent és
instrumentation, így ezekre itt nem térek ki részletesebben.

Példaként már egy [előző
posztomban](/2010/09/09/entitasok-auditalasa-hibernate-envers.html)
bemutatott esetet használok, kicsit módosítva.

![Osztálydiagram](/artifacts/posts/2012-04-22-jpa-lazy-loading/jpa-lazy.png)

A példaprogram letölthető a
[GitHub-ról](https://github.com/vicziani/jtechlog-lazy). A példaprogram
a `mvn test` parancs kiadásával már futtathatók a tesztesetek, `mvn jetty:run`
parancs hatására pedig elindul a webes alkalmazás. (Azért webes alkalmazás, mert
demonstrálni szeretném az "Open EntityManager in View" tervezési mintát is.)
A példaprogram jó példa arra is, hogyan lehet az EclipseLinket vagy a Hibernate-et
Springgel integrálni. Az alkalmazásba beágyazott HyperSQL
adatbáziskezelő biztosítja a perzisztenciát, melybe a `testdata.sql` szkript
szúr be két `employee` rekordot, mindkettőt 2-2 telefonszámmal.
Az `Employee` esetén egyrészt a `cv`
mezőt vizsgáljuk, másrészt a `List<Phone>` kapcsolatot. A `DefaultEmployeeService`
metódusain van a `@Transactional` annotáció, így azok hívásakor jön létre a
persistence context, majd azok lefutásakor az lezárásra kerül.
Az entitások a persistence context
lezárásakor detached állapotba kerülnek. A kódot bőséges naplózással
láttam el, valamint bekapcsoltam, hogy a persistence provider írja ki a
lefuttatott sql parancsokat. Így jól lehet látni, hogy milyen sql-eket
ad ki, mikor még él a persistence context, és milyeneket mikor már
lezárásra került.

### EclipseLink

Az EclipseLink-et úgy konfiguráltam, hogy static weaving legyen, azaz
fordítási időben instrumentálja a class fájlokat. Ehhez a pom.xml-ben a
`eclipselink-staticweave-maven-plugin` plugint használtam. Valamint a
`persistence.xml`-ben az `eclipselink.weaving` property értékét `static`
értékre kellett állítani. Build közben a következőket írja ki a weavinggel
kapcsolatban:

    [EL Finest]: 2012-04-22 01:41:28.453--ServerSession(3980107)--
    Thread(Thread[main,5,main])--Begin predeploying Persistence
    Unit lazyPersistenceUnit; session lazyPersistenceUnit; state
    Initial; factoryCount 0

    [EL Finest]: 2012-04-22 01:41:29.062--ServerSession(3980107)--
    Thread(Thread[main,5,main])--Begin weaver class transformer
    processing class [jtechlog/lazy/service/Phone].
    [EL Finest]: 2012-04-22 01:41:29.078--ServerSession(3980107)--
    Thread(Thread[main,5,main])--End weaver class transformer
    processing class [jtechlog/lazy/service/Phone].

Alapértelmezetten az EclipseLink cache be van kapcsolva, ezért a
`persistence.xml`-ben kikapcsoltam azért, hogy követni lehessen, hogy
milyen SQL utasításokat ad ki.

{% highlight xml %}
<property name="eclipselink.cache.shared.default" value="false"/>
{% endhighlight %}

Első körben azt az alapértelmezett esetet vizsgáltam, mikor nem tettem
semmilyen annotációt a CV mezőre. A listázó képernyőn a következőt
kaptuk:

{% highlight sql %}
SELECT ID, CV, EMP_NAME FROM EMPLOYEE
-- Persistence context lezárása
SELECT ID, PHONE_NUMBER, PHONE_TYPE, EMPLOYEE_ID FROM PHONE
  WHERE (EMPLOYEE_ID = ?)
SELECT ID, PHONE_NUMBER, PHONE_TYPE, EMPLOYEE_ID FROM PHONE
  WHERE (EMPLOYEE_ID = ?)
{% endhighlight %}

Az adott alkalmazott kilistázásakor hasonlóképp működik.

{% highlight sql %}
SELECT ID, CV, EMP_NAME FROM EMPLOYEE WHERE (ID = ?)
-- Persistence context lezárása
SELECT ID, PHONE_NUMBER, PHONE_TYPE, EMPLOYEE_ID FROM PHONE
  WHERE (EMPLOYEE_ID = ?)
{% endhighlight %}

Először vizsgáljuk csak a `cv` mezőt. Azt kaptuk, amit vártunk, minden
mezőt lekérdezett mindkét képernyőn. Aztán a `cv` mezőre rátettem a `@Lob`
annotációt, a helyzet változatlan volt. Amennyiben rátettem a
`@Basic(fetch = FetchType.LAZY)` annotációt a cv mezőre, máris
megváltozott a helyzet (, függetlenül attól, hogy a `@Lob` rajta volt-e
vagy sem).

{% highlight sql %}
SELECT ID, EMP_NAME FROM EMPLOYEE
-- Persistence context lezárása
SELECT ID, CV, EMP_NAME FROM EMPLOYEE WHERE (ID = ?)
SELECT ID, PHONE_NUMBER, PHONE_TYPE, EMPLOYEE_ID FROM PHONE
  WHERE (EMPLOYEE_ID = ?)
SELECT ID, EMP_NAME FROM EMPLOYEE WHERE (ID = ?)

SELECT ID, CV, EMP_NAME FROM EMPLOYEE WHERE (ID = ?)
SELECT ID, PHONE_NUMBER, PHONE_TYPE, EMPLOYEE_ID FROM PHONE
  WHERE (EMPLOYEE_ID = ?)
SELECT ID, EMP_NAME FROM EMPLOYEE WHERE (ID = ?)
{% endhighlight %}

Valamint egy entitást lekérdezésekor:

{% highlight sql %}
SELECT ID, EMP_NAME FROM EMPLOYEE WHERE (ID = ?)
-- Persistence context lezárása
SELECT ID, CV, EMP_NAME FROM EMPLOYEE WHERE (ID = ?)
SELECT ID, PHONE_NUMBER, PHONE_TYPE, EMPLOYEE_ID FROM PHONE
  WHERE (EMPLOYEE_ID = ?)
SELECT ID, EMP_NAME FROM EMPLOYEE WHERE (ID = ?)
{% endhighlight %}

Az addig rendben van, hogy az első selectben ezek után nem kérdezte le
a `cv` mezőt. Láthatjuk, hogy a persistence context lezárása után
lekérdezi immár az alkalmazotthoz tartozó összes mezőt, köztük a `cv` mezőt
is. Ez az EclipseLink egy speciális viselkedése, hogy a persistence
context lezárása után is képes sql utasításokat kiadni, betöltve ezzel a
lazy-vel definiált mezőket. Az azonban számomra rejtély, hogy miért kell
még egy selectet kiadni az `employee` táblán.

Most pedig nézzük a kapcsolatot. Látható, hogy a `@OneToMany`-n
alapértelmezetten a fetch type lazy, ugyanis a persistence context
lezárása után kéri le a persistence provider a telefonszámokat. Ráadásul
alkalmazottanként egy külön selectben. Itt is látható az EclipseLink
különleges viselkedése, hogy a persistence context lezárása után is le
tudja kérdezni a még be nem töltött entitásokat. A szabvány amúgy nem
írja le, hogy ilyenkor mi legyen. A persistence provider megpróbálhatja
feloldani a nem betöltött kapcsolatokat, mint ahogy az EclipseLink is
teszi, kivételt dobhat, ahogy a Hibernate, mint azt később látni fogjuk,
vagy inicializálatlanul hagyja az adott mezőket. A `@OneToMany`,
`@ManyToMany` és `@ElementCollection` esetén az alapértelmezett fetch type
lazy, a `@Basic`, `@OneToOne` és `@ManyToOne` esetén eager.

A következő lépésben beállítottam a `@OneToMany` annotációnál a fetch
paramétert `FetchType.EAGER` értéket. Az eredmény mind a két esetben
ugyanaz volt, mint az előbb, azzal a különbséggel, hogy a kapcsolódó
telefonszámokat nem a persistence context lezárása után kérte el, hanem
még előtte. Azaz ugyanúgy több selectet futtatott, de mindet a
persistence context lezárása előtt.

Azon, hogy ne több selectet futtasson le, egyféleképpen tudtam
segíteni, és kizárólag a lekérdezés esetén. Átírtam a következőre:

    select distinct e from Employee e join fetch e.phones

A distinct használata kötelező, mert ha nem tettem ki, akkor egy
alkalmazottat annyiszor hozott le, amennyi telefonszáma volt. A
háttérben ugyanis itt egy join van, a következő lekérdezésnek megfelelő
selectet futtatja le a persistence provider:

    select distinct e, p from Employee e join e.phones p

Viszont a p eredmény értékét egyszerűen nem használja fel, hanem
eldobja. A distinct használata tehát szükséges ilyenkor, ekkor az
alkalmazottak listázásakor a következő select futott le:

{% highlight sql %}
SELECT DISTINCT t1.ID, t1.CV, t1.EMP_NAME, t0.ID, t0.PHONE_NUMBER,
  t0.PHONE_TYPE, t0.EMPLOYEE_ID
  FROM PHONE t0, EMPLOYEE t1 WHERE (t0.EMPLOYEE_ID = t1.ID)
{% endhighlight %}

Különösen érdekes lehet még a lazy loaddal bejelölt, és nem betöltött
entitások kezelése cascade merge esetén. Ennek tesztelésére készítettem
egy oldalt, mely betölti az alkalmazottat, telefonszámokat lazy fetch-re
állítottam, és megjelenít egy űrlapot. Az Employee példányt session-be
tettem (EditEmployeeController), majd a detach-elt példányt az űrlap
postjakor módosítottam, majd merge-öltem vissza
(EmployeeService.mergeEmployee()). Minden hibátlanul működött, a
módosítás megtörtént, a telefonszámok érintetlenül maradtak.

Aztán kipróbáltam azt is, hogy a poszt után még hozzáadtam egy
telefonszámot is. Az EclipseLink betöltötte a telefonszámokat, elvégezte
az update-et az employee táblán, majd történt egy insert a phone
táblába.

{% highlight java %}
employee.addPhone(new Phone("home", "123"));
{% endhighlight %}

Van egy metódus arra, hogy megvizsgáljuk, hogy az adott kapcsolatok,
melyek lazyvel vannak jelölve, betöltésre kerültek-e. A következőképpen
használhatjuk:

{% highlight java %}
Persistence.getPersistenceUtil().isLoaded(
            em.find(Employee.class, 42), "phoneNumbers");
{% endhighlight %}

### Hibernate

Ugyanazzal az alapfelállással indulok, mint az EclipseLink esetében,
azaz nincs plusz annotáció, és a `@OneToMany` annotációnál sincs plusz
paraméter. Az előző cikkem óta a Hibernate 3.3.0.CR2-ben a bájtkód
módosítását a CGLib helyett a javassist végzi (, amiről szintén írtam
[korábban](/2011/12/12/instrumentation-javassisttal.html)) ,
[ugyanis](https://hibernate.atlassian.net/browse/HHH-2505) az előbbi nagyon
inaktív projekt lett, így leváltották. Mindkét service hívás esetén
következő hibaüzenetet kapom:

    org.hibernate.LazyInitializationException: failed to lazily initialize a
    collection of role: jtechlog.lazy.service.Employee.phones, no session or
    session was closed
     at org.hibernate.collection.internal.AbstractPersistentCollection.
    throwLazyInitializationException(AbstractPersistentCollection.java:393)
        ...

Ahogy említettem, csak az EclipseLink sajátossága az, hogy lazy
loadinggal megjelölt kapcsolatban részt vevő entitásokat a persistence
context lezárása után (azaz detach állapotban lévő entitásokat is) be
tud tölteni. A Hibernate ezt nem tolerálja, amennyiben nem betöltött
mezőre történik hivatkozás, és a persistence context nincs nyitva, ezt a
hibaüzenetet kapom. A Hibernate-tel való ismerkedéskor ez a leggyakoribb
hiba.

A probléma megoldására többfajta megoldás létezik:

-   Eager fetch-t állítunk be a `@OneToMany` annotáció paraméterében.
-   Ha entitást akarunk a view rétegnek levinni, akkor megtehetjük azt
    is, hogy amíg a persistence context aktív, meghívjuk a megfelelő
    getter metódust.
-   A fentivel ekvivalens, ha a view rétegnek nem entitást adunk, hanem
    egy ún. data transfer object-et. Ezt még addig feltöltöm
    (gyakorlatilag az előző esethez hasonlóan a gettereket hívom), míg a
    persistence context aktív, így nincs probléma. Ez több programozási
    feladattal jár, a DTO-k plusz réteget jelentenek.
-   Külön lekérdezést alkalmazunk `fetch join`-nal, vagy ún. projection
    query-t, vagy akár JDBC-vel is operálhatunk. Ez utóbbi még tervezési
    minta is Fast Lane Reader néven, mikor az ORM réteget kikerüljük,
    tipikusan teljesítménynövelés miatt, és alacsonyabb szintű technológiával
    dolgozunk.
-   Az eddigi megoldások azt célozták meg, hogy legyenek betöltve a
    megfelelő objektumok. A következők azt célozzák meg, hogy ne kelljen
    detach-elni. Amíg lehet, nyitva hagyjuk a persistence contextet, ha
    kell, a view réteg lefutása után zárjuk csak le.
-   Vagy alkalmazás által vezérelt tranzakciókezelést vagy persistence
    contextet, vagy extended persistence contextet használunk. Ugyanis
    alapértelmezetten egy persistence context a tranzakció lezárásáig
    tart. Programból mi is vezérelhetjük a tranzakciókat. Vagy az
    `EntityManager` létrehozását `EntityManagerFactory`-n keresztül
    (`createEntityManager` metódus), és lezárását (a `close` metódusával).
    Vagy stateful session bean (EJB) esetén használhatunk extended
    persistence contextet, ez nem csak egy tranzakciónyi, hanem a bean
    élettartamáig élhet.

Amennyiben a `@OneToMany` annotáció paraméterében eager fetch-t állítunk
be, az alkalmazottak listázása ugyanúgy történik, mint az EclipseLink
esetén, azaz három query, először az alkalmazottak, majd
alkalmazottanként a telefonszámok lekérdezése.

Azonban a Hibernate az `EntityManager.find` metódus használatakor már
okosabb, mint az EclipseLink, egy left outer joint is tartalmazó
lekérdezést futtat:

{% highlight sql %}
select employee0_.id as id0_1_, employee0_.cv as cv0_1_,
  employee0_.EMP_NAME as EMP3_0_1_, phones1_.employee_id
  as employee4_0_3_, phones1_.id as id3_, phones1_.id as id1_0_,
  phones1_.employee_id as employee4_1_0_,
  phones1_.PHONE_NUMBER as PHONE2_1_0_,
  phones1_.PHONE_TYPE as PHONE3_1_0_
  from Employee employee0_
  left outer join Phone phones1_
  on employee0_.id=phones1_.employee_id where employee0_.id=?
{% endhighlight %}

Amennyiben a getter metódusokkal akarjuk az entitást inicializálni,
vigyázzunk, nem mindegy, hogy mit hívunk meg, mert pl. a `getPhones()`,
`getPhones().get(1).getId()` nem megfelelő, sőt a `getPhones().size()` sem,
hanem pl. érdemes az első elem nem azonosító típusú mezőjét lekérni. Ez ezért van így,
mert a Hibernate úgy módosítja a bájtkódot, hogy a lista létrejön, abban
az `Employee` objektumok is, de csupán az `id` mezőjük van feltöltve, a
többi getter hívás indukálja a további betöltéseket. Az, hogy explicit
ráhívunk a getterre, számomra egy
kicsit visszás, mert a kódot olyan technikai részekkel gyarapítjuk, mely
üzleti szempontból teljesen lényegtelen, ráadásul az alsóbb rétegnek
kell ilyenkor a felsőbb réteg igényeiről tudnia, hogy a visszaadott adat
hogy kerül megjelenítésre.

A join fetch-es lekérdezés ugyanúgy működik itt is, mint az EclipseLink
esetén, itt a legenerált SQL kicsit másképp néz ki, a Hibernate az inner
join kulcsszót használja.

{% highlight sql %}
select distinct employee0_.id as id0_0_, phones1_.id as id1_1_,
  employee0_.cv as cv0_0_, employee0_.EMP_NAME as EMP3_0_0_,
  phones1_.employee_id as employee4_1_1_,
  phones1_.PHONE_NUMBER as PHONE2_1_1_,
  phones1_.PHONE_TYPE as PHONE3_1_1_,
  phones1_.employee_id as employee4_0_0__,
  phones1_.id as id0__
  from Employee employee0_
  inner join Phone phones1_
  on employee0_.id=phones1_.employee_id
{% endhighlight %}

Persze a ebben az esetben az `findEmployeeById` metódust is át kellett
írni, hogy ne az `EntityManager.find` metódusát használja, hanem szintén
fetch join-os lekérdezést:

{% highlight sql %}
return em.createNamedQuery("findEmployeeById", Employee.class)
  .setParameter("id", id).getSingleResult();
{% endhighlight %}

Valamint a NamedQuery:

{% highlight sql %}
@NamedQuery(name = "findEmployeeById",
  query = "select distinct e from Employee e join fetch e.phones where e.id = :id")
{% endhighlight %}

Megoldás lehet az is, hogy ha a persistence context tranzakciónyi, akkor
a view rétegben kell a tranzakciót nyitni és zárni. Ezt nevezik
transactional view-nak. Ennek továbbfejlesztése, hogy nem a tranzakciót
nyitjuk a view-ban, hanem az entity managert, ennek neve az "Open
EntityManager in View" minta használata, és kb. ugyanazon előnyökkel és
hátrányokkal rendelkezik. Ehhez a következőt kell hozzáadni a
`web.xml`-hez:

{% highlight xml %}
<filter>
    <filter-name>openEntityManagerInViewFilter</filter-name>
    <filter-class>org.springframework.orm.jpa.support.OpenEntityManagerInViewFilter
		</filter-class>
</filter>
<filter-mapping>
    <filter-name>openEntityManagerInViewFilter</filter-name>
    <url-pattern>*.html</url-pattern>
</filter-mapping>
{% endhighlight %}

Itt az történik, hogy a http kérés beérkeztekor a filter nyit egy
persistence contextet, és az adott szálhoz
rendeli. A tranzakció kezdésekor a szolgáltatásrétegben a szálhoz
rendelt `EntityManager`-hez kapcsolódik. Lefut a `flush`, majd a `commit` a
szolgáltatás végén, ha minden rendben ment. Majd meghívásra kerül a
view. Ennek visszaadása után zárja le csak a filter az `EntityManager`-t.
Bár egyszerű és gyors megoldásnak tűnik, én nagy terhelésű rendszer
esetén nem javasolnám a használatát. Egyrészt többen írják, hogy
lassabb, bár saját mérési eredményeim nincsenek. Valamint ahhoz tartom
magam, hogy az ilyen jellegű dolgokat minimális ideig tartsunk nyitva.
Egyszerű, párfelhasználós, vagy pilot projekt esetén viszont jól jöhet.

`OpenEntityManagerInViewFilter` helyett használhatnánk
`OpenEntityManagerInViewInterceptor`-t is, mely az application contextben
jön létre, így hozzáfér az abban lévő bean-ekhez.

Itt még figyeljük meg a lekérdezéseket:

{% highlight sql %}
select employee0_.id as id0_, employee0_.cv as cv0_,
  employee0_.EMP_NAME as EMP3_0_ from Employee employee0_
-- Persistence context lezárása
select phones0_.employee_id as employee4_0_1_,
  phones0_.id as id1_, phones0_.id as id1_0_,
  phones0_.employee_id as employee4_1_0_,
  phones0_.PHONE_NUMBER as PHONE2_1_0_,
  phones0_.PHONE_TYPE as PHONE3_1_0_ from Phone phones0_
  where phones0_.employee_id=?
select phones0_.employee_id as employee4_0_1_,
  phones0_.id as id1_, phones0_.id as id1_0_,
  phones0_.employee_id as employee4_1_0_,
  phones0_.PHONE_NUMBER as PHONE2_1_0_,
  phones0_.PHONE_TYPE as PHONE3_1_0_
  from Phone phones0_ where phones0_.employee_id=?
{% endhighlight %}

Gyakorlatilag ugyanaz, mint az EclipseLink esetén, azzal a különbséggel,
hogy a Hibernate mindenütt aliasokat használ.

Az alkalmazás által gyártott `EntityManager` használatát nem javaslom,
hiszen nagyon oda kell figyelni, bonyolítja a kódot, plusz munkával jár,
és az újrafelhasználhatóságot is megnehezíti. Az extended persistence
context szintén nem befutó nálam, hiszen egyrész Springezek, másrészt
EJB esetén is kerülöm a stateful session beanek használatát.

Vizsgáljuk meg most a `cv` mező működését. Ahogy várható, mindig
beolvassa. Azonban az már meglepő, hogy a `@Lob`, vagy a `@Basic(fetch =
FetchType.LAZY)` vagy mindkét annotáció hatására sem változik semmi, azaz
mindig berántja. Ennek az az oka, hogy ez csak akkor működik, ha az osztályok
instrumentálva vannak. A példa projektben a `pom.xml`-ben a
`maven-antrun-plugin` futtat egy
`org.hibernate.tool.instrument.javassist.InstrumentTask` taskot. Amennyiben
ezt megtesszük, a következő kerül a konzolra.

    main:
    [instrument] starting instrumentation
    [instrument] processing class : jtechlog.lazy.service.Employee;  
      file = D:\projects\jtechlog\jtechlog-lazy\target\classes\
      jtechlog\lazy\service\Employee.class
    [instrument] processing class : jtechlog.lazy.service.Phone;  
      file = D:\projects\jtechlog\jtechlog-lazy\target\classes\
      jtechlog\lazy\service\Phone.class

A class állományok is nagyobbak lesznek, és belenézve ilyeneket látunk:
`org/hibernate/bytecode/internal/javassist/FieldHandler`. Azért jó ezt
tudni, mert pl. engem a fejlesztőeszköz tévesztett meg azzal, hogy saját
maga felülvágta a Maven által generált class állományokat, amik azonban
még nem voltak instrumentálva. Innentől lazy mező esetén pont úgy
működött, mint ahogyan az elvárható volt, és ugyanúgy figyelni kell
arra, hogy ne kapjunk `LazyInitializationException`-t.

Merge esetén úgy működött, ahogy várható volt. Amennyiben csak az
`Employee` példányon módosítottunk, és a detached objektumot merge-öltem
vissza, sikerült, módosult az alkalmazott, és megmaradtak a
telefonszámok. Amennyiben azonban a telefonszámokhoz új telefonszámot
akartam felvenni, ugyanúgy kaptam a `LazyInitializationException`-t. Azaz
ugyanúgy nekünk kell gondoskodnunk a betöltésről, ahogy azt Hibernate
esetén megszokhattuk.

### Összegzés

Bár nem tűnik túl bonyolult témakörnek, a lazy loading kezelése okozott
számomra meglepetéseket. Az EclipseLink kicsit jobban elrejti ezt a
dolgot, ezért csak ezt a tulajdonságát figyelembe véve jobb választás
lehet. Azt azonban mindenképp javaslom, hogy ne hagyatkozzunk az
elképzeléseinkre, hogy hogyan történhet a betöltés, hanem mindig
állítsuk be azt, hogy a persistence provider írja ki az általa
lefuttatott SQL lekérdezéseket, és minden képernyőnél elemezzük azokat,
hogy nincs-e felesleges lekérdezés, vagy nem-e lehet úgy megfogalmazni a
JPA lekérdezést, hogy több SQL lekérdezés helyett csak egy fusson.

Egy másik
[posztban](/2011/02/21/ejb-es-jpa-developer-certified-expert.html) már
említett [Apress kiadó Pro JPA 2 Mastering the Java Persistence
API](http://apress.com/book/view/9781430219569) könyve elég részletesen
ír a lazy loading fogalmáról, de az implementációkat az sem hasonlítja
össze.
