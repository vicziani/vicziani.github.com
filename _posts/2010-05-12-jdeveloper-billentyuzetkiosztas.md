---
layout: post
title: JDeveloper billentyűzetkiosztás
date: '2010-05-12'
author: István Viczián
tags:
- jdeveloper
- java

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
