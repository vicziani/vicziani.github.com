---
layout: post
title: Változónevek
date: '2009-09-01T00:29:00.000-07:00'
author: István Viczián
tags:
- konvenciók
- java
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Amennyiben követjük a Java ajánlást, és camel case metódusneveket
alkalmazunk, többször belefuthatunk abba a problémába, hogy most egy
szót külön vagy egybe kell-e írni. Nézzünk egy példát, pl.
dokumentumazonosító. Kellően hosszú, hajlamosak lennénk az A betűt
naggyal írni. De a [A magyar helyesírás
szabályai](http://mek.niif.hu/01500/01547/) szerint ez birtokos jelzős
kapcsolat, egybe kell írni, így a nagybetű használata nem javasolt.
Kötőjelezni hat szótag felett csak a többszörös összetételeknél kell
(kettőnél több szóból alakult), pl. dokumentumfilm-bemutató. A
szabályzat javasolja, hogy érdemes lehet két szóvá alakítani, pl.
dokumentum azonosítója, és ekkor a könnyebb olvashatóság érdekében
használhatjuk a camel case-t.
