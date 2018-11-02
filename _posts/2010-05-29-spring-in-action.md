---
layout: post
title: Spring In Action
date: '2010-05-29T00:31:00.005+02:00'
author: István Viczián
tags:
- Spring
- könyv
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Most fejeztem be a [Spring In Action](http://www.manning.com/walls3/)
könyv olvasását. Bár a poszt alapvetően könyvismertetés, kitérek néhány
itt megismert technológiára is. A könyv második kiadása a Spring 2.0-val
foglalkozik. Előkészületben van a harmadik kiadás is, mely a 3.0-ás
verzióval fog foglalkozni.

![Spring In
Action](/artifacts/posts/2010-05-29-spring-in-action/walls3_cover150.jpg)

A könyv bevezetője alapján az In Action egyrészt utal arra, hogy
példákon keresztül mutatja be a Spring használatát, másrészt a
fejlesztők elfoglalt emberek lévén nem tudják végigolvasni a könyvet,
csak belelapoznak, olvasság kicsit, majd leteszik.

A könyv három fő részre tagolódik, úgymint a Core Spring, Enterprise
Spring és Client-side Spring.

A Core Spring négy fejezetet tartalmaz, melyből az első fejezet egy
rövid elméleti bevezető, mely leírja az alapfogalmakat, úgymint
dependency injection, valamint aspect-oriented programming (AOP). A
második és harmadik fejezet leírja az alap és haladó bean wiring
koncepciókat. A negyedik fejezet kizárólag az AOP-ról szól.

Az Enterprise Spring a különböző Enterprise technológiák illesztéséről
ír, mint perzisztencia, adatbáziskezelés (JDBC, Hibernate, JPA, iBatis),
tranzakciókezelés, biztonság, távoli elérés (RMI, Hessian/Burlap,
HttpInvoker, web-szolgáltatások), JMS, EJB integráció, JNDI, JavaMail,
ütemezés (Timer és Quartz) és JMX.

A client-side Spring ismerteti a Spring MVC-t, a view technológiák
integrálását (JSP, Velocity, Freemarker, Tiles), de leírja, hogy kell
nem HTML tartalmat megjeleníteni, pl. Excel, PDF, de akár saját
formátumot is, amihez a Spring nem nyújt alapból támogatást, mint az RSS
feed. Bemutatja a Spring Web Flow-t, és egyéb web framework-ök
illesztését is (Struts, WebWork2/Struts 2, JSF, DWR).

A függelékek egy része a könyvben található, mely leírja egy Spring-es
projekt felépítését, valamint a tesztelést. Másik része a web oldalon
érhető el, pl. portletek és különböző referenciák (XML, JSP tag library,
Web Flow), valamint hogy hogyan lehet saját custom element-eket
definiálni (saját névtérrel rendelkező saját tag-ek a konfigurácós
állományban). Ez egy [ingyen letölthető 100 oldalas
PDF](http://www.manning.com/walls3/WebXtras.pdf), mely már nem fért a
könyvbe.

Ebből a rövid tartalomjegyzékből is látható, hogy a könyv irgalmatlanul
széles témakört ölel fel, nemhiába 730 oldalas. Nem csak a Spring-gel
foglalkozik, hanem áttekintő szinten magyarázza a Spring-be integrálható
technológiákat is, pl. a Spring messaging fejezetben elmagyarázza, hogy
mi az a JMS, de ez igaz kivétel nélkül minden fejezetre is. Nem csak a
Spring-ben található komponenseket említi, hanem olyan, Spring
kiegészítéseket is megemlít, mint az autentikációért és authorizációért
felelős Spring Security-t, a contract-first fejlesztési módszert
támogató Spring-WS-t, valamint a bonyolultabb képernyőfolyamokkal
rendelkező alkalmazások fejlesztésére javasolt Spring Web Flow-t.

A könyv alapvetően kezdőknek szól, minden technológiát megpróbál
érinteni, de a Spring alapvető fogalmain kívül mindent csak felületesen
tud érinteni, ezért a referencia használata e mellett a könyv mellett is
kötelező. Bár több éve használok Spring-et, mégis bőven tudott a könyv
újdonságokat mutatni. Ilyen pl. az Advanced bean wiring fejezetben leírt
parent és child bean-ek deklarálási lehetősége, a method injection,
postprocessing beans, event-ek, stb. Megemlíti, hogy hogyan lehet Ruby,
Groovy és BeanShell szkriptnyelveket használni. Ezt a fejezetet érdemes
haladó Spring fejlesztőknek is elolvasniuk, bár javasolt a Spring
függőséget minimálisra csökkenteni az alkalmazásainkban.

Külön meglepetés volt, hogy a perzisztenciánál ír a cache-elésről is. A
tranzakciókezelésről szóló fejezet kiváló.

A könyv természetesen sok helyen von párhuzamot az EJB technológiával,
de egyáltalán nem bántó módon teszi ezt. Az EJB-től mindig is irigyeltem
a lokális transzparencia fogalmát, azaz, hogy az alkalmazásomat szét
tudom vágni, és külön node-okra tenni a különböző funkciókat, skálázva
ezzel az alkalmazást. Ezt programozási oldalról minimálisan kell
támogatni (remote interfész használatával), alapvetően konfigurációval
megoldható. Természetesen a Spring is nyújt erre megoldásokat, de nem
csak az alkalmazásszerverek által használt RMI-t lehet protokollként
választani, hanem a Hessian, Burlap és HttpInvoker eszközöket is, melyek
bevallom, számomra teljesen ismeretlenek voltak. A Hessian és a Burlap
is egy Caucho Technology által kifejlesztett megoldás távoli
metódushívásra, csak míg az RMI-nél a HTTP-n keresztüli kommunikációhoz
trükközni kell, addig ezen megoldások natívan azt használják. A Hessian
binárisan viszi át az adatot (RMI-vel ellentétben programozási nyelv
független módon), a Burlap XML-ben. A HTTPInvoker a Spring saját
megoldása, amikoris a kommunikáció HTTP-n zajlik, de az adatok
átvitelére a Java szerializációt használja. A transzparenciát az
interfészekkel való programozás biztosítja, ahol szerver oldalon egy
Exporter-t kell használni, mely a szolgáltatást valamelyik módszerrel
elérhetővé teszi, míg a kliens oldalon az interfész alapján proxy
generálódik. Ugyanígy lehet XFire web szolgáltatásokat, és klienseket is
definiálni. A legszebb az egészben, hogy protokollok között átállni
egyszerű konfiguráció módosítással lehet. A metódushívás alatti
technológia kódszinten szinte észrevehetetlen.

Megemlíti a Lingo-t is, mely szintén egy remoting technológia, távoli
metódushívásra, ahol az átviteli közeg a JMS.

A Spring in Action könyv egy remek bevezető a Spring-gel foglalkozni
kívánó Java programozóknak, részletesen elmagyarázza a dependency
injection és aspect-oriented programming fogalmakat. A bevezetőben
megfogalmazott elveknek a könyv tökéletesen meg is felel, amennyiben
kitaláljuk, hogy egy technológiát használni szeretnénk, vegyük le a
polcról a könyvet, és olvassuk el az oda illeszkedő fejezetet. Annak
ellenére, hogy minden fejezet elején van egy vicces sztori, egy
valóvilág-beli párhuzam a megértést segítendő, a könyv nem javasolt
egyszeri végigolvasásra. Haladó Spring fejlesztőknek az Advanced bean
wiring fejezetet javaslom, és azon fejezeteket, melyekben említett
technológiákat még nem használaták, de be szeretnének vezetni.

A könyv hibája, hogy sokat markol, de keveset fog. Minden technológiát
be szeretne mutatni, mindegyikről ír bevezetőt, hogyan kell
bekonfigurálni Spring alatt, szóval csak a felszínt karcolja. Nagyon
egyszerű alkalmazás fejlesztését viszi végig, mely ez esetben egy
autósoknak szóló alkalmazás. Szerencsére nem mindig ragaszkodik hozzá.
Nagyon hiányoztak a könyvből azok a fejezetek, amelyek gyakorlati
tanácsokat adnak. Az EJB könyvek mindegyikében van egy olyan fejezet,
hogy hogyan használjuk JÓL az EJB-t, hogyan lehet gyors alkalmazásokat
írni, performance tuning, stb. Ebből a könyvből teljesen hiányoznak a
konvenciók, bevált gyakorlatok, gyakorlati trükkök-tippek.

Nekem nagyon kilóg a Spring Web Flow fejezet is a könyvből. Én még nem
használtam, de ezek után nem is fogom. Az alapprobléma alapvetően az,
hogy a webes alkalmazásunkba be vannak égetve a controller-ekbe a view
nevek, valamint a view-kba url-lel (linkben vagy form action
paraméterben) pedig hogy milyen oldalakra lehet továbbmenni. Így a
folyamat szét van szórva. Ugyan van egy AbstractWizardFormController, de
erre inkább úgy tekintsünk, mintha egy form lenne széttördelve sok kis
oldalra. A Spring Web Flow viszont definiál állapotokat (state),
eseményeket (event) és átmeneteket (transition). És egy saját formátumú
XML konfigurációs állományba kell leírnunk a állapotokat, mely lehet
action (üzleti logika hívása), decision (elágazás), start (folyamat
kiindulási pontja), end (folyamat vége), subflow (alfolyamat) és view
(megjelenítés). Valamint azt, hogy milyen események hatására milyen
átmenetek valósuljanak meg. Sajnos ez olyan öszvér megoldásokat
eredményez, hogy XML-ben definiáljuk ezeket, de pl. metódusneveket kell
bele írnunk, valamint a feltételeket is Java-ban kell megfogalmaznunk.
Már a BPEL-t sem szerettem, mert egy XML nyelven kell üzleti logikát
megfogalmazni. Nem tudom, miért gondolják sokan, hogy a Java fejlesztők
Java programozás helyett XML-t szeretnek írni. Többségünk nem.

Én egy kicsit a tesztelésről szóló függeléktől is többet vártam. Igaz,
leírja, hogyan lehet Spring MVC Controller-eket mock objektumokkal
tesztelni, hogyan lehet az adatbázis műveleteknél a tranzakciót
szabályozni, a JdbcTemplate-et használni, hogyan lehet az integrációs
teszteléshez az applicationContext.xml állományt betölteni. Megemlíti a
JUnit 4-hez a Gienah tesztelést, de azóta hasonló már bekerült a
Spring-be is, azaz teszt esetekben is működik a dependency injection.
Mégsem hangsúlyozza megfelelően, hogy a Spring egyik fő célkitűzése a
könnyű tesztelhetőség. Hiszen miért csak függelékben szerepel?

A könyv a 2.5-ös újdonságait sem tartalmazza, így hiányzik az
annotációkkal való konfiguráció mind bean-ek, mind Spring MVC esetén,
valamint a JAX-WS sem kerül megemlítésre.

Ezekkel együtt nagyon ajánlom a könyvet minden Spring-gel ismerkedőnek,
illetve egy-egy fejezetét a haladó fejlesztőknek is.
