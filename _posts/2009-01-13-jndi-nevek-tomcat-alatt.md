---
layout: post
title: JNDI nevek Tomcat alatt
date: '2009-01-13T00:15:00.007+01:00'
author: István Viczián
tags:
- Servlet
- IDE
- Java EE
- Tomcat
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Egy új projekt létrehozásakor a következő irányelveket próbálom
megvalósítani:

-   Az alkalmazás az verziókezelőből (már kizárólag Subversion)
    checkout-olva azonnal fordítható legyen, lehetőleg platformfüggetlen
    módon, parancssorból. Erre gyakran lehet szükség, ha csak aprót
    akarunk változtatni, és nem akarjuk elindítani az IDE-t, vagy egy
    szerver áll rendelkezésünkre grafikus felület nélkül. Jól jöhet
    continous integration esetén is.
-   Az alkalmazás fejlesztéséhez a lehető leggyorsabban hozzá lehessen
    kezdeni, azaz a checkout-olt projekt azonnal megnyitható, és
    futtatható legyen legalább egy fejlesztőeszközben. Ez jól jön, ha új
    fejlesztő áll csatasorba, vagy gép újrainstallálása után.
-   A projektet úgy elkészíteni, hogy fejlesztőeszköz független legyen
    sokkal kisebb rossz, mint egy fejlesztőt egy általa nem preferált
    IDE-re kényszeríteni.
-   Lehetőleg ugyanazon állományt lehessen telepíteni a különböző
    környezetekre, pl. fejlesztői, teszt és éles. A környezetfüggő
    beállítások az alkalmazáson kívül helyezkedjenek el. Ezzel kivédhető
    az, hogy különböző build folyamataink legyenek a különböző
    környezetekre, vagy a build után kelljen az alkalmazást még
    módosítanunk.

Egyszerű követelményeknek tűnnek, mégis gyakran látok ellenpéldát:

-   Sajnos több helyen még nem ismerik a verziókezelő fogalmát, a
    kódbázis még mindig megosztott könyvtárban tárolt.
-   Az alkalmazásnak rengeteg külső függősége van. Volt, ahol egy
    fejlesztő munkába állása, fejlesztői környezetének kialakítása több
    napot (!) vett igénybe, a gép beszerzésétől kezdve a különböző
    környezetek hozzáférésének megszerzéséig. A különböző "middleware"
    szoftverek felinstallálásával is rengeteg idő mehet el.
-   A fejlesztés fejlesztőeszközhöz van kötve.
-   A build folyamat vagy elágazik, vagy a build előtt figyelni kell
    arra, hogy a beállítások megfelelőek legyenek az adott környezetre,
    és úgy fusson le a build folyamat.
-   Az alkalmazáson a build folyamat után a fejlesztőnek, rosszabb
    esetben az adminisztrátornak még módosítania kell, pl. a WAR, EAR
    állományban lévő properties állományt (!) kell szerkesztgetni.

Szerencsére a célkitűzések megvalósítására a NetBeans fejlesztőeszköz,
az Ant build tool és a Tomcat konténer elegendő megoldást biztosít.

-   A NetBeans build folyamata Ant alapú, így ugyanaz a folyamat fut le
    fejlesztéskor az alkalmazás IDE-n belüli futtatásakor és build
    kiadáskor is.
-   A build kiadása fejlesztőeszközből és parancssorból is történhet.
-   A NetBeans a 6.1-től kezdve lehet könyvtárakat és JAR állományokat
    abszolút és relatív útvonallal is megadni. Az előző verziókban ugyan
    abszolút névvel tárolta, de ha a verziókezelőbe nincs betéve a
    nbproject\\private könyvtára (ez frissebbnél is javasolt), akkor
    relatív nevekkel próbálkozik, és a build folyamat menni fog
    parancssorból is.
-   A NetBeans projekt szerkezete nem elvarázsolt, az Eclipse meg
    kellően konfigurálható ahhoz, hogy ezt betöltse.
-   A Tomcat is tartalmaz egy csak olvasható JNDI InitialContext
    implementációt, melynek segítségével a web alkalmazásonként
    definiált JNDI fához tudunk hozzáférni. Erről fog szólni ez a poszt.

