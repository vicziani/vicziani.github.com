---
layout: post
title: Workflow REST API-n
date: '2023-08-31T10:00:00.000+02:00'
author: István Viczián
description: Hogyan érdemes egy munkafolyamat lépéseihez REST API-t tervezni?
---

Bár kétségtelenül a REST a legelterjedtebb kommunikációs mód, akár ugyanolyan
platformon fejlesztett alkalmazások között is, REST API tervezéskor
nekem sok kérdés merül fel, melyre nem kapok megnyugtató választ,
és sok olyan megoldással találkozom, amelyek nem felelnek meg a REST elveknek,
vagy egyszerűen csak nem tetszenek.

Sokáig próbáltam megfogalmazni, hogy mi az alapvető problémám, és talán most
sikerült közelebb kerülni. Vegyünk két microservice-t, melyek mindegyike Javaban készült,
Spring Boot használatával. Mindkét oldalon a programozási nyelv alapeleme az osztályok,
ahol érvényesül az egységbezárás, azaz az attribútumok mellett ott vannak
a metódusok, a megfelelő paraméterekkel és visszatérési értékekkel. Ez
a legtöbb fejlesztőnek triviális. 

A REST a kettő között viszont egy teljesen
más absztrakció, erőforrásokkal, és az azon végzett CRUD műveletekkel. Ez főleg négy
műveletet takar, amit a `GET`, `POST`, `PUT` és `DELETE` HTTP metódusoknak feleltetünk meg. 
Egy objektum létrehozására tipikusan konstruktort használunk, ebből nem feltétlen egy van.
Ezen kívül egy objektumnak lehet több metódusa, amik nem feltétlenül feleltethetőek meg a HTTP metódusoknak,
hiszen nem csak ezeket az alapműveleteket használjuk, valamint lehet belőle sokkal több is, mint négy.
Míg a Java nyelv szabvány, addig a REST csak egy ajánlás, és az sincs megfelelően
definiálva, hogy hogyan kéne implementálni, az meg aztán pláne nincs, hogy a kettőt
hogyan feleltessük meg egymásnak. És ennek az az eredménye, hogy minden projekten
teljesen más megoldásokat látok, a legtöbb helyen kompromisszumokkal.

![Absztrakciók](/artifacts/posts/2023-08-31-workflow-es-rest/absztakciok.png)

Az RPC alapú kommunikáció esetén igazából nincs ilyen probléma, mert nem szükséges
átfordítás, nincs szükség az absztrakció váltására. Hiszen ott is eljárások vannak,
paraméterekkel és visszatérési értékekkel. A Spring Frameworkben volt is ilyen
lehetőség, hogy egy távoli eljáráshívás történt, azonban a protokollt
kódolás nélkül cserélni lehetett alatta, pl. választhattunk RMI-t, 
vagy ki emlékszik még a Hessian és Burlap protokollokra.
Sajnos ez azóta eltűnt.
A SOAP esetén sem volt akkora probléma az átfordítás, hiszen ott is vannak
az operációk (eljárásnak felel meg), és a paraméter, valamint a visszatérési
érték is egy-egy (XML) dokumentum. Vannak modernebb RPC alapú kommunikációs
protokollok is, mint pl. JSON-RPC, vagy az egyre inkább elterjedő 
multiplatform gRPC, bináris Protocol Buffers formátummal.

Amennyiben CRUD alkalmazásról van szó, a REST használata talán triviális. De ha 
egy olyan alkalmazásról beszélünk, amiben komoly üzleti logika van (és hiszem,
hogy a legtöbb alkalmazásnak ilyennek kéne lennie, csak a fejlesztők "butítják le"
CRUD alkalmazássá, amely végső soron oda is vezethet, hogy borzasztó felhasználói 
felületek kerülnek kifejlesztésre), akkor már több kérdés merül fel.

