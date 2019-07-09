---
layout: post
title: Konfigurációs paraméterek EJB és web rétegben WildFly alkalmazásszerveren
date: '2011-02-27T23:33:00.010+01:00'
author: István Viczián
tags:
- EJB
- Maven
- WildFly
- Java EE
modified_time: '2011-08-24T11:14:59.394+02:00'
---

Technológiák: WildFly 8.2.0.Final (korábban JBoss), Maven 3.2.1, Java EE 7, EJB 3.1, JNDI

Utoljára frissítve: 2015. február 4.

Megjegyzés: ugyanezt leírtam Glassfish-sel is egy későbbi
[posztban](/2011/04/17/konfiguracios-parameterek-Glassfish.html).

Ha az alkalmazás futtatásához szükséges konfigurációkat paramétereket
akarunk tárolni, beolvasni, rengeteg lehetőségünk van. Tapasztalatom
szerint szinte mindenhol másképp van megoldva. Ha az alkalmazás
tartalmazhatja ezeket a beállításokat, akkor belecsomagolhatjuk, de
ekkor figyelembe kell venni, hogy a konfiguráció váltásakor újra kell
telepítenünk. Ekkor a konfigurációk szerepelhetnek kódban konstansként,
properties állományban (melyet classpath-ról töltünk be),
EJB-k esetén environment variable-ként
(`ejb-jar.xml`-ben definiálva). Ha különböző környezetek vannak, akkor a
build folyamat során kell arról gondoskodni, hogy különböző
konfigurációs állományok kerüljenek a különböző környezetekre
telepítendő alkalmazásokban.

Ezen megoldások kevésbé flexibilisek, hiszen módosításkor újra kell
telepíteni az alkalmazást, valamint sokkal szebb megoldás, ha
környezetenként is ugyanaz a telepítendő alkalmazásunk van, és a
környezetfüggő dolgok az alkalmazáson kívül szerepelnek.

EJB vagy web konténer esetén jó megoldás lehet kevés számú paraméter
esetén a system property, több paraméter esetén a JNDI használata is.
Semmiképp nem szeretem a fájlrendszerben itt-ott elbújó állományokat,
hiszen nagyon nehéz a nyomon követésük, verziókezelésük általában el
szokott maradni. Ha nagyon muszáj, talán szóba jöhet az, hogy egy system
property, vagy egy JNDI bejegyzés tartalmaz egy referenciát a
konfigurációs állományra. A JNDI használatánál arra kell különösen
figyelni, hogy konténerek között működő, platformfüggetlen megoldást
találjunk.

Állomány esetén kérdés annak formátuma is. Leggyakoribb a standard
properties állomány, mely a Java 1.5 óta kezel
XML állományokat is, valamint az 1.6-os Java-tól kezdve képes Writerből
is tölteni, tehát az állomány karakterkódolása lehet bármilyen, nem kell
a native2ascii eszközt használni. Java 1.4-ben megjelent a
`java.util.prefs` is, mely már sokkal több mindent tud, mégsem terjedt
el. Lehet egyedi XML, de ekkor nekünk
kell gondoskodni a beolvasásáról, valamilyen XML könyvtár használatával,
netalán XML bindinggal.

Persze talán a legteljesebb megoldás az adatbázisban történő tárolás, de
az itt tárolt értékek szerkesztése koránt sem olyan triviális.

A konfigurációs paraméterek kezelése esetén a tárolás után a fő gondom
az szokott lenni, hogy hogyan lehet azokhoz hozzáférni, azokat
szerkeszteni. A fájl esetén a legegyszerűbb a helyzet, hiszen egy
egyszerű szövegszerkesztővel el lehet végezni a módosításokat. Lehet
saját webes felület, de ezt külön kell fejleszteni, karbantartani,
illetve a parancssorhoz szokott adminisztrátoroknak sem szokott
tetszeni, plusz egy probléma, hogy a címet meg kell jegyezni. Ha a konténer
adminisztrációs felületébe épül, akkor talán kicsit jobb a helyzet. Az
adatbázisban tárolt konfigurációs paraméterek esetén lehet nekiesni egy
SQL klienssel, de szintén ellenérzést válthat ki, valamint kérdés, hogy
milyen gyakran olvassa újra az alkalmazás. Javaban van persze erre is
szabvány, a JDK részét képző JMX.

