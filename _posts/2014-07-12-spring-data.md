---
layout: post
title: Spring Data
date: '2014-07-12T16:22:00.000+02:00'
author: István Viczián
tags:
- Spring
- JPA
modified_time: '2014-09-17T22:28:11.266+02:00'
blogger_id: tag:blogger.com,1999:blog-7370998606556338092.post-2322684734980758092
blogger_orig_url: http://www.jtechlog.hu/2014/07/spring-data.html
---

Használt technológiák: Spring Data 1.6

Be kell vallanom, első körben meglehetősen szkeptikus voltam a Spring
Data projekttel kapcsolatban, és nem hittem, hogy bármi pluszt képes
nyújtani a Spring JPA integrációjához képest, de kipróbálva hamar
kiderült, hogy hasznos lenne alkalmazni. Amennyiben a projektedben
találsz olyan (absztrakt) ősosztály(oka)t, melyek feladata tipikus CRUD
műveletek végrehajtása, esetleg típus biztosan, hogy ne kelljen azokat
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
REST, de olyan NoSQL megoldásokra is van implementációja, mint MongoDB,
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
JPA integrációra épül rá. Ugyanúgy deklarálnunk kell a `DataSource`-t,
`EntityManagerFactory`-t, `TransactionManager`-t és a JPA annotációkkal
ellátott entitásokat. Eztán a következőket kell elvégeznünk. Maven
használata esetén először definiáljuk a Spring Data JPA függőséget.

{% highlight xml %}
<dependency>
    <groupId>org.springframework.data</groupId>
    <artifactId>spring-data-jpa</artifactId>
    <version>1.6.0.RELEASE</version>
</dependency>
{% endhighlight %}

Amennyiben ez megvan, az application config xml állományban definiáljuk,
hogy mely csomagban találhatóak a repository-k. (Természetesen lehetőség
van Java Configban való megadásra is az `@EnableJpaRepositories`
annotáció használatával.)

{% highlight xml %}
<jpa:repositories base-package="jtechlog.springdata" />
{% endhighlight %}

Eztán elegendő az interfészt definiálni. Leszármazhat a `Repository`
interfészből, de mivel ennek nincs semmilyen előre definiált metódusa,
használjuk inkább a `CrudRepository` interfészt ősnek, ami a következő
metódusokat definiálja: `save(Employee)`, `save(Iterable<Employee>)`,
`findOne(Long)`, `exists(Long)`, `findAll()`, `findAll(Iterable<Long>)`,
`count()`, `delete(Long)`, `delete(Employee)`, `deleteAll()`.

Interfészünk tehát:

{% highlight java %}
import org.springframework.data.repository.CrudRepository;

public interface EmployeeRepository extends CrudRepository<Employee, Long> {
}
{% endhighlight %}

Eztán már azonnal használatba is vehetjük, hiszen ahogy említettem az
implementációt a Spring Data JPA fogja elkészíteni. Tehát a teszt eset:

{% highlight java %}
@Test
public void testSave_findAllShouldReturnOne() {
    employeeRepository.save(new Employee("John Doe"));

    assertThat(employeeRepository.findAll(), 
        contains(hasName(equalTo("John Doe"))));
}
{% endhighlight %}

Ehhez új metódusokat adhatunk hozzá, melyhez a
[névkonvenció](http://docs.spring.io/spring-data/jpa/docs/1.6.0.RELEASE/reference/html/jpa.repositories.html#jpa.query-methods.query-creation)
alapján automatikusan implementációt fog gyártani a Spring Data JPA.

{% highlight java %}
Iterable<Employee> findByNameStartingWith(String namePrefix);
{% endhighlight %}

Amennyiben ez nem megfelelő, saját JPA query-t is definiálhatunk, a
`@Query` annotáció használatával.

{% highlight java %}
@Query("select e from Employee e where length(e.name) = :nameLength")
Iterable<Employee> findByNameLength(@Param("nameLength") int nameLength);
{% endhighlight %}

Amennyiben egy metódushoz saját implementációt akarunk rendelni, akkor a
metódust egy külön interfészbe definiáljuk, ami szintén őse legyen a
repository interfészünknek, és adjuk meg hozzá az implementációt is a
klasszikus JPA módon.

Saját interfész:

{% highlight java %}
public interface EmployeeRepositoryCustom {

    List<Employee> findByNameStartingWithAsList(String namePrefix);
}
{% endhighlight %}

Saját implementációnál arra kell figyelni, hogy a neve a repository 
interfész neve az `Impl` posztfixszel, azaz `EmployeeRepository`
interfész esetén `EmployeeRepositoryImpl`.

{% highlight java %}
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
{% endhighlight %}

És a repository interfész:

{% highlight java %}
public interface EmployeeRepository 
    extends CrudRepository<Employee, Long>, EmployeeRepositoryCustom {
        // ...
}
{% endhighlight %}

Ha rendezni akarunk, akkor definiálhatjuk a metódus nevében:

{% highlight java %}
Iterable<Employee> findByNameStartingWithOrderByNameAsc(String namePrefix);
{% endhighlight %}

Vagy ha ennél dinamikusabb megoldás akarunk, akkor használjuk a `Sort`
típust paraméterként.

{% highlight java %}
Iterable<Employee> findByNameStartingWith(String namePrefix, Sort sort);
{% endhighlight %}

Mely így használható:

{% highlight java %}
employeeRepository.findByNameStartingWith("J", 
    new Sort(new Sort.Order(Sort.Direction.ASC, "name")))
{% endhighlight %}

Ha lapozást is akarunk, akkor a `Pageable` használandó:

{% highlight java %}
Page<Employee> findByNameStartingWith(String namePrefix, Pageable page);
{% endhighlight %}

Melyet a következő módon tudunk hívni:

{% highlight java %}
Page page = employeeRepository.findByNameStartingWith("J", 
    new PageRequest(3, 3, new Sort(new Sort.Order(Sort.Direction.ASC, "name"))));
{% endhighlight %}

A `Page` tartalmazza a lekérdezés eredményét, és a lapozáshoz szükséges
többi információt is.

Látható, hogy a Spring Data használata rendkívül egyszerű, sok
boilerplate kódtól szabadulhatunk meg. Nekem az is tetszik, hogy így
metódusainknak szabványos nevet adhatunk meg. Fokozatosan lehet
bevezetni a projektjeinkbe, akár DAO-nként állhatunk át, és az egyre
bonyolultabb funkcióit is folyamatosan vehetjük használatba.
