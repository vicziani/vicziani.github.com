---
layout: post
title: Maven bevezetés, modernizáció
date: '2011-09-18T14:24:00.010+02:00'
author: István Viczián
tags:
- Maven
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Technológiák: Maven 3.0.3

Valahogy az elmúlt időszakban úgy alakult, hogy három projektben is
Maven szaktanácsadást nyújthattam. Ebből egy egy teljesen nulláról
induló projekt, egy Antról migrálós projekt valamint egy már meglévő
Maven projekt továbbfejlesztése. Az ezekben szerzett tapasztalatokról
szeretnék itt beszámolni.

Ebből a legizgalmasabb a már létező Maven projekt modernizálása, egy
Gibraltáron működő online szerencsejáték cégnek, ahova a meghívást
[Magyusz](http://britpalmak.blogspot.com/) és Cseki haverom intézte,
akik ott vezető programozói státuszban tevékenykednek. Ezúttal is
köszönöm nekik! [Három napot töltöttem a
projektben](http://britpalmak.blogspot.com/2011/07/magyarok-majd-megoldjak.html),
ami során sikerült megismerni a jelenlegi Maven struktúrát, a legjobb
gyakorlatokat alkalmazni, és felderíteni a gyenge pontokat. Persze sok
utómunkával jár, és vannak ötletek, hogy merre lehetne tovább fejlődni.
A három nap tartalmazta a verziókezelés folyamatának kialakítását is, az
előző postjaim ezekről szóltak.

Gibraltáron eltöltött öt nap
benyomások szerzésére volt elegendő. Egy apró brit tengerentúli terület
(7 négyzetkilométer), ami minden egyes pontján erősen érződik is. Angol
a hivatalos nyelv, emeletes busz, klasszikus londoni telefonfülke és még
sok minden megtalálható itt. Amiről az úti beszámolók a leggyakrabban
írnak, hogy az országba jutáskor át kell kelni a repülőtér
felszállópályáján, ami keresztezi a határról érkező utat, lámpával
irányítva, ami piros, ha épp egy repülőgép száll fel, vagy le. Valamint
a szikla tetején (, ahonnan gyönyörű a kilátás minden irányban) élő
Európában egyedülállóan szabadon élő majmok híresek itt. Apropó
Gibraltár egy hatalmas mészkőszikla, ami ki tudja honnan került ide, és
át és át van lyuggatva, mint a sajt, belsejében érdekesebbnél érdekesebb
és titkos dolgokkal, valamint egy kis feltöltött terület. Déli pontjáról
tiszta időben szépen látszik Afrika. Északon Spanyolországgal határos, a
nem éppen legszebb La Linea de la Conception várossal, de kicsit
messzebb menve már gyönyörű helyekre lehet eljutni, mint egy
[siklóernyős
starthely](http://britpalmak.blogspot.com/2011/07/sikloernyos-etterem.html),
vagy egy [kitesurf
paradicsom](http://britpalmak.blogspot.com/2011/07/kitesurf-paradicsom.html),
az óceánnál.

<a href="/artifacts/posts/2011-09-18-maven-bevezetes-modernizacio/gib1_b.jpg" data-lightbox="post-images">![Háttérben Gibraltár](/artifacts/posts/2011-09-18-maven-bevezetes-modernizacio/gib1.jpg)</a>

A cég nagyon meggyőző volt, látszott, hogy komolyan veszik, amit
csinálnak. Olyan hangulat uralkodott, hogy érződött, hogy odafigyelnek a
munkájukra. A társaság igen vegyes, mind nemzetiségileg, mind
szakmailag. Érdekes jelenség, hogy a szerverekkel nem fukarkodnak,
azonban az emberi erőforrásokban sokkal inkább. Egyik szobában a
sporteseményeket követték, impresszív volt a minden asztalon három LCD
monitor, valamint a mennyezetről lógó plazmatévék sora. Természetesen a
fejlesztőknél is volt egy tévé, hogy a fontosabb sporteseményeket
követni lehessen. Alapvetően különbségeket azonban nem tapasztaltam, sem
szakmailag, sem technológiailag. Az irodából kilépve azonban azonnal
elöntötte a mediterrán hangulat, a meleg, a késő este is napsütés,
tengerpart, a hatalmas és tekintélyt parancsoló, a kikötőben állomásozó
hajókkal, vonzották az embert a part menti bárok és kaszinó.

<a href="/artifacts/posts/2011-09-18-maven-bevezetes-modernizacio/gib2_b.jpg" data-lightbox="post-images">![Gibraltári kikötőben](/artifacts/posts/2011-09-18-maven-bevezetes-modernizacio/gib2.jpg)</a>

Lássuk, hogy hogyan is telt a szakmai három nap, hogyan lehet egy Maven
"rendrakást" kivitelezni. Egy build folyamat modernizációja subproject
sem tér el a klasszikus szoftverfejlesztéstől, ugyanúgy van
követelményfelmérés, tervezés, implementáció és tesztelés. Ugyanúgy
iterációkra kell bontani, és dokumentációval megtámogatni. A következő
lépésekből áll a folyamat.

### Követelmények

A projekt célját érdemes tisztázni. Mi a probléma a jelenlegi
folyamattal, mi nehezíti a build folyamatban legjobban a
szoftverfejlesztést, mi az ami "legjobban fáj"?. Lehet ez a túl durva
vagy túl finom granularitású modularizáció, a hosszú build, a nehézkes
fejlesztés, a sok szaktudást igénylő release. Meg kell hallgatni az
ügyfelet, hogy milyen ötletei vannak, hiszen ő él a projektben, lehet,
hogy sejti, esetleg tudja, hogy mit és hogyan szeretne. Hasznosak a
mérőszámok, pl. projektek száma, pom.xml állományok száma, benne
szereplő sorok száma, build folyamat hossza időben, stb.

A felmérés során meg kell ismerni a jelenlegi rendszer architektúráját
is, én komponens diagramot használok. Milyen alkalmazások futnak, ezek
hogyan kapcsolódnak egymáshoz, milyen közös könyvtárakat használnak.
Milyen típusú alkalmazások vannak, standalone, web alkalmazások, esetleg
Java EE alkalmazások. Milyen környezetben futnak, milyen operációs
rendszerek, alkalmazásszerverek használtak, mennyire fontos a
platformfüggetlenség. A build folyamat szempontjából ezek cseppet sem
elhanyagolhatóak, hiszen ez alapján nagyjából sejteni lehet, hogy mennyi
és milyen típusú artifactokra lehet számítani. Ez esetemben kb. tíz
alkalmazás, közte standalone és webes is.

Fel kell térképezni a jelenlegi Maven struktúrát. Ez a fejlesztői
környezet installálása saját gépen (rögzítsük, hogy ez milyen lépésekből
áll, mennyire bonyolult, hogyan lehet egyszerűsíteni), valamint annak
futtatása. Rögzítsük impresszióinkat, mennyi ideig tart, vannak-e
figyelmeztetések, hibaüzenetek. És a legunalmasabb rész, át kell böngészni
egyesével a `pom.xml`-eket, és jegyzeteket készíteni, hol lehet és kell
módosítani. Közben rögzítem azokat az eszközöket is, amelyek nem
szokványosak, pl. egyedi forráskód generálás, stb. Feljegyzem, hogy hol
"bűzlik a kód". Az ügyfelet is kérdezzük meg, hogy hol érzi rossznak,
mit miért csináltak, mert ilyenkor lehet rábukkanni arra, hogy valamiért
speciális/egyedi-e az adott projekt, valamint vannak-e hiányosságok az
ügyfél tudásában, vagy bizonyos megoldások mellett miért döntött.

Én közben egy függőségi gráfot is rajzolok. Osztálydiagramot szoktam
alkalmazni, ahol színekkel jelzem az alkalmazások típusait, valamint
dependency-vel a függőségeket, kompozícióval a modul tartalmazást és
generalizációval a szülő kapcsolatot.

<a href="/artifacts/posts/2011-09-18-maven-bevezetes-modernizacio/modulok_b.png" data-lightbox="post-images">![Kép leírása](/artifacts/posts/2011-09-18-maven-bevezetes-modernizacio/modulok.png)</a>

Nem javaslom a függőségi gráfok generálását. Egyrészt, ha magunk
rajzoljuk, sokkal jobban megértjük, valamint vannak olyan függőségek,
amik evidensek, és csak az ábrát bonyolítanák (pl. egy common könyvtárra
biztos mindenki hivatkozik). Valamint ezek az eszközök értelmesen sem
tudják elhelyezni az artifact-okat.

Sajnos gyakran futok bele olyan projektekbe is, ahol körkörös függőségre
bukkanok. Pl. a common library-ra hivatkozik a service és a ui réteg is,
de a common visszahivatkozik az ui rétegre. Kiemelten kezeljük ezeket a
problémákat.

Vizsgáljuk meg a külső függőségeket. Ezeket feltűnően lazán szokták
kezelni, bekerül a projektbe, de utána kikerül, de a függőségek közül
nem távolítják el. Nem megfelelő scope-ba veszik fel, pl. csak
teszteléskor van rá szükség, mégis normál függőségként szerepel.
Egymással ütköző library-k vannak, melyek csak a véletlennek
köszönhetően működnek együtt (pl. előbb van a classpath-on), ilyenek
pl. az naplózó keretrendszerek, az XML library-k. Láttam olyant is, hogy
egy library-nak különböző verziói szerepeltek a függőségek között (pl.
változott a library group vagy artifact id-ja). Egy feladatra különböző
library-k szerepelnek a projektbe, pl. az előbb említetteken túl több
webes keretrendszer, REST API, SOAP API, perzisztencia réteg, stb. Sokan
megfeledkeznek róla, de ellenőrizzük a licence-eket is.

Vizsgáljuk meg a teszt eseteket. Granularitásukat, bonyolultságukat.
Gyakran keverednek a fogalmak, pl. unit tesztek között találhatunk
integrációs tesztet, ami nagyobb egységet tesztel, esetleg külső
rendszerekre, adatbázisra is szüksége van.

Egyeztessünk, milyen riportokra állnak rendelkezésre, és ezek közül
melyekre van szükség?

### Tervezés

Amint felmértük a követelményeket, az ügyfél elvárásait, tervezzük meg a
migráció, bevezetés folyamatát. Bontsuk lépésekre, definiáljuk a lépések
scope-ját.

Első esetben mindenképpen az elvárt struktúrát tervezzük meg, a már
fentebb említett osztálydiagrammal. Lehet, hogy nem kell rajta
változtatni, lehet, hogy gyökeres változtatásokat kell bevezetni. Amit
mindenképpen meg kell szüntetni, az a körkörös függősségek. Ki kell
találni a megfelelő granularitást, új modulokat bevezetni, modulokat
összevonni vagy szétválasztani.

Válasszuk ki a megfelelő eszközöket. Amennyiben úgy gondoljuk, ne
erőltessük a Mavent. Nem minden projekt, és nem minden fejlesztőgárda
tud megfelelően illeszkedni hozzá. Minél szabványosabb a projekt, annál
egyszerűbb adoptálni. Amennyiben túl sok egyediség van az
architektúrában, a fejlesztési folyamatban, vagy a fejlesztők nem eléggé
nyitottak a Maven irányába, alaposan gondoljuk meg, hogy van-e értelme,
ilyen környezetben kétes a projekt sikere. Amennyiben azonban a Maven-t
válasszuk, jelöljük meg, hogy milyen plugin-eket kívánunk használni.
Dokumentáljuk döntéseinket.

Elemezzük a függőségeket. Tervezzük meg, hogy mely függőségek
maradhatnak, azok milyen scope-ban. Nézzük meg, hogy a legfrissebb
verziók kerültek-e felhasználásra, és ha nem, ennek van-e valamilyen
oka. Tervezzük meg, hogyan szüntethetjük meg az ütközéseket. Nézzük meg,
hogy mely függőségek nem publikus repository-ból kerülnek letöltésre,
létezik-e publikus megfelelőjük. Ha nem, honnan származnak, megvan-e a
forráskódjuk.

Tervezzük meg, hogy az alkalmazások verziószáma hogyan jelenik meg a
felületen, és a build folyamat során hogyan kerül beírásra. Erről szól
az előző
[posztom](/2011/09/13/verzioszam-megjelenitese.html)

Tervezzük meg a test harness-t. Elegendő-e a JUnit, vagy érdemesebb-e a
TestNG-t használni. Mivel mérjük a kódlefedettséget? Milyen integrációs
teszt keretrendszert használjunk.

Tervezzük meg a használni kívánt riportokat, azok paraméterezését.

Én a tervezési fázisban egy olyan dokumentációt is készítek, mely
leírja, hogy a fejlesztő csapatnak milyen feladatokat kell elvégeznie.
Ez egyrész tartalmazza azokat a feladatokat, melyek előfeltételei a
migrációnak. A forráskód, a rendszer megismerésével is találkozni lehet
olyan problémákkal, amiket érdemes jelezni, de nem tartoznak szorosan a
modernizációhoz - ezeken a fejlesztőcsapat akár párhuzamosan is
dolgozhat. Valamint egy olyan dokumentációt is írok, mely a build
folyamat továbbfejlesztési lépéseit is tartalmazza, hiszen nem hiszek
abban, hogy egyszerre túl nagyot kéne lépni, érdemes kis lépésekben
elvégezni a bevezetést. Hiszen az első használatbavételkor pontosodnak
majd az igények.

### Implementáció

Amennyiben van olyan teendő, mely blokkolja a Maven build bevezetését,
továbbfejlesztését, meg kell várnunk azok befejezését. Találkoztam olyan
projekttel, ahol ez több hetet is igénybe vett, hiszen az élet nem
állhat meg, a fejlesztő csapat nem minden esetben képes csak a
modernizációra figyelni, közben új verziókat kell kiadni, hibákat
javítani, stb.

Első körben, amennyiben a projekt még nem végleges, egy olyan build
folyamatot valósítsunk meg, mely bitre pontosan ugyanazokat az
artifact-okat gyártja le, mint az előző build folyamat (pl. scriptek,
Ant `build.xml`-ek). Bár lehet, hogy nagyobb refactoringot kell
elvégeznünk, ez mégis segít a megértésben, a trükkös megoldások
felderítésében, a projekt sajátosságainak megértésében. És azonnali
eredményt biztosít, hiszen azonnal bevethetjük.

Alakítsuk ki a könyvtárstruktúrát, lehetőleg a Maven által definiált
kvázi szabványoknak megfelelően, és írjuk, módosítsuk a `pom.xml`
állományokat, és alakítsuk ki a verziókezelő struktúrát. A `pom.xml`-ek
megírására most nem térnék ki, a követendő legjobb gyakorlatok a
következő posztom tárgya. Konvencióknak megfelelően nevezzük meg a
projekteket, adjunk verziószámot, definiáljuk a függőségeket, a
plugineket (legyenek akár report pluginek). Amennyiben szükséges,
használjuk profile-okat.

Az egyik projekt során feladat volt Maven 2-ről Maven 3-ra migrálni.
Ezzel csak jó tapasztalataim voltak. Első körben azonnal figyelmeztetéseket ír
ki, ami a nem megfelelő `pom.xml` bejegyzéseket tartalmazza (pl. nincs
definiálva a pluginek verziószáma). Ezeket mindenképpen eliminálni
szükséges. A build is gyorsabb 3-as Maven-nel, bár nem számottevően. És
volt olyan is, hogy egy multimodule projektet a 2-es nem tudott
release-elni, mert a modulok közötti függőség esetén nem találta a
"testvér" modult a Reactorban, míg a 3-as gond nélkül megcsinálta.

Az implementáció során előállt termékek:

-   Verziókezelő struktúra
-   A `pom.xml` állományok
-   Különböző segéd scriptek
-   Különböző napló állományok
-   Build folyamat dokumentációja
-   Továbbfejlesztési javaslatok dokumentációja

### Tesztelés

A build folyamatot ugyanúgy kell tesztelni. Első körben elegendő
összehasonlítani, hogy az előállított artifactok bitre megegyeznek-e.
Ha már ezen a szinten is módosításokat tettünk, akkor tesztelni kell,
hogy az előállított artifacttal ugyanúgy működnek-e (nem hiányzik-e jar,
amit egy `ClassNotFoundException` jelez, stb.). Adjuk oda a fejlesztőknek
az eszközt, hogy vegyék használatba. Elemezzük a használati eseteket,
hogy mindent lefedtünk-e. Ez az egyszerű fejlesztés, build
parancssorban, build és futtatás IDE-ben. Build a CI szerveren.
Fejlesztés branch-en, merge-ölés. Release. Artifactok deploy-olása
különböző környezetekre. Gyűjtsük össze a fejlesztők benyomásait,
tapasztalatait. Határozzuk meg újra a mérőszámokat, és hasonlítsuk össze
a projekt kezdetén mértekkel. Szükség esetén javítsuk a hibákat,
gyűjtsük a továbbfejlesztési ötleteket.

Befejezésül annyit, hogy egy Maven alapú build folyamat kialakítása nem
egyszerű feladat, és nagymértékben meg kell ismerni, meg kell érteni az
alkalmazást is, mely buildelésre kerül. A build folyamat megvalósítása
egy kis szoftverfejlesztési projekt, ugyanazon lépésekkel, ugyanúgy
iteratívan. Szánjunk időt és erőforrást a kialakítására és
karbantartására. Ez az ugródeszka, mely a teljes szoftverfejlesztési
infrastruktúra alapját képzi, melybe ezen kívül beletartozik a
verziókezelő rendszer, issue tracker, tudástár, repository manager, CI,
test harness, quality management eszköz, és beletartoznak olyan lépések,
mint tesztelés, release, deployment, code review, minőségbiztosítás,
stb.

<a href="/artifacts/posts/2011-09-18-maven-bevezetes-modernizacio/gib3_b.jpg" data-lightbox="post-images">![Kilátás](/artifacts/posts/2011-09-18-maven-bevezetes-modernizacio/gib3.jpg)</a>