Vegyünk például egy hibajegykezelő alkalmazást (issue tracker), mely rendelkezzen egy minimális
üzleti logikával. Ha hibajegy kerül felvételre, az _új_ (_new_) állapottal kerül létrehozásra.
Amennyiben valaki elkezd rajta dolgozni, átkerül _folyamatban_ (_in\_progress_) állapotba.
Amennyiben elkészült, átkerül _megoldott_ (_resolved_) állapotba. Bár a legtöbb hibajegykezelő
alkalmazás lehetővé teszi, hogy egyedi munkafolyamatot lehessen benne létrehozni,
ettől most tekintsünk el, mert akkor megint más problémák merülnek fel.
Ezt egy egyszerű állapotdiagrammal lehet a legegyszerűbben szemléltetni.

![Absztrakciók](/artifacts/posts/2023-08-31-workflow-es-rest/allapotatmenet-diagram.png)

Talán egy hibajegy felvételét még el tudom képzelni REST API-n (bár már ott is vannak
kérdéseim), azonban a különböző munkafolyamat lépések implementálásakor már 
bizonytalanabb vagyok. Ez a poszt ezt a problémakört járja körbe,
forráskódokkal alátámasztva.

<!-- more -->

Egy REST API erőforrásokból áll, mely erőforrásokat az URL-ekkel azonosítunk.
Ezekkel tudunk elemi, CRUD műveleteket elvégezni, pl. lekérdezni. 
Ebben az alkalmazásban erőforrás a hibajegy, azaz `issue`, `GET` metódussal
kérdezzük le a `/issues/1` URL-en (ahol a legjobb gyakorlat, hogy a resource nevét 
többesszámban írjuk, és utána következik annak azonosítója). Ekkor a
következőt kapjuk vissza:

```json
{
  "id": 1,
  "title": "Write a post about REST",
  "state": "NEW"
}
```

Tegyük fel, hogy ezen a hibajegyen elkezdünk dolgozni, kérdés, hogy milyen REST
művelettel kéne ezt megoldani.

Itt az első megoldás lehetne az, hogy egy `PUT`-ot küldünk, amivel
átállítjuk a `state` mező értékét. Az ajánlás szerint mindig teljes 
resource-ot kell küldenünk, azaz a HTTP kérés így nézne ki.

(Zárójelben megjegyzem, hogy a REST azon kitétele, hogy mindig teljes
resource-ot kell küldeni, lehetővé teszi azt, hogy lekérdezés, létrehozás és módosítás
esetén is ugyanazt az osztályt használjuk. Régebben hajlamos voltam létrehozás
és módosítás esetén mást használni, hiszen mást adatokat akartam küldeni, de ez a REST-hez
nem illik, mint ahogy a későbbiekben látni fogjuk. Itt ugyan az elterjed DTO elnevezést szokták használni,
de én `Resource` postfix-ű osztályokat fogok használni, a 
[DTO-król szóló korábbi posztom alapján](/2023/08/01/modell-osztalyok.html).)

```plain
PUT http://localhost:8080/api/issues/1
Content-Type: application/json

{
  "id": 1,
  "title": "Write a post about REST",
  "state": "IN_PROGRESS"
}
```

Ezzel több bajom is van, nézzük ezeket tételesen:

* A legfontosabb, hogy nem látszik, hogy itt valójában egy üzleti folyamat került elindításra, ami mögött
  több művelet is lehet, pl. ellenőrzések, e-mail kiküldések, stb.
* El van rejtve a logika, a kliens tudja, hogy a munka megkezdésekor az
  `IN_PROGRESS` állapotot kell használni.
* Mindent küldeni kell, ez felesleges hálózati forgalommal jár.
* Mi az ami biztosítja azt, hogy közben a többi attribútum nem kerül módosításra, azaz
  nem változtatja meg címet, esetleg olyan más attribútumot, ami csak olvasható.
  (Erről jut eszembe, hogy mi van akkor, ha a törzsben és az url-ben nem ugyanaz az id szerepel. Miért kell ezt itt is és ott is küldeni?)
* Mi van, ha plusz adatokat kell adni a művelethez, melyek nem konkrétan az erőforráshoz tartoznak? Pl. a művelet idejét, a 
  felhasználót, művelet okát, stb.? Mi van, ha ezeket ugyanúgy REST API-n le kell kérdezni?

