---
layout: post
title: Fejlesztőként mivel akadályozom a tesztelők munkáját?
date: '2022-08-20T10:00:00.000+02:00'
author: István Viczián
description: Pár gondolat arról, hogy tudnának a fejlesztők és a tesztelők jobban együttműködni.
---

## Bevezetés

Ahhoz, hogy sikeres szoftvert tudjunk szállítani, hiszem, hogy nagyon fontos a fejlesztők és
a tesztelők közötti szoros együttműködés. És mikor tesztelőket említek, ugyanúgy gondolok
a manuális és automata tesztelőkre is. Az irányzat, mely a fejlesztők és az üzemeltetők 
közötti kapcsolat fontosságát hangsúlyozza, a DevOps nevet kapta. Célja egy olyan kultúra
kialakítása, gyakorlatok és eszközök kiválasztása, ahol a fejlesztők és az üzemeltetők
közös munkával tudnak gyorsan, megbízhatóan alkalmazásokat és megoldásokat szállítani.
Ez a fogalom manapság igencsak felkapott, _de méltatlannak érzem, hogy a tesztelőkkel 
való közös munka fontosságának kiemelése korántsem ennyire hangsúlyos_.

Történetileg kialakult, hogy a fejlesztés és az üzemeltetés a legtöbb cégnél elvált 
egymástól, tisztán elválasztott szervezeti egységekben, sőt akár külön cégekben működtek, 
melyek között a kommunikáció finoman szólva is döcögős volt. Sőt, úgy érződött, hogy a két csoportnak
eltérő a célja. Az üzemeltetők stabilitást, biztonságot, tervezhetőséget szerettek volna,
míg a fejlesztők mindig az örökös változásért, fejlődésért harcoltak. Észrevehetjük,
ugyanez megfigyelhető a tesztelőknél is, egyrészt a különválás, a nehézkes kommunikáció,
és a látszólag ellentétes cél. Van, hogy a fejlesztők által késznek minősített alkalmazást
a tesztelők "visszadobnak". Kezdjük felismerni, hogy az üzemeltetés és a fejlesztés
szétválasztása káros, _de vajon így érezzük a tesztelők munkájával kapcsolatban is_?
Ráadásul az egyes agilis módszertanok, mint pl. a Scrum szerint a csapat felelős
a sprint végén a kész termék leszállításáért, és ebben olyan egyenrangú csapattagok vesznek részt,
akik persze rendelkeznek speciális ismeretekkel, pl. üzleti elemzés, fejlesztés, tesztelés vagy
üzemeltetés.

Voltam olyan helyen, ahol a fentebb bemutatott elszigeteltség jelen volt, és mindig dolgoztam ennek
csökkentésén. Voltan olyan projekten is, ahol ezen különböző ismeretekkel rendelkező
szakemberek egy csapatban dolgoztak. Régóta tartok fejlesztői tanfolyamokat, köztük
kezdő fejlesztői tanfolyamokat, amin egyre több tesztelővel találkozok, aki el akar mozdulni
az automata tesztelés irányába. Sőt részt vettem tesztelői bootcampek megszervezésében is, ahol nagyon sokat
tanultam a tesztelő kollégáimtól, és beleláthattam ennek a szakmának a szépségeibe is, és erősítették bennem a hitet,
hogy mennyire fontos az együttműködés. Sőt, automata teszt eszközökkel kapcsolatos képzéseket is tartok, amin szintén sok tesztelő vesz részt.

Ezen tapasztalataim alapján, és a tesztelők (akár szünetekben elmesélt) történeteit meghallgatva gyakran úgy látom,
hogy a fejlesztőknek a teszteléssel kapcsolatban rengeteg tévhit él a fejében, és rengeteg rossz gyakorlatot folytatnak. Ebben a posztban ezeket próbálom felsorolni, megcáfolni. Lesz szó általános elvekről, de pár helyen lemegyek technológiai szintre is. Egyes szám első személyben fogok írni, fejlesztő lévén, még akkor is,
ha magam nem így gondolkozom, így megpróbálok senkit sem megsérteni. Félreértés ne essék, nem ellentéteket szeretnék szítani, hanem megoldásokat kínálni.

<!-- more -->

## Tévhit: "Tesztelni bárki tud."

Fejlesztőként gondolhatom úgy, hogy a teszteléshez nincsen szükség speciális ismeretekre, alapvető IT
tudással már el lehet kezdeni a tesztelést. Ez nincs így, ugyanis a tesztelés nemcsak speciális szakmai ismereteket igényel,
hanem olyan emberi tulajdonságokat is, amikkel gyakran a fejlesztők nem rendelkeznek. Ha megnéztek egy tesztelői oktatás
tematikáját máris látható, hogy mennyi mindennel kéne tisztában lenni. Szemezgessünk belőle pár dolgot.

