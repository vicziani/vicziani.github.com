---
layout: post
title: Virtualizáció fejlesztői gépen
date: '2009-09-09T00:15:00.007+02:00'
author: István Viczián
tags:
- Utils
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Manapság a virtualizáció nagyon divatos irány, így én sem maradhattam ki
belőle. Egyelőre nézzük az egyszerű munkaállomásokon futtatható
virtualizációt. Mikor is lehet erre szüksége egy egyszerű fejlesztőnek:

-   Jelenlegi operációs rendszere feladása nélkül ki akar próbálni egy
    másik operációs rendszert.
-   A fejlesztett alkalmazás célplatformja eltérő lesz, mint a
    fejlesztési platform.
-   Ki akar próbálni egy szoftvert, de feltelepítésével nem a saját
    környezetét akarja veszélyeztetni.
-   Az előbbi speciális esete, mikor fejlesztési munkához szükséges. Pl.
    most több hardver elemet kell programoznom, aminek driver-eit,
    fejlesztőeszközeit nem akarom a jelenlegi környezetemre telepíteni.
    Különösen akkor, mikor az adott munkán csak ritkán kell dolgozni, de
    jó, ha mindig rendelkezésre áll.
-   Egy szoftverhez csak egy számítógépre érvényes licence-et kap, mégis
    több fejlesztő akar vele dolgozni. Nem jogtalan használatra
    gondolok.
-   Egy teljes infrastruktúra működését kell letesztelni, pl. egy
    különálló adatbázisszervert, alkalmazásszervert, webszervert,
    mindezeket duplázva, cluster-be kötve. Persze a teljesítménye sokkal
    alacsonyabb lesz, de az architektúra, alkalmazás működése
    tesztelhető.
-   Egy fejlesztési környezetet több fejlesztő között is el kell
    osztani. Pl. egy felépített adatbázist. Persze senkinek nem ajánlom,
    hogy a virtuális gépen fejlesszen.
-   Környezetek hordozhatóságának biztosítására. Otthoni laptopon
    elkészítettem egy virtuális gépet, melyet átmásoltam az irodai
    gépemre, és azonnal elérhetővé váltak az arra telepített
    szolgáltatások.
-   Oktatási, prezentációs célokra. Jobb, ha egy előadáson, vagy egy
    videón nem a jelenlegi környezetemet mutatom a sok feltelepített
    programmal, ikonnal, hanem egy szűz környezetet, amin csak a demózni
    kívánt alkalmazás szerepel.
-   Más platform oktatásakor. Pl. a SZÁMALK-nál az egyik oktatáson
    Windows-on fejlesztettünk, de a Java EE platformfüggetlenségét
    bizonyítandó telepíteni kellett az alkalmazást egy Solaris szerverre
    is.
-   Oktatás esetén infrastruktúra biztosítására. Pl. az egyik oktatáson
    az oktatói gépen futó virtuális gépen volt feltelepítve a Subversion
    szerver, a wiki és az issue tracking rendszer.

Ezekben az esetekben nem kell külön hardvert szereznünk, hanem a
virtualizációs szoftverrel egy külön hardvert emulálunk, és erre
telepítjük rá az operációs rendszert és a különböző alkalmazásainkat.
Így gyakorlatilag egy ablakban futtathatunk egy másik operációs
rendszert. A magyar elnevezés szerint az eredeti operációs rendszer a
hordozó (host), az ezen belül futó operációs rendszer a vendég (guest)
operációs rendszer. Egyszerre párhuzamosan akár több vendég is futhat,
határt csak a hardverünk teljesítménye szab.

