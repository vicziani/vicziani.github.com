---
layout: post
title: Borland JBuilder
date: 2002-11-24T08:00:00.000+01:00
author: Viczián István
tags:
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Eseménytelenül telik a hétvége, csak a Borland JBuilder 5 szívat egy
kicsit. Azt mondja, mikor végre futtatni szeretném végre a kész
programot, hogy


    java.io.IOException: CreateProcess: C:\j2sdk1.4.0\lib\bin\javaw -classpath \
    "rizsa" boo.Main error=3

Erre én akadok is ki, elő a Google, a levelező listákban csak egy
bejegyzés, szívdobogva klikkelek, igen, nem. Német. No, elő a rég
elhalványult német tudásomat, "Coole Namen für Projekte, Pakete,
Klassen...". Kiderül, hogy a kedves, hiába a D:\\-re teszem fel, ő mégis
egy C:\\-beli JDK-ra hivatkozik. Ami persze látszik is már az elérési
úton. Nosza Tools\\Configure JDKs menü. Megy.

Aki tesztelni akarja a Java tudását, az például a Sunnál is megteheti,
több [kvíz](http://java.sun.com/developer/Quizzes/index-alpha.html) is
elérhető náluk. Akinek ez már megy, az beszerezheti a [Sun Certified
Programmer](http://suned.sun.com/US/certification/java/java_progj2se.html)
minősítést is.