* Tesztelői ismeretek
  * Tesztelési alapelvek
  * Tesztfolyamat
  * Tesztmunkatermékek
  * Teszttípusok és tesztszintek
  * Teszttervezési módszertanok és azok alkalmazási területei
  * Specifikáció alapú tervezési technikák
  * Teszttervezési technikák, azok alkalmazhatóságai, előnyök, hátrányok. Fehér- és feketedoboz, tapasztalat alapú teszttechnikák. Ekvivalencia-partícionálás, határérték-elemzés, döntési tábla tesztelés, állapotátmenet, használatai eset tesztelés. Lefedettség.
  * Tesztmenedzsment
  * Tesztmenedzsment szoftverek
* IT ismeretek
  * Szoftverfejlesztési életciklusmodellek, szerepkörk
  * Operációs rendszerek, irodai szoftverek használata
  * Hálózati fogalmak
  * Architektúrák
  * Adatbáziskezelés, SQL
  * Verziókezelés
  * Alapfokú algoritmizálás
  * Alapvető szoftvertervezési módszertan ismeretek

Amennyiben automata tesztelésről beszélünk, akkor további ismeretek lehetnek szükségesek:

* Felületi technológiák (pl. HTML, CSS, JavaScript) ismerete.
* Valamilyen programozási nyelv ismerete
* API leíró technológiák
* Felületi és API automata teszteszközök ismerete (Selenium, SoapUI, Postman, stb.)
* Terheléses teszteszközök ismerete (JMeter, stb.)

Amennyiben az emberi oldalt nézzük, gyakran szükséges tulajdonságok:

* Törekvés a minőségi munkára
* Komplex problémák megértése
* Folyamat szintű gondolkodás
* Jó kommunikációs képesség
* El kell fogadnia, hogy alapvetően más által elkészített munkát kell használnia, vizsgálnia, elemeznie és minősítenie
* Monotonitástűrés
* Kreativitás

A tesztelés egy külön szakma. Saját elméleti és gyakorlati ismeretekkel, módszertanokkal, eszközökkel. Széleskörű
irodalommal, követendő trendekkel, meetupokkal, konferenciákkal, folyamatos tanulással.

Lehet, hogy te nem találkoztál ilyen tesztelővel. Én sokkal, sőt próbálunk ilyen szakembereket képezni.

## Tévhit: "Tesztelni én is tudok."

Amint megírom az első tesztet, legyen akár manuális, akár automata teszt, fejlesztőként azt hiszem, hogy máris tudok
tesztelni. Ez nincs így. Ha egy projekten összehasonlítom az első tesztjeimet a fél év elteltével írt tesztjeimmel, nagyon nagy különbségeket fedezek fel. Pont ahogy a kódolási képességem is fejlődik. Minél több tesztet írok,
annál több tapasztalatom lesz. Hogyan kerüljem el az ismétlést, nem csak automata, hanem manuális tesztforgatókönyvek esetében is. Hogyan készítsem elő a tesztelendő rendszert, hogyan hozzam a megfelelő állapotba (inicializáljam az adatbázist). Hogyan írjam meg úgy a teszteseteket, hogy más is el tudja olvasni, sőt könnyen karban tudja tartani. Hogyan oldom meg, hogy a teszteket akár több manuális tesztelő párhuzamosan tudja futtatni, akár ugyanazon a rendszeren. Hogy futtatom az automata teszteket párhuzamosan, akár egy clusteren. Hogyan tudok gyorsan futó teszteket írni. Hogyan oldom meg, hogy a tesztek ne legyenek törékenyek, azaz az alkalmazás változtatásával ne kelljen a teszteket is állandóan változtatni. Hogyan kezelem az alkalmazások külső függőségeit, külső authentikációt, más rendszereket. Hogy írok olyan teszteket, melyből könnyen lokalizálni lehet a hibát.

## Tévhit: "Nincs szükség tesztelőkre!"

A legnagyobb tévhit, ha azt hiszem, hogy nincs szükség tesztelőkre. Fejlesztőként nem rendelkezem azzal a speciális
ismeretekkel és képességekkel, mellyel a tesztelők igen. Az időm nagy részét fejlesztéssel, az üzleti problémák megértésével,
különböző technológiák megismerésével és alkalmazásával töltöm. Ebbe nehezen fér bele az, hogy egy más szakmát is hasonló
mélységben megismerjek. Ha rosszul értem meg az üzleti problémát, hibás tesztesetet fogok írni. Amennyiben magam írom a saját funkciómra a tesztesetet, ugyanazt a hibát fogom véteni, amit a funkció fejlesztése közben. Persze ebben picit segíthet, ha más fejlesztő írja a tesztesetet, de ezt nagyon ritkán láttam működni.