Kérdés, hogy a változások mikor lépnek életbe. Hiszen nem biztos, hogy a
leghatékonyabb minden esetben beolvasni. Általában valamilyen cache
mechanizmus használható. Persze itt megadhatunk lejáratot, hogy mennyi
idő után olvassa újra, vagy megadhatunk eseményeket, melyek hatására
biztos újra megtörténik az újra beolvasás. Állomány szerkesztése esetén
ez egyáltalán nem triviális, hiszen vagy az állományt mindig ellenőrizni
kell, vagy egy szálat kell indítani, ami megnézi, hogy módosult-e. Ez
utóbbi EJB környezetben megint problémás. Erre megoldás lehet a Java
7-ben megjelenő, már régóta várt WatchService API, mely operációs
rendszer szinten figyeli az állomány hozzáféréseket, és értesíti az
eseményre feliratkozókat.

Minden megoldásnál még bezavar a clusteres működés, hiszen kérdés
esetén minden egyes node-on szerkeszteni kell az állományt (itt az
időbeli eltolódás miatt lehet szétcsúszás, illetve érdekes, hogy hogyan
lehet a node-okat egyenként címezni), vagy valahogy a node-ok
megbeszélik egymás között a módosításokat. Esetleg vannak olyan
konfigurációs beállítások, melyek node-onként eltérnek?

Tehát konfigurációs paraméterek tárolásakor és a hozzáférés szerint a
következőket kell mérlegelnünk:

-   Értékeik ismertek-e a build folyamatnál?
-   Okoz-e problémát, ha a konfigurációs paraméterek csak az alkalmazás
    újratelepítésével módosíthatóak?
-   Milyen gyakran változnak?
-   Milyen gyorsan kell a változásoknak életbe lépniük?
-   Milyen szintű felhasználók fogják használni, és nekik mi a
    megszokott, kényelmes eszköz (parancssor, állomány, adatbázis,
    felügyeleti rendszer, webes kliens)?
-   Egy vagy több helyről jön? Pl. lehet, hogy bizonyos dolgokat a
    komponens fejlesztők, az application assembler (aki összerakja az
    alkalmazást darabokból), a telepítő, üzemeltető, netalán a
    végfelhasználó is állíthat?
-   Van-e clusterezett működés. Okoz-e problémát, ha minden cluster
    tagot egyenként kell beállítgatni?

Persze vannak keretrendszerek, melyek segíthetnek a megvalósításban,
melyek a következő funkciókkal rendelkezhetnek:

-   Típusosság, bonyolultabb adatstruktúrák támogatása
-   Paraméter értékek behelyettesítése már paraméter értékekbe
-   Default értékek
-   Különböző források támogatása
-   Különböző forrásból jövő konfigurációk összefésülése, hierarchikus
    betöltés
-   Módosítások mentése
-   Újratöltés
-   Observer tervezési minta támogatása, értesítés, ha változik egy
    paraméter érték
-   JMX hozzáférés

Jó ötlet, hogy az alkalmazás rendelkezzen egy default konfigurációval
is, amit az alkalmazás tartalmaz, ami a fejlesztői környezetre
konfigurált, így a verziókezelő rendszerből való lemásolás 
után azonnal futtatható az alkalmazás, és
ezt érdemes teszt és éles környezetben felülbírálni.

