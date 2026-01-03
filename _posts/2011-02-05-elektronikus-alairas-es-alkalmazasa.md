---
layout: post
title: Elektronikus aláírás és alkalmazása Javaban, kulcskezelés
date: '2011-02-05T21:11:00.004+01:00'
author: István Viczián
tags:
- jce
- jca
- security
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Frissítve: 2026. január 2.

Technológiák: Java 21, JCA, JCE, keytool

Az aláírás és a titkosítás már jóval a számítógépek megszületése előtt
ismert volt. Az aláírással igazoljuk, hogy az aláírt dokumentumot
elolvastuk, esetleg mi írtuk, és tartalmával egyetértünk. A titkosítás
esetén azon dokumentumot titkosítjuk, melyről azt akarjuk, hogy egy
adott célcsoporton kívül senki se férhessen hozzá a tartalmához.

Mindez igaz az informatika világában is, és jelentőségük a hálózatok
elterjedésével egyre fontosabb. Egyrészt felmerülnek ugyanazon
problémák, mint a klasszikus esetben (pl. hamisíthatóság), valamint új
problémák is megjelennek.

Az aláírás céljai mindkét esetben a következők:

-   hitelesség (authenticity): a dokumentum származásának igazolása
-   sérthetetlenség, integritás (integrity): a dokumentum tartalma nem
    változott annak aláírása óta
-   letagadhatatlanság (non-repudiation): az aláíró nem tudja letagadni,
    hogy ő írta alá a dokumentumot, és az aláíró személy kiléte jogilag
    is bizonyítható eredjű

A titkosítás ezen felül biztosítja:

-   titkosság (privacy, confidentiality): a kommunikáló feleken kívül
    más nem szerezhet tudomást a dokumentum tartalmáról

Ez utóbbival foglalkozó tudományág a kriptográfia, mely az ógörög
eredetű szavakból származik, szó szerinti fordításban "titkosírás".
Elsősorban informatikai jellegű, és nagyon erős matematikai háttérrel
rendelkező területről van szó.

Az elektronikus aláírás és a titkosítás két nagyon közel álló terület,
ugyanazok a fogalmak, algoritmusok használtak mindkét esetben.

A titkosítás esetén a feladó és a címzett fél is rendelkezik egy
algoritmussal, a dokumentum kódolására és dekódolására. (A feladót a
szakirodalomban gyakran Alice-nek, és a címzettet Bobnak nevezik.) Mivel
ilyen algoritmusok (függvény, és annak inverze) kitalálása bonyolult
feladat, a matematikusok ezt feloldották azzal, hogy kiemelnek belőle
egy részt, mely lehetővé teszi, hogy az algoritmusokat mindenki
ismerhesse, de a titkosítás mégis működjön, és ez a rész szükség esetén
(pl. ha kiderül), cserélhető is legyen. Ez a rész a kulcs, melyet ha
csak a két fél ismer, a titkosítás biztosítva van. A kulcs cseréje gyors
művelet, míg egy algoritmus kidolgozása, és helyességének bizonyítása
sokkal nagyobb feladat. A titkosításnak azt a formáját, ahol egy közös
kulcs van, szimmetrikus titkosításnak nevezzük. A kriptográfia egy másik
alterülete a nyilvános kulcsú titkosítás (aszimmetrikus titkosítás),
mely arra ad megoldást, hogyha a feladó és a címzett fél nem tud
személyesen találkozni, egy közös kulcsot egyeztetni. A megoldás az,
hogy a feladónak és a címzettnek is van egy kulcspárja, a titkos és a
publikus kulcs. A kettő matematikai kapcsolatban van egymással, de a
nyilvános kulcs alapján gyakorlatilag nem lehet a titkos kulcsot
meghatározni. A publikus kulcs terjeszthető, míg a titkos kulcsra nagyon
kell vigyázni. Alice a saját titkos, és Bob publikus kulcsával, ha
titkosít egy dokumentumot, azt csak Bob tudja kibontani a saját titkos
kulcsával.

