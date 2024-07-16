---
layout: post
title: Bevezetés a Testcontainers használatába Spring Boot alkalmazásban
date: '2024-07-16T10:00:00.000+02:00'
author: István Viczián
description: Megjelent az első videóm, mely arról szól, hogyan lehet használni a Testcontainers-t Spring Boot alkalmazásban.
---

Megjelent az első videóm, melynek témája, hogy hogyan lehet használni a Testcontainers-t Spring Boot alkalmazásban.

<iframe width="854" height="480" src="https://www.youtube.com/embed/p7oy3VCGBbo?si=ya31H8N8AlXAFXRp" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

A videóhoz a forráskód is elérhető a [GitHubon](https://github.com/vicziani/jtechlog-testcontainers).

Ha valaki mégis a szöveges tartalomhoz ragaszkodik, olvasson tovább.

<!-- more -->

Integrációs tesztek, vagy fejlesztés közben az alkalmazás futtatásakor
gyakran szükség van adatbázisra, vagy más háttérszolgáltatásra, mint pl.
cachere vagy message brokerre. Használhatjuk
a saját számítógépünkön lévőt, azonban ennek
telepítése, frissítése körülményes lehet, különösen akkor,
ha esetleg egyszerre két különböző verzióját szeretnénk 
használni. Relációs adatbázis esetén használhatunk
pl. in-memory H2 adatbázist, ezzel azonban
kompatibilitiási problémák merülhetnek fel.
A virtualizáció, majd a konténerizáció ezen sokat segített.

A Testcontainers használatával a háttérszolgáltatásokat tartalmazó konténereket kódban tudjuk definiálni,
és kezeli ezek életciklusát, azaz a megfelelő időben elindítja és leállítja őket.

![Testcontainers](/artifacts/posts/2024-07-16-testcontainers/testcontainers-testcontainers.drawio.svg)

A Spring Boot a 3.1-es verziótól kezdve különösképp támogatja a Testcontainers használatát.
Nem egyedülálló módon, a Quarkusban is megjelenik Dev Services néven.

Az integrációs tesztek esetén a PostgreSQL konténer tehát Testcontainers
segítségével indítható.

Ehhez először fel kell venni a `spring-boot-testcontainers` és
`postgresql` függőséget a `pom.xml` fájlban.

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-testcontainers</artifactId>
    <scope>test</scope>
</dependency>

<dependency>
    <groupId>org.testcontainers</groupId>
    <artifactId>postgresql</artifactId>
    <scope>test</scope>
</dependency>
```

Valamint azért, hogy a konfiguráció és az elindított konténerek is újrafelhasználhatóak legyenek
a tesztesetek között, a Testcontainers konfigurációját érdemes kiszervezni egy `TestcontainersConfiguration`
osztályba. El kell látni a `@TestConfiguration` annotációval, valamint létrehozni egy `PostgreSQLContainer`
típusú beant. Konstruktor paraméterben az image nevét várja, a reprodukálhatóság miatt érdemes pontos verziószámot használni.

Itt egyéb műveleteket is el lehet végezni, pl. környezeti váltózót beállítani, parancsot futtatni, vagy fájlt másolni.

```java
@TestConfiguration(proxyBeanMethods = false)
public class TestcontainersConfiguration {

    @Bean
    @ServiceConnection
    PostgreSQLContainer<?> postgresContainer() {
        return new PostgreSQLContainer<>("postgres:16.3");
    }

}
```

El kell látni a `@ServiceConnection` annotációval. Ekkor ugyanis létrejön egy `ConnectionDetails`, 
itt egy `JdbcConnectionDetails` példány, mely tartalmazza a kapcsolódási paramétereket, mint
pl. a konténer portja, mivel ezt a Testcontainers random határozza meg. Ez felülírja
az `application.properties` fájlban lévő értékeket.

Az osztályt az integrációs tesztben az `@Import` annotációval lehet behivatkozni.

```java
@Import(TestcontainersConfiguration.class)
```

A teszt futtatásakor a logban látható, hogy elindít egy konténert, és a _Service_ fülön is látszik egy Postgres és egy másik konténer. 
(Ez utóbbi szabadítja fel a teszt futtatása után az erőforrásokat.) A teszt után eltűnnek a konténerek.

Két teszteset fut le, és mindkettő ugyanazt a konténert használja. Ugyanezt a konfigurációt importáló másik teszt osztályokban
lévő tesztesetek is ugyanezt a konténert használnák.

A Spring Initializr is hasonló kódot generál, ha felvesszük a függőségek közé a Testconatiners-t. 

De itt van még egy test application is. Ugyanis a teszt ágra is felvehető egy `main` metódussal rendelkező osztály, mely szintén megkapja a
Testcontainers konfigurációt, így ha elindítjuk, vele elindul az adatbázis is.

```java
public class TestEmployeesApplication {

    public static void main(String[] args) {
        SpringApplication.from(EmployeesApplication::main).with(TestcontainersConfiguration.class).run(args);
    }
}
```

A Services fülön látható a futó konténer, valamint a http fájlból kéréseket indíthatunk az alkalmazás
felé (`POST`, `GET`).

Ha leállítjuk az alkalmazást, eltűnik a konténer.

Ezt használva, az alkalmazás Git clone után elindítható egy olyan gépen is, ahol csak egy JDK és egy Docker van telepítve.

```shell
mvnw spring-boot:test-run
```

Hiszen a Maven Wrapper letölti a Mavent, ha szükséges, a Testcontainers pedig elindítja a szükséges konténereket.