---
layout: post
title: JNDI nevek EJB környezetben
date: '2009-01-10T00:06:00.007+01:00'
author: István Viczián
tags:
- Java EE
- Tomcat
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Nagyvállalati környezetben gyakran lehet hallani a név- és
címtárszolgáltatásokról (naming and directory services), de egy átlagos
felhasználó is nap mint nap találkozik velük. A név egy egyszerű
címtárszolgáltatás, mely név és érték párokat tartalmaz (általában
hierarchikus formában). Egy bonyolultabb címtárszolgáltatás egy névhez
több, akár különböző típusú információt is képes eltárolni. Ilyen
szolgáltatások pl. az ip-címek és domain-nevek összerendelését végző
DNS, a Windows Active Directory, OpenLDAP (ne felejtsük el, hogy az LDAP
nem egy konkrét termék, hanem címtárszolgáltatás elérésére szolgáló
protokoll), a CORBA névszolgáltatása, Java környezetben az RMI registry,
stb.

A címtárszolgáltatás lehetővé teszi egy névhez érték hozzárendelését
(un. bind művelet), név törlését, értékek módosítását, valamint név
alapján az érték lekérését (lookup művelet), és keresési, szűrési
lehetőséget. A címtárszolgáltatásban olyan értékeket érdemes eltárolni,
melyet egy rendszer vagy adminisztrátor definiál, és több rendszer is
használ (kliens). Ezeket az értékeket így nem kell minden rendszernél
külön-külön eltárolni, hanem mindig a szolgáltatástól lehet elkérni.
Ezért az érték módosításkor nem kell az összes klienst átírni,
konfigurálni, a szolgáltatásban tárolt érték átírásától kezdve az összes
kliens az új értéket fogja használni. Ezért ilyen szolgáltatások és az
adatbázisok közötti legnagyobb különbség, hogy az előbbiekben ritka a
módosítás művelet, és nagyon gyakori a lekérdezés.

A Java világban a JNDI API (Java Naming and Directory Interface API)
használható név- és címtárszolgáltatások elérésére. A JDBC-hez nagyon
hasonló, hiszen ez is egy API-t deklarál, alatta a megvalósítás
cserélhető a JNDI SPI-t (Service Provider Interface) megvalósító
providerek használatával, a JDBC driverrel analóg módon. A JNDI is már
a Java SE-ben megtalálható.

A Java EE az első verzióktól kezdve jelentősen támaszkodik a
névszolgáltatásra. Minden egyes EJB komponens kap egy egyedi nevet,
mellyel az alkalmazásszerver beregisztrálja a névszolgáltatásba. Ezen
kívül a külső erőforrásokat is egy JNDI névvel kell definiálni az
alkalmazásszerver adminisztrációjakor, és a különböző komponensek ezen a
néven tudják ezeket elérni. Ilyen erőforrások pl. a relációs adatbázisok
eléréséhez használt DataSource, az e-mail küldésére használható Session,
URL, az EJB komponensek környezeti bejegyzései (environment entries), az
aszinkron üzenetkezelésre szolgáló `ConnectionFactory` és `Destination`
leszármazottak (`Queue`, `Topic`), valamint bizonyos JPA fogalmak
(`EntityManagerFactory` - persistence unit, `EntityManager` - persistence
context), JCA fogalmak. Így ha változik pl. az adatbázis címe, akkor
csak az adminisztrációs felületen kell módosítanunk, a programot nem
kell változtatni (sem a forráskódot, sem programon belüli konfigurációs
állományt), hiszen ott csak JNDI név szerepel, a kapcsolódási
paraméterek az alkalmazásszerverben vannak konfigurálva. Ezek a
névszolgáltatásokban név (`String`), és az előbb említett Java osztályok
példány párokként jelennek meg.

Ezen példányokhoz a komponensek a JNDI környezetükön keresztül tudnak
hozzáférni, mely a `javax.naming.Context` interfész egy példánya. A JNDI
névszolgáltatással a kapcsolatot az `InitialContext` objektum
példányosításával tudjuk felvenni. A névszolgáltató elérési paramétereit
a következők szerint állapítja meg:

-   Az `InitialContext` konstruktorában paraméterként átadott `Properties`
    objektum alapján
-   Amennyiben paraméter nélküli konstruktort alkalmazunk, úgy a
    rendszer változók (system properties), vagy applet esetén az applet
    paraméterek alapján
-   A classpath-ban található `jndi.properties` állomány alapján

Ezen beállítások név-érték párokban tartalmazzák a névszolgáltatás
hozzáférésének paramétereit, pl. a névszolgáltató url-jét, a `Context`
objektumot létrehozó Factory osztály FQCN (fully qualified class name -
osztály minősített) nevét, biztonsági beállításokat, stb. Ezek közül a
leggyakoribbaknak (, mivel nem standardak) a nevük megtalálhatóak a
`Context` interfészben konstansként.

