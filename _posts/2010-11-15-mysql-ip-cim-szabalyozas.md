---
layout: post
title: MySQL ip cím szabályozás
date: '2010-11-15T05:44:00.000-08:00'
author: István Viczián
tags:
- mysql
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Ha szabályozni akarjuk, hogy melyik felhasználó milyen ip címről jöhet
be, akkor a user táblában kell a host mező tartalmát átírni az adott
felhasználónál. Hasznos parancsok:

show databases; // Megmutatja, milyen adatbázisok vannak

connect mysql; // MySQL adatbázishoz csatlakozás

update user set host = ‘172.168.0.1’ where user = ‘foouser’; // Adott
felhasználó csak a megadott ip címről jelentkezhet be

flush previleges; // A beállítások érvényre juttatása

Nekem az utolsó parancs hibát dobott:

The FLUSH PRIVILEGES command had an error:\
ERROR 1146 (42S02): Table ‘mysql.servers’ doesn’t exist

Ez olyankor történhet, ha egy adatbázis frissítés során nem lett
létrehozva a mysql.servers tábla. [Ekkor létre kell hozni
azt.](http://www.darkrune.org/blog/?p=443)

Nem csak a bejelentkezéshez lehet host-ot megadni. A jogosultságok a
következő táblák alapján, a következő precedencia szerint kerülnek
meghatározásra: USER, DB/HOST, TABLES\_PRIV, COLUMNS\_PRIV. Mindegyik
tartalmaz host mezőt.

A táblák update-elgetése, majd a flush kiadása helyett használhatjuk a
GRANT parancsokat is.

A jogosultságokról egy [remek
cikk](http://www.databasejournal.com/features/mysql/article.php/3311731/An-introduction-to-MySQL-permissions.htm)
is ír.

Azonban javaslok valamilyen adminisztrációs eszközt, ahol ezeket
grafikus felületen lehet megadni.

Dump készítése:

mysqldump --user=username --password=password database &gt;
filetosaveto.sql
