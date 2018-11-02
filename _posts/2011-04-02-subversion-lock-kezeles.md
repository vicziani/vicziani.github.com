---
layout: post
title: Subversion lock kezelés
date: '2011-04-02T01:00:00.000-07:00'
author: István Viczián
tags:
- subversion
modified_time: '2018-06-09T10:00:00.000-08:00'
---

A Subversion alapban a Copy-Modify-Merge modellt követi, ami azt
jelenti, hogy a felhasználók párhuzamosan dolgozhatnak ugyanazon az
állományon, és egy intelligens algoritmus próbálja a felhasználók
különböző módosításait összefésülni. Ez a legtöbb esetben működik is, ha
nincs párhuzamos szerkesztés, vagy ha az állomány szöveges, és a
felhasználók az állomány különböző részeit szerkesztik. Ritkább esetben
konfliktus van, természetesen ezt kézzel kell feloldani.

Bináris állományok esetén más a helyzet. Ott nem működik az
összehasonlítás, pl. egy kép vagy egy Excel formátum esetén. Ekkor
valójában a párhuzamos munkát nem lehet elvégezni, a munkát sorosítani
kell. Ez a klasszikus Lock-Modify-Unlock megoldás. A felhasználó zárolja
az állományt, dolgozik rajta, majd feloldja a zárolást.

A zárolás fogalmát a Subversion is támogatja. Amennyiben egy lock-ot
kérek, más nem törölheti vagy módosíthatja az állományt.

Ennek azonban az a hátránya, hogy nyugodtan hozzákezdhetek a lokális
állományom módosításához, nem értesülök arról, hogy az állományt közben
valaki zárolta.

Erre a Subversion bevezette az svn:needs-lock tulajdonságot (property).
Ez azt eredményezi, ha egy állományon rajta van, akkor az állomány a
lokális fájlrendszerben read-only, azaz nem szerkeszthető. Az, hogy
szerkeszthetővé váljon, először zárolást kell kérni.

Ha azt akarjuk, hogy egy állományt tehát csak zárolással lehessen
szerkeszteni, létrehozáskor rá kell tenni a svn:needs-lock tulajdonságot
(jobb klikk/TortoiseSVN/Properties New..., Property name =
svn:needs-lock, Value maradhat üresen - ez után kell commit).

Ahhoz, hogy szerkeszteni tudd ezt az állományt, először zárolni kell
(jobb klikk/TortoiseSVN/Lock). Amennyiben azt írja ki, hogy nem
sikerült, akkor valaki más már zárolja - kiírja a felhasználónevét is.
Amennyiben sikerül, a fájl szerkeszthetővé válik. Commit után a zárolás
feloldásra kerül. A zárolást meg is lehet szüntetni (jobb
klikk/TortoiseSVN/Release lock).

Sajnos az Excel engedi a szerkesztést írásvédett fájl esetén is, csak
menteni nem engedi. A fejlécben megjelenik az \[Olvasásra\] szöveg.

A Lock-Modify-Unlock legnagyobb hátránya, ha valaki úgy felejti a
zárolást. Ezt az adminisztrátor fel tudja oldani (svnadmin rmlocks), de
figyeljünk erre, hogy ne legyen rá szükség. Bár egy másik felhasználó is
"el tudja lopni" a zárolást, ekkor a svn unlock --force parancsot kell
kiadnia.

Bővebb információ, valamint ha valaki parancssorból szereti használni:
<http://svnbook.red-bean.com/en/1.5/svn.advanced.locking.html>
