---
layout: post
title: Java, Spring Boot natív fordítás
date: "2026-01-03T10:00:00.000+01:00"
author: István Viczián
description: Hogy kell egy Java, akár webes alkalmazást natívra fordítani GraalVM segítségével? Milyen buktatók lehetnek, és mi a megoldásuk?
---

## Bevezetés

Cloudban egy viszonylag kevés erőforrással rendelkező virtuális gépen futtatok egy Spring Boot alkalmazást.
(Ez amúgy a [Learn web services](https://www.learnwebservices.com/) oldalamhoz készült példa alkalmazás,
mely CXF keretrendszerrel SOAP-os webszolgáltatást biztosít.)
Sajnos többször elfogyott a memória, így választhattam, hogy vagy natív binárist készítek belőle,
és bízom benne, hogy kevesebb memóriát foglal, vagy váltok egy erősebb gépre.

Gondoltam itt az alkalom, hogy élesben kipróbáljam, hogy mit nyújt a GraalVM,
beváltja-e a hozzá fűzött reményeket. Külön érdekelt, hogy lesz-e gond a CXF
keretrendszerrel, melynek nincs GraalVM támogatása. Már most elárulom, a natív bináris
hetek óta fut gond nélkül.

<!-- more -->

## Hello World

A GraalVM egy többnyelvű futtatókörnyezet és fordítóplatform. Egyik legismertebb funkciója
a Native Image (ne keverjük össze, itt nem konténerizációról van szó), mely képes Java
alkalmazásból natív binárist készíteni. A folyamat neve ahead-of-time compilation,
ami arra utal, hogy futtatás előtt fordul natív kóddá. (Hiszen klasszikus JVM esetén is 
van natívvá fordítás, melyet a JIT, azaz Just in time compiler végez futáridőben).
Az GraalVM-mel lefordított alkalmazás gyorsabban indul és kevesebb memóriát
is fogyaszt, így ideális cloud környezetben. Hátránya, hogy a build
ideje jóval több, és problémák lehetnek a reflectionnel és fájlbeolvasással.

Mivel Windowson a Visual Studio Build Tools with the Windows 11 SDK vagy a 
Visual Studio with the Windows 11 SDK telepítésére is szükség van, ezért inkább
Linuxon próbálkoztam, WSL-ben futó Ubuntu 22 virtuális gépen. 
(Régebben megcsináltam Windowson is, ott is működött.)

A GraalVM használatához először telepíteni kell. Ehhez az [SDKMAN!](https://sdkman.io/)
eszközt használtam, mellyel nagyon egyszerű különböző SDK-kat telepíteni, és
közöttük váltani.

Az SDKMAN! telepítése:

```shell
$ curl -s "https://get.sdkman.io" | bash
```

Majd a GraalVM telepítése:

```shell
$ sdk install java 21.0.9-graal
```

Mivel több SDK is lehet a gépen, ezek között könnyen lehet váltani, ehhez a következő
parancsot használtam:

```shell
$ sdk use java 21.0.9-graal
```

Megjegyzem, hogy parancssorban működik Tabbal az automatikus kiegészítés.

Utána ellenőriztem, hogy tényleg a megfelelő JDK-t használom-e.

```shell
$ java -version

java version "21.0.9" 2025-10-21 LTS
Java(TM) SE Runtime Environment Oracle GraalVM 21.0.9+7.1 (build 21.0.9+7-LTS-jvmci-23.1-b79)
Java HotSpot(TM) 64-Bit Server VM Oracle GraalVM 21.0.9+7.1 (build 21.0.9+7-LTS-jvmci-23.1-b79, mixed mode, sharing)
```

Natív binárist a `native-image` eszközzel lehet készíteni.
Először egy Hello World alkalmazást (`hello.HelloMain` osztályt) készítettem Maven projektként, és a `target/classes`
könyvtárban kiadtam a következő parancsot:

```shell
$ cd target/classes
$ native-image hello.HelloMain
```

A következő hibaüzenetet kaptam:

```
========================================================================================================================
GraalVM Native Image: Generating 'hello.hellomain' (executable)...
========================================================================================================================
[1/8] Initializing...
                                                                                    (0.0s @ 0.06GB)
Error: Default native-compiler executable 'gcc' not found via environment variable PATH
Error: To prevent native-toolchain checking provide command-line option -H:-CheckToolchain
------------------------------------------------------------------------------------------------------------------------
                        0.2s (7.0% of total time) in 10 GCs | Peak RSS: 0.50GB | CPU load: 4.84
========================================================================================================================
Finished generating 'hello.hellomain' in 1.6s.
```

A hibaüzenet egyértelműen fogalmaz, nem telepítettem fel a gcc (GNU Compiler Collection) eszközt, azaz a 
C fordítót.

Ez Ubuntun a következő paranccsal telepíthető:

```shell
$ sudo apt-get install build-essential zlib1g-dev
```

Az új build 40 mp-ig tartott, és előállt a 6,5 megás natív bináris, és futtatható is volt.

```shell
$ ls -la

-rwxrwxrwx 1 iviczian iviczian 6547424 Nov 10 19:50 hello.hellomain

$ ./hello.hellomain 

Hello World!
```

## Maven build

Persze van Maven és Gradle plugin is. 
A projekt [elérhető a GitHubon](https://github.com/vicziani/jtechlog-graalvm).
A következő kódrészletet illesztettem a `pom.xml` fájlba:

```xml
<profiles>
    <profile>
        <id>native</id>
        <build>
            <plugins>
                <plugin>
                    <groupId>org.graalvm.buildtools</groupId>
                    <artifactId>native-maven-plugin</artifactId>
                    <version>0.11.2</version>
                    <extensions>true</extensions>
                    <executions>
                        <execution>
                            <id>build-native</id>
                            <goals>
                                <goal>compile-no-fork</goal>
                            </goals>
                            <phase>package</phase>
                        </execution>
                        <execution>
                            <id>test-native</id>
                            <goals>
                                <goal>test</goal>
                            </goals>
                            <phase>test</phase>
                        </execution>
                    </executions>
                    <configuration>
                        <imageName>hello</imageName>
                        <mainClass>hello.HelloMain</mainClass>
                        <verbose>true</verbose>
                    </configuration>
                </plugin>
            </plugins>
        </build>
    </profile>
</profiles>
```

A build a következő paranccsal futtatható:

```shell
$ ./mvnw -Pnative package
```

A `target` könyvtárban előáll a `hello` natív bináris, és a következő paranccsal futtatható.

```shell
$ ./hello
```

## Reflection

Probléma a reflectionnel, erőforrás állományokkal szokott lenni,
valamint azokkal a keretrendszerekkel és könyvtárakkal, mely ilyeneket használnak.

Először megpróbáltam reflectionnel beolvasni egy osztályt és egy fájlt:

```java
public String sayHello() throws Exception {
    var clazz = Class.forName("hello.HelloService");
    var instance = clazz.getDeclaredConstructor().newInstance();
    return clazz.getMethod("sayHello").invoke(instance).toString();
}

public String readFile() {
    try (var reader = new BufferedReader(new InputStreamReader(HelloMain.class.getResourceAsStream("/hello.txt")))) {
        return reader.readLine();
    }
}
```

Érdekes, hogy a forrásban így szereplő hivatkozásokat a fordító
megtalálta, és belekerült a natív binárisba is az osztály és az
erőforrás fájl.

Akkor viszont egy trükköt kell alkalmazni, méghozzá az osztály
neve és a fájl neve csak futás közben derüljön ki.

```java
new StringBuilder("ecivreSolleH.olleh").reverse().toString()

new StringBuilder("txt.olleh/").reverse().toString()
```

Így már kaptam a várt `ClassNotFoundException` és `NullPointerException` kivételeket.

## Tracing Agent

A fordítónak meg lehet mondani JSON metaadatokban, hogy
milyen osztályok és fájlok kerüljenek be a futtatható natív binárisba.
Meg lehet ezeket kézzel is írni, de egyszerűbb, ha a még natívvá nem fordított alkalmazás futtatása közben aktiváljuk a Tracing Agentet, és ez rögzíti a használt osztályokat és fájlokat.

Ha viszont elég nagy tesztlefedettségünk van, ennek futtatása közben is bekapcsolhatjuk. Ezt egy új Maven profile-ban adtam meg:

```xml
<profile>
    <id>native-agent</id>
    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-surefire-plugin</artifactId>
                <version>3.5.4</version>
                <configuration>
                    <argLine>
                        -agentlib:native-image-agent=config-output-dir=target/native-image/META-INF/native-image
                    </argLine>
                </configuration>
            </plugin>
        </plugins>
    </build>
</profile>
```

Futtatás:

```shell
./mvnw -Pnative-agent test
```

Ez létrehoz pár fájlt a `target/native-image` könyvtárba.
Láthatjuk, hogy a `reflect-config.json` fájl tartalmazza
a következő bejegyzést:

```json
{
  "name":"hello.HelloService",
  "methods":[{"name":"<init>","parameterTypes":[] }, {"name":"sayHello","parameterTypes":[] }]
},
```

Valamint a `resource-config.json` fájl a következőt:

```json
{
    "pattern":"\\Qhello.txt\\E"
},
```

A teljes `META-INF` könyvtárat át kell másolni a `/src/main/resources/META-INF` helyre, majd újra lehet buildelni az
alkalmazást. Most már fog futni.

## Reachability Metadata Repository

Azért, hogy ezt különböző keretrendszereknél és könyvtáraknál ne kelljen plusszban megcsinálni, kialakítottak egy [GraalVM Reachability Metadata Repository-t](https://github.com/oracle/graalvm-reachability-metadata).

Itt keretrendszerenként előállították ezeket a fájlokat, méghozzá nagyon hasonló módon, a tesztek lefuttatásával. És az eredményt feltöltötték ebbe a repository-ba.

A GraalVM [Frameworks Ready for Native Image](https://www.graalvm.org/native-image/libraries-and-frameworks/) oldalán fel vannak sorolva a támogatott keretrendszerek. Többnél is meg van jelölve,
hogy szükség van a Reachability Metadata Repository-ra.

De sajnos a CXF, ami az alkalmazásomban van, nem szerepel ezen a listán, és a repository-ban sem.

## Spring Boot

Ahogy a [Spring Boot 3 újdonságai](/2022/09/13/spring-boot-3.html)
posztomban írtam, a Spring Boot 3 kiemelten támogatja a GraalVM-et is.

Ehhez egyrészt függőségként fel kell venni a `native-maven-plugin`
plugint.

```xml
<plugin>
    <groupId>org.graalvm.buildtools</groupId>
    <artifactId>native-maven-plugin</artifactId>
</plugin>
```

Majd buildelhető az alkalmazás:

```shell
$ ./mvnw -Pnative native:compile
```

Látható, hogy build közben ez is használja a repository-t:

```
[INFO] --- native:0.11.3:add-reachability-metadata (add-reachability-metadata) @ hello-spring-boot ---
[INFO] [graalvm reachability metadata repository for ch.qos.logback:logback-classic:1.5.22]: Configuration directory not found. Trying latest version.
[INFO] [graalvm reachability metadata repository for ch.qos.logback:logback-classic:1.5.22]: Configuration directory is ch.qos.logback/logback-classic/1.4.9
[INFO] [graalvm reachability metadata repository for org.apache.tomcat.embed:tomcat-embed-core:11.0.15]: Configuration directory not found. Trying latest version.
[INFO] [graalvm reachability metadata repository for org.apache.tomcat.embed:tomcat-embed-core:11.0.15]: Configuration directory is org.apache.tomcat.embed/tomcat-embed-core/10.0.20
[INFO] [graalvm reachability metadata repository for commons-logging:commons-logging:1.3.5]: Configuration directory is commons-logging/commons-logging/1.2
```

A build nálam több, mint 4 percig tartott. A Spring Boot 4 esetén csak Java 25 használható, ellenkező esetben a következő hibaüzenetet kaptam.

```
Application run failed
org.springframework.boot.SpringApplication$NativeImageRequirementsException: Native Image requirements not met. Native Image must support at least Java 25 but Java 17 was detected
```

Történhet a natív fordítás Docker konténerben is. Ekkor a következő parancsot kell kiadni:

```shell
$ ./mvnw -Pnative spring-boot:build-image
```

Ekkor egy olyan Docker image jön létre, mely natív binárist tartalmaz.

## Spring Boot, Tracing Agent és a CXF

A [Learn web services server](https://github.com/vicziani/learnwebservices-server) alkalmazásnál, melynek van CXF függősége, az agenttel szintén összegyűjtöttem a metadatokat, és a build ezek felhasználásával történik. Az integrációs teszteket a `maven-failsafe-plugin` futtatja. Ha a tesztek futtatását `native-agent` profile-lal indítom, használja a Tracing Agentet. Ez a `target/native-image` könyvtárba összeszedi a metaadatokat. Ennek tartalmát átmásoltam a `src\main\resources` könyvtárba.

Ezután már tudok natív binárist fordítani.

Végül beállítottam, hogy a GitHub Action egy natív binárist tartalmazó
Docker image-et is gyártson le.

És akkor egy kis összehasonlítás:

```
$ docker images
                                                                                                                                            i Info →   U  In Use
IMAGE                                             ID             DISK USAGE   CONTENT SIZE   EXTRA
vicziani/lwsapp:dev-latest                        e72261546d21        740MB          241MB    U
vicziani/lwsapp:dev-native-latest                 619bc722c4f1        236MB         59.6MB
```

```
$ docker run -d -p 8080:8080 --name my-lwsapp vicziani/lwsapp:dev-latest

Started LearnWebservicesApp in 5.005 seconds (process running for 5.629)

$  docker run -d -p 8081:8080 --name my-lwsapp-native vicziani/lwsapp:dev-native-latest

Started LearnWebservicesApp in 0.45 seconds (process running for 0.606)
```

```
$ docker stats --no-stream

CONTAINER ID   NAME               CPU %     MEM USAGE / LIMIT     MEM %     NET I/O         BLOCK I/O      PIDS
79380837f9ad   my-lwsapp          0.33%     298.4MiB / 18.95GiB   1.54%     1.35kB / 126B   84MB / 217kB   48
0debb66baa54   my-lwsapp-native   0.02%     68.7MiB / 18.95GiB    0.35%     586B / 126B     0B / 0B        19
```

Látható, hogy a natív binárist tartalmazó image sokkal kisebb, a konténer gyorsabban indul, és kevesebb memórát fogyaszt.

## Swing és a natív fordítás

Bevallom, megpróbálkoztam egy Swinges, grafikus felhasználói felülettel rendelkező
vastag kliens alkalmazás natívra fordításával is, de sajnos sikertelenül.