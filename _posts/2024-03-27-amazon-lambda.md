---
layout: post
title: AWS Lambda és a Spring Cloud Function
date: '2024-05-10T10:00:00.000+02:00'
author: István Viczián
description: AWS Lambda függvények megvalósítása Spring Cloud Function használatával.
---

Az AWS Lambda egy AWS szolgáltatás, mely lehetővé teszi, hogy a különböző programozási nyelven
megírt alkalmazásainkat (függvényeinket) anélkül tudjuk futtatni, hogy gondunk lenne az
azt kiszolgáló infrastruktúrára. A szolgáltatás a serverless computing kategóriába tartozik,
ami kicsit megtévesztő, hiszen itt is van futtató környezet, azonban ez számunkra
láthatatlan. A másik ismert megnevezése a Function as a Service (FaaS). Természetesen
más cloud szolgáltatóknak is van hasonló megoldásuk, a Microsoftnál az Azure Functions, a Google-nél
a Cloud Functions.

A függvények tipikusan valamilyen beérkező eseményre reagálnak, ami lehet egy felhasználói kérés,
valamilyen üzenet más szolgáltatás (pl. S3) felöl, vagy üzenet
brókeren keresztül beérkező üzenet, pl. valamilyen IoT eszköz, vagy alkalmazás irányából.
Miután megírjuk a választott programozási nyelven a függvényünket, azt össze kell csomagolni,
és telepíteni. Ez lehet akár egy tömörített fájl, akár egy container image. 
A szolgáltatás rugalmassága miatt ma akár bármilyen programozási nyelven írhatunk ilyen
függvényeket. 

A futtatókörnyezettel nem kell foglalkozni, azt a szolgáltatás önmaga kezeli. Ez magában foglalja
a hardvert és az operációs rendszert, annak frissítését, erőforrás kezelést, automatikus skálázást és
naplózást. És fizetnünk is csak annyit kell, amennyit futott a függvényünk, idő alapján (ezredmásodperc alapon).

A kód futtatása természetesen konténerekben történik, melyek tartalmazzák az adott programozási nyelv 
futtatókörnyezetét. Azonban a szolgáltatás nem mindig indít minden bejövő eseményhez új
konténert, hanem megpróbálja azokat újrahasznosítani. Ennek egyik következménye,
hogy bizonyos kérések kiszolgálása tovább tart, mikor a konténert el kell indítani (ún. cold start).
Bizonyos kérések kiszolgálása azonban nagyon gyorsan megtörténik (ún. warm start).
A nem használt konténereket a szolgáltatás automatikusan leállítja.
Másrészt mivel a kérések kiszolgálása ugyanabban a konténerben futhat, lehet ezeknek egymásra hatása (pl. ha
használják a fájlrendszert).

Egy AWS Lambda konténer rendelkezésére álló memória konfigurálható 128 és 10240 MB között, természetesen egy ezredmásodperc
ára is annál nagyobb, minél több memóriát használ a konténer. Valamint 512 MB és 10240 MB között tudunk hozzá
tárhelyet is rendelni, minél többet, annál nagyobb felárral.

Amennyiben saját image-t állítunk elő, először a Amazon Elastic Container Registry (Amazon ECR)
szolgáltatásba kell feltöltenünk.

Ha a Lambda függvényünket REST-en akarjuk meghívni, akkor még az API Gateway szolgáltatást kell használnunk.

![Architektúra](/artifacts/posts/2024-03-27-amazon-lambda/aws.drawio.svg)

Ezek alapján mikor érdemes az AWS Lambdát használni? Olyan funkciók megvalósítására ideális, 
amik eseményekre reagálnak, nincs rá folyamatosan szükségünk, nem kell azonnali választ adnunk, 
és az üzenetek beérkezése nem egyenletes.
Ilyen lehet pl. a kép- és videófeldolgozás, bejövő események adatainak aggregálása, (PDF) dokumentumok generálása.

Vannak azonban esetek, amelyeknél el kell gondolkodnunk, hogy tényleg az AWS Lambda-e a jó választás.
Ilyenek például a klasszikus webes alkalmazások. Itt egy gyenge forgalom esetén lehet, hogy a cold start miatt
nagyobb lesz a válaszidő. Valamint egy nagyon nagy terhelésű alkalmazás esetén pedig lehet, hogy az idő alapú
számlázás nem a legkedvezőbb.

