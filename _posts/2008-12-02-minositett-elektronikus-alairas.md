---
layout: post
title: Minősített elektronikus aláírás
date: '2008-12-02T14:26:00.008+01:00'
author: István Viczián
tags:
- PKI
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Frissítve: 2013. december 23.

Több projekt kapcsán is előjött az elektronikus aláírás témakör, hogyan
kell minősített aláírást készíteni. Több dokumentum szól arról, hogy mi
az az elektronikus aláírás, tanúsítványok, hitelesítésszolgáltatások, de
kevés helyen van összefoglalva, hogy Magyarországon milyen lehetőségeink
vannak, és ezek milyen szabványokra épülnek.

Mi köze ennek a Javahoz? Egyrészt feladat lehet elektronikus aláírást
készíteni, illetve ellenőrizni Java alkalmazásból, másrészt van olyan
elektronikus aláírást létrehozó termék is, melyet Javaban fejlesztettek.

Ezzel a témakörrel kapcsolatban magyar nyelven rengeteget lehet megtudni
[Almási János "Elektronikus aláírás és társai" című
könyvéből](http://www.sansserif.hu/ealairas/konyv.htm%20).

Én most csak arra térnék ki, hogy mi kell az elektronikus aláírás
készítéséhez? Egyrészt kell egy tanúsítvány, mely tartalmazza a
tulajdonos személyes adatait, a tulajdonos nyilvános kulcsát, valamint
hitelesítve van egy harmadik fél, a hitelesítésszolgáltató által (ez a
tanúsítvány hitelesítésszolgáltató általi elektronikus aláírásával
történik). Szükség van egy aláíró eszközre, mely általában egy token,
mágneskártya, USB eszköz stb. Ez az eszköz végezheti az aláírást oly
módon, hogy beküldésre kerül az aláírandó adat, és az aláírást adja
vissza (megakadályozva ezzel a magánkulcs másolásának lehetőségét) -
ennek neve a BALE, biztonságos aláírás-létrehozó hardver eszköz.
Valamint szükség van egy környezetre, melyben az aláírás történik,
mondjuk egy személyi számítógépre, és különböző szoftver eszközökre,
melyek az aláíró eszközzel kommunikálnak.

A könyv megírása óta a magyar hitelesítésszolgáltatókkal (certificate
authority or certification authority - CA) kapcsolatban több változás is
történt, melyeket nyomon lehet követni a [Nemzeti Hírközlési Hatóság
Elektronikus aláírásokkal kapcsolatos nyilvántartásokat tartalmazó
honlapján](http://webold.nhh.hu/esign/index.jsp).

Itt fel vannak sorolva a nem-minősített és minősített szolgáltatók is, a
minősítettek a következők:

-   [MÁV Szolgáltató Központ Zrt.](http://hiteles.mavinformatika.hu/),
    mely várhatóan 2014 első félévében véglegesen megszünteti az
    elektronikus aláírással kapcsolatos szolgáltatásait
-   [MICROSEC zrt. e-Szignó](http://www.e-szigno.hu/)
-   [NetLock Kft.](http://www.netlock.hu/)
-   [NISZ Zrt.](http://hiteles.gov.hu/)

A [GIRO HIT@LES szolgáltatás](http://www.netlock.hu/giro/) és a [Magyar
Telekom (volt Matáv)
e-Szignó](http://www.t-systems.hu/nagyvallalatok/hitelesites_szolgaltatasok)
is megszűnt, a megszűnő szolgáltatásokat átvevő szervezet a NetLock.

Valamint létrehoztak egy Közigazgatási Gyökér Hitelesítés-szolgáltatót
(KGYHSZ) is, melynek jellegtelen [honlapján](http://www.kgyhsz.gov.hu/)
megtudható, hogy az előbb felsorolt hitelesítésszolgáltatók mindegyikét
felülminősítette, azaz egyaránt jogosultak közigazgatási felhasználásra
szolgáló, hivatali aláíráshoz és ügyfél által használt aláíráshoz
kapcsolódó tanúsítványok kibocsátására. Jelenleg tanúsítványt nem bocsát
ki.

Ahhoz, hogy minősített aláírást hozzunk létre, a minősített
tanúsítványunkon kívül szükség van egy biztonságos tanúsított minősített
aláírást létrehozó termékre is, melyet jelenleg két szervezet tanúsít,
hogy az adott hardver (ide tartozik a BALE is) és szoftver megfelel-e
aláírás létrehozására:

-   [Hunguard](http://www.hunguard.hu/)
-   [Matrix](http://www.matrix-tanusito.hu/)

Az elektronikus aláírás és annak rokon, kapcsolódó és származékos
technológiák népszerűsítésére létrejött a [Magyar Elektronikus Aláírás
Szövetség](http://www.melasz.hu/), mely kiadott egy MELASZ-Ready
Ajánlást, melynek célja, hogy a magyar közigazgatás számára kidolgozzon
egy olyan feltételrendszert az elektronikus aláírás formátumára, és egy
olyan tanúsítási eljárást, mellyel biztosítható a különböző eszközök
által készített aláírások kompatibilitása. A szabvány a W3C XML Advanced
Electronic Signatures (XAdES) szabványon alapul. A XAdES XML formátumú,
és hátránya, hogy az aláírt dokumentum megtekintéséhez először ki kell
csomagolni azt. Mivel a PDF a PKCS szabványok közül válogatott, az a
XAdES-szel nem kompatibilis, előnye viszont, hogy az aláírt dokumentum
azonnal megnyitható, kicsomagolás nélkül.

A következő aláírási termékek tanúsítottak, melyek képesek minősített
aláírás létrehozására. A Melasz a [tanúsított termékek
között](http://melasz.hu/lang-hu/tanusitott-termekek) az összeset
felsorolja az InfoCA-n kívül.

-   [Polysys CryptoSigno
    Interop](http://www.polysys.eu/hu/CryptoSignoInterop/), a
    Magyarországon első platform független, Javaban implementált
    fejlesztő készlet.
-   [Noreg eSign Toolkit](http://noreg.hu/esign-termekcsalad)
-   [Microsec
    e-Szignó](http://srv.e-szigno.hu/menu/index.php?lap=eszigno)
-   [InfoScope Kft. InfoCA](http://www.infoscope.hu/infoca.html)
-   [Argeon Infosigno](http://www.argeon.hu/infosigno.html), a cég
    felszámolás alatt.
-   [NetLock NCA TWS és NLCAPI3](http://www.netlock.net/), mely
    feltehetően a NetLock különböző alkalmazásainak, mint pl. a
    [MOKKA](http://www.netlock.hu/mokka/) magját képezi.
-   [E-Group SDX](http://www.egroup.hu/main/hu/sdx) egy termékcsalád,
    mely tartalmaz szerver oldali és kliens oldali (van böngészőbe épülő
    változata is) aláíró modulokat.