Elektronikus aláírás esetén a előbb a dokumentumból egy lenyomat (hash)
készül. A hash függvény egy olyan függvény, mely egy végtelen hosszúságú
adatot véges hosszúságra képez le. A hash-ből a dokumentum nem
visszanyerhető, már csak hossza miatt sem. A hash algoritmusokkal
szemben elvárás, hogy lehetőleg gyorsak legyenek, és amennyiben a
dokumentum változik, annak hash lenyomata is szignifikánsan változzon
meg (lavinahatás). Valamint egy dokumentumhoz gyakorlatilag lehetetlen
vele megegyező hash-ű értelmes dokumentumot legyártani, két dokumentum
hash-e nagy valószínűséggel különbözzön (ütközésmentesség).
(Megjegyzendő, hogy bejelentkezéshez használt jelszavakat sem szabad 
szövegesen tárolni, hiszen adatszivárgás esetén azonnal olvasható lenne,
valamint belső felhasználók, pl. rendszergazdák vagy fejlesztők is könnyen hozzáférnének.
Ezért helyette a jelszó hash-ét kell tárolni. Itt is fontos a megfelelő
hash algoritmus kiválasztása. Bejelentkezéskor a jelszóból a
rendszer egyből hash-t képez, melyet összehasonlít a tárolttal.) Az
elektronikus aláírás során Alice a saját titkos 
kulcsával titkosítja a dokumentum hash-ét. Bob elektronikus aláírás ellenőrzésekor
egyrészt megkapja a dokumentumot, melyről ugyanazon hash algoritmussal ő
is hash-t készít, és Alice publikus kulcsával ellenőrzi az átküldött aláírást.

Gyakran előforduló fogalom még a Public Key Infrastructure (PKI) -
nyilvános kulcsú infrastruktúra. Ez minden, mely szükséges a nyilvános
kulcsú aláíráshoz és titkosításhoz. Ide tartozik pl. a háttérintézmények, eljárások,
szabványok, szabályzatok, stb. Itt kerül megemlítésre a
hitelesítésszolgáltató (certificate authority or certification authority - CA),
[róluk írtam már korábban](/2008/12/02/minositett-elektronikus-alairas.html). Ugyanis
abban az esetben, ha Bobnak nem Alice adja oda a publikus kulcsát, hanem
egy rosszindulatú harmadik személy adja át a sajátját Alice nevében,
akkor ezzel legyárthat olyan dokumentumokat, melyről Bob azt hiszi,
hogy Alice írta alá, valamint titkosítás esetén az Alice-nek szánt dokumentumokat 
képes ő kibontani. Ezért egy
megbízható harmadik félre van szükség, aki igazolja, hogy az adott
publikus kulcs kihez tartozik. Ez tanúsítvány formájában történik, mely
tartalmazza az adott személy, vagy informatikai rendszer publikus
kulcsát, annak adatait (pl. személy esetében nevét, de web szerver
esetén a domain nevet), és a hitelesításszolgáltató ezt elektronikusan
aláírja (valójában itt is a hash-ét).

Nézzük, milyen szabványokat, algoritmusokat érdemes ismerni ezzel
kapcsolatban. Hash algoritmusok, többek között:

-   MD5: 2005 óta elektronikus aláírás területen használata tilos, 
    32 karakter hosszú hexadecimális hash
-   SHA-1: 2010 december 31-ével elektronikus aláírás területen
    használata tilos
-   SHA-256 vagy hosszabb használata javasolt, 256 bites, azaz 32 bájtos, 
    hexadecimálisan 64 karakter hosszú

Szimmetrikus kulcsú titkosító algoritmusok, többek között:

-   RC2, RC4: RSA cég által kifejlesztett algoritmusok, használatuk tilos
-   DES (Data Encription Standard): az amerikai kormány anno szinte
    "hivatalos" rejtjelező eljárásként minősítette, azonban használata már
    tilos
