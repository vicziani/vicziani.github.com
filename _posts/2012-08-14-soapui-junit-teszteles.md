---
layout: post
title: Webszolgáltatások integrációs tesztelése SoapUI és JUnit használatával
date: '2012-08-14T23:52:00.000+02:00'
author: István Viczián
tags:
- open source
- SOA
- JAX-WS
- Maven
modified_time: '2019-07-24T10:00:00.000+02:00'
---

Frissítve: 2019. július 24.

Használt technológiák: JAX-WS 2.3.2, JUnit 5.5.1, SoapUI 5.5.0, Maven 

Már többször említettem a SoapUI-t, mely az egyik legelterjedtebb eszköz
webszolgáltatások fejlesztéséhez és teszteléséhez. 
Nagyon intuitív grafikus felülettel rendelkezik, és van
ingyenes és kereskedelmi verziója is
([összehasonlítás](https://www.soapui.org/downloads/soapui.html)).

A legegyszerűbb, és leggyakrabban használt funkció, hogy elég megadni a
WSDL URL-jét, és ehhez képes példa kéréseket gyártani. A kitöltendő
paramétereket kérdőjellel jelöli meg, az opcionálisakat megjegyzéssel,
és kitöltés után azonnal be tudjuk küldeni a kérést, melyre kapott
választ azonnal megmutatja (a natív HTTP kérést és választ is). Ennél
izgalmasabb talán, hogy teszt suite-okat is össze lehet állítani, benne
test case-ekkel. Tudunk generáltatni példa kéréseket, és a válaszokra
ellenőrzéseket, asserteket tudunk tenni. Ezek lehetnek egyszerű szöveg
tartalmazások, XPath, XQuery kifejezések is, de akár Groovy script is.
Felvehetünk property-ket, melyek értékét állíthatjuk, illetve a
kérésekbe behelyettesíthetjük. Természetesen Groovy scriptből is
használhatjuk őket. Ezekkel lehet pl. megoldani, hogy az első
webszolgáltatás kérés visszaad egy sessionid-t, és később azt akarjuk
küldeni a további webszolgáltatás kérésekben.

Írtam is erre egy apró projektet, mely [elérhető a
GitHub-on](https://github.com/vicziani/jtechlog-soapui-testing). Az
ötletet a [w3schools.com][https://www.w3schools.com/] oldalról vettem, ahol ki van ajánlva egy
[TempConvert](https://www.w3schools.com/xml/tempconvert.asmx)
webszolgáltatás Celsius és Fahrenheit közötti váltásra. Ezt
implementálja a `TempConvert.java` osztály JAX-WS használatával, Mavennel
buildelhető, és a letöltést követően a `mvn jetty:run` paranccsal
futtatható. A webszolgáltatás a
`http://localhost:8080/services/TempConvert` címen érhető el, innen van
linkelve a WSDL állomány is. Ezt megadtam a SoapUI-nak, és készítettem
két tesztesetet is. A SoapUI projekt az
`src/test/resources/TempConvert-soapui-project.xml` állományban található.

<a href="/artifacts/posts/2012-08-14-soapui-junit-teszteles/soapui.png" data-lightbox="post-images">![SoapUI](/artifacts/posts/2012-08-14-soapui-junit-teszteles/soapui_750.png)</a>

Persze úgy gondolom, hogy a funkcionalitást nem ezen a szinten kell
tesztelni, hanem alacsonyabb rétegeket kell megszólítani, viszont nem
rossz, ha ilyen jellegű teszt esetek is vannak, melyek gyakorlatilag a
webszolgáltatás interfész visszafele kompatibilitását tesztelik. Azért,
hogy ne kelljen ezeket kézzel indítgatni, a SoapUI fejlesztői lehetővé
tették, hogy a SoapUI teszteket JUnitból is meg lehessen hívni.

Tehát a használathoz először a `pom.xml`-be kell felvenni a függőségeket.

```xml
<repositories>
   <repository>
       <id>SmartBear</id>
       <url>http://smartbearsoftware.com/repository/maven2</url>
   </repository>
</repositories>

<dependencies>
    <dependency>
        <groupId>com.smartbear.soapui</groupId>
        <artifactId>soapui</artifactId>
        <version>5.5.0</version>
        <scope>test</scope>
        <exclusions>
            <exclusion>
                <groupId>com.smartbear.utils.analytics</groupId>
                <artifactId>out-app-analytics-provider</artifactId>
            </exclusion>
        </exclusions>
    </dependency>
</dependencies>
```

Java 9 óta, ha nem tesszük be az `exclusion` taget, a tesztek fordítása
sikertelen a következő hibaüzenettel:

```
[ERROR] Failed to execute goal org.apache.maven.plugins:maven-compiler-plugin:3.1:testCompile 
  (default-testCompile) on project soapui-testing: Fatal error compiling: 
  Illegal char <*> at index 7: ../lib/*.jar -> [Help 1]
```

Ez azért van, mert a `out-app-analytics-provider.jar` állomány 
`MANIFEST.MF` fájljában a következő szerepel: `Class-Path: ../lib/*.jar`.

A következő lépés a teszteset előkészítése. Először el kell indítani a
webszolgáltatást, majd azon lefuttatni a SoapUI teszteseteket. Nagyon jó
[cikk található Glen Mazza's
Weblogján](https://glenmazza.net/blog/entry/soap-integration-tests),
melyben azokat részletezi, hogy hogyan lehet tesztelés esetén
futtatni a webszolgáltatásokat. Leírja, hogy hogyan kell webszolgáltatást
elindítani az `Endpoint` osztály segítségével, beágyazott Jetty-vel vagy
Tomcattel, vagy hogyan lehet külön Tomcatben futó webszolgáltatást
tesztelni. Én a már [előző
cikkben](/2012/08/12/soa-using-java-web-services.html) is említett
`Endpoint` osztályt választottam, mint pehelysúlyú megoldás, mely a Javaban
található HTTP serveren indul el.

```java
public class TempConvertIntegrationTest {

    static String address;

    static Endpoint ep;

    @BeforeAll
    static void beforeClass() throws MalformedURLException {
        address = "http://localhost:9000/TempConvert";
        ep = Endpoint.publish(address, new TempConvert());
    }

    @AfterAll
    static void afterClass() {
        ep.stop();
    }
}
```

Csak elindítjuk a beépített HTTP servert a teszteset indításakor, és
telepítjük rá a `TempConvert` webszolgáltatást, valamint a teszteset végén
leállítjuk. Látszik, hogy a tesztelés http protokollon keresztül
történik, végig a teljes lokális hálózati stacken, tehát olyan, mintha
különálló kliens hívta volna meg.

A következő lépésben már csak a SoapUI tesztesetet kell elindítani.

```java
@Test
void testTempConvert() throws Exception {
  SoapUITestCaseRunner runner = new SoapUITestCaseRunner();
  runner.setProjectFile(
    "src/test/resources/TempConvert-soapui-project.xml");
  runner.setEndpoint(address);
  runner.run();
}
```

Gyakorlatilag csak a SoapUI projektfájl helyét kellett megadni, valamint
a projektben definiált címet (ami a WSDL-ből jött) felül lehet írni a
`setEndpoint()` metódussal. Első indításkor (`mvn test`) elég sokat kell
várni, mert sok függősége van a SoapUI-nak (`mvn dependency:tree`). A
konzolra kiírt üzenetekből nagyon szépen látszik, hogy éppen mi
történik, melyik suite-ot, test case-t futtatja, sikeres-e az assertion,
stb. A főkönyvtárba `*.log` állományokat is írogat, hiba esetén
megtalálhatók bennük a teljes http kérés és válasz is.

Érdekességképpen ídeírok egy Groovy assertiont is.

```groovy
def utils = new com.eviware.soapui.support.GroovyUtils( context )
def holder = utils.getXmlHolder(messageExchange.responseContentAsXml)
def celsius = holder["//fahrenheit"]
log.info(celsius)
assert Integer.parseInt(celsius) == 212
```

A SoapUI ezen kívül még nagyon sok mindenre képes, kedvencem, hogy
önmaga is tud webszolgáltatásként viselkedni (mock), embedded Jetty-t indít, és
még a választ is meg tudjuk adni, hogy mit adjon vissza, amit szintén
script-ezhetünk, így a bejövő paraméterektől függően eltérő válaszokat
adhatunk vissza. Ez rendkívül jól jön, amikor egy olyan
webszolgáltatáshoz akarunk klienst fejleszteni, mely nem mindig
elérhető. Ezen kívül használható terheléses tesztelésre is, valamint
akár REST webszolgáltatásokat is hívhatunk, vagy JMS is
tesztelhető vele.
