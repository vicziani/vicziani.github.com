---
layout: post
title: JPA tömeges műveletek
date: '2009-05-07T23:10:00.007+02:00'
author: István Viczián
tags:
- Tesztelés
- Spring
- JPA
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Történt a mai napon, hogy egy újabb felfedezést tettem a JPA tömeges
műveleteivel (bulk update and delete) kapcsolatban.

A JPA ugyanis lehetőséget biztosít egyszerre több entitás egyidejű
módosítására, ahelyett, hogy az összeset be kéne tölteni, és egyesével
módosítani. Ennek működése és szintaktikája hasonló az SQL UPDATE
műveletéhez, azzal a különbséggel, hogy itt nem csak egy táblán, hanem a
teljes entitáson lehet operálni. Formátuma a következő:

    UPDATE <entity name> [[AS] <identification variable>]
    SET <update statement> {, <update statement>}*
    [WHERE <conditional expression>]

Az update statement esetén az egyenlőségjel bal oldalán egy egyértékű
path kifejezés áll (pl. emp.salary), a jobb oldalán egy viszonylag
korlátozott kifejezés (literálra feloldható, egyszerű típusú értékre
feloldható kifejezés, függvény, változónév vagy paraméter).

Erre egy példa:

    UPDATE Employee e
    SET e.salary = 60000
    WHERE e.salary = 55000

A SET és WHERE kifejezésben látható path kifejezés mutatja, hogy nem
SQL-ről van szó, hanem annál objektumorientáltabb nyelvvel állunk
szemben, ahol megengedett az attribútumok láncolása.

Ehhez hasonlóan létezik a DELETE kifejezés is:

    DELETE FROM <entity name> [[AS] <identification variable>]
    [WHERE <conditional expression>]

Ennek külön érdekessége, hogy figyelembe veszi az öröklődést, tehát a
feltételnek megfelelő osztályok is törlésre kerülnek. Viszont nem veszi
figyelembe a kaszkádolást, szóval csak a kifejezésben szereplő, valamint
annak alosztályához tartozó típusú entitásokat fogja törölni a
kifejezés, nem töröl hozzájuk kapcsolódó objektumokat.

Ezek használatához a Query executeUpdate() metódusát kell meghívni.

Az egyik jelenlegi projektben próbálkozom egy kicsit a teszt vezérelt
fejlesztés (Test Driven Development - TDD) megközelítéssel, és gondoltam
olyan teszt eseteket használok, melyek függetlenek az adatbázis kezdő
állapotától, azaz először mindig inicializálom a tábla tartalmát, lefut
a teszt eset, majd hogy minden adat visszaálljon, végrehajtok egy
rollback műveletet. A problémák akkor adódtak, mikor egy tömeges
műveletet végrehajtó funkciót akartam tesztelni. A teszt a következőképp
nézett ki:

-   Új tranzakció indítása
-   Összes entitás törlése
-   Teszt entitások perzisztálása
-   Tömeges update műveletek végrehajtása
-   Assert - entitások visszatöltése, update ellenőrzése
-   Tranzakció rollback

A teszt eset kódja:

{% highlight java %}
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations={"/applicationContext.xml", "/applicationContext-persistence-tests.xml"})
@Transactional
public class EmployeeServiceTest {

@Before
public void before() {
 employeeService.deleteEmployees();
 // EntityManager.persist hívások a teszt entitások előállítására
}

@Test
@Rollback(true)
public void testBulkUpdates() {
 employeeService.doBulkUpdates();
 Assert.assertEquals(2, employeeService.listEmployees().size());
}
}
{% endhighlight %}

A tesztelendő kód:

{% highlight java %}
@Transactional
public class EmployeeServiceJpa implements EmployeeService {

public void deleteEmployees() {
 em.createQuery("DELETE Employee e").executeUpdate();
}

public List listEmployees() {
 return em.createQuery("SELECT e FROM Employee e").getResultList();
}

public void doBulkUpdates() {
 em.createQuery("UPDATE Employee e SET e.salary = e.salary + 100").executeUpdate();
}

}
{% endhighlight %}

És azt vettem észre, hogy az update műveletnek semmilyen hatása nem
volt, az assert elbukott.

Ennek megértéséhez kicsit meg kell ismerni a JPA működését. Amikor
ugyanis a teszt entitásokat létrehozzuk, az entitások a perzistence
context által menedzselt állapotba kerülnek, és a memóriában maradnak
addig, míg a tranzakció véget nem ér. A tömeges műveletek viszont
kizárólag a tábla tartalmát módosítják, nem foglalkoznak a memóriában
már lévő objektumokkal. A lekérdezések ismét megnézik, hogy az adott
objektum a memóriában van-e, és ha igen, nem az adatbázisból töltik be
azokat. Ezért először létrejöttek a teszt entitások, majd az update
művelet módosította a tábla tartalmát, de az assert-nél ismét a
memóriában lévő, eredeti, nem módosított objektumokat kaptuk vissza.
Commit esetében még rosszabb lenne a helyzet, ugyanis ilyenkor az
adatbázisban is a memóriában lévő, persist-tel elmentett eredeti
objektumok kerülnének, amit nem módosított az update.

