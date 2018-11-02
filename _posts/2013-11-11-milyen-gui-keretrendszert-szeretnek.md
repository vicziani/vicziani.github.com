---
layout: post
title: Milyen GUI keretrendszert szeretnék?
date: '2013-11-11T00:20:00.000+01:00'
author: István Viczián
tags:
- web framework
- user interface
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Egy [Twitter
twittben](https://twitter.com/vicziani/status/398190693123768320)
elindított gondolatmenetnek szeretnék most a végére járni. Alapvetően a
Java nyelvet nem tartom alkalmasnak arra, hogy üzleti alkalmazások
grafikus felületét fejlesszünk vele. De akkor mi lehet a megfelelő
technológia? Sok cikk hasonlítja össze a jelenlegi keretrendszereket,
kihangsúlyozva azok erősségeit. Ezek közül a legjobbak közé tartozik a
JRebelt gyártó [RebelLabs
cikke](http://zeroturnaround.com/rebellabs/the-curious-coders-java-web-frameworks-comparison-spring-mvc-grails-vaadin-gwt-wicket-play-struts-and-jsf/),
valamint Matt Raible [sorozatosan ad
ki](http://raibledesigns.com/rd/page/publications) ilyen cikkeket és
prezentációkat, és Martin Fowler cégének, a ThoughtWorks-nek a [Tech
Radarja](https://www.thoughtworks.com/radar) is jó olvasmány. Én most
megpróbálok a jelenlegi technológiai megszorításoktól elszakadni, és
kifejteni, hogy milyen legyen egy jó GUI keretrendszer, és a most
létezők miért nem azok. Figyelem, a következő bekezdések a nyugalom
megzavarására alkalmasak, nem mély szakmai jellegűek, és erősen
szubjektív véleményemet tükrözik a témával kapcsolatban. Egyfajta
referenciának is készíteném, mert sokakkal beszélgetek erről, és nincs
mindig idő kifejteni. Így most megteszem itt. Vigyázat, gigaposzt.
Természetesen tévedéseket is tartalmazhat, a helyreigazításokat szívesen
várom a hozzászólások között.

Először is definiálni kell, hogy mit tartok GUI keretrendszernek. Egy
olyan szoftver köztes réteget, mely a programozók számára egy API-t
biztosít, hogy annak használatával hatékonyan képesek legyenek
konzisztens felhasználói felületeket összeállítani. Jelen posztomban
kizárólag üzleti alkalmazások grafikus felületére szeretnék
koncentrálni, és nem általános célú alkalmazásokról írok. Sokan
összekeverik az elvárásokat, és mindenre ugyanazt az eszközt alkalmazni.
Egy intraneten használt bonyolult üzleti folyamatokat lefedő alkalmazást
kis felhasználószámmal sok képernyővel teljesen másképp és más
technológiával kell megvalósítani, mint egy világ összes
internethasználója számára fejlesztett közösségi szolgáltatást. Persze
lehetne egymáshoz közelíteni a kettőt, de az vállalhatatlan plusz
költségekkel járna. Nézzük tehát, hogy mit nevezek jelen posztomban
üzleti alkalmazásnak. Alapvetően kontrollált, számos megszorítással
rendelkező környezetben futó alkalmazásról van szó. Biztos sokan
találkoztatok pl. intranetes banki rendszerekkel (IE6 böngészőkkel), az
ottani szabályokkal, korlátokkal. A felhasználószám nem szükségképpen
nagy, persze egy multi esetén azért elég nagyra nőhet. Akár több száz
képernyőt is tartalmazhat, melyek között vannak hasonlóak. Bonyolult
képernyőket tartalmazhat bonyolult és sok komponenssel, gridekkel,
nagyobb adattömeggel. A fejlesztők nem minden esetben tíz éves
tapasztalattal rendelkező senior fejlesztők, akik képben vannak a
legfrissebb technológiákkal, elég nagy lehet a szórás a csapat
tudásában. Egy idő után sok erőforrás megy el hibajavításra, követésre,
és már nem feltétlenül nyújt technológiai kihívásokat. Alapvetően egyedi
fejlesztésekre gondolok, a dobozos termékekkel kapcsolatban megint mások
lehetnek az elvárások.

Mi az, ami nem jellemző rá? Ezért meg fogtok kövezni, de nem akkora
elvárás a válaszidő, ami ha 300 ms felett van, a felhasználó el fog
klikkelni. Persze az egész rendszer megítéléséhez hozzájárul, de nem
fogtok annyi erőforrást az optimalizálásra költeni, máshol vannak a
súlyok. Az ügyfél is elégedettebb, ha egy használhatóbb vagy egy új
üzleti funkcionalitást kap, mintha ezredmásodperceket optimalizáltok.
Nagyrészt nem kell platformfüggetlennek lennie kliens oldalon. Gondolok
itt nem csak az operációs rendszerre, futtató környezetre, hanem magára
az eszközre is, tablet és mobil nem elvárás. (Ebbe nem megyek bele,
külön posztot érne, de nem hiszek az újrafelhasználható felületekben, és
mindkét típusú eszközt kiszolgálni képes technológiákban üzleti
alkalmazások esetén. Az Atlassian-os Rich Manalang sokat emlegetett
[Modern Principles in Web
Development](https://www.atlassian.com/blog/archives/modern-principles-in-web-development)
cikke itt nem áll.)

Eddig szándékosan kerültem a webes keretrendszer megnevezést. Ugyanis
üzleti alkalmazások fejlesztésére alkalmatlannak tartom a webet.
Emlékezzetek vissza, a HTML egy hipertext dokumentum leíró nyelv. A HTTP
egy szöveges, állapotmentes kérés-válasz alapú protokoll. Mennyi és
mennyi probléma származik abból, hogy erre a modellre akarunk
alkalmazásokat ráerőltetni. Vegyük sorra.

-   Platformfüggetlenség - bár ez üzleti alkalmazások fejlesztésénél nem
    probléma, hiszen sok helyen láttam, hogy csak egy böngészőn kellett
    mennie. De láttam már olyant is, hogy a header-öket nem megfelelően
    értelmező tűzfal, azaz köztes aktív elem okozta a problémát, milyen
    jó is, hogy a protokoll elemezhető.
-   Lassabb válaszidő pl. oldal váltásakor, hálózati kommunikáció, oldal
    kliens oldali lerenderelése, latency.
-   Minden erőforrás lekérése új TCP/IP kapcsolat. Vagy problémák a
    keep-alive beállításokkal. Ezek mennyire terhelik a szerver oldalt?
    Egy host-ra csak párhuzamosan hány kérést lehet indítani?
-   Egy ideig nem lehetett oldalváltás nélkül a szerverrel kommunikálni.
-   Böngésző korlátjai. Találkoztatok már olyan ügyféllel, aki levetette
    volna a címsort, a vissza gombot? Aki funkcióbillentyűket akart?
-   Szerver oldali üzenetküldés, vagy akár a kliensek közötti
    kommunikáció, broadcast üzenetek.
-   Dátumbeviteli komponens, maszkolt mezők, gridek.
-   CSS-ben változók, mixinek, kifejezések.

Vannak ezekre megoldások? Vannak. De nem konzisztensek, nem teljes
körűek, nem érzem, hogy a technológia szerves részét adnák. Csupán
workarundok, régi protokollok, formátumok visszafele kompatibilitást
megőrizendő tákolásai.

Rugaszkodjunk el a földtől, és nézzük, mik lennének az elvárásaim egy
képzeletbeli GUI keretrendszerrel kapcsolatban.

-   Technológiailag jó iránynak tartom az interfészt leíró nyelv, a
    megjelenést és a logikát hordozó nyelv különválasztását. Pl.
    HTML+CSS/JavaScript, MXML+CSS/ActionScript, FXML+CSS/Java. Nagyon
    alkalmas interfész fejlesztésre az event-ek használata, és a
    (lehetőleg kétirányú) bind.
-   A dinamikus nyelv legyen, minden földi jóval, különösen lambda
    függvényekkel. Leírhatatlan ebben a környezetben egy Python vagy
    Groovy előnye, de akár JavaScript vagy ActionScript.
-   Tesztelhető legyen (unit és integrációs), az eszközöket maga a
    keretrendszer adja.
-   Ne akarja rám erőltetni a teljes stacket. Van egy jól bevált Java
    üzleti és perzisztens rétegem, akár Spring, akár EJB vonalon. A Java
    nyelv oo mivolta, platformfüggetlensége, biztonsága miatt erre a
    legalkalmasabb. Rengeteg Java fejlesztő van. Hiszek a backend által
    nyújtott szépen megfogalmazott, akár RESTful API-ban.
-   A módosítást azonnal ki tudjam próbálni. Lehetőleg úgy, hogy az
    adott képernyőről se kelljen elnavigálnom. Valljuk be, Java
    fejlesztőként van annak egy varázsa, mikor a böngészőben frissítést
    nyomva tesztelhetem a funkciót. (Az sem baj, ha már az első indítás
    is gyors.)
-   Adjon nekem architektúrát, ami egységes, kompakt legyen. Egy
    technológiát kelljen megtanulnom. Ne nekem összelegóznom, ne csak a
    lehetőséget adja, hanem best practice-eket. Mondja meg, hogy ha MVC,
    akkor hogyan kell a rétegeket megírnom. Sajnos a Java világban az
    MVC egyeduralkodó, de vizsgáljuk meg az MVVM (Model-View-ViewModel)
    és MVP (Model-View-Presenter) irányokat is. Ezáltal meg is
    akadályozza az elbonyolítást.
-   Convention over configuration. Egyszerűen, alapbeállításokkal
    működjön, de személyre szabhassam. Ne kelljen felesleges,
    technológiához kötődő kódot írni.
-   Beépítetten tartalmazzon támogatást a modularizációra.
-   Komponensekből tudjak építkezni. Saját komponenseket tudjak írni. Ez
    azért is nagyon fontos, mert láttam sok fejlesztőt, aki az adott
    keretrendszerekből ugyan nem sokat értettek, de egy minta alapján
    bármennyi képernyőt össze tudtak rakni. Igen, ezt a módot is
    támogatnia kell, a 150. képernyőt már nem az architect fogja
    elkészíteni. Komponens fejlesztésnél akár én akarom a vonalakat
    megrajzolni, natívan. Ezeket a komponenseket akár külső forrásból is
    be tudjam szerezni, vagy sajátomat terjeszteni.
-   Magas szintű komponensek. Dátumbeviteli mezők. Gridek. Erre külön
    kitérnék, ez sokszor előjött. Rendezhető (több oszlop szerint),
    lapozható, szerkeszthető. Követi az ablak, vagy a befoglaló panel
    átméretezéseit. Görgetés közben dinamikusan legyen képes adatokat
    letölteni. Oszlopokat át lehessen rendezni, méretezni.
    Szerkesztéskor a cellákban különböző beviteli komponensek
    jelenhessenek meg. Ne csak szöveget legyen képes megjeleníteni.
-   Legyen egyszerű, könnyen tanulható. Könnyen lehet demó
    alkalmazásokat összerakni, prototyping. Mélyebben megismerni csak a
    haladó funkciók eléréséhez kelljen. És mivel a backend Java, a Java
    fejlesztéshez közel álljon. Itt egy szintén külön posztot érdemlő
    téma. Legyen-e külön backend és frontend fejlesztő, vagy sem? Én
    jelen pillanatban amellett teszem le a voksom, ugyanaz a fejlesztő
    értsen a backendhez és a frontendhez is, nyilván nem olyan mélyen.
-   Szégyelem ezt a szót leírni, de szexinek kell lennie. A
    fejlesztőknek szeretniük kell. Ez csak akkor valósul meg, ha pörög,
    ha van mögötte hype, ha jól mutat az önéletrajzban. Ez sok helyen
    materializálódik: fejlesztők száma, állásajánlatok száma, LinkedIn,
    levlista, issue tracker, könyvek, tutorialok, blog posztok,
    release-ek száma, Stack Overflow.
-   Jól nézzen ki. A honlapja is.
-   Jó fejlesztőeszköz támogatás, WYSIWYG szerkesztő. Emlékezzünk vissza
    a Delphi-re, meg lehetett azt csinálni normálisan. A JDeveloper, a
    NetBeans is viszonylag emészthető Swing kódot generált, ha
    odafigyeltünk pár alapszabályra a szerkesztéskor. Én ezekkel
    szerettem dolgozni, jobban, mint XML-ben rakni össze a teljes GUI-t.
    Persze a kettő között váltogatni lehessen, és szinkronizáljon.
-   Adja meg a projektstruktúrát, mit hova kell tennem. Legyen standard
    csomagolása, támogassák a build rendszerek, lehetőleg egy fájlba,
    egy artifactként össze lehessen állítani.
-   Nyílt forráskód.

Sajnos azt nem írhatom hozzá, hogy legyen jövőképe, jövője. Ahol az
Adobe egyik pillanatról a másikra úgy dönt, hogy kihátrál a Flex mögül
és az Apache-nak adja, abban a környezetben, ahol az Oracle egyik
pillanatról a másikra megszünteti a GlassFish támogatását, vagy a
JavaFX-ből kidobja a Java FX Script-et és a mobil támogatást. Ahol a
keretrendszerek platform támogatásait megszüntetik, nem lehet biztos
jövőről beszélni. Technológiától függetlenül, ha nem hoz elegendő
bevételt, halálra van ítélve.

Mit szeretnék? Valaki merjen nagyot álmodni, és elfelejteni azt a
posványt, amiben most vagyunk, és életre kelteni egy ilyen
keretrendszert. Sok cégnek lenne rá erőforrása, Google nyithatna ebbe az
irányba, Adobe, Oracle, SpringSource, JetBrains, stb. A piaci rés adott,
csak ki kéne használni.

No és akkor jöjjön a feketeleves. Vigyázat, sarkítok! Kezdjük a
legnagyobb hypeként kezelt HTML5, CSS3, JavaScript kombinációt. Mikor
lett a HTML 5 szabvány? Mennyi idő kellett a HTML 4-nek, hogy teljes
körűen és ugyanúgy támogassák a böngészők? A technológiai korlátokat már
kifejtettem. Érdekes, hogy a HTML-hez képtelenek voltak egy széles
körben elterjedt, használható WYSIWYG editort írni. A platform
töredezettségét nagyon jól jellemzi a [TodoMVC](http://todomvc.com/),
ami ettől függetlenül egy hatalmas ötlet. Ugyanaz az alkalmazás megírva
a legtöbb keretrendszerben. A legtöbb MV\* keretrendszer azonban egy
személetet ad, nem ad teljes megoldást. Van, amelyikre még visszatérek.

Szabványok terén a Java világban mindenképp a JSF technológia az, amit
meg kell említeni. Persze nem önmagába, de valami komponens könyvtárral,
pl. ICEFaces, PrimeFaces, RichFaces, stb. Ez a klasszikus szerver
oldalon kigeneráljuk a HTML tartalmat megközelítés (hívjuk egyszerűen
server side renderingnek). Ezzel kapcsolatban [érdekes kijelentést
tett](https://blog.twitter.com/engineering/en_us/a/2012/improving-performance-on-twittercom.html)
a Twitter, a modernebb kliens oldali JavaScript helyett átállt server
side renderingre, és jelentős sebességjavulást ért el. A JSF hátrányai a
Java nyelvből erednek. A deploy fájdalmasabb folyamat, ugyanis az
alkalmazásszerverek nem képesek újraolvasni csak a módosított
class-okat, az egész alkalmazást kell, jobb esetben exploded formában.
Ugyan a már említett fizetős JRebel képes arra, hogy alkalmazás deploy
nélkül lehessen kitenni a változott class fájlokat. A Java és a Facelet
nyelv nehézsége lehet gátló tényező, a viszonylag bonyolult architektúra
(komoly állapotátmenetekkel rendelkezik), és a view hierarchia kliens és
szerver oldalon történő tárolása, ezek közötti szinkronizáció
keserítheti el az embert. Jó azonban a komponensszemlélet.

Most haladjunk gyártónként. A Google-nek ugyan nem ez a profilja az
üzleti alkalmazások fejlesztésének kiszolgálása, de az ott összejött
szürkeállomány miatt kell megemlíteni. Ne nyelvet fejlesszen, mint a Go,
vagy a Dart. Felejtsék el HTTP, HTML+CSS, JavaScript kötöttségeket,
aminek workaroundjára jött létre a GWT. Ennek már a koncepciójával sem
tudtam egyet érteni. Java-ban kell fejleszteni, melyet átfordít
JavaScriptre. Ez nálam ott bukik el, hogy a JavaScript egy alkalmasabb
nyelv GUI fejlesztésre. Azon Java imádók miatt fejlesztették ki, akik
nem voltak hajlandóak megtanulni a JavaScript-et. Ráadásul a fejlesztés
sem a legkényelmesebb az átfordítás szükségszerűsége miatt. Bár nem a
Google terméke, ide sorolom a Vaadin-t is, hiszen GWT-re épül. Az
látszik, hogy már a GWT mögül is sokan kihátrálnak a Google-nél, és
mozdulnak az AngularJS felé. Az számomra még mindig kevés, nem komplett
megoldást ad.

Az Adobe-nak is nagy tapasztalata van, de a zárt Flash mindig
ellenérzést fog kiváltani. Sajnos azon Apple vezetője tette tönkre
közvetve a Flex-et, amely még a legelvakultabb követői szerint sem ért a
webhez, szemben az Adobe-val. A Flex alapjában véve egy [jó konstrukció
volt](/2013/02/02/az-apache-flex-multja-jelene-jovoje.html), de az Adobe
kihátrálása tönkretette. Várok még a feltámadásában, de sajnos ennek
esélye egyre kevesebb. Sajnos a közösség is rossz irányba tart,
felesleges erőforrásokat ölnek abba, hogy JavaScript legyen képes
futtatni. Komponensei jók, de félbemaradt a MX-es komponensekről a
Spark-os komponensekre való átállás, és sok komponense bugos, ez
megkeseríti az ember mindennapjait. Nagy hátránya még a fordító lassú
sebessége, Javaban implementált ugyan, de ez még nem mentség. Sajnos a
Java ekoszisztémába sem illeszkedik nagyon, a Flexmojo Maven plugin
körül is vannak problémák, az artifactok repositoryba töltésével is, és
tapasztalatom szerint a GradleFX Gradle plugin sincs a helyzet
magaslatán. De a legnagyobb probléma, hogy megszűnt a közösség, az
eszköztámogatás. Pedig még az Adobe is ad hozzá fejlesztőeszközt.

A SpringSource nagyon jó irányban lépeget előre, egyrészt a Groovy a
lehető legjobb irány, a komponens alapú szemlélet kiváló (Framework,
Security, Data, Batch, HATEOAS, stb. mind külön-külön), a Grails már a
web megkötéseit hurcolja magával, és sajnos rám akarja kényszeríteni
magát üzleti logika és perzisztens szinten is. Viszont a generálós RAD
irányt el kéne felejteni (Spring Roo). Persze ott a Spring MVC is, mely
gyakorlatilag a HTTP Request és Response-okat kezelő MVC framework.
(Mellesleg a Grails is erre épül.) Nyoma sincs a komponenseknek, e mellé
bőven be kell rakni a teljes HTML, CSS, JavaScript keretrendszer
stack-et, önállóan nagyon kevés. Alapvetően a server side rendering
iskola híve, így még egy template renszert is mellé kell tenni,
tipikusan JSP. Itt említeném meg a Struts 2-őt is, ami nagyon hasonló.
Lelkesek ugyan, régi motorosok, összeolvadtak a WebWork
keretrendszerrel, de sajnos eljárt felettük az idő.

Az Oracle jól nyomja a JavaFX-et, de gyerekcipőben jár. Furcsa mód pl.
nyomják az ARM irányt is, ahelyett, hogy a fizetés vállalati ügyfelekre
koncentrálnának. Sajnos még fejlődő, nagyon ingoványos terület, mindig
lehet változásra számítani. A hivatalos példák nekem elsőre leültették a
gépemet, másodjára megnézve pl. már a fa komponensben is ugrálnak az
elemek a különböző ágakat lenyitva. Nem a professzionalitás látszatát
kelti. A JRE előfeltétele vállalati környezetben annyira nem fájó.
Emellett nyomja az JPA/EJB/JSF technológiákra épülő, azokat tökéletesen
integráló és kiegészítő ADF technológiáját, hátrányai is megegyeznek a
JSF-fel. Itt említeném meg a JBoss SeamFrameworköt is, pont ugyanezen
megközelítést alkalmazza.

Versenyben marad még a hype-olt Play Framework, amiben egyre erősebben
dominál a Scala, ezért vegyes fejlesztőgárdával nem mernék nekimenni.
Régebbi versenyző a Wicket, gyönyörű komponens modelljével, de a Java és
a server side rendering minden hátrányával.

Akarok-e beszélni a vastag kliensről? Mindenképp. Már emlegettem a
Delphit, hogy milyen jó emlékek fűződnek hozzá. Grafikus tervezője
egyedülálló, és az, hogy szinte azonnal indult, feledhetetlen élmény. A
Swinggel sem voltak rossz tapasztalataim, de hát Java, nincs
különválasztva a leíró nyelv. MVC, eseménykezelés nem rossz. Sajnos a
komponensei igen bugosak, és halott technológia, az energiákat inkább a
JavaFX-be ölik. Aztán ott van a NetBeans Platform, és az Eclipse RCP,
melyek bármelyik fentebb felsorolthoz képest pilótavizsgás.

"Ó, mondd, te kit választanál?" Amíg lehet, egyelőre megfigyelő
státuszban maradnék. Ha azonban a döntést nem lehetne tovább halogatni,
két irányt vizsgálnék meg. Az első a Grails frontend Java backenddel. A
választás a Groovy nyelv, és a körülötte lévő nagy mozgolódás miatt. A
második a komplex JavaScript keretrendszerek, melyek teljes támogatást
nyújtanak, és nem csak egy-egy részproblémát oldanak meg. Ilyen a Dojo,
Kendo UI, Ext.js. A HTML 5, CSS 3, JavaScript irány megkerülhetetlen, de
egységes GUI keretrendszert szeretnék, és nem darabokból szeretném
összeállítani. Képzeljünk el egy gyakori, de teljesen differenciált
összeállítást, ahol a server side rendering webes keretrendszer a Spring
MVC, JSP és JSTL view réteggel, ahol a CSS LESS-el kerül előállításra,
Bootstrap kiindulási alap, RequireJS module loader, jQuery és AngularJS
MVC JavaScript framework, összeturkált komponensek, build folyamatba
Wro4j beépítve. El tudok képzelni projektet, ahol megfelelő lehet, de az
nem a fentebb vázolt jellemzőkkel rendelkezik.

Ha idáig eljutottál, már ne hagyd comment nélkül.
