---
layout: post
title: Oracle Java Cafe
date: '2010-11-14T20:58:00.004+01:00'
author: István Viczián
tags:
- Oracle
- Java EE
- Community
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Az Oracle újraszervezte a Java Cafe napot, melynek első eseménye 2010.
november 12-én, pénteken volt. Erre kedden kaptam először meghívót,
szokatlanul későn. Sajnos az eseménynek sem weblapja nincs, sem azt nem
tudom, hogy hogyan lehet a listára feliratkozni.

Az esemény 13:00-ig tartott, és négy előadás hangzott el. A megnyitót
Gere István, az Oracle Oktatási Igazgatója nyitotta, hallottunk a Java
múltjáról, az Oracle elkötelezettségéről, valamint arról, hogy az Oracle
még több erőforrással kívánja fenntartani a platform fejlődését. Ennek
egyik oka, hogy a Java az Oracle egyik legsikeresebb portfóliójának, a
Fusion Middleware-nek az alapja. A Fusion Middleware nem más, mint azon
Oracle termékek gyűjtője, ami nem adatbázis, és Oracle Applications. A
SOA őrületet próbálja megvalósítani, így tartalmazza egy SOA
implementációhoz szükséges összes komponenst, kezdve az alap
infrastruktúrától (pl. alkalmazásszerver, identity, cache, grid, stb.)
egyre feljebb, mint pl. integrációs eszközök (aszinkron üzenetküldés,
ESB, BPEL, registry, stb.), folyamat irányítás, üzleti szabályok,
egészen a legmagasabb szintig, mint üzleti intelligencia, content
management, portál. De magába foglalja a fejlesztőeszközöket és
felügyeleti eszközöket is. Sok név ismerős lehet az időközben felvásárol
BEA-tól, pl. JRockit, Weblogic, vagy a még régebbi Tuxedo, de itt
szerepelnek a tradicionális Oracle termékek is, mint az Oracle
Application Server, ADF, JDeveloper, Forms és Reports services,
Discoverer, stb.

