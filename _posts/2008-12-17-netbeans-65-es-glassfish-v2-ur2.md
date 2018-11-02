---
layout: post
title: NetBeans 6.5 és GlassFish v2 ur2
date: '2008-12-17T21:17:00.006+01:00'
author: István Viczián
tags:
- IDE
- Java EE
modified_time: '2018-06-09T10:00:00.000-08:00'
---

A Számalk Továbbképzés keretein belül JP-05 - Alkalmazásfejlesztés Java
EE környezetben tanfolyamot tartva több fejlesztőeszközzel és
alkalmazásszerverrel megpróbálkoztunk már. Ezek a következők voltak:

-   Eclipse IDE for Java EE Developers Europa (3.3) + JBoss 4.2.2 GA
-   Oracle JDeveloper 10.1.3.4 + OC4J
-   NetBeans 6.5 + GlassFish v2 ur2

Ebben a posztban megpróbálom ezeket összehasonlítani.

Az Eclipse + JBoss kombinációt először a JBoss Tools 2.0.0GA Eclipse
plugin-nel kezdtük, de annyira bugos volt, hogy hamar átálltunk arra,
hogy csak az alkalmazásszerver elindítására és leállítására használtuk.

Sajnos ez a párosítás nem felel meg az oktatásra, ugyanis a JBoss-nak
olyan hibaüzenetei vannak, melyek egyrészt több oldalas, több egymásba
ágyazott exception-t tartalmazó stacktrace-ek, másrészt kezdő, avatatlan
szem számára teljesen semmitmondóak. Az oktatás gyakorlatilag abból
telt, hogy a hallgatók által generált hibákat nekem kellett
visszafejtenem, hiszen a hibaüzenet számukra nem sugallta a megoldást.

Egyik hallgatónál a teszt eset futtatása során, amit pontosan ugyanúgy
írt meg, mint a többiek, a következő hibaüzenet jött elő:

    Could not connect to:  : 3393
    java.net.ConnectException: Connection refused: connect
    at java.net.PlainSocketImpl.socketConnect(Native Method)
    at java.net.PlainSocketImpl.doConnect(PlainSocketImpl.java:333)
    ...

