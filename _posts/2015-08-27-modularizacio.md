---
layout: post
title: Modularizáció Servlet 3, Spring és Maven környezetben
date: '2015-08-27T23:45:00.000+02:00'
author: István Viczián
---

Lezajlott a HWSW free! meetup, melyen a modularizációról tartottam egy tizenöt perces előadást. Ezen idő alatt csak a fogalmakat sikerült áttekinteni, álljon itt az előadás anyaga egy kicsit kifejtve, gyakorlati példákkal megfűszerezve. A slide-ok külön [megnézhetőek](http://www.jtechlog.hu/artifacts/2015-08-modularization/modularization.html).

Az objektumorientált programozás megjelenése óta az alkalmazásaink alap építőkövei az interfészek és osztályok, melyek az igen finom szemcsézettséget képviselik, azaz a sok és apró komponens együttműködése biztosítja a funkcionalitást. Újrafelhasználhatóságuk nagyon magas, gondoljunk csak a `List` interfészre vagy a `String` osztályra, azonban felhasználásuk magas szaktudást igényel. A skála másik oldalán az alkalmazások helyezkednek el, melyek a SOA elterjedésével szolgáltatásokat biztosítanak. Ezek szemcsézettsége durva, kevésbé újrafelhasználhatóak, viszont jól definiált és viszonylag egyszerű interfészein keresztül könnyen használhatóak, akár fejlesztői tudás nélkül is. Minél jobban arra törekszünk, hogy komponenseink újrafelhasználhatóak legyenek, annál lesznek azok komplexebbek, annál több tudás kell a használatukhoz.

![Használhatóság és újrafelhasználhatóság](/artifacts/posts/2015-08-27-modularizacio/UseReuseParadox.jpg)

A kettő között hiányzik azonban egy szint, olyan komponensek, melyek újrafelhasználhatóak és használatuk viszonylag egyszerű. Ez a szint [Kirk Knoernschild: Java Application Architecture](http://www.amazon.com/Java-Application-Architecture-Modularity-Patterns/dp/0321247132) könyve szerint a modul szint. A könyvről már írtam a [Java Application Architecture posztomban](http://www.jtechlog.hu/2014/10/04/java-application-architecture.html). Definíciója szerint a modulok a következő tulajdonságokkal rendelkeznek. Külön telepíthető. Külön kezelhető, mely futás közben annyit jelent, hogy külön lehet elindítani és leállítani. Fejlesztési aspektusa, hogy külön lehet fejleszteni, buildelni, release-elni. Külön tesztelhető. Különösebb plusz architektúra nélkül használhatóak, azaz egyszerű metódushívásokon keresztül. Több kisebb modulból  összetett funkcionalitású összetett modul építhető. Modul, mint olyan nem példányosítható, állapottal nem rendelkezik, csupán a benne lévő komponensek, az objektumok léteznek a virtuális gépen belül. Tömör, jól definiált és egyszerűen használható interfésszel rendelkeznek a külvilág felé.

Az is látható, hogy ezen szintek megalkotásánál ugyanazon objektumorientált elveket kell figyelembe venni, úgymint a high cohesion, low coupling, single reposibility principle, well defined interfaces. 

A  könyv szerint a felsorolt tulajdonságok alapján a modul Java platformon nem más, mint a JAR állományok.

De nézzük meg pontosan, hogy tényleg az újrafelhasználhatóság az egyik legfontosabb oka annak, hogy az alkalmazásunkat modulokra bontsuk? Egy elterjedt nézet szerint az alkalmazások architektúrája követi az azt fejlesztő cég munkamegosztását. Azaz amennyiben pl. három csapat dolgozik az alkalmazáson, jellemző, hogy három nagyobb modulra lesz felbontva. Kis létszámú agilis csapatok hajlamosabbak modularizált alkalmazások fejlesztésére. Egyrészt a feladat akkora részekre lesz bontva, melyet egy csapat átlát, csökkenve ezzel a komplexitást. A csapatok közötti konfliktusokat úgy próbálják csökkenteni, hogy jól definiált, egyszerűen használható interfészeket alakítanak ki (, mely mögé elrejtik az implementációt). És gyakran egy csapat felelőssége is egy modulra korlátozódik.

Mostanában felkapott fogalom lett a microservices, mely definíciója korántsem olyan egyértelmű. A microservices ígérete szerint olyan külön fejleszthető, tesztelhető, telepíthető és skálázható szolgáltatásokat implementálhatunk általa, ahol a szolgáltatások architektúrája, platformja akár teljesen eltérő lehet, sőt idővel tetszőlegesen cserélgethetjük őket. A microservices azonban nem csodafegyver. Amennyiben nem tudunk jól felépített, spagetti kódtól mentes monolitikus alkalmazásokat fejleszteni, a microservices használatába is bele fogunk bukni. Ugyanis a komplexitás megmarad, csak azokat máshova, tipikusan üzemeltetési oldalra toljuk. Új problémák jönnek be, úgymint hálózati késleltetés, hibakezelés, tranzakciókezelés, verziózás.

![Microservices](/artifacts/posts/2015-08-27-modularizacio/microservices_600.png)

Mit javaslok hát? Az objektumorientált alapelveket betartva próbáljunk az egyszerűbb felől kiindulni, és csak szükség esetén továbblépni. Mivel Java platformon a modularizáció egyik eszköze a csomagok, alkossunk olyan monolitikus rendszert, mely megfelelően van csomagokra bontva. Amennyiben ez nem elég, vágjuk szét külön
JAR állományokra, mely az elterjedt Maven project management tool fogalmai szerint
projektek, melyek kimenete egy vagy több artifact. A build történhet egy lépésben, de akár tovább is léphetünk, hogy külön buildeljük, release-eljük. Csomagoljuk statikusan össze az alkalmazást, de amennyiben szükségünk van a dinamikus betöltésre, indításra és leállításra, lépjünk pl. az OSGi felé. Amennyiben ez sem megfelelő, és ki akarjuk használni az elosztott architektúra előnyeit, de meg tudunk birkózni a kihívásokkal, lépjünk a microservices irányba. Itt is lehet, hogy először érdemes valami különálló funkciót kiszervezni, pl. import/export, vagy riportolás, csak aztán átállítani az összes modult.

![Robbanthatóság](/artifacts/posts/2015-08-27-modularizacio/robbantas_600.png)

Egy hasonlattal tudok élni. Gyakran látom, hogy egy projekt indításakor kialakítanak egy könyvtárstruktúrát egy közös meghajtón, vagy dokumentumkezelő rendszerben, hogy mit hova fognak tenni. Ennek az elején általában van sok könyvtár, úgy kell bennük a dokumentumokat keresgélni. A projekt előrehaladtával azonban kiderül, hogy a struktúra nem is jó, rengeteg üres könyvtár, és pár olyan könyvtár, mely kezelhetetlenül nagy mennyiségű dokumentumot tartalmaz. Láttam ugyanezt Java csomagokkal, és `pom.xml` állományokkal is.

Simon Brown, a [Coding The Architecture](http://www.codingthearchitecture.com/) blog írója, aki a magyarországi [Craft konferencián](http://craft-conf.com) is adott elő arra ösztönöz minket, hogy az architektúrának a kódban is meg kell jelennie. Azaz ha ránézünk a Java csomagokra, azonnal tükrözze az architektúrát. Ugyanez a helyzet a Maven projektekkel is.

Amennyiben modulok nélküli monolitikus alkalmazásokkal dolgozunk, és csak csomagokat használunk a szeparálásra, a [JDepend](http://www.clarkware.com/software/JDepend.html) segíthet az architektúrának betartásában, segítségével ugyanis  tesztesetként definiálhatók a csomagok közti függőségek, lásd a következő forráskódot.

{% highlight java %}
DependencyConstraint constraint = new DependencyConstraint();

JavaPackage repository = 
  constraint.addPackage("jtechlog.funct1.repository");
JavaPackage service = 
  constraint.addPackage("jtechlog.funct1.service");
JavaPackage controller = 
  constraint.addPackage("jtechlog.funct1.controller");

controller.dependsUpon(service);
service.dependsUpon(repository);

jdepend.analyze();

assertEquals("Dependency mismatch",
  true, jdepend.dependencyMatch(constraint));
{% endhighlight %}

Amennyiben továbblépünk, és Maven projektekbe szervezzük moduljainkat, a [Dependency Plugin](https://maven.apache.org/plugins/maven-dependency-plugin/) `analyze` és
`tree` goaljai lehetnek a segítségünkre.

A modulokat szintekbe szervezhetjük. Túl sok szint használata itt sem javasolt. Érdemes egy core modul kiépítése melyben a gyakran használt value object-eket, util osztályokat, alap entitásokat tárolhatjuk. Kerülhetnek ide a modulok között definiált interfészek megfelelően csomagokba szervezve és a default (dummy) implementációk. (Ez szentségtörésnek hathat, hogy miért nem a modulok mellett helyezkedik el - az is egy megoldás.) Amennyiben a modulok nem szinkron metódushívással, hanem eseményekkel kommunikálnak, azok osztályai is kerülhetnek ide.

![Szintek](/artifacts/posts/2015-08-27-modularizacio/leverize_600.png)

A következő szint az üzleti funkciókhoz tartozó modulok. Tipikus független modul lehet az üzleti modulokon átívelő funkcionalitást implementáló infrastrukturális modul (pl. audit naplózás), valamint másik modul lehet az alkalmazás kapcsolatait kezelő kommunikációs modul is (webszolgáltatás kliensek és definíciók). Ezen modulok tartalmazzák saját felhasználói felületüket, külön tesztelhetőek és indíthatóak is. Verziókezelőben függetlenül jelennek meg, teljesen külön buildelhetők és release-elhetők.

Legfelső szint lehet az üzleti modulokat összefogó konténer modul. A Servlet 3 szabvány már lehetővé teszi un. web fragmentek definiálását. Így a konténer modul lehet benne a WAR állomány, benne JAR-ként az üzleti modulok. A web fragmentekben nem csak class állományok, hanem a `META-INF/resources` könyvtárban bármilyen más erőforrás állományok is lehetnek, mint pl. JSP, JavaScript, CSS állományok. Ez tehát lehetővé teszi, hogy az üzleti modulok felhasználói felületét kiszolgáló állományokat is az üzleti modul JAR-jába tegyük. A Servlet 3.0 előtt a modulokat ki kellett csomagolni, majd WAR overlay-jel újra összemásolni, ezt build performancia okokból kerüljük. A konténer modul alapvető funkcionalitást is nyújthat, pl. menü darabkákból összeállíthatja az alkalmazás komplex menürendszerét. Amennyiben egy funkcionális modulban fejlesztünk, a funkciót ki kell próbálni a konténer modulban is, de ekkor elegendő a funkcionális és konténer modult buildelni, a többi akár Maven repository-ból is jöhet. Fejlett IDE-vel meg lehet nyitni egyszerre több modult, és ebben az esetben nem a Maven repository-n keresztül próbálja meg feloldani a függőséget, hanem a nyitott projektek közül.

A modulok automatikus feltérképezéséhez nagyon jól használható a Spring azon tulajdonsága, hogy amennyiben dependency injection során egy collectiont adunk meg, a konténer az összes implementációt átadja, lásd kódrészlet.

{% highlight java %}
public interface Module {
  
  public String getName();

  public String getVersion();

}
{% endhighlight %}

{% highlight java %}
@Component
public ModuleContainer {

  @Autowired
  public List<Module> modules;

  public ModuleContainer(List<Module> modules) {
    this.modules = modules;
  }

}
{% endhighlight %}

A fizikai rétegek alapján történő modularizálást erősen ellenjavallom. Amennyiben vágni kell, mindig üzleti funkciónként vágjunk, és csak azon belül fizikai rétegenként. Ugyanis az egy implementációs részlet, igazából az API felől lényegtelen. Egyedül a technológia kényszeríthet arra, hogy külön Maven projektbe szervezzük, ugyanis más pluginekkel és életciklussal buildelhető egy Java backend és egy JavaScript frontend. Ha ilyen az alkalmazásunk, akkor is multimodule Maven projektként érdemes definiálni, nem érdemes külön buildelhetővé és release-elhetővé tenni. Amennyiben a moduljaink felépítése azonos, és nem akarunk a `pom.xml` állományokban a függőségeket másolni, prototype szülő projekteket alkalmazhatunk, melyek csak a függőségeket sorolják fel.

![Csomagok](/artifacts/posts/2015-08-27-modularizacio/package.png)

A fizikai layerek szerinti vágást a Spring úgy támogatja, hogy külön lehet a backendhez (`ContextLoaderListener` használatával) és külön a frontendhez (`DispatcherServlet`) ApplicationContext-et definiálni, ami szülő-gyermek kapcsolatban áll egymással (teszt esetekben `@ContextHierarchy` annotációval egyenértékű). A gyermekben látszanak a szülőben definiált beanek, de fordítva ez nem igaz. Így megakadályozható, hogy egy controller legyen egy service-be injektálva.

Minden modul saját adatbázis táblákkal rendelkezik, melyeket érdemes prefixelni, egymással nem osztják meg ezeket. A JPA-ban probléma lehet azzal, hogy modulonként több `persistence.xml` van, ezt a Spring olyan elegánsan áthidalja, hogy ezen xml megadása nem kötelező, ha az entitásokat a következő módon deklaráljuk.

{% highlight java %}
entityManagerFactoryBean.setPackagesToScan("jtechlog");
{% endhighlight %}

Amennyiben a modulok saját maguk hozzák létre a sémájukat, kitűnő választás lehet a [Flyway](http://flywaydb.org/). Ez alapból ugyan elszáll, ha nem üres a sémája, de a `setInitOnMigrate` metódussal ez felülbírálható. Az előző módszert alkalmazva implementálható a modulok séma inicializálása.

{% highlight java %}
for (Module module: modules) {
  Flyway flyway = new Flyway();
  flyway.setDataSource(dataSource);
  flyway.setLocations(computeLocations(databaseType, 
    module.migrationPathPrefix()));
  flyway.setTable(module.schemaVersionTableName());
  flyway.setInitOnMigrate(true);
  flyway.migrate();
}
{% endhighlight %}

A Spring lehetővé teszi a konténerfüggetlenséget is, non-invasive, azaz a forráskódban meg sem kell jelennie Spring Framework részeként definiált interfészeknek, annotációknak vagy osztályoknak. Használható ugyanis mind az XML-alapú, mind a Java config.

Azt is megadhatjuk, hogy minden modul saját maga konfigurálja fel magát, pl. a következő módon XML-ben.

{% highlight xml %}
<context-param>
  <param-name>contextConfigLocation</param-name>
  <param-value>
    classpath*:conf/**/appContext.xml
  </param-value>
</context-param>
{% endhighlight %}

Vagy Javaban component scannel.

{% highlight java %}
@ComponentScan("jtechlog.**.config")`
{% endhighlight %}

De amennyiben a convention over configuration hívei vagyunk, és moduljainkat ugyanúgy építjük fel, megadható globális konfiguráció is (wildcard karakterek használata a funkciónkénti csomagolás miatt).

{% highlight java %}
@ComponentScan({"jtechlog.**.repository",
  "jtechlog.**.service",
  "jtechlog.**.controller"})
{% endhighlight %}

A konfigurációkat sose tartsuk az alkalmazáson belül (default konfigurációt kivéve), mindig a környezet részét képezze. Erre egy remek megoldást biztosít a Spring Boot [Externalized Configuration néven](http://docs.spring.io/spring-boot/docs/current/reference/html/boot-features-external-config.html). A háttérben a Spring 3.1-ben bevezetett [Unified Property Management](http://spring.io/blog/2011/02/15/spring-3-1-m1-unified-property-management/) áll.

A modulok közötti interfészek kialakítása történhet szinkron metódushívásokkal, vagy események küldésével is. Az interfészek és implementációjuk különválasztására nincs standard megoldás. 

Az interfészeket külön modulba is lehet tenni. Lehet például a már előbb említett módon a core modulba. Valamint a funkcionális modul multimodule projektjének külön almoduljába is tehetjük. De Maven project attached artifactjaként is megjelenhet, ekkor a Jar Plugint a következőféleképpen kell konfigurálni.

{% highlight xml %}
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-jar-plugin</artifactId>
    <version>2.6</version>
    <executions>
      <execution>
        <phase>package</phase>
        <goals>
          <goal>jar</goal>
        </goals>
        <configuration>
          <classifier>client</classifier>
          <includes>
            <include>**/service/*</include>
          </includes>
        </configuration>
      </execution>
    </executions>
</plugin>
{% endhighlight %}

Az OSGi megkülönbözteti a service interface-t és implementationt (`Manifest.mf` állományban `Export-Package`). A régóta húzott Project Jigsaw a `module-info.java` állományban képes ezeket definiálni. 

{% highlight java %}
module com.greetings @ 0.1 {
  requires jdk.base; // default to the highest available version
  requires org.astro @ 1.2;
  class com.greetings.Hello;
  exports com.greetings;
}
{% endhighlight %}

Érdekes, hogy a Springre épülő megoldások sorra megbuktak. Kezdetben a Spring Dynamic Modulest adta át a Pivotal az Eclipse-nek, mely Impala néven született újjá, és 2013 óta áll. A SpringSource dm Server ugyanígy járt, 2014 júliusában került kiadásra utoljára Eclipse Virgo néven.

Említésre került, hogy az interfészek mellé kerülhetnek a default implementációk, melyeket felül lehet deklarálni. A Spring ezt kezeli, ugyanis ugyanazon a néven több beant is lehet deklarálni, és a Spring a legutóbbit hozza csak létre, és erről INFO szinten naplóbejegyzést is létrehoz.

Az integrációs teszteseteket a funkcionális modulokon belül külön almodulba érdemes tenni. A modult interfészen keresztül lehet meghajtani. A modulokon átívelő integrációs tesztek tehetők a konténer modul külön almoduljaként. A Spring az ApplicationContextet cache-eli, ezért nem érdemes más-más teszteseteket különböző konfigurációval futtatni, és ugyanezért nem érdemes az ApplicationContext állapotát sem változtatni a teszt során.

Összefoglalásként elmondható, hogy az OSGi vagy Jigsaw a modularizáció szempontjából csak egy implementációs választás, sokkal fontosabb, hogy tiszta objektumorientált elveket alkalmazzunk. Egyszerű felépítéssel induljunk, és ne féljünk ezen módosítani. Csomagokkal szervezett monolitikus alkalmazással induljunk, melyet később szétrobbanthatunk külön modulokra, vagy akár szolgáltatásokra is. A Maven és a Spring néha nem annyira ismert tulajdonságai támogatják a modularizációs tervezési mintákat.

![Fotó](/artifacts/posts/2015-08-27-modularizacio/photo_600.jpg)
