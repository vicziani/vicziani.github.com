---
layout: post
title: Miért ne fejlesszünk saját keretrendszert?
date: '2011-05-11T23:06:00.002+02:00'
author: István Viczián
tags:
- Módszertan
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Ahogy különböző cégeknél végzek tanácsadásokat, sok helyen látom, hogy
saját keretrendszert fejlesztettek, fejlesztenek, döntenek a fejlesztése
mellett. Én nem vagyok híve az ilyen jellegű saját megoldásoknak, és
mivel sokszor kérdezik, és szóba kerül, leírom az ezzel kapcsolatos
gondolataimat.

Saját keretrendszer fejlesztésének több oka is lehet. Találkoztam több,
mint tíz éves (igen, Java) rendszerekkel, ahol ilyent használnak még
mindig. Ezen szoftverek abból az időből származnak, amikor még JDBC,
Servlet API létezett, és nem volt egységes, kialakult irány, szabványok,
kvázi szabványok. Nem volt objektum-relációs megfeleltetés, MVC webes
keretrendszerek. Ebben az esetben természetesen elfogadható saját
keretrendszer kifejlesztése, bár itt is erősen ajánlott haladni a
korral, és ahol lehet, újabb, szabványosabb irányokba elmozdulni. Láttam
Java 1.4-en beragadt projektet, régi alkalmazásszerver verziókhoz kötött
rendszereket. Ilyenkor érdemes olyan keretrendszereket bevezetni, melyek
nem tolakodóak (non-intrusive, azaz a kódot nem járják át az
architektúrális elemek), és lépésenként bevezethetőek. Egyik
projektünkbe pl. a Spring-et sikerült úgy bevezetni, hogy először csak a
perzisztens rétegben, majd egyre felsőbb rétegekben, végül a
felhasználói felület rétegben. Érdemes a maradvány kódokat szépen
elkeríteni. Amennyiben a maradvány kódjaink nem is objektum orientáltak,
használhatjuk az object wrapper megoldást, azaz a procedurális kódunkat
körbevesszük egy szép, objektumorientált API-val. Ez alatt az
implementációt később cserélhetjük. Barátunk ilyenkor a refactoring,
amivel kapcsolatban sokan elfelejtik, hogy refactor közben nem
módosítjuk a funkcionalitást. A funkcionalitás teljes megtartásával
strukturáljuk át a kódunkat, hogy könnyebben átláthatóbb és
továbbfejleszthetőbb legyen.

Nagyon ritkán érdemes ilyenkor a teljes újraírás mellett dönteni. Nem
lehet egy tíz éve fejlesztett rendszert pár hónap alatt újraírni. Kisebb
lépésekben érdemes haladni. És közben viszont szerfelett mennyiségű
tapasztalattal lehet gazdagodni.

Másik indok az szokott lenni, hogy a megrendelőknek, vagy inkább a
fejlesztőknek egyedi igényeik vannak. Ezt csak nagyon ritkán tudom
elképzelni. Amennyiben egy architect kellő tapasztalattal és tudással
rendelkezik, biztos, hogy a legtöbb problémára már látott valamilyen
megoldást. Nem hiszem el, hogy 9 millió Java programozó, és a nem tudom
mennyi egyéb programozó nem futott volna bele ugyanabba a problémába. Ez
legtöbbször a fejlesztő csapat szűklátókörűségét bizonyítja. Vagy
egyszerűen túl lelkesek, és szeretnék megvalósítani saját ötleteiket.
Melyek gyanítom nem is annyira világmegváltóak, hogy ne lehessen azokat
máshol megtalálni.

Ennek kicsit finomabb változata, hogy ugyan tud a fejlesztő csapat
arról, hogy vannak már létező eszközök, de nem felel meg mind az összes
igénynek. Esetleg összehasonlító elemzést is végeztek, hogy melyik miért
nem felel meg az igényeknek. Sajnos a legtöbbször már ismert a vágyott
cél, hogy mit kell az elemzésnek kihoznia. Itt is el kell gondolkodni
azon, hogy ne a tökéletességet keressük, hiszen nem biztos, hogy pont mi
fogjuk azt elérni. Lehet, hogy együtt lehet élni egy eszköz
hiányosságaival, ahelyett, hogy teljesen sajátot fejlesztenénk. És ha
találunk egy igényeinkhez közel állót, miért ne szállhatnánk be a
fejlesztésébe, vagy miért is ne tudnánk arról leágazni (, bár utóbbival
is vigyázni kell, hiszen a leágazás után már elveszik az automatikus
magasabb verzióra váltás lehetősége, és merge-öléssel találjuk szembe
hamar magunkat - ez talán az elosztott verziókezelő rendszerek
megjelenésével már kevésbé fájdalmas).

