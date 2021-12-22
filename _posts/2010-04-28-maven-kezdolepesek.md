---
layout: post
title: Maven kezdőlépések
date: '2010-04-28T23:44:00.007+02:00'
author: István Viczián
tags:
modified_time: '2021-12-20T10:00:00.000+01:00'
---

Frissítés: 2021. december 20.

### Bevezetés

Ebben a posztban egy rövid bevezetőt találsz a Mavennel kapcsolatban.
Nem magyarázom a fogalmakat, csupán jelzem, hogy mely fogalmakat kell ismerni.

A Mavennel kapcsolatban a legtöbbet megfogalmazott kritika az, hogy a
tanulási görbéje nem elég meredek, azaz ahhoz, hogy jól használjuk,
sokat kell tudni róla. Ezt tükrözik sajnos a publikus repository-kban
található silány minőségű artifactok is, amiből látszik, hogy ugyan
sokan használják a Mavent, de kevesen ismerik. Ezzel azonban a többi
fejlesztő dolgát keserítik meg.

### Források

Ezért azt javaslom, hogy amennyiben valaki Mavent akar használni,
és `pom.xml`-t akar írni,
egy-két bevezető jellegű cikk után olvasson el két könyvet. 

Egyik a [Maven by Example](https://books.sonatype.com/mvnex-book/reference/index.html),
a másik a [Maven: The Complete Reference](https://books.sonatype.com/mvnref-book/reference/index.html),
mely a Sonatype-nál ingyen elolvasható, és egyik szerzője Jason Van Zyl, a Maven megalkotója.

<a href="/artifacts/posts/2010-04-28-maven-kezdolepesek/sonatype_maven_the_complete_reference_b.png" data-lightbox="post-images">![Kép leírása](/artifacts/posts/2010-04-28-maven-kezdolepesek/sonatype_maven_the_complete_reference.png)</a>


Sonatype-nak ezen kívül magyar vonatkozása is van, hiszen a Nexus
elődjét Cservenák Tamás fejlesztette Proximity néven, és eztán kérte fel
a Sonatype, hogy készítsen egy hasonló terméket, Nexus néven.

### Fogalmak

A Maven definíció szerint "software project management and comprehension
tool". Tehát nem egy egyszerű build tool, melyben az Anthoz hasonlóan
leírjuk az egymás utáni lépéseket, hanem annál sokkal fejlettebb,
magasabb szintű megoldás. Alapja a project object model (POM), melyet
XML-ben leírva tudunk megadni (`pom.xml`), és ez alapján a Maven képes
további leírások nélkül elvégezni a build folyamatot, különböző
riportok, dokumentációk, gyakorlatilag a teljes projekt website-jának
legenerálását. A Maven nem titkolt célja, hogy a Java fejlesztők körében
egyfajta szabvány legyen, mely a konvenciók megtartását előnybe helyezi
az egyéni konfigurációkkal szemben (convention over configuration).
Sajnos a Javaban nincs szabvány arra, hogy hogyan kell
egy projektet felépíteni, a Maven ezt az űrt próbálja betölteni. Azaz ha
tartjuk magunkat egy projekt struktúrához, azaz a különböző
állományainkat a megfelelő könyvtárakban helyezzük el, a Maven képes lesz
elvégezni a build folyamatot, a források lefordítását, a különböző
erőforrás állományok megfelelő helyre másolását, és az alkalmazásunk
összecsomagolását.

A Maven alapfogalma a projekt, mely a koordináták alapján van
azonosítva, melyek a következők: groupId, artifactId, version,
packaging, classifier. Pl. a Log4J esetén a groupId `log4j`,
artifactId `log4j` és a version `1.2.16`. A többi megadása opcionális. A groupId
megadásánál elterjedt az egyedi azonosítás miatt a domain név megadása,
mint a Java package-eknél (pl. `org.springframework`). A projektek
egymástól öröklődhetnek, valamint van lehetőség több modulból álló
projektek megadására is (mindegyik modul saját `pom.xml`-lel). A
`pom.xml`-ben lehet megadni a projektre jellemző olyan információkat is,
mint a licence, szervezet, fejlesztők, közreműködők, valamint olyan
fejlesztési környezet információkat is, mint a verziókezelő, issue
management, continuous integration eszköz elérése, stb. Ráadásul a
projektre jellemző POM, az ún. effective POM több részből épül fel.
Egyrészt a Super POM, mely a Maven adott verziójának a része, a szülő POM-jából,
valamint a projekthez tartozó POM-ból aggregálva.

A Maven nagy előnye ezen kívül, hogy beépített mechanizmus van a
különböző projekt függőségek definiálására és feloldására (pl. tranzitív
függőség, A projekt függ B-től, B projekt függ C-től, akkor a C-re is
szükség van). Itt fontos ismerni a scope fogalmát. Sokat segíthet a
függőségi fa kirajzolása. A függőségek megadásánál használhatunk pontos
verziószámokat, de akár verzióintervallumokat is (range). Megadhatóak
opcionális függőségek is, melyeket nem muszáj igénybe vennünk.

A Maven build folyamat kimenetele az artifact. Ezen artifact 3rd party
library esetén a JAR állomány, webes alkalmazás esetén a WAR állomány,
nagyvállalati alkalmazás esetén az EAR állomány, stb. A Maven
megkülönbözteti a release és snapshot fogalmát, ahol az előző a kiadható
verzió, míg az utóbbi a fejlesztés közben használatos verzió.

Az artifactokat egy központi helyen, ún. repository-ban helyezi el,
hierarchikus rendben. A legtöbb kritikai itt éri a Mavent, hogy miért
is nem jó a függő library-k tárolása egyszerűen a verziókövető
rendszerben, miért kell ehhez egy külön repository-t használni. A Maven
használhat publikus repository-kat, valamint használ az adott gépen egy
lokális repository-t is, ez alapesetben a felhasználó home könyvtárának
`.m2/repository` könyvtárában található. Ezen kívül a repository
managerek elterjedésével (pl. Nexus vagy Artifactory) érdemes
kialakítani egy cégen belül használatos belső repository-t is, melyben
tárolhatóak a saját projektek állományai, valamint egyfajta proxy-ként
működnek a publikus repository-k felé. Az alapértelmezett publikus
repository a Maven Central Repository, mely elérhető a
[https://repo1.maven.org/maven2/](http://repo1.maven.org/maven2/) címen. A repository-k is
csoportosíthatók, hogy release vagy snapshot verziókat tárolnak-e.

A Maven teljesen moduláris felépítésű, minden ún. Maven pluginben van
megvalósítva. Ezen Maven pluginek is artifactok. Ezért van az, hogy a
Maven telepítőcsomagja alig pár mega, az összes többi funkcionalitást
biztosító plugint (artifact) akkor tölt le, amikor szükség van rá.
Persze emiatt az első futtatás tovább tarthat, hiszen ekkor nagy
mennyiségű artifactot kell letöltenie. A `pom.xml`-ben ezen plugineket
konfigurálhatjuk is. A pluginek tulajdonképpen összetartozó goalok
gyűjteménye, ahol egy goal egy egyedi, önmagában is futtatható funkció.
Ilyen pl. a compiler plugin `compile` goalja, ami a forrás állományok
fordításáért felelős. Valamint a Mavenben vannak definiálva ún.
életciklusok (lifecycle). Pl. build lifecycle (default), site és clean
lifecycle. Minden lifecycle fázisokból áll, és minden fázishoz
alapértelmezetten tartozik egy vagy több plugin goal. Pl. a build
lifecycle egyik fázisa `package`, mely a jar plugin `jar` goalját hívja meg
bizonyos esetekben. Persze ezt magunk személyre is szabhatjuk. Első
feladat megérteni a Maven tanulásakor, mikor kiadunk egy parancsot, mi
is fut le, milyen életciklus milyen fázis, milyen plugin milyen goalja.
A plugin-ek kaphatnak paramétereket.

A Maven előnye, hogy nagyban megkönnyíti a csapattagok kommunikációját,
valamint a fejlesztésbe bekapcsolódást, ugyanis képes kigenerálni
különböző riportokat (`pom.xml`-ben definiálandó), dokumentációt, a
projekt site-ját (természetesen nagymértékben testreszabható módon).
Ezért különösen elosztott, open source fejlesztésre különösen alkalmas.

A Mavenben vannak ún. profilok is, melyek a build folyamat
portabilitását biztosítják különböző build környezetekben. Pl. lehet,
hogy másképp kell, hogy működjön a build folyamat különböző
architektúrákon, JDK verziókon és operációs rendszereken, teszt és élest
környezetben, sőt akár különböző fejlesztőeszközök
használatakor.
Lehetőség van arra, hogy mi adjuk meg parancssorból a profilt (`-P`
kapcsolóval), de van profile activation is, ahol valamely környezeti
beállítás hatására automatikusan egy profil kerül kiválasztásra.

A másik érdekesség az assembly-k használata. A Maven beépítetten ismeri
a gyakoribb csomagolási módokat, a packagingtől függően JAR, WAR, EAR
(`bin`). Képes arra is, hogy olyan distributiont készítsen, amibe bele
vannak csomagolva a függő osztályok is (`jar-with-dependencies`), valamint
képes a teljes projektet becsomagolni (`project`), valamint csak a
forráskódot kiadni (`src`). Ezen kívül saját assembly-t is definiálhatunk
assembly descriptor megadásával.

A Mavenben a személyes kedvencem az archetype. Az archetype egy projekt
sablon, melyből létre lehet hozni egy üres projektet különböző
paraméterek megadásával. Ha gyakran indítunk projektet, érdemes egy
ilyent gyártanunk, mely a megfelelő kiindulási alapot biztosítja. Vannak
beépített archetype-ok is, ezelből is sok ötletet lehet meríteni. Ezek
is artifactok, azaz a repository-ban is elhelyezhetők.

A Mavenben ezen kívül lehetőség van saját pluginek implementálására
is. Egy goalt egy mojo-ban implementálhatunk (Maven plain Old Java
Object). Egy plugin mojo-k gyűjteménye.

A Maven könnyen integrálható az összes continuous integration eszközzel.

### Tippek és személyes tapasztalatok

Ide a személyes tapasztalataimat próbálom összegyűjteni, és azokat a
problémákat és megoldásaikat, melyekkel egy Maven felhasználó először
találkozik. Ezek egy részével a
[FAQ](http://maven.apache.org/general.html) is foglalkozik.

#### Java verzió

Alapesetben a Maven compiler plugin a Java 1.4-re fordít, ahhoz, hogy az
1.5 újdonságait ki tudjuk használni, át kell ezt állítani, pl. az
1.6-os verzióra a `pom.xml`-ben. Ezt a property-t felolvassa a Maven
compiler plugin.

```xml
<properties>
  <maven.compiler.source>1.6</maven.compiler.source>
  <maven.compiler.target>1.6</maven.compiler.target>
</properties>
```

#### Kevés memória

Amennyiben a Maven build vagy site generálás hibát dob
(`java.lang.OutOfMemoryError: Java heap space`), hogy nincs elég memória,
akkor be kell állítanunk a `MAVEN_OPTS` környezeti változót.

```
MAVEN_OPTS="-Xmx1024m -Xms512m"
```

#### Karakterkódolás

Az ékezetes karakterek használata itt is problémát okoz, így hogy ezt
elkerüljük, mindenütt deklarálni kell a karakterkódolást. Javasolt az
UTF-8 használata.

```xml
<properties>
  <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
</properties>
```

Ezt a property-t szintén felolvassa a Maven compiler plugin.

Amennyiben nem adjuk meg, a Maven
warningot ír, hogy nincs megadva a karakterkódolás, emiatt a build
környezetfüggő, mert az operációs rendszer default kódolását használja.

#### Hiányzó artifact

Amennyiben egy artifact hiányzik a repository-ból, a következő
paranccsal tudjuk oda installálni:

```shell
mvn install:install-file
  -Dfile=
  -DgroupId=
  -DartifactId=
  -Dversion=
  -Dpackaging=
  -DgeneratePom=true
```

Azaz pl az Oracle jdbc driver esetén:

```shell
mvn install:install-file
  -Dfile=ojdbc6-11.2.0.1.0.jar
  -DgroupId=com.oracle
  -DartifactId=ojdbc6
  -Dversion=11.2.0.1.0
  -Dpackaging=jar
  -DgeneratePom=true
```

Utána persze ezen koordinátákkal kell hivatkozni rá a függőség
megadásánál.

#### Debug mód

Futtassuk a Mavent a `-X` kapcsolóval.

#### Teszt esetek

A Maven Surefire pluginja tud futtatni JUnit és TestNG
teszt eseteket is. A kizárólag teszteléshez szükséges függőségeket `test`
scope-pal kell elhelyezni a függőségek között. Meg lehet adni, hogy
amennyiben egy teszt eset hibázik, a build még folytatódjon
(Surefire plugin `testFailureIgnore` tulajdonsága). Valamint azt is
meg lehet adni, hogy ne futtassa le a teszt eseteket
(`–Dmaven.test.skip=true` vagy `-DskipTests=true` parancssori kapcsolóval,
de a `pom.xml`-ben is megadható Surefire plugin `skipTests` property-jének
állításával). Ha csak egy teszt esetet akarunk futtatni, használjuk a
`-Dtest=MyTest` kapcsolót (csomag megadása nélkül).

#### Artifact neve

Alapesetben a Maven artifact neve a koordinátákból jön, azonban war
állomány esetén ez nem lenne szerencsés, így felüldefiniálható a `pom.xml`-ben
a `finalName` taggel.

#### Riportok generálása

A site lifecycle része a riportok generálása is. Azonban, ha mi a site
többi részére vagyunk kíváncsiak, és nem akarjuk a riportokat
kigeneráltatni, akkor ezt megtehetjük a `-DgenerateReports=false`
kapcsoló használatával.

#### Repository manager

Egy cégen belül mindenképp alkalmazzunk repository manager eszközt. Ez
egyrészt tartalmazza a saját artifactjainkat, másrészt egy proxy a
publikus repositry-k felé. Webes felületen menedzselhetőek (artifact
keresés és feltöltés), valamint mindenféle jogosultsági szinteket tudunk
megadni, és képesek archiválni a repository-t. Érdemes az Artifactory és
a Nexus közül választani.

#### Log4j 1.2.15

A repository-k minőségét jellemzi a Log4J 1.2.15 verziója, melyben a
`javax.mail:mail`, `javax.jms:jms`, `com.sun.jdmk:jmxtools` és a
`com.sun.jmx:jmxri` artifactok kötelező függőségként voltak megadva. Ezen
jar-ok használata pedig nem kötelező, csak akkor szükséges, ha a
hozzájuk tartozó megfelelő appendereket akarjuk használni, a JMX meg
már része a JDK-nak. Szerencsére ezt azóta
[javították](http://svn.apache.org/viewvc?view=revision&revision=575804).

#### IDE integráció - NetBeans

A Maven NetBeans integrációját gyakran használtam, és igen jónak tartom,
nem ütköztem vele problémába. Kicsit féltem tőle, mert elsődleges
szempont a gyors fejleszt-tesztel iterációs ciklus, és régebbi verzióval
voltak gondjaim. Most ilyenről nem számolhatok be. Nem jelentősen
lassabb a beépített Antra épülő build folyamatnál, hiszen mindegyik egy
külső, megfelelően integrált eszköz. A
[MavenBestPractices](http://wiki.netbeans.org/MavenBestPractices) cikk
rengeteg jó tanácsot ad a NetBeans felhasználóknak.

#### IDE integráció - Eclipse

Az Eclipse esetén az [m2eclipse](http://m2eclipse.sonatype.org/)
hatékonyságáról hallottam rossz híreket, különösen nagy, több modulból
álló projektek esetén, így azt nem próbáltam, helyette a
[maven-eclipse-plugin
plugin](http://maven.apache.org/plugins/maven-eclipse-plugin/)-t
használtam, mely a POM alapján képes módosítani az Eclipse projekt
állományokat. A recept egyszerű:

-   Hozzuk létre az Eclipse workspace-t
-   A `mvn eclipse:configure-workspace -Declipse.workspace=C:/workspace`
    paranccsal konfiguráljuk a workspace-t (a
    `C:\workspace\.metadata\.plugins\org.eclipse.core.runtime\.settings\org.eclipse.jdt.core.prefs`
    állományban létrehoz egy
    `org.eclipse.jdt.core.classpathVariable.M2_REPO=C:\Documents and Settings\jtechlog\.m2\repository` bejegyzést, szóval
    létrehoz egy `M2_REPO` változót, mely a repository helyére mutat)
-   A `mvn eclipse:eclipse` paranccsal generáltassuk le a projekt
    állományokat, melyekkel már megnyitható a projekt Eclipse-ben
-   Amikor webes projektet hoztam létre, még a következő konfigurációt
    is el kellett helyeznem a `pom.xml`-ben.

```xml
<plugin>
  <artifactId>maven-eclipse-plugin</artifactId>
  <configuration>
    <wtpmanifest>true</wtpmanifest>
      <wtpapplicationxml>true</wtpapplicationxml>
      <wtpversion>2.0</wtpversion>
  </configuration>
</plugin>
```

Számomra meglepően jól működött az, hogyha változott a `pom.xml`-ben valami,
csak újrafuttattam az `eclipse:eclipse goal` parancsot, majd az Eclipse-ben
újraolvastattam a projektet. Ha a NetBeans nem Ant alapú lenne, ott is
jobban preferálnám ezt a módot.

#### Code complete

Különösen meglepő volt számomra, hogy mind a NetBeansben, mint az
Eclipse-ben elérhető a `pom.xml` code complete, sőt, működik a dependency
megadásnál is, ugyanis automatikusan felajánlja az elérhető artifactok
koordinátáit. A NetBeans esetén alul a státuszsorban látszik, hogy a
hálózathoz kapcsolódik, és átviszi a repository indexét.

![Kódkiegészítés](/artifacts/posts/2010-04-28-maven-kezdolepesek/pom_code_complete_b.png)

#### Provided

Ha szükségünk van egy JAR-ra a fordításhoz, de nem akarjuk, hogy pl.
webes alkalmazásnál a WAR-ba kerüljön, mert futtatáskor a konténer úgyis
biztosítja azt a classpath-on ( ilyen pl. a `servlet.jar`, `mail.jar`, stb.),
akkor használjuk a `provided` scope-ot.

#### Hiányzó artifact

Abban az esetben, ha nem tudjuk a pontos koordinátákat a függőség
megadásakor, érdemes valamilyen keresőt használni. Nekem ezek jöttek be:

- [https://search.maven.org/](https://search.maven.org/)
- [http://mvnrepository.com](http://mvnrepository.com)

#### Létező NetBeans projektről átállás

Két projektben is a NetBeans projekt állományai mellé felvettem egy
`pom.xml`-t is, hogy a Maven bevezethető legyen, de párhuzamosan mindkét build
folyamat működjön. Ez azért körülményes, mert a könyvtárstruktúra nem a
Maven konvencióinak felel meg. A cél az volt, hogy bitre megegyező war
állományt állítson elő a NetBeans és a Maven. Az időm 90%-ában azon
dolgoztam, hogy pont azokat a JAR-okat, és pont annyit tegyen oda, mint
az eredeti projektben voltak. Az, hogy a könyvtárnevek eltértek, semmi
gondot nem okozott.

Egy kis statisztika:

<table><tbody><tr><td>Technológia:</td><td>Spring, Struts, JSP</td></tr><tr><td>JAR-ok száma az eredeti projektben:</td><td>35</td></tr><tr><td>Dependency tag-ek a POM-ban:</td><td>30</td></tr><tr><td>Exclusions tag-ek nélkül a JAR-ok száma:</td><td>62</td></tr><tr><td>Exclusions tag-ek a POM-ban:</td><td>17 (!!!)</td></tr><tr><td>Egy repository-ban sem talált JAR-ok száma, melyeket kézzel kellett telepíteni:</td><td>3</td></tr></tbody></table>

Ahhoz, hogy a NetBeanses projekt azonnal leforduljon a Mavennel is, a
következő konfigurációkat kellett a `pom.xml`-ben megtenni:

```xml
<build>
 <!-- WAR neve -->
 <finalName>app</finalName>
 <sourceDirectory>src/java</sourceDirectory>
 <plugins>
 <!-- Fentebb említett 1.6-os Java és UTF-8 kódolások -->
  <plugin>
   <groupId>org.apache.maven.plugins</groupId>
   <artifactId>maven-war-plugin</artifactId>
   <configuration>
    <warSourceDirectory>web</warSourceDirectory>
   </configuration>
  </plugin>
 </plugins>
</build>
```