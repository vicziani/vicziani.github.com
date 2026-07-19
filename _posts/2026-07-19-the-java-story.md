---
layout: post
title: The Java Story dokumentumfilm
date: "2026-07-12"
author: Viczián István
description: Megjelent egy dokumentumfilm a Java történetéről.
tags:
- Java
- Spring
- Szakmai élet
---

Megjelent egy dokumentumfilm a Java múltjáról [The Java Story | The Official Documentary](https://www.youtube.com/watch?v=ZqGSg4b_cZA) címen.
A filmben a Java alkotói és a közösség híres tagjai mondják el a gondolataikat a Java múltjáról, 
jelenéről és jövőjéről. Természetesen a sort James Gosling, a Java nyelv atyja indítja, aki elmeséli, hogy 
az ötletet egy Time Warner által kiírt pályázat adta interaktív televízó elkészítésére.
El is kezdtek rajta dolgozni a Sunnál, de sajnos ezt a pályázatot
nem nyerték meg. Majdnem mindenkit szélnek eresztettek, de a szerencse folytán páran mégis maradtak,
és megpróbálták kitalálni, hogy ne menjen az eddig elvégzett munka veszendőbe.
A következő lökést az Internet és böngészők elterjedése adta. Létrehoztak egy Hot Java
böngészőt, ami nem csak szöveget tudott megjeleníteni, hanem a kliens oldalon Java kódot tudott futtatni,
nagymértékben dinamikussá téve az oldalakat. Sajnos ez sem terjedt el, viszont a partnerség a Netscape-pel
meghozta a hírnevet, ugyanis a böngészőjük a Netscape Navigator képes volt apró Java programok,
ún. appletek futtatására.

<!-- more -->

Közben elhangzik, hogy a C++ nyelvhez való hasonlóság tudatos stratégia eredménye. Nem akartak egy
újabb, mindentől különböző akadémiai nyelvet létrehozni, hanem egy iparban használható
megoldásra törekedtek. Ehhez viszont szükség volt arra, hogy hasonlítson a C++-ra, ami
bizalmat ébresztett, viszont a párhuzamos programozási képességei, hálózatkezelése sokkal modernebb volt.
A motorháztető alatt olyan modern újítások voltak, mint a szemétgyűjtő mechanizmus, a
dinamikus osztálybetöltés és a reflection.

Ekkor kezdte a Microsoft leuralni a kliens számítógépek piacát, így jó ötletnek tűnk velük partnerségre
lépni. Azonban a Microsoft nem tartotta magát a megállapodásokhoz, és teljesen szembe ment a 
platformfüggetlenség elvének, és olyan Java disztribúciót szállított az operációs rendszerrel,
mely nem volt kompatibilis a Sun féle disztibúcióval. A Sun erre pert indított,
ami azonban távol állt a működésétől, technológiai cégként nem volt benne gyakorlott,
így nem tudott magára a nyelvre koncentrálni.

A Microsoft azonban eközben kifejlesztette a .NET Frameworköt, és a C# nyelvet,
mely nagyban merített a Javaból.

Időközben folyamatos volt a közösség nyomása, hogy a Java nyelvet szabványosítsák, és
tegyék nyílt forráskódúvá. Ennek sok támogatója és ellenzője is volt. Végül saját szabványügyi
testületet hoztak létre, ez a [Java Community Process (JCP)](https://www.jcp.org/), mely
a mai napig is irányítja a Java körüli fejlesztéseket. Erről
Heather VanCura beszél, aki ennek a vezetője.

Bár a Java karrierje a kliens oldalon indult, elindultak a próbálkozások a server oldalon is.
Erről James Duncan Davidson beszél, aki a Tomcat alkotója, ami a Servlet és JSP szabvány
referencia implementációja. Valójában ez volt az első nagyobb nyílt forráskódú megvalósítás,
mely az Apache berkeiben nőtt ki.

Azonban szükség volt egyéb nagyvállalati server oldali megoldásokra is, így alakult ki
a J2EE szabvány, mely a Servlet és JSP szabványon kívül sok egyéb szabványt is 
tartalmazott, különböző (főleg kereskedelmi) megvalósításai voltak, és melyet 
erősen a CORBA ihletett, mely akkor az elosztott rendszerek egy meghatározó 
technológiája volt. Sajnos emiatt vált szinte használhatatlanul bonyolulttá, és
teljesítményproblémák is voltak bőven.

Ekkor jelent meg Rod Johnson könyve, mely a J2EE használatából való frusztrációjából
született, és tartalmazott sok példakódot is, hogy hogy lehetne ezt jobban csinálni.
És a közösség felkarolta, és ezeket a kódokat szerették volna projektekben is használni.
Így született meg a Spring Framework. Rod Johnson határozottan kijelenti, ha nem
jelenik meg a Spring, a J2EE elpusztította volna önmagát és a Javat is.

A J2EE perzisztencia megoldása a Entity Beans volt, mellyel szintén sok probléma volt.
Gavin King beszél arról, hogy ennek használata benne mekkora feszültséget keltett,
és miért alkotta meg a Hibernate ORM eszközt.

És ekkor kezdett a Sun dolgozni azon, hogy a Javat nyílt forrásúvá tegye, és
megalkotta az OpenJDK-t. Ennek megjelenése feltehetően megmentette a nyelvet.

Ez az időszak volt a dotkomlufi korszaka is, a 2000-es évek eleje, melynek során a Sun piaci értékét
teljesen elvesztette. Az aktuális, 6-os Java verzió 2006-ban jött ki, majd éveken át nem jött ki
újabb. Ez volt a Java "sötét korszaka".

2009-ben felszárnyalt a hír, hogy a Sunt felvásárolja az IBM. Azonban később meghátrált,
és az Oracle lépett a helyébe, és a felvásárlás 2010 januárjában le is zárult.
Az Oracle 6 hónap alatt tette le a Javaval kapcsolatos stratégiáját.
A felvásárlás után 6 héttel Gosling kilépett. 2011-ben megjelent a Java 7-es
verziója, mely azt bizonyította, hogy az Oracle színeiben is sikerül
új verziót kiadni.

A film során nem meglepő módon az Oracle-t rendkívül pozitívan tüntetik fel.
A mérnökök számára meglepő volt, hogy a döntések tisztán üzleti alapon születtek.

Még a Sun alatt kezdte el használni a Google a Javat az Android platformon.
A Sun nem volt jó a pereskedésben, így elengedte. Az Oracle azonban nem hagyta ki
ezt a ziccert. A per kb. 10 éven keresztül zajlott, de a bíróság döntése szerint a 
Google Java API-k felhasználása fair use-nak minősült.

Majd megjelent a Java 8, melynek legnagyobb újdonsága a Lambda kifejezések.
Ezt heves belső szakmai viták előzték meg, de Brian Goetz, Java Language Architect,
mellesleg a Java Concurrency in Practice könyv szerzője remek munkát végzett,
ahogy az idő is később bebizonyította.

További nagy változás, hogy az Oracle nyomást gyakorolt a mérnökökre, hogy 
fél évente adjanak ki újabb verziót. Bár ez elsőre elég megterhelőnek tűnt,
jó döntésnek bizonyult, ugyanis a verziók jobban tervezhetőbbé váltak, és amennyiben
egy fejlesztéssel nem sikerült elkészülni, a fél év múlva megjelenő verzióba már bekerülhetett.
Erről Mark Reinhold vezető Java architect beszél.

A Java EE-ről beszél Ivar Grimstad, hogy átadásra került az Eclipse közösségnek,
átnevezésre került Jakarta EE-re, és megjelent az Eclipse MicroProfile, mely egy nyílt forráskódú 
Java-specifikáció, amelyet kifejezetten mikroszervizes architektúrákhoz és felhőalapú alkalmazásokhoz fejlesztettek ki.

És egy kicsit a jelenről. Természetesen a filmben sokan elmondják, hogy
a Java a nyílt forráskódú közösség nélkül nem jutott volna idáig. Van egy rész, ahol
a nyílt forráskódú eszközökre utalnak, és közben a videón a GitHub pár képernyője után megjelenik pár
ikon, mely szerintem önmagában is beszédes, rendre a Tomcat, IntelliJ IDEA, Kafka, Maven, 
Eclipse Foundation, Gradle, Spring, Elastic, Hibernate.

A JetBrains a film egyik támogatója, beszél benne Tagir Valeev, az egyik technológiai vezető,
valamint Andrey Breslav, aki akkor még a JetBrains színeiben a Kotlin nyelvet álmodta meg.

A Project Loomot, melynek része a virtuális szálak, Josh Long, a (főleg Spring) közösség egyik legaktívabb tagja,
a konferenciák állandó résztvevője legalább olyan fontosnak tartja, mint a Lambda kifejezések megjelenését.

Két főbb projektről beszélnek. Egyik a Project Valhalla, mely a value objectek bevezetésével a primitív típusok és az osztályok között
fog átmenetet képezni. A másik a Project Panama, mely a natív kód hívását teszi egyszerűbbé. (Neve abból származik, hogy 
két fontos dolgot köt össze, az Atlanti- és a Csendes-óceánt.) Természetesen itt említik meg az AI-t is, de a 
mai trendekkel ellentétben meglehetősen visszafogottan. Erről beszél Paul Sandoz, a Java Platform Group architectje.

Számomra még érdekesség, hogy beszél Paul Bakker, a Netflix vezető szoftvermérnöke, hogy számukra mennyire fontos a Java,
és mennyi szolgáltatásuk fut rajta. Ő a JavaOne 2026 konferencián is adott elő ugyanebben a témakörben.

A videóban még nagyon sok érdekesség elhangzik, sokan megjelennek, így érdemes végig nézni.