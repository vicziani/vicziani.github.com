---
layout: post
title: Első Sun ONE Cafe beszámoló
date: 2003-09-23T08:00:00.000+01:00
author: Viczián István
tags:
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Reggel lezajlott az első Sun ONE Cafe, melynek első témája a Project
Orion volt, amit azóta már átnevezve mutattak be a [SunNetwork
2003](http://developers.sun.com/events/sunnetwork/) konferencián, mint
[Sun Java System](http://wwws.sun.com/software/javasystem/index.html).
Sokat ködösítenek körülötte, de nem más, mint egy új brandnév, mely
tartalmazza az összes Java technológiára épülő Sun terméket, meg egy pár
olyant, ami nem Java alapú. Az alapötlet az volt, hogy mivel az összes
terméknek szorosan integrálható, miért ne rakják egybe, teszteljék ki,
és adják a felhasználónak. Ez egyrészt kihat a szállításra,
verziókezelésre és integrációra, árazásra, liszenszelésre, előzetes
kalkulációkra. Így megalkották a JES-t, melynek kiadása ezentúl
negyedévente történik, alkalmazkodva az eddig jól bevált Solaris
negyedéves verzióváltáshoz, és licenszelése is egységes, fix előfizetési
díj van megállapítva, persz különböző, egyedi konstrukciók is
lehetségesek.

A következő csomagokat tartalmazza: Java Enterprise System (JES), mely a
szerver oldali szoftvereket tartalmazza, Java Desktop System, mely az
asztali számítógépekre van kitalálva, Java Mobility System, mobil
felhasználóknak Java Card System, Java alapú intelligens kártyákra, Java
Studio a fejlesztőknek és az N1, a hardverek és hálózat üzemeltetésére.
A Java Enterprise System a következő szoftvereket tartalmazza:
alkalmazásszerver, webszerver, directory server (címtár), identity
server (azonosítás), portálszerver, integration server, messaging server
(asszinkron kommunikációra), calendar és instant messaging server (belső
kommunikációra, csoportmunkára), cluster (terhelésmegosztás), media
server, grid engine, data services engine és provisioning. Tartalmazza a
Solaris operációs rendszert is, de alternatívan az x86 és Linux platform
is támogatott. Az 1.0-ás verzió előreláthatóan novemberben fog
megjelenni, mely a következő verziókat tartalmazza: AS 7.0, Calendar
Server 6.0, Directory Server 5.2, Directory Proxy 5.2, Idenity Server
6.1, Instant Messaging Server 6.1, Message Queue 3.0.1, Messaging Server
6.0, Portal Server 6.2, Portal Secure Remote Access 6.2, Sun Cluster
3.1, Sun Cluster Agents, Web Server 6.1. A JES integrált
szolgáltatásokat is tartalmazhat, mint architektúratervezés,
üzembehelyezés, konzultáció, oktatási kredit, követés és támogatás.

A reggeli második felén a Sun ONE Application Server 7 (kódnevén
Hercules) EE HA szolgáltatásairól esett szó, mint a db és as cluster,
illetve a Sun ONE Webserver 6.1-ről, mely egy teljesen többszálas
webszerver, ez a teljesítménymutatóin is meglátszik. Mindkettőt egy ún.
Watchdog figyeli, és ha valami hiba történik, automatikusan újraindítja.
Java programozóknak hasznos információ, hogy a Tomcat szervlet/JSP
konténtert tartalmazza mindkettő. Kis perverzióval ASP-t is támogat a
Webserver, hála a nemrég felvásárolt ChiliSoft immár Sun ONE Active
Server Pages 4.0 névvel futó alkalmazásának. Az AS következő verziója a
7.1 számot fogja viselni, Glaucus kódnévvel, de még nem lesz a JES-ben,
hiszen csak Solaris-on támogatott, de tervezett a többi platformra
portolás is.

A
[prezentációk](http://hu.sun.com/esemeny/publicesemeny/sunone_cafe/index.html)
letölthetők a rendezvény honlapjáról.
