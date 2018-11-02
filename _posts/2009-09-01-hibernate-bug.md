---
layout: post
title: Hibernate bug
date: '2009-09-01T01:02:00.000-07:00'
author: István Viczián
tags:
- jpa
- hibernate
- java
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Amennyiben van egy lekérdező képernyőnk, ahol meg lehet adni szűrési
feltételeket, a lekérdezést dinamikusan összeállítva 2\^n lehetséges
lekérdezés állhat elő, a szűrési mezők kitöltésének megfelelően (ha a
feltételt csak akkor konkatenáljuk hozzá, ha ki van töltve). A [Csak a
tesztemen
keresztül](http://csakatesztemenkeresztul.blog.hu/2009/08/12/sql_ben_de_hogyan)
blog bejegyzése szerint ezt megoldhatjuk egy lekérdezéssel is, ahol
rövidzár kiértékelést használunk. Azaz minden mezőnél a lekérdezésbe
beleírjuk a következő feltételt:

(:param IS NULL OR alias.someField = :param)

A probléma ebben az, hogy Hibernate 3.3.2 és Oracle adatbázis esetén van
egy
[bug](http://opensource.atlassian.com/projects/hibernate/browse/HHH-2851),
amely miatt null érték esetén elszáll a következő hibával:

“ORA-00932: inconsistent datatypes: expected NUMBER got BINARY”

Megoldás, hogy null esetén “” String-et adunk át.
