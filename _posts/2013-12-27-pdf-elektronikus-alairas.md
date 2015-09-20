---
layout: post
title: PDF elektronikus aláírása és időbélyegzése nyílt forráskódú eszközökkel
date: '2013-12-27T16:50:00.000+01:00'
author: István Viczián
tags:
- PDF
- open source
- PKI
- Library
modified_time: '2014-01-02T16:45:03.269+01:00'
blogger_id: tag:blogger.com,1999:blog-7370998606556338092.post-3812297852319041819
blogger_orig_url: http://www.jtechlog.hu/2013/12/pdf-elektronikus-alairasa-es.html
---

Felhasznált technológiák: JDK 7, Maven 3, JUnit 4.11, iText 5.4.5,
Apache PDFBox 1.8.3, Bouncy Castle 1.49, 1.50

A PDF formátum egy olyan dokumentumleíró formátum, mely képes az
elektronikus aláírást is tárolni. Így nincs szükség külön fájlra mely az
aláírást tartalmazza, ezáltal könnyebben kezelhető, és azonnal
megnyitható akár olvasásra, akár az elektronikus aláírás ellenőrzésére.
A PDF törzsrésze un. objektumokat tartalmaz, melyek különböző típusúak
lehetnek, pl. logikai, szám, szöveges, stream, szótár, stb. Az
elektronikus aláírást egy un. signature directory tartalmazza, mely
része a tanúsítvány, a dokumentum aláírt hash-e, időbélyeg, vagy akár az
aláírás valamilyen vizuális megjelenése.

