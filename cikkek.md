---
layout: page
title: Cikkek és prezentációk
description: Cikkek és prezentációk
keywords: Java, cikk, RMI, ASP, Servlet, IBM, WebSphere, MQ, Apache, Jakarta, Velocity, OJB, Lucene, Log4J, J2SE 1.5, Tiger, Ant, Kódolási konvenciók, alkalmazásintegráció, OLAP, Mondrian, üzemeltetés, JAX-WS, Redirect After Post, Synchronizer Token, Workflow, Activiti, Continuous Integration, Continuous Delivery, Maven, Spring, Spring Data
---

# Cikkek és prezentációk

## Modularizáció Servlet 3, Spring és Maven környezetben

A HWSW free! Java meetupon adtam elő a modularizációról. Szó esett a modularizáció alapfogalmairól, tervezési mintákról és azok technológiai megvalósításairól.
*(2015. augusztus 26.)*

[Diák](/artifacts/2015-08-modularization/modularization.html)

## G1 szemétgyűjtő

A G1 szemétgyűjtő algoritmus a legfiatalabb a HotSpot JVM-ben. A már ismert fogalmakra
épít, azonban pár trükkel próbál a többiek felé kerekedni, biztosítva az alkalmazás
magasabb áteresztőképességét, és a GC futása miatti leállás minimalizálását.

[Diák](artifacts/2015-07_G1/2015-07_G1.html)

## Spring Framework 4.0 és 4.1 verzióinak újdonságai

