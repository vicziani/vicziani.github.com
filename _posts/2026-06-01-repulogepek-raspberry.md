---
layout: post
title: Repülőgépek jeleinek vétele Raspberry Pivel
date: "2026-06-01T10:00:00.000+02:00"
author: István Viczián
description: Előadok a Magyarországi Web Konferencián Java és Spring témakörben.
tags:
- RaspberryPi
- IoT
image: /artifacts/posts/repulogepek-raspberry/og.png
---

Ahogy egy korábbi [posztomban](/2013/10/27/hogy-mukodik-a-flightradar24.html) írtam, 
a repülőgépek a saját pozíciójukat 1090 MHz-en ADS-B technológiával szórják egy 
Mode-S transzponder eszközzel, amit egy
olcsó, RTL2832U chip alapú USB stickkel venni lehet. Erre a chipre építenek
DVB-T vevőket is, mellyel lehet fogni digitális földfelszíni tévé műsorokat.
De van direkt amatőr rádiós / SDR (Software Defined Radio) felhasználásra szánt vevő
[RTL-SDR Blog V3 és V4](https://www.rtl-sdr.com/buy-rtl-sdr-dvb-t-dongles/) néven,
melyet az RTL-SDR Blog csapat optimalizált.

Ez sok mindenre felhasználható, többek között:

* Repülőgépek helyzetének követése
* VHF amatőr rádióforgalom hallgatása
* FM rádió hallgatása és RDS (kiegészítő adatok) dekódolása
* DAB digitális rádióadások hallgatása
* Rendőrségi, Mentők, tűzoltóság és egészségügyi rádióforgalom hallgatása
* Légiforgalmi irányítási beszélgetések hallgatása
* Vezeték nélküli hőmérséklet- és fogyasztásmérő szenzorok jeleinek vétele
* NOAA időjárási műholdképek vétele
* Műholdak és a Nemzetközi Űrállomás (ISS) jeleinek vétele
* Stb.

Ezek a stickek természetesen Raspberry Pi-hez is csatlakoztathatóak, és
igen kiforrott szoftverek vannak hozzá.

<a href="/artifacts/posts/repulogepek-raspberry/setup.jpg" class="glightbox">![Kép leírása](/artifacts/posts/repulogepek-raspberry/setup_750.jpg)</a>

<!-- more -->

A képen látható egy Raspberry Pi 3 Model B+ táppal, USB hosszabbítóval a stick, valamint a
stickhez kapott antenna. Érdemes USB hosszabbítót használni, ugyanis az USB port
megzavarhatja a vételt. Valamint azért nincs az eszközön burkolat, mert 2013 óta
ragadóssá vált a műanyag, és jobban is néz így ki.

Szoftver oldalon most a [wiedehopf/readsb](https://github.com/wiedehopf/readsb) legmodernebb,
mely neve a read és ADS-B szavak összeolvadásából származik. Őse több forkon
keresztül a dump1090, melynek neve a 1090 MHz-ből jön. A readsb tehát
a gépektől érkező ADS-B jeleket képes dekódolni csatlakozva az RTL2832 alapú stickhez.

A stick fogja a rádióhullámot 1090 MHz-en, lekeveri egy alacsonyabb frekvenciára,
mintavételezi, és ebből áll elő az ún. IQ mintákat. Egy librtlsdr userspace (azaz nem kernel) library kezeli kapcsolódik közvetlenül a kernelben
futó USB driverhez,
beállítja a frekvenciát és streameli az IQ mintákat.
A readsb kiszedi a 1090 MHz-es impulzusokat,
dekódolja a PPM (pulse-position modulation) jelet (ugyanis a ADS-B nem klasszikus "szép" digitális jel, hanem rádiós impulzusok sorozata), 
és visszaállítja a repülőgép üzenetet.

![Folyamat](/artifacts/posts/repulogepek-raspberry/flow.svg)

A readsb nem ad felületet, azonban létezik egy külön [wiedehopf/tar1090](https://github.com/wiedehopf/tar1090) projekt,
mely képes hozzákapcsolódni, és webes felületet biztosítani.

A telepítése egyszerűbb nem is lehetne, egy [scriptet](https://github.com/wiedehopf/adsb-scripts/wiki/Automatic-installation-for-readsb)
kell lefuttatni.

```shell
sudo bash -c "$(wget -O - https://github.com/wiedehopf/adsb-scripts/raw/master/readsb-install.sh)"
```

Ez a script elég sokmindent csinál:

* Telepíti a szükséges csomagokat, pl. gcc fordítót, valamint a libusb USB drivert
* Letölti a forráskódot és lefordítja
* Systemd service-ként telepíti
* Blacklistre teszi a dvb_usb_rtl28xxu drivert. Ez azért kell, hogy ne mozduljon rá a stickre, mert akkor
  a librtlsdr már nem férne hozzá.
* Eltávolítja a dump1090* csomagokat
* Beállítja a megfelelő jogosultságokat
* Létrehoz két scriptet a gain és a pozíció beállítására
* Beállítja a fr24feed/rbfeeder alkalmazásoknak a telepített readsb-t forrásnak. Ezek a Flightradar24 és AirNav radar oldalaknak küldenek adatokat.
* Telepíti a tar1090 webes felületet, mely lighttpd pehelykönnyű webszerveren fut

(Ez a script használható frissítésre is.)

Utána érdemes beállítani az aktuális pozíció koordinátáit is a következő paranccsal:

```shell
sudo readsb-set-location 50.12344 10.23429
```

Telepítés után a Raspberry Pin a böngészőben elérhető a felület a `http://localhost/tar1090` címen.

<a href="/artifacts/posts/repulogepek-raspberry/tar1090.jpg" class="glightbox">![Kép leírása](/artifacts/posts/repulogepek-raspberry/tar1090_750.jpg)</a>

Megjelenik egy OpenStreetMap layer, rajta a repülőgépekkel. Jobb oldalon a gépek tulajdonságai táblázatos formában.
Jobbra a kiválasztott gép adatai.

Az alapértelmezett megjelenésen kevesett változtattam, átkapcsoltam light módba, valamint a térképet 
light mode-ba. A címkéket is bekapcsoltam, ahol a sebesség (csomóban), a magasság (lábban), a hívójel,
az indulási és érkezési repülőtér 3 betűs (IATA) kódja.

A kis fekete kör az aktuális pozíciót jelzi.

Érdemes megjegyezni, hogy a repülőgép színe attól függ, hogy milyen magasan repül. A gépre kattintva
lehet megnézni az eddigi útvonalát (track), ez is színkódolt, azaz fel- és leszállásnál színátmenetet
képez.

A csillag körvonal az antenna "látótávolsága", a tényleges vételi tartomány körvonala, azaz ezen a területen belül érzékelt repülőket.
Ez nagyban függ az antenna elhelyezkedésétől. Nálam csak kitettem az ablakba, ennek megfelelően igen meglepő az eredmény.
Be- és kikapcsolható, a layereknél az _actual range outline_ néven.
Természetesen a látótávolság függ a domborzattól is, amivel jó, ha tisztában vagyunk.
Létezik a [heywhatsthat](https://www.heywhatsthat.com/) szolgáltatás, ahova be lehet írni a saját koordinátánkat, és
megjeleníti a körülöttünk lévő domborzatot, tőlünk látható hegycsúcsokat. Ez megadja
az elméleti látótávolságot, hiszen hegy mögé "nem lát be" az antenna. Ezt be is lehet tölteni
a tar1090-be.

<a href="/artifacts/posts/repulogepek-raspberry/heywhatsthat.jpg" class="glightbox">![Kép leírása](/artifacts/posts/repulogepek-raspberry/heywhatsthat_750.jpg)</a>

Van egy másik oldal is a `http://localhost/tar1090/?pTracks` címen, ahol az elmúlt 8 óra
rögzített útvonalait lehet látni.

A readsb konfigurációs fájlja a `/etc/default/readsb` elérési útvonalon található. Ennek tartalma
az alábbihoz hasonló:

```conf
# readsb configuration
# This is sourced by /etc/systemd/system/default.target.wants/readsb.service as
# daemon startup configuration.

RECEIVER_OPTIONS="--device 0 --device-type rtlsdr --gain auto --ppm 0"
DECODER_OPTIONS="--lat 50.12344 --lon 10.23429 --max-range 450 --write-json-every 1"
NET_OPTIONS="--net --net-ri-port 30001 --net-ro-port 30002 --net-sbs-port 30003 --net-bi-port 30004,30104 --net-bo-port 30005"
JSON_OPTIONS="--json-location-accuracy 2 --range-outline-hours 24"
```

Ebből talán azt éri meg kiemelni, hogy különböző JSON és hálózati beállításokat is tartalmaz.

Alapértelmezetten a readsb és a tar1090 meglepő módon egymással a `/run/readsb/aircraft.json` fájllal kommunikál. Ezt át lehet állítani http alapú
kommunikációra is.

```json
{ "now" : 1780515492.000,
  "messages" : 15425639,
  "aircraft" : [
{"hex":"4bcde4","type":"adsb_icao","flight":"SXS6PZ  ","alt_baro":38000,"alt_geom":38800,"gs":441.9,"ias":244,"tas":442,"mach":0.772,"wd":216,"ws":9,"oat":-57,"tat":-32,"track":305.88,"track_rate":-0.06,"roll":0.00,"mag_heading":299.00,"true_heading":304.61,"baro_rate":0,"geom_rate":-32,"squawk":"5320","emergency":"none","category":"A3","nav_qnh":1013.6,"nav_altitude_mcp":38016,"nav_heading":298.83,"lat":47.360275,"lon":18.459641,"nic":8,"rc":186,"seen_pos":15.896,"r_dst":18.013,"r_dir":238.0,"version":2,"nic_baro":1,"nac_p":8,"nac_v":1,"sil":3,"sil_type":"perhour","gva":1,"sda":2,"alert":0,"spi":0,"mlat":[],"tisb":[],"messages":1734,"seen":0.3,"rssi":-31.0},
{"hex":"78022e","type":"adsb_icao","flight":"CPA250  ","alt_baro":31000,"alt_geom":31825,"gs":474.1,"ias":307,"tas":486,"mach":0.828,"wd":188,"ws":35,"oat":-46,"tat":-15,"track":115.48,"roll":-0.18,"mag_heading":113.73,"true_heading":119.42,"baro_rate":0,"geom_rate":0,"squawk":"2235","emergency":"none","category":"A5","nav_qnh":1012.8,"nav_altitude_mcp":31008,"lat":47.871735,"lon":18.536407,"nic":0,"rc":0,"seen_pos":2.027,"r_dst":24.327,"r_dir":330.3,"version":2,"nic_baro":1,"nac_p":0,"nac_v":0,"sil":3,"sil_type":"perhour","gva":2,"sda":2,"alert":0,"spi":0,"mlat":[],"tisb":[],"messages":1097,"seen":0.3,"rssi":-28.4},
  ]
}
```

A formátum leírása megtalálható [itt](https://github.com/wiedehopf/readsb/blob/dev/README-json.md).

Ez http-n is lekérhető a `http://localhost/tar1090/data/aircraft.json` címen.

Ez a könyvtár más fájlokat is tartalmaz, pl. a `stats.json` mely különböző statisztikai adatokat tartalmaz.
Sőt ott van a `stats.prom` fájl, mely Prometheus formátumban tartalmazza ezeket, így könnyen beköthetőek
az említett monitorozó és riasztási eszközbe (idősoros adatbázis). Ezek szintén lekérhetőek http-n.

Ezen kívül a hálózaton képes különböző formátumokban adatokat fogadni és továbbítani is.
Ebből a legelterjedtebb a Beast formátum, mely egy bináris formátum, és minden szükséges adatot tartalmaz.
A legtöbb weboldalnak ebben a formátumban lehet adatot küldeni, úgymint a [FlightAware](https://www.flightaware.com/live/),
[Flightradar24](https://www.flightradar24.com/), [ADS-B Exchange](https://globe.adsbexchange.com/), stb.

Mivel a readsb systemd szolgáltatásként lett telepítve, a következő parancsokkal állítható le, és indítható vissza.

```shell
sudo systemctl stop readsb
sudo systemctl start readsb
```

A leállítás különösen akkor lehet hasznos, ha másra akarjuk használni a sticket.


A tar1090-nek is van konfigurációs fájlja a `/etc/default/tar1090` elérési útvonalon.

És zárásul elhangozhat a kérdés, hogy mi értelme lokálisan követni a repülőgépeket, ha ezek az információk úgyis elérhetőek
publikusan az interneten. Erre a válasz, hogy ez egy hobbi.