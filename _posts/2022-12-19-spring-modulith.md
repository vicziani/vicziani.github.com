---
layout: post
title: Modularizált alkalmazás fejlesztése a Spring Modulith-tal
date: '2022-12-19T10:00:00.000+01:00'
author: István Viczián
description: Hogyan fejlesszünk modularizált alkalmazást, és mit ad ehhez a Spring Modulith?
---

## Bevezetés

A microservice alkalmazások népszerűsége továbbra is töretlen. Miért is választják sokan ezt
az architektúrát? Egyik ok természetesen a hype factor, sokan szeretnék kipróbálni, valamint
hogy bekerüljön az önéletrajzukba. További ok, hogy sokan megcsömörlöttek a monolitikus
alkalmazásoktól, hiszen sok kötöttséggel járnak mind fejlesztés, mind üzemeltetési oldalról.
Ebből talán a legfontosabb, hogy gyakori jellemzője a spagetti kód, ennek következményeképp ha valahol
belenyúlunk az alkalmazásba, lehet, hogy másik helyen romlik el, ezért ha telepíteni akarunk,
ha biztosra akarunk menni, a teljes alkalmazást újra kéne tesztelnünk. Erre megoldás lehet
a microservice architektúra, ahol az alkalmazásunkat lazán kapcsolódó szolgáltatásokra
bontjuk fel. Ezzel kapcsolatban azonban a leggyakrabban elhangzó kérdés, hogy hol
a határ, hol vágjunk, mi alapján bontsuk szét az alkalmazásunkat szolgáltatásokra.
Monolitikus alkalmazásnál további kötöttségek a technológiai kötöttségek, 
valamint hogy a teljes alkalmazást egyben lehet csak telepíteni.
És érdekes módon, csak ritkán szoktam azzal az indokkal találkozni, hogy azért
választották a microservice architektúrát, mert gond volt a skálázhatósággal,
aminek pedig nagy szerepe volt a kialakulásában.

Gyakran elfelejtjük, hogy egy monolitikus alkalmazásnak sem kéne szükségszerűen
egyben lennie, hanem azt is felépíthetjük lazán kapcsolt komponensekből.
A hiányzó láncszem itt a modul. A modularizált monolitikus alkalmazást
szokás modulith-nak nevezni. Ennek létét két okból is fontosnak tartom.
Egyrészt úgy vélem, hogy ahol nem tudnak modularizált alkalmazást fejleszteni,
ott nem érdemes a microservice architektúrával foglalkozni, ugyanis ezek
a technológiák nem mutatják meg, hogy hogy kell vágni. És a rossz vágásnak
az eredménye ugyanúgy spagetti lesz, de már meg lesz nehezítve az
elosztottságból adódó technológiai és üzemeltetési bonyodalmakkal is.
Többek által is jónak tartott út a microservice-ek felé, hogy először modularizáljuk
az alkalmazásunkat, majd utána emeljük ki a moduljainkat külön service-ekbe.
A másik ok, amit érdemes észben tartani, hogy már egyre több helyről
hallani, hogy a microservice architektúra nem vált be, nem váltotta be
az ígéreteket, a szervezet még nem állt készen (pl. agilis módszertanok, DevOps, CI/CD hiánya - igen, ezek
a microservice-ek előfeltételei), nem volt szükség skálázhatóságra, még rosszabb lett performanciában, stb.

Technológiailag a modulok azonban elég kevésbé támogatottak. Kezdeti próbálkozás volt az OSGi,
azonban komplexitása miatt nem terjedt el, pedig olyan igéretei vannak, mint a futás közbeni plugin telepítés,
valamint egy library-nek különböző verziói a classpath-on. Szabványos megoldást a
Java Platform Module System próbált adni a Java 9-ben, de annak ellenére, hogy már mikor
megjelent, szintén nem sikerült még elterjednie. A leggyakrabban használt megoldás a
build rendszer által biztosított modularizáció, gondoljunk itt a Maven multi module projectre.
Illetve a Gradle is azt hangoztatja, hogy multi module projektek kezelésében jobb és
gyorsabb, mint a Maven. Azonban ez is plusz komplexitással jár, különösen a build folyamat, a CI/CD terén.

