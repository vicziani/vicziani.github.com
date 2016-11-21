---
layout: post
title: Twelve-factor app
date: '2016-11-05T22:00:00.000+02:00'
author: István Viczián
---

Az idén rendezett HOUG 2016 szakmai napon is előadhattam, előadásomat
"Üzemeltethető Java alkalmazások" címmel tartottam. Fő téma a
Twelve-factor app és a Cloud native volt. Az előadás diái
[itt megtekinthetőek](/artifacts/2016-houg-12factor/2016-houg-12factor.html).

Az előadás húsz perce alatt csak ízelítőt tudtam adni a
[Twelve-factor app](https://12factor.net/)
állításaiból, és azok implementációs kérdéseiről Java és főleg Spring Boot
környezetben. A Twelve-factor app a Heroku (Platform as a Service) fejlesztőinek
ajánlása felhőbe telepíthető alkalmazások fejlesztésére. Azonban én ajánlom
ezen útmutatások, legjobb gyakorlatok betartását akár privát környezetben futó
egyszerű alkalmazások fejlesztésénél is, ugyanúgy, mint privát vagy publikus felhőben
üzemelő microservice architektúrával összerakott rendszerek esetében.

Ebben a posztban kitérek mind a tizenkét pontra, és ismertetem ennek
implementációs vetületeit Java, Spring, de főleg Spring Boot környezetben,
sőt személyes tapasztalataimat is megosztom. Ettől függetlenül érdemes
elolvasnia, azoknak is, akik más környezetben fejlesztenek.

A szakmai napra egy kis példa alkalmazás is készült, mely
[elérhető GitHubon](https://github.com/vicziani/jtechlog-houg-2016).

![Viczián István a HOUG konferencián](/artifacts/posts/2016-11-05-twelve-factor-app/houg-2016-osz.jpg)

<!-- more -->

## Bevezetés

A Twelve-factor app célja olyan ajánlások megfogalmazása, melyek betartásával
úgy fejleszthetőek és üzemeltethetőek alkalmazások, hogy azok cloud környezetbe
működőek legyenek, a módszertan célként fogalmazza meg a magas szintű
automatizáltságot, a continuous deployment alkalmazhatóságát, a platformok közötti
hordozhatóságot, valamint a skálázhatóságot (mind módszertan, technológiák és
eszközök tekintetében).

Valamint megemlíteném a Pivotal (, a Spring mögött is álló cég) által használt
Cloud native jelzőt, melyet olyan szervezetekre alkalmaznak, melyek képesek az automatizálás előnyeit
kihasználva gyorsabban megbízható és skálázható alkalmazásokat szállítani.
Ők a Twelve-factor app-ot gondolják tovább, olyan témákra koncentrálva, mint a continuous delivery,
DevOps és a microservices. Többet az ingyenesen is letölthető
[Beyond the Twelve-Factor App](https://pivotal.io/beyond-the-twelve-factor-app) eBookból lehet megtudni.

És most jöjjön a tizenkét ajánlás. Nem lehet ezeket függetlenül kezelni, így több
esetben is lesz előre utalás.

## Verziókezelés

Az alkalmazás forráskódját verziókezelő rendszerben kell tartani, méghozzá egy repository-ban.
A forráskód nem osztható szét több repository-ban, az már több alkalmazás. A legelterjedtebb
verziókezelő a Git, ahhoz van a legszélesebb eszköztámogatás. Ha vannak
több alkalmazásban is felhasználható kódrészleteink, akkor azt ki kell szervezni, és függőségként
definiálni.

A több repository használatában mi is gondolkodtunk, de arra jutottunk, hogy feleslegesen megbonyolítja
mind a fejlesztési folyamatot (IDE támogatás), mind a build folyamatot. Főleg modularizált fejlesztésnél
tűnhet ez jó ötletnek a modulokat külön repository-ban tartani. Próbálkoztunk a
[Git Submodules](https://git-scm.com/book/en/v2/Git-Tools-Submodules) használatával is, de ez sem váltotta
be a hozzá fűzött reményeket, és a fejlesztői közösség véleménye is megoszlik erről. Tehát maradjon egy
és csakis egy repository.

Természetesen egy kódbázisra alapulva több példány is készülhet. Continuous delivery esetén minden kódmódosítás
külön release candidate, mely különböző környezetekre telepíthető.

Függőségek kezelésére Java környezetben a Maven és Gradle a legmegfelelőbb. Egy céges repository-val kombinálva,
mint pl. a [Sonatype Nexus](http://www.sonatype.org/nexus/) minden igényt kielégít.

A különböző környezetekre telepített példányoknál alapvető igény, hogy tudjuk, hogy mely verzióból készült. A Spring
Boot erre beépített támogatást ad. Ugyanis egy Maven vagy Gradle plugin segítségével build time [készíthető](http://docs.spring.io/spring-boot/docs/1.4.1.RELEASE/reference/htmlsingle/#howto-git-info)
egy properties fájl, mely tartalmazza a verzió alapvető adatait (pl. Git tagek, branch, commit id-ja, szerzője,
leírása, stb.). Ennek a properties fájlnak a tartalmát [ki lehet vezetni](http://docs.spring.io/spring-boot/docs/1.4.1.RELEASE/reference/htmlsingle/#production-ready-application-info-git) az `/info`
endpointra (lsd. Spring Boot Actuator).

## Függőségek

Az alkalmazás nem függhet az őt futtató környezetre telepített semmilyen csomagtól. A külső függőségeket mindig
explicit deklarálni kell, és valamilyen eszközt használni ezek beszerzésére.

Java alkalmazások esetén ez eléggé egyértelmű a virtuális gép működése miatt. A csomagolás alapegysége a JAR, ami
rajta van a classpath-on, az adott, ami nem, az nem elérhető. Tehát semmilyen JAR-t
nem lehet a környezetre manuálisan másolni. Java alkalmazások szerencsére ritkán függnek natív csomagoktól.

Spring Boot esetén ez megint csak egyértelmű, ugyanis főleg az olyan JAR-t preferálják, mely tartalmaz minden függőséget,
még a futtató környezetet is, mint pl. Tomcat web konténert, így létrejön az un. "uberjar" vagy "fat jar". Ennek előállítását ismét csak
a Maven vagy Gradle végezheti, és a build során szerzi be a külső függőségeket a repository-ból. Ezek támogatják
a tranzitív függőségek kezelését, függőségek ütközésének feloldását, stb. Itt fontos még megjegyezni, hogy minden függőség
verziószámát explicit határozzuk meg, hogy a build minden esetben reprodukálható legyen.

Nem a függőségek közé soroljuk a háttérszolgáltatásokat, mint pl. adatbázis, mail szerver,
cache szerver, stb.

## Konfiguráció

Először definiálni kell a konfiguráció fogalmát. Ezek a környezetenként eltérő beállítások, mint pl. a
háttérszolgáltatások elérése, felhasználónevek,
jelszavak és egyéb autentikációs információk és más alkalmazás beállítások.

A konfigurációs paraméterek a környezet részét képezzék, és nem a kódbázis része. Sajnos több helyen láttam, hogy ezek
a forráskód mellett kerültek letárolásra. Ekkor a környezetek számának növekedésével ezek is nőnek, azonban senki nem
fordít figyelmet arra, hogy a környezet megszüntetésével a konfigurációt is megszüntesse. Valamint egyáltalán nem volt
tiszta a felelősségi kör, hogy a konfigurációt kinek kell módosítania és mikor.

Nagyon fontos még, hogy kerüljük az alkalmazásban a környezetek nevesítését. Sajnos olyat is többször láttam, hogy
a kód elágazott attól függően, hogy milyen nevű környezetben futott. (Ezt a Twelve-factor app group of environmentsnek
hívja.) Funkciónként legyen konfigurálható, hogy mi hogyan működjön, és a környezetenként ott helyben legyen ez konfigurálva.
Így könnyebben nyomon követhető, és tesztelhető.

A Twelve-factor app ezek tárolását operációs rendszerbeli
környezeti változókban javasolja. A Heroku-hoz hasonló PaaS környezeteknél láthatjuk, hogy az infrastruktúrát összeklikkelgethetjük,
közben háttérben jönnek létre a virtuális gépek, melyek címeket, autentikációs információkat automatikusan kapnak, vagy generálásra
kerülnek, és ezek környezeti változóból az alkalmazásunk számára lekérdezhetőek.

Java-ban nagyon gyakori válasz a konfigurációk tárolására valamilyen JNDI-vel hozzáférhető tár. Ez egyedisége, komplexitása miatt
igencsak kerülendő, pláne, hogy a Spring/Spring Boot nem nagyon hisz alkalmazásszerverekben.

A Spring Boot egy nagyon komplex [infrastruktúrát ad](http://docs.spring.io/spring-boot/docs/1.4.1.RELEASE/reference/htmlsingle/#boot-features-external-config)
a paramétereink külső forrásból történő beolvasására. Természetesen támogatja a környezeti változókból történő beolvasást is,
de mellette több, mint tizenöt forrást támogat.

Mindenképp meg kell említeni a Spring Cloud Configot, melyről [nemrég írtam](/2016/09/05/spring-cloud-config.html) és a konfigurációk
tárolását is tulajdonképpen egy háttérszolgáltatásban képzeli el.

## Háttérszolgáltatások

A háttérszolgáltatások (backing services) a rendszer működéséhez szükséges szolgáltatások, mint az adatbázis (akár relációs, akár NoSQL),
üzenetküldő middleware-ek, directory és email szerverek, elosztott cache, Big Data eszközök, stb.

Nyilván ezek telepítésekor is arra kell figyelni, hogy automatizált legyen. Ennek gyűjtőszava az Infrastructure as Code, és olyan
eszközöket kell érteni alatta, mint pl. [Ansible](https://www.ansible.com/), [Chef](https://www.chef.io/chef/), [Puppet](https://puppet.com/), stb.

A különböző környezetben ezeknek hasonlóknak kell lenniük, viszont tetszőlegesen skálázhatónak. Az eléréseik környezeti paraméterként
publikálódnak az alkalmazás felé. Optimális esetben ezeknek olyanoknak kell lenniük, hogy futás közben felcsatolhatóak legyenek,
valamint a skálázódás is transzparenst legyen.

A fájlrendszer nem tekinthető megfelelő háttérszolgáltatásnak, ahogy a Java EE sem engedélyezi a használatát. Nem skálázható
megfelelően, nem tranzakcionális, stb. Természetesen ennek is vannak megfelelő alternatívái, indulhatunk pl.
a [Swifttől](https://www.swiftstack.com/product/openstack-swift).

Előny, ha a háttérszolgáltatás akár beágyazható, message queue-k esetén például az [ActiveMQ](http://activemq.apache.org/)
remekül beágyazható Java alkalmazásokba, vagy az elosztott cache-ként ismert [Hazelcast](https://hazelcast.com/) is. A tesztelést is
nagyban segíti, pl. ha az integrációs tesztek beágyazott H2 relációs adatbázissal futnak, kevesebb karbantartással jár, és gyorsabb visszajelzést kapunk.

Érdekes kérdéskör még a biztonság, mint háttérszolgáltatás használata. Ez céges környezetben főleg SSO-ként ismeretes, webes környezetben
az OAuth a varázsszó, melyet olyan nagy cégek használnak, mint Google, Facebook, GitHub, stb.

## Build, release, futtatás

A forráskódból a build folyamat készít futtatható alkalmazást, binárist, buildet, kezelve a függőségeket. A release folyamat, mely a futtatható alkalmazást
kombinálja a környezeti konfigurációval, végeredménye a release. A futtatás során egy release kerül elindításra. A Twelve-factor app
nagyon élesen elhatárolja ezt a három lépést. (Evidens példa, hogy futás közben nem nyúlunk bele az alkalmazásba.) Minden release-nek egyedi azonosítójának kell
lennie, ráadásul lehetőleg bármikor vissza lehessen állni egy előző release-re.

Itt kell megemlíteni a Continuous Delivery-t, mely szigorúan kimondja, hogy a build folyamatként előállt binárist kell tesztelni, majd a különböző környezeteken végigvinni. Azt újra buildelni, módosítani nem lehet.

Valamint nem lehet elmenni a [Docker](https://www.docker.com/) használata mellett sem. Spring Boot esetén a bináris nem más, mint egy JAR fájl, de a Docker ezt még tovább viszi,
az alkalmazás környezetével együtt szállítható, gyakorlatilag az operációs rendszerrel együtt az összes függőség egyben szállítható. Nekem ezzel kapcsolatban még vannak fenntartásaim, ugyanis pont Java esetén a Java virtuális gép gyakorlatilag mindent leválaszt, és biztosítja azt a "konténert", melyből az alkalmazás nem lát ki (sandbox), kivéve persze a háttérszolgáltatásokat. Persze más platform esetén, ahol az operációs rendszerrel sokkal jobban össze képes nőni az alkalmazás, a
Docker használata egyértelmű előnyöket biztosít.

A PaaS szolgáltatók gyakorlatilag tökélyre emelték a build, release és futtatás automatizálását. Nekem elegendő a módosításokat push-olnom egy Git repository-ba,
lefut a build, előáll a bináris, létrejön a release, sőt automatikusan elindítgatja a megfelelő virtuális gépeket, környezeti változóban átadva az igényelt
háttérszolgáltatások elérését.

## Folyamatok

Az alkalmazás futtatható legyen egy vagy több folyamatként. Ezen processzek legyenek állapotmentesek, valamint
kövessék a shared nothing architektúrát. Ne tartsanak nyilván saját sessiont, ne írjanak fájlrendszerbe (maximum átmeneti jelleggel, pl. böngészőből feltöltés esetén először fájlrendszerbe, majd háttérszolgáltatásra menthető a fájl). Bármi hasonlóra van szükség, háttérszolgáltatást kell
használni. Ez egyértelműen a skálázást teszi lehetővé. Hiszen egyrészt nem biztos, hogy a felhasználót ugyanaz a folyamat fog másodjára is kiszolgálni, akár a terheléselosztásból, akár abból kifolyólag, hogy a folyamat újra lett indítva (pl. telepítés, összeomlás, stb. miatt).

Állapottal rendelkező alkalmazások esetén gyakran használjuk a sticky sessiont, mely lehetővé teszi, hogy a kérés ugyanahhoz a folyamathoz kerüljön. A Twelve-factor app szerint ezt kerülni kell, az állapotot háttérszolgáltatásba kell menteni.

Az állapotot adatbázisba menteni még viszonylag egyszerű, és könnyen lehet vele élni, azonban pl. a bejelentkezet felhasználói adatokat nem a sessionben tartani már kicsit körülményesebb. Pl. a Spring Security is alapesetben sessionben tárolja a Security contextet, ezt a `SecurityContextPersistenceFilter` osztály végzi. Természetesen beállítható, hogy a kérések között ne a sessionben vigye tovább a bejelentkezés tényét, hanem gyakorlatilag minden kéréskor autentikáljon be (pl. valamilyen token alapján).

Ez különösen hasznos pl. olyan webes alkalmazásoknál, ahol a JavaScript felületet REST szerver oldal szolgál ki, hiszen annak is definíció szerint állapotmentesnek kell lennie. A [JSON Web Tokens](https://jwt.io/) használható például, mely egy szabványos JSON formátumú tokent definiál, mely tartalmazhatja a felhasználó adatokat, valamint aláírható, és mivel Base64-gyel kódolható, akár URL paraméterként is továbbadható.

## Port binding

A webes alkalmazások futtatásához valamiféle web konténer szükséges, mely kezeli a http protokollt, szálakat, stb. Ezen web konténert javasolt az alkalmazásba ágyazni. Ezért annak indításakor az egy porthoz köti magát, és azon tudja kiszolgálni a kéréseket. Természetesen nem csak a http(s) ajánlható ki, hanem egyéb szolgáltatások is, mint Java esetén a RMI, JMX, stb.

Spring Boot esetén a beágyazott Tomcat standard módon konfigurálható, a `server.port` paraméterrel adhatjuk meg a portot, mely alapértelmezetten `8080`. Ez azért is jó, mert minimális konfigurációval tudunk több példányt futtatni ugyanazon a gépen, vagy több különböző Spring Boot alkalmazást.

## Konkurrencia

Érdemes a különböző típusú folyamatokat különválasztani, és azokat valamilyen független folyamatvezérlővel felügyelni. Tipikusan web alkalmazások esetén vannak a web kéréseket kiszolgáló folyamatok, melyek tulajdonsága, hogy sok és párhuzamos kérést szolgál ki, lehetőleg minél gyorsabban. Valamint lehetnek olyan folyamatok, melyek végrehajtási ideje nem olyan kritikus, mint pl. képekhez bélyegkép generálás, PDF dokumentumok generálása, hírlevelek kiküldése, vagy üzleti környezetben például számlák generálása, elszámoló batch folyamatok, stb.

Ezek szétválasztásával a skálázhatóságot tudjuk növelni, hiszen bizonyos folyamatokat külön, akár dedikált környezeteken futtathatunk, a megnövekedett terhelésnek megfelelően csak a megfelelő folyamat típusokból indítunk újabb példányokat.

Természetesen ez nem zárja ki, hogy bizonyos folyamatok önmagukon belül folyamatokat, szálakat indítsanak. Java esetén természetesen a beérkező web kérésekhez a Tomcat ugyanúgy a JVM által felügyelt belső szálakat fog indítani. Azonban a fentebb említett más típusú feldolgozásokat nem ugyanezen JVM-en belül külön szálként indítani, hanem külön JVM-ben indítani, és ezen JVM-eket külön-külön felügyelni. Ilyen felügyeleti eszközök pl. az Ubuntu [Upstart](http://upstart.ubuntu.com/) vagy fejlesztéskor a [Foreman](http://blog.daviddollar.org/2011/05/06/introducing-foreman.html).

## Disposability

A folyamatoknál nagyon fontos, hogy lehetőleg nagyon gyorsan induljanak (ideális esetben pár másodperc), és kezeljék a normál leállítási folyamatot (un. graceful shutdown), hogy a megfelelő lekötött erőforrásokat fel tudják engedni, és ezt is gyorsan tegyék. Ezen elvárások is a skálázhatóságot növelik, valamint meggyorsítják új verzió kiadását, vagy konfiguráció változtatást.

Ez különösen fontos olyan PaaS szolgáltatók esetén, ahol auto-scale van, azaz megnőtt terhelés esetén új node-okat indítgat, annak csökkenése esetén állít le, vagy küld alvó státuszba.

Normál leállás egy webes alkalmazás esetén azt jelenti, hogy a folyamatban lévő kéréseket még kiszolgálja, de új kéréseket már nem fogad. Springes alkalmazások esetén normál leállás esetén (pl. a konzolban `Ctrl+C`, Unix fogalomrendszerben `SIGTERM`) szabályosan áll le  konténer, és meghívódnak a beanek destroy metódusai.

Háttérfolyamatok esetén ez már érdekesebb, hiszen itt tipikusan hosszan futnak a folyamatok, melyet meg akarunk szakítani, feltehetően nincs idő arra, hogy kivárjuk a végét. Itt a folyamatot megszakíthatóvá, valamint újraindíthatóvá kell tenni, azaz legyen reentrant. Ennek legegyszerűbb módja a tranzakciókezelés, hiszen a megszakított tranzakció nem fog commitot hívni, így olyan, mintha a folyamat el sem indult volna. Másik módja az, hogy a művelet, melyet a folyamat elvégez legyen idempotens, azaz bárhányszor is küldjük a rendszerre ugyanazt a műveletet, a rendszer mindig ugyanabban az állapotban maradjon.

Idempotens műveletek használatával például az elosztott tranzakciókezelést is megúszhatjuk. Vegyük azt az esetet, hogy egy adatbázisba írást és egy üzenet fogadást szeretnénk egy tranzakcióba tenni. Ezt vagy úgy tesszük meg, hogy egy elosztott (XA) tranzakcióba tesszük mind a két műveletet, vagy idempotenssé tesszük, és az üzenet fogadást tesszük későbbre. Ekkor ha az adatbázisba írás fut hibára, az üzenet visszakerül a sorba, és újra feldolgozásra kerül. Ha az üzenet fogadás fut hibára, igaz, hogy az üzenet visszakerül a sorba, de a következő feldolgozáskor nem fogja a rendszer állapotát módosítani, hiszen a művelet idempotens.

Háttérfolyamatok esetén hasonló megoldásokkal biztosítjuk azt is, hogy váratlan hiba esetén (akár pl. hardver hiba) se kerüljön inkonzisztens állapotba a rendszer, és a folyamat újra legyen indítva.

## Éles és fejlesztői környezet hasonlósága

Törekedni kell arra, hogy a különböző környezetek, beleértve a fejlesztői környezetet is a lehető legnagyobb mértékben hasonlítsanak egymásra. Nézzük, hogy melyek lehetnek a legnagyobb különbségek:

* Időbeli eltolódás: egy megírt kód lehet hogy hónapokkal később megy élesbe
* Személyi különbségek: a fejlesztő nem feltétlenül lát rá az éles környezetre és az ott használt eszközökre
* Eszközbeli különbségek: lehet, hogy a fejlesztő más, pehelysúlyúbb komponenseket használ, pl. operációs rendszert, adatbázist, stb.

Ezek a különbségek a modern módszertanokkal már jobban kezelhetőek, mint pl. a continuous delivery, DevOps. Szerencsére trend éles környezetekben is egyszerűbb eszközök használata. Valamint a már fentebb említett konténerizáció (Docker), és Infrastructure as Code, vagy Vagrant használata is sokat segít ezen.

Java környezetben ez amúgy is elterjedt, hogy a különböző háttérszolgáltatások elé egy absztrakt réteget húznak, így nem kell az implementációs különbségekkel törődni. Ilyen relációs adatbázisok kezelésénél a JDBC vagy JPA, message queue-k esetén a JMS, névszolgáltatók esetében a JNDI. Ha nincs is elterjedt szabvány, a Spring is alkalmaz ilyen absztrakciót, pl. a [cache esetén](http://docs.spring.io/spring/docs/current/spring-framework-reference/html/cache.html).

## Naplózás

Tömören az alkalmazásnak nem feladata a napló irányítása a megfelelő helyre, vagy a napló tárolása, kezelése, archiválása, görgetése, stb. Az alkalmazás írjon az `stdout`-ra, A környezet feladata ezen stream kezelése, és erre a streamre érkező napló bejegyzések továbbítása a megfelelő szolgáltatások felé, mint pl. [Elastic Stack](https://www.elastic.co/products), [Splunk](http://www.splunk.com/), stb.

A Spring Boot esetén SLF4J API-n keresztül érdemes naplózni, és alatta alapból Logback implementáció van, ami módosítható. Ez alapbeállításban az elvárt módon konzolra naplóz. A Log4J és Logback esetén is hozzászoktunk ahhoz, hogy ő küldi a naplót a megfelelő helyre un. appenderek használatával (pl. rolling file, syslog, stb.), un. push módon. Próbáljuk meg ezt elengedni, és engedni, hogy pull módon kezelje a környezet az `stdout` streamet.

Mindegyik naplózó keretrendszer hierarchiába gondolkodik, és a hierarchia részfáihoz adhatjuk meg a naplózás szintjét. Gyakran szükség lehet ezen szintek futás közbeni módosítására. Erre a Logback JMX protokollon keresztül ad lehetőséget. Ha ezt REST API-n keresztül szeretnénk elérni, akkor használható a [Jolokia](https://jolokia.org/) mely a JMX felé húz egy REST réteget.

## Felügyeleti folyamatok

Bizonyos esetekben szükség van felügyeleti, üzemeltetési folyamatok futtatására, a Twelve-factor app példaként az adatbázis séma migrációt hozza. Fontos, hogy ezek ne ad-hoc szkriptek legyenek, hanem az alkalmazással együtt kerüljenek verziókezelésre, buildelésre és kiadásra.

Ezen kívül preferálja azokat a környezeteket, melyek az adminisztrációs teendők ellátására REPL felületet adnak, ami valójában egy interaktív shell, mely lehetőleg valamilyen elterjedt protokollon keresztül (pl. ssh) elérhető.

Az adatbázis migrációra Java környezetben használható a [Flyway](https://flywaydb.org/) vagy [Liquibase](http://www.liquibase.org/), melyeket az alkalmazásba is beáagyazhatunk, így az alkalmazás maga végzi el a séma módosítását. Persze ki is lehet szervezni, akár parancssori alkalmazásként, vagy Maven/Gradle pluginként.

Java alkalmazásokhoz, sőt Spring Boothoz illeszthető shell a [CRaSH](http://www.crashub.org/), melyhez többek között lehet ssl-en keresztül kapcsolódni, és parancssorban lekérdezni olyan információkat, mint a JVM állapota (memóra, CPU, szálak, stb.), adatbázishoz kapcsolódni, sőt tetszőlegesen bővíthető, szóval saját parancsokat is implementálhatunk.