A gyakori ügyfél igény az, hogy az alkalmazás minél testre szabhatóbb,
minél jobban konfigurálhatóbb legyen, igen, programozás nélkül. Mikor
ilyen igény merül fel, legyünk óvatosak. Hiszen mit akar az ügyfél? Azt,
hogy fejlesztés nélkül újabb funkciókat tudjon maga megvalósítani. Itt
már gyanút foghatunk, hiszen nem nekünk akar fizetni, hanem a problémáit
maga szeretné megoldani. Azaz bizalmatlan, és ez nem biztos, hogy jó jel
egy projekt elején. Egy általános eszköz fejlesztése feltehetően nagyobb
költség, mintha a kívánt funkciókat, egyesével, saját keretrendszer
nélkül kifejlesztetné. És sajnos sokszor láttam, hogy a személyre szabás
túl absztrakt, túl technikai lett, így az ügyfél mégsem tudta
használatba venni. Így ahelyett, hogy a programozók implementálták volna
a funkciókat standard módon, valami saját eszközben kellett ezeket
speciálisan megoldaniuk.

És már el is jutottunk a 4GL, CASE és RAD eszközök világához. (Vigyázat,
nem ugyanazt jelentik, csak ugyanarra a problémára szeretnének megoldást
adni.) A programozókban mindig is megvolt az igény, a lustaság, hogy
olyan eszközöket készítsenek, melyek saját és mások munkáját könnyítik,
akár programot generáljanak. Lehessen "egérrel programozni",
informatikai szaktudás nélkül. És valahogy mégis, ezek az eszközök
mégsem hozták el a világmegváltást. Miért van az, hogy egy egyszerű
programozási nyelv, melyhez csak parancssoros fordító volt,
szövegszerkesztőben írtuk a kódot, le tudott taszítani a trónról olyan
eszközöket, mint a Delphi, Oracle Forms, stb.? És most is születnek
ilyen nyelvek, és megvan a létjogosultságuk, terjednek. Miért hisszük
azt, hogy amibe a Borlandnak, Oraclenek beletört a bicskája, mi meg
tudjuk valósítani? A nagy piros gombot, amit megnyomunk, és kiesik a
szoftver?

Véleményem szerint itt is látszik a ciklikusság, egyre jobban elkezdenek
a nyelvek, platformok elmenni az irányba, hogy automatizálják a
fejlesztést, és a végén mindig a süllyesztőben kötnek ki, és egy
primitív, egyszerű eszköz veszi át a helyüket. Gondoljunk a Java ilyen
irányú fejlesztéseire is, pl. VisualAge for Java, NetBeans ilyen irányú
fejlesztései, stb.

Itt érdemes megemlíteni a forward engineering, reverse engineering és
ennek egyvelegét, a roundtrip engineeringet is. Vagy beszélhetünk a
Model-driven architecture (MDA) megközelítésről is. A háttérben mindig
valami kódgenerálás is áll. Ilyen projektet is gyakran láttam, és sosem
tudott meggyőzni. Mi is próbálkoztunk ilyenekkel, de nem sikerült
egyértelmű eredményeket elérni. A legtöbb esetben nagyon nehéz belőni a
modellezés absztrakciós szintjét, amiből az alkalmazás vázát le lehet
generálni, és az fejlesztéssel befejezni. Általában elmennek olyan
irányba, hogy már mindent a modellbe akarnak leírni. Ezáltal egy
programozási nyelvhez közeli, vagy bonyolultabb modellező nyelv sül ki
belőle. A fejlesztőknek ez csak egy darabig izgalmas. Miért kell egy
Java fejlesztőnek diagramot rajzolnia? Ezzel kapcsolatban tetszik az
UMLet álláspontja. Egy modellt sok tíz képernyőn keresztül, sok ezer
tulajdonsággal, szabállyal beparaméterezni sokkal bonyolultabb, mint egy
leíró nyelvet használni erre. Sosem szerettem a Rational Rose-t. Sajnos
ezen rendszerek a megbízhatatlanságukkal, kiforratlanságukkal szintén
elveszik az ember kedvét. Próbáltam AndroMDA-t, openMDX-et, de nagyon
behatároltak voltak és hibáktól hemzsegtek. Próbáltam Posseidon for UML,
ArgoUML, StarUML eszközöket. Kimérve mindig sokkal gyorsabb volt Java
forráskódot írni, Java interfészekkel tervezni, JavaDoc-ot írni, és
abból visszagenerálni a modellt. Nem, a Spring Roo-ban sem hiszek.

