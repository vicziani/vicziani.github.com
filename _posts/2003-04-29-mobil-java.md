---
layout: post
title: Mobil Java
date: 2003-04-29T08:00:00.000+01:00
author: Viczián István
tags:
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Egyre több MIDP 1.0-t támogató
[eszköz](http://java.sun.com/webapps/device/device) jön ki, és már a
MIDP 2.0 szabvány is megjelent, így érdemes egy kicsit a [J2ME
technológiákról](http://java.sun.com/j2me/), a [vezeték
nélküli](http://developers.sun.com/techtopics/mobility/) eszközökre való
fejlesztésről is szólni.

A J2ME bevezetése sem szakít a hagyományokkal, célja egy olyan felület
biztosítása a programozók számára, mely minden eszközön ugyanolyan,
legyen az mobiltelefon, PDA vagy más egyéb. Tehát fő cél a
platformfüggetlenség, az alkalmazások hordozhatósága. Mivel a telefonok
korlátolt erőforrásokkal rendelkeznek (még), nem lehetséges a JVM
átültetése ezekre, hanem létrehoztak egy új VM-et KVM (Kilo Virtual
Machine) néven, melynek neve arra utal, hogy kilobyte-okban is elfér.
Erre épül a CLDC (Connected Limited Device Configuration) mely az
alapvető Java komponenseket specifikálja (típusok, osztályok, I/O,
hálózatkezelés), és erre pedig a MIDP (Mobile Information Device
Profile), mely a magasszintű API-kat, felhasználói interfész, életciklus
és esemény kezelést tartalmazza.

Fejlesztéshez szükségünk van egy J2SE SDK-ra, illetve a [J2ME Wireless
Toolkit](http://java.sun.com/products/j2mewtoolkit/index.html)-re, mely
egy grafikus fejlesztő környezet. Persze ez utóbbi nélkül is elkezdhető
a fejlesztés, hiszen a Java fordítónak ha a J2ME osztálykönyvtárat adjuk
meg (-bootclasspath), akkor parancssorból is fordíthatóak a MIDlet-ek,
melyek maguk az alkalmazások. Illetve a legtöbb fejlesztőkörnyezetnek is
van illesztése mobil környezethez.

Aki többre kíváncsi, az nézze meg Bilicki Vilmos Fejlett Programozási
Technológiák 2 (Szegedi Tudományegyetem) tantárgyhoz készült
[prezentációit](http://www.cab.u-szeged.hu/~bilickiv/fpt_2003_1/index.html),
melyek kimerítően tárgyalják a J2ME technológiákat.

Csak hogy lássuk, mit lehet mobil eszközökön véghezvinni, érdemes
megnézni a [Mascot Capsulate Engine Micro3D Edition]() keretrendszert,
mely 3D játékok (!!!) fejlesztéséhez nyújt segítséget. Az oldalon egy
Java applet is megtalálható a példák között, mely prezentálja az engine
képességeit. Ez az alapja az első Európában is terjesztett mobilos 3D
játékoknak is, melyekhez a Vodafone live! szolgáltatás kereteiben lehet
hozzájutni. Érződik, hogy nagy hangsúlyt fektetnek a játékokra, hiszen a
MIDP 2.0-ba bekerült egy új API, Game API néven, mely layereket,
sprite-okat tud kezelni, így egy akciójátékot hamar össze lehet dobni.

![Java technológiák](/artifacts/posts/2003-04-29-mobil-java/java-technologies.jpg)
