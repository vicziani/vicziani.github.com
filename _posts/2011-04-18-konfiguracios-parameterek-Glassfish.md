---
layout: post
title: Konfigurációs paraméterek EJB és web rétegben Glassfish alkalmazásszerveren
date: '2011-04-18T00:22:00.008+02:00'
author: István Viczián
tags:
- Servlet
- JNDI
- EJB
- Maven
- Java EE
modified_time: '2011-04-18T00:41:13.683+02:00'
thumbnail: http://2.bp.blogspot.com/-6e7EtuGMqJE/TatoRtBeklI/AAAAAAAAGSQ/WFTCrFa_F0A/s72-c/jndi_glassfish_0.png
blogger_id: tag:blogger.com,1999:blog-7370998606556338092.post-2002559707916709456
blogger_orig_url: http://www.jtechlog.hu/2011/04/konfiguracios-parameterek-ejb-es-web.html
---

Utoljára frissítve: 2015. február 3.

Technológiák: Glassfish 4.1, Maven 3.2.1, Java EE 7, EJB 3.1, JNDI

A [Konfigurációs paraméterek EJB és web rétegben WildFly
alkalmazásszerveren](/2011/02/27/konfiguracios-parameterek-WildFly.html)
posztban leírtam, hogyan lehet WildFly-ban konfigurációs paramétereket
felvenni, JNDI segítségével. Ebben a posztban leírom, hogy történik
mindez Glassfish alatt.

