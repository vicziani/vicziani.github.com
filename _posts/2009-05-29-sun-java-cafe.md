---
layout: post
title: Sun Java Café
date: '2009-05-29T00:23:00.004+02:00'
author: István Viczián
tags:
- SOA
- Community
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Ma reggel voltam a kis szünet után első Java Cafén, melyet már az előző
posztban is hirdettem. Röviden összefoglalva méltó újrakezdés volt,
érdemes volt elmenni.

Mikor beléptem, azonnal meglepődtem, mert tényleg sok érdeklődő volt.
Kicsit irigykedtem, hiszen a
[JUM](http://wiki.javaforum.hu/display/JAVAFORUM/JUM) rendezvényekre
ehhez képest kevesen jönnek el.

Két előadás volt, az elsőt Molnár István és Simon Géza tartotta, mind a
ketten régi motorosok, rengeteg előadási gyakorlattal és tapasztalattal
rendelkeznek, ennek megfelelően hozták a rájuk jellemző magas szintet.
Az előadásukban egy SOA projektekben, GlassFish ESB-vel szerzett
tapasztalatokat osztották meg velünk (, melynek egy részét már a JUM-on
megismerhettük). Érdekes volt az előadási koncepció, miszerint Géza
képviselte a megrendelőt, míg István az architektet. Géza hamar kiesett
a szerepből, és visszapártolt a fejlesztői oldalra. :) Nekem kicsit sok
volt a bevezető szöveg, mivel szinte mindegyik SOA projektnél ugyanezek
a problémák vetődnek fel (pl. deployment, verziókezelés,
eszközválasztás, belső szabványok kidolgozásának szükségessége,
különböző környezetek, migráció, lokális elosztottság, stb.), de a
SOA-ban járatlanabbnak hasznos lehetett, hogy mire kell figyelni. Persze
feltűnt a kötelező grafika is, mikor a résztvevő rendszerek (bőven száz
felett) egymással össze vannak kötve, egy nagy spagettit alkotva. Cél
ennek kibogozása nagyvállalati környezetben bizonyított, szabványokon
alapuló, nyílt forráskódú, tetszőlegesen skálázható megoldással. Ennek
persze első lépése egy-több proof of concept (PoC) elkészítése a
felvetett problémákat megoldandó.

Kétféle folyamatot különböztettek meg: egyrészt a message flow-t, melyek
rövid, szinkron választ adó, emberi beavatkozás nélküli folyamatok,
valamint a process flow-t, amik a hosszabb, akár több hetes, emberi
beavatkozást is igénylő folyamatok. Ezek állapotait persze a hosszuk és
aszinkronitásuk miatt perzisztálni kell. A PoC után elsőnek egy
hitelbírálati rendszert valósítottak meg, és elhangozottak olyan komoly
követelmények is, hogyha változik egy üzleti szabály, akkor az
ügyintézőknek kiosztott feladatokat automatikusan újraallokálja a
rendszer, azaz egy megkezdett ügyet a módosult szabály alapján akár
átteheti másik ügyintézőnek.

Azért szerencsére elhangoztak implementációs trükkök is a Glassfish
ESB-vel kapcsolatban, amihez NetBeans fejlesztőeszközt használtak a SOA
Pack-kel, és BPEL-t a folyamatok leírására. Pár dolog, amiket érdemes
megjegyezni:

-   Egyrészt érdemes mérni az alkalmazást (erre a Hulp eszközt
    alkalmazták - nem azonos a profilerrel, ebben a naplózáshoz
    hasonlóan nekünk kell elhelyezni a mérőkódokat), mert ott
    javíthatunk jelentősen a sebességen, ahol nem is gondolunk rá.
-   Pl. érdemes a JAXB esetén a JAXBContext példányt nem minden
    metódushíváskor példányosítani, hanem ezt a példányt a
    metódushívások között megtartani (pl. EJB esetén a @PostConstruct
    interceptor-ban.
-   Az XSLT transzformációt is inkább a különálló XSLT service
    engine-ben érdemes végrehajtani, mint a BPEL engine-en belül.
-   Hosszú folyamatoknál érdemes a WS-ReliableMessaging szabványt
    használni. Itt egyszerű timeout kezelés nem elegendő, hiszen lehet,
    hogy azért nem jött válasz, mert humán interakcióra vár.
-   Érdemes alkalmazni pl. két Glassfish ESB között a [Fast
    Infoset](https://en.wikipedia.org/wiki/Fast_Infoset) szabványt, mely
    az XML-ek egy bináris ábrázolási módja. Ezt a 6-os Java már alapban
    tartalmazza. Már 30%-os méretcsökkenést is mértek. Sőt, külső
    adatszótár használatával tovább lehet gyorsítani.
-   Ekkora méretnél a Composite Application Service Assembly Editor már
    használhatatlan. Emiatt még a fejlesztőeszközt is bővítették, egy
    JBI connection builder-t implementáltak, mellyel ezt manuálisan,
    scriptelhetően el lehet végezni, és akár különböző konfigurációk
    alapján is képes összeállítani a service assembly-ket.
-   Egyik legnagyobb kihívás a verziókezelés volt. Erre egy elegáns
    megoldást találtak. Egyrészt felosztották a folyamatokat core
    folyamatokra, mely mindenütt azonos, és local folyamatokra, melyek
    országonként különböznek. A különböző web szolgáltatások hívásainál
    a hívás fejlécében elhelyeztek egy ország és verzió paramétert, mely
    alapján egy köztes réteg (content based routing) átfordította a
    hívást. Ez képes nem csak a különböző implementációk, de a különböző
    interfészek változásait (WSDL-ben szereplő séma vagy névtér
    változásokat) kezelni.
-   Teszt kliensnél a SOAPUi-t használták mely mostanában egyre több
    előadásban szerepel, valamint hangsúlyozták, hogy érdemes az eredeti
    rendszereket szimuláló ún. emulátorokat is építeni, melyek segítenek
    a tesztelésben, nem a távoli, megbízhatatlan külső rendszerrel kell
    kapcsolatot teremteni. Furcsa, hogy erre nem a SOAPUi-t használták,
    pedig tud web szolgáltatásokat emulálni, és a mock, mint fogalom sem
    hangzott el.

A második előadást Ekler Péter tartotta mobil fejlesztésekkel
kapcsolatban, melyet a BME Automatizálási és Alkalmazott Informatikai
Tanszékének mobil kutatással és alkalmazásfejlesztéssel foglalkozó
[csoportján](http://amorg.aut.bme.hu/hu/home) belül végez. Két szoftver
került bemutatásra, egyrészt a MobSensor, mely a mobiltelefon
fényképezőgépét és mikrofonját felhasználva képes mozgást vagy hangot
észlelni, és riasztani (lokálisan, neten, vagy akár más telefonokon is).
A mozgást pl. két kép összehasonlításával végzi, amit már közel real
time-ban képes egy fejlettebb mobiltelefon processzora megtenni.
Valamint bemutatásra került a MobTorrent, mely, mint a neve is mutatja,
egy mobil torrent kliens. Ez a téma is érdekes volt, bár nekem kevésbé
témába vágó. Ami újdonság volt számomra, hogy pl. egy Bluetooth
kommunikáció akár 10x kevésbé energiaigényes, mint egy WLAN kapcsolat.

Szóval nagyon megérte elmenni, a következőn is ott leszek. Az esemény
végén ígéretet kaptunk arra is, hogy a JavaOne konferencián hallottakról
is lesz egy Java Café rövidesen.
