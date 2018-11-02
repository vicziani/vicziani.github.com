---
layout: post
title: Maven legjobb gyakorlatok
date: '2011-09-27T01:15:00.007+02:00'
author: István Viczián
tags:
- Maven
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Technológiák: Maven 3.0.3

Maven-nel foglalkozó sorozatom részét azzal zárnám, hogy milyen legjobb
gyakorlatokat érdemes betartani. Lehet, hogy bizonyos dolgokat ismételni
fogok a [Maven kezdőlépések](/2010/04/28/maven-kezdolepesek.html)
post-omból, de álljanak itt összegyűjtve. Lehet, hogy bizonyos szabályok
túl szigorúak, azért van lehetőség egy-két helyen lazábbra engedni.

## Projekt granularitás

Talán a legnehezebb témakör, azaz mennyi projektet hozzunk létre egy
bonyolultabb rendszer esetén, és ezek milyen függőségekben legyenek
egymással. Az egy projekt csak kis alkalmazásoknál, 3rd party
library-knél szokott elegendő lenni, kicsit is bonyolultabb alkalmazások
esetén szükség van több projektre. Egy projekt esetén a fejlesztés
nehézkesebb, hiszen nem tudjuk kisebb részekben kezelni, mindig mindent
le kell fordítani, nagy csomagot előállítani, stb. Maven egy kitűnő
támpontot ad, ugyanis az alapfilozófiája az, hogy amennyi projekt, annyi
artifact, tehát annyi jar, war, ear, zip, stb.

Másik kérdés, hogy ezek a projektek mennyire mozognak együtt, vagy
külön. Együtt történik a release, vagy gyakran előfordul, hogy az
alkalmazás csak egy kis részlete kerül mindig javításra, kiadásra? Van-e
olyan rész, mely önmagában is megállja a helyét, pl. egy külön grafikai
komponens, melyet akár más projektekben is fel lehet használni.
Élhetnek-e külön életet, külön verziószámozással?

Ezt egyedül a gyakorlat tudja megmondani. Láttam olyan rendszert, ami
teljesen különálló modulokból állt, és szépen, külön volt fejleszthető.
Egy másik projekt esetében bármit kellett módosítani, mindig hozzá
kellett nyúlni 3-4 modulhoz is. Sőt, olyan is megeshet, hogy az elején
még minden módosul, míg a hibajavításkor, tovább fejesztéskor már elég
csak egy-egy modult bolygatni.

Néhány támpont azonban. Jó gyakorlat az interfész és implementáció
különválasztása (, ez pl. interfészek - web szolgáltatások - esetén
nagyon gyakori, és a technológia is megköveteli, mert az interfész
osztályoknak mindkét oldalon meg kell lennie). Használjunk szervezet és
projekt szintű szülő projekteket. Hasznosak lehetnek a prototípus
projektek. Gyakran használt utility osztályokat emeljük ki library-ként.
Közös erőforrásokat emeljük ki külön projektbe. Integrációs teszt
eseteket emeljük ki külön projektbe. Függőségeket is ki lehet emelni
külön projektbe. Ezekről még mindről lesz később szó a posztban.

Fontos, hogy a projekt granularitása összefügg az issue tracker-ünkben
felvett projektekkel is. Hiszen ha a projektek külön életet élnek, külön
verziószámokkal rendelkeznek, akkor érdemes ezeket az issue tracker-ben
is külön követni. Ha a projektek általában együtt mozognak, és egyszerre
kell javítani, kiadni, követni őket, akkor mind a release, mind a
verziókezelés, mind az issue tracking folyamán jelentős pluszmunkát
veszünk magunkra.

## pom.xml formázása

