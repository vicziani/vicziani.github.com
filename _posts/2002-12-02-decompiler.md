---
layout: post
title: Decompiler
date: 2002-12-02
author: Viczián István
tags:

---

Csalódtam kedvenc decompiler-emben, méghozzá a
[JAD](http://kpdus.tripod.com/jad.html)-ban. Gyors, egyetlen EXE, és
nagyon könnyen használható. Megpróbáltam neki megadni a következő
kódrészletet, de teljesen kiakadt rá, érdekes kódot alkotott.


    public class Test {

    public void test(Object param) {
    if (param.getClass() == Test.class) {

    }
    }

    }

Valószínűleg a `Test.class` zavarta meg, ahhoz próbált érdekes dolgokat
kreálni. Mind a v1.5.7d, mind a Jad v1.5.8e2 begőzőlt, az utóbbi nem
annyira.

Sürgős lévén kerestem is egy másikat, egy
[JODE](http://jode.sourceforge.net/) nevűt találtam, ami szabad
forráskódú, Java nyelven írt, és egy optimalizert is tartalmaz, plusz
grafikus interfészt. Minden gond nélkül visszafordította. Egy világ
omlott össze bennem.
