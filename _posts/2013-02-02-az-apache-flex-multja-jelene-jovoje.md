---
layout: post
title: Az Apache Flex múltja, jelene, jövője
date: '2013-02-02T16:57:00.000+01:00'
author: István Viczián
tags:
- open source
- Flex
- user interface
- Apache
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Technológiák: Apache Flex 4.9.0

Sokakat megosztó témáról fogok írni, méghozzá a felhasználói felület
technológiákat illetően. Ezeken belül is az [Apache
Flex](http://flex.apache.org/) a vizsgálat tárgya. Próbálok elfogulatlan
maradni, de bizonyos kérdésekben óhatatlanul szubjektív leszek. Akár
egyetértesz, akár nem, kérlek oszd meg a véleményedet a megjegyzések
között.

A poszt apropója, hogy az utóbbi pár évben több projektben is használnom
kellett az Flexet, valamint érdekelnek és folyamatosan nyomon követem,
hogy felhasználói felületek fejlesztésére milyen technológiák vannak,
melyek könnyen illeszthetőek a Java platformhoz. A Flex 4.9.0 új
verziója 2012. decemberében jelent meg. Ez már a második kiadás, mely új
fejlesztéseket is tartalmaz. Az Adobe 2011 novemberében jelentette be,
hogy az Apache közösségnek adja a Flex SDK forráskódját. A 4.8.0 verzió
még Apache incubator projektként jött ki, az Apache Licence v2 alatt, és
nagy újdonságot még nem tartalmazott, főleg az átadás lett formalizálva.
Az új verzió azonban már ún. top level projectként jött ki. Sőt a cikk
írásának pillanatában [élesítették az új oldalt
is](https://twitter.com/ApacheFlex/status/296909455612858368).

<a href="/artifacts/posts/2013-02-02-az-apache-flex-multja-jelene-jovoje/logo_01_fullcolor_wb.png" data-lightbox="post-images">![Apache Flex](/artifacts/posts/2013-02-02-az-apache-flex-multja-jelene-jovoje/logo_01_fullcolor_wb_750.png)</a>

A Flex világra jöttét a RIA (Rich Internet Application) segítette, azaz
a cégek olyan eszközöket próbáltak előállítani, melyekkel a desktop
alkalmazásokhoz hasonló gazdag felhasználói élményt nyújtó webes
alkalmazásokat lehetett készíteni. A Flex eredetileg a Macromedia
terméke volt, melyet az Adobe megvásárolt. A Flex 1.0 és 1.5 még komoly
szerver oldali komponensekkel járt, de már jelen volt a megjelenítést
leíró MXML XML alapú nyelv (Macromedia vagy Magic XML?) és a model és a
controller komponensek megírására való ActionScript. A Flex 2 esetén
azonban az SDK ingyenesen letölthető volt, csupán a fejlesztőeszközért,
a Flex Builder-ért kellett fizetni (, mely Eclipse alapokra épült).
Ebben a verzióban már nem volt szükség szerver oldali komponensre,
lokálisan buildelhető volt az SWF fájl. A Flex 2-ben került bevezetésre
az ActionScript 3 nyelv. A futtatókörnyezete a Flash Player volt.

A Flex 3 SDK már Mozilla Public License alatt jött ki, és itt jelent meg
az AIR (Adobe Integrated Runtime) támogatása. Az AIR nem más, mint egy
futtatókörnyezet, mely képes a Flash, Flex alkalmazásokat különböző
operációs rendszereken futtatni, desktop alkalmazásként. Sőt, mobilra is
elérhető. Az AIR-be telepített alkalmazások persze már több
jogosultsággal rendelkeznek, mint a böngészőben futó társaik, pl. elérik
a fájlrendszert, nyomtatót, vágólapot, stb. Rendelkezik egy beépített
adatbázis kezelővel (SQLite), valamint egy WebKit alapú böngésző
komponenssel is. 2010 márciusában jött ki a Flex 4, melynek
fejlesztőkörnyezete már Flash Builder néven futott. Fő újítása, hogy
megpróbálták közelebb hozni a designert és a fejlesztőt, hogy az előbbi
által készített munkák újrafelhasználhatóak legyenek. Lehetővé tette a
komponensek egyszerűbb skinezhetőségét is (megjelentek a Spark
komponensek). A Flash Builder Premium verziójában már unit tesztelésre
alkalmas eszköz is megjelent. A Flex 4.5 újításai a különböző mobil
eszközökre való fejlesztést tették lehetővé (Android, BlackBerry Tablet
OS és Apple iOS).

A Flex tehát élt és virágzott, mikor az Adobe sokak meglepetésére az
Apache-nak adta a Flex SDK-t. Az ok talán a HTML 5 térnyerése volt,
melyet az Adobe is jó iránynak tart. Valamint a Flash platformot akarják
speciálisabb irányba vinni, úgymint a játékok (3d támogatás), valamint a
prémium kategóriás videólejátszás. Az Adobe azonban nem temeti a Flexet,
a nagyvállalati alkalmazások elsődleges platformjaként gondol rá. A
nagyvállalati alkalmazásfejlesztésben az érvek a Flex mellett a
következők:

-   Gazdag felhasználói felület építhető, mely nem mellesleg
    tehermentesíti a szerver oldalt.
-   Gazdag komponenskészlet, és a komponensek újrafelhasználhatósága a
    magas fejlesztői produktivitásért.
-   Jó beépített és 3rd party komponensek: pl. charting, data
    visualization, dashboard, OLAP, stb.
-   A MVC modell és a binding-ok miatt rendkívül alkalmas data driven
    alkalmazások kifejlesztésére.
-   Modularizáció.
-   Nagyvállalati fejlesztésre alkalmas ActionScript nyelv és egységes
    futtatókörnyezet.
-   Nagyvállalati technológiákhoz, mint Java EE, .NET könnyen
    illeszthető.
-   Kifinomult unit és integrációs teszt eszközök.
-   Parancssori alkalmazások (fordító, parancssorból futtatható teszt
    framework) segítségével könnyen illeszthető continuous integration
    környezetbe.
-   Fejlett fejlesztőeszközök (IDE kódszerkesztésre, debug, profile,
    test, stb.).

Talán érdemes egy kicsit azon elmerengeni, hogy miért is jó az
ActionScript nyelv, és a sokak által szidott Flash Player vagy AIR
környezet. Az ActionScript egy ECMAScript 262 Edition 4 (ES4) szabványon
alapuló imperatív, biztonságos, szigorúan típusos, objektumorientált
nyelv. Ennek az ECMAScript változat fejlesztése megszakadt, mindenféle
csatározások miatt. A mostani böngészők által értelmezett JavaScript
amúgy az Edition 5-nek felel meg, és talán már dolgoznak a következő
változaton (Harmony). Fontos megjegyezeni, hogy az Adobe aktívan részt
vett az ECMAScript szabványok specifikálásában. Az ActionScript
ActionScript Byte Code-ra fordul (ABC). A lefordított ActionScript és
MXML vagy SWC állományba állítható össze (ShockWave Component) - mely
később az SWF-be építhető, vagy közvetlenül SWF állományba (ShockWave
File). Ezeket a formátumokat az Open Screen Project keretében tette az
Adobe [nyílt formátummá](http://www.adobe.com/devnet/swf.html)). Ide
tartozik még az AMF (Action Message Format) is, mely bináris formátum az
ActionScript objektumok hálózaton átvitelére. A fordításkor nyert
bájtkód azonban visszafejthető (decompile), obfuszkátorok használata
jelenthet részleges megoldást. Ezt a bájtkódot futtatja a Flash
Playerbe, vagy az AIR-be épített virtuális gép. Érdekesség, hogy ezekben
két virtuális gép van. Az AVM1 az ActionScript 2, míg az AVM2 az
ActionScript 3 forrásból fordított bájtkódot futtatja. Az AVM2-ből az
Adobe a virtuális gépet, és a benne lévő JIT (Just in time compile-ert)
2006-ban a Mozilla Foundation számára átadta (Tamarin), így nyílt
forráskódú. Modern VM-ről beszélünk, hiszen a JIT-tel (, ami futás
közben az adott platform gépi kódjára fordít) hatalmas
sebességnövekedést értek el (és bevezetésekor a JavaScript
interpreterekbe még nem volt ilyen), valamint komplex szemétgyűjtővel is
rendelkezik. Érdekes még a nyelvi szintű XML támogatás is, mely szintén
szabványon alapul: ECMA-357, azaz ECMAScript for XML (E4X). A virtuális
gép használatával nem kell a platformok különbségeivel foglalkozni, a
kód hordozható marad közöttük.

Az Adobe [közzétette a
terveit](http://www.adobe.com/devnet/flex/whitepapers/roadmap.html) a
Flex jövőjével kapcsolatban. Továbbra is teljes állású fejlesztőket
biztosít a Flex továbbfejlesztésére. Valamint a Flash Buildert továbbra
is kereskedelmi termékként árulja, és frissíti, hogy együttműködjön az
Apache Flexszel . Az Adobe ígéri, hogy a további öt évben megőrzi a
Flash Player és az AIR visszafele kompatibilitását, azaz hogy továbbra
is lehessen ezen futtatókörnyezetekben Flex alkalmazást futtatni.
Azonban új funkciókat már nem tesz ezekbe a környezetekbe a Flex
támogatására.

(Zárójelben jegyzem meg, hogy érdemes elolvasni az [Adobe terveit a
Flash platformmal
kapcsolatban](http://www.adobe.com/devnet/flashplatform/whitepapers/roadmap.html),
mely magában foglalja a Flash Playert és az AIR-t. Természetesen
mindkettőt viszi tovább a Windows platformon, és sok ellentétes
állítással szemben Apple OS X-en is. Sőt, Adobe AIR alkalmazásokat Mac
App Store-on keresztül is lehet értékesíteni. A Linux már kényesebb
terület. Az Adobe együtt dolgozik a Google-lel a [PPAPI - kódnevén
"Pepper"](https://developers.google.com/native-client/) kialakításán,
mely egy közbülső réteg a böngésző és a különböző pluginok között. A
Flash Player azon verzióját, mely ezen az API-n alapszik, a Google a
Chrome-ba beágyazva terjeszti. A Google ezen technológiával sokkal
biztosabb működést tud elérni, hiszen a plugin összeomlása nem vonja
magával a böngésző összeomlását is. Az Adobe Linuxon a Flash Playert más
formában nem fejleszti. Sőt, az AIR Linux-os fejlesztésével is leáll.
Természetesen a mobil az továbbra is célterület, de kizárólag az Adobe
AIR környezetben gondolkozik, de az összes fontosabb platformon -
Android, iOS, Blackberry. Az Android browser plugint befejezi, szintén
csak a Chrome-os megoldás marad.)

Nézzük merre tart az Apache fejlesztés. Az Adobe a következőket adta át:

-   A Flex SDK, mely legfőképp az osztálykönyvtárakat és a fordítót
    tartalmazza, valamint további eszközöket.
-   A Falcon következő generációs ActionScript fordítót.
-   A Falcon JS kísérleti fordítót, mely nem Adobe futtatókörnyezetre,
    hanem JavaScriptre fordít.
-   A Mustella funkcionális tesztelésre szolgáló keretrendszert.
-   Dolgoznak a BlazeDS átadásán is. Jelenleg a [SourceForge-on
    elérhető](http://sourceforge.net/adobe/blazeds/wiki/Home/) LGPL
    alatt. A BlazeDS egy Java szerver oldali technológia, mely lehetővé
    teszi a Java szerver oldal és a Flex kliens oldal kommunikációját.
    Olyan kiváló képességekkel rendelkezik, mint különböző csatornák
    használata (http, https), Java és ActionScript objektumok
    automatikus mappelése, publish&subscribe kliensek között, szerver
    által kezdeményezett kommunikáció, JMS támogatás, [Spring
    integráció](http://www.springsource.org/spring-flex). Úgy kell
    elképzelni, mint egy Flex-ből indított Java metódushívást. A
    kommunikáció a már említett AMF-ben történik. A BlazeDS korábban a
    Adobe LiveCycle Data Services ES része volt.
-   Text Layout Framework 3.0.33

A fejlesztés mögött a [Open Spoon Foundation](http://www.spoon.as/)
szervezet is ott áll. A 4.8.0-ban tehát eltávolításra kerültek a
trademark bejegyzések, migrálva lett az Adobe issue trackerje
[JIRA-ra](https://issues.apache.org/jira/browse/FLEX). A 4.9.0 SDK-t már
Java 7-tel is lehet fordítani, és jelentős számú hibajavítást tartalmaz.
A közösség nagyon pörög. Kijött az új weboldal, a [Apache Flex SDK
Installer 2.0](http://flex.apache.org/installer.html). A dokumentáció
[Confluence
Wikiben](https://cwiki.apache.org/confluence/display/FLEX/Apache+Flex+Wiki)
olvasható. Az újdonságokat a [blogon](http://blogs.apache.org/flex/)
lehet követni. A [levelezési
lista](http://flex.apache.org/community-mailinglists.html) is nagyon
aktív, a fejlesztői listán csak decemberben több, mint 1800 levél ment.

Tervek között szerepel még a
[forráskód](http://flex.apache.org/dev-sourcecode.html) Subversion-ről
GIT-re átállítása, Maven plugin fejlesztése, dolgoznak a Falcon és
Falcon JS fordítón, új komponensek készülnek és fejlődik a tesztelés is.

Időközben az Adobe is kijött a Flash Builder 4.7.0-val, mely Apache Flex
4.8.0 támogatást tartalmaz. Azonban a kompatibilitási problémák miatt
kivették a Design View-t, Data Centric Development Toolst és a Flash
Catalist Workflowt.

Milyen más kliens oldali technológiák vannak, és mikor érdemes az Apache
Flexet választani ezek közül? Az Oracle nyomul a JavaFX-szel, a
Microsoftnak van egy próbálkozása a Silverlighttal, valamint ott a
legnagyobb kihívó, a HTML5/CSS3/JavaScript (innentől csak HTML5-ként
hivatkozok rá). A JavaFX még nem elég kiforrott technológia, nagyon
változik, bizonytalan még a jövője. A Microsoft felől is ellentmondó
hírek jönnek a Silverlighttal kapcsolatban, valamint a Java platformba
nehezebben beilleszthető lenne. Versenyben marad tehát a HTML5 irány.

Abban az esetben, ha speciális követelményeket nem támasztó webes
alkalmazásról beszélünk (pl. a legtöbb Interneten megjelenő startup),
vagy a fejlesztők már otthonosan mozognak a HTML5 világában, a HTML5
lehet a megfelelő irány. Azonban a Java platformon nevelkedett
fejlesztők számára, valamint főként intranetes nagyvállalati vagy a
speciális igényekkel rendelkező alkalmazások fejlesztésére (pl. videó,
adatvizualizáció) a Flex lehet a legjobb irány.

A Java fejlesztők számára sokkal egyszerűbb a Flex irányába továbblépni,
mint a JavaScript felé. A szigorú típusosság, az objektumorientáltság, a
komponensek használata mind e mellett szól. Aki ráadásul esetleg
Swingezett is, még egyszerűbb az átállás. Azon keretrendszerekben,
melyek Java technológiára épülnek, de HTML5 interfészt generálnak, nem
nagyon hiszek. Ott van egy átfordítás, ráadásul két teljesen más célra
kifejlesztett technológia között (ne feledjük a HTML dokumentumleíró
nyelv!). A HTTP protokoll szintén hatalmas gát, a kérés-válasz
alapúságával, a szöveges formátumával, a késleltetéseivel. A HTML 5
nagyon friss, nem hiszem, hogy nagyvállalati alkalmazások fejlesztésére
már jó irány. Az Adobe irányt sokan gyűlölik, nagyrészt indokolatlanul.
Benne van ebben az, hogy ez volt az első platform, melyben rettentő
idegesítő reklámokat lehetett készíteni. A Flash Player stabilitásával
is voltak/vannak gondok (tegyük hozzá, hogy bármiben lehet erőforrás
pazarló alkalmazásokat fejleszteni). Steve Jobs is célként tűzte ki a
Flash eltörlését, melyben szintén sok követője akadt. De azért nézzük
végig ezt a fenti történetet. Az Adobe feltűnően sokat tett a nyílt
forráskódért rajongó közösségért, valamint a szabványosítási
folyamatokért. A technológiai választások is mind logikusak, ha
megnézzük, sokban hasonlítanak a Java platformhoz.

Összegezve úgy gondolom, hogy Java alapú nagyvállalati alkalmazások
felhasználói felületének fejlesztésére az egyik leghatékonyabb,
legkézenfekvőbb irány a Flex. De igen, benne van, hogy pár év múlva vagy
egy nagy közösség által használt elterjedt technológia lesz, de az is
lehet, hogy végleg eltűnik. De ez nincs másképp más UI technológiával
sem, a verseny még tart, és az Apache Flexnek még vannak esélyei.
