---
layout: post
title: Spring Data JPA és forráskód generálás
date: "2026-07-12"
author: Viczián István
description: A Spring Data JPA repository-khoz AOT lehet forráskódot generálni.
tags:
- Java
- Spring
- DevOps
image: /artifacts/posts/spring-data-jpa-aot/og.png
---

A Spring Data JPA 4.0.0 verziójában jelent meg az a lehetőség, hogy a
repository interface-ekhez AOT-vel implementációt is lehet generálni.

Az AOT (Ahead-Of-Time) egy olyan mechanizmus, mellyel
a framework a korábban futási időben (runtime) elvégzett elemzések és konfigurációk egy részét build időben elvégzi, és optimalizált kódot generál. Ez különösen hasznos natív alkalmazásoknál, ugyanis
a natív fordításnak vannak korlátai különösen a reflection területén, és az AOT-val reflection
nélküli kód generálható.

Azonban az AOT JVM-en futó bájtkód esetén is csökkentheti az indulási időt, hiszen futás időben már
az alkalmazásnak nem kell bizonyos műveleteket elvégeznie, másrészt a reflection egy erőforrásigényes
művelet, és az AOT pont ennek használatát szünteti meg. Emiatt a memóriahasználat is csökkenhet.

Sőt Spring Data JPA esetén használatával már a repository-k nem lesznek fekete dobozok, hanem a forráskódját is
meg lehet nézni, valamint akár breakpointot is el lehet helyezni, és debuggolni.

{% include github-callout.html url="https://github.com/vicziani/jtechlog-spring-data-jpa-aop" %}

<!-- more -->

Ahhoz, hogy lefusson az AOT, adjuk ki kell adni a következő Maven parancsot.

```shell
mvnw -Pnative package
```

Ekkor le fog futni a `spring-boot-maven-plugin` plugin `process-aot` goalja. Ez el fogja indítani
az alkalmazást. A logban megjelenik, hogy a Spring Data JPA talált egy repository interface-t.

```
Finished Spring Data repository scanning in 53 ms. Found 1 JPA repository interface.
```

Ekkor megjelenik a következő fájl: `target/spring-aot/main/sources/employees/EmployeesRepositoryImpl__AotRepository.java`.

Az eredeti repository a következő:

```java
public interface EmployeesRepository extends JpaRepository<Employee, Long> {

    @Query("select new employees.EmployeeResource(e.id, e.name) from Employee e")
    List<EmployeeResource> findAllResources();
}
```

A generált forráskód:

```java
@Generated
public class EmployeesRepositoryImpl__AotRepository extends AotRepositoryFragmentSupport {
  private final RepositoryFactoryBeanSupport.FragmentCreationContext context;

  private final EntityManager entityManager;

  public EmployeesRepositoryImpl__AotRepository(EntityManager entityManager,
      RepositoryFactoryBeanSupport.FragmentCreationContext context) {
    super(QueryEnhancerSelector.DEFAULT_SELECTOR, context);
    this.entityManager = entityManager;
    this.context = context;
  }

  public List<EmployeeResource> findAllResources() {
    String queryString = "select new employees.EmployeeResource(e.id, e.name) from Employee e";
    Query query = this.entityManager.createQuery(queryString);

    return (List<EmployeeResource>) convertMany(query.getResultList(), false, EmployeeResource.class);
  }
}
```

Túl sok meglepetés nincs benne. Talán jól demonstrálja, amit a Clean Code állít, hogy a boolean típusú
paraméter mennyire nem olvasható. A `convertMany()` függvény második paramétere azt határozza meg,
hogy a query nem native query.

Ha ezek után el akarjuk indítani az alkalmazást, és breakpointot is szeretnék a generált kódban elhelyezni,
akkor a generált könyvtárat fel kell venni IDEA-ban "Generated Sources Root"-ként. Ehhez jobb
klikk a könytáron, _Mark Directory As > Mark Generated Sources Root_.

Utána elhelyezhető a breakpoint.

Futtatásnál meg kell mondani, hogy használja az AOT-t. Ehhez a JVM paraméterek közé fel kell venni
a következőt (IDEA esetén a Run/Debug Configuration alatt).

```
-Dspring.aot.enabled=true
```

Ekkor indíthatjuk az alkalmazást debug módban.

Az indítás során a log elején valami ilyesmi látható:

```
Starting AOT-processed EmployeesApplication using Java 26.0.1 with PID 42628
```

Valamint el kell tűnnie annak az üzenetnek, hogy a Spring Data JPA talált egy interface-t.

Utána mehet az alkalmazás felé a kérés, pl. az `employees.http` fájlból.

Ekkor meg is áll a végrehajtás a breakpointtal jelölt utasításban.

Amit még érdemes megnézni, az a stacktrace, melyből kiemelem az érdekes sorokat:

```
at employees.EmployeesRepositoryImpl__AotRepository.findAllResources(EmployeesRepositoryImpl__AotRepository.java:32)
at java.lang.invoke.DirectMethodHandle$Holder.invokeVirtual(DirectMethodHandle$Holder:-1)
...
at org.springframework.aop.framework.JdkDynamicAopProxy.invoke(JdkDynamicAopProxy.java:222)
at jdk.proxy2.$Proxy136.findAllResources(Unknown Source:-1)
at employees.EmployeesService.listEmployees(EmployeesService.java:17)
...
```

Ebből az látszik, hogy a Spring ekkor is generált egy dynamic proxy-t az
`EmployeesRepository` interface-hez, azonban ez a hívást a generált 
`EmployeesRepositoryImpl__AotRepository` osztálynak delegálja.
