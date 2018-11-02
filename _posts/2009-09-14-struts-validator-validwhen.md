---
layout: post
title: Struts Validator validwhen
date: '2009-09-14T13:10:00.000-07:00'
author: István Viczián
tags:
- struts
- java
modified_time: '2018-06-09T10:00:00.000-08:00'
---

A Struts Validator használatát [ezen
cikk](http://struts.apache.org/1.3.10/faqs/validator.html) írja le. A
validációkat egy külön XML-ben kell megadni (most láttam annotáció alapú
framework-öt is, az nem annyira jön be), lehetőség van egyszerű
validator-ok (kötelezőség, minimum, maximum hossz, stb.), bonyolultabb
validator-ok (pl. validwhen, mely mezők közötti összefüggést is tud
kezelni), és saját fejlesztésű validator-okat is. A validwhen-nél meg
lehet adni egy kifejezést, pl.:

    ((heightInInches >= 60) or (*this* == null))

Sajnos nagyon egyszerű, egyrészt többször megszívom, de nem
tetszőlegesen tehetjük a zárójeleket, hanem csak ahogy ő elvárja (tehát
nem opcionálisak!), valamint függvények sincsenek benne.

Akkor már inkább a Spring-nél használható [Valang
([*Va*]{.emphasis}-lidation
[*Lang*]{.emphasis}-uage)](https://springmodules.dev.java.net/docs/reference/0.5/html/validation.html).
