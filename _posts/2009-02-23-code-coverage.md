---
layout: post
title: Code coverage
date: '2009-02-23T21:51:00.003+01:00'
author: István Viczián
tags:
- Tesztelés
modified_time: '2018-06-09T10:00:00.000-08:00'
---

A code coverage (lefedettség mérés) egy olyan technika, mellyel az
mérhető, hogy a kód mely részei futottak le. Tesztelésnél alkalmazzák,
ahol összehasonlítják a forráskódot, valamint azt, hogy egy konkrét
teszt készlet (test suite) végrehajtása során ténylegesen a kód mely
sorai futottak le. Emiatt a white box tesztelés egy formája.

A code coverage célja olyan kódrészletek megtalálása, melyekre a teszt
során nem került a vezérlés, valamint pl. olyan feltételek
kiválasztásra, melyeknek csak egyik ága futott le.

Általában százalékban szokták megadni, ami kifejezi a tesztelt és az
összes kódsor viszonyát.

Elvileg ideális az lenne, hogy újrafuttatható teszt eseteket
implementálunk (netalán már a funkcionalitás implementálása előtt - lsd.
test driven development), közben beállítunk egy code coverage eszközt,
és a teszt esetekkel megpróbáljuk az összes kódsort tesztelni, így
100%-os lefedettséget teljesíteni. Én személy szerint valódi projektben
nehezen tudok elképzelni ilyent, és ettől óva is intenék mindenkit, a
következő okok miatt:

-   Nagyon időigényes, így projekt költségét nagymértékben megnövelheti
-   Rettentő fárasztó, unalmas, abszolút nem kreatív munka ilyen teszt
    eseteket írni, ilyen mennyiségben, amit a fejlesztők nagyon nem
    szeretnek
-   A code coverage nem mutatja ki a hiányzó funkciókat
-   Teljes lefedettség esetén sem biztosítható a hibamentes működés

Javaslom ezt is egy eszközként használni a többi között, mely segíthet a
tesztelésben, rámutathat a hibákra, de meg kell találni az arany
középutat. Ne próbáljunk meg teljes lefedettséget elérni, sőt egy
viszonylag jó lefedettséget is csak fokozatosan érjünk el. Nagyon
fontos, hogy amennyiben találtunk egy nagyobb kódrészletet, amit nem
teszteltünk, akkor ne egy olyan teszt metódust írjunk, ami leteszteli az
adott kódrészletet, hanem lépjünk háta egyet, és próbáljuk meg azt az
üzleti igényt megfogalmazni, melyet az adott kódrészlet valósítana meg,
és azt teszteljük. Ezáltal elkerülhetjük, hogy fogalom nélkül, csak az
adott metódust teszteljük le attól függetlenül, hogy vajon hol is
helyezkedik el a rendszerben, milyen nagyobb funkciónak a része.

Azon projektekben, ahol nem alkalmazunk automatikus unit teszteket, ott
is jól tud jönni. Ha a tesztelést manuálisan végzik, külön erre delegált
szakemberek, akkor is hasznos lehet. A teszt eseteket ekkor is írjuk le
(Word dokumentumban, Excel táblázatban strukturáltan, de vannak erre
külön eszközök). Javasolt, hogy az első pár teszt esetet a fejlesztő
írja le, egy gyors kódpásztázás alapján a főbb elágazásokat, képernyőket
figyelembe véve (white box). Utána a manuális tesztelők hajtsák végre a
teszt eseteket, majd a fejlesztő nézze meg, hogy mely kódsorok maradtak
ki. Ezután a kód alapján vissza kell fejteni azon funkcionalitásokat
(nem metódusokat, kódrészleteket!), melyek tesztelése részleges,
netalántán teljesen kimaradt. Ez alapján lehet továbbfejleszteni a teszt
eseteket. A ciklust megismételve (mondjuk új release-enként) így előbb
utóbb egy jó lefedettséget produkáló teszt forgatókönyv jön létre.
Természetesen a teszt forgatókönyvet a manuális tesztelést végzők is
módosíthatják, pontosíthatják, kiegészíthetik a felhasználói
követelmények alapján.

