---
layout: post
title: JAX-WS mélyvíz
date: '2009-11-23T00:05:00.008+01:00'
author: István Viczián
tags:
- JAXB
- JAX-WS
- Java SE
- Java EE
---

Frissítve: 2017. november 18.

JAX-WS mélyvíz címmel tartottam előadást a [JUM XII.
alkalmán](http://wiki.javaforum.hu/display/JAVAFORUM/JUM0911), mely a
ustream.tv-nek köszönhetően [utólag is
megnézhető](http://www.ustream.tv/flash/video/2585433), és a [diák is
letölthetőek](/artifacts/JUM12-Viczian-Istvan-JAX-WS-melyviz.pdf).

Az előadás kapcsán beszéltem a JAXB és JAX-WS referencia
implementációval éles projektben szerzett tapasztalatokról, melyeket itt
is összefoglalnék. Megpróbálok általános tippeket is adni, melyet egy
SOA bevezetés során figyelembe kell venni.

A webszolgáltatásokkal kapcsolatban az egyik legnagyobb félreértés az
szokott lenni, hogy kizárólag a HTTP(S)/SOAP web szolgáltatásokat értjük
alatta. Ez nincs teljesen így, a W3C definíciója szerint a web
szolgáltatások hálózaton keresztüli gép-gép együttműködést támogató
szoftverrendszerek. Ez elég sok mindenre ráillik. Igaz azonban, hogy a
leggyakrabban használt kombináció tényleg a HTTP(S)/SOAP, ahol a HTTP(S)
az átviteli (transzport) protokoll, a SOAP az üzenet formátum, de
mindkettő lecserélhető, pl. JMS protokollra, vagy JSON üzenetformátumra.

Amennyiben nem saját rendszereink kommunikálnak, már a SOAP-pal
kapcsolatban is sok mindenben meg kell egyezni a kommunikáló partnerrel,
mely lehet a web szolgáltatást nyújtó, és a web szolgáltatást igénybe
vevő fél is. Erről a [Webszolgáltatásokkal kapcsolatos
szabványok](/2008/11/26/webszolgaltatas-szabvanyok.html) című előző
posztomban írok. A WS-I-n kívül meg kell említeni a WS-Security (web
szolgáltatások biztonsága), WS-Reliability (biztonságos pontosan
egyszeri üzenetküldés web szolgáltatásokkal) és a WS-Transaction
(tranzakciókezelés web szolgáltatásokkal, itt a kompenzáló tranzakciókat
érdemes megjegyezni) szabványokat is.

Az implementáció lehet bottom up, mikor már létező kódunk próbáljuk web
szolgáltáson keresztül is elérni, top down, mikor a WSDL-ből indulunk
ki, és fejlesztjük mögé a funkcionalitást, és meet in the middle is,
mikor a már létező funkciókat kell egy meghatározott interfészen
keresztül kiajánlani - értelemszerűen ez a legbonyolultabb, hiszen nem
feltétlenül ugyanaz az interfészben definiált struktúra, mint amit a
rendszerünkben már kialakítottunk. Az utóbbi esetben különösen, de amúgy
is érdemes nem az üzleti funkcióinkat közvetlenül kiajánlani web
szolgáltatásokként, hanem egy külön web szolgáltatás réteget
kialakítani. Ez segít nekünk az interfész és az üzleti logika
elválasztásában, és az interfészek verziókezelése is egyszerűbb. Persze
ebben az esetben számolnunk kell a két réteg közötti adatátvitel miatti
többlet munkával (hasonlóan mint mikor az üzleti adatokat DTO-kba
másoljuk).

A webszolgáltatások alapját nyújtó JAXP API-ról a [Java és az XML
posztban](/2014/01/19/java-es-az-xml.html) írok.

Szorosan a webszolgáltatásokhoz tartozó API-k közül meg kell említeni a
SAAJ API-t (JSR 67 - Java APIs for XML Messaging része), mely a SOAP
üzenetek alacsony szintű, DOM faként történő kezelésére való, az JAX-RPC
1.1 API-t (JSR 101), mely egy legacy/deprecated API, távoli eljáráshívás
webszolgáltatásokkal, és az ebből kialakuló JAX-WS 2.0 API-t (JSR 224):
mely már nem csak RPC-re, hanem dokumentum alapú webszolgáltatások
implementálására és hívására is használható. Ezekből a JAXP már régóta a
Java SE része, de a többi részlegesen csak a Java SE 6-ban jelent meg. A
Java EE 5 már mindet teljes mértékben tartalmazza.

A JAX-WS követi az EJB3 alapelveket, hogy minél egyszerűbben lehessen
programozni, és annotációkkal konfigurálható legyen. A protokoll
HTTP(S), de le lehet cserélni JMS-re, SMTP-re, de akár lokális
metódushívásokra is (In-VM). A JAX-WS az XML bindingot JAXB-vel oldja
meg, de ezt akár le is lehet cserélni a referencia implementációban (pl.
JSON-ra). De akár `Source`, `SOAPMessage` vagy `DataSource` példányként
is kezelhetjük az beérkező XML-t, ekkor a `Provider<T>` interfészt kell
implementálni, ez gyakorlatilag a SEI dinamikus alternatívája szerver
oldalon. A payload mód esetén a SOAP boríték belseje kerül átadásra,
ellenkező esetben a teljes boríték. Kliens esetében a `Dispatch<T>`
példányt kell a Service factory-vel gyártani, ami a kliens oldali proxy
dinamikus megfelelője.

Fontos fogalom a SEI (Service Endpoint Interface), mely a web
szolgáltatásként meghívható metódusokat definiálja. Használata nem
kötelező, ekkor implicit SEI generálódik. Kliens oldalon proxy-t kell
használni, mely becsomagolja a hívást és áttolja a hálózaton, valamint a
választ feldolgozza (marshall/unmarshall). Érdemes még a handlerek
ismerete, melyek lehetnek protokoll független (logikai) handlerek,
valamint protokollfüggő (pl. SOAP) handlerek is. Ezeket úgy kell
elképzelni, mint servletek esetén a filtereket, képesek elkapni a
hívásokat, és a válaszokat, és akár módosítani is azt. Tipikusan jók
biztonságra, tranzakciókezelésre, naplózásra, AOP web szolgáltatás
szinten.

Az inout típusú paramétereket a `Holder` osztállyal lehet kezelni.

A JAX-WS aszinkron hívást is támogat, ilyenkor a kliens egy külön szálon
hívja a webszolgáltatás hívást, és az alkalmazás futhat tovább blokkolás
nélkül. Lehet később visszakérdezni, hogy hogy áll, valamint
eseményfigyelőt is lehet a webszolgáltatás hívásának befejezésére
definiálni.

A fenti betűszavak csak specifikációk, ezeknek különböző megvalósításai
is vannak.

Sajnos az összes projektet a java.dev.net hosztolja, melynek
rendelkezésre állása tragikus. A támogatással sem voltam megelégedve,
szemben a SOAPUi gyors reakciójával, ugyanis belefutottam abba a hibába,
hogy a SEI-ben nem lehet konstansokat definiálni. A fórumban
megkérdeztem, hogy miért, hiszen egyik specifikációban sem láttam (,
valószínűleg JAX-RPC örökség), és forráskódot is csatoltam. Nem
érkezett válasz.

A legfontosabb dolog, melyre a fejlesztés során rájöttem, hogy nem
elegendő a JDK-ban lévő eszközökkel dolgozni, mindig a legfrissebb
eszközöket kell használni, mivel gyorsabban fejlődnek, és
rengeteg hiba található régebbi verziókban. A `schemagen –version`
paranccsal lehet a JAXB verzióját lekérdezni, a JAX-WS-t a
`wsimport –version` paranccsal. Mostanában
akár update verziónál is változik a JDK-ban lévő JAXB vagy JAX-WS
implementáció, ezzel kapcsolatos bonyodalmakkal az előbb is említett
posztom foglalkozik. Azóta kiderült, hogy a régebbi verzió az `ANY`
típusú taget sem megfelelően kezelte, valamint az Axis által küldött
mime fejléccel is problémái voltak. A verziófrissítés mindkét problémát
megoldotta (az utóbbinál a teljes JDK-t kellett).

A JAXB és JAX-WS parancssori eszközök mindegyikének van Ant task párja,
és Maven plugin is.

Teszteléshez mindenképp a SOAPUi eszközt javaslom, mely képes nem csak
webszolgáltatásokat meghívni, hanem szimulálni is. Erre is érvényes a
verziókkal kapcsolatos megállapításom. Az attachment kezeléssel
belefutottam egy hibába a 3.0.1-es verzióval (Exception, üres kérést
generált), amit jelentettem
is a fórumon.
Másnap jött a válasz, hogy próbáljam meg a nightly builddel, amivel
tényleg ment.

A fejlesztés között a verziókon kívül a legtöbb problémám az `ANY`típusú
tagekkel volt. Példaként nézzünk is egy ilyen részletet:

{% highlight xml %}
<xs:complexType name="AnyType">
  <xs:sequence>
    <xs:any minOccurs="0" maxOccurs="unbounded"
        namespace="##any" processContents="skip" />
  </xs:sequence>
</xs:complexType>
{% endhighlight %}

Ebben az esetben a belső tartalmon nem végzi el a JAX unmarshallt, hanem
DOM-ot kapunk. Ezt nekünk kell manuálisan unmarshallolni. A JAXB File,
Stream és DOM-on kívül képes unmarshallolni bármilyen `Source`-ból,
valamint a StAX-os `XMLStreamReader`-ből és `XMLEventReader`-ből is.
`ANY` esetén egy olyan hibába is beleütköztem, hogyha más névtérben volt
a belső tartalom, és az nem volt prefix-szel megjelölve, akkor annak
elrontotta a névterét. A `setPrefix` hívás segített.

A `JAXBContext`-et érdemes cache-elni, hiszen szálbiztos.

A `JAXBElement` a JAXB 2.0-ban jelent meg. Az XJC, ha az adott típus nem
használható más néven, akkor egy POJO-t generál. Azonban ha használható,
akkor `JAXBElement` példányba burkolva lehet használni. Ezt
kikerülhetjük, ha használjuk a gyártófüggő `<xjc:simple />`
konfigurációt, vagy mi példányosítunk
`new JAXBElement(new QName("uri","local"), MessageType.class, messageType)`
módon.

Alapesetben webszolgáltatás híváskor teljesítmény okok miatt nem
történik validáció, de ezt a `com.sun.xml.ws.developer.SchemaValidation`
annotációval bekapcsolhatjuk a `@WebService` annotációt tartalmazó
osztályon.

Attachmentet
kezelhetünk
SwA (SOAP with attachment), és MTOM szabvány szerint is. Mivel az előbbi
már kevésbé támogatott, az utóbbit érdemes használni. Az MTOM (SOAP
Message Transmission Optimization Mechanism) egy szabvány arra, hogyan
tud egy SOAP kommunikációban a két kommunikáló fél megegyezni abban,
hogy kihasználva az átviteli közeg előnyeit vigyen át adatokat. Ennek
egy megvalósítása a XOP-ra (XML-binary Optimized Packaging) épülő
Optimized MIME Multipart/Related Serialization of SOAP Messages). Ez
gyakorlatilag azt jelenti, hogy egy állományt hatékonyabban lehet
átvinni, ugyanis nem a szöveges kommunikációba lesz bekódolva
BASE64-gyel, ami 33%-kkal növeli a hosszt, hanem az e-mailhez hasonlóan
az üzenet két különböző mime type-ú részre van osztva, egy szövegesre,
mely hivatkozik az állományra (`xop:Include` tag-gel), és egy binárisra,
mely tartalmazza az állományt. JAX-WS-ben az `@MTOM` annotációval lehet
kihasználni. Az XML `xop:Include` hivatkozást fog tartalmazni. Sajnos
nekem az előbbit kellett használnom, ahol az `attachment`-et kötelező
megadni, sajnos a másik fél, nem alkalmazkodott a szabványhoz, így 0
bájtos állományokat kellett küldenünk.

