---
layout: post
title: Subversion revision number
date: '2010-09-30T15:52:00.000'
author: István Viczián
tags:
- subversion
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Ha azt akarjuk, hogy egy állományban a checkoutolt revision numberje
is jelenjen meg, ahhoz két dolgot kell tenni. Egyrészt az állományban
vegyük fel a `$Rev$` szöveget, majd állítsuk be az `svn:keywords`
property-t, melynek értéke legyen Rev. Ezt pl. megtehetjük
TortoiseSVN-nel is, az adott fájlon Properties menüpont, majd New..., és
ott kell felvenni. Itt egyrészt legördülőből kiválaszthatjuk az előre
definiáltakat (pl. `svn:keywords`), valamint egy kis súgót is kapunk
róluk, hogy miket lehet értékként beírni.
