---
layout: post
title: Otthoni radar egy dvb-t stickkel
date: '2013-12-16T14:42:00.000-08:00'
author: István Viczián
tags:
- aircraft
modified_time: '2018-02-17T18:22:03.269+01:00'
---

Ahogy [előző
postban](/2013/10/27/hogy-mukodik-a-flightradar24.html)
írtam, egy 12 dolláros usb-s dvb-t stickkel is tudjuk venni a
repülőgépek Mode S transzponderei által küldött jeleket. (Közben
megtaláltam Zerkowitz István folytatásos cikkét, a Mode S és ADS-B
jelekről. Akit érdekel a téma olvassa el, az író tevékenyen részt vett a
szabványok kialakításában - [1.
rész](http://iho.hu/blogpost/jelek-a-magasbol-1-radarokrol-transzponderekrol-131105),
[2.
rész](http://iho.hu/blogpost/jelek-a-magasbol-2-transzponder-turbo-131106).)
Ezeket utána dekódolni kell, amit szövegesen, és a hordozott
információkat vizuálisan, egy radar képernyőn is megjeleníthetjük. Az
már csak hab a tortán, hogy ezeket utána más felhasználóknak, vagy akár
webes szolgáltatások felé is továbbíthatjuk.

Természetesen én is azonnal rendeltem egy ilyen eszközt az
[EBay-ről](http://www.ebay.com/itm/New-FM-DAB-USB-DVB-T-RTL2832U-R820T-with-MCX-connector-antenna-hot-sell-90x28x15-/150931597346?pt=US_Video_Capture_TV_Tuner_Cards&hash=item2324396822).
Két hét alatt meg is érkezett, melyen semmi gyártójelzés nem látható. A
lényeg, hogy olyan eszközt rendeljük, melyben a RTL2832U és a R820T chip
van.

<a href="/artifacts/posts/2013-12-16-otthoni-radar-egy-dvb-t-stickkel/rtl2832u-r820t-mini-dvb-t-dab-fm-usb-digital.jpg" data-lightbox="post-images">
![DVB-T usb stick](/artifacts/posts/2013-12-16-otthoni-radar-egy-dvb-t-stickkel/rtl2832u-r820t-mini-dvb-t-dab-fm-usb-digital_600.jpg)
</a>

Első körben venni szerettem volna a repülőgépek jeleit, majd ezek
alapján egy virtuális radaron megjeleníteni őket. Ehhez a következő
lépéseket kell elvégezni:

-   USB driver telepítése
-   Dekóder telepítése
-   Virtuális radar telepítése

A hardver elemről, különböző antennákról és a választható szoftverekről
[itt](http://www.rtl-sdr.com/adsb-aircraft-radar-with-rtl-sdr/) egy jó
cikk.

Először dugjuk be a sticket egy megfelelő USB portba (egyszerűbb egy
hosszabbítóval). (Azt észrevettem, hogy az eszköz meglehetősen forró
üzem közben, sokan ezt úgy oldják meg, hogy leveszik a műanyag házat.)
Fontos, hogy nem szabad feltenni az eszközhöz adott drivert, a Windows
által feldobott ablakokon nyomjunk végig Cancel gombot. E helyett egy
[WinUSB](http://en.wikipedia.org/wiki/WinUSB) drivert kell
feltelepíteni. Ez gyakorlatilag egy API-t biztosít az USB eszközhöz, nem
kell drivert írni az eszközhöz való kommunikációhoz. Hátránya, hogy
egyszerre csak egy program kapcsolódhat az eszközhöz. Ezt
legegyszerűbben a [Zadig](http://zadig.akeo.ie/) szoftverrel tudjuk
megtenni.

Az Options menüből először válasszuk ki a List All Devices menüpontot,
majd középen válasszuk ki az "Bulk-In, Interface (Interface 0)" eszközt.
Majd válasszuk ki a "WinUSB (v6.1.7600.16385)" drivert és nyomjuk meg az
"Install Driver" gombot. Jegyezzük meg, hogy melyik USB portot
használtuk, mert legközelebb is erre kell dugni a sticket, vagy a
másikra is feltelepíteni a drivert. Sokan panaszkodtak, hogy az USB 3.0
porton problémák voltak, így az USB 2.0 portokat használjuk.

![WinUSB](/artifacts/posts/2013-12-16-otthoni-radar-egy-dvb-t-stickkel/dvbt-stick-60_500.jpg)

Majd következhet a dekóder feltelepítése. A következők közül
választhatunk:

-   [ADSB\#](http://sdrsharp.com/index.php/a-simple-and-cheap-ads-b-receiver-using-rtl-sdr)
    az SDR\# (SDR sharp), az egyik legelterjedtebb software defined
    radio alkotóitól.
-   [RTL1090](http://rtl1090.com/) több beállítási lehetőséggel, mint az
    ADSB\#, de rosszabb dekódolással. A betaban lévő version 2 már jobb
    dekódolást ígér.
-   [dump1090](https://github.com/antirez/dump1090) Linux dekóder, mely
    a Raspberry Pi-hez is használható.
-   [Cocoa1090](http://www.blackcatsystems.com/software/cocoa1090.html),
    dekóder Mac OS X-re.
-   [gr-air-modes](https://www.cgran.org/wiki/gr-air-modes), mely egy
    [GNU Radio](http://www.gnuradio.org/) plugin. Ez utóbbi egy másik
    software defined radio eszköz.

Én az RTL1090 programot választottam, mely egy nem hangolható 1090
MHz-es vevő és Mode S dekóder. Először töltsük le, majd csomagoljuk ki.
Azonban ennyi nem elegendő, ugyanis ez az
[rtl-sdr](http://sdr.osmocom.org/trac/wiki/rtl-sdr) library-t használja
a stickkel való kommunikációra, amitől kapott adatokat aztán dekódolja.
(Az RTL-SDR egy nyílt forrású software defined radio, mely a RTL2832
chippekre készült.) Az előre lebuildelt csomag Windowsra is
[letölthető](http://sdr.osmocom.org/trac/attachment/wiki/rtl-sdr/RelWithDebInfo.zip).
Ezt csomagoljuk ki, majd a rtl-sdr-release/x32/ könyvtárban található
rtlsdr.dll, msvcr100.dll és libusb-1.0.dll fájlokat másoljuk az RTL1090
könyvtárába.

A programot elindítva, majd a Start gombra nyomva a következő üzeneteket
kaptam:

    ========================================
    rtl1090 V 0.9.0.100 (c) jetvision.de 2013
    ========================================
    Commandline: /run

    Started...
    1 RTLSDR device(s) found.
    Device:"ezcap USB 2.0 DVB-T/DAB/FM dongle"
    TCP server port opened: 31001
    UDP receiver port opened: 31002
    UDP target is: 127.0.0.1:31012
    Device opened: "150810088"
    ** Manufacturer: Realtek
    ** Product:      RTL2838UHIDIR
    ** Serial:       00000001
    Tuner type: "Rafael R820T"
    RTL Xtal Freq:   "28800000 Hz"
    TUNER Xtal Freq: "28800000 Hz"
    Gains: 0,9,14,27,37,77,87,125,144,157,166,197,207,229,254,280,297,328,338,364,372,386,402,421,434,439,445,480,496
    Gain: 25,4 dB
    Sample rate: 2000000 S/s
    RTL AGC set ON
    Tuner gain set to AUTO
    Freq correction: 0 ppm
    Freq set: "1090000000 Hz"
    Buffer cleared
    Started ...

Ekkor valami hasonlót kell látnunk:

![RTL1090](/artifacts/posts/2013-12-16-otthoni-radar-egy-dvb-t-stickkel/rtl1090.png)

A program
[kézikönyve](http://rtl1090.com/homepage/index.php?way=1&site=READOUT&DERNAME=Manual&dm=rtl1090&USER=rtl1090&goto=1&XURL=rtl1090&WB=1&EXTRAX=X&PIDX=102385)
igen jó, a képernyőn a következőket érdemes figyelni. Felül a frekvencia
található (1090 MHz), majd a vezérlő komponensek. Kezdésnek az RTL AGC
és TUNER AGC legyen bekapcsolva. Amennyiben a List gomb nincs benyomva,
a repülőktől érkező jeleket listázza, amennyiben viszont nincs benyomva,
a "látható" repülőgépek listáját jeleníti meg középen (un. Flight
table). Alul a státuszsor található.

A táblázatban a következő oszlopok lehetnek érdekesek:

-   ICAO: ICAO kód
-   C/S (callsign): hívójel
-   ALT (altitude): magasság, \*100 láb, valamint a gép fedélzeti
    műszerén ([MCP
    panel](http://en.wikipedia.org/wiki/Mode_control_panel))
    beállított magasság. Látható, hogy mint a legtöbb repülőgépes érték,
    megadása angolszász mértékegységben történik.
-   V/S (vertical speed): függőleges sebesség perc/láb
-   GS (ground speed): a gép földhöz viszonyított sebessége (csomó)
-   TT (true track): a repülőgép mozgásának iránya, mágneses északhoz
    képest a mozgás iránya (fokban). Ez nem mindig a repülőgép hosszanti
    tengelyének iránya a szelek miatt.
-   SSR (secondary surveillance radar): SSR kód.

A színeknek is van jelentésük. Leggyakoribb a zöld, ami ezt jelenti,
hogy tartja a magasságát, a barna emelkedik, a világoskék ereszkedik, a
szürke eltűnt a látómezőből.

A Max/Min gombra bármikor rá lehet kattintani, nekem a következőket írja
ki:

    Searching frequencies...please wait...
    Lowest tuner freq set: "4255977,296 kHz
    Highest HF freq set: "1769000" kHz"
    Max/min/gap search completed...
    Freq set: "1090000000 Hz"

Érdekesség, ha több stickünk van, akkor több példány is futhat, és egy
ezek közül aggregátorként viselkedhet, mely összegyűjti a többitől az
adatokat.

Ehhez a programhoz több virtuális radart is lehet kapcsolni, melyek a
következők:

-   [Virtual Radar Server](http://www.virtualradarserver.co.uk/), mely
    egy .NET alkalmazás, mely egy webszervert futtat, amihez böngészővel
    lehet kapcsolódni, és a repülőket Google Map-en jeleníti meg
-   [PlanePlotter](http://www.coaa.co.uk/planeplotter.htm): 21 napig
    ingyenes, majd 12 EUR. Tudásban magasan a többi fölött áll.
-   [adsbScope](http://www.sprut.de/electronic/pic/projekte/adsb/adsb_en.html)
-   [Globe-S for
    RTL1090](http://rtl1090.jetvision.de/homepage/index.php?way=1&site=READOUT&DERNAME=Globe-S%20RTL1090&dm=rtl1090&USER=rtl1090&goto=1&XURL=web99.de&WB=1&EXTRAX=X&PIDX=104245),
    a Globe-S RTL1090-hez ingyen letölthető változat, egy egyszerű radar
-   [Basestation](http://www.kinetic-avionics.com/basestationdownloads1.php#1),
    Kinetic Avionics hardverekhez adott szoftver

Ezen kívül a RTL1090 persze a Flightradar24 szoftverét is képes
adatokkal ellátni.

Én a Globe-S for RTL1090 programot választottam, mert ezt adják az
RTL1090-hez, valamint hasonlít ahhoz, amit radar képernyőnek képzelek
el. Nem utolsó sorban jó
[kézikönyve](http://jetvision.de/sbs/globesafe/globesafe.demo.manual.pdf)
is van. Vigyázat, a kézikönyv nem a RTL1090 verziót írja le, de
minimális a különbség, néhány fejlettebb funkció hiányzik csak.

<a href="/artifacts/posts/2013-12-16-otthoni-radar-egy-dvb-t-stickkel/globes.png" data-lightbox="post-images">
![Globe-S for RTL1090](/artifacts/posts/2013-12-16-otthoni-radar-egy-dvb-t-stickkel/globes_600.png)
</a>

Először az RTL1090 programban nézzük meg, hogy mi szerepel a Table 2
beviteli mezőben. Ide érdemes egyedi jelszót megadni publikusan látható
szerver esetén. Az RTL1090 alapesetben a 31008 porton egy http szervert
indít, és az adatokat dekódolva itt szolgáltatja szöveges formátumban, a
mezőket egymástól kettősponttal elválasztva. Ha a Table 2 mellett pl.
ABCD1234 szerepel, akkor ezt kipróbálhatjuk a
http://localhost:31008/ABCD1234 címen. A táblázatot akár saját
szoftverben is feldolgozhatjuk, ugyanis a [mezők
leírása](http://rtl1090.jetvision.de/homepage/index.php?way=1&site=READOUT&DERNAME=Srv%20Table%202%20%280-45%29&dm=rtl1090&USER=rtl1090&goto=1&XURL=rtl1090&WB=1&EXTRAX=X&PIDX=104415)
letölthető.

A Globe-S for RTL1090 ezen az interfészen keresztül fogja lekérni az
adatokat. Kicsomagolás és elindítás után a "Configure data interface"
ablakon (Ctrl + C billentyűkombinációval, vagy a fogaskerekekkel hozható
elő) kell megadni az ip-címet (127.0.0.1, azaz a saját gép), valamint a
portot, ami alapesetben 31008. Valamint adjuk meg az RTL1090 program
Table 2 mezőjébe beírt szöveget. Ha minden jól megy, alul a Data traffic
zölden villogni kezd, és az RTL1090 programban is az utolsó led (Request
to HTTP server at port 310x8), és a radarképernyőn megjelennek a
repülőgépek.

És végül néhány szó a Globe-S for RTL1090 használatáról, hiszen nem
triviális. Első indításnál két ablak jelenik meg, mely külön
konfigurálható. Egérrel mozgatható, görgővel nagyítható/kicsinyíthető.
Mindkettő alján egy Control Bar található, melyet a szóköz billentyűvel
lehet megjeleníteni vagy eltüntetni. A Control Bar első két gombjával
lehet az ablakokat megjeleníteni vagy eltüntetni. A képernyő jobb felső
sarkában található a képernyő azonosítója, a képernyő közepének
koordinátája, a frissítés gyakorisága, a magasság, és hogy kapcsolódott
az RTL1090 programhoz. Az F1 billentyű hatására egy rövid súgó jelenik
meg a billentyűkombinációkról. A radar ikonra kattintva (Configure map)
megadhatjuk a koordinátáinkat. Ezt pl. Androidon a GPS Test vagy GPS
Státusz programok futtatásával tudjuk kinyerni. Ha nincs GPS-szel
rendelkező mobilunk, akkor elegendő a Google Térképen a megfelelő helyre
kattintani, és kiírja a keresőmező alatt. A METAR panelen megadva a
repülőtér ICAO kódját (LHBP a Budapest Liszt Ferenc Nemzetközi Repülőtér
kódja), és Auto-ra kapcsolva megjelennek a meterológiai információk a
képernyő alján.

A képernyő bal felső sarkában a repülőgép körül lévő kör méretét
szabályozhatjuk. Mellette magasság szerint tudunk szűrni, alapesetben
minden gép látható (GND ground - UNL unlimited), váltani az egér
görgőjével lehet. Mellette az idő UTC-ben, valamint a helyi idő. A MAX
gombbal maximalizálni lehet az ablakot, az NRM gombbal vissza
kicsinyíteni.

A Label editor a Ctrl - L billentyűkombinációra, vagy az A ikonra
kattintva jelenik meg. Itt szerkeszthetjük, hogy mi jelenjen meg egy
repülőgépről, ha nincs kiválasztva, ha ki van választva, vagy ha a
földön van. Amennyiben kiválasztunk egy repülőt, bővebb adatok jelennek
meg, a címkét a jobb klikkel tudjuk odébb rakni. Bal fent is megjelennek
a repülőgép adatai, és a jobb alsó sarokban megjelenik a pozíciónktól
való iránya, valamint a távolsága. Ha még egy repülőgép fölé visszük az
egeret, megnézhetjük, hogy jelenlegi irányuk alapján hol kereszteznék
egymás útját. A jegyzetfüzet lap ikon megnyomásával a repülőgépek
listája jelenik meg.
