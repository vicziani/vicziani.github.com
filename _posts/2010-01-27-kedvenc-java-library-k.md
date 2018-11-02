---
layout: post
title: Kedvenc Java library-k
date: '2010-01-27T23:42:00.004+01:00'
author: István Viczián
tags:
- open source
- Library
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Ebben a posztban szeretném felsorolni azon Java library-ket,
keretrendszereket, melyeket legszívesebben használok különböző webes
alkalmazások fejlesztése közben. Ezekkel rengeteg tapasztalat gyűlt fel,
és mindenkinek bátran ajánlhatom őket. Érdekes lesz visszanézni egy-két
év múlva, hogy hol tartanak. Remélem ti is merítetek belőle hasznos
ötleteket, és a véleményeteket is várom, hogy milyen eszközöket
használtok, az általam használt stack mely elemeit lenne érdemes
kicserélni Az eszközöket tetszési sorrendben írom, a kedvenceim elől,
azok, melyekkel kényelmes fejleszteni, amelyekben keveset csalódtam.

[Spring](http://www.springsource.org/about): Kvázi szabvány
keretrendszer dependency injection-nel, inversion of control-lal. A J2EE
kiváltására találták ki, annak bonyolultságának mellőzésével. Annak
szolgáltatásait nagyrészt biztosítja (talán néha a lokális
transzparencia hiányzik egyedül). Ugyan a Java EE 5 már sokkal
egyszerűbb, a Spring-ből rengeteg elemet át is emelt, mégis a lassú
szabványosítási folyamat miatt a Spring már elhaladt mellette.
Legnagyobb előnye, hogy apró lépésekben is bevezethető (pl. több éves
projektben pár nap alatt vezettük be a perzisztencia rétegbe), és nem
igényel alkalmazásszervert, melyekkel rengeteg rossz tapasztalatom volt.
Számomra az egyik legfontosabb szempont fejlesztés közben a nagyon rövid
fejlesztési ciklus, azaz hogy egy módosítás max. 30 másodpercen belül
kipróbálható legyen. JDBC esetén nagyon hasznos a JDBC abstraction
layer, JPA estén inkább a standart JPA API-t használjuk.

[Spring MVC](http://www.springsource.org/about): Webes keretrendszer,
mely elég magas szintű, értelmes default konfigurációkkal rendelkező,
annotációkkal konfigurálható a gyors haladás érdekében, de elég alacsony
szintű is, ha kell, pl. a request, session, stb. objektumok is könnyen
elérhetőek. Összevetve a JSF és [Wicket](http://wicket.apache.org/)
keretrendszerekkel talán kevésbé objektumorientált, kevésbé komponens
alapú, de sajnos olyan tapasztalataink voltak az eddigi megrendelőkkel,
hogy képesek a keretrendszerek határait feszegetni. A Spring MVC-vel
mindent egyszerűen meg lehet csinálni, amire az amúgy silány HTTP
protokoll és HTML formátum, és társai lehetőséget biztosítanak. E
mellett a [Struts](http://struts.apache.org/)-ot is szeretem, de ez
jobban illeszkedik a Spring-hez. Ami külön tetszik, hogy sokszor voltam
úgy, hogy dokumentáció nélkül elgondoltam, hogy így kéne működnie,
kipróbáltam, és tényleg.

[Apache Log4J](http://logging.apache.org/log4j/): Apró és megbízható
segítség a naplózáshoz. Ugyan jönnek a trónkövetelők, mint a
[Logback](http://logback.qos.ch/), [SLF4J](http://www.slf4j.org/),
azonban nem tudok elképzelni olyan funkciót, amiért váltanék, és még nem
is annyira elterjedtek. Erről
[cikket](http://vicziani.github.com/artifacts/log4j.pdf) is írtam.

[Apache Velocity](http://velocity.apache.org/): Sablonozásra használjuk.
Régebben ez volt a view réteg, de most inkább a JSP, mely jobban megköti
az ember kezét. Nem csak alkalmazásokban használjuk, hanem pl. ügyfél
számára interfész prototípus, sőt dokumentáció generálására is. Okosabb
a [FreeMarker](http://freemarker.org/), de nem volt még szükség a
funkcióira. Erről szóló
[cikk](http://vicziani.github.com/artifacts/velocity.pdf).

[Apache Lucene](http://lucene.apache.org/java/docs/): Most már mindegyik
webes alkalmazásban szükség van a tartalom hatékony keresésére, erre
tökéletes. Erről
[cikket](http://vicziani.github.com/artifacts/lucene.pdf) is írtam.

[Spring
Security](http://static.springsource.org/spring-security/site/index.html):
Autorizációra és autentikációra kizárólagosan ezt használjuk. Erről
nemrég írtam a [Spring Security](/2010/01/10/spring-security.html)
post-omban.

JSP, JSTL: Szabványos view réteg, aminek ugyan vannak hiányosságai, de
rákényszerít a helyes MVC használatra, és az IDE-k is ezt támogatják a
legjobban.

[Display tag library](http://displaytag.sourceforge.net/1.2/): JSP tag
library táblázatok megjelenítésére. Ami kellett, azt még mind tudta.
Akár AJAX bővítménye is van. Van [régebbi
post](/2008/11/30/tobb-tablazat-egy-oldalon-displaytag.html) erről is.

[JUnit](http://www.junit.org/): Unit test-ek fejlesztésére, az
elterjedtsége miatt. A [TestNG](http://testng.org/doc/index.html) is
rendkívül szimpatikus, de egyelőre nincs olyan funkció, melyért
váltanék, kockáztatva a támogatottságot.

[Direct Web Remoting](http://directwebremoting.org/dwr/index.html):
Kellően alacsony szintű bridge a Java és a JavaScript világ között,
AJAX-os funkciók megvalósítására.

[jQuery](http://jquery.com/): Bár alapjában véve gyűlölöm a
JavaScript-et, ez a library nagyon hasznos segítségnek bizonyult. A
[Prototype](http://www.prototypejs.org/) annyira nem hatott meg.

[JasperReports](http://jasperforge.org/projects/jasperreports) és
[iReport](http://jasperforge.org/projects/ireport): Riport generálásra
használatos library és NetBeans alapú riport tervező eszköz. No ez már
jó pár napom megkeserítette, de még mindig ez a legszimpatikusabb. Az
XSL-FO általában ágyúval verébre, és iszonyatosan lassú és erőforrás
igényes. A másik versenyző a
[BIRT](http://www.eclipse.org/birt/phoenix/), amivel nem sok
tapasztalatom van, és amúgy is az Eclipse ökoszisztéma tagja.

[Hibernate](https://www.hibernate.org/): Az egyik legelterjedtebb ORM
megvalósítás. Történelmi okok miatt nem váltottunk az EclipseLink-re, de
nem vagyok elkötelezett híve, mert sok nehéz pillanatot szerzett.
Kizárólag JPA provider-ként használom.

A listából is látható, hogy olyan eszközöket igyekszem választani,
melyek vagy szabványosak, vagy kvázi szabványosak. Egy konkrét problémát
célozzanak meg, és elég egyszerűek ahhoz, hogy probléma esetén akár a
forrását tanulmányozva, vagy debug-olva előrébb lehessen jutni (az nyílt
forráskódú szoftverek legnagyobb előnye, ha már a dokumentációjuk hagy
némi kívánnivalót maga után). Jelentős forrásanyag (tutorial, projekt
reports, dokumentáció, példakódok, cikkek, könyvek), felhasználótábor
(hírek, fórum, levelezési lista, issue tracker) legyen körülötte. Külön
fontos, hogy nagyon egyszerűen, lépésekben bevezethető, könnyen
tanulható legyen, hogy hamar sikerélményt biztosítson. És szép legyen a
weboldala.

A következő posztban az általam leggyakrabban használt Java-s tool-okat,
eszközöket fogom bemutatni.

Ti milyen library-ket, keretrendszereket javasoltok? Főleg olyanok
érdekelnek, melyeket éles projektben használtatok, beváltak, újabb
projektekben is bevetnétek, és több hónap után is szívesen nyúltok hozzá
vissza.