Az aláírás folyamata nagy vonalakban a következőképpen zajlik. Először
vesszük a dokumentum hasznos részét, az hash-elésre kerül, pl. SHA-256
algoritmussal, majd ez lesz az aláíró privát kulcsával titkosítva (pl.
RSA algoritmussal), és egy hexadecimálisan kódolt PKCS\#7 tárolóba
rakva. Ezután mehet az időbélyeg. Minden aláíráshoz egy un. handler
tartozik, az Adobe.PPKLite handler azt jelenti, hogy az aláírás a PKI
infrastruktúrán (publikus/privát kulcs) alapul. Akit ennél
részletesebben érdekel, olvassa el az Adobe [Digital Signatures in a
PDF](http://www.adobe.com/devnet-docs/acrobatetk/tools/DigSig/Acrobat_DigitalSignatures_in_PDF.pdf)
dokumentumát.

Akit érdekel az elektronikus aláírás témaköre, olvassa el korábbi
posztjaimat is, melyeket pár napja frissítettem, hogy naprakész
információkat tartalmazzanak: [Elektronikus aláírás és alkalmazása
Java-ban,
kulcskezelés](/2011/02/05/elektronikus-alairas-es-alkalmazasa.html),
[Minősített elektronikus
aláírás](/2008/12/02/minositett-elektronikus-alairas.html).

Valamint érdekelt, hogy a különböző szolgáltatók, mint pl. Elmű, Főgáz,
Tigáz, stb. az elektronikusan kiadott számláikat milyen módon írják alá,
ennek összesítése megtalálható egy [Google Drive
Táblázatban](https://docs.google.com/spreadsheet/ccc?key=0Avxdl4mpIvJEdGZuVHJaMWtTbmlwNkdVWS0wYUd4VlE&usp=sharing).
Örülnék, ha ki tudnátok egészíteni más szolgáltatókkal is.

Először az iText jutott eszembe, de annak a 4.x verziója lett kiadva MPL
és LGPL licensz alatt, míg az 5.x sorozatért keményen fizetnünk kell, ha
zárt forráskódú kereskedelmi alkalmazásban akarjuk használni (AGPL). A
4.x sorozattal azonban két baj is van. Egyrészt az iText megalkotója
Bruno Lowagie maga figyelmeztette a felhasználókat, hogy a 4.x sorozat
tartalmazhat olyan kódrészleteket, melyek nem szabályosan vannak LGPL
licensz alatt. Technikaibb jellegű, hogy csak a 1.38-as Bouncy Castle
Java crypto könyvtárra tartalmaz függőséget. Ez azonban az időbélyeg
kérésére beépítetten SHA-1 algoritmust használ, ami elavult, minimum
SHA-256 hash-t kéne használni. A BC 1.49 verziójában jelent meg, hogy a
TSP API SHA-1 hash-en kívül mást is tudjon használni (lsd. [release
notes](http://www.bouncycastle.org/releasenotes.html)). A BC verzióját
feljebb emelni nem sikerült, nem visszafele kompatibilis az API. Ezért
alternatív megoldás után néztem.

Legelterjedtebb nyílt forráskódú PDF library Java nyelven az [Apache
PDFBox](http://pdfbox.apache.org/), melyre már több más projekt is
átállt. Közel sem olyan jól dokumentált, mint az iText, melyhez már
könyv is van ([iText in
Action](http://www.amazon.com/iText-Action-Bruno-Lowagie/dp/1935182617/ref=sr_1_1?ie=UTF8&qid=1388156044&sr=8-1&keywords=itext)),
valamint egy [ingyenes whitepaper is
letölthető](http://itextpdf.com/book/digitalsignatures/) az elektronikus
aláírásról. A PDFBox példaprogramjai között is csak elektronikus
aláírásra van példa, az időbélyegzésre nincs.

Fontos megjegyezni, hogy minősített elektronikus aláírás esetén magát az
aláíró szoftvert is minősíttetni kell, mint az a korábbi posztomban már
megemlítettem.

A már említett poszt alapján e-mailben kértem egy NetLock teszt
tanúsítványt, valamint a UnlimitedJCEPolicyJDK7.zip tartalmát is
elhelyeztem az SDK-ban a megfelelő helyen, enélkül ugyanis a következő
kivételt kaptam:

    java.io.IOException: exception unwrapping private key 
      - java.security.InvalidKeyException: Illegal key size

A NetLock-tól megkaptam teszteléshez a fokozott (joghatással nem
rendelkező) időbélyeg url-jét (http://www.netlock.hu/timestamp.cgi),
mely autentikációt nem igényel. Ezúton köszönöm Varga Viktornak, a
NetLock Kft. Üzemeltetési és Vevőszolgálati Vezetőjének a cikk
megírásához nyújtott segítséget.

Eztán elkészítettem a példaprogramot, mely [elérhető a
GitHub-on](https://github.com/vicziani/jtechlog-signpdf). Itt
megtalálható az iText-es megoldás is, mely [láthatóan sokkal
egyszerűbb](https://github.com/vicziani/jtechlog-signpdf/blob/master/jtechlog-signpdf-itext/src/main/java/jtechlog/signpdf/PdfSigner.java),
mint a [PDFBox-os
társa](https://github.com/vicziani/jtechlog-signpdf/blob/master/jtechlog-signpdf-pdfbox/src/main/java/jtechlog/signpdf/PdfSigner.java).

Alapvetően mindkét helyen a Bouncy Castle crypto API-t használom.
Mindkét esetben ugyanolyan módon kell betölteni a tanúsítványokat,
valamint a titkos kulcsot a PKCS\#12 tanúsítványtárból, melyben az
összes böngészőből ki lehet exportálni ezeket. Az iText teljesen elfedi,
hogy mi történik a háttérben, a `MakeSignature` `signDetached` metódusát
kell hívni, valamint időbélyegzéshez át kell adni egy `TSAClient`
implementációt is.

A PDFBox esetén viszont teljesen kezünkben van a vezérlés. A
`SignatureInterface` `sign` metódusát kell implementálnunk. Az aláírás
Cryptographic Message Syntax (CMS - [RFC
5652](http://tools.ietf.org/html/rfc5652)) tárolóban tárolt a PDF-en
belül, mely a PKCS\#7 szabványon alapul. A CMS az ASN.1 standard
formátumot használja az adatok ábrázolásra. Ennek kezelésére a Bouncy
Castle `CMSSignedDataGenerator` osztálya való. Hash SHA256, titkosítási
algoritmus RSA.

Az időbélyegzés kicsit trükkösebb. Ugyanis időbélyegezni az aláírást
kell. Tehát csak aláírás után lehetséges, ezért egy lépéssel később
történik. (Mint arra a [Bouncy Castle levelezési
listán](http://bouncy-castle.1462172.n4.nabble.com/Insert-Time-stamp-into-CMS-Signed-Data-td1464065.html)
rámutatnak. Amúgy nagyon készségesek, kérdésemre is nagyon hamar
válaszoltak.) Az aláírást kell hash-elni, majd elküldeni az időbélyegző
szolgáltatónak az RFC 3161 szabvány szerint. Ezt a Bouncy Castle tsp
csomagja implementálja. Kód a
[TimeStampClient](https://github.com/vicziani/jtechlog-signpdf/blob/master/jtechlog-signpdf-pdfbox/src/main/java/jtechlog/signpdf/TimeStampClient.java)
osztályban. Arra kell nagyon vigyázni, hogy a
`TimeStampResponse.getTimeStampToken().getEncoded()` byte tömb kerüljön a
PDF-be. A timestamp formátumát az [RFC
5544](http://tools.ietf.org/html/rfc5544) írja le, szintén CMS-re
építve.

Még egy problémám akadt. Míg így már az Adobe Acrobat Reader már
tökéletesen megjeleníti az aláírást és időbélyeget is, a Foxit Reader
nem. Ennek oka, hogy a Bouncy Castle BER kódolást használ, azonban a
Foxit csak a DER kódolást tudja olvasni. Levél ment a supportra, nagyon
segítőkészek. Azonban a Bouncy Castle képes BER-ből DER-be konvertálni,
ez szintén megtalálható a példaprogramban. Az időbélyegzés megjelenítése
sincs benne a Foxit Reader-ben, erre is kaptam ígéretet.