A WSDL-lel kapcsolatban is belefutottunk egy
hibába, a
`wsdlLocation` beállítása relatív, protokoll nélkül nem működött
(CLASSPATH-ról resource). A 2.2-es JAX-WS-ben javítva.

Sajnos a NetBeanssel is voltak problémáim. Amennyiben az interfész nem
volt megfelelő (pl. `BARE = "unwrapped"` módnál több paraméter megadása,
vagy `List` típusú visszatérési érték), nagyon szűkszavú hibaüzenet írt
ki: `Error starting wsgen:`. Ebből nem lehetett rájönni a hiba okára, a
megoldás a `jaxws-build.xml`-ben a `wsgen` Ant task-nál a
`verbose="true" fork="true"` paraméterek elhelyezése. Ezt beírva a
hibaüzenetek már beszédesebbek, több paraméter esetén:

    Exception in thread "main" com.sun.xml.ws.model.RuntimeModelerException:
    runtime modeler error: SEI [osztály neve] has method [metódus neve] annotated as
    BARE but it has more than one parameter bound to body. This is invalid.
    Please annotate the method with annotation:
    @SOAPBinding(parameterStyle=SOAPBinding.ParameterStyle.WRAPPED)

List visszatérési érték esetén:

    Exception in thread "main" com.sun.xml.ws.model.RuntimeModelerException:
    runtime modeler error: SEI [osztály neve] has method [metódus neve] annotated as
    BARE but it has more than one parameter bound to body. This is invalid.
    Please annotate the method with annotation:
    @SOAPBinding(parameterStyle=SOAPBinding.ParameterStyle.WRAPPED)

