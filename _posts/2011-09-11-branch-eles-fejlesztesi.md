---
layout: post
title: Branch-elés a fejlesztési munkafolyamatban
date: '2011-09-11T03:02:00.002+02:00'
author: István Viczián
tags:
- Módszertan
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Miután tisztában vagyunk az verziókezelő eszközünk képességeivel, a
munkafolyamatot kell meghatároznunk, hogyan illesszük be a branch-elést
a munkafolyamatainkba, miket kell átgondolni, szabályozni. Én nem hiszem
azt, hogy az eszköz nagyban befolyásolná azt, hogy miképpen dolgozunk,
de ha mégis így van, lehet, hogy el kell gondolkoznunk az eszköz
cseréjén. Megpróbálok most már nem Subversion közeli maradni, azonban
pár dolog még mindig Subversion specifikus.

A branch-elés nem költséges. Ezzel a kijelentéssel sokszor lehet
találkozni. Valóban így van, de a branch-eléssel sok olyan dolog is a
felszínre kerül, ami azonban mégis kényelmetlenebbé teszi a
munkafolyamatot. Nézzük ezek közül egy párat:

-   Adminisztrálni kell, hogy melyik branch-ben éppen mi történik.
    Valamint ezt meg kell osztani a fejlesztőgárda tagjaival is, hogy
    tudják, mikor melyik ágba kell fejleszteni, mikor melyik ágból lehet
    új branch-t nyitni.
-   Merge. Azt hiszem ez önmagáért beszél. Amennyiben módosításokat
    akarunk ágak között átvinni, nem egyszerű feladat. Persze, az újabb
    eszközök már támogatják, de gondoljunk csak a szemantikus
    conflict-okra.
-   A branch-eket meg kell szüntetni, különben elburjánzanak,
    elszaporodnak, így nehéz követni, hogy melyikben éppen milyen
    fejlesztés folyik, melyikkel mi a cél. Sajnos gyakran előfordul,
    hogy az ágak annyira elcsúsznak egymástól, hogy a fejlesztőcsapatnak
    már esélye sincs a merge-re, így párhuzamosan fejlesztenek több
    ágat.
-   Egy fejlesztő egyszerre több branch-en dolgozik, időbe és energiába
    telik a váltogatás (context switching), esetleg előfordulhat, hogy
    össze is keveri a branch-eket. Különösen problémás lehet egy mixed
    working copy esetén.

Elöljáróban néhány jó tanács. A munkafolyamataink megtervezésénél se
essünk abba a hibába, hogy túltervezzük, minden lehetőségre felkészítjük
őket. Tartsuk be a KISS, YAGNI alapelveket itt is. Ne akarjunk minden
problémát megoldani, ne akarjuk a munkafolyamatot kőbe vésni. Javasolt
kis lépésekben kell bevezetni, iterációkkal haladva előre. Amennyiben
úgy tapasztaljuk, hogy a munkafolyamat nem megfelelő, módosítsunk,
legyünk bátrak más megoldást választani. Ez így van a branch-ekkel is.
Ha kialakítottunk egy konvenciót, és nem megfelelő, szervezzük át. A
verziókezelő rendszerek erre nagyszerű eszközöket nyújtanak. Ennél a
témakörben ráadásul gyakran azt vettem észre, hogy egymással teljesen
ellentmondó igényekre akarnak a fejlesztők egységes munkafolyamatot
kitalálni. Ismerjük fel ezeket, és hozzunk döntést. Amennyiben
elakadtunk, vagy túl nagy falatnak érezzük, ne szégyelljünk segítséget
kérni. Néha úgy fogjuk érezni, hogy hátraléptünk, hogy kényelmetlenebb a
fejlesztési folyamat, de ez néha szükséges ahhoz, hogy tovább tudjunk
lépni.

