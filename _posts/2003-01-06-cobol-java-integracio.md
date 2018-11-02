---
layout: post
title: Cobol és Java integráció 
date: 2003-01-06T08:00:00.000+01:00
author: Viczián István
tags:
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Mostanában kénytelen vagyok Cobollal foglalkozni, és érdekességképpen
megnéztem, hogy hogyan lehet összekapcsolni Java programokkal. A válasz
meglepő volt, hiszen a Cobol mégsem olyan old-school nyelv, mint ahogy
képzeltem, a Java-val való együttműködés könnyen megoldható.

Nem kell a Java Native Interface (JNI) rejtelmebe elmerülnünk ahhoz,
hogy egy szép kevert alkalmazást írjunk. És spec. a [Micro Focus Net
Express 3.1](http://www.microfocus.com/products/netexpress/)-et néztem,
ahol közvetlenül hívhatunk Javaból Cobolt, és fordítva, a Cobol
adatstruktórák is nagyon egyszerűen átvihetők. Vicces, hogy létezik egy
Net Express Enterprise JavaBean (EJB) wrapping, mely becsomagolja a
Cobol programot egy JavaBeanbe úgy, hogy standard alkalmazásszerveren
fusson. A Cobol Portalon erről is egy elég jó
[cikk](http://www.cobolportal.com/files/Downloads/javacobol1.pdf) van,
Cobol funoknak és nosztalgiázóknak kötelező.

Meglepődtem, hogy a Cobol, hogy lépést tart a korral, lehet webes
alkalmazásokat írni vele, van objektumorientált verziója, van hozzá web
és alkalmazás szerver, lehet web szolgáltatásokat írni és hívni, együtt
tud működni Java és .NET platformmal.

Ebben a Prog.Hu [cikkben](http://www.prog.hu/news.php?qnid=1037)
olvashattok arról, hogy mostanában milyen elvárások vannak a
programozókkal szemben az álláshirdetésekben. Meglepő eredmények is
vannak benne, de látható, hogy az aránylag fiatal Java és az aránylag
öreg Cobol is elég jól tartja magát.
