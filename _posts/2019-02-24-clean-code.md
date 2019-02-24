---
layout: post
title: Clean Code könyv Args példájának újragondolása
date: '2019-02-24T18:00:00.000+01:00'
author: István Viczián
tags:
-
description: Egy poszt a Clean Code könyv egyik mintapéldájáról, erősen koncentrálva a tesztelésre.
---

Azt hiszem, abban megegyezhetünk, hogy Robert C. Martin: Clean Code
könyvét minden programozónak el kell olvasnia. A könyv szinte a
fejlesztők bibliájává vált, vannak cégek, ahol a céges kódolási konvenciók
kimondják a könyvben található szabályok és iránymutatások betartását.
(A könyv megjelent magyarul is Tiszta kód címmel.)

![Clean Code könyv](/artifacts/posts/2019-02-24-clean-code/clean-code.jpg)

A könyvnek a 14. fejezete Successive Refinement címen tartalmaz egy 
esettanulmányt. Egy olyan kódrészletet kell írni, melynek meg lehet adni,
hogy a program milyen parancssori paramétereket vár, majd elemzi azokat.
A fejezet egyből a jó megoldással indít, majd leírja, hogy folyamatos
finomítással hogyan alakult ki a végleges kód, és milyen refaktoring
eljárásokat alkalmazott. A fejezetet ugyan viszonylag gyorsan át lehet olvasni,
azonban ha az ember komolyan át szeretné gondolni, megérteni, sok időt el lehet 
vele tölteni. Mivel a kódot átolvasva többször elgondolkoztam rajta, hogy vajon
én hogyan írnám meg, a végén úgy döntöttem, hogy megírom a teljes feladatot.

A megoldás során a következőket tartottam szem előtt. Mivel a kódhoz adottak
voltak tesztesetek, tesztvezérelt módon fejleszthettem, garantálva, hogy a
megoldásom a könyvben szereplő megoldással ekvivalens lesz. Mivel a tesztelés
mostanában különösen kedves nekem, átgondoltam a könyvben szereplő teszteseteket,
keresve, hogy vannak-e hiányosságok, kihagyott tesztesetek. Nem ragaszkodtam
teljes mértékben az API-hoz, ha valahol módosítást láttam jónak, megtettem.
A legfrissebb technológiákat használtam, mint a Java 11, JUnit 5 és Maven.

És a legfontosabb, hogy összegyűjtöttem a tapasztalatokat és tanulságokat,
mind magamnak, mind nektek, hogy többen tanulni tudjunk belőle. Mindenkinek
javaslom, hogy a feladat leírása alapján próbálja meg maga is implementálni.

