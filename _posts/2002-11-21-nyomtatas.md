---
layout: post
title: Nyomtatás
date: 2002-11-21T08:00:00.000+01:00
author: Viczián István
tags:
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Előbb utóbb mindenki beleesik a csapdába, és Java nyelven nyomtatnia
kell. Ekkor kezdhet saját framework-öt írni, ha speciális igényei
vannak. Ilyenkor jön a nagyszerű [Java Printing
API](http://java.sun.com/products/java-media/2D/forDevelopers/sdk12print.html)
minimális számú szolgáltatással. Persze vannak varázsszavak is, amiket
mindig be lehet dobni ennél a témánál. Itt is van a
[FOP](http://xml.apache.org/fop/index.html), mely igen robosztus, XML-t
és [XSL-FO](http://www.w3.org/TR/2001/REC-xsl-20011015/) formátumot
használ bemenetként, és PDF, PS, XML, és sok egyéb más formátumot
kimenetként. Erre épül a [Cocoon](http://cocoon.apache.org/2.0/)
publikáló rendszer is, mely ugyanezt valósítja meg szervlet
környezetben, és jó kis magyar
[doksi](http://javasite.bme.hu/dokument/cocoon/cocoon.html) van fenn
róla a [JFT](http://javasite.bme.hu)-n Paller Gábor billentyűzetéből.
Csak riportok készítéséhez jöhet jól a [Jasper
Reports](http://jasperreports.sourceforge.net), és a
[JFreeReport](http://www.object-refinery.com/jfreereport/). Attól
függetlenül próbáljátok meg elkerülni a nyomtatást.
