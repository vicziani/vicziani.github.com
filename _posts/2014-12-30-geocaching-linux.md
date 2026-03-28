---
layout: post
title: Geocaching Linuxon
date: "2014-12-30T10:00:00.000+01:00"
author: István Viczián
description: Ez a poszt azoknak készült, akik geocache-elnek, és mellette Linuxot használnak.
---

Ez az oldal azoknak készült, akik geocache-elnek, és mellette Linuxot használnak. Ez sajnos azért nem triviális, mert Magyarországon a legelterjedtebb túrázáshoz, geocachinghez használt készüléktípus a Garmin, mely gyártó jelenleg a [BaseCampet](https://www.garmin.com/en-US/software/basecamp/) biztosítja az eszközeihez, mely jelenleg Windows és Mac operációs rendszereken érhető csak el. A BaseCamp a régebbi [MapSource](http://www8.garmin.com/support/download_details.jsp?id=209) programot váltotta le. Sajnos a Garmin által használt formátumok sem nyíltak.

Az oldal nem csak geocache-ereknek lehet hasznos, hanem túrázóknak, vagy bárkinek, aki Garmin GPS-t használ, vagy egyszerűen csak turistatérképeket akar kezelni Linux operációs rendszeren. Remélem az oldal Geocaching.hu és a Turistautak.hu oldalak felhasználói részére is tartalmaznak hasznos információkat.

Persze van lehetőség arra is, hogy a MapSource-t VirtualBox virtuális gépen Windows-on futtassuk, vagy Wine-vel Windows környezetet emuláljunk, de én inkább a natív megoldásokat szerettem volna megkeresni.

Én egy GPSMAP 60 GPS készülékkel rendelkezem, és Ubuntu 14.04 Linuxot futtatok, így a példák is ezen a környezeten lettek tesztelve, de bízom benne, hogy más eszközzel és más disztribúción is hasonlóképp fognak működni.

<!-- more -->

## Fogalmak

* Névvel, koordinátákkal és egyéb tulajdonsággal rendelkeznek az útpontok (waypoint). Pl. a geoládák és a ládaleírásban szereplő egyéb pontok is útpontként tölthetőek le. A térképekbe szerkesztett pontokat hívják POI-nak (Point of Interests). A GPS-szel is tudunk pontokat megjelölni.
* Az útpontok sorozata az útvonal (route). Általában tervezéshez használatos, ugyanis a GPS ezen tud könnyen végignavigálni minket. 
* A nyomvonalként (track) rögzíti a GPS az utunkat, mely nem más, mint pontok sorozata, melyhez időpont is hozzá van rendelve.
* A vektoros térkép különböző pontokat, vonalakat, területeket (poligon) tartalmaz, az őket alkotó pontok koordinátáinak megadásával. Így a térkép kirajzolása ezen objektumok kirajzolásával történik, melyeket a megfelelőképpen kell transzformálni, mely erőforrásigényesebb művelet. Viszont bizonyos funkcionalitásokat sokkal könnyebb implementálni, mint pl. nagyítás, objektumok/rétegek szűrése, útvonaltervezés, stb.
* A raszteres térkép gyakorlatilag képfájlok halmaza. Különböző nagyításhoz különböző képfájlok tartoznak. Megjelenítése gyors, de a vektoros térképnél leírt funkcionalitások megvalósítása sokkal bonyolultabb, ha nem lehetetlen.

## Fájlformátumok

Két fájlformátum típussal találkozhatunk, az egyik, melyben a térképek adatai kerülnek letárolásra, a másik a GPS által rögzített, vagy a GPS számára hasznos adatok, mint az útpontok, útvonalak és nyomvonalak.

A Garmin készülékek térképformátuma az .img kiterjesztésű állomány. Bár a formátum nem nyílt, [visszafejtették](https://wiki.openstreetmap.org/wiki/OSM_Map_On_Garmin/IMG_File_Format) és rengeteg szoftver képes kezelni. Ezért én is ezt javaslom, hiszen a [turistautak.hu](https://www.turistautak.hu/garmin.php) oldalról ebben a formátumban is le lehet letölteni a térképeket, és a később részletezett QLandkarte GT szoftver is képes kezelni. Az .img állományok mellett szerepelni szokott egy .tdb állomány is, mely összefoglaló információkat tartalmaz az .img fájlokról, és a QLandkarte GT is csak ennek megléte esetén tudja betölteni őket.

A GPS adatok kezelésére a [GPX, vagyis GPS Exchange Format](https://en.wikipedia.org/wiki/GPS_Exchange_Format) formátumot javaslom, ugyanis ez egy nyílt [kvázi szabvány](https://www.topografix.com/gpx.asp), mely XML alapú, és a legtöbb szoftver tudja kezelni. A geocaching.hu oldalon is többek között ebben a formátumban is le lehet tölteni a ládák adatait. Érdemes megjegyezni, hogy a Garmin a MapSource programban a saját .gdb formátumát preferálja, bár képes kezelni sok más formátumot is.

## Garmin eszköz használatba vétele

Csatlakoztassuk a GPS-t az USB porton, majd kapcsoljuk be.

Nyissunk egy terminált, és adjuk ki az `lsusb` parancsot, mely az USB portokra csatlakoztatott eszközöket listázza. Valahol egy ilyent is kell látnunk:

	Bus 003 Device 009: ID 091e:0003 Garmin International GPS (various models)

Itt meg kell jegyezni a busz számát, és az eszköz számát (`003/009`), ugyanis a következő parancs kiadásánál kelleni fog. Ugyanis alapesetben az eszközhöz tartozó device file úgy jön létre, hogy csak a root felhasználó férhet hozzá. Ez ellenőrizhető a következő paranccsal, használjuk az előbb megjegyzett számokat:

	$ ls -l /dev/bus/usb/003/009
	crw-rw-r-- 1 root root 189, 264 dec   20 21:37 /dev/bus/usb/003/009

A jogosultságokat jelző flageken látható (`crw-rw-r--`), hogy egy normál felhasználó csak olvasni tudja a device file-t. Ahhoz, hogy teljes joga legyen, meg kell mondani a rendszernek (pontosabban a Linux kernelben lévő udev eszközkezelőnek), hogy mikor létrehozza ezt a fájlt, a megfelelő jogosultságokkal tegye. Ehhez egy úgynevezett rule fájlt kell létrehozni a `/etc/udev/rules.d/51-garmin.rules` helyen a következő tartalommal.

	ATTRS{idVendor}=="091e", ATTRS{idProduct}=="0003", MODE="666"

Töltessük újra a szabályokat a következő paranccsal.

	sudo udevadm control --reload-rules

Majd csatlakoztassuk le, majd újra fel az eszközt, és nézzük meg, hogy a létrejött device file már a megfelelő jogosultságokat kapta.

	$ ls -l /dev/bus/usb/003/009
	crw-rw-rw- 1 root root 189, 264 dec   20 21:37 /dev/bus/usb/003/009

A harmadik blokkban megjelent `w` betű jelzi, hogy immár mindenki számára írható is az eszköz.

Részletesebb információkat az OpenStreetMap [wiki oldalán](http://wiki.openstreetmap.org/wiki/USB_Garmin_on_GNU/Linux) találsz.

## Adatforrások

### Geocaching.hu

A  [Geocaching.hu](https://geocaching.hu) a magyar geocache-erek első számú információforrása, ahová a ládák adatai vannak feltöltve. A ládák adatait innen sok formátumban le lehet tölteni, de nekünk a .gpx formátum az érdekes.

### Turistautak.hu

A [Turistautak.hu](https://turistautak.hu) oldal koordinálja egy lelkes csapat munkáját, mely GPS-es terepbejárások alapján, nonprofit alapon építik Magyarország térképét. Teljes közúthálózat, települések utca szintű térképei, POI-k, és ami számunkra a legfontosabb, a turistautak. Szigorú szabályok szerint működik, vektorosan csak megbízható szerkesztők tölthetik le és szerkeszthetik.

A térképek többféle [formátumban](https://www.turistautak.hu/wiki/Kimenetek) is megtekinthetőek és letölthetőek. Számunkra talán a böngészőből is nézhető [raszteres](https://terkep.turistautak.hu), valamint a letölthető, és [Garmin eszközökre feltölthető](https://www.turistautak.hu/garmin.php) formátum az érdekes. A hátteréről csak annyit, hogy MapEdit nevű Windowson futó szerkesztőben készül a szerkesztés nyomvonalak alapján és .mp formátumban kerül mentésre (és utána ebből konvertálják különböző formátumokra). 

A térkép több [tájegységre](https://turistautak.hu/regions.php) van bontva. Hasznos információforrás az oldal [wikije](https://www.turistautak.hu/wiki/Kezd%C5%91lap) is.

### OpenStreetMap

Az [OpenStreetMap](https://www.openstreetmap.org), röviden OSM egy hasonló kezdeményezés, mint a Turistautak.hu, azonban az egész világra koncentrál, és korántsem olyan szigorú szabályok szerint működik. Az OpenStreetMap XML alapú .osm vektoros térkép formátummal dolgozik, ami mindenki számára le is tölthető.

[Wikijén](https://wiki.openstreetmap.org/wiki/Main_Page) és [magyar nyelvű aloldalán](https://wiki.openstreetmap.org/wiki/Hu:Main_Page) rengeteg információ megtalálható.

### OpenHiking(Maps)

Az [OpenHiking(Maps)](https://www.openhiking.eu/) 2021 decemberében indult,
az Openmaps megszűnésekor. Térképük a természetjárás kedvelőinek szól, Közép-Európa országait fedi le. A térkép vektor alapú, és az OpenStreetMap-es adatokból készül. 

## Alkalmazások

A [GPSBabel](https://www.gpsbabel.org) egy parancssori eszköz különböző formátumú GPS állományok közti konvertáláshoz. Több száz formátumot ismer, és már kinőtte magát annyira, hogy mindenféle manipulációkat is el lehet végezni ezen állományokon. Viszont térkép állományokat nem kezel. Közvetlenül is képes kezelni a számítógéphez csatlakoztatott GPS eszközt. Mindig ezzel érdemes kezdeni az ismerkedést.

Az [mkgmap](https://www.mkgmap.org.uk/) egy Java alkalmazás, mely képes az Open Street Map .osm formátumát a Garmin által ehető .img formátummá konvertálni. Nekünk ezzel remélhetőleg nem lesz dolgunk, mert hozzá tudunk férni a már mások által legenerált .img állományokhoz. Érdekességként megemlítendő, hogy a Turistautak.hu is ezzel konvertál .img formátumba. Sajnos az alkalmazás nem képes az állományok eszközre való feltöltésére.

A [QMapShack](https://github.com/Maproom/qmapshack/wiki) (a QLandkarte GT utódja) nyílt forráskódú alkalmazás mind térkép, mint GPS adatok kezelésére, mely elérhető Windows, OS X és Linux rendszerekre is. Támogatja a túrázás előkészítés teljes folyamatát, mint az útpontok és útvonalak betöltése vagy létrehozása, valamint ezek GPS eszközre töltése. Ezen kívül az utómunkálatokban is segítséget nyújt, mint pl. az adatok GPS-ből való letöltése, azok feldolgozása és archiválása. Nagyszerűen kezeli a Garmin eszközöket.

### GPSBabel

Ubuntun az alábbi paranccsal telepíthető.

	sudo apt-get install gpsbabel

Először töltsünk le egy GPX állományt a geocaching.hu-ról, majd adjuk ki a következő parancsot.

	gpsbabel -i gpx -f caches.gpx -o garmin -F usb:

A `gpx` paraméter az input formátumra, a `garmin` paraméter az output formátumra utal. A `-f` paraméter mögött az input állomány, a `-F` paraméter mögött az output állomány áll, most speciálisan az `usb:` érték, hiszen a GPS az USB portra van rádugva.

Az előző parancs alapján kitalálható, hogyan töltsünk le adatot a GPS-ről a GPSBabel alapján.

	gpsbabel -i garmin -f usb: -o gpx -F output.gpx

### GPSmap 60

Én egy [GPSMAP 60](https://www8.garmin.com/support/download_details.jsp?id=797) készülékkel rendelkezem.

Az eszköz nem támogatja a USB Mass Storage Mode-ot.

A GPS adatok fel- és letöltése a GPSBabel alkalmazásból tökéletesen ment. Ha a GPS eszközön a geoládák vannak kiválasztva, és a GPSBabellel töltök fel újakat, azok azonnal megjelennek a GPS képernyőjén anélkül, hogy bármilyen gombot is nyomni kéne. 

![GPSmap 60](/artifacts/posts/images/gpsmap60.jpg)







