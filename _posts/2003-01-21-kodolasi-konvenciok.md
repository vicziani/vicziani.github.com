---
layout: post
title: Kódolási konvenciók
date: 2003-01-21T08:00:00.000+01:00
author: Viczián István
tags:
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Nagyon szeretem a szép, elegáns Java kódot, amit például bizonyos
könyvekben lehet találni (pl. az O'Reilly Java szervletek programozása
című könyvben).

Miért is van szükség szép Java kódra? Egyrészt egy komolyabb program
élettartamának 80%-a fenntartás. Rég írt kódra már alig emlékszik az
ember, arról már nem is beszélve, ha más kódját kell buherálnunk. Ha
ugye a forrás kódot is adjuk (nem csak free szoftver esetén), akkor
könnyen megítélhetik az egész programot a forráskódunk minőségéből. Szép
kódot könnyebb megérteni, fejleszteni, debuggolni, átvenni.

Persze vannak alapvető szabályok, melyeket érdemes megtartani, a Sun is
kiadott ilyent [kódolási
konvenciók](http://java.sun.com/docs/codeconv/index.html) névvel. Más
kérdés, hogy a Sun-os források sem mindig tartják be ezeket.

Fő célként kell kitűzni, hogy a kódoláskor konzisztensek maradjunk, akár
a formátumnál, akár a nevek adásakor. Persze mivel az emberek ízlése
eltérő, viták is alakulhatnak ki, ki a tab-ot, ki a space-t kedveli,
ugyanígy eltérők lehetnek a zárójelek és behúzások.

Persze különböző cégek saját házi szabványokat alkottak, azokból is
érdemes ötleteket meríteni sajátunk kialakításakor. A Developer.Com-on
jelent meg egy
[cikk](http://www.developer.com/java/other/article.php/600581), melynél
a linkek között több jó helyre is el lehet jutni.

Persze a programozók alapvetően lusták, így több eszköz is megjelent,
mely a kódot formázza, illetve ellenőrzi. A konvenciók általában
konfigurálhatók. Az én kedvencem a
[CheckStyle](http://checkstyle.sourceforge.net), ami a forrást
ellenőrzi, és ANT taszkként is használható. Egy property állománnyal
konfigurálható, és a hibákat a képernyőre írja ki. Ezzel kitűnően
ellenőrizhető az is, hogy mindennek van-e dokumentációs megjegyzése, így
a JavaDoc-kal generált dokumentációban biztos nem lesznek fehér foltok.

Másik aranyos tool, amely formázza a Java és C/C++ kódot is, illetve
javítja a behúzásokat is, az [Artistic
Style](http://astyle.sourceforge.net/), röviden astyle.

Ezekhez az eszközökhöz van plugin az egyik kedvenc Java nyelven íródott
szerkesztőmhöz, a [JEdit](http://www.jedit.org)-hez (, ami jelenleg a
4.1pre8-nál jár, január 10 óta). Persze a nagyobb IDE-k beépítve
tartalmaznak ilyen szolgáltatásokat is.
