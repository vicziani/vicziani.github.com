---
layout: post
title: ! 'Matt Weisfeld: The object-oriented thought process'
date: '2009-12-27T11:45:00.003+01:00'
author: István Viczián
tags:
- oo
- könyv
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Egy oktatás miatt olvastam el az Addison Wesley kiadásában megjelent
Matt Weisfeld: The object-oriented thought process könyvet. A harmadik
kiadásnál tartó könyv megcélzott olvasóközönsége azon vezetők, tervezők,
fejlesztők, akik el szeretnék sajátítani az objektumorientált (oo.)
gondolkodásmód alapjait, mindezt programozási nyelv és technológia
függetlenül.

![The object-oriented thought process](/artifacts/posts/2009-12-27-matt-weisfeld-object-oriented-thought/oo_book.jpg)

Az első kilenc fejezet az oo. alapfogalmait mutatja be: objektumok,
osztályok, egységbezárás (encapsulation), információrejtés elve (data
hiding), újrafelhasználhatóság módjai (öröklődés és aggregáció),
kiterheszthetőség, karbantarthatóság, többalakúság (polymorphism),
absztrakt osztályok és interfészek, konstruktorok, metódus túlterhelés
(overloading). A könyv több oldalról közelíti meg a black box technikát,
mely szerint elegendő ismerni az interfészt (melyet javasolt mindig az
azt felhasználó szemszögéből megtervezni, és minél szűkebbre venni, és
iteratív módon bővíteni) és az ahhoz tartozó szemantikát (ő szerződésnek
- contract nevezi, gyakorlatilag az API-ról és annak dokumentációjáról
van szó), az implementáció maradjon rejtve. Így az osztályaink között
laza kötés lesz, az implementációt változtathatjuk anélkül, hogy azt az
interfészen keresztül használó osztályainkat módosítani kéne, növelve
ezzel az átláthatóságot, karbantarthatóságot, robosztusságot,
tesztelhetőséget. Előjönnek az oo. világban unalomig használt példák,
mint a síkidom, és leszármazottjai, a kutyafajták, az autó és annak
részei, és az általam is oly gyakran emlegetett alkalmazott osztály.

Ezen blokknak kicsit kilógó eleme a 6. fejezet (Designing with Objects),
mely a témát egy fejlesztési folyamaton keresztül kívánja szemléltetni,
a követelményelemzéstől a tervezésig (CRC kártyák használatával, UML
osztálydiagrammok előállításáig). Kicsit elnagyolt rész ez, ahol kevés
kitekintés van a különböző módszertanokra, valamint azok többi részére
(pl. az agilis módszertanok megemlítésre sem kerülnek).

A 10. fejezet (Creating Object Models with UML) az UML
osztálydiagrammjának pár elemét mutatja be, de nagyon alap szinten.
Nagyon jó ötletnek tartottam a 11. (Objects and Portable Data: XML) és
12. fejezet (Persistent Objects: Serialization and Relational Databases)
témáját, amivel oo-val foglalkozó könyvek keveset írnak. Sajnos
amennyire jó a témaválasztás, annyira rossz a kivitelezése. Az író az
eddigi Java példákról átváltott a .NET-es példákra, feltehetőleg nem
ismerte a JAXB technológiát, melynek C\#-os változatát ismerhetjük meg
ebben a fejezetben, valamint a prezisztenciánál kizárólag a
szerializáció lett megemlítve, és tévesen az object-relational mapping
(ORM) néven a JDBC. Valódi ORM-ről szó sem esik, mint pl. a JPA, mely
tényleg objektumorientált megközelítés, szemben a JDBC-vel, ami inkább
procedúrális megközelítés.

A következő két fejezet (Objects and the Internet, Objects and
Client/Server Applications) az elosztott alkalmazásoknál alkalmazott oo.
technológiákat ismerteti, először a JavaScript oo. lehetőségeit, majd
részletesebben a CORBA-t, és felületesen a web szolgáltatásokat. Két
egyszerű kliens/szerver alkalmazás is bemutatásra kerül, az első
szerializálva viszi át az adatokat, a második XML-ben, TCP socket-en
keresztül.

Az utolsó fejezet (Design Patterns) a tervezési mintákról szól, a
tervezési minták három csoportjából (creational, structural és
behavioral) mutat egyet-egyet (singleton, adapter és MVC), áttekintő
szinten.

A könyvet így azoknak tudom ajánlani, akiknek az oo. fogalomrendszer nem
ismert. Így kiváló lehet pl. azoknak, akik még csak most tanulják ezeket
(pl. főiskolai vagy egyetemi tárgy ajánlott olvasmányának), vagy akik
most váltanak struktúrális programozásról oo. programozásra (pl.
COBOL-ról, PL/SQL-ről, C-ről). A könyv egy hétvége alatt elolvasható.
Azoknak azonban, akiknek az ebben a posztban leírt fogalmak ismertek,
azaz már legalább egy fél éve programoznak valamilyen oo. programozási
nyelven, a könyv nem fog sok újdonságot mutatni. Demonstráióként főleg
UML diagrammok és Java programok szerepelnek, de olyan egyszerűek, hogy
programozási ismeretek nélkül is megérthetőek (és a legtöbb példa
átirata is szerepel a fejezet végén C\# és VB nyelven). Sajnos a Java
kód minősége nem éppen megfelelő, gyakran a legalapvetőbb konvenciók
sincsenek betartva (pl. váltózó vagy metódus nevek kisbetűvel).

Nagy várakozással vettem kezembe a könyvet, mert ugyanezen sorozatban
(Developer's Library) jelent meg egyik kedvenc könyvem (Agile Java
Development with Spring, Hibernate and Eclipse), és valami hasonlót
vártam itt is. Összességében elmondható, hogy a könyv első kilenc
fejezete kiváló, szájbarágós, bevezető anyag az oo. gondolkodásba, sok
ismétléssel, így gyakorlatilag beleveri az emberbe a tudást. A többi
fejezet témája is nagyon jó ötlet, de nem jól megvalósított. Az UML-ből
több is belefért volna (ugyanennyi oldalon az UML Distilled sokkal több
információt ad át), az egyéb fejlettebb oo. technológiákból elegendő
lett volna a szerializáció, XML-binding, az ORM és a CORBA (sőt, inkább
az RMI) elméleti alapjait kifejteni, mintsem a valóságtól távol álló
tutorial szagú kódrészleteket mutatni. Ezekre inkább ezért más könyveket
javaslok.
