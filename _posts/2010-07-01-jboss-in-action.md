---
layout: post
title: JBoss in Action
date: '2010-07-01T00:54:00.004+02:00'
author: István Viczián
tags:
- open source
- ha
- biztonság
- cluster
- Java EE
- könyv
modified_time: '2018-06-09T10:00:00.000-08:00'
---

A JBoss AS 5 a jelenlegi egyik legelterjedtebb alkalmazásszerver,
köszönhetően annak, hogy időben jelentkeztek egy ingyenes, nyílt
forráskódú Java EE implementációval, alternatívát teremtve a
kereskedelmi, drága, de nehézkes alkalmazásszervereknek. Jeleleg is
sokan használják arra, hogy JBoss-ra fejlesztenek, kihasználva annak
relatív gyorsaságát, könnyű telepíthetőségét és egyszerű felépítését.

A Java EE megjelenése óta az alkalmazásszerverek a senki földjét
képviselik. A fejlesztők hajlamosak adottságnak tekinteni, és megírják
az alkalmazásukat a standardok felhasználásával, és akkor foglalkoznak
az alkalmazásszerverrel, ha valami probléma adódik vele, pl. az
osztálybetöltők táján. Az üzemeltetés viszont szeretne úgy tekinteni rá,
mint az alkalmazás része, annak futtatókörnyezete, és nem foglalkozni
vele, hiszen mit is érdekli, hogy mi is az a JMS, EJB, connection pool,
HTTP Connector és így tovább. Így tehát az alkalmazásszerver telepítése,
üzemeltetése, netalántán üzemeltetése általában vagy egy üzemeltetői
hajlamokkal megáldott fejlesztőre marad, vagy egy szorgalmas, ezen
technológiákba is belelátni kívánó üzemeltető végzi. Sajnos gyakori
probléma, hogy nincsenek a szerepkörök, jogosultságok, de legfőképpen a
felelősségi körök a megfelelőképp kiosztva, dokumentálva. Legtöbbször az
alkalmazásszerver üzemeltetése szükséges rosszként nyomja valakinek a
vállát.

