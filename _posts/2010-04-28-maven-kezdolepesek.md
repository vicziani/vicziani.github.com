---
layout: post
title: Maven kezdőlépések
date: '2010-04-28T23:44:00.007+02:00'
author: István Viczián
tags:
modified_time: '2018-06-09T10:00:00.000-08:00'
---

### Bevezetés

Lassan már az összes magyar Java-val foglalkozó blogger írt
tapasztalatokat a Maven-ről, így hát én sem maradhatok ki a sorból. Túl
vagyunk egy teljes egészében Maven-nel fejlesztett projekten, egy már
létező projekt Maven-re átállításán, valamint jópár Maven oktatáson.

A blog statisztikája (Google Analytics) szerint a leglátogatottabb
cikkek a bevezető jellegű cikkek, így a Maven-ről is egy ilyent írnék,
tanácsokat egy kezdő számára, hogy merre érdemes elindulni, és néhány
trükköt, amit ismerni érdemes. Nem magyarázom a fogalmakat, csupán
jelzem, hogy mely fogalmakat kell ismerni. Amennyiben tapasztalt Maven
olvasó vagy, kérlek jelezd a comment-ek között, ha valamit rosszul
írtam, nem így használsz, vagy tipped, ötleted van.

A Maven-nel kapcsolatban a legtöbbet megfogalmazott kritika az, hogy a
tanulási görbéje nem elég meredek, azaz ahhoz, hogy jól használjuk,
sokat kell tudni róla. Ezt tükrözik sajnos a publikus repository-kban
található silány minőségű artifact-ok is, amiből látszik, hogy ugyan
sokan használják a Maven-t, de nem ismerik. Ezzel azonban a többi
fejlesztő dolgát keserítik meg.

### Források