Én nem hiszek a teljes automatizálásban. A fejlesztőknek igenis
egymással kommunikálniuk kell. A Subversion csak egy eszköz a
kommunikáció megkönnyítésére. Ezeket az eszközöket ne akarjuk a
kommunikáció kiváltására használni. Nem javaslom a branch-ek automatikus
létrehozását, automatikus merge-ök futtatását, release kiadást, deploy,
stb. Én szeretem, ha mindenre van egy élő embernek is rálátása, és ami
jól jöhet, felelőse is. Nem jó, ha ezek a nem egyszerű folyamatok a
senki földjét képviselik. Különösen, ha nem fix, hanem alakítható
munkafolyamatunk van, sosem jutunk el oda, hogy minden automatikusan
történjen. Persze egyes részfolyamatok lehetnek automatizáltak.

Igaz, hogy azt javaslom, hogy humán erőforrás felügyelje ezeket a
műveleteket, azonban érdemes nem mindent rábízni. Tapasztalataim szerint
nagyon sokat segít az, ha a leggyakoribb dolgokra előregyártott
script-eket használunk. (Illetve a Maven is támogatást biztosít.)

Kezdjük is az első problémával, hogy hogyan lehet megtudni, hogy melyik
branch-en mi történik. Valójában a fejlesztés egyik első számú
eszközének egy issue tracker-nek kell lennie. Én a JIRA-ban hiszek, bár
egyre kevésbé, ahogy a belsejét is kezdjük megismerni. Ettől függetlenül
az egyik legjobb eszköz, és bár fizetős, gyakran találkozhatunk vele,
ugyanis ingyenes open source projektek számára, és kis cégek is
rendkívül kedvező áron juthatnak hozzá. Ebben verziókat lehet felvenni,
és a verziókhoz lehet rendelni az issue-kat. Különböző nézetekben lehet
látni a verziók állását (nyitott/összes issue), a verziókhoz tartozó
issue-kat, valamint kiadás esetén changelog-ot lehet generálni. A
verziókhoz megjegyzéseket lehet hozzáfűzni. Tehát az issue tracker
szolgálhat elsődleges információval a branch-ekről is.

Egy kis közbevetés. A fejlesztőcsapattal, mikor arról beszélgetünk, hogy
hogyan használjuk a munkafolyamatban a verziókezelőt, mindig valamilyen
ábrákat rajzolunk, ahol a branch-eket rajzoljuk fel, a commit-okat,
merge-öket, stb. Ahhoz, hogy megértsük egymást érdemes egységes
jelölésrendszert kialakítanunk. Sajnálatos, hogy még nincs ilyen
szabványosítva, ha a blogokat is olvasunk, mindenki saját
jelölésrendszert használ erre.

Egy [előző posztban](/2011/08/08/branch-eljunk-e-vagy-sem.html) már szó
esett a continuous integration-ről, a feature vagy release branch-ek
fogalmáról. Létezik köztes megközelítés is. Ilyenkor általában a
trunk-ba mennek a javítások, csak a nagyobb fejlesztések, melyek több
commit-ból állnak, és a commit-ok között inkonzisztensen hagyják a
szoftvert, azokat szervezik külön branch-be. Ha feature branch-t
indítunk nem feltétlenül érdemes feature-önként külön branch-et
indítani, megfelelő lehet az is, ha a feature-öket csoportokba
rendezzük, és egy csoporthoz indítunk egy branch-et. Egy ilyen csoport
kap egy verziót, amit fel lehet venni az issue tracker-be, és a
feauture-öket meg a verzióhoz rendelni.

Tehát egy jó fejlesztési munkafolyamat leírás megmondja, hogy bizonyos
helyzetekben mit kell tenni. Szabályokat kell hozni a következőkre:

-   Hogyan kell szervezni a branch-eket?
-   Ki hozhat létre branch-et?
-   Mikor kell branch-et létrehozni?
-   Honnan nyitható új branch?
-   Hogyan kell a branch-eket elnevezni?
-   Honnan hova történik a merge?
-   Mikor, milyen gyakran történik a merge?
-   Ki merge-öl?
-   Mikor történik a branch törlése?
-   Ki törli a branch-et?

