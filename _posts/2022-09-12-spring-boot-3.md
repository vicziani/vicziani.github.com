---
layout: post
title: Mi várható a Spring Boot 3-ban?
date: '2022-09-13T10:00:00.000+02:00'
author: István Viczián
description: Részletes bemutatása annak, hogy mi is várható a Spring Boot 3-as verziójában.
---

## Bevezetés

Mivel a hétvégén megkaptam, hogy írjak már Javas cikkeket, így ebben a posztban
a Spring Boot 3 újdonságait veszem sorra. A Spring Boot 3-as sorozat már a Spring
Framework 6-os sorozatára építkezik, ennek újdonságait nem fogom külön tárgyalni. 
A poszt megírásának a pillanatában a legfrissebb verzió a 3.0.0-M4, és mivel
erőteljesen fejlesztés alatt van, még változhat, érdemes visszanézni, 
fogom majd frissíteni a posztot. 

Általános megfigyelésem, hogy az új fejlesztéseket
még nem dokumentálták megfelelően, így sokmindent a [Release Notesokból](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-3.0-Release-Notes), GitHub issue-kból 
és a forráskódból kellett összeszedni.

Az említendő változások a következő területeket érintik:

* Alapkövetelmény a Java 17
* Jakarta EE 9 függőségek
* Problem Details
* Tracing
* Natív futtatható fájl elkészítése

<!-- more -->

## RFC 7807 - Problem Details

Ami számomra a legrelevánsabb, hogy a Spring Boot 3 már támogatja a 
RFC 7807 szabványt, mely meghatározza, hogy hiba esetén milyen 
formátumban kell a hibát jelezni.

REST webszolgáltatások esetén azt láthatjuk, hogy mindegyik API
másképp jelzi a hibát, erre próbál a szabvány valamilyen egységes
formátumot definiálni.

A Spring pl. a következő hibát adja exception esetén, mely nem követi 
a szabványt.

```json
{
  "timestamp": "2022-09-13T17:13:17.033+00:00",
  "status": 404,
  "error": "Not Found",
  "path": "/api/employees/100"
}
```

