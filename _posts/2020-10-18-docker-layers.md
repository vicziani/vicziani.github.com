---
layout: post
title: Docker Layers Spring Boot alkalmazásnál
date: '2020-10-18T21:00:00.000+01:00'
author: István Viczián
description: Mire figyeljünk, ha a Spring Boot alkalmazásunkat dockerizáljuk.
---

Amennyiben dockerizáljuk a Spring Bootos alkalmazásunkat, oda kell
figyelni néhány dologra. Nem elegendő ugyanis, hogy a jar
fájlunkat bemásoljuk (über jar, szép német kifejezéssel, vagy
fat jar - tehát a jar mely a függőségeket is tartalmazza).

A Docker ugyanis a hatékony adattárolás miatt egy image-et
nem egy megbonthatatlan fájlként tárol, hanem un. layerekben.
Ugyanis ha kiindulunk egy image-ből, és pl. új fájlokat másolunk,
ezzel létrehozva egy új image-et, nem tárolja el az új image-et
teljes egészében, csak a különbséget, azaz a felmásolt fájlokat.
Ez a különbség a layer. Ezzel jelentős helyet takarít meg, hiszen
a két image-ben közös fájlokat csak egyszer tárolja el. Így
persze egy image több layer fájlból épül fel.

Vegyünk egy egyszerű Spring Boot alkalmazást, és egy hozzá
tartozó `Dockerfile` fájlt.

```docker
FROM adoptopenjdk:14-jre-hotspot
WORKDIR /opt/app
COPY target/*.jar demo.jar
CMD ["java", "-jar", "demo.jar"]
```

Ebben a posztban azt fogom leírni, hogy ez miért nem jó!

Az egyszerűség kedvéért képzeljük el, hogy
ez egy olyan image, mely egy `ubuntu` image-ből
épül fel, arra épül rá az AdoptOpenJDK,
kialakítva az `adoptopenjdk` image-et, majd
arra a saját alkalmazásunk, egy JAR állománnyal, melynek
eredménye a `demo` image. Ez layer szinten elnagyoltan így néz ki.

![Docker layers](/artifacts/posts/2020-10-18-docker-layers/docker-layers.png)

Ebből az ábrából már elég szépen látható, hogy mennyi tárhelyet nyerünk,
ha az `ubuntu` és `adoptopenjdk` layer csak egyszer kerül letárolásra.
(Gondoljunk bele, ha napi több commit esetén napi több image-et hoz
létre a CI szerver.)

A probléma ott kezdődik, hogy viszont az alkalmazáshoz tartozó réteg, amiben esetleg
egy-két fájl változik, újra és újra letárolásra kerül, hiszen az mindig egy új külön réteget
hoz létre.