Itt talán azt a problémát megszüntethetjük, hogy ne kelljen újra elküldeni
a teljes erőforrást, ha a `PATCH` metódust használjuk. Ezzel azonban a legelső és
legfontosabb problémát nem oldjuk meg. (A `PATCH` metódusra még később vissztérünk.)

A másik megoldás, amit látni szoktam, hogy az URL-be elkezdenek igéket bevezetni,
azaz mehet egy `POST` a `/issues/1/start-work` címre, ahol az URL-ben
gyakorlatilag egy metódusnévnek megfelelő ige jelenik meg. Ezt viszonylag
egyszerű implementálni, de sajnos egyáltalán nem felel meg a REST gondolatiságának.
Hiszen ez az URL mögött nincs semmilyen resource. És ez nem is egy CRUD művelet.
Ez gyakorlatilag nem más, mint a REST félreértelmezése, és valamilyen hibrid RPC-s
megoldás bevezetése. Ha ilyet használunk, miért döntöttünk a REST mellett?
Így keverjük az elveket, az absztrakciókat.

Mi lehet tehát egy jó megoldás?

Ahhoz, hogy megoldást találjunk, lépjünk egyet vissza, és nézzük meg, hogy hogy nézne
ki ez objektumorientált oldalon. A teljes forráskód [megtalálható GitHubon](https://github.com/vicziani/jtechlog-rest-workflow).

Először vessük el azt a megoldást, hogy lenne egy `Issue` osztály, mely 
az adatokat tárolja, és egy `IssueService`, mely az `Issue` státuszát
állítgatja. Ez DDD nevezéktanában a klasszikus vérszegény modell (anemic model), amit ugyan gyakran
használunk, azonban az objektumorientált tervezéstől távol van.

Nézzünk inkább egy jobb megoldást!

```java
@Getter
public class Issue {
    private Long id;

    @Setter
    private String title;

    private IssueState state;

    public void startWork() {
        // ...
    }

    public void completeWork() {
        // ...
    }
}
```

Figyeljük meg a következőket! Azokhoz az attribútumokhoz, melyet nem lehet
módosítani, nincs setter metódus. A JPA tud ezek nélkül is működni 
(reflecionnel hozzáfér az attribútumhoz). Az `id` nem módosítható, és a
`state` attribútum értéke sem közvetlenül. Ami viszont üzleti logikához
kötődik, ahhoz külön metódusokat hoztunk létre. Így ránézésre megmondható,
hogy az entitásunk milyen üzleti folyamatokban vesz részt.
(A setterek halmaza nem írja le, hogy milyen műveleteket lehet elvégezni egy entitáson.)
 A `title` mező viszont csak egy leíró mező, ahhoz üzleti folyamat nem tartozik, ahhoz
nyugodtan létrehozhatunk egy settert (jelen esetben Lombokkal).

A `startWork()` és a `completeWork()` persze direktben állíthatná a `state`
mező értékét, de hamar rájövünk, hogy itt állapotátmenetekről van szó,
amit érdemes enummal megvalósítani. Így talán jobban érvényesül
a single responsibility, hogy az állapotátmeneteket kiszervezzük máshová.

```java
public enum IssueState {

    NEW, IN_PROGRESS, RESOLVED;

    public IssueState startWork() {
        if (this != NEW) {
            throw new IllegalArgumentException("You can start only new issue");
        }
        return IN_PROGRESS;
    }

    public IssueState completeWork() {
        if (this != IN_PROGRESS) {
            throw new IllegalArgumentException("You can start complete only in progress issue");
        }
        return RESOLVED;
    }

}
```

Itt megtörténik az ellenőrzés is, hogy munkát indítani csak `NEW` állapotú
`Issue`-n lehet, befejezni meg csak akkor, ha `IN_PROGRESS` állapotban van.
Ha változik a folyamat, elsődlegesen itt kell belenyúlni. Így már implementálhatjuk
a `startWork()` és a `completeWork()` metódusokat.

```java
public void startWork() {
    state = state.startWork();
}

public void completeWork() {
    state = state.completeWork();
}
```

Nos, valahogy azt kell elérnünk, hogy ezek a metódusok kerüljenek meghívásra egy megfelelő
REST hívás esetén.

A trükk itt az, hogy ugyanúgy, üzleti logikában kell gondolkozni, és az üzlet által
is használt fogalmakat kell használni, ráadásul resource-ok esetén főneveket kell keresni.

A legtriviálisabb példa erre, hogy mikor egy banki alkalmazást fejlesztünk, átutaláskor nem
a `transfer` igét használjuk, hanem az _átutalás_ (`transfer`) maga is egy entitás, és maga is egy resource,
saját azonosítóval. Szerencsétlen módon angolban az ige és a főnév is `transfer`, így nem a legszemléletesebb a példa.

Jelen esetben a munkafolyamatban valamilyen _lépést_ 
(most _actionnek_ fordítom, de lehetne akár _step_ is) szeretnénk elvégezni, ami önmaga is lehet
egy resource, méghozzá a hibajegy subresource-a.

Azaz REST oldalon a következőképp nézne ki:

```plain
POST http://localhost:8080/api/issues/1/actions
Content-Type: application/json

{
    "type": "START_WORK"
}
```

Azaz egy `POST` metódussal létrehozunk egy új `action` típusú resource-ot,
méghozzá az `1`-es azonosítójú hibajegy alatt. Amit visszakapunk:

```json
{
  "id": 1,
  "type": "START_WORK",
  "createdAt": "2023-08-31T17:04:17.9083384"
}
```

Látható, hogy ez is kap egy azonosítót, és később a hibajegyhez
kapcsolódó összes lépést le lehet kérni a `api/issues/1/actions` címen
`GET` metódussal, vagy azonosító szerint csak egy lépést
a `api/issues/1/actions/1` címen.

Nézzük, megoldottuk-e a felmerült problémákat:

* Minden lépéshez, üzleti folyamathoz egy külön resource tartozik, szépen látszik,
  hogy milyen üzleti folyamat kerül elindításra.
* Nem direktben állítjuk a státusz mezőt.
* A resource csak olyan mezőket tartalmaz, melyek az üzleti logika indításához kellenek.
  Még az id sem szerepel kétszer.
* Bármikor felvehetünk az erőforráshoz további mezőket.

Itt persze implementálni kell, hogy amikor elindul az üzleti logika,
a különböző entitások megfelelően változzanak.
Ezt egy service-ben implementáljuk, ugyanis itt két entitás is változik,
azaz egy entitáson belül nem tudjuk implementálni. (Tervezési döntés, 
hogy a hibajegyeket és a lépéseket külön aggregate-be teszem, ugyanis a hibajegy betöltésekor egyáltalán nincs szükségem
a lépésekre. Egyelőre itt ebből elég annyit érteni, hogy nincs referencia a két objektum között. A lépés a hibajegy
elsődleges kulcsára hivatkozik.)

```java
@Transactional
public ActionResource createAction(long issueId, ActionResource actionResource) {
    var issue = issueRepository.findById(issueId)
            .orElseThrow(() -> new IllegalArgumentException("Can not find issue by id %d".formatted(issueId))); // 1
    var action = Action.createFromResource(actionResource, issueId); // 2
    actionRepository.save(action); // 3
    switch (action.getType()) { // 4
        case START_WORK -> issue.startWork();
        case COMPLETE_WORK -> issue.completeWork();
        default -> throw new IllegalArgumentException("Invalid action");
    }
    return issueMapper.toResource(action); // 5
}
```

Szóval mi is történik itt?

1. Id alapján betöltésre kerül a hibajegy.
2. A lépés resource-a alapján létrehozunk egy lépés entitást.
3. A lépés entitást elmentjük.
4. Meghívjuk a hibajegy entitás megfelelő metódusát.
5. Visszatérünk a hibajegy entitáshoz tartozó resource-szal.

Röviden tehát létrehozzuk és lementjük a lépés entitást, valamint billentjük a hibajegy státuszát a megfelelő metódusán keresztül.

Itt persze dönthetünk úgy is, hogy a különböző lépéseket (munka elkezdése, munka befejezése) különböző resource-oknak vesszük, így külön url-eken kezeljük.
Dönthetünk úgy, hogy legyen egy interfész melyet minden lépés implementál, indokolt esetben egy absztrakt ősosztály, melynek a lépések 
a leszármazottjai.

De mi van akkor, ha csak úgy akarunk egy adatot módosítani, hogy nincs mögötte üzleti logika? Azaz például szeretnénk
módosítani a hibajegy címét? Első megoldásként szóba jöhet, hogy `PUT` metódussal a teljes resource-t újra küldjük. Itt azonban
megint ki biztosítja, hogy minden mező megfelelően került-e visszaküldésre? 

A másik megoldás a `PATCH` használata. A `PATCH` teszi lehetővé, hogy egy resource csak egy részét módosítsuk. (Ugye miért is létezne ez,
ha a `PUT` metódussal is meg lehetne ezt tenni?) 

Itt problémaként adódik, hogy amennyiben egy mezőt nem küldünk, akkor azt nem akarjuk módosítani, vagy az értékét törölni akarjuk?
Egy JSON-t deserialize-álva nem lehet megkülönböztetni, hogy kihagytuk-e az attribútumot, vagy `null` értékkel küldtük, a mező
értéke mindenképp `null` lesz.

Azaz nézzük meg a következő két JSON dokumentumot, először egy üres dokumentum

```json
{}
```

Majd egy dokumentum, melynek van egy `title` mezője:

```json
{
    "title": null
}
```

Mindkét esetben az `IssueResource` `title` mezőjének értéke `null` lesz. Azaz nem tudjuk megkülönböztetni,
hogy nem akarjuk módosítani, vagy `null` értékre akarjuk módosítani.

Rendben, de akkor hogyan is nézzen ki a kérés törzse `PATCH` esetén? Erre van az RFC 6902 (JavaScript Object Notation (JSON) Patch)
szabvány, ami egy jó választás lehet. Ha például a címet szeretnénk módosítani, akkor a következő kérést kell beküldenünk.

```plain
PATCH http://localhost:8080/api/issues/1
Content-Type: application/json-patch+json

[{
    "op": "replace",
    "path": "/title",
    "value": "Write a post about PATCH"
}]
```

(Figyeljük meg, saját content type-ja is van!)

Tehát a `replace` műveletet (op - operator) alkalmazzuk, a `/title` útvonalra. Ez utóbbi egy másik szabványnak - a RFC6901 (JSON-Pointer value) -
megfelelő formátumú. És persze a `value` mezőben a módosított érték.

Erre van több implementáció is, pl. a [json-patch](https://github.com/java-json-tools/json-patch). Ennek, és a többi libnek is az a jellemzője,
hogy JSON dokumentumon dolgozik. Természetesen a cél a resource, nem az entitás, hiszen ez a REST / controller réteg része. Emiatt ennek implementálása elég bonyolult.

1. Le kell kérni az `1`-es azonosítóval rendelkező hibajegyet, ez egy entitás.
2. Át kell alakítani ezt resource-á, és ezt visszaadni a controllernek.
3. Ezt visszaalakítani JSON-né (serialization).
4. Erre ráfuttatni a JSON Patch dokumentumot.
5. Visszaalakítani resource-á (deserialization), majd beküldeni a service rétegnek.
6. A resource-ot ráfuttatni az entitásra.

Ennek kódja a controllerben:

```java
@PatchMapping(value = "/{id}", consumes = "application/json-patch+json")
public IssueResource patchIssue(@PathVariable long id, @RequestBody JsonPatch patch) {
    var issue = issueService.findIssueById(id);
    var patched = patch(issue, patch);
    return issueService.update(id, patched);
}
```

Ebből a `patch()` saját metódus, hogy ne kelljen minden resource-ra külön megírni:

```java
private <T> T patch(T target, JsonPatch patch) {
    try {
        var json = objectMapper.convertValue(target, JsonNode.class);
        var patchedJson = patch.apply(json);
        var patchedResource = (T) objectMapper.treeToValue(patchedJson, target.getClass());
        return patchedResource;
    }
    catch (JsonPatchException | JsonProcessingException e) {
        throw new IllegalArgumentException("Can not patch %s".formatted(target.getClass()), e);
    }
}
```

Ez végzi a serializationt, JSON patch dokumentum ráfuttatását, majd deserializationt.

Így van egy ugyanolyan resource-om, mintha a teljes resource-t küldtem volna vissza,
azonban betöltésre került adatbázisból, és csak egy mező lett benne módosítva.

Most arról kéne gondoskodni, hogy ebből csak a módosítható attribútum kerüljön bemásolásra
az entitásba. (Ha például az `id` vagy `state` attribútumra jönne JSON Patch, az galibát okozna.)

Itt ahhoz a megint egyszerű ötlethez nyúlok, hogy ne agyatlanul hozzunk létre setter metódusokat az entitásban,
csak azokra az attribútumokra, melyeket tényleg lehet módosítani. Az entitás tehát még egyszer:

```java
@Getter
@Entity
public class Issue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Setter
    private String title;

    private IssueState state;

}
```

Igen, csak a `title` attribútumon van setter! És ismétlem, a JPA-t ez nem zavarja.
És egy újabb trükk, hogy mivel másoljuk át az adatokat a resource-ból az entitásba?

Erre is használhatjuk a MapStruct könyvtárat, ugyanis az nem csak konvertálni tud,
hanem egy objektumot update-elni is egy másik objektum alapján. Definiáljuk
így a metódust a mapperben:

```java
void update(@MappingTarget Issue issue, IssueResource resource);
```

Ez az `Issue` entitásra fogja rágörgetni az `IssueResource` adatait. De melyieket?
Szerencsére a MapStruct csak azokat másolja át, melyekhez van setter. Nézzük meg
a generált kódot!

```java
@Override
public void update(Issue issue, IssueResource resource) {
    if ( resource == null ) {
        return;
    }

    issue.setTitle( resource.getTitle() );
}
```

Igen, látszik, hogy csak a `title` mező tartalmát másolja át, az `id` és `state` mezőket
figyelmen kívül hagyja.

Így a service metódus:

```java
@Transactional
public IssueResource update(long id, IssueResource patchedIssue) {
    var issue = issueRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Can not find issue by id %d".formatted(id)));
    issueMapper.update(issue, patchedIssue);
    return issueMapper.toResource(issue);
}
```

Azaz betölti az entitást, meghívja a generált `update()` metódust, majd újra resource-á alakítja, és azt adja vissza.

Hogy lehetne pl. hibát dobni a felhasználónak, ha olyan mezőt akar módosítani,
melyet nem szabad? Sajnálatos módon a `JsonPatch` osztálynak nincsenek lekérdező
metódusai, azaz azt nem tudjuk validálni. Ez ennek a könyvtárnak a hátránya.

Sajnálatos módon ez a JSON Patch szabvány nem igazán terjedt el. A hozzá tartozó implementációk
is, pl. a `json-patch` könyvtárat érdemben több éve módosították. Hátránya, hogy
el kell végezni a serialization és deserialization műveleteket, nem tudja közvetlenül
a resource objektum gráfon futtatni a műveleteket.

Szóval nem igazán kaptam megnyugtató válaszokat a kérdéseimre.

Nézzünk rá még egyszer az objektumunkra!

```java
@Getter
public class Issue {
    private Long id;

    @Setter
    private String title;

    private IssueState state;

    public void startWork() {
        // ...
    }

    public void completeWork() {
        // ...
    }
}
```

Nem lenne egyszerűbb távolról a `setTitle()`, `startWork()` és `completeWork()` metódusokat meghívni,
elfelejtve a REST minden nehézségét?
   

