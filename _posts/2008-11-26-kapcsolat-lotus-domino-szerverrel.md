---
layout: post
title: Kapcsolat Lotus Domino szerverrel
date: '2008-11-26T23:58:00.004+01:00'
author: István Viczián
tags:
- SOA
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Egy integrációs projekt során kell egy Lotus Domino 7.0.1 
környezetben implementált alkalmazáshoz kapcsolódni, gyakorlatilag
dokumentumot kell neki beküldeni, valamint adatot fogadni. Ennek kapcsán
utánanéztem, hogy hogyan is épül fel. A Lotus Notes egy kliens-szerver
alkalmazás, csoportmunkára. Támogatja levelezést, van benne naptár,
névjegyalbum, todo lista, valamint dokumentum kezelés, és integrálták a
legújabb web 2.0-ás felfedezésekkel is, mint wiki, RSS, valamint
rendelkezik CRM és HelpDesk alkalmazásokkal is. Ezen kívül egy
alkalmazás platform is, melyeken ilyen típusú alkalmazásokat lehet
fejleszteni. Szervere a Lotus Notes Server volt, melyet később
átneveztek IBM Lotus Domino-ra. Segítségével keresztplatformos,
elosztott, dokumentum orientált adatbázison és üzenetkezelő
keretrendszeren alapuló alkalmazásokat lehet fejleszteni RAD eszközzel
(Domino Designer), és rendelkezik API-val is, melyet több nyelven is el
lehet érni. A Lotus Domino-t C, C++ és Java nyelveken implementálták, és
támogatja a Formula, LotusScript, Java, JavaScript, C és C++ nyelveket,
valamint egy XML alapú Domino XML Language-t. A Java-t már a 4.5-ös
verzió, majd később az 5-ös verzió is támogatta, de a 7-es verzióban
vezették be a Java 1.4.2 támogatását, és került bele egy Java debugger
is. Szintén a 7-es újítása (2005 aug.), hogy web service design
element-eket lehet fejleszteni, amivel web szolgáltatásokat lehet
fejleszteni, Java és LotusScript nyelveken. A [web szolgáltatás
fejlesztés
folyamata](http://www.ibm.com/developerworks/lotus/library/nd7-webservices/)
indulhat WSDL-ből és Java/LotusScript nyelvből is, a kettőt szinkronban
tudja tartani. A SOAP 1.1 és WSDL 1.1 szabványt támogatja. A 8-as Lotus
Notes (2007. aug. - jelenleg legfrissebb) kliens legnagyobb újdonsága,
hogy megváltoztatták a felhasználói interfészt, és a Lotus Notes
Expeditor-ra építették, ami Eclipse alapú. A Lotus Domino alatti
adatbázis egy dokumentum alapú adatbázis ún. Notes Storage Facility
(NSF), mely note-okat tartalmaz, és azokhoz item-eket. Ez nem relációs,
és nem is normalizált adatbázis, így ebből a szempontból jobban hasonlít
az XML, vagy oo alapú adatbázisokhoz. A mezőknél még típust sem kell
definiálni, szabadon lehet felvenni. A 7-es verziótól kezdve azonban
perzisztens tárolónak lehet az IBM DB2-őt is választani, ez view-kat
biztosít az SQL lekérdezésekhez. Ezek alapján első körben
megpróbálkozunk a web szolgáltatással történő integrációval, a további
tapasztalatokról hírt adok.
