---
layout: post
title: A Java EE jelene, jövője és tesztelése
date: '2020-12-28T21:00:00.000+01:00'
author: István Viczián
description: Egy poszt, hogy merre léphetünk tovább Java EE fejlesztésekor.
---

A Java EE technológiai manapság igencsak megosztó. Bár már sokan temetik, ettől függetlenül
igenis van jelene. Egyrészt sok alkalmazás épül Java EE technológiára. Ezeket
folyamatosan üzemeltetni kell, karban kell tartani és tovább kell fejleszteni.

Több projektről is hallottam,
melynek célja az volt, hogy a Java EE technológiát lecseréljék,
azonban ennek költsége, időigénye rendkívül magas volt, anélkül, hogy
új funkciók bekerültek volna. Egy ilyen projekt nem a management kedvence.
Több esetben azt is láttam, hogy az új techológiában a fejlesztőcsapat nem volt
kellően jártas, és hasonló szörnyet hozott létre. Volt, ahol ugyanaz a
team dolgozott a régi alkalmazás karbantartásán, valamint az új fejlesztésén.
Elképzelhető, mennyire voltak lelkesek, milyen minőségű munkát végeztek,
mikor a régihez kellett nyúlni. Volt, ahol két külön csapat dolgozott,
és óhatatlanul is kialakultak feszültségek. Mindkét felállásban
megvan a veszélye, hogy lelőjjék az hibásan "refaktor" néven
emlegetett projektet. Pl. elfogy a keret, nem hozza meg
az elvárt eredményt, bejön egy fontosabb projekt, hisz a régi
úgyis működik.

A _Clean Architecture_ könyv szerint is a keretrendszer csak implementációs
részlet. Az érték az üzleti tudásban és funkciókban van. A túlzott 
függőség a keretrendszerekre, ezekbe fektetett túlzott energia rendkívül sok
veszéllyel jár.

A Java EE folyamatosan fejlődik, érdemes figyelemmel követni az újdonságokat. 
Folyamatosan vannak igények Java EE oktatásokra is, hiszen a projekten dolgozókat meg kell ismertetni
a szabványok új verzióival, valamint új fejlesztők is csatlakoznak, akiket be 
kell tanítani. És ezen projekteken gyakori a unit és integrációs tesztek hiánya.
És ez egy részben a fejlesztőknek, de más részben a technológiának is felróható.

Szóval nézzük meg, hogyan lehet modernizálni egy Java EE alkalmazást úgy, 
hogy figyelembe vegyük a modern architektúrális elveket,
de ezzel párhuzamosan egyre kevésbé függjünk a keretrendszeren, és hogyan vezessünk be unit és integrációs
teszteket.

<!-- more -->

De először nézzük, hogy milyen változások történtek a szabvány háza táján.
A Java EE egy szabvány, melynek több implementációja létezik, ezek az 
alkalmazásszerverek, pl. JBoss/WildFly, Oracle WebLogic, IBM WebSphere Application Server, Glassfish,
Payara, stb. A Java EE ún. esernyő szabvány (umbrella), mely alatt több szabvány is van, pl. CDI, JPA, JMS, stb.
Ezek nagy része amúgy külön is elérhető Java SE környezetben.

A Java EE sokáig az Oracle fennhatósága alatt állt, azonban a 8-as verzió után megszabadult tőle,
és átkerült az Eclipse közösséghez. Mivel a Java név még mindig az Oracle-é, ezért át
kellett nevezni Jakarta EE-vé. A Jakarta EE 8-as verzió semmilyen újdonságot nem tartalmaz,
kizárólag licence téren lett rendbe téve, és kompatibilis a Java EE 8-cal. A Jakarta EE 9 azonban már nem,
ugyanis a  csomagokat is átnevezték `javax.*` névről `jakarta.*` névre.

Hogy mi a hosszú távú cél? Természetesen továbbra is meg akar maradni szabványnak, mely
lehetővé teszi Cloud Native nagyvállalati alkalmazások fejlesztését. Nem akarnak szakítani
a hagyományokkal, ki akarják használni a Java EE történetéből adódó elterjedtségét.
Azonban szeretnék átláthatóbban, gyorsabban fejleszteni úgy, hogy a közösség elvárásainak is jobban megfeleljen.
Ráncfelvarrásokat is szeretnének végezni, pl. áttérni mindenhol Mavenre, alkalmazkodni a Java 9
modulrendszerhez, átgondolni a függőségeket, egységesíteni a dokumentációt. Sőt, célként megfogalmazták
a tesztelhetőséget is.