A Spring Boot azonban a 
[2.3.0.M2 verziótól kezdve beépített támogatást tartalmaz](https://spring.io/blog/2020/01/27/creating-docker-images-with-spring-boot-2-3-0-m1), hogy
magát az alkalmazást is több rétegre bontsuk fel.

<!-- more -->

Az alapötlet egyszerű. A 3rd party library-khoz tartozó JAR-ok, akár a Tomcat,
akár a Spring Boot JAR-jai is sokkal ritkábban változnak, mint a class
fájljaink, ezért pakoljuk át ezeket egy külön rétegbe.

Ehhez egyrészt elő kell készíteni, hogy a JAR állományunk is rétegelt legyen.
Ehhez a `spring-boot-maven-plugin` plugint kell konfigurálnunk a `pom.xml`.
fájlban.

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
            <configuration>
                <layers>
                    <enabled>true</enabled>
                </layers>
            </configuration>
        </plugin>
    </plugins>
</build>
```

Ekkor egy olyan jar jön létre, mely külön könyvtárakba képes kicsomagolni
az alkalmazás különböző részeit. Ezt a következő paranccsal érhetjük el:

```shell
java -Djarmode=layertools -jar demo.jar extract
```

Még egy trükköt fogunk alkalmazni, az un. [multi-stage buildet](https://docs.docker.com/develop/develop-images/multistage-build/).
Ezzel azt lehet elérni, hogy létrehozunk egy Docker konténert, melyben előkészítjük az alkalmazásunkat (kitömörítjük az előző paranccsal),
és ennek eredményét, a könyvtárakat külön másoljuk át a végleges konténerbe. Ez azért fog működni, mert minden egyes külön
kiadott `COPY` parancs egy külön layert fog létrehozni.

Így a `Dockerfile` a következő:

```docker
FROM adoptopenjdk:14-jre-hotspot as builder
WORKDIR app
COPY target/*.jar demo.jar
RUN java -Djarmode=layertools -jar demo.jar extract

FROM adoptopenjdk:14-jre-hotspot
WORKDIR app
COPY --from=builder app/dependencies/ ./
COPY --from=builder app/spring-boot-loader/ ./
# COPY --from=builder app/snapshot-dependencies/ ./
COPY --from=builder app/application/ ./
ENTRYPOINT ["java", \
  "org.springframework.boot.loader.JarLauncher"]
```

Az első blokk tehát létrehoz egy konténert, melybe kicsomagolja 
külön könyvtárakba a JAR állományt (`dependencies`,
`spring-boot-loader`, `snapshot-dependencies` és
`application`). Látható, hogy még a snapshot
függőségeknek is egy külön könyvtárt hoz létre. (Hiszen
gyakrabban változhatnak, mint a végleges verziójú függőségek.) 
A második blokk külön `COPY` parancsban átmásolja a
könyvtárakat, mindegyik eredményeként egy új layert hozva
létre. Látható, hogy a `snapshot-dependencies`
könyvtárhoz tartozó `COPY` megjegyzésbe van téve. Ez azért van,
mert a Docker Linuxon képes `layer does not exist` hibaüzenettel
elszállni, ha üres könyvtárat másolunk. (Az én alkalmazásomban
nem volt SNAPSHOT dependency, így ezt nem kellett másolni.)
Az alkalmazásunk így (nagyjából) a következő layerekből épül fel.

![Spring Boot layers](/artifacts/posts/2020-10-18-docker-layers/spring-boot-layers.png)

Már direkt nem egymásba ágyazva rajzoltam a rétegeket, jelezve, hogy
ezek függetlenek egymástól. Az alkalmazásom egy darab statikus html
állományt tartalmazott. Látható, hogy ebben az esetben mennyi helyet
takarítunk meg, ha csak a html állományt szerkesztjük. Buildenként
legalább 16 MB-ot. És képzeljünk el egy olyan alkalmazást, ahol
sokkal több függőség, van, akár 100 MB környékén. Ehhez képest a saját
class állományaink mérete tényleg elhanyagolható lehet.

És most nézzük végig, hogy pontosan mi is történik a háttérben.
Először induljunk ki egy Spring Bootos alkalmazásból
a http://start.spring.io oldalon, Web függőséggel.
Az `src/main/resources/static` könyvtárban helyezzünk el egy
`index.html` állományt. A buildeléshez adjuk ki a
`./mvnw package -DskipTests` parancsot. A `Dockerfile` legyen
az ebben a posztban említett első, **rossz** `Dockerfile`.
A Docker image előállításához adjuk ki a `docker build -t demo .`
parancsot.

Ekkor valami ilyesmit fogunk látni:

```shell
Sending build context to Docker daemon  16.68MB
Step 1/4 : FROM adoptopenjdk:14-jre-hotspot
 ---> 14a0e3b4f7f3
Step 2/4 : WORKDIR /opt/app
 ---> 41ba9592b425
Step 3/4 : COPY target/*.jar demo.jar
 ---> 30d8ff34aa90
Step 4/4 : CMD ["java", "-jar", "demo.jar"]
 ---> Running in 9cc7f691622f
Removing intermediate container 9cc7f691622f
 ---> 7698b9790f4f
Successfully built 7698b9790f4f
Successfully tagged demo:latest
```

Az image-hez tartozó layereket a `docker history demo`
paranccsal tudjuk lekérdezni.

```shell
e8cbe617fe62        4 minutes ago       /bin/sh -c #(nop)  CMD ["java" "-jar" "demo.…   0B                  
56864ac365e8        4 minutes ago       /bin/sh -c #(nop) COPY file:6670678da1e96212…   16.5MB              
41ba9592b425        2 weeks ago         /bin/sh -c #(nop) WORKDIR /opt/app              0B                  
14a0e3b4f7f3        3 weeks ago         /bin/sh -c #(nop)  ENV JAVA_HOME=/opt/java/o…   0B                  
<missing>           3 weeks ago         /bin/sh -c set -eux;     ARCH="$(dpkg --prin…   167MB               
<missing>           3 weeks ago         /bin/sh -c #(nop)  ENV JAVA_VERSION=jdk-14.0…   0B                  
<missing>           3 weeks ago         /bin/sh -c apt-get update     && apt-get ins…   35.7MB              
<missing>           3 weeks ago         /bin/sh -c #(nop)  ENV LANG=en_US.UTF-8 LANG…   0B                  
<missing>           3 weeks ago         /bin/sh -c #(nop)  CMD ["/bin/bash"]            0B                  
<missing>           3 weeks ago         /bin/sh -c mkdir -p /run/systemd && echo 'do…   7B                  
<missing>           3 weeks ago         /bin/sh -c [ -z "$(apt-get indextargets)" ]     0B                  
<missing>           3 weeks ago         /bin/sh -c set -xe   && echo '#!/bin/sh' > /…   745B                
<missing>           3 weeks ago         /bin/sh -c #(nop) ADD file:4974bb5483c392fb5…   63.2MB    
```

Azért látható, hogy jóval több, mint három réteg van a háttérben.
Viszont látható, hogy a JAR-t hordozó `568` kezdetű réteg kb. 17 MB.

Ha most változtatjuk az `index.html` állományt, és újra eljárjuk az esőtáncot 
(Maven és Docker build), akkor a következő lesz az eredménye:

```shell
7698b9790f4f        46 seconds ago      /bin/sh -c #(nop)  CMD ["java" "-jar" "demo.…   0B                  
30d8ff34aa90        47 seconds ago      /bin/sh -c #(nop) COPY file:ff842752b1d34e46…   16.5MB              
41ba9592b425        2 weeks ago         /bin/sh -c #(nop) WORKDIR /opt/app              0B                  
14a0e3b4f7f3        3 weeks ago         /bin/sh -c #(nop)  ENV JAVA_HOME=/opt/java/o…   0B                  
<missing>           3 weeks ago         /bin/sh -c set -eux;     ARCH="$(dpkg --prin…   167MB               
<missing>           3 weeks ago         /bin/sh -c #(nop)  ENV JAVA_VERSION=jdk-14.0…   0B                  
<missing>           3 weeks ago         /bin/sh -c apt-get update     && apt-get ins…   35.7MB              
<missing>           3 weeks ago         /bin/sh -c #(nop)  ENV LANG=en_US.UTF-8 LANG…   0B                  
<missing>           3 weeks ago         /bin/sh -c #(nop)  CMD ["/bin/bash"]            0B                  
<missing>           3 weeks ago         /bin/sh -c mkdir -p /run/systemd && echo 'do…   7B                  
<missing>           3 weeks ago         /bin/sh -c [ -z "$(apt-get indextargets)" ]     0B                  
<missing>           3 weeks ago         /bin/sh -c set -xe   && echo '#!/bin/sh' > /…   745B                
<missing>           3 weeks ago         /bin/sh -c #(nop) ADD file:4974bb5483c392fb5…   63.2MB  
```

A `41b` kezdetű layerig nem hozott létre a Docker új layert, hanem a már meglévőket hasznáta fel.
Azonban a `30d` az új JAR-t tartalmazó 17 MB-os új layer.

Nos nézzük meg ugyanezt az **helyes** `Dockerfile` használatával.

```shell
Sending build context to Docker daemon  50.08MB
Step 1/10 : FROM adoptopenjdk:14-jre-hotspot as builder
 ---> 14a0e3b4f7f3
Step 2/10 : WORKDIR app
 ---> Using cache
 ---> 5764828bedbc
Step 3/10 : COPY target/*.jar demo.jar
 ---> db86930a59d5
Step 4/10 : RUN java -Djarmode=layertools -jar demo.jar extract
 ---> Running in 992df808b7fa
Removing intermediate container 992df808b7fa
 ---> 0adad9dcf537
Step 5/10 : FROM adoptopenjdk:14-jre-hotspot
 ---> 14a0e3b4f7f3
Step 6/10 : WORKDIR app
 ---> Using cache
 ---> 5764828bedbc
Step 7/10 : COPY --from=builder app/dependencies/ ./
 ---> d99f206d05f4
Step 8/10 : COPY --from=builder app/spring-boot-loader/ ./
 ---> 7d91d24a8157
Step 9/10 : COPY --from=builder app/application/ ./
 ---> f462da7b9616
Step 10/10 : ENTRYPOINT ["java",   "org.springframework.boot.loader.JarLauncher"]
 ---> Running in bdbebbee0abe
Removing intermediate container bdbebbee0abe
 ---> ab4fe2572b78
Successfully built ab4fe2572b78
Successfully tagged demo:latest
```

Sokkal hosszabb, hiszen itt már multi-stage build van. Látszik, hogy a 6-ik
lépésig még `Using cache`, azaz a már meglévő layereket használja,
onnan a különböző könyvtáraknak külön layert hoz létre.
Mit mond a `docker history demo` parancs?

```shell
IMAGE               CREATED             CREATED BY                                      SIZE                COMMENT
ab4fe2572b78        53 seconds ago      /bin/sh -c #(nop)  ENTRYPOINT ["java" "org.s…   0B                  
f462da7b9616        53 seconds ago      /bin/sh -c #(nop) COPY dir:f2f5110fcfc7bf2e7…   4.17kB              
7d91d24a8157        12 minutes ago      /bin/sh -c #(nop) COPY dir:34fffe734ed638d06…   241kB               
d99f206d05f4        12 minutes ago      /bin/sh -c #(nop) COPY dir:a06c3500a0e17c527…   16.4MB              
5764828bedbc        12 minutes ago      /bin/sh -c #(nop) WORKDIR /app                  0B                  
14a0e3b4f7f3        3 weeks ago         /bin/sh -c #(nop)  ENV JAVA_HOME=/opt/java/o…   0B                  
<missing>           3 weeks ago         /bin/sh -c set -eux;     ARCH="$(dpkg --prin…   167MB               
<missing>           3 weeks ago         /bin/sh -c #(nop)  ENV JAVA_VERSION=jdk-14.0…   0B                  
<missing>           3 weeks ago         /bin/sh -c apt-get update     && apt-get ins…   35.7MB              
<missing>           3 weeks ago         /bin/sh -c #(nop)  ENV LANG=en_US.UTF-8 LANG…   0B                  
<missing>           3 weeks ago         /bin/sh -c #(nop)  CMD ["/bin/bash"]            0B                  
<missing>           3 weeks ago         /bin/sh -c mkdir -p /run/systemd && echo 'do…   7B                  
<missing>           3 weeks ago         /bin/sh -c [ -z "$(apt-get indextargets)" ]     0B                  
<missing>           3 weeks ago         /bin/sh -c set -xe   && echo '#!/bin/sh' > /…   745B                
<missing>           3 weeks ago         /bin/sh -c #(nop) ADD file:4974bb5483c392fb5…   63.2MB    
```

Létrejött a `d99`, `7d9`, `f46` layer, összesen ezek is 17 MB-ot tesznek ki.

Azonban miután belenyúltam az `index.html` állományba, a következő került kiírásra:

```shell
Sending build context to Docker daemon  50.08MB
Step 1/10 : FROM adoptopenjdk:14-jre-hotspot as builder
 ---> 14a0e3b4f7f3
Step 2/10 : WORKDIR app
 ---> Using cache
 ---> 5764828bedbc
Step 3/10 : COPY target/*.jar demo.jar
 ---> b8ab4c3ea04f
Step 4/10 : RUN java -Djarmode=layertools -jar demo.jar extract
 ---> Running in 20a96aa8e12d
Removing intermediate container 20a96aa8e12d
 ---> 7a1f919cadf2
Step 5/10 : FROM adoptopenjdk:14-jre-hotspot
 ---> 14a0e3b4f7f3
Step 6/10 : WORKDIR app
 ---> Using cache
 ---> 5764828bedbc
Step 7/10 : COPY --from=builder app/dependencies/ ./
 ---> Using cache
 ---> d99f206d05f4
Step 8/10 : COPY --from=builder app/spring-boot-loader/ ./
 ---> Using cache
 ---> 7d91d24a8157
Step 9/10 : COPY --from=builder app/application/ ./
 ---> e1ad63d4bbbd
Step 10/10 : ENTRYPOINT ["java",   "org.springframework.boot.loader.JarLauncher"]
 ---> Running in 61a30ff4519c
Removing intermediate container 61a30ff4519c
 ---> eb4519e26e13
Successfully built eb4519e26e13
Successfully tagged demo:latest
```

Látható, hogy itt már szinte az összes layert cache-eli, kivéve az utolsó layert, mely 
a html fájlt tartalmazza. A history:

```shell
IMAGE               CREATED             CREATED BY                                      SIZE                COMMENT
eb4519e26e13        20 seconds ago      /bin/sh -c #(nop)  ENTRYPOINT ["java" "org.s…   0B                  
e1ad63d4bbbd        20 seconds ago      /bin/sh -c #(nop) COPY dir:41e31d1d5706c11a9…   4.18kB              
7d91d24a8157        16 minutes ago      /bin/sh -c #(nop) COPY dir:34fffe734ed638d06…   241kB               
d99f206d05f4        16 minutes ago      /bin/sh -c #(nop) COPY dir:a06c3500a0e17c527…   16.4MB              
5764828bedbc        16 minutes ago      /bin/sh -c #(nop) WORKDIR /app                  0B                  
14a0e3b4f7f3        3 weeks ago         /bin/sh -c #(nop)  ENV JAVA_HOME=/opt/java/o…   0B                  
<missing>           3 weeks ago         /bin/sh -c set -eux;     ARCH="$(dpkg --prin…   167MB               
<missing>           3 weeks ago         /bin/sh -c #(nop)  ENV JAVA_VERSION=jdk-14.0…   0B                  
<missing>           3 weeks ago         /bin/sh -c apt-get update     && apt-get ins…   35.7MB              
<missing>           3 weeks ago         /bin/sh -c #(nop)  ENV LANG=en_US.UTF-8 LANG…   0B                  
<missing>           3 weeks ago         /bin/sh -c #(nop)  CMD ["/bin/bash"]            0B                  
<missing>           3 weeks ago         /bin/sh -c mkdir -p /run/systemd && echo 'do…   7B                  
<missing>           3 weeks ago         /bin/sh -c [ -z "$(apt-get indextargets)" ]     0B                  
<missing>           3 weeks ago         /bin/sh -c set -xe   && echo '#!/bin/sh' > /…   745B                
<missing>           3 weeks ago         /bin/sh -c #(nop) ADD file:4974bb5483c392fb5…   63.2MB              
```

Azaz az összes réteg ugyanaz, mint az előbb, kivéve az utolsó 4kB-os layert. A 16 MB-os
`d99` layert újrahasznosította. Ez alapján már el lehet képzelni, hogy a
layerek használatávál mennyi tárhelyet és hálózati erőforrást takarítunk meg.