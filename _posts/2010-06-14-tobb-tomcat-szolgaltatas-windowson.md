---
layout: post
title: Tomcat Windows szolgáltatásként több példányban
date: '2010-06-14T11:49:00.000-07:00'
author: István Viczián
tags:
- java
- tomcat
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Mai nap ugyanarra a gépre két web alkalmazást kellett feltelepítenem,
mindkettő Tomcat-ben fut, de egymástól függetlennek kellett lenniük,
függetlenül indítható/leállítható (teszt és éles környezet).

A Tomcat-et le lehet tölteni exe-ként is, és ekkor automatikusan
Windows-on service-ként telepíteni is tudja magát, de mivel most
személyre akarjuk szabni, válasszuk a 32-bit Windows zip letölthető
állományt.

Ebben szerepel a bin könyvtárban egy service.bat, mely a tomcat6w.exe-t
hívja, mely felelős a szolgáltatásként való kezelésért, csak a
service.bat sokkal egyszerűbben paraméterezhető.

A Tomcat lehetőséget biztosít arra, hogy ugyanazon bináris fusson, és
csak az eltérő elemeket tegyük ki külön könyvtárba. Ahova a Tomcat-et
kicsomagoljuk, az a CATALINA\_HOME, és a különböző példányok
könyvtáraira a CATALINA\_BASE-sel hivatkozunk. A CATALINA\_BASE alá
érdemes a teljes conf könyvtárat átmásolni, és a server.xml-ben átírni a
portokat (shutdown, http, https, ajp), hogy ne legyen portütközés. A
webapps könyvtár alá tegyük be a web alkalmazásunkat.

A szolgáltatáshoz való telepítéshez pedig használjuk a következő
parancsokat:

    set JAVA_HOME=C:\kaffe\jdk1.6.0_17
    set CATALINA_HOME=D:\kaffe\apache-tomcat-6.0.26
    set CATALINA_BASE=D:\kaffe\test

    D:\download\tomcat\apache-tomcat-6.0.26\bin\service.bat install test

Ekkor elindítani a net start test paranccsal tudjuk, a szolgáltatások
között megjelenik Apache Tomcat test néven. Ahhoz, hogy a másik példányt
is szolgáltatásként telepíthessük, adjuk ki ugyanezt a parancsot, csak a
test szót cseréljük ki pl. prod-ra.

Még egy hasznos jótanács, hogy Windows-on kilistázni a használt portokat
a [CurrPorts](http://www.nirsoft.net/utils/cports.html "CurrPorts")
alkalmazással lehet.

A szolgáltatást eltávolítani a service.bat uninstall test paranccsal
lehet.

<http://tomcat.apache.org/tomcat-6.0-doc/windows-service-howto.html>
