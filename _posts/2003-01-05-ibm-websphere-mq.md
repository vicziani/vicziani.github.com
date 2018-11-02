---
layout: post
title: IBM WebSphere MQ
date: 2003-01-05T08:00:00.000+01:00
author: Viczián István
tags:
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Nemrég láttam a [WebSphere
MQ](http://www.ibm.com/software/integration/wmq/) 5.3.1-et valahol, és
nem is hittem a szememnek, hiszen naponta csekkolom az IBM-et, és semmi.
Azóta sem. Viszont érdekes körülmény, hogy a letöltéseknél már csak
5.3.0.1-es van, amihez odaírták, hogy azelőtt 5.3.1 volt.

Letöltöttem, tényleg tök más, mint az 5.3-as, viszont az összes fájl
5.3-ként emlegeti, a weben sehol nem találtam semmit, hogy kijött volna
új. Furcsa, hogy az 5.3-as nem támogatta az XP-t, ez meg simán elkezd
csúszni fel.

Miért nem ír erről az IBM? Mi az újdonság az újban? Miért tették bele
azt a nullát? Örök titok marad.

Aki nem hallott már róla, az IBM WebSphere MQ egy üzenetsorakoztató
middleware, mely ipari körökben nagyon elterjedt alkalmazásintegráció
körében. Támogatja természetesen a JMS-t is, de a saját API-jához (MQI)
is tartalmaz Java osztályokat. Az 5.3 előtti verziókban külön
SupportPack volt a Java támogatás, de az újban már belerakták teljesen.

Senkit ne zavarjon meg, hogy más JMS-t támogató middleware-ek mennyivel
sokkal gyorsabbak, érdemes megnézni a funkcionalitásukat is. Jóhogy
gyorsabb, ha nem annyira biztonságos...
