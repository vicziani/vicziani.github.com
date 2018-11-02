---
layout: post
title: Ki is az a Java architect?
date: '2012-01-16T00:47:00.002+01:00'
author: István Viczián
tags:
- Módszertan
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Magyarországon is egyre gyakrabban keresnek Java architectet, de
kérdés, hogy ez a pozíció vajon milyen feladatokkal járhat? Egzakt
definíciója nincs, az itt leírtak a saját tapasztalataim és véleményem
tükrözik. Be kell vallanom, a [Technical Job Interview Questions for
Java EE
architects](http://java.dzone.com/articles/technical-job-interview) cikk
is nagyon elgondolkodtatott.

Az architect szó a görög arkhitecton szóból származik, ami az arkhi
(vezető) és tekton (építész) szóból áll, így nagyjából vezető építészt
jelent. A főnököm főkonstruktőrt szokott emlegetni, ami nekem
szimpatikus és ráadásul magyar kifejezés. Az informatika ezt a
kifejezést is az építészetből vette át, mint pl. blueprint vagy a
tervezési minta szavakat.

A szoftverfejlesztés az architect fogalmát kb. az 1990-es évek végén
vette át, amikor is a szoftver rendszerek egyre bonyolultabbakká váltak,
és a szoftverfejlesztési problémák megoldására elkezdett terjedni az
objektumorientált programozás. Már nem egyedülálló, monolitikus,
szigetként működő alkalmazásokat kellett fejleszteni, hanem más
rendszerekhez illeszkedni tudó, azokkal kommunikáló, komoly üzleti
logikát megvalósító szoftver rendszereket. A megoldást a rendszerek
kisebb alrendszerekre való szétvágása, illetve az alrendszerek több
rétegre való bontása jelentette. Elterjedtek a két, három és n-rétegű
architektúrák, lassan minden nagyvállalati (enterprise) lett. A
rendszerek közötti kapcsolatok megvalósítását az Enterprise Application
Integration-től (EAI) várták, amely nem más, mint olyan architektúrális
elvek gyűjteménye, melyek az integrációt hivatottak megoldani. És
szükség volt valakire, aki az ilyen bonyolult rendszerekkel kapcsolatban
képes volt felmérni az igényeket, azonosítani a kockázatokat, becsülni,
magas szinten megtervezni és specifikálni a feladatokat, és ellenőrizni
a megvalósítást.

Az előzőekből is kiderül, hogy az architect az üzlet és az informatika
között helyezkedik el. Ismeri, megismeri, érti az üzleti területet,
valamint a megrendelő által megfogalmazott, a rendszerrel kapcsolatos
üzleti elvárásokat, az un. funkcionális követelményeket. Az architect
feladata ezen követelmények informatikai vetületeinek feltárása, és az
informatika felé ezek közvetítése. Az üzleti problémákra technológiai
megoldásokat képes adni.

Vegyük sorba, hogy egy szoftverfejlesztés életciklusát alapul véve,
melyik fázisban milyen feladatai lehetnek az architectnek, és ez
alapján azt, hogy milyen képességekkel kell rendelkeznie.

Az architect tehát egy szoftverfejlesztési projekt legelején, már az
ajánlatírás fázisában aktívan beszáll a projektbe. Egyrészt megérti a
funkcionális követelményeket. Ezen kívül képes felmérni a rendszerrel
kapcsolatos nem funkcionális gyakran minőségi követelményeket, melyek
azok az elvárások, melyek nem konkrétan egy üzleti használati esethez
köthetőek. Ilyen pl. a teljesítmény, magas rendelkezésre állás,
hibatűrés, skálázhatóság, biztonság, fenntarthatóság,
továbbfejleszthetőség, üzemeltethetőség, tesztelhetőség, használhatóság,
felhasználói felülettel kapcsolatos követelmények, stb. Nem funkcionális
igényként fontos definiálni az ügyfél oldali megszorításokat is, mint
pl. a kötelezően használt platformok, eszközök, valamint a más
rendszerekhez való illesztési lehetőségeket és elvárásokat. Meg kell
említeni a módszertannal kapcsolatos és dokumentációs követelményeket,
jogszabályoknak való megfeleléseket és a szakterületi szabályokat. Ezen
igények egy része mérhető bizonyos mérőszámok definiálásával, más
követelmények azonban korántsem ennyire egyértelműek. A nem funkcionális
követelmények érkezhetnek az üzleti oldal, de a megrendelő informatikai
gárdája felől is.

Ugyanígy képes felmérni a szállító oldali lehetőségeket is. Ismeri a
fejlesztési csapatot, és annak képességeit, a fejlesztők által használt
szabványokat, technológiákat és eszközöket.

Ezáltal már az ajánlati fázisban aktívan szerepet kell vállalnia. A
követelmények alapján ugyanis azonosítania kell a technológiai
kockázatokat, általánosságban a megvalósíthatóságot. A kockázatokat
minél előbb fel kell ismernie, és osztályoznia. Becsülnie kell, egy
probléma bekövetkezésének valószínűségét, valamint a bekövetkezése által
okozott kárt, az elhárításának erőforrás igényét. Valamint meg kell
határoznia, hogy milyen erőforrás szükséges a probléma kialakulásának
megakadályozására. Ezek alapján egy rangsort kell felállítania.

Ezek alapján víziót kell alkotnia. Bizonyos helyzetekben lehet, hogy
prototípus építésére is szükség lehet. És ez alapján erőforrást is kell
becsülnie. Látható tehát, hogy már a projekt elején kiemelt szerepe van,
hiszen a projekt alapvető sikeressége függ egy jó architektúrán, egy
pontos becslésen, mely kihat az árajánlatra, a projekt költségvetésére
is. Nem utolsósorban az architectnek olyan magas szintű döntéseket kell
hoznia, mely a projektben részt vevő összes személyre kihat, hiszen az ő
által kidolgozott koncepciót kell megvalósítani az általa megbecsült idő
alatt, így rajta is múlhat, mennyire motiváltak a projekt tagok, esetleg
mennyi túlórát kell a projektbe fektetni.

A követelmény elemzés és tervezés fázisában szintén nagy részt kell
vállalnia. Ki kell választania a problémás használati eseteket, és előre
priorizálnia. A szoftverrendszer magas szintű tervezését kell elvégeznie
és dokumentálnia. Milyen alrendszerekből álljon, ezek hogyan
kommunikáljanak egymással és külső rendszerekkel, valamint hogyan
épüljenek fel. Milyen eszközök és technológiák használandóak. Itt lehet
szükség bonyolultabb prototípusok építésére is. A prototípusoknak több
fajtája lehet, eldobandó, továbbfejleszthető és architektúrális. Az
eldobandó csak valaminek a kipróbálására jött létre, a
továbbfejleszthető akár a későbbi rendszer alapjául is szolgálhat, és az
architektúrális az architektúra elemek helyes együttműködésének
tesztelésére szolgál, melyet mintaként használva felépíthető a rendszer.
Az architektúrális tervezés és a rendszertervezés között több különbség
is van, melyet érdemes tisztázni. Az architektúrális tervezés magasabb
absztakciós szinten van, nem olyan részletes. Általában csak
rendszer/alrendszer szintig megy, illetve azok rétegeit tárgyalja, de
részletesen nem foglalkozik a rétegekben szereplő komponensekkel.
Általában a nem funkcionális követelményekre, és a kockázatos
funkcionális követelményekre koncentrál. Átnézi az elkészült
dokumentációkat.

Az implementáció és tervezés során támogatja és ellenőrzi a
fejlesztőcsapatot, az egész fejlesztési folyamat előrehaladását nyomon
követi. Kidolgoz belső fejlesztési szabványokat, és folyamatosan figyeli
azok betartását. Fejlesztők architektúrális kérdéseit igyekszik
megválaszolni, segít az esetleges architektúrális módosítások
végrehajtásában. A fejlesztés közben workshop-okat rendez az aktuális
fejlesztés közben felmerült problémákról, és moderál úgy. Ezek nem
akaszthatják meg a fejlesztést, nem lehet kötelező program. Ismernie
kell a fejlesztési metodológiát, a használt eszközöket. Ha kell,
felgyűri az ingujját, és akár kódolással segíti egy probléma
lokalizálását, megoldását. Otthonosan mozog a build, release, deploy
folyamatokban. Ugyanígy magas szintű rálátása van a tesztelési
folyamatokra, eszközökre (harness) is, hiszen az architektúrákkal
kapcsolatban egyre erősebb igény a minél kényelmesebb tesztelhetőség.

A bevezetés és a támogatás során folyamatosan tartja a kapcsolatot az
üzemeltetéssel is, a feltárt hibákat 2nd level support részeként elemzi,
kategorizálja, és kommunikálja a fejlesztők felé. Próbálja az
üzemeltetés és a fejlesztés közötti gyakran jelentkező szakadékot
áthidalni, a feleket egymáshoz közelebb hozni.

Milyen képességekkel kell rendelkeznie egy architectnek, hogy ezeket a
feladatokat el tudja látni? A legfontosabb a megfelelő mennyiségű
tapasztalat. Ezt egyrészt megszerezheti tanulás révén, folyamatos
képzésekkel, önképzéssel, a trendek figyelésével, tájékozottság
fenntartásával. Másrészt rengeteg gyakorlati tapasztalattal kell
rendelkeznie. Úgy gondolom, egy cégnél több évig (&gt;5) maradó
architect elveszik a napi rutinban, hiszen nem találkozik más
problémákkal, emberekkel, megoldásokkal, gondolatokkal. Ezért érdemes
vagy váltani, vagy részben máshol is ilyen jellegű tevékenységeket
vállalni.

Egy architectnek rendelkeznie kell menedzsment képességekkel és
technikai tudással is. Kockázatokat kell kezelnie. Másrészt becsléseket
kell végezni. Ez sajnos nem tanulható, csak tapasztalat segíthet abban,
hogy egy probléma megoldása az adott környezetben mennyi erőforrást
igényel. Állandóan döntéseket kell hoznia. A döntéseket folyamatosan
dokumentálni szükséges, ugyanis nem csak egy döntés, de az ahhoz vezető
út is nagyon fontos lehet a projekt szempontjából. Nagyon sok projekt
esetében hangzott el a kérdés, mikor a projekt előrehaladása folyamán
egy döntés logikátlannak tűnt, hogy vajon az elején miért is ez lett
meghozva.

Nagyon jó kommunikációs képességekkel kell rendelkeznie. A projekt során
szinte az összes projekttaggal kapcsolatban van. Nagyon fontos a
követelmények felmérésénél, a víziójának másokkal való elfogadtatásával.
Gondoljunk bele, az ő döntései a csapat minden tagjára kihatnak, nem
mindegy, hogy mennyire tudja ezeket a többiekkel elfogadtatni. Nem ülhet
elefántcsonttoronyban, és ott olvassa a dokumentációkat, és készíti a
specifikációit. A fejlesztés során is végig mentoring tevékenységet kell
végeznie.

A jó architect megoszt. Megosztja a tapasztalatait, véleményeit, az
érdekességeket, melyekkel találkozik. Megosztja a döntéseihez vezető
utak lépéseit, a döntésnél figyelembe vett érveket. Megosztja a
specifikációkat, dokumentumokat, a pilot eredményeit. Megosztja a
vízióját.

Az architectnek nem feladata mindennek a felderítése, megtervezése. A
kollégáira támaszkodik, az általuk adott specifikus tudásokból állít
össze egy architektúrát. Figyelembe veszi infrastruktúrális ügyekben az
üzemeltetőket, fejlesztési kérdésekben a programozókat, tesztelési
kérdésekben a tesztelőket. De érti mindegyik nyelvét, és az átadottakat
tudja az üzlet felé kommunikálni, és fordítva. Darabokból épít egészet.\
\
Nem mehet minden probléma mélyére, tudnia kell, mikor kit kell
megkérnie. Ha megtenné, elaprózná az idejét, és újra az
elefántcsonttoronyban kötne ki, immár technológiai problémákkal
körülvéve. A feladatokat meg kell tudnia osztani.\
\
Gyakori kérdés, hogy jól kódol-e az architect? Nem feltétlenül. Persze
nem árt, de a többi dolga mellett erre már kevésbé jut ideje, és valljuk
be, ha az ember nem 8 órát kódol folyamatosan, ki lehet menni a
gyakorlatból. Nem ismeri az eszközöket és API-kat sem olyan mélységben.
De egy adott problémát meg tud valósítani, lehet, hogy nem olyan
elegánsan, mint egy fejlesztő, feltehetőleg nem is annyi idő alatt, de
hasonló megoldásokkal. Kódot olvasni tud, debugol, optimalizál. Ismeri a
legjobb gyakorlatokat és tervezési mintákat. Rengeteg tapasztalata van,
hogy egy probléma más rendszerekben hogyan került megoldásra. Valamint
dereng még senior vagy vezető programozó korából, hogy akkor hogyan is
csinálta. A tudásának ereje nem is a tudásának mélységéből, hanem
szélességéből adódik. Tudja mit hol kell keresni. Kódolási képességek
nélkül nem fogadják el a fejlesztők.

Jó dokumentálási képességekkel kell rendelkeznie, tudnia kell írnia.
Rögzíteni a döntéseket, és azok indokait, valamint a vízióját írásban is
át kell tudnia adni a feleknek, akár egy ajánlat, akár egy specifikáció
esetén.

Maximális mértékben figyelembe kell vennie a körülményeket,
alkalmazkodnia kell. Nem szabad abba a hibába esnie, hogy az
önéletrajzának bővítse miatt választ technológiát, nem az adott
projekten próbál ki új dolgokat, vagy mert csak ahhoz ért. Figyelembe
kell vennie a csapatot. Ahhoz, hogy egy feladatot a leghatékonyabban
lehessen elvégezni, a maximális újrafelhasználhatóság szükséges,
tudásban is. A csapat tudásának megfelelően kell megoldásokat,
módszertanokat, eszközöket, technológiákat, szabványokat választania.
Nem választ ki egy programozási nyelvet, mert az menő, vagy alkalmasabb
a feladatra, ha a fejlesztők közül egyik sem használta még, akár ő sem.
Félre kell tenni a személyes preferenciáit.

Amennyiben egy architect nem csak egy konkrét projekten dolgozik, hanem
egy cégnél hosszabb távon alkalmazásban áll, érdemes valamilyen
stratégián is dolgoznia. Egyrészt be kell gyűjteni a menedzsment felől
érkező, még csak a távolban felvillanó üzleti igényeket, és beszélnie
kell a fejlesztést végző csapat minden tagjával, hogy mit éreznek
nehéznek, problémásnak. A kettőt egybegyúrva, minden oldallal egyeztetve
kell kialakítania egy olyan stratégiát, mely egyre gördülékenyebbé és
hatékonyabbá teszi a fejlesztéseket, nem korlátoz, és az új tagok
munkába állását is kellően megkönnyíti.

No de evezzünk egy kicsit technikai vizekre, nézzük, miben kell
otthonosan mozognia egy ilyen szakembernek. Az elosztott rendszerek
térhódításával jelent meg az igény az architectekre is. Hiszen minél
nagyobb az elosztottság, annál több a kihívás, annál több választási
lehetőség van. Egy alrendszer is egyre bonyolultabbá és bonyolultabbá
válhat. A problémamegoldás egyik hatékony fegyvere a dekompozíció,
komponensekre bontás. A komponensek együttműködnek, köztük interfészek
helyezkednek el. Fontos az egységbe zárás (encapsulation). Az
interfészek használata megkönnyíti a cserélhetőséget, tesztelhetőséget.
A komponenseket megfelelően szét kell tudni választani, mindnek csak a
saját feladatát kell tudnia elvégeznie (resposibility). Kialakult az
Enterprise Application Integration, valamint a Service Oriented
Architecture. Látható, hogy mélyebb szinten, alkalmazáson belül
ugyanezeket az elveket kell alkalmazni, és látható, hogy az előbbi
fogalmak egy az egyben jelennek meg objektumorientált programozás esetén
is. High cohesion, low coupling. Ezeket a komponenseket és a komponensek
közötti kapcsolatokat magasabb absztrakciós szintre kell emelni,
modellezni kell. A rendszereket különböző nézőpontokból kell
megfigyelni, pl. statikus esetben a rendszer felépítését, dinamikus
esetben a rendszer működését. Ezeket valahogyan ábrázolni kell, kifejező
leíró nyelv erre az UML. Fontos, az architect nem a való világ megfelelő
darabját szakítja ki (üzleti terület), mint a tervezők, hanem már
rendszer szinten, n agyon magas szintű objektumokban gondolkodik,
informatikai fogalmakban. Leghasznosabb eszköze a component, deployment
és sequence diagram. Gyakori problémákra gyakori, elterjedt megoldásokat
alkalmaz, tehát ismeri a tervezési mintákat és személyre tudja szabni
azokat. És itt nem kizárólag a Gang of Four tervezési mintákra kell
gondolni, hanem az un. architectural pattern-ekre is. Ide kapcsolódik
szorosan a refactoring is.

Be kell vetnem pár bűvös szót is, felsorolásképpen, szigorúan
össze-vissza, mely területekkel egy architectnek már találkoznia
kellett a szoftverfejlesztéssel kapcsolatban: webszolgáltatások
(SOAP/REST), SOA, cloud, event driven architecture, domain driven
design, Behaviour-Driven Development, test driven development,
continuous integration, continuous delivery, agile development,
dependency injection, inversion of control, AOP, caching.

A Sun, később az Oracle ennél talán behatároltabban kezeli az
architectet. Végighallgattam egy több napos "Architecting and Designing
J2EE Applications" képzést. Ennek első fele kb. a fentebb leírtakat
ecseteli meglepően kevés technológiai utalással, későbbi részek már a
technológiára mennek rá. Ennek megfelelő a [Oracle Certified Master,
Java EE 5 Enterprise
Architect](http://education.oracle.com/pls/web_prod-plq-dad/db_pages.getpage?page_id=326)
vizsga is, érdekes, Java EE 6-ra még nem jelent meg. Az említett linken
látható, hogy ez nem csak egy teszt kitöltéséből, hanem azon felül egy
esszé megírásából és annak megvédéséből áll.

Természetesen az Oracle a saját komponens architektúráját kéri számon,
azaz az EJB technológiát, valamint annak környezetét, a Java EE
szabványt. Ez utóbbiból megköveteli a JDBC, JPA, JMS, JCA, Servlet, JSP,
JSF, JAXB, JAX-WS ismeretét. Kitér a komponensek környezetét biztosító
alkalmazásszerverekre, valamint a Java EE tervezési mintákra is.

Az EJB mellett azonban ne felejtkezzünk el a Springről és az OSGi-ról
sem.

Úgy gondolom, az áttekintő tudás hasznos, de nem megkövetelendő a
különböző JVM-re épülő nyelvek, mint pl. a Groovy vagy Scala ismerete,
valamint a naprakészség olyan modern irányzatokban, mint pl. a NoSQL
eszközök.

Ma már az architectek is szakosodhatnak. Lehetnek enterprise
architectek, akik az alkalmazásintegrációt tartják szem előtt. Lehetnek
application vagy system architectek, akik az alkalmazások belső
felépítéséért felelnek. Lehetnek infrastructure architectek, akik az
infrastruktúráért felelősek, mint hardver, szerver szoftverek, hálózat,
adatbázis, és kedvencük a skálázhatóság, fürtözés, terheléselosztás és
újabban a virtualizáció.

Megnéztem több állásportált is, száz Java fejlesztői állásra maximum
három-öt Java architect jut. Egyrészt nem annyira elterjedt itthon,
másrészt szeretik a cégek a saját szakemberüket kinevelni. Meglepő
azonban, hogy ez a pár állás viszont elég pontosan írta le a
feladatköröket, azaz tudják, kit keresnek.