Nézzük, milyen hatása van a saját keretrendszerek a programozókra.
Gyakran láttam, hogy egy-két okos programozó írta a keretrendszert, és a
kevésbé okosnak tartott programozók csak használták. Ismerős?
Kérdeztétek már meg, mit gondolnak úgy igazán a keretrendszerről?
Egyrészt nagyon sok munkával megtanulnak egy olyan dolgot melyet sehol
máshol nem tudnak használni, melytől nem lesznek többek, mely nem
motiválja őket, nem írható be az önéletrajzukba. Ki vannak zárva egy
körből, nem hozhatnak döntéseket, nem tudnak a miértről. Nem kapnak
megfelelő szintű támogatást, dokumentációt. Hallottam programozóról, aki
úgy kezdi az interjút, hogy kell-e saját keretrendszerben dolgozni. Ha a
válasz igen, akkor nem folytatja az interjút.

A fejlesztők manapság mindig modern, divatos, trendi technológiákkal
akarnak dolgozni. Nehéz őket saját keretrendszerrel megfogni.

Gyakran láttam, hogy a keretrendszer alkotójának elege lett, továbbállt,
otthagyta a rendszerét. Olyanoknak kellett átvenniük, akik nem értették,
nem látták át teljesen, nem voltak tisztában a döntési folyamatokkal. A
keretrendszer alkotókat gyakran nem lehet elég sokáig lekötni, aktív,
kreatív emberek, akik nem állapodnak meg, újabb és újabb ötleteket
próbálnak ki, és folyamatosan patkolandó dolgokat hagynak maguk után.
Mivel pezseg a vérük, nem töltik idejüket olyan haszontalan dolgokkal,
hogy a legapróbb részleteket is átgondolják, a legutolsó részt is
lefejlesszék és dokumentálják a rendszert.

Ilyen fejlesztők gyakran abba a hibába esnek, hogy egy problémát
túlzottan általánosan próbálnak megvalósítani. Igaz ugyan, hogy most nem
kell, de később jól jöhet. Gyakran lehet a YAGNI (You ain't gonna need
it) elvet hallani, hogy pontosan azt fejlesszük le, amire szükség van,
ne fejlesszünk olyan funkcionalitást, amire azt gondoljuk, hogy majd
szükség lehet rá. Vagy nem lesz rá szükség, vagy nem úgy lesz rá
szükség. Az ügyfél ilyen szempontból hatalmas kreativitással
rendelkezik, hogy olyant kérjen, amire úgysem gondoltunk.

Milyen lehet egy ilyen rendszer minősége? Gondoljunk bele, hogy olyan
keretrendszereknél, mint a Spring, Struts, stb., melyet több ezren
használnak, tesztelnek, nézegetik a forrását, milyen gyakran jegyeznek
be hibákat, milyen gyakran frissülnek, milyen a fejlesztői aktivitás.
Hogy gondolhatjuk, hogy pár fejlesztővel ugyanolyan szintű eszközt
képesek vagyunk gyártani? Úgy, hogy nekünk nem ez a fő profilunk, hanem
fő munkaidőben az ügyfelek óhajait, problémáit kell megoldanunk. A
keretrendszer fejlesztésére, unit tesztelésére, dokumentációjára sosem
marad idő. Előbb az égető problémákat kell megoldani, a funkcionalitásra
kell összpontosítani, az ügyfél azért fizet.

Miért jó ez a menedzsmentnek? Örülnek, ha olyanra költik a pénzt, aminek
semmi látszatja nincs? Nem lesz tőle több képernyő. Nem tőle lesz több
funkció. A keretrendszer implementálásával csak a lehetőségét valósítjuk
meg, hogy a felhasználó számára alkalmazást fejlesszünk. De még nem
fejlesztettünk egy percet sem. Mennyire felel meg ez a manapság annyira
oly divatos agilis módszertanoknak? Mennyire követi a KISS (keep it
simple ...) elvet?

