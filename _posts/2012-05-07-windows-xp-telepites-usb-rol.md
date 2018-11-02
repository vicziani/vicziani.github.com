---
layout: post
title: Windows XP telepítés USB-ről
date: '2012-05-07T13:40:00.000-07:00'
author: István Viczián
tags:
- windows
modified_time: '2018-06-09T10:00:00.000-08:00'
---

A feladat, hogy telepítsünk egy olyan notebookra Windows XP-t, melyen
már elromlott a CD meghajtó. Az USB-ről történő telepítést választottam.
A következő lépéseket kell elvégezni.

-   Ellenőrizzük, hogy a notebook tud-e USB-ről bootolni. Az én Acer
    TravelMate 4000-em nem írt ki ilyen opciót, de amikor egy bootolható
    USB-t tettem hozzá, a HDD-k alatt megjelent (+ jellel jelzi, hogy ki
    lehet nyitni, és ott bújt meg a Kingston USB meghajtóm). A BIOS-ba
    F2-vel lehetett bejutni, vagy F12 hozta be a boot menüt - ez utóbbit
    csak annak BIOS-ban való bekapcsolása után.
-   Töltsük le a [WinToFlash](http://wintoflash.com/) programot.
-   A Windows XP telepítő lemezünket húzzuk be iso-ba. Én erre a
    [ImgBurn programot](http://www.imgburn.com/) használtam. Erre azért
    van szükség, mert lehet, hogy többször is meg kell ismételni a
    műveletet, és winyóról gyorsabb.
-   Mount-oljuk be a Windows XP iso image-t. A WinToFlash nem tud
    közvetlen iso-t kezelni. Én erre a
    [Daemon-Tools-t](http://www.daemon-tools.cc/eng/home) használom.
-   A WinToFlash-el másoljuk a Windows-t a Flash drive-ra wizzard
    módban. Engedjük, hogy formázza. A pendrive-on minden adat el fog
    veszni.
-   Csatlakoztassuk a pendriveot a notebookhoz. Boot-oljunk be. A
    BIOS-ban ki kell választani, hogy a pendrive-ról boot-oljon, nekem
    F6-tal cserélte meg a HDD és a pendrive sorrendját. No nekem itt
    volt az első probléma, a 4 gigás pendrive esetén csak villogott a
    kurzor. Ekkor a WinToFlash egyéni telepítését válasszuk, és FAT32
    helyett FAT16-ot válasszunk.
-   Boot után jöhet a telepítés, majd másodszor is engedjük, hogy a
    pendrive-ról boot-oljon, utána viszont távolítsuk el. Nekem a
    telepítő kiírta, hogy bizonyos fájlokat nem tud másolni, ott Esc-t
    nyomtam, hogy hagyja ki. Eddig nem vettem észre, hogy bármi baj lett
    volna belőle.

Próbálkoztam a
[WindSetupFromUSB](http://www.msfn.org/board/topic/120444-how-to-install-windows-from-usb-winsetupfromusb-with-gui/)
programmal is, de azzal én nem jártam sikerrel. (Lehet, hogy a második
boot-nál rontottam el valamit.) Erről van egy jó kis [magyar nyelvű
leírás](http://pomiweb.com/?p=1086) is.