Sajnos a NetBeansben a WSDL validáció sem működik, ha szerepel benne az
attachment miatt `<mime:multipartRelated>` tag. Hibaüzenet:
`"ERROR: At least one <soap:body> element is required per input/ouput message in a soap operation."`

A JAX-WS Springgel is használható, a GlassFish &gt; Metro &gt; JAX-WS
commons &gt; Spring support projekttel. Sajnos ebbe is hibába futottam,
ugyanis ha a WSDL-t kézzel akarjuk megadni (sajnos a megoldás nem
szimmetrikus, WSDL alapján gyártott osztályok nem mindig ugyanazt a
WSDL-t generálják ki), akkor nem lehet több erőforrás megadni a Spring
névteres módon, hanem trükközni kell. Álljon itt egy Spring
`applicationContext.xml` részlet erre.

{% highlight xml %}
<bean id="metadata" class="java.util.ArrayList" >
  <constructor-arg>
    <list>
      <value>/WEB-INF/wsdl/1.xsd</value>
      <value>/WEB-INF/wsdl/2.xsd</value>
    </list>
   </constructor-arg>
</bean>

<bean id="loggingHandler" class="jtechlog.LoggingHandler"/>

<wss:binding url="/service">
  <wss:service>
    <ws:service bean="#mySIB">
      <ws:handlers>
        <ref bean="loggingHandler" />
      </ws:handlers>
      <property name="metadata" ref="metadata" />       
    </ws:service>
  </wss:service>
