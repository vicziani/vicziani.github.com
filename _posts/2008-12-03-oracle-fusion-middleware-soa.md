---
layout: post
title: Oracle Fusion Middleware - SOA
date: '2008-12-03T22:11:00.003+01:00'
author: István Viczián
tags:
- SOA
- Oracle
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Az előző posztban áttekintettem a BEA felvásárlással kapcsolatos Oracle
Fusion Middleware infrastrukturális elemeket, most következzen az Oracle
termékskáláján közvetlenül e felett lévő szint, a SOA Suite, BPM és SOA
Governance Suite. A SOA eszközök felelősek a szolgáltatásorientált
architektúra megvalósításáért. A BPM az üzleti folyamatok tervezéséért,
fejlesztéséért, szimulációjáért és monitorozásáért. A SOA Governance
felelős azért, hogy irányítás alatt tartsuk, felügyeljük a SOA
architektúrában definiált szolgáltatásokat (pl. szabványok
használatával, változás követésével). Minden terméknél leírom hogy az
Oracle vagy a BEA terméke-e, valamint az Oracle stratégiáját.

## SOA

Az ide tartozó termékeit az Oracle csomagban, Oracle SOA Suite néven is
forgalmazza.

-   Oracle Data Integrator: heterogén adatmigráció, batch ETL (Extract,
    Transform, and Load - eszköz adatok kinyerésére külső
    adatforrásokból, ezek transzformálása az üzleti igényeknek
    megfelelően, majd ezek betöltése, pl. adattárházba): stratégiai
    termék. Heterogén, szemben az Oracle Warehouse Builderrel, mely csak
    Oracle adatbázisok között teszi ez meg.
-   Oracle Service Bus (AquaLogic ServiceBus & Oracle ESB)‏: itt egyik
    terméket sem tudják a másik fölé helyezni, integrálják a két
    terméket, stratégiai termék.
-   Oracle BPEL Process Manager: BPEL motor, folyamatok irányítására,
    stratégiai termék.
-   Oracle Complex Event Processor (Oracle CEP): Oracle Event-Driven
    Architecture-ba illeszkedő, eseményeket feldolgozó alkalmazások
    fejlesztésére szolgáló környezet. Stratégiai termék.
-   Oracle Business Activity Monitoring (BAM): üzleti tevékenységek, KPI
    (key performance indicator - mérőszámok arra, hogy mennyire
    teljesülnek az üzleti célok) monitorozására szolgáló eszköz.
    Stratégiai termék.
-   BEA WebLogic Integration: konvergáló termék. A BEA ezen a fronton
    elvesztette a csatát, valószínűleg azért, mert nem a szabvány
    BPEL-re épít ezen folyamatirányító alkalmazásuk.
-   BEA Cyclone & RFID Server: nem támogatott BEA termék, karbantartott
    termékek kategóriába került.

## SOA BPM

Cél rendszer-központú, ember-központú, dokumentum-központú, és
döntés-központú üzleti folyamatok elemzésére, tervezésére
(modellezésére), implementálására, futtatására, szimulálására,
követésére (monitorozására) szolgáló környezet felállítása, ami képes
követni a gyorsan változó igényeket (szemben az IT álmával, az
állandósággal). Ebből a csoportból minden termék stratégiai termék.
Egyben, Oracle BPM Suite csomagban is kapható.

-   Oracle BPA Designer: tervező eszköz modellezéshez és folyamat
    tervezéshez.
-   Oracle BPM Studio (BEA AquaLogic BPM Designer)‏ - Oracle eszközhöz
    képest agilisebb tervező eszköz.
-   Oracle BPM Server (BEA AquaLogic BPM): folyamat irányításra, XPDL
    nyelven adható meg.
-   Oracle Document Capture & Imaging: papír alapú dokumentum és képek
    feldolgozására való folyamatirányító.
-   Oracle Business Rules - sűrűn változó üzleti szabályok deklaratív
    megadására, lehetőleg fejlesztés nélkül. Tárolhatók benne döntési
    táblák, amik ugyan relációs adatbázisban is tárolhatóak lennének, de
    ott dimenziók növekedésével ez egyre körülményesebb lenne. Lehetőség
    van feltételek megadására is.
-   Oracle User Interaction: humán workflow.
-   Oracle WebCenter

Valamint az előzőekben már említett Oracle BPEL Process Manager és
Oracle BAM. A jelenlegi helyzet szerint a BEA-tól átvett, és átnevezett
Oracle BPM Studio és Oracle BPM Server működik együtt (XPDL alapú),
valamint az eredeti Oracle JDeveloper alapú Oracle BPA Designer (11g-ben
még nem elérhető) és a Oracle BPEL Process Manager működik együtt (BPEL
alapú). A kettő ugyan együttműködik, de a jövőképben egy tervező és
futtató rendszer jelenik meg.

SOA Governance

-   BEA AquaLogic Enterprise Repository: termékek összegyűjtése,
    megosztása, változás és életciklus kezelése, stratégiai termék.
-   Oracle Service Registry: UDDI registry, stratégiai termék.
-   Oracle Web Services Manager: biztonsági szabályok, stratégiai
    termék.
-   EM Service Level Management Pack: válaszidő és elérhetőség mérésére,
    stratégiai termék.
-   EM SOA Management Pack: teljes SOA architektúra menedzseléséhez,
    stratégiai termék.
-   BEA AquaLogic Services Manager: konvergáló termék.

A SOA Governance keretén belül érdemes tárolni a következőket: XSD, WSDL
állományok, üzleti követelmények, modellek, szabályok és szabványok,
autit adatok és metrikák, verziók, kapcsolatok és függőségek, SLA,
felelősök, biztonsági előírások.
