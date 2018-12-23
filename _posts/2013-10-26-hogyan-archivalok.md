---
layout: post
title: Hogyan archiválok?
date: '2013-10-26T02:53:00.000-07:00'
author: István Viczián
tags:
- windows
- archiválás
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Elég régóta keresem és figyelem a lehetőségeket az adataim
archiválására, most leírom, hogy hol is tartok. Alapvetően Windows
rendszeren dolgozom, de az itt leírt lehetőség működik Linux-on, Mac-en
is.

Az adataim egyik része webes szolgáltatásokban, másik (számottevően
nagyobb) része a winyón van. A szolgáltatások, melyeket használok,
mindegyiknek van olyan lehetősége, hogy egy fájlba ki lehessen menteni
az adatokat, általában az admin felületen kell keresgélni (pl. Evernote,
Delicious, stb.). A Google alkalmazásoknál ráadásul ez integráltan
jelenik meg, a [Google Takeout](https://www.google.com/settings/takeout)
segítségével. Ezeket manuálisan kattintgatom végig, kb. fél óra az
egész. Az itt exportált fájlokat, és az összes olyan fájlt, melyet
szeretnék több helyről elérni (pl. munkahelyi gépről, vagy mobilról),
illetve napi szinten akarom archiválni (futó projektek), azokat a
[Dropbox](https://www.dropbox.com/home)-ba töltöm fel. Ott különösebb
erőfeszítés nélkül elértem 5 GB-ot ingyen, ami bőven elég, tekintve,
hogy kb. 1,5 GB-ra van szükségem.

Ennél bonyolultabb kérdés, hogy hova kerüljön az többi nagy mennyiségű
adatom. Ez kb. 300 GB, és sokkal ritkábban változik. Szerencsére az
összes adatom elfér a notebookom winyóján. Ide tartozik az összes zeném,
képem, családi videók, régi munkák. Hogy ilyen alacsonyan tudom tartani
a méretét, annak köszönhető, hogy nem gyűjtögetek. Csak ingyenes,
bármikor újra letölthető szoftvereket használok, valamint nem teszek el
filmeket. A CD, DVD természetesen nem jöhet szóba, meg akarok tőlük
szabadulni (az összes médiától és drive-tól). A modern megközelítés
persze a felhő lenne, azonban még mindig lassúnak tartom, szeretném, ha
fél óra alatt el tudom készíteni, és vissza is tudom állítani a mentést.
Valamint kicsit bizalmatlan is vagyok. Maradt tehát a külső winyóra
történő mentés. Ezt szigorúan más helyen tartom, mint a notebookot (pl.
bent a cégnél, rokonnál), hiszen csak így van értelme. Ennek annyi előny
is van, hogy ezeken a helyeken bármikor elő tudom venni a szükséges
állományokat.

A notebook winyó és a külső winyó közötti szinkronizációt bizonyos
időközönként megejtem, és erre a [rsync](https://rsync.samba.org/)
utilt használom a ([Cygwin](http://www.cygwin.com/)-nel, hiszen ez
mindig van a gépemen). Ebből adódóan ez Linuxon alapértelmezetten
működik. Próbáltam mindenféle Windows-os programot, de egy sem váltotta
be a hozzá fűzött reményeket, és amúgy is szeretem a parancssoros
programokat, így van egy scriptem, melyet elindítok, ha rádugom a külső
winyót, és mindent átszinkronizál. Nem szeretném ütemezetten, mert
mindig kell előtte kicsit takarítgatni.

A következő parancsot használom könyvtáranként:

    C:\cygwin\bin\rsync -rtvh --modify-window=1 --delete  /cygdrive/d/download /cygdrive/f

A végén kiadok egy ilyen parancsot is, hogy tudjam mikor volt az utolsó
mentés:

    C:\cygwin\bin\date.exe > f:\lastsync.txt

Ez a d:\\download könytár tartalmát szinkronizálja az f:-re. Előnye,
hogy fájl szinten ment (utálom a mindenféle archívumok kezelését), és
csak a diff-et küldi át. A modify-window-ra azért van szükség, mert
NTFS-ről szinkronizálok FAT32-re, és ez utóbbin a módosítás dátuma csak
két másodperces pontosságú, és ezért a kapcsoló használata nélkül
feleslegesen vitt át fájlokat.

Ennek a megoldásnak a gyenge pontja, ha a szinkronizálás közben történik
a baj (villám, vírus). Erre is van megoldás. A [BitTorrent
Sync](http://labs.bittorrent.com/experiments/sync.html) képes két gép
között szinkronizálni, központi szerver nélkül, a torrent technológiáját
használva. Hátránya, hogy mindkét gépnek bekapcsolva kell lennie a
szinkronizálás erejéig. Ezzel gyakorlatilag az otthoni és a céges
gépemre rádugott winyó között tudom szinkronizálni a teljes tartalmat.

Probléma volt még annak kérdése, hogy hogyan osszak meg nagy mennyiségű
fotót a szülőkkel. Persze megint jöhetnek a webes szolgáltatások,
Google+, Flick, de nem tudtam megbarátkozni a felületükkel. A
fényképeket mindannyian Picasa-ban kezeljük. Adta magát az ötlet, hogy a
fényképeket is BitTorrent Sync-cel vigyük át fájl szinten. Így ha
mindkét gép be van kapcsolva, a szüleimnek azonnal megjelennek a képek a
Picasa-ban. És ez egy plusz backup is.

Persze meg lehetne oldani azt is, hogy automatikus legyen a
szinkronizáció, pl. egy gépet folyamatosan bekapcsolva tartani (akár egy
Raspberry PI-t), de annyira ritkán változnak ezek az adatok (hiszen a
gyakran változók Dropbox-ban vannak), hogy nem éri meg folyamatosan
járatni.

Mi lenne még hátra? A webes szolgáltatások adatainak letöltését
automatizálni. A Dropboxban tárolt adatokat titkosítani.
