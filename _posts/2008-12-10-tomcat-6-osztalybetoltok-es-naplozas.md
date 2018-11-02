---
layout: post
title: Tomcat 6 osztálybetöltők és naplózás
date: '2008-12-10T22:38:00.005+01:00'
author: István Viczián
tags:
- Naplózás
modified_time: '2018-06-09T10:00:00.000-08:00'
---
Az [Apache Tomcat](http://tomcat.apache.org/) 6.0 implementálja a
Servlet 2.5 and JavaServer Pages 2.1 specifikációkat. További újítások:

-   Javított memóriafelhasználás
-   Haladó IO képességek
-   Átalakított fürtözés

Ezen kívül a naplózásban is történtek változások. Az 5.5-ös Tomcat-ben
jelent meg a juli csomag, melynek két Java osztálya két Logging API
osztályt származtatott le, az egyik a
org.apache.juli.ClassLoaderLogManager extends
java.util.logging.LogManager, valamint a org.apache.juli.FileHandler
extends java.util.logging.Handler. Az első főbb előnye, hogy
osztálybetöltőnként lehet konfigurálni a Java Logging API-t, azaz
logging.propperties állományt megadni, tehát web-alkalmazásonként külön
állományban szabályozható a naplózás. A FileHandler főbb újdonsága, hogy
{prefix}.{date}.{suffix} nevű állományhoz adja hozzá a napló
bejegyzéseket.Az 5.5-ös osztálybetöltő-hierarchiája a következőképp néz
ki:

![Tomcat 5.5 osztálybetöltők](/artifacts/posts/2008-12-10-tomcat-6-osztalybetoltok-es-naplozas/classloader_5_5_b.png)

Ahol minden alant lévő osztálybetöltő által betöltött osztály hozzáfér a
felette lévő osztálybetöltő által betöltött osztályokhoz. A Catalina
osztálybetöltő által betöltött osztályokhoz a web-alkalmazások nem
férnek hozzá.

A 6-os Tomcat módosított a naplózáson, és az osztálybetöltők
hierarchiáján is. Egyrészt a juli csomagban megjelent egy logging csomag
is, mely a következő négy osztályt tartalmazza:

-   DirectJDKLog
-   Log
-   LogConfigurationException
-   LogFactory

Ezek valójában a [Commons Logging](http://jakarta.apache.org/commons/logging/) csomag
megfelelő osztályai, azzal a különbséggel, hogy egyrészt más a csomag
nevük, valamint a Commons Logging-gal ellentétben nem dinamikusan
választja ki a konkrét naplózó implementációt, hanem automatikusan a JDK
4-ben bevezetett Java Logging implementációt használja. Az Apache Tomcat
minden osztálya így a org.apache.juli.logging.LogFactory osztályt (mely
DirectJDKLog osztályt gyárt), és Log interfészt használja. Ezáltal
gyorsabb, egyszerűbb, átláthatóbb.

Ahhoz, hogy cseréljük a naplózó implementációt (pl. Java Logging API
helyett Log4J-t használjunk), le kell cserélnünk a bin könyvtár
tomcat-juli.jar állományát, méghozzá azzal, melyet forrásból, az
extras.xml Ant build fájl felhasználásával készíthetünk. Ez letölti a
Commons Logging implementációt, mindenhol kicseréli a csomagnevet
org.apache.commons-ról org.apache.juli-ra, és így egy olyan könyvtárhoz
jutunk, ami már dinamikusan tölti be a megfelelő naplózó implementációt.

Ezzel egyetemben a az osztálybetöltő-hierarchia is változott,
egyszerűsödött:

![Tomcat 6 osztálybetöltők](/artifacts/posts/2008-12-10-tomcat-6-osztalybetoltok-es-naplozas/classloader_6_b.png)

Azon kívül hogy a ClassLoaderLogManager osztálybetöltőnként tárolja a
logger példányokat, kiegészítette a konfigurálási lehetőségét is a Java
Logging API-nak a következőkkel:

-   képes különböző napló bejegyzéseket külön fájlba is kiírni, ezt úgy
    oldja meg, hogy egy osztályhoz több prefixet is lehet írni
-   logger-hez handler-t lehet megadni a loggerName.handler property
    beállításával
-   alapértelmezésben a logger nem delegál a szülőjének handler-e felé,
    ezt állítani a loggerName.useParentHandlers property-vel lehet
-   a root loggernek is lehet megadni handler-t a .handlers property
    használatával
-   kicseréli a property állományban betöltéskor a
    \${systemPropertyName} mintákat, a kapcsos zárójelek között
    megnevezett rendszerváltozók értékeivel

A konfigurációs állományában (/conf/logging.properties) a handler-eket a
következőképp lehet megadni:

    handlers = 1catalina.org.apache.juli.FileHandler,
    2localhost.org.apache.juli.FileHandler,
    3manager.org.apache.juli.FileHandler,
    4admin.org.apache.juli.FileHandler,
    5host-manager.org.apache.juli.FileHandler,
    java.util.logging.ConsoleHandler

A ClassLoaderLogManager readConfiguration metódusa ezt úgy oldja fel,
hogy az első pontig lévő részt (prefix) levágja (ez csak az egyediséget
biztosítja), és a maradék osztályt példányosítja. Persze a további
konfigurációt még a prefixszel együtt olvassa be (level, handlers).

A logging.properties-ban root handler-nek a
1catalina.org.apache.juli.FileHandler és a
java.util.logging.ConsoleHandler van beállítva. Minden előtte el nem
fogott naplózás ide kerül.

A különböző, előre telepített webes alkalmazások (manager,
host-manager), valamint később telepíthető alkalmazás (admin) a
ServletContext log metódusát hívja, ami a Tomcat alapértelmezett
implementációját használja, ami a
org.apache.catalina.core.ContainerBase.\[engine\].\[host\].\[/context\]
(pl.
org.apache.catalina.core.ContainerBase.\[Catalina\].\[localhost\].\[/manager\])
log-gal naplóz. Azon alkalmazások, melyek ugyanezen metódusokat
használják naplózásra, ha naplóznak, annak a napló bejegyzéseit a
2localhost.org.apache.juli.FileHandler handler kapja el, ilyen lehet pl.
a balancer.
