---
layout: post
title: Vastag kliens Javaban? NetBeans Platform
date: '2011-07-02T20:22:00.006+02:00'
author: István Viczián
tags:
- open source
- IDE
- Swing
- könyv
- NetBeans
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Technológiák: NetBeans Platform 7.0 - Rich-Client Platform (RCP)

Az előző két poszt kellően megmozgatta a fantáziátokat, egy-két
hozzászólásból nagyon sokat tanultam, most megpróbálok ismét egy kellően
provokatív témát felvetni, a vastag kliens fejlesztésről általában, és
speciálisan Java környezetben. Ne fogjátok vissza magatokat, várom a
véleményeiteket.

Egy projekt úgy hozta, hogy vastag klienses alkalmazást kell
fejleszteni. Igazából mi döntöttünk, hogy az alkalmazást vastag
kliensként fejlesztjük le, ilyen szempontból nem volt megkötés, a
követelmények elemzésekor azonban mégis oda jutottunk, hogy így járunk a
legjobban.

Nagyon sok embernek említettem, és majdnem mindannyian kérdően néztek
rám, és láttam, hogy nem értették. A legjobban az zavar, hogy
megemlítettem, hogy vastag kliens alkalmazást fejlesztünk, és bármi
egyéb információ nélkül azonnal rávágta, hogy miért. Volt, aki azonnal
elkezdte kifejteni, hogy a GWT (ide bármilyen kedvenc keretrendszer neve
beilleszthető) mennyivel jobb, mint a vastag kliens alkalmazás
fejlesztése.

Vajon miért ez az ellenszenv? Miért vált ilyen divatossá a webes
fejlesztés? De ami a legsúlyosabb kérdés, mindenáron ragaszkodni kell a
webes megközelítéshez? Hogy nem is érdekel, hogy miről szól a projekt,
nem is érdekel, hogy mik a követelmények, azonnal véleményt formálok, és
megpróbálom lebeszélni a fejlesztőket a vastag kliensről? Azokat a
fejlesztőket, akik hónapokat gondolkodtak ezen, pilotokat dolgoztak ki,
körültekintően próbálták és hasonlították össze a technológiákat?

Véleményem szerint a vastag kliens fejlesztésének még mindig megvan a
létjogosultsága. Kinek jutna eszébe fejlesztőeszközt webeset használni?
(Na jó, vannak elvetemültek, április témaként is megjelent, hogy az
Eclipse-nek elkészítik a webes verzióját, és félek, vannak, akik meg is
tennék.) Egy 3D modellező eszköz (pl. Blender), CAD rendszer (AutoCAD),
hatalmas képeket/3d objektumokat feldolgozó orvosi rendszerek, GIS
alkalmazások (térképészet) mind mind csak egy példa arra, hogy a vastag
kliensnek van még alkalmazási területe. (Corel, Photoshop szerű,
valamint videóvágó alkalmazások webes verziói mostanában nagyon mennek,
de azért ezek távol állnak a professzionális megoldásoktól. Persze,
bizonyos felhasználóknak ezek is elegendőek.) Nekünk egy Visio szerű
rajzoló alkalmazást kell fejlesztenünk, bonyolult mögöttes üzleti
logikával.

