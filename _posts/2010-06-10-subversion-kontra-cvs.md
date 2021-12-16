---
layout: post
title: Subversion kontra CVS
date: '2010-06-10T13:32:00.000-07:00'
author: István Viczián
tags:
- subversion
- cvs
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Egy gyors lista arról, hogy miben jobb a Subversion, mint a CVS:

-   A commit műveleteket atomiként kezeli, azaz vagy minden fájl
    felmegy, vagy egy sem.
-   Globális revision szám.
-   Működik az átnevezés, ekkor nem vesznek el a fájl előzményei. Ehhez
    külön parancsot kell használni.
-   A fájlok mellett a könyvtárakat is verziózza, egyszerű a részfa
    mozgatása is.
-   Vannak metadata információk, property-k, pl. könyvtárnál az ignored.
-   A branch/tag fogalma nála egységes, gyakorlatilag mindet egy
    copy-ként kezeli.
-   Van binary diff, ezért a bináris állományok tárolása hatékonyabb.
-   Szerver lehet Apache httpd annak minden előnyével. Pl. az állományok
    elérhetők böngészővel http-n keresztül, vagy titkosítva https-en.
-   Gyorsabbak bizonyos műveletek, ugyanis a hálózati sávszélességet a
    fejlesztői drágábbnak ítélték, mint a helyet, ezért van lokális
    másolat a fájlokból, ezért egy diff vagy egy revert hálózati
    kommunikáció nélkül végrehajtható.
-   A hálózaton is csak a változtatásokat küldi át.
-   Nem lehet conflict-olt fájlt visszacommit-olni, ehhez conflict
    resolution kell előtte.
-   A Subversion-ben lehetőség van arra, hogy egy könyvtárra megmondjuk,
    hogy ennek tartalma nem az adott helyen van tárolva, hanem
    megadhatunk egy URL-t. Erre akkor lehet szükség, mikor egy working
    copy több checkout-ból áll össze. Ezt ún. "external definition"-nel
    adható meg. Ekkor egy checkout műveletet kiadva az eredeti könyvtár,
    valamint a külső definíciók is frissítésre kerülnek. Property-vel
    kell ezt is megadni.
-   A CVS status parancs túl bőbeszédű, helyette inkább az update
    parancsot szoktuk használni. A Subversion-ben a status és update is
    megfelelően használható.
-   Az opciókat lehet az alparancs elé vagy mögé is írni, nem lesz ettől
    más a jelentése.
-   A diff alapértelmezetten unified diff.
-   Az Subversion-ben van lock modify unlock, azaz amikor valaki elkezd
    szerkeszteni egy állományt, lock-olnia kell, addig a többi
    felhasználó nem tudja változtatni, mert neki read-only az állomány.
    Amikor befejezi, lehet unlock-ot hívni.

Ezekről a Version Control with Subversion könyv [B
melléklete](http://svnbook.red-bean.com/en/1.5/svn.forcvs.html) is ír.

Van a cvs2svn, Python script, mely a repository konverziót elvégzi.

Lehetőség van pre-commit hook létrehozására, ekkor Win esetén egy
pre-commit.bat-ot kell létrehozni, amit meg fog hívni. Kap paramétert
(felhasználó, tranzakcióazonosító), és a tranzakcióhoz az egyéb
adatokat, pl. a comment szöveget az svnlook paranccsal kell lekérdezni.
