---
layout: post
title: Hőmérséklet monitorozása
date: '2023-08-18T10:00:00.000+02:00'
author: István Viczián
description: Hogyan kössünk be egy hőmérséklet szenzort a Prometheus/Grafana alapú monitorozó eszközbe?
---

Nagyon régóta érdekel az IoT (Internet of Things, azaz Internetre köthető kütyük) világa, ugyanis ezek azok az eszközök,
melyek összekötik a virtuális világót a való világgal. Már régóta [rendelkezem egy Raspberry PI számítógéppel](2013/12/30/raspberry-pi-alapok.html),
melyet azóta is lelkesen használok egy alacsony fogyasztású home serverként. Telepítve van rá a Prometheus és Grafana, mely
a DevOps világban egy kvázi standard monitorozó eszköz. Mindkettő ingyenesen használható, nyílt forráskódú eszköz.
A Prometheus különösen alkalmas idősorok hatékony tárolására, gyors lekérdezésére, aggregált műveletek végrehajtására. Az idősorok
olyan megfigyelések, melyeket egymást követő időpontokban (időszakokban) regisztrálták, és ez az időbeliség az adatok fontos tulajdonsága.
Ilyen például egy szerverrel kapcsolatban a bizonyos időpontokban lekérdezett CPU és memóriahasználat, vagy a háttértárakon lévő szabad
hely mérete. A Grafana használatával ezeket tudjuk vizualizálni, gyönyörű dashboardokat létrehozni és akár riasztásokat
beállítani.

De melyik is lehet az az IoT eszköz, melyet a legegyszerűbben, lehetőleg barkácsolás nélkül és olcsón lehetne bekötni ebbe a rendszerbe?
Már régóta szemezem a Xiaomi Mi Temperature and Humidity Monitor 2 hőmérséklet-, és páratartalom mérővel, amihez most 2000 Ft-ért
lehet hozzájutni az [mStore akciója keretében](https://mstore.hu/xiaomi-mi-temprerature-humidity-monitor-2-1473).

![Xiaomi Mi Temperature and Humidity Monitor 2](/artifacts/posts/2023-08-18-homerseklet-monitorozas/xiaomi-temperature-and-humidity-monitor.jpg)

Ez pontosan a LYWSD03MMC modell, mely egy precíz Sensirion szenzorral, 1,5"-os LCD kijelzővel rendelkezik, és Bluetooth 4.2 BLE
vezeték nélküli kapcsolaton keresztül kommunikál. Egy CR2032 elemmel működik, ezt külön szerezzük be, mert nem része
a csomagnak. Ezzel akár fél-egy évig képes üzemelni. Természetesen Bluetooth-on tud kapcsolódni mobiltelefonhoz, illetve
Bluetooth Gateway-hez, azonban én direktbe, egy Linuxos számítógéppel, jelen esetben egy Raspberry PI-vel szeretnék
hozzá kapcsolódni, és kinyerni belőle az adatokat. (Nincs szükség egyedi firmware telepítésére.)

Ezt utána csak be kell kötni a Prometheusba, mely időközönként lekérdezi és eltárolja az adatokat, majd egy Grafana dashboardot
létrehozni, mely megjeleníti azokat.

<a href="/artifacts/posts/2023-08-18-homerseklet-monitorozas/dashboard.png" data-lightbox="post-images">![Grafana dashboard](/artifacts/posts/2023-08-18-homerseklet-monitorozas/dashboard_700px.png)</a>

Közben természetesen szerettem volna megismerni a kapcsolódó technológiákat is.

<!-- more -->

A szenzor a BLE (Bluetooth Low Energy) vezeték nélküli kommunikációs technológiát használja, amelyet alacsony energiafogyasztású eszközök közötti adatátvitelre terveztek.
Persze a hatótávolság és adatátvitel korlátozottabb, mint a hagyományos Bluetooth esetén. Az eszközök az ún. Generic Attribute Profile (GATT) specifikáció 
alapján kommunikálnak. Ez a következő fogalmakat használja:

* Client: ami az eszközről lekérdezi az adatokat, kezdeményezi a kommunikációt, kéréseket küld az eszköz számára, és fogadja a válaszokat. Ez lesz a Raspberry PI.
* Server: maga az eszköz, jelen esetben a szenzor.
* Service: az eszközön belül egy kisebb részegység, mely az egybe tartozó funkciókért felelős. Ezt kell megszólítani, ez adja vissza az adatokat.
* Characteristic: átküldött adat, ilyen a hőmérséklet, a páratartalom, és az elem állapota.

Ezek az eszközök ezen kívül apró csomagokat szórnak szét, mellyel jelzik, hogy lehet hozzájuk csatlakozni.

Érdekes módon Bluetooth eszközöket a Chrome-ban is fel lehet deríteni, ehhez ne felejtsük el bekapcsolni a számítógépünkön a Bluetooth kapcsolatot.
Utána a `chrome://bluetooth-internals/#devices` címre kell ellátogatni, és már láthatjuk is a Bluetooth eszközöket. Nálam bőven tízes nagyságrendű eszköz van,
ezek közül többhöz csatlakozni is lehet, ilyen pl. a hőmérséklet szenzor, okosmérleg, fogkefék, stb. A keresett eszköznek megjelenik a modell azonosítója (LYWSD03MMC),
valamint a MAC-címe (ez egy egyedi cím, formátuma: `1A-E3-2C-9F-68-8D`). Ezen a felületen lehet is csatlakozni, és lekérdezni a service-eket,
valamint az alatt a characteristics-et. Minden service egyedi UUID-val is rendelkezik (pl. `0000180f-0000-1000-8000-00805f9b34fb`).

De persze sokkal izgalmasabb, hogy hogy lehet ezt Raspberry PI-n elvégezni. Vigyázat, a Raspberry PI 3 lapkán egy Broadcom BCM43438 LAN és Bluetooth Low Energy (BLE) chip van,
mely nem engedélyezi egyszerre a WiFi-t és a Bluetooth-t használni. Így ki kell kapcsolni a WiFi-t, vagy venni egy külön USB-s WiFi vagy Bluetooth adaptert.

A Bluetooth interfész a `hci0`, mely a következő paranccsal ellenőrizhető:

```shell
hciconfig
```

Ennek az eredménye valami hasonló:

```plain
hci0:   Type: Primary  Bus: UART
        BD Address: B8:27:EB:FE:FE:3B  ACL MTU: 1021:8  SCO MTU: 64:1
        UP RUNNING
        RX bytes:31612 acl:387 sco:0 events:1812 errors:0
        TX bytes:19387 acl:60 sco:0 commands:1147 errors:0
```

A Bluetooth eszközök felderítése a következő paranccsal lehetséges:


```shell
sudo hcitool lescan
```

Ennek eredménye valami hasonló:

```plain
61-0D-49-18-9F-C8 (unknown)
49-49-73-D6-F3-47 (unknown)
24-48-8C-94-96-4C (unknown)
24-48-8C-94-96-4C LYWSD03MMC
C8-6A-2F-5E-10-22 (unknown)
98-87-5C-C1-DC-5E MI_SCALE
```

A `LYWSD03MMC` megnevezéssel találjuk meg a szenzorunk, és annak a MAC-címét.

Ezek után hozzá kell kapcsolódni az eszközöz, és 
beállítani, hogy a mért értékekről küldjön értesítéseket. (Ezt mobiltelefonról is
meg lehetne tenni, de így legalább látunk egy példát, hogy kell alacsony szintű parancsokat
kiadni. Ha mégis telefonról akarjuk aktiválni, akkor
csatlakozzunk az eszközhöz a Mi Home alkalmazásból, majd várjuk meg, míg letölti az adatokat.)
Ha mégis parancssorból szeretnénk beállítani, akkor a `gatttool` eszközt kell használni.

```shell
gatttool -I -b 24-48-8C-94-96-4C
[24-48-8C-94-96-4C][LE]> connect
Attempting to connect to 24-48-8C-94-96-4C
Connection successful
Notification handle = 0x0036 value: e4 0a 43 c8 0b
[24-48-8C-94-96-4C][LE]>
```

Itt le lehet kérni a service-eket:

```shell
[24-48-8C-94-96-4C][LE]> primary
attr handle: 0x0001, end grp handle: 0x0007 uuid: 00001800-0000-1000-8000-00805f9b34fb
attr handle: 0x0008, end grp handle: 0x000b uuid: 00001801-0000-1000-8000-00805f9b34fb
attr handle: 0x000c, end grp handle: 0x0018 uuid: 0000180a-0000-1000-8000-00805f9b34fb
attr handle: 0x0019, end grp handle: 0x001c uuid: 0000180f-0000-1000-8000-00805f9b34fb
attr handle: 0x001d, end grp handle: 0x0020 uuid: 00010203-0405-0607-0809-0a0b0c0d1912
attr handle: 0x0021, end grp handle: 0x004e uuid: ebe0ccb0-7a0a-4b0c-8a1a-6ff2997da3a6
attr handle: 0x004f, end grp handle: 0x005d uuid: 8edffff0-3d1b-9c37-4623-ad7265f14076
attr handle: 0x005e, end grp handle: 0x0071 uuid: 0000fe95-0000-1000-8000-00805f9b34fb
attr handle: 0x0072, end grp handle: 0x007a uuid: 00000100-0065-6c62-2e74-6f696d2e696d
```

És a service-ben lévő characteristics értékeket a service `attr handle` és `end grp handle` kiválasztásával.

```shell
[24-48-8C-94-96-4C][LE]> characteristics 0x0021 0x004e
handle: 0x0022, char properties: 0x0a, char value handle: 0x0023, uuid: ebe0ccb7-7a0a-4b0c-8a1a-6ff2997da3a6
handle: 0x0025, char properties: 0x02, char value handle: 0x0026, uuid: ebe0ccb9-7a0a-4b0c-8a1a-6ff2997da3a6
handle: 0x0028, char properties: 0x0a, char value handle: 0x0029, uuid: ebe0ccba-7a0a-4b0c-8a1a-6ff2997da3a6
handle: 0x002b, char properties: 0x02, char value handle: 0x002c, uuid: ebe0ccbb-7a0a-4b0c-8a1a-6ff2997da3a6
handle: 0x002e, char properties: 0x10, char value handle: 0x002f, uuid: ebe0ccbc-7a0a-4b0c-8a1a-6ff2997da3a6
handle: 0x0032, char properties: 0x0a, char value handle: 0x0033, uuid: ebe0ccbe-7a0a-4b0c-8a1a-6ff2997da3a6
handle: 0x0035, char properties: 0x12, char value handle: 0x0036, uuid: ebe0ccc1-7a0a-4b0c-8a1a-6ff2997da3a6
handle: 0x0039, char properties: 0x02, char value handle: 0x003a, uuid: ebe0ccc4-7a0a-4b0c-8a1a-6ff2997da3a6
handle: 0x003c, char properties: 0x08, char value handle: 0x003d, uuid: ebe0ccc8-7a0a-4b0c-8a1a-6ff2997da3a6
handle: 0x003f, char properties: 0x08, char value handle: 0x0040, uuid: ebe0ccd1-7a0a-4b0c-8a1a-6ff2997da3a6
handle: 0x0042, char properties: 0x0a, char value handle: 0x0043, uuid: ebe0ccd7-7a0a-4b0c-8a1a-6ff2997da3a6
handle: 0x0045, char properties: 0x08, char value handle: 0x0046, uuid: ebe0ccd8-7a0a-4b0c-8a1a-6ff2997da3a6
handle: 0x0048, char properties: 0x18, char value handle: 0x0049, uuid: ebe0ccd9-7a0a-4b0c-8a1a-6ff2997da3a6
handle: 0x004c, char properties: 0x0a, char value handle: 0x004d, uuid: ebe0cff1-7a0a-4b0c-8a1a-6ff2997da3a6
``````

Azonban ismert, hogy a `0x0036` `char value handle` címet kell beállítani `0010`, hogy a szenzor küldje az adatokat.
Először olvassuk ki:

```shell
[24-48-8C-94-96-4C][LE]> char-read-hnd 38
Characteristic value/descriptor: 00 00
```

Látszik, hogy most az érték `0000`. Állítsuk át `0010`-re a következő paranccsal.

```shell
[24-48-8C-94-96-4C][LE]> char-write-req 0x0038 0100
Characteristic value was written successfully
Notification handle = 0x0036 value: e4 0a 43 c8 0b
Notification handle = 0x0036 value: e4 0a 43 c8 0b
```

Ezek után máris látható, hogy küldi is az értékeket. A küldött érték a `e4 0a 43 c8 0b`.
Ennek első két bájtja a hőmérséklet little endian kódolással. Tehát meg kell cserélni a bájtokat,
ez hexában `0a e4`, ami decimálisan `2788`, ezt el kell osztani `100`-zal, így kapjuk a 
hőmérsékletet, ami `27,88` fok.

Második bájt a páratartalom, melynek értéke hexában `43`, ami decimálisan `67`, tehát az érték `67 %`.

A legutolsó két bájt pedig az elem feszültsége, ugyanígy kell számolni, mint a hőmérsékletet.
Azaz `c8 0b`, megcseréljük a byte-okat, az hexában `0b c8`, ami decimálisan `3016`, amit `100`-zal
osztva a `3,016 V` értéket kapjuk.

Az `exit` paranccsal kiléphetünk.

Érdekessége, hogy kinyerhetünk információt a gyártóról, és ott a [http://www.miaomiaoce.com/](http://www.miaomiaoce.com/) címet találjuk,
ami egy kínai oldal, ahol sok hasonló terméket találhatunk.

De persze miért is használnánk ilyen alapszintű műveleteket, ha Pythonban kész könyvtár van rá.
Ez a [bluepy](https://github.com/IanHarvey/bluepy), mely csak Linuxon működik.

Működéséhez először telepítsük a `libglib2.0-dev` könyvtárat a következő paranccsal:

```shell
sudo apt-get install libglib2.0-dev
```

Majd inicializáljunk egy Python projektet, Virtual Environmenttel (hogy ne globálisan telepítsük a függőségeket), és telepítsük a `bluepy` függőséget.

```shell
sudo apt-get install python3-venv
python -m venv venv
venv/bin/activate
pip install bluepy
```

A [dokumentáció](http://ianharvey.github.io/bluepy-doc/) szerint `Peripheral` osztállyal csatlakozhatunk, és
át kell adni egy callbacket (`DefaultDelegate` leszármazott), amit visszahív, ha érték érkezik. Itt már csak el kell végezni a fenti számításokat.

```python
from bluepy import btle

class MyDelegate(btle.DefaultDelegate):
    def __init__(self):
        btle.DefaultDelegate.__init__(self)

    def handleNotification(self, cHandle, data):
        databytes = bytearray(data)
        temperature = int.from_bytes(databytes[0:2],"little") / 100
        humidity = int.from_bytes(databytes[2:3],"little")
        battery = int.from_bytes(databytes[3:5],"little") / 1000
        print(f"Temperature: {temperature}, humidity: {humidity}, battery: {battery}")

mac = "24-48-8C-94-96-4C"
print(f"Connecting to {mac}")
connected = False
try:
    # Timeout not released: https://github.com/IanHarvey/bluepy/pull/374
    dev = btle.Peripheral(mac)
    connected = True
    print("Connection done...")
    delegate = MyDelegate()
    dev.setDelegate(delegate)
    print("Waiting for data...")
    dev.waitForNotifications(15.0)
except btle.BTLEDisconnectError as error:
    print(error)
finally:
    if connected:
        dev.disconnect()
```

Most már csak arra van szükség, hogy ezt eljuttassuk a Prometheusba. ez ún. pull modellel dolgozik, azaz bizonyos időközönként a 
Prometheus hív ki HTTP(S) protokollon, és válaszban kapott értékeket menti el.

A Prometheus az ún. [OpenMetrics](https://github.com/OpenObservability/OpenMetrics/blob/main/specification/OpenMetrics.md) formátumot képes feldolgozni.
Ez valami hasonló:

```plain
#HELP xiaomi_sensor_exporter_number_of_sensors Number of sensors
#TYPE xiaomi_sensor_exporter_number_of_sensors gauge
xiaomi_sensor_exporter_number_of_sensors 1
#HELP xiaomi_sensor_exporter_temperature_celsius Temperature
#TYPE xiaomi_sensor_exporter_temperature_celsius gauge
xiaomi_sensor_exporter_temperature_celsius{name="workroom",address="A4:C1:38:78:88:5A"} 25.66
#HELP xiaomi_sensor_exporter_humidity_percent Humidity
#TYPE xiaomi_sensor_exporter_humidity_percent gauge
xiaomi_sensor_exporter_humidity_percent{name="workroom",address="A4:C1:38:78:88:5A"} 65
#HELP xiaomi_sensor_exporter_battery_volt Battery
#TYPE xiaomi_sensor_exporter_battery_volt Volt
xiaomi_sensor_exporter_battery_volt{name="workroom",address="A4:C1:38:78:88:5A"} 2.997
```

Látható, hogy van négy metrika, `xiaomi_sensor_exporter_number_of_sensors`, `xiaomi_sensor_exporter_temperature_celsius`, stb.
Nézzük a `xiaomi_sensor_exporter_temperature_celsius` metrikát. Ennek meg van adva a neve a `#HELP` sorban, értéke `Temperature`,
a típusa a `#TYPE` sorban, értéke `gauge` (mely egy adott pillanatban mért értéket ír le), és maga az érték, mely `25.66`. Sőt, ezeket az értékeket címkézni is lehet,
látható, hogy van egy `name="workroom"` értékpár és egy `address="A4:C1:38:78:88:5A"` értékpár. Ezek alapján később szűrni is lehet.

Találtam olyan projektet, mely képes arra, hogy lekérdezze a hőmérsékleti értékeket, és azokat exportálja OpenMetrics
formátumban, [blexy](https://github.com/rostrovsky/blexy) néven. Ez azonban folyamatosan nyitva tartotta a kapcsolatot, és félő, hogy ez
több energiát használ. Docker image sem volt belőle. Valamint ennek használatával nem élhettem volna át az alkotás örömét. Ezért saját 
projektet hoztam létre [xiaomi-sensor-exporter](https://github.com/vicziani/xiaomi-sensor-exporter) néven. Ez futtat egy http
szervert, és kérésre csatlakozik a szenzorhoz, lekérdezi az értékeket és OpenMetrics formátumban visszaadja.

Én az egyszerűség kedvéért Dockerben futtatom, melyhez az image megtalálható a [Docker Hubon](https://hub.docker.com/r/vicziani/xiaomi-sensor-exporter).

Használatához először létre kell hozni egy konfigurációs állományt, amibe megadjuk az eszközök MAC-címeit, valamint a http szerver portját.

```yaml
port: 9093
devices:
  - name: workroom
    address: 24-48-8C-94-96-4C
```

Utána a következő Docker paranccsal indíthatjuk:

```shell
docker run -v /home/pi/xiaomi-sensor-exporter/config.yaml:/app/config/config.yaml --net=host --privileged --name xiaomi -d vicziani/xiaomi-sensor-exporter:0.0.1
```

Sajnos csak `--net=host --privileged` paraméterekkel tudtam működésre bírni, így fért hozzá a konténer a Bluetooth stackhez. A [Stackoverflow-n](https://stackoverflow.com/questions/28868393/accessing-bluetooth-dongle-from-inside-docker) javasolt megoldások sajnos nekem nem működtek.

Amint elindult, a következőképp érhetők el a metrikák:

```shell
$ curl http://localhost:9093/metrics

#HELP xiaomi_sensor_exporter_number_of_sensors Number of sensors
#TYPE xiaomi_sensor_exporter_number_of_sensors gauge
xiaomi_sensor_exporter_number_of_sensors 1
#HELP xiaomi_sensor_exporter_temperature_celsius Temperature
#TYPE xiaomi_sensor_exporter_temperature_celsius gauge
xiaomi_sensor_exporter_temperature_celsius{name="workroom",address="24-48-8C-94-96-4C"} 26.26
#HELP xiaomi_sensor_exporter_humidity_percent Humidity
#TYPE xiaomi_sensor_exporter_humidity_percent gauge
xiaomi_sensor_exporter_humidity_percent{name="workroom",address="24-48-8C-94-96-4C"} 65
#HELP xiaomi_sensor_exporter_battery_volt Battery
#TYPE xiaomi_sensor_exporter_battery_volt Volt
xiaomi_sensor_exporter_battery_volt{name="workroom",address="24-48-8C-94-96-4C"} 3.102
```

Ha ez a `http://raspberry.local:9093/metrics` címen is elérhető, akkor a Prometheusba a következőképp kell
bekötni a `prometheus.yaml` állományba:

```yaml
scrape_configs:
  - job_name: xiaomi_sensor
    scrape_interval: 15m
    scrape_timeout:  30s
    static_configs:
      - targets: ['raspberry.local:9093']
```

Ez 15 percenként fogja lekérni a megadott címről az értékeket.

Ehhez már csak egy Grafana dashboard kell, melyet szintén feltöltöttem a 
[GitHub-ra](https://github.com/vicziani/xiaomi-sensor-exporter/blob/master/xiaomi-sensor-exporter-grafana-dashboard.json).