Fejlesztőként a szoftvert általában úgy nézem, "mintha benne ülnék". A tesztelő kívülről látja, ugyanúgy, mint a felhasználó.

Nagyot tévedhetek abban is, hogy nincs szükség manuális vagy automata tesztelésre. Egyiket sem lehet elhagyni. A gépek csinálják azt, amihez értenek, és az ember is. A gépek jók az ismétlésben, a monoton
feladatok újbóli, gyors, hiba nélküli elvégzésében. Az emberek jók a kreatív, gondolkodást igénylő feladatok
elvégzésében.

Ha el akarunk mozdulni a continuous integration vagy delivery felé, az automata tesztelés elengedhetetlen. Hiszen milyen más lépés tudná automatikusan biztosítani, az alkalmazás minőségét?

## Tévhit: "Legyen a tesztelők egy külön szervezeti egység, akár külön cég."

A teljes continuous delivery mozgatórugója, a gyors feedback. Tesztelők egyik alapszabálya, hogy minél hamarabb kiderül a hiba, annál kisebb a kijavításának költsége. Ennek egy összetevője az is, hogy a fejlesztőknél is költséges a context switch, azaz ha valamin elkezdek dolgozni, akkor nehezen térek vissza egy korábbi fejlesztéshez, abban hibát javítani. Ráadásul fejlesztőként szomjazom a feedbackre, a visszajelzésre.

Erre példaként azt tudom felhozni, hogy amikor agilis Scrum csapatban dolgoztam, és végeztem a fejlesztéssel, csak szóltam
a mellettem ülő tesztelőnek, aki sokszor azonnal rá tudott nézni a funkcióra, és pár percen belül tudott egy gyors feedbacket adni, hogy alapvetően jó lesz-e, majd nem sokkal később részletesebben is át tudta nézni. Sőt akár odafordította a monitorát, és megmutatta, hogy mi a hiba. Ez összehasonlíthatatlan azzal, mikor hetek múlva, issue trackerben kapok egy hibajelzést.

Amennyiben a tesztelők külön szervezeti egységben, esetleg cégben dolgoznak, nőnek a kommunikációs problémák, így nő a hibajavítások költsége is.

## Tévhit: "Elég, ha a tesztelők a kész szoftvert kapják meg tesztelésre."

Amennyiben a tesztelő csak az elkészült funkcionalitást kapja meg tesztelésre, nagyon sokat veszítünk. A tesztelőt már az igényfelmérési, tervezési folyamatba is be kell vonni. Ő már az ügyféllel is másképp (gyakran jobban) kommunikál, olyanokat kérdez meg, amik eszembe sem jutnak. Nem egyszer azt vettem észre, hogy a fejlesztett szoftvert legjobban a tesztelő ismeri. Fejlesztőként általában nem használom annyit, a szoftvert csak belülről látom, és gyakran csak egyik-másik funkcióját ismerem a mélységeiben. Az üzleti elemzők hajlamosak arra, hogy ismerik ugyan az üzleti követelményeket, de a szoftver aktuális állapotát már nem látják át. A tesztelő minden idejét a szoftver használatával tölti.

Érdekes, hogy kezd elterjedni erre elterjedni a "shift-left" kifejezés, ami azt jelenti, hogy a tesztelőt minél hamarabb vonjuk be a munkafolyamatba. Ezt tesztelőktől évtizedek óta hallom, mégis csak most kezd el terjedni menedzsment körökben. Mennyit is ér egy hangzatos név!

A tesztelő már az üzleti követelményeket is másképp elemzi. Már arra gondol, hogy hogyan lehet tesztelni. A részletes tervezés során  előfordult, hogy a jól felépített technológiai megoldásomat a tesztelő egy jól irányzott kérdésel azonnal romokba döntötte, ami általában úgy kezdődött, hogy "és arra gondoltál, hogy mi van akkor, ha?".

Amennyiben a sztori leírásában már a tesztelővel együtt definiáljuk az elfogadási kritériumokat, akkor sokkal jobb minőségű szoftvert tudunk gyártani. Egyesek ezt a csúcsra járatták, hiszen a BDD-ben (Behavior-driven development) a három amigó (üzleti elemző, fejlesztő és tesztelő) formálisan, ezzel automatizáltan futtathatóan definiálják az elfogadási kritériumokat. Ilyenkor a TDD (Test driven development) elveit követve előbb a teszteket írják meg, ráadásul mindenki által érthető nyelven (domain-specific language - DSL).