Amennyiben a konfigurációhoz különböző szerepkörrel rendelkező
felhasználók is hozzáférhetnek, szükséges lehet bizonyos paraméterek
titkosítására is. Ilyen lehet pl. egy adatbázis kapcsolathoz tartozó
jelszó. A probléma jellegéből adódóan természetesen nem lehet teljes
védelmet elérni, hiszen az alkalmazásnak is hozzá kell férnie valahogy a
jelszóhoz, és legdurvább esetben egy kód visszafejtéssel biztos, hogy
hozzá lehet férni az érzékeny adatokhoz. Ez inkább csak megnehezíti a
visszafejtést. A JASYPT (Java simplified encryption) könyvtárnak van
olyan lehetősége, hogy [titkosít bizonyos
értékeket](http://www.jasypt.org/encrypting-configuration.html) a
konfigurációs állományban. Ekkor a konfigurációs paraméter értéke valami
hasonló lesz: `ENC(G6N718UuyPE5bHyWKyuLQSm02auQPUtm)`. Képes kezelni
properties állományokat, Springhez és Hibernate-hez illeszthető.

Konfigurációs paraméterek kezelésére alkalmas keretrendszerek:

-   [Commons configuration](http://commons.apache.org/configuration/)
-   [jConfig](http://www.jconfig.org/)
-   [jFig](http://jfig.sourceforge.net/)
-   [The Carbon Core Config
    Subsystem](http://carbon.sourceforge.net/modules/core/docs/config/index.html)

Furcsa, hogy a legfrissebb is 2008-ban frissült utoljára.

A következőkben egy olyan megoldást mutatok be, mely WildFly specifikus.
Nem ad választ minden kérdésre, a
cikkben kizárólag a WildFly egy-két ezirányú képességét szeretném
bemutatni.

A poszthoz a példa alkalmazás fenn van a
[GitHubon](https://github.com/vicziani/jtechlog-earconfig). A
projekt Mavennel fordul, és szépen szemlélteti egy Java EE projekt
felépítését Maven környezetben, ahol a build terméke egy EAR állomány.
Az alkalmazás négy részből áll. Egy parent project, mely a közös
beállításokat tartalmazza, valamint
három modulja:

- `earconfig-ejb`: EJB réteg
- `earconfig-web`: web réteg - erre csak azért van szükség, hogy az EJB
    réteget meg tudjuk hívni
- `earconfig-ear`: az alkalmazás maga

Az `mvn package` parancsot kiadva előáll az
`earconfig-ear/target/earconfig-ear-1.0-SNAPSHOT.ear` állomány. Ahhoz,
hogy telepítsük, vagy másoljuk be a WildFly `standalone/deployments` könyvtárába az
alkalmazást, vagy az `earconfig-ear` könyvtárban a `pom.xml`-ben írjuk át a
`wildfly.server.dir` property értékét arra az elérési útvonalra, ahova a
WildFly lett telepítve, és adjuk ki a `mvn -Pwildfly cargo:deploy` parancsot.
A [Cargo](http://cargo.codehaus.org/) egy olyan könyvtár, mely egységes
felületet biztosít webkonténerek, alkalmazásszerverek kezelésére,
elindítására, leállítására, alkalmazások telepítésére. Mi a Maven
pluginjét használjuk.

Az alkalmazásnak az ejb és war modulja is pontosan ugyanúgy működik. A
ejb modulban az `EarConfigBean` EJB Bean, a war modulban a
`EarConfigServlet` servlet felelős a paraméterek kiolvasásáért.

Az első metódus system property-t olvas be a következő Java SE-ben is
működő módon:

{% highlight java %}
System.getProperty("earconfig.system.property");
{% endhighlight %}

A második metódus context lookuppal lekérdezi a globális JNDI-ben lévő
értékeket:

{% highlight java %}
Context context = new InitialContext();
String[] NAMES = new String[]{"earconfig/string", "earconfig/url",
	"earconfig/inetaddress", "earconfig/properties"};
for (String name: NAMES) {
   Object entry = context.lookup(name);
   System.out.println(entry.getClass().getName() + " " + entry);
}
{% endhighlight %}

Nagyon sokat kínlódtam azzal, hogy a paramétereket globálisan
definiáljam a JNDI-ben, majd azokat elérhetővé tegyem a bean, vagy a web
alkalmazás ENC-jében, ahogyan arról [korábban
írtam](/2009/01/09/jndi-nevek-ejb-kornyezetben.html), sőt ehhez akár a
`@Resource` annotációval hozzáférjek. Ezt azonban nem sikerült megoldani.

<a href="/artifacts/posts/2011-02-27-konfiguracios-parameterek-WildFly/enc_overview.png" data-lightbox="post-images">![ENC áttekintés](/artifacts/posts/2011-02-27-konfiguracios-parameterek-WildFly/enc_overview_t.png)</a>

Klasszikus esetben tehát van az EJB komponens, melyhez a standard
deployment descriptorban (telepítés leíró) vagy a `@Resource`
annotációval lehet egy lokális nevet az ENC-ben deklarálni. Ehhez az
előbbi esetén context lookuppal, az utóbbi esetén szintén a `@Resource`
annotációval fér hozzá az EJB. Az alkalmazásszerverek gyártófüggő módon
engedik az erőforrások felvételét a konténeren belül, és kapnak egy
globális nevet. A lokális és a globális neveket a gyártófüggő deployment
descriptorban lehet összekötni.

Felmerülhet tehát az igény, hogy az ENC-ben deklaráljuk a logikai
neveket, és egy gyártófüggő deployment descriptorban rendeljük hozzá a
konkrét értékeket. Az ENC-ben való deklarációhoz két eszközünk lehet,
vagy a standard deployment descriptor, vagy a `@Resource` annotáció, mely
egymásnak alternatívái (, pontosabban a annotációt a deployment
descriptor felülírhatja).

A standard deployment descriptor-ban (`ejb-jar.xml`) a következő XML
tag-ek használatosak erre:

-   `resource-ref`: Factory-k definiálására, tipikusan `DataSource`-ra
    használható. További osztályok:
    `javax.jms.QueueConnectionFactory` / `javax.jms.TopicConnectionFactory`,
    `javax.mail.Session`, `java.net.URL`.
-   `resource-env-ref`: a neten sok példa ide a `Queue`-t vagy `Topic`-ot
    említi, de helytelenül, lásd a következő pont. Amit találtam róla,
    hogy Connector CCI esetén használható.
-   `message-destination-ref`: valójában ez használandó Queue-t vagy Topic
    definiálására

Ebből máris látható, hogy a mi egyszerű, JNDI-be bejegyzett értékeinkre
nem tudunk mivel hivatkozni. Van ugyan egy `env-entry` tag, de ennek
értékét kizárólag az `ejb-jar.xml`-ben lehet megadni, és nem lehet
felüldefiniálni a JNDI-ben megadott értékkel.

A Java EE szabvány, csak a következő típusokat engedi `@Resource`
annotációval megjelölni:

-   `SessionContext`
-   `DataSource`
-   `UserTransaction`
-   `EntityManager`
-   `TimerService`
-   Más EJB-k
-   Web szolgáltatások
-   Sorok és témák (queue/topic)
-   Connection factory objektumok a resource adapterek számára
-   Környezeti változók: `String`, `Character`, `Byte`, `Short`, `Integer`, `Long`,
    `Boolean`, `Double` és `Float`

Ebből látható, hogy nem lehet akármilyen típushoz, POJO-hoz hozzáférni,
ami már beszűkíti a lehetőségeinket. Ezt a tulajdonságát a `@Resource`
annotációnak a Spring közönség igen erősen kritizálja, érthető okokból.

<a href="/artifacts/posts/2011-02-27-konfiguracios-parameterek-WildFly/enc_details.png" data-lightbox="post-images">![ENC áttekintés](/artifacts/posts/2011-02-27-konfiguracios-parameterek-WildFly/enc_details_t.png)</a>

Így hát marad az, hogy a globális JNDI nevekhez férjünk hozzá context
lookup segítségével. Jobb esetben erre Service Locatort használunk. Még
jobb esetben az előbb említett konfigurációs keretrendszerek
valamelyikét.

De előbb nézzük, hogyan lehet értéket adni egy system property-nek? Vagy
parancssorból a Java virtuális gépnek a `-D` paraméterrel, vagy a
`standalone/configuration/standalone.xml`-ben írjuk be a következőt az `extensions` lezáró tag után.

{% highlight xml %}
<system-properties>
        <property name="earconfig.system.property" value="Hello System Property!"/>
</system-properties>
{% endhighlight %}

Indítsuk újra az alkalmazásszervert.

Hogyan tehetünk értéket a JNDI-be? Megtehetjük parancssori eszközzel,
kódból, vagy a fentebb említett `stanadlone.xml` állományban, a
`<subsystem xmlns="urn:jboss:domain:naming:2.0">` tagen belül.

{% highlight xml %}
<subsystem xmlns="urn:jboss:domain:naming:2.0">
    <bindings>
        <simple name="java:/earconfig/string" value="Hello, JNDI!" type="java.lang.String" />
        <simple name="java:/earconfig/url" value="http://www.jtechlog.hu"
			type="java.net.URL" />
    </bindings>
    <remote-naming/>
</subsystem>
{% endhighlight %}

A példa a következő értékeket illeszti be a JNDI-be:

-   `earconfig/string`: `String` típusú
-   `earconfig/url`: `URL` típusú

Ahogy a [dokumentáció](https://docs.jboss.org/author/display/WFLY8/Naming+Subsystem+Configuration)
írja, használhatunk egyszerű típusokat, azok wrapper osztályait, valamint `java.lang.String` és
`java.net.URL` típusokat, valamint lehetőség van saját object factory-k konfigurálására is.

Így az értékek benne vannak a globális névtérben, lookuppal már hozzá
is tudunk férni. Az alkalmazás az `/earconfig` címen tekinthető meg, és a
következőt kell kiírnia:

    A projekt bemutatja, hogy hogyan lehet Java EE alkalmazásból konfigurációs paramétereket beolvasni.

        * System property EJB rétegben (kulcs: earconfig.system.property): Hello \
    System Property!
        * Context lookup (JNDI) EJB rétegben (JNDI nevek: earconfig/string, \
     earconfig/url, earconfig/properties): [Hello JNDI!, \
    http://www.jtechlog.hu, null]
        * System property web rétegben (kulcs: earconfig.system.property): Hello System Property!
        * Context lookup (JNDI) web rétegben (JNDI nevek: earconfig/string, \
     earconfig/url, earconfig/inetaddress, earconfig/properties): [Hello JNDI!, \
    http://www.jtechlog.hu, null]
