---
layout: post
title: JDeveloper billentyűzetkiosztás
date: '2010-05-12T04:37:00.000-07:00'
author: István Viczián
tags:
- jdeveloper
- java
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Vastag klienses alkalmazás fejlesztésre az ingyenes, Oracle által
gyárott JDeveloper-t használjuk. Azonban magyar billentyűzet
kiosztásnál, ha speciális karaktereket akarok írni az Alt Gr + \[betű\]
billentyűkombinációval (pl. szögletes, kapcsos zárójel, kukac, stb.),
nem történik semmi, vagy valamilyen refactoring fotó ugrik elő. Itt kell
kikapcsolni:

Tools/Preferences/ShortCut Keys

Itt be kell írni a kereső mezőbe pl. hogy “Alt - N”, és a találatra
ráállva megnyomni a piros X (Remove) gombot. Sajnos elég sok
billentyűnél el kell ezt játszani.