</wss:binding>
{% endhighlight %}

A NetBeansnek nem tudtam megmagyarázni, hogy Springgel akarom használni
a web szolgáltatást, ő mindenképp generálni akarja a szabvány JAX-WS-es
dolgokat.

A naplózásra érdemes még kitérni. `Handler`-rel próbáltam megoldani.
Először is összeakadt a Handler, Tomcat, Log4J hármas, lefagyott tőle a
Tomcat, de csak kivétel esetén (persze rendesen le volt kezelve) -
valahogy a konzolra írás és olvasás deadlockkolt. A NetBeans forrásában
látott `Thread.sleep(100);` megoldotta a problémát. Ezen kívül nem
érdemes erre használni a standard handlereket, ugyanis van benne DOM
parse-olás, inkább javasolt a gyártófüggő
`com.sun.xml.ws.api.handler.MessageHandler` használata. Sajnos itt is
több problémába ütköztem. Érdemes még arra is gondolni, hogy a
viszonylag nagyméretű XML-eket érdemes aszinkron naplózni.

Összegzésként azt kell megállapítanom, hogy az az ígéret, miszerint a
szabványokat és az eszközöket úgy alkotják meg, hogy ne kelljen az
infrastruktúrával foglalkozni, csupán az üzleti logikára koncentrálni,
nem teljesen igaz.
