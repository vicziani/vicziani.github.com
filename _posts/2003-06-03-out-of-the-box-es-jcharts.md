---
layout: post
title: Out-of-the-Box és jCharts
date: 2003-06-03T08:00:00.000+01:00
author: Viczián István
tags:
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Találtam egy érdekes terméket az [EJB Solutions
honlapján](http://www.ejbsolutions.com/), ami Out-of-the-Box 2.0 névre
hallgat. Nem másról van szó, mint több mint 100 Open Source Project
becsomagolásáról, egységes telepítő felület hozzáadásáról, illetve
automatikus konfigurálásáról. Természetesen a csomag Java fejlesztőknek
szól, és olyan projectek kerültek bele, mint a JBoss, Tomcat, Struts,
Eclipse, Hibernate, AspectJ, MySQL, PostgreSQL, CVS, stb. Ezen kívül
tartalmaz Ant alapú minta alkalmazásokat is. Támogatja a Windows és
Linux platformot egyaránt. A telepítő cucca nagyon designos,
választhatunk, hogy mely komponenseket telepítsük fel, mi a project
honlapja, licensze, használt portok, rövid leírása. A projecteket
kategóriákba sorolja. Leírja az előfeltételeket is (milyen szoftvereknek
kell már fenn lenniük), illetve a tőle függő szoftvereket is. Sajnos nem
ingyenes, 70 dollár körül mozog. Viszont van egy ingyenes verziója is
(Community Edition), mely csak 25 projectet tartalmaz, illetve egy minta
projectet is.

Egy érdekes project még a [jCharts](http://jcharts.sourceforge.net/)
nevű ingyenes grafikongeneráló könyvtár. Teljesen Java nyelven íródott,
támogatja a szervleteket és a JSP-t is. Több grafikon típust is támogat,
úgymint pie, axis, area, bar, line, point, stock, combo. Tetszőlegesen
konfigurálható a jelmagyarázat, háttér. átlátszóság, kliens oldali image
map. Az 1.4-es Java futtatókörnyezet már lehetővé teszi X Server (és
virtual frame buffer) nélkül is képek generálását, ekkor a java-t a
következő paraméterrel kell indítani, `-Djava.awt.headless=true`, vagy a
kódban kell elhelyeni a következő sort:


    System.setProperty("java.awt.headless","true");

Régebbi környezeteknél virtual frame buffer ajánlott.
