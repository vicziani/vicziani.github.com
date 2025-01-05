---
layout: post
title: Spring Data JPA és a Blaze-Persistence
date: '2025-01-05T10:00:00.000+01:00'
author: István Viczián
description: Poszt arról, hogy milyen korlátai vannak a JPA-nak, és ezen hogy segít a Spring Data JPA, és mit ad hozzá a Blaze-Persistence.
---

## Bevezetés

A JPA, új nevén Jakarta Persistence egy szabvány, mely relációs adatbázisok elérését teszi lehetővő, object-relational mapping (ORM) használatával. Ennek különböző implementációi vannak, talán a legelterjedtebb a Hibernate. A Jakarta Persistence-re épül a Spring Data JPA, ami a repository mintát valósítja meg, valamint újabb lehetőségeket is az a JPA-hoz.

A JPA azonban nem fejlődik olyan dinamikusan, valamint több megszorítás, illetve kényelmetlenség is van benne. 

Kényelmetlen a Criteria API használata, valamint korlátozott a DTO-k kezelése.
Valamint nem támogat olyan hatékony SQL megoldásokat, mint a Window Functions vagy a Common Table Expression (CTE).

Ezeken egyrészt próbál segíteni a konkrét implementáció, mint pl. a Hibernate. (Ekkor persze elszakadunk a szabványtól.)
Valamint a Spring Data JPA-val is több problémát próbál orvosolni. Vagy választhatjuk a mindkét előbbi technológiához jól illeszkedő Blaze-Persistence-t is kiegészítésül, mely további lehetőségeket rejt.