Az első előadást [Nagy Péter](http://blogs.oracle.com/nagy/) tartotta a
Java múltjáról, jelenéről és jövőjéről. Itt már több technológiáról
esett szó, bár főleg olyan információk hangoztak el, melyek a neten már
megtalálhatóak voltak. Az Oracle a felvásárlással most két Java
Virtuális Géppel rendelkezik, a Sun-féle HotSpot, és a BEA-féle JRocket.
A kettőt össze szeretnék fésülni, hogy csak egy legyen, és természetesen
az nyílt forrású [OpenJDK](http://openjdk.java.net/) projekt keretein
belül. (Mellyel kapcsolatban a hét híre, hogy az Oracle és az Applce
[bejelentette](http://hup.hu/cikkek/20101114/az_apple_es_az_oracle_openjdk_projektet_jelentett_be_az_os_x-hez)
az OpenJDK Project-et Mac OS X-re. A JDK-nak lesz fizetős változata is,
melyhez az Oracle hozzáadott szolgáltatásokat biztosít, pl. előbbi
hibajavításokat, valamint support-ot. Az Oracle a JavaFX-et is [kiemelt
helyen kezeli](http://www.javafx.com/roadmap/). Látszik, hogy tervezik a
JavaFX 2.0-t, a JavaFX UI nyílt forráskódú lesz, valamint különös
hangsúlyt fordítanak a NetBeans alapú fejlesztő eszközre is. Ingyenes
előadás is lesz ezzel kapcsolatban, [OTN Developer Day – Java
FX](http://eventreg.oracle.com/webapps/events/ns/EventsDetail.jsp?p_eventId=116172&src=7038703&src=7038703&Act=49)
címmel, mely sajnos már betelt.

Fejlesztőeszközből szintén nőtt a kínálat. A NetBeans lenne a
támogatott, belépő szintű fejlesztőeszköz. Viszont aki ki akarja
használni a Fusion Middleware-t, annak JDeveloper-t ajánlott
telepítenie. Persze az Eclipse tábor is kap egy Enterprise Pack for
Eclipse-t. Az alkalmazás szervereknél sem lesz összefésülés, a GlassFish
marad a belépő szintű termék, a referencia implementáció, és ennek is
lesz kereskedelmi verziója support-tal, gyorsabb hibajavításokkal,
valamint management eszközzel. A GlassFish 3.1 is [elérhető
már](http://dlc.sun.com.edgesuite.net/glassfish/3.1/promoted/) early
access-ként, és már támogatja a cluster-ezést. Persze a nagyágyú a
WebLogic marad, mely a Fusion Middleware támogatott alapja. Ha nem is
lesz egybeolvadás, lesznek az alkalmazásszervereknek közös kódrészletei.
Ugyanúgy stratégia irány a mobil fejlesztés is, valamint megjelent egy
[Exadata](http://www.oracle.com/us/products/middleware/exalogic/index.html)
megoldás is, melyről [magyar videó is
van](http://blogs.oracle.com/zfekete/2010/11/video_a_sysman_exadata_demo_ce.html).
Ez gyakorlatilag egy összehangolt hardver és szoftver megoldás, mely
irgalmatlan teljesítményre képes. Ez most az Oracle zászlóshajója a
Cloud Computing témakörben.

Kérdések között felmerült, hogy mi a helyzet az Oracle Forms, Reports és
Discoverer-rel? Az Oracle gondolkozott a kivezetésén, térítve az
embereket a Java technológia irányába, azonban ez sikertelen, hiszen
rengeteg létező, futó alkalmazás van már megvalósítva ezen
technológiákkal. Tehát ezek élnek, fejlődnek (11g), Fusion Middleware
részét képzik, [lehet már WebLogic-ra
migrálni](http://www.oracle.com/technetwork/middleware/upgrade-092995.html).

Majd Gere István beszélt az Oracle University SUN Java oktatási
portfóliójáról. Érezhető, hogy az Oracle komolyan veszi ezt a területet,
négy partnerrel együttműködve végzik az oktatásokat. A tanulási
lehetőségek szerteágazóak. Egyrészt a legismertebb a tantermi képzések.
Ezen kívül lehetséges az e-learning is, Live Virtual Class néven fut.
Lehet self study CD-ket is rendelni, melyek használatával a hallgató
maga készülhet fel. Valamint létezik egy Knowledge Center is, melyről
előfizetés ellenében lehet mindenféle anyagot letölteni.

Az oktatási portfóliót is eléggé megvariálták, alkalmazkodtak az Oracle
Associate/Professional/Master szintjeihez (, bár ezek korábban is
megvoltak a Sun-nál). Az első szint kb. azt jelenti, hogy képben vagy, a
második szinten tesztet kell kitölteni, és azt jelenti, hogy ismered a
specifikációkat, és a harmadik szint jelenti, hogy képes vagy komplex
feladatokat is megoldani. (Itt kapsz egy önállóan megoldandó feladatot,
majd igazolnod kell esszékérdésekre válaszolva, hogy te oldottad az
meg.) A képzéseket, és a képzéshez tartozó vizsgákat tartalmazó
dokumentumot később fogják szétküldeni.

Következő előadás a Java Master és Oracle Junior képzésről szólt, és
Nagy Kálmán (Medusoft Kft.) tartotta. Ennek keretében 2x12 ifjú titánt
képeznek 4 (elmélet) + 3 (gyakorlat) hétig. Az elején gyakorlatilag
megkapják a hivatalos Oracle tanfolyamokat, majd utána egy
projektmunkában vehetnek részt. Itt nem csak a szabvánnyal
ismerkedhetnek meg, hanem build, continuous integration eszközökkel,
teszteléssel, stb. Nemsokára indul a marketing kampány.

Az utolsó előadást [Simon Géza](http://www.delicious.com/sngeza)
tartotta (Medusoft Kft.), "JavaEE 6: kevesebb kódolás - több eredmény"
címmel. A címet [Arun Gupta](http://blogs.sun.com/arungupta): Java
EE6=Less Code+More Power előadása alapján választotta, mely hazánkban is
[meghallgatható
lesz](http://www.oracle.com/global/hu/education/eblast/hu_emea_ou_oracle_arungupta_011010_ol.html)
november 25-26-ig. Az előadás a [Java EE
6](http://en.wikipedia.org/wiki/Java_EE_version_history) érdekesebb
újdonságait villantotta fel, melyek célja a még több automatikus
ellenőrzés.

Az EJB egyik legnagyobb újdonsága a Singleton Session Bean, mellyel
megvalósítható, hogy az adott Bean-ből JVM-enként csak egy példány
létezzen. Itt problémát első sorban a párhuzamosság okozhat, hiszen
ugyanazon objektumhoz több szál is hozzáférhet. Pesze erre is van több
megoldás, egyik a @Lock annotáció, konténer által vezérelt
szinkronizáció estén, valamint használhatjuk a klasszikus synchronized
kulcsszót a bean vezérelt szinkronizáció esetén (ezt inkább ne is
használjuk). Másik érdekesség a @Asynchronous annotáció, ilyenkor nem
kell JMS-t, sorokat használni az aszinkron híváshoz.

A Java EE egyik új szabványa a Contexts and Dependency Injection for
Java (Web Beans 1.0) JSR 299. A szabvány vezetője a RedHat/JBoss volt.
Egyrészt megpróbálja egységesíteni a DI-t, ezzel versenybe szállni
azokkal a keretrendszerekkel, melyek ezt magasabb szinten űzték (pl.
Spring, Guice, stb.). Másrészt kiterjeszti az EJB-ben szereplő DI-t,
ugyanis az nagyon korlátozott funkcionalitással rendelkezett, hiszen
csak pár komponensben elérhető. Követi az EJB alapkoncepcióját, hogy
legyenek intelligens default értékek, ne kelljen konfigurálni, viszont,
ha szükség van rá, akkor legyen lehetőség a testreszabásra, akár külön
XML állományban is (beans.xml). A szabvány referencia implementációja a
[Weld](http://seamframework.org/Weld), mely a Seam keretében lett
kitalálva, és ezért remekül integrálható vele. A
[Seam](http://seamframework.org) nem más, mint a JBoss megoldása, nyílt
forráskódú keretrendszere RIA alkalmazások fejlesztésére. Integrálja az
összes réteget, pl. EJB 3.0, JPA, JSF, AJAX, sőt Business Process
Management (BPM), ezáltal egy komplett megoldást nyújtva. A Weld amúgy
integrálható a Java EE 5 alkalmazás szerverekbe is. Ezáltal minden
rétegben, minden objektumban elérhetővé válik a DI, nem csak EJB-ben,
vagy servlet-ben. A context, másképpen scope arra utal, hogy mennyi a
bean-ek élettartama, lehet request, session, stb., sőt, saját context-et
is definiálhatunk. Szintén ismert benne az események fogalma.
Annotációkkal használhatjuk, type safe, és akár saját eseményt is
definiálhatunk, méghozzá úgy, hogy nem csak annotációt használunk, hanem
saját annotációt hozunk létre.

Szó esett a RESTful web szolgáltatásokról, hiszen a Java EE már a JAX-RS
szabványt is tartalmazza. Erről korábban már [itt a blogon
is](/2009/12/27/restful-webszolgaltatasok-jersey-vel.html) volt szó, ezt
nem részletezném. Remekül illik a Java EE architektúrába, egyszerű,
annotációkkal konfigurálható, stb.

Volt szó még a Bean Validation-ről, mely feladata az olyan kényes kérdés
megválaszolása, hogy hol és hogyan ellenőrizzük a beadott adatokat.
Közel a felülethez, hogy a felhasználó mielőbb választ kapjon? Vagy az
adatbázisnál, hogy ne kerüljön hibás adat mentésre? A válasz, hogy
legyen ez az adatot hordozó bean-be, majd itt már az a réteg hívhatja
meg, amelyik csak akarja. Deklaratív, annotációval adható meg pár előre
definiált ellenőrzés. Saját ellenőrzéseket is bevezethetünk, szintén
saját annotációk implementálásával (én itt vesztettem el az
érdeklődésemet). Emiatt szintén type safe. Lehetőség van persze
feltételes ellenőrzések megadására is.

Említésre került a JPA 2 két sokak által várt újdonsága, egyrészt a
rendezett kollekciók, másrészt a Criteria API. Valamint elhangzott, hogy
a GlassFish 3.1 is kipróbálható.

Lesz december 9-én egy 1 napos szeminárium Swiss knife for Java EE6
címmel is, melynek célja, hogy bemutassanak olyan, a gyakorlatban
rendszeresen felmerülő problémákat (és lehetséges megoldásaikat),
amelyekhez egy kicsit többre van szükség, mint a JavaEE szabvány
ismerete. Lesz szó minél hatékonyabb adatbázis-elérésről, adatbázis séma
verziózásról, keretrendszerek összehasonlításáról, tesztelésről,
forráskód-kezelésről, automatikus fordításról-csomagolásról.
