---
layout: post
title: Események a Spring Modulith-ban
date: '2024-07-24T10:00:00.000+02:00'
author: István Viczián
description: Következő videóm arról, hogy hogyan segíti a modulok laza kapcsolódását az eseménykezelés, és hogy mit ad ehhez a Spring Modulith.
---

Következő videóm témája, hogy egy modularizált alkalmazás felépítésekor az eseménykezelés segít nekünk abban,
hogy a modulok lazán kapcsolódjanak egymáshoz. A Spring Modulith ezt kiegészíti, biztosabbá teszi a hiba- és tranzakciókezelést, valamint képes
ezeket az eseményeket más service-ek felé is elküldeni valamilyen message brokeren keresztül.

Lesz szó modularizált alkalmazásról, eseménykezelésről, Spring Modulithról, tranzakciókezelésről, Testcontainersről, Kafkáról.

<iframe width="854" height="480" src="https://www.youtube.com/embed/pofgNVVaoEE?si=hnf4EMP5CxhR5Bko" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

A példa alkalmazás forráskódja megtalálható a [GitHubon](https://github.com/vicziani/jtechlog-spring-modulith).

A Spring Modulit modulkezeléséről írtam korábban egy posztot [Modularizált alkalmazás fejlesztése a Spring Modulith-tal](/2022/12/19/spring-modulith.html) címmel.

A poszt végén a videóhoz képest _extra tartalom_ is van.

<!-- more -->

Modulok közötti kommunikációra eseményeket használva laza lesz közöttük
a kapcsolat, feloldhatóak a körkörös függőségek, sőt a tesztelés is egyszerűbbé válik.
A Spring Framework alapból tartalmaz eseményküldést és fogadást, a Spring
Modulith ezt kiegészíti.

Adott egy több modulból álló alkalmazás. Az `Employees` modul az alkalmazottakat,
a `Skills` a képzettségeket, és az `AcquiredSkills` pedig az alkalmazottakhoz kapcsolódó
képzettségeket kezeli. 

![Modulok](/artifacts/posts/images/mentoring-app.drawio.png)

Az `Employees` modul az alkalmazott törlésekor
dob egy eseményt az `EmployeeService` `deleteEmployee()` metódusában,
az injektált `ApplicationEventPublisher`.

```java
@Transactional
public void deleteEmployee(long id) {
    Employee employee = employeeRepository.findByIdWithAddresses(id)
            .orElseThrow();
    employeeRepository.delete(employee);

    publisher.publishEvent(new EmployeeHasBeenDeletedEvent(id));
}
```

Az eseményt a képzettségeket kezelő modul fogadja
az `AcquiredSkillsService` `handleEmployeeHasBeenDeletedEvent()` metódusában, és törli az
alkalmazotthoz kapcsolódó képzettségeket.

```java
@EventListener
public void handleEmployeeHasBeenDeletedEvent(EmployeeHasBeenDeletedEvent event) {
    log.info("Event has arrived: {}", event);
    var employeeSkills = employeeSkillsRepository.findByEmployeeId(event.employeeId());
    employeeSkills.ifPresent(skills -> employeeSkillsRepository.delete(skills));
}
```

## Tranzakciókezelés

Ez alapértelmezetten szinkron módon fut, abban a tranzakcióban, amelyben az eseményt 
eldobó metódus is fut.

Ezért érdemes rátenni az `@Async` annotációt, mely külön szálon futtatja, valamint
a `TransactionalEventListener` annotációt, mely azt biztosítja, hogy az előző tranzakció
commitja után fusson le, valamint a `@Transactional(propagation = Propagation.REQUIRES_NEW)`
annotációt, ami azért felelős, hogy saját tranzakciót indítson.

```java
@Async
@TransactionalEventListener
@Transactional(propagation = Propagation.REQUIRES_NEW)
public void handleEmployeeHasBeenDeletedEvent(EmployeeHasBeenDeletedEvent event) {
    // ...
}
```

Ehelyett felveszek egy új függőséget:

```xml
<dependency>
    <groupId>org.springframework.modulith</groupId>
    <artifactId>spring-modulith-events-api</artifactId>
</dependency>
```
És a három annotáció
helyett használhatom a Spring Modulith `@ApplicationModuleListener` annotációját,
mely önmaga tartalmazza mindhárom másik annotációt.

```java
@ApplicationModuleListener
public void handleEmployeeHasBeenDeletedEvent(EmployeeHasBeenDeletedEvent event) {
    // ...
}
```

## Event Publication Repository

Ekkor még mindig megtörténhet az, hogy az esemény feldolgozása közben hiba lép fel,
és az esemény elveszik.

Ennek kivédésére az Event Publication Repository az
eseményt kiírja adatbázisba is. Ehhez használható a következő függőség.

```xml
<dependency>
    <groupId>org.springframework.modulith</groupId>
    <artifactId>spring-modulith-starter-jpa</artifactId>
</dependency>
```

Ha most létrehozunk, majd törlünk egy felhasználót, így küldünk eseményt, 
akkor látható, hogy bekerül az `event_publication` táblába is JSON formátumban,
kitöltött `completition_date` mezővel.

Az alkalmazásba vegyük fel a Spring Boot Chaos Monkey projektet, mely segítségével
hibát lehet tenni a rendszerbe. Az Actuatorjának használatával beállítható, hogy
az `AcquiredSkillsService` `handleEmployeeHasDeletedEvent()` metódusa dobjon `RuntimeException`-t.
Ekkor a táblába az esemény üres `completition_date` értékkel kerül be. 

Ezeket az alkalmazás indulásakor próbálja újra elküldeni, ha be van állítva a `spring.modulith.republish-outstanding-events-on-restart` property. 

## Extra tartalom: Saját mechanizmus

A régi eseményeket bizonyos időközönként törölni érdemes, erre használható
egy injektált `CompletedEventPublications` példány.

A nem feldolgozott eseményeket programozottan is újraküldhetjük,
ehhez egy `IncompleteEventPublications` példányt kell injektálni, aminek pl.
ütemezve meghívható a `resubmitIncompletePublicationsOlderThan` metódusa.

```java
@Service
@AllArgsConstructor
@Slf4j
public class EventsService {

    private final CompletedEventPublications completedEventPublications;

    private final IncompleteEventPublications incompleteEventPublications;

    @Scheduled(fixedRate = 5000)
    public void logCompletedEventPublications() {
        completedEventPublications.findAll().stream().forEach(completedEvent -> log.debug("Completed event: {}", completedEvent));
    }

    @Scheduled(fixedRate = 5000)
    public void retryIncompleteEventPublications() {
        incompleteEventPublications.resubmitIncompletePublicationsOlderThan(Duration.ZERO);
    }

}
```

## Esemény küldése message brokeren

Erre az eseményre más service-ek is kíváncsiak lehetnek, ezért egy 
Kafka topicba is el lehet küldeni.
Ehhez fel kell venni a következő függőséget.

```xml
<dependency>
    <groupId>org.springframework.modulith</groupId>
    <artifactId>spring-modulith-events-kafka</artifactId>
</dependency>
```

Valamint az eseményre rátenni a `@Externalized` annotációt.

Ekkor a Kafkában, létrejön egy
`EmployeeHasBeenDeletedEvent` topic, és az alkalmazott törlésekor megjelenik benne egy üzenet.