---
layout: post
title: Legjobb fejlesztő 2010 verseny tapasztalatok
date: '2010-12-18T09:04:00.010+01:00'
author: István Viczián
tags:
- Community
modified_time: '2018-06-09T10:00:00.000-08:00'
---

2010\. szeptemberében került kiírásra a [Legjobb fejlesztő
2010](http://java2010.legjobbfejleszto.com/) verseny, melyről már
korábban is [hírt
adtam](/2010/09/20/legjobb-fejleszto-2010-java-programozo.html). Az [IP
Systems Kft.](http://www.ipsystems.hu/) szervezte, és egy [valós
probléma](http://java2010.legjobbfejleszto.com/feladat) leegyszerűsített
változatát kellett megoldani egy konkrét alkalmazás kifejlesztésével.

Az IP Systems Kft. engem is meghívott a zsűritagok közé, és megoldások
értékelésnél egy bonyolult szempontrendszert sikerült kidolgoznunk.
Három fő szempont alapján pontoztuk a megoldásokat, melyeket további
alszempontokra bontottunk. A három fő szempont az üzleti funkciók
kidolgozottsága és az ergonomikus felhasználói felület, a technológiai
megoldás, valamint a forráskód minősége. Ezen szempontok közül én a
technológiai megoldást pontoztam, mely során a következőket értékeltem:

-   Java SE ismerete (a versenyző mennyire ismeri és használja jól a
    standard API-t, milyen interfészeket, osztályokat választ, és azokat
    hogyan használja, nem rekedt-e meg az 1.4-es Java-nál)
-   Szabványoknak való megfelelőség
-   3rd party komponensek, könyvtárak kiválasztása és használata
-   Rétegekre bontás (hiszen főleg webes alkalmazásokkal indultak a
    versenyzők), milyen az alkalmazás belső szerkezete, mennyire
    moduláris, a modulok saját, jól körülhatárolt feladattal
    rendelkeznek-e, és milyen függőségben vannak egymással
-   Hiba és kivételkezelés
-   Van-e az alkalmazásban szűk keresztmetszet, első ránézésre
    performancia problémát okozó kódrészletek
-   Mennyire lehet információkat megtudni az alkalmazás futásáról,
    mennyire támogatja a hibakeresést, naplózás technikai megvalósítása
    és tartalma
-   Hogyan épül fel a projekt és a build folyamat, mennyire
    alkalmazkodik a konvenciókhoz.

A verseny hírlevelére közel 300-an regisztráltak, végül 14-en adtak be
megoldást (ebből sajnos egyet nem sikerült elindítani, hisz nem felelt
meg a feltételeknek), illetve egyvalaki versenyen kívül.

Technológiai megkötés nem volt, lényeg, hogy Java-ban legyen
implementálva. Nem volt kötelező a webes alkalmazás, csak preferált.
Kiemeltük, hogy egy paranccsal build-elni lehessen a projektet, és
egyszerűen telepíthető legyen. A teszt környezet Windows, Internet
hozzáféréssel, Internet Explorer-rel (bekapcsolat JavaScript-tel).
Build-eléshez Ant és Maven előre telepített volt. Web konténer az Apache
Tomcat, alkalmazásszerver GlassFish volt. Nem volt kötelező adatbázist
használni, amennyiben mégis szükség volt rá, MySQL, PostgreSQL és Oracle
Express Edition állt rendelkezésre. Ezekhez csak DataSource-on keresztül
lehetett hozzáférni, ez és a szükséges driver előre telepített volt.
Adatbázis sémát létrehozni és azt kezdő adatokkal feltölteni az
alkalmazásnak kellett. Mindenkit bíztattunk a proaktivitásra, hogy
kérdezzen.

Már a technológiai kérdések között is feltűnő volt, hogy a legtöbben a
build-re és a deploy-ra kérdeztek rá, ez utóbbival kapcsolatban is
speciálisan a DataSource használatára, úgy látszik, koránt sem olyan
evidens. Többen féltek attól, hogy mi van, ha nem sikerül a build vagy a
deploy folyamat (mint később kiderült, jogosan). Valaki rákérdezett,
hogy az előfordítási folyamatok is a build részét képezzék-e (pl. GWT
compile). Kérdés volt, hogy a Maven kap-e internet hozzáférést, és
milyen repository-k vannak bekonfigurálva. Volt, aki a build folyamat
részeként szerette volna a deploy-t is elvégezni, akár a DataSource
konfigurációval, akár az adatbázis séma létrehozással egyetemben. Páran
fennakadtak azon, hogy az adatbázist és bele a rekordokat az
alkalmazásnak kell létrehoznia. (Igaz, hogy ez éles környezetben nem
javasolt, itt csak a saját dolgunkat akartuk megkönnyíteni.) Volt
valaki, aki már látott olyant, hogy az alkalmazás és az adatbázis között
tűzfal van, ami elvághatta a kapcsolatot, megbolondítva ezzel a
connection pool-t, így arra kérdezett rá, hogy fel kell-e erre készülni,
JDBC URL-ben ki lesz védve, vagy manuálisan kell vizsgálnia a kapcsolat
érvényességét. (Amúgy nem volt tűzfal, de ha van, akkor mi a DBCP pool
esetén a validation query-t szoktuk használni.) Többen próbálták a
határokat kitolni, pl. Flex-ben fejleszteni a felületet (végül nem jött
ilyen megoldás), Scala használata, vagy az üzleti logika letolása PL/SQL
rétegbe, triggerekbe (ezt nem támogattuk, hiszen a Java tudásra voltunk
kiváncsiak). Csak egy kérdező volt, akinek nagyobb rendszerben szerzett
üzemeltetési tapasztalata lehetett, és méretezésre, rendelkezésre
állásra kérdezett rá, valamint arra, hogy egyenletes-e a terhelés
(sajnos ő később nem adott be megoldást). Egy kérdés érkezett arra, hogy
mennyire kell optimalizálni, adatbázis indexeket használni, cache-elni.
Szintén egy kérdező volt, akinek portál tervezési tapasztalatai
lehettek, így felmerült az xhtml, kikapcsolt cookie-k, captcha,
többnyelvűség, akadálymentesítés (egyik sem volt követelmény). Több
kérdés volt a böngésző kompatibilitásra is. Volt kérdés az
autentikációval (pl. egy felhasználónak több session-je) és
jogosultságkezeléssel (JAAS), valamint a konkurrenciával kapcsolatban is
(meglepően kevés). Egy kérdés érkezett, hogy https lesz-e, illetve egy
ember kérdezte, hogy a SQL injection-re fel kell-e készülni. Az is
kiderült, hogy a fejlesztők nem maguknak szeretnek megjegyzéseket
használni, hanem rákérdeznek, hogy kötelező-e. Itt is volt olyan hang,
aki nem 3rd party framework-öt használt, hanem saját fejlesztésűt kívánt
bevetni.

És akkor jöjjön néhány adat, hogy ki és mit használt, valamint néhány
tapasztalat ezzel kapcsolatban.

![IDE](http://chart.apis.google.com/chart?chs=400x200&cht=p&chd=s:CDBC&chl=Eclipse+%284%29%7CNetBeans+%285%29%7CIDEA+%281%29%7CIsmeretlen+%284%29&chtt=IDE&chts=676767,12.5)

A fejlesztőeszköz területén nem volt nagy meglepetés, a NetBeans és
Eclipse fej-fej mellett, valamint egy IDEA felhasználó. A többi
projektről nem derült ki, pl. Maven-nel fordult, és csak a Maven-es
pom.xml volt a projektben.

![Adatbázis](http://chart.apis.google.com/chart?chs=400x200&cht=p&chd=s:EBCBB&chl=MySQL+%287%29%7CPostgreSQL+%282%29%7COracle+%283%29%7CEmbedded+-+H2+%281%29%7CNincs+%281%29&chtt=Adatb%C3%A1zis&chts=676767,12.5)

Adatbázisok közül egyértelműen a MySQL volt a legnépszerűbb. Meglepő
volt számomra, hogy beágyazott adatbázist csak egy versenyző használt.
Az ő munkája ilyen szempontból kiemelkedő volt, Maven-nel Jetty-t
indított, és H2 beágyazott adatbáziskezelőt. Ez a megoldást nagyon
kényelmes volt, hiszen nem kellett telepíteni, konfigurálni, hanem
azonnal indult. Jó lett volna, ha több ilyen megoldást kapunk. Érdekes
még, hogy nem vártunk el adatbázis kapcsolatot, és csak egy versenyző
merte ezt mégis megrizikózni. Természetesen nem kapott ezért kevesebb
pontot, hiszen nem volt követelmény. Egyszerűen Java Collections
Framework-kel oldotta meg a tárolást.

![Alkalmazásszerver](http://chart.apis.google.com/chart?chs=420x200&cht=p&chd=s:ECBC&chl=Tomcat+%286%29%7CGlassfish+%284%29%7CJetty+%281%29%7CVastag+%283%29&chtt=Alkalmaz%C3%A1sszerver&chts=676767,12.5)

Alkalmazásszerverek, pontosabban web konténerek és alkalmazásszerverek
között a Tomcat volt a favorit, ami nem meglepő. Igaz, hogy csak ezt a
két választási lehetőséget adtuk, de a sok alkalmazásszerver
engedélyezése nagyban megnehezítette volna az értékelést. Volt
érdeklődő, aki pl. JBoss-t is szívesen használt volna, de mivel az nem
volt opció, a Seam-et, EJB3-astúl, JSF-estűl rágyógyította a Tomcat-re.
Érdekes, hogy a Glassfish választása nem hozta magával az EJB vagy a JSF
használatát, volt aki Hibernate-et használt Glassfish-on, volt, aki
Spring-et. Hárman nem is webes, hanem Swing-es alkalmazást készítettek.

![Build](http://chart.apis.google.com/chart?chs=400x200&cht=p&chd=s:EDB&chp=0.1&chl=Ant+%287%29%7CMaven+%285%29%7CNincs+%282%29&chtt=Build&chts=676767,12.5)

A legnagyobb csalódást a build folyamatok és a telepítés (deploy)
okozták. Különösen úgy, hogy kizárással fenyegettünk, ha valakinek nem
fordult egy paranccsal, és nem lehetett a kimenetet azonnal telepíteni,
vagy futtatni. Ha ezt betartottuk volna, a pályaművek felét ki kellett
volna zárnunk. Látható, hogy még mindig az Ant vezeti a mezőnyt, és
volt, aki nem is használt build eszközt (na jó, a Maven több, project
management and comprehension tool). A legtöbben nem tudták, hogy hogyan
is érdemes a DataSource-t Tomcat-ben definiálni, vagy hogyan szokás, és
hogyan kell használni. (Erről írtam
[korábban](/2009/01/12/jndi-nevek-tomcat-alatt.html).) Több helyen
kellett manuálisan szerkesztenem a context.xml állományt, pedig erre
nincs szükség. Erről még részletesebben fogok értekezni egy későbbi
posztban. Volt, akinek problémát okozott, hogy hol érdemes az adatbázist
inicializálni, hol lehet az alkalmazás indulását észlelni.

Sajnos többen is függtek a fejlesztőeszköztől vagy a környezettől, azaz
meg kellett adni a NetBeans vagy a Glassfish telepítési mappáját. Sajnos
a NetBeans alapból olyan projektet készít, amiben vannak abszolút
hivatkozások. Valamint szükség van egy JAR-ra is a fordításhoz. Többen
ezt nem vették figyelembe. Volt persze helyes megoldás is, a JAR-t
csatolni kell, és build-kor egy környezeti változót felüldefiniálni:
-Dlibs.CopyLibs.classpath="lib\\org-netbeans-modules-java-j2seproject-copylibstask.jar".
Ez persze a NetBeans szégyene, az érdekes, hogy erről több versenyző nem
tudott. Javasolt volt pedig egy üres (legalábbis virtuális) gépen
kipróbálni a build folyamatot. Összességében látható, hogy a fiatalabb
fejlesztők nem fektetnek annyi hangsúlyt a build folyamatra, a
hordozhatóság sérült, ezzel pl. egy continuous integration rendszerbe
való bekötés lehetősége is.

Volt olyan aki külön projektbe tette a teszt eseteket. Volt, aki olyan
technológiát használt (DataNucleus), melyhez nem volt Maven plugin, így
Ant-ot kellett hívni java task-kal. Volt, akinél a build folyamat nem
talált megfelelő artifact-ot a Maven repository-ban. Feltehetőleg
magának a lokális repository-ba feltelepítette, és erről megfeledkezett.
Egy versenyző azon bukott meg sajnos, hogy nem lehetett build-elni, és
azonnal telepíteni az alkalmazását.

![Naplózás](http://chart.apis.google.com/chart?chs=400x200&cht=p&chd=s:CCBE&chp=0.1&chl=Log4J+%283%29%7Cjava.util.Logging+%283%29%7CEgy%C3%A9b+%281%29%7CNincs+%287%29&chtt=Napl%C3%B3z%C3%A1s&chts=676767,12.5)

Ismét egy nagy csalódás. A versenyzők java nem naplózott. Aki használta
is, az is inkább kötelességből, vagy a fejlesztőeszköz generálta oda.
Úgy látszik, hogy nem érezték szükségét az értelmezhető napló
állománynak, támogatva ezzel a visszakövethetőséget. Volt AOP-os
megoldás is (interceptor-ral), mely azt írta ki, hogy melyik metódus
lett meghívva. Ez üzletileg kevés információt tartalmaz, talán érdemes
kiegészíteni egyedi napló üzenetekkel is, melyek az üzleti folyamatokról
és modellről adnak bővebb információkat.

![Naplózás](http://chart.apis.google.com/chart?chs=400x200&cht=p&chd=s:DBF&chp=0.1&chl=JUnit+%285%29%7CTestNG+%281%29%7CNincs+%288%29&chtt=Teszt+esetek&chts=676767,12.5)

Ez is érdekes, hogy teszt esetek írásával kevesen töltötték az idejüket,
dacára annak, hogy mostanában a csapból is ez folyik. Akik mégis írtak
ilyeneket, azoknál is volt, ahol keveredett a unit teszt és az
integrációs teszt fogalma. Mock keretrendszer is csak egy munkában volt
(EasyMock).

![Adatbázis
elérés](http://chart.apis.google.com/chart?chs=400x200&cht=p&chd=s:CCCBBB&chp=0.1&chl=JPA+-+Hibernate+%283%29%7CJPA+-+EclipseLink+%284%29%7CJDBC+%283%29%7CJDO+%281%29%7CHibernate+%282%29%7CNincs+%281%29&chtt=Adatb%C3%A1zis+el%C3%A9r%C3%A9s&chts=676767,12.5)

Dícsérendő, hogy sokan használtak ORM réteget. Látható, hogy a szabvány
nagy úr, a JPA használata messze leelőzte a Hibernate-et, és JDO-ból is
csak egy volt. Az, hogy a JPA implementációk közül a EclipseLink vagy a
Hibernate-e a nyerő, ebből nem megállapítható, hiszen a kiírásban
Glassfish alkalmazásszerver szerepelt, melynek a beépített JPA
provider-e az EclipseLink, így egy kicsit torzít. Szép megoldások
születtek, de a JPA 2 nyomait még nem nagyon találtam.

![Üzleti logika
réteg](http://chart.apis.google.com/chart?chs=400x200&cht=p&chd=s:CBBF&chl=EJB3+%283%29%7CSpring+%282%29%7CSeam+%281%29%7CNincs+%288%29&chtt=%C3%9Czleti+logika+r%C3%A9teg&chts=676767,12.5){width="400"
height="200"}

Szintén egy meglepő eredmény. És az is látszik, hogy a szabvány itt is
tarol. Érdekes, hogy a Dependency Injection, Inversion of Control még
nincs mindenkinek az eszköztárában, és nem hiányzik, ahogy az
interfészekkel való programozás sem valósul meg mindenütt.

![UI
réteg](http://chart.apis.google.com/chart?chs=400x200&cht=p&chd=s:EBCBBB&chp=0.1&chl=JSF+%286%29%7CVaadin+%282%29%7CSwing+%283%29%7CSpring+MVC+%281%29%7CGWT+%281%29%7CServlet%2FJSP+%281%29&chtt=UI+r%C3%A9teg&chts=676767,12.5)

Itt már nagyobb a szórás, de itt is az látszik, hogy a szabvány (JSF)
szignifikánsan vezet. A számomra oly kedvelt, illetve az oly sokszor
emlegetett keretrendszerek (Spring MVC, GWT, Struts, Tapestry, Wicket)
sehol sincsenek. Ezen érdemes egy kicsit elgondolkodni, hogy milyen
irányba is érdemes menni, ha a piacon lévő fiatalabb fejlesztők ilyen
ismeretekkel rendelkeznek. Persze a JSF sem olyan homogén, használt
keretrendszerek: RichFaces (hárman is!), Seam, Trinidad, PrimeFaces,
Facelets. Mondjuk túl messzemenő következtetéseket ne vonjunk le, hiszen
a versenyzők maguk is bevallották, hogy sokan a verseny feladaton
próbálták ki a kiválasztott keretrendszert, és nem rendelkeztek sok
tapasztalattal.

Persze a legtöbb webes felület AJAX-os volt, de főleg Java-s
keretrendszer biztosította, és nem natívan került felhasználásra,
JavaScript-et nagyon kevesen írtak. Egy műben szerepelt alacsony szinten
megvalósítva, ebben DWR, JQuery és JAXB is volt. Szerencsére azt is
ritkán láttam, hogy Java kód keveredett volna HTML-lel.

A Swing-es alkalmazásokból hiányoltam a szálkezelést, a konkurencia
kezelését.

Olyan érdekes technológiák, könyvtárak és eszközök is megjelentek, mint
az Envers entitások auditálására, JRebel a fejlesztési ciklus
gyorsítására, DataNucleus az adatok perzisztálására, Hazelcast elosztott
cache.

Amit még meg kell említeni, az a jogosultságkezelés. Egy Spring Security
volt, egy JBoss Rules-zal megvalósított nagyon egyedi megoldás és egy
JAAS. A többiek teljesen egyedileg programozták le. Úgy tűnik ezen a
területen sincs még joker megoldás.

A kivételkezelés is ad-hoc módon történt, érződött, hogy sok helyen csak
azért van, mert nem lehet kikerülni, általában nem jól átgondolt
stratégiával történt, tisztelet a kivételnek.

Ami számomra hatalmas pozitívum, hogy egyrészt a Java nyelvben
otthonosan mozogtak a versenyzők, Java SE programozási hibát,
melléfogást nem találtam. Copy-paste-et szintén nem. Bár egyértelmű,
hogy az újrahasznosítás Java kódban sokkal szebb volt sokaknál, mint a
felhasználói felületben. Valamint a keretrendszerek megtanulásával
együtt a fiatal fejlesztők megtanulják az alapvető architektúrális
felépítéseket, sőt nagyon sokat alkalmaztak akár GoF, akár J2EE
tervezési mintákat is. Az alkalmazásokat viszonylag szépen rétegekre
bontották. Érdekes, hogy a GoF tervezési mintákat főleg a vastag
kliensekre találták ki, a legtöbb példa is a Swing-ben található
Java-ban, mégis a vastag klienses megoldásokra se rétegek, se a
tervezési minták használata nem volt jellemző.

A díjkiosztó is nagyon kellemesre sikeredett, jó volt megismerkedni a
versenyzőkkel, megismerni a véleményüket a feladattal kapcsolatban, és
hallgatni, hogy mivel gyűlt meg a legtöbb bajuk. Jó hír, hogy nem
technológiát mondtak, hanem inkább az üzleti problémán kellett többet
gondolkodniuk.

<a href="/artifacts/posts/2010-12-18-legjobb-fejleszto-2010-verseny/dijkioszto_b.jpg" data-lightbox="post-images">![Díjkiosztó](/artifacts/posts/2010-12-18-legjobb-fejleszto-2010-verseny/dijkioszto.jpg)</a>

Összességében elmondható, hogy nagyon tanulságos verseny volt,
számunkra, mint zsűri számára, és úgy ítélem, a versenyzők számára is.
Én személy szerint egy kicsit több pályaművet vártam, nem tudom, hogy
mivel lehetett volna még több versenyzőt elcsábítani, hogy mutassa meg
tudását. Szerintetek?
