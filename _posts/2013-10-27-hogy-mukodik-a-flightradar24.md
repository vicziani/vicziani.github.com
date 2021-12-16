---
layout: post
title: Hogy működik a Flightradar24? Akár én is vehetem a repülőgépekről érkező jeleket?
date: '2013-10-27T15:59:00.000-07:00'
author: István Viczián
tags:
- Linux
- windows
- aircraft
- Raspberry PI
modified_time: '2018-02-17T18:22:03.269+01:00'
---

A [Flightradar24](http://www.flightradar24.com) egy érdekes
szolgáltatás, mely valós időben jeleníti meg a Google Mapsen a legtöbb
repülőgép helyzetét, és számos információt, mint típus, lajstromjel,
járatszám, magasság, sebesség, stb. Egyrészt elérhető weben is, de az
összes nagy mobil platformon is van kliense.

<a href="/artifacts/posts/2013-10-27-hogy-mukodik-a-flightradar24/flightradar.png" data-lightbox="post-images">
![Flightradar24](/artifacts/posts/2013-10-27-hogy-mukodik-a-flightradar24/flightradar_600.png)
</a>

Hogyan is működik? A szolgáltatás több forrásból gyűjti be az adatokat,
ezek közül a legfontosabb az ADS-B, de figyelembe veszi még az MLAT és
FAA adatokat, valamint adatokat vesz át a repülőtársaságoktól,
repterekről, sőt saját adatbázissal is rendelkezik. A legfontosabb
mindenképp az
[ADS-B](http://en.wikipedia.org/wiki/Automatic_dependent_surveillance-broadcast)
(Automatic dependent surveillance-broadcast), mely széles körben
alkalmazott eljárás a repülőgépek nyomon követésére. Alapja, hogy a
repülőgépek műholdas helyzetmeghatározó rendszer segítségével (pl. GPS)
ismerik a saját pozíciójukat, és ezt egy csomó más adattal együtt
rádiófrekvencián keresztül sugározzák. Ezeket a jeleket földi
vevőkészülékek veszik, és küldik az adatokat a Flightradar24
szolgáltatásnak.

![Működési elv](/artifacts/posts/2013-10-27-hogy-mukodik-a-flightradar24/adsb.jpg)

A következő adatokat küldi a gép: lajstromjel, magasság, heading - a
repülőgép hosszanti tengelyének iránya, géptengelyirány -, pozíció,
squawk, sebesség. A következőket fogadja a földi adótól: időjárás
(FIS-B), terep, információkat különböző veszélyekről és tiltásokról
(rendre [NOTAM](http://en.wikipedia.org/wiki/NOTAM), és
[TFR](http://en.wikipedia.org/wiki/Temporary_flight_restriction#Temporary_flight_restrictions)
TIS-B használatával) és forgalmi adatok (környező gépek lajstromjele,
magassága, géptengelyiránya, sebessége és távolsága).

![Jelmagyarázat](/artifacts/posts/2013-10-27-hogy-mukodik-a-flightradar24/jelmagyarazat.png)

Nem minden repülőgépen van ilyen szerkezet, de a különböző
szabályozásoknak köszönhetően egyre többre kerül, hiszen ez a
technológia lesz az elsődleges felügyeleti rendszer, átvéve ezt a
szerepet a radaroktól. A repülők mintegy 60%-án van ilyen berendezés,
főként Európában. A sugárzás magas frekvencián történik (1090 MHz), így
egy földi antenna kb. 250 - 400 km távolságból veheti a jeleket. Európa
98%-a le van fedve vevőkészülékekkel. Vannak persze kevésbé lefedett
területek, és a távolság miatt az óceánok felett repülő gépek jeleit sem
egyszerű fogni. Az egyesült államokban a klasszikus radar alapú
rendszert a
[NextGen](http://en.wikipedia.org/wiki/Next_Generation_Air_Transportation_System)
fogja leváltani a 2012 - 2015 közötti időszakban, melynek négy fő pontja
közül az egyik az ADS-B bevezetése. Ez lehetővé teszi, hogy a gépek
közelebb mehessenek egymáshoz, jobb útvonalon repülve, ezzel üzemanyagot
és időt megtakarítva.

Mi volt az ADS-B technológia előtt, mi van, ha a gépet még nem szerelték
fel ADS-B technológiával? Mint említettem, az ADS-B a radarokat hivatott
leváltani. Az elsődleges radar azonban csak a repülőgép helyzetét
ismeri, hiányoznak egyéb járulékos információk. Ezért létezik egy másik
technológia is, a [secondary surveillance
radar](http://en.wikipedia.org/wiki/Secondary_Surveillance_Radar) (SSR).
A földi állomás ún. interrogációs impulzusokat küld a gépnek (1030 MHz
frekvencián), amit egy gépre szerelt transzponder (transmitter és
responder szavak keresztezéséből) vesz, és válaszol (1090 MHz
frekvencián). Ezt a földön egy másik radar veszi. A régebbi
transzponderek Mode A és Mode C módban voltak képesek működni, előbbi
alkalmas a gép négyjegyű azonosítójának, az utóbbi pedig a magasságának
elküldésére. A négyjegyű azonosító visszaküldése a "Squawk". A
számjegyek 0-tól 7-ig állíthatóak, így 4096 különböző lehetőség van.
Ebből adódik, hogy ez nem fix, hiszen a gépeket nem lehet ezzel
egyedileg azonosítani, hanem a pilóta állíthatja be. A Mode S már
modernebb, egyrészt minden géphez tartozik egy egyedi 24-bites számsor
(ICAO), amit képes elküldeni, valamint egy új protokollt is bevezet,
melyen át egyéb információk is küldhetőek, pl. a gép sebessége,
irányszöge, üzemanyagszintje, stb. Ezen kívül lehetőség van két gép
közötti kommunikációra is, veszélyes helyzetekben képes lekommunikálni,
hogy melyik emelkedjen, és melyik süllyedjen.

<a href="/artifacts/posts/2013-10-27-hogy-mukodik-a-flightradar24/PA251740.JPG" data-lightbox="post-images">
![Radar](/artifacts/posts/2013-10-27-hogy-mukodik-a-flightradar24/PA251740_600.JPG)
</a>


A Flightradar24 speciális földi vevői szintén ezeket a jeleket fogják.
Ezekből [multilateration](http://en.wikipedia.org/wiki/Multilateration)
(MLAT) segítségével számítják ki (10-100 méteres pontossággal) a
repülőgép helyzetét. Ezekben a földi vevőkben ugyanis mindegyikben van
egy GPS, így ismerik a saját koordinátájukat, valamint mivel a GPS
technológia is idő alapú távolságmérésen alapul, egy rendkívül pontos
(atomórához igazított) órával is rendelkeznek. Így a földi vevők
pozíciójából, valamint abból, hogy a jel ezekhez mennyi idő alatt ér el
(Time Difference of Arrival - TDOA), ki tudják számolni a repülőgép
helyzetét. Ehhez minimum négy földi vevő kell.

![Multilateration](/artifacts/posts/2013-10-27-hogy-mukodik-a-flightradar24/Multilateration.jpg)

Az ADS-B adók módosított Mode S transzponderek.

A Flightradar24 ezen kívül adatot vesz át a Szövetségi Repülési
Hivataltól (Federal Aviation Administration, USA - FAA) is vesz át
adatokat. Ezek azonban a jelenlegi szabályozás miatt 5 perces
késleltetéssel érkeznek.

Hogyan helyezte el a Flightradar24 a földi vevőket, hogy ilyen nagy
lefedettséget tudott elérni? Úgy, hogy bárki rendelhet ilyen egységet.
Abban az esetben, ha olyan helyen vagy, ahol alacsony a lefedettség,
[ingyen kaphatsz
ilyent](http://www.flightradar24.com/free-ads-b-equipment). A szerkezet
valójában egy kis számítógép, egy GPS modullal, és egy Mode-S Beast
ADS-B vevővel és dekóderrel, ezen kívül jár hozzá egy GPS és ADS-B
antenna, és a megfelelő kábelek. A tetőre kell szerelni az antennát,
hogy 360 fokban tudja venni a jeleket, és hálózatra kell dugni, hogy a
nap 24 órájában küldje az adatokat a Flightradar24 szolgáltatásnak.
Ekkor persze ingyen kapunk Pro tagságot.

![Flightradar24 földi egység](/artifacts/posts/2013-10-27-hogy-mukodik-a-flightradar24/free-ads-b-equipment-66_400.jpg)

Amennyiben jó lefedettségű helyen vagyunk, akkor sem kell lemondanunk
arról, hogy a repülőgépek jeleit foghassuk, és amennyiben szeretnénk,
Pro tagságért cserébe küldjük az adatokat a Flightradar24
szolgáltatásnak. Egyrészt az előbbi egységbe épített ADS-B vevő és
dekóder ([Mode-S Beast](http://www.modesbeast.com/)) külön is
megvásárolható, ami egy professzionális eszköz, ennek megfelelően kb.
százezer forintért juthatunk hozzá. Azonban van egy olcsóbb megoldás is.
Az [EBay-ről
rendelve](http://www.ebay.com/sch/i.html?_trksid=p2050601.m570.l1313.TR0.TRC0&_nkw=RTL2832U%2FR820T&_sacat=0&_from=R40)
kb. 2000-3000 forintért juthatunk hozzá DVB-T usb stickekhez, melyek az
alább leírt módon szintén alkalmasak ADS-B jelek vételére.

![DVB-T stick](/artifacts/posts/2013-10-27-hogy-mukodik-a-flightradar24/dvbt-stick-adsb-receiver-48_380.jpg)

A DVB-T stickek a digitális földfelszíni videó adások vételére szolgáló
eszközök. Azonban hamar rájöttek, hogy ennél sokkal több mindenre
használhatóak. Az ADS-B jelek vételére a RTL2832U/E4000 és a
RTL2832U/R820T chippel és tunerrel rendelkező eszközök alkalmasak. Ebből
is a R820T chippel szerelt számunkra a megfelelő, hiszen érzékenyebb,
mint a E4000. A [Rafael Micro
R820T](http://superkuh.com/gnuradio/R820T_datasheet-Non_R-20111130_unlocked.pdf)
egy tuner chip, míg a
[R820T](http://www.realtek.com.tw/products/productsView.aspx?Langid=1&PFid=35&Level=4&Conn=3&ProdID=257)
egy demodulátor chip, mely USB interfésszel, ADC-vel (Analog-to-Digital
Converter) és infravörös távirányító porttal is rendelkezik.

Használatához először fel kell telepíteni egy USB drivert, majd egy
dekódert. Ez képes adatokkal táplálni a
[Flightradar24](http://www.flightradar24.com/software) szoftverét. Ezen
kívül asztali alkalmazások is tudják ezen adatokat felhasználni, és
virtuális radarként működni. Ilyen pl. a
[PlanePlotter](http://www.coaa.co.uk/planeplotter.htm) alkalmazás is.

A Realtek RTL2832U chippel szerelt DVB-T usb stick egyéb érdekes
dolgokra is használható, pl. [Software-defined radio
(SDR)](http://en.wikipedia.org/wiki/Software-defined_radio) egy ilyen
témakör, ahol a rádiózásban tipikusan hardveresen megoldott feladatokat
(erősítés, moduláció/demoduláció, stb.) szoftveres úton valósítják meg.
Erre egy megoldás a [RTLSDR](http://sdr.osmocom.org/trac/wiki/rtl-sdr).

Ami érdekes, hogy az eszközhöz adott kis antennával is elég jó eredményt
lehet elérni, ha jó helyen van, míg elég komoly tudás szükséges egy
olyan antenna megépítéséhez, mely jobban teljesít, és itt már a koax
kábel minőségére, hosszára, és az USB kábel hosszára is figyelnünk kell.

A Flightradar24 nem az egyetlen ilyen szolgáltatás, ugyanezen az elven
működik a [Plane Finder](http://planefinder.net) is. Ők talán nem
osztanak meg annyi technikai információt, viszont van egy-két érdekes
cikk az ő oldalukon is.
