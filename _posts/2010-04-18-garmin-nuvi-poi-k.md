---
layout: post
title: Garmin Nüvi POI-k
date: '2010-04-18T12:58:00.000-07:00'
author: István Viczián
tags:
- geocaching
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Kb. negyedévente feltöltöm a Garmin Nüvi 250 eszközömre a
[Geocaching.Hu](http://geocaching.hu/) összes pontját, teljes leírással,
valamint a [Speedcams](http://www.speedcams.hu/) összes pontját. Ennyi
idő alatt pont el is felejtem, hogyan kell, így leírom, hogy többet ne
kelljen kikisérleteznem.

A Geocaching oldalról le kell tölteni a ládákat, de ahhoz, hogy a
ládaleírások is benne legyenek, át kell írni a Leírás sablon mezőt a
következőképpen:

    <field name="nev"  length="24"/> (<field name="tipus"/>)
    Elhelyezés dátuma: <field name="elrejtes" format="Y.m.d H:i"/>
    <field name="leiras"/>

Ekkor válasszuk a .gpx formátumot. A letöltött XML állomány nem biztos,
hogy well-formed XML, ezt ellenőrizzük valamilyen eszközzel (pl.
[XMLStarlet](http://xmlstar.sourceforge.net/)), és javítsuk.

Ha megvan, nevezzük el valamilyen néven, ez fog megjelenni a Nüvi-n.
Legyen ez pl. cachesYYYYMMDD.gpx.

Ezután kell elindítani a Garmin POI Loader programját, melynél a Mentési
opcióknál az Egyéni mappát kell kiválasztani. Adjuk meg a forrás
könyvtárat és a cél könyvtárat. A generált poi.gpi állományt nevezzük át
nekünk tetszőnek, és töltsük fel a Nüvi Garmin\\Poi könyvtárába.

Ekkor a Nüvi-n a Hova/Extrák menüpontban kiválaszthatjuk az összes
Geocaching pontot, és a “Több info” gombra kattintva olvashatjuk a
teljes ládaleírást. 

A Speedcams oldalról letöltött txt állományt nevezzük át csv állománnyá,
majd a POI Loader-rel csináljuk meg ugyanazt, mint előbb a gpx
állománnyal.

Amire vigyáznunk kell:

-   Ha a POI Loader nem eszi meg a gpx állományt, valószínűleg nem
    well-formed XML
-   A gpx és csv állomány neve fog a Nüvi-n megjelenni, a gpi állomány
    nevétől függetlenül.

