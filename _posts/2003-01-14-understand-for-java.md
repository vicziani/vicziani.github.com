---
layout: post
title: Understand for Java
date: 2003-01-14T08:00:00.000+01:00
author: Viczián István
tags:
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Éppen egy [Understand for Java](http://www.scitools.com/uj.html)
eszközzel szenvedek, ami egy reverese enginieering, dokumentációs, kódot
elemző és mérő alkalmazás a Scientific Toolworks, Inc.-től. Többek
szerint is a neve egy Java Tutorial doksira emlékeztet.

Nagyon aranyos kis eszköz, un. egyedeket definiál és kapcsolatokat,
amiket a forráskód analizálásával térképez fel, és tárolja el saját
(sajnos nem külső) adatbázisába. Az egyedek a fájlok, interfászek,
osztályok, konstruktorok, metódusok, paraméterek, változók, a
kapcsolatok a hívási, öröklődési kapcsolatok. A kódot syntax
highlight-tal mutatja, a referenciák között grafikusan mászkálhatunk egy
gráfban (fában), és nagyszerű text és html riportokat készíthetünk.
Aranyosak a mérőszámok, melyek bizonyos minőségi mutatók, általában
hányadosok. Ilyen pl. a megjegyzések és a tényleges kódsorok aránya, de
van belőle egy csomó. Kikereshetjük az olyan osztályokat, metódusokat,
változókat, melyekre nincs referencia. A program bizonyos funkciói
parancssorból is elérhetőek, és C, illetve Perl nyelvű API-val
rendelkezik, így saját dokumentációs rendszerünkbe is könnyen
beilleszthetjük.

Az eszköz létezik C, C++, Fortran és Ada nyelvekre is.

Aki hasonló toolt akar, de ingyeneset, annak érdemes megnéznie a GNU-s
[Source Navigator](http://sourcenav.sourceforge.net/) nevezetű
alkalmazást, ami a Cygnus tulajdonában van, amit a Red Hat be is
olvasztott, jól. A termék egy csomó nyelvet ismer, sajna annyira nem
felhasználó barát, mint az előző.

Egy másik kereskedelmi termék a [CAST Application Mining
Suite](http://www.castsoftware.com/Products/AMS/Index.html), ami
egyrészt bazi drága, másrészt a supportjuk nem hajlandó nekem trial
kulcsot küldeni, amiért ki sem tudom próbálni. Annyi biztos, hogy több
adatbáziskezelővel is együttműködik, egy rakat táblát generál, majd kéri
a kulcsot... Nem szeretem a "kérek a supporttól kulcsot, és ha ráér ad"
taktikát.