-   3DES (triple-DES): a DES-nek jelentős számú továbbfejlesztett változata
    jelent meg, de gyakorlatban a 3DES terjedt el, mely egymás után
    háromszor használja az algoritmust (encrypt - decrypt - encrypt).
    Szokták három különböző kulccsal és két különböző kulccsal (első és
    az utolsó egyezik meg) is használni. Előnye, hogy a DES
    infrastruktúra maradhat, csupán többször alkalmazzák az algoritmust.
    Használata már tilos.
-   AES (Advanced Encryption Standard): National Institute of Standards
    and Technology (NIST) által specifikált, amerikai kormány által
    elfogadott algoritmus a DES leváltására. Blokkos titkosító algoritmus.
-   ChaCha20: stream alapú algoritmus, TLS 1.2 és TLS 1.3, OpenSSH alatt használják.
-   Blowfish, Twofish régebbi algoritmusok.

Aszimmetrikus kulcsú titkosító algoritmusok, többek között:

-   RSA: Egyik leggyakrabban használt titkosítási eljárás, de facto
    szabvány, matematikai alapjait a moduláris- és a prímszámelmélet
    egyes tételei jelentik, faktorizáción (prím tényezőkre bontáson)
    alapul. Míg a prím számokkal való szorzás egyszerű, a prím tényezős
    felbontásra nincs hatékony algoritmus, ha egy szám két igen nagy
    prímszám szorzata, akkor ennek prímtényezős felbontása rendkívül
    sokáig tart. 2000-ben lejárt a szabadalmi védelme.
-   Digital Signature Algorithm (DSA): NIST javasolta, és az USA
    digitálisaláírás-szabványává vált (Digital Signature Standard (DSS),
    specifikálva a FIPS 186-ban, azóta FIPS 186-3-ban).

Az aszimmetrikus titkosító algoritmusok hátránya, hogy sokkal lassabbak
a szimmetrikus kulcsú titkosító algoritmusokhoz képest. Ezért pl. a TLS
azt a trükköt alkalmazza, hogy kapcsolat felvételekor PKI-t használ, de
lekommunikálnak egy szimmetrikus kulcsot, és a továbbiakban azzal,
szimmetrikus titkosítással történik a kommunikáció.