Ezért azt javaslom, hogy amennyiben valaki Maven-t akar használni,
egy-két bevezető jellegű cikk után igenis olvasson el két könyvet. Az
egyik az O'Reilly által is kiadott [Maven: The Definitive
Guide](http://oreilly.com/catalog/9780596517335). A könyv egyik fő
szerzője, a Maven első verzióját készítő Jason Van Zyl, aki jelenleg a
[Sonatype](http://www.sonatype.com/)-nál CTO. Azonban a papíron kiadott
könyv már igencsak elavult, ugyanis a Sonatype honlapjáról mindig
[letölthető](http://www.sonatype.com/documentation/books) a legfrissebb
verzió. A könyvet időközben két külön könyvre bontották, Maven by
Example és Maven: The Complete Reference címmel.

<a href="/artifacts/posts/2010-04-28-maven-kezdolepesek/sonatype_maven_the_complete_reference_b.png" data-lightbox="post-images">![Maven: The Complete Reference](/artifacts/posts/2010-04-28-maven-kezdolepesek/sonatype_maven_the_complete_reference.png)</a>

Az első könyvbe az eredeti könyv Part II. része került, míg a második
könyvbe pedig a többi. Ezen kívül rengeteg dologgal kiegészült időközben
az eredeti könyvhöz képest:

-   Running Maven fejezet - a parancssori paramétereket, a Reactor
    paramétereit, valamint a Help Plugin használatát részletezi
-   Using Maven Archetypes - archetype-ok használatát, és saját
    archetype-ok készítését és publikálását részletezi
-   Developing with Flexmojos - fejlesztés a Flex pluginnal
-   Android Application Development with Maven - Android fejlesztés
    Maven-nel
-   stb.

Az eredeti könyvben szerepel egy-egy fejezet a Nexus-ról, illetve a
m2eclipse Eclipse plugin-ról is. Ezekből szintén egy-egy könyv lett,
Repository Management with Nexus és Developing with Eclipse and Maven
néven. Érdemes figyelemmel kísérni a honlapot, mert gyakran frissül. A
Sonatype-nak ezen kívül magyar vonatkozása is van, hiszen a Nexus
elődjét Cservenák Tamás fejlesztette Proximity néven, és eztán kérte fel
a Sonatype, hogy készítsen egy hasonló terméket, Nexus néven.

A másik könyv a [Better Builds with
Maven](http://www.maestrodev.com/better-build-maven), mely szintén
ingyenesen letölthető. Szintén a Maven fejlesztésében résztvevők írták,
és most a MaestroDev tartja karban. Nem olyan részletes és jól
karbantartott, mint az előbb említett könyvek, azonban mégis érdemes
elolvasni, mert kicsit más oldalról közelíti meg a Maven-nel történő
fejlesztést.

### Fogalmak

A Maven definíció szerint "software project management and comprehension
tool". Tehát nem egy egyszerű build tool, melyben az Ant-hoz hasonlóan
leírjuk az egymás utáni lépéseket, hanem annál sokkal fejlettebb,
magasabb szintű megoldás. Alapja a project object model (POM), melyet
XML-ben leírva tudunk megadni (pom.xml), és ez alapján a Maven képes
további leírások nélkül elvégezni a build folyamatot, különböző
riportok, dokumentációk, gyakorlatilag a teljes projekt website-jának
legenerálását. A Maven nem titkolt célja, hogy a Java fejlesztők körében
egyfajta szabvány legyen, mely a konvenciók megtartását előnybe helyezi
az egyéni konfigurációkkal szemben (convention over configuration).
Sajnos a Java nagyon sokáig nem adott szabványt arra, hogy hogyan kell
egy projektet felépíteni, a Maven ezt az űrt próbálja betölteni. Azaz ha
tartjuk magunkat egy projekt struktúrához, azaz a különböző
állományainkat a megfelelő könyvtárakba helyezzük el, a Maven képes lesz
elvégezni a build folyamatot, a források lefordítását, a különböző
erőforrás állományok megfelelő helyre másolását, és az alkalmazásunk
összecsomagolását.

A Maven alapfogalma a projekt, mely a koordináták alapján van
azonosítva, melyek a következők: groupId, artifactId, version,
packaging, classifier. Pl. a legfrissebb Log4J esetén a groupId:log4j,
artifactId:log4j, version:1.2.16. A többi megadása opcionális. A groupId
megadásánál elterjedt az egyedi azonosítás miatt a domain név megadása,
mint a Java package-eknél (pl. org.springframework). A projektek
egymástól öröklődhetnek, valamint van lehetőség több modulból álló
projektek megadására is (mindegyik modul saját pom.xml-lel). A
pom.xml-ben lehet megadni a projektre jellemző olyan információkat is,
mint a licence, szervezet, fejlesztők, közreműködők, valamint olyan
fejlesztési környezet információkat is, mint a verziókezelő, issue
management, continuous integration eszköz elérése, stb. Ráadásul a
projektre jellemző POM, az ún. effective POM több részből épül fel.
Egyrészt a Super POM, mely a maven-\[version\]-uber.jar-ban szerepel
org.apache.maven.project.pom-4.0.0.xml néven, a szülő POM-jából,
valamint a projekthez tartozó POM-ból aggregálva.

A Maven nagy előnye ezen kívül, hogy beépített mechanizmus van a
különböző projekt függőségek definiálására és feloldására (pl. tranzitív
függőség, A projekt függ B-től, B projket függ C-től, akkor a C-re is
szükség van). Itt fontos ismerni a scope fogalmát. Sokat segíthet a
függőségi fa kirajzolása. A függőségek megadásánál használhatunk pontos
verziószámokat, de akár verzióintervallumokat is (range). Megadhatóak
opcionális függőségek is, melyeket nem muszáj igénybe vennünk.

A Maven build folyamat kimenetele az artifact. Ezen artifact 3rd party
library esetén a JAR állomány, webes alkalmazás esetén a WAR állomány,
nagyvállalati alkalmazás esetén az EAR állomány, stb. A Maven
megkülönbözteti a release és snapshot fogalmát, ahol az előző a kiadható
verzió, míg az utóbbi a fejlesztés közben használatos verzió.

Az artifact-okat egy központi helyen, ún. repository-ban helyezi el,
hierarchikus rendben. A legtöbb kritikai itt éri a Maven-t, hogy miért
is nem jó a függő library-k tárolása egyszerűen a verziókövető
rendszerben, miért kell ehhez egy külön repository-t használni. A Maven
használhat publikus repository-kat, valamint használ az adott gépen egy
lokális repository-t is, ez alapesetben a felhasználó home könyvtárában
.m2/repository könyvtárában található. Ezen kívül a repository
manager-ek elterjedésével (pl. Nexus vagy Artifactory) érdemes
kialakítani egy cégen belül használatos belső repository-t is, melyben
tárolhatóak a saját projektek állományai, valamint egyfajta proxy-ként
működnek a publikus repository-k felé. Az alapértelmezett publikus
repository a http://repo1.maven.org/maven2/. A repository-k is
csoportosíthatók, hogy release vagy snapshot verziókat tárolnak-e.

A Maven teljesen moduláris felépítésű, minden ún. Maven plugin-ben van
megvalósítva. Ezen Maven plugin-ek is artifact-ok. Ezért van az, hogy a
Maven telepítőcsomagja alig pár mega, az összes többi funkcionalitást
biztosító plugin-t (artifact) akkor tölt le, amikor szükség van rá.
Persze emiatt az első futtatás tovább tarthat, hiszen ekkor nagy
mennyiségű artifact-ot kell letöltenie. A pom.xml-ben ezen plugin-eket
konfigurálhatjuk is. A plugin-ek tulajdonképpen összetartozó goal-ok
gyűjteménye, ahol egy goal egy egyedi, önmagában is futtatható funkció.
Ilyen pl. a compiler plugin compile goal-ja, ami a forrás állományok
fordításáért felelős. Valamint a Maven-ben vannak definiálva ún.
életciklusok (lifecycle). Pl. build lifecycle (default), site és clean
lifecycle. Minden lifcycle fázisokból áll, és minden fázishoz
alapértelmezetten tartozik egy vagy több plugin goal. Pl. a build
lifecycle egyik fázisa package, mely a jar plugin jar goal-ját hívja meg
bizonyos esetekben. Persze ezt magunk személyre is szabhatjuk. Első
feladat megérteni a Maven tanulásakor, mikor kiadunk egy parancsot, mi
is fut le, milyen életciklus milyen fázis, milyen plugin milyen goal-ja.
A plugin-ek kaphatnak paramétereket.

A Maven előnye, hogy nagyban megkönnyíti a csapattagok kommunikációját,
valamint a fejlesztésbe bekapcsolódást, ugyanis képes kigenerálni
különböző riportokat (pom.xml-ben definiálandó), dokumentációt, a
projekt site-ját (természetesen nagymértékben testreszabható módon).
Ezért különösen elosztott, open source fejlesztésre különösen alkalmas.

A Maven-ben vannak ún. profilok is, melyek a build folyamat
portabilitását biztosítják különböző build környezetekben. Pl. lehet,
hogy másképp kell, hogy működjön a build folyamat különböző
architektúrákon, JDK verziókon és operációs rendszereken, teszt és élest
környezetben, sőt akár [különböző fejlesztőeszközök
használatakor](http://jhacks.anzix.net/space/maven/maven2/IDE+support).
Lehetőség van arra, hogy mi adjuk meg parancssorból a profilt (-P
kapcsolóval), de van profile activation is, ahol valamely környezeti
beállítás hatására automatikusan egy profil kerül kiválasztásra.

A másik érdekesség az assembly-k használata. A Maven beépítetten ismeri
a gyakoribb csomagolási módokat, a packaging-től függően JAR, WAR, EAR
(bin). Képes arra is, hogy olyan distribution-t készítsen, amibe bele
vannak csomagolva a függő osztályok is (jar-with-dependencies), valamint
képes a teljes projektet becsomagolni (project), valamint csak a
forráskódot kiadni (src). Ezen kívül saját assembly-t is definiálhatunk
assembly descriptor megadásával.

A Maven-ben a személyes kedvencem az archetype. Az archetype egy projekt
sablon, melyből létre lehet hozni egy üres projektet különböző
paraméterek megadásával. Ha gyakran indítunk projektet, érdemes egy
ilyent gyártanunk, mely a megfelelő kiindulási alapot biztosítja. Vannak
beépített archetype-ok is, ezelből is sok öteletet lehet meríteni. Ezek
is artifact-ok, azaz a repository-ban is elhelyezhetők.

A Maven-ben ezen kívül lehetőség van saját plugin-ek implementálására
is. Egy goal-t egy mojo-ban implementálhatunk (Maven plain Old Java
Object). Egy plugin mojo-k gyűjteménye.

A Maven könnyen integrálható az összes continuous integration eszközzel.

### Tippek és személyes tapasztalatok

Ide a személyes tapasztalataimat próbálom összegyűjteni, és azokat a
problémákat és megoldásaikat, melyekkel egy Maven felhasználó először
találkozik. Ezek egy részével a
[FAQ](http://maven.apache.org/general.html) is foglalkozik.

#### Java verzió

Alapesetben a Maven compiler plugin a Java 1.4-re fordít, ahhoz, hogy az
1.5 újdonságait ki tudjuk használni, át kell ezt állítani, pl. a
legfrissebb 1.6-os verzióra a pom.xml-ben.

{% highlight xml %}
<build>
<plugins>
<plugin>
  <groupId>org.apache.maven.plugins</groupId>
  <artifactId>maven-compiler-plugin</artifactId>
  <configuration>
    <source>1.6</source>
    <target>1.6</target>
  </configuration>
</plugin>
</plugins>
</build>
{% endhighlight %}

#### Kevés memória

Amennyiben a Maven build vagy site generálás hibát dob
(java.lang.OutOfMemoryError: Java heap space), hogy nincs elég memória,
akkor be kell állítanunk a MAVEN\_OPTS környezeti változót.

    MAVEN_OPTS="-Xmx1024m -Xms512m"

#### Karakterkódolás

Az ékezetes karakterek használata itt is problémát okoz, így hogy ezt
elkerüljük, mindenütt deklarálni kell a karakterkódolást. Javasolt az
UTF-8 használata. Nagyon sok plugin-nak van encoding property-je, ezt
kell állítani. Pl. ha a Java forrásállományokban ékezeteket használunk
(pl. dokumentációs megjegyzésekben).

{% highlight xml %}
<build>
<plugins>
<plugin>
  <groupId>org.apache.maven.plugins</groupId>
  <artifactId>maven-compiler-plugin</artifactId>
  <configuration>
    <encoding>UTF-8</encoding>
  </configuration>
</plugin>
</plugins>
</build>
{% endhighlight %}

De ezen kívül meg kell adnunk a maven-resources-plugin,
maven-site-plugin (inputEncoding, outputEncoding néven),
maven-checkstyle-plugin, maven-javadoc-plugin, maven-pmd-plugin,
taglist-maven-plugin plugin-oknak. Amennyiben nem adjuk meg, a Maven
warning-ot ír, hogy nincs megadva a karakterkódolás, emiatt build
környezetfüggő, mert az operációs rendszer default kódolását használja.

#### Hiányzó artifact

Amennyiben egy artifact hiányzik a repository-ból, a következő
paranccsal tudjuk oda installálni:

    mvn install:install-file
    -Dfile=
    -DgroupId=
    -DartifactId=
    -Dversion=
    -Dpackaging=
    -DgeneratePom=true

Azaz pl az Oracle jdbc driver esetén:

    mvn install:install-file
    -Dfile=ojdbc6-11.2.0.1.0.jar
    -DgroupId=com.oracle
    -DartifactId=ojdbc6
    -Dversion=11.2.0.1.0
    -Dpackaging=jar
    -DgeneratePom=true

Utána persze ezen koordinátákkal kell hivatkozni rá a függőség
megadásánál.

#### Debug mód

Futtassuk a Maven-t a -X kapcsolóval.

#### Teszt esetek

A Maven Surefire plugin-ja alapértelmezésben futtat JUnit és TestNG
teszt eseteket is. A kizárólag teszteléshez szükséges függőségeket test
scope-pal kell elhelyezni a függőségek között. Meg lehet adni, hogy
amennyiben egy teszt eset hibázik, a build még folytatódjon
(maven-surefire-plugin testFailureIgnore tulajdonsága). Valamint azt is
meg lehet adni, hogy ne futtassa le a teszt eseteket
(–Dmaven.test.skip=true vagy -DskipTests=true parancssori kapcsolóval,
de a POM-ban is megadható maven-surefire-plugin skipTests property-jének
állításával). Ha csak egy teszt esetet akarunk futtatni, használjuk a
-Dtest=MyTest kapcsolót (csomag megadása nélkül).

#### Artifact neve

Alapesetben a Maven artifact neve a koordinátákból jön, azonban war
állomány esetén ez nem lenne szerencsés, így felüldefiniálható a POM-ban
a finalName tag-gel.

#### Riportok generálása

A site lifecycle része a riportok generálása is. Azonban, ha mi a site
többi részére vagyunk kíváncsiak, és nem akarjuk a riportokat
kigeneráltatni, akkor ezt megtehetjük a -DgenerateReports=false
használatával.

#### Repository manager

Egy cégen belül mindenképp alkalmazzunk repository manager eszközt. Ez
egyrészt tartalmazza a saját artifact-jainkat, másrészt egy proxy a
publikus repositry-k felé. Webes felületen menedzselhetőek (artifact
keresés és feltöltés), valamint mindenféle jogosultsági szinteket tudunk
megadni, és képesek archiválni a repository-t. Érdemes az Artifactory és
a Nexus közül választani, én az előbbire tettem le a voksom, és egyelőre
nem tapasztaltam hiányosságot.

#### Log4j 1.2.15

A repository-k minőségét jellemzi a Log4J 1.2.15 verziója, melyben a
javax.mail:mail, javax.jms:jms, com.sun.jdmk:jmxtools és a
com.sun.jmx:jmxri artifact-ok kötelező függőségként voltak megadva. Ezen
jar-ok használata pedig nem kötelező, csak akkor szükséges, ha a
hozzájuk tartozó megfelelő appender-eket akarjuk használni, a JMX meg
már része a JDK-nak. Szerencsére ezt azóta
[javították](http://svn.apache.org/viewvc?view=revision&revision=575804).

#### IDE integráció - NetBeans

A Maven NetBeans integrációját gyakran használtam, és igen jónak tartom,
nem ütköztem vele problémába. Kicsit féltem tőle, mert elsődleges
szempont a gyors fejleszt-tesztel iterációs ciklus, és régebbi verzióval
voltak gondjaim. Most ilyenről nem számolhatok be. Nem jelentősen
lassabb a beépített Ant-ra épülő build folyamatnál, hiszen mindegyik egy
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
-   A mvn eclipse:configure-workspace -Declipse.workspace=C:/workspace
    paranccsal konfiguráljuk a workspace-t (a
    C:\\workspace\\.metadata\\.plugins\\org.eclipse.core.runtime\\.settings\\org.eclipse.jdt.core.prefs
    állományban létrehoz egy
    org.eclipse.jdt.core.classpathVariable.M2\_REPO=C\\:\\\\Documents
    and Settings\\\\jtechlog\\\\.m2\\\\repository bejegyzést, szóval
    létrehoz egy M2\_REPO változót, mely a repository helyére mutat)
-   A mvn eclipse:eclipse paranccsal generáltassuk le a projekt
    állományokat, melyekkel már megnyitható a projekt Eclipse-ben
-   Amikor webes projektet hoztam létre, még a következő konfigurációt
    is el kellett helyeznem a POM-ban.

{% highlight xml %}
<plugin>
<artifactId>maven-eclipse-plugin</artifactId>
<configuration>
  <wtpmanifest>true</wtpmanifest>
    <wtpapplicationxml>true</wtpapplicationxml>
    <wtpversion>2.0</wtpversion>
</configuration>
</plugin>
{% endhighlight %}

Számomra meglepően jól működött az, hogyha változott a POM-ban valami,
csak újrafuttattam az eclipse:eclipse goal-t, majd az Eclipse-ben
újraolvastattam a projektet. Ha a NetBeans nem Ant alapú lenne, ott is
jobban preferálnám ezt a módot.

#### Code complete

Különösen meglepő volt számomra, hogy mind a NetBeans-ben, mint az
Eclipse-ben elérhető a POM code complete, sőt, működik a dependency
megadásnál is, ugyanis automatikusan felajánlja az elérhető artifact-ek
koordinátáit. A NetBeans esetén alul a státuszsorban látszik, hogy a
hálózathoz kapcsolódik, és átviszi a repository indexét.

![Kódkiegészítés](/artifacts/posts/2010-04-28-maven-kezdolepesek/pom_code_complete_b.png)

#### Provided

Ha szükségünk van egy JAR-ra a fordításhoz, de nem akarjuk, hogy pl.
webes alkalmazásnál a WAR-ba kerüljön, mert futtatáskor a konténer úgyis
biztosítja azt a CLASSPATH-on ( ilyen pl. a servlet.jar, mail.jar stb.),
akkor használjuk a provided scope-ot.

#### Repository-k

A default repository a http://repo1.maven.org/maven2/. Azonban itt elég
sokminden nincs fenn, így más publikus repository-kat is használnunk
kell. Ezek pl. (a legtöbbjük az Artifactory-ban alapban konfigurálva
van):

-   http://download.java.net/maven/1
-   http://download.java.net/maven/2
-   http://repository.jboss.com/maven2
-   http://repository.codehaus.org
-   http://maven.springframework.org/release
-   http://jasperreports.sourceforge.net/maven2/
-   http://stat-scm.sourceforge.net/maven2/
-   http://google-maven-repository.googlecode.com/svn/repository

Ezeket beállíthatjuk a settings.xml-ünkben, de beállíthatjuk a POM-ban
is. Az [Artifactory
POM](http://subversion.jfrog.org/artifactory/public/trunk/pom.xml)-jában
láttam, hogy ott a repository-kat egy profile-ban adták meg, és ezt
használva a -P kapcsolóval kell a profile-t megadni.

#### Hiányzó artifact

Abban az esetben, ha nem tudjuk a pontos koordinátákat a függőség
megadásakor, érdemes valamilyen keresőt használni. Nekem ezek jöttek be:

-   http://mvnrepository.com
-   http://repository.sonatype.org/
-   http://repository.apache.org

#### Servlet, JSP, JSTL

A repo1-ben sokáig nem volt fenn a servlet, JSP és JSTL, [licence-elési
okokból](http://maven.apache.org/guides/mini/guide-coping-with-sun-jars.html),
és ezért azt javasolták, hogy helyette használjuk a Glassfish ide
vonatkozó artifact-jait. Azonban ez megváltozott, ezen artifact-ok
[megtalálhatóak](http://repo1.maven.org/maven2/javax/servlet/)
repo1-ben. Azonban, ha olyannal szembesülünk, ami nem található meg,
akkor érdemes szétnézni a java.net-es repository-kban.

#### Létező NetBeans projektről átállás

Két projektben is a NetBeans projekt állományai mellé felvettem egy
POM-ot is, hogy a Maven bevezethet legyen, de párhuzamosan mindkét build
folyamat működjön. Ez azért körülményes, mert a könyvtárstruktúra nem a
Maven konvencióinak felel meg. A cél az volt, hogy bitre megegyező war
állományt állítson elő a NetBeans és a Maven. Az időm 90%-ában azon
dolgoztam, hogy pont azokat a JAR-okat, és pont annyit tegyen oda, mint
az eredeti projektben voltak. Az, hogy a könyvtárnevek eltértek, semmi
gondot nem okozott. Három estém ment rá.

Egy kis statisztika:

<table><tbody><tr><td>Technológia:</td><td>Spring, Struts, JSP</td></tr><tr><td>JAR-ok száma az eredeti projektben:</td><td>35</td></tr><tr><td>Dependency tag-ek a POM-ban:</td><td>30</td></tr><tr><td>Exclusions tag-ek nélkül a JAR-ok száma:</td><td>62</td></tr><tr><td>Exclusions tag-ek a POM-ban:</td><td>17 (!!!)</td></tr><tr><td>Egy repository-ban sem talált JAR-ok száma, melyeket kézzel kellett telepíteni:</td><td>3</td></tr></tbody></table>

Ahhoz, hogy a NetBeans-es projekt azonnal leforduljon a Maven-nel is, a
következő konfigurációkat kellett a POM-ban megtenni:

{% highlight xml %}
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
{% endhighlight %}

### Zárszó

Abba a vitába nem mennék bele, hogy mikor van értelme Maven-t használni,
és mikor érdemes Ant-nál, vagy valami másnál maradni. A Maven-t ki kell
próbálni. A Maven-t előbb-utóbb nem tudod elkerülni. Egy biztos, aki
használni akarja, az ne vegye félvállról, mert a megítélése szerintem az
ezen a területen félig képzett programozók miatt van. És érdemes
igyekezni, mert nyakunkon a [3-as
verzió](http://java.dzone.com/articles/maven-3-rides-town).
