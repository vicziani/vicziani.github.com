---
layout: post
title: Method Chaining
date: '2009-08-31T10:31:00.000-07:00'
author: István Viczián
tags:
- java se
- java
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Method Chaining, vagy a Spring dokumentáció szerint “fluid” style az a
stílus, mikor az objektumot módosító metódus visszatérési értéke maga az
objektum, így a metódushívásokat egy utasításban, sorba lehet fűzni. Jó
példa erre a StringBuilder, melynek append, delete, insert, reverse,
stb. metódusai is StringBuilder objektumot adnak vissza, így egyszerűen
leírható:

System.out.println(new
StringBuilder(“Classic”).append(“World”).delete(0, 7).insert(0,
“Hello”).reverse().toString());

Volt egy olyan javaslat is, hogy a Java következő verziójában a void
visszatérésű metódusok automatikusan adják vissza a példányt, melyen
hívva lettek, így a method chaining még könnyebben használható.

Egy darabig fun, de mikor egy utasítás 20-30 soros, akkor kezd
átláthatatlanná válni. Védekezni ellene sortörésekkel lehet.
