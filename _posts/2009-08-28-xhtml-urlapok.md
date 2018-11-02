---
layout: post
title: XHTML űrlapok
date: '2009-08-28T07:32:00.000-07:00'
author: István Viczián
tags:
- html
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Bár az előző post-ból kiderül, hogy a form-ok esetén jobb, ha a címke a
beviteli mező fölött van, érdekes kérdés, hogy hogyan valósítsuk meg azt
a klasszikus megjelenítést, hogy a címkék a beviteli mező mellett
találhatóak, és a mezők függőlegesen egy vonalba kerüljenek.

Az első evidens válasz, hogy használjunk táblázatot. Persze a modern
világban ezt nem illik, próbáljuk CSS-sel. Az összes neten talált
megoldásnál a CSS-be bele volt égetve, hogy a címke hossza mekkora
(általában pixelben), és így oldották meg a beviteli mezők függőlegesen
egymáshoz igazítását. Ez abban az esetben, ha bonyolult alkalmazásunk
van, több formmal nem annyira járható út, minden form-hoz külön pixelben
megadni, hogy mekkora legyen. Más megoldást nem találtam, így maradok a
táblázatnál.
