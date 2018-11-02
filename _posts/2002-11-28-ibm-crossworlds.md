---
layout: post
title: IBM Crossworlds
date: 2002-11-28T08:00:00.000+01:00
author: Viczián István
tags:
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Ma volt az IBM-nél egy Szoftver Partner Klub
nevezetű rendezvény, ahol dr. Sugár Péter beszélt az [IBM
Crossworlds](http://www.ibm.com/software/integration/cw/) szoftverről.

![Websphere](/artifacts/posts/2002-11-28-ibm-crossworlds/tridiagram.icons23.gif)

Az [üzleti
integrációnak](http://www.ibm.com/developerworks/websphere/zones/businessintegration/)
három szintje van, a legalsó az adat szintű integráció, fájlokon,
adatbázisokon keresztül, ahol a tranzakciós biztonság nehezebben
kivitelezhető. A felette lévő szint az alkalmazás integráció (Enterprise
Application Integration - EAI), és a legfelső a folyamat szintű
integráció. No, ez a Crossworlds pont ebben segít nekünk. Miért is kell
ez, hiszen ott van az Workflow, ami pont erre jó. Két irányzat van, az
egyik, amikor a felhasználó is beleavatkozhat a munkafolyamatba, tőle
indul, vagy nála végződik; illetve a teljesen automatizált folyamatok
(Business Process Management - BPM). A Workflow az előbbihez jó, a
Crossworlds az utóbbihoz.

A Crossworlds alapban objektumokat kezel (General Business Objects),
mely egy absztrakt fogalom, és mappinggel képzi le ezt konkrét
alkalmazások objektumaivá. Ezen objektumokra épülnek a konkrét
folyamatok, melyeket a Crossworlds collaboration-oknak hív, melyek
valójában üzleti folyamat sablonok (business process templates).
Fizikailag ez úgy néz ki, hogy középen ül egy IBM CrossWorlds
Interchange szerver, az connectorokkal kapcsolódik a konkrét
alkalmazásokhoz. Rengeteg előre gyártott connector van, mely
használhatja az adott alkalmazás API-ját, rosszabb esetben a tábláit,
fájljait, végső esetben akár e-mail-en is tarthatja vele a kapcsolatot.

Mi köze ennek a Java-hoz? Hát mert az egész Crossworlds Interchange
Server Java alapú kiszolgáló. Most standalone, később Websphere
Application Serveren fog futni. Az objektumok az alkalmazások és a
Crossworlds között XML formátumban utaznak, JMS API-n át. A fejlesztés
alapjában véve grafikus felületen történik, de a kódot Java nyelven
írhatjuk.

Ez kicsit tömény lett, de rövidebben nem tudtam idenyomni.
