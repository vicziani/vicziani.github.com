---
layout: post
title: JPA tömeges műveletek
date: '2009-05-07'
author: István Viczián
tags:
- Tesztelés
- Spring
- JPA
last_modified_at: '2026-06-11'
---

Utolsó módosítás dátuma: 2026. június 11.

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
path kifejezés áll (pl. `e.salary`), a jobb oldalán egy viszonylag
korlátozott kifejezés (literálra feloldható, egyszerű típusú értékre
feloldható kifejezés, függvény, változónév vagy paraméter).

Erre egy példa:

    UPDATE Employee e
    SET e.salary = e.salary + 10

A `SET` clause-ban látható path kifejezés mutatja, hogy nem
SQL-ről van szó, hanem az entitásokon dolgozó JPQL nyelvvel állunk
szemben, ahol megengedett az attribútumok láncolása.

Ehhez hasonlóan létezik a DELETE kifejezés is:

    DELETE FROM <entity name> [[AS] <identification variable>]
    [WHERE <conditional expression>]

Ennek külön érdekessége, hogy figyelembe veszi az öröklődést, tehát a
feltételnek megfelelő osztályok is törlésre kerülnek. Viszont nem veszi
figyelembe a kaszkádolást, szóval csak a kifejezésben szereplő, valamint
annak alosztályához tartozó típusú entitásokat fogja törölni a
kifejezés, nem töröl hozzájuk kapcsolódó objektumokat.

Spring Data JPA-val ezt `@Modifying` annotációval megjelölt
metódussal lehet futtatni.

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

{% include github-callout.html url="https://github.com/vicziani/jtechlog-jpa-bulk" %}

A teszt eset kódja:

```java
@SpringBootTest
public class EmployeesServiceIT {

    @Autowired
    private EmployeesService employeesService;

    @BeforeEach
    void setUp() {
        employeesService.deleteAll();
        employeesService.save(new Employee("John Doe", 100));
        employeesService.save(new Employee("Jack Doe", 200));
    }

    @Test
    @Transactional
    public void raiseSalaries() {
        employeesService.raiseSalaries(10);
        assertThat(employeesService.findAll())
                .extracting(Employee::getName, Employee::getSalary)
                .contains(
                        Tuple.tuple("John Doe", 110),
                        Tuple.tuple("Jack Doe", 210)
                        );
    }
}
```

Itt a `@Transactional` annotációt kell megfigyelni a teszteseten,
mely azt jelzi, hogy a teszteset lefuttatása után rollback kell.

A tesztelendő Spring Data JPA repository:

```java
public interface EmployeesRepository extends JpaRepository<Employee, Long> {

    @Transactional
    @Modifying
    @Query("""
        update Employee e
           set e.salary = e.salary + :amount
    """)
    int raiseSalary(@Param("amount") int amount);
}
```

Figyeljük meg, hogy rá kell tenni a `@Transactional` annotációt.

És a service:

```java
@Service
@RequiredArgsConstructor
public class EmployeesService {

    private final EmployeesRepository employeesRepository;

    public void save(Employee employee) {
        employeesRepository.save(employee);
    }

    public void deleteAll() {
        employeesRepository.deleteAll();
    }

    public void raiseSalaries(int amount) {
        employeesRepository.raiseSalary(amount);
    }

    public List<Employee> findAll() {
        return employeesRepository.findAll();
    }
}
```

És azt vettem észre, hogy az update műveletnek semmilyen hatása nem
volt, az assert elbukott.

A logban az látszik, hogy a végén lefut a `findAll()`-hoz az SQL.

```sql
select e1_0.id,e1_0.name,e1_0.salary from employee e1_0
```

Ennek megértéséhez kicsit meg kell ismerni a JPA működését. Amikor
ugyanis a teszt entitásokat létrehozzuk, az entitások a perzistence
context által menedzselt állapotba kerülnek, és a memóriában 
(persistence contextben) maradnak
addig, míg a tranzakció véget nem ér. A tömeges műveletek viszont
kizárólag a tábla tartalmát módosítják, nem foglalkoznak a már a memóriában
lévő objektumokkal. A `findAll()` a lekérdezést ugyan lefuttatja,
de az id alapján megnézi, hogy az entitás benne van-e a persistence context-ben.
Mivel már benne voltak, azokat adja vissza.
Ezért először létrejöttek a teszt entitások, majd az update
művelet módosította a tábla tartalmát, de az assert-nél ismét a
memóriában lévő, eredeti, nem módosított objektumokat kaptuk vissza.

Ezen anomália elkerülésére több megoldás is van. Egyrészt takaríthatjuk
a persistence contextet a bulk művelet után. Erre egy lehetőség a repository
módosítása.

```java
@Transactional
@Modifying(clearAutomatically = true, flushAutomatically = true)
@Query("""
        update Employee e
           set e.salary = e.salary + :amount
    """)
int raiseSalary(@Param("amount") int amount);
```

Hasonló az eredménye, ha közvetlenül meghívjuk az `EntityManager.clear()`
metódust, mely szintén törli a persistence context tartalmát.

Másik megoldás, hogy elérjük, hogy a kezdeti adatfeltöltés,
és a bulk update külön tranzakcióban legyen. Ezt úgy érhetjük el, hogy a 
kezdeti adatfeltöltést végző `setUp()` metóduson
kicseréljük a `@BeforeEach` annotációt a `@BeforeTransaction`
annotációra. (Vigyázat, a kettő együtt ne legyen rajta, mert akkor kétszer fut le.)

Így már le is fut a teszteset.

Itt arra is vigyázni kell, hogy a bulk műveletek elé nehogy bekeveredjen
olyan utasítás, mely berántja a persistence context-be az entitásokat.
Azaz a teszt metódus első sorába elhelyezett `employeesService.findAll();`
hívás esetén újra elbukik a teszt.

Ekkor azonban a
teszt eset végén a rollback az első tranzakciót nem görgette vissza,
így oda az elmélet, hogy olyan teszt esetet írok, mely érintetlenül
hagyja az adatbázis állapotát.

De pl. a [dbunit legjobb gyakorlatai
szerint](https://dbunit.github.io/dbunit-extension/bestpractices.html) ez nem is olyan nagy
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

Ezért a `setUp()` metódusnál visszacseréltem a `@BeforeEach` annotációt, 
és a tesztről levettem a `@Transactional` annotációt. Így az adatfeltöltések
külön tranzakciót indítanak, a teszteset nem indít tranzakciót, és a
bulk művelet is saját tranzakciót indít.

Személyes tapasztalatom alapján sok probléma van, ha a teszteset rollbackel,
így én mindig tranzakción kívül futtatom, és a teszteset készítse elő
az adatokat.