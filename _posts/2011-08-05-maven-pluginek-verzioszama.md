---
layout: post
title: Maven pluginek verziószáma
date: '2011-08-05T00:40:00.005+02:00'
author: István Viczián
tags:
- Maven
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Technológiák: Maven 2.1.1, Maven 3.0.3

Egy régebbi [posztban](/2010/04/28/maven-kezdolepesek.html) már
említettem, hogy a Maven moduláris felépítésű, és minden pluginben van
megvalósítva. Az életciklus különböző fázisaiban (phase) különböző
pluginok különböző céljai (goal) futnak le. Minden feladatot tehát
valójában egy-egy plugin végez el, ezen pluginokból [rengeteg
támogatott](http://maven.apache.org/plugins/index.html) és egyedi plugin
is létezik. A Compiler plugin végzi a fordítást, a JAR, WAR és EAR
például a csomagolást, stb. A pluginek két csoportra oszthatók, build
pluginek és reporting pluginek.

A következő poszt azt demonstrálja, hogy miért szükséges a pluginek
verziószámát is deklarálni a `pom.xml`-ben. Egy nem általunk készített
alkalmazás Maven 3.0.3-ra migrációjánál a következő hibaüzenetet vettem
észre egy projektnél:

    [WARNING] Warning: selected war files include a WEB-INF/web.xml which
    will be ignored
    (webxml attribute is missing from war task, or ignoreWebxml attribute
    is specified as 'true')

A hibaüzenet a war plugin adja, a hibaüzenet számomra teljesen
értelmezhetetlen. Milyen war fájlok (többesszám!) tartalmaznak már
`web.xml` állományt? A dokumentációt megnézve a hibaüzenetben ezen kívül
két hiba is van, az első említett paraméter helyes írásmódja `webXml`, a
másik `ignoreWebxml` paraméter nem is létezik
(http://maven.apache.org/plugins/maven-war-plugin/war-mojo.html).

Mivel emlékeztem, hogy a Maven 2.1.1 hasonló hibát nem dobott, ezt újra
leellenőriztem, és tényleg nem írt ki hibát. Ebből már sejthető volt,
hogy verzióeltérés lesz.

Először egy `help:describe` paranccsal próbálkoztam Maven 3.0.3-assal,
mely egy rövid súgót ad az adott pluginre vonatkozóan. Ez még egy olyan
könyvtárban, ahol nincs `pom.xml`, tehát projekttől függetlenül. Erről a
[FAQ](http://docs.codehaus.org/display/MAVENUSER/FAQs-1#FAQs-1-HowdoIdeterminewhatversionofapluginIamusing%3F)
kicsit félrevezetően ír.

    $ mvn help:describe -Dplugin=war
    ...
    Name: Maven WAR Plugin
    Description: Builds a Web Application Archive (WAR) file from the project
      output and its dependencies.
    Group Id: org.apache.maven.plugins
    Artifact Id: maven-war-plugin
    Version: 2.1.1
    Goal Prefix: war
    ...

A plugin paraméternél megadott prefix (`war`) helyett megadhatunk groupId,
artifactId párt is (-`Dplugin=org.apache.maven.plugins:maven-war-plugin`).
Amennyiben nem a verziószámra vagyunk kíváncsiak, hanem egy adott
verzióhoz tartozó célokra, megadhatunk GAV (groupId, artifactId,
version) hármast is, a szokásos jelöléssel, kettőspontokkal elválasztva.
De megadhatjuk a GAV-ot három paraméterrel is:

```shell
mvn help:describe -DgroupId=org.apache.maven.plugins
  -DartifactId=maven-war-plugin -Dversion=2.1.1 -Ddetail=true -Dgoal=war
```

Ne feledjük, hogy amennyiben elírjuk a paraméter nevét, a Maven erről
nem figyelmeztet, egyszerűen figyelmen kívül hagyja. Részletesebb súgót,
mely a paramétereket is tartalmazza a `-Ddetail paraméterrel` kérhetünk
(régebben `full` paraméter volt). A `-Dgoal=war` paraméterezéssel tudunk
csak egy célról információt kérni.

Az első parancsot kiadva Maven 2.1.1-nél azt tapasztalhatjuk, hogy a
verzió `2.2-SNAPSHOT`. Egy kis [kutakodás után
kiderült](https://cwiki.apache.org/MAVEN/maven-3x-compatibility-notes.html),
hogy a Maven 2 és 3 között inkompatibilitás van, azzal kapcsolatban,
hogy hogyan keresi meg a verziószámát a használni kívánt pluginnek. Míg
a 2-es a legutolsó verziót tölti le (`2.2-SNAPSHOT`), addig a 3-asban a
stabilitás érdekében azt a döntést hozták, hogy a legutolsó release
verziót használja, ami jelenleg a `2.1.1`.

Ez a parancs nem adja viszont azt meg, hogy az adott projektben a
kérdéses plugin melyik verziója kerül felhasználásra. Az adott
projektben nem volt a plugin definiálva. A Maven 3 már futás közben is
tájékoztat a verziószámról.

Ahhoz, hogy a Maven 2 futás közben is kiírja, a `-X` kapcsolóval kell
indítani, és a nagyon részletes logból kibogarászni:

    [DEBUG] Configuring mojo
      'org.apache.maven.plugins:maven-war-plugin:2.1-alpha-2:war' -->

Látható, hogy míg a 2-es Maven a `2.1-alpha-2` verzióval dolgozik, addig a
3-as a `2.1.1`-gyel. De mégis hol van ez definiálva? A választ a következő
parancs adja meg:

```shell
mvn help:effective-pom
```

A Maven Help pluginjének `effective-pom` paranccsa összefésüli a super
pom-ot és a projekt pom-ját (, és annak szülőit, valamint figyelembe
veszi a profilokat). Mivel a projekt pom-jában nincs a plugin
definiálva, azt a super pom-ból veszi, ami a 2-esben a
M`2_HOME/lib/maven-2.2.1-uber.jar:org/apache/maven/project/pom-4.0.0.xml`
helyen, míg a 3-asban a
`M2_HOME/lib/maven-model-builder-3.0.3.jar:org/apache/maven/model/pom-4.0.0.xml`
helyen van. Tehát a Maven verziójától függ, hogy mik az alapértelmezett
plugin verziószámok egy projekten belül.

Tehát míg a Maven 2 által definiált `2.1-alpha-2` nem dobja a hibát, addig
a `2.1.1` igen, amiről egy [stackoverflow
kérdés](http://stackoverflow.com/questions/4342245/maven-webxml-is-missing-from-war-task),
és egy [JIRA issue](http://jira.codehaus.org/browse/MWAR-248) is
megemlékezik. Ennek megoldása egyszerű, helyezzük el a pom.xml-ben a
következőt:

```xml
<build>
  <plugins>
    <plugin>
      <groupId>org.apache.maven.plugins</groupId>
      <artifactId>maven-war-plugin</artifactId>
      <configuration>
        <packagingExcludes>WEB-INF/web.xml</packagingExcludes>
      </configuration>
    </plugin>
  </plugins>
</build>
```

Úgy tűnik nem tanultunk az előző hibánkból, és újra elkövettük, hogy a
plugin verziószámát nem definiáltuk. Erre a Maven 3 már alapból
figyelmeztet:

    [WARNING]
    [WARNING] Some problems were encountered while building the effective model
      for jtechlog.earconfig:earconfig-web:war:1.0-SNAPSHOT
    [WARNING] 'build.plugins.plugin.version' for
      org.apache.maven.plugins:maven-war-plugin is missing. @ line 60, column 9
    [WARNING]
    [WARNING] It is highly recommended to fix these problems because they
      threaten the stability of your build.
    [WARNING]
    [WARNING] For this reason, future Maven versions might no longer
      support building such malformed projects.
    [WARNING]

A version tag beillesztésével azonnal javíthatjuk a hibát. Ekkor már nem
a super pom-ban definiált verzió, hanem a saját `pom.xml`-ünkben definiált
verzió fog érvényesülni. A verzió automatikus meghatározását a Maven
Automatic Plugin Version Resolution-nek nevezi, és a warning amiatt
jelenik meg, mert a későbbi verziókban a build reprodukálhatóságának
megsegítéseként el kívánják távolítani, ezért érdemes mindenképp
explicit definiálni a verziókat.

Amennyiben a 2-es Maven verziót használjuk, ugyanerre megfelelő az
[Enforcer](http://maven.apache.org/plugins/maven-enforcer-plugin/)
plugin enforce célja. A következőképp konfigurálhatjuk:

```xml
<plugin>
  <groupId>org.apache.maven.plugins</groupId>
  <artifactId>maven-enforcer-plugin</artifactId>
  <version>1.0.1</version>
  <executions>
    <execution>
      <goals>
        <goal>enforce</goal>
      </goals>
      <configuration>
        <rules>
          <requirePluginVersions>
            <banLatest>true</banLatest>
            <banRelease>true</banRelease>
          </requirePluginVersions>
        </rules>
      </configuration>
    </execution>
  </executions>
</plugin>
```

Futtatáskor a következő hibát kaphatjuk:

    [WARNING] Rule 0: org.apache.maven.plugins.enforcer.RequirePluginVersions
      failed with message:
    Some plugins are missing valid versions:(LATEST RELEASE SNAPSHOT are
      not allowed )
    org.apache.maven.plugins:maven-war-plugin.  The version currently in
      use is 2.1-alpha-2

A Maven 3-nál többet tud, ugyanis a nem definiált plugin-okat is jelzi.
Az előbbi példánál maradva, ha nem tettük volna bele a Maven WAR plugin
definícióját a `pom.xml`-be, a Maven 3 nem panaszkodott volna, hogy nem a
legfrissebb plugint futtatja. Az Enforcer plugin viszont ezt is
észreveszi, bővebb a funkcionalitása.

Az Enforcer plugint a 3-as Mavennel futtatva viszont a következő
hibaüzenetet kapjuk. Erről is van [JIRA
issue](http://jira.codehaus.org/browse/MENFORCER-98).

    [INFO] The requirePluginVersions rule is currently not compatible with Maven3.

Projekt öröklődés esetén a plugin beállításai alapesetben nem
öröklődnek. Ahhoz, hogy mégis, a beállításokat a szülő projekt `pom.xml`-jében
a `pluginManagement` részben kell elhelyezni. Így a verziószám és a
konfiguráció is öröklődik. Ekkor a gyermek projektben elegendő csak a
groupId-t és az artifactId-t elhelyezni. Nagy projekt esetén jelentős
copy-paste munkát takaríthatunk meg ezzel.

Néha szükségünk lehet arra is, hogy megnézzük, hogy van-e frissebb
verzió egy adott plugin-ból. Ezt a Versions pluginnel kérhetjük le a
következő módon:

```shell
mvn versions:display-plugin-updates
```

Régebben a `-cpu` kapcsoló is jó volt erre, de ez deprecated, így ne
használjuk. Másik lehetőség, hogy egyszerűen rákeresünk a Maven
repository-ban a http://search.maven.org címen.

A pluginek verziószámát a site generálás is szépen megmutatja a Maven
2-ben, a `plugin-management.html` oldalon.

![Project Plugin Management](/artifacts/posts/2011-08-05-maven-pluginek-verzioszama/plugin-management_b.png)

A Maven 3-ban ez [nem ilyen
egyszerű](https://cwiki.apache.org/MAVEN/maven-3x-and-site-plugin.html).
A `mvn site` parancsot kiadva alapértelmezetten semmit nem kapunk.
Konfigurálni kell a Maven Site plugint, hogy futtassa a
Maven Projects Info Reports plugint, és az generálja le pl. a
Plugin management riporot. Ez a következőképp néz ki:

```xml
<plugin>
  <groupId>org.apache.maven.plugins</groupId>
  <artifactId>maven-site-plugin</artifactId>
  <version>3.0</version>
  <configuration>
    <reportPlugins>
      <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-project-info-reports-plugin</artifactId>
        <version>2.4</version>
        <reports>
          <report>plugin-management</report>
        </reports>
      </plugin>
    </reportPlugins>
  </configuration>
</plugin>
```

Azaz ha biztosak akarunk lenni a build reprodukálhatóságában, mindig
definiáljuk a pluginek verziószámát. A Maven 3 tett egy lépést ennek
kikényszerítésének az irányában.
