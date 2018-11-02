---
layout: post
title: 24 órás programozó és csapatverseny eredmény
date: 2003-05-21T08:00:00.000+01:00
author: Viczián István
tags:
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Megint egy kissé lemaradtam. Útközben volt egy [3. nemzetközi 24 órás
programozó és csapatverseny](http://www.challenge24.org), melyen én is
részt vettem két csapattársammal, Klampeczki (C++) Zsolttal és Erdei
(Java) Szabolccsal. Csapatunk neve KergeBirge volt, és sikerült a 3.
helyezést elérnünk, immár harmadszor. :) A honlapon a részletes
eredmények, képek, és a feladat is megtalálható, érdemes megtekinteni.
Zsolt közülünk C++ nyelven programozott, Szabolccsal ketten Javaban.

Természetesen JBuilderrel fejlesztettem, hiszen grafikus interfészt is
kellett fejleszteni, meg amúgy is kényelmesebb. No az előbbit még csak
most teszteltem le rendesen, de eléggé csalódtam. Szerencsére nem
generál bele metaadatokat, mint az IBM VisualAge For Java, és a
megjelenítése is gyorsabb, de abban az esetben, ha egy `JFrame`-mel
dolgozok, és rajta egy `JPanel`-lel, érdekes dolgok történnek. Két nézet
van, egyrészt ahol a frame tulajdonságait tudom szerkeszteni, illetve a
menüsort, másrészt a konkrét panelt. Nos ezek között a váltás elég
gyeszora, sajnos be kell zárni a fájlt, és újra betölteni. :(

Másik érdekes fejlemény akkor jött ki, mikor több transzparens GIF képet
szerettem volna betölteni, és egy nagy `Graphics`-ra rátenni, különböző
pozíciókra. A háttér létrehozása
`java.awt.Component.createImage(int width, int height)` metódussal
történt, a kis képek betöltése
`Image img = new ImageIcon(aFileName).getImage();` sorral. Abban az
esetben, ha abszolút hivatkozást adtam meg egy fájlra, és ciklusból azt
többször tettem rá, müködött. Ha abszolút hivatokzást adtam meg, és több
fájlt akartam használni, nem működött. Ezzel szórakoztam egy órát, majd
az összes fájlt bemásoltam a class fájlok közé, nem adtam meg elérési
útvonalat, és ment minden. Kell nekem egy versenyen egy ilyen bugba
beleakadni. Aki tudja, hogy ez miért van, írjon.

Kellemes tapasztalataim voltak viszont az először használt
[Piccolo](http://www.cs.umd.edu/hcil/jazz/)-val, amit a Marylandi
Egyetemen fejlesztenek, szabad forráskódú Zoomable User Interface (ZUI).
Tulajdonképpen egy grafikus keretrendszer felhasználói felületek
fejlesztésére, mely lehetővé teszi a zoomolást, több kamera használatát,
layereket, képeket, stb. A Piccolo a Jazz utódja, ez utóbbi fejlesztése
már abbamaradt, a fejlesztők ezen rendszer kifejlesztésekor szerzett
tapasztalatokat használják fel egy hasonló funkcionalitású, de
egyszerűbben használható rendszer megírására. A csomag természetesen
bőséges dokumentációt és példaprogramot tartalmaz.

Tulajdonképpen egy canvasról van szó, melyet a szokásos módon
illeszthetünk be alkalmazásunkba, és ezekre fa struktúrában különböző
objektumokat helyezhetünk el. Ezen objektumok lehetnek egyszerű
geometriai alakzatok (téglalap, sokszög), görbe, szöveg vagy akár kép
is. A megjelenített kép tetszőlegesen zoomolható és scrollozható. Ezek
eseméynkezelői testre szabhatóak. Ezen kívül az elhelyezett
objektumoknak is van külön eseménykezelője, melyet implementálhatunk, de
akár a beépítettet is használhatjuk, mely lehetővé teszi az objektumok
(akár csoportos) kijelölését, mozgatását, átméretezését, szerkesztését.
Nagy segítség, hogy klikkeléskor nem a panel koordinátáit adja vissza,
hanem a tényleges koordináta-rendszerre vissza transzformáltat.
Támogatja az objektumok áttetszőségét is.
