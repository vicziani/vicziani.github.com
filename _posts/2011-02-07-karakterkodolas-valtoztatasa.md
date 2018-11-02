---
layout: post
title: Karakterkódolás változtatása
date: '2011-02-07T09:58:00.000-08:00'
author: István Viczián
tags:
- Linux
- i18n
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Adott egy régi projekt, CP1250 karakterkódolású fájlokkal, Windows
sorvége jelekkel (CRLF). A migráció során szeretnénk ebből UTF-8
karakterkódolású állományokat gyártani, a sorvége jeleket meghagyva.

Erre megfelelő eszköz a `iconv` nevű Linux-os parancs, azonban ez csak új
fájlt képes gyártani, tehát szükség van még egy átnevezésre is. Azonban
létezik egy `recode` parancs is, mely a paraméterként átadott fájlt
módosítja, és a sorvége karaktereket is tudja konvertálni (gyakorlatilag
az `iconv`, `dos2unix`, `unix2dos` parancsok egyesítve).

Nézzük a scriptet, mely rekurzívan elvégzi a konverziót (mind a két
eszközzel mutatja a megoldást):

    #! /bin/sh

    find . -name \*.java -type f | \
    (while read file; do
            echo $file
            # iconv -f CP1250 -t UTF-8 "$file" > "$file"-utf8
            # mv "$file"-utf8 "$file"

            recode cp1250/CRLF..utf-8/CRLF $file
    done)

Cygwin-ben is remekül működik.