Az előadás 2014. október 2-án hangzott el a [HOUG Szakmai
napon](http://houg.hu/pls/apex/f?p=201:houg_szakmai_nap_2014:0).
*(2014.)*

[Diák](artifacts/2014-10_spring_4/2014-10_spring_4.html)

## Spring Data

A Spring Data alapvetően egy Spring Frameworkre épülő projekt, és segít
abban, hogy egyszerűbben implementálhassuk alkalmazásaink perzisztens
rétegét. Egy olyan projekt, mely több projektet is tartalmaz, ugyanis
különböző perzisztens technológiákra implementálták, úgymint JPA, JDBC,
REST, de olyan NoSQL megoldásokra is van implementációja, mint MongoDB,
Neo4j, Redis, Hadoop, stb. *(2014.)*

[Diák](artifacts/2014-06_spring_data/2014-06_spring_data.html)

## Maven

Az előadás 2014. július 1-én hangzott el
[budapest.scala](http://www.meetup.com/budapest-scala/events/191380332/)
meetupon.

Hogyan buildeljünk Java/Scala hibrid projektet Mavennel, avagy,
csempéssz scala kódot a Javás projektbe :) Szó lesz a Maven alapjairól,
fogalmairól, valamint arról, hogy miért szeretjük. Elhangzik, hogy
mennyire illeszthető a Continuous Integrationbe, Continuous Deliverybe.
Hallhattok az alternatív lehetőségekről, sőt a Maven árnyoldalairól is.
*(2014.)*

[Diák](artifacts/2014-06_maven/2014-06_maven.html),
[videó](http://www.ustream.tv/recorded/49430874)

## Continuous Delivery: Problémák és megoldások

A Continuous Delivery bevezetése nagyvállalati Java környezetben
fejlesztett, több modulból álló alkalmazás esetén nagy kihívást
jelenthet. Gondoljunk csak a branchek használatára, az Ant korlátolt
képességeire, a Maven SNAPSHOT és repository kezelésére, a release
pluginra, az adatbázis séma verziózására, vagy akár az integrációs teszt
esetek sebességére. Előadásomban ezen problémás részeket igyekszem
azonosítani, és alternatív megoldási javaslatokat adni. Nincsenek
általános igazságok, a Continuous Delivery egy szemléletmód, folyamatos
tanulás és fejlődés. *(2006 - 2011, 947 szó)*

[Letöltés](artifacts/HOUG.j_2014_Viczian_Istvan_Continuous_Delivery.pdf)

## Workflow esettanulmányok

Az előadás keretében két projekt tapasztalatait mutattam be. Mindkét
esetben munkafolyamatokat kellett implementálni. Teljesen ellentétes
eszközöket választottunk, az egyiket Anttal, a másikat Activitivel
valósítottuk meg. Főleg a gyakorlati tapasztalatokra, best practice-ekre
helyeztem a hangsúlyt. *(2012., 16 dia)*

<iframe width="420" height="315" src="https://www.youtube.com/embed/66FavTUB7AM?rel=0" frameborder="0" allowfullscreen></iframe>

[Letöltés](artifacts/2012-09_workflow.pdf)

## Szabad navigáció okozta problémák webes környezetben

Ez a cikk azon
problémával foglalkozik, mely a legtöbb webes alkalmazás fejlesztésekor
felmerül, ugyanis nem biztosítható az, hogy a felhasználó olyan
sorrendben nézze meg az oldalakat, ahogy azt az alkalmazás fejlesztője
eltervezi. Használhatja a Vissza és Tovább műveleteket is navigációra,
valamint újratöltheti az oldalt a Frissítés művelettel. Ezen műveletek
elérhetők a böngésző szokásos gombjai között, billentyűkombinációval, de
jobb kattintásra felugró menüben is. Sokan megszokásból, esetleg
türelmetlenség (, a lassú válaszidő) miatt duplán kattintanak egy adott
hivatkozásra. A felhasználó kézzel is beírhat egy url-t, vagy a
Kedvencek közül is választhat egyet, ami szintén hibás működéshez
vezethet, ha erre nem készülünk fel, és bízunk, hogy csak a felületi
elemeket (űrlap elemek – gomb, legördülő menü, stb., hivatkozások) fogja
használni. A böngészők és tűzfalak gyorsítótár beállításai is
megzavarhatják az előre tervezett munkafolyamatot. A probléma a webes
technológia, a http(s) protokoll, valamint a böngészők adta lehetőségek
miatt jelentkezik.

A cikk olyan gyakori technikákat említ meg, mint a Redirect After Post,
vagy Synchronizer Token. *(2006 - 2011, 2951 szó)*

[Letöltés](artifacts/repost.pdf)

## JAX-WS mélyvíz

A SOA már nem olyan divatos fogalom, mint rég volt. Több éve létezik,
csakúgy mint az ezzel kapcsolatos platformfüggetlen szabványok, mint a
SOAP vagy a WSDL, valamint a hozzá kapcsolódó Java standard API-k, mint
a JAXB és JAX-WS. Ezen JSR-ek megfogalmazásánál elsődleges szempont volt
az egyszerűség, és a széleskörű használat és az eltelt idő miatt,
elvárható lenne tőlük, hogy kiforrott, stabil megoldások legyenek.
Előadásomban éles projektben szerzett tapasztalatok alapján bemutatom,
hogy ez nem teljesen így van. *(2009. november, 27 dia)*

[Letöltés](artifacts/JUM12-Viczian-Istvan-JAX-WS-melyviz.pdf)

## Hol a határ? Java alkalmazások üzemeltetéséről fejlesztőknek és üzemeltetőknek

Napjaink egyik égető problémája, hogy egyre több és egyre bonyolultabb
alkalmazás készül Java platformon, melyeket évekig kell üzemeltetni, és
nem teljesen különül el egymástól, hogy meddig tart a fejlesztő
hatásköre, és hol kezdődik az üzemeltető felelőssége. A két csoport
között általában egy szakadék tátong, hiszen vannak olyan területek,
melyet egyik fél sem vállal magára. Az előadás egyaránt szól
fejlesztőknek és üzemeltetőknek, hiszen bemutatja a gyakran alkalmazott
Java nyílt forráskódú szoftver komponenseket, architektúrákat, valamint
azt, hogy hogyan lehet egyszerűen üzemeltethető alkalmazásokat
fejleszteni, mit várhatunk el a fejlesztőtől, hogy az alkalmazás az
üzemeltetést támogassa, valamint hogyan üzemeltethetünk Java alapú
alkalmazásokat. Az előadás megemlíti az ezzel kapcsolatos szabványokat,
technológiákat, ajánlásokat, nyílt forráskódú eszközöket, valamint a
témával kapcsolatos tapasztalatokat. Az előadásnak csak a prezentációja
érhető el, cikk hozzá nem készült.

<object id="prezi_gmyp8jz3v3aw" name="prezi_gmyp8jz3v3aw" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="550" height="400"> <param name="movie" value="http://prezi.com/bin/preziloader.swf"/>  <param name="allowfullscreen" value="true"/>  <param name="allowscriptaccess" value="always"/>  <param name="bgcolor" value="#ffffff"/>  <param name="flashvars" value="prezi_id=gmyp8jz3v3aw&amp;lock_to_path=1&amp;color=ffffff&amp;autoplay=no"/>  <embed id="preziEmbed_gmyp8jz3v3aw" name="preziEmbed_gmyp8jz3v3aw" src="http://prezi.com/bin/preziloader.swf" type="application/x-shockwave-flash" allowfullscreen="true" allowscriptaccess="always" width="550" height="400" bgcolor="#ffffff" flashvars="prezi_id=gmyp8jz3v3aw&amp;lock_to_path=1&amp;color=ffffff&amp;autoplay=no"> </embed> </object>

## Adattárház és jelentéskészítés OLAP-pal a Pentaho Mondrian és JPivot nyílt forráskódú eszközök használatával

Jelen cikk
betekintést ad az adattárházak és a többdimenziós adatmodell
alapfogalmaiba, valamint konkrét példát is mutat az ingyenes, nyílt
forráskódú Pentaho Mondrian Java nyelven implementált OLAP szerver,
valamint a JPivot JSP custom tag library felhasználásával, mely OLAP
táblát jelenít meg interaktív formában, mellyel a legtöbb OLAP művelet
elvégezhető. A cikknek nem célja a fogalmak és technológiák alapos,
precíz ismertetése, inkább egy bevezetőt nyújt ezen eszközök
használatába, egy gyakorlati példán keresztül. *(2009. március, 13
oldal, 3277 szó)*

<object id="prezi_5hqg4hd6jahb" name="prezi_5hqg4hd6jahb" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="550" height="400"> <param name="movie" value="http://prezi.com/bin/preziloader.swf"/>  <param name="allowfullscreen" value="true"/>  <param name="allowscriptaccess" value="always"/>  <param name="bgcolor" value="#ffffff"/>  <param name="flashvars" value="prezi_id=5hqg4hd6jahb&amp;lock_to_path=1&amp;color=ffffff&amp;autoplay=no"/>  <embed id="preziEmbed_5hqg4hd6jahb" name="preziEmbed_5hqg4hd6jahb" src="http://prezi.com/bin/preziloader.swf" type="application/x-shockwave-flash" allowfullscreen="true" allowscriptaccess="always" width="550" height="400" bgcolor="#ffffff" flashvars="prezi_id=5hqg4hd6jahb&amp;lock_to_path=1&amp;color=ffffff&amp;autoplay=no"> </embed> </object>

[Letöltés](artifacts/Java_OLAP.pdf)

## Ariadné fonala a Java technológiák útvesztőjében

Java, Web 2.0, AJAX, SOA, szemantikus web. Bűvös, eltérően értelmezett
és gyakran ismételgetett fogalmak az informatika világában. Több száz
technológia, szabvány, nyílt forráskódú és kereskedelmi termék áll
kapcsolatban a Java platformmal. Az idei JavaOne konferencián – mely a
Java fejlesztők legnagyobb eseménye – majdnem négyszáz előadást
tartanak. A Java Community Process-en - mely a Java technológiához
kapcsolódó szabványokkal, referencia implementációkkal foglalkozó
program - kb. 350 specifikáció publikált. A Google a Java szóra 363
millió találatot hoz, melynek töredéke foglalkozik Java szigetével. Az
előadás az emberi gondolkodáshoz hasonló, élenjáró módszerek
segítségével kíván utat vágni ezen fogalmak dzsungelében, és egy
konkrét, Web 2.0-ás alkalmazás fejlesztésén keresztül mutatja be, hogy
lehet a legmodernebb eszközöket is megszelídíteni, és hogy képes a
Számalk Továbbképzés ezt a tudást hatékonyan továbbadni. *(2008.
április, 15 dia)*

[Letöltés](artifacts/2008_szamalk_eloadas_vi.pdf)

## Alkalmazásintegrációs megoldás

Napjainkban elterjedt informatikai fogalom a nagyvállalati
alkalmazásintegráció (Enterprise Application Integration - EAI),
valamint a szolgáltatásorientált architektúra (Service Oriented
Architecture - SOA), pontos definíció mégsem létezik egyikre sem,
mindegyik gyártó egy kicsit másképp, sajátosan értelmezi. Különösen
akkor kerül ez előtérbe, mikor egyszerre több gyártó termékét kívánjuk
használni. A fogalmak gyakori és talán nem mindig megfelelő használata,
valamint a területen tapasztalható sokszínűség, változékonyság,
dinamizmus lehet az alapja annak, hogy aki nem kíséri nyomon a különböző
ajánlásokat, szabványokat és termékeket, könnyen elveszhet az ezek által
keltett ködben. Előadásom célja ezeket a fogalmakat tisztázni egy
konkrét megoldás bemutatásával.

Előadásom alapját a Központi Statisztikai Hivatal belső rendszereit és a
KSH megbízásából a Kopint-Datorg Zrt. által 2004 óta fejlesztett és
üzemeltetett Intrastat-rendszert integráló megoldás adja.

Célom egy konkrét példán keresztül bemutatni, hogy egy Oracle
Application Server és IBM WebSphere MQ alapú környezetben hogyan lehet
egy alkalmazásintegrációs megoldást megvalósítani, tisztázva az
alapfogalmakat, lehetőségeket.

Előadásom során bemutatom a rendszer környezetét, mind az
architektúrális felépítését, mind a rendszert felépítő szoftver
komponenseket. Ismertetem a rendszer fejlesztésének kezdetén felmerült
igényeket és elvárásokat, valamint az implementáció eredményeként
előállt rendszert, és az alkalmazott technológiákat. Az implementáció és
üzemeltetés közben felmerült nehézségek és problémákat is felsorolom,
melyek közül többet sikerült megoldani, de vannak olyanok is, melyek még
mindig megoldásra várnak.

A 2006. január 26-án bejelentett OC4J 10g (10.1.3) pehelysúlyú konténer
és rá épülő alkalmazásszerver, valamint a JDeveloper 10g (10.1.3)
fejlesztőeszköz megjelenése adott alkalmat arra, hogy felülvizsgáljuk a
jelenlegi alkalmazást, és összevessük az újonnan megjelent eszközök
által támogatott friss technológiákkal. Itt kiemelném az új nyelvi
elemekkel is bővült J2SE 5.0 környezetet, az egyszerűbben kezelhető EJB
1.3-as szabvány komponenseit, az egységes integrációs platformot nyújtó
OEMS környezetet, az a J2EE Connector Architecture szabványt - melynek
révén már meglévő, beépített konnektorokkal kapcsolódhatnak az Oracle
(akár OracleAS JMS, akár OJMS) és 3rd Party JMS providerek -, az
XA-kompatibilis tranzakció koordinátort, a JMS 1.1 szabványt, valamint a
monitorozást és menedzsmentet megkönnyítő új funkciókat és szabványokat.

A teljes megértés kedvéért kifejtem az alkalmazás fejlesztésének
lépéseit, testközelivé hozva az alkalmazásintegrációt, és megmagyarázni
a hangzatos, de titokzatos szavakat, betűkombinációkat. Az előadás így
főleg fejlesztőknek, vezető fejlesztőknek és a technológia iránt
mélyebben érdeklődőknek szól, akik kíváncsiak, mi is történik a
színfalak mögött. Előadásom végén bemutatom a lehetséges továbbfejlődési
irányvonalakat, főbb technológiákat. *(2006. április, 19 dia)*

[Letöltés](artifacts/06-04-06_KD_alk_int_viczian.pdf)

## J2SE 1.5 - Tiger

2004 februárjában az Early Access keretében vált letölthetővé a J2SE
következő verziója, melynek verziószáma 1.5.0 Beta
1. Ennek megjelenését
hatalmas figyelem kísérte. Már régóta lehetett hallani pletykákat és
hivatalos nyilatkozatokat arról, hogy mit is fog tartalmazni, milyen
újításokat fog nyújtani.

A Java fejlesztők három fő platformot választhatnak, ha alkalmazás
írásába szeretnének fogni. A J2SE egy komplett alap környezet
kliens-szerver és asztali alkalmazások készítéséhez; a J2EE
nagyvállalati környezetben használható technológiákat tartalmaz; míg a
J2ME alkalmazási területe a mobil fejlesztés.

Most tehát az alap platformból jött ki új verzió, mely egyrészt jelentős
nyelvi újdonságokat is tartalmaz, másrészt a már meglévő API-k bővültek,
új API-k kerültek bele, sőt jelentős mennyiségű hibajavításon és
optimalizáción is átesett. Az új verzió fejlesztésekor főleg négy
területet tartottak szem előtt: a fejlesztés kényelmét, monitorozást és
menedzselhetőséget, skálázhatóságot és teljesítményt, valamint XML és
kliens oldali Web szolgáltatások támogatását.

A J2SE 1.5 jelenleg 15 új Java Specification Request - JSR specifikációt
valósít meg, és közel 100 nagyobb frissítést tartalmaz, melyeket a Java
Community Process (JCP) keretein belül fejlesztettek. A JCP egy nyitott
szervezet, mely Java fejlesztőkből áll, 1995 óta működik, és feladatuk
Java-hoz kapcsolódó specifikációk kidolgozása, referencia implementációk
elkészítése, ezáltal technológiák megalapozása. A JSR egy specifikáció
kérelem, mely több állapoton megy keresztül, mire elfogadják (JCP
vezetősége elfogadja vagy elutasítja, specifikáció tervezet, belső, majd
publikus bemutatás, referencia implementáció és teszteset készítés,
elfogadás, karbantartás).

A négy fő fejlesztési terület közül az egyik a fejlesztés könnyítésére
irányul (Ease of Development), melyet a következő nyelvi elemek és
tulajdonságok hivatottak biztosítani: generikus típusok (JSR 14),
metaadatok (JSR 175), automatikus be- és kicsomagolás, fejlettebb
ciklusképzés, felsorolásos típus, statikus import (ez utóbbi négyet a
JSR 201 tartalmazza), C típusú formázott adatbevitel és kiírás, változó
számú paraméterlista, párhuzamos programozást segítő eszközök és az RMI
interfész generálás elhagyása. *(2004. február, 7 oldal, 2201 szó)*

[Letöltés](artifacts/tiger.pdf)

## Apache Ant - Java-based build tool

Bármilyen jellegű és
bonyolultságú szoftver fejlesztésekor a programozó gyakran találkozik
olyan műveletsorokkal, melyeket gyakran kell ismételni és részletesen
paraméterezni. Ilyen lehet például egy fordítás, disztribúció készítése,
telepítés, tesztelés. Egyszerűbb esetekben erre operációs rendszerhez
kötődő scripteket használ, bonyolultabb esetben a de facto szabvány make
eszközt.

Java nyelvű fejlesztés során adott a programozási nyelv
platformfüggetlensége, amit viszont megkötne az előbbi eszközök
operációs rendszerhez való szorosabb kötődése, illetve ezen eszközök
konfigurációs fájljai sem a legbarátságosabbak.

Ezek a Java környezetben is használhatóak, de szerencsére létezik egy
kvázi szabvánnyá vált egy nyílt forrású eszköz, az [Apache
Ant](http://ant.apache.org). Írói kitűnően ötvözték a Java nyelv
platformfüggetlenségét, az XML gép és ember által is könnyű
olvashatóságát, illetve a kibővíthetőséget. Így egy kiváló, tiszta, XML
konfigurációs által vezérelhető, Java osztályokkal bővíthető build tool
jött létre, melyet egy Java programozó sem nélkülözhet az eszköztárából.
Ez a cikk az Ant alapjait mutatja meg, példákkal illusztrálva,
javaslatokat téve az optimálisabb felhasználáshoz. *(2004 február, 8
oldal, 1206 szó)*

[Letöltés](artifacts/ant.pdf)

## Java kódolási konvenciók

Kódolási konvenciók
kialakítására és betartására tagadhatatlan szükség van mai világunkban,
amikor ugyanazon a projekten többen is dolgoznak, és nem csak saját
forrásunkat írjuk, használjuk, hanem másokét is. Bizonyos projekteknek
olyan hosszú az élettartama, hogy történhetnek személyi változások. A
nyílt forráskódú projekteknél is kiadják a forráskódot. Elemzések
szerint a szoftver fejlesztési idejének 80%-át fordítjuk karbantartásra.
Ezért különösen fontos az, hogy gyorsan átlássuk, megértsük más
forráskódját, és a miénk is könnyen olvasható legyen. A kódolási
konvenciók betartása ezt segíti, persze nem kényszeríti az embert tiszta
programozásra, hatékony algoritmusok és adatszerkezetek használatára.

A Sun Microsystems, Inc. dolgozói összeállítottak egy kódolási
konvenciókat tartalmazó
dokumentumot, melyet inkább
iránymutatásnak, mint kötelezően betartandó szabályoknak szánnak.
Irányelveket ad a fájnevekkel, fájlok felépítésével, behúzással,
megjegyzésekkel, deklarációkkal, kifejezésekkel, utasításokkal, white
space-ekkel, elnevezési konvenciókkal kapcsolatban, gyakorlati
tanácsokat és kód példákat nyújt. A dokumentum utolsó módosításának a
dátum 1999 április 20, de aktualitását megőrzi, hiszen azóta a Java
nyelv sem változott. Az itt letölthető dokumentum ennek az írásnak a
magyar fordítása, melyet Erdei Szabolccsal készítettünk. *(2003.
november, 17 oldal, 3520 szó)*

[Letöltés](artifacts/jkk.pdf)

## Jakarta Lucene keresőmotor

A [Jakarta Lucene](http://lucene.apache.org/core/) egy
nagyteljesítményű, minden alkalmazási területet lefedő Java nyelven
implementált ingyenes, nyílt forráskódú keresőmotor (Apache Software
Licence alatt). A Lucene keresőmotor alapvetően dokumentumokat kezel,
melyek részhalmazát ki kell tudni választani egy keresési feltétel
alapján. A dokumentumot mezőkre bontja. A keresésként kapott
dokumentumokat rangsorolja, mely megadja, hogy a keresési feltételnek
mennyire felel meg egy adott dokumentum.

A cikk megjelent a CodeX 5. számában. A cikk 2009. január 28-án
frissítve lett. *(Frissítve: 2008. január, 5 oldal, 1195 szó)*

[Letöltés](artifacts/lucene.pdf)

## Log4J naplózó rendszer

A [Log4J](http://logging.apache.org/log4j/docs/index.html) naplózó
rendszer széles körben elterjedt, könnyen használható Java nyelven
implementált naplózó rendszer, mely a Jakarta project része. Kód
módosítása nélkül módosítható a konfigurációja, a loggerek da struktúrát
építenek fel, a naplózás szintekre osztott. A cél tetszőlegesen
konfigurálható (pl. fájl, adatbázis, más hálózati erőforrás), a
formátuma mintával adható meg.

A cikk megjelent a CodeX 6. számában. *(2003. május, 4 oldal, 1297 szó)*

[Letöltés](artifacts/log4j.pdf)

## OJB

Az [ObJectRelationalBridge](http://db.apache.org/ojb/) (OJB) az Apache
Software Foundation támogatásával, az The Apache DB project (korábban
Jakarta) keretein belül fejlesztett alprojekt. Alapvető célja Java
objektumok leképzése relációs adatbázisokra. tulajdonképpen egy köztes
réteg az alkalmazás és az adatbázis meghajtó között, mely kiküszöböli
SQL parancsok használatát, így is elkerülve a Java és SQL nyelv
keveredését. Az OJB nem csak saját API-val rendelkezik
(PersistenceBroker API), hanem erre épülnek rá magasabb szintű,
szabványos interfészek is, úgymint az ODMG 3.0, JDO és illetve Object
Transaction Manager (OTM), mely tartalmazza az előző kettő közös
jellemzőit.

A cikk egy egyszerű példán keresztül végigvezeti az olvasót az OJB
alapjain, felvillantja annak lehetőségeit.

A cikk megjelent a CodeX 4. számában. *(2003. március, 7 oldal, 1876
szó)*

[Letöltés](artifacts/ojb.pdf)

## Jakarta Velocity

Bizonyára sokunk
került már szembe azzal a problémával, hogy adott egy szöveges formátumú
sablon (továbbiakban template), melyet ki kell tölteni az üzleti
rétegből nyert szöveges adatokkal. Valószínűleg erre sokunk válasza az
volt, hogy írjuk meg magunk. Ezen próbálkozások általában átláthatatlan
kódot, speciális feladatot megoldó template engine-t, és az egyre több
igény kielégítésére egy saját template nyelv kialakítását eredményezték.

Tipikus példa erre webes alkalmazások fejlesztésekor a statikus HTML
tartalom kitöltése dinamikusan generált, vagy adatbázisból nyert
adatokkal. Másik példa levelek küldésekor egy általános szöveges
tartalom feltöltése konkrét megszólításokkal, értékekkel. Harmadik
példaként megemlíthető XML fájlok generálása, ahol a template
tartalmazhatja a tag-eket, attribútumok neveit, és az attribútumok
értékeit vagy a tag-ek közti részeket kell tartalommal feltölteni.

Eredményesebb megoldás lehet egy konkrét megvalósítás beépítése az
alkalmazásunkba. Ezekből rengeteg található az Interneten, mind szabad
forráskódú, mind kereskedelmi termékként.

Én elsősorban az ingyenes termékek között kutakodtam, bemutatásra a
[Jakarta Project](http://jakarta.apache.org/) keretein belül fejlesztett
[Velocity Template
Engine](http://velocity.apache.org/)-t választottam,
hiszen az [Apache Software Foundation](http://www.apache.org) név már
bizonyított a szabad szoftverek világában, a Jakarta Project-es
termékeket megbízhatóság, megfelelő komplexitás, kidolgozottság,
dinamikus fejlesztés jellemzi.

A cikk megjelent a CodeX 3. számában. *(2002. szeptember, 3 oldal, 1476
szó)*

[Letöltés](artifacts/velocity.pdf)

## IBM Websphere MQ

A dolgozat fő témája az [IBM Websphere
MQ](http://www.ibm.com/software/products/en/ibm-mq) (korábban IBM
MQSeries) nevű termék, mely egy üzenet központú middleware, azon belül
is az üzenet sorakoztató middleware (message oriented middleware - MOM),
mely támogatja a közzétesz és előfizet (publish and subscribre) modellt
is. Ez a termék nagyon elterjedt az iparban, előszeretettel használatos
az alkalmazásintegráció terén, mint alapszoftver, amely a pontosan
egyszeri biztos üzenetküldést garantálja. Erre épülhetnek különböző más
termékek, melyek bróker szerepet tölthetnek be, illetve magasabb szinten
munkafolyamat támogatást biztosíthatnak. Ezzel szemben a dolgozat mégsem
termék-specifikus, hiszen az elosztott rendszerek, middleware-ek,
tranzakció kezelés és biztonság alapfogalmait is ismerteti. A dolgozat
középpontjában azért áll mégis egy konkrét termék, mert széleskörű
alkalmazása, elterjedése és régóta folytatott fejlesztése miatt minden
gyakorlatban felmerülő problémára megoldást nyújt. Természetesen
alkalmazásintegráció területén más termék is szóba jöhet, ekkor ez a
dolgozat alkalmazható összehasonlításra, támpont nyújtására. Nem
tartalmaz összehasonlítást más termékekkel, de az alapfogalmak
megismeréséhez, egy bizonyos követelményszint felállításához azonban
kiválóan alkalmas lehet. *(2002. október, 47 oldal, 14694 szó)*

[Letöltés](artifacts/ws_mq_middleware.pdf)

## ASP és szervlet technológia összehasonlítása

Az Internet széleskörű elterjedésével, a technológiák fejlődésével, a hagyományos
vállalatok Interneten való megjelenésével egyre nő az igény, hogy ne
csak statikus HTML lapok jelenjenek meg a Világhálón, hanem dinamikusan,
akár valós időben generált oldalak, melyek az adatokat már régóta
használt adatbázis-kezelő rendszerekből olvassák, és azokat megfelelő
formába öntsék. Ennek megoldására több technológia is született, melyek
mára teljesen kiforrottak, ipari szinten is megállják a helyüket. Ezek
közül a Microsoft ASP és a Java szervlet technológiát szeretném
bemutatni és összehasonlítani dolgozatomban. *(2002., 12 oldal, 3234
szó)*

[Letöltés](artifacts/asp_servlet.pdf)

## Diplomamunka

A diplomamunkám Java alkalmazásfejlesztésről szól, a főbb technológiák
bemutatásáról és egy GUI framework kifejlesztéséről. A fő építőköve az
RMI. Az RMI (Remote Method Invocation), azaz távoli metódushívás egy
olyan eszköz a Java nyelvben, mely lehetővé teszi más VM-ben (Virtual
Machine - virtuális gép) elhelyezkedő objektumok metódusainak
meghívását. A rendszert úgy tervezték, hogy a hálózaton elosztott
objektumok viselkedése hasonló legyen a helyi objektumok viselkedésével,
de ne egyezzen meg, a teljes transzparencia biztosítása nem volt cél. A
rendszer elrejti a kommunikációt végző részt, és a metódushívás hasonló
a helyi, azaz lokális objektumok metódusainak meghívásával, bizonyos
megszorításokkal és kötöttségekkel. *(2001., 41 oldal, 9447 szó)*

[Letöltés](artifacts/vi_diplomamunka_rmi.pdf)

## XHTML 1.0 Extensible HyperText Markup Language (Második Kiadás) - magyar fordítás

Egyetemi éveimben fordítottam az XHTML 1.0 Extensible HyperText Markup
Language (Második Kiadás) dokumentumot. Vannak benne hibák, nem minden
mondat van szépen megfogalmazva, de valakinek még jól jöhet. *(2001., 33
oldal, 6411 szó)*

[Ugrás](xhtml-1.0.htm)
