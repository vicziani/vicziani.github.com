---
layout: post
title: DLNA, az otthoni médiahálózat alapja
date: '2022-01-05T10:00:00.000+01:00'
author: István Viczián
description: Így működik a DLNA, így vesz részt egy otthoni médiahálózat kialakításában, és egy kis Python, Docker.
---

Amikor itthon elkezdtem egy médiahálózatot kialakítani, akkor azonnal belefutottam a DLNA-ba, és mindig
is érdekelt, hogy pontosan hogyan működik. Otthoni médiahálózatnak nevezem azt, mikor egy lokális hálózatra
több eszköz is csatlakozik, mely vagy tárol, vagy lejátszik médiatartalmat, pl. képet, zenét, filmet.
Elvárás ezekkel kapcsolatban, hogy a hálózaton együtt tudjanak működni.

A médiatartalmat valamilyen háttértáron (winchester) tároljuk. Ilyen lehet pl. az asztali számítógépbe, vagy 
laptopba épített HDD vagy SSD. Ide tartoznak a NAS-ok (Network Attached Storage), melyekben szintén ilyen
eszközök dolgoznak. De költséghatékony megoldás lehet egy Raspberry PI-hoz (sőt, akár közvetlen routerhez) 
USB-vel csatlakoztatott külső merevlemez is.

Lejátszó eszköz lehet pl. az okostévé, okostelefon, asztali multimédia lejátszók 
(Google Chromecast, Apple TV, Android TV-t futtató eszközök, bár nem akartam leírni ezt a szót, de "TV-okosítók", stb.), 
de lehet akár bármelyik asztali számítógép vagy laptop. (Ebből is látszik, hogy egy eszköz egyben akár médiatartalmat
tároló és lejátszó is lehet.) Sőt a játékkonzolok is képesek tartalmat lejátszani.

Ha már ezek ugyanazon a hálózaton vannak elvárás lehet, hogy a médiatartalmat tárolók a médiatartalmat más eszközökkel is
meg tudják osztani, és a lejátszók pedig bármelyik eszközön tárolt tartalmat le tudják játszani. És lehetőleg nekünk ezzel
a legkevesebb dolgunk legyen.

Pontosan ennek a megoldására alakult meg a Digital Living Network Alliance (DLNA) szövetség, akik kidolgozták a 
pontosan ezt a nevet viselő szabványt is. Ez a gyakran emlegetett Universal Plug and Play (UPnP) szabványra épül,
ami pedig olyan hálózati protokollok összessége, melyek lehetővé teszik, hogy a hálózatra kötött 
eszközök mindenféle beállítás nélkül megtalálják egymást, és együtt tudjanak működni. Ez az ún.
zero-configuration networking.

Ebben a posztban protokoll szinten bemutatom a DLNA-t, Python kódokkal érthetőbbé téve.

<!-- more -->

## Választott megoldásom

Nálam ez korábban úgy működött, hogy van egy Ubuntu Linuxot futtató eszköz, beépített merevlemezzel,
media server szoftverrel, melyről gyakorlatilag bármely képernyővel rendelkező eszköz képes
videókat lejátszani. Ezt cseréltem le egy Raspberry Pi-re.

Egy media server szoftver képes indexelni az eszközön található médiatartalmat, valamint 
a többi eszközt kiszolgálni, a videót streamelni. A legismertebb ezek közül a Kodi és a Plex.

