---
layout: post
title: JAR verziója
date: '2011-02-18T14:48:00.000-08:00'
author: István Viczián
tags:
- maven
- java
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Amennyiben találunk egy JAR-t, és nem derül ki, hogy ez pontosan micsoda
(pl. azzal, hogy belenézünk a `META-INF/MANIFEST.MF` fájlba), vagy nem
tudjuk, hogy melyik Maven repository-ban szerepel, milyen Maven
koordinátákkal (groupId, artifactId, version), érdemes egy lenyomatot
készíteni, és rákeresni a lenyomat alapján valamilyen keresőben.

A [Jarvana](http://www.jarvana.com/jarvana/) webes szolgáltatás
megfelelő, mind MD5, mind SHA1 lenyomat alapján képes keresni. A
Sonatype publikus Nexusa csak SHA1 lenyomatra képes keresni, ugyanúgy
mint a Sonatype új szolgáltatása, a [Maven
Central](http://mavencentral.sonatype.com) mely kifejezetten keresésre
van kihegyezve. Ez utóbbi kettőnél nem nekünk kell kiszámoltatni az SHA1
lenyomatot, hanem egy állományt is kiválaszthatunk a fájlrendszerről.

Amennyiben mégis mi akarjuk kiszámoltatni, Windowson jól jöhet a
[SlavaSoft FSUM](http://www.slavasoft.com/fsum/) utility, Linuxon a
`md5sum` vagy az `sha1sum` parancs.
