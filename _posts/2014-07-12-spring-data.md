---
layout: post
title: Spring Data
date: '2014-07-12T16:22:00.000+02:00'
author: István Viczián
tags:
- Spring
- JPA
modified_time: '2024-01-16T10:00:00.000+01:00'
description: Repository réteg létrehozása Spring Data használatával.
---

Frissítve: 2024. január 16.

Használt technológiák: Spring Data 3.2.1

Be kell vallanom, első körben meglehetősen szkeptikus voltam a Spring
Data projekttel kapcsolatban, és nem hittem, hogy bármi pluszt képes
nyújtani a Spring JPA integrációjához képest, de kipróbálva hamar
kiderült, hogy hasznos lenne alkalmazni. Amennyiben a projektedben
találsz olyan (absztrakt) ősosztály(oka)t, melyek feladata tipikus CRUD
műveletek végrehajtása, esetleg típusbiztosan, hogy ne kelljen azokat
újra implementálni, akkor a Spring Data neked is tetszeni fog.

A poszthoz egyszerű
[példaprojektet](https://github.com/vicziani/jtechlog-spring-data) is
találsz a GitHub-on, valamint egy
[prezentációt](http://www.jtechlog.hu/artifacts/2014-06_spring_data/2014-06_spring_data.html),
amit nyugodtan felhasználhatsz arra, hogy meggyőzz másokat is.

A Spring Data alapvetően egy Spring Frameworkre épülő projekt, és segít
abban, hogy egyszerűbben implementálhassuk alkalmazásaink perzisztens
rétegét. Egy olyan projekt, mely több projektet is tartalmaz, ugyanis
különböző perzisztens technológiákra implementálták, úgymint JPA, JDBC,
REST, de olyan NoSQL megoldásokra is van implementációja, mint a MongoDB,
Neo4j, Redis, Hadoop, stb.

A Spring szóhasználatban *repository*-k megvalósítására való, és tipikus
CRUD műveleteket lehet definiálni, ráadásul az olyan gyakori igények
figyelembe vételével, mint a rendezés vagy a lapozás.

Az érdekessége, hogy egyszerűbb esetben nem nekünk kell implementálni a
metódusokat. Nekünk elég az interfészben különböző névkonvenciók alapján
definiálni a metódusokat, és a Spring Data implementálja azokat. A
leggyakoribb metódusokat még definiálni sem kell, elég interfészünknek
valamely már létező interfészből leszármaznia. Amennyiben azonban nem
elegendő a Spring Data tudása, természetesen mi is implementálhatunk
saját metódusokat.

A Spring Data projekt része a Spring Data JPA, mely a már meglévő Spring
JPA integrációra épül rá. 

Először definiáljuk a Spring Data JPA függőséget.

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
```

Eztán elegendő az interfészt definiálni. Leszármazhat a `Repository`
interfészből, de mivel ennek nincs semmilyen előre definiált metódusa,
használjuk inkább a `JpaRepository` interfészt ősnek, ami többek között a következő
metódusokat is definiálja: `save(Employee)`, `saveAll(Iterable<Employee>)`,
`findOne(Long)`, `exists(Long)`, `findAll()`, `findAllById(Iterable<Long>)`,
`count()`, `deleteById(Long)`, `delete(Employee)`, `deleteAll()`.

Interfészünk tehát:

```java
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
}
```

Eztán már azonnal használatba is vehetjük, hiszen ahogy említettem az
implementációt a Spring Data JPA fogja elkészíteni. Tehát a teszt eset:

```java
@Test
void findAll_shouldReturnAll() {
    employeeRepository.save(new Employee("John Doe"));

    assertThat(employeeRepository.findAll())
            .extracting(Employee::getName)
            .containsExactly("John Doe");
}
```

Ehhez új metódusokat adhatunk hozzá, melyhez a
[névkonvenció](https://docs.spring.io/spring-data/jpa/reference/jpa/query-methods.html)
alapján automatikusan implementációt fog gyártani a Spring Data JPA.

```java
Iterable<Employee> findByNameStartingWith(String namePrefix);
```

Amennyiben ez nem megfelelő, saját JPA query-t is definiálhatunk, a
`@Query` annotáció használatával.

```java
@Query("select e from Employee e where length(e.name) = :nameLength")
Iterable<Employee> findByNameLength(@Param("nameLength") int nameLength);
```

Amennyiben egy metódushoz saját implementációt akarunk rendelni, akkor a
metódust egy külön interfészbe definiáljuk, ami szintén őse legyen a
repository interfészünknek, és adjuk meg hozzá az implementációt is a
klasszikus JPA módon.

Saját interfész:

```java
public interface EmployeeRepositoryCustom {

    List<Employee> findByNameStartingWithAsList(String namePrefix);
}
```

Saját implementációnál arra kell figyelni, hogy a neve a repository 
interfész neve az `Impl` posztfixszel, azaz `EmployeeRepository`
interfész esetén `EmployeeRepositoryImpl`.

```java
public class EmployeeRepositoryImpl implements EmployeeRepositoryCustom {

    @Autowired
    private EntityManager entityManager;

    @Override
    public List<Employee> findByNameStartingWithAsList(String namePrefix) {
        return entityManager
            .createQuery(
                "select e from Employee e where e.name like :namePrefix", 
                Employee.class)
            .setParameter("namePrefix", namePrefix + "%").getResultList();
    }
}
```

És a repository interfész:

```java
public interface EmployeeRepository 
    extends CrudRepository<Employee, Long>, EmployeeRepositoryCustom {
        // ...
}
```

Ha rendezni akarunk, akkor definiálhatjuk a metódus nevében:

```java
List<Employee> findByNameStartingWithOrderByNameAsc(String namePrefix);
```

Vagy ha ennél dinamikusabb megoldás akarunk, akkor használjuk a `Sort`
típust paraméterként.

```java
List<Employee> findByNameStartingWith(String namePrefix, Sort sort);
```

Mely így használható:

```java
employeeRepository.findByNameStartingWith("J", 
    Sort.by(new Sort.Order(Sort.Direction.ASC, "name")))
```

Ha lapozást is akarunk, akkor a `Pageable` használandó:

```java
Page<Employee> findByNameStartingWith(String namePrefix, Pageable page);
```

Melyet a következő módon tudunk hívni:

```java
Page page = employeeRepository.findByNameStartingWith("J", 
    PageRequest.by(3, 3, new Sort(new Sort.Order(Sort.Direction.ASC, "name"))));
```

A `Page` tartalmazza a lekérdezés eredményét, és a lapozáshoz szükséges
többi információt is.

Látható, hogy a Spring Data használata rendkívül egyszerű, sok
boilerplate kódtól szabadulhatunk meg. Nekem az is tetszik, hogy így
metódusainknak szabványos nevet adhatunk meg. Fokozatosan lehet
bevezetni a projektjeinkbe, akár repository-nként állhatunk át, és az egyre
bonyolultabb funkcióit is folyamatosan vehetjük használatba.