A vastag kliens kiválasztásában a következő érvek döntöttek. Talán a
döntő érv az volt, hogy pixel pontos grafikai megjelenítést és tervezést
kell megvalósítani, nagyíthatósággal. A telepítési munkálatok nem
problémásak, mivel Intraneten központilag képesek az alkalmazásokat
telepíteni. (A Java Web Start óta viszont amúgy sem bonyolult a Java
alkalmazások telepítése, de tény, hogy a Java Runtime Environment-et
ugyanúgy teríteni kell.) Valamint vastag kliens fejlesztése
eszméletlenül hatékony tud lenni, irgalmatlanul gyorsan lehet a
képernyőket gyártani. (Láttam projektet, melynél az implementáció
felében döntöttek arról, hogy legyen inkább vastag kliens, és az idő
tört része alatt összerakták ugyanazon képernyőket.) Sajnos a http
protokoll, a html formátum, a különböző adatátvitel megoldások, XML,
JSON, AJAX, stb. mind-mind egy plusz probléma, plusz réteg, mellyel
foglalkozni kell, teljesen egyik keretrendszer sem képes ezeket elfedni.
Meggyőződésem, hogy a http formátumot már rég kinőttük, az egészet el
kéne felejteni, és egy újat használni, mely alkalmazás fejlesztésére
sokkal megfelelőbb lenne. A vastag kliens alkalmazásfejlesztés esetén
azonban a képernyőket tényleg WYSIWYG módon össze lehet dobálni (nem is
használunk mockup-okat, drótvázakat, a képernyőket egyből a cél
keretrendszerben állítjuk elő), a régóta bizonyított observer tervezési
minta (, és az ebből továbbfejlődő eseménykezelés, stb.), valamint az
MVC modell is nagyon hatékonyan működik. (Nem véletlen az sem, hogy a
legtöbb tervezési mintára itt lehet szép példákat hozni.) Látszik ez
abból is, hogy az összes webes keretrendszer próbálja ezt alkalmazni,
bár nem sikerülhet nekik, hiszen az alatta lévő http szabvány ezt
majdhogynem ellehetetleníti. Szintén nagyon hatékony a komponensekből
való építkezés is, itt tényleg megvalósítható könnyen az
újrafelhasználás, valamint a személyre szabás is. Ezeknek az elvnek
webes környezetben talán legjobban a JSF próbál megfelelni, de az abban
való fejlesztés sem olyan hatékony, mint a vastag kliens környezetben.
És akkor ne is beszéljünk arról, hogy a fejlesztés mennyivel
kényelmesebb, mennyivel gyorsabbak az iterációk, hiszen nem kell
környezetet felépíteni, nincs szükség alkalmazásszerverre. Egy
bonyolultabb alkalmazásnak is pár másodperc alatt indulni kell. Érdemes
webes projekt után átülni kicsit egy vastag klienses projektbe, sokkal
gördülékenyebb, magától értetődőbb. És nincs szükség annyi technológia,
protokoll, szabvány ismeretére sem.

Persze, vannak hátrányai is. Egyrészt a fentebb említett telepítési
problémák, melyek bizonyos környezetekben egyszerűen kizárják a vastag
klienses alkalmazás használatát. Azért ne legyenek téveszméink, ilyen
problémák webes környezetben is adódhatnak, különböző böngésző
inkompatibilitások, bezavaró plugin-ek, elkonfigurált tűzfalak, stb.
Másik a platformfüggetlenség. Ha Java alapú technológiákat választunk,
akkor ezzel sem lesz annyi problémánk, mint régen, amikor azért tényleg
másképp néztek ki az alkalmazások különböző környezetekben. Amit fel
szoktak hozni érvként, tipikusan a Swing ellen, hogy mivel pehelysúlyú
komponenseket használ (pont az előbb említett platformfüggetlenség
miatt), lassú lehet a megjelenítés, hiszen szoftveresen rajzol, és nem
az operációs rendszer (ablakozó rendszer) beépített komponenseit
használja az egységes megjelenítés érdekében. A JDK utóbbi verzióiban
azonban olyan szintű optimalizációkat hajtottak végre, hogy azért ez már
kevésbé érezhető.