Nézzük meg kicsit visszafele, hogy milyen újdonságok jelentek meg a különböző verziókban, hogy
átlássuk, hogy merre tart a fejlődés. A Java EE 7-ben jelent meg a natív JSON támogatás (JSON-P), REST kliens
API, WebSocket támogatás. A Java EE 8-ban jelent meg a JSON binding (JSON-B), server sent event támogatás, reactive
REST kliens, HTTP/2 támogatás. Látható tehát, hogy a webes, REST webszolgáltatások terén bekövetkezett
változtatásokat próbálják követni.

Azonban érdemes egy kicsit figyelembe venni azt is, hogy a meglévő tecnológiákkal kapcsolatosan
milyen trendek vannak. Ebből a talán egyik legszembetűnőbb a Context and Dependency
Injection (CDI) térnyerése. A Java EE 6-ban jelent meg, és a Java EE 8
már a 2.0 verzióját tartalmazza. A probléma az volt, hogy minden technológia maga
definiálta, hogyan fér hozzá a különböző erőforrásokhoz, valamint hogyan definiálja
a komponenseket és ezek közötti kapcsolatokat.
Így volt pl. JPA esetén az `EntityManager` `@PersistenceContext` annotációval
volt injektálható. Az EJB-k esetén az EJB-ket a típusuk alapján kellett annotálni, pl. `@Stateless`.
Másik EJB-hez `@EJB` annotációval lehetett hozzáférni.
Ha egy `DataSource`-hoz akartunk hozzáférni, akkor a `@Resource` annotációt kellett használni.
A JSF-ben a controller jellegű komponenseket a `@ManagedBean` annotációval lehetett elérni.
Az egészet még bonyolította a JNDI rendkívüli bonyolultsága, és aluldefiniáltsága,
melyről [többször írtam](https://www.jtechlog.hu/2011/02/27/konfiguracios-parameterek-WildFly.html).
A szabványok közötti atjárás mindig problémás volt.

Ezen problémákra próbál megoldást találni a CDI. Akit bővebben érdekel a téma, a
[Pro CDI 2 in Java EE 8](https://www.apress.com/gp/book/9781484243626) könyv
több, mint harmincöt oldalon keresztül tárgyalja a CDI történetét. Olyan nevek
jelennek itt meg, mint Gavin King (aki a Hibernate alkotója, és a CDI specifikálásának a vezetője is volt),
valamint Rod Johnson (igen, a Spring egyik atyja, aki szintén részt vett a specifikációban). De rajtuk kívül az összes nagy cég és 
híres fejlesztő megjelenik a történetben, ami szinte a teljes Java világ története, érdemes elolvasni.

A CDI tehát a Java EE komponens modellje. A komponensek a következő plusz tulajdonságokkal
rendelkeznek egy egyszerű Java osztályhoz képest:

* Létrehozásukat és függőségeiket a konténer felügyeli (természetesen az utóbbit Dependency
Injection segítségével)
* Scope-pal rendelkeznek, azaz definiált az élettartamuk (pl. az alkalmazás teljes élettartama, 
csak addig éljen, mint a session vagy request, stb.)
* Cserélhetőek (ez a Dependency Injectionből eléggé következik)
* Életciklusuk van, melyet a konténer vezérel (példányosítja, különböző állapotokba teheti, megszüntetheti)
* Különböző életciklushoz vagy egyébhez köthető eseményekre lehet reagálni (pl. ha létrejön vagy megszűnik a komponens, vagy
kérést kap) - itt vethető be a hagyományos Aspect Oriented Programming (AOP) is
* Névvel rendelkeznek

Hosszú távon egyértelmű, hogy a CDI a teljes Java EE specfikációt át fogja itatni, és
próbálja egységesíteni a komponensmodellt. Sőt, ami szintén különösen fontos, hogy a CDI
2.0 szabvány definiálja, hogy a CDI hogy használható Java SE-ben is.

Ahogy említettem, a CDI tehát maga is egy szabvány, aminek az egyik legelterjedtebb
implementációja a Weld.

A CDI igen komolyan összevethető a Spring Framework IoC (Inversion of Control)
konténerével (mely az `ApplicationContext` interfész mögött bújik meg).

Időközben a Java EE fejlődésének ütemével többen nem voltak megelégedve, így összeálltak, és
kidolgozták a [MicroProfile](https://microprofile.io/) szabványt. Ez is egy szabványgyűjtemény, mely
a Java EE tapasztalataira épít, de különösképp a microservice-ekre koncentrál, és dinamikusabban
fejlődik. Ez tartalmazza a Java EE szabványok egy részét. És igen, a magja ugyanúgy a CDI,
és tartalmazza a JSON-P, JSON-B és JAX-RS szabványokat, látható hogy a cél a REST webszolgáltatások
implementálása. Valamint olyan kísérleti szabványok is bekerültek, mint a Config, Fault Tolerance, 
Health, JWT, Metrics, OpenAPI, OpenTracing és Rest Client, sőt megjelent egy GraphQL API is.

Ennek olyan implementációi vannak, mint a helidon MP, Quarkus vagy WildFly (volt egy Thorntail
implementáció is, amit megszüntettek). A Quarkus arról híres, hogy képes GraalVM-en is futni,
így mind az indulási idő, mind a memóriahasználat, mind a válaszidő igen alacsony tud maradni.
És ezek cloud, microservices, elasztikus konténerizált környezetben igen fontosak. 

A MicroProfile annyira elismert, hogy már a Java EE is ígéri, hogy figyeli a specifikációt, és amit érdemes, 
átemel belőle.

Mit jelent mindez egy legacy Java EE alkalmazás esetén? Számomra annyit, hogy amerre indulni érdemes,
az mindenképp a CDI alapos megismerése és bevezetése, ahol csak lehet. Akár az EJB beanek
kiváltására is. Amennyiben komolyan akarjuk venni a keretrendszer függetlenséget,
érdemes először egyszerű POJO-kban gondolkozni, és mindent azokban megvalósítani. Ha ez kevés,
továbbléphetünk a CDI beanek irányában, ekkor már tudjuk használni a teljes CDI eszköztárat,
ebből természetesen a dependency injection a legfontosabb. És csak akkor használjunk EJB-ket,
ha feltétlen szükség van valami általuk nyújtott szolgáltatásra, amit a CDI nem tud. Ilyen
pl. passziválható session bean (bár jobb, ha ezt elkerüljük), távoli metódushívás, párhuzamos metódushívás,
ütemezés, stb. Régebben ide tartozott a tranzakciókezelés is (az EJB `@TransactionAttribute`)
annotációjával, azonban JTA API `javax.transaction.Transactional` annotációja a CDI beaneken is
értelmezett. Az implementáció CDI interceptorokkal valósítható meg. (A tranzakciókezelésről EJB környezetben 
elérhető egy [régebbi posztom](https://www.jtechlog.hu/2010/05/31/tranzakciokezeles.html).)

Természetesen az egyszerűbb funkciókat ugyanúgy implementálhatjuk POJO-kban vagy CDI beanekben,
és az EJB-k csak a konténer szolgáltatásaihoz férjenek hozzá, és a hívást delegálják
POJO-khoz vagy CDI beanekhez. De mi van, ha már létező alkalmazásunk van? Akkor érdemes
úgy vágni az EJB beaneket, hogy szervezzük ki az üzleti logikát POJO-kba vagy CDI beanekbe,
és az EJB-k ezekbe hívjanak tovább.

## Tesztelés

De mi köze mindennek a Java EE alkalmazások teszteléséhez?
Sajnos a Java EE-t kezdetben nem úgy alakították ki, hogy könnyen tesztelhető legyen.

### Unit tesztelés

Az EJB-k unit tesztelésére egy kitűnő ajánlás már régóta, hogy az üzleti logikát
szervezzük ki egyszerű POJO-kba, melyeket már lehet unit tesztelni. Csak a
konténer szolgáltatásaihoz való hozzáférés legyen az EJB beanekbe, és
csak szükség esetben adjuk a POJO-k felé. (Ebben az esetben azonban már
gyönyörűen lehet mockolni.)

Ez a CDI megjelenésével is egy tartható irány, ugyanis a CDI beanek alapjában véve maguk
is POJO-k. Bár számomra rendkívül furcsa, hogy az injektálás legtöbbször az attribútumon
elhelyezett `@Inject` annotációval történik. Pont a unit tesztelés miatt a
Spring a kötelező függőségeknél (és az encapsulation betartása miatt is)
a constructor injekctiont javasolja. Ez sokszor működik CDI beaneknél is, de futottam
bele olyan esetbe, ahol nem, és nem is elterjedt megoldás. Amúgy mockolásra
úgyis legtöbbször a Mockitot használjuk, ami szintén tud private attribútumba
injektálni, így a probléma inkább csak teoretikus.

### Java EE komponens-integrációs tesztelés

Nem szeretem az integrációs tesztelés megnevezést, mert az önmagában nem írja le,
hogy miket integrálva tesztelünk. Így választottam inkább a Java EE komponens-integrációs
tesztelés nevet, mely leírja, hogy azt akarjuk kipróbálni, hogy a Java EE komponensei
megfelelően működnek-e együtt. Ide tartoznak a POJO-k, CDI beanek és az EJB-k is.

### Arquillian

Amennyiben az ember Java EE integrációs tesztelés témakörben keresgél, a legtöbbször
az Arquillian eszközbe botlik bele. Az Arquilliant legtöbbször ún. in-container
tesztelésre használják. Azaz vesznek egy futó alkalmazásszervert,
kiválogatatják a komponenseket, amiket tesztelni akarnak, becsomagolják
egy jar-ba vagy war-ba, mellécsomagolják a tesztesetet, és az egészet
deploy-olják az alkalmazásszerverre, és ott futtatják le a tesztesetet is.

Terveztem egy Arquillian posztsorozatot, azonban őszintén bevallom, hogy
olyan szinten kiábrándultam belőle már csak kis pilot projektek során is,
hogy a használatát semmiképp nem javaslom. Meg is indoklom, miért.

* A `ShrinkWrap` részével lehet összeállítani a pici telepítő csomagot,
un. micro-deploymentet. No ezzel összeválogatni, hogy milyen komponensek
kellenek, az egy kész kínszenvedés. Nyilván nem csak a saját class
fájlaink kellenek, hanem különböző erőforrás fájlok, mint pl.
`beans.xml`, `persistence.xml`, `web.xml`, stb. Ezek bevarázsolása szintén
kihívás. Sőt 3rd party library-k is kellenek, ezek a `shrinkwrap-resolver-impl-maven`
használatával hivatkozhatóak be, ami beolvassa a `pom.xml` fájlt, és 
nekünk kell megadni a projekt koordinátákat. (A tranzitív függőségek hol mennek, hol nem.)
* Ha már úgyis fut egy alkalmazásszerver, akkor nekem úgyis mindegy, akár a teljes alkalmazást
felpakolhatnám rá. Lassan indul, lassan áll le, foglalkozni kell vele. Persze az Arquillian is indíthatja,
de az még lassabb.
* Ha már úgyis fut az alkalmazásszerver, akkor akár meghajthatom az API-t (pl. egy REST Assured)
használatával, vagy a felületet (pl. Selenium WebDriverrel). Ezek kevesebb szenvedéssel járnak,
és a tesztautomatizálásra fogékonyabb tesztelő kollégák is meg tudják írni.
* Nem képesek több éve megoldani, hogy ugyanazt a deploymentet lehessen több teszt osztályból is
használni, és ne telepítse újra.
* A Spring Boot finom integrációs teszteléshez használt mechanizmusaihoz képest olyan
bumfordi, esetlen és lassú, hogy nem említhető egy lapon.
* Van egy olyan elvem, hogy amelyik eszközzel már egy demó projektet összerakni is 
kihívás, azt nem választom éles projektben.

### Integrációs tesztelés Welddel

Akkor mi lehet a megoldás? Hogy nem törekedünk a teljes lefedettségre, és
csak azokat a komponenseket integrációs teszteljük, melyek Java SE
környezetben is elérhetőek. És ahogy említettem a CDI 2.0 legnagyobb
újdonság a Java SE-ben való futtatási lehetőség. Sőt, a Weldnek
van egy `weld-junit5` modulja is, mely képes arra, hogy a teszt osztályt is
CDI tulajdonságokkal ruházza fel, pl. bármilyen CDI beant lehessen injektálni.
Ezen kívül a használatával a teljes CDI konténert is személyre tudjuk szabni.

Szóval indítsunk el egy CDI konténert, telepítsük bele a CDI beaneket, és ezen
futtassuk a teszteket. Itt a következő probléma, ami szembe fog jönni, hogy
nincs tranzakciónk. És ha tranzakciót akarunk, akkor szükségünk van egy
transaction managerre. Erre megfelelő lehet a [Narayana](https://narayana.io/).
Ennek integrációjáról továbbiak [itt olvashatóak](http://jbossts.blogspot.com/2019/04/jta-and-cdi-integration.html).

Amúgy gondolkodtam még az [Apache DeltaSpike JPA modulon](https://deltaspike.apache.org/documentation/jpa.html)
is, azonban az saját csomagban lévő `@Transactional` annotációt használt. 

Valamint sok példában láttam, hogy az `EntityManager`-t `@Inject`
annotációval injektálja. Ezt nem szerettem volna, mindenütt hagyományosan a `@PersistenceContext`
annotációval injektáljuk, szóval én is egy olyan példát szerettem volna, ami ezzel
működik. Szerencsére a [Weld JUnit 5 Extensions](https://github.com/weld/weld-junit/tree/master/junit5)
ezt is támogatja a [Mock injection services](https://github.com/weld/weld-junit/tree/master/junit5#mock-injection-services)
használatával.

A [https://github.com/vicziani/javaee-testing](https://github.com/vicziani/javaee-testing) címen tehát egy olyan példa projekt található,
ami tartalmaz egy DAO-t (, ami egy CDI bean), mely JPA-val van implementálva, az `EntityManager` a `@PersistenceContext`
annotációval van injektálva. Természetesen egy entitást kezel. Valamint van egy service, mely szintén
egy CDI bean, és a DAO-t `@Inject`annotációval injektálja, és ő indítja a tranzakciót 
a `@javax.transaction.Transactional` annotáció használatával.

Nézzük is a tesztesetet. Egy in-memory H2 adatbázist használ.

```java
@EnableAutoWeld
public class EmployeeServiceIT {

    @Inject
    EmployeeService employeeService;

    @WeldSetup
    public WeldInitiator weldInitializator = WeldInitiator.from(WeldInitiator.createWeld()
            .addBeanClasses(EmployeeDao.class, EmployeeService.class)
                    .addExtension(new TransactionExtension())
            )
            .setPersistenceContextFactory(EmployeeServiceIT::createEntityManager)
            .build();

    private static EntityManager createEntityManager(InjectionPoint ip) {
        var factory = Persistence.createEntityManagerFactory("pu");
        return factory.createEntityManager();
    }

    @Test
    void testCreate() {
        employeeService.create("John Doe");
        employeeService.create("Jack Doe");
        var employees = employeeService.findAll();
        assertThat(employees).extracting(Employee::getName)
                .containsExactly("Jack Doe", "John Doe");
    }

}
```

Az `@EnableAutoWeld` egy JUnit 5 extension, mely elindít egy
Weldet. Ennek hatására lehet az `EmployeeService`-t is injektálni.

A `@WeldSetup` annotációval ellátott rész konfigurálja a Weldet.
Látható, hogy a `EmployeeDao` és `EmployeeService` osztályok vannak csak
hozzáadva. Valamint itt van hozzáadva a Narayana `TransactionExtension` CDI 
extension, mely beregisztrálja az CDI interceptorokat, melyek ráugornak
a `@Transactional` annotációra (nyilván proxizás van a háttérben).

A `setPersistenceContextFactory()` metódushívás állítja be, hogy 
mikor egy CDI beannek `EntityManager`-re van szüksége, hogy
kerüljön az létrehozásra. Itt egy method reference van átadva,
mely lejjebb van definiálva.

Majd jön a teszteset. Ez elment két entitást, majd lekérdezi ezeket.

A projektben található egy `jbossts-properties` állomány is, mely azt
mondja meg, hogy hova tegye az ideiglenes állományait a
Narayana.

A [https://github.com/vicziani/javaee-testing-transactionservices](https://github.com/vicziani/javaee-testing-transactionservices) címen egy bonyolultabb példa projekt
található, melyet [ez a poszt](https://in.relation.to/2019/01/23/testing-cdi-beans-and-persistence-layer-under-java-se/)
és ez a [példa projekt](https://github.com/hibernate/hibernate-demos/tree/master/other/cdi-jpa-testing)
ihletett.

Ebben már több minden működni fog. Egyrészt a Hibernate-nek be van
állítva a `javax.persistence.bean.manager` property-ben a `BeanManager`, hogy
működjön az injection a JPA Entity Listenerekben. 

Másrészt be van indítva egy JNDI szerver (`jboss:jnpserver` függőség), és a `DataSource` és a `TransactionManager` is
ide van bindolva. (Ehhez kell a `jndi.properties` is.) Valamint van egy `TransactionalConnectionProvider`
mely a Hibernate-nek van beregisztrálva, hogy ezen keresztül kérje le az adatbázis kapcsolatot. Az ezen
keresztül lekért adatbázis kapcsolat tranzakcióját innentől kezdve a JTA kezeli. Ezen kívül egy
Weld SPI `TransactionServices` implementációra is szükség van, melyet szintén be kell regisztrálni
az `addServices()` metódussal.