Sajnos sok projektben, de az Interneten található példa alkalmazásokban
is gyakran látom, hogy az alkalmazások, a környezeti beállításokat, és a
erőforrásokat az alkalmazáson belüli properties, vagy XML konfigurációs
állományokban tárolják. Így minden telepítés előtt gondoskodni kell
arról, hogy azok megfelelően át legyenek írva. Ilyenek pl. adatbázis
hozzáférések (pl. jdbc.properties), vagy elérési útvonalak, beégetett
e-mail címek, stb. Ennek kivédésére támogatja a Java EE szabvány annyira
a névszolgáltatásokat, a JNDI használatát. De nem csak
alkalmazásszerverekben, hanem a közkedvelt Tomcat web konténerben is
elérhető ez a szolgáltatás. Tegyük fel, hogy szükségünk van egy
adatbázis kapcsolatra, egy kapcsolatra a mail server felé, és egy
elérési útvonalra. Ezeket ne az alkalmazásunkba konfiguráljuk, hanem az
alkalmazáson kívül, a web konténerben. Ezt a
\$CATALINA\_BASE/conf/server.xml állományban a
&lt;GlobalNamingResources&gt; XML elem alatt tudjuk megtenni, a
következőképpen. A példában nézzük, hogy kell egy MySQL adatbázishoz
kapcsolódni.

```
<Resource name="JTechLogDS" auth="Container" type="javax.sql.DataSource"
        maxActive="100" maxIdle="30" maxWait="10000"
        username="jtechlog" password="jtechlog12" driverClassName="com.mysql.jdbc.Driver"
        url="jdbc:mysql://localhost:3306/jtechlog?autoReconnect=true"/>

<Resource name="JTechLogMailSession" auth="Container" type="javax.mail.Session" mail.smtp.host="mail.jtechlog.hu" />

<Environment name="JTechLogPath" type="java.lang.String" value="/opt/jtechlog" />
```

Ekkor ezek a nevek még csak globálisan vannak definiálva, ahhoz, hogy
ezek a webes komponensekből (pl. Servlet, JSP) is lokális névvel
elérhetőek legyenek, vagy az alkalmazás META-INF könyvtárában lévő
Tomcat specifikus context.xml konfigurációs állományban kell ezeket
definiálni, vagy a web.xml-ben kell ezeket megadni. Nézzük először az
első megoldást:

```
<?xml version="1.0" encoding="UTF-8"?>
<Context path="/jtechlog" >
<ResourceLink global="JTechLogDS" name="jdbc/JTechLogLocalDS" type="javax.sql.DataSource"/>
<ResourceLink global="JTechLogMailSession" name="mail/JTechLogLocalMailSession" type="javax.mail.Session"/>
<ResourceLink global="JTechLogPath" name="JTechLogLocalPath" type="java.lang.String"/>
</Context>
```

Ezzel ekvivalens megoldás, ha a logikai neveket a WEB-INF/web.xml
állományunkban definiáljuk a resource-ref XML elem alatt.

Az így, a JNDI-be regisztrált objektumokhoz Java-ból a következő módon
tudunk hozzáférni:

```
Context ctx = new InitialContext();

DataSource ds = (DataSource) ctx.lookup("java:comp/env/jdbc/JTechLogLocalDS");

Connection conn = ds.getConnection();

Session mailSession = (Session) ctx.lookup("java:comp/env/mail/JTechLogLocalMailSession");

String path = (String) ctx.lookup("java:comp/env/JTechLogLocalPath");
```

Látható, hogy a forráskódban a logikai neveket definiáljuk, a web
konténer server.xml fájljába a konkrét értékeket, és az alkalmazásban
szereplő context.xml konfigurációs állományban kötjük össze ezeket. A
lokális nevek elé mindig elé kell írni az ENC előtagot, a java:comp/env
szöveget. A resource-ref használatakor a res-ref-name elemben ezt nem
kell kiírni, a konténer automatikusan elé teszi.

Ezáltal megoldottuk azt, hogy mivel különböző környezetekben a Tomcat
server.xml állománya más konfigurációkat tartalmaz, az alkalmazásunkat
nem kell módosítani, és az összes környezetre telepíthető lesz.

A DataSource objektum egy factory, mely az adatbázishoz való kapcsolódás
paramétereit tartalmazza, és Connection objektumokat gyárt a
getConnection metódusának meghívásakor. Ez meg lehet valósítani úgy is,
hogy a kapcsolatokat egy példányfarmon (connection pool) tárolja,
valamint úgy is, hogy a visszaadott kapcsolat részt vehessen elosztott
tranzakcióban. Az adatbázis hozzáférésnek ez a preferált módja szemben a
DriverManager használatával. A példában láttuk, hogy mail session-t,
String-et lehetett tárolni, de lehetőség van egyéb egyszerű osztály
példányainak ilyen módon való konfigurálására, JMS erőforrások
definiálására, sőt saját objektum példányokat gyártó factory-kat is
implementálhatunk.

Link: [Tomcat 6.0 JNDI Resources
HOW-TO](http://tomcat.apache.org/tomcat-6.0-doc/jndi-resources-howto.html).
