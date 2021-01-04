---
layout: post
title: Elosztott tranzakciókezelés Spring Boottal
date: '2021-01-04T20:00:00.000+01:00'
author: István Viczián
tags:
- Spring
- JTA
- Atomikos
modified_time: '2021-01-04T10:00:00.000+01:00'
description: Egy tranzakcióban egy adatbázis beszúrás és egy JMS üzenetküldés.
---

A tranzakciókezelésről már többször írtam. Egy bevezető
elérhető a [Tranzakciókezelés EJB 3 és Spring környezetben](/2010/05/31/tranzakciokezeles.html)
címen is, melyet most frissítettem.

A jelenlegi posztban viszont azt írom le, hogyan lehet Spring Boottal elosztott
tranzakciókezelést végezni.

Elosztott tranzakciókezelést akkor használunk, ha egy tranzakcióba
szeretnénk foglalni két külön adatbázisban történő műveletet,
vagy még gyakoribb példa, ha egy tranzakcióba szeretnénk foglalni
egy adatbázis beszúrást és egy JMS üzenet elküldését. Látható,
hogy nem csak adatbázisok képesek tranzakcióban részt venni, hanem
pl. JMS-en elérhető üzenetkezelő middleware-ek 
(Message Oriented Middleware - MOM) is. Összefoglaló nevén ezek
un. erőforráskezelők.

Az elosztott tranzakciókezeléshez egy tranzakció koordinátort kell kinevezni, aki
irányítja a tranzakciót. Itt jön képbe a two-phase commit
protocol (2PC), ahol első körben az erőforráskezelők felkészülnek a
tranzakcióra, és második körben hagyják jóvá azt. Minden
erőforráskezelőnek vétójoga van. Az erőforráskezelők a tranzakció
koordinátorral az X/Open XA protokollon keresztül kommunikálnak.

<!-- more -->

Java környezetben elosztott tranzakciók kezelésére a JTA szabványt
használjuk. Ez két részből áll. A `javax.transaction` csomagban
lévő interfészek és annotációk lehetővé teszik, hogy az 
alkalmazás a tranzakciókra vonatkozó szabályokat adjon meg.
Itt van pl. a `@javax.transaction.Transactional` annotáció.
Spring esetén nem ezt, hanem a saját `@org.springframework.transaction.annotation.Transactional`
annotációját használjuk.
A `javax.transaction.xa` csomagban lévő interfészek pedig
API-t biztosítanak a tranzakció koordinátor (, melyet a JTA Transaction Managernek hív) és az
erőforráskezelők (Resource Manager) közötti kommunikációra. Így tudnak egymáshoz
lazán kapcsolódva együttműködni.

![JTA](/artifacts/posts/2021-01-04-spring-boot-elosztott-tranzakciokezeles/jta.png)

Több JTA implementáció is van, mint pl. az Atomicos vagy Narayana. A Spring
jelenleg az Atomicost támogatja. Ehhez használatához csak annyit kell tenni,
hogy a hozzá tartozó starter projektet fel kell venni függőségként a `pom.xml` állományba. 

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-jta-atomikos</artifactId>
</dependency>
```

A [https://github.com/vicziani/jtechlog-jms-transaction](https://github.com/vicziani/jtechlog-jms-transaction)
címen található egy példa projekt. Ez elindít egy beágyazott
H2 adatbázist, melyhez Spring Data JPA-val fér hozzá. Valamint elindít
egy beágyazott Apache Artemis JMS providert.

![Alkalmazás](/artifacts/posts/2021-01-04-spring-boot-elosztott-tranzakciokezeles/alkalmazas.png)

Ha beküldünk egy kérést, akkor az `EmployeesService` indít egy tranzakciót, 
és beszúr egy rekordot az `employees`
táblába az `EmployeeRepository` használatával, 
valamint elküld egy üzenetet a `employees.queue` sorba a `JmsTemplate`
használatával. A sort egy `EmployeesQueueListener` figyeli,
mely ha üzenetet kap, továbbhív az `EventsService`-be.
Ha egy kivételt dobunk, akkor sem az adatbázis
beszúrás, sem a JMS üzenetküldés nem kerül végrehajtásra,
hiszen mindkettő rollbackel.

A projekthez egy `EmployeesIT` integrációs teszt is tartozik,
mely teszteli a helyes értékkel a commitot és helytelen értékkel a rollbacket.
Egyrészt adatbázisból lekérdezi a rekordokat.
Másrészt mockolja az `EventsService`-t, és azt figyeli, hogy annak metódusa meghívásra
került-e, ezzel vizsgálva, hogy érkezett-e üzenet a sorba.