Hasznos lehet még, hogy nem csak az aktuális lefedettséget vesszük
figyelembe, hanem a trendeket is nyomon követjük. Ha nagymértékben
csökken a lefedettség, az arra utalhat, hogy a rendszerbe újabb funkciók
kerültek be, de új teszt esetek nem készültek, esetleg néhány teszt eset
futtatása kimaradt.

Több mérőszámot is definiáltak, bizonyos mérőszámok csak Java
környezetben értelmezettek:

-   Class coverage: mely osztályok vettek részt a futásban
-   Method coverage: mely metódusok lettek meghívva
-   Statement coverage: mely kódsorok futottak le, akár metódus, osztály
    és package szinten aggergálva
-   Block coverage: itt nem kódsorok, hanem blokkok az alapegységek
-   Decision coverage (vagy ismert Branch coverage néven is): elágazás
    esetén minden ág lefutott-e
-   Path coverage: minden lehetséges lefutási útvonal lefutott-e
-   stb.

A különböző eszközök kiválasztásánál a következő szempontokat vehetjük
figyelembe:

-   Mennyire integrált egy fejlesztőeszközzel
-   Mennyire integrált egy build tool-lal (pl. Ant, Maven)
-   Milyen kimeneti formátumokat támogat (XML, HTML elvárt), és azok
    milyen minőségűek, könnyen navigálhatóak
-   Mennyire támogatja a trendek figyelését
-   Ki lehet-e zárni bizonyos kódrészleteket (pl. 3rd party library-k)

Az eszközök megvalósítása is eltérő lehet. Egyrészt módosíthatják a
forráskódot, amit a fordító lefordít, vagy a már lefordított bájtkódot
matatják (instumentation). Az utóbbi történhet build time-ban, vagy akár
futás közben speciális classloader segítségével.

