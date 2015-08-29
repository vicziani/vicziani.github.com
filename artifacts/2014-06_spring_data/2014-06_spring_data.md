class: inverse, center, middle

# Spring Data

2014\. július

.card[
* .card-img[![Viczián István](belyegkep.png)]
* Viczián István
* Java fejlesztő
* @vicziani at Twitter
* http://jtechlog.hu
]

---
# Spring Data

* Egyszerűbbé teszi a perzisztens réteg implementálását
* Több alprojektet tartalmaz, melyek különböző technológiákra épülnek, mint pl. JPA, JDBC, REST, MongoDB, Neo4j, Redis, Hadoop, stb.
* Tipikusan CRUD műveletek támogatására, olyan gyakori igények megvalósításával, mint a rendezés és a lapozás
* Interfészek definiálása CRUD műveleteket definiáló interfészek kiterjesztésével
* Egyszerűbb esetben implementáció nem szükséges, Spring Data implementál
* Saját műveletekkel is kiegészíthető a konvenciók követésével
* Ismétlődő fejlesztési feladatok redukálása, *boilerplate* kódok csökkentése

---

# Spring Data JPA

* Spring Data része
* Meglévő Spring és JPA infrastruktúrára épül
* Saját JPQL lekérdezések is megadhatóak annotációban
* Saját implementáció is megadható
* XML és JavaConfig támogatás

---

# Meglévő JPA architektúrára épül

* `DataSource`
* `EntityManagerFactory`
* `TransactionManager`
* JPA entitások `@Entity` annotációkkal

---

# Példa projekt

* Elérhető a https://github.com/vicziani/jtechlog-spring-data címen
* Maven projekt, `mvn package` paranccsal buildelhető, teszt esetek futtatásával
* Spring, JPA (Hibernate provider)
* Spring konfiguráció: `src/main/resources/applicationContext.xml`
* Entitás: `src/main/java/jtechlog/springdata/Employee`
* HSQLDB embedded adatbázis
* JUnit integrációs teszt esetek, Hamcrest asserttel

---

# Maven függőség

```xml
<dependency>
    <groupId>org.springframework.data</groupId>
    <artifactId>spring-data-jpa</artifactId>
    <version>1.6.0.RELEASE</version>
</dependency>
```

---

# Konfiguráció

Application context xml-ben:

```xml
<jpa:repositories base-package="jtechlog.springdata" />
```

JavaConfig-ban:

```java
@EnableJpaRepositories
```

---

# Repository

* `Repository` interfész metódusok nélkül
* `CrudRepository` CRUD metódusokkal

```java
import org.springframework.data.repository.CrudRepository;

public interface EmployeeRepository extends CrudRepository<Employee, Long> {
}
```
A következő metódusokat definiálja: `save(Employee)`, `save(Iterable<Employee>)`, `findOne(Long)`, `exists(Long)`, `findAll()`, `findAll(Iterable<Long>)`, `count()`, `delete(Long)`, `delete(Employee)`, `deleteAll()`

Példa teszt eset:

```java
@Test
public void testSave_findAllShouldReturnOne() {
    employeeRepository.save(new Employee("John Doe"));

    assertThat(employeeRepository.findAll(), 
        contains(hasName(equalTo("John Doe"))));
}
```

---

# Query methods

* Prefixek:  `find…By`, `read…By`, `query…By`, `count…By`, és `get…By`
* Kulcsszavak: http://docs.spring.io/spring-data/jpa/docs/1.6.0.RELEASE/reference/html/jpa.repositories.html#jpa.query-methods.query-creation

```java
Iterable<Employee> findByNameStartingWith(String namePrefix);
```

---

# Metódus definiálása JPA query-vel

Query annotáció használatával

```java
@Query("select e from Employee e where length(e.name) = :nameLength")
Iterable<Employee> findByNameLength(@Param("nameLength") int nameLength);
```

---

# Custom implementation

Saját interfész:

```java
public interface EmployeeRepositoryCustom {

    List<Employee> findByNameStartingWithAsList(String namePrefix);
}
```

Saját implementáció:

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

---

# Custom implementation

Interfész kiterjessze az új interfészt is:

```java
public interface EmployeeRepository 
    extends CrudRepository<Employee, Long>, EmployeeRepositoryCustom {
        // ...
}
```

---

# Rendezés

`OrderBy` postfix használatával:

```java
Iterable<Employee> findByNameStartingWithOrderByNameAsc(String namePrefix);
```

`Sort` példány használatával

```java
Iterable<Employee> findByNameStartingWith(String namePrefix, Sort sort);
```

```java
employeeRepository.findByNameStartingWith("J", 
    new Sort(new Sort.Order(Sort.Direction.ASC, "name")))
```

---

# Lapozás

`Pageable` példány használatával

```java
Page<Employee> findByNameStartingWith(String namePrefix, Pageable page);
```

Figyeld a `Page` típusú visszatérési értéket!

```java
Page page = employeeRepository.findByNameStartingWith("J", 
    new PageRequest(3, 3, new Sort(new Sort.Order(Sort.Direction.ASC, "name"))));
```

Vagy `PagingAndSortingRepository` interfész kiterjesztése

---

# Továbbiak

* Spring MVC támogatás
* Transzparens auditáció
* Querydsl
