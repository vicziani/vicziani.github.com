class: inverse, center, middle

# Modern unit és integrációs tesztelés

HOUG Orákulum - 2016. április

.card[
* .card-img[![Viczián István](belyegkep.png)]
* Viczián István
* Java fejlesztő - [IP Systems](http://ipsystems.hu/)
* @vicziani at Twitter
* http://jtechlog.hu
]

---

# Miről lesz szó?

* Automatizált tesztelés fontossága
* Unit és integrációs tesztek
* Élő dokumentáció

Példaprojekt: https://github.com/vicziani/spring-training

---

class: center, middle

# Gyors

---

# Tesztelendő unit

`Coord`

```java
public static Coord parse(String s) {
    String[] items = s.split(",");
    if (items.length != 2) {
        throw new IllegalArgumentException(
            String.format("Invalid coordinate: %s", s));
    }
    double lat = Double.parseDouble(items[0].trim());
    double lon = Double.parseDouble(items[1].trim());
    return new Coord(lat, lon);
}
```
---

# Unit teszt

`CoordTest`

```java
@Test
public void shouldParse() {
    String position = "47.4811281,18.9902207";
    Coord coord = Coord.parse(position);
    assertThat(coord.getLat(), is(47.4811281));
    assertThat(coord.getLon(), is(18.9902207));
}
```
---

# Unit teszt Hamcresttel

`CoordTest`

```java
@Test
public void shouldParseAssertWithMatcher() {
    String position = "47.4811281,18.9902207";
    assertThat(Coord.parse(position), isCoord(is(47.4811281), is(18.9902207)));
}
```

---

# Unit teszt rule-lal

`CoordTest`

```java
@Rule
public ExpectedException thrown = ExpectedException.none();

@Test
public void shoudThrowIllegalArgumentException() {
    String position = "abc";
    thrown.expect(IllegalArgumentException.class);
    thrown.expectMessage(is("Invalid coordinate: abc"));
    Coord.parse(position);
}
```

---

# Paraméterezett unit teszt

`CoordParametrizedTest`

```java
@Parameterized.Parameters(name = "{index}: Coord.parse for {0} throws {1}")
public static Collection<Object[]> data() {
    return Arrays.asList(new Object[][] {
            { null, NullPointerException.class },
            { "", IllegalArgumentException.class },
            { "1", IllegalArgumentException.class },
            { "1,2,3", IllegalArgumentException.class },
            { "1,a", NumberFormatException.class },
            { "a,1", NumberFormatException.class },
            { ",1", NumberFormatException.class },
            { ",,", IllegalArgumentException.class }
    });
}
```

---

class: center, middle

# Biztosítja a struktúrát

---

# Nem unit tesztelhető

```java
public Page<LocationDto> listLocations(Pageable pageable) {
    return new LocationRepositoryImpl()
        .findAll(pageable).map(new LocationDtoConverter());
}
```

---

# Tesztelhető

`LocationService`

```java
public class LocationService {

    private LocationRepository locationRepository;

    @Autowired
    public LocationService(LocationRepository locationRepository) {
        this.locationRepository = locationRepository;
    }

    public Page<LocationDto> listLocations(Pageable pageable) {
        return locationRepository.findAll(pageable)
            .map(new LocationDtoConverter());
    }

}
```

---

# Teszt Mockitoval

`LocationServiceTest`

```java
@RunWith(MockitoJUnitRunner.class)
public class LocationServiceTest {

    @Mock
    LocationRepository locationRepository;

    @InjectMocks
    LocationService locationService;

    @Test
    public void shouldCallSave() {
        locationService.createLocation(
            new CreateLocationDto("Budapest", "47.4811281,18.9902207"));

        verify(locationRepository).save(
            (Location) argThat(hasProperty("name", is("Budapest"))));
    }
}
```

---

class: center, middle

# Biztonságos

---

# Refaktoring

* Olvashatóság
* Komplexitás csökkentése
* Kód befogadás
* Teszt - refaktoring - teszt

---

class: center, middle

# Unit vagy integrációs teszt?

---

# Integrációs teszt

* Teszt piramis?
* Minden teszteset előtt adatbázis törlés
* Alapadatok feltöltése az alkalmazáson keresztül

---

# Integrációs teszt controlleren

`LocationControllerIntegrationTest`

```java
@Test
public void afterSaveShouldQuery() {
    CreateLocationDto createLocationDto =
        new CreateLocationDto("Budapest", "47.4811281,18.9902207");
    locationController.postSaveLocation(createLocationDto,
            new BeanPropertyBindingResult(createLocationDto, "createLocationDto"),
            new PageRequest(0, 50),
            new RedirectAttributesModelMap());

    ModelAndView modelAndView = locationController
        .getListLocations(new PageRequest(0, 50));
    List<LocationDto> locations = ((Page<LocationDto>) modelAndView.getModelMap()
        .get("locations")).getContent();
    assertThat(locations, hasSize(1));
    assertThat(locations, hasItem(locationWithName(is("Budapest"))
        .withLat(is(47.4811281)).withLon(is(18.9902207))));
}
```

---

# Integrációs teszt Spring Mock MVC-vel

`LocationControllerMockMvcIntegrationTest`

```java
@Test
public void afterSaveShouldQuery() throws Exception {
    mockMvc.perform(post("/")
            .param("name", "Budapest")
            .param("position", "47.4811281,18.9902207"))
            .andExpect(status().is3xxRedirection());

    mockMvc.perform(get("/"))
            .andExpect(status().isOk())
            .andExpect(model().attribute("locations",
                hasItem(locationWithName(is("Budapest"))
                .withLat(is(47.4811281)).withLon(is(18.9902207)))));
}
```

---

# Integrációs teszt, assert a renderelt view-n

`LocationControllerMockMvcIntegrationTest`

```java
mockMvc.perform(get("/"))
                .andExpect(status().isOk())
                .andExpect(content().string(containsString("Budapest")));
```

---

# Integrációs teszt rest controlleren

`LocationRestControllerIntegrationTest`

```java
@Test
public void afterSaveShouldQuery() {
    locationRestController.postSaveLocation(
        new CreateLocationDto("Budapest", "47.4811281,18.9902207"));

    List<LocationDto> locations = locationRestController.getListLocations(
        new PageRequest(0, 50)).getContent();
    assertThat(locations, hasSize(1));
    assertThat(locations, hasItem(locationWithName(is("Budapest"))
        .withLat(is(47.4811281)).withLon(is(18.9902207))));
}
```

---

# Integrációs teszt Mock Mvc-vel

`LocationRestControllerMockMvcIntegrationTest`

```java
@Test
public void afterSaveShouldQuery() throws Exception {
    mockMvc.perform(post("/api/locations")
            .param("name", "Budapest")
            .param("position", "47.4811281,18.9902207"))
            .andExpect(status().isOk());

    mockMvc.perform(get("/api/locations"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.content[0].name", is("Budapest")))
            .andExpect(jsonPath("$.content[0].lat", is(47.4811281)))
            .andExpect(jsonPath("$.content[0].lon", is(18.9902207)));
}
```

---

# Integrációs tesztelés driverrel

`LocationRestControllerDriverIntegrationTest`

```java
@Test
public void afterSaveShouldQuery() {
    locationDriver
            .newLocation()
            .withName("Budapest")
            .withPosition("47.4811281,18.9902207")
            .create()

            .listLocations()
            .locationsSize(1)
            .hasLocation(locationWithName(is("Budapest"))
                .withLat(is(47.4811281)).withLon(is(18.9902207)));
}
```
---

class: center, middle

# Élő dokumentáció

---

# Concordion

* HTML dokumentáció, mögötte integrációs tesztek
* Hiba esetén színezés
* Szétválik a dokumentációs és kód
* Szétválik a funkció leírása és a példa
* Nem kötött formátum
* Dokumentáció generálható

---

# Concordion HTML

`Location.html`

```html
<p concordion:execute="saveLocation(#name, #position)"> Felveszek egy új helyet
    <span concordion:set="#name">Budapest</span> névvel
    <span concordion:set="#position">47.4811281, 18.9902207</span>
    koordinátával.</p>

<p><span concordion:execute="queryByName(#name)"/>
    Ha lekérdezem a megadott névvel,
    a szélességi fok <span concordion:assertEquals="getLat()">47.4811281</span>,
    és a hosszúsági fok <span concordion:assertEquals="getLon()">18.9902207</span>
    lesz.</p>
```

---

# Concordion Java teszt

`LocationTest`

```java
public void saveLocation(String name, String position) {
    locationDriver
            .newLocation()
            .withName(name)
            .withPosition(position)
            .create();
}

public void queryByName(String name) {
    locationDto = locationDriver
            .listLocations()
            .findByName(name);
}

public double getLat() {
    return locationDto.lat;
}

public double getLon() {
    return locationDto.lon;
}
```
