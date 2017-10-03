---
layout: page
title: Java telepítése
description: Java telepítése. Hogyan telepítsünk Javat?
keywords: Java, Java telepítés
---

# Java telepítése

## Bevezetés

A Java egy programozási nyelv, melyen programokat, alkalmazásokat lehet írni,
fejleszteni. Platformfüggetlen, ami azt jelenti, hogy ugyanazt a programot
különböző operációs rendszeren is lehet futtatni, pl. Windows, Linux,
vagy macOS-en, mely a Mac számítógépek operációs rendszere.

A Java programok futtatásához egy futtató környezetre, a Java programok
fejlesztésére egy fejlesztői környezetre van szükség. Ebből több is van,
de a legelterjedtebb az Oracle által kiadott környezetek. A futtató
környezet a Java Runtime Environment (továbbiakban JRE), a fejlesztő
környezet a Java Development Kit (továbbiakban JDK). Ezek is
programok, melyeket telepíteni kell.
A Java programok futtatásához tehát elegendő a JRE, elég azt telepíteni.
Azonban mivel a JDK is tartalmazza a JRE-t, az sem baj, ha azt telepítjük,
ezzel csak felkerül a számítógépünkre több olyan komponens is, melyet
valószínűleg nem fogunk kihasználni.

A JRE Java alkalmazások futtatására ingyenesen letölthető és használható.

## Verziószámok

A Java legfrissebb verziója a 9-es, meg szoktak adni egy másik számot,
úgynevezett Update, mely azt mondja meg, hogy ebből a főverzióból hanyadik
hibajavítást adtak már ki. Például a 8u20, vagy 8 Update 20 azt jelenti,
hogy a 8-as főverzió, és azon belül a 20-adik kiadott javítás.

A JRE különböző verzióit fel lehet telepíteni egy számítógépre.

## Java alkalmazások

A Java alkalmazásokat különbözőképpen lehet indítani. Vannak böngészőben futó Java
alkalmazások, un. Java appletek. Ezek már nagyon elavult technológiával készültek,
a böngészőtámogatás megszűnésével egyre jobban kopnak ki. Ilyen pl. a régebbi
Oracle Forms technológiával készült üzleti alkalmazások, melyeket főleg
cégeknél, államigazgatási szervezeteknél használnak. Bár a Java 9 még
támogatja ezen appletek futtatását, azonban nem javasolja.
Vannak a böngészőből indítható Java alkalmazások, melyek úgynevezett
Java Web Start technológiával lettek felkészítve arra, hogy a böngészőben
klikkelve feltelepüljenek, majd elinduljanak. Ezeknél az alkalmazást egy JNLP állomány
(`.jnlp` kiterjesztéssel) írja le, melyet a böngésző letölt, értelmez, és aszerint
próbálja futtatni. Ilyen pl. a NAV
Általános Nyomtatványkitöltő (ÁNYK) programja, vagy a CIB régebbi Internet
Bankja. Az Oracle Forms újabb verziója már ezt is támogatja. Appleteket is
lehet ilyen módon indítani.
Valamint az összes Java alkalmazást lehet böngésző nélkül is futtatni, azonban
ehhez mélyebb technológiai tudás szükséges, amennyiben az alkalmazás erre nem
lett előre felkészítve.

Minden Java alkalmazás futtatásához szükséges a fentebb említett JRE. Az appletek
futtatásához, valamint a böngészőből indítható Web Startos alkalmazásokhoz
szükség van a Java és a böngésző integrációjára (összekötésére), úgynevezett Java pluginre,
melyet a JRE tartalmaz.

A Java alkalmazások böngésző nélkül, önmagukban, klasszikus módon, parancssorból, vagy batch scripttel
(`.bat` kiterjesztéssel rendelkező állományok) közvetlenül indíthatóak.

## Letöltés

A JRE telepítéséhez keressük fel a https://java.com/ oldalt, ahol
az oldal felajánlja a használt operációs rendszerünknek megfelelő JRE
verziót letöltésre.
Amennyiben nem azon az operációs rendszerre akarjuk telepíteni a JRE-t,
melyen éppen dolgozunk, letölthetjük a JRE-t más
operációs rendszerre is.

