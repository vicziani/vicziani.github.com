---
layout: post
title: Release Maven-nel és Hudson-nel
date: '2010-10-25T00:39:00.006+02:00'
author: István Viczián
tags:
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Technológiák: Maven 2.2.1, Maven Release Plugin 2.1 , Hudson 1.381,
Hudson M2 Release Plugin 0.6.1

A [Wikipedia
szerint](https://en.wikipedia.org/wiki/Software_release_life_cycle) a
release, vagy magyarul a
[szoftverkiadás](https://hu.wikipedia.org/wiki/A_szoftverkiad%C3%A1s_%C3%A9letciklusa)
valamely szoftvertermék és a hozzá tartozó különböző kötelező anyagoknak
(média, dokumentáció) a terjesztése. Ír magáról a szoftverkiadás
életciklusáról, mely különböző szakaszokból áll (viszonylag szigorúan
definiálja ezeket, azonban a valóságban nem annyira szokták ennyire
tartani, így értelmezni, és így nevezni ezeket). Ezen a szakaszok az IBM
hardverfejlesztési ciklusából öröklődtek. Első szakasz az alfa változat,
mely megfelel a legfontosabb funkcionális követelmények. A következő
szakasz a béta, mely mely során már minden funkciót tartalmaz, de
lehetnek benne hibák, nem elég stabil éles üzemre. Lehetnek zárt és
nyilvános béták is, attól függően, hogy a felhasználók mely csoportja
vehet részt a tesztelésben. A web 2.0 világában gyakran belefuthatunk
béta alkalmazásokba, mely gyakorlatilag a fejlesztőknek ad némi
szabadságot, hogy ne kelljen bizonyos hibákkal, támogatással
foglalkozni, hanem az érdekesebb funkciókra helyezhessék a hangsúlyt, és
nekünk is jelzi, hogy lehetnek problémák, leállások. A béta után jön a
kiadásra jelölt (release candidate), mely már a fejlesztők által késznek
nyilvánított, ismert hibát nem tartalmaz, melyet javítani kéne. Ezután
mehet aranyra (vagy másképp RTM - release to manufacturing/marketing),
majd a terjesztés üzleti előkészítése után kiadásra kerül az általánosan
elérhető (GA - General availability/acceptance). Persze itt nem áll meg
a fejlesztés, sorban jöhetnek ki a hibajavítások, új verziók, egészen a
szoftver kivezetéséig (end of life).

Esetünkben a release elkészítése nem más, mint azon ismétlődő
tevékenységek elvégzése, mely lehetővé teszi a szoftver, és a hozzá
tartozó különböző matériák terjesztését. A release során előállnak elő
az alfa, béta, stb. kiadások is. Ezek azután különböző felhasználói
csoportnak kerülnek átadásra, pl. tesztelőknek, végfelhasználóknak.

Ha Maven-t használunk projekt kezelésre (több, mint build), akkor a
release gyakorlatilag a megfelelő artifact-ok (bináris, valamint pl. a
forráskódot, dokumentációt tartozó csomagok) legyártása, és elhelyezése
a (első körben privát) repository-ba. Ez után persze ezeket különböző
helyre terjeszthetjük, pl. teszt környezetre deploy-olhatjuk, hogy a
tesztelők elkezdhessék a munkájukat, de egy GA esetén mehet ki a
publikus repository-ba is.

A release tehát egy vagy több artifact, mely a szoftver éppen aktuális,
rögzített állapotát tartalmazza. Hogy ezeken állapotokat egymástól meg
tudjuk különböztetni, verziószámot adunk a kiadásnak. A Maven-nél a
projekt koordináta része a group id és a artifact id mellett a verzió
is. A verzió formátuma viszonylag szabad, a leggyakoribb a major/minor
verziószám használata, pl. 1.1, 2.0, de adhatók hozzá egyéb minősítők
is, pl. 3.0-beta-5, és ezzel máris visszautalok a szoftverkiadás
életciklusára. A Maven ezen kívül nagyon elhatárolja azt a verziót,
melyen a fejlesztők még gőzerővel dolgoznak, ezt snapshot-nak hívja
(3.0-SNAPSHOT), illetve a release-t, mely verzióban értelemszerűen nem
szerepel a SNAPSHOT szó. Egy snapshot tartalmazhat egy szoftvernek több
állapotát is, hiszen a fejlesztők folyamatosan dolgoznak rajta. Ez
annyiban igaz, hogy a repository-ba deploy-kor a SNAPSHOT szó
kicserélésre kerül az adott időponttal, UTC formátumban, pl.
1.0-20080207-230803-1. Ha a Maven függőségeink között SNAPSHOT-ot talál,
akkor a repository-ból mindig a legfrissebbet próbálja letölteni (a
távoli repository-ból alapértelmezetten naponta egyszer próbálkozik, de
ki lehet kényszeríteni a -U kapcsolóval). A release verzió viszont már
egy konkrét állapotot mutat, nem lehet ugyanazon release verzióval két
különböző artifact. Valamint egy relase verzió nem hivatkozhat snapshot
verziókra.

A Maven repository-k közül is megkülönbözteti a release és snapshot
repository-t. Amikor függőségeket kezelünk, akkor a
repositories/repository tag alatt megadhatunk különböző repository-kat.
A releases és a snapshots tag-ekben definiálhatjuk, hogy az adott
repository-ban SNAPSHOT-ok vagy release-ek találhatóak, és hogyan kell
őket kezelni (pl. mindig keresse a legfrissebb verziókat SNAPSHOT
esetén, vagy mi legyen, ha eltér a checksum - hibaüzenetet adjon, vagy
meg is álljon a build). A distributionManagement tag alatt azt adhatjuk
meg, hogy a mi artifact-jaink hova kerüljenek, melyik repository-ba. A
repository tag-en belül írhatjuk a release repository-t, és a
snapshotRepository tag-en belül a SNAPSHOT repository-t.

Az agilis módszertanok azt hirdetik, hogy gyakran érdemes release-elni,
egyrészt, hogy kevesebb funkció, kevesebb módosítás során kisebb a
hibalehetőség, gyorsabbak az iterációk, az ügyfelek, felhasználók azt
kapnak, amit szeretnének. Viszont egy release során sok műveletet kell
elvégezni, amely ha manuális, könnyebb elvéteni. Ilyenek pl. a
verziókezelő műveletek, verzió frissítések, artifact-ek legyártása,
deploy, stb.

Ezen műveletek automatizálását segíti a [Maven Release
Plugin](http://maven.apache.org/maven-release/maven-release-plugin/index.html),
melyet akkor is érdemes részletesen megvizsgálni, ha nem Maven-nel
fejlesztünk.

Két leggyakrabban használt cél (goal) a release:prepare, mely előkészíti
a release-t, és a release:perform, mely végrehajtja azt. A következőket
végzi el a release:prepare:

-   check-poms: megvizsgálja, hogy az adott verzió SNAPSHOT-e. Ha nem
    SNAPSHOT, akkor már megtörtént a release, így nem futtatható
    mégegyszer. (Hibaüzenet: You don't have a SNAPSHOT project in the
    reactor projects list.)
-   scm-check-modifications: megvizsgálja, hogy minden állomány be van-e
    commit-olva. Mivel a release plugin aktívan használj a
    verziókezelőt, ezért a POM-ban az scm tag-nek be kell állítva
    lennie, különben hibaüzenetet kapunk.
-   check-dependency-snapshots: megvizsgálja, hogy nincs-e SNAPSHOT
    függőség. Ha van, akkor hibaüzenetet dob. A plugin-oknál is
    vizsgálja, hogy van-e SNAPSHOT.
-   create-backup-poms: elmenti az előző POM állományt
    (pom.xml.releaseBackup) néven. Ha bármi probléma van, ebből vissza
    lehet állni.
-   map-release-versions: ha a release interaktív, akkor megkérdezi a
    felhasználótól a release verzióját. Fel is ajánl egyet, az aktuális
    verziót SNAPSHOT nélkül, ha jó, elég egy Enter-t ütni.
-   input-variables: ha a release interaktív, akkor megkérdezi a
    felhasználótól a tag nevét. Fel is ajánl egyet, az modul neve +
    aktuális verzió SNAPSHOT nélkül, ha jó, elég egy Enter-t ütni (pl.
    fooapp-1.1).
-   map-development-versions: ha a release interaktív, akkor megkérdezi
    a felhasználótól a következő verzió nevét. Fel is ajánl egyet úgy,
    hogy növeli a minor verziószámot, és hozzáteszi a SNAPSHOT-ot (pl.
    1.2-SNAPSHOT). Ha megfelelő, itt is üthetünk Enter-t.
-   rewrite-poms-for-release: a POM át lesz írva a release verzióra, és
    az scm tag-ben is a tag url-je fog szerepelni.
-   generate-release-poms: a release-eléshez használt POM legenerálásra.
-   run-preparation-goals: az új POM-mal lebuild-eli a projektet, clean
    verify célokkal. Közben a teszt esetek is lefutnak.
-   scm-commit-release: commit-olja a módosított POM-ot.
-   scm-tag: elvégzi a tag-gelést a verziókezelőben.
-   rewrite-poms-for-development: a következő verzióhoz, ami már újra
    SNAPSHOT lesz, elkészíti a POM-ot.
-   remove-release-poms: eltakarítja a release-hez használt POM-ot.
-   scm-commit-development: commit-olja az új POM-ot a verziókezelőbe.
-   end-release: véglegesíti a release-t.

Amikor ez megvan, a könyvtárban létrejön egy release.properties, mely a
tartalmazz a release főbb jellemzőit, valamint egy
pom.xml.releaseBackup, mely az előző POM állomány. Valamint láthatjuk,
hogy a verziókezelőben is megjelenik két commit: \[maven-relase-plugin\]
prepare release fooapp-1.2, valamint \[mavern-release-plugin\] prepare
for next development iteration.

Ha a klasszikus felépítést használjuk a verziókezelőben, Subversion-ben,
hogy projekt név, és alatta a trunk, tags és branches könyvtár, akkor a
tag automatikusan a tags könyvtárba kerül. Ha nem ezt a felépítést
használjuk, akkor paraméterként megadhatjuk a tag helyét a tagBase POM
tag-ben:

{% highlight xml %}
<project>
...
<build>
...
<plugins>
 <plugin>
   <groupId>org.apache.maven.plugins</groupId>
   <artifactId>maven-release-plugin</artifactId>
   <version>2.1</version>
   <configuration>
     <tagBase>https://svn.apache.org/repos/asf/maven/components/releases</tagBase>
   </configuration>
 </plugin>
</plugins>
...
</build>
...
</project>
{% endhighlight %}

Új projektnél, vagy nagyobb verzióváltásnál érdemes a -DdryRun=true
paramétert használni, ilyenkor ugyanazokat kérdezi meg, ugyanazon teszt
eseteket futtatja le, és legenerálja az új POM-ot is, de valójában nem
végzi el a műveleteket, pl. a verziókezelőben. Ha mindent rendben
találunk, kiadhatjuk a release:clean-t, ami letörli az ideiglenes
állományokat, majd a `mvn release:prepare` parancsot, immár az előbbi
paraméter nélkül.

Amennyiben nem kézzel akarjuk megadni a verziószámokat, használhatjuk a
batch módot ([Non-interactive
Release](http://maven.apache.org/maven-release/maven-release-plugin/examples/non-interactive-release.html)),
ehhez a `mvn --batch-mode release:prepare` parancsot kell kiadni. Ekkor
automatikusan azokat a verzószámokat adja, melyeket amúgy felajánlana.
Ekkor felülbírálhatjuk az alapértelmezett értékeket a parancssorban is:

    mvn --batch-mode -Dtag=my-proj-1.2 release:prepare \
                -DreleaseVersion=1.2 \
                -DdevelopmentVersion=2.0-SNAPSHOT

Vagy magunk írjuk meg a release.properties állományt.

Használhatjuk a release:rollback célt is, ekkor az elmentett POM
visszaállításra kerül, amit be is commit-ol. Vigyázzunk, a tag-eket nem
törli le. Így ha pl. újra akarunk prepare-t futtatni, előtte kézzel el
kell távolítanunk a tag-et, mert jelezni fog, hogy már van tag olyan
néven.

Ha viszont minden megfelelően zajlott, akkor kiadhatjuk az
`mvn release:perform` parancsot, mely a következő lépésekből áll:

-   verify-completed-prepare-phase: megvizsgálja, hogy a prepare cél le
    lett-e futtatva.
-   checkout-project-from-scm: a target könyvtárba a teljes projektet
    checkout-olja, méghozzá az előbb tag-geltet.
-   run-perform-goals: fork-ol egy új Maven példányt, és elindítja a
    checkout-olt projekten a deploy célt.

A deploy során nem csak a fő artifact-ot készíti el, és deploy-olja,
hanem a forrást, valamint a JavaDoc-t is tartalmazó artifact-ot is, és
mindhármat feltölti, immár a release repository-ba (ezért be kell
állítani a distributionManagement/repository tag-et).

Ez után nekem mindig kellett manuálisan egy svn update parancsot
kiadnom, mert nem volt up-to-date.

Ha útközben valami hiba történt, és le akarjuk törölni az ideiglenesen
generált állományokat, a release:clean célt futtassuk. Vigyázzunk, ha
ezt a release:prepare után adjuk ki, akkor már nem lehet a
release:rollback parancsot használni, hiszen az a pom.xml.releaseBackup
alapján dolgozik, melyet a clean letöröl.

Ezt a folyamatot a [Apache Maven 2: Effective
Implementation](https://www.packtpub.com/application-development/apache-maven-2-effective-implementation)
könyv is részletesen tárgyalja, míg a Sonatype-os
[könyvek](%20http://www.sonatype.org/nexus/resources/resources-book-links-and-downloads/)
viszont nem.

Az érdekességek persze akkor fognak előjönni, ha nem egy egyszerű
projektünk, hanem vagy szülő projektet adtunk meg, vagy multi module
projektünk van.

Szülő projekt megadásakor arra kell figyelni, hogy először mindenképp a
szülőt kell release-elnünk, majd a gyermekben átállni a release-elt
verzióra, mert ha először a gyermeket release-eljük, annak a SNAPSHOT
szülőre lesz hivatkozása, ami nem megengedett.

Multi modul esetén, amikor a POM tartalmazza a modulokat, azaz a build
egyben elvégezhető, a release is egyben elvégezhető. Ekkor az összes
almodulnál be fogja kérni a release verziószámot, és következő
verziószámot. Tag-et csak egyet kért be és csinált. Erőssége, hogyha a
modulok egymásra, és a szülőre SNAPSHOT verzióval hivatkoznak, azt az
összes helyen, az összes modul POM-jában kicseréli a megfelelőre.

Itt használhatjuk a -DautoVersionSubmodules=true paramétereket, és ekkor
egyszer kéri be ezeket az értékeket, és az összes almodul ugyanazt
kapja. Valamint megadhatjuk ezeket parancssorban, vagy a fentebb
említett properties állományban, például a következőképpen:

    scm.tag=my-proj-1.2
    project.rel.org.myCompany\:projectA=1.2
    project.dev.org.myCompany\:projectA=1.3-SNAPSHOT

Ekkor a rel mutatja, hogy a release verziószám az 1.2-es lesz az
org.myCompany group id-jú, és projectA artifact id-jú projektnek, és dev
mutatja, hogy a következő SNAPSHOT verziószám a 1.3-SNAPSHOT.

Lehet a modulokat tartalmazó modult is relase-elni az almodulok nélkül a
`mvn -N -Darguments=-N release:perform release:prepare` paranccsal.
Valamint a gyerek modult is lehet release-elni a szülő nélkül, a
hagyományos módon, ekkor viszont nekünk kell a gyerek modulokban a szülő
modulnál a SNAPSHOT-ot manuálisan eltávolítani.

Multi modul esetén a modulokat tartalmazó POM-ot elhelyezhetjük
hierarchikusan az almodulok fölé, azaz egy könyvtárban az almodulokat
tartalmazó könyvtárakkal. Ezt hívják nested modellnek. Valamint
megoldhatjuk úgy is, hogy a modulokat tartalmazó POM-nak is egy külön
könyvtárat csinálunk, egy szinten az almodulokkal, és az almodulokra úgy
hivatkozunk, hogy ../foosubmodule1, ezt nevezik flat modellnek. A
release plugin régebbi verziói csak az első, a nested módot támogatták.
Elvileg ezt javították, gyakorlatilag nekem is csak a nested mód
működött elsőre. Ez azért érdekes, mert az Eclipse m2eclipse modulja meg
viszont csak a flat modellt támogatta. Azt viszont próbálgatásaim
alapján tényleg javították. Így én a nested módot javaslom.

Multi modul projekt esetén kérdés, hogy az verziókezelőben hogyan
érdemes a hierarchiát szervezni. Egyrészt lehet úgy Subversion esetén,
hogy felül van a trunk, tags és branches könyvtár, és abban az
almodulok, másrészt lehet úgy is, hogy az almodulok alatt mindenhol ott
a trunk, tags és branches könyvtár. Amennyiben az elsőt választjuk,
egyszerűbb egy teljes projektet build-elni, hiszen az egészet egy
művelettel ki lehet checkout-olni. Viszont almodulonként is
release-elünk, és a tags alatt nem akarjuk keverve látni az összes
almodul tag-jeit, akkor használni kell a tagBase POM tag-et. A második
esetben a checkout macerásabb, viszont a release plugin alapból ezt
támogatja. Ezt úgy szokták megtrükközni, hogy létrehoznak egy
könyvtárat, és a Subversion
[`svn:externals`](http://svnbook.red-bean.com/en/1.5/svn.advanced.externals.html)
tulajdonságával hivatkoznak a Subversion repository másik könyvtáraira.
Így a checkout egy művelettel elvégezhető. Ugyanez alkalmazható a
branch-eknél is.

Egy gyakori jótanács, hogy sosem saját gépen release-eljünk, hanem a
build szerveren, lehetőleg valamilyen continuous integration eszköz
segítségével. Nézzük pl. hogy hogy is megy ez
[Hudson](http://hudson-ci.org/) segítségével. A Mavenhez van külön egy
plugin, az [M2 Release
Plugin](http://wiki.hudson-ci.org/display/JENKINS/M2+Release+Plugin).

A Hudson web konténerbe is telepíthető, de önmagában is futtatható.
Töltsük le a WAR fájlt, és elindítható a `java -jar hudson.war`
paranccsal, és elérhető lesz a localhost-on a 8080-as porton. A plugin-t
telepíteni úgy lehet, hogy a Manage Hudson menüpontban a Manage Plugins
funkciót kell kiválasztani, majd az elérhető plugin-ek között ki kell
választani a következőt: M2 Release Plugin This plugin allows you to
perform a release build using the maven-release-plugin from within
Hudson. Majd az Install gombot megnyomni, és a sikeres visszajelzés után
újra kell indítani a Hudson-t. Ha ez megvan, akkor a job-oknál a
Configure Job menüben a Build Environment cím alatt meg fog jelenni egy
Maven release build checkbox. Ha ezt bepipáljuk, akkor a
konfigurálhatjuk azokat a release-sel kapcsolatos dolgokat, melyeket
parancssorban is.

![Build environment](/artifacts/posts/2010-10-25-release-mavennel-es-hudsonnel/hudson-maven-release-1_b.png)

Ha ezt bekapcsoljuk, akkor meg fog jelenni egy Perform Maven Release
menüpont az adott job-nál, melyre klikkelve választhatunk, hogy batch
módben fusson, automatikus verziószámozással, vagy mi adhassuk meg az
összes almodulnak a verziószámát, vagy egy verziószámot adunk meg az
összes modulnak.

<a href="/artifacts/posts/2010-10-25-release-mavennel-es-hudsonnel/hudson-maven-release-2_b.png" data-lightbox="post-images">![Perform Maven Release](/artifacts/posts/2010-10-25-release-mavennel-es-hudsonnel/hudson-maven-release-2.png)</a>

Viszont multi modul projekt esetén mi van, ha a modulok külön életet
élnek (release child modules independently)? Azaz egy almodulban
szeretnék csak verziószámot emelni. A Maven ezt nem annyira támogatja,
inkább azt vallja, hogy egy több modulból álló projektet egyszerre kell
build-elni és release-elni is. Sőt ezt meg lehet oldani úgy is, hogy
alkalmazásszinten, lásd pl. OSGi, vagy ne menjünk messzire, Hudson.
Maven esetén ugyanis ha egy multi modul projektnél kiadunk egy
release-t, az összes almodul verziószámát emeli.

Egyik megoldás lehet, hogy a verziókezelőben minden modult a trunk alá
tesztünk, de a tag helyét a tagBase konfigurációval átállítjuk. Nested
módot, azaz hierarchiát használunk, de a szülőt sosem release-eljük a
gyerekekkel (-N kapcsoló), csak magában.

A másik megoldás [itt
található](https://stackoverflow.com/questions/1581877/migrating-to-maven-from-an-unusual-svn-directory-structure),
mely során a verziókezelőben almodulonként trunk, tags és branches
könyvtár van. Valamint a szülő egy külön projekt, az almodulokkal egy
szinten, és ez nem tartalmaz hivatkozásokat az almodulokra (azaz lehet
release-elni a gyerekek nélkül is). És lehet egy külön projekt, mely már
tartalmaz hivatkozásokat az almodulra, de ez nem kerül release-elésre,
és svn:externals-szal tartalmaz hivatkozásokat a megfelelő modulokra.

A modulokat mindkét esetben külön job-ként kell felvenni a continuous
integration eszközbe, hogy külön release-elhetők legyenek.

Alapvetően a Maven-ben a convention over configuration tetszik, mely
lehetővé teszi, hogy egyrészt kis energiabefektetéssel lehessen
projekteket felépíteni, valamint ne kelljen gondolkozni a különböző
konfigurációkon. Sajnos egy multi modul projektnél, ahol külön akarunk
release-elni modulonként, nem érzem ezt az elvet. Nincs konvenció arra,
hogy hogyan kéne felépíteni a projekt struktúrát (lásd nested kontra
flat), hogyan kell ezt a verziókezelőben megjeleníteni, és hogyan lehet
szépen release-elni. A net tele van ilyen típusú kérdésekkel, és
mindenki leírja a saját megoldását, mely általában vérzik pár sebből.
Nem tudom elfogadni azt az állítást, hogy minden projekt más, azért
nincs egyértelmű megoldás, mert mindenki ugyanazokat a kérdéseket teszi
fel.

Aki ebben a témában még tovább akar gondolkodni, olvassa el a
[jTechnics](https://github.com/elek/blog.anzix.net/blob/master/_posts/2010-07-27-maven-release-hudson.md)
oldalon megjelent cikket.
