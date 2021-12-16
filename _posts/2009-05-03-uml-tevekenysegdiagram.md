---
layout: post
title: UML tevékenységdiagram
date: '2009-05-03T01:13:00.006+02:00'
author: István Viczián
tags:
- UML
- Utils
- Módszertan
modified_time: '2018-06-09T10:00:00.000-08:00'
---
Ahogy már említettem, az elmúlt hetekben inkább tervezéssel, mint Java
programozással foglalkoztam. A logikai rendszerterv elkészítéséhez az
UML-t használatuk modellező nyelvként.

Az alkalmazás statikus szerkezetének leírására leggyakrabban az
osztálydiagramot (class diagram), dinamikus viselkedésének leírásához a
tevékenységdiagramot (activity diagram) használtuk.

Az első és legfontosabb kérdés az volt, hogy a folyamatokat milyen
részletességgel (milyen granularitással) akarjuk modellezni.

Ez a kérdés a használati eseteknél is felmerült, az ott elmondottak
igazak a tevékenységdiagramokra is. Általános nézet szerint a használati
eseteket két szintre lehet bontani, egyrészt az üzleti használati esetek
(business level), valamint a rendszer szintű használati esetek (system
level). Az előbbire példa lehet pl. egy kereskedelmi rendszer esetén egy
teljes megrendelési folyamat, a második az eladó részéről a megrendelés
jóváhagyása. A kettő közötti különbség, hogy míg az első egy teljes
folyamatot ír le akár több aktor (akár humán, akár rendszer)
szereplésével, addig a második egy konkrét aktor célját megvalósító
lépéssorozatot, amelynek időtartama kb. 2 perctől fél óráig terjedhet.
Alistair Cockburn szerint a használati eseteknek több szintje is
lehetséges. A javasolt szint a tenger szintje (sea level), mely megfelel
a rendszer szintű használati esetnek. Ez a RUP-ban is definiált szint.
Egy aktor célját megvalósító felhasználói eset ez. Ennél részletesebb a
halak szintje (fish level), ezekre oszthatóak fel, és
újrafelhasználhatóak az előző szint felhasználói esetei által. Gyakran
nevezik alfunkciónak is. Gyakran ezt is elemi lépésekre osztják fel, ez
a kagylók szintje (clamp level). Ezt már nem javasolt felhasználói
esetként kezelni, mert túl részletes. Ez megegyezik Eric J. Naiburg,
Robert A. Maksimchuc UML for Database Design című könyvében definiált
WAVE próbának, melyet ugyanazon írók által írt, magyar nyelven is
megjelent, az UML földi halandóknak című könyvben MISZHAT próbának
fordítottak. E szerint egy használati esetre igaznak kell lennie:

-   Azt írja le, hogy **mi**t kell csinálni, és nem azt, hogy hogyan?
-   A **sz**ereplő (aktor) nézőpontjából lett az eset leírva?
-   Az eset **ha**sznos-e az aktor számára?
-   **T**eljes-e a használati eset?

Amennyiben nem a részletekbe megyünk bele, hanem egy általános képet
írunk le, használjuk a sárkány szintű (kite level) és a felhő szintű
(cloud level) használati eseteket. Cockburn szerint az ideális szintek a
tenger és halak szint, ami tökéletes a követelmények felmérésére, a
becslésre, tervezésre, kódgenerálásra és tesztelésre.

Véleményem szerint amennyiben egy dokumentumot vezetők, döntéshozók
számára készítjük el, javasolt használni a sárkány szintet is, mely egy
teljes üzleti folyamatot ír le, melyben több humán aktor is részt vehet,
és több rendszeren is átnyúlhat.

Amennyiben pl. SOA architektúrát használunk, abban az esetben ezek a
sárkány szintű használati esetek írják le egy folyamatirányító (business
process management) feladatait (több rendszer vezérlése -
orchestration), míg a tenger szintű használati esetek írhatják le a
különböző szolgáltatást nyújtó rendszerekben a web szolgáltatások
mögötti üzleti folyamatokat. Nézzük, hogy miért esett a választás a
dinamikus működés leírására a tevékenységdiagramokra. Ez nem azt
jelenti, hogy a többi, viselkedést leíró diagramot (pl. állapotdiagram -
state diagram, sorrenddiargram - sequence diagram, stb.) nem használtuk,
hanem azokat kevesebb mértékben. Az okok tehát:

