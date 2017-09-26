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

Utoljára frissítve: 2017. szeptember 26.

Technológiák: Maven 3.5.0, Maven JAR Plugin 3.0.2, Build Number Maven Plugin 1.4

Kocka írt nem olyan régen egy [posztjában](http://iwillworkforfood.blogspot.com/2011/08/verzioszam.html) arról,
hogy hogyan lehet az alkalmazás verziószámát kiírni a felületre. Mivel én is nemrég csináltam meg több
projektünkben is, álljon itt az én megoldásom.

Új projektjeink már Mavent használnak buildeléshez, ahol a `pom.xml` tartalmazza a verziószámot.
Ez a legtöbb esetben elég is. Ez egyértelműen azonosít egy artifactot, azaz egy alkalmazást
(vagy annak moduljait). Maven használata esetén a SNAPSHOT verziószámmal rendelkező artifactból lehet több is,
de a release-elt artifactból csak egy lehet, ha egyszer kiadtuk, az már többet nem módosulhat. Javasolt
tesztelésre, élesre csakis release-elt artifactot kitenni, így egyértelműen azonosítható, így elég lesz az
azonosításra a verziószám is. Continuous delivery esetén is minden build egy potenciális release,
saját verziószámmal. Abban az esetben, ha mégis SNAPSHOT verziókat akarunk kiadni tesztelésre, érdemes
még valamilyen plusz azonosítót társítani a verziószám mellé. Ez lehet egy egyedileg
kézzel megadott érték (ekkor elég nagy a hibalehetőség), egy automatikusan növelt egész szám (ennek a tárolásával
lehetnek gondok), timestamp, verziókezelő rendszerre jellemző egyedi azonosító (pl. Subversion revision, Git commit hash), vagy egy környezeti változóban átadott érték.
Ez utóbbi például használható akkor, ha a Jenkins Continuous Integration rendszer a `BUILD_NUMBER`-t
környezeti változóban adja át. (A Jenkins mellesleg átadja a verziókövető rendszerre jellemző egyedi azonosítót is, Subversion
esetén `SVN_REVISION`, Git esetén `GIT_COMMIT` néven.)

Mivel a `META-INF/MANIFEST.MF` állomány pont ilyen információk tárolására alkalmas, érdemes oda beírni és
onnan kiolvasni.

Ahhoz, hogy a `MANIFEST.MF` állományban is szerepeljen a verziószám, a következővel egészítsük ki a
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

Ekkor a [Apache Maven Archiver](http://maven.apache.org/shared/maven-archiver/index.html) oldalon leírtaknak megfelelően elhelyezi a `MANIFEST.MF` állományban a megfelelő bejegyzéseket, köztük az `Implementation-Version` bejegyzést a projekt verziószámával.

Ezt a következőképp tudjuk kiolvasni, pl. JAR futtatása esetén a classpath-ról a `getResourceAsStream()` metódussal.
Egy példa alkalmazás [elérhető a GitHubon](https://github.com/vicziani/jtechlog-versioninfo).

{% highlight xml %}
try (InputStream is = VersionInfo.class.getResourceAsStream("/META-INF/MANIFEST.MF")) {
    Manifest manifest = new Manifest(is);
    Attributes attributes = manifest.getMainAttributes();

    version = attributes.getValue(Attributes.Name.IMPLEMENTATION_VERSION);
}
catch (IOException e) {
    throw new RuntimeException("Error loading META-INF/MANIFEST.MF file from classpath", e);
}
{% endhighlight %}

Ez fejlesztőeszközből indítva nem fog működni, csak ha JAR-ból futtatjuk. Ha web konténerben (pl. Tomcat) vagyunk,
és a `META-INF` könyvtár nincs a classpath-on, akkor a `ServletContext.getRealPath()` metódusát használjuk.

Ha mégis úgy döntünk, hogy szükségünk van build numberre is, mert SNAPSHOT verziót is azonosítani akarunk, akkor
használhatjuk a [Build Number Maven Plugin](http://www.mojohaus.org/buildnumber-maven-plugin/)-t. Ez a bevezetőben
említett összes forrásból képes kiolvasni a verzió paramétereket.

Amennyiben a következő konfigurációt használjuk, a verziókövető rendszert, pl. Gitet használ a
verzió információk kinyerésére. A `buildNumber` property-be tárolja a commit hash-t, és
feltölti a `timestamp` és `buildScmBranch` property-ket is. Ehhez a háttérben egy Git parancsot ad ki.
Ehhez azonban kötelezően ki kell töltenünk az `scm` tag-et a `pom.xml` fájlban.

{% highlight xml %}
<plugin>
    <groupId>org.codehaus.mojo</groupId>
    <artifactId>buildnumber-maven-plugin</artifactId>
    <version>1.4</version>
    <executions>
        <execution>
            <id>buildNumber</id>
            <phase>validate</phase>
            <goals>
                <goal>create</goal>
            </goals>
        </execution>
    </executions>
</plugin>
{% endhighlight %}

Ha pl. környezeti változóból is szeretnénk értéket kinyerni, akkor a következő konfigurációval
egészítsük ki:

{% highlight xml %}
<execution>
    <id>jenkinsBuildNumber</id>
    <phase>validate</phase>
    <goals>
        <goal>create</goal>
    </goals>
    <configuration>
        <buildNumberPropertyName>jenkinsBuildNumber</buildNumberPropertyName>
        <format>{0}</format>
        <items>
            <item>${BUILD_NUMBER}</item>
        </items>
    </configuration>
</execution>
{% endhighlight %}

Ekkor a `jenkinsBuildNumber` property értékét tölti fel a `BUILD_NUMBER` környezeti változó
értékével.

Amennyiben ezeket az értékeket a `MANIFEST.MF`-ben is szerepeltetni akarjuk, a következőt kell a `pom-xml`-be írni
a `maven-jar-plugin` konfigurációjánál:

{% highlight xml %}
<archive>
...
<manifestEntries>
   <Implementation-Build>${buildNumber} ${jenkinsBuildNumber}</Implementation-Build>
</manifestEntries>
...
</archive>
{% endhighlight %}
