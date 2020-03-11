---
layout: post
title: Clean Architecture
date: '2020-03-03T11:00:00.000+01:00'
author: István Viczián
description: Szemelvények a Clean Architecture könyvből.
---

Robert C. Martin erőteljes hatást gyakorolt napjaink szoftverfejlesztésre.
Egyike volt az Agile Manifesto aláíróinak, és számos tervezési elv
kötődik a nevéhez. Ő alkotta meg a SOLID elvek rövidítést, mely
saját és mástól átvett elveket is tartalmaz (pl. a Liskov-féle helyettesítési
elvet Barbara Liskovtól). Ő a szerzője a közismert Clean Code
és a The Clean Coder könyveknek. (A Clean Code-ról egy
  előző [posztban írtam](https://www.jtechlog.hu/2019/02/24/clean-code.html).) A 2017-ben megjelent
Clean Architecture könyvről szól ez a poszt, és a poszt végén
a saját véleményem is megosztom veletek.

![Clean Architecture könyv](/artifacts/posts/2020-03-03-clean-architecture/clean-architecture-cover.jpg)

A Clean Architecture a szerző által megfogalmazott architektúráról ír,
azonban részletesen bemutatja azokat az elveket is, melyek mentén eljutott a
javasolt architektúráig. Talán nem meglepő, hogy a SOLID elvekből indult ki,
és ezeket próbálja magasabb absztrakciós szinten is alkalmazni. Egy objektumorientált
alkalmazás legfinomabban szemcsézett darabkái az osztályok, több osztály
összetartozó egységét ő komponensnek (component) nevezi (klasszikus modul fogalom), és
a teljes alkalmazást szolgáltatásnak (service). Nála a komponens a
külön release-elhető, csomagolható és deploy-olható egység, Java esetén a JAR,
C# esetén pl. a DLL fájl. A könyv próbál programozási nyelv független maradni,
és főleg Java és C# példákat hoz.

Az architektúra hasonlít is a manapság elterjedt 3-rétegű architektúrához,
azonban jelentős különbségeket is tartalmaz. Azt gondolom, hogy az elveket
mindenképp érdemes megismerni, azt meg mindenki döntse el maga, hogy az
elvek alapján létrehozott architektúrát mennyire szeretné követni.

<!-- more -->

Már az architektúra definíciója is szimpatikus nekem, ugyanis szerinte azon
tervezési döntések, melyek célja a szoftvert a lehető legkevesebb emberi
erőforrásból létrehozni és karbantartani. Az architekt szerinte az
a _programozó_, aki a programozási feladatain felül a csapatát a megfelelő
tervezési döntésekkel a maximális hatékonyság felé tereli.

Szerinte az architektúrális tervezés egyik fő feladata a komponensek közötti határok meghúzása,
a komponensekre bontás.

Erre máris egy elég meredek megoldást javasol, a döntés elhalasztásának elvét.
Ugyanis ezen döntések közös tulajdonsága, hogy legtöbbször kevesebb információ
áll rendelkezésünkre, mint amennyi a döntéshez szükséges lenne. Így annak
elhalasztásával biztosíthatjuk, hogy még több információt tudunk addig begyűjteni.

Nyilván az objektumorientált tervezésből indul ki, és szerinte az oo egyik
legnagyobb újdonsága a polimorfizmus. Ugyanis ez teszi lehetővé a
dependency inversiont (SOLID elvek utolsó eleme). Vigyázzunk, ez nem azonos
a dependency injectionnel, amit sajnos a Wikipedia magyar
[szócikke](https://hu.wikipedia.org/wiki/F%C3%BCgg%C5%91s%C3%A9g_befecskendez%C3%A9s%C3%A9nek_elve)
is összekever.

A dependency inversion architektúra szempontjából azért kiemelten fontos, ugyanis
használatával meg lehet fordítani a függőség irányát. Nézzük a következő
példát, melyet az ábra is reprezentál.

![Dependency Inversion](/artifacts/posts/2020-03-03-clean-architecture/dependency-inversion.png)

Klasszikus esetben az üzleti logika rétegben lévő osztály tartalmaz referenciát
a perzisztens rétegben lévő data access objectre (DAO). A függőség itt az üzleti
logika felől mutat a DAO felé. Azonban ha bevezetünk egy interfészt, amit az
üzleti logika rétegben helyezünk el, és azt implementálja a DAO, máris megfordul a
függőség, és a DAO felől az üzleti réteg felé fog mutatni. Ez az architektúra egyik
alapötlete is. Az is látható, hogy ebben az esetben a függőség a hívási lánc
irányával is ellentétes lesz.

Erős állítása az is, hogy a szoftverfejlesztés elején nem tervezhető meg
a komponensek és a közöttük lévő kapcsolatok. Ezért inkább úgy kell megtervezni,
hogy ez később dinamikusan módosítható legyen.

A Clean Architecture a szoftver alapvetően két fő részre osztja. A policy
alkotja az üzleti követelményekre adott válaszokat. Míg a details
adja meg a válaszokat a nem-funkcionális követelményekre, olyan részletek,
melyek ugyan szükségesek a program futásához, de a vele kapcsolatos döntéseket
érdemes későbbre halasztani. Ez összecseng azzal, hogy a policy adja az igazi
értéket, és először azzal érdemes foglalkozni (lásd még DDD). A details
körébe tartozik a IO, adatbázis, futtatókörnyezet, keretrendszerek és az API is
a más rendszerek számára.

A policy körébe tartoznak a kritikus üzleti szabályok (Critical Business Rules) és a használati esetek (use-case).
A kritikus üzleti szabályok az az üzleti logika, ami az üzlet alapját képezi, amelyet
informatikai rendszerek nélkül is alkalmaznának, akár kockás papíron. Ezek az üzleti
adatok és a rajta végzett műveletek. Ezeket a
szoftverben entitások (Entity) implementálják (nem keverendő össze az ORM entitás fogalmával!).
Elméleti szinten ezek akár több alkalmazásban is újrafelhasználhatóak.
A használati esetek a bemeneti adatokból (input vagy request), az entitásokkal
kommunikáló lépésekből és a kimeneti adatokból (output var response) állnak. Ezek valójában
az aktorok (szoftverek felhasználói) és a entitások interakcióját írják le. Ide már
az alkalmazásspecifikus üzleti szabályok tartoznak.

A policy-t, azaz az entity és use-case réteget úgy lenne célszerű implementálni, hogy teljes mértékben
keretrendszer, UI és adatbázisfüggetlen legyen. Lehetőleg tiszta objektumorientált
modell legyen (és ne anemic model), és a programozási nyelv beépített eszközeit használjuk csak
(azaz Java esetén tiszta Java SE kód). Itt a kódban klasszikus adatszerkezetek jelenhetnek meg,
mint list, set, map, stb. Nem jelenhet meg benne semmilyen keretrendszer, adatbáziskezelés, ORM. Ez adja az
alkalmazás magját. Ezt lehet UML-ben megtervezni. Ennek unit tesztelhetőnek kell lennie.

Egy külsőbb réteg az un. Interface Adapters. Ez csatolja hozzá a konkrét komponenseket
az üzleti logikához, az adatbázist, UI-t, keretrendszereket és külső rendszereket (Frameworks and Drivers)
az üzleti logikához.

És amennyiben alkalmazkodunk ahhoz a szabályhoz, hogy a kevésbé stabil (gyakran változó) komponenseknek
kell függeniük a stabil komponensektől, valamint a konkrét komponenseknek kell
függenie a magasabb absztrakciós szinten lévő komponensektől, a details
komponensei függeni fognak a policy-től.

![Clean Architecture](/artifacts/posts/2020-03-03-clean-architecture/clean-architecture.jpg)

Ha plasztikusan akarjuk megfogalmazni, akkor a legfontosabbak az entitások, azon függnek a
használati esetek, és arról lógnak a details-ek. Az üzleti logika stabil, a details-ek
implementációs részletek, könnyebben módosíthatóak. És látható, hogy itt van a legnagyobb
ellentmondás a 3-rétegű architektúrával. Nem az üzleti logika épül az adatbázisrétegre,
hanem az üzleti logikától függ az adatbázis réteg. Természetesen dependency inversion
használatával lehet ezt a függőséget megfordítani. Az üzleti logika csak interfészeket
deklarál, amin keresztül a perzisztens réteggel kommunikál, és azt a perzisztens réteg
implementálja.

A 3-rétegű architektúrában kérdés szokott lenni, hogy hova tegyük a többi rendszerrel való
integrációt. A probléma főleg akkor van, amikor egyrészt a külső rendszernek
küldünk is adatot, de fogadunk is tőle. Küldéskor az üzleti logika hívja,
így adódik, hogy az üzleti logika függjön az integrációs rétegtől,
azaz legyen mondjuk a perzisztens réteggel egy szinten. De mi van akkor, ha
a másik rendszer meg hívja a mi rendszerünket, esetleg egy kétirányú,
sor alapú kapcsolat van. A Clean Architecture ezt is a külső körön helyezi el,
egységes modellben.

Ezen elvekből és architektúrából több érdekes, már-már meredek állítást is le lehet vezetni.

A teszteléssel kapcsolatosan két érdekes állítás is szerepel a könyvben. Egyrészt
nem célravezető úgy megírni a unit teszteket, hogy minden egyes osztályhoz egy külön teszt
osztály, és minden metódushoz egy vagy több teszt metódus. Ebben az esetben
nagyon függni fogunk az implementációs részletektől, és hamar a Fragile Test Problemmel
találkozunk szembe, méghozzá azzal, hogy ha refactorálunk nagyon nagy mennyiségű teszt
fog eltörni. Erre a javaslat az, hogy a használati eseteket API szinten teszteljük,
és ne írjunk teszteseteket a belső osztályaira, így könnyebben átszervezhetőek.

Másik nagyon fontos állítás, hogy a teszt esetek az architektúra részét képzik, azaz
ugyanúgy ugyanazon szabályok alapján kell megtervezni őket. Ezek természetesen a
külső (Frameworks and Drivers) körön helyezkednek el. És az állítás ezzel kapcsolatban az,
hogy ezek se függjenek kevésé stabil, gyakran változó komonenseken, azaz főleg ne felületi tesztek legyenek,
hanem a használati eseteket hajtsák meg.

Remek ötlet, hogy a Clean Architecture nem veti el
annak lehetőségét, hogy olyan API-t fejlesszünk, melyeket csak a teszt esetek használnak,
a tesztelést megkönnyítendő. Azonban ez biztonsági kockázatot hordozhat, ezért tegyük külön
komponensbe, és ne deploy-oljuk éles környezetbe.

A könyvben szerepel a kódduplikálással kapcsolatos állítás is, méghozzá az, hogy nem
feltétlenül rossz.
Az ehhez kapcsolódó példa ragadott meg a legjobban. Képzeljünk el két képernyőt, amelyek
teljesen ugyanúgy néznek ki, csak két teljesen különböző üzleti entitáshoz tartoznak.
Az egyik képernyőn pl. hallgatókat, a másik képernyőn kurzusokat lehet karbantartani.
Mivel hasonlítanak egymáshoz, felmerülhet az igény, hogy ne legyen a kódban duplikáció,
próbálunk egy magasabb absztrakciós szintet kialakítani, és ezzel elbonyolítjuk a kódot.
Itt azonban a kódduplikáció lenne a megfelelő változás, hiszen a kód két különböző
üzleti fogalomhoz tartozik, és nagy a valószínűsége, hogy a képernyők a jövőben
két teljesen különböző irányba fognak továbbfejlődni.

Azt tapasztalom, hogy a szoftveren belüli rétegekkel kapcsolatban sokan túláradó
érzelmekkel nyilatkoznak. Van, akik szerint az adat a legfontosabb, így
kezdjük az adatbázistervezéssel, az alkalmazás csak egy felület, ami bármikor lecserélhető.
Vannak akik szerint az adatbázis egy buta tár, és az üzleti logika az elsődleges.
Van akik szerint a UI nem fontos, az csak csicsa, csakis a backend kód számít.
A backend viszont nem adja el a terméket, bármennyire szépen is van megírva.
Nemegyszer hallani ebből az okból kifolyólag a dba-k, backend és frontend fejlesztők közötti
ellentétekről. Szerintem az a
hozzáállás a célravezető, ha még csak nem is gondolunk ilyen jellegű összehasonlításokra,
hanem elfogadjuk, hogy az alkalmazás szerves része mindhárom, nincs alá- vagy fölérendelt viszony.
Mindegyik másért felelős, mindegyiket a legjobb tudásunk szerint kell megírnunk, együttműködve.
A lényeg, hogy a határvonalakat a lehető legjobban húzzuk meg.
