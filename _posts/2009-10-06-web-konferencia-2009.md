---
layout: post
title: Magyarországi Web Konferencia 2009
date: '2009-10-06T23:31:00.004+02:00'
author: István Viczián
tags:
- Community
modified_time: '2018-06-09T10:00:00.000-08:00'
---

2009\. október 3-án, szombaton volt a [Magyarországi Web Konferencia
2009](http://web.conf.hu/2009). Rengeteg jó téma és előadás volt, ezért
szeretnék ezekről egy összefoglalót írni. Nem csak Java-val kapcsolatos,
de alapvetően webes témakörökben. Négy szekció volt, ezek közül kellett
mindig a legérdekesebb előadást kiválasztani. Az általam legjobban
becsült magyarországi projektek: [Prezi.com](http://prezi.com/),
[Moly](http://moly.hu/) és a [Ustream](http://ustream.tv/). Szerencsére
mindegyiktől volt valaki, aki előadást tartott, így azokra beültem. Ha
valaha saját projektet indítanék, a Moly oldalt fejlesztő Nagy Bence
lelkesedésével, és a Ustream-esek technológiai profizmusával szeretném
megtenni.

Első előadást, melyre bementem Halácsy Péter, a Prezi.com alapító
technológiai igazgatója tartotta. Előadásának címe *HTML5: a Flash
halála vagy csak újabb fejezet a
böngészőháborúban?*. Mivel kicsit később
érkeztem, már nem fértem be a terembe, akkora volt az érdeklődés. A HTML
5-öt eddig nem követtem figyelemmel, de pont a napokban jelent meg az
Editor's Draft 4. Sőt, most jött ki a Google Wave is, mely már HTML
5-ben készült, melyet az összes modern böngésző támogat, kivéve az
Internet Explorer (ezért próbálja nyomatni a Google a [Google Chrome
Frame](http://code.google.com/chrome/chromeframe/) IE plugin-t). A HTML
5-nek nem titkolt célja, hogy használatával RIA alkalmazásokat lehessen
összedobni, mellőzve a manapság terjedő Adobe Flash, Microsoft
Silverlight, és Sun JavaFX technológiákat. Ennek érdekében a HTML 4
felturbósításán kívül teljesen új API-k is megjelentek, mint canvas 2d
rajzolásra, időzített média lejátszás, offline adatbázis, dokumentum
szerkesztés, drag-and-drop (akár op. rendszerből is), dokumentumok
közötti üzenetváltás, böngésző előzményeinek kezelése, MIME típus és
protokoll kezelők. Az előadó főleg az elsőt vizsgálta meg abból a
szempontból, hogy a Prezi.com-ot mennyire lenne egyszerű HTML 5-ben
fejleszteni. Összefoglalva talán annyi mondható, hogy a HTML nem
tartalmaz forradalmi ötleteket, sebessége még elmarad a Flash-től, sok
minden hiányzik belőle (pl. klikkelésnél nem mondja meg, hogy melyik
elemen történt az esemény, double buffer hiányzik), és várhatóan mint
eddig a kompatibilitással is lesznek problémák (ahogy a HTML 4 esetén is
még mindig vannak, és az IE még nem kezeli a HTML 5-öt). Viszont ahogy a
konferencián is megmutatkozott, rengeteg ember kíváncsi a HTML 5-re,
látatlanban is megjósolható, hogy nagyobb lesz a felhasználói bázisa,
mint a többi technológiának, így ezért fejlődni fog, fejlódnie kell.
Jelenleg még nem alternatíva. Valamint a Flash mellett hozható fel a
professzionális, bár nem olcsó eszközök is. Meg lett pl. említve az
Adobe Flash Catalyst, mellyel a designer-ek dolgozhatnak,
beimportálhatnak Photoshop vagy Illustrator állományokat, interaktív
felhasználói felületeket hozhatnak létre, ami mögé a fejlesztő Adobe
Flash Builder-ben mögérakja a funkcionalitást.

Még gyorsan sikerült átcsusszannom *Silverlight 3 platform
innovációk* című előadásra, melyet [Bátorfi
Zsolt](http://batorfizsolt.spaces.live.com/) tartott, kinek lelkesedése
minden előadásából átjön. Néha úgy érzem, hogy érdemes lenne kipróbálni,
hogy milyen lehet egy olyan gépezet, mint a Microsoft előnyeit
kihasználni. Brutális marketing, integrált eszközök, hatalmas támogatás
(lásd pl. a konferencián is átadott egy DVD-nyi oktató anyag). Az
előadás volt a Silverlight 3 magyarországi bejelentése is. Újdonság a HD
videó támogatása, adaptive streaming, plusz grafikai képességek
(hardware gyorsítás, pixel shader), elmozdulás abba az irányba, hogy
komoly üzleti alkalmazásokat is lehessen fejleszteni, böngészőn kívül
futó alkalmazások (out of the browser), szóval minden, ami a RIA-ban
most pörög. Itt is van egy eszköz, az [Expression Blend
3-ban](http://www.microsoft.com/expression/products/Blend_Features.aspx)
bevezetett SketchFlow, mellyel Photoshop-ból lehet importálni, és a
designer képes programozás nélkül GUI-t összerakni, példa adatbázist
készíteni, és ezt a programozónak átnyújtani, akinek sokkal kevesebb
dolga van ezzel, mintha képekből kéne kiindulnia. Bár itt egyedi
megoldásként hangzott el, a párhuzamos előadáson esett szó a
konkurrencia előbb is említett Adobe Flash Catalyst-jéről.

A következő előadásként *Nagy Attila Gábor: Termék életciklus és
verziókezelés* előadására ültem be. Itt a
CVS-ről, Subversion-ről és az újabb, elosztott verziókezelők közül a
Git, Mercurial, Bazaar eszközökről esett szó. Elhangoztak best
practice-ek a verziókezelők használatáról, a fejlesztői, teszt és éles
környezetek használatáról. Pl. felejtsük el a CVS-t, használjunk
Subversion-t. A Subversion-ben is az 1.5 előtt nehézkes volt a merge,
erre van egy Python-ban írt
[Svnmerge.py](http://www.orcaware.com/svn/wiki/Svnmerge.py) eszköz, mely
segít ebben. Az 1.5-ben bevezették a mergeinfo-t, de az előbb említett
eszköz még mindig többet tud (ui. trunk -&gt; branch irányba a
Subversion eszköz bármikor tud merge-ölni, de az ellentétes irányba már
csak egyszer). Linus-nak van egy [Git térítő
videója](http://www.youtube.com/watch?v=4XpnKHJAok8), azt érdemes
megnézni. Ugye a Git-et is Linus tervezte és fejlesztette a Linux
fejlesztéséhez. Alap kijelentés: "a merge a lényeg, branch-elni mindenki
tud". Fontos, hogy tartsuk magunkat ahhoz, hogy minden változtatást
külön branch-ben hozzunk létre (feature branch), így ha az ügyfél
egyesével válogatja össze, hogy milyen feature-ökre van szüksége,
könnyebben összeszedhető (határozatlan ügyfél). Persze ez a projekt
indításakor nem megoldható, inkább csak a későbbi karbantartásnál. Itt
hangzott el a cherry pick fogalma is. Összességében elmondható, hogy a
Subversion kezelése már alap elvárás, de a Git bevezetése nem könnyű
feladat, hosszabb betanulási idővel is jár. Érdemes még commit hookokat
használni, mellyel eseményekhez (commit) lefuttatandó alkalmazásokat
rendelhetünk, mint pl. forráskód, konvenciók ellenőrzése, change log
generálása, issue manager eszközökkel való integráció, code review
támogatása (pl. értesítések).

Ez után *Micsik András: Hogyan mixeljünk össze webszolgáltatásokat,
ontológiákat és ágenseket* című előadását
hallgattam meg. A SZTAKI munkatársa egy olyan projektet mutatott be,
melynek során megvalósították a címben leírtakat. Ehhez használták az
Apache CFX webszolgáltatás keretrendszert, a Jade, leggyakrabban
alkalmazott multiágens keretrendszert, a Jena szemantikus web
keretrendszert. Az előbbi kettő integrálására készítettek is egy [Web
Service Integration
Toolkit-et](http://brein.dsd.sztaki.hu/JadeSoapMTP/), mely a projekt
honlapjáról elérhető. Segítségével az ágensek kéepesek web
szolgáltatásokat nyújtani és igénybe venni. A Belief Desire Intention
(BDI) modellt alkalmazták. Ez azt jelenti, hogy minden ágensnek van egy
képe a világról, vannak céljaik, és vannak eszközeik, hogy ezt a célt
elérjék. Ennek egyik megvalósítása a Jadex következtető gép. Ezen kívül
használták a Pellet nevű következtető gépet. Ez így elég tudományosan
hangzik, feltehetően a példa, mely megoldására a projekt is létrejött,
szemléltetni fogja. Egy repülőtéren a gépről leszálló, gépre felszálló
utasok szállítására mozgó lépcsőket és buszokat alkalmaznak. Ezek
vezérlésére írt program remekül működik addig, míg minden a terv szerint
halad. Ha azonban elkezdenek késni a gépek, váratlan helyzetek
következnek be, a klasszikus megoldások csődöt mondanak, azonnal kell
reagálni a helyzetre. Erre jöhet jól az ágens technológia, ahol minden
közlekedési eszközt egy ágens képvisel. Egymással képesek egyszerűen
kommunikálni, de az ágensek világában bonyolultabb kommunikációs formák
is vannak, egyezkednek, pl. aukciókon vesznek részt. Az ágensek világról
alkotott képét a technológiák összekapcsolásával akár szemantikus módon
lehet leírni, és következtető gépet alkalmazni. A valós helyzetekre,
problémákra elosztottan, jobban tudnak reagálni, így megoldani a
közlekedési problémát. A bonyolultabb tudáskészleten végzett
következtetések viszonylag lassúak, így az ágens technológia az
ágensekbe szétosztott tudásával akár megoldhatja ezt a problémát. Még
csak kísérleti fázisban van a projekt, és a bevezetése után is először
inkább csak tanácsokat, tippeket tud adni, amit az irányító személy akár
felül is bírálhat.

A következő előadást úgy választottam, hogy mostanában nagy hype az
alternatív adatbázisok használata, gondoltam kicsit megismerkedem velük.
*Érdi Bálint CouchDB, a webre termett
adatbázis* előadása azonban tökéletesen
meggyőzött, hogy ezen eszközöknek igen is helyük van a modern web 2.0-ás
alkalmazások fejlesztésekor. A [CouchDB](http://couchdb.apache.org/) egy
Apache berkekben fejlesztett, nyílt forráskódú dokumentum orientált
adatbázis, ahol a lekérdezéseket MapReduce módon, JavaScript nyelven
lehet megfogalmazni. A MapReduce a Google által kifejlesztett
keretrendszer, hatalmas adatbázisok cluster-es kezelését oldja meg. Az
alapötet, hogy van egy Map függvény, mely a problémát részproblémákra
vágja, és kiadja megoldásra, amiket szintén szét lehet vágni. A Reduce
függvény összeszedi és összegzi a válaszokat. Ezáltal nagyon szépen
párhuzamosíthatóak a műveletek. Igaz ugyan, hogy egy szekvenciális
programhoz képest kevésbé hatékony, azonban cluster-en sokkal gyorsabban
kaphatunk eredményt. A CouchDB a funkcionális Erlang programozási
nyelvben lett megvalósítva, mely különösen alkalmas konkurens programok
fejlesztésére. Az adatokat JSON dokumentumként lehet megadni,
mindegyiknek egyedi azonosítót ad (UUID típusú \_id néven), és
mindegyikhez eltárolja a verzióját is (\_rev). Séma nincs, így pl. a
séma update problémája fel sem merül. Remek példa erre pl. a
névjegykártya, amire mindenki más mezőket helyez el, ennek tárolása a
CouchDB-nek nem probléma. A CouchDB RESTful JSON API-n keresztül érhető
el. Ezekből is látható, hogy maximálisan webes technológiákat
felvonultató megoldás. Nem kezel lock-olást, optimista megközelítést
alkalmaz. Szerkesztés esetén betölti a dokumentumot, módosítja, majd
elmenti. Ha közben más is ugyanezt a dokumentumot módosítja (a
verziószámot is át kell adni, és ha ez nem az utolsó) a mentéskor hiba
keletkezik, amit programból kezelni kell (utolsó dokumentum betöltése,
ezen a változtatások elvégzése, majd újra mentése). A CouchDB sosem ír
felül commit-ált adatot, ezért ez egy “crash-only” design, ami azt
jelenti, hogy nem kell shutdown, futása egyszerűen megszakítható. A
Multi-Version Concurrency Control (MVCC) modellt alkalmazza, ami azt
jelenti, hogy minden kliens az adott adatbázis egy állapotát látja az
olvasás elejétől a végéig. A dokumentumokat btree-be tárolja, és írás
kizárólag az állomány végére történik. Persze nem nő a végtelenbe, hanem
bizonyos időközönként kompaktálás történik, ami a valós adatok más
állományba másolása, majd sikeres esetben átállás arra. Persze közben az
adatbázis végig elérhető.

A CouchDb-ben nézeteket kell definiálni a lekérdezésekhez. Ezek a
dokumentumokon dolgoznak, és JavaScript-ben lehet ezeket megadni, un.
design dokumentumban. A nagy sebességet úgy éri el, hogy folyamatosan
egy indexet tart fenn, és ahogy egy új dokumentum kerül be, vagy
módosul, módosítja az indexet, és mindig ez alapján adja vissza a
dokumentumokat. Az index írása is kizárólag az állomány végére történik
(, ha írás közben áll le, akkor bármikor újraépíthető az index). Az
adatbázisban a dokumentumokat formázni show és list függvények
segítségével lehet (JSON-ből akár HTML formára konvertálni), így akár az
adatbázison belül lehet alkalmazást írni, ilyen pl. a beépített
adminisztrációs felülete, a Futon is. Ezen függvények eredménye ráadásul
jól cache-elhető. Ezen függvények dokumentumként tárolása miatt az
alkalmazás így tetszőlegesen replikálható, akár offline alkalmazásként.

Elhangzott a CAP elv is, ami azt jelenti, hogy a consistency,
availability és partition tolerance követelményekből egyszerre csak
kettő teljesíthető. A CauchDB szerint a konzisztenica az, amiből
valamennyit fel lehet adni. A CouchDB elosztott, cluster-es működésre
lett kitalálva, és inkrementális replikációt biztosít a futó példányok
között (ahol egy példány lehet egy aktív cluster tag, de lehet egy
offline-ba vitt adatbázis is), azaz két példány között csak a
különbségeket viszi át. Kétirányú konfliktus kezelés van beépítve.
Amennyiben két node-on egyszerre történt a változás, akkor a replikációs
során "conflicted" állapotba kerül, és a két verzió közül
determinisztikusan az egyik nyertesként kiválasztásra kerül, és
hivatkozást tartalmaz az előző verzióra. A konfliktus feloldását
végezheti az alkalmazás automatikusan időbélyeg alapján, vagy ha más
mezők frissültek. Ha egyik sincs, a felhasználónak kell döntenie.

Eztán *Tolmács Márk Ustream.tv - Bepillantás egy közösségi elővideó site
működésébe* előadást hallgattam meg, mely
során megismerhettük a ustream.tv architektúráját. Jelmondat a "Facebook
clean, YouTube simple" volt. Jelenleg mértek 2 millió látogató/nap,
168000 lekérés/perc értékeket. E mögött lévő infrastruktúra: 6 web
front-end szerver, 2 cache server, 2 statikus tartalmat kiszolgáló web
szerver, 2 master + 3 slave MySQL adatbázis, 16 Flash media szerver. És
persze az egész meg van bolondítva egy kis
[CDN-nel](http://en.wikipedia.org/wiki/Content_delivery_network) (pl.
Akamai). Fejlesztéshez multi-master SVN-t használnak, ehhez saját commit
hook-okat implementáltak. A telepítés rsync-el történik. A webes
alkalmazás PHP-ban készült, saját keretrendszerrel (oop, MVC). Erősen
használják a JavaScript-et, igyekeznek a legtöbb logikát kliens oldalra
tolni. A JavaScript, CSS tartalmakat csoportosítva kezelik, másolják
egybe, tömörítik. JavaScript framework a jQuery, nem ragaszkodnak minden
áron az objektumorientált szemlélethez. Igyekeznek újrafelhasználható
komponenseket, widget-eket gyártani. CSS sprite-okat használnak. Az
adatbázis rétegben (DAO) kézzel hangolt SQL-ek, többszintű cache
dolgozik. Újdonságok, hogy egyrészt elkezdik nyomni a mobilről való
stream-elést, másrészt próbálnak nyitni a fejlesztők felé, platformot
biztosítani, API-t adni.

Utolsóként a JavaFX volt a téma, Simon Géza: JavaFX alapok és
újdonságok* előadásán. Itt igazából sok
visszautalást kaphattunk az előző évben tartott előadására (JavaFX külön
nyelv, objektumorientált, deklaratív, szkript, de mégis szigorúan
tipizált, fordított, de Java-val könnyedén integrálható), itt már inkább
a haladó témakörök voltak terítéken. JavaFX-nél is hangsúlyozni kell,
hogy lépnek abba az irányba, hogy komoly üzleti alkalmazásokat is meg
lehessen vele valósítani. Ezért ellátták egyszerű XML-t és JSON-t
egyaránt támogató API-val, valamint aszinkron HTTP hívással.
Kulcsszavak: HttpRequest, HttpResponse, PullParser. Sajnos engem egy új
XML/JSON feldolgozó API nem nagyon hoz már lázba, ezért érdekesebbnek
tartottam azt a videót, mely egy új vizuális [Java FX fejlesztő
eszközt](http://sellmic.com/blog/2009/06/05/javafx-authoring-tool-demo-at-javaone-2009-with-video/)
mutatott be. Neten csak JavaFX authoring tool-ként fut, egyelőre keveset
lehet tudni róla, még beta sincs belőle. A demó alapján kezelhető benne
majd a timeline, binding, sőt egyszer összerakjuk az alkalmazást, majd
különböző eszközökre (monitor, mobil, stb.) szabhatjuk. Reméljük ezzel
már tényleg tudni fog annyit, mint a konkurensek, használható
dokumentációval, weben található példákkal, és kevesebb buggal fog
rendelkezni. A sokakat érdekló Oracle SUN felvásárlással kapcsolatban
nem hangzott el semmi, viszont annyi igen, hogy nem tisztázott, hogy az
Oracle mennyire fogja nyomni a JavaFX-et. Emiatt még várok vele.

Érdekes, hogy majd minden előadó Mac-en nyomta, azonban a slide-okon még
mindig feltűnnek a nem azonos betűtípussal írt, tipográfiailag
borzasztóan oda nem illő ő betűk. Hihetetlen, hogy 2009-ben még mindig
itt tartunk. Tőlem lehet bármilyen csilli-villi a prezentáció (persze
nem az, mert én a Powerpoint-oshoz képest nem láttam eltérést), ha a
szép magyar betűinket nem tudja normálisan megjeleníteni.

Összefoglalásképp egy jó előadásokkal teli, jól szervezett konferencia
volt, amin biztos, hogy jövőre is megpróbálok részt venni, és amit
mindenkinek nagyon ajánlok.
