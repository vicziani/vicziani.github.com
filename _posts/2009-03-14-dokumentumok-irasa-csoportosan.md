---
layout: post
title: Hogyan írjunk dokumentációt csoportmunkában?
date: '2009-03-14T22:04:00.007+01:00'
author: István Viczián
tags:
- Módszertan
modified_time: '2018-06-09T10:00:00.000-08:00'
---

A Java fanatikusokat el kell most keserítsem, ugyanis nem technikai
témájú hozzászólás, hanem csoportmunkával kapcsolatos poszt következik.
Az utóbbi időkben főleg nem fejlesztenem kellett, hanem
követelményspecifikációt írni csoportban, és ennek tapasztalatait
szeretném veletek megosztani, de legalábbis magamnak felírni, hogy ne
felejtsem el a következő projekt elején. Nem módszertanról szeretnék
írni, hanem a gyakorlati munkaszervezésről. Utólag átolvasva meglepően
sok dologban hasonlít a programozáshoz. Ígérem, a következő poszt
technikai lesz, mivel szerdán (2009. március 18-án) a
[JUM](http://jum.hu/?q=node/15)-on tartok előadást, melynek anyagát
kirakom ide is.

Nézzük a manapság oly divatos felsorolást.

## Az elején fektessétek le az alapszabályokat

Ezt egy nagyon jó "train the trainer" képzésen hallottam. A szabályokat
már a munka elején le kell fektetni. Mivel minden résztvevő
meghallgatja, és beleegyezik, ezért ehhez is próbálja tartani magát,
ezekre lehet később hivatkozni. Nem önkényuralmi eszközökkel kell ezen
szabályokat meghozni, hanem közösen, mindenki számára biztosítva a
hozzászólást, hogy mindenki egy kicsit magának érezze az ügyet. Ha
megvannak a keretek, akkor könnyebb lesz azokon belül maradni. Ezen
keretek lehetőség szerint legyenek dokumentálva. Nem kőbe vésettek, ha
később valamire rájövünk, hogy másképp jobban működik, akkor módosítani
kell, de erről mindenkit tájékoztassunk, és mindenki egyezzen bele. Ne
felejtsük el ezeket, folyamatosan ezekhez igazodjunk, és tartsuk karban.
Ez a dokumentum lesz az én alapszabályaim alapja.

## Válasszatok eszközt az információ tárolására

A követelményspecifikáció esetén különösen jellemző, hogy az információk
különböző helyekről esnek be, ilyenek például:

-   Interjúk
-   Telefonos és személyes megbeszélések
-   Elektronikus kommunikációs csatornák, mint e-mail, hangalapú és
    szöveges chat, stb.
-   Elolvasott dokumentumok, emlékeztetők, jogszabályok, stb.
-   Saját ötletek, az olvasottakkal kapcsolatban megfogalmazott kérések

Ezek nyilvántartására, rendszerezésére nem elegendőek az egyszerű
megoldások, valamilyen szofisztikáltabb eszközt, vagy módszert kell
választani. Szerintem az egyik legjobb megoldás tudástár építésére a
wiki alapú eszközök, személy szerint az [Atlassian
Confluence](http://www.atlassian.com/software/confluence/) Java alapú,
Enterprise Wiki-re esküszöm. Lehet az oldalakhoz csatolmányokat fűzni,
amiben keresni is képes, valamint e-mail postafiókokból is a leveleket
képes letölteni, ezzel egy teljes információ konglomerátummá válni.
Persze lehetnek mondjuk Word dokumentumok is egy megosztott, de inkább
egy Subversion szerveren, melyet
[WebDAV](/2009/02/11/webdav-tapasztalatok.html)-on keresztül lehet
elérni. Elvárás az eszközzel kapcsolatban, hogy verziókezelést, valamint
nem csak számítógép guruk által legyen használható. Mit ér a
szofisztikált eszköz, ha nehéz kezelni, megtanulni. Ráadásul ilyen
dokumentumokat nem csak informatikailag magasan képzett felhasználók
írnak.

Fontos, hogy az összes beáramló információt tereljünk ebbe a mederbe. Ha
pl. egy e-mail jön be, akkor "feldolgozom", az összes lényeges
információt átvezetem a rendszerbe, az attachment-et is átcsatolom, ha
más számára is érdekes lehet. Vigyázz, ahol lehet egyszerűsíts. Csak a
lényeget vezesd át.

## Készíts dokumentum sablonokat

Jó, ha készítetek sablonokat, amiket aztán csak ki kell tölteni. Legyen
előlapjuk (címmel, dátummal, szerzővel, dokumentumtörténettel,
jóváhagyókkal, elosztási listával, stb.), tartalomjegyzékük, figyelj a
fejlécre, láblécre. Alkalmazkodj a céges, projekt és minőségbiztosítási
előírásokhoz. Használd a dokumentum meta-leírását, Word-ben az
adatlapot, és a dokumentumban hivatkozz ezekre.

## Tervezz és oszd szét a feladatokat

Egy jó dokumentáció megírásához is alapos tervezés szükséges. Én
általában úgy kezdem, hogy egy szövegszerkesztőben, vagy egy papíron
összeírom a kulcsszavakat, amikről írni szeretnék. Utána megpróbálom
rendezgetni, csoportosítani őket. Valamiket könyörtelenül ki kell
húznom, mert nem témája a dokumentumnak (vagy áttenni egy másikhoz),
vagy újakkal kiegészítenem. A legfontosabbakat kiemelem, és hierarchiát
alkotok. Ezzel meg is van a dokumentum tartalomjegyzéke, melyek alá a
nem olyan fontos kulcsszavak bekerülnek témaként, hogy ebben a
fejezetben erről kell írni. Majd a tartalomjegyzékbe lehet neveket írni,
hogy melyik fejezet megírása kinek a feladata.

## Ne találd fel a kereket!

Feltehetőleg te is, valamint kollégáid is rengeteg
követelményspecifikációt, rendszertervet, programozói és üzemeltetési
dokumentációt írtak. Használd fel a hasznos részeket újra. Meríts a
felépítésükből, a tartalmukból. Valamint te is úgy írd meg a
dokumentációt, hogy később meríteni lehessen belőle, újra fel lehessen
használni.

## Adj mintát

Lehetőleg válaszd a legbonyolultabb fejezetet, írd meg, add körbe
véleményezésre, és ezt használjátok alapul. De ne másoljátok! Ezzel egy
mintát nyújtasz, amin tisztázható a stílus, a formátum, a szóhasználat.
Jobb, mint a végén egységesíteni a stílust.

## Készíts szójegyzéket

Készítse egy szójegyzéket, fogalommagyarázatot, ami tartalmazza a fontos
fogalmakat, gyakran használt szavakat, rövidítéseket. Írd meg a szó
rokonértelmű szavait is, de a dokumentumban az egységesség kedvéért
mindig csak az eredeti szót használjátok. Ezzel definiálhatod, hogy mit
kell egybe írni, mit kell külön írni, mit kell nagybetűvel írni, mit
takar a rövidítés, stb.

## Ne ismételj

Sok dokumentációban látom, hogy tele van ismétléssel, copy-paste-tel. Ez
két ok miatt sem jó. Egyrészt általában akinek a dokumentum készül (pl.
fejlesztő, ügyfél) nem szeret olvasni, feleslegesen nem szabad untatni.
Másrészt karbantartani is nehezebb, mert ha változik egy rész, az összes
helyen, ahova másolva lett, módosítani kell. Ez egyrészt
erőforrásigényes művelet, másrészt nem biztos, hogy minden előfordulást
javítottunk. Ezen eszközökben nagyon jól lehet referenciákat kezeni,
wiki esetén egyszerű linkekkel, Word esetén kereszthivatkozásokkal.

## Tartsd egyszerűen

Senki nem szeret unalmas, hosszú, száraz anyagot olvasni. Nagyon sokan
azt hiszik, a hosszú dokumentum a jó dokumentum. Egy rövid, lényegre
törő, kompakt dokumentum sokkal célravezetőbb lehet. Aki meg nem így
gondolja, azzal akarunk mi együtt dolgozni?

Gyakori hiba az is, hogy a dogokat túlkategorizálják. Ezerféle
hierarchiát dolgoznak ki, nagyon mély tartalomjegyzésket, stb. Majd a
végén derül ki, hogy a feléről keveset tudnak csak írni, ezért
egybeolvasszák egy másikkal. Talán a fordított elképzelés jobb, mikor
egy viszonylag egyszerű hierarchiát alakítunk kis, és mikor egy fejezet
túlnő egy méreten, akkor bontjuk kisebbekre.

## Ne tarts meg magadnak információt

Ha bárhonnan információt kapsz, azonnal oszd meg a többiekkel. A többiek
segíthetnek feldolgozni, rendszerezni, olyan kérdéseket tehetnek fel,
olyan aspektusokat fedezhetnek fel, amik neked épp nem jutnak az
eszedbe. Valamint ha bármi történik veled, jobb esetben csak másik
projektre kerülsz, azonnal át tudják venni a feladataidat.

## Ne dolgozz saját gépre

Csak a tudástárba, vagy a megosztott Word dokumentumba írj, ne a saját
gépeden egy eldugott állományba. Hidd el, kevés embert zavar egy félkész
anyag, mindenki a saját munkájával van elfoglalva, sokkal nagyobb
probléma, ha az anyag elvész, vagy nem kerül időben a többiekhez. Pl.
hazamész este, és elfelejted a közös helyre felmásolni. Különösen igaz
ez mostanában, mikor általában nem kötött munkaidőben dolgozunk ezeken
az anyagokon.

## Több szem többet lát

Olvasd el más fejezeteit, és mások is olvassák el a te fejezeteidet.
Lehetőleg ne színessel firkálj bele, hanem szabványos eszközöket
használj, mint a Word korrektúrája, vagy megjegyzés hozzáadása.
Amennyiben valamire konkrét javaslatod van, akkor ne megjegyzésként fűzd
hozzá, hogy valahogy így kéne módosítani, hanem korrektúrával módosítsd.
A másiknak könnyebb ezt elfogadnia, mint a te iránymutatásod alapján az
ő szavaival megfogalmaznia. Ha valamiben nem vagy biztos, vagy kérdésed
van hozzá, akkor alkalmazd a megjegyzést.

## Ne küldj levélben információt

Mások dolgát megkönnyítve dolgozd fel azt, tedd be a közös rendszerbe,
és csak egy linket küldj tovább. A levelezés nem annyira integrált,
kereshető, archiválható, verziókezelhető.

## Gyűjtsd a kérdéseid

Egységes helyen gyűjtsétek a kérdéseket, és a rá kapott válaszokat is,
megfelelően kategorizálva. Fontos, hogy a válaszokat is, gyakran van
olyan, hogy egy kérdésre egyszer így válaszoltak, egyszer úgy, és nem
tudjuk észben tartani, hogy melyik is volt az utolsó álláspont. Ebben
segít, hogy gyűjtitek ezeket. Ezek sem maradjanak sosem csak levélben.

## Refactor

Amennyiben úgy érzed, hogy nem megfelelő az adott szerkezet, felépítés,
ne félj hozzányúlni. Vonj össze fejezeteket, bontsd szét őket, vezess be
újabbakat, módosítsd a hierarchiát.

## A tartalomra koncentrálj, ne a formátumra

Az egyik legfontosabb. Akkor tudok megőrülni, mikor a dokumentum
alkotója félkész állapotban "tördeli", formázza a dokumentumot. Én, hogy
magam erről leszoktassam, először minden dokumentumot egy darabig
Notepadben írtam, és a címeknél helyeztem el sortörést. Ha a dokumentum
így is megállta a helyét, akkor elégedett voltam. Most már egyből
Word-be írom, és csak a Címsor 1, 2, 3 stílusokat használom, valamint
kód esetén készítek egy kód stílust, meg néha szükségem van táblázatra
is. Ezen kívül semmilyen más formázási funkciót nem vagyok hajlandó
használni. Azt csak a munkafolyamat végén szabad, template-ek
használatával, vagy a stílusok felüldefiniálásával. Ebben segített a
HTML is, ahol ugyanígy kell a tartalmat és a stílust elválasztani,
egyiket az (X)HTML-ben, másikat a CSS-ben kell definiálni. Megőrülök, ha
valaki üres hely képzésére a sortörést használja. Borzasztó, hogy sokan
nem ismerik a Shift+Enter fogalmát. Üres hely definiálására a térközt
kell használni. Ne mi sorszámozzunk, bízzuk rá az eszközre. Használjuk a
képaláírásokat, táblázatok leírásait. Ha így használnánk a Word-öt,
akkor nem lenne annyi bajunk az oldaltörésekkel, valamint egyéb
misztikus hibajelenségekkel. Valamint rengeteg időt takarítanánk meg, ha
a dokumentum írása közben nem foglalkoznánk a formátummal, és hogy hova
jönnek ki az oldaltörések. Ültetek már valaki mellett azt nézve, hogy az
ecsettel formátumot másol percekig?

## Használj helyesírás ellenőrzőt

Igen elterjedt eszköz, de mégis sok helyről kapok olyan dokumentumokat,
melyben nyüzsögnek a helyesírási hibák. Több platformon, és eszközbe
beépítve is megtaláljuk, ne sajnáljuk rá az időt. Hiába professzionális
a tartalom, a hibák ennek fényét homályosítják. Még jobb, ha van egy
korrektor a cégnél, vagy egy magyar szakos, azok átolvasva is rengeteg
stilisztikai hibát tudnak javítani. A fejlesztők általában szeretik a
szenvedő szerkezeteket, és nem szeretnek egyeztetni, az igeidőket, alany
használatát, feltételes módot nem következetesen ugyanúgy használják a
dokumentumban.

## Hagyj időt a végére

Sokan még az utolsó percig írják a dokumentumot. Próbáld meg úgy
ütemezni, hogy a végén legyen egy kis idő pihenni rá egyet, majd újból
elolvasni. A végső összeszerkesztés is több időbe szokott telni, mint
azt az ember elgondolja.