Vannak erre külön libraryk, pl. a [Zalando Problem](https://github.com/zalando/problem),
és ennek Spring illesztése a [Problems for Spring MVC and Spring WebFlux](https://github.com/zalando/problem-spring-web). Azonban a 3-as verziótól kezdve a Spring Boot beépítve támogatja.

A példaprojekt elérhető a [GitHubon](https://github.com/vicziani/jtechlog-employees-sb3).

Alapesetben a Spring Boot még mindig az előző hibát adja vissza, azonban a `ProblemDetail`
osztály használatával már tudunk ezen változtatni, hiszen ez reprezentálja a visszaadott hibát.
Ha egy `@RequestMapping` vagy `@ExceptionHandler` metódusból ezzel térünk vissza, máris a 
megfelelő hibát kapjuk. Használható a `ErrorResponse` interfész is, mely a státuszkódot és a http fejléceket is
tartalmazza.

```java
@ControllerAdvice
public class EmployeesExceptionHandler {

    @ExceptionHandler
    public ProblemDetail handle(EmployeeNotFoundException exception) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, exception.getMessage());
    }

}
```

Ekkor a visszakapott hiba a következő.

```json
{
  "type": "about:blank",
  "title": "Not Found",
  "status": 404,
  "detail": "employee not found",
  "instance": "/api/employees/100"
}
```

Ebben az esetben a `Content-Type` fejléc értékének `application/problem+json` értéket kéne felvennie,
ezt azonban az [issue alapján](https://github.com/spring-projects/spring-framework/issues/28189)
az M5-ben javítják.

Kivételek esetén le lehet származni a `ErrorResponseException` osztályból, azonban
én nem szeretem, ha az üzleti rétegben szereplő exceptionnek van REST-re hivatkozása.
Ezek leszármazottját a `ResponseEntityExceptionHandler` kezeli, melyből szintén le
tudunk származni.

A Bean Validation validációs hiba esetén a `MethodArgumentNotValidException` kivételt dobja,
mely implementálja a `ErrorResponse` interfészt, azonban nem mondja meg, hogy milyen mezőkkel
van probléma. Ezen a következő kóddal segíthetünk.

```java
@Data
@AllArgsConstructor
public class Violation {

    private String name;

    private String message;
}
```

```java
@ControllerAdvice
public class EmployeesExceptionHandler {

    @ExceptionHandler
    public ProblemDetail handle(MethodArgumentNotValidException exception) {
        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, "Constraint Violation");
        List<Violation> violations = exception.getBindingResult().getFieldErrors().stream()
                .map((FieldError fe) -> new Violation(fe.getField(), fe.getDefaultMessage()))
                .collect(Collectors.toList());
        problemDetail.setProperty("violations", violations);
        return problemDetail;
    }

}
```

Azaz manuálisan konvertáljuk át a hibákat `List<Violation>` példánnyá. Ekkor a következő
hibát kapjuk.

```json
{
  "type": "about:blank",
  "title": "Bad Request",
  "status": 400,
  "detail": "Constraint Violation",
  "instance": "/api/employees",
  "violations": [
    {
      "name": "name",
      "message": "Name can not be blank"
    }
  ]
}
```

## Java 17 és Jakarta EE 9

Itt túl sok érdekesség nincs, nyilvánvalóan kihaszálhatjuk az új nyelvi elemeket,
és a Java EE API-k újdonságait. Annyi változás van, hogy változnak a csomagnevek,
a példa alkalmazásban a következőket kellett pl. módosítani:

```java
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.persistence.*;
```

Azaz a Bean Validationt és a JPA-t érintette, de ide tartoznak a Servlet API
osztályai is (`javax.` csomagneveket kell `jakarta.` csomagnévre cserélni).

## Tracing

A distributed tracingről már írtam [egy előző posztban](/2021/10/04/mdc-trace.html).
Spring Boot esetén a  [Spring Cloud Sleuth projektet](https://spring.io/projects/spring-cloud-sleuth)
kellett használni.

A Spring Boot 3-nak viszont már szerves része lesz. Eddig is használta a Micrometert,
de csak metrikák publikálásához. Azonban megjelent a [Micrometer Tracing](https://micrometer.io/docs/tracing).
A Micrometer eddig is egy olyan library volt, mely a különböző metrikákat gyűjtő eszközök
elől elrejtette a különbséget. Úgy is nevezte magát, hogy a metrikáknak a Micrometer olyan,
mint az SLF4J a naplózó keretrendszernek. Hiszen támogat majdnem húsz metrikákat gyűjtő
eszközt, pl. Elastic, Graphite, Prometheus, stb. 

A Micrometer Tracing a következő tracer library-kat támogatja: OpenZipkin Brave és OpenTelemetry.
Ezek kezelik az adatokat és küldik valamelyik exporter/reporter felé, ami pedig továbbküldi valamilyen
külső rendszernek.

Az exporter/reporter implementációk közül a következők vannak:

* Zipkin felé Brave-vel
* OpenTelemetry által támogatott implementációk felé, a Zipkinnek ez is tud küldeni
* Tanzu Observability by Wavefront felé

A Spring Cloud Sleuth pedig meg fog szűnni, hiszen a magja átkerült a Micrometer Tracing projektbe, ezért
hosszabb távon már nem érdemes építeni rá.

A példaprojekt elérhető a [GitHubon](https://github.com/vicziani/jtechlog-mmt).

A példaprojektben Zipkint választottam, melyet a legegyszerúbb Dockerben elindítani.

```shell
docker run -d -p 9411:9411 --name zipkin openzipkin/zipkin
```

A projektben a Brave implementációt választottam, amihez a következő függőségeket kellett felvenni:

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>

<dependency>
  <groupId>io.micrometer</groupId>
  <artifactId>micrometer-tracing-bridge-brave</artifactId>
</dependency>

<dependency>
  <groupId>io.zipkin.reporter2</groupId>
  <artifactId>zipkin-reporter-brave</artifactId>
</dependency>

<dependency>
  <groupId>io.zipkin.reporter2</groupId>
  <artifactId>zipkin-sender-urlconnection</artifactId>
</dependency>
```

Az utolsó függőséggel ki lehet választani, hogy a Zipkinnel hogyan vegye fel
a kapcsolatot, én az `UrlConnection` mellett döntöttem, mely a JDK osztálykönyvtár
része.

Az `application.properties`-ben még kellett állítgatni:


```properties
management.tracing.enabled=true
management.tracing.sampling.probability=1.0
management.zipkin.tracing.connect-timeout=5s
```

Az elsővel a tracing kerül bekapcsolásra. A másodikkal megmondjuk, hogy minden
kérés legyen rögzítve, mert az alapbeállítás `0.1`, azaz minden tizedik. A harmadik azért
kellett, mert néha timeoutolt a Zipkin kapcsolat, és ezért eldobott spaneket.

Egy span létrehozása a következő kódrészlettel történhet:

```java
Observation observation = Observation.start("controller.hello", observationRegistry);
  try (Observation.Scope scope = observation.openScope()) {
    return helloService.hello();
  }
  catch (Exception exception) {
    observation.error(exception);
    throw exception;
  }
  finally {
    observation.stop();
  }
```

Ez a következőképp fog kinézni a Zipkinben (feltételezve, hogy a service-ben is van egy `service.hello` span):

<a href="/artifacts/posts/images/zipkin_sb.png" data-lightbox="post-images">![Kép leírása](/artifacts/posts/images/zipkin_sb_750.png)</a>

Találtam egy `@Observed` annotációt is mellyel mindezt deklaratív módon lehetne megadni, de nem találtam meg, hogy Spring Boot alatt mi dolgozza fel.

Természetesen az lenne a legjobb, ha ezt nem nekem kéne elindítanom, hanem pl. a beérkező http requesteknél
valami automatikusan indít egy spant. Erre ott a `io.zipkin.brave:brave-instrumentation-spring-webmvc` projekt,
ami még `javax.servlet` hivatkozásokat tartalmaz, azaz Spring Boot 3-mal még nem működik.

Az is jó lenne, ha a trace id és a span id automatikusan megjelenne a logban is. Erre is ott a `io.zipkin.brave:brave-context-slf4j` projekt, de szintén nem sikerült belőni. [Nyitott issue](https://github.com/spring-projects/spring-boot/issues/31468) van róla.

Szóval látszik, hogy ez a terület még erőteljes fejlesztés alatt áll, és dokumentáció alig. [Issue van](https://github.com/spring-projects/spring-boot/issues/30658) a dokumentáció fejlesztésére.

Az is látszik a GitHub issue-kat olvasgatva, hogy itt nagyon sok library együttes fejlesztését kell megoldani. Pl.
a Micrometer is az egyik verzióban a `2.0.0-M1` volt behúzva, a Spring Boot 3.0.0-M4-ben visszaléptek a 1.10.0-M3
verzióra.

# Natív futtatható fájl

Úgy látszik, hogy a fejlesztők legtöbb erőforrását ennek a támogatása viszi el. Itt a GraalVM integrációról van szó.
Az elmúlt 20 év munkáját kell most átgondolni, hiszen eddig a Java alkalmazásokkal kapcsolatban az volt az elvárás,
hogy azért, hogy gyorsan szolgálják ki a felhasználókat, nem baj, ha lassabban indulnak. Manapság a cloud és a lambda (serverless)
megoldások elterjedésével azonban a processznek gyorsan kéne elindulnia. Az viszont csak natív binárissal képzelhető el.

A Spring Framework és Spring Boot következő verziójában ez [kiemelten hangsúlyos](https://spring.io/blog/2021/12/09/new-aot-engine-brings-spring-native-to-the-next-level).

A fordítás a következő lépésekből áll:

* Forráskód fordítása
* Ahead-Of-Time Engine, mely a bájtkód elemzésével előkészíti a natív fordítást
* Natív fordítás

Ez az AOT eddig külön plugin volt, most viszont bekerül a Spring Bootba.

A natív fordítást a (Bellsoft Liberica Native Image Kit (NIK))[https://bell-sw.com/pages/liberica-native-image-kit/]
végzi, mely a GraalVM-re és Liberica JDK-ra épít.

A példaprojekt elérhető a [GitHubon](https://github.com/vicziani/jtechlog-employees-sb2-native).
Az alkalmazás MariaDB adatbázist használ és REST-en CRUD műveleteket biztosít.

A Spring Native aktuális stabil verziója (0.12.1) a 
Spring Boot 2.7.1 verzióját támogatja, azért még a Spring Boot 2-es sorozattal próbáltam ki.

Ehhez kellett a Spring Native függőség:

```xml
<dependency>
  <groupId>org.springframework.experimental</groupId>
  <artifactId>spring-native</artifactId>
  <version>0.12.1</version>
</dependency>
```

Valamint az AOT plugin.


```xml
<plugin>
  <groupId>org.springframework.experimental</groupId>
  <artifactId>spring-aot-maven-plugin</artifactId>
  <version>0.12.1</version>
  <executions>
    <execution>
      <id>generate</id>
      <goals>
        <goal>generate</goal>
      </goals>
    </execution>
    <execution>
      <id>test-generate</id>
      <goals>
        <goal>test-generate</goal>
      </goals>
    </execution>
  </executions>
</plugin>
```

Valamint a [Paketo Buildpacks](https://paketo.io/) konfiguráció. 
Ez képes Docker image-t előállítani a forráskódból. Ezért szükséges, hogy
legyen Docker feltelepítve. Viszont mivel a build is Docker konténerben
történik (builder image/container), másra nincs szükség.

```xml
<plugin>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-maven-plugin</artifactId>
  <configuration>
    <image>
      <builder>paketobuildpacks/builder:tiny</builder>
      <env>
        <BP_NATIVE_IMAGE>true</BP_NATIVE_IMAGE>
      </env>
    </image>
  </configuration>
</plugin>
```

A Spring Native csak a Spring repo-jából tölthető le.


```xml
<repositories>
    <repository>
        <id>spring-milestones</id>
        <name>Spring Milestones</name>
        <url>https://repo.spring.io/milestone</url>
        <snapshots>
            <enabled>false</enabled>
        </snapshots>
    </repository>

    <repository>
        <id>spring-release</id>
        <name>Spring release</name>
        <url>https://repo.spring.io/release</url>
        <snapshots>
            <enabled>false</enabled>
        </snapshots>
    </repository>

</repositories>
<pluginRepositories>
    <pluginRepository>
        <id>spring-release</id>
        <name>Spring release</name>
        <url>https://repo.spring.io/release</url>
    </pluginRepository>

    <pluginRepository>
        <id>spring-milestones</id>
        <name>Spring Milestones</name>
        <url>https://repo.spring.io/milestone</url>
        <snapshots>
            <enabled>false</enabled>
        </snapshots>
    </pluginRepository>
</pluginRepositories>
```

Eztán már csak a `mvn spring-boot:build-image` parancsot kell kiadni. Ez az én gépemen 14 percig futott.

Utána a következő parancsokat kell kiadni.

```shell
docker network create employees-net
docker run -d -e MARIADB_DATABASE=employees -e MARIADB_USER=employees -e MARIADB_PASSWORD=employees -e MARIADB_ALLOW_EMPTY_ROOT_PASSWORD=yes -p 3306:3306 --name e2-mariadb --network employees-net mariadb
docker run 
docker run -p 8080:8080 -eSPRING_DATASOURCE_URL=jdbc:mariadb://e2-mariadb/employees -e SPRING_DATASOURCE_USERNAME=employees -e SPRING_DATASOURCE_PASSWORD=employees --network employees-net jtechlog-employees-sb2:0.0.1-SNAPSHOT
```

De azt hiszem, hogy az indulás ideje kárpótol ezért. Az alkalmazást letesztelve tökéletesen működik.
Természetesen az image mérete és a memóriafelhasználás is kevesebb.

<a href="/artifacts/posts/images/spring-boot-native.png" data-lightbox="post-images">![Kép leírása](/artifacts/posts/images/spring-boot-native_750.png)</a>

Azaz 0,2 másodperc!

Megpróbáltam a 3-as sorozattal is, ehhez csak a `spring-boot-maven-plugin`-t kellett konfigurálni, azonban a következő hibát kaptam.

```
Fatal error: com.oracle.graal.pointsto.util.AnalysisError$ParsingError: Error encountered while parsing sun.font.PhysicalStrike.<clinit>()
```
