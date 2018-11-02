---
layout: post
title: Oracle licence
date: '2009-10-03T12:44:00.000-07:00'
author: István Viczián
tags:
- oracle
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Itt egy [kiváló oldal](http://www.orafaq.com/wiki/Oracle_Licensing) az
Oracle licenceléséről. A Oracle Enterprise Edition két féle lehet. Lehet
Named User Plus Licensing, ahol felhasználónként megy, de van egy
minimum felhasználószám. Amennyiben nem lehet megszámolni a
felhasználókat (pl. internetes alkalmazás esetén), processzor alapú
licencelést kell választani. Nem lehet trükközni azzal, hogy az
alkalmazás egy proxy felhasználóval megy be úgyis. Kb. 50 felett érdemes
ebben gondolkozni, ha mégis megszámolható a felhasználószám. A
processzornál viszont figyelembe is kell venni a magok számát is. Van
egy jó kis
[táblázat](http://www.oracle.com/corporate/contracts/library/processor-core-factor-table.pdf),
erről az
[oldalról](http://www.oracle.com/corporate/contracts/olsa_main.html),
ami mutat minden processzor mag típushoz egy szorzót. E szerint pl.
Intel Xeon Series 74XX, Series 55XX or earlier Multicore chipek
magjainak szorzója 0.5, azaz egy 4 processzor tartalmazó gépbe, melynél
minden processzor kétmagos, 4 processzor licencet kell vásárolni.

Vigyázzunk, Oracle Standard Edition esetén processzorra kell számolni és
nem magra.
