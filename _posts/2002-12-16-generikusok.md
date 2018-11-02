---
layout: post
title: Generikusok
date: 2002-12-16T08:00:00.000+01:00
author: Viczián István
tags:
modified_time: '2018-06-09T10:00:00.000-08:00'
---

A Sun-nál megjelent egy cikk a Java generikusokról, más néven
paraméterezett típusokról, mely a Java 1.5 része lesz, melyet már
mindenki türelmetlenül vár. A
[cikk](http://java.sun.com/developer/technicalArticles/releases/generics/)
röviden prezentálja, hogy mire is jó ez az eszköz például listák
esetében, ahol jelenleg nem lehet megadni, hogy milyen típusok az
elemei, így azokat keverni lehet, gyönyörű, futásidejű
`ClassCastException`-öket generálva ezzel.

A generikusok segítenek, hogy ezeket a hibákat már fordítási időben
kiszűrjük, és a kód is átláthatóbb, tisztább lesz. Nem csak a beépített
generikusokat használhatjuk, hanem saját generikus interfészeket,
osztályokat, és metódusokat is írhatunk. Bővebb információt a Java
Specification Request (JSR) [14.
bejegyzésében](http://jcp.org/en/jsr/detail?id=14) találhatunk.

Ennek kipróbálásához nem muszáj várni az 1.5-ös JDK-ra, hanem ki lehet
próbálni a Java fordító [prototípus
megvalósításával](http://developer.java.sun.com/servlet/SessionServlet?url=/developer/earlyAccess/adding_generics/index.html)
is.