Ezzel kapcsolatban találtam is egy [blog
posztot](http://mcqueeney.com/roller/page/tom/20070626), a megoldás itt
is ugyanaz volt, Eclipse újraindítás. A következő probléma az volt, hogy
a JBoss esetén, ha egy EJB 3.0 Named Query szintaktikailag hibás volt,
onnantól kezdve hiába deploy-oltam újra az alkalmazást, nem segített, a
teljes alkalmazásszervert újra kellett indítani. Ez sem ritka kezdőknél.

Sajnos a hallgatók rossz szájízzel távoztak, a Java EE technológia még
kiforratlan. Azóta kijött az Eclipse 3.4, Ganymede, azzal még nem
próbálkoztunk.

A következő oktatás a JDeveloper + beépített pehelysúlyú konténerrel, az
OC4J-vel történt. Talán összehasonlítva az oktatásokat, a legkevesebb
probléma ezzel a kombinációval volt. Összeértek az eszközök, a
sebességre sem volt panasz. Azóta kijött a 11g, mely már nem az OC4J-t,
hanem a BEA WebLogic Application Server-t tartalmazza
alkalmazásszerverként, hát vannak fenntartásaim.

A harmadik, legfrissebb tanfolyam a NetBeans + Glassfish párosítással
történik. Egy ilyen oktatás már lement, és nagyon kedvezőek voltak a
tapasztalatok, bár régebbi verziókkal történt. A jelenlegi összkép
leírhatatlan, csupán az első példa alkalmazásnál (ami egy szál Session
Bean, valamint ehhez tartozó Application Container-ben futó kliens) a
következő hibákba botlottunk.

Minden egyes indításnál, telepítésnél a következő hibaüzenetet írja a
konzolra:

    Error attempting to process extensions from the manifest of JAR file C:\jtechlog\EnterpriseApplication1\dist\gfdeploy\EnterpriseApplication1-ejb.jar; ignoring it and continuing
    java.io.FileNotFoundException: C:\jtechlog\EnterpriseApplication1\dist\gfdeploy\EnterpriseApplication1-ejb.jar (A rendszer nem találja a megadott fájlt)
         at java.util.zip.ZipFile.open(Native Method)
    at java.util.zip.ZipFile.(ZipFile.java:114)

Ezzel egy [másik
poszt](http://blogs.sun.com/quinn/entry/why_the_warnings_about_glassfish)
is foglalkozik, mely azt írja, hogy ez amiatt van, hogy a telepítésnél a
NetBeans nem EAR-t, és abba csomagolt JAR-t deploy-ol, hanem rögtön
kicsomagolva. Ez eddig szép is, de én tökéletesen egyetértek az egyik
hozzászólóval, hogy próbáljuk követni a Linux szemléletet. Ha minden
simán működik, akkor ne írjunk ki semmit, ha valami baj van, akkor
viszont a lehető leginformatívabb szöveget. A hallgatókat sokszor
megzavarja a hibaüzenet.

A következő probléma az volt, hogy bizonyos (!) hallgatóknál egy, az
alkalmazásszerverben futó Session Bean-hez kapcsolódni kívánó távoli
klienst nem lehetett lefuttatni, ugyanis a következő hibaüzenetet dobta.

    Warning: Could not find file C:\jtechlog\ApplicationClient1\${wa.copy.client.jar.from}\ to copy.

A tanári gépen a hiba nem volt reprodukálható, de itthon új telepítéssel
újra előjött. Megoldás nem lett, pár próbálkozás után "megjavult". Ezzel
kapcsolatosan
[egy](http://www.netbeans.org/issues/show_bug.cgi?id=91211) és
[két](http://www.netbeans.org/issues/show_bug.cgi?id=85129) hiba is
regisztrálva van a NetBeans Issue Tracker-ében, valamint egy [konfig
buherálás](http://wiki.netbeans.org/RemoteApplicationClientInNetBeans)
is ismeretes.

No, ha már elindult az alkalmazásunk, mutassuk be, hogy a Glassfish
képes arra, hogy az EAR-ba csomagolt alkalmazás klienst kliens
konténerben (Application Client Container - ACC) képes futtatni,
méghozzá az adminisztrátori felületről is indítva, Java Web Start-tal.
Ez sem sikerült, a Glassfish-ben ez egy ismert
[hiba](https://glassfish.dev.java.net/issues/show_bug.cgi?id=5374), ha
Java SE 6 update 6 utáni verzióval futtatod az alkalmazásszervert.

A következő hibát a Message Driven Bean-nél találtuk, hiszen üzenet
fogadásakor a Glassfish logban mindig a következő üzenet jelent meg:

    DirectConsumer:Caught Exception delivering messagecom.sun.messaging.jmq.io.Packet cannot be cast to com.sun.messaging.jms.ra.DirectPacket

A [hiba](http://bugs.sun.com/view_bug.do?bug_id=6650996) szintén
ismeretes a Glassfish-nél,
[megoldása](http://www.adam-bien.com/roller/abien/entry/how_to_get_rid_of),
hogy az adminisztrációs konzolon, a Configuration -&gt; Java Message
Service menü alatt a típust "Embedded"-ről "Local"-ra kell váltani.

A hab a tortán az volt, hogy ugyan nagyon kényelmes eszköz van arra,
hogy JPA esetén a persistence unit létrehozása közben a NetBeans-ből
tudunk DataSource-ot létrehozni az alkalmazásszerveren, de ez csak a
hallgatói gépek felén működött, a másik felén nem jelent meg az
alkalmazásszerveren, csak a NetBeans Server Resources/sun-recources.xml
állományban, így azoknak kézzel kellett felvenniük az adminisztrációs
felületen.

Az oktatás alatt első körben csak pár soros példa kódokat használunk.
Amennyiben ezen egyszerű példák esetén is ennyit hibáznak ezek az
eszközök, mennyit hibázhatnak éles fejlesztés során? Mire való, hol van
az a rengeteg automatikus teszt eset, ami pont az ilyen egyszerű
eseteket tesztelné? Egyáltalán bevállalhatóak-e ilyen silány minőségű
eszközökkel projektek?

Tovább keresem az oktatásra megfelelő párosítást.