Ezen szakadék áthidalását tűzte ki célul a [JBoss In
Action](http://www.manning.com/jamae/) című könyv, mely a JBoss
alkalmazásszerver üzemeltetésének, konfigurálásának leírását tűzte ki
célul, és szól egyaránt a fejlesztőkhöz és üzemeltetőkhöz is. Teszi ezt
mindazzal, hogy elmagyarázza a szükséges fejlesztői fogalmakat (pl. Java
EE, EJB, JMS, WAR, EAR,stb.), de elmagyarázza a gyakori üzemeltetési
fogalmakat is, mint load balancing, session affinity, scale up/out, SLA,
stb (látható, hogy különösen a cluster-ezési részben). Ebben a posztban
megint keverni fogom a könyvkritikát, valamint a véleményemet a JBoss
alkalmazásszerverről magáról.

<a href="/artifacts/posts/2010-07-01-jboss-in-action/JamaeJohnson_b.jpg" data-lightbox="post-images">![JBoss In Action](/artifacts/posts/2010-07-01-jboss-in-action/JamaeJohnson.jpg)</a>

A könyv írását akkor fejezték be véglegesen, amikor a JBoss AS 5.0 CR2
állapotban volt. A különböző kiadások módosításait (Beta2, 3, 4, CR1)
már addig is többször át kellett vezetniük a könyvben. Viszont a B
függelék tartalmazza a GA-ban történt változásokat, valamint
megtalálhatók a [könyv honlapján
is](http://www.manning.com/jamae/excerpt_updates_errata.html) a hibák és
változások, melyeket érdemes elolvasni, komoly változások is történtek
pl. a konfigurációs állományok és a naplózás körül is.

A könyv felépítése nagyon logikus és áttekinthető. Négy nagyobb részből
épül fel, melyeket kisebb fejezetekből állnak.

Az első rész egy bevezetés, mely azzal indul, hogy miért érdemes a JBoss
alkalmazásszervert választani. Remélhetőleg az olvasó ezzel már
tisztában van, és ezért veszi kezébe a könyvet. Röviden: nyílt
forráskódú, annak minden előnyével. Leírja, hogy mik az előfeltételek
(JDK) hogyan kell telepíteni az alkalmazásszerver (rendkívül
szimpatikus, hogy ki kell csomagolni a zip-et, és a saját könyvtárán
kívül sehova máshova nem dolgozik), és nagyon részletesen kifejti,
milyen könyvtárakból áll, és azokban milyen fontosabb állományok
találhatóak. Itt részletezi a konfigurációk szerepét is. Egy
konfiguráció gyakorlatilag egy könyvtár, mely az összes konfigurációs
állományt, telepített szolgáltatást és alkalmazást tartalmazza.
Konfigurációt választani egyszerűen úgy lehet, hogy a -c kapcsoló után
beírjuk a könyvtár nevét. Saját konfigurációt létre lehet hozni egy már
létező konfiguráció (öt előregyártott van a JBoss-ban, ebből kettő az
5.0-ban jelent meg) lemásolásával, és ebből lehet eltávolítani a nem
használt szolgáltatásokat (ezt hívja slimming-nek). Nagyon hatékony
megoldás. Leírja gyorstalpaló módon, hogy gyorsan sikerélményünk legyen,
hogy hogyan kell indítani, leállítani az alkalmazásszerver, és hogyan
kell alkalmazást telepíteni és eltávolítani.

A következő rész az alkalmazásszerver részletes bemutatását tűzte ki
célul. Itt leírja a microcontainer-t, mely az 5.0-ás JBoss-ban jelent
meg, és az előző verziókban lévő JMX microkernel-t. Amíg az utóbbi az
MBean-eken alapul, addig a modernebb microcontainer már az aktuális
divatnak megfelelően egy Inversion of Control container, mely POJO-kat
alkalmaz. Sajnos az 5-ös verzióban még nem sikerült minden komponenst
átírni erre, ezért a microcontainer-en fut a JMX kernel is, és azon az
át nem írt szolgáltatások, mely szerintem egy felemás felépítést
kölcsönöz az egésznek, valamint a konfigurációkon is látszik, hogy
melyik az ami az új elv szerint, és melyik az, amit a régi struktúrában
kell konfigurálni. Hasonló felemásság figyelhető meg a JBoss build
folyamatában is, ugyanis átálltak Maven-re, de bizonyos részeket még nem
sikerült beilleszteni, így azok még mindig Ant alapúak. A JBoss
üzemeltetése során szoros barátságba kell kerülnünk a JMX-szel, ugyanis
sok mindent ezen keresztül lehet futás közben lekérdezni és buherálni, a
könyv is nagyszerűen részletezi, elérését a webes JMX konzolból,
valamint a parancssoros Twiddle eszközből. Furcsa, de nem írja, hogy a
JConsole-ból úgy érhetjük el az MBean-eket, hogy a remote process-t
választjuk, és a következő URL-t írjuk be:

    service:jmx:rmi://127.0.0.1/jndi/rmi://127.0.0.1:1090/jmxconnector

Azért furcsa nekem ez a JMX mánia, mert a mai napig nem láttam
használható JMX konzolt (a parancssorosak a legjobbak!), valamint vagy
nem jön át a tűzfalon (ha RMI felett megy), vagy rusnya és bonyolult
telepíteni, ha webes, és az alkalmazásszerveren fut az alkalmazás
mellett.

Részletesen ír még a naplózásról, könyvtárakra hivatkozó system
property-kről, és a system property-k beállításáról. A "Deploying
applications" fejezetből kiderül hogy nem csak a standard .ear, .war,
.jar, .rar típusú alkalmazásokat képes telepíteni a JBoss, hanem maguk a
deployer-ek is plug-and-play szolgáltatások, melyekből rengeteg van, így
a hozzájuk tartozó telepíthető komponensekből is. Ide tartoznak pl. a
.aop (aspect oriented), .sar (service), .zip, .wsr (web szolgáltatás),
.bsh (bean shell), stb. Itt írja le a classloader-ek működését,
melyekről saját bevallása szerint is keveset ír, de mégis sok hasznos
információ megtalálható itt. Olvashatunk a class loader repository-król,
melyekkel megoldható, hogy az alkalmazások a saját osztályaikat előnyben
részesítség (scoping), a delegációról, valamint különösen hasznos, hogy
leírja a legtipikusabb hibákat és azok megoldásait (pl. hiányzik egy
osztály, sérült egy archív, vagy egy JAR két példányban van a
classpath-ban, és ezért ClassCastException jön). Itt írja le, hogyan
kell DataSource-t vagy Hibernate archive-ot installálni. A következő,
"Securing applications" fejezet a biztonsági alapfogalmakat írja le. A
biztonság a JBoss SX szolgáltatásra épül, amiben security domain-eket
lehet definiálni, és azokhoz login module-okat rendelni. Persze ehhez
is, mint mindenhez, JNDI-n keresztül fér hozzá az alkalmazás, megoldva a
fejlesztő és az üzemeltető közötti izolációt. A fejezet ismerti az
alapfogalmakat, mint autentication és authorization, principal,
credential. Valamint érthető folyamatábrán el is magyarázza a
folyamatot. Valamint itt tér ki arra is, hogy hogyan lehet a kapcsolatot
titkosítani, megmagyarázza a PKI-t is, a szerver és kliens oldali
tanúsítványok szerepét is. Megmutatja, hogyan lehet a felhasználók és
szerepkörök adatait fájlból, adatbázisból, LDAP-ból és tanúsítványokból
betölteni. A biztonság a könyv egyik nagy erőssége, ugyanis erre az
összes fejezetben visszatér, a webes alkalmazások biztonságára külön
fejezetet szán, és részletesen ír az EJB-kkel, JMS-sel, web
szolgáltatásokkal és portletekkel kapcsolatos biztonsági
szolgáltatásokról is.

A következő nagy fejezet a különböző szolgáltatásokról ír, melyből első
a JBoss Web Server, ami nem más, mint egy Apache Tomcat. A
konfigurációja nem is tér el attól, a server.xml-ben lehet beállítani a
legtöbb dolgot, mint a virtual host-ot, a használt port-okat, a HTTP és
AJP connector-t, a HTTPS-t, thread pool-t, timeout-okat és várakozási
sorokat, valve-okat (kérések elkapására, használatos naplózásra,
ip-címek kitiltására, SSO-ra, stb.). Részletesen ír a context-ről és a
ROOT alkalmazásról. A következő fejezet ír a web alkalmazások
biztonságáról, a basic, digest, form és certificate alapú autentikációs
módokról és standard valamint a gyártófüggő deployment descriptor-okról,
és leírja a https konfigurációját, a szerver és kliens oldali
tanúsítványokat és a keytool használatát. A következő fejezet az
EJB-kről (valamint a JPA-ról) szól, itt talán túl részletesen belemegy
forráskód szinten, hogy hogy is néz ki egy ilyen alkalmazás. A
mintapéldák nem a könyv erősségei, szerintem feleslegesen hoz több, nem
kidolgozott példát, elég lett volna egy alkalmazáson bemutatni a
fogalmakat. Itt viszonylag kevés konfigurációs lehetőségről ír, ebből
hasznos talán a JNDI nevek konfigurálása, a session bean-eknél a pool és
az aktiváció/passziváció finomhangolása. Érdekes lehetőség a JMX service
object, mellyel nagyon egyszerűen, a @Management és @Service JBoss-os
annotációkkal tudunk JMX MBean-eket létrehozni. Érdekes lehet még, hogy
a EJB-k közötti távoli metódushívás protokollját lehet változtatni, pl.
HTTP-n, de akár SSL-len is át.

Itt ír még a JMS-ről, és nem point-to-point, hanem publish and subscribe
példát hoz. Amúgy nagyon tetszetős az a megoldás a JBoss-ban, hogy
DataSource-t, JMX Connection Factory-t és Destination-t, Mail Session-t
külön XML fájlokban lehet konfigurálni, és annak létrehozásával
futásidőben telepíteni, törlésével undeploy-olni. A konfigurációs
lehetőségekről itt sem ír sokat, sajnos sokat áldoz a mintapéldára.
Ugyanez igaz a web szolgáltatásokra is. Mindkét esetben a biztonság
azért rendesen ki van fejtve. A következő fejezet a JBoss Portal-ról
szól, ami azonban a JBoss Portal 2.6.4-ről szól, mely a JBoss AS 4.2.2-n
fut. Bevallom, ezt a fejezetet át is ugrottam. A könyvre amúgy jellemző,
hogy referencia jelleggel is forgathatjuk, mindig elővehetjük azt a
fejezetet, melyre szükségünk van.

A Going to production első fejezete a cluster-ezésről szól. A
cluster-ezés a JGroups-ra és JBoss Cache-re épül. Lehet konfigurálni
session replikációt, lehet cluster-ezni az EJB-ket, entitásokat és fel
lehet állítani magas rendelkezésre állású JNDI-t is. Alapvetően nem
hiszek az állapottal rendelkező alkalmazásokban, így HA-nál elegendőnek
szoktam érezni a terheléselosztást, ha állapot van, akkor sticky
session-nel. Lehetőleg kerülöm az állapot replikálást. Nagyságrendekkel
bonyolítja ugyanis az architektúrát és hibakeresést. A két legérdekesebb
fejezet számomra a Tuning the JBoss Application Server és Going to
production volt. Itt először olyan aranyszabályokat ír le, melyeket sok
mindenkinek meg kéne tartania a performance tuning-ra vonatkozóan. Ilyen
pl. hogy induljunk egy olyan állapotból, amit reprodukálni tudunk, azaz
a terheléses tesztelést lefuttatva mindig ugyanazt az eredményt kapjuk.
Utána minden lépésben egyszerre csak egy dolgot változtassunk. Valamint
ne megérzéseinkre, hanem a mérésekre hagyatkozzunk. A
teljesítményfokozást az alapoktól, a hardvertől, OS-től kezdi. Még
alkalmazásszerver függetlenül leírja a Java memóriahasználatát és a GC
működését. Ez volt az egyik legjobb írás, amit valaha erről a témáról
olvastam. Se nem túl mély, se nem túl általános, és sok hasznos
gyakorlati tanácsot is leír, mind monitorozásra vonatkozóan, mind azzal
kapcsolóan, hogy hogyan és mi alapján állítgassuk a titokzatos -Xms,
-Xms, --XXNewSize, --XXMaxNewSize, --XX:NewRatio, stb. parancssori
paramétereket. Talán az AS hangolásáról sem ír ilyen jól, ahol a
DataSource-okat, HTTP thread pool-t és JSP servlet fordítást említi. Ami
nekem külön tetszik, mert jó ötlet, hogy abban az esetben, ha egy gépen
több példányt akarunk futtatni, akkor nem kell az összes konfig
állományban átírni az összes port-ot, hogy ne legyen port ütközés, hanem
a PortBinding-nál meg lehet adni egy increment paramétert, mely az
összes port-ot megemeli az itt megadott számmal. Esik itt még szó arról,
hogy hogy lehet a JBoss-t szolgáltatásként futtatni Windows-on és
Linux-on, valamint hogyan cserélhetjük le a beépített Hipersonic SQL-t
egy másik adatbázisra.

Az első függelék leírja a JNDI nevek problémáját, hogy a globális JNDI
neveket a Java EE 5 szabvány még nem rögzítette, melyről már [én is
írtam](/2009/01/09/jndi-nevek-ejb-kornyezetben.html). Erre javasol egy
megoldást. A második függelék a 5.0 GA-ban történt változásokról ír.
Esik itt szó a webes adminisztrációs felületről, ami régóta hiányzik a
JBoss-ból (hát a mostani sem egy lenyűgöző megoldás), a common/lib
könyvtárról, a profile service repository-ról, konfigurációs állományok
helyének módosításáról és a naplózás változásairól.

Összességében a könyv nagyon nehéz feladatra vállalkozott, hiszen a
fejlesztőknek sok alapvető fogalmat magyaráz el, melyet átugorhatnak, az
üzemeltetőknek viszont nem tudom mennyire van értelme ennyire
belemászniuk a forráskódokba. Az biztos, hogy több szép megvillanás van
a könyvben melyek miatt mind a két tábornak érdemes, ha nem is az
elejétől a végéig átolvasnia, de legalább az érdekes fejezeteket
átlapoznia.