Mutasd a pom.xml-ed, megmondom, milyen a projekted! A pom.xml-eket is
olyan tisztán kell tartani, mint a forráskódot. Ez egy XML állomány,
ahol a tag-ek sorrendje nem kötött, azonban mégis javaslom, hogy a
projekten belül az összes modulban ugyanazt a sorrendet használjuk. A
függőségeknél is ajánlott egy sorrendet meghatározni, pl. előbb a belső
függőségek, majd a nem publikus repository-kból nyert függőségek, majd
scope-onként a compile, provided, test scope-ú függőségek. Így ahhoz
szokik a szemünk, automatikusan tudjuk, hogy mit hol kell keresni,
azonnal láthatjuk, hogy valami van-e definiálva, vagy hiányzik. A
forráskódhoz hasonlóan ne használjunk felesleges comment-eket, de amit
célszerű, azt jegyezzük fel (pl. függőségekkel kapcsolatos tudnivalók).
Ne használjunk csupa nagybetűs comment-eket, ahogy sormintákat se.

## DRY, KISS

Forrásokhoz megfelelően próbáljuk a pom.xml-ekben az ismétlődéseket
kerülni (Don't Repeat Yourself). Ez megoldható öröklődéssel, azaz a
szülőben definiált a gyermek örökli. Használjunk property-ket, akár
beépítetteket, akár saját magunk által definiáltakat. Legyenek a
pom.xml-ek egyszerűek (Keep it short and simple). Persze ez főleg akkor
lehetséges, ha a projektünk alkalmazkodik a konvenciókhoz, és nem
használ semmiféle egzotikus megoldást, ami követendő. Használjunk
szabványos megoldásokat, a Maven beépített eszközeit és plugin-jeit.
(Pl. verziószám megjelenítését [resource
filtering](/2011/09/13/verzioszam-megjelenitese.html) segítségével.)
Használjuk a default értékeket, ahelyett, hogy konfigurálnánk
(convention over configuration). Pl. standard könyvtárstruktúra.

## Felelős

Legyen a pom.xml-eknek egy felelőse. Lehetőleg a vezető programozó,
architect. A pom.xml-be felvett változások általában az architektúra,
függőségek módosítását jelzik. Sem a modulok között, sem a 3rd party
library-ra nem jó, ha bekerül egy új függőség, a felelős tudta nélkül.
Igenis figyelni kell, hogy ne kerüljön bevezetésre egy sokadik XML
parser. Remélhetőleg a pom.xml a projekt életciklusa során keveset
változik.

## Konvenciók

Ha már a Maven alapelve a konvenciók használata, próbáljunk meg mi is
alkalmazkodni ehhez több szinten is, vezessünk be projekt konvenciókat.
Ilyen pl. a projektek elnevezési konvenciója (javasolt kisbetűkkel,
szavakat kötőjellel elválasztva írni), verziószám konvenciók, stb.

## Build reprodukálhatóság

Lehetőleg törekedjünk arra, hogy nem előkészített környezetben,
notebook-on, otthon is fusson le a build. Ne legyen szükség külső
függőségekre, speciális könyvtárakra, adatbázis szerverre, stb.
Lehetőleg csak a céges repository manager elérésével bárhol le tudjuk
futtatni a build-et. A Sonatype könyv organizational portability-nek
hívja azt, amikor egy cég belső hálóján lévő bármilyen gépen azonnal le
tudjuk futtatni a build-et.

Olvastam olyan ötletről is, hogy a Maven-t se kelljen egyénileg
feltelepíteni, és a repository se foglalja mindenki gépén a helyet, egy
megosztott meghajtóra lehet ezeket tenni, és mindenki onnan
használhatja. A repository helye alapértelmezésben a home könyvtárunk
alatt a /.m2/repository könyvtár. Ez sok esetben nem megfelelő, pl.
ékezet, space van benne, vagy pl. szerverrel szinkronizált, központilag
mentett, vagy egyszerűen nem szeretnénk a rendszer partíciónkon tárolni
ezeket. A lokális repository új helyét a settings.xml-ben a
localRepository tag-ek között adhatjuk meg.

Ügyeljünk arra, hogy lehetőleg környezetenként (fejlesztői/teszt/éles)
ugyanazokat az artifact-okat használjuk. Minden környezet függő
információt az alkalmazáson kívül tároljuk, konfigurációs állományokban,
JNDI-ben, adatbázisban. Így ugyanazt az állományt telepíthetjük minden
környezetbe.

## Repository manager és CI

Mindig használjunk repository manager-t. Egyrészt proxy a publikus
repository-k felé, másrészt a saját artifact-jainkat is tartalmazza, ami
nélkülözhetetlen több modulból álló projektek esetén. Ide tölthetjük fel
az egyéb forrásból származó 3rd party jar-okat is.

Bár nem ide tartozik szorosan, használjunk Continuous Integration
eszközt is, mely egyrészt segít az integráció idejének csökkentésében
azáltal, hogy gyakori időközönként build-el, és lefuttatja a teszt
eseteket, így a problémákról mielőbb értesítést kapunk, nem csak akkor
mikor mi is elvégeznénk az integrációt. Valamint különösen alkalmas
arra, hogy ellenőrizzük, hogy nem csak egy beállított környezetben fut a
projekt, egy fejlesztői gépen, hanem egy független build szerveren is.

## Magas szintű pom.xml-ek

Bizonyos konfigurációkat szervezet szinten (corporate), vagy projekt
szinten definiáljuk egy szülő pom.xml-ben. A gyermek projektek ebből
öröklik a beállítások, melyek leíró információk pl. a szervezettel,
projekttel, fejlesztőkkel kapcsolatban. Tartalmazhatja a
distributionManagement szekciót, mely a repository manager elérhetőségét
írja le (ne a konkrét projekteknél definiáljuk). Valamint tartalmazhatja
a plugin konfigurációkat, azok verziószámát (lásd később, a "Függőségek"
fejezetben).

## Függőségek

Mindig tartsuk rendben a függőségeinket. Lehetőleg publikus
repository-ban található 3rd party library-ből építkezzünk (, ebben
segíthet a [Version Maven
Plugin](http://mojo.codehaus.org/versions-maven-plugin/)). Amennyiben
van nem ilyen is, tüntessük fel annak a forrását, amennyiben van
forráskódjának, dokumentációjának elérhetőségét. Vigyázzunk, ugyanannak
a library-nak ne szerepeljenek különböző verziója függőségben. Ez akkor
lehet, ha pl. egy artifact-et egyik verzióról a másikra át is neveztek,
vagy pl. groupId-t váltottak. Figyeljünk a library-k megfelelő
scope-jára. Lehetnek olyan jar-ok, melyek csak teszteléskor kellenek
(test), illetve olyanok, melyeket nem kell az artifact-unkba csomagolni,
az alkalmazásszerver biztosítja ezeket (provided). A moduljaink között
ne legyen körkörös hivatkozás. A függőségek definiálásánál ne
használjunk intervallumokat, adjuk meg a pontos verziószámokat.
Amennyiben egy függőséghez több artifact is tartozik, pl. Hibernate,
Spring sok modulból áll, akkor javasolt a verziószámot egy külön
property-be kiemelni, és az összes modulban arra hivatkozni (pl.
\${spring.version}).

A függőségeinket tartsuk karban. Ne engedjük őket elburjánzani (lsd.
"Felelős" fejezet). Futtassuk a dependency:analyze goal-t, feltárva
ezzel a deklarált, de nem használt függőségeket (töröljük), valamint a
használt, de nem deklarált függőségeket. Ez utóbbi akkor jelentkezhet,
ha egy függőségre csak tranzitív függőség van, és mégis használjuk az
osztályait. Ekkor javítsuk direkt függőségre.

Plugin-ek esetén is mindig deklaráljuk a verziószámot, szülő projekt
létezése esetén annak pluginManagement szekciójában, hiszen az
öröklődik, ahogy egy régebbi
[posztban](/2011/08/04/maven-plugin-ek-verzioszama.html) írtam.

Amennyiben ugyanazt a függőséget több modul is használja, érdemes a
szülő projektben felsorolni a függőségek verziószámát, és exclude
tag-eket a dependencyManagement szekcióban, melyet a gyermek projektek
örökölnek, így azokban elegendő csak a groupId-t és artifactId-t
deklarálni.

Amikor egy problémát meg akarunk oldani, és van egy bevált receptünk, és
erre több 3rd party library-t is mozgósítunk, és mindig ugyanazokat,
akkor szervezzük ki a függőségeket egy külön projektbe (dependency
group), így elég erre az egyre függőséget definiálni, ami tranzitíven
berántja a többi függőséget is. Ez ellentmondhat annak a szabálynak,
hogy amit közvetlenül használunk, azt mindig direkt függőségben
deklaráljuk. Ez utóbbit tartsuk be inkább.

Nem csak Java osztályokat, hanem közösen használt erőforrásokat, pl.
képeket, stíluslapokat, stb. is kiszervezhetünk külön projektbe. Vagy
akár plugin konfigurációkat is, pl. checkstyle, pmd konfigurációkat is,
ha különböző projekteken ugyanúgy akarjuk ezeket használni. A Maven
dependency pluginnel sok csodát meg lehet csinálni.

## Prototípus

Kicsit furcsa lehet, hogy a projektek közötti szülő-gyermek kapcsolat,
és a modul-almodul kapcsolat két külön fogalom. A szülő-gyermek
kapcsolat estén a gyermekben definiáljuk a szülőt, a parent tag-ek
között. A gyermek ekkor örökölni fogja a szülő beállításait (lsd. még
effective pom). A szülő nem tud a gyermek projektjeiről. Míg egy modul a
modules tag-ek között felsorolhatja az almoduljait. Ez által megeshet az
a furcsa eset is, hogy egy almodult olyan modul tartalmaz, mely az
almodulnak nem szülő projektje. Nézzünk erre egy példát. Van több
projektünk, mely nagyon hasonló egymáshoz, mind egy Java EE alkalmazás,
melynek kimenete egy EAR. Mindegyik projekt több alprojektből áll, külön
az EJB réteg, külön a web réteg, stb. Az ejb és web rétegek azonban
nagyon hasonlítanak egymáshoz. Ezért, hogy a copy-paste-et elkerüljük, a
közös dolgokat kiemeljük egy szülő projektbe, külön az ejb rétegeknek
egy, külön a web rétegeknek egy. Ezeket a projekteket hívják prototípus
projekteknek.

![Prototype projekt](/artifacts/posts/2011-09-27-maven-legjobb-gyakorlatok/maven_prototype_b.png)

## Archetype

Ha gyakran kezdünk új projektet, vagy egy létező rendszerbe új modult,
akkor lehetőség van archetype deklarálására. Ez tulajdonképpen egy
projekt sablon, amiből ki lehet indulni. Így nem úgy kezdünk egy új
projektet, hogy veszünk egy létezőt, és lebutítjuk, hanem már egy
sablonból. Vannak előregyártott archetype-ok is, pl. egyszerű Java
alkalmazás, egyszerű web alkalmazás, Maven plugin, Confluence plugin,
NetBeans modul, stb. Vagy pl. nézhetjük [Matt
Raible](http://raibledesigns.com/) tevékenységét is, az
[AppFuse-t](http://appfuse.org/display/APF/Home) is, mely előre gyártott
projekt sablonok, melyek különböző technológiák integrálásával (Spring,
JSF, Struts 2, Spring MVC, Stripes, Tapestry 5, Wicket, JPA, stb.)
jöttek létre. Ezek kis példa alkalmazások, melyek önmagukban is
működnek, nem nekünk kell konfigurálgatni, integrálgatni, jó kiinduló
alapot biztosítanak. Be kell vallanom, én annyira nem hiszek az
archetype-okban, mert mire új projektet kellett indítani, mindig
változott valamelyest a technológia, más keretrendszereket használtunk,
más megközelítésmódot alkalmaztunk. Ezeknek tényleg inkább
alkalmazásgyáraknál van jelentősége.

## Assembly

Az assembly plugin használatának minden könyv külön fejezetet szentel.
Arra használható, hogy gyakorlatilag bármilyen artifact-ot elő tudunk
vele állítani, attól függően, hogy hogyan szeretnénk terjeszteni az
alkalmazásunkat. Vannak [előre
beépített](http://maven.apache.org/plugins/maven-assembly-plugin/descriptor-refs.html)
struktúrák (ezek közül van, ami csak a binárist tartalmazza, a binárist
tartalmazza a függőségekkel, csak a forrást tartalmazza, teljes
projektet tartalmazza), de természetesen sajátot is tudunk gyártani.

## Verziókezelő struktúra

Bár nem így kéne lennie, egy kicsit kényszerpályán vagyunk azzal
kapcsolatban, hogy hogyan szervezzük a verziókezelőben a projektjeinket,
Subversion esetén trunk-ot, tag-eket, branch-eket, stb. Erről már írtam
egy korábbi [posztban](/2010/10/24/release-mavennel-es-hudsonnel.html).
Egyszerű szabály, hogy a projekt neve és a könyvtár neve egyezzen meg.
Nagyon tervezzük meg, dokumentáljuk, és teszteljük a választott
struktúrát, különösen a release folyamat esetén.

## Teszt, release és deployment

A unit tesztek lefutása legyen gyors. Amennyiben integrációs teszteket
is alkalmazunk, nyugodtan nyissunk neki külön projektet. Gyorsabb lesz
tőle a build folyamat, és megfelelően szeparálva lesz a unit tesztektől.

Használjuk a Maven release plugin-t, egy release elkészítésére. Egy
release egy végleges, megváltoztathatatlan artifact, mely könnyen
azonosítható, bármikor később reprodukálható. (Szemben a snapshot
verzióval, mely egy folyamatosan változó, fejlesztés alatt lévő verzió.

A deployment-re is külön projektet érdemes készíteni, mely függőségként
definiálja a telepítendő artifact-ot. Ezt aztán telepítés során letölti
a telepítendő állományt, és telepíti a megfelelő alkalmazásszerverre.
Így nem zavarja a normál fejlesztési munkafolyamatot.

## Nem erőltetném

Természetes, hogy amiket a fentiekben javaslok, azoknak ne használjuk az
ellentétét. Tehát pl. ne használjunk version range-eket, hanem mindig
pontosan deklaráljuk a verziószámokat.

Én nem szeretem a profile-ok használatát sem, amennyiben lehetőség van
rá, kerülöm őket. Konkrétan ott szoktam alkalmazni, ahol gyorsítják a
fejlesztés - telepítés - tesztelés folyamatot. Pl. fejlesztés közben nem
érdemes a war-t összecsomagolni, ha az alkalmazásszerver a kibontottat
is (exploded war, in place deployment) fel tudja olvasni (persze
release-kor meg a fájl kell), vagy release-kor más artifact-ot is elő
kell állítani (pl olyan jar állományt, melyben bele vannak csomagolva a
függőségek). Ezeket fejlesztés közben nem akarom előállítani.

Csakis a legvégső esetben folyamodnék ahhoz, hogy saját Maven plugin-t
fejlesszek. Szerencsére erre még nem volt szükség, mindig találtam
olyat, mely megfelelő volt az igényeimnek.

Ti használtok Maven-t? Mennyi energiát fektettek a pom struktúra
kidolgozásába, szinten tartásába, tökéletesítésébe? Segít, vagy
hátráltat? Kedvelt eszköz, vagy a szükséges rossz? Tapasztalatok
alternatív eszközökkel?