Az elektronikus aláírás és titkosítás területének egyik legismertebb
szabványosító testülete az RSA Security, mely nemcsak az RSA algoritmust
dolgozta ki, de ő hozta létre a széles körben alkalmazott és
implementált [PKCS
szabványcsaládot](https://en.wikipedia.org/wiki/PKCS), mely
jelenleg 15 tagból áll, bár van közöttük, ami már érvénytelen. Ennek pl.
első eleme a PKCS \#1, ami az RSA algoritmus, és az RFC 3447 definiál.

Az X.500 szabvány hálózati szabványok gyűjtője, és része az X.509
szabvány is, mely definiálja többek között a tanúsítvány formátumát is.
Ahogy említettem, a tanúsítvány tartalmaz a publikus kulcson kívül leíró
adatokat is, pl. itt kell megemlíteni a hagyományos X.500 distinguished
name-t (DN), melyet címtár szolgáltatásokban (pl. LDAP esetén elterjedt)
használatos egyedi azonosítóként fejlesztettek ki, mellyel hierarchikus
struktúrát lehet megadni, ezek közül a leggyakoribbak az ország (C -
country), állam vagy tartomány (ST - state or province), város (city or
locality - L), szervezet (O - organization), szervezeti egység (OU -
organization unit) és általános név (CN - common name). Ezzel lehet
megadni a tanúsítvány tulajdonosát, de magát a tanúsítványkiadót is.
Ezen kívül olyanokat tartalmaz még a tanúsítvány, mint a szabvány
verziószáma, algoritmus, kiadó, érvényesség, stb., és ezt írja alá a
tanúsítványt kiadó. A tanúsítvány kiadójának szintén lehet tanúsítványa,
melyet egy másik tanúsítány kiadó adott ki. Az így összeállt láncot
hívják tanúsítványláncnak. Érdemes még írni a visszavonási listákról
(CRL) is. Hogy a rendszer le legyen védve az ellen, hogy egy kulcspárt
ellopnak, és visszaélnek vele, bevezették a visszavonási lista fogalmát.
Az eltulajdonított tanúsítványokat be lehet jelenteni, ekkor a
visszavonási listára kerül. Ami ezen rajta van, az ahhoz tartozó
aláírásokat nem lehet elfogadni. Mivel az eltulajdonítás ténye nem derül
ki azonnal, bevezették a kivárási idő fogalmát. Aláírás ellenőrzéskor
ugyanis nem szabad azonnal elfogadni azt, hanem ki kell várni a kivárási
időt. Ha a tanúsítvány utána sem kerül visszavonási listára, az aláírás
elfogadható. A visszavonási listánál korszerűbb és rugalmasabb megoldás
az OCSP használata. Az OCSP szolgáltatás használatával rákérdezhetünk
egy tanúsítvány visszavonási állapotára, és azonnal hiteles és aláírt
választ kapunk. Így nem kell eltelnie a kivárási időnek.

Amikor egy https oldalt nézünk, akkor a háttérben TLS
titkosított protokollon történik a kommunikáció, mely szintén használja
a PKI-t, így szintén tanúsítványokkal dolgozik. A böngészőben ezt a
tanúsítványt meg tudjuk nézni. Nézzük meg pl. a https://www.netlock.net/
cím tanúsítványát.

<a href="/artifacts/posts/2011-02-05-elektronikus-alairas-es-alkalmazasa/netlock_tanusitvany_2_b.png" data-lightbox="post-images">![NetLock tanúsítvány](/artifacts/posts/2011-02-05-elektronikus-alairas-es-alkalmazasa/netlock_tanusitvany_2.png)</a>

Látható, hogy a lánc három elemből áll, NetLock Arany (Class Gold)
Főtanúsítvány, NetLock Üzleti (Class B) tanúsítványkiadó, valamint a
www.netlock.hu tanúsítványokból. Mindegyik adatait le lehet kérni. Akkor
hiteles egy tanúsítvány, ha a kibocsájtó tanúsítványa is hiteles.
Viszont a gyökér elemnél már nincs kiadó (pontosabban a kiadója saját
maga), így annak hitelességét más úton kell garantálni. A böngészők
esetében alapesetben benne van egy halom hitelesítésszolgáltató, vagy ha
nincs benne, manuálisan fogadhatjuk azt el.

Az X.509 tanúsítványokat különböző tároló formátumokban tárolhatjuk.
Exportálható DER bináris formátumban, vagy ennek Base64-gyel kódolt
variánsában (PEM). Base64 esetén az
állományban valami hasonlót látunk:

    MIIHfzCCBmegAwIBAgIOSd0P5gz1tLCtWdzTs8EwDQYJKoZIhvcNAQELBQAwgakx
    ...
    EWE+wAfK6TOVlqZIykQxcCU+uzYBR+l0WGYKmNUi3bfXKt0YttWHZ2OHB4UXGtjm
    ZBtg

Ezt kicsomagolva Base64-gyel egy bináris DER állományt kapunk. Ezt is ki
lehet bontani, pl. [webes szolgáltatás](https://certlogik.com/decoder/)
is van rá. Ekkor láthatjuk a felépítését szövegesen is.

<a href="/artifacts/posts/2011-02-05-elektronikus-alairas-es-alkalmazasa/netlock_tanusitvany_kibontva_2_b.png" data-lightbox="post-images">![Cretificate Decoder](/artifacts/posts/2011-02-05-elektronikus-alairas-es-alkalmazasa/netlock_tanusitvany_kibontva_2.png)</a>

Látható a használt hash és titkosító algoritmus is:
sha256WithRSAEncryption, valamint a kiadó és a tárgy DN-je is.

Egy egyszeri Java programozó mikor is találkozhat ezzel? Többször, mint
gondolnánk:

-   Applet, Java Web Start, JAR aláírása
-   Aláírás/titkosítás alkalmazásból
-   HTTPS kommunikáció konfigurálása Web konténerben, szerver oldali
    tanúsítvánnyal
-   Web alkalmazásnál kliens oldali tanúsítványok használata
    autentikációhoz

Javaban az elektronikus aláírás és titkosítás, a Java Cryptography
Architecture (JCA), és Java Cryptography Extension (JCE) API-k
segítségével történik. Ezek klasszikus értelemben vett API-k, azaz
interfészt biztosítanak, provider-based architecture-t valósítanak meg,
azaz az alatta lévő implementáció cserélhető, akár csak a JDBC esetén a
driver. Egyik eszköze a Factory design pattern, azaz nem kell az
objektumot példányosítani, hanem egy Factory végzi el nekünk a különböző
konfigurációk alapján (pl. melyik az elérhető és kiválasztott
implementáció).

Ahhoz, hogy megértsük, hogy miért alakult ki a JCA és a JCE is, vissza
kell kicsit menni az időben. Régebben a titkosító algoritmusokra
Amerikában nagyon szigorú export korlátozások voltak érvényben. A JCA
kizárólag aláírásra használható, nem lehetséges vele, és az alapját
képző algoritmusokkal titkosítani. Sőt, nem hogy titkosító
algoritmusokat nem lehetett exportálni, de olyan keretrendszereket sem,
melyekbe ezek beilleszthetőek. Ezért a JCE külön keretrendszer volt
(optional package), melyet külön kellett letölteni és telepíteni. A Java
1.4-től kezdve azonban integrálták a JDK-ba, a SunJCE providerrel
együtt. Alapban egy ún. restricted policy fájllal együtt települ, mely
korlátozza bizonyos algoritmusok és kulcsméretek használatát. Persze a
legtöbb országból letölthető az ún. unrestricted policy fájl, mely már
engedélyezi ezeket. Ez a [letöltések
között](https://www.oracle.com/java/technologies/jce-6-download.html)
Java Cryptography Extension (JCE) Unlimited Strength Jurisdiction Policy
Files 6 néven megtalálható. Ezen kívül telepíthető a JCE alá bármilyen
aláírt provider, melyhez van unrestricted policy fájl. A Java 8u161-től
alapértelmezett az unlimited strength policy.

A Sunos JDK-ban alapértelmezetten megtalálható egy Sun implementáció is,
mind a JCA (SUN), mind a JCE alá (SunJCE). Természetesen alternatív
megvalósítást is telepíthetünk, pl. választhatjuk a [Bouncy
Castle](https://www.bouncycastle.org/documentation/documentation-java/)-t. Mivel ezt ausztrálok
fejlesztették, így nem vonatkozik rá az amerikai export korlátozás. Ami
még megragadhatja a figyelmünket ezzel kapcsolatban:
Generators/Processors for OpenPGP (RFC 2440).

Nagy vonalakban a SUN JCA implementáció tartalmazza az MD5 és SHA1
hash-függvényeket, valamint a DSA aláíró algoritmus egy
implementációját. Valamint képes kezelni az X.509 tanúsítványláncokat és
tartalmazza a JKS kulcsadatbázis implementációt. A SunJCE tartalmazza a
DES, 3DES, Blowfish szimmetrikus rejtjelező algoritmusokat, az RSA
aszimmetrikus titkosító algoritmust, JCEKS biztonságosabb kulcsadatbázis
implementációt, stb. A JCA és JCE dokumentációja is összeolvadt már a
Java 6-ban, megtalálható a [biztonsággal foglalkozó
specifikációkban](https://docs.oracle.com/en/java/javase/21/security/).

Ahhoz, hogy a PKI-t használatba vehessük, először egy kulcspárra van
szükségünk. Ezek tárolására a kulcstár szolgál, mely tárolja a privát és
publikus kulcsokat, tanúsítványokat, stb. Több implementáció közül is
lehet választani, az alapértelmezett a JKS (Java keystore), a másik a PKCS \#12.
Sokáig a JKS nagyon elterjedt volt, de Java specifikus, ezért inkább válasszuk
a PKCS \#12-őt, hiszen az szabvány, és minden ismeri.
A JKS két szintű jelszóval védett tároló, ugyanis van egy mester jelszó, mellyel a
kulcstárhoz lehet hozzáférni, és minden kulcspárhoz is lehet külön
jelszót rendelni (ezt akkor kell megadni, mikor a titkos kulcshoz
történik hozzáférés). A PKCS \#12 kulcstárhoz azonban csak egy jelszót lehet megadni.

A kulcstárak kezelésére a
[keytool](https://docs.oracle.com/en/java/javase/21/docs/specs/man/keytool.html)
eszköz való, mellyel lehet kulcspárokat létrehozni, exportálni,
importálni, listázni, törölni, stb. A keytool viszonylag bő
paraméterezési lehetőséggel rendelkezik, de rengeteg paraméternek
alapértelmezett értéke van, így nem kell mindent megadni. Amennyiben
bizonyos paramétereket nem adunk meg, interaktív módon rákérdez.

A következő paranccsal hozzunk létre egy JKS kulcstárat, és benne egy
kulcspárat. Ekkor létrejön egy `mykeystore` állomány, `storepass`
jelszóval. Benne egy tanúsítvány SHA1withDSA hash és titkosító
algoritmussal, mely `jtechlog` néven elérhető, és a jelszava `keypass`.
A tanúsítvány ún. önaláírt (self-signed), ami azt jelenti, hogy a
tanúsítványhoz tartozó titkos kulccsal lett aláírva.

    keytool -genkeypair -dname "cn=Viczian Istvan, ou=JTechLog, o=Blog, c=HU"
      -alias jtechlog -keyalg RSA -keysize 2048 -storetype PKCS12 
      -keystore mykeystore.p12 -storepass storepass -validity 180

Amennyiben ki akarjuk listázni a keystore tartalmát, a következő
parancsot adjuk ki, és a következő kimenetet látjuk.

    keytool -list -keystore mykeystore.p12 -storepass storepass

    Keystore type: PKCS12
    Keystore provider: SUN

    Your keystore contains 1 entry
    jtechlog, 2026. jan. 3.,PrivateKeyEntry,
    Certificate fingerprint (SHA-256): 9E:6E:DF:78:2E:BB:51:35:03:CC:E9:B4:58:D3:5E:1F:36:0D:42:4D:44:E3:E0:79:76:71:F9:A7:98:C2:ED:34

Amennyiben a kiválasztott tanúsítvány részleteit akarjuk kiírni, adjuk
ki a következő parancsot:

    keytool -list -keystore mykeystore.p12 -storepass storepass -alias jtechlog -v

    Alias name: jtechlog
    Creation date: 2026. jan. 3.
    Entry type: PrivateKeyEntry
    Certificate chain length: 1
    Certificate[1]:
    Owner: CN=Viczian Istvan, OU=JTechLog, O=Blog, C=HU
    Issuer: CN=Viczian Istvan, OU=JTechLog, O=Blog, C=HU
    Serial number: 5f98691aaacf4167
    Valid from: Sat Jan 03 00:06:51 CET 2026 until: Thu Jul 02 01:06:51 CEST 2026
    Certificate fingerprints:
        SHA1: CE:5C:CE:7F:29:57:C2:CE:4A:FA:5F:18:AB:49:EA:2F:49:75:E1:A5
        SHA256: 9E:6E:DF:78:2E:BB:51:35:03:CC:E9:B4:58:D3:5E:1F:36:0D:42:4D:44:E3:E0:79:76:71:F9:A7:98:C2:ED:34
    Signature algorithm name: SHA384withRSA
    Subject Public Key Algorithm: 2048-bit RSA key
    Version: 3

    Extensions: 

    #1: ObjectId: 2.5.29.14 Criticality=false
    SubjectKeyIdentifier [
    KeyIdentifier [
    0000: 5A 14 5A FE BE 51 D6 07   F4 EA 5A FB D5 74 C9 40  Z.Z..Q....Z..t.@
    0010: 67 81 89 89                                        g...
    ]
    ]



Látható, hogy a kiadó és a tulajdonos ugyanaz, tehát tényleg egy
önaláírt tanúsítványról van szó. Ezt ki is tudjuk exportálni az X.509
szabványnak megfelelően, akár PEM, akár DER bináris formátumban.
Alapértelmezett a bináris, az `-rfc` kapcsolóval tudjuk kiexportálni a
PEM formátumban.

    keytool -exportcert -keystore mykeystore.p12 -storepass storepass -alias jtechlog
      -rfc -file jtechlog.cer

Ennek formátuma:

    -----BEGIN CERTIFICATE-----
    MIIDMzCCAhugAwIBAgIIX5hpGqrPQWcwDQYJKoZIhvcNAQEMBQAwSDELMAkGA1UE
    ...
    6ic5sw/+vA==
    -----END CERTIFICATE-----


Ezt természetesen ugyanúgy lehet a böngészőbe importálni.

<a href="/artifacts/posts/2011-02-05-elektronikus-alairas-es-alkalmazasa/jtechlog_tanusitvany_b.png" data-lightbox="post-images">![Importált tanúsítvány](/artifacts/posts/2011-02-05-elektronikus-alairas-es-alkalmazasa/jtechlog_tanusitvany.png)</a>

Ha hiteles tanúsítványt szeretnénk, akkor a tanúsítványunkat egy
hitelesítésszolgáltatónak is alá kell írnia. Ehhez először egy ún.
kérvényt (csr - [Certificate signing
request](http://en.wikipedia.org/wiki/Certificate_signing_request)) kell
készítenünk, és beküldenünk a hitelesítésszolgáltatónak. Ez a PKCS \#10
specifikációnak megfelelő formátumban teszi.

    keytool -certreq -keystore mykeystore.p12 -storepass storepass
      -alias jtechlog -file jtechlog.csr

Ennek tartalma szintén egy bináris állomány Base64-gyel kódolva, a
következő formátumban:

    -----BEGIN NEW CERTIFICATE REQUEST-----
    MIICvTCCAaUCAQAwSDELMAkGA1UEBhMCSFUxDTALBgNVBAoTBEJsb2cxETAPBgNV
    ...
    P8or0dnrpa9roTG+SwpEfu/T3BUOpW0mEHi1s4/cnEDx
    -----END NEW CERTIFICATE REQUEST-----


Erre a hitelesítésszolgáltató egy felülhitelesített tanúsítványt küld
vissza a megfelelő azonosítás és díjfizetés után. 

Teszteléshez lehetőség
van a hitelesítésszolgáltatóktól teszt tanúsítványt is igényelni. A
NetLock esetén pl. egy
[űrlapon](https://www.netlock.hu/index.cgi?lang=HU&tem=ANONYMOUS/online/online_indul.tem)
az e-mail címünket megadni, majd oda kapjuk a további instrukciókat.
(Zárójelben megjegyzem,
hogy ugyanilyen teszt tanúsítvány a [Microsec
honlapjáról](https://srv.e-szigno.hu/szoftveres_teszt_igenyles)
is letölthető.)
A teszt tanúsítványhoz nem az általunk generáltat hitelesíti, hanem generál egy
új kulcspárt. Ez nem a szerveren történik, hanem a kliens oldalon,
ezért egyrészt telepítenünk kell egy NLToken alkalmazást,
másrészt egy böngésző bővítményt. A webes felületen ekkor jelenik meg
a kiválasztható kriptográfiai szolgáltatók között a Microsoft Software Key Storage
Provider. A Kulcsgenerálás gombra kattintva megjelenik a Windows
tanúsítványok között. Ezt a _Felhasználói tanúsítványok kezelése_
programmal tudjuk megkeresni (Windowson).

A tanúsítványt megnyitva nem megbízható, ugyanis nincs a tanúsítványkiadó
tanúsítványa telepítve. A NetLock Teszt Tanúsítványkiadó
[tanúsítványát](http://www.netlock.hu/index.cgi?raw&ca=teszt3&lang=HU) letölthetjük,
és telepíthetjük. Ekkor már megbízható lesz a tanúsítványunk, hiszen megvan a lánc minden
tagja. A NetLock által kiadott teszt tanúsítvány SHA-256 hash
algoritmust és 2048 bit hosszú RSA kulcspárt használ.

<a href="/artifacts/posts/2011-02-05-elektronikus-alairas-es-alkalmazasa/netlock_teszt_tanusitvany_b.png" data-lightbox="post-images">![Teszt
tanúsítvány](/artifacts/posts/2011-02-05-elektronikus-alairas-es-alkalmazasa/netlock_teszt_tanusitvany.png)</a>

Innen szintén PKCS \#12 formátumban tudjuk exportálni, ebben benne van a titkos kulcs, és
a tanúsítvány is a publikus kulccsal. Mentsük tehát kia
tanúsítványt `jtechlog-netlock-test.pfx` néven,
és adjunk meg egy jelszót: `storepass`. Listázzuk ki a tartalmát a
keytool segítségével.

    keytool -list -keystore jtechlog-netlock-test.pfx  -storetype PKCS12
      -storepass storepass

    Keystore type: PKCS12
    Keystore provider: SUN

    Your keystore contains 1 entry

    netlockkeycontainer176743450410280, 2026. jan. 3., PrivateKeyEntry, 
    Certificate fingerprint (SHA-256): 0A:6D:E1:BB:03:1A:CD:45:6C:31:BF:EA:83:E1:EA:1E:26:50:F2:AD:DD:A2:CF:8E:29:50:41:72:94:AE:5E:34

A Java nem a rendszer tanúsítványtárát használja, hanem sajáttal rendelkezik,
ami Java 21-ben a `JAVA_HOME`-on belül a `lib/security/cacerts` fájl.
Ez JKS formátumú, és alapértelmezett jelszava `changeit`.

Ennek tartalmát is kilistázhatjuk a következő paranccsal.

    keytool -list -cacerts

    Keystore type: PKCS12
    Keystore provider: SUN

    Your keystore contains 97 entries

    actalisauthenticationrootca [jdk], 2026. jan. 3., trustedCertEntry, 
    Certificate fingerprint (SHA-256): 55:92:60:84:EC:96:3A:64:B9:6E:2A:BE:01:CE:0B:A8:6A:64:FB:FE:BC:C7:AA:B5:AF:C1:55:B3:7F:D7:60:66


Aki nem akar parancssorból bajlódni, az használhatja a grafikus
[Portecle](https://github.com/scop/portecle) (eredetileg SourceForge-on található) alkalmazást is.

<a href="/artifacts/posts/2011-02-05-elektronikus-alairas-es-alkalmazasa/portecle_b.png" data-lightbox="post-images">![Portecle](/artifacts/posts/2011-02-05-elektronikus-alairas-es-alkalmazasa/portecle.png)</a>

Megjegyzem, hogy az openssl is képes X.509 és PKCS \#12 tanúsítványokat,
valamint PKCS \#10 Certificate signing requesteket használni, melyek
kezelhetők a keytoollal.