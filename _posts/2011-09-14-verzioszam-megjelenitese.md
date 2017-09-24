---
layout: post
title: Verziószám megjelenítése az alkalmazásban
date: '2011-09-14T00:52:00.001+02:00'
author: István Viczián
tags:
- Maven
modified_time: '2011-09-14T00:54:43.384+02:00'
blogger_id: tag:blogger.com,1999:blog-7370998606556338092.post-6632348504802797991
blogger_orig_url: http://www.jtechlog.hu/2011/09/verzioszam-megjelenitese-az.html
---

Technológiák: Maven 3.0.3, Build Number Maven Plugin 1.0

Kocka írt nem olyan régen egy [posztjában](http://iwillworkforfood.blogspot.com/2011/08/verzioszam.html) arról,
hogy hogyan lehet az alkalmazás verziószámát kiírni a felületre. Mivel én is nemrég csináltam meg több
projektünkben is, álljon itt az én megoldásom.

Új projektjeink már Mavent használnak buildeléshez, ahol a `pom.xml` tartalmazza a verziószámot. 
Én azt javaslom, hogy ez legyen is elég. Ez egyértelműen azonosít egy artifactot, azaz egy alkalmazást
(vagy annak moduljait). Maven használata esetén a SNAPSHOT verziószámmal rendelkező artifactból lehet több is,
de a release-elt artifactból csak egy lehet, ha egyszer kiadtuk, az már többet nem módosulhat. Javasolt
tesztelésre, élesre csakis release-elt artifactot kitenni, így egyértelműen azonosítható, így elég lesz az
azonosításra a verziószám is. Abban az esetben, ha mi SNAPSHOT verziókat is ki akarunk adni tesztelésre
(amit nem javaslok), érdemes még valamilyen plusz azonosítót társítani a verziószám mellé. Ez lehet egy egyedileg
kézzel megadott érték (ekkor elég nagy a hibalehetőség), egy automatikusan növelt egész szám (ennek a tárolásával
lehetnek gondok), timestamp, vagy a legegyszerűbb esetben az SCM revision number. De ismétlem, erre csak akkor
van szükség, ha snapshotokat is kiadunk tesztelésre, és azokat akarjuk egyedileg azonosítani, ellenkező esetben
elég a verziószám. A verziószámhoz tartozó információkat pedig lehetőleg az issue tracker tartalmazza. Ebből is
látszik, hogy az SCM-et én egyszerű tárolónak tekintem, ott nem szeretek plusz meta információkat tárolni, vagy
pl. a revision numbert venni bármi alapjául.

Amennyiben csak a release-elt alkalmazás verziószámát akarjuk kiírni, elegendő egy properties állományt létrehozni,
és a Mavent rávenni, hogy ebbe az állományba írja bele a verziószámot. Utána az alkalmazásba ezt a properties
állományt kell becsomagolni, majd ezt beolvasni (pl. classpath-ról, `getResourceAsStream` metódussal). Egy példa
alkalmazás [elérhető a GitHubon](https://github.com/vicziani/jtechlog-versioninfo). Nem javaslom a
`MANIFEST.MF` állomány beolvasását classpath-ról, mert ez csak akkor működik, ha a jar be van csomagolva, ha pl.
az alkalmazásszerver deploy-kor kicsomagolja a war alkalmazást, akkor nem fog működni. A verziószám beírását a
properties állományba a Maven a resource-ok filterelésével képes megoldani. Ekkor definiáljuk a következőt a
`pom.xml` fájlban:

{% highlight xml %}
<build>
 <resources>
  <resource>
   <directory>src/main/resources</directory>
   <filtering>true</filtering>
  </resource>
 </resources>
</build>
{% endhighlight %}

Valamint a properties állományban:

	version=${project.version}

Ekkor látni fogjuk, hogy amikor a Maven átmásolja a properties állományt, kicseréli benne a
`${project.version}` szöveget a projekt verziószámára.

Amennyiben a `MANIFEST.MF` állományban is látni szeretnénk a verziószámot, a következővel egészítsük ki a
`pom.xml`-t.

{% highlight xml %}
<plugin>
 <groupId>org.apache.maven.plugins</groupId>
 <artifactId>maven-jar-plugin</artifactId>
 <version>2.1</version>
 <configuration>
  <archive>
   <manifest>
    <addDefaultImplementationEntries>true</addDefaultImplementationEntries>
   </manifest>
  </archive>
 </configuration>
</plugin>
{% endhighlight %}

Ha mégis úgy döntünk, hogy szükségünk van build numberre is, mert SNAPSHOT verziót is azonosítani akarunk, akkor
használhatjuk a [Build Number Maven Plugin](http://mojo.codehaus.org/buildnumber-maven-plugin/)-t. Ennek két
üzemmódja van. A build numbernek vagy az SCM revizióját használja, vagy megadhatunk neki egy formátumot. A
formátumot a `MessageFormat` osztályban leírtaknak megfelelően lehet megadni. Itt behelyettesíthető egy vagy több
egész szám, melye(ke)t automatikusan növel, a timestamp, valamint konstans értékek (szöveg és szám is).

Érdekes, hogy mindkét esetben definiálni kell az `scm` taget a `pom.xml`-ben, mert mindenképp lefuttat egy
SCM parancsot. Ha nem adjuk meg az `scm` tag-et, a következő hibajelzést kapjuk:

	Failed to execute goal org.codehaus.mojo:buildnumber-maven-plugin:1.0:create (default) on project jtechlog-versioninfo: Execution default of goal org.codehaus.mojo:buildnumber-maven-plugin:1.0:create failed: The scm url cannot be null. -> [Help 1]

Először nézzük, hogy mi történik, ha a build numbert a revisionből akarjuk venni. Ehhez a következőt illesszük a
`pom.xml`-be:

{% highlight xml %}
<plugin>
 <groupId>org.codehaus.mojo</groupId>
 <artifactId>buildnumber-maven-plugin</artifactId>
 <version>1.0</version>
 <executions>
  <execution>
   <id>buildNumber</id>
   <phase>validate</phase>
   <goals>
    <goal>create</goal>
   </goals>
   <configuration>
    <doCheck>true</doCheck>
    <doUpdate>true</doUpdate>
   </configuration>
  </execution>
 </executions>
</plugin>
{% endhighlight %}

Subversion SCM esetén ekkor egyrészt lefuttat egy `svn status` parancsot, és ellenőrzi, hogy van-e módosított
állomány. Majd egy `svn update` parancsot, és egy `svn info` parancsot. Ez alapján eltárolja a revision numbert a
`${buildNumber}` property-be, az aktuális timestampet a `${timestamp}` property-be és a branch-et, amin vagyunk a
`${scmBranch}` property-be (ez lehet a trunk is). Ezeket a property-ket aztán a properties fájlba írva a Maven
filtereli.

Furcsa mód amennyiben a formátumos megadást is használni akarjuk, akkor azt nem tudjuk itt konfigurálni, hanem fel
kell venni egy újabb `execution` tag-et.

{% highlight xml %}
<execution>
 <id>buildInfo</id>
 <phase>validate</phase>
 <goals>
  <goal>create</goal>
 </goals>
 <configuration>
  <buildNumberPropertyName>buildInfo</buildNumberPropertyName>
  <format>Incremental build number {0}.{1}
at {2,time} on {2,date}, build on build server {3}{4}, env var: {5}.</format>
  <items>
   <item>buildNumber0</item>
   <item>buildNumber1</item>
   <item>timestamp</item>
   <item>jupiter</item>
   <item implementation="java.lang.Integer">8</item>
   <item>${envVar}</item>
  </items>
 </configuration>
</execution>
{% endhighlight %}

Látható, hogy hogyan lehet megadni a formátumot a `format` tagben, és ekkor meg kell adni az `items` taget is,
felsorolva a behelyettesítendő értékeket. A `buildNumber/d*` (ami azt jelenti, hogy a `buildNumber` szó, megtoldva
egy egész számmal) azt fogja eredményezni, hogy létrejön egy `buildNumber.properties` állomány (helye, neve
konfigurálható), és ebben fogja tárolni az aktuális verziót, és build esetén megnöveli egyel. Az előző példában
két ilyen verziószámot növelget, és jegyez be ebbe az állományba. A timestampet is ki lehet írni, méghozzá
formázva (még érdekesebb formátum pl. `{0,date,yyyy-MM-dd HH:mm:ss}`), valamint konstansokat is meg lehet adni.
Ebbe az a jó, hogy akár egy Maven property-t is, ahogy az `${envVar}` property mutatja. Ekkor a build-et a
`mvn -D envVar=CI install` paranccsal indítva a CI szót fogja a formátumba behelyettesíteni. Ez azért jó, mert
akár a build szerveren, a CI (pl. Hudson/Jenkins) is be tudja ezt külön-külön állítani.

A fenti konfigurációval futtatva a build-et a következőt kapjuk:

	Incremental build number 1.1 at 23:50:06 on 2011.09.13., build on build server jupiter8, env var: CI.

Ezt az értéket, ahogy a `buildNumberPropertyName` tagben láthatjuk, a `${buildInfo}` property-be fogja eltenni
(hogy ne üsse az előző `${buildNumber}` proerty-t). Ezt a properties állományunkban a Maven megintcsak tudja
filterelni.

Amennyiben ezeket az értékeket a `MANIFEST.MF`-ben is szerepeltetni akarjuk, a következőt kell a `pom-xml`-be írni
a `maven-jar-plugin` konfigurációjánál:

{% highlight xml %}
<archive>
...
 <manifestEntries>
  <Implementation-Build>${buildNumber}</Implementation-Build>
 </manifestEntries>
...
</archive>
{% endhighlight %}