Windows operációs rendszert használva egy online telepítőt fog ajánlani letöltésre,
mely nincs 1 MB méretű, és telepítés közben az internetről tölti le a JRE
nagy részét. Ennek neve IFTW (Install From The Web). Ez nagyságrendileg 50-60 MB.
Amennyiben telepítés közben nincs
internet kapcsolatunk, az Offline telepítőt töltsük le.

## 32 vagy 64 bites JRE

Az újabb számítógépek és rá telepített operációs rendszerek 64 bitesek. A letöltéskor
azonban az oldal 32 bites JRE-t fog felajánlani, 64 bites JRE-t csak azt kiválasztva
tudunk letölteni.

Böngészőben futó, vagy böngészőből indítható alkalmazás esetén mindenképp a 32 bites
JRE-t telepítsük, mert a böngésző integráció csak akkor működik, ha mind a böngésző,
mind a JRE 32 bites. A legtöbb Javat támogató böngésző 32 bites.

Amennyiben a Java programot önmagában akarjuk futtatni, akkor sincs szükség 64 bites
JRE-re, ugyanis sok Java alkalmazást letesztelve arra jutottak, hogy ugyanaz az
alkalmazás 64 bites JRE-n futtatva akár 20%-kal is lassabb lehet. A 64 bites JRE-re
annyival tud többet, hogy nem csak 4 GB memóriát, hanem többet tud használni. Ez
tipikusan csak szerver számítógépek esetén használatos.

Összefoglalva csak akkor töltsünk le 64 bites JRE-t, ha meg vagyunk róla győződve,
hogy 64 bites böngészőnk támogata a Javat, vagy 4 GB-nál több memóriát fogyasztó
alkalmazásokat akarunk futtatni.

Az ugyanazon verziójú JRE 32 bites és 64 bites változata is egymás mellé feltelepíthető
ugyanarra a számítógépre.

### Böngésző támogatás

A Microsoft Edge, Firefox, és Chrome böngészők legfrissebb verziói már nem támogatják
a Java alkalmazások futtatását. Amennyiben böngészőn belül akarunk Java
alkalmazást futtatni, kizárólag az Internet Explorert használhatjuk.

Az Internet Explorer fő vezérlő folyamata, az úgynevezett *Manager Process*,
64 bites változata [indul el](https://blogs.msdn.microsoft.com/ieinternals/2012/03/23/understanding-enhanced-protected-mode/),
azonban a tartalmat megjelenítő folyamata, a *Content Process*
kompatibilitási okokból már 32 bites. Ezért kizárólag 32 bites JRE-vel fog együtt működni.

## Telepítés Windowson

A letöltött állomány elindításával a JRE-t pár lépésben fel tudjuk telepíteni.
A telepítéshez adminisztrátori jogosultság szükséges.

Ha nem az alapértelmezett telepítést választjuk, megadhatjuk, hogy melyik könyvtárba
települjön a JRE. A 8u20 verziótól kezdve a telepítő felismeri, ha már van egy JRE
telepítve, és választhatjuk azt, hogy azt eltávolítjuk.

### Böngésző integráció Windowson

A böngészőt telepítés után újra kell indítani.

#### Böngésző integráció tesztelése

## Telepítés Linuxon

A telepítőt le lehet tölteni tar.gz formátumban, valamint RPM csomagban is.
Az előbbit csak ki kell csomagolni, míg az utóbbit a szokásos eszközökkel lehet
feltelepíteni.

### Böngésző integráció Linuxon

A böngésző integráció Linuxon nem lehetséges.

Firefoxban egy Web Startos alkalmazás esetén a JNLP állományra kattintva a böngésző
megkérdezi, hogy mit akarunk vele tenni. Válasszunk ki valamit, majd
mentsük el, hogy mindig ezt a műveletet hajtsa végre. Utána válasszuk ki
az Edit/Preferences menüpontban az Applications ablakot, és ott a JNLP
file mellett válasszuk ki, hogy mindig a `javaws` alkalmazást futtassa, mely
megtalálható a JRE bin könyvtárában.
