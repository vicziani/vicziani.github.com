---
layout: post
title: Java Web Start
date: 2003-09-03T08:00:00.000+01:00
author: Viczián István
tags:
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Nos, egy hosszabb nyári szünet, és munkahely váltás után folytatódik,
újraindul a JTechLog. Remélem addig is olvastátok [Joe
blogját](http://blog.si.hu), ami naponta frissült, és jobbnál jobb
cikkeket ajánlott figyelmünkbe.

Mostanában a Web Start-tal kellett foglalkoznom, ami a J2SE JDK 1.4.2-es
verziójával a JDK része lett, és ő maga is ezt a verziószámot kapta. A
Java Web Start (JAWS) nem más, mint a [JSR
56](http://jcp.org/en/jsr/detail?id=056), azaz a Java Network Launching
Protocol & Application Programming Interface referencia implementációja.
A WebStart tulajdonképpen egy deploy környezet, mely jelentősen
egyszerűsíti Java alkalmazások telepítését kliens gépekre. Gyakorlatban
a felhasználó annyit érzékel ebből, hogy a böngészőben egy linkre
kattintva automatikusan települ a Java alkalmazás, majd elindul.
Természetesen a szoftver frissítéseket sem neki kell végeznie, azt a
környezet automatikusan megteszi. A háttérben eközben annyi [játszódik
le](http://java.sun.com/products/javawebstart/architecture.html), hogy a
link egy JNLP állományra mutat (alkalmazás leíró, ez tartalmazza a
telepítéshez szükséges adatokat, letöltendő JAR fájlokat és URL-jüket,
stb.), melyet a böngésző továbbad a Web Start-nak, ami értelmezve ezt
letölti az alkalmazást, és futtatja azt. A JAR fájlokat cache-eli, és
így következő alkalommal nem kell letölteni azt, csak ha változott (amit
a háttérben ellenőriz). Kliens oldalon ehhez csak a Java Web Start
telepítésére van szükség, szerver oldalon bármelyik web-szerver állhat,
lényeg, hogy definiáljuk benne a JNLP MIME típust.

Persze felmerül a kérdés, hogy több kliens esetén nem érné-e meg inkább
web-es alkalmazást fejleszteni, de a vastag klienseknek, és önálló
alkalmazásoknak is megvan a maguk
[létjogosultsága](http://java.sun.com/features/2001/09/webstart.html),
hiszen offline módon is üzemelnek, és sokkal robosztusabb felhasználói
felülettel rendelkezhetnek, futásuk nem függ a sávszélességtől.
Hátrányuk a lassabb kezdeti letöltés. A következő lehetőségeket
támogatja:

-   Több JRE egyidejű kezelése, az alkalmazásunkra megadhatjuk, hogy
    melyikkel kompatibilis. A hiányzó JRE-t automatikusan letölti.
-   Az alkalmazás egy sandbox-ban fut, így nem engedi elérni lokális
    erőforrásokat vagy a hálózatot, natív könyvtárakat betölteni, nem
    lehet új security manager-t betölteni, rendszertulajdonságokat
    elérni. Kommunikációt csak a gazdaszerverrel folytathat. Ahhoz, hogy
    ezek a korlátozások megszűnjenek, a JAR fájlokat alá kell írni,
    illetve a felhasználónak engedélyeznie kell. Persze
    alapszolgáltatásokat nyújt, mint egy URL megnyitását, hozzáférést a
    vágólaphoz, nyomtatóhoz, felhasználó által vezérelt fájlkezelés és
    egy cookie-khoz (itt muffin-nak hívják :) hasonló perzisztenciát,
    persze mind csak kontrollált környezetben.
-   Verziókezelés is inkrementális update.
-   Desktop integráció: a letöltött alkalmazást aztán a Desktop-ról,
    Start menüből (presze Windows esetén), a webről és a Web Start
    Application Manager-éből is indíthatjuk.

A Web Start a HTML protokollt használja, és a JDK 1.1 már nem támogatott
az eltérő biztonsági mechanizmus miatt. Egy alkalmazás Web Start-tal
való kezelhetőségének alkalmassá tételére nem kell mást csinálni, mint
egy JAR fájlba csomagolni azt, és aláírni, ha speciális műveleteket is
szeretne végezni. Ha csak ellenőrzött módba akar futni, akkor érdemes a
Service osztályokat használni, melynek API dokumentációja megtalálható a
Web Start dokumentációi között.