Subversion specifikus, hogy a branch-eket hogyan érdemes szervezni. Az
alap struktúra a /trunk, /branches, /tags könyvtárak használata. Lehet
ezen variálni, de vigyázzunk, sok eszköz, köztük a Maven is default ezen
a struktúrán dolgozik. Csinálhatunk külön alkönyvtárakat a release és
feature branch-eknek. Csinálhatunk külön könyvtárakat a kiadás különböző
stációi alapján, pl. QA, RC, beta, GA, stb.

Láttam olyan működést is, ahol a branch-ek fejlesztőnként voltak. Ezt
elfogadhatónak tartom egy open source projektnél, ahol bizonyos
fejlesztők csak néha-néha néznek rá a projektre, és szabad akaratukból
fejlesztenek. Komoly projektnél azonban szerintem nem jöhet szóba.

A branch létrehozása történhet a projektvezető által szigorúan vezetett
projekteknél. De nem mindig érdemes megszorítást adni, bizonyos
projekteknél bármelyik fejlesztő nyithat új ágat. Sőt, lehetséges
összekötni az issue tracker-rel is, amikor a verzió létrehozásakor
implikálja a branch létrehozását. De akár létrehozhatja a CI eszköz is.
Amennyiben azt akarjuk, hogy az új branch a CI-be is be legyen kötve,
erről azt értesíteni kell. (A Jenkins REST interfészén keresztül pl.
nagyon egyszerű más névvel egy projektet másolni, és az SVN URL-jét
megváltoztatni.)

Feature branch két esetben jöhet létre. Vagy a feature branch
deklarálásakor, vagy akkor mikor a fejlesztő elkezdi a munkát. Release
branch létrehozása természetesen a release során történik.

Egy feature branch egészen kis módosítástól kezdve nagy változtatásokat
is tartalmazhat. Ez a granularitás projektenként, de akár projekten
belül is változhat. Történhet issue-nként, és akkor lehetőség van arra
is, hogy egy release esetén össze lehessen válogatni a fejlesztéseket.
Ennek előnye a maximális flexibilitás, hátránya azonban az overhead,
hiszen sok branch-et kell kezelnünk. Ekkor a branch-et egy issue-val
kell azonosítanunk. Másik módszer, ha egy branch több fejlesztést is
tartalmaz, melyet verziószámmal tudunk azonosítani. Előző
[posztban](/2011/09/07/subversion-branch-akar-maven-release.html)
láthattuk, hogy a Maven, valamint a Maven Release plugin támogat minket
ebben. Mindenképpen javasolt valami verziószám konvenciót alkalmazni.
Leggyakoribb a hármas tagolású, ahol az elsőt akkor változtatjuk, ha API
szintű változás van, a másodikat, ha API-t nem érintő funkcionális
változás van, és a harmadik, ha bugfix-et adunk ki.

Ahhoz, hogy dönteni tudjunk, ismerni kell a projektet. Az issue-nkénti
branch jól jöhet akkor, ha időzítve vannak a kiadásaink, és nem tudjuk,
hogy egy kiadásra melyik feature készül el. Prioritások változhatnak, az
issue fejlesztése indításakor még fontosnak tűnt, de közben beelőzhet
pár fontosabb issue. Az issue-ink elkészülési ideje nem jósolható meg,
vagy a szoftver bonyolultsága, vagy a megrendelő megbízhatósága, vagy a
fejlesztőcsapat tapasztalatlansága miatt. Így egy verzióban azok lesznek
kiadva, melyek fontosnak tűnnek és elkészülhetnek. Amennyiben azonban a
projektünk olyan, hogy egy iteráció kezdetén eldönthető, hogy mely
issue-k lesznek a verzióban, és addig nem megy ki a verzió, míg mind
készen nincs, akkor érdemes verziónként branch-elni.

