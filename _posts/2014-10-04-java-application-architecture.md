---
layout: post
title: Java Application Architecture
date: '2014-10-04T23:48:00.001+02:00'
author: István Viczián
tags:
- Modularizáció
- Módszertan
- könyv
modified_time: '2018-02-13T20:31:19.671+01:00'
---

Már régóta hajtottam a [Kirk Knoernschild: Java Application
Architecture](http://www.amazon.com/gp/product/0321247132) könyvet,
végre hozzájutottam, és nem is csalódtam benne. Mostanában érdekel a
modularizáció, különösen Java környezetben, és kíváncsi voltam, hogy
elméleti szinten mit tudnak erről írni. Bár a könyv alcíme “Modularity
Patterns with Examples Using OSGi”, senki ne rettenjen meg, akit nem
érdekel az OSGi, éppen csak érinti, a könyv OSGi ismeretek nélkül is
kitűnő olvasmány.

A könyv a Robert C. Martin sorozatban jelent meg, az előszót is ő
(“Uncle Bob”) írta. Talán ezért is kerül szóba olyan hamar a
[SOLID](http://en.wikipedia.org/wiki/SOLID_%28object-oriented_design%29)
fogalma, mely az öt alapvető szoftverfejlesztési elv rövidítéseinek
mozaikszava. A könyv egyetlen melléklete is ezek kifejtését tartalmazza.

![Java Application Architecture könyv](/artifacts/posts/2014-10-04-java-application-architecture/java_application_architecture.jpg)

Nekem már a könyv felütése is tetszik, hogy rengeteget foglalkozunk a
logikai tervezéssel, mikor is OOP elvek mentén interfészeket,
osztályokat alakítunk ki (pl. akár az UML nyelv használatával). Szintén
sok energiát szoktunk fektetni abba is, különösen a SOA elterjedésével,
hogy szolgáltatásokat alakítsunk ki, interfészeket tervezzünk, és erre
alakítsunk ki egy architektúrát. Ezek hatalmas irodalommal is
rendelkeznek. De közöttük hiányzik valami.

Ugyanez a felhasználhatóság, újrafelhasználhatóság terén is. Az
interfészek, osztályok egy finom szemcsézettséget (fine
grained/granularity) adnak. Az újrafelhasználhatóságuk nagyon magas,
hiszen minden nap használunk `String`, `ArrayList`, stb. osztályokat,
viszont a használhatóságuk nehézsége magas, ugyanis tapasztalt
fejlesztőnek kell lenni, az API ismeretével. Ezen pehelysúlyú
komponensek újrafelhasználhatósága azért is magas, mert kevesebb a
függőségük, nem függnek a környezetüktől. Azonban a SOA szerinti
szolgáltatások a durva szemcsézettségűek (coarse grained), használatuk
viszonylag egyszerű az általuk biztosított interfész (pl. WSDL) alapján,
de nehéz őket újra felhasználni. Így ismét egy ugrás található. Nincs
meg az a szint, mely az optimális könnyű használatot, és az
újrafelhasználhatóságot is biztosítja.

Ebből egy olyan triviális állítás is kiesik, hogy ahogy növeljük az
újrafelhasználhatóságot, úgy lesz nehezebb használni. Másképp
megfogalmazva a flexibilitásával nő a komplexitása.

A könyv szerint a keresett szint nem más, mint a modul szint. Ő ezt
fizikai tervezésnek nevezi. A könyv a modulok kialakítására vonatkozóan
fogalmaz meg tervezési mintákat. De nézzük, hogy hogyan is definiálja a
modul fogalmát:

-   Deployable (külön telepíthető)
-   Manageable (külön indítható, leállítható)
-   Natively reusable (metódushívással)
-   Composable (több modulból egy modul hozható létre)
-   Stateless unit (nem példányosítható, egy verzióból egy és csakis
    egy létezik)
-   Concise interface (tömör interfész a használói számára)

A Java világban ezek nem mások, mint JAR állományok.

A modularizációt két szempontból vizsgálja. Egyrészt futásközben,
másrészt fejlesztés közben. Futás közben nyilván kell egy futtató
környezet, mely a modulokat kezeli (Runtime model). Fejlesztés közben
két kérdéskörrel kell foglalkozni. Egyrészt hogyan történik az
interakció a futtató környezettel (Programming model). A modern
környezetek már nem látszanak a modulok számára. A másik kérdés, hogy
hogyan alakítsuk ki a modulokat (Design paradigm)? Milyen modulokat kell
kialakítani, ezek milyen méretűek legyenek, hogyan viszonyuljanak
egymáshoz, stb. A könyvben szereplő tervezési minták ezen kérdésekre
adnak választ.

És itt jön be egy kicsit az OSGi, hogy mik azok az elvárások, melyeket
alapból nem tud a Java teljesíteni. Egyrészt nem lehet korlátozni JAR
szinten, hogy mely csomagok legyenek csak elérhetőek más JAR-okból
(export package). Nem lehet futásidőben JAR-t cserélni (dynamic
deployment). Nem élhet ugyanazon osztály két különböző verziója egymás
mellett (versioning). Valamint nincs függőségkezelés (dependency
management).

Sajnos a szoftver architektúra nem egyértelműen definiált. Olyanokat
lehet mondani, hogy döntések, elvek és útmutatások a rendszer
felépítésével kapcsolatban. Definiálja a rendszert statikus
vonatkozásban (elemek, komponensek és a köztük lévő kapcsolatok), és
dinamikus vonatkozásban is (együttműködések). Szerinte a modularizálás
közelebb hozza a fejlesztőket és architecteket. Az architect tipikusan a
szolgáltatás, modul és maximum a csomagszintet látja, míg a fejlesztők a
modul, csomag, osztály és metódus szintet. Így van egy közös halmaz,
mely megértése mindkét fél számára hasznos.

A könyv első részének végén van egy példa is, mely egy monolitikus
rendszerrel indít és ezt tördeli modulokra, természetesen a később
kifejtett tervezési mintákat használva. A példa szintén nem tartalmaz
OSGi-t. A könyvhöz tartozó példakód [letölthető a Google
Code-ról](https://code.google.com/p/kcode/).

A könyv második része tartalmazza a tervezési mintákat. Mintánként
tartalmazza a minta nevét, egy rövid leírást, egy UML diagramot
(rettentő hasznos, segítségével azonnal meglehet érteni a mintát),
implementációs megközelítéseket, a minta használatának következményeit,
példát, és egy rövid összefoglalást.

A mintákat nem sorolnám itt fel, hanem készítettem egy mindmapet a
[FreeMind](http://freemind.sourceforge.net) szoftverrel. A mindmap
forrása megtalálható a
[GitHubon](https://github.com/vicziani/jtechlog-articles/tree/master/modularization),
és [itt kattinthatóan is
elérhető](http://www.jtechlog.hu/jtechlog-modules/modul-tervezesi-mintak.html),
de lejjebb találtok egy nagyítható képet is. Próbáltam a mintákat
lefordítani, de nem szó szerint, hanem a célja alapján.

<a href="/artifacts/posts/2014-10-04-java-application-architecture/modul-tervezesi-mintak.png" data-lightbox="post-images">
![Java Application Architecture könyv](/artifacts/posts/2014-10-04-java-application-architecture/modul-tervezesi-mintak_600.png)
</a>

A könyvhöz tartozó [weboldal](http://www.kirkk.com/modularity/about/) is
felsorolja a mintákat, és rövid leírásukat, valamint mintánként egy
ábrát. Jó a hozzá készült
[refcard](http://refcardz.dzone.com/refcardz/patterns-modular-architecture)
is, mely letölthető PDF-ben.

A könyv harmadik része szól az OSGi-ról, ami éppen annyira tömör, hogy
felkelti a figyelmet az említett technológiára, és tisztázza az
alapfogalmakat.

Mint látható, a könyv nagyon tetszett, szerintem hiánypótló írás. Az
olvasása közben többször elgondolkodtam, hogy mi az, amit akár a futó
projektjeimen használni tudnék, mit kéne másképp csinálni. Persze a
legtöbb mintát az ember már ismeri, de mégis ez a könyv foglalja
rendszerbe, és elemzi ki több oldalról is. Úgy érzem, hogy olyan könyv,
amit érdemes többször levenni a polcról, és néha-néha újra kinyitni. Bár
2012-es, még egyáltalán nem elavult, szemben más technológiai
könyvekkel, és egy darabig még nem is lesz. És talán az OSGi-hez is
kedvet kapunk.
