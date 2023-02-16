---
layout: post
title: Spring Cloud Config
date: '2016-09-05T20:00:00.000+02:00'
author: István Viczián
---

Aki régebb óta követi a blogomat, tudhatja, hogy az alkalmazások konfigurációjának kezelése, tárolása és betöltése mindig érdekelt. Mivel manapság Spring környezetben dolgozom, adta magát a [Spring Cloud Config](https://cloud.spring.io/spring-cloud-config/). A Pivotal (a Spring mögött álló cég) célja a [Spring Boot](http://projects.spring.io/spring-boot/) és a [Spring Cloud](http://projects.spring.io/spring-cloud/) fejlesztésével az, hogy egy olyan egységes, pehelysúlyú, könnyen használható környezetet adjon a microservices architektúra és a cloud kihívásaira, melyet a Spring Frameworkkel adott a nagyvállalati Java fejlesztés megkönnyítésére, valós alternatívát nyújtva a Java EE helyett. A koncepció ugyanaz, főleg létező eszközök egységes keretbe foglalása, elosztott környezetben elterjedt minták alkalmazása.

A Spring Cloud Config használatával könnyen építhető olyan szerver alkalmazás, mely a konfigurációkat tárolja és szolgálja ki a különböző klienseknek. Ezek tárolása különböző lehet, jelenleg fájlrendszer és verziókezelő rendszer (Subversion, Git), és a klienseket REST interfészen szolgálja ki. Képes a jelszavakat és különböző érzékeny konfigurációkat szimmetrikus vagy aszimmetrikus kódolással tárolni. A megváltozott konfigurációról értesíteni tudja a klienseket. Felhasználói felületet nem biztosít a konfigurációk szerkesztésére, hiszen pl. a Git repository képes az állományok verziózott tárolására, hozzáférés szabályozására, ezen kívül rendkívül jó felületek is vannak hozzá (kezdve a parancssorral). A Config Server ezen kívül bármilyen Spring Boot alkalmazásba könnyen beágyazható. A Config Client egy könyvtár mely szintén Spring Boot alkalmazásokban használható a legegyszerűbben, és képes kapcsolódni a Config Serverhez, és a konfigurációkat onnan betölteni. A Spring Unified Property Managementjébe illeszkedik, használva az `Environment` és `PropertySource` absztrakciókat.

Ebben a posztban megmutatom, hogy lehet implementálni egy Spring Boot alkalmazást Config Clientként, hogyan kell felépíteni egy Config Servert. Látunk egy példát a titkosításra. Megnézzük, hogy a szerver képes értesíteni a klienseket [Spring Cloud Bus](https://cloud.spring.io/spring-cloud-bus/) infrastruktúrán keresztül (RabbitMQ-t használva). Sőt a végén a [spring-boot-admin](https://github.com/codecentric/spring-boot-admin) grafikus adminisztrációs interfészt is megnézzük Sping Boot alkalmazásokhoz.

<!-- more -->

A példa projekt megtalálható a GitHub-on, [vicziani/jtechlog-config](https://github.com/vicziani/jtechlog-config) néven.

A kliensként induljunk ki egy üres Spring Boot alkalmazásból, melyet [Spring Initializr](http://start.spring.io/) webes szolgáltatással legenerálhatunk. Válasszuk ki a Web, Actuator és Config Client függőségeket. Látható, hogy a generált projekt szülő projektje a `org.springframework.boot:spring-boot-starter-parent` mely a Spring Boot verzió számát definiálja, függőségként szerepel a `org.springframework.boot:spring-boot-starter-web`, `org.springframework.boot:spring-boot-starter-actuator` és a `org.springframework.cloud:spring-cloud-starter-config`. A `dependencyManagement` részben pedig a `org.springframework.cloud:spring-cloud-dependencies`, mely a Spring Cloud függőségek verzió számait tartalmazza.

Hozzunk létre egy `Controller` osztályt a `com.example` csomagban a következő kóddal.

```java
package com.example;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MessageController {

    private String message;

    public MessageController(@Value("${message}") String message) {
        this.message = message;
    }

    @RequestMapping("/")
    public String hello() {
        return message;
    }
}
```

Majd az `application.properties` állományba vegyük fel a `message` property értékét:

    message = Hello World!

A `ClientApplication` alkalmazást elindítva a böngészőben a `http://localhost:8080` címen megjelenik az üzenet.

Ha figyelmesek vagyunk, a naplóban láthatjuk, hogy az alkalmazás már próbál a Config Serverhez csatlakozni a `http://localhost:8888` címen.

    2016-09-03 22:21:52.788  INFO 9624 --- [           main] c.c.c.ConfigServicePropertySourceLocator : Fetching config from server at: http://localhost:8888
    2016-09-03 22:21:52.876  WARN 9624 --- [           main] c.c.c.ConfigServicePropertySourceLocator : Could not locate PropertySource: I/O error on GET request for "http://localhost:8888/application/default": Connection refused; nested exception is java.net.ConnectException: Connection refused

Természetesen a cím a `spring.cloud.config.uri` property-ben felülbírálható. Azonban itt felmerül, hogy ennek megadása az `application.properties` állományban nem lesz jó, hiszen pont az ebben szereplő értékeket akarjuk a szervertől elkérni. Ezért hozzunk létre egy `bootstrap.properties` állományt, és ebbe írjuk a megfelelő címet, ugyanis ez töltődik be az application context indulása előtt, ún. bootstrap fázisban.

Következő lépésben hozzuk létre a szervert, szintén a [Spring Initializr](http://start.spring.io/) szolgáltatással. Most elég a Web és a Config server függőségeket kiválasztanunk. A `ServerApplication` osztályra tegyük rá a `@EnableConfigServer` annotációt, ezzel már be is ágyaztunk egy Config Servert. Majd be kell állítanunk az `application.properties` állományban, hogy a `8888` porton fusson, valamint a Git repository elérhetőségét, ahol a konfigurációs állományokat tárolni fogjuk.

    server.port=8888
    spring.cloud.config.server.git.uri=file:///home/jtechlog/config

Hozzuk is létre ezt a könyvtárat, majd inicializáljunk egy Git repository-t, és hozzunk létre egy `application.properties` állományt, és commitoljuk be.

    mkdir config
    git init
    cat > application.properties
    message = Hello Git!
    git add .
    git commit -m "Initial commit"

Az alkalmazást elindítva elég sok címen ki tudja szolgálni a kéréseket, tipikusan három fő paraméter megadásával.

    /{application}/{profile}[/{label}]
    /{application}-{profile}.yml
    /{label}/{application}-{profile}.yml
    /{application}-{profile}.properties
    /{label}/{application}-{profile}.properties

Ebből az `application` az alkalmazás neve, melynek értéke `application`, ha magunk nem definiáljuk. Felülírhatjuk a kliensben a `bootstrap.properties` állományban a `spring.config.name` property-vel. A második a profile, mellyel (vagy melyekkel) a kliens indítva lett. A `label` a Git repository-ra vonatkozik, mely lehet commit id, branch neve vagy tag név is. Ez utóbbi értéke alapból `master`. Ezek mindegyike felülírható `spring.cloud.config` kezdetű property-kkel is a kliens oldalon, pl. a `label` esetén a `spring.cloud.config.label` property-vel.

Amennyiben `file` típusú repository-t adunk meg, akkor azt direktben olvassa. Amennyiben azonban pl. `http(s)` vagy `ssh` protokollt használunk, a temp könyvtárba klónozza a repository-t. Alapértelmezetten a klónozás akkor történik, mikor az első kérés jön, de ezt felül lehet írni a `cloneOnStart` property-vel.

Beírva a `http://localhost:8888/application/default` címet, valami hasonlót kapunk:

```json
{
    "name": "application",
    "profiles": [
        "default"
    ],
    "label": "master",
    "version": "37d958ed0ef1a89ca53af1978678e345cba9d149",
    "propertySources": [
        {
            "name": "file:///home/jtechlog/config/application.properties",
            "source": {
                "message": "Hello Git!"
            }
        }
    ]
}
```

Ha elindítjuk a kliens alkalmazást, máris tud kapcsolódni a szerverhez, és a konfigurációt már onnan tölti le, megjelenik a `Hello Git!` üzenet. A logban valami hasonló jelenik meg:

    2016-09-04 15:35:41.827  INFO 6766 --- [           main] c.c.c.ConfigServicePropertySourceLocator : Fetching config from server at: http://localhost:8888
    2016-09-04 15:35:42.136  INFO 6766 --- [           main] c.c.c.ConfigServicePropertySourceLocator : Located environment: name=application, profiles=[default], label=master, version=37d958ed0ef1a89ca53af1978678e345cba9d149
    2016-09-04 15:35:42.136  INFO 6766 --- [           main] b.c.PropertySourceBootstrapConfiguration : Located property source: CompositePropertySource [name='configService', propertySources=[MapPropertySource [name='file:///home/jtechlog/config/application.properties']]]

A kliens alkalmazás healthcheckjét nézve (http://localhost:8080/actuator/health) is látszik, hogy él a szerverrel a kapcsolat:

```json
"configServer": {
    "status": "UP",
    "propertySources": [
        "file:///home/jtechlog/config/application.properties"
    ]
}
```

Sőt, a környezeti változókat kiíratva (http://localhost:8080/env) is látható:

```json
"configService:file:///home/jtechlog/config/application.properties": {

    "message": "Hello Git!"

},
"applicationConfig: [classpath:/application.properties]": {

    "message": "Hello World!"

},
```

A Config Server healthcheck szolgáltatása (http://localhost:8888/actuator/health) is tökéletesen mutatja, hogy milyen repository-kat ismer:

```json
configServer": {
    "status": "UP",
    "repositories": [
        {
            "sources": [
                "file:///home/vicziani/Downloads/szakmainap/config/application.properties"
            ],
            "name": "app",
            "profiles": [
                "default"
            ],
            "label": "master"
        }
    ]
}
```

Amennyiben nem Spring Boot klienst használunk, a Config Server képes properties, és yaml formátumokban is kiszolgálni a kéréseket, a következő címek használatával:

    http://localhost:8888/application-default.properties
    http://localhost:8888/application-default.yaml

Természetesen Git repository-t használva képesek vagyunk kiszolgálni több alkalmazást, vagy ugyanazon alkalmazás több példányát is (egy, de akár több repo-t használva is). Az adott példánál maradva legyen az, hogy az alkalmazást telepítjük teszt környezetben is, a hozzá tartozó konfigurációkat tartalmazza a Git repository-ban az `application-test.properties` állomány. Ekkor látható, hogy a `http://localhost:8888/application/test` címen már bejön az új property. A klienst indítsuk a `test` profile-lal, ehhez elegendő ezt parancssorban definiálni a `-Dspring.profiles.active=test` paraméterezéssel. Az alkalmazást újraindítva látható, hogy már az új paramétert vette fel.

A Config Server képes a jelszavak titkosított tárolására is. Példánkban alkalmazzunk egy szimmetrikus kulcsú titkosítást. Ehhez egyrészt meg kell adni a kulcsot, másrészt telepíteni kell a JCE Unlimited Strength Jurisdiction Policy [állományokat](http://www.oracle.com/technetwork/java/javase/downloads/index.html) - ez utóbbi az amerikai exportkorlátozások feloldására. A kulcs megadása a Config Server `application.properties` állományában kell megadni `encrypt.key` értékkel. A sikeres beállítás a `http://localhost:8888/encrypt/status` címen ellenőrizhető. Amennyiben ez nincs megadva, a következő hibaüzenetet kapjuk:

```json
{"description":"No key was installed for encryption service","status":"NO_KEY"}
```

Amennyiben a licensz nincs jól telepítve, a következő exception jelenik meg.

    java.security.InvalidKeyException: Illegal key size
	at javax.crypto.Cipher.checkCryptoPerm(Cipher.java:1039) ~[na:1.8.0_71]

A jelszavak titkosítása ezután elég érdekes módon történik, a Config Server biztosít egy `/encrypt` címet, erre kell elküldeni POST metódussal a jelszót, és visszaadja titkosítva. A következő parancs használható:

    curl localhost:8888/encrypt -d 'Hello Secret!'

A visszaadott érték a Git repository-ban a properties fájlba a `{cipher}` előtaggal kerüljön.

    message = {cipher}24768144acc70fcd738c5a5bbf8c8fc9a9b53ca1de2cf1a4ba0ad4e9b0d5eeb4

A Spring Cloud Config legérdekesebb tulajdonsága azonban a konfigurációk újratöltése. Ez gyakorlatilag azon Spring beanekre vonatkozik, melyen szerepel a `@RefreshScope` annotáció. Ez amúgy a `spring-cloud-context` artifactban van. A kliensben megjelent egy `http://localhost:8080/refresh` szolgáltatás, mely meghívására újratölti az értékeket, ezt kell POST metódussal meghívni.

    curl -X POST http://localhost:8080/refresh

Ez a háttérben úgy működik, hogy a Spring húz egy AOP proxy-t a bean köré, melynek azután delegálja a hívásokat. A refresh hatására törli belső bean referenciáját, és a beanre (azaz a proxy-ra) érkező következő hívásnál újra példányosítja azt, és elvégzi az új konfigurációval a dependency injectiont. Ez szépen látszódik, hogy a következő hívásnál a beanen meghívásra kerülnek a `@PostConstruct` annotációval ellátott metódusok.

Ahhoz, hogy a Config Serveren történt változások is automatikusan eljussanak a kliensekhez, egy sokkal bonyolultabb infrastruktúrát kell biztosítani. Szükséges egy message oriented middleware, mely a publish és subscribe modellt is meg tudja valósítani. Amennyiben konfigurációs változás történt, a Server egy üzenetet küld az összes kliensnek, melyre azok fel vannak iratkozva, és az üzenet hatására újraolvassák a konfigurációt. Ezen modell megvalósítására való a [Spring Cloud Bus](https://cloud.spring.io/spring-cloud-bus/), egy pehelysúlyú message broker, ami azonban egyelőre AMQP brókerekhez tartalmaz kapcsolódási lehetőséget, jelenleg Rabbit MQ-hoz és Kafkához.

Telepítsünk tehát először egy Rabbit MQ-t. Ez Erlangban implementált, ezért az is szükséges hozzá.

    sudo apt-get install erlang erlang-doc

A RabbitMQ-t [letöltés](https://www.rabbitmq.com/download.html) után csak ki kell csomagolni, és a `sbin/rabbitmq-server` parancs hatására villámgyorsan elindul.

A szerveren fel kell venni a `org.springframework.cloud:spring-cloud-config-monitor` függőséget, mely figyeli a konfiguráció változást, valamint a `org.springframework.cloud:spring-cloud-stream-binder-rabbit` a Rabbit MQ-hoz való integrációhoz. A szervert újraindítva ilyen érdekes üzenetek jelennek meg a naplóban:

    2016-09-04 21:03:12.095  INFO 25005 --- [           main] o.s.a.r.c.CachingConnectionFactory       : Created new connection: SimpleConnection@5fb3111a [delegate=amqp://guest@127.0.0.1:5672/, localPort= 36798]
    2016-09-04 21:03:12.264  INFO 25005 --- [           main] o.s.c.c.m.FileMonitorConfiguration       : Monitoring for local config changes: [/home/jtechlog/config]

Semmit nem kell konfigurálni, alapból megtalálja az alapértelmezett konfigurációval indított Rabbit MQ-t.

Egyrészt látszik, hogy csatlakozott a Rabbit MQ-hoz, valamint figyeli a konfiguráció változását a fájlrendszerben. Amennyiben távoli Git repository-ban vannak a konfigurációs fájlok, be kell konfigurálni egy web hookot, mely a `http://localhost:8888/monitor` címre posztol változás esetén. Erre most nincs szükség.

Kliens oldalon elég a `org.springframework.cloud:spring-cloud-starter-bus-amqp` függőség felvétele. Újraindítva azt tapasztalhatjuk, hogy amennyiben változtatjuk a konfigurációt, az automatikusan érvényre jut.

Ha egy kicsit meg akarjuk érteni, mi történik, kapcsoljuk be, hogy a kliens trace-elje a Spring Cloud Bustól kapott üzeneteket. Ez az `application.properties`-ben megadható a `spring.cloud.bus.trace.enabled = true` megadásával. Valamint kell egy trace implementáció is, a következőt használhatjuk a `ClientApplication` osztályban:

```java
@Bean
public TraceRepository traceRepository() {
	InMemoryTraceRepository inMemoryTraceRepository = new InMemoryTraceRepository();
	inMemoryTraceRepository.setCapacity(10);
	return inMemoryTraceRepository;

}
```

Ekkor a `http://localhost:8080/trace` címen nyomon követhetjük a http hívásokat, de busról származó üzeneteket is.

Végül implementáljunk egy admin alkalmazást, mely képes nyomon követni a Spring Bootos alkalmazásainkat. Ehhez a spring-boot-admin projektet használjuk, mely Spring Bootra épít, AngularJS felülettel. Ehhez megint generáljunk egy projektet, most csak a Web függőséggel, és adjuk hozzá két függőséget: `de.codecentric:spring-boot-admin-server:1.4.1` és `de.codecentric:spring-boot-admin-server-ui:1.4.1`. Az `application.properties` fájlban írjuk át, hogy a `8081`-es porton fusson (`server.port = 8081`). Az `AdminApplication` osztályban használjuk az `@EnableAdminServer` annotációt.

A szerver és kliens alkalmazásokban fel kell venni a `de.codecentric:spring-boot-admin-starter-client:1.4.1` függőséget, valamint az `application.properties` fájlban az admin alkalmazás elérését: `spring.boot.admin.url = http://localhost:8081`.
