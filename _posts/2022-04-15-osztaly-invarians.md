---
layout: post
title: Gondolatok az objektumorientált programozásról
date: '2022-04-22T10:00:00.000+02:00'
author: István Viczián
description: Elő- és utófeltételek, offenzív és defenzív programozás, osztály invariáns, design by contract.
---

Egy fejlesztő számára a legtöbbször öröm egy új keretrendszer vagy lib kipróbálása, és használatba vétele,
azonban szerintem ugyanilyen fontos újra és újra visszanyúlni az objektumorientált alapokhoz, az osztályok és
metódusok tervezéshez. Ebben a posztban egy egyszerű példán keresztül próbálom bemutatni, hogy ennek is
milyen mélységei lehetnek, és mennyire nem egyértelmű a jó megoldás kiválasztása. Az itt megismert fogalmak
használata egyszerűsíti a fejlesztők közötti kommunikációt is.

A posztot az ihlette, hogy szó esett az invariánsról a Clean Code könyvben. És nem sokkal később 
a Domain-Driven Design könyvben is megemlítették.

<!-- more -->

A példában egy meetupra lehet jelentkezni, amíg van szabad hely. Van egy `Meetup` osztály, entitás,
valamint egy `MeetupService`, ami a felhasználói felület felől fogadja a hívásokat. A példaprojekt
elérhető a [GitHubon](https://github.com/vicziani/jtechlog-dbc).


A `Meetup`
osztály tartalma a következő.

```java
@Data
public class Meetup {

    private Long id;

    private int limit;

    private List<String> attendees;
}
```

A `limit` tartalmazza a szabad helyek számát, az `attendees` pedig a jelentkezők e-mail címeit.

A `MeetupService` `attend()` metódusa tartalmazza az üzleti logikát.
Azaz egy meetupra csak akkor lehet jelentkezni, hogyha van elég szabad hely.
Ennek egy kezdeti megközelítése lehet a következő kódrészlet.

```java
public class MeetupService {

    private MeetupRepo meetupRepo;

    public boolean attend(int meetupId, List<String> attendees) {
        Meetup meetup = meetupRepo.findById(meetupId);
        if (meetup.getAttendees().size() + attendees.size() <= meetup.getLimit()) {
            meetup.getAttendees().addAll(attendees);
            return true;
        }
        else {
            return false;
        }
    }
}
```

Manapság gyakran látok hasonló kódrészleteket üzleti alkalmazásokban, azonban van hova fejlődni.
Egyrészt intő jel lehet, hogy az `attend()` metódus a `Meetup` több attribútumára is hivatkozik egyszerre.

Másrészt a metódusok láncolt hívása a _Demeter törvényét_ sértik meg. Azaz a `meetup.getAttendees().addAll(attendees)`
metódushívások miatt a `MeetupService` jobban ismeri a `Meetup` osztály belső szerkezetét, mint az egészséges lenne.

De a fenti kódrészlettel az alapvető probléma: nem objektumorientált. Az objektumorientáltság alapja, hogy
az adatokat, és a rajtuk végzett műveleteket _egységbe zárja_. Ez a fenti kódnál nincs így,
hiszen a `Meetup` osztály tartalmazza az attribútumokat, a `MeetupService` pedig a rajtuk végzett műveleteket.
Ez ún. _anemic modell_, vagy magyarul vérszegény modell, melyet Martin Fowler jegyzett le először, és minősített antipatternnek.

Más néven ezt _transaction scriptnek_ is nevezzük, mely szépen egymás után, egy helyen leírja a tranzakcióban végzendő
műveleteket.

Amennyiben objektumorientáltabban szeretnénk szervezni a kódunkat, akkor a _Domain-Driven Design_ nyújthat segítséget,
mely kifejezetten szorgalmazza az olyan entitások használatát, amik maguk tartalmazzák az üzleti logikát.

Nézzük az ennek megfelelően módosított kódot:

```java
@Data
public class Meetup {

    private Long id;

    private int limit;

    private List<String> attendees;

    public boolean hasSpotsFor(List<String> newAttendees) {
        return attendees.size() + newAttendees.size() <= limit;
    }

    public void attend(List<String> newAttendees) {
        attendees.addAll(newAttendees);
    }

}
```

Itt már nem csak getter és setter metódusok vannak, hanem az üzleti logika is itt található.
Nézzük a módosított `MeetupService` osztályt!

```java
public class MeetupService {

    private MeetupRepo meetupRepo;

    public boolean attend(int meetupId, List<String> attendees) {
        Meetup meetup = meetupRepo.findById(meetupId);
        boolean success = false;
        if (meetup.hasSpotsFor(attendees)) {
            meetup.attend(attendees);
            success = true;
        }
        return success;
    }
}
```

Itt egyrészt módosultak a `Meetup` hívások, a `MeetupService` már nem lát bele annyira a 
`Meetup` működésébe.

Valamint a struktúrált programozásnak megfelelően azt a szabályt is érvényre juttattam, hogy
a metódusnak csak egy kilépési pontja lehetséges, azaz egy `return` utasítás található benne.

A fenti kóddal kapcsolatban az a probléma, hogy nincs leírva sem informálisan, sem formálisan, 
hogy a `Meetup` `attend()` metódusát csak akkor lehet meghívni, hogyha a `hasSpotsFor()`
metódus igaz értéket ad vissza. Ha a `MeetupService` ezen ellenőrzés nélkül hívja meg
az `attend()` metódust, akkor a `Meetup` objektumunk _inkonzisztens_, azaz ellentmondást
tartalmazó állapotba kerül át, azaz a résztvevők száma nagyobb lesz, mint a helyek száma.

A továbblépéshez először tisztázzunk pár fogalmat! Az objektumorientált fogalomkörben
a `Meetup` a server, a `MeetupService` pedig annak a kliense. Én azonban inkább a _hívott_
és a _hívó_ szavakat fogom erre használni. A _logikai kifejezések_ pedig olyan kifejezések,
melyek logikai típusú értéket adnak vissza, azaz igaz vagy hamis értékeket.

A `Meetup` osztály `attend()` metódusának előfeltétele, hogy egyrészt a jelentkezőket tartalmazó lista
ne legyen se `null`, se üres, hiszen akkor a hívásnak nincs értelme. Valamint a lista mérete legyen kisebb, 
vagy egyenlő, mint a szabad helyek száma.

A metódushoz tartozó _előfeltétel_, angolul _precondition_, tehát egy logikai kifejezés, aminek
igaznak kell lennie a metódus meghívásakor.

Ahogy a példában láthatjuk, az előfeltételek egy metódushívás paraméterére vonatkozhatnak (ne legyen `null` vagy üres), 
de vonatkozhatnak az adott objektum állapotára is (lista mérete legyen kisebb, 
vagy egyenlő, mint a szabad helyek száma).

A Java típusos nyelv, ezért a paramétereknek is meg kell adni típusát, ezzel is valójában további előfeltételeket fogalmazunk meg,
hiszen paraméterül csak `String` objektumok listáját lehet átadni.

Mit tegyünk akkor, ha a hívó mégsem teljesíti az előfeltételt? Dönthetünk úgy, hogy ebben
az esetben kivételt dobunk.

```java
public void attend(List<String> newAttendees) {
    if (newAttendees == null || newAttendees.isEmpty()) {
            throw new IllegalArgumentException("Must contain attendees");
        }
    if (!hasSpotsFor(newAttendees)) {
            throw new IllegalArgumentException("Has no spots");
    }
    attendees.addAll(newAttendees);
}
```

Ezt a megoldást hívják _offenzív programozásnak_, ugyanis a hívót támadjuk azért (kivételt dobunk neki), mert nem teljesítette az előfeltételeket.
Azaz egy programozási hibára egy kivétellel válaszolunk, amit ha a hívó oldal nem kezel, leáll a program működése.
Úgy is szoktunk rá hivatkozni, hogy _fail fast_ azaz a programozási hiba a lehető leghamarabb derüljön ki, és egy elég
szélsőséges működéssel, konkrétan leállással. Ha hamar kiderül, akkor hamar javítani is lehet.

Ezzel a feltétellel csak az az egy probléma van, hogy a feltétel sosem lesz igaz, hiszen a `MeetupService` már 
gondoskodik arról, hogy ne kerüljön meghívásra, ha nem teljesülnek az előfeltételek.

```java
public boolean attend(int meetupId, List<String> attendees) {
    if (attendees == null || attendees.isEmpty()) {
        throw new IllegalArgumentException("Must contain attendees");
    }
    Meetup meetup = meetupRepo.findById(meetupId);
    boolean success = false;
    if (meetup.hasSpotsFor(attendees)) {
        meetup.attend(attendees);
        success = true;
    }
    return success;
}
```

Itt már az is látszik, hogy a `MeetupService` osztályban lévő `attend()` metódus sem kaphat
üres listát, ez már a felhasználói felületnek át sem kellett volna engednie.

A plusz elágazások nehezítik az olvashatóságot, és egy bonyolultabb feltétel futás közben is overhead.
Az üres lista ellenőrzésénél ráadásul azt is láthatjuk, hogy ugyanaz az előfeltétel
a hívási láncban akár többször is előfordulhat.

Egy kicsit olvashatóbb megoldás a Guava `Preconditions` osztály használata, mellyel
a `Meetup` osztály `attend()` metódusa a következőképp váltható ki.

```java
public void attend(List<String> newAttendees) {
    Preconditions.checkArgument(newAttendees != null && newAttendees.size() > 0);
    Preconditions.checkArgument(hasSpotsFor(newAttendees));

    attendees.addAll(newAttendees);
}
```

Ha a feltétel nem teljesül, akkor ugyanúgy `IllegalArgumentException` kivételt dobnak.

Feltétel és kivételdobás helyett választhatjuk az `assert` nyelvi elem használatát is.
(Nem keverendő a unit tesztekben használt assert utasításokkal!)
Az assert szintén egy logikai kifejezést vár, és ha nem teljesül, akkor egy
kivételt dob.

A `Meetup` osztály `attend()` metódusa így módosul:

```java
public void attend(List<String> newAttendees) {
    assert newAttendees != null && newAttendees.size() > 0;
    assert hasSpotsFor(newAttendees);

    attendees.addAll(newAttendees);
}
```

Ettől egyrészt a kód is átláthatóbb lett, másrészt az `assert` utasítás
csak akkor dob kivételt a hamis logikai kifejezés esetén, ha a JVM-et
a `-ea` (enable assertions) kapcsolóval indítjuk.

Ha nem ezt a kapcsolót használjuk, akkor a paraméterként átadott 
kifejezéseket ki sem értékeli, nem hívja meg a metódusokat, nincs overhead.

És ekkor ezt hagyjuk bekapcsolva az automata (pl. unit) és manuális tesztek futtatásakor,
éles rendszeren azonban kapcsoljuk ki.

Mikor melyiket használjuk?

* Amennyiben az osztályunkat más, a saját fennhatóságunk alatt lévő osztályok hívják,
  amit könnyen tudunk módosítani, használjunk asserteket!
* Amennyiben az osztályunkat külső kliensek hívják, dobjunk kivételt!
* Amennyiben a feltétel programhiba miatt nem teljesül, használjunk asserteket!
* Amennyiben a hibával az alkalmazáson belül magasabb szinten valamit kezdeni tudunk, használjunk kivételt!

Így az assert használata az entitásban jó választás lehet, és a service-ben pedig hagyjuk
a kivételt!

Nézzünk további hibás eseteket! Mi van akkor, ha olyanok próbálnak jelentkezni, akik
már jelentkeztek? Vagy mi van akkor, ha a jelentkezés valami miatt kétszer fut be?
(Pl. hálózati hiba miatt újra próbálkozás.) Ekkor nem biztos, hogy az a legjobb
megoldás, hogy hibát dobunk vissza. Ilyenkor érdemes ezt a hibát valahogy kezelni.
Ebben az esetben pl. az érvénytelen, második jelentkezéseket figyelmen kívül hagyjuk.

Ehhez új metódus kell a `Meetup` osztályba, ami leválogatja, hogy melyek azok
a jelentkezők, akik még nem jelentkeztek. És a service csak ezeket adja hozzá.

```java
public List<String> getNotAttended(List<String> newAttendees) {
    return newAttendees.stream().filter(newAttendee -> !attendees.contains(newAttendee)).toList();
}
```

A `MeetupService` `attend()` metódusa.

```java
public boolean attend(int meetupId, List<String> attendees) {
    if (attendees == null || attendees.isEmpty()) {
        throw new IllegalArgumentException("Must contain attendees");
    }
    Meetup meetup = meetupRepo.findById(meetupId);
    boolean success = false;
    List<String> notAttendedYet = meetup.getNotAttended(attendees);
    if (notAttendedYet.size() > 0 && meetup.hasSpotsFor(notAttendedYet)) {
        meetup.attend(notAttendedYet);
        success = true;
    }
    return success;
}
```

És új assert kerül a `Meetup` osztályba, ami ellenőrzi, hogy ne jelentkezzen az, aki már jelentkezett.

```java
public boolean containsAny(List<String> newAttendees) {
        return newAttendees.stream().anyMatch(newAttendee -> attendees.contains(newAttendee));
}

public void attend(List<String> newAttendees) {
    assert newAttendees != null && newAttendees.size() > 0;
    assert hasSpotsFor(newAttendees);
    assert !containsAny(newAttendees);

    attendees.addAll(newAttendees);
}
```

Ez abban az esetben, ha már megtörtént a jelentkezés, nem dob hibát, hanem megpróbálja kezelni.

Ezt a fajta programozást _defenzív_, azaz védekező programozásnak nevezzük.
Itt a kezelhető, külső forrásból származó kivételeket próbáljuk kezelni,
valamilyen kerülő megoldást találni. Azaz felkészülünk, és kezeljük a váratlan helyzeteket. (Szemben az offenzív programozással,
ahol a belső, nem kezelhető programozási hibától próbáljuk megvédeni magunkat úgy, hogy hibát dobunk, így hamar kiderül és javítható.
Ezek a nem várt programozási hibák pl. a nem várt paraméter, vagy nem várt, azaz nem dokumentált visszatérési érték.)
A defenzív programozásnál gyakran alapértelmezett értékeket, alapértelmezetten lefutó kódblokkokat használunk.

Ezt szokták nevezni _fail safe_ megoldásnak is, hiszen nem áll le hibával a futás, hanem kezeljük a kivételes helyzetet, és fut tovább a program.

Az előbbi esetben a metódusunk ráadásul *idempotens*, azaz ha kétszer meghívjuk, ugyanaz az eredményt adja vissza. Második híváskor az állapot nem változik.
Ez nagyon jó tulajdonság akkor, ha fel kell készülnünk arra, hogy egy üzenetet akár kétszer is megkaphatunk.

Ez a megoldás sem jó minden esetben. Egyrészt túl sok plusz kód szükséges hozzá, plusz elágazások. Olyan kivételes helyzetet is próbálunk kezelni, ami nem
fog jelentkezni. Lehet, hogy valódi hibát nyel el, amit próbál, tévesen kezelni. (Erre példa, amikor a metódust úgy írjuk meg, hogy a túl hosszú String
végét levágjuk, hiszen úgysem lesz sosem olyan hosszú.)

Most, hogy azt is láttuk, hogy lehet az előfeltételeket formálisan definiálni, nézzük meg, hogy hogyan lehet azt leírni, hogy egy
metódusnak mi az eredménye. Ez a hívó oldalnak fontos, hogy formálisan is le legyen írva, hogy mire számíthat akkor, ha a hívott metódus helyesen fut le.
Nézzük mit jelent ez a `Meetup` osztályban!

```java
public void attend(List<String> newAttendees) {
    // Preconditions
    assert newAttendees != null && newAttendees.size() > 0;
    assert hasSpotsFor(newAttendees);
    assert !containsAny(newAttendees);

    attendees.addAll(newAttendees);

    // Postconditions
    assert attendees.contains(newAttendees);
}
```

Ennek a hivatalos neve az _utófeltétel_, azaz _postcondition_. Az is látható, hogy szintén megadható
assert használatával. Az utófeltételben szerepelhetnek paraméterek, az objektum állapota, de még a visszatérési érték is.

Az előfeltételekben és utófeltételekben bizonyos feltételek ismétlődhetnek. Ezek lehetnek olyan feltételek,
melyeknek az osztály _állapotának_ (attribútumainak értékeinek összességének) mindig meg kell felelnie. Jelen példánkban ez az, hogy
a résztvevők száma sosem haladhatja meg a helyek számát.

```java
public void attend(List<String> newAttendees) {
    // Preconditions
    assert newAttendees != null && newAttendees.size() > 0;
    assert hasSpotsFor(newAttendees);
    assert !containsAny(newAttendees);

    attendees.addAll(newAttendees);

    // Postconditions
    assert attendees.contains(newAttendees);

    // Invariant
    assert checkAttendeesHaveSpots();
}

private boolean checkAttendeesHaveSpots() {
    return attendees.size() <= limit;
}
```

Ezt egy külön metódusba szerveztem ki, hiszen majd több metódusban is fel akarom használni.
Az `attend()` metódusban szintén asserttel hívom meg.

Ezt a feltételt hívják _invariánsnak_. Az osztály attribútumainak értékei mindig meg kell, hogy feleljenek
ennek a feltételnek. Ennek a feltételnek a teljesülését a konstruktorok és a publikus
metódusok tartják fel. Ennek a feltételnek a konstruktor hívása előtt, minden metódus hívása előtt és
után is teljesülnie kell. A konstruktor és a metódusok futása közben ideiglenesen lehet hamis,
de a lefutás végén mindig igaznak kell lennie.

Mire való tehát az invariáns? Az adott osztály fejlesztőjének mondja meg, hogy mire kell figyelnie, ha
konstruktort vagy metódust változtat, vagy újat ad hozzá. Elvileg nem kell ellenőrizni, hiszen
pont a fejlesztő garantálja ezt. Ha ezt még szigorúbban akarjuk garantálni, akkor kell ezeket az
invariánsokat mindig ellenőrizni. Es sajnos nem megy másképp, csak minden metódus futása utáni
feltételes kifejezés kiértékelésével.

Képzeljük el, hogy kell egy új metódus, ami a helyek számát csökkenti. Ez nem mehet a
már jelentkezettek száma alá.

```java
public void decreaseLimitTo(int newLimit) {
    assert newLimit > 0 && newLimit < limit;
    assert newLimit >= attendees.size();

    limit = newLimit;

    assert limit == newLimit;
    assert checkAttendeesHaveSpots();
}
```

Látható, ha biztosak akarunk lenni, hogy a metódus meghívása után is teljesül az invariáns,
akkor ellenőrizni kell azt (`assert checkAttendeesHaveSpots()`).

A _Design by contract_ az a megközelítés, mely az absztrakt adattípusokat kiegészíti előfeltételekkel (precondition), utófeltételekkel (postcondition) és
invariánsokkal. (A Hoare logikában is előfeltételeket és utófeltételeket lehet formálisan megadni, ami programhelyesség bizonyításra használható, és a Design by contract egy előzményének tekinthető.) Ezek pontos és formális leírása alkotja a szerződést. A Design by contract feltételezi, hogy mindkét fél, azaz a hívó és a hívott fél is teljesíti a szerződés feltételeit. A DbC szorgalmazza, hogy a szerződést előre írjuk meg, lehetőleg a tervezés részeként.

Ideális esetben nem az üzleti logikával keverve kéne a szerződést ellenőrzni. Ideális esetben a szerződés megsértése fordítási időben jelentkezik. Ilyen
pl. típusok használata, ugyanis ha paraméterül egész számot kell átadni, de én lebegőpontos számot adok át, akkor a program le sem fordul.

Sajnos a Design by contract alkalmazására Javaban nincs kielégítő megoldás.

Az egyik mód, ha a forráskódban, megjegyzésekben definiáljuk. Sajnos ez nem formális, nem automatikusan nem is ellenőrizhető. Azonban ez is több, mint a semmi. Ha más
megoldást nem is választunk, legalább ezt használjuk.

Fontos, hogy a Design by contract a programozói hibáktól próbál megóvni minket. Ezért hasznos, ha fejlesztés és tesztelés közben bekapcsolható, éles környezetben
viszont kikapcsolható. Ezért alkalmas az assertek használata. Amúgy a Java assertion egy [régi dokumentációja](https://docs.oracle.com/cd/E19683-01/806-7930/assert-13/index.html)
is ezeket a fogalmakat használja.

A Design by contract nem váltja ki a tesztelést, hanem kiegészíti, akár a unit tesztelést, akár a manuális tesztelést teszt környezetben bekapcsolt assertekkel. Már azelőtt kiderül a programozási hiba, hogy hibás érték jönne vissza. Az assert érdekessége ebben az esetben, hogy nem a teszt része, hanem a tesztelendő rendszer (SUT) része.
Az előfeltételek figyelembe vételével a tesztesetek szűkíthetőek.

Amúgy voltak régebbi próbálkozások a témában, de ezek egyike sem terjedt el. Egyrészt a Google nevéhez fűződő annotáció alapú
[Cofoja](https://github.com/nhatminhle/cofoja), sajnos több éve nem fejlesztik.
A másik a [valid4j](http://www.valid4j.org/), szintén évek óta nem fejlődő projekt. Érdekes még az [OVal](https://github.com/sebthom/oval), mely archiválásra került, azzal
a javaslattal, hogy használjunk Bean Validationt.

A Bean Validation használata erre amúgy érdekes felvetés. Az invariánst meg tudjuk adni saját class level constraint annotációval, amire viszont valamikor meg kell hívnunk
az ellenőrzést. Az sem szimpatikus, hogy a validator a `Meetup` osztály csak a publikus API-jához fér hozzá, azaz a belső állapotát nem tudja feltétlen ellenőrizni.

A elő- és utófeltétel ellenőrzésére jó lenne a method-level constraint, de ennek is vannak hátrányai. Valahogy rá kéne beszélni a JVM-et, hogy
a metódus hívása előtt és után futtassa le a paraméterek vagy a visszatérési érték ellenőrzését. Ezt viszont valamilyen AOP megoldással lehetne.
Amit viszont nem biztos, hogy a domain rétegben alkalmazni kéne, ezzel megsértve azt az egyszerűséget, hogy ott lehetőleg csak Java SE-t alkalmazzunk, és
legyen keretrendszer független.

A Bean Validation példa bemutatása túlmutat a poszt keretein, de akit érdekel, megnézheti a megoldást a példa projektben.

Nagyon komoly, és a mai napig fejlődő megoldás az [OpenJML](https://www.openjml.org/). Ehhez létezik egy külön nyelv,
a [Java Modeling Language](https://www.cs.ucf.edu/~leavens/JML/index.shtml), melyben a szerződés formálisan, JavaDoc-ban vagy annotációval megadható, és ellenőrizhető.

Ha egy kicsit kitekintünk, a Design by contract az Eiffel programozási nyelvtől származik, ami nyelvi szinten támogatta. Az előfeltételeket a `require`,
az utófeltételeket az `ensure` kulcsszó után lehetett írni. (Nem annyira limitált, mint az `assert` használata.)

Pythonban nincs nyelvi szintű támogatás, azonban a dekorátorok miatt egyszerűen implementálható, és több library is létezik, pl. az 
[icontract](https://pypi.org/project/icontract/).

Most csak a `Meetup` osztályon belüli üzleti metódusokkal foglalkoztunk, azonban mi a helyzet a setterekkel? Hamar felismerhető, hogy egy 
figyelmetlen `setLimit()` vagy `setAttendees()` hívás teljesen megboríthatja az invariánsainkat, és itt is kéne elő- és utófeltételeket
alkalmazni. Ha azonban kódot teszünk bele, akkor egy gyakori gyakorlatot szegünk meg, hiszen setterbe nem nagyon szoktunk kódot írni.

És a getterek? Sajnos azzal is van probléma. Nézzük a következő kódrészletet:

```java
meetup.getAttendees().addAll(newAttendees);
```

Ez gyakorlatilag megkerüli az üzleti metódusokat, és közvetlen változtatja a kollekció tartalmát. Erre megoldás lehet, ha egy
módosíthatatlan burkoló példányt ad vissza a getter metódus. (Már így is több logika van benne, mint kéne.)

```java
public List<String> getAttendees() {
    return Collections.unmodifiableList(attendees);
}
```

Ekkor a fenti kódrészlet kivételt fog dobni. Sajnos a Lombok alkotói mereven elzárkóztak, hogy valami hasonló megoldást építsenek bele,
ugyanis nem csak a kollekciókkal, hanem bármilyen változtatható állapotú osztállyal baj van, amire nem lehet általános megoldást hozni.

Az invariánsokkal ráadásul az öröklődésnél is probléma van. Ha a leszármazott direkt hozzáférhet az ős attribútumaihoz, pl. protected, 
megkerülheti az invariánsok biztosítását, megsértheti a laza függőséget. Ezért inkább kerüljük a protected hozzáférést, vagy használjunk
kompozíciót. A leszármazottak az invariáns feltételeit szigoríthatják, de nem lazíthatják. 