Amennyiben egy komponens tehát egy erőforrásra, vagy egy másik
komponensre referenciát akar szerezni, létrehoz egy `Context` objektumot
az `InitialContext` példányosításával, és a lookup művelettel lekéri név
alapján az érték, az objektum referenciát. Sokak számára ismerős lehet a
kód:

```java
import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
...
try {
 Context ctx = new InitialContext();
 DataSource ds = (DataSource) ctx.lookup("jdbc/JTechLogDS");
} catch (NamingException e) {
   LOGGER.error("Cannot lookup database connection.", e);
}
```

Itt nem adtunk meg az `InitialContext`-nek paramétereket, ugyanis az
alkalmazásszerverek jar-jában általában van egy `jndi.properties`, mely a
lokálisan futó alkalmazásszerverhez való kapcsolódást biztosítják.

A JNDI nevek amint a példában is láthatóak könyvtár struktúrába
szervezhetőek. Erre nincs szabvány, csak ajánlás, méghozzá a
`DataSource`-okat a `jdbc` könyvtárba, az EJB-ket a beans könyvtárba, a mail
sessionöket a `mail` könyvtárba, és a JMS connection factory-t és
destinationöket a `jms` könyvtárba.

A problémák az EJB komponensen körül kezdődnek, ugyanis az enterprise
alkalmazás telepítésekor ugyan az EJB konténer bejegyzi a
névszolgáltatásba az EJB-ket, de ezek a nevek (un. globális nevek) nem
standardak, a Java EE specifikációban nincsenek deklarálva,
alkalmazásszerverenként eltérhetnek. Ezért amennyiben egy alkalmazás
kliens, vagy egy másik EJB referenciát akar rá szerezni a lookup művelet
segítségével, az alkalmazásunk alkalmazásszerver függő lesz, és
elvesztjük a portabilitást. Hogy mik legyenek a globális nevek, azt
általában egy alkalmazásszerver függő telepítés leíróban is meg tudjuk
adni.

Másik hátránya, hogy a szép üzleti logikánk keveredik az infrastruktúrát
kezelő kóddal, hiszen amennyiben szükségünk van egy EJB komponensre vagy
egy erőforrásra, ilyen kódot kell alkalmaznunk. Ennek feloldására
találták ki a service locator J2EE design patternt, mely minden
komponens vagy erőforrás JNDI-ből való lekérdezésére egy külön metódust
biztosít, mely már castolva adja vissza a megfelelő példányt.

Az első problémát felismerve vezették be a ENC-t (environment naming
context), mely komponensenként (EJB komponens, web alkalmazás,
application client, és applet) biztosít egy JNDI fát, melyet a
`java:comp/env/` név alatt lehet elérni (ahol a `java` a séma, a másik két
szó a _component_ és _environment_ szavak rövidítése). Ezzel együtt
bevezettek egy indirekciót is. Ugyanis innentől kezdve a komponens
fejlesztőjének kell definiálni azt, hogy milyen erőforrásokra, és más
komponensekre lesz szüksége az általa fejlesztett komponensnek, ezek a
komponens készítője által definiált lokális, logikai nevek, melyeket
felhasznál a JNDI lookupjaiban, de a logikai nevekhez az alkalmazás
telepítőjének (deployer) kell konkrét globális JNDI neveket
megfeleltetnie. Szerencsére ez nem kötelező, ugyanis az
alkalmazásszerverek képesek arra, hogyha nincsen ilyen megfeleltetés,
akkor a globális JNDI nevek közül a vele megegyezőre fognak mutatni.
Amennyiben mégis módosítani akarja a telepítő, azt alkalmazás szerver
specifikus telepítési leírókkal (xml formátumú deployment descriptor)
tudja megtenni. Pl. ezzel valósítható meg az a típusú terhelés elosztás
is, hogy az EJB-ink egy részét az egyik alkalmazásszerverre, a másik
részét egy másik alkalmazásszerverre telepítjük, és a telepítésleíróban
a logikai névhez a távoli EJB elérését adjuk meg (lokális
transzparencia). Tehát a lekérés csak annyiban változik, hogy módosul a
JNDI név.

```java
try {
 Context ctx = new InitialContext();
 DataSource ds = (DataSource) ctx.lookup("java:comp/env/jdbc/JTechLogDS");
}
} catch (NamingException e) {
   LOGGER.error("Cannot lookup database connection.", e);
}
```

Ezen módszert alkalmazza az EJB 2.1 szabvány, ahol az EJB komponenseknek
a következő típusú logikai neveket definiálhatjuk az `ejb.xml`
állományban:

-   `ejb-local-ref`: lokális EJB-k
-   `ejb-ref`: távoli EJB-k
-   `resource-ref`: resource manager connection factory
    (`javax.sql.DataSource`,
    `javax.jms.QueueConnectionFactory`/`javax.jms.TopicConnectionFactory`,
    `javax.mail.Session`, `java.net.URL`)
-   `resource-env-ref`: resource (`javax.jms.Queue`, `javax.jms.Topic`)
-   `env-entry`: EJB környezeti bejegyzések

