---
layout: post
title: JAXB szálbiztosság
date: '2011-06-30T12:01:00.000-07:00'
author: István Viczián
tags:
- jaxb
- java
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Többször láttam már olyan kódot, ahol a programozó, ahhoz, hogy
erőforrást takarítson meg, bizonyos objektumokat statikus változóba
tárolt, így elegendő egyszer példányosítani, nem kell minden
metódushívás alkalmával.

A probléma ezzel az, hogyha az adott kódrészlet több szálon van hívva (,
pl. servlet), és az osztály nem szálbiztos, rejtélyes hibajelenségeknek
lehetünk tanúi. A kivétel (, általában NullPointerException, ritkán jön,
nagy terhelés esetén). Ez azért lehet, mert az egyik szál állítja az
objektum belső állapotát, bizonyos pontokban az objektum inkonzisztens
állapotban lehet, és a következő szál ha ekkor talál rá, általában hiba
keletkezik.

A hibát reprodukálni viszonylag egyszerűen lehet egy automatával végzett
terheléses teszteléssel.

Sajnos láttam már DateFormat-ot, és JAXB Marshaller-t is így használni.
Mivel azonban az említett osztályok nem szálbiztosak, ez a megoldás
hibás, és amennyiben a DateFormat-ot és JAXB Marshaller-t használni
akarjuk, használjunk belőlük új példányt. (El kell hinni, hogy nagy
sebességnyereségünk amúgy sem lenne.)

Jó lenne, ha ennek jelölésére az API-ban kiemelt hely lenne biztosítva,
ugyanis én most a Marshaller/Unmarshaller dokumentációjában elsőre nem
találom. A másik, amiben sosem vagyok biztos, hogy egy metódus zárja-e a
Stream-et, Reader-t, Writer-t, vagy sem. Erre is jó lenne szabványos
jelölésmód.
