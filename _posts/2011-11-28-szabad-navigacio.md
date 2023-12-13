---
layout: post
title: Szabad navigáció okozta problémák webes környezetben
date: '2011-11-28T01:06:00.001+01:00'
author: István Viczián
tags:
- Maven
- DocBook
modified_time: '2018-01-12T11:05:58.755+01:00'
---

Technológiák: Servlet 3.0/JSP 2.2, DocBook 4.5, Docbkx Tools (Docbkx
Maven Plugin), Maven 3

Legrégebb óta írt cikkem kerül most publikálásra, melynek címe *Szabad
navigáció okozta problémák webes környezetben*.

Ez a cikk azon problémával foglalkozik, mely a legtöbb webes alkalmazás
fejlesztésekor felmerül, ugyanis nem biztosítható az, hogy a felhasználó
olyan sorrendben nézze meg az oldalakat, ahogy azt az alkalmazás
fejlesztője eltervezi. Használhatja a Vissza és Tovább műveleteket is
navigációra, valamint újratöltheti az oldalt a Frissítés művelettel.
Ezen műveletek elérhetők a böngésző szokásos gombjai között,
billentyűkombinációval, de jobb kattintásra felugró menüben is. Sokan
megszokásból, esetleg türelmetlenség (, a lassú válaszidő) miatt duplán
kattintanak egy adott hivatkozásra. A felhasználó kézzel is beírhat egy
url-t, vagy a Kedvencek közül is választhat egyet, ami szintén hibás
működéshez vezethet, ha erre nem készülünk fel, és bízunk, hogy csak a
felületi elemeket (űrlap elemek – gomb, legördülő menü, stb.,
hivatkozások) fogja használni. A böngészők és tűzfalak gyorsítótár
beállításai is megzavarhatják az előre tervezett munkafolyamatot. A
probléma a webes technológia, a http(s) protokoll, valamint a böngészők
adta lehetőségek miatt jelentkezik.

A cikk egy jtechlog-repost példa projektre hivatkozik, mely [letölthető
a GitHub-ról](https://github.com/vicziani/jtechlog-repost). Egyszerű
webes alkalmazás, servlet controller és JSP view réteggel. Mavennel
buildelhető, és a letöltést követően a `mvn jetty:run` paranccsal
futtatható.

Példaprogrammal, szekvencia diagramokkal és forráskódokkal szemlélteti a
webes alkalmazásokban gyakran felmerülő problémákat, melyek a szabad
navigációból erednek. Ha te is találkoztál, vagy írtál olyan
alkalmazást, ahol problémát okozott, ha a felhasználó véletlenszerűen
használta a Vissza/Előre gombokat, ha a többszöri kattintás felesleges
terhelést okozott a szerveren, ha Frissít gomb megnyomásakor a böngésző
hibaüzenetet dobott fel, akkor a cikk neked való. Nem csak a
problémákat, de a rá adott szabványos megoldásokat is ismerteti, mint a
Redirect After Post, vagy a Synchronizer Token. Olyan ide kapcsolódó
témákat is érint, mint a hosszú, aszinkron folyamatok kezelése, vagy a
problémák megoldása AJAX környezetben.

[Szabad navigáció okozta problémák webes környezetben cikk
letöltése](/artifacts/repost.pdf)

A dokumentáció érdekessége, hogy [DocBookban](http://www.docbook.org/)
íródott, mely egy XML formátum könyvek, cikkek publikálására. Ugyanis
meguntam a Word ezirányú képességeit, hogy hosszabb dokumentációnál
elveszti a kontrollt, bizonyos dolgokat sokszor körülményes vele
megcsinálni. Mivel az XML egy szöveges állomány, ilyen nem fordulhat elő
a megfelelő tag-ek ismeretében. A DocBook XML állományból a Maven
[Docbkx Tools](http://docbkx-tools.sourceforge.net/) fordít PDF
állományt. A háttérben először egy XSL-FO állomány generálódik le, majd
azt fordítja az [Apache FOP](http://xmlgraphics.apache.org/fop/) PDF-fé.

A DocBook forrást tartalmazó, és a PDF-fé build-elést elvégző Maven
projekt szintén [elérhető a
GitHub-on](https://github.com/vicziani/jtechlog-repost-doc).

Ezzel kapcsolatban csak egy probléma merült fel, méghozzá az ékezetes
karakterek problémája, melyről egy külön
[poszt](/2018/01/11/pdf-ekezetes-karakterek.html) készült.