A kézenfekvő megoldás a Java csomagok használata lenne, azonban ez sajnos túl kevés eszközt ad a kezünkbe,
a láthatósági módosítók csak nagyon szegényes hozzáférés szabályozást nyújtanak.
Ennek kiegészítésére jelent meg az [Spring Modulith](https://spring.io/projects/spring-modulith) projekt, mely több jó megoldást is ad. 
Nem hiszek feltétlenül abban, hogy ez az eszköz el fog terjedni, de a benne lévő 
ötleteket érdemes ismerni, és akár a saját projekjeinkben is bevezetni.

<!-- more -->

## Csomagok és az ArchUnit

Az lenne megfelelő, ha nyelvi szinten meg lehetne mondani, hogy mely csomagokból csak
mely más csomagokat érhetőek el. Ekkor már használhatnánk a csomagokat a
modulok tárolására, és a modulok közötti függőségek szabályozására. Valamint
a moduljainkat rétegekbe rendezhetnénk, és itt is megadhatnánk, hogy mely
rétegből mely más rétegek használhatóak.

Pont erre találták ki a remek [ArchUnit](https://www.archunit.org/) eszközt,
melynek használatával ezeket a függőségeket unit tesztben tudjuk leírni,
és ha valaki megtöri ezeket a szabályokat, a unit teszt hibára fut.

A következő kódrészleg például definiál három réteget.

```java
layeredArchitecture()
    .consideringAllDependencies()
    .layer("Controller").definedBy("..controller..")
    .layer("Service").definedBy("..service..")
    .layer("Persistence").definedBy("..persistence..")

    .whereLayer("Controller").mayNotBeAccessedByAnyLayer()
    .whereLayer("Service").mayOnlyBeAccessedByLayers("Controller")
    .whereLayer("Persistence").mayOnlyBeAccessedByLayers("Service")
```

Ha esetleg a `service` csomagban lévő osztályba injektálunk egy `controller`
csomagban lévő bármilyen komponenst, a unit teszt azonnal elszáll.

Ezt a gondolkodást viszi tovább a Spring Modulith.

## Spring Modulith

A Spring Modulith azt a gondolatot implementálja, hogy az alkalmazásunk
legyen egy monolitikus alkalmazás, egy Maven modulban, és ez legyen
csomagokra bontva, üzleti funkciók alapján (ezek a modulok),
és ez alatt legyenek a modulok rétegekre bontva.

Ezzel már nem lesz spagetti kódunk, de az az előnye is megmarad, hogy nem kapjuk meg a 
microservice architektúra bonyolultságát. Később, ha erre szükség van,
kiszervezhetjük a moduljainkat külön service-ekbe, csak a lokális
metódushívásokat kell valamilyen más technológiára kicserélni.

Képzeljünk el egy alkalmazást, mely az alkalmazottakat, és a 
hozzájuk tartozó szakértelmeket tárolja.

Már az elején modularizált alkalmazásban gondolkodjuk, a modulokat
a különböző üzleti területek alapján alkossuk meg.
Az `employees` modul tartja nyilván az alkalmazottakat, a címükkel,
míg a `skills` modul pedig azt, hogy milyen szakértelmek vannak,
és hogy az alkalmazottak milyen szakértelmekkel rendelkeznek.

![Alkalmazás felépítése](/artifacts/posts/images/mentoring-app.drawio.png)

A példa alkalmazás forráskódja megtalálható a [GitHubon](https://github.com/vicziani/jtechlog-spring-modulith).

A csomagszerkezet a következő legyen:

```
mentioring-app/
├─ employees/
│  ├─ internal/
│  ├─ EmployeesFacade
├─ skills/
│  ├─ internal/
```

A legkülső csomagok adják a modulokat, név szerint az `employees` és a `skills`.
Azt a döntést hoztam, hogy a `skills` modulból lehet hívni az `employees` modult,
az egy alacsonyabb szintű modul. Az ˙internal˙ csomagban lévő osztályokra
nem lehet más csomagokból hivatkozni. Azaz a `skills` modul osztályai csak
az `EmployeesFacade` osztályra tudnak hivatkozni (pl. injektálni, hívni). 

A teszteset:

```java
var modules = ApplicationModules.of(MentoringAppApplication.class);
modules.verify();
```

Abban az esetben, ha körkörös hivatkozás alakulna ki, azaz pl. az `employees`
csomagból történne hivatkozás a `skills` csomagra, azonnal elbukna a teszteset.

Sőt, a következő kódrészlettel akár [C4 diagramot](https://c4model.com/) is tudunk
generálni.

```java
new Documenter(modules)
        .writeModulesAsPlantUml()
        .writeIndividualModulesAsPlantUml();
```

Ez egy PlantUML diagramot állít elő (diagram as a code, meghatározott formátumú szövegből generál le diagramot).

![C4 diagram](/artifacts/posts/images/spring-modulith-c4.png)

A Spring Modulith ezen kívül lehetőséget biztosít arra is, hogy 
tesztesetekben csak az egyik modul kerüljön betöltésre, vagy a modulok egy
bizonyos kombinációja.

A modulok belső felépítésére ugyanúgy ArchUnit szabályokat írhatunk.

## Entitások kezelése

JPA használata során megszoktuk, hogy az entitásaink kapcsolatban állnak egymással.
Ebben az esetben könnyen kialakulnak függőségek, sőt talán körkörös függőségek is.
Ezzel rendkívül komplexszé válik az alkalmazásunk, nagyon oda kell figyelni a lazy
betöltésekre, N+1 problémára, stb. Ezt mindenképp érdemes elkerülni, de hogyan?

Itt a DDD egy ötletét hívom segítségül, hogy az ORM kapcsolatokat csak
ún. bounded contexten belül használom, a bounded contexteken, és így a modulokon
átnyúló kapcsolatokat is csak azonosítókkal reprezentálom.

```java
@Entity
public class EmployeeSkills {

    @Id
    private Long id;

    private Long employeeId;

    // ...
}
```

Ezzel ugyan picit kényelmetlenebbé válhatnak a lekérdezések, azonban
sokkal jobban kontrollálni tudom mi kerül lekérdezésre, és
architektúrálisan is megfelelő lesz az alkalmazás.

## Körkörös függőségek

Mi van akkor, ha előjön olyan igény, hogy az `employees` modulból is
hívni akarjuk a `skills` modult. Pl. ha egy alkalmazottat
törölni akarunk, akkor törölni kell a szakértelmeit is.
Erre több megoldásunk is lehet, itt vethetjük be a dependency
inversiont, azaz a függőségek irányának megfordítását. Ennek
egyik tervezési mintája az observer design pattern. Amit
a Spring eventekkel implementál. Sőt, ezt a Spring
Modulith tovább is gondolja, ugyanis képes a tranzakcionális
események használatára, mely eseményeket ráadásul adatbázisba is képes írni,
akár relációs adatbázisba JPA-val vagy JDBC-vel, akár MongoDB-be.

A kód törléskor az `employee` modulban:

```java
@Service
@AllArgsConstructor
public class EmployeeService {

    // ...

    private ApplicationEventPublisher publisher;

    @Transactional
    public void deleteEmployee(long id) {
        Employee employee = employeeRepository.findByIdWithAddresses(id)
                .orElseThrow(() -> new NotFoundException("Employee not found with id: " + id));
        employeeRepository.delete(employee);

        publisher.publishEvent(new EmployeeHasDeletedEvent(id));
    }


}
```

Ennek lekezelése a `skills` oldalon:

```java
@Service
public class SkillsService {

    @Async
    @TransactionalEventListener
    public void handleEmployeeHasDeletedEvent(EmployeeHasDeletedEvent event) {
        var employeeSkills = employeeSkillsRepository.findByEmployeeId(event.getEmployeeId());
        if (employeeSkills.isPresent()) {
            employeeSkillsRepository.delete(employeeSkills.get());
        }
    }
}
```

## Tracing

A Spring Modulith azt is biztosítja, hogy a tracing eszközök (pl. Zipkin) számára azt is 
elküldi, hogy melyik hívás melyik modulban történt. Így az ábrán is látható
módon nyomon követhető, hogy a `skills` modul áthív az `employees`
modulba, az kiad egy SQL lekérdezést, majd önmaga is kiad négy SQL lekérdezést.

<a href="/artifacts/posts/images/spring-modulith-tracing.jpg" data-lightbox="post-images">![Spring Boot indulás](/artifacts/posts/images/spring-modulith-tracing_750.jpg)</a>


