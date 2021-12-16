---
layout: post
title: Spring MVC success message
date: '2009-09-18T05:57:00.000-07:00'
author: István Viczián
tags:
- spring mvc
- java
modified_time: '2018-06-09T10:00:00.000-08:00'
---

A Spring MVC nem ismeri az ún. success message fogalmát. Ez azt jelenti,
hogy pl. elpost-olsz egy form-ot, és nem hiba jön, hanem sikeres a
művelet. Ilyenkor nem csinálsz neki külön oldalt, hanem egy már létező
oldalon szeretnéd kiírni, hogy a művelet sikerült. Persze használni kell
a GET after POST mintát, és az új képernyőt már GET-tel kell lekérnie a
böngészőnek. Tehát közben egy redirect van.

A Struts ezt remekül megoldja, van külön üzenet, és van külön hiba, és a
session-be is lehet tenni, hiszen redirect-nél csak ez marad meg.

Spring MVC esetében old meg magad valahogy.
