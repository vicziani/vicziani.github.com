---
layout: post
title: Apache Ant
date: 2003-02-09T08:00:00.000+01:00
author: Viczián István
tags:
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Furcsa, hogy többször említettem már az Ant-ot, de még
sosem áradoztam róla bővebben. Nemrég (2002. november) amúgy is egy
nagyobb változás történt, ugyanis az Apache-on belül az Ant top level
project lett, azaz nem a Jakarta alá tartozik, így a
[honlapjának](http://ant.apache.org/) címe is megváltozott. Persze ez
nekünk, felhasználóknak semmit sem jelent, technikai szempontból nincs
változás, és ugyanúgy együtt fog működni a Jakartas projectekkel, mint
eddig. Sőt, tervezik már a 2-es verziót, a felhasználók [feature
requestjei](http://ant.apache.org/ant2/requested-features.txt) alapján.

![Apache Ant](/artifacts/posts/2003-02-09-apache-ant/ant_logo_large.gif)

Mi is az Ant? Egy Java alapú build tool (fordításhoz, disztribúció
készítéshez, installáláshoz, teszteléshez), hasonló a Make-hez, csak
sokkal elegánsabb. Ez egyrészt jelenti azt, hogy a konfigurációs fájl
könnyebben olvasható (lévén egy szimpla XML), illetve platformfüggetlen.
Ez utóbbit úgy valósították meg, hogy teljesen Java nyelven valósították
meg, így ugyanúgy működhet különböző operációs rendszereken, és
kihasználja a párhuzamosságot, és használhat különböző java eszközöket
egyazon virtuális gépen belül.

Az Ant-ot parancssorból kell indítani (paraméterezhető paramétereken és
környezeti változókon keresztül), és az XML formátumú build.xml fájlt
keresi, mellyel a fordítási folyamat kontrollálható. Tartalmaznia kell
egy project-et, ezen belül legalább egy (alapértelmezett) target-et,
melyek közötti függőségi viszony adható meg. A target-ek tetszőleges
számú task-ból állnak, melyek a tulajdonképpeni munkafolyamatok. Ezeket
XML attribútumokkal vagy beágyazott XML tag-ekkel lehet
felparaméterezni. Fontos elemek egy project-en belül a property-k,
melyek string értékek egy névhez rendelve. A későbbiekben
\${property\_name} formában hivatkozhatunk rájuk. Több task-nál is
fájlt/fájlokat vagy könyvtárat/könyvtárakat kell megadnunk, ebben segít
a DirSets, FileSets, és FileList elemek.

Rengeteg beépített task-kal rendelkezik, csak néhány példa a sok közül:
Ant futtatása az Ant-on belül, rendszer parancs futtatása, build number
kezelése, különböző be- és kitömörítések, checksum készítése, fájl és
könyvtár jogosultságok állítása, másolás, törlés, mozgatás, cvs-hez való
hozzáférés, jar, war, ear fájl készítése, fordítás, futtatás, kvt.
létrehozása, patch parancs futtatása, levél küldése, RMI csonkok
generálása, JavaDoc futtatása, Jar aláírása, SQL parancs futtatása
JDBC-n keresztül, touch, XSLT transzformáció. Természetesen saját API-ja
is van, így saját programból is használhatjuk a szolgáltatásait, illetve
komponenseket, task-okat írhatunk hozzá.

Aki eléggé profinak érzi magát az Ant használatában, az esetleg
kipróbálhatja magát ebben a
[tesztben](http://java.sun.com/developer/Quizzes/misc/ant.html). A
Developer.Com-on is van három
[cikk](http://www.developer.com/java/other/article.php/998241) az
Ant-ról, egy bevezetés jellegű, egy könyvtárstruktúráról szóló és egy
deploy-t elemző.