A legnagyobb ellenérzés a Swing-gel kapcsolatban történeti okok miatt
van. Egyrészt igen, tényleg rossz volt, lassú, és kevésbé platform
független. A másik, hogy sokan azt gondolták, hogy minden fajta tudás,
előképzettség nélkül neki lehet ülni benne fejleszteni, akár egy Borland
Delphi alkalmazást. Sok Swing fejlesztőnek fogalma sincs például a Swing
szálkezeléséről. Ez a hozzáállás azonban Swing esetén nem megfelelő.
Ahhoz, hogy jó alkalmazásokat írjunk, igenis magas fokú előképzettség
kell. Meg kell érteni az MVC modellt (annak is speciális válfaját,
hiszen a Swing esetén a kontroller és a nézet össze van nőve), az
eseménykezelést (azok fajtáit), a szálkezelést (EDT - event dispatcher
thread, 6-os Java-ban megjelent SwingWorker), a kirajzolás folyamatát, a
double bufferinget, stb. Ezek hiányában olyan alkalmazások kerülnek ki,
melyek gyakran lefagynak, nem válaszolnak a felhasználónak. És nem
utolsó sorban a leglényegtelenebb, vagy mégis a legfontosabb a
megjelenés. Egyrészt a Swinges komponensek egy időben rettentő rondák
voltak, valamint álláspontom szerint a programozóknak csak kis részét
szabad az interfész tervezéséhez engedni. Swing esetén nincs ez így,
általában a fejlesztők készítik teljes egészében a felhasználói
interfészt. Webes környezetben szerencsére ez hamarabb elvált. Igen, és
ennek eredménye az volt, hogy a Swing-es interfészek egyszerűen rondák
voltak.

