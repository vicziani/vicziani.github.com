---
layout: post
title: Subversion dump
date: '2009-10-07T06:12:00.000-07:00'
author: István Viczián
tags:
- subversion
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Adott volt, hogy a projektek különböző SVN repository-kba voltak
szétszórva, ezt kellett egységesíteni. Az SVN alapegysége a repository,
azon belül vannak a könyvtárak és a fájlok. Míg repository-t az svnadmin
paranccsal lehet létrehozni, addig könyvtárak és fájlok az svn
paranccsal kezelhetőek. Ahhoz, hogy egyik repository egyik könyvtárból
átvigyünk fájlokat egy másik repository-ba, használni kell az `svnadmin
dump`, `svnadmin load` és `svndumpfilter` parancsokat. A dump:

  svnadmin dump REPOS_PATH &gt; dumpfile

Ezt Windows/Linux parancssorban kell kiadni, ahol a `REPOS_PATH` a
repository könyvtára.

Betölteni a következő paranccsal lehet:

  svnadmin load REPOS_PATH < dumpfile

Abban az esetben, ha egy alkönyvtár alá akarjuk betölteni, akkor
ajánlott a `—parent-dir` paraméter használata, ebben az esetben viszont az
adott könyvtárat külön létre kell hozni!

  svnadmin load —parent-dir PARENT_DIR REPOS_PATH < dumpfile

Lehetőség van egy könyvtár kiválogatására is a dump fájlból az
`svndumpfilter` paranccsal.

  svndumpfilter include SUB_DIR < dumpfile > filtered-dumpfile

Ilyenkor a `SUB_DIR` szövegnek a path elejére kell illeszkednie, azaz az
illesztés `SUB_DIR*` minta szerint történik.