Elsőként a [Microsoft Windows Virtual
PC-t](http://www.microsoft.com/windows/virtual-pc/) próbáltam, mellyel
semmi gondom nem volt, megbízhatóan működött. Mégis váltottam a
következő okok miatt a [VirtualBox-ra](http://www.virtualbox.org/),
melynek a poszt írása pillanatában legfrissebb verziója a 3.0.4:

-   Solaris-t kellett futtatnom
-   Többen mondták, hogy gyorsabb a Virtual PC-nél
-   Sun vásárolta meg
-   GPL-es nyílt forráskódú termék

![VirtualBox](/artifacts/posts/2009-09-09-virtualizacio-fejlesztoi-gepen/vb_b.png)

Telepítés nagyon egyszerű, varázslóval történik. Párszor megjelenik a
felirat: "A telepítés alatt álló szoftver szoftver nem ment át a Windows
Logo tesztelésen, amely a Windows XP-vel való kompatibilitását
vizsgálja.", de ezzel nem kell törődni. Egy új virtuális gép létrehozása
is adja magát, először egy virtuális lemezt kell létrehozni, majd ehhez
kapcsolódóan egy virtuális gépet. A VirtualBox képes bármilyen ISO
állományt is csatolni, így gyorsan csatoltam is egy Windows XP telepítő
CD ISO-ját, így sikerült arról telepítenem. Telepítés után hasznos lehet
még a Guest Addition telepítése a vendég operációs rendszerbe, mely a
következő funkcionalitásokat biztosítja:

-   Egérmutató integráció: az egeret a hordozó desktop-ról egyszerűen át
    lehet húzni a vendég desktop-jára.
-   Jobb videó kártya támogatás: közvetlenül a hordozó videó kártyáját
    használja ki, így nem csak a standard felbontások választhatóak,
    valamint gyorsabb is.
-   Óra szinkronizáció.
-   Megosztott könyvtárak: a hordozó és a vendég közötti állomány
    megosztásra.
-   Seamless windows: az egyik legérdekesebb, ilyenkor a vendég
    operációs rendszer nem egy külön ablakban fut, hanem annak ablakai
    ablakként jelennek meg a desktop-unkon. Így nem is látszik, hogy
    mely operációs rendszer futtatja az adott alkalmazást. Mint a
    Windows 7-ben a Windows XP virtualizációja. Alapértelmezetten a jobb
    Ctrl + L billentyűkkel aktiválható.
-   Megosztott vágólap: rendkívül hasznos.
-   Automatikus bejelentkezés.

Érdemes egy tiszta operációs rendszert tartalmazó virtuális lemezt
elmenteni, és különböző környezetek kialakításakor abból kiindulni.

A többi funkció használata és felderítése nagyon egyszerű, egyedül a
hálózatkezelés okozhat némi fejtörést. A VirtualBox 8 virtuális hálózati
kártyát tud kezelni, ebből 4 felületről konfigurálható, többi
parancssorból. Megadhatjuk a hálózati kártya típusát, PCNet FAST III az
alapbeállítás, mert szinte minden operációs rendszer ismeri és
támogatja. Majd meg kell adni a virtualizáció módját is, mely azt
határozza meg, hogy hogyan csatlakozzon a jelenlegi hálózathoz. Lássuk,
hogy ez a verzió milyen lehetőségeket biztosít, először is a képernyő,
amin a konfigurációt lehet állítani:

![Hálózati beállítások](/artifacts/posts/2009-09-09-virtualizacio-fejlesztoi-gepen/vb_config_b.png)

-   not attached (nincs csatolva): ugyan hálózati kártyát jelez a vendég
    operációs rendszer, de azt mutatja, hogy nincs kábel bedugva, ennél
    a módnál is, mint a többinél a fogaskerékre csatlakoztatva lehet a
    virtuális hálózati kártya MAC címét megadni.
-   NAT (Network Address Translation): ez a leggyakoribb beállítás.
    Használatakor a vendég operációs rendszer látja a hordozó hálózatát
    és az Internetet is, ha be van kötve, de a hálózatról nem lehet
    látni a vendég gép szolgáltatásait. Ez úgy működik, hogy egy külön
    hálózat kerül kialakításra a vendég és a hordozó között (a vendég a
    10.0.2.x címet kapja, míg a hordozó a második ip-címet az azonos
    privát hálózaton belül). Ezt az ip címet a VirtualBox beépített DHCP
    szervere adja. A külső hálózatot a vendég úgy éri el, hogy a küldött
    csomagokat a VirtualBox NAT engine újracsomagolja, és elküldi, majd
    a választ a vendégnek továbbítja. Port forward-dal megoldható, hogy
    a hálózat többi tagja is elérje a vendég szolgáltatását, ilyenkor
    egy port-on a VirtualBox hallgat, és továbbítja a kéréseket a vendég
    operációs rendszerhez.
-   Bridged networking: használatakor a vendég kívülről is egy külön
    gépnek látszik. Pl. a hálózaton lévő DHCP szervertől is kérhet ip
    címet. Ekkor a hálózat többi tagja is el tudja érni a vendég
    szolgáltatásait. Ezt úgy oldja meg, hogy egy device driver-t
    telepít, mely a hordozó hálózati kártyájáról kiszűri a neki
    szükséges forgalmat, ezt hívják "net filter" driver-nek is. Ez
    gyakorlatilag bridge-elés, azaz egy Layer 2 switch. Konfigurációkor
    ki kell választani a fizikai hálózati kártyát, melyre rátelepszik.
    Ehhez a régebbi verziókban a Windows "Hálózati kapcsolatok"
    ablakában kellett varázsolni, szerencsére ez ebben a verzióban már
    nem szükséges.
-   Internal networking (belső csatoló): hasonló a bridged
    networking-hez azzal a különbséggel, hogy a vendég csak az ugyanazon
    belső hálózathoz kapcsolódó vendégekkel tud kommunikálni, még a
    hordozóval sem. Ez azért fontos, mert ilyenkor a forgalom nem megy
    át a host halózati kártyáján, és emiatt nem lehet sniffer-elni, és
    gyorsabb is.
-   Host-only networking: átmenet az internal networkin és a bridged
    networking között. Az elsőnél annyival több, hogy a vendég tud
    beszélgetni a hordozó géppel is, de nem érhető el kívülről. Ezt úgy
    valósítja meg, hogy egy szoftveres interfészt, "loopback" hoz létre.
    Konfigurációjakor egy szoftveres interfészt lehet itt kiválasztani:
    VirtualBox Host Only Network Adapter. Ezt előzőleg telepítette a
    VirtualBox, ekkor az Internet egy rövid időre elmegy, mert
    telepítése újraindítja a hálózatot. Ezzel meg lehet oldani, hogy a
    pl. két virtuális gép (adatbázis és alkalmazásszerver) egy
    hálózatban van kötve, míg kiajánlva csak az alkalmazásszerver van
    egy másik (bridge-elt) hálózaton keresztül, így kinntről az
    adatbázis közvetlenül elérhetetlen.

Nagyon meg vagyok vele elégedve, egyetlen negatívumnak azt hoznám fel,
hogy a magyar fordításban nagyon sok hiba (nem csak érdekes
szóhasználat, hanem elírás is) van.