A tesztelőt kihagyni a tervezésből hatalmas hiba. Hisz a fentieken kívül ez remek módja az információátadásnak, és a tesztelő technológiai irányba való továbbképzésének is.

Ha a tesztelést a végére hagyjuk, annak ismerjük a következményeit. A fejlesztés csúszik, a tesztelőknek alig marad idejük a sprint vagy a projekt végén, akkor kell megtervezniük, megírniuk a teszteseteket, futtatniuk, teszt adatokat legyártaniuk. Minél előbb bevonjuk őket, annál többet tudnak akár előre dolgozni.

## Rossz gyakorlat: Nem definiálom az elfogadási kritériumokat.

Bár a Scrum nem definiálja az elfogadási kritérium (acceptance criteria) fogalmát, érdemes megírni a user story-k esetén. Ráadásul a tesztelővel együtt. Ezek story-nként azok a feltételek, amelyek, ha teljesülnek, a story elfogadható. Fejlesztőként elkövettem azt a hibát, hogy a story-ban azt írtam le, hogy mi az üzleti követelmény, vagy mit kell tenni a fejlesztőnek, mit kell módosítani az alkalmazáson. Sok félreértést előzhetünk meg, ha ezeket pontosan, az üzleti elemző és tesztelő szemszögéből próbáljuk meg közösen definiálni. Ez nem azonos a Definition of Done-nal (DoD). Ez utóbbi ugyanis az összes story-ra vonatkozó általános követelményeket tartalmazza, pl. lett-e a kód review-zva, megvan-e a tesztlefedettség, megírtuk-e hozzá a súgót.

## Rossz gyakorlat: Nem veszem figyelembe a tesztpiramist.

A tesztpiramist Mike Cohn mutatta be a _Succeeding with Agile_ könyvében,
annak elképzelésére, hogyan helyezzük el a különböző szintjeit a tesztelésnek.

A legalsó szinten vannak a unit tesztek, melyek az adott programozási nyelv
legkisebb egységét tesztelik, objektumorientált nyelvek esetén ez az osztály
szint. Középső szinten az integrációs tesztek helyezkednek el, melyek már
az osztályok együttműködését tesztelik. Végül a legfelsőbb szint az
End-to-end tesztek, melyekkel a teljes alkalmazást teszteljük,
az adott környezetben, azok függőségeivel integrálva. Ráadásul nem egy-egy kiragadott
funkció darabkát, hanem teljes üzleti folyamatot az elejétől a végéig.

![Tesztpiramis](/artifacts/posts/2022-08-20-fejlesztok-es-tesztelok/pyramid.png)

A tesztpiramis formája abból következik, hogy az alaptól felfelé
a tesztek egyre nagyobb hatókörrel dolgoznak, egyre erőforrásigényesebb
a karbantartásuk és futtatásuk, és pont ezért felfelé mozdulva érdemes
ezekből egyre kevesebbet írni.

