---
layout: post
title: OLAP Java eszközökkel
date: '2009-03-23T03:38:00.009+01:00'
author: István Viczián
tags:
- BI
- Community
modified_time: '2018-06-09T10:00:00.000-08:00'
---

2009\. március 18-án tartottuk a 9. [JUM](http://jum.hu/?q=node/15)
rendezvényt a SZÁMALK egyik termében. A JUM célja lehetőséget teremteni
arra, hogy a magyarországi Java-val foglalkozó szakembereknek, hogy
technológiai tudásukat karbantartsák, tapasztalataikat megosszák
egymással. Ezért alkalmi session-okat szervezzünk, ahol különböző
témakörökben előadásokat tartunk egymásnak.

Első előadást Verhás István tartotta a "Maven2 a gyakorlatban" címmel.
Az előadás tartalmazott elméleti és gyakorlati részeket is. Alapvetően
én Maven ellenes vagyok, mert nem dolgoztam olyan környezetben, ahol
többet használt volna, mint ártott. Viszont két dologban mindenképp
egyetértek. Először is a convention over configuration jó dolog. Nagyon
sajnálom, hogy még nincs szabvány arra, hogyan kell egy Java, akár
Enterprise Java projekt felépítésének kinéznie. Másodsorban a Maven
használata vállalati belső repository nélkül elég körülményes.

A második előadást Verhás Péter tartotta a "Web Szervizek tesztelése
SOAPui-val" címmel. Az ötlet nagyon tetszett: remekül ismerték fel,
hogyha a tesztelést, mint szolgáltatást el akarják adni, érdemes kicsit
több munkát befektetni egyrészt az automatizálásba, másrészt a felület
fejlesztésébe. Ők ezt úgy oldották meg, hogy integrálták a SOAPUi web
szolgáltatások tesztelésére való eszközt (ingyenes, csak a
professzionális változatáért kell fizetni), a GreenPepper automatikus
funkcionális tesztelésre kifejlesztett eszközt (kereskedelmi), valamint
az Atlassian Confluence nagyvállalati wiki megoldást. Így a SOAPUi-ban
implementálják a teszteseteket, a Wiki felületén felviszik az input és
output adatokat, és onnan is indítják a tesztelést, aminek eredménye
megjelenik a felületen.

A harmadik előadást én tartottam "Adattárház és jelentéskészítés
OLAP-pal a Pentaho Mondrian és JPivot nyílt forráskódú eszközök
használatával" címmel. Ahogy ígértem, az előadásról [cikket írok és itt
közlöm.](/artifacts/Java_OLAP.pdf)

A [Prezi](http://prezi.com/) online prezentációkészítő szolgáltatást
mindenkinek javaslom kipróbálásra, hiszen nagyon látványos bemutatókat
lehet vele készíteni. Szakít a "slide" fogalmával, és az egész
prezentációt egy kicsinyíthető, nagyítható térben kell elhelyezni.

A JUM-mal kapcsolatban annyit, hogy többen voltunk, mint amennyire
számítottunk, a létszám 20 felett volt (, bár több, mint 40-en
regisztráltak). A legnagyobb hiba az idővel való elcsúszás volt, így az
előadásomat is abba kellet hagyni, kérdésekre sem volt idő. Amennyiben
az ember viszonylag ismeretlen dolgokról akar beszélni, csak az
alapozással eltelik az a húsz perc, ami a prezentációra van szánva.
Emiatt vagy populárisabb témát kell választani, vagy az előadók számát
egy alkalommal háromról kettőre kell csökkenteni. Most elsőként
kérdőívek is ki lettek osztva. Az értékelések egész jók lettek, 4-es
skálán 3,5 körül. Tapasztalat velük annyi, hogy önmagában az osztályozás
nem sokat ér, a szöveges megjegyzések, értékelések sokkal többet
segítettek volna, hiszen az alapján tudnánk, hogy mit kéne esetleg
másképp csinálni. Sajnos mindenki üresen hagyta.
