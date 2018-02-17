---
layout: post
title: Raspberry PI alapok
date: '2013-12-30T14:25:00.001-08:00'
author: István Viczián
tags:
- Raspberry PI
modified_time: '2018-02-17T18:22:03.269+01:00'
---

### Mi is ez?

A [Raspberry PI](http://www.raspberrypi.org/) egy oktatási célra
létrehozott bankkártya méretű nagyon olcsó számítógép. A nagyon olcsó
azt jelenti, hogy a többet tudó B verzió kb. 13 000 Ft itthon (én most
erről fogok írni).

Mit is kapunk ennyiért? Ez egy single-board computer (SBC), azaz egy
kicsiny áramköri lapra van integrálva az egész. Egy Broadcom BCM2835
system-onchip (SoC) van rajta, mely magába foglal egy ARMv6 alapú
processzort, egy GPU-t, és 512 MB RAM-ot. A GPU-nak köszönhetően képes
1080p/Full HD (1920x1080 pixel) videót is lejátszani. Tényleg komolyan
gondolták, hogy olcsó legyen, és ne kelljen hozzá sok minden. Ezért van
rajta pl. csak HDMI és egy kompozit RCA port, hiszen így biztos van a
családban legalább egy TV vagy monitor, amire rá lehet dugni. Alapvetően
SD kártyára telepíthető az operációs rendszer (ezt is azért, mert ilyen
biztosan van a háztartásban, és a gyerekek is könnyebben tudják kezelni,
mint egy micro sd kártyát). Két USB 2.0 csatlakozó van rajta, egy
10/100-as Ethernet csatlakozó. Hangot HDMI-n, vagy 3,5 mm-es jack
csatlakozón keresztül ad. A tápellátást MicroUSB-n keresztül kapja, 700
mA-re van szüksége. De ami igazán érdekessége, hogy van rajta egy
general-purpose input-output (GPIO) portja is, melyre különböző érdekes
dolgokat lehet kötni, mint ledek, nyomógombok, hőmérséklet/légnyomás
érzékelők, szervómotorok, stb.

<a href="/artifacts/posts/2013-12-30-raspberry-pi-alapok/800px-RaspberryPi.jpg" data-lightbox="post-images">
![Raspberry PI](/artifacts/posts/2013-12-30-raspberry-pi-alapok/800px-RaspberryPi_600.jpg)
</a>

Többféle Linux disztribúciót is rá lehet tenni, legelterjedtebb a Debian
alapú Raspbian OS.

Nagyon jól illik a manapság nagyon hangzatos Internet of Things (IoT)
irányvonalba. Nagyon sok cég fordít rá hatalmas erőforrásokat, pl. az
Oracle is nagyon nyomja, hogy a Javat portolja rá, jelenleg pl.
alapértelmezetten része a Raspbian OS-nek is. 2013 novemberében volt
hír, hogy már kétmillió darabot adtak el belőle. Nekem a nevének eredete
is újdonság volt, azért lett gyümölcs, mert szerencsét hoz a
hardvergyártás terén, és a PI a Pythonra utal, mely az első számú
programozási nyelv.

### Mire akarom használni?

-   Oktatás: mivel az oktatás folyamatosan érdekel, és művelem, érdekel,
    hogy ez az eszköz milyen lehetőséget biztosít. Mennyire állná meg a
    helyét, milyen ez irányú törekvések vannak. Nagyon szeretnék hallani
    ilyen jellegű magyarországi próbálkozásokról.
-   Fizikai világ és legózás: Szerintem ez az első olyan eszköz, mely
    mélyebb szaktudás nélkül lehet a való világgal kapcsolatot
    létesíteni, pl. ledeket villogtatni, nyomógombokat érzékelni. És
    igen, szeretek legózni, és ez nagyságrenddel olcsóbb, mint a [Lego
    Mindstorms](www.lego.com/en-us/mindstorms/) készlet, nem is beszélve
    a hozzá való alkatrészek áráról és mennyiségéről.
-   Linux: legyen a háztartásban egy állandóan hozzáférhető Linux. Nem,
    nem akarom, hogy a notebook-om első számú operációs rendszere
    Linux legyen. Nem akarok virtuális gépet sem, és átbootolni sem.
-   Python: ezen programozási nyelv iránti rajongásom tudom kiélni ezen
    az eszközön.
-   Állandóan futó környezet: alacsony energiafelhasználása miatt nem
    sajnálom éjjel-nappal bekapcsolva hagyni, így különböző apró
    szerverfunkciókat képes ellátni.
-   Házautomatizálás: ez még a titkos vágyak között van, így semmiképp
    nem árulnék el róla többet.

### Mire nem akarom használni?

Nem akarok belőle otthoni média centert. Szerintem erre nem alkalmas,
sokkal inkább hiszek más céleszközökben.

### Van jobb?

Igen. De mivel ez hype-olt, erről található a legtöbb anyag a neten,
semmiképp nem választanék mást.

### Mi kell még hozzá?

Fontos, hogy csak olyan kiegészítőt vásároljunk, melyről biztosan
tudjuk, hogy kompatibilis, ebben segít a [RPi
VerifiedPeripherals](http://www.elinux.org/RPi_VerifiedPeripherals)
oldal. Szükség van még egy MicroUSB töltőre. Nagyon érzékeny erre,
érdemes jó minőségűt választani, különben rejtélyes lefagyásokat
tapasztalhatunk. Kell egy SD kártya, minimum 4 gigás, állítólag a class
4 elegendő, a gyorsabbat úgysem tudja kihasználni. Billentyűzet, egér,
monitor/tv nekem csak addig kellett, míg be nem állítottam az ssh
elérést. Mivel nincs közelben Ethernet kábel, vettem egy [Edimax
EW-7811UN Wireless N 150Mbps USB Nano
Adaptert](http://www.edimax.com/en/produce_detail.php?pd_id=347&pl1_id=1),
mely az eBay-ről 2400 Ft-ból meg volt, könnyen telepíthető (csak egy
[konfig fájlban kellett három sort
módosítani](http://pi.rook.hu/raspberry-pi-konfiguracio-a-halozat-2013-06.html)),
kifogástalanul működik.

![Edimax EW-7811UN Wireless N 150Mbps USB Nano Adapter](/artifacts/posts/2013-12-30-raspberry-pi-alapok/EW-7811Un_217X205.jpg)

Feltehetően szükség lesz egy USB hub-ra is. Ebből saját tápellátással
rendelkezőt érdemes venni, hogy pl. egy külső winyót is meg tudjon
hajtani.

### Telepítés

Rengeteg angol és magyar nyelvű leírást találtam a neten, ezt nem
részletezném. Letöltöttem a Raspbian OS image-et, majd felírtam az SD
kártyára, és be is bootolt. A boot után azonnal egy konfigurációs
képernyő jelent meg, amin azonnal ki lehetett választani, hogy
megnövelje az SD kártya méretére a partíciót, billentyűzetkiosztást
választhattam és beállíthattam az SSH távoli elérést.

### Források

A [Raspberry Pi User
Guide-ot](http://www.amazon.co.uk/Raspberry-User-Guide-Eben-Upton/dp/111846446X)
lapoztam végig gyakorlatilag két nap alatt. Mivel az egyik írója a
Raspberry PI egyik kitalálója, érdekes volt a bevezetést olvasni. Már
ebben is vannak elavult információk, tehát a neten érdemes keresgélni.
Amúgy ezen kívül is már egy rakat könyv van. Érdekes olvasmány a [The
MagPI](http://www.themagpi.com/) magazin, mely havonta jelenik meg, és
érdekes cikkeket közöl a PI világából.

### Tippek és trükkök

Az alapértelmezett felhasználónév/jelszó a pi/raspberry.

Az első bootoláskor elinduló konfigurációs alkalmazást a következő
paranccsal lehet később elindítani.

    sudo raspi-config

Újraindítás

    sudo shutdown -r now

Leállítás

    sudo halt -h

A telepített csomagok között megtalálható a vi szövegszerkesztő, kevésbé
mazohistáknak nano. Zip-eket az unzip paranccsal lehet kibontani.

A chip hőmérsékletét a következő paranccsal tudhatjuk meg:

    vcgencmd measure_temp

Amennyiben pendrive-ot kötünk rá, parancssorból előbb mountolni kell
azt. Ha csak egy van rádugva, az a /dev/sda eszköz lesz, melynek az első
partíciója /dev/sda1. A következő parancsokkal listázhatóak az eszközök:

    sudo fdisk -l

Majd hozzunk létre egy könyvtárat a /media könyvtárban, adjunk rá jogot
a felhasználóknak, majd mountoljuk be:

    sudo mkdir /media/externaldrive
    sudo chgrp -R users /media/externaldrive
    sudo chmod -R g+w /media/externaldrive
    mount /dev/sda1 /media/externaldrive -o rw

A könyv javasolja, hogy hozzunk létre saját felhasználót, és
változtassuk meg a jelszavát.

    sudo useradd -m -G adm,dialout,cdrom,audio,plugdev,users,lpadmin,sambashare, \
      vchiq,powerdev username
    sudo passwd username

Csomagkezelője az apt package manager, melyekkel tudunk akár egy
paranccsal szoftvereket telepíteni internet eléréssel. (Ez amúgy a
Debian dpkg csomagkezelőjének frontendjének indult, később lett
általánosabb.)

Telepítés előtt érdemes a cache-ét frissíteni:

    apt-get update

A már telepített csomagokat a következő paranccsal tudjuk kilistázni:

    Telepített csomagok listázása
    dpkg --get-selections

Remek parancssori zenelejátszó pl. a moc, telepítése:

    sudo apt-get install moc

Ezzel a paranccsal lehet frissíteni is a csomagokat, ha azok már
telepítve vannak. A lejátszót elindítani a mocp paranccsal lehet.

Csomagot eltávolítani az apt-get remove kapcsolójával lehet, ez azonban
meghagyja a konfigurációs állományokat. Ha azokat is törölni szeretnénk,
akkor a purge a barátunk.

Előre telepített parancssoros lejátszó az omxplayer, melyet
paraméterezni lehet, hogy a HDMI-n játszon le, remekül viszi a H.264
formátumú fájlokat.

    omxplayer -o hdmi videófájlnév

A Raspbian OS alapból a Lightweight X11 Desktop Environment (LXDE)
ablakkezelővel van felszerelve, az elején kiválaszthatjuk, hogy mindig
ez induljon el, bár én még el sem indítottam, kizárólag távoli
terminálról használom.

![Raspberry Pi ikon](/artifacts/posts/2013-12-30-raspberry-pi-alapok/Raspi_Colour_R_300.png)

Raspberry Pi is a trademark of the Raspberry Pi Foundation
