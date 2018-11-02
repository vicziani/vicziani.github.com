---
layout: post
title: Oracle distinct vagy union b/clob esetén
date: '2010-09-14T09:45:00.000-07:00'
author: István Viczián
tags:
- oracle
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Abban akár distinct, akár union műveletet akarunk használni úgy, hogy az
eredményhalmazban b/clob van, a következő hibaüzenetet kapjuk:

    inconsistent datatypes: expected - got CLOB

Ilyenkor valami kerülőmegoldást kell alkalmaznunk. Persze karakterré
konvertálhatjuk a clob-ot, pl. a to\_char függvénnyel, de ekkor az első
4000 karakterét fogja venni. Jobb megoldás, ha a distinct műveletet egy
belső select-ben végezzük el, és ennek eredménye alapján a külső
select-ben lekérdezzük az összes mezőt, a b/clob-ot is beleértve.