A példaprojekt [GitHubon
megtalálható.](https://github.com/vicziani/jtechlog-earconfig) Ahhoz,
hogy lefordítsuk, adjuk ki az `mvn package` parancsot a főkönyvtárban.
Futtatáshoz az `earconfig-ear/target` könyvtárban előállt
`earconfig-ear-1.0-SNAPSHOT.ear` fájlt kell a Glassfishre telepítenünk.
Persze ezt megoldhatjuk Mavenből is, ehhez először indítsuk el a
Glassfisht. Az `earconfig-ear/pom.xml` fájlban a `glassfish` profile-ban
van definiálva a telepítés, ezért ezzel kell indítani, valamint felül
kell definiálnunk jó pár paramétert (host, port, stb.). Ehhez átírhatjuk
a `pom.xml` fájlt, de a `-D` kapcsolót is használhatjuk a paraméterek
felülbírálásához. Tehát adjuk ki a `mvn -P glassfish cargo:deploy`
parancsot az `earconfig-ear` könyvtárban.

Érdemes megjegyezni, hogy Glasshfish 4.1-ben az adminisztrátori
felhasználónév `admin`, és nincs jelszó megadva. A Cargo nem enged
Glassfishre fájl másolásos telepítést, kizárólag az `asadmin` parancsot
hajlandó hívni. Viszont az `asadmin` parancsnak biztonsági okból már nem
lehet paraméterként átadni a jelszót, hanem fájlból olvassa fel. Ezért
eltesz egy állományt a temp könyvtárban, nálam Windowson a
`"C:\Documents and Settings\vicziani\Local Settings\Temp\cargo\conf\password.properties"`,
Linuxon a `/tmp/cargo/conf/password.properties` helyen. Volt olyan, hogy
hiába frissítettem a jelszót a `pom.xml`-ben, ez a fájl nem változott,
így nem sikerült a telepítés. Megoldásaként csak le kellett törölni ezt
az állományt. Még egy trükk. Ha nem állítottuk át a jelszót, hanem
üresen hagytuk a Glassfish telepítés után, akkor is meg kell adni a
Cargonak az üres stringet, különben nem sikerül a telepítés. Itt ha az 
alkalmazást frissíteni akarjuk, nem elegendő a
`cargo:deploy` parancs, hanem a `cargo:redeploy` parancs kell, mert a
Glassfish jelzi, hogy már van alkalmazás telepítve.

Glassfishben a paraméterek, azaz a rendszerparaméterek (system
properties) és a JNDI nevek megadása is háromféleképpen történhet: webes
adminisztrátori felületen, parancssori adminisztrátori felületen, vagy
konfigurációs állományban.

A system property megadása a webes felületen a server menüpontban a
Properties/System properties képernyőn lehetséges. Itt menet közben
tetszőlegesen is át lehet írni.

<a href="http://2.bp.blogspot.com/-6e7EtuGMqJE/TatoRtBeklI/AAAAAAAAGSQ/WFTCrFa_F0A/s1600/jndi_glassfish_0.png"><img style="display:block; margin:0px auto 10px; text-align:center;cursor:pointer; cursor:hand;width: 320px; height: 189px;" src="http://2.bp.blogspot.com/-6e7EtuGMqJE/TatoRtBeklI/AAAAAAAAGSQ/WFTCrFa_F0A/s320/jndi_glassfish_0.png" border="0" alt="Rendszerparaméter beállítása Glassfishen" /></a>
Parancssorban is fel lehet venni, és listázni.

    $ bin/asadmin create-system-properties \
     earconfig.system.property="Hello System Property!"
    Command create-system-properties executed successfully.

    $ bin/asadmin list-system-properties
    The target server contains following 1 system properties
    earconfig.system.property=Hello System Property!
    Command list-system-properties executed successfully.

A konfiguráció a
`\glassfish4\glassfish\domains\domain1\config\domain.xml` XML
konfigurációs állományba kerül bele.

A JNDI megadása a webes felületen a Resources/JNDI/Custom Resources
menüpontban lehetséges. Itt vegyünk fel egy új erőforrást a megfelelő
JNDI névvel. Több típus közül is választhatunk. Az értékek megadása un.
factory-kkal történik, és a Glassfish tartalmaz pár előre gyártott
factory-t: `PrimitiviesAndStringFactory`, `PropertiesFactory`,
`URLObjectFactory`. Amennyiben `String`-et akarunk felvenni, típusnál a
`java.lang.String`-et kell kiválasztani, a Factory Class ilyenkor
`org.glassfish.resources.custom.factory.PrimitivesAndStringFactory`
lesz, és fel kell venni egy property-t `value` névvel. Legyen az értéke
a `Hello JNDI!`.

<a href="http://4.bp.blogspot.com/-XY1WEM1doEM/TatoVkooENI/AAAAAAAAGSY/q21lhPVBunY/s1600/jndi_glassfish_1.png"><img style="display:block; margin:0px auto 10px; text-align:center;cursor:pointer; cursor:hand;width: 320px; height: 206px;" src="http://4.bp.blogspot.com/-XY1WEM1doEM/TatoVkooENI/AAAAAAAAGSY/q21lhPVBunY/s320/jndi_glassfish_1.png" border="0" alt="JNDI megadása Glassfishen" /></a>

URL esetén hasonló a helyzet, de a Resource Type `java.net.URL` és a
factory `org.glassfish.resources.custom.factory.URLObjectFactory`. Itt
property-nek a `spec`-t kell megadni, érték legyen pl.
`http://www.jtechlog.hu`. Properties megadása már érdekesebb. Itt is a
Resource Type-nál ki kell választani a `java.util.Properties`-t (, a
factory `org.glassfish.resources.custom.factory.PropertiesFactory`
lesz). Itt a propertiesnél megadhatjuk a név és érték párokat is.
Amennyiben egy speciálisat adunk meg
`org.glassfish.resources.custom.factory.PropertiesFactory.fileName`
néven, az értéknél szereplő properties fájlt fogja betölteni (, szemben
a dokumentációval, ami csak `fileName`-t ír). A fájlnév lehet abszolút,
vagy a Glassfish telepítési könyvtárához képest relatív. A properties
állományt szerkesztéskor szépen újra is olvassa. Amennyiben a fájlban és
a felületen is megadtunk kulcs-érték párokat, a Glassfish összefésüli
ezeket.

A JNDI bejegyzések ugyanúgy parancssorból is konfigurálhatóak. A
Glassfish egy régebbi verziójában volt webes JNDI browser felület. Ez
most egyelőre csak parancssorból elérhető.

    $ bin/asadmin create-custom-resource \
        --restype java.lang.String \
        --factoryclass org.glassfish.resources.custom.factory.PrimitivesAndStringFactory \
        --property value="Hello JNDI!" earconfig/string
    Custom Resource earconfig/string created.
    Command create-custom-resource executed successfully.

    $ bin/asadmin list-custom-resources
    earconfig/url
    earconfig/properties
    earconfig/string
    Command list-custom-resources executed successfully.

Az értékek ugyanúgy a
`\glassfish4\glassfish\domains\domain1\config\domain.xml` XML
konfigurációs állományba kerülnek. Akár saját factory osztályokat is
használhatunk.

Ezeket elvégezve az alkalmazás a `http://localhost:8080/earconfig/`
címen érhető el, és a következőt kell kiírnia:

    A projekt bemutatja, hogy hogyan lehet Java EE alkalmazásból konfigurációs paramétereket 
    beolvasni.

        * System property EJB rétegben (kulcs: earconfig.system.property): Hello \
    System Property!
        * Context lookup (JNDI) EJB rétegben (JNDI nevek: earconfig/string, \
     earconfig/url, earconfig/properties): [Hello JNDI!, \
    http://jtechlog.blogspot.com, {key=value, key2=value2, key1=value1}]
        * System property web rétegben (kulcs: earconfig.system.property): Hello System Property!
        * Context lookup (JNDI) web rétegben (JNDI nevek: earconfig/string, \
     earconfig/url, earconfig/properties): [Hello JNDI!, \
    http://www.jtechlog.hu, {key=value, key2=value2, key1=value1}]
