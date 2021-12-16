---
layout: post
title: Erőforrások betöltése
date: '2008-12-09T11:02:00.003+01:00'
author: István Viczián
tags:
- Java SE
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Az alkalmazás által használt erőforrások olyan adatok, melyek a kódban
nem helyezhetőek (nem ajánlott elhelyezni), mint pl. kép, hang, videó,
szöveg (a szövegek pl. sablonok, felhasználói felület feliratok, stb.).

Az erőforrások elérésének két módja van. Egyrészt lehet direkt elérés,
amikor a programban abszolút módon meg kell adni az erőforrás helyét
(pl. konkrét fájl path vagy URL), és lehet indirekt, ún. helyfüggetlen
(location-independent) elérés is, mikor az alkalmazásban egy szimbólikus
nevet adunk meg, és a környezet oldja fel ezt egy abszolút helyre. Ez a
feloldás pont emiatt környezetfüggő.

Lehetőleg kerüljük a direkt elérést, az alkalmazásunkban mindig logikai
neveket használjunk. A logikai nevekhez rendelhetünk magunk konkrét
értékeket, pl. JNDI-ből oldjuk fel (pl. web konténerben,
alkalmazásszerverben konfiguráljuk), vagy használhatjuk a Java beépített
mechanizmusát, ha az erőforrást classpath-ból tudjuk betölteni (amikor
az erőforrást pl. az alkalmazásunkhoz csomagolva, a JAR, WAR, EAR, RAR
állományokban tudjuk elhelyezni).

Az erőforrások nevei különböző részekből állnak, melyek / karakterrel
vannak elválasztva. Mindegyik rész egy Java azonosító. Ezzel a
konvencióval egy hierarchiát lehet kialakítani az erőforrások
elhelyezkedésében. Az utolsó rész az erőforrás egyszerű neve, ami
tartalmazhat egy kiterjesztést is (ez csak egy konvenció), ponttal
elválasztva, és szintén Java típusú azonosító.

Az elválasztójel mindig / jel, ennek feloldásáról pl. fájlrendszerre,
URL-re, stb. a környezet gondoskodik.

A környezetet Java nyelvben a ClassLoader osztály leszármazottai
biztosítják. Ezek megfelelő metódusai oldják fel az erőforrás neveket
abszolút hivatkozásokra, és ezek is töltik be azokat.

Az erőforrások lehetnek rendszer-erőforrások, aminek betöltéséről a
statikus ClassLoader.getSystemResource és
ClassLoader.getSystemResourceAsStream metódusok gondoskodnak. Ez a
CLASSPATH bejegyzéseket végigjárva próbálja az adott erőforrást
megtalálni.

A nem rendszer-erőforrások betöltéséért a ClassLoader.getResource és
ClassLoader.getResourceAsStream példány metódusok gondoskodnak. Ezek
implementációja leszármazottanként más és más lehet, emiatt eltérhet az
erőforrás-betöltés mikéntje. Minden osztálybetöltő azonban először
rendszer-erőforrásként próbálja betölteni az erőforrást.

Az erőforrásokat ajánlott az osztályok mellé elhelyezni, ugyanazon
csomag struktúrába. Ekkor a nevének megadásakor a csomag minősített
nevét is meg kell adni, de elválasztáshoz . helyett a már említett /
jelet kell használni.

A könnyebb használhatóság érdekében a bevezették a Class.getResource és
Class.getResourceAsStream metódusokat is, melyek több könnyebbséget
adnak:

-   Bizonyos osztályok betöltését az ún. elsődleges osztálybetöltő
    végzi. Ekkor a Class.getClassLoader metódus null-t ad vissza. Ezt a
    Class.getResource és Class.getResourceAsStream metódus ellenőrzi, és
    ebben az esetben rendszer-erőforrásként próbálja betölteni az
    erőforrást.
-   Ha nem adjunk meg a / jelet az erőforrás első karaktereként, akkor
    relatív hivatkozásnak veszi, és automatikusan elérakja az osztály
    csomagjának minősített nevét, a pontokat / jelre cserélve. Erőforrás
    megadása azért lehet követendő példa, mert ilyenkor csomag
    átnevezésekor nem kell a forráskódban is változtatni az erőforrás
    nevét, aminek elmaradása ráadásul futásidejű hibát eredményez.
-   Ennek használatakor nem kell a getClassLoader security permission.

Az osztályra való hivatkozást meg lehet szerezni
FooClass.class.getResource és egy példányon keresztül a
foo.getClass().getResource módokon is. Az előbbi használata javasolt,
mert:

-   Nem kell hozzá példány.
-   Ha örököltetünk, és egy másik csomagba kerül a gyermek osztály,
    akkor a foo.getClass() a leszármazott osztályt fogja visszaadni, így
    a relatív névmegadással nem lehet az erőforrást megtalálni.

Ehhez érdemes kicsit megérteni az osztálybetöltőket. Ha egy osztályt az
elsődleges osztálybetöltő tölt be, tipikusan a java.\* csomag bizonyos
osztályait, akkor az null-t ad vissza. Ez azért van, hiszen az
elsődleges osztálybetöltő C-ben van írva. Hiszen ha ez is egy normál
osztály lenne, akkor ezt mi töltené be (tyúk-tojás probléma)?
Osztálybetöltők:

-   Bootstrap class loader: boot classpath-on lévő osztályok, nem kell
    őket ellenőrizni
-   Extension class loader
-   System class loader

Osztálybetöltők között egy futásidejű fa hierarchia alakul ki.
Osztálybetöltéskor ún. delegation model van alkalmazva, azaz az
osztálybetöltő először a szülő osztálybetöltővel próbálja betöltetni az
osztályt, csak utána próbálja meg önmaga. Ha ő sem tudja,
ClassNotFoundException kivétel váltódik ki.

További források:

[http://java.sun.com/javase/6/docs/technotes/guides/lang/resources.html](http://java.sun.com/javase/6/docs/technotes/guides/lang/resources.html)
[http://www.javaworld.com/javaworld/javaqa/2002-11/02-qa-1122-resources.html](http://www.javaworld.com/javaworld/javaqa/2002-11/02-qa-1122-resources.html)
[http://java.sun.com/developer/technicalArticles/Networking/classloaders/index.html](http://java.sun.com/developer/technicalArticles/Networking/classloaders/index.html)
