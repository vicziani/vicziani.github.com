---
layout: post
title: Óda az integrációs tesztekhez
date: '2020-03-22T10:00:00.000+01:00'
author: István Viczián
description: Változik-e az integrációs tesztek szerepe microservices környezetben?
---

Megrendezésre került 2019. október 17-én a [Training360](https://training360.com/)
_Nézz be a hype mögé_ fejlesztői meetupja. Ezen az _Integrációs tesztek nehézségei (Javaban)_
címmel tartottam előadást, bár inkább az integrációs tesztek pozitívumait
taglaltam.

Figyelem! A következő poszt nyugalom megzavarására alkalmas elemeket tartalmaz.
Célom annak a hangsúlyozása, hogy olyan alapvető állításokat, tételeket is
néha meg kell kérdőjeleznünk, mint a tesztpiramis. Ezért a posztban
találkozhattok némi hangsúly áthelyezéssel, kéretik ezt a helyén kezelni.

![Fotó a meetupról](/artifacts/posts/2020-03-22-oda-az-integracios-tesztekhez/2019-meetup-photo_750.jpg)

A rendezvényre készült [diák elérhetőek itt](/artifacts/2019-10-meetup/meetup-2019-10.html).

A posztban végigveszem a tesztpiramist, és az ezzel kapcsolatos fogalmakat,
sőt fenntartásaimat is. Majd megvizsgálok egy alternatív megközelítést,
mely különösen alkalmazható microservice-ekre. Közben példákat is hozok egy egyszerű
Spring Boot alkalmazás tesztelésére. A példa projekt elérhető a [GitHubon](https://github.com/vicziani/jtechlog-cities).

<!-- more -->

## Tesztpiramis

A tesztpiramist Mike Cohn mutatta be a _Succeeding with Agile_ könyvében,
annak elképzelésére, hogyan helyezzük el a különböző szintjeit a tesztelésnek.

A legalsó szinten vannak a unit tesztek, melyek az adott programozási nyelv
legkisebb egységét tesztelik, objektumorientált nyelvek esetén ez az osztály
szint. Középső szinten az integrációs tesztek helyezkednek el, melyek már
az osztályok együttműködését tesztelik. Végül a legfelsőbb szint az
End-to-end tesztek, melyekkel a teljes alkalmazást teszteljük,
az adott környezetben, azok függőségeivel integrálva. Ráadásul nem egy-egy kiragadott
funkció darabkát, hanem teljes üzleti folyamatot az elejétől a végéig.

![Tesztpiramis](/artifacts/posts/2020-03-22-oda-az-integracios-tesztekhez/pyramid.png)

A tesztpiramis formája abból következik, hogy az alaptól felfelé
a tesztek egyre nagyobb hatókörrel dolgoznak, egyre erőforrásigényesebb
a karbantartásuk és futtatásuk, és pont ezért felfelé mozdulva érdemes
ezekből egyre kevesebbet írni.

Sajnos már ez is több kérdést felvet bennem. Egyrészt a fogalmak nem egyértelműen
definiáltak, mindenki mást ért alatta. Már az sem teljesen egyértelmű, hogy egy
alkalmazás részeit hogyan nevezzük. A legalsó szinten vannak az osztályok, ebben
megegyezthetünk, azonban az egyel magasabb szinten mik helyezkednek el?
Nevezik ezeket moduloknak (pl. Java Application Architecture könyv, OSGi),
komponenseknek (pl. a Clean Architecture könyv, ami nagyon szembe megy pl. a
Spring Framework/Java EE elnevezésével, ahol egy komponens egy bean), plugin-eknek, stb.
Már az alkalmazásra is különböző neveket szoktak használni, mint rendszer,
service, stb. A Clean Architecture könyv és a microservices architektúra service-nek
hívja az alkalmazást és ez számomra
azért zavaró, mert a Spring Framework is így hívja a háromrétegű architektúrában az üzleti
logika rétegben elhelyezkedő beaneket. Én az osztály (és igen, ide kell
érteni ebben az esetben az interfészeket, enumokat, annotációkat, stb.),
modul, alkalmazás neveket fogom használni.

A unit tesztelésnél egyértelmű, hogy a külső függőségeket ki kell mockolni.
Igen, de egy osztály a Java SE osztálykönyvtár rengeteg elemét használhatja, mint
pl. a `String`, `List`, stb. Ezek külső függőségek? Nyilván nem, ezért mondhatjuk,
hogy ezeket ne mockoljuk. Mi van ez esetben az olyan külső könyvtárakkal, melyek
hasonló adatszerkezeteket implementálnak, mint pl. a Guava vagy az Apache Commons
Collections? És mi a helyzet a hasonló saját osztályainkkal, value objectjeinkkel?
Mi van az olyan külső függőségekkel, mint pl. a naplózáshoz az SLF4J?
Unit tesztnek nevezhető-e az, ha beindul egy konténer, pl. a Spring Framework,
vagy annak egy része?
(A Spring Framework unit tesztnek nevezi azt, ha egy komponenst tesztelsz,
de beindít bizonyos Springes eszközöket, egy kisebb konténert.)
Hol húzható meg a határ?

Az integrációs teszt esetén talán kevesebb a kérdés, hiszen gyakorlatilag minden
tesztre, melyben egynél több osztály szerepel, ráhúzhatjuk az integrációs teszt
jelzőt. Az elnevezésben egy kis kavar, hogy integrációs tesztnek szokták nevezni
azokat a teszteket is, ahol több alkalmazást integrálunk, és azok együttműködését
vizsgáljuk.

Az E2E tesztekkel kapcsolatban szintén elég sok kérdés merül fel. Csak felületi
teszteket foglal magában? Vagy ide sorolhatóak az API tesztek, amikor az alkalmás
valamely más interfészét, pl. REST webszolgáltatását szólítjuk meg. E2E tesztnek
nevezhető-e az, ha csak egy részfunkciót tesztelünk a felületen keresztül?
Teljes izolációban teszteljük másik alkalmazásoktól, vagy az E2E pont azt jelenti,
hogy integráljuk más alkalmazásokhoz?

Ezen kívül ilyen fogalmak is felbukkannak, hogy szolgáltatás teszt (service test),
komponens teszt (component test), rendszerteszt (system test), ezek vajon mit jelentenek?

Azt hiszem, hogy ebből már érthető, hogy az alapvető problémám ezzel a területtel
kapcsolatban az, hogy nincsen jó, kellően egzakt terminológia, ugyanazon fogalmak alatt
mások mást értenek. Ráadásul a microservices architektúra elterjedése egy kicsit
még jobban összezavarta ezt, és az amúgy sem kialakult terminológia nem tudott
alkalmazkodni az új módszerekhez.

Az automata tesztelés, és az ehhez tartozó eszközök (test harness) annyira alapvető fontosságúak, hogy az architektúra
részét kell képezniük, és így meg is tervezendő. Az összes elterjedt architektúra így említi, mint pl.
a hexagonal architecture, onion architecture és clean architecture. Azonban még mindig úgy látom,
hogy a tesztelést sokan teljesen függetlenül kezelik, sok helyen külön csapat foglalkozik vele,
akik ráadásul támogatást sem kapnak munkájuk elvégzéséhez.

## Kételyek a unit teszteléssel kapcsolatban

A példákban egy olyan alkalmazást fogok mutatni (ami egy microservice-ként is megállja a helyét), mely egy háromrétegű Spring Boot
alkalmazás, mely városok adatait tartja nyilván. Nem implementáltam a JavaScript frontendet, REST API-n elérhető. Alatta H2
adatbázis. Egy városnak ismeri a koordinátáját. Haversine algoritmust használva kiszámolja és visszaadja annak távolságát
Budapesttől. Valamint visszaadja a városban mért hőmérsékletet is, ehhez egy külső szolgáltatást vesz igénybe (Időkép).

![Tesztpiramis](/artifacts/posts/2020-03-22-oda-az-integracios-tesztekhez/cities-architecture.png)

A unit tesztelés ígéreteit azt hiszem mindannyian ismerjük. A további tárgyaláshoz azonban érdemes még
meg ismerni a unit tesztelés két megközelítését:

* Állapot alapú: a megfelelő bemenetre az elvárt kimenetet kapjuk eredményül
* Viselkedés alapú: a megfelelő osztályokkal a megfelelő módon működött együtt: a mockolt függőségeken megnézzük, hogy megfelelően kerültek-e meghívásra

Azonban manapság kezdenek megjelenni kritikák is a unit teszteléssel kapcsolatban. Az első és legfontosabb, hogy
amennyiben azt a modellt követjük, hogy minden osztályhoz külön teszt osztályt hozunk létre, és minden egyes
publikus metódushoz legalább egy teszt metódust, a tesztjeink finoman granuláltak lesznek, és amennyiben egy nagyobb
refactoringot szeretnénk elvégezni, akkor az nagyon sok tesztesetet fog érinteni, ami a Fragile Test Problem.
Valójában ezzel a módszerrel implementációs részleteket (implementation details) tesztelünk.

Nézzük a következő controller osztályt, amin nem teljesen egyértelmű a unit teszt hasznossága.

```java
@RestController
@RequestMapping("/api/cities")
public class CityController {

    private CityService cityService;

    public CityController(CityService cityService) {
        this.cityService = cityService;
    }

    @GetMapping("/{city}")
    public CityDetails getCity(@PathVariable String city) {
        return cityService.getCityDetails(city);
    }
}
```

Mivel van egy service függősége, azt mockkal kell helyettesíteni. Amit tesztelhetünk, hogy amit
a service visszaad, azt megfelelően vissza adja-e (állapot), valamint megfelelő paraméterrel továbbhív-e a
service-be (viselkedés). Azonban én mindkettőt feleslegesnek tartom, hiszen azt teszteli, hogy meg tudok-e hívni egy metódust.
Amit itt érdemes tesztelni pl. hogy az annotációk megfelelően vannak-e elhelyezve, jó url-en érhető-e el, a paraméterek jól
kerülnek-e beolvasásra, `CityDetails` megfelelően kerül-e JSON-ba leszerializálásra, jó-e a HTTP státuszkód, stb.

Erre van a Spring Bootban lehetőség a `@WebMvcTest` használatával, ami csak a controller réteget indítja el,
és a service réteget mockolni kell, és unit tesztnek is hívja, hiszen egy controllert tesztel, azonban
elindítja a Springet. Ezért ez nekem inkább az integrációs rétegbe tartozik.

```java
@WebMvcTest
public class CityControllerIT {

    @Autowired
    CityController cityController;

    @MockBean
    CityService cityService;

    @Autowired
    MockMvc mockMvc;

    @Test
    void testGetCity() throws Exception {
        when(cityService.getCityDetails(any())).thenReturn(
                new CityDetails("Debrecen",47.52883333,21.63716667, 10, Optional.of("8°C")));

        mockMvc.perform(get("/api/cities/Debrecen"))
                .andExpect(status().isOk())
                .andDo(print())
                .andExpect(jsonPath("$.temperature", equalTo("8°C")));

    }
}
```

Nézzük meg az üzleti logika réteget, a service-t. Itt már bonyolultabb a helyzet.

```java
public CityDetails getCityDetails(String nameOfTheCity) {
    var mayBeCity = cityRepository.findByName(nameOfTheCity);
    if (mayBeCity.isEmpty()) {
        throw new CityNotFoundException("City not found with name: " + nameOfTheCity);
    }
    var city = mayBeCity.get();
    var distance = calculateDistance(city);
    var temperature = getTemperature(nameOfTheCity);

    return new CityDetails(city.getName(), city.getLat(), city.getLon(), distance, temperature);
}
```

Ami elsőnek szemet szúr, hogy egyrészt van benne elágazás, másrészt több forrásból gyűjti be
az adatokat. Egyrészt az adatbázisból betölti a város koordinátáit, valamint egy másik
service, a `HaversineCalculator` segítségével kiszámolja a távolságot egy másik várostól,
harmadrészt beszerzi a hőmérsékletet a `TemperatureGateway` segítségével. Ekkor már magyarázható
a unit teszt szükségessége.

```java
void testGetCityDetails() {
    when(cityRepository.findByName(eq("Budapest"))).thenReturn(Optional.of(new City(1L, "Budapest", 47.4825,19.15933333)));
    when(cityRepository.findByName(eq("Debrecen"))).thenReturn(Optional.of(new City(1L, "Debrecen",47.52883333,21.63716667)));
    when(haversineCalculator.calculateDistance(anyDouble(), anyDouble(), anyDouble(), anyDouble())).thenReturn(10.0);

    when(temperatureGateway.getTemperature(anyString())).thenReturn("8°C");

    var cityDetails = cityService.getCityDetails("Debrecen");
    assertAll(
            () -> assertEquals("Debrecen", cityDetails.getName()),
            () -> assertEquals(47.52883333, cityDetails.getLat()),
            () -> assertEquals(21.63716667, cityDetails.getLon()),
            () -> assertEquals(10.0, cityDetails.getDistance()),
            () -> assertEquals(Optional.of("8°C"), cityDetails.getTemperature())
            );
}
```

És itt már érdemes olyan esetekre is unit tesztet írni, mint:

* Mi van, ha nem található az adott város
* Mi van, ha nem található az a város, melytől a távolságot mérjük
* Mi van, ha a külső szolgáltatás hívása kivételt dob

Ezek a példában megtalálhatóak.

A perzisztens réteg unit tesztelésével kapcsolatban is vannak kérdések.
A legtöbb esetben ezek egyszerű hívások a JDBC megfelelő objektumai (`DataSource`, `Connection`, stb.), a
`JdbcTemplate` vagy `EntityManager` felé. Vannak fenntartásaim azzal kapcsolatban, hogy érdemes-e
ezeket mockolni. A Spring Data JPA esetén csak az interfészt kell megírni, és azt a keretrendszer maga implementálja,
 ezért érdekes, hogyan lehet ezeket unit tesztelni. Itt JPA estén megint képbe jönnek az annotációk,
valamint a lekérdezések, melyeket jó lenne tesztelni, azonban unit teszttel nem lehet.

A Spring Bootnak erre is van megoldása a `@DataJpaTest` annotációval, szintén unit tesztnek hívja, egy repository tesztelése a célja,
de azon kívül, hogy elindítja a Springet, még egy beépített adatbázist is elindít (pl. H2).
Ezért nekem ez szintén az integrációs rétegbe tartozik.

```java
@DataJpaTest
public class CityRepositoryIT {

    @Autowired
    CityRepository cityRepository;

    @Test
    void test_findByName() {
        var city = cityRepository.findByName("Budapest");
        assertEquals(47.4825, city.get().getLat());
    }
}
```

A más rendszerekkel való kapcsolattartásért felelős, ún. gateway osztályok tesztelése megint
kérdéses. Itt protokolltól függően biztos valamilyen 3rd party library-t használunk,
anélkül tesztelni nem feltétlen érdemes.

Nézzük az adott példán, hogy az Időkép meghívása [jsouppal](https://jsoup.org/)
történik. Ez egyrészt egy 3rd party library, valamint egy http kapcsolatot épít fel,
valamint a visszaadott adatszerkezetet konvertálja saját szerkezetbe.

Ebből az első kettő tesztelése mindenképp integrációs tesztelés körébe tartozik.

A külső alkalmazás, amelyhez kapcsolódunk, egyszerűen kimockolható,
erre több eszköz is létezik, mint pl. a [WireMock](http://wiremock.org/) vagy
[MockServer](https://www.mock-server.com). Ezek különálló http szerverként
futtathatóak (persze mindkettőt integrálták a JUnithoz is), és megadhatóak,
hogy milyen kérésre milyen választ (pl. html, json, stb.) adjanak vissza. Így a teljes
http stack is meghajtásra kerül. Használatuk nem csak akkor hasznos, ha úgy fejlesztünk,
hogy a kapcsolódó alkalmazás nincs kész, esetleg nem elérhető a fejlesztés közben, hanem
a hibaágak is nagyon jól tesztelhetőek, pl. mi van akkor, ha a külső alkalmazás nem,
vagy csak lassan válaszol, hibás választ ad vissza, stb. Mindkettővel található teszteset
a példa alkalmazásban.

## Kételyek a E2E teszteléssel kapcsolatban

Az E2E tesztelést a legtöbb kritika azért éri, mert a futtatásuk és karbantartásuk
erőforrás igényes. Emiatt a tesztek futtatásáról is viszonylag későn kapunk visszajelzést.
Ezért ezek számát tartsuk alacsonyan.

A Clean Architecture könyv úgy fogalmaz, hogy a GUI egy törékeny, gyakran változó
réteg, ezért lehetőleg a legkevésbé függjünk tőle. Sok felületi teszt esetén
megint csak belefuthatunk a Fragile Test Problem jelenségbe.

Amennyiben a E2E teszteket úgy értelmezzük, hogy a tesztek során az alkalmazás
más alkalmazáshoz is kapcsolódik, abban az esetben a kihívás még nagyobb. Ekkor ugyanis
a megfelelő verziójú, megfelelő állapotban lévő külső alkalmazásokat kell biztosítani,
ráadásul lehetőleg a minimális emberi erőforrás bevonásával. Képzeljük ezt el
akár több tíz microservice esetén (ami konténerizációs, és azt _orkesztráló_
technológia nélkül esélytelen). És akkor nem is beszéltünk arról, hogy hogyan lehet
ezen környezetben a különböző alkalmazásokból release-elni. És ez csak teszt környezet.

Az E2E tesztelés fontosságával kapcsolatban nincs kétség, azonban a mennyiségét
érdemes alacsonyan tartani. Mindenképp csak a fő üzleti funkcionálitás tesztelésére
javaslom, ami "pénzt termel". Még egy irányt szeretnék itt megemlíteni. Akik rájöttek arra, hogy
mennyire nehéz, vagy költséges egy ilyen teszt környezet felállítani, ami ráadásul
az éles környezet hasonmása, kitalálták az élesben tesztelés fogalmát. Nyilván
ez csak bizonyos alkalmazások esetén vállalható. Előfeltétele, hogy profi monitorozás legyen,
és azonnal észre lehessen venni a hibákat, valamint hiba esetén azonnal, automatikus módon
vissza lehessen állni egy előző verzióra. Ismert fogalom itt a _Blue-Green deployment_, mely során
párhuzamosan él a régi és új verzió, és bármikor vissza lehet billenteni. Valamint a _Canary release_,
mikor az új verziót egyszerre állítják élesbe a felhasználók csak egy szűk körének.

## Testing honeycomb

A [Spotify ajánlása](https://labs.spotify.com/2018/01/11/testing-of-microservices/) kifejezetten microservice-k esetén a testing honeycomb.
Ez azt jelenti, hogy az integrációs tesztekből írjunk a legtöbbet.

A Clean Architecture könyv is ezt javasolja, hogy ne annyira erőltessük a unit tesztek használatát,
hiszen azzal az implementációs részleteket teszteljük, és nehéz a karbantartásuk.

![Testing honeycomb](/artifacts/posts/2020-03-22-oda-az-integracios-tesztekhez/honeycomb.png)

(Nevét arról kapta, hogy alakja a méhkaptárban lévő hatszög alakú lépsejtekhez hasonlít.)

Az integrációs tesztek a következő előnyökkel rendelkeznek:

* Függetlenek az implementációs részletektől, ha az API-ra építünk, egy belső refaktor
nem fogja eltörni a teszteket.
* Használatukkal ellenőrizhetőek a unit tesztekkel nem lefedhető részek, mint pl. a controller rétegben
a JSON szerializálás, URL mapping, vagy a repository rétegben az adatbázis integráció.
* A külső rendszerek mockolásával a gateway réteg is tesztelhető. Azonban nem kell a
külső rendszereket is telepíteni, integrálni.
* A legkisebb munkával a legnagyobb lefedettséget érjük el.
* Gyorsabbak, mint az E2E tesztek.

Persze az integrációs tesztek alkalmazásakor is rengeteg kérdés merül fel. Az alapkérdés, hogy
az osztályok mely körét teszteljük az integrációs teszttel. Ahogy említettem, lehet csak a controllert,
a repository-t, a gateway-t, de ha értelmes tesztet akarunk, már ezek is az integrációs tesztek közé tartoznak.

A következő lépés lehet, hogy a külső erőforrásokkal kapcsolatban lévő osztályokat mockoljuk.
Ilyen a példa alkalmazás esetén a `CityRepository`, mely adatbázishoz kapcsolódik, és a
`TemperatureGateway`, ami az Időképhez. A hozzá tartozó teszt a `InMemoryCityIT`, mely a `CityController` és `CityService`
osztályokat is meghajtja.

```java
@SpringBootTest
@EnableAutoConfiguration(exclude = {DataSourceAutoConfiguration.class,
        DataSourceTransactionManagerAutoConfiguration.class,
        HibernateJpaAutoConfiguration.class})
@AutoConfigureMockMvc
public class InMemoryCityIT {

    @MockBean
    CityRepository cityRepository;

    @MockBean
    TemperatureGateway temperatureGateway;

    @Autowired
    MockMvc mockMvc;

    @Test
    void test_getCity() throws Exception {
        when(cityRepository.findByName(anyString())).thenReturn(
                Optional.of(new City(1L, "Debrecen",47.52883333,21.63716667)));
        when(temperatureGateway.getTemperature(anyString())).thenReturn("8°C");

        mockMvc.perform(get("/api/cities/Debrecen"))
                .andExpect(status().isOk())
                .andDo(print())
                .andExpect(jsonPath("$.temperature", equalTo("8°C")));
    }
}
```

![Mockolt osztályok](/artifacts/posts/2020-03-22-oda-az-integracios-tesztekhez/teszteles-hatokore-mock.png)

A következő lépés, hogy az alkalmazást már a REST-assured 3rd party library-val hajtjuk meg,
az adatbázis egy beágyazott H2, és a `TemperatureGateway` egy WireMockkal megvalósított
beágyazott http szerverhez kapcsolódik.

![Mockolt osztályok](/artifacts/posts/2020-03-22-oda-az-integracios-tesztekhez/teszteles-hatokore-embed.png)

Amennyiben még jobban le akarjuk választani az alkalmazásunk a keretrendszerektől, külön indítsuk el
az alkalmazást, melyhez külön processzben futó REST-assured kapcsolódik, adatbázisa valós
adatbázis, és egy külön processzben futó WireMock szerverhez kapcsolódik a hőmérséklet adatokért.

![Mockolt osztályok](/artifacts/posts/2020-03-22-oda-az-integracios-tesztekhez/teszteles-hatokore-backing.png)

## Összefoglalás

A teszteléssel kapcsolatban nincsen pontos, kialakult terminológia, és nagyon kevés a jól bevált
recept is. Sokáig azt hittük, hogy a teszt piramissal tévedni nem nagyon lehet,
de ennek is megmutatkoztak a gyengeségei. Látszik, hogy az integrációs tesztek
bizonyos esetekben kezdenek átvenni szerepeket a unit tesztektől, és a gyors indulás valamint
a beágyazható eszközök miatt az E2E tesztektől is. A unit tesztek még mindig nagyon fontosak,
de ott használjuk őket, ahol tényleg értelme van, nem feltétlenül jó csak unit tesztekkel elérni a
90%-os lefedettséget.

A tesztelés nagyon fontos, kezeljük az architektúra részeként, és ugyanolyan alapossággal tervezzük is meg.
A bemutatott utak közül válasszuk azt, ami az alkalmazásunkhoz a legjobban illik, és
rendszeresen vizsgáljuk felül a döntésünket. Nem mindig az válik be nálunk is, ami másoknál,
és változtassunk, amennyiben úgy érezzük, hogy az automatizált tesztekbe fektetett energia nem térül meg.