Azonban ezek elég nehézsúlyú eszközök, nagyobb erőforrásigénnyel. Olyan szoftvert kerestem, ami
pont annyit tud, amennyire szükségem van. Sokáig az elterjedt MiniDLNA-t használtam, amit azóta átneveztek
[ReadyMedia-ra](https://sourceforge.net/projects/minidlna/). Azonban ennek a fejlesztése eléggé leállt, 
így másik megoldás után kellett néznem. 
Az egyik versenyző a [Universal Media Server](https://github.com/UniversalMediaServer/UniversalMediaServer/) volt,
azonban a tudat, hogy Javaban implementálták, valamint a szegényes dokumentációja elvette tőle a kedvem.
A befutó a MiniDLNA lecserélésében a [Gerbera](https://gerbera.io/) lett. Nyílt forráskódú, C++ nyelven
implementálták, jó a dokumentációja, van elérhető Docker image a legtöbb platformon, és JavaScriptben
pluginelhető. (Ez a MediaTomb forkja, mely azóta megszűnt.)

Media playerként asztali számítógépen a [VLC media playert](https://www.videolan.org/vlc/index.html)
használtam, mobilon a VLC for Mobile-t. A tévém egy LG okostévé, melynek Smart Share szolgáltatása
képes a media server által szolgáltatott tartalmat lejátszani. (Ebből is látszik, hogy bizonyos cégek valamilyen
fantázianév mögé bújtatják a DLNA-t.)

![Médiahálózat](/artifacts/posts/2022-01-05-dlna-otthoni-mediahalozat/dlna-network.png)

## DLNA működésének bemutatása

Hogyan is néz ez ki technológiailag? Az egyszerűség kedvéért a tartalmat tároló eszköz legyen a DLNA szerver,
a lejátszó pedig a DLNA kliens.

* A DLNA kliens felderíti a hálózatra kötött szervereket, ehhez a UPnP SSDP (Simple Service Discovery Protocol)
  protokollt használja. A hálózatra kiküld egy multicast üzenetet, melyre a szerverek válaszolnak.
* A DLNA kliens a választott szervertől lekéri annak képességeit, SCPD (Service Control Point Definition)
  protokollt használva. Ilyen képesség, hogy a szerver ki tudja listázni a tárolt tartalmakat. Ezeket a képességeket
  szolgáltatásokon keresztül lehet igénybe venni.
* A DLNA kliens meghívja a kiválasztott szolgáltatást, pl. lekéri a tárolt tartalmak listáját. A szerver a válaszban
  visszaküldi a tárolt tartalmak adatait (címét, formátumát, méretét, létrehozás/módosítás dátumát),
  de legfőképp az elérhetőségét, mely egy url.
* A DLNA kliens az adott url-ről lejátsza a tartalmat.

Nézzük ezt még részletesebben!

## SSDP: felderítés

A DLNA kliens kiküld a `239.255.255.250` ip-re, `1900`-as portra egy UDP multicast üzenetet. Ez valójában egy
HTTPU (HTTP over UDP) üzenet, mely a HTTP-hez hasonló, szöveges, kérés-válasz protokoll, üzenet fejléccel és törzzsel.

Maga az üzenet tartalma a következő:

```plain
M-SEARCH * HTTP/1.1
HOST:239.255.255.250:1900
ST:upnp:rootdevice
MX:2
MAN:"ssdp:discover"
```

* `M-SEARCH` a HTTP metódus, a `*` karakter vonatkozik arra, hogy nem egy erőforrást kérünk le. Majd jön a protokoll. A következő sorok alkotják az üzenet fejlécét. 
* `HOST` tartalmazza az üzenet címzettjét.
* `MAN` az extension scope, értéke kötelezően `"ssdp:discover"`, vigyázat, szigorúan idézőjelek között.
* `ST` a search target. Itt un. root device-ot keresünk, melyek nincsenek más device-okba ágyazva.
* `MX` a maximum wait, azaz mennyit várunk a válaszra, másodpercben.

Erre válaszolnak a DLNA szerverek, valami hasonló üzenettel:

```plain
HTTP/1.1 200 OK
CACHE-CONTROL: max-age=1800
DATE: Thu, 06 Jan 2022 20:49:26 GMT
EXT:
SERVER: Linux/5.10.63-v7+, UPnP/1.0, Portable SDK for UPnP devices/1.14.0
ST: upnp:rootdevice
USN: uuid:93131041-22f0-48fa-a6b5-9af718bbc5ae::upnp:rootdevice
LOCATION: http://192.168.0.145:49494/description.xml
```

Ezek csak a tipikus fejlécek, ezen kívül más fejlécek is előfordulnak.

* `HTTP/1.1 200 OK` jelenti a sikeres választ.
* `CACHE-CONTROL` visszaadott eredményt meddig cache-elheti a kliens.
* `DATE` a válasz előállításának ideje.
* `EXT` visszafele kompatibilitási okokból legyen benne.
* `SERVER` egy szöveges leírás a szerverről.
* `ST` a típusa, itt egy root device.
* `USN` egyedi azonosítója.
* `LOCATION` egy url, ahonnan letölthetőek a DLNA szerver részletes adatai.

És mit is ér az egész, ha nem próbáljuk ki egy Python szkripttel, hogy mi van,
ha kiküldünk egy `M-SEARCH` kérést a hálózatra.

A Python példaprogramok megtalálhatóak a [GitHubon](https://github.com/vicziani/jtechlog-dlna-python).

```python
import socket

msg = '''M-SEARCH * HTTP/1.1
HOST:239.255.255.250:1900
ST:upnp:rootdevice
MX:2
MAN:"ssdp:discover"

'''.replace("/n", "/r/n")

client_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM, socket.IPPROTO_UDP)
client_socket.setsockopt(socket.IPPROTO_IP, socket.IP_MULTICAST_TTL, 2)
client_socket.bind(("192.168.0.213", 1901)) # 1.
client_socket.settimeout(2)
client_socket.sendto(msg.encode("utf-8"), ('239.255.255.250', 1900))

try:
    while True:
        data, addr = client_socket.recvfrom(65507)
        print(addr)
        print(data.decode("utf-8"))
except socket.timeout:
    pass
```

Nálam erre azonnal válaszolt a Raspberry Pi-n futó Gerbera szerver, az LG TV és
a UPC routerem (!!!) is.

Amit érdemes megjegyezni, hogy a kimenő üzenetnél sorvége karakternek nem elég a `\n`, ki kell
cserélni `\r\n` karakterekre. Valamint a biztonság kedvéért legyen a végén
két sortörés.

Itt azonban hamar belefutottam egy problémába. Az `1.`-essel jelölt sor nélkül
a kérés nem arra a hálózati interfészre került elküldésre, melyre szerettem volna,
így nem kapták meg a másik hálózaton található eszközök, és nem is válaszoltak rá.
Mivel van Docker a gépemen, van egy `vEthernet (Default Switch)` és egy
`vEthernet (WSL)` hálózati interfész, melyek a HyperV-hez, illetve a
Windows Subsystem for Linux-hoz tartoznak. Az UDP üzenetet ezek egyikére küldte ki,
amit csak Wireshark használatával sikerült kinyomoznom.

## Gerbera elindítása Dockerben

Amennyiben nincs semmilyen DLNA server a hálózaton, használhatjuk a Gerberat.
Linuxon futtassuk, ugyanis a Gerbera sajnos Windowson nem futtatható.

Azonban futtatható Docker konténerben is, ha csak ideiglenesen akarjuk kipróbálni.
Sőt, én Raspberry Pi-ra nem találtam feltelepíthető csomagot, ezért azon is
Docker konténerben futtatom.

Erre a következő parancs használható:

```shell
docker run -d --name my-gerbera --network host --privileged --restart unless-stopped \
  -v /home/pi/gerbera:/var/run/gerbera  -v /home/pi/Videos:/content:ro gerbera/gerbera
```

Itt is érdemes átnézni néhány kapcsolót. A `--privileged` kapcsolóval a konténer
olyan jogokat kap a host gépen, mintha a processt konténeren kívül futtatnánk.

A legérdekesebb a `--network host` kapcsoló. Ekkor a konténer nem kap saját
IP-címet, hanem a host hálózatához kapcsolódik. Látható tehát, hogy a Gerbera
futtatásánál tehát nem a teljes izoláció volt a célom, csupán annyi, hogy
ne kelljen telepíteni a host operációs rendszerre. Ekkor nem is kell a
`-p` kapcsolóval a portokat kihozni.

Ez azért nagyon fontos, mert ha a konténer saját ip-t kap, akkor
nem felel az UDP multicast üzenetekre.

Ezt a Gerbera fejlesztői is írják, hogy [az UDP multicast nem proxy-zható](https://github.com/gerbera/gerbera/issues/1280),
így a saját címét sem képes behazudni a válasz üzenetekben.

És itt kell kitérnem arra is, hogy sajnos Windowson Docker konténerben
sem lehet futtatni a Gerberat. Ez azért van, mert a `--network host`
kapcsoló Windows rendszeren [nem működik](https://docs.docker.com/network/host/).

A `-v /home/pi/gerbera:/var/run/gerbera`
kapcsolóval a host `/home/pi/gerbera` könyvtárát mountolom a 
konténer `/var/run/gerbera` könyvtárára. Ez azért jó, mert a konfigurációs állomány,
a `config.xml`, nem a konténerben lesz, hanem a hoston. A `-v /home/pi/Videos:/content:ro`
kapcsolóval a host `/home/pi/Videos` könyvtárát mountolom a konténer `/content`
könyvtárára, read-only módban. A Gerbera ugyanis alapértelmezésben a
`/content` könyvtárat olvassa be.

Ekkor a szerver elérhető a `http://localhost:49494` címen, vagy lokális hálózaton
pl. a `http://192.168.0.145` címen. Ezért volt a `http://192.168.0.145:49494/description.xml` 
cím látható az SSDP válaszüzenetben.

![Gerbera](/artifacts/posts/2022-01-05-dlna-otthoni-mediahalozat/gerbera.png)

Ezután már a VLC-ben is meg fog jelenni, ha a _Nézet / Lejátszólista_ menüpontban
kiválasztjuk az _Univerzális Plug'n'Play_ elemet.

![VNC DLNA](/artifacts/posts/2022-01-05-dlna-otthoni-mediahalozat/vlc-dlna.png)

## Saját UDP szerver

Természetesen egy kis UDP szervert írtam Pythonban, ami válaszol az előbbi kliensnek.

```python
from socket import *
from kiss_headers import parse_it
import platform

INTERFACE_IP = "192.168.0.213"

print("Running server")

udp_server = socket(AF_INET, SOCK_DGRAM)
udp_server.bind(("", 1900))
mreq = inet_aton("239.255.255.250") + inet_aton(INTERFACE_IP)
udp_server.setsockopt(IPPROTO_IP, IP_ADD_MEMBERSHIP, mreq)

while True:
    data, address = udp_server.recvfrom(1500)
    text = data.decode("utf-8")
    method = text.split()[0]
    headers = parse_it(text)
    if method == "M-SEARCH" and headers.ST == "upnp:rootdevice":
        print("Handle M-SEARCH")
        response = f"""HTTP/1.1 200 OK
EXT:
LOCATION: http://{INTERFACE_IP}:8080/rootDesc.xml
SERVER: {platform.system()}/{platform.release()}, UPnP/1.0, JTechLog UPnP Server 0.0.1
ST: upnp:rootdevice
USN: uuid:fea4bf14-6da5-11ec-90d6-0242ac120003::upnp:rootdevice

""".replace("\n", "\r\n")

        udp_server.sendto(response.encode("utf-8"), address)
```

Ennek futtatásához azonban kell egy külső függőség is, a `kiss_headers`, ezzel tudom a 
legegyszerűbben parse-olni a válasz fejléceket.

Persze ekkor már belefutottam abba, hogy a 1900-as portot foglalta a Spotify.

Ennek kinyomozása Windowson:

```shell
netstat -ano | findstr "1900"
tasklist | findstr "10380"
```

Az első parancs megkeresi, hogy melyik pid-del rendelkező folyamat foglalja az 1900-as
portot, a második pedig kikeresi, hogy az adott pid-hez valójában melyik alkalmazás tartozik.

Ezt futtatva az is kiderült, hogy a lokális hálózaton egyrészt a UPC router is dobál `NOTIFY` UDP
broadcast üzeneteket, valamint a Google Chrome is `M-SEARCH` üzeneteket, melyek
az ún. [Chrome Media Routerhez](https://chromium.googlesource.com/chromium/src.git/+/refs/heads/main/docs/media/media_router.md)
tartoznak.

## SCPD, a szerver képességeinek meghatározása

A `LOCATION` fejlécben szereplő címet már egyszerű HTTP `GET` metódussal kell lekérni, és
ekkor valami hasonló XML-t kapunk:

```xml
<root xmlns="urn:schemas-upnp-org:device-1-0" xmlns:sec="http://www.sec.co.kr/dlna">
    <specVersion>
        <major>1</major>
        <minor>0</minor>
    </specVersion>
    <device>
        <dlna:X_DLNADOC xmlns:dlna="urn:schemas-dlna-org:device-1-0">DMS-1.50</dlna:X_DLNADOC>
        <friendlyName>Gerbera</friendlyName>
        <manufacturer>Gerbera Contributors</manufacturer>
        <modelDescription>Free UPnP AV MediaServer, GNU GPL</modelDescription>
        <UDN>uuid:93131041-22f0-48fa-a6b5-9af718bbc5ae</UDN>
        <deviceType>urn:schemas-upnp-org:device:MediaServer:1</deviceType>
        <presentationURL>http://192.168.0.145:49494/</presentationURL>
        <iconList>
            <icon>
                <mimetype>image/png</mimetype>
                <width>120</width>
                <height>120</height>
                <depth>24</depth>
                <url>/icons/mt-icon120.png</url>
            </icon>

        </iconList>
        <serviceList>
            <service>
                <serviceType>urn:schemas-upnp-org:service:ContentDirectory:1</serviceType>
                <serviceId>urn:upnp-org:serviceId:ContentDirectory</serviceId>
                <SCPDURL>cds.xml</SCPDURL>
                <controlURL>/upnp/control/cds</controlURL>
                <eventSubURL>/upnp/event/cds</eventSubURL>
            </service>
        </serviceList>
    </device>
    <URLBase>http://192.168.0.145:49494/</URLBase>
</root>
```

Ebből pár lényegtelen taget eltávolítottam. Ami talán egyértelműen látszik, hogy ez
az XML írja le a DLNA serverünket, ez jelenik meg pl. a VLC-ben, vagy az okostévén.
A neve a `<friendlyName>` tagen belül található, átküldésre kerül az ikonjának
az elérhetősége is, de a legfontosabb talán a `<serviceList>` tagen belüli
szolgáltatás leírások. Ebből látható, hogy a `ContentDirectory`
szolgáltatás leírása elérhető a `cds.xml` címen. Így a `http://192.168.0.145:49494/cds.xml`
címen a következő XML-t kapjuk vissza.

```xml
<scpd xmlns="urn:schemas-upnp-org:service-1-0">
    <specVersion>
        <major>1</major>
        <minor>0</minor>
    </specVersion>
    <actionList>
        <action>
            <name>Browse</name>
            <argumentList>
                <argument>
                    <name>ObjectID</name>
                    <direction>in</direction>
                    <relatedStateVariable>A_ARG_TYPE_ObjectID</relatedStateVariable>
                </argument>
                <argument>
                    <name>BrowseFlag</name>
                    <direction>in</direction>
                    <relatedStateVariable>A_ARG_TYPE_BrowseFlag</relatedStateVariable>
                </argument>
                <!-- ... -->
            </argumentList>
        </action>
        <!-- ... -->
    </actionList>
    <!-- ... -->
</scpd>
```

Ez szintén egy erősen megrövidített lista, a lényeg azonban látható. A 
`ContentDirectory` szolgáltatás tartalmaz egy `Browse`
actiont, melynek a bemeneti és kimeneti paraméterei is fel vannak sorolva.
Ez az action való arra, hogy a médiatartalmat listázni tudjuk.

## Action meghívása: médiatartalmak lekérdezése

Az Action meghívása SOAP over HTTP formátumban/protokollon történik.
Igen-igen, ki hinné, hogy ilyen elavult technológiák vannak.
Ez egy HTTP `POST` hívás, ahol a törzsben egy XML utazik.

Ezt már nem akartam leprogramozni, hanem helyette a Python
`upnpy` könyvtárát használtam.

Itt megint okozott bonyodalmat a több hálózati interfész,
de csak sikerült meghívnom a `socket` `bind()` metódusát.

```python
import upnpy

upnp = upnpy.UPnP()
upnp.ssdp.socket.bind(("192.168.0.213", 1901))
devices = upnp.discover()
print(devices)

device = next(device for device in devices if device.friendly_name == "Gerbera")

services = device.get_services()
print(services)

service = device["ContentDirectory"]
print(service.get_actions())

result = service.Browse(ObjectID=0, BrowseFlag="BrowseDirectChildren", Filter="*", StartingIndex=0, RequestedCount=5000,
                        SortCriteria="")
xml = result["Result"]
print(xml)
```

Itt a paraméterek megadásával gyűlt meg a bajom, hogy milyen értékeket kell átadnom. Ehhez
megint csak a Wiresharkot hívtam segítségül, hogy pontosan milyen kérést is ad ki. Alább látható,
persze az eredeti kérés nem formázott.
Ezután már egyszerű volt a paramétereket visszafejteni.

```plain
POST /upnp/control/cds HTTP/1.1
HOST: 192.168.0.145:49494
CONTENT-LENGTH: 440
CONTENT-TYPE: text/xml; charset="utf-8"
SOAPACTION: "urn:schemas-upnp-org:service:ContentDirectory:1#Browse"
USER-AGENT: 6.2.9200 2/, UPnP/1.0, Portable SDK for UPnP devices/1.6.19

<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/"
            s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
    <s:Body>
        <u:Browse xmlns:u="urn:schemas-upnp-org:service:ContentDirectory:1">
            <ObjectID>0</ObjectID>
            <BrowseFlag>BrowseDirectChildren</BrowseFlag>
            <Filter>*</Filter>
            <StartingIndex>0</StartingIndex>
            <RequestedCount>5000</RequestedCount>
            <SortCriteria></SortCriteria>
        </u:Browse>
    </s:Body>
</s:Envelope>
```

Itt ismét egy szép XML jött vissza:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<DIDL-Lite xmlns="urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/" xmlns:dc="http://purl.org/dc/elements/1.1/"
           xmlns:upnp="urn:schemas-upnp-org:metadata-1-0/upnp/" xmlns:sec="http://www.sec.co.kr/dlna">
    <container id="4" parentID="0" restricted="1" childCount="4">
        <dc:title>Video</dc:title>
        <upnp:class>object.container</upnp:class>
    </container>
        <item id="67" parentID="5" restricted="1">
        <dc:title>bbb sunflower 1080p 30fps normal</dc:title>
        <upnp:class>object.item.videoItem</upnp:class>
        <dc:created>2013-12-16</dc:created>
        <dc:description>Creative Commons Attribution 3.0 - http://bbb3d.renderfarming.net</dc:description>
        <upnp:artist>Blender Foundation 2008, Janus Bager Kristensen 2013</upnp:artist>
        <upnp:composer>Sacha Goedegebure</upnp:composer>
        <upnp:genre>Animation</upnp:genre>
        <res bitrate="435178" bitsPerSample="16" duration="0:10:34.533" nrAudioChannels="2"
             protocolInfo="http-get:*:video/mp4:DLNA.ORG_PN=AVC_MP4_EU;DLNA.ORG_OP=01;DLNA.ORG_CI=0"
             resolution="1920x1080" sampleFrequency="48000" sec:acodec="mp3" sec:vcodec="h264" size="276134947">
            http://192.168.0.145:49494/content/media/object_id/67/res_id/0/ext/file.mp4
        </res>
    </item>
</DIDL-Lite>
```

És ezen már látszik, hogy a főkönyvtár tartalmát adja vissza, benne az alkönyvtárakat és
videó állományokat. A videó állományokról a címén és az url-jén kívül sok hasznos információ is megtalálható,
mint pl. a mérete, felbontása, hossza, formátuma, video és audio codec, stb. Sőt, ha a videófájlban
megtalálható, pl. a készítő, műfaja, létrehozás dátuma, megjegyzés, stb.

Ebből az információkat én már Pythonban, XPath használatával olvastam ki, melyhez az `lxml`
csomagot használtam. (Látható, hogy a névterek használata hogy megbonyolítja a kódot.) Az alábbi
kódrészlet a címeket írja ki.

```python
import lxml.etree as etree

root = etree.fromstring(xml.encode())
for element in root.xpath("//didl:item[./upnp:class[text() = 'object.item.videoItem']]/dc:title",
                          namespaces={"dc": "http://purl.org/dc/elements/1.1/",
                                      "didl": "urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/",
                                      "upnp": "urn:schemas-upnp-org:metadata-1-0/upnp/"}):
    print(element.text)
```

# Saját UPnP szerver

Ha az UDP szervert már megírtam Pythonban, akkor nem láttam akadályát, hogy egy teljes UPnP szervert
megírjak, hiszen innentől kezdve már csak a HTTP kéréseket kell kiszolgálni.

Ehhez viszont konkurens kéne elindítani egy UDP-n és egy TCP-n hallgató folyamatot. Ez egy remek
alkalom volt, hogy kipróbáljam a Python Async IO megoldását.

Az Async IO úgy oldja meg a konkurens futást, hogy valójában egy szál dolgozik, azonban
az egyik feladat IO-ra vár, addig a szál tud a másik feladat számításigényes dolgaival foglalkozni.

A Real Python oldalon egy [remek példa található](https://realpython.com/async-io-python/)
az aszinkron működésre, Miguel Grinberg 2017 PyCon konferencián tartott beszédéből, ahol az
aszinkron működést Polgár Judit szimultán sakkjához hasonlítja.

Event loopnak hívják azt az egy szálat, ami dolgozik.

Az Async IO szíve a coroutine, mely egy speciális generator függvény. Ennek futását még a `return`
előtt megszakíthatja az interpreter, és átadhatja a vezérlést egy másik coroutine függvénynek.

Coroutine deklarálásánál használhatók a `async` / `await` kulcsszavak. Következzék erre rövid példa.

```python
async def main():
    print('hello')
    await asyncio.sleep(1)
    print('world')

asyncio.run(main())
```

És akkor következhet az így megírt UDP szerver.

```python
import asyncio
from kiss_headers import parse_it
from socket import *
import platform

MULTICAST_PORT = 1900
MULTICAST_GROUP = "239.255.255.250"


class SsdpProtocol(asyncio.BaseProtocol):
    def __init__(self, interface_ip):
        self.transport = None
        self.interface_ip = interface_ip

    def connection_made(self, transport):
        print("UDP connection made")
        self.transport = transport

    def connection_lost(self, ex):
        print("UDP connection lost")

    def datagram_received(self, data, address):
        text = data.decode("utf-8")

        method = text.split()[0]
        headers = parse_it(text)
        if method == "M-SEARCH" and headers.ST == "upnp:rootdevice":
            print("Handle M-SEARCH")
            response = f"""HTTP/1.1 200 OK
EXT:
LOCATION: http://{self.interface_ip}:8080/rootDesc.xml
SERVER: {platform.system()}/{platform.release()}, UPnP/1.0, JTechLog UPnP Server 0.0.1
ST: upnp:rootdevice
USN: uuid:fea4bf14-6da5-11ec-90d6-0242ac120003::upnp:rootdevice

""".replace("\n", "\r\n")

            self.transport.sendto(response.encode("utf-8"), address)


async def run_udp_server(interface_ip):
    print("Starting UDP server")

    udp_server = socket(AF_INET, SOCK_DGRAM)
    udp_server.bind(("", MULTICAST_PORT))
    mreq = inet_aton(MULTICAST_GROUP) + inet_aton(interface_ip)
    udp_server.setsockopt(IPPROTO_IP, IP_ADD_MEMBERSHIP, mreq)

    loop = asyncio.get_running_loop()
    transport, protocol = await loop.create_datagram_endpoint(
        lambda: SsdpProtocol(interface_ip),
        sock=udp_server)

    try:
        await asyncio.sleep(3600)  # Serve for 1 hour.
    except asyncio.CancelledError:
        print("Cancelled UDP server")
    finally:
        transport.close()

asyncio.run(run_udp_server("192.168.0.213"))
```

A HTTP protokollt nem akartam leprogramozni, hanem helyette
az Async IO-ra épülő `aiohttp` könyvtárat használtam.

```python
class HttpHandler:

    def __init__(self, interface_ip, http_port):
        self.interface_ip = interface_ip
        self.http_port = http_port

    async def handle(self, request):
        print("Handle HTTP request to 'rootDesc.xml'")
        text = f"""<?xml version="1.0"?>
<root xmlns="urn:schemas-upnp-org:device-1-0" xmlns:dlna="urn:schemas-dlna-org:device-1-0">
<specVersion>
<major>1</major>
<minor>0</minor>
</specVersion>
<device>
    <deviceType>upnp:rootdevice</deviceType>
    <friendlyName>JTechLog</friendlyName>
</device>
<URLBase>http://{self.interface_ip}:{self.http_port}/</URLBase>
</root>
"""
        return web.Response(text=text)


async def run_http_server(interface_ip):
    print("Starting HTTP server")
    app = web.Application()
    handler = HttpHandler(interface_ip, 8080)
    app.add_routes([web.get('/rootDesc.xml', handler.handle)])

    runner = web.AppRunner(app)
    await runner.setup()
    site = web.TCPSite(runner, host=interface_ip, port=8080)
    await site.start()

    try:
        await asyncio.sleep(3600)  # Serve for 1 hour.
    except asyncio.CancelledError:
        print("Cancelled HTTP server")

asyncio.run(run_http_server("192.168.0.213"))
```

De hogy indítjuk el egymás mellett a kettőt?

```python
async def run_servers(interface_ip):

    udp_server_task = asyncio.ensure_future(run_udp_server(interface_ip))
    http_server_task = asyncio.ensure_future(run_http_server(interface_ip))

    await asyncio.gather(udp_server_task, http_server_task)

print("Starting servers")
asyncio.run(run_servers("192.168.0.213"))
```

Amit még szerettem volna megoldani, hogy hogy tud kezelni Linux signalokat,
azaz pl. amikor nyomok egy _Ctrl + C_ billentyűzetkombinációt a konzolban.

Láthattuk, hogy a szerverek indításakor `asyncio.sleep()` függvényt hívtam,
és kezeltem a `asyncio.CancelledError` kivételt. Hát küldjünk akkor
`cancel`-t az összes feladatnak.

```python
class SignalHandler:

    def __init__(self, tasks):
        self.tasks = tasks

    def handle(self):
        print("Got SIGINT signal")
        for task in self.tasks:
            task.cancel()


loop = asyncio.get_event_loop()
signal_handler = SignalHandler([udp_server_task, http_server_task])
loop.add_signal_handler(signal.SIGINT, signal_handler.handle)
```