A példa alkalmazás forráskódja megtalálható a [GitHubon](https://github.com/vicziani/jtechlog-blaze).

<!-- more -->

## Dinamikus lekérdezések

Amennyiben egy lekérdezést futásidőben akarunk összeállítani, a JPA Criteria API-t használhatjuk.

A Criteria API-val összeállított lekérdezéshez egy vele ekvivalens JPQL kifejezés is megfeleltethető.

A következő kód egy egyszerű példa, mely a paraméterül megadott fizetésnél nagyobb fizetésű alkalmazottakat listázza.

```java
public List<Employee> findAllSalaryGreaterThan(long minSalary) {
        var builder = em.getCriteriaBuilder();
        var criteriaQuery = builder.createQuery(Employee.class);
        var root = criteriaQuery.from(Employee.class);
        criteriaQuery
                .select(root)
                .where(builder.greaterThan(root.get("salary"), minSalary));
        return em.createQuery(criteriaQuery).getResultList();
    }
```

Az így előállított kód a következő JPQL kifejezésnek felel meg:

```plain
select e from Employee e where e.salary > :salary
```

Látható, hogy a kód nem teljesen típusbiztos, hiszen ha a `salary` attribútum neve
változik, módosítani kell egy stringet is.

Ezt úgy lehet kikerülni, hogy a fordítási időben az entitások alapján ún. metamodelt lehet generálni,
melyben az attribútumnevek konstansként jelennek meg. Így ha változik, nem fog lefordulni. Ennek generálásához
Maven esetén a `org.hibernate:hibernate-jpamodelgen` plugint használhatjuk, és a kód így változik:

```java
root.get(Employee_.salary)
```

Az `_` (aláhúzásjel) karakter nem elírás, ezzel a névvel generálja a metamodel osztályokat a plugin.

A Spring Data JPA a Criteria API használatát is megkönnyíti az ún. [Specifications](https://docs.spring.io/spring-data/jpa/reference/jpa/specifications.html) használatával. Ekkor a repository-nak ki kell terjesztenie
a `JpaSpecificationExecutor` interfészt, melyben van egy `findAll(Specification<T> spec)` metódus is.
Valamint írhatunk olyan metódusokat, melyek `Specification` példányt adnak vissza.

```java
public static Specification<Employee> salaryGreaterThan(long minSalary) {
        return (root, query, cb) ->
                cb.greaterThan(root.get(Employee_.salary), minSalary);
    }
```

Használata:

```java
var employees = employeeRepository.findAll(salaryGreaterThan(100_000));
```

## Blaze-Persistence bevezetése, és a criteria query

A Blaze-Persistence használatával olvashatóbb módon tudunk dinamikus lekérdezéseket írni.
Ehhez először fel kell venni a következő függőségeket:

```xml
<dependency>
    <groupId>com.blazebit</groupId>
    <artifactId>blaze-persistence-integration-spring-data-3.3</artifactId>
    <version>${blaze-persistence.version}</version>
</dependency>

<dependency>
    <groupId>com.blazebit</groupId>
    <artifactId>blaze-persistence-integration-hibernate-6.2</artifactId>
    <version>${blaze-persistence.version}</version>
</dependency>
```

Ezután kell egy konfigurációs osztály:

```java
@Configuration(proxyBeanMethods = false)
@EnableEntityViews(basePackageClasses = EmployeesApplication.class)
@EnableBlazeRepositories(basePackageClasses = EmployeeViewRepository.class)
public class BlazePersistenceConfiguration {

    @PersistenceUnit
    private EntityManagerFactory entityManagerFactory;

    @Bean
    public CriteriaBuilderFactory criteriaBuilderFactory() {
        CriteriaBuilderConfiguration config = Criteria.getDefault();
        return config.createCriteriaBuilderFactory(entityManagerFactory);
    }

    @Bean
    public EntityViewManager entityViewManager(CriteriaBuilderFactory cbf, EntityViewConfiguration entityViewConfiguration) {
        return entityViewConfiguration.createEntityViewManager(cbf);
    }

}
```

Ez már több megoldást is előkészít, pl. a repository-knak, valamint az Entity View-knak a használatát.

A lekérdezést a következőképp lehet megírni Blaze-Persistence `CriteriaBuilderFactory` használatával, mely olvashatóbb,
mint a Criteria API használata.

```java
return factory.create(em, Employee.class, "e")
                .where("e.salary")
                .gt(salary)
                .getResultList();
```

## DTO-k használata

Lekérdezéskor sokszor tapasztalom, hogy először entitásokat kérdezzük le, és azokat alakítjuk át már Javaban DTO-kká. Az entitások azonban az állapot módosításakor megfelelőek, lekérdezéskor nem hatékonyak.

Ennek a megoldásnak több hátránya is van:

* Feleslegesen kerülnek az entitások példányosításra
* Több adatot kérdezünk le, mint amire szükség van
* Java oldalon kell konvertálni az entitás és a DTO között

A JPA használatával is lehet közvetlenül DTO-t lekérdezni, az ún. projection query használatával.

```plain
select new training.employees.dtos.EmployeeDto(e.id, e.name) from Employee e
```

Abban az esetben, ha másik DTO-t akarunk használni, újabb lekérdezést kell írnunk.

```plain
select new training.employees.dtos.EmployeeWithSalaryDto(e.id, e.name, e.salary) from Employee e
```

Hatalmas előnye, hogy csak azokat a mezőket kéri le az adatbázisból, melyekre tényleg szükség van, és nincs szükség további konverziókra.

Azonban hátránya, hogy a perzisztens rétegnek tudnia, hogy mi kell a felületnek. Valamint annyi lekérdezést kell írnunk, ahány DTO-nk van. Új DTO felvételekor újabb lekérdezést kell írni.

Azonban a Spring Data JPA-ban van ún. [Dynamic Projection](https://docs.spring.io/spring-data/jpa/reference/repositories/projections.html#projection.dynamic), ahol mi adhatjuk meg, hogy milyen DTO-t kérünk vissza, és ennek megfelelően
generálja ki a lekérdezést.

```java
<T> List<T> findAllBySalaryGreaterThan(long salary, Class<T> clazz);
```

És ez a következőképp hívható:

```java
List<EmployeeDto> employees = employeeRepository.findAllBySalaryGreaterThan(100_000, EmployeeDto.class);
List<EmployeeWithSalaryDto> employeesWithSalary = employeeRepository.findAllBySalaryGreaterThan(100_000, EmployeeWithSalaryDto.class);
```

Azaz paraméterként átadható a DTO. És csak a megfelelő mezőket kéri le.

## Blaze-Persistence - Entity View Module

A Blaze-Persistence a DTO-kat nagyon hatékonyan kezeli, és helyesen nem DTO-knak, hanem view-knak nevezi. Érdekes, hogy a DTO-k is interfészek. Valamint támogatja a repository mintát is, azaz szintén elegendő interfészt deklarálni, az implementációt maga a Blaze-Persistence készíti el.

A view:

```java
@EntityView(Employee.class)
public interface EmployeeView {

    Long getId();

    String getName();

}
```

Repository:

```java
@Repository
public interface EmployeeViewRepository extends EntityViewRepository<EmployeeView, Long> {
}
```

Használata:

```java
var employees = employeeViewRepository.findAll();
```

Elegendő más visszatérési értéket definiálnunk, és máris más DTO-val tér vissza:

```java
List<EmployeeWithSalaryView> findAllWithSalary();
```

A Spring Data JPA-hoz hasonlóan itt is tudunk olyan metódusokat írni, ahol megadhatjuk paraméterként, hogy milyen DTO-t
várunk vissza.

```java
<T> List<T> findAll(Class<T> clazz);
```

Hívása:

```java
List<EmployeeWithSalaryView> employees = employeeViewRepository.findAll(EmployeeWithSalaryView.class);
```

## Blaze-Persistence módosítás view-val

Érdekes módon a Blaze-Persistence használatakor a view-val nem csak lekérdezni, hanem módosítani is tudunk.

Létrehozáshoz kell egy `CreatableEntityView`.

```java
@CreatableEntityView
@EntityView(Employee.class)
public interface CreateEmployeeCommandView {

    @IdMapping
    Long getId();

    void setName(String name);

    String getName();
}
```

Látható, hogy itt van setter is.

Metódus:

```java
CreateEmployeeCommandView save(CreateEmployeeCommandView commandView);
```

És maga a mentés:

```java
var createCommand = entityViewManager.create(CreateEmployeeCommandView.class);
createCommand.setName("John Test");
employeeViewRepository.save(createCommand);
```

Módosításhoz `UpdatableEntityView` kell:

```java
@EntityView(Employee.class)
@UpdatableEntityView
@CreatableEntityView
public interface UpdateEmployeeCommandView {

    @IdMapping
    Long getId();

    void setName(String name);

    String getName();

}
```

Metódus:

```java
UpdateEmployeeCommandView save(UpdateEmployeeCommandView commandView);
```

És a módosítás:

```java
var updateCommand = employeeViewRepository.findUpdateCommandById(id);
updateCommand.setName("John Test 2");
employeeViewRepository.save(updateCommand);
```

## Blaze-Persistence lapozás

A Blaze-Persistence támogat nagy adatmennyiség esetén egy hatékonyabb lapozást, az ún. keyset alapú lapozást.
Ekkor sokkal hatékonyabban lehet lekérni az aktuális előtti és utáni lapot. Ezt úgy oldja meg, hogy az aktuális
lapnak elmenti az első és utolsó elemét, és utána ezt fel tudja használni az előző vagy következő lap lekérésekor.

A lekérdezés:

```java
public PagedList<Employee> findAll(KeysetPage keysetPage, int offset, int limit) {
        return factory.create(em, Employee.class, "e")
                .orderByAsc("e.name")
                .orderByAsc("e.id")
                .page(keysetPage, offset, limit)
                .getResultList();
    }
```

Tehát rendezés a név és az azonosító alapján van. Átadható egy `KeysetPage`, az első index és hogy maximum mennyi rekordot adhat vissza.

Generálunk alkalmazottakat, rendre `John Doe 000`, `John Doe 001`, `John Doe 002`, stb. Először `null` paraméterrel hívjuk meg
a metódust.

```java
var employees = employeeBlazeDao.findAll(null, 0, 10);
```

Ekkor a visszakapott alkalmazottak: `John Doe 000` - `John Doe 009`.

A visszaadott `PagedList` tartalmazza a legkisebb és legnagyobb értéket is.

```java
System.out.println(Arrays.toString(employees.getKeysetPage().getLowest().getTuple()));
System.out.println(Arrays.toString(employees.getKeysetPage().getHighest().getTuple()));
```

Ekkor a következőt írja ki:

```plain
[John Doe 000, 533]
[John Doe 009, 542]
```

A rendezés miatt a tömbben az első elem a név, utána az azonosító.

Majd a következő hívás:

```java
employees = employeeBlazeDao.findAll(employees.getKeysetPage(), 10, 10);
```

Azaz a 10. elemtől kérünk le még 10 elemet.

Itt az SQL lekérdezést és a paramétereket érdemes megvizsgálni:

```plain
select e1_0.id,e1_0.department,e1_0.name,e1_0.salary,e1_0.year_of_birth,(select count(*) from employees e2_0) from employees e1_0 where ((e1_0.name>? or e1_0.name is null) or (e1_0.name=? and e1_0.id>?)) order by e1_0.name,e1_0.id offset ? rows fetch first ? rows only

binding parameter (1:VARCHAR) <- [John Doe 009]
binding parameter (2:VARCHAR) <- [John Doe 009]
binding parameter (3:BIGINT) <- [542]
binding parameter (4:INTEGER) <- [0]
binding parameter (5:INTEGER) <- [10]
```

Látható, hogy az előző oldal utolsó elemét bevette a lekérdezésbe, és a 0. elemtől kér vissza 10 elemet.

## Window function

Az SQL Window Function egy hatékony eszköz adatbázisokban, amely lehetővé
teszi, hogy rekordcsoportok felett számításokat végezzünk anélkül, hogy azokat
aggregálnánk, azaz az eredeti sorokat érintetlenül hagyjuk.

Használható a következőkre:

* Rangsorolás és sorrend
* Futó összesítések
* Mozgó átlagok és csúszó ablak számítások
* Előző és következő értékek kinyerése
* Adatcsoportok részleges összesítése
* Arányok és százalékok kiszámítása

A Window Function a JPA-ban nem támogatott, ígéret szerint a következő verzióban bevezetésre kerül. Azonban a Hibernate
használatakor a JPQL lekérdezésekben használható Window Function (, akkor ha nem kapcsoljuk be azt, hogy csak standard JPQL
lekérdezéseket fogadjon el).

A következő lekérdezés pl. azt adja vissza, hogy egy alkalmazott a szervezeti egységén belül az szervezeti egységenkénti összes fizetés hány százalékát kapja.

```plain
select new training.employeesblaze.dtos.EmployeeSalaryPercent(
e.name,
e.department,
sum(e.salary) over (partition by e.department),
e.salary / sum(e.salary) over (partition by e.department) * 100
)
from Employee e
```

Vegyük a következő fizetéseket:

```plain
    Név      Fizetés   Szervezeti egység  
 ---------- --------- ------------------- 
  John Doe   200_000   IT                 
  Jack Doe   200_000   SALES              
  Jane Doe   100_000   SALES              
```

Ekkor John az IT fizetések 100%-át, Jack a SALES fizetések 66%-át és Jane a 33%-át viszi haza.

A generált SQL lekérdezés:

```sql
select e1_0.name,e1_0.department,sum(e1_0.salary) over(partition by e1_0.department),((e1_0.salary/sum(e1_0.salary) over(partition by e1_0.department))*100) from employees e1_0
```

A lekérdezés eredménye:

```plain
    name     department    sum           ?column?         
 ---------- ------------ -------- ----------------------- 
  John Doe   IT           200000                     100  
  Jack Doe   SALES        300000   66.666666666666666667  
  Jane Doe   SALES        300000   33.333333333333333333  
```

A Blaze-Persistence is támogatja a Window function használatát.

```java
@SneakyThrows
public List<EmployeeSalaryPercent> findEmployeeSalaryPercent() {
    return factory.create(em, Tuple.class)
            .from(Employee.class, "e")
            .window("x").partitionBy("e.department").end()
            .selectNew(EmployeeSalaryPercent.class.getConstructor(String.class, Employee.Department.class, long.class, long.class))
            .with("e.name")
            .with("e.department")
            .with("sum(e.salary) over (x)", "salarySum")
            .with("e.salary / sum(e.salary) over (x) * 100", "salaryPercent")
            .end()
            .getResultList()
            ;
}
```

## Common table expressions

Az SQL CTE (Common Table Expression) egy ideiglenes nevesített lekérdezés, amelyet más lekérdezésekben lehet használni, mintha az egy ideiglenes táblaként vagy nézettként működne. A CTE-k segítségével olvashatóbbak és karbantarthatóbbak az SQL lekérdezések, különösen, ha összetett műveletet kell végrehajtani, például rekurziót vagy több összekapcsolt al-lekérdezést.

Ugyanúgy a JPA ugyan nem támogatja, de a Hibernate igen.

Egy példa JPA lekérdezés:

```plain
with data as (
            select e.department as department, sum(e.salary) as sumSalary from Employee e group by e.department      
        )
        select new training.employeesblaze.dtos.SummaryByDepartment(d.department, d.sumSalary) from data d order by d.department desc
```

Ahol `data` néven létrehozunk egy lekérdezést, melyre a következő select lekérdezésben hivatkozunk.

A következő SQL lekérdezést generálja le a Hibernate:

```sql
 with data (department,sumSalary) as (select e1_0.department,sum(e1_0.salary) from employees e1_0 group by e1_0.department) select d1_0.department,d1_0.sumSalary from data d1_0 order by d1_0.department desc
```

A Blaze-Persistence is támogatja a Common table expressions használatát.

Ehhez kell egy CTE entity.


```java
@Entity
@CTE
@Getter @Setter
public class DepartmentCte {

    @Id
    @Enumerated(EnumType.STRING)
    private Employee.Department department;

    private long sumSalary;
}
```

Amit utána használhatunk a criteria query-ben.

```java
@SneakyThrows
@Transactional(readOnly = true)
public List<SummaryByDepartment> findSummaryByDepartment() {
    return factory.create(em, DepartmentCte.class)
            .with(DepartmentCte.class)
            .from(Employee.class, "e")
            .bind("department").select("e.department")
            .bind("sumSalary").select("sum(e.salary)")
            .end()
            .orderByAsc("department")
            .selectNew(SummaryByDepartment.class.getConstructor(Employee.Department.class, long.class))
            .with("department")
            .with("sumSalary")
            .end().getResultList();

}
```