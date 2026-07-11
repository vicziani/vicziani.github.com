---
layout: post
title: JExcelAPI dátum formátum
date: '2010-08-13'
author: Viczián István
tags:
- Java
- Egyéb nyelvek

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