A branch a release vagy feature branch esetén legtöbbször a trunk-ból
nyitható.

Akár issue, akár verzió alapján branch-elünk, a branch neve mindig
utaljon erre.

Tag-eket is használnunk kell, amennyiben helyes fejlesztési folyamatot
akarunk felépíteni. Gyakori tag pl. a nightly build. Vagy készíthetünk
egy tag-et, ami mindig a legutolsó nightly build-re mutat. Ez mindig
törölhetjük és újra létrehozhatjuk, de jobb megoldás az svn:externals
használata. Természetesen tag-eket használni kell release estén is. (Ezt
a Maven release plugin automatikusan elvégzi helyettünk.)

És akkor a merge-ről. A feature branch, release branch esetén az előző
posztban leírásra került, hogy hova történik a merge. A merge-öt érdemes
minél gyakrabban elvégezni úgy, hogy még nem zavarja a fejlesztési
munkafolyamatot. Ebben az esetben azonban arra is kell figyelni, hogy a
branch-ben gyakran, apróbb részletekben commit-oljunk, hiszen csak ekkor
garantálható, hogy a merge is kis részletekben történik. Minél ritkábban
van merge, annál nagyobb az esélye, hogy a két ág szétcsúszik, és nő a
conflict veszélye. Én előnyben részesítem, ha egy branch-nek van egy
felelőse, és ő végzi a merge-ölést. Ő tisztában van a branch keletkezési
körülményeivel, céljaival, a benne folyó fejlesztésekkel. Ha conflict
van, akkor ő végzi el a merge-öt. Azonban kijelölhető egy másik személy
is, aki a merge-öt végzi, vagy akár egy automata is lehet. Ha
conflict-hoz ér, a következők közül választhat:

-   Megkeresi a hozzáértő szakembert
-   Legjobb tudása szerint feloldja az ellentmondást, és körbeküldi,
    hogy van-e valakinek kifogása
-   Egyből körbeküldi a hibát, és várja a megoldást

Amikor a branch-ben szereplő fejlesztés kiadásra került, a branch
törölhető. Ez akár a release része is lehet. Törölheti a release, vagy a
branch felelőse, vagy egy fejlesztési munkafolyamatért felelős más
személy. Ehhez is lehet, hogy extra műveleteket is el kell végezni, pl.
job megszüntetése a CI-ben.

Ami még egy dolog, ami a branch-hez tartozik (és ígérem, hogy utoljára
írok erről), hogy a verziókezelőben hogyan érdemes több összetartozó
projekt esetén a hierarchiát szervezni. Erről is szó került már egy
[előző posztban](/2010/10/24/release-mavennel-es-hudsonnel.html). Első
eset, mikor a /branches, /tags és /trunk könyvtárak alá helyezzük a
projektjeinket. A második, mikor minden projektnek van ez a három
alkönyvtára. Mindegyiknek van előnye és hátránya. Sőt, a kettőt keverni
is lehet, hogy bizonyos projekteket így, bizonyos projekteket úgy
szervezünk. Az első eset akkor jó, ha együtt mozognak a projektek
verziói, azaz pl. egyszerre történik a release. Azonban ha külön akarjuk
választani a verziókat, akkor onnantól kezdve bajban vagyunk. Ha később
külön akarjuk választani a projekteket, az sem egyszerű. Jogosultságot
megadni csak egy projektre sem egyszerű. A második megoldással azonban
mindent meg lehet valósítani, de ha egyszerre akarunk pl. tag-geli,
sokkal nehezebb. Erre van egy
[svnmucc](http://svnbook.red-bean.com/nightly/en/svn.advanced.working-without-a-wc.html#svn.advanced.working-without-a-wc.svnmucc)
nevezetű eszköz, mely lehetővé teszi, hogy egy műveletet több URL-en is
végre tudjunk hajtani, egy commit-on belül.