A Spring Cloud Function egy olyan projekt, mely a Spring ökoszisztéma tagja, Spring Boothoz illeszkedik, és segítségével az üzleti logikát
Java 8 funkcionális interfészek implementálásával tudjuk megvalósítani. Ezáltal teljesen leválasztja az infrastruktúrális
elemekről. Azonban adapterekkel, konfigurációt használva össze tudjuk kapcsolni az üzleti logikát különböző
szolgáltatásokkal, pl. AWS Lambdaval is. A Spring Cloud Stream használatával pedig különböző message brokerrekkel, mint
pl. RabbitMQ-val vagy Apache Kafkával.

Mivel nem mindegy, hogy a function mennyi memóriát használ, és mennyi idő alatt indul el, ezért a Java bytekód nem feltétlenül
a legjobb választás. Azonban a Spring Boot alkalmazásokat könnyű natívvá fordítani.

Ebben a posztban azt mutatom be, hogyan lehet egy natívra fordított, Spring Cloud Functiont használó 
alkalmazást AWS Lambda függvényként futtatni.

(A példa ingyenesen kipróbálható az [AWS Free Tier](https://aws.amazon.com/free) használatával. Bankkártya adatok megadása szükséges.)

<!-- more -->

## Java SE alkalmazás az SDK-val

Először elkészítek egy Java 21 alkalmazást az [AWS Lambda Java Support Libraries](https://github.com/aws/aws-lambda-java-libs) segítségével.
Itt egy egyszerű [AWS Lambda function handlert](https://docs.aws.amazon.com/lambda/latest/dg/java-handler.html) fogok implementálni.
Az alkalmazás teljes forráskódja megtalálható a [GitHubon](https://github.com/vicziani/hello-aws-lambda).

 A `pom.xml` fájlba a következő függőségeket kell felvenni:

```xml
<dependency>
    <groupId>com.amazonaws</groupId>
    <artifactId>aws-lambda-java-core</artifactId>
    <version>1.2.3</version>
</dependency>
<dependency>
    <groupId>com.amazonaws</groupId>
    <artifactId>aws-lambda-java-events</artifactId>
    <version>3.11.3</version>
</dependency>
<dependency>
    <groupId>com.amazonaws</groupId>
    <artifactId>aws-lambda-java-log4j2</artifactId>
    <version>1.5.1</version>
</dependency>
```

A beérkező esemény egy JSON dokumentum, melyet képes az SDK azonnal Java objektummá alakítani (input). A válasz ugyanúgy egy Java
objektum (output). A kéréshez és a válaszhoz létrehozok egy-egy rekordot.

```java
public record HelloRequest(String name) {}

public record HelloResponse(String message) {}
```

A függvénynek a `RequestHandler` interfészt kell implementálnia. Típusparaméterek az input és az output osztálya. 
Ebben implementálom a `handleRequest()` metódust. Paramétere az input és egy `Context` példány.
Ez utóbbin keresztül a futtatókörnyezethez lehet hozzáférni, mint pl. a naplózó. Visszatérési értéke pedig az output.

```java
public class HelloHandler implements RequestHandler<HelloRequest, HelloResponse> {

    @Override
    public HelloResponse handleRequest(HelloRequest helloRequest, Context context) {
        var logger = context.getLogger();
        logger.log("Name: %s".formatted(helloRequest.name()));
        return new HelloResponse("Hello %s!".formatted(helloRequest.name()));
    }
}
```

A JSON serialization/deserialization műveleteket ebben az esetben az AWS Lambda futtatókörnyezet végzi.

A függvényt össze kell csomagolni egy JAR fájlba, ugyanis azt könnyű feltölteni az AWS Lambdára. Szükség van arra, hogy a JAR
tartalmazza a függőségeket is. Ehhez a `maven-shade-plugin` is használható.

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-shade-plugin</artifactId>
    <version>3.5.2</version>
    <configuration>
        <createDependencyReducedPom>false</createDependencyReducedPom>
    </configuration>
    <executions>
        <execution>
            <phase>package</phase>
            <goals>
                <goal>shade</goal>
            </goals>
            <configuration>
                <transformers>
                    <transformer implementation="org.apache.logging.log4j.maven.plugins.shade.transformer.Log4j2PluginCacheFileTransformer">
                    </transformer>
                </transformers>
            </configuration>
        </execution>
    </executions>
    <dependencies>
        <dependency>
            <groupId>org.apache.logging.log4j</groupId>
            <artifactId>log4j-transform-maven-shade-plugin-extensions</artifactId>
            <version>0.1.0</version>
        </dependency>
    </dependencies>
</plugin>
```

Majd ki kell adni az `mvnw package` parancsot.

## Függvény létrehozása az AWS Management Console-on

A _Services_ menüben ki kell választani a _Lambda_ szolgáltatást. Majd _Create function_ gombra
kell kattintani. A megjelenő űrlapot a következő értékekkel kell kitölteni:

* _Function name_: `Hello`
* _Runtime_: _Java 21_

A többi az alapértelmezett értéken hagyható.

Miután létrejött a függvény, a _Code_ fülön a _Code source_ panelen meg kell nyomni
az _Upload from_ gombot, és kiválasztani a _.zip or .jar_ fájl menüpontot.
Itt meg kell adni a `target` könyvtárban létrejött `hello-aws-lambda-1.0-SNAPSHOT.jar` fájlt.

Majd a _Runtime settings_ panelen az _Edit_ gombra kattintva meg kell adni a következő
értéket:

* _Handler_: `hello.HelloHandler::handleRequest`, ez az osztály és metódus neve

<a href="/artifacts/posts/2024-03-27-amazon-lambda/lambda-java-se_750.png" data-lightbox="post-images">![AWS Lambda függvény](/artifacts/posts/2024-03-27-amazon-lambda/lambda-java-se.png)</a>

## Függvény tesztelése

A függvény teszteléséhez a _Test_ fülre kell kattintani, és az _Event JSON_
mezőbe a következő JSON dokumentumot kell beírni:

```json
{
    "name": "John Doe"
}
```

Majd a _Test_ gombra kell klikkelni. A függvény a következő választ fogja adni:

```json
{
  "message": "Hello John Doe!"
}
```

## Log a CloudWatch szolgáltatásban

A futásnak a naplóját a CloudWatch szolgáltatásban is lehet látni, a _Logs_ / _Log groups_ alatt,
és a Log group neve esetünkben: `aws/lambda/Hello`.

## Függvény telepítése és futtatása Linux parancssorból

Állandóan a felületen klikkelgetni nagyon időigényes, ezért a függvényünket parancssorból is tudjuk
telepíteni és futtatni. Mindenképp Linux parancssort használjunk, ugyanis az idézőjelek escape-elése
nagyon nehézkes Windows esetén.

Létre kell hozni egy szerepkört:

```shell
aws iam create-role --role-name lambda-ex --assume-role-policy-document '{"Version": "2012-10-17","Statement": [{ "Effect": "Allow", "Principal": {"Service": "lambda.amazonaws.com"}, "Action": "sts:AssumeRole"}]}'
```

A visszaadott JSON-ből ki kell másolni az `Arn` mező értékét és azt kell használni a következő parancsban.

Telepítés:

```shell
aws lambda create-function --function-name Hello \
--runtime java21 --handler hello.HelloHandler \
--role arn:aws:iam::123:role/lambda-ex \
--zip-file fileb://target/hello-aws-lambda-1.0-SNAPSHOT.jar
```

Futtatás:

```shell
aws lambda invoke --function-name Hello --payload '{"name": "John"}' response.json
cat response.json | jq
```

A válasz a `response.json` fájlban található.

Ha a függvény logját is látni szeretnénk:

```shell
aws lambda invoke --function-name Hello --payload '{"name": "John"}' --log-type Tail --query 'LogResult' --output text response.json | base64 -d
```

Módosítás után telepíthetjük az új JAR fájlt:

```shell
aws lambda update-function-code --function-name Hello \
--zip-file fileb://target/hello-aws-lambda-1.0-SNAPSHOT.jar
```

A válasz a `response.json` fájlban található.

## Függvény futtatása IDEA-ból

Az IDEA-hoz letölthető egy AWS Toolkit plugin. Ebben meg lehet tekinteni a telepített függvényeket, és meg is lehet hívni azokat.

![Függvény futtatása IDEA-ból](/artifacts/posts/2024-03-27-amazon-lambda/lambda-idea.png)

## AWS Serverless Application Model (AWS SAM)

Az Amazon egy teljes eszközrendszert is biztosít a függvények fejlesztésére, ez a [AWS Serverless Application Model (AWS SAM)](https://docs.aws.amazon.com/serverless-application-model/).

Ennek két fő része van, egyrészt az AWS SAM template specification, ez a AWS CloudFormation kiegészítése. Ennek segítségével deklaratív módon, yaml formátumban
írhatjuk le a függvényeink futtató környezetét, és egy paranccsal tudjuk utána telepíteni. Másik része a SAM CLI, mely segítségével gyorsan tudunk projektet létrehozni,
buildelni, lokálisan (akár konténerben) futtatni, debuggolni, CI/CD pipeline-t kialakítani, a futó alkalmazást monitorozni, stb.

E nélkül is lehet fejleszteni, ebben a posztban is eltekintünk a használatától.

## Spring Boot alkalmazás Spring Cloud Functionnel

Az alkalmazás teljes forráskódja megtalálható a [GitHubon](https://github.com/vicziani/hello-aws-lambda-scf).

Az eddigi függőségeken kívül szükség van a Spring Cloud Function AWS Adapterre.

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-function-adapter-aws</artifactId>
</dependency>
```

Ehhez a kell a `org.springframework.cloud:spring-cloud-dependencies` a `dependencyManagement` tag alá.
Ez tranzitíven behozza a `org.springframework.cloud:spring-cloud-function-context` függőséget is,
mely a Spring Cloud Function.

Amennyiben szeretnénk az alkalmazást futtatni, egy olyan JAR-t kell előállítani, mely kicsomagolva tartalmazza a függőségeket.
Ehhez először egy olyan JAR-t kell készíteni, ami nem tartalmazza JAR-ként a függőségeket, majd oda kell másolni
kicsomagolva a függőségeket. Ehhez egyrészt a `org.springframework.boot.experimental:spring-boot-thin-layout` függőségre
 van szükség a `org.springframework.boot:spring-boot-maven-plugin` pluginnál.

(A [Spring Boot Thin Launcher](https://github.com/spring-projects-experimental/spring-boot-thin-launcher) már önmagában is egy nagyon érdekes projekt. 
Spring Boot alkalmazásnál probléma, hogy az összes függőség az alkalmazásba kerül bele, amitől az nagy lesz, és ha feltöltjük Maven
repo-ba, akkor többszörösen kerül eltárolásra. Ezért megalkották a _Thin Jar_ fogalmát, ami csak az alkalmazást tartalmazza függőségek nélkül.
Valamint a JAR-ba becsomagolásra kerül egy `ThinJarWrapper` osztály, mely először letölt egy másik JAR fájlt, az ún. launcher JAR-t.
Ennek feladata, hogy a JAR-ban található `pom.xml` alapján felolvassa a függőségeket, és letölti a Maven local repository-ba.)

Másrészt kell a `org.apache.maven.plugins:maven-shade-plugin` plugin, ami pedig a függőségeket másolja kitömörítve a JAR-ba.

Az ehhez tartozó `pom.xml` részlet:

```xml
<plugins>
    <plugin>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-maven-plugin</artifactId>
        <dependencies>
            <dependency>
                <groupId>org.springframework.boot.experimental</groupId>
                <artifactId>spring-boot-thin-layout</artifactId>
                <version>1.0.30.RELEASE</version>
            </dependency>
        </dependencies>
    </plugin>
    <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-shade-plugin</artifactId>
        <executions>
            <execution>
                <goals>
                    <goal>shade</goal>
                </goals>
                <configuration>
                    <createDependencyReducedPom>false</createDependencyReducedPom>
                    <shadedArtifactAttached>true</shadedArtifactAttached>
                    <shadedClassifierName>aws</shadedClassifierName>
                </configuration>
            </execution>
        </executions>
    </plugin>
</plugins>
```

Az alkalmazás maga nagyon egyszerű, szükség van a korábbi `HelloRequest` és
`HelloResponse` rekordokra, valamint maga az alkalmazás a következőképp néz ki:

```java
@SpringBootApplication
@Slf4J
public class HelloApplication {

	public static void main(String[] args) {
		SpringApplication.run(HelloApplication.class, args);
	}

	@Bean
	public Function<HelloRequest, HelloResponse> hello() {
		return (request) -> {
			var name = request.name();
            log.debug("Name: %s".formatted(name));
			return new HelloResponse("Hello %s!".formatted(name));
		};
	}
}
```

Azaz definiálunk egy `Function` implementációt, melyet az AWS Lambda fog meghívni.

A függvényünk a `FunctionCatalog` segítségével tesztelhető, a Spring Cloud Function ugyanis ide 
regisztrálja a függvényeket.

```java
@SpringBootTest
public class HelloIT {

    @Autowired
    FunctionCatalog functionCatalog;

    @Test
    void hello() {
        var function = (Function<Message<HelloRequest>, HelloResponse>) functionCatalog.lookup("hello");
        var response = function.apply(new HelloRequest("John Doe"));
        assertEquals("Hello John Doe!", response.message());
    }
}
```

## Spring Boot alkalmazás telepítése

Az `mvnw -Pshaded package` paranccsal létrehozott alkalmazást az előbb leírt módon telepíthető.
Legyen a neve pl. `SpringHello`.
A Maven profile azért kell, mert én a két plugint a `shaded` profile alatt hoztam létre.
A különbség csak annyi, hogy a _Handler_ értékeként a `org.springframework.cloud.function.adapter.aws.FunctionInvoker`
értéket állítsuk be.

Utána ugyanúgy tesztelhető, mint egyszerű Java SE alkalmazás esetén.

## Naplózás

Naplózás során két megoldás közül választhatunk:

* Konzol, Spring Boot esetén alapértelmezetten Logbackkel
* AWS Lambda által biztosított `LambdaLogger`

A különbség, hogy az utóbbi jól kezeli a többsoros naplókat is, de sokkal kevésbé konfigurálható, mint a Logback.
A legjobb, ha kombináljuk, azaz a Logback napló bejegyzéseket átvezetjük a `LambdaLogger` felé, pl.
a [jlib AWS Lambda SLF4J/Logback Appender](https://github.com/jlib-framework/jlib-awslambda-logback) segítségével.

## Paraméterezhetőség

A property-ket parancssori kapcsolóként, vagy környezeti változóként is meg lehet adni. Pl. a naplózás módosítása
beállítható a _Configuration_ fülön, _Environment variables_ menüpontban, a `JAVA_TOOL_OPTIONS` értéke legyen
`-Dlogging.level.hello=debug`.

## Reaktív megoldás

A függvény reaktívan is megírható:

```java
@Bean
public Function<Flux<HelloRequest>, Flux<HelloResponse>> hello() {
    return request ->
            request
                    .map(HelloRequest::name)
                    .doOnNext(name -> log.debug("Name: %s".formatted(name)))
                    .map("Hello %s!"::formatted)
                    .map(HelloResponse::new);
}
```

## Belső működés

A `FunctionInvoker` implementálja a `RequestStreamHandler` interfészt. Azért nem a már említett `RequestHandler`
interfészt, mert itt az alkalmazás maga kezeli a JSON serialization/deserialization műveleteket. Ezt az AWS Lambda környezet hívja meg
a _Handler_ értéke miatt. Ez beindítja a Spring Application Contextet `--spring.main.web-application-type=none`
és `--spring.cloud.function.web.export.enabled=false`
paraméterekkel. Előbbi kikapcsolja, hogy az alkalmazás webalkalmazásként induljon el. Az utóbbi
kikapcsolja, hogy a függvényeink REST-en kiajánlásra kerüljenek. Így nem baj, ha a
`org.springframework.boot:spring-boot-starter-web` és `org.springframework.cloud:spring-cloud-function-web`
függőségek a Classpath-on vannak, valamint hogy milyen property-k vannak beállítva. Majd a `FunctionCatalog`
példányon keresztül meghívja a függvényt. 

Közben `info` szinten naplóz:

```
2024-05-06T11:41:37.989Z  INFO 8 --- [           main] o.s.c.f.adapter.aws.FunctionInvoker      : Locating function: 'null'
2024-05-06T11:41:38.006Z  INFO 8 --- [           main] o.s.c.f.adapter.aws.FunctionInvoker      : Located function: 'hello'
2024-05-06T11:41:38.041Z  INFO 8 --- [           main] o.s.c.f.adapter.aws.AWSLambdaUtils       : Received: 
{
    "name": "John Doe"
}
```

Mivel nincs megadva `spring.cloud.function.definition` property, ezért az egyetlen függvényünket választja ki, és hívja meg.

## Web függőségek és belső működés

A Spring Boot alkalmazás esetén fel szoktuk venni a `org.springframework.boot:spring-boot-starter-web` függőséget,
valamint Spring Cloud Function esetén a `org.springframework.cloud:spring-cloud-function-web`. Ezzel egyrészt
tranzitívan bekerül a függőségek közé egy web konténer, pl. a Tomcat, másrészt az alkalmazásunk índításakor ez el is
indul. Utána a `spring.cloud.function.web.export.enabled` property `true` értékre való állításával
HTTP-n keresztül, REST-en is meghívható a függvény.

Ezért a web függőségeket valahogy ki kell iktatni a következő módok valamelyikét használva, mert nem kell az alkalmazásba:

* Ne legyen egyáltalán a függőségek között, a függvény tesztesetből próbálható ki
* Legyen csak teszt scope-ban
* Vagy csak bizonyos Maven profile használata esetén legyen a függőségek között
* Csomagoláskor kerüljön exclude-álásra
* A függőség ellenére is az alkalmazás legyen parancssori alkalmazás, `spring.main.web-application-type` property értéke legyen `none`

## Native image működése

Amikor image kerül feltöltésre, akkor kicsit másképpen működik. Hiszen az image, ami elkészül,
nem tartalmazza az AWS Lambda futtató környezetet. Ez az ún. _custom runtime_. Így amikor az AWS Lambda elindítja a konténert,
benne az alkalmazást, ezáltal a függvényt, annak kell kihívnia egy URL-en a Lambda felé (a host nevét megkapja környezeti változóban),
és az AWS Lambda adja vissza a következő kérést. Ezt utána fel tudja dolgozni a függvény. Ha ezt feldolgozta, akkor
kihívhat, hogy van-e következő kérés. Ezt egészen addig, amíg van kérés, így ugyanabban a konténerban futó
függvény fel tud dolgozni több kérést is. Ez az ún. [Lambda runtime API](https://docs.aws.amazon.com/lambda/latest/dg/runtimes-api.html).
(Mellesleg ennek a felhasználásával bármilyen programozási nyelven lehet AWS Lambda környezetben futó függvényt írni.)

## Native image elkészítése és futtatása

A natív image futtatásának lépései:

* Image elkészítése lokálisan
* Image feltöltése a Elastic Container Registry-be
* Új Function létrehozása image alapján

Mivel a függvény hív ki http-n, szükséges a következő
konfiguráció a `pom.xml`-ben:

```xml
<plugin>
    <groupId>org.graalvm.buildtools</groupId>
    <artifactId>native-maven-plugin</artifactId>
    <configuration>
        <buildArgs>
            <buildArg>--enable-url-protocols=http</buildArg>
        </buildArgs>
    </configuration>
</plugin>
```

Az image készítéséhez ki kell adni a következő parancsot:

```shell
mvn -Pnative spring-boot:build-image
```

Ennek neve `docker.io/library/hello-aws-lambda-scf:0.0.1-SNAPSHOT` lesz.

Az _Elastic Container Registry_ oldalán a _Create repository_ gombbal létre kell hozni egy új repository-t. Legyen a
neve pl. `hello`. Ide kell push-olni az elkészült image-t, az ehhez való parancsokat megtalálhatóak a
_View push commands_ gombra kattintva. Következő lépéseket kell megtenni:

* Bejelentkezés, `aws ecr get-login-password` kezdetű parancs
* Elkészült image taggelése: `docker tag` kezdetű parancs
* Repository-ba feltöltés: `docker push parancs`

Parancssorban (természetesen a registry azonosítóját cserélni kell):

```shell
aws ecr get-login-password --region eu-central-1 | docker login --username AWS --password-stdin 12345.dkr.ecr.eu-central-1.amazonaws.com
docker tag docker.io/library/hello-aws-lambda-scf:0.0.1-SNAPSHOT 12345.dkr.ecr.eu-central-1.amazonaws.com/hello:latest
docker push 12345.dkr.ecr.eu-central-1.amazonaws.com/hello:latest
```

Most már csak a Functiont kell létrehozni:

* _Container image_
* _Funcation name_: `SpringNative`
* _Container image URI_: A _Browse image_ gombbal válasszuk ki a feltöltött image-t a repository-ból
* _ENTRYPOINT_: `/workspace/hello.HelloApplication`
* _CMD_: `hello`

Futtatás ugyanúgy történik, mint az előző függvény esetén, teszt üzenettel.

## Sebesség összehasonlítás

<table class="table table-striped">
  <thead>
    <tr>
      <td></td>
      <td>Bytecode</td>
      <td>Native</td>
    </tr>
  </thead>
  <tbody>
  <tr>
    <tr><td>Teszt futása</td><td>~7 s</td><td>~1 s</td></tr>
    <tr><td>Billed duration</td><td>~3000 ms</td><td>~1200 ms</td></tr>
    <tr><td>Spring Boot start</td><td>~2500 ms</td><td>100 ms</td></tr>
  </tr>
</tbody>
</table>


## Belső működés

Indításkor a `CustomRuntimeInitializer` osztály regisztrál bizonyos feltételek mellett az Application Contextbe egy
`CustomRuntimeEventLoop` példányt. Csak akkor, ha a `spring.cloud.function.web.export.enabled` értéke nem
`true`, és adott a `_HANDLER` property. Ezért kell megadni `CMD` értéket, mert az első paraméter értéke lesz a
`_HANDLER` környezeti változó értéke, és ha ez nincs megadva, akkor nem kerül példányosításra a 
`CustomRuntimeInitializer`. A `_HANDLER` értéke bármi lehet, ugyanis ha nem talál vele functiont,
de csak egy van, akkor azt az egyet fogja megtalálni. A `CustomRuntimeEventLoop` osztály egy példánya hívogat ki ciklusban 
HTTP-n keresztül az AWS Lambda felé `RestTemplate` használatával.

## Konfiguráció

Átadhatóak property-k parancssori paraméterként is, pl. a _CMD override_-nál. Naplózás módosításakor 
be kell állítani a következőt: `hello, -Dlogging.level.hello=debug`. A paramétereket vesszővel kell elválasztani,
és az első paraméter mindig a `_HANDLER` értéke lesz (ami a function neve).

## Függvény elérése HTTP-n

Ahhoz, hogy a függvényünket HTTP-n el lehessen érni, használni kell az AWS API Gateway szolgáltatást.
Ez a bejövő HTTP kéréseket továbbítja a függvénynek.
Kiválasztása után a _Create API_ gombra kell kattintani, majd _REST API_, és _Build_ gomb. 
Itt _New API_, _API name_ értéke legyen `SpringHello`, majd _Create API_ gomb.
A `/` URL alatt meg kell nyomni a _Create method_ gombot, és meg kell adni a következőket:

* _Method type_: _POST_
* Lambda function
* Lambda function kiválasztása legördülő menüből

Majd _Create method_ gomb.

Ezután csak deploy-olni kell. Ehhez meg kell nyomni a _Deploy API_ gombot, majd a _Stage name_ beviteli mezőben megadni a `production`
értéket. Ezután megjelenik egy _Invoke URL_, mely értéke valami hasonló: `https://abc.execute-api.eu-central-1.amazonaws.com/production`.
Ide már küldhető is a kérés:

```
POST https://jsbz878wuc.execute-api.eu-central-1.amazonaws.com/production/
Content-Type: application/json

{
  "name": "Jack Doe"
}
```

Vagy CURL használatával:

```shell
curl -X POST --location "https://abc.execute-api.eu-central-1.amazonaws.com/production/" \
    -H "Content-Type: application/json" \
    -d '{
          "name": "Jack Doe"
        }'
```