A vastag kliens megvalósításakor azonban már nem elegendő a Swing
használata, mely a Java része. Egy ideje nem nagyon fejlesztik, rengeteg
komponens hiányzik belőle, és ennek használatával felépíteni egy
alkalmazást, hatalmas munka. Jelenleg a Java világban két versenyző van,
a [NetBeans Platform](http://netbeans.org/features/platform/), valamint
az [Eclipse Rich Client
Platform](http://wiki.eclipse.org/index.php/Rich_Client_Platform). Amint
valaki szembesül azzal, hogy vastag kliens alkalmazást fejlesztünk,
azonnal arról akar meggyőzni, hogy ezt Eclipse platformon tegyük. Attól
függetlenül, hogy az Eclipse RCP-t ismeri-e vagy sem, csupán arra
alapozva, hogy az ő kedvenc IDE-je az Eclipse.

Úgy látszik, ezen a területen mindig ellenállásba ütközöm, és mindig meg
kell magyaráznom a döntéseimet. És mindenki tud hozzászólni, függetlenül
attól, hogy kizárólag vékony klienses alkalmazásokat fejlesztett.
Like-olj, ha idáig eljutottál, és látsz jövőt a Java alapú vastag kliens
alkalmazás fejlesztésében.

Természetesen összehasonlítottuk a két platformot, és arra jutottunk,
hogy számunkra a NetBeans Platform használata célravezetőbb. Kerestünk
NetBeans Platform fejlesztőt is, és kiderült, hogy sokan nem is ismerik
a NetBeans IDE és a NetBeans API közötti különbséget, sok olyan
életrajzot kaptunk, amiben az volt leírva, hogy fejlesztett
NetBeans-szel. A NetBeans Platform egy keretrendszer vastag klienses
alkalmazások fejlesztésére, melynek egyik alkalmazási módja a NetBeans
IDE, mely egy Java fejlesztőeszköz. De ezen kívül [rengeteg más
alkalmazás](http://platform.netbeans.org/screenshots.html) is létezik
felette. Persze a dolog pikantériája, hogy a Platform is Java-ban
íródott, és NetBeans alkalmazást (valamint plugin-t is) NetBeans IDE-vel
lehet fejleszteni. És most következzenek az érvek, amiért NetBeans
mellett döntöttünk.

-   Fejlesztés szempontjából szerintem mindegy, hogy ki mit választ, egy
    idő után mindkettőben ugyanazt a fejlesztői hatékonyságot el lehet
    érni. Tapasztalatom szerint a Eclipse-szel nagyobb munkával, de
    kényelmesebb környezetet lehet összehozni, mindent a saját, egyéni
    ízlésünkre igazítva. Rengeteg plugin közül válogathatunk. A NetBeans
    ezzel szemben nem ad akkora mozgásteret, de ha kicsit kisebbek az
    igényeink, egy alap telepítéssel mindenhez hozzájuthatunk, nem
    nekünk kell a pluginek között válogatni. Alapban támogatja a
    Maven-t, Subersion-t, Mercurial-t, Tomcat-et, és van benne
    properties fájl szerkesztő (megfelelő automatikus native2ascii
    kódolással), vizuális szerkesztő. Én inkább az előrecsomagolt
    megoldásokat szeretem, minthogy nekem kelljen összerakosgatni, ezért
    a NetBeans ebből a szempontból jobban tetszik, de ez egy szubjektív
    álláspont. A vizuális szerkesztővel nem nagyon lehet vitatkozni, az
    Eclipse-nél nincs ilyen, mely kellően egyszerű, könnyen használható
    és ingyenes lenne, mint a NetBeans Matisse felülete. Hallottam
    projektről, ahol a képernyőket NetBeans-ben szerkesztették, a
    fejlesztést Eclipse-ben végezték.
-   Az Eclipse az SWT könyvtárat használja, mely saját elemeket, saját
    modellt alkalmaz. Ennek szükségességét azzal magyarázza, hogy a
    Swing a pehelysúlyú komponensek miatt lassú, az SWT komponensei
    natív kódrészleteket is tartalmaznak, így különböző operációs
    rendszerekre különböző natív komponenseket is telepíteni kell.
    Egyrészt a modern JVM-eken már nem tapasztalható különbség, érdemes
    összehasonlítani a NetBeans és Eclipse legújabb verzióit (!!!),
    számottevő eltérés nincs. Másrészt a projektben résztvevők nálunk
    masszív Swing tudással rendelkeztek, így felesleges lett volna egy
    újabb technológiát megtanulni, mely nem hoz semmi előnyt.
-   Az Eclipse a modularizációra az OSGi de facto szabványt használja,
    annak az Equinox implementációját. Nemrég [jelent
    meg](http://www.theserverside.com/news/2240037102/OSGi-Not-Easy-Enough-to-Use-Not-as-Productive-as-it-Should-Be)
    egy interjú Rod Johnsonnal (Spring Framework alapítója és vezetője,
    író), melyben azt állítja, hogy az OSGi egyrészt nem elég egyszerű,
    és nem elég produktív. Amire ráláttam projektre, pont ez derült ki,
    hogy ahelyett, hogy ez egy transzparens réteget biztosítana, elég
    sok problémát hoz be. A NetBeans modularizációja sokkal egyszerűbb,
    abszolút fájdalommentesen használható, és épít a Java 6-ban
    bevezetett szabványos JDK 6 ServiceLoader mechanizmusra. Alapjában
    véve elmondható, hogy a NetBeans szabványos, JDK-ban lévő
    megoldásokat próbál alkalmazni, pl. naplózásra is a Java Logging
    API-t. Melyek lehet, hogy nem a legszofisztikáltabb megoldások, de
    kipróbált, és sokak által ismert eszközök. Amúgy aki nem tud
    elszakadni az OSGi-tól, NetBeans-ben is használhatja, erről egy
    [tutorial](http://platform.netbeans.org/tutorials/nbm-osgi-quickstart.html)
    is van.
-   Ezen kívül a NetBeans eszméletlen sok
    [dokumentációval](http://netbeans.org/features/platform/all-docs.html)
    rendelkezik, valamint egy [tíz videóból álló
    sorozat](http://platform.netbeans.org/tutorials/nbm-10-top-apis.html),
    egyenként 30-40 percesek, is bevezet a legfontosabb fogalmakba, mely
    alapján el lehet indulni.

Egy dolog azonban kiderült, ami hátránya a NetBeans Platformnak. Nagyon
nehéz NetBeans Platformos embert találni, Eclipse RCP fejlesztőt talán
egyszerűbb.

Nézzük, hogy mik azok, melyet a NetBeans biztosít a Swing-en felül, mely
megkönnyíti a vastag kliens fejlesztést. Csak az érdekesebbeket emelem
ki, az összeset a [JavaDoc-ban](http://bits.netbeans.org/dev/javadoc/)
lehet megtalálni.

![NetBeans Platform
architektúra](/artifacts/posts/2011-07-02-vastag-kliens-javaban-netbeans/netbeans-platform-architecture.png)

-   Module System API: Modulok kezelése, függőségek (tranzitív is),
    verziózás, automatikus frissítés, életciklus kezelés.
-   Lookup API: komponensek közötti laza kapcsolat megvalósítására.
    Valójában ez egy pehelysúlyú konténer, interfész alapján lehet a
    példányokat előhívni. Lehet a szolgáltatásokat deklaratív módon
    (XML-ben megadva), és programozottan is bejegyezni. Van globális
    tér, és lehet komponensenként is, lokálisan is Lookup-ot használni.
    Dependency injection nincs.
-   Actions API: események definiálására és kezelésére, melyek forrása
    lehet menüpont, billentyűkombináció, toolbar, felugró menü, stb.
-   Window System API, Docking Framework és Tab Control: klasszikus
    ablakozás, ismert mindenkinek, akár NetBeans-t, akár Eclipse-t
    használ.
-   Dialog, Wizard, MultiView: dialógusablakok, varázslók és több
    nézettel rendelkező ablakok definiálására (pl. vizuális és XML
    forrás megjelenítés). Érdekes, hogy amikor ezeket definiálunk, sosem
    ablakokban, hanem panelekben kell gondolkozni. A hozzá tartozó
    ablakot és gombokat a NetBeans Platform köré teszi, és általában ad
    egy callback-et, melyen szabályozni tudjuk az ablak viselkedését,
    pl. az Ok gomb inaktívvá tételét.
-   System Filesystem API, MIME Lookup API, Nodes API és Explorer and
    Property Sheet API, Navigator API: állományok kezelése, valamint
    állományok betöltése és hozzá tartozó modell generálása. A NetBeans
    sok komponense un. Node-okkal dolgozik, melyeket a modell elemeihez
    lehet rendelni. Pl. egy XML állomány esetén a Node-ok az XML tag-ek,
    vagy egy Java forráskód esetén a forráskód részei, mint osztály,
    attribútum, metódus, stb. Ezekből akár egy fa struktúrát is fe lehet
    építeni. Sok komponens ezeket a Node-okat jeleníti meg.
-   Search és Quick Search API: keresések implementálásához.
-   Editor API: szerkesztők implementálásához használható API, mely
    támogatja az IDE-kben ismert funkciókat, mint kódkiegészítés,
    kódszínezés, code folding, kód sablonok, automatikus behúzás, stb.
-   Progress API, Task List API, Output Window, Favorites: olyan UI
    elemekhez való hozzáféréshez, mint progress bar, tennivalók ablak,
    konzol ablak, kedvencek.
-   Options API: beállítások kezelésére.
-   JavaHelp Integration API: szabványos JavaHelp formátumot támogatja a
    NetBeans Platform, ennek integrációjára való ez az API.
-   Print API: nyomtatáshoz.
-   [Visual Library API](http://platform.netbeans.org/graph/): egy
    NetBeans-en kívül is használható API, mely gráfok grafikus
    megjelenítésre szolgál. Widget-eket (különböző grafikus elemek), és
    közöttük lévő Edge-eket (élek) definiál, és jelenít meg egy
    koordináta rendszerben, pixel pontosan. Támogatja a nagyíthatóságot,
    eseménykezelést, képként exportálást, stb.

A Platform ezen kívül támogatja a több nyelvű interfészek fejlesztését
(I18N), Undo/Redo funkcionalitást, aszinkron/háttérfolyamatok
futtatását.

Ami számomra a legérdekesebb volt, nem támogatja a felhasználó által
bevitt adatok egységes ellenőrzését (validáció). Először a klasszikus
megközelítést választottam, hogy hibás érték esetén dialógusablakot kap
a felhasználó. A NetBeans azonban ezt nem támogatja, nagyon macerás a
körbeprogramozása, inkább az a megoldás, hogy a felhasználónak ne
engedjünk hibás értéket bevinni, vagy ha bevitte jelöljük meg, és ne
engedjük el az ablakról. A Maven projekt létrehozásakor vettem észre,
hogyha hibás értéket írtam be egy beviteli mezőbe, a mező más színre
váltott, felkiáltójel ikon jelent meg benne, és alul is kiírásra került
a hibaüzenet, valamint az Ok gomb letiltásra került. A forrásból jöttem
rá, hogy a [Simple Validation
API](http://kenai.com/projects/simplevalidation/pages/Home)-t használja,
melyet NetBeans-en kívül is lehet használni bármilyen Swing-es
alkalmazásban. Ezzel kapcsolatban arra kell nagyon vigyázni, hogy csak
régi verzió letölthető, kizárólag a forrásból (Subversion checkout után)
fordított bináris a használható. Amúgy is gyakran használatos módszer,
hogy hiába vannak nagyon szép és részletes dokumentációk, sok dolgot úgy
lehet a legegyszerűbben kitalálni, hogy keresni kell egy hasonló
funkciót a NetBeans IDE-ben, és annak kell megnézni a forrását.

![Simple Validation
API](/artifacts/posts/2011-07-02-vastag-kliens-javaban-netbeans/simple_validation.png)

A NetBeans Platform támogatja a Maven eszközt, az artifact-ok benne
vannak a saját repository-ban (http://bits.netbeans.org/maven2/), így
standard módon build-elhető, ehhez a [NetBeans Modules
plugin](http://mojo.codehaus.org/nbm-maven-plugin/)-t használja.
Automatikus teszt eseteket is lehet írni, erre is van támogatás, és
ezáltal mi be is kötöttük continuous integration rendszerbe. A
fejlesztés nagyon egyszerű, hiszen sok dolgot varázslóval lehet
létrehozni, és a NetBeans legenerálja nekünk a szükséges konfigurációs
és forrás állományokat (érdemes megnézegetni, pl. Subversion diff-fel,
hogy mit csinál, általában megfelelő, de lehet rajta szépíteni).

A [7.0-ás NetBeans
Platform](http://blogs.oracle.com/geertjan/entry/new_cool_in_netbeans_platform)
újdonsága, hogy a Platform is elkezdi kihasználni a Java 5 újdonságait,
pl. több dolgot (lokalizáció, action-ök, mime type) is meg lehet adni
annotációban, nem kell XML konfigurációs állományban.

Az egyedüli dolog eddig, ami nem tetszik, az a paraméterek átadása
különböző komponensek között. Nem definit, hogy mit, hol és hogyan kell
átadni a következő lehetőségek közül: konstruktor, setter metódus,
valamiféle környezeti objektum, callback, általános Map-ban, valamilyen
Context/Environment objektumban, Lookup-pal, stb. Gyakran előfordul a
tyúk és a tojás esete is, amikor két komponensnek egymásra kell
hivatkoznia, de a másodikat nem adhatom át az első konstruktorának,
hiszen még nem lett példányosítva.

A fejlesztéshez a legnagyobb segítséget a The Definitive Guide to
NetBeans Platform könyv adja. Minden egyes témába csak egy rövidebb
bevezetőt ír, amin el lehet indulni, néhány kódrészlettel. Nem megy bele
mélyen a témákba, erre nincs is szükség, a többi részt már bőven ki
lehet nézni az API-ból, vagy a forráskódból.

![The Definitive Guide to NetBeans
Platform](/artifacts/posts/2011-07-02-vastag-kliens-javaban-netbeans/netbeans_book.png)

Javaslom mindenkinek, hogy akinek lehetősége van, próbáljon részt venni
vastag kliens fejlesztésben is, utána a webes alkalmazásokat is másik
oldalról lehet nézni, hiszen teljesen más problémák jönnek itt elő, ami
ott egyszerű, itt bonyolult, és fordítva. Rengeteg ötletet lehet
meríteni. Valamint a webes programozás után ez egy élmény, akár a
fejlesztés sebességében, akár az elegáns megoldások terén. Azonban ne
várjuk azt, hogy pár óra alatt belerázódunk, itt is van egy elég komoly
felkészülési idő.