-   Mivel a folyamatábrákból alakult ki, és emiatt nagyon hasonlít
    ahhoz, átlátható és könnyen tanulható olyanok számára is, akik nem
    annyira ismerik az UML nyelvet.
-   Megfelelően képesek ábrázolni az elágazást és ciklust.
-   Képesek ábrázolni a párhuzamosságot.
-   Rekeszekkel (partition) képesek ábrázolni a felelősségi
    összefüggéseket, azaz hogy melyik műveletet (action) melyik aktor
    végzi.
-   Képesek ábrázolni az érintett adatköröket is, és a paraméterek
    átgondolására ösztönöz, ha kötelezővé tesszük ezeknek a jelölését.
-   Képesek ábrázolni más rendszerekből érkező, vagy annak továbbítandó
    jelzést (signal), valamint a timeout-ot.

Viszonylag hamar bevethetőek a sorrenddiagramok is, de az már komolyabb
objektumorientált ismereteket feltételez, emiatt kezdő UML-esek számára
nehezebben érthetőek, valamint szerintem nem olyan látványosan
ábrázolják az elágazásokat és ciklusokat.

Nézzük is meg, egy példa üzleti folyamaton, hogy mindezt hogy is teszi.
Egy előző projektben egy külön modulként kellett megvalósítaniegy SMS-es
fizetést is lehető tévő fizetési modult (, hasonlóan az autópálya
matrica vásárlásához). A következő tevékenységdiagram egy SMS-es
fizetést ír le.

<a href="/artifacts/posts/2009-05-03-uml-tevekenysegdiagram/activity_b.png" data-lightbox="post-images">![SMS-es fizetés
tevékenységdiagramja](/artifacts/posts/2009-05-03-uml-tevekenysegdiagram/activity.png)</a>

Az ügyfél a kereskedelmi rendszer honlapján kiválaszt egy terméket, a
kosárba teszi, majd fizetni próbál. A termék fő adatai átkerülnek a
fizetési modulba, miközben a felhasználót a telefonszámának a megadására
kéri. A telefonszám formai ellenőrzésre kerül, ha helyes, akkor az
adatok átküldésre kerülnek az SMS-es fizetést biztosító szolgáltatónak,
ami kiküldi az SMS-t az ügyfélnek. Amennyiben az ügyfél rossz
telefonszámot adott meg, újra bekéri azt. Az ügyfél ekkor egy válasz
SMS-t küld, melyről a szolgáltató értesíti a fizetési modult, amely
értesíti az ügyfelet e-mailben, és a kereskedelmi rendszert. Amennyiben
az ügyfél 3 percig nem ad meg telefonszámot, vagy 5 percig nem küld
válasz SMS-t, a vásárlást meg kell szakítani, és erről értesíteni kell a
kereskedelmi rendszert is.

Látható, hogy a folyamat egy kezdőponttal (initial node) indul és egy
végponttal zárul (activity final node). Ezek között lekerekített sarkú
téglalapok a műveletek (action - ezek neve az UML 1.x-ben tevékenység -
activity - volt). A műveletek közötti nyilak/élek a vezérlési folyamélek
(control flow). A nyilak közötti téglalapok a paraméterek, adatfolyam
csomópontok (dataflow node). A tevékenységdiagramon látható ezen kívül
rombusszal jelölve elágazás esetválasztó csomópontokkal (conditional
node), valamint vastag vízszintes vagy függőleges vonallal vezérlés
elválasztó csomópont (fork node) is, párhuzamosság ábrázolására. Ezek
ellentéte az összeolvasztó csomópont (fork node). A két csúcsával
egymáshoz illesztett háromszög a timeout-ot jelöl, a téglalap, jobb
oldalán egy háromszöggel pedig jelzés küldését (send signal). A négy
nagy téglalap a rekesz (partition), mely arra való, hogy leírja, mely
aktorhoz mely művelet tartozik (ezek az 1.x-ben úszósávok voltak).

A tevékenységdiagramok ennél jóval több mindent képesek ábrázolni,
ezeket a részletes UML dokumentációk és könyvek írják le. Ilyenek pl. a
egy tevékenység kifejtését biztosító altevékenységek (subactivity),
expansion region, kivételek, tokenek, kapcsoló élek (connector), pin és
transzformáció, stb.