A megoldásom megtalálható a [GitHubon](https://github.com/vicziani/jtechlog-cc-args).

<!-- more -->

## Feladatleírás

Anélkül, hogy a kódról érdemben beszélni tudjunk, nem kerülhetjük el a 
feladat pontos leírását. A könyv ezt eléggé elnagyolja, sokmindent a
kódból, valamint a tesztesetekből kellett visszafejteni.

Adott egy parancssoros program, melynek meg lehet mondani, hogy 
milyen paramétereket fogadjon el. Majd a programot paraméterezve
meghívva ez alapján feldolgozza a paramétereket.

Egy formátumleíró karakterláncot, vagy sémát kell megadni annak leírásához,
hogy a program milyen paramétereket vár, és azok milyen típusúak lehetnek.

A könyvben szereplő példa:

    l,p#,d*

Az `l` egy logikai paramétert, a `p` egy egészt, a `d` egy szöveges értéket takar.

A parancs meghívása ekkor a következőképpen történhet:

    java ArgsMain -l -p 10 -d alpha

Ekkor a lekérdezhető paraméter értékek:

    l = true (logikai)
    p = 10 (egész)
    d = alpha (szöveges)

A könyv ezen kívül definiál lebegőpontos értéket, melyet a `x##` sémával kell megadni,
valamint szöveges tömb értéket, melyet a `x[*]` sémával kell megadni.

Az író GitHub projektjei között megtalálható a [forráskód is](https://github.com/unclebob/javaargs).

Csak a GitHubon egy másik példa séma is található:

    java ArgsMain -f -s Bob -n 1 -a 3.2 -p e1 -p e2 -p e3

Ekkor az értékek:

    f = true (logikai)
    s = Bob (szöveges)
    n = 1 (egész)
    a = 3.2 (lebegőpontos)
    p = [e1, e2, e3] (tömb)

Csak a GitHubon ezen kívül szerepel egy `MapArgumentMarshaler` is. Valamint további tesztesetek a
tömb típusra, valamint a mapre is.

Az API használatához az `Args` osztályt kell példányosítani, átadva neki a 
sémát, és a parancssori paramétereket. Majd a `getBoolean()`, `getString()`, stb.
metódusokkal lehet lekérni a paraméter értékeket.

```java
Args arg = new Args("l,p#,d*", args);
boolean logging = arg.getBoolean('l');
int port = arg.getInt('p');
String directory = arg.getString('d');
```

És akkor nézzük a fejlesztés során gyűjtött tapasztalatokat.

## Fogalomtár

Bár ez nekem a mániám, nem gondoltam, hogy ilyen pici projekt esetén is definiálni kell egy
fogalomtárat, hogy mi alatt mit értünk. Mikor ezt még nem adtam meg, össze-vissza neveztem el
az attribútumokat, metódus paramétereket, lokális változókat. Ezek között rendet tenni
csak az alábbi fogalomtár tudott.

* `schema`: a minta, formátumleíró karakterlánc, a séma, ami megmondja, hogy milyen paramétereket lehet használni, és azok milyen típusúak. A schema
  schema elementekből áll, melyek vesszővel vannak elválasztva. Pl. `l,p#,d*`.
* `schema element`: schema része, mely egy paraméterre vonatkozik, egy argument idból és egy type definitionből áll. Pl. `p#`.
* `argument id`: paraméter azonosító, az a karakter (csak betű lehet), ami a paramétert egyedileg azonosítja. Pl. `p`.
* `argument type definition`: az adott paraméter típusát leíró karakterlánc. Pl. `#`.
* `argument`: a parancssori paraméter, mely tartalmazza a paraméter azonosítóját vagy értékét. Példák: `-l`, `-p`, `10`, `-d`, `alpha`
* `argument value`: a paraméter értéke, immár a megfelelő típussal (`boolean`, `String`, stb.). Pl. `true` vagy `alpha`
* `flag`: olyan paraméter, melynek nincs érték paramétere, a `boolean` típusú ilyen, hiszen elég csak az argument id-t használni

## Tesztesetek

A tesztesetek hasznosságát nem győzöm kiemelni. Nem egy refaktoring után sikerült az összes tesztesetet elrontani,
de ami még veszélyesebb, hogy egy apró módosítás után csak egy teszteset romlott el. A tesztesetek rendszeres futtatásával
biztos lehettem benne, hogy már működő funkciót nem rontok el.

Ami először feltűnt a könyv példájában, hogy nem elöl helyezkednek el azok a tesztesetek, melyek az úgynevezett _happy path_-t, azaz 
üzletileg leggyakoribb eseteket tesztelnek. (Nem, ezek nem a pozitív tesztek, bármennyire is egyszerű lenne
őket így hívni.) Helyette a hibakezelés tesztelése történt meg először. Ezeket én megcseréltem.

A könyvben írt tesztesetek nem adtak 100%-os utasítás lefedettséget, voltak olyan ágak, melyre nem volt teszteset.
Ilyenek például azok az esetek, mikor más típus volt megadva a sémában, és más metódussal kértük le. Pl.
`p#`, ami karakteres értéket jelent, de mi mégis a `getBoolean()` metódust hívtuk meg.

A saját megoldásomra sikerült majdnem 100%-os utasítás lefedettséget írni, csak azon utasítások nincs lefedve, ahova 
nem kerülhet a vezérlés, ezekben az utasításokban kivétel nélkül `UnsupportedOperationException`
kivételt dobok.

A GitHubon lévő példákban a teszt metódusok nem mindegyike kezdődik a `test` prefixszel (pedig segíti az olvasást), 
valamint nem is mindig kezdődik kisbetűvel, ezeket egységesítetem.

A tesztesetek végigolvasásával találtam olyan funkciókat, melyek nem voltak leírva, és csak a kód alapos átnézése után
jöttem volna rá.

Ilyen például, hogy több paraméter azonosítót is meg lehet adni egy paraméterben. A teszteset így nézett ki:

```java
@Test
public void testSpacesInFormat() throws Exception {
  Args args = new Args("x, y", new String[]{"-xy"});
  assertTrue(args.has('x'));
  assertTrue(args.has('y'));
}
```

A teszteset így azonban nem megfelelő, hiszen egyszerre két dolgot mutatott meg. Egyrészt a neve (`testSpacesInFormat`)
arra utal, hogy a sémában meg lehet adni szóközt is, azonban az elvárt eredménynél az is látható, hogy
a paraméter azonosítókat egy paraméterben is meg lehet adni (`-xy`).

A tesztesetek még egy dologban nagyon sokat segítettek. Ha nem tudtam, hogy az alkalmazás hogy működik bizonyos
bemeneti értékekre, akkor a legegyszerűbb megoldás, hogy megírom rá a tesztesetet, majd átemelem az én projektembe is.
Ezzel nem kellett kódot fejtenem, egyszerűen kipróbáltam, hogy működik, lehet debugolni, valamint nem utolsó sorban
reprodukálható marad. Az előző példánál maradva pl. látható, hogy hogyan működik logikai értékeknél, de mi történik
szöveges paraméterekkel? Először megírtam a tesztet:

```java
@Test
public void testCompoundParams() {
    Args args = new Args("x*,y*", new String[]{"-xy", "alpha", "beta"});
    assertEquals("alpha", args.getString('x'));
    assertEquals("beta", args.getString('y'));
}
```

Látható, hogy ezzel egy speciális működésre akadtam. Azonban a következő formában nem működött:

```java
@Test
public void testLooksLikeCompoundParams() {
    Args args = new Args("x*,y*", new String[]{"-x", "-y", "alpha", "beta"});
    assertEquals("-y", args.getString('x'));
}
```

A példában látható, hogy a `-y` érték tartozik az `x` paraméter azonosítóhoz.

Az sem volt leírva, mi történik akkor, ha kétszer ugyanazt a paramétert adom meg.

```java
@Test
public void testDuplicate() {
    Args args = new Args("x*", new String[]{"-x", "alpha", "-x", "beta"});
    assertEquals("beta", args.getString('x'));
}
```

Látható, hogy a második paraméter érték felülírja az elsőt. Én ezeket a teszteket karakterizációs tesztnek ismerem,
mely elnevezést Michael Feathers vezette be a _Working Effectively With Legacy Code_ című könyvében.
(Ha valaki másképp tudja, majd kijavít.)

Ezekből az is látható, hogy hiába volt 100%-os a utasítás lefedettség, voltak olyan üzleti esetek,
melyekre nem volt teszteset. Feltételezem, edge coverage alkalmazása segített volna, ahol minden lehetséges
lefutási ágat teszteljük.

## Implementáció

Az implementáció során én egyértelműen szétválasztottam a séma beolvasást (`SchemaReader`),
a paraméter elemzést (`ArgumentsReader`), valamint a különböző típusokhoz tartozó
`ArgumentParser`-eket.

Az `ArgumentParser` ráadásul típusparaméterrel is rendelkezik, így jobb a típusbiztonság is.
Ebben az interfészben kihasználom a Java 8-ban megjelent default és statikus metódusokat is.

Az implementációmban még büszke vagyok az összetett paraméterek kezelésére, azaz pl.
`-ab alpha beta`. Ezt egy sor `(Queue)` használatával oldottam meg, a paraméter azonosítóknál
betettem a parsereket egy sorba, amik sorban kapták meg a paraméter értékeket. Ezáltal elértem,
hogy minden parser csak a neki szóló paraméterekhez férjen hozzá. A könyv megoldásában az nem tetszett,
hogy a parserek (ő marshallernek hívja) tetszőlegesen hozzáfértek az összes paraméterhez és
tetszőletesen lépkedhettek rajta, ráadásul előre és hátra is.

A legnehezebb, ahogy a könyv is említi, a különböző metódusok megfelelő absztrakciós
szintjének eltalálása volt. Ezt meg lehet közelíteni elméleti oldalról, azonban nekem
egy szabály betartása sokat segített ebben. Ez pedig az, hogy egy metóduson belül
nem használtam egymásba ágyazott blokkokat, azaz pl. nem szerepelhetett 
ciklusban feltétel, másik ciklus. Arra is vigyáztam, hogy ahol try-catch van,
abban a metódusban más ne szerepeljen, és a try törzsében is csak egy sor szerepelhessen.
Ezen szabályok betartása nagy odafigyelést igényel, de sokkal átláthatóbb kódot eredményez.

Még mindig sokszor elgondolkozom, hogy mikor használjak osztály attribútumot, és mikor
adjam át az adatokat metódus paraméterként. Én az utóbbinak voltam inkább a híve,
azonban a könyv egy kicsit rávilágított arra, hogy sokszor érdemesebb egy attribútumot felvenni,
mint egy hosszú hívási láncon paraméterként átadni. A következőket figyeltem meg. Egyrészt
akkor mindenképp jó az attribútum, ha az osztályomat kívülről hívják, és a két hívás között
akarok állapotot megőrizni. Másrészt akkor lehet elgondolkodni attribútum használatán, ha
olyan metódust szándékozok írni, ami a paramétert módosítaná, pl. egy kollekcióba tesz
egy elemet. A másik, amikor érdemes elgondolkozni, mikor a metódus `static` kulcsszóval is
működne.

Folyamatosan figyeltem, hogy se az IDEA, se a SonarQube hibákat, figyelmeztetéseket ne jelezzen.
A könyvben használt kódban vannak olyan egysoros feltételek, ahol nincs kapcsos zárójel
használva, én mindig javaslom a zárójelek kirakását.

Manapság nem annyira szeretjük a ellenőrzött (checked) kivételeket, így a `ArgsException` 
nálam `RuntimeException` leszármazott lett. A könyvben szereplő kódban nem lett beállítva
a kivétel `message` attribútuma, ezért én statikus metódusokkal hozom létre. Nem szeretek
természetes nyelvi szövegeket látni a kódban, így kiszerveztem egy `MessageBundle`-be,
melyet az `ErrorCode` felsorolásos típus (enum) old fel. Ezért az sem belső osztály, kiszerveztem
önálló fájlba. A könyvben szerepelt még paraméterként átadva `null` érték, ehelyett én
overloadolt metódusokat használtam.

A következő szabályokat emelném még ki a könyvből, amelyeket érdemes észben tartani.
Amennyiben a `null` és `instanceof` szavak megjelennek a kódunkban, gondolkodjunk el,
hogy szükség van-e rá. Amikor `boolean` típusú paramétert szeretnénk átadni, ne tegyük.
És ne használjuk a kivételeket vezérlésre, bármennyire is kényelmes lenne. Az tényleg
csak a hibás, nem várt esetekre van fenntartva.

A JUnit 5-ben a kivételek ellenőrzésére van egy kényelmes mód, az `assertThrows`
használata a következő módon:

```java
@Test
public void testWithNoSchemaButWithOneArgument() {
    ArgsException e = assertThrows(ArgsException.class,
            () -> new Args("", new String[]{"-x"}));

    assertEquals(ErrorCode.UNEXPECTED_ARGUMENT,
            e.getErrorCode());
    assertEquals('x', e.getErrorArgumentId());
}
```

## Összefoglalás

Egy ilyen egyszerűnek tűnő példa is látható, hogy mennyi kihívást tartogat, így mindenkinek
ajánlom gyakorlásként. Ezen kívül az is jól látható volt, hogy mennyire fontos a tesztelés,
mennyire érdemes tisztában lenni annak elméleti hátterével és gyakorlati jelentőségével.
