---
layout: post
title: Jogosultságkezelés
date: 2003-03-06T08:00:00.000+01:00
author: Viczián István
tags:
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Hivatalosan is kihirdették, hogy meg lesz tartva a BME 3. Nemzetközi
24-órás Programozói Versenye, így már lehet jelentkezni a [hivatalos
honlapján](http://www.challenge24.org). Először egy elektronikus
előválogató lesz túl sok csapat esetén (&gt;40), aztán jön a kihívás
május 16-18 között. Én ott leszek. :)

Nagyon nagy keletje van a Sun által fejlesztett Jxta csomagnak, mely
peer-to-peer alkalmazások fejlesztését könnyíti meg, bizonyítja ezt,
hogy túl van az egymilliomodik letöltésen.

Aki már próbált olyan szoftvert konfigurálni, ami a felhasználókhoz
jogosultságokat rendel, azokat csoportba osztja, stb., tudja, hogy ahány
szoftver (operációs rendszer), annyi megvalósítás és tudjuk, hogy ezen a
téren a webes szolgáltatások sincsenek eleresztve. Úgy tűnik, erre mások
is rájöttek, és a problémát az ilyen kompatibilitási problémáknál jól
jövő XML formátumot lovagolták meg, és dolgoztak ki egy formátumot,
XACML (eXtensible Access Control Markup Language) néven. Hogy ez el is
terjedjen, az OASIS (Organization for the Advancement of Structured
Information Standards ) konzorcium nyílt szabványnak kiáltotta ki. Tehát
az XACML egy olyan kiterjeszthető nyelv, mellyel XML formátumban tudjuk
a felhasználók erőforrásokhoz való hozzáférésének karbantartását
szabványos formában leírni. Természetesen már található egy olyan
könyvtár Java-hoz is, ami képes ezt a formátumot olvasni, és megfelelően
értelmezni, így nem nekünk kell parser-t írni, csupán elég ezt az API-t
megismerni, és használni. Ezt az implementációt a Sun készítette
természtesen Java nyelven, további információk a project
[honlapján](http://sunxacml.sourceforge.net).
