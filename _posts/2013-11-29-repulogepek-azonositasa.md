---
layout: post
title: Repülőgépek azonosítása
date: '2013-11-29T15:07:00.001'
author: István Viczián
tags:
- aircraft
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Ahogy
[előző](/2013/10/27/hogy-mukodik-a-flightradar24.html)
posztomban írtam, a radarernyőn való elkülönítéshez, önmaga
azonosításához a repülőgép transzpondere egy négyjegyű kódot küld a
radarnak (SSR), ez az ún. [SSR
kód](http://en.wikipedia.org/wiki/Transponder_%28aviation%29#Transponder_codes),
vagy más néven "squawk". A számjegyek 0-tól 7-ig állíthatóak (nyolcas
számrendszer), így 4096 különböző lehetőség van. A radar tehát 4096
különböző kérdéssort sugároz a levegőbe, és a számmal rendelkező
repülőgép transzpondere válaszol erre. A pilóta legkésőbb a felszállásig
megkapja az SSR kódot, amit manuálisan beállít a traszponderébe.
Amennyiben a pilóta nem kapott ilyen kódot, akkor a légtérbe való
belépéskor kapja meg a kódot. Az SSR kódok kiosztását számítógép végzi,
egy ICAO rendelet szabályozza a kiadható számsorokat. Erre azért van
szükség, mert tipikusan a szomszédos irányítók más számsorból
választhatnak, így nem keverednek gépek. Vannak [speciális helyzetekben
beállítható
kódok](http://en.wikipedia.org/wiki/Transponder_%28aviation%29) is,
ilyenkor a földi irányítástól függetlenül a pilóta dönthet úgy, hogy
manuálisan átállítja egy másik számra, pl. 7700 kényszerhelyzeti
állapot, vagy 7600 rádiókapcsolat elvesztése.

A repülőgép
[regisztrációjakor](http://en.wikipedia.org/wiki/Aircraft_registration)
az ICAO kioszt egy 6 hexadecimális számból (tehát 24 bites) azonosítót
is, melyet a Mode S transzponderbe kell beállítani. Normál esetben ez
nem változik.

Ezen kívül a repülőgép regisztrációjakor kap egy (5 betűs) lajstromjelet
is, melyet általában repülőgép oldalán felfestve találunk. Magyar gépek
esetén ez HA-val kezdődik. Ez gyakorlatilag megfelel az autók
rendszámának, szintén nem változik.

Ha már szó esett róla, a Nemzetközi Polgári Repülési Szervezet
(International Civil Aviation Organization, ICAO) az ENSz repüléssel
foglalkozó szerve, mely azért jött létre, hogy biztonságosabbá és
könnyebbé tegye az országokon átívelő repüléseket. Különböző annexekben
(ajánlásokban) adják ki az előírásaikat. Láthattuk, hogy az ICAO
bizonyos kódokat is kezel. A repülők kódjai mellett pl. a [4-betűs
repülőtérkódokat](http://en.wikipedia.org/wiki/International_Civil_Aviation_Organization_airport_code)
is nyilvántartja. Ebből az első két betű a régió- és országkód, a
második két betű az országon belüli azonosító. Pl. a Budapest Liszt
Ferenc Nemzetközi Repülőtér kódja LHBP. Az ICAO adja ki a 3-betűs
[légitársaság kódokat](http://en.wikipedia.org/wiki/Airline_codes) is,
pl. a WZZ a Wizzair kódja.

Az ICAO-hoz tartozik a
[típuskódok](http://en.wikipedia.org/wiki/ICAO_aircraft_type_designator)
kiadása is, mely a repülőgép típusát jelöli. Pl. a Boeing 747-100
típuskódja B741.

A repülésben való kommunikációban, ami rádiójelekkel történik, a
résztvevők (légi irányítók, repülőgép) hívójelekkel azonosítják egymást.
A légi közlekedésben többféleképpen is képezhetik a hívójelet. A
légitársaságok által üzemeltetett menetrendszerű forgalomban közlekedő
járatok hívójele a légitársaság előbb említett háromjegyű kódjával
kezdődik, melyet három-négy szám (és esetleg egy betű) követ. A többi a
lajstromjelét használhatja hívójelnek. A repülésben használt nyelv egy
speciális nyelv, alapvetően angol kifejezésekre épül, szokás fóniának is
nevezni. Az [IVAO-HU](http://ivao.hu) honlapján, mely az egyik
legnagyobb repülőgép szimulációs hálózat magyarországi ága, elérhető a
fónia kézikönyve, rendkívül érdekes olvasmány.

A [járatszámot](http://en.wikipedia.org/wiki/Flight_number), melyet
legtöbben ismerünk, és a repülőtéren az információs táblákon
találkozhatunk vele, az adott légitársaság osztja ki. A légitársaság
nevével és a dátummal egyedi. A képzési szabályok légitársaságonként
eltérőek lehetnek.

A gép transzpondere tehát az SSR kódot, ICAO regisztrációs kódját és a
hívójelet küldi. Azonban a hozzá tartozó lajstromjelet, típuskódot és
járatszámot a különböző programok és online szolgáltatások adatbázisból
olvassák be.

Ezek az adatok a [Flightradar24](http://flightradar24) oldalán is
megtalálhatóak.

![Flightradar24](/artifacts/posts/2013-11-29-repulogepek-azonositasa/jelmagyarazat.png)
