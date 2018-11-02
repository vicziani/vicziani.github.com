---
layout: post
title: Hírek a JavaOne óta
date: 2003-07-01T08:00:00.000+01:00
author: Viczián István
tags:
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Azon neves alkalomból, hogy
[megjelent](http://www.prog.hu/news.php?qnid=1617) és
[letölthető](http://java.sun.com/j2se/1.4.2/download.html) a Java 2 SDK
1.4.2-es verziója, muszáj írnom egy kicsit a JavaONE konferencia óta
történt dolgokról, hiszen nem állt meg az élet azóta sem.

![Object Management Group](/artifacts/posts/2003-07-01-hirek-a-javaone-ota/omg-home.gif)

Az új verzió újdonságairól már írtam régebben, annyit érdemes még
megjegyezni, hogy letölthető egy olyan verzió is, mely magában foglalja
a NetBeans IDE 3.5 ingyenes integrált fejlesztőkörnyezetet is. A Java
appletek evvel a verzióval gyorsabban indulnak, és ez Intel 64 Itanium
processzoron is működik a JIT fordító. Egyik leglatvanyosabb bugfix a
sokkal gyorsabb JFileChooser. Ezen kívül szerver oldali optimalizációhoz
két új szemétgyűjtő algoritmus is bekerült a JVM-be, melyek a következő
kapcsolókkal állíthatóak be: concurrent collector
`-XX:+UseConcMarkSweepGC`, parallel collector `-XX:+UseParallelGC`

A Sun és Microsoft között több mint egy éve húzódó per is újabb
[stációhoz](http://www.prog.hu/news.php?qnid=1615) érkezett, ezúttal a
Microsoftnak kedvezve azzal, hogy mégsem kell operációs rendszereibe
beépítenie a Java futtató környezetet.

Azért nem kell megijednünk, hogy elnyomják szegény Java nyelvet, hiszen
a JavaOne-on a HP és a Dell is bejelentette, hogy minden Linux operációs
rendszerrel felszerelt asztali számítógépüket és laptopukat
feltelepített Java platformmal szállítanak.

Emellett az Intel és a Sun
[együttműködik](http://www.terminal.hu/newsread.php?id=11203206032916),
hogy az Intel XScale processzorokra Java alapú, minőségi alkalmazásokat
fejlesszenek. Ennek keretében a CLDC Hotspot implementációját
optimalizálja ezen processzorokra, majd a gyártók rendelkezésére
bocsájtja azt.

Egy kicsit offtopic, de remek
[cikk](http://www.hwsw.hu/oldal.php3?cikkid=826&oldal=1) olvasható a
HWSW.hu oldalain az Object Management Group-ról (OMG), és június 12-én
tartott OMG napok budapesti rendezvényről. Elöljáróban annyit, hogy az
[OMG](http://www.omg.org/) egy non-profit nemzetközi szervezet, melynek
tagjai cégek és magánszemélyek, egy-egy előírás elfogadása szavazással
történik. Feladata elosztott és objektumorientált vállalati
alkalmazásokkal foglalkozó előírások készítése és fejlesztése. Az OMG
legjelentősebb specifikációi a következők: MOF (Meta Object Facility),
UML (Unified Modeling Language), CWM (Common Warehouse Model), XMI (XML
Metadata Interchange) és a CORBA (Common Object Request Broker
Architecture).