Ennek elkerülésére a javasolt megoldás, hogy egy új tranzakciót kell
nyitni a tömeges műveletek kezelésére, azaz a metódust el kell látni a
REQUIRES\_NEW tranzakciós tulajdonsággal, ami azt jelenti, hogy az
eredeti tranzakciót felfüggeszti, és minden esetben új tranzakciót fog
nyitni. Amennyiben ebben a metódusban hívunk a tömeges műveletek
elvégzése után EntityManager.find(Class entityClass, Object primaryKey)
metódust vagy egyéb lekérdezést, és az így visszakapott entitásokat
módosítjuk, nem lesz baj, hiszen a betöltés adatbázisból fog történni,
hiszen a tömeges műveletek előtt nem került semmi az adatbázisba. Szóval
csak arra kell figyelni, hogy ne a tömeges művelet előtt végezzünk
módosítást. Ha mégis így tennénk, az entitáson hívjuk meg az
EntityManager.refresh(Object entity) metódust, hogy az adatbázisból az
adatokat szinkronizálja vissza a memóriába.

No ezen felbátorodva el is helyeztem a REQUIRES\_NEW tranzakciós
tulajdonságot a metódusra, és azonnal deadlock lett belőle. Hiszen
indítottam egy tranzakciót, mely törölte az egyedeket, illetve újakat
perzisztált, majd indítottam egy másik tranzakciót, mely ugyanezen
egyedeken végzett volna műveleteket. Ezáltal oda jutottam, hogy az
összes entitás törlését, valamint a teszt entitások perzisztálását végző
tranzakciónak le kell zárulnia, mire az tömeges műveleteket futtató
metódus új tranzakciót nyitna. Ezt szerencsére egy JUnit 4
@BeforeTransaction annotációval el lehetett intézni. Ekkor azonban a
művelet végén jelzett rollback az első tranzakciót nem görgette vissza,
így oda az elmélet, hogy olyan teszt esetet írok, mely érintetlenül
hagyja az adatbázis állapotát.

De pl. a [dbunit legjobb gyakorlatai
szerint](http://www.dbunit.org/bestpractices.html) ez nem is olyan nagy
baj. A következőket állítja:

-   Minden fejlesztőnek legyen saját adatbázisa (nem feltétlenül a saját
    gépén). Ez a párhuzamos tesztelés miatt fontos.
-   Nem kell a teszt adatokat eltávolítani: a jó teszt induláskor úgyis
    beállítja a megkívánt adatbázis tartalmat, így nem kell eltávolítani
    a teszt futásának eredményét. Néha különösen jól jön az adatbázis
    tartalmának vizsgálata, ha elbukik a teszt.
-   Érdemes kisebb adathalmazokkal dolgozni
-   Érdemes nem minden teszt előtt inicializálni az adatokat, hanem több
    teszt előtt egyszer. Ilyenkor persze oda kell figyelni, hogy a teszt
    esetek ne módosítsák az adatokat.

Ekkor persze megmaradtak a teszt adatok, melyeket a következő teszt
futtatáskor ki kellett törölni. A baj ott kezdődött, hogy egy entitás
saját magára mutatott (self reference), így nem lehetett a törlést
végrehajtani, mert megszorítás megsértést (constraint violation) jelzett
az adatbázis. Más entitással való kapcsolatnál is ugyanez a helyzet,
hiszen a tömeges törlés nem kaszkádolt. Erre egy kerülő megoldást kell
alkalmazni, miszerint első körben meg kell szüntetni a kapcsolatokat
(kapcsoló mezők null-ra állítása update művelettel), majd második körben
lehetett a törlést elvégezni.

Így még mindig nem volt felhőtlen az öröm, a ugyanis az assert még
mindig elbukott. Ez ezért történt, mert a teszt nyitott egy tranzakciót,
ebben inicializált az adatbázist, majd lezárta a tranzakciót. Ismért
nyitott egy tranzakciót, amit azonnal fel is függesztett a REQUIRES\_NEW
miatt, elvégezte a tömeges műveletet, lezárta a későbbi tranzakciót, de
az első tranzakció még érvényben maradt, így itt még nem látszódtak a
második tranzakció módosításai. Ezért az assert-nél futó lekérdezés nem
látta a módosításokat. Ezt kétféleképpen lehet feloldani. Vagy nem
tranzakcióban indítjuk a teszt esetet. Másik megoldás, hogy a
lekérdezéseket nem tranzakcióban futtatjuk. Ez teljesítményszempontból
is jó.

A teszt eset javítása:

{% highlight java %}
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations={"/applicationContext.xml", "/applicationContext-persistence-tests.xml"})
@Transactional
public class EmployeeServiceTest {

@BeforeTransaction
public void before() {
 employeeService.deleteEmployees();
 // EntityManager.persist hívások a teszt entitások előállítására
}

@Test
public void testBulkUpdates() {
 employeeService.doBulkUpdates();
 Assert.assertEquals(2, employeeService.listEmployees().size());
}
}
{% endhighlight %}

A tesztelendő kód javítása:

{% highlight java %}
@Transactional
public class EmployeeServiceJpa implements EmployeeService {

public void deleteEmployees() {
 em.createQuery("DELETE Employee e").executeUpdate();
}

@Transactional(propagation=Propagation.NOT_SUPPORTED)
public List listEmployees() {
 return em.createQuery("SELECT e FROM Employee e").getResultList();
}

@Transactional(propagation=Propagation.REQUIRES_NEW)
public void doBulkUpdates() {
 em.createQuery("UPDATE Employee e SET e.salary = e.salary + 100").executeUpdate();
}

}
{% endhighlight %}

Tanulság, hogy mielőtt tömeges műveleteket kezdünk el használni, nagyon
értsük meg annak működését, egyrészt a memória cache, másrészt a
tranzakciók szempontjából.