A keretrendszer azért kell, hogy a képernyőket, funkcionalitást
gyorsabban ki tudjuk fejleszteni? Hányszor hangzott el, hogy ezt nem
tudja a keretrendszer, ezt a keretrendszerben kell kifejleszteni, ez így
túl lassú lenne a keretrendszerben, stb.?

Bizonyos emberekben valamilyen blokk van, hogy más munkáját használják
fel. Kritizálják, mindenből sajátot akarnak írni, saját XML parser,
saját protokoll, saját formátum, saját keretrendszer. Ismert a jelenség,
nem csak informatikában, "Not Invented Here (NIH)", általában
pejoratívan használják.

Ezek a keretrendszerek nem felelnek meg a szabványoknak. Nem
széleskörűen elterjedtek. Nem lehet az utcáról felvenni egy olyan
programozót, aki értene hozzá. Nagyon drága a betanítás. Hiszen
nincsenek képzett oktatók, nincs oktató anyag. Általában elé adják az új
fejlesztő elé, és próbálja meg egyedül felfejteni (a vezető
programozónak nincs ideje pátyolgatni), próbálja meg az eddigi
megoldásokat lemásolni. Csak általában egy keretrendszer használatával
is ugyanarra a problémára a fejlesztők három különböző megoldást
használtak.

Nem csak már bevált, működő, széles körben elterjedt keretrendszereket
érdemes használni, hanem érdemes (kvázi) szabvány API-k közül
választani, ami alatt cserélhetjük az implementációt. Cseréltünk már
Hibernate-et EclipseLink-re, mert jobban megfelelt az igényeinknek.
Építkezzünk modulárisan, hiszen csak így van lehetőségünk a modulok
esetleges későbbi kiváltására, programozzunk interfészekkel, használjunk
rétegeket, tartsuk szem előtt a loose coupling, high cohesion elveket.

Nagyon fontos, hogy az ezzel kapcsolatos viták során mindig eljutunk a
szép architektúra, szép kód fogalmához. A szépség szubjektív. Ízlésről
nem vitatkozunk. Parttalannak érzem az XML kontra programozott
konfiguráció, a NetBeans kontra Eclipse vitákat, az annotációk túlzott
használatát elítélő kijelentéseket. Érvek, objektív érvek kellenek. És
még sajnos így is beleütközünk abba, hogy minden megoldásnak van jó és
rossz oldala is. És ráadásul lehetnek ezek egyensúlyban is. Döntsünk
ésszerűen, érveljünk ésszerűen.

Félreértés ne essék. A posztban direkt sarkítok. Próbálok erős
érzelmeket kiváltani. Nem azt mondom, hogy ne fejlesszünk saját
keretrendszert, mert akkor még mindig assembly kódot írhatnánk. Vannak
okos emberek, okos ötletekkel. Sőt, sok esetben nem is kell nagy ötlet,
csak egy elegáns megvalósítás. De mindig alaposan gondoljuk át. Ne
játszunk a cégünk, vagy a megrendelő pénzével. Saját keretrendszer
kifejlesztése nagyon-nagyon drága, a legtöbb projekt ezt nem bírja el.
Ne játszunk a kollégáink türelmével. Ne a saját önzésünk vezéreljen,
hanem mérlegeljünk. A kreativitásunkat máshol éljük ki, úgy, hogy az ne
menjen egy cég, egy csapat, egy projekt rovására. Próbáljunk különböző
vérmérsékletű, kvalitású embereket is bevenni a döntési folyamatba.
Legyen lelkes, legyen kétkedő, legyen tapasztalt, legyen kezdő.

Azt hiszem, hogy a legtöbben azért beleestünk abba a hibába, hogy saját
keretrendszert fejlesztettünk, vagy kezdtünk fejleszteni. Ne
szégyelljük, próbáljunk idejében váltani, tanulni belőle.

Érezhető, hogy a szoftverfejlesztés során nagyon fontos az emberi
tényező. Nagyon kevés mindenki által elfogadott alapelv van, mindenre
lehet érvet/példát találni, és annak ellenkezőjére is. Kevés, hogyha jó
technológusok vagyunk, néha jobb lenne pszichológusnak lenni. Próbáljuk
felismerni és kihasználni az tipikus fejlesztői viselkedésformákat.

Van a posztban olyan, amit ti is gyakran tapasztaltok? Mi a
véleményetek?