A unit és integrációs teszteket a fejlesztők írják, az end-to-end teszteket azonban
a tesztelők. Azonban láttam olyat is, hogy annyira kézreeső integrációs teszt
eszközt sikerült választani, amit a tesztelők is használni tudtak, ilyen
pl. REST webszolgáltatások tesztelésére a [REST-assured](https://rest-assured.io/).
Vagy olyat is, hogy a fejlesztők írtak E2E teszteket.

A gyakori hiba, amit véthetek az az, hogy kihagyok egy szintet. Akik csak a unit tesztekre
esküsznek, azok abban bíznak, hogyha a kis építőkockák hibátlanok, akkor ezek tökéletesen
fognak együttműködni. Ez nem igaz, az integrációt is ezer helyen lehet elrontani. Akik
nem szeretik a unit teszteket, azzal érvelnek, hogy a fejlesztő a funkcionalitás mellett
elrontja a unit teszteket is. Igaz, azonban a unit teszteknek nem ez az elsődleges feladatuk.
A unit tesztek megfogják azokat a hibákat, mikor jól értem az algoritmust, de elrontom.
A unit tesztek ráadásul a refactoring folyamat építőkockái. Hányszor hallom fejlesztőktől hogy refactoringoltak
egy funkciót, de nem írtak unit tesztet. Az nem refactoring. A refactoring célja a kód átstruktúrálása,
annak működésének változatlanul hagyásával. (Hogy később az új funkciót könnyebb legyen lefejleszteni.)
És a változatlanságot csak a unit tesztek biztosíthatják. Sajnos sokszor látom, hogy a struktúrális
változtatást, és az új funkció bevezetését hibásan egy lépésben hajtják végre a fejlesztők.
Valamint a téves hiedelemmel ellentétben a unit tesztek akár gyorsíthatják a fejlesztési folyamatot, hiszen
egy funkció teljeskörű kipróbálásához nem kell az alkalmazást elindítanom (kedvenc példám egy
validációs regexp egy eldugott képernyőn), a teszteset ezredmásodpercek alatt lefut.

Amennyiben a tesztelést külön szervezeti egység vagy cég végzi, nagyon gyakran meg szokták sérteni a tesztpiramist.
Ugyanis ekkor a tesztelők nincsenek tisztában azzal, hogy milyen unit és integrációs tesztek vannak, így mindenre
E2E teszteket írnak. Ez nagy költségpazarlás, hiszen az E2E tesztek a legtörékenyebbek és így a legköltségesebbek is.
E2E tesztekből ugyanis tipikusan kevésnek kell lennie, és a kritikus üzleti folyamatokra koncentráljanak.

Szóval igen, még a unit és integrációs tesztek tervezésébe is érdemes bevonni a tesztelőt. Egyrészt jó tanácsokkal tud szolgálni, a különböző tesztelési technikák egy tapasztalata alapján, valamint segítséget kap arra vonatkozóan, hogy mire érdemes E2E tesztet írni.

## Rossz gyakorlat: A technológia érdekes, az üzleti funkcionalitás nem.

Többször írtam technológiai sztorikat, melyeknek nem volt üzleti vonzata, és úgy gondoltam, hogy tervezéséhez nem kell tesztelő, és tesztelni sem kell és lehet. Sokszor tévesen refactorignak nevezetem. Ilyenkor csak valamilyen technológiai módosítást végeztem a saját gyönyörűségemre. Ezekkel nagyokat hibáztam. Minden sztorinak kell üzleti vonzatának lennie. Úgy nem változtatok semmit, ami nem előfeltétele egy, akár később bevezetendő üzleti funkciónak. Amikor nem vontam be a tesztelőt, gyakran új hibákat vittem be a rendszerbe. Nagyon óvakodjunk a technológiai/refactoring sztoriktól, és ha lehet kerüljük őket.


## Rossz gyakorlat: Tesztelési eszköz érdekes, a tesztesetek megírása már nem.

Fejlesztőként rendkívül vonzó az, hogy kipróbálok egy új eszközt, legyen akár egy új teszteszköz. Ezt integrálom a projektbe, valamilyen szinten megismerem, de a tesztek írását már másra hagyom. Bevezetek pl. egy új BDD eszközt, legyen ez a Cucumber, melynek nyelve a Gherkin, megírok vele egy tesztet, majd elvesztem iránta az érdeklődésem, benn marad a projektben, anélkül, hogy ezt bárki tovább vinné. Előbb-utóbb a teszteket ignorálják, kikapcsolják.

A tesztelés során nem a teszteszköznek van értéke. Sőt, talán a legjobb stratégia, ha ettől függetlenedünk. (Ahogy a fejlesztésnél is a keretrendszertől, és az üzleti logikára koncentrálunk.) Az igazi tudomány a tesztesetek megtervezése és implementálása, ráadásul úgy, hogy a fentebb felsorolt követelményeknek megfeleljenek.

## Rossz gyakorlat: Egy tutorial alapján használom a teszteszközt.

Egy tutorial alapján egy új teszteszköz bevezetése triviális, egy képzett fejlesztő számára akár egy-két nap alatt megugorható. Azonban önáltatás, ha azt hiszem, hogy ez elegendő.

Sajnos nagyon sok hibás Selenium WebDriver bevezetést láttam. A következmény, hogy a tesztek lassúak, karbantarthatatlanok, törékenyek. És a fejlesztők végső véleménye az, hogy magával az eszközzel van a baj. A valóság azonban az, hogy tapasztalat nélkül, a szakirodalom elolvasását mellőzve vetették be. Gyakran még a weboldalon található dokumentációban szereplő [Encouraged behaviors](https://www.selenium.dev/documentation/test_practices/encouraged/) és [Discouraged behaviors](https://www.selenium.dev/documentation/test_practices/discouraged/) fejezetet sem olvassák el. Sok projektet láttam, melyekben az ajánlásokat nem tartják be, valamint nem veszik figyelembe az ellenjavallatokat. Hadd hozzak pár példát!

### Tesztesetek függetlensége

A teszteseteknek egymástól függetlennek kell lennie, nem lehet az egyik kimenete a másik bemenete. Nem lehet közöttük sorrendiség. Ezt betartva könnyebben azonosítható a hiba, másrészt párhuzamosan futtathatóak maradnak a tesztesetek.

### Alkalmazás állapotának beállítása

Kicsit az előzőből következik. Ha például az egyik tesztesetben egy felhasználót kell módosítanom, akkor hogyan kerül oda az a felhasználó. Egyik módszer, ha az előző tesztesetben létrehozott felhasználót módosítom. Ez hibás, hiszen a teszteseteknek függetleneknek kell lenniük. Másik megoldás, ha a felületen hozom létre a tesztesetben. Ezzel sajnos sok lesz a kódismétlés, és nagyon lassú lesz a lefutás. Akkor mit javasol a Selenium dokumentációja? Azt, hogy a felhasználót API-n keresztül hozzuk létre, ami egyrészt sokkal gyorsabb, másrészt sokkal kevésbé törékeny, mint a felhasználói felület. Ez lehet akár közvetlen adatbázis hozzáférésen keresztül, vagy SOAP/REST webszolgáltatással. Sajnos ehhez viszont sokszor nem férnek hozzá a tesztelők, vagy nincs kellően dokumentálva.

### Megfelelő selectorok használata

A mai napig többször hallom, hogy a fejlesztők az XPath használatát javasolják a tesztelőknek. A dokumentáció azonban egyértelműen a CSS selectorok használatát javasolja, ugyanis mivel a böngészőnek egy natív technológiája, a böngészők fejlesztői a CSS selectorokat teljesítmény-hangolják, és gyorsabbak, mint az XPath lekérdezések. De backend fejlesztőként önszántamból miért is ajánlanám a CSS-t?

### Mire nem jó a Selenium?

* A Selenium WebDriverrel ne töltsünk fel és le fájlokat, helyette valami mást kliens library-t használjunk.
* Ne ellenőrizzünk HTTP státuszkódokat, hiszen azt a felhasználó úgysem látja.
* Ne akarjunk többfaktoros bejelentkezést tesztelni. A teszt környezetben az a legegyszerűbb, ha az autentikációt kikapcsoljuk. Sajnos ez nagyon sok alkalmazásban nem beállítható. Sok projektet láttam, hogy heteket töltöttek azzal, hogy egyáltalán be tudjanak tesztesetből jelentkezni.
* A Selenium WebDriver nem jó terheléses tesztelésre, mert lassú.

## Tévhit: "Nekünk speciális igényeink vannak."

Fejlesztőként elkövethetem azt a hibát, hogy azt hiszem, hogy speciális igényeink vannak, és ezért kell különleges eszközt használnom, vagy egy adott eszközt máshogy használnom. Oktatóként sok céggel találkoztam, ahol a vezető fejlesztő elmondta, hogy nekik milyen speciális igényeik vannak, majd elsorolta olyanokat, melyek pontosan megegyeztek egy más cég speciális igényeivel.

A Convention over configuration több mint húsz éve ismert. Azaz inkább idomuljunk a konvenciókhoz, és ne akarjunk egyedi megoldásokat. Ha nekünk speciális igényeink vannak, akkor nagyon el kell gondolkodni azon, hogy miért, és nem csak "vélt" igényekről van-e szó. Sajnos sokszor azt látom, hogy ezek az igények ráadásul teljesen máshonnan jönnek, olyan helyről, ahol nincsnek igazából tisztában a napi rutinnal, ilyen pl. a management, vagy sokszor a IT biztonság felől.

## Rossz gyakorlat: Tesztelési keretrendszert fejlesztek.

A "Nekünk speciális igényeink vannak." tévhitre adott egyik megoldás. A [Miért ne fejlesszünk saját keretrendszert](/2011/05/11/ne-fejlesszunk-sajat-keretrendszert.html) posztomban már kifejtettem, hogy ez miért nem jó. Sajnos azt látom, hogy az automata tesztelés világában ez még mindig nagyon gyakori.

A tesztelők általában nem szeretik a mások által kifejlesztett, hibás, igényeiknek nem megfelelő, a konvenciókat nem betartó, black box-ként működő, általuk nem továbbfejleszthető keretrendszereket. Ezen tulajdonságok mindegyike csak kötöttséget ad. Fejlesztőként mi sem szeretjük a más által írt céges keretrendszereket, melyekben szerzett tudást máshol nem tudjuk hasznosítani. (Többször hallottam állásinterjún, hogy a jelölt fejlesztő kijelentette, hogyha saját céges keretrendszer van, akkor ahhoz a céghez nem megy dolgozni.) Azonban ezek köztünk vannak, szóval úgy látszik, írni viszont szeretjük őket.

## Rossz gyakorlat: Nem próbálom ki az általam fejlesztett funkciót, a tesztelő úgyis megteszi.

Klasszikus probléma, úgy adok át egy funkciót tesztelésére, hogy előtte nem próbáltam ki. Amikor a tesztelő az első kattintás után visszadobja, hogy nem működik, akkor megfogadom, hogy soha többet nem csinálok ilyet. Ugye ezt nem kell jobban kifejtenem, hogy ez milyen tiszteletlenség az irányukba, és mennyi pluszmunka? (Nála is context switch, release kitelepítésének ideje, tesztadatok előállítása, stb.)

## Rossz gyakorlat: Nem osztok meg kellő információt a tesztelőkkel.

A Selenium WebDriver dokumentációja azt írja, ha E2E tesztet akarok írni, akkor az alkalmazás állapotát lehetőleg API-n keresztül állítsam be. Ha ezt egyszerűen akarom megfogalmazni, ez gyakran azt jelenti, hogy fel kell tölteni az adatbázist tesztadatokkal.

A hiba, amit elkövethetek, hogy nem dokumentálom sem az adatbázisszerkezetet, sem az API-t, pl. a webszolgáltatásokat. Sokan az agilitást tévesen úgy értelmezik, hogy nem kell dokumentálni.

Hányszor láttam azt, hogy a tesztelők saját maguk térképezték fel az adatbázist, a felületet nyomkodva, és nézve, hogy mi is változik az adatbázisban. Hányszor láttam kódokat az adatbázisban, amihez nem volt magyarázat. (A Clean Code ellenjavalja a kódok használatát, hiszen az adatbázisok már vannak úgy hangolva, hogy hosszabb szövegeket is optimálisan tároljanak és indexeljenek.)
Már egy pár oldalas Entity Relationship Diagram, pár magyarázó szóval is rengeteget ér.

Ugyanígy már vannak technológiák, szabványok, formátumok az API dokumentálására is. SOAP esetén ott a WSDL, REST esetén ott az OpenAPI, sőt egy erre épülő, dokumentációt is megjeleníteni képes, a REST webszolgáltatások meghívását is biztosító eszköz, a [Swagger](https://swagger.io/). Az OpenAPI egy zseniális találmánya, hogy képes példa értékek tárolására is (`example`), ami remek tipp lehet a tesztelők számára, hogy milyen értékekkel töltsék fel a hiányzó adatokat.

Fejlesztőként felelősségem az is, hogy olvasható üzeneteket írjak a logba. A tesztelő számára egy hasznos információkat tartalmazó log kincset érhet. Pláne, ha ehhez egy kereshető, szűkíthető felület is tartozik. (Klasszikusan az ELK stack: Elasticsearch - Logback - Kibana, vagy valami modernebb alternatívája.)

## Rossz gyakorlat: Nálam működik!

Ha a tesztelő megkeres egy hibával, nem lehet az az első dolgom, hogy megpróbálom lepattintani. Például azzal, hogy a böngésző cache-t törölted-e? Amennyiben egy új verzió kirakásánál a cache a tesztelőknél problémát okoz, akkor problémát fog okozni a felhasználóknál is. A http protokoll amúgy nagyon jó megoldásokat biztosít ennek finom szabályozására, melyeket ráadásul a keretrendszerek is támogatnak (pl. URL generálás, hash használata, cache headerök, ETag, stb).

Amennyiben hibát jelez, akkor nem az ő feladata annak kiderítése, hogy vajon miért is áll fenn a hiba. Nem küldöm vissza, hogy nézze meg ezt is, azt is, stb. Ezt már nekem kell végig debuggolnom.

A legegyszerűbb, ha hozzá tudok kapcsolódni az adott tesztelő tesztrendszeréhez, és ott tudom megnézni a problémát. Gyakran előfordul, hogy nálam épp nem lehet reprodukálni. (Ilyenkor figyeljünk arra, hogy ne dobjuk el véletlenül a tesztadatait - sajnos ez már velem megtörtént, azóta preferálom a tesztkörnyezetek mentését is.)

## Rossz gyakorlat: Nehezen állítható elő új tesztkörnyezet.

Amennyiben olyan alkalmazást fejlesztek, melyet nagyon nehéz feltelepíteni (láttam több, mint 20 oldalas telepítési leírást!), megnehezítem a tesztelők munkáját. Ekkor alakul ki az a gyakorlat, hogy csak limitált számú tesztkörnyezet van, amivel nagyon sok probléma szokott lenni:

* Nem egyértelmű, hogy ki a felelőse. Láttam, mikor egy demó vagy User Acceptance Test során szoftvert frissítettek.
* Nem ismert állapotban van, nem tudni, hogy milyen verzió van kinn
* Alacsony a rendelkezésre állása
* Párhuzamos felhasználásból adódóan rengeteg probléma jelentkezhet. Láttam, hogy egy rendszeren terheléses tesztet futtattak, miközben funkcionális tesztet próbáltak rajta végezni.
* Külső rendszerekkel való kapcsolat kérdéses. Láttam olyat, hogy az egyik rendszer teszt környezete rá volt kötve a másik rendszer éles környezetére.

Itt szokott előjönni az a probléma, hogy milyen adatokkal töltsük fel a teszt környezetet. Erre egy gyakori példa, hogy az éles környezetről hozzuk át adatokat. Sajnos sokszor meg is reked a dolog, és a tesztelők éles adatokkal tesztelnek, mely nem biztos, hogy megfelel a biztonsági követelményeknek. Ekkor kell bevetni az anonimizálást, mely során konzisztens módon összekeverik az adatokat. Erre rendkívül jó eszközök vannak már.

A konténerizáció (Docker, Kubernetes, stb.), valamint az infrastructure as code lehetővé teszi, hogy akár egy paranccsal elindítsunk több szoftverkomponensből álló környezetet. Ezt mi odáig vittük el, hogy az üzletkötők laptopján egy paranccsal el tudtunk indítani egy környezetet, és akár Internet elérés nélkül is tudtak demózni.

Nagy segítség a tesztelők számára, ha saját alkalmazáspéldányt tudnak elindítani.

Ehhez lazán kapcsolódik, hogy az első munkahelyemen, az első héten azt tanították nekem, hogyha egy szoftverről egy kattintásra nem derül ki annak verziószáma, akkor ott komoly bajok vannak. Erre figyeljünk, hogy a szoftver verziószámát akár adatbázisból, akár felületen, akár API-n le lehessen kérdezni, sőt a logba is kerüljön be induláskor. (A legjobb, ha a Git commit hash-sel együtt.) Így a tesztelő pontosabb hibajelentést tud leadni, a pontos verzió megjelölésével.

## Rossz gyakorlat: Nem készítem fel az alkalmazásom, hogy tesztelhető legyen.

Fejlesztőként régen én is azt az elvet vallottam, hogy az alkalmazásban nem lehet olyan kód, ami a teszteléssel kapcsolatos.
Azóta azonban a Clean Architecture könyv óta változott a véleményem, ugyanis a teszt eszközöket is az architektúra részének tekinti, ugyanúgy, mint az adatbázist, vagy a felhasználói felületet.

A fentieket figyelembe véve a következőkön kell elgondolkozni, és figyelembe venni a fejlesztés során:

* Dokumentáljuk az adatbázist
* Dokumentáljuk az API-t
* Autentikáció legyen kikapcsolható
* Captcha legyen kikapcsolható
* Informatív naplóüzeneteket használjunk
* Zseniális ötlet, hogy minden egyes kéréshez rendeljünk egy azonosítót, mely azonosítót aztán a logban is megjelenítünk
* Legyen az alkalmazás konténerizált, könnyen el lehessen indítani egy új példányt
* Segítsünk az adatok anonimizálásában
* Legyen könnyen lekérdezhető az alkalmazás verziószáma
* Könnyítsük meg a felületi tesztelést: adjunk azonosítókat a felületi elemekhez. Ezzel nagymértékben megkönnyítjük a felületi E2E teszteket írók munkáját.

## Tévhit: "Ha működik, az már elég."

A tesztelés alatt nem csak a funkcionális tesztelést értjük. A szoftvernek meg kell felelnie bizonyos nem funkcionális követelményeknek is. Pl. legyen hibatűrő, magas rendelkezésre állású, nagy teljesítményű, skálázható, feleljen meg a biztonsági követelményeknek, és legyen könnyen használható. Ezekre lehet futtatni performancia és stresszteszteket, biztonsági teszteket (penetration testing), használhatósági teszteket (usability testing), melyek mindegyike külön tudomány.

Ha visszajön, hogy ezek egyikén elbukott az alkalmazás, akkor az én dolgom megvizsgálni, hogy pontosan mi is lehet a probléma, és nem a tesztelőktől elvárni, hogy a hiba okát is kiderítsék.

## Összefoglalás

Remélem sikerült éreztetni, hogy a fejlesztők és a tesztelők közötti közös munkának mennyi aspektusa van, és fejlesztőként
mennyit tudunk azért tenni, hogy ez az együttműködés a lehető leggördülékenyebb legyen. Egy tapasztalt tesztelővel való közös munka nagyon sokat ad, megismerhetsz egy más látásmódot, egy más világot.