A resource manager connection factory egy olyan objektumot ad vissza,
melyekkel az erőforráshoz csatlakozó kapcsolatokat ad vissza. Ilyen pl.
a `DataSource`, mely `Connection`-öket ad vissza. Az `env-entry` közvetlenül
erőforrásokat ad vissza, és kizárólag JMS sorok (`Queue`) vagy témák
(`Topic`) definiálására szolgál. Az `env-entry`-vel egyszerű típusú
értékeket tudunk definiálni a deployment descriptorban, EJB-nként.
Globális értékek felvételére nincs lehetőség.

Szerencsére az EJB 3.0-ban erőteljesen használják az Inversion Of
Control és a Dependency Injection technikákat. Ezeket gyakran keverik,
ezért érdemes tisztázni, mit jelentenek. Az Inversion of Control jelenti
azt, hogy az egyik komponens nem közvetlenül hívja a másik komponenst,
hanem átmegy a hívás valamilyen köztes rétegen, EJB estében a
konténeren, mely képes egyéb műveleteket is elvégezni. A hívást egy
request interceptor kapja el, és továbbítja a komponensnek. A Dependency
Injection azt jelenti, hogy nem én kérek egy referenciát egy másik
komponensre, ha meg akarom hívni, hanem definiálom, hogy nekem szükségem
van egy másik komponensre, és azt a köztes réteg biztosítja a számomra.
Az EJB 2.1-ben még nekem kellett JNDI lookuppal lekérni a referenciát
(ezt hívják explicit middleware-nek is, ahol egy API-t használok a
middleware szolgáltatásainak eléréséhez), az EJB 3.0-ban viszont
annotációkkal tudom jelezni, hogy szükségem van egy referenciára
(transparent middleware-nek is nevezik).

Az EJB 3.0-ban a `@EJB` annotáció felel meg az `ejb-ref`, és `ejb-local-ref`
telepítés leíróbeli elemnek (más EJB-re való hivatkozás definiálása),
míg a `@Resource` annotáció a többi elemnek (erőforrásra való hivatkozás).
Mindkettőnek van egy `name` attribútuma, mellyel megadhatjuk az erőforrás
JNDI nevét. Itt csak ENC, lokális neveket lehet használni, és a konténer
automatikusan elé teszi a `java:comp/env/` szöveget. Szerencsére nem kell
mindig hozzá mappelnünk a globális nevet is, az alkalmazásszerverek
automatikusan hozzá tudják kötni az ugyanazon nevű globális névhez.
Lehetőségünk van persze globális JNDI nevek használatára is, ekkor
használjuk a `mappedName` attribútumot. Ekkor persze ne felejtsük el, hogy
ezek már alkalmazásszerver függő nevek. Pl. JBoss esetén teljes EAR
deploy-kor `[EAR név]/[osztály neve]/[interfész típusa]`, pl.
`JTechLogEarName/JTechLogBean/remote`, Glassfish esetén csak az osztály
minősített neve, azaz `com.blogspot.jtechlog.JTechLogBean`.

Ezek alapján használjunk mindenütt ENC nevet, és nem globális nevet a
hordozhatóság miatt. De hogyan tudunk egy kliens alkalmazásban ilyeneket
használni, hogyan kerülhetjük el a lookupot a globális névre?
Szerencsére az alkalmazásszerverek gyártói általában készítenek egy
pehelysúlyú kliens konténert is, ami nagyon alapvető funkciókkal
rendelkezik, de lehetővé teszi a kliens beillesztését a Java EE
architektúrába. Ez az ACC - application client container, mely
felelőssége a kliensben is a Dependency Injection megvalósítása (azaz
használhatunk `@EJB` annotációt), valamint a security context propagálása.
Futtatásához a kliens konténer JAR fájljait el kell helyezni a
classpath-ban, és az tartalmaz egy `jndi.properties` állományt is. Ahhoz,
hogy ne csak lokális, hanem távoli szerverhez is tudjunk kapcsolódni,
csak saját `jndi.properties` fájlt kell definiálnunk. Az kliens konténer
használata sem szabványos, de a kliens felépítése, amit futtat, az igen.

És végére a jó hír, hogy az EJB 3.1-ben a globális JNDI nevek is
standardizálva lesznek, méghozzá a következő formátumban:
`java:global[<application-name>]<module-name><bean-name>#<interface-name>`,
azaz az előző példa esetén
`JTechLogAppName/JTechLogEjbName/JTechLogBean\#JTechLog`.

Linkek: [Újdonságok az EJB
3.1-ben](http://www.theserverside.com/tt/articles/article.tss?l=NewFeaturesinEJB31-Part5),
[Glassfish EJB
FAQ](https://glassfish.dev.java.net/javaee5/ejb/EJB_FAQ.html), [EJB 3
portabilitási
problémák](http://www.adam-bien.com/roller/abien/entry/ejb_3_portability_issue_why)