Vigyázzunk, hogy a code coverage megnövelheti mind a
processzorterhelést, mind a memóriaigényt. Emiatt javasolt csak teszt
környezetben használni, és ott sem terheléses teszt közben. Az előbbi
miatt lehet az is, hogy bizonyos párhuzamossági, vagy real time
rendszerben jelentkező hibák elő sem jönnek tesztelés közben. Az
[Atlassian Clover](http://www.atlassian.com/software/clover/default.jsp)
egy remek, ám kereskedelmi termék. Nagyon jó felülettel, rengeteg
funkcióval rendelkezik, integrálható a JUnit-tal, és Eclipse és IntelliJ
IDEA plugin is van hozzá. A [NetBeans Unit Tests Code Coverage
Plugin](http://codecoverage.netbeans.org/) egy ígéretes eszköz, mely a
NetBeans-be épül be, de sajnos egyelőre csak a unit tesztek és az
egyszerű alkalmazásokat tudja követni, webes alkalmazásokat még nem. A
két leggyakrabban említett nyílt forráskódú, ingyenes egyköz a
[Cobertura](http://cobertura.sourceforge.net/) és az
[Emma](http://emma.sourceforge.net/index.html). Az előbbi talán
könnyebben emészthető riportot generál, míg az utóbbi több funkcióval
rendelkezik (pl. class, method, block coverage, runtime instrumentation,
adatok JVM leállítása nélküli mentése vagy törlése, stb.)

Nézzük, hogy hogyan is kell a Cobertura-t beállítani egy egyszerű webes
alkalmazáshoz, NetBeans esetében. Az alapvető elvárás az volt, hogy
minden fejlesztő számára minimális konfigurációval beüzemelhető
lehessen.

Ehhez egyrészt a projekt lib könyvtárába másoltam a Cobertura számára
nélkülözhetetlen jar állományokat (asm-3.0.jar, asm-tree-3.0.jar,
jakarta-oro-2.0.8.jar, log4j-1.2.9.jar), valamint a következőket adtam
hozzá a NetBeans által generált build.xml-hez.

```
<loadproperties srcFile="build.properties"/>

<path id="cobertura.classpath">
   <fileset dir="lib/cobertura/">
       <include name="*.jar" />
   </fileset>
</path>

<taskdef classpathref="cobertura.classpath"
 resource="tasks.properties" />

<target name="cobertura-instrument" if="cobertura.instrument">
   <cobertura-instrument todir="build/web/WEB-INF/classes">
       <fileset dir="build/web/WEB-INF/classes">
           <include name="**/*.class" />
       </fileset>
   </cobertura-instrument>
</target>

<target name="-pre-dist" depends="cobertura-instrument" />

<target name="report">
   <cobertura-report format="html" destdir="dist/coverage"
    srcdir="src/java"/>
</target>
```

Ez a részlet betölti a build.properties állományt, és ha abban szerepel
a cobertura.instrument property, akkor instrumentálni (statikust, azaz
build idejűt támogat) fogja a class állományokat. Így ezen property
megjegyzésbe helyezésével egyszerűen kikapcsolható. Mivel a -pre-dist
előfeltétele a cobertura-instrument task futtatása, a war állomány
becsomagolása előtt fogja a class állományokat módosítani. A futtatáshoz
a Coberturá-hoz szükséges JAR állományokat a konténer, NetBeans esetén
pl. a Tomcat classpath-jában kell elhelyezni (lib könyvtár), és nem a
war állományban. A projektet fordítva a projekt gyökerében azonnal létre
fog jönni egy cobertura.ser állomány, melyet az instrumentálás hoz
létre. Fontos, hogy a futás közben is ezt a ser állományt kell
használni, ehhez a Tomcat-nek adjuk meg a következő kapcsolót
-Dnet.sourceforge.cobertura.datafile=\${basedir}/cobertura.ser a
Tools/Servers ablak Platform fülén a VM Options mezőbe. A \${basedir} a
projektünk könyvtárát jelenti, ahol az előbb létrejött a ser állomány.
Amennyiben nem így teszünk, a riportban 0%, 100% vagy na értékek fognak
szerepelni. Fontos, hogy ahhoz, hogy a code coverage információk ki
legyenek írva lemezre, le kell állítani a konténert. Ez után már
futtathatjuk is a report task-ot, mely a dist könyvtárban létrehoz egy
html jelentést, a [Cobertura honlapján található
példához](http://cobertura.sourceforge.net/sample/) hasonlót.

A Cobertura-nak ezen kívül több funkciója is van: használható
parancssorból, képes XML kimenet generálására, képes WAR, JAR
instrumentálására, osztályok minta szerinti kihagyására, különböző ser
fájlok összefésülésére, valamint threshold értékek megadására (melyek
túllépése leállítja a build folyamatot).

A riportban megjelenik a cyclomatic complexity is. Ez egy mérőszám,
melyet statikus kódelemzéssel meg lehet állapítani, és gyakorlatilag a
program bonyolultságát méri. Szokás McCabe számnak is nevezni a
feltalálójáról, aki 1976-ban publikálta. Ez a szám meghatározza egy
programon belül a lineárisan független futási ágak számát. Gyakorlatilag
egy gráfon dolgozik, ahol a csomópontok a programutasítások, és két
csomópont akkor van irányítottan összekötve, ha az egyik utasítás futás
közben követheti a másikat. Ennek a formális definíciója: M = E − N +
2P, ahol M a cyclomatic complexity, az E az élek száma, az N a
csomópontok száma, és a P a maximális kapcsolódó algráfok száma. Ez
egyszerűbben is meghatározható, méghozzá úgy, hogy meg kell számolni a
zárt körök számát, és hozzáadni a kilépési pontok számát.

Egy Java metódusban össze kell számolni a program lefutását módosító
elemeket, és hozzáadni egyet. Ilyenek: return, if, else, case, default,
for, while, do-while, break, continue, &&, ||, ?:, catch, finally, throw
vagy throws, thread start().

A cyclomatic complexity gyakorlatban egy metódus komplexitását adja meg.
Minél bonyolultabb, annál nehezebb megérteni és karbantartani. Kb. 10-es
komplexitás a max, amit még érdemes használni.

Azért szerepel gyakran a code coverage eszközökben, mert ez a szám adja
meg azon teszt esetek számát is, melyekkel az összes lehetséges lefutási
módot tesztelni lehet. Más statikus elemző eszközök is tudnak ilyent
számolni, mint pl. a PMD.

Abban az esetben, ha elértük a cyclomatic complexity határát, és
csökkenteni akarjuk, akkor forduljunk a refactoring-hoz, melynek első
lépése egy teszt eset gyártása. Utána vagy csökkentsük a bonyolultságát,
vagy vezessünk be új, beszédes nevű metódusokat. A funkcionalitást ne
módosítsuk. A refactoring után ezt az előbb megírt teszt esettel
ellenőrizhetjük.
