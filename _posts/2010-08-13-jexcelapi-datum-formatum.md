---
layout: post
title: JExcelAPI dátum formátum
date: '2010-08-13T06:17:00.000-07:00'
author: István Viczián
tags:
- jexcelapi
- i18n
- java
modified_time: '2018-06-09T10:00:00.000-08:00'
---

A [JExcelAPI](http://jexcelapi.sourceforge.net/) 2.6.11 egy dátum
formátumú mező értékét Linux-on 31/01/2010 formátumban adta vissza,
Windows-on 2010.01.31. formátumban. Az eltérések persze a nyelvi
beállításokban voltak.

Próbáltam, hogy a getWorkbook() metódusnak adtam át WorkbookSetting
paramétert. Annak van egy Locale attribútuma. Ezt, ha nem adunk meg
paramétert, a Locale.getDefault() alapján állítja be, amúgy a jxl.lang
és jxl.country rendszerparaméterek alapján. Azonban bárhogy is
állítottam ezt, nem vette figyelembe a fent említett mezőnél.

Azonban, ha globálisan állítottam át a nyelvi beállításokat, akkor
működött. Ehhez ezeket a paramétereket kell a JVM-nek átadni:

-Duser.language=hu -Duser.country=HU