Javasolt először az adatfolyam nélkül elkészíteni a
tevékenységdiagramot, majd később kötelezően bejelölni a paramétereket
is, ezzel átgondoljuk, hogy az egyik művelet a másiknak milyen
paramétereket ad át, így akár új egyedekre is lelhetünk.

Érdekes felfedezés volt ugyanakkor, hogy az UML nem definiál semmilyen
diagramot ún. page flow-ra, azaz az alkalmazás képernyői közötti
navigáció modellezésére. Több cikket is olvastam, ahol megpróbálják ezt
állapotdiagramal, osztálydiagramal, de mind sántított. Javasolt egy
egyszerű diagram használata, ahol a téglalapok a képernyők, a köztük
lévő elnevezett nyilak pedig a navigációs útvonalak (pl. webes
alkalmazás esetén a linkek).

![](/artifacts/posts/2009-05-03-uml-tevekenysegdiagram/umldist.jpg)

Az
UML megértéséhez javasolt a magyarul is megjelent Eric J. Naiburg,
Robert A. Maksimchuc: UML földi halandóknak könyv, mely egy nagyszerű
bevezető irodalom. Talán egy kicsit a végére elfogyott a lelkesedés, az
UML használatáról kevésbé ír az implementáció során, valamint olyan
hirtelen lett befejezve. A másik magyarul is megjelent a Harald Störrle
UML 2 Unified Modeling Language című könyv, ami egy nagyon részletes, de
emiatt nagyon száraz referencia jellegű könyv, ami ugyan végigvezet egy
légitársaság rendszerének fejlesztésén, azonban sok UML fogalom meg van
említve, de nincs példán keresztül megmagyarázva. Csak azoknak javaslom,
akik már egy érthetőbb, olvasmányosabb könyv elolvasásával
megismerkedtek az UML alapjaival. Magasan a legjobb könyv azonban,
melyet mindenkinek ajánlok, [Martin Fowler](http://martinfowler.com/)
(akinek nevét a refactoring, tervezési minták, agilis módszertanok,
continuous integration témakörökkel kapcsolatban is sokat halljuk) UML
Distilled: A Brief Guide to the Standard Object Modeling Language című
könyve, mely már a harmadik kiadásnál tart. Előnye, hogy olvasmányos,
humoros, és az UML csak azon kis részét írja le, melyet legtöbbször
használunk. A könyv borítója egy rövid referenciát is tartalmaz.

Nagy problémánk volt azonban az eszköz kiválasztásával kapcsolatban is.
Mivel UML-t főleg nagyvállalati projektekben alkalmaznak, ezért
kidolgozott, jól működő, megbízható és gyors, ingyenes eszköz kevés van.
Azonban rátaláltam az [UMLet](http://www.umlet.com/) nevű ingyenes,
nyílt forráskódú, Java-ban implementált eszközre (ami Eclipse pluginként
is működik), mely teljesen levett a lábamról. Az első eszközt, amit
kipróbáltunk, a NetBeans UML plugin-jét alapban übereli, hiszen a
NetBeans-ben nincs undo művelet (tragédia). Én egy agilis UML eszköznek
nevezném. Ne várjatok tőle csodát, kód generálást, stb., feladata
kizárólag a rajzolás (a poszt diagramja is ezzel készült). Előnye, hogy
nem egy bonyolult popup ablakon kell a különböző elemek tulajdonságait
beírni, hanem jobb oldalon van egy egyszerű szövegmező, ahova az adott
elem minden tulajdonságát be lehet írni, név - érték párokkal
(legerősebb tulajdonsága, hogy ide Java kódot is be lehet írni, így
gyakorlatilag a lehetőségek végtelenek). A teljes eszköz a gyors
szerkesztésre van kihegyezve, jó példája, hogy egy elem másolása egy
dupla-klikk, valamint minden diagramot egy külön, saját formátumú XML
fájlba helyez el, nincs közös projekt, és elem repository. Egyszerű Java
kóddal tetszőleges saját elemeket is definiálhatunk, amit aztán
kitehetünk a többi előre definiált elem közé, és bármelyik diagramban
használhatjuk. Érdemes kipróbálni.

[![](/artifacts/posts/2009-05-03-uml-tevekenysegdiagram/screen.jpg)](/artifacts/posts/2009-05-03-uml-tevekenysegdiagram/screen.jpg)
