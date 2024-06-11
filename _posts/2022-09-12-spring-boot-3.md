---
layout: post
title: Spring Boot 3 újdonságai
date: '2022-09-13T10:00:00.000+02:00'
modified_time: '2023-10-03T10:00:00.000+02:00'
author: István Viczián
description: A Spring Boot 3-as verziójának újdonságainak a bemutatása.
---

Frissítés: 2023. október 3.

## Bevezetés

Mivel a hétvégén megkaptam, hogy írjak már Javas cikkeket, így ebben a posztban
a Spring Boot 3 újdonságait veszem sorra. A Spring Boot 3-as sorozat már a Spring
Framework 6-os sorozatára építkezik, ennek újdonságait nem fogom külön tárgyalni. 
A poszt megírásának a pillanatában a legfrissebb verzió a 3.1.4. 

Az említendő változások a következő területeket érintik:

* Alapkövetelmény a Java 17
* Jakarta EE 9 függőségek
* Problem Details
* Tracing
* Natív futtatható fájl elkészítése

<!-- more -->

## RFC 7807 - Problem Details

Ami számomra a legrelevánsabb, hogy a Spring Boot 3 már támogatja a 
[RFC 7807 szabványt](https://datatracker.ietf.org/doc/html/rfc7807), mely meghatározza, hogy hiba esetén milyen 
formátumban kell a hibát jelezni.

REST webszolgáltatások esetén azt láthatjuk, hogy mindegyik API
másképp jelzi a hibát, erre próbál a szabvány valamilyen egységes
formátumot definiálni.

A Spring pl. a következő hibát adja ha az URL-ben szöveget adunk át ott, ahol számot vár.
Ez a Spring saját hibaformátuma, mely nem követi a szabványt.

```json
{
  "timestamp": "2023-10-03T11:30:03.538+00:00",
  "status": 400,
  "error": "Bad Request",
  "path": "/api/employees/foo"
}
```

Vannak erre külön libraryk, pl. a [Zalando Problem](https://github.com/zalando/problem),
és ennek Spring illesztése a [Problems for Spring MVC and Spring WebFlux](https://github.com/zalando/problem-spring-web). 
Azonban a Spring Boot 3-as verziótól kezdve ezekre nincs szükség, ugyanis a Problem Details szabványt a Spring Boot beépítve támogatja.

A példaprojekt elérhető a [GitHubon](https://github.com/vicziani/jtechlog-employees-sb3). MariaDB adatbázist használ és REST-en CRUD műveleteket biztosít.

Abban az esetben, ha az `application.properties` állományban felvesszük a 
`spring.mvc.problemdetails.enabled = true` értéket, akkor a következő
hibát kapjuk.

```json
{
  "type": "about:blank",
  "title": "Bad Request",
  "status": 400,
  "detail": "Failed to convert 'id' with value: 'foo'",
  "instance": "/api/employees/foo"
}
```

Itt a headerben a `Content-Type` értéke `application/problem+json`, így a válasz megfelel a szabványnak.
A Problem Details bekapcsoláskor a `ResponseEntityExceptionHandler` aktiválódik, mely több kivételt is kezel,
pl. a fent létrejött `MethodArgumentTypeMismatchException` kivételt. Amennyiben szeretnénk
ezt személyre szabni, vagy kiegészíteni, akkor létrehozhatunk egy leszármazottat. 

Saját kivétel esetén is megadhatjuk, hogy mi legyen a törzs tartalma, ehhez a `ProblemDetail`
osztályt kell használni, hiszen ez reprezentálja a visszaadott hibát.
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

Kivételek esetén le lehet származni a `ErrorResponseException` osztályból, azonban
én nem szeretem, ha az üzleti rétegben szereplő exceptionnek van REST-re hivatkozása.

A Bean Validation validációs hiba esetén a `MethodArgumentNotValidException` kivételt dobja,
mely implementálja a `ErrorResponse` interfészt, azonban nem mondja meg, hogy milyen mezőkkel
van probléma. Tehát valami hasonló hibát kapunk:

```json
{
  "type": "about:blank",
  "title": "Bad Request",
  "status": 400,
  "detail": "Invalid request content.",
  "instance": "/api/employees"
}
```


Ezen a következő kóddal segíthetünk.

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
                .toList();
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
Spring Boot esetén erre a [Spring Cloud Sleuth projektet](https://spring.io/projects/spring-cloud-sleuth)
kellett használni. Ennek azonban leállt a fejlesztése, és nagyrésze átkerült a
Micrometer Tracing projektbe. Ezért a Spring Cloud Sleuth eszközre már nem érdemes építeni.

A Spring Boot 3-nak a tracing viszont már szerves része, melyet a Micrometer Tracing projekt biztosít. 
A Spring Boot eddig is használta a Micrometert,
de csak metrikák publikálásához. A Micrometer elrejtette a különböző metrikákat gyűjtő eszközök
közötti különbséget. Úgy is mondhatjuk, hogy a metrikáknak a Micrometer olyan,
mint az SLF4J a naplózásnak. Hiszen támogat majdnem húsz metrikákat gyűjtő
protokollt és eszközt, pl. Elastic, Influx, OpenTelemetry, Prometheus, stb. 

A Micrometer Tracing a következő tracer library-kat támogatja: OpenZipkin Brave és OpenTelemetry.
Ezek kezelik az adatokat és küldik valamelyik exporter/reporter felé, ami pedig továbbküldi valamilyen
külső rendszernek.

A tracer és exporter/reporter implementációk különböző kombinációi használhatóak:

* Brave tracer Zipkin vagy Wavefront felé kommunikáló tracerrel
* OpenTelemetry tracer Zipkin, Wavefront vagy bármilyen OTLP (OpenTelemetry Protocol) protokollt támogató eszköz felé kommunikáló tracerrel

Sőt megjelent a [Micrometer Observation](https://micrometer.io/docs/observation) is. Itt az ötlet az,
hogy instrumentáljuk a kódot, és az így nyert adatok megjelenthetnek a metrikák, trace-ek és logok
között is.

Ráadásul már nagyon sok library-hez elkészültek ilyen instrumentációk, listájuk
[itt olvasható](https://micrometer.io/docs/observation#_existing_instrumentations). Kiemelném
a következő library-ket: JDBC, JMS, Resilience4j, Spring MVC, Spring Security, Spring Kafka, CXF, gRPC, stb.

A példaprojekt elérhető a [GitHubon](https://github.com/vicziani/jtechlog-mmt).

A példaprojektben Zipkint választottam, melyet a legegyszerűbb Dockerben elindítani.

```shell
docker run -d -p 9411:9411 --name zipkin openzipkin/zipkin
```

A projektben az OpenTelemetry tracert és a Zipkin exportert választottam, amihez a következő függőségeket kellett felvenni:

```groovy
implementation 'org.springframework.boot:spring-boot-starter-actuator'
implementation 'io.micrometer:micrometer-tracing-bridge-otel'
implementation 'io.opentelemetry:opentelemetry-exporter-zipkin'
```

Az `application.properties`-ben még kellett állítgatni:


```properties
spring.application.name=jtechlog-mmt
management.tracing.enabled=true
management.tracing.sampling.probability=1.0
management.zipkin.tracing.connect-timeout=5s
```

A `spring.application.name` a service neve lesz.
Az `management.tracing.enabled` property-vel a tracing kerül bekapcsolásra. A `management.tracing.sampling.probability` értékével megmondjuk, hogy minden
kérés legyen rögzítve, mert az alapbeállítás `0.1`, azaz minden tizedik. A `management.zipkin.tracing.connect-timeout` azért
kellett, mert néha timeoutolt a Zipkin kapcsolat, és ezért eldobott spaneket.

Egy span létrehozása a következő kódrészlettel történhet:

```java
return Observation.createNotStarted("controller.hello", observationRegistry)
				.lowCardinalityKeyValue("framework", "spring")
				.observe(() -> {
					return helloService.hello();
				});
```

Ez a következőképp fog kinézni a Zipkinben (feltételezve, hogy a service-ben is van egy `service.hello` span):

<a href="/artifacts/posts/images/zipkin_sb.png" data-lightbox="post-images">![Zipkin](/artifacts/posts/images/zipkin_sb_750.png)</a>

A `spring.application.name` property-ben beállított név lett a service neve. 

Látható, hogy a http kérés is egy külön span, és jó sok taggel rendelkezik, pl. az URL, a HTTP metódus, a HTTP státuszkód, stb.

A `controller.hello` lett a következő span neve.
A `lowCardinalityKeyValue()` metódussal olyan tageket lehet felvenni, melyek kevés értéket vehetnek fel (pl. enum értékek).
Van egy `highCardinalityKeyValue()` párja is, ha az értékek sokfélék lehetnek (pl. egész számok).

Metóduson használható az `@Observed` annotáció is, mellyel mindezt deklaratív módon lehet megadni. Ehhez kell egy `ObservedAspect`
bean az application contextbe, és egy `org.springframework.boot:spring-boot-starter-aop` függőség.

```java
@Bean
ObservedAspect observedAspect(ObservationRegistry observationRegistry) {
  return new ObservedAspect(observationRegistry);
}
```

```java
@GetMapping("/")
@Observed(name = "controller.hello", contextualName = "controller.hello", lowCardinalityKeyValues = {"framework", "spring"})
public String hello() {
  return helloService.hello();
}
```

A `contextualName` paraméterben megadott érték lesz a span neve.

Kapcsoljuk be az aktuátorokat az `application.properties` fájlban.

```properties
management.endpoints.web.exposure.include=*
```

Ekkor a `http://localhost:8080/actuator/metrics/controller.hello` címen lekérdezhetjük az ide tartozó
metrikákat is.

```json
{
   "name":"controller.hello",
   "baseUnit":"seconds",
   "measurements":[
      {
         "statistic":"COUNT",
         "value":3
      },
      {
         "statistic":"TOTAL_TIME",
         "value":0.0032814
      },
      {
         "statistic":"MAX",
         "value":0.0019493
      }
   ],
   "availableTags":[
      {
         "tag":"framework",
         "values":[
            "spring"
         ]
      },
      {
         "tag":"method",
         "values":[
            "hello"
         ]
      },
      {
         "tag":"error",
         "values":[
            "none"
         ]
      },
      {
         "tag":"class",
         "values":[
            "hello.HelloApplication"
         ]
      }
   ]
```

Látható, hogy 3-szor hívtam meg.

A trace id és a span id értékét is meg lehet jeleníteni a logban. Ehhez az `application.properties`
fájlban kell felvenni a következőt:

```properties
logging.pattern.console=%d{HH:mm:ss} [%X{traceId}/%X{spanId}] %clr(%-5.5p{5}) %-40.40logger{40} %m%n
```

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

A natív fordítást a [Bellsoft Liberica Native Image Kit (NIK)](https://bell-sw.com/liberica-native-image-kit/)
végzi, mely a GraalVM-re és Liberica JDK-ra épít.

Ez történhet Docker konténerben a Cloud Native Buildpacks segítségével.

Ehhez a `build.gradle` fájlba a következő plugint kell felvenni:

```groovy
id 'org.graalvm.buildtools.native' version '0.9.27'
```

Majd a következő parancs kiadásával előáll az image.

```shell
gradlew bootBuildImage
```

Ez nekem több, mint 10 percig futott.

Utána Docker Compose-t használtam, hogy egy paranccsal lehessen
elindítani az adatbázis és az alkalmazás konténert, ráadásul úgy,
hogy egy hálózatban legyenek.

```shell
cd employees
docker compose up
```

Az alkalmazás indítási ideje 0,2 - 0,3 másodperc!

Lehetne natív futtatható állományt is előállítani, azonban ekkor
a telepíteni kell a gépre GraalVM disztribúciót. Linux és MacOS
esetén ez működhet az SDKMAN! eszközzel.

Windows esetén még a Visual Studio Build Tools és a Windows SDK
eszközöket is telepíteni kell.

# Natív image-ek Spring Boot 2-es verzión (deprecated)

A Spring Native aktuális stabil verziója (0.12.1) a 
Spring Boot 2.7.1 verzióját támogatja.

A példaprojekt elérhető a [GitHubon](https://github.com/vicziani/jtechlog-employees-sb2-native).

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

Eztán már csak a `mvn spring-boot:build-image` parancsot kell kiadni. Ez az én gépemen 14 percig futott. (Figyeljünk, hogy a 17-es JDK-t használjuk.)

Utána Docker Compose-t használtam, hogy egy paranccsal lehessen
elindítani az adatbázis és az alkalmazás konténert, ráadásul úgy,
hogy egy hálózatban legyenek.

```shell
cd employees
docker compose up
```

<a href="/artifacts/posts/images/spring-boot-native.png" data-lightbox="post-images">![Spring Boot indulás](/artifacts/posts/images/spring-boot-native_750.png)</a>
