---
layout: post
title: Otthoni hálózat és labor (home lab)
date: "2026-01-24T10:00:00.000+01:00"
author: István Viczián
description: Egy poszt arról, hogy alakítottam ki az otthoni hálózatomat és labor környezetemet. Képekkel! Egy kis nosztalgiázás és szerelés.
---

Figyelem! A poszt nem AI-jal készült!

Talán minden ott kezdődött, mikor az első Linux kernelt fordítottam egy 486-os PC-n.
A számítógéphez egy betárcsázós modem volt kötve, és a sötét szobában néztem, ahogy a konzolon
szaladnak végig a számomra érthetetlen sorok. Persze elhasalt. Majd újra elhasalt. De maradandó élmény volt, mikor
hiba nélkül végigfutott, és használatba vehettem az első saját kernelemet. (Azt ígérték, gyorsabb lesz,
hittem is, hogy gyorsabb, de valójában nem volt az.)

Az egyetemen a gépteremben VAX/VMS-t használtunk, távoli terminállal, konzolos böngészővel és levelező programmal.
Fordítottam rajta Java forráskódot is. Percekig. Az asztali gépbe be volt dugva a külső winchester keret,
benne a saját disk, mi csak úgy hívtuk, rack. FTP-vel másoltam rá az MP3-akat az Internetről.

Második munkahelyemen mondták: "Ha megírtad a programod, telepítsd is fel. Itt egy SSH elérés."
Linux, JDK 1.4, Tomcat, 2008-at írunk. Ekkor még nem létezett a szó, DevOps.

Később, mikor már komolyabb rendszerek fejlesztésében vettem részt, többször megfordultam nagyobb szervertermekben.
Egyszer bementünk a BIX-be, a Victor Hugo utcában. Mindig elvarázsoltak az embernyi rack szekrények,
rajta a villogó ledek, a deréknyi kötegek UTP kábelekből, és az RJ45 csatlakozó jellegzetes kattanása.

Érdekes, gépet építeni sosem szerettem. Nem szerettem a SATA kábeleket, a PCI csatlakozókat, az elgörbült
CPU lábakat, a pasztázást, a jumpereket.

Hálózatok 1 tantárgy teljesítéshez kötelező olvasmány volt a Tanenbaum-féle Számítógép-hálózatok könyv.
Nem varázsolt el. Most már igen, meg kellett rá érni.

Mikor megjelent a Raspberry Pi, azonnal rendeltem. Sokáig a fiókban volt, de ma már folyamatosan megy.

Ma a YouTube-on előszeretettel nézem azokat a timelaps videókat, ahol egy kábeldzsungelből egy rendezett
szervertermet varázsolnak. Ahol lelkes kollégák saját labor környezeteket (home hab) alakítanak ki, vagy egymás
megoldásaira reagálnak. (Párat meg is fogok osztani.)

Eljött az idő, hogy én is kialakítsam az otthoni hálózatomat, és labor környezetemet.

<a href="/artifacts/posts/2026-01-24-otthoni-halozat-es-labor/rack.jpg" data-lightbox="post-images">![Rack](/artifacts/posts/2026-01-24-otthoni-halozat-es-labor/rack_380.jpg)</a>

<!-- more -->

## Home labbing

A home labbing egy hobbi, melynek űzése közben tipikusan üzemeltetők, fejlesztők, lelkes amatőrök otthon kialakítanak
egy mini IT labort, ahol különböző technológiákat próbálnak ki, tanulnak, kísérleteznek.
Magába foglalja a hardver és szoftver elemeket is. A belépő szint lehet akár egy kártya méretű
számítógép, egy Raspberry Pi, vagy alacsony fogyasztása, halk működése miatt sokan szeretik a mini PC-ket.
De lehet régi leselejtezett asztali gép, vagy laptop. Persze különböző hálózati elemek is szóba jönnek,
routerek, switch-ek, tűzfalak, stb. Persze, mint minden hobbi esetén, itt is határ a csillagos ég.
Valakinek egy komolyabb szervertermet megszégyenítő laborja van otthon, rackkel, rackbe szerelhető
hardverekkel, komoly kábelezéssel, szünetmentes tápegységgel, sőt, LED-es megvilágítással. Míg nem volt ilyen
magas az elektromos áram költsége, külön művészet volt régi, leselejtezett vasakból home labet építeni.

Szoftveres oldalon elképesztő a választék. Különböző operációs rendszerek, virtualizációs 
és konténerizációs technológiák. Média szerverek. Backup megoldások. Ide tartozik a teljes self-hosting
mozgalom, ami azt jelenti, hogy nem felhős szolgáltatásokat használok, hanem saját magam üzemeltetem, saját hardveren.
Ide tartozhat a levelezés, naptárkezelés, hírolvasás, todo listák, jelszókezelés, fájlok, forráskód, dokumentumok, fényképek tárolása, stb.

És arról még nem is beszéltem, hogy egy ilyen home lab az okosotthon gerince is lehet.

Fontos! A home labbing egy hobbi. Tele van szubjektív döntésekkel. Nincs olyan, hogy így kell csinálni. Sok dolognak nincs értelme,
csak azért csináljuk, mert meg tudjuk csinálni. Örülj a más megoldásának, ne kritizáld!

Pár forrás:

* [Jeff Geerling](https://www.youtube.com/@JeffGeerling)
* [Christian Lempa](https://www.youtube.com/@christianlempa)
* [Raid Owl](https://www.youtube.com/@RaidOwl)
* [Wolfgang's Channel](https://www.youtube.com/@WolfgangsChannel)
* [Kernel Pánik, magyar nyelvű csatorna](https://www.youtube.com/@kernel_panik)

## Igény saját Home labra

Érdekes mód az itthoni home lab gondolata onnan indult, hogy nem volt normális hálózat a lakásban.
A koax kábel az egyik sarokba lett behúzva, melyre rá lett kötve az ISP modem. A wifi innen
nem ért át a ház másik sarkába, sem a garázsba. Próbálkoztam Wi-Fi jelerősítőkkel, powerline adapterekkel,
kevés sikerrel. És amúgy sem vagyok a Wi-Fi nagy barátja, így kitaláltam, hogy kialakítok egy
vezetékes Ethernet hálózatot. 

Ha viszont mindenhol lesz vezetékes hálózat, a lakásban szerteszét lévő eszközeimet eldughatom egy közös helyre,
nem foglalnak a lakótérből, nem fűtenek, és nem lesznek hangosak, és egy helyen tudom ezeket kezelni. 
és akkor mehetnek egy szekrénybe. Egy rack szekrénybe! Ilyen pl. az ISP router, a NAS és egy
Raspberry Pi.

Mi vezetett még? Természetesen a tanulás, hisz elkezdett érdekelni a hálózat, a hálózati eszközök. És
természetesen a színtiszta birtoklási vágy.

## Tervezés és végrehajtás

Két dolgot döntöttem el a legelején. Először összeírok egy követelménylistát, melyhez mindig tudom magam tartani, mely
segítenek a döntések meghozatalában. Másrészt nem húzok szét mindent, és építek fel nulláról, hanem kis lépésekben,
iteratívan (agilisan) haladok előre.

* Ahol csak lehet, legyen vezetékes hálózat, első körben az 1 GB sebességre lövök
* Ettől függetlenül legyen mindenhol Wi-Fi, ráadásul legyen roaming, azaz a lakásban sétálva folyamatos legyen a kapcsolat
* Nem szállok el a költségekkel, meglévő eszközöket, használt hardvereket preferálok
* Legyen mentési stratégiám, és ezt a home lab szolgálja ki
* Szolgálja ki a médiafogyasztási szokásainkat
* A háztartás többi tagjának is kényelmes legyen
* Legyen terep a kísérletezgetésre

A következő lépés az volt, hogy egy ábrán összeírtam, hogy milyen eszközöknek kell mindenképp kábelen
csatlakozni. Azt is megterveztem, hogy egy szobába kb. hány csatlakozó kéne, hogy ne kelljen a falon kívül kábeleket húzkodni.

<a href="/artifacts/posts/2026-01-24-otthoni-halozat-es-labor/halozati-architectura.svg" data-lightbox="post-images">![Rack](/artifacts/posts/2026-01-24-otthoni-halozat-es-labor/halozati-architectura.svg)</a>

Azt hiszem, itt érdemes pár dolgot megmagyarázni.

Bár az ISP által adott modemekben van router, ez nagyon alap funkcionalitással bír, így érdemes azonnal mögé tenni egy fejlettebb routert.

Bizonyos szolgáltatásoknak folyamatosan menniük kell, alacsony fogyasztása miatt ezek a Raspberry Pi-ra kerültek.
Hozzá egy külső winchester is csatlakozik.

Ettől függetlenül szükség van nagyobb tárkapacitásra is, melyre a mentések mennek. Ez egy NAS, ami viszont nem megy folyamatosan.

Szükségem van még egy gépre, ez a home lab, melyen a különböző operációs rendszereket, virtualizációs és konténerizációs technológiákat 
tudom próbálgatni. Ide kerülhet minden, amivel nem akarom az elsődleges gépem "beszennyezni". Valamint ide kerülnek azok a szolgáltatások, melyeknek nem kell folyamatosan menniük. 
Ezért ezt a gépet is csak akkor kapcsolom be, mikor szükségem van rá.

Mivel minden eszköz egy helyre került, érdemes ide egy szünetmentes tápegységet (UPS) beállítani.

Látszik, hogy a mobilitás miatt mindenkinek laptopja van, asztali gép nincs használatban.

A Wi-Fi-re két megoldás jöhetett szóba. A mostanában divatos mesh rendszerek, valamint a vezetéken lógó access pointok.
Ezen elég sokat rugóztam, de végül a megbízhatósága és a professzionalitása miatt az access pointok felé mozdultam el.

## Kábelezés

Figyelem! Nem vagyok hálózatépítő. A poszt ezen része azoknak lehet érdekes, akik szintén előképzettség nélkül otthon maguknak akarják kialakítani.

Az egész projektben a legnagyobb problémát az okozta, hogy hova kerüljön a rack szekrény. 
A lakótérbe nem szerettem volna, a hangja miatt. A padlás nyáron nagyon meleg tud lenni. A pincébe nem tudtam levezetni
a kábeleket, nem akartam a födémet átfúrni. Így a padlásfeljáróra tettem. Látható, hogy a lépcsőfokok miatt egy
platformot is kellett csinálnom neki OSB lapokból.

Már volt pár kábelcsatorna a házban, mely a koax kábelt hozta le a padlásról a lakótérbe. Így adott volt, hogy minden kábelt felviszek a
padlásra, majd onnan le a padlásfeljáróba. A meglévők mellett az összes szobába kellett még.
A projekttel évekig vártam, a legközelebbi festésig. Kijelöltem a fali csatlakozók helyét, majd a villanyszerelők falhoronymaróval
vájatot vágtak a kábelcsatornáknak, amit utána a felsők eltakartak.

A kábelek behúzásával elszenvedtem egy jó napot, kábelbehúzó nélkül nem ment volna. Azt a tippet kaptam, hogy a kábelcsatornák vége ne lógjon ki a födém szigeteléséből, mert képes lecsapódni a pára, és lefolyni a fali csatlakozókig.

<a href="/artifacts/posts/2026-01-24-otthoni-halozat-es-labor/falhoronymaras.jpg" data-lightbox="post-images">![Falhoronymarás](/artifacts/posts/2026-01-24-otthoni-halozat-es-labor/falhoronymaras_380.jpg)</a>

A következő lépés a kábelvégek kialakítása volt. Nyilván a fal felől nem szerettem volna kilógó tyúkbeleket, ezért RJ45 aljzatokra volt szükségem. Amiket először kaptam, azok rendkívül nehezen szerelhetőek voltak.
Olyan megoldást kerestem, ami szerszám nélkül megbízhatóan szerelhető és szabványos.

Így találtam meg egy olyan RJ45 Keystone modult (KE-Line Keystone - KEJ-C6-U-TL), mely szerszám nélkül rápattintva szerelhető, majd bármilyen kompatibilis, Keystone adaptert tartalmazó fali aljzatba bepattintható.

[Videó](https://www.youtube.com/watch?v=2lXpV7jDVk4)

<a href="/artifacts/posts/2026-01-24-otthoni-halozat-es-labor/keline-szereles.jpg" data-lightbox="post-images">![KE-Line Keystone szerelés](/artifacts/posts/2026-01-24-otthoni-halozat-es-labor/keline-szereles_380.jpg)</a>

<a href="/artifacts/posts/2026-01-24-otthoni-halozat-es-labor/fali1.jpg" data-lightbox="post-images">![Szerelés előtt](/artifacts/posts/2026-01-24-otthoni-halozat-es-labor/fali1_380.jpg)</a>

<a href="/artifacts/posts/2026-01-24-otthoni-halozat-es-labor/fali2.jpg" data-lightbox="post-images">![Szerelés után](/artifacts/posts/2026-01-24-otthoni-halozat-es-labor/fali2_380.jpg)</a>

<a href="/artifacts/posts/2026-01-24-otthoni-halozat-es-labor/fali3.jpg" data-lightbox="post-images">![Csatlakoztatva](/artifacts/posts/2026-01-24-otthoni-halozat-es-labor/fali3_380.jpg)</a>

A rack oldalon pedig mindenképp szerettem volna egy patch panelt. Ez rendkívül rugalmasságot biztosít, ugyanis a kábelvégeket egyszer ehhez kötöd, utána a rack szekrényen belül
egy patch kábellel oda kötöd, ahova szeretnéd. Ha módosítani akarod, csak a patch kábelt kell átdugni. Sőt, a patch panelből is van olyan, amibe Keystone modulokat lehet pattintani.
Ez nagyon tetszett, ezt választottam.

<a href="/artifacts/posts/2026-01-24-otthoni-halozat-es-labor/patch.jpg" data-lightbox="post-images">![Patch panel](/artifacts/posts/2026-01-24-otthoni-halozat-es-labor/patch_750.jpg)</a>

De egy AP-t még le kellett tenni a pincébe. Leírhatatlan volt az örömöm, mikor találtam egy kábelcsatornát, melybe még elfért egy kábel. Mellesleg a riasztó és a kaputelefon kábele ment még benne.
Van falon kívül szerelhető doboz is, mely szintén Keystone adapterrel rendelkezik.

<a href="/artifacts/posts/2026-01-24-otthoni-halozat-es-labor/fali-doboz.jpg" data-lightbox="post-images">![Fali doboz](/artifacts/posts/2026-01-24-otthoni-halozat-es-labor/fali-doboz_380.jpg)</a>

Sok egyéni hosszúságú, normál RJ45 csatlakozóval rendelkező kábelre is szükségem volt a fali csatlakozó és az eszköz között. Bevallom, a hagyományos szerelési móddal nekem sok problémám volt, azonban felfedeztem a pass-through (azaz átmenő) csatlakozót. Ehhez egy speciális szerszám is kell, mely el is vágja a kilógó kábelvégeket, és rá is szorítja. Ezzel már gyerekjáték. Persze egy kábeltesztelő is jól jön.

<a href="/artifacts/posts/2026-01-24-otthoni-halozat-es-labor/atmeno.jpg" data-lightbox="post-images">![Átmenő RJ45](/artifacts/posts/2026-01-24-otthoni-halozat-es-labor/atmeno_380.jpg)</a>

## A vas

A tápellátásról a szekrényen belül a Power Distribution Unit (PDU), közismert nevén elosztó gondoskodik. Ezt két féle aljzattal is szokták szerelni. Egyik az ellenállóbb IEC 60320 aljzatok (C13 - 10A, C19 - 16A), és a
másik a közismert, hagyományos "európai" dugalj, azaz Schuko / Type F. Én az utóbbit vettem, hiszen látni fogjátok, hogy tipikusan nem szerver alkatrészeket használtam. Érdekes, hogy ezeket sok képen elől láttam, pedig sokkal praktikusabb a szekrény hátuljába szerelni.

Nyilván a fali csatlakozókba életet kellett lehelni, erre a cégemtől kaptam egy Netgear JGS524v2 gigabites, 24 portos, nem menedzselhető, rackbe szerelhető switch-t.
NAS pedig szintén ugyaninnen egy rackbe szerelhető Synology RS814+ hot swap, azaz menet közben cserélhető lemezekkel.

<a href="/artifacts/posts/2026-01-24-otthoni-halozat-es-labor/switch.jpg" data-lightbox="post-images">![Switch](/artifacts/posts/2026-01-24-otthoni-halozat-es-labor/switch_750.jpg)</a>

A home lab egy rendkívül költséghatékony megoldás lett, a cégemtől leselejtezett asztali gép. i7 3.40GHz CPU, 32 GB DDR3, és 2 db 512 GB-os SSD. Bár nagyon régi gép, sok mindenre elég.
Persze nagyon szerettem volna egy rackbe építhető szervert, de azok annyira túlárazottak, hogy elengedtem. Egy üres ház is drágább lett volna, mint a teljes gép maga.

A rack szekrény kiválasztása nem volt egyszerű. Először kisebb, falra szerelhető megoldásban gondolkodtam. De a 40 cm mély szekrénybe nem fért volna be sem a NAS, sem a home lab.
Így egy 19"-os (60 cm széles), 60 cm mély és 12U magas Lanberg WF01-6612-10B lett.

<a href="/artifacts/posts/2026-01-24-otthoni-halozat-es-labor/szekreny.jpg" data-lightbox="post-images">![Szekrény](/artifacts/posts/2026-01-24-otthoni-halozat-es-labor/szekreny_750.jpg)</a>

Utolsó lépés volt a router és az AP-k kiválasztása. Szerintem itt a marketing és az ár lett a döntő tényező, és a TP-Link Omada megoldást választottam. Ez már kifejezetten kicsi és közepes méretű vállalkozások, irodák
számára tervezett megoldás, tehát eggyel komolyabb, mint az otthoni felhasználásra szánt megoldások. A teljes hálózatot (akár lokálisan futtatott) központosított felületen lehet kezelni.

A router egy Omada Gigabit VPN router (ER605). Azért esett erre a választás, mert van multi-wan backupja, azaz pl. hozzá lehet kötni egy 4G/5G routert, és ha kiesik a kábeles internetszolgáltató, akkor
automatikusan át tud kapcsolni mobil internetre.

Az AP-k TP-Link, mennyezetre szerelhető AC1350 gigabit AP-k (EAP225). Támogatják a Seamless Roamingot, valamint az ethernet kábelen keresztül táplálhatóak árammal (ún. Power over Ethernet - PoE), így nem kell
külön tápot is oda vinni. Viszont használni kell a hozzá adott PoE injectort. Ezt úgy kell elképzelni, hogy konnektorba kell dugni, valamint a switch és az eszköz közé kell bekötni, szintén RJ45 csatlakozókkal. Így viszont bonyolítják a szekrény kábelezését. Az injektor mehetne az AP-hez is, azonban a szekrényben tudok neki szünetmentes tápot adni. Sokat egyszerűsítene egy PoE switch, mely önmaga képes feszültséget tenni az ethernet kábelre, így nem kéne PoE injektor. Bevallom, az AP-kat nem akartam mennyezetre szerelni őket, így maradtak a polcon.

<a href="/artifacts/posts/2026-01-24-otthoni-halozat-es-labor/ap.jpg" data-lightbox="post-images">![Omada](/artifacts/posts/2026-01-24-otthoni-halozat-es-labor/ap_380.jpg)</a>

Az UPS egy belépő szintű CyberPower UT850EG egység. Az UPS-eket szintén lehet IEC 60320 és Schuko aljzatokkal is választani. Amire figyeltem még, hogy USB-n csatlakoztatható legyen, így monitorozható, és áramszünet esetén értesítheti a gépeket, hogy kezdjék el a leállást. Sajnos ezzel megjártam, ugyanis a Raspberry Pi-t rádugva elvileg minden működik, azonban 4-5 naponta teljesen lefagy. A szünetmentest lehúzva 65 napja leállás nélkül megy a Pi.

## A hálózat

Még az elején tartok, gyakorlatilag szinte alapbeállításokkal használom. 

Az ISP router ún. bridge módban van, azaz nem okoskodik, mindent átenged a TP-Link routernek. Ott van a DHCP szerver, szerver gépek fix ip-vel. A DNS kéréseket forwardolja a Pi-hole-nak, mely hálózatszintű reklámblokkolást végez. 

Még nem volt szükség, hogy távolról használjam az otthoni hálózatot, így VPN-re nincs szükségem. 

Itthon nem üzemeltetek kívülről elérhető szervereket, így a router tűzfal és egyéb védelmi képességeit, port forwardot, dinamikus DNS támogatást sem használom ki. 

Sávszélesség szabályozás sincs, azaz nem priorizálok előre bizonyos hálózati forgalmat.

Itthon szeretnék VLAN-okat kialakítani, melyek teljesen elkülönített hálózatok. Az IoT eszközöket, felhőhöz kapcsolódó kamerákat, nem annyira megbízható okos eszközöket érdemes lenne külön VLAN-ba tenni. Sajnos ehhez azonban menedzselhető switch kell.

<a href="/artifacts/posts/2026-01-24-otthoni-halozat-es-labor/omada.png" data-lightbox="post-images">![Omada](/artifacts/posts/2026-01-24-otthoni-halozat-es-labor/omada_750.png)</a>
 
## A szoftver

A szolgáltatásokat a Raspberry Pi-n Dockerben futtatom.

Kezdetben nem válogattam, azonban a Pi korlátozott erőforrásai miatt figyelek arra, hogy lehetőleg Go-ban írt eszközöket használjak, és kerüljem a Node.js és PHP megoldásokat.

Minden home labnál lennie kell egy dashboardnak, én a [Homepage](https://gethomepage.dev/) nevűt használom.

<a href="/artifacts/posts/2026-01-24-otthoni-halozat-es-labor/dashboard.png" data-lightbox="post-images">![Dashboard](/artifacts/posts/2026-01-24-otthoni-halozat-es-labor/dashboard_750.png)</a>


DLNA szerver a Gerbera, erről már a [/2022/01/05/dlna-otthoni-mediahalozat.html](DLNA, az otthoni médiahálózat alapja) posztomban írtam. [Transmission](https://transmissionbt.com/) a torrent kliens, kizárólag Linux ISO-k letöltésére.
A Pi pár könyvtára Sambaval van megosztva.

Reklámblokkolást a [Pi-hole](https://pi-hole.net/) végzi.

Nagyon szeretem a [SyncThing](https://syncthing.net/) eszközt, mely különböző gépek között tud könyvtárakat szinkronizálni.

Virtualizációs technológia home labon a [Proxmox](https://www.proxmox.com).

## A jövő

Közeltávon a terveim között a következők szerepelnek:

* Cable management
* Címkézés
* 4G/5G backup router
* Menedzselhető, TP-Link ökoszisztémába illeszthető PoE switch, VLAN kialakításához és a PoE injectorok leváltására
* Wake-on-LAN (WoL)
* Komplex monitoring megoldás Prometheus és Grafana alapokon
* Authentic SSO
* SSL kulcsok, Yubikey

Amennyiben eljutottál ide, és tetszik a téma, kérlek jelezz vissza, hogy folytassam-e!