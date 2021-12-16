---
layout: post
title: IBM WebSphere MQ
date: '2009-09-27T21:33:00.007+02:00'
author: István Viczián
tags:
- JMS
- Java EE
- EAI
modified_time: '2018-06-09T10:00:00.000-08:00'
---

A Java mellett az egyik fő érdeklődési területem az
alkalmazásintegráció. Ez utóbbi egyik első, és legelterjedtebb eszköze
az [IBM WebSphere MQ](http://www-01.ibm.com/software/integration/wmq/)
(korábban MQSeries) az üzenetkezelő middleware-ek családjába tartozó
(message oriented middleware - MOM) üzenetsorakoztató middleware. Persze
nem független a Java-tól, hiszen JMS provider-ként tud üzemelni. A múlt
héten az IBM WebSphere MQ V7 System Administration tanfolyamon voltam,
ezzel kapcsolatban írnék a JMS-ről, valamint az MQ-ról. A poszt eleje
mindenkinek szól, a vége inkább már csak azoknak, akik használnak, vagy
használni terveznek MQ-t (különösen Java-ból). A post-hoz tartozik egy
46 oldalas magyar nyelvű cikk is a WebSphere MQ-ról.

A JMS-t a [JSR
914](http://jcp.org/aboutJava/communityprocess/final/jsr914/index.html)
specifikálja, a Java EE része, de természetesen külön is használható. A
JMS csak egy egységes API-t definiál, melyel üzenetkezelést lehet
megvalósítani, és a különböző gyártók különböző megvalósítást adhatnak
(JMS provider), hasonlóan az adatbázis-kezeléshez, amihez a JDBC az
egységes API. A Java EE alkalmazásszerverekben kötelező JMS
megvalósításnak lennie.

A JMS üzenetek küldésére és fogadására használható. Ezzel kialakítható
aszinkron kommunikáció, mikor az alkalmazás végzi a saját feladatát, és
mikor üzenetet kell küldeni, elhelyezi egy sorban, és halad tovább. Nem
várja meg, míg a címzett alkalmazás azt megkapja, és feldolgozza. Persze
szinkron kommunikáció is kialakítható, amikor ezt megvárja, de ekkor
pont a lényege veszik el. Bár biztonságossága miatt szinkron
kommunikációra is alkalmazni szokták, szemben pl. a megbízhatatlanabb,
de kisebb infrastruktúrát követelő web szolgáltatások helyett. Az
aszinkronitáshoz kapcsolódó fogalom a kommunikáció iránya, ami lehet
egyirányú, vagy kérés-válasz típusú is. Ez utóbbi esetben alakítható ki
szinkron kommunikáció, mikor a küldő alkalmazás addig nem halad tovább,
míg a választ meg nem kapja. De hatékonyabb, ha külön küldi el az
alkalmazás az üzeneteit, és külön dolgozza fel a válaszokat. A kérés és
a választ úgy lehet egymásnak megfeleltetni, hogy minden üzenet kap egy
azonosítót (message id), és a válaszban a kérés üzenet azonosítóját kell
egy másik, ún. correlation id mezőbe bemásolni.

A JMS-sel kialakítható pont-pont kommunikáció, mikor két alkalmazás
közvetlenül küldözget üzeneteket egymásnak (e-mail típusú kommunikáció),
valamint kialakítható publish and subscribe kommunikáció is (levelezési
lista kommunikáció). Az utóbbi esetben az előfizetők feliratkoznak egy
témára (topic, melyek felépítése hierarchikus is lehet), míg a
közzétevők erre a témára küldenek üzenetet. Ekkor az összes témára
feliratkozott megkapja azt. Ezzel csökkenthető a kapcsolat szorossága,
és bármikor új alkalmazásokat kapcsolhatunk az adott témára.

Egy üzenetnek van fejléce és lehet törzse. A törzsben különböző
információk utazhatnak, mint szöveges, bináris, map típusú, stb. Az
üzenetnek van perzisztenciája, azaz vagy le kell írni lemezre, hogy a
JMS provider újraindítása után is megmaradjon, vagy elegendő memóriában
tárolni. Az üzenetek prioritással, lejárattal rendelkezhetnek.

Jelenleg a JMS 1.0.2b és 1.1 szabvány a legfrissebb, a kettő között a
legnagyobb különbség, hogy a pont-pont és publish and subscribe
kommunikációt ugyanúgy lehet kezelni, ugyanis az előbbit reprezentáló
Queue interfész, és az utóbbit reprezentáló Topic interfész közös
ősinterfészt kapott Destination névvel. Így a modellt nem az alkalmazás
dönti el, hanem attól függetlenül konfigurációval állítható.

Az IBM WebSphere MQ jó helyen volt jó időben. Elterjedtségét magas ára
ellenére annak köszönheti, hogy ez volt az első, megbízható, és a
legtöbb platformon támogatott üzenetsorakoztató middleware. Nem csak az
aszinkroniztása miatt, hanem platformfüggetlensége (hardver, operációs
rendszer, hálózati protokoll) miatt is kedvelték, hiszen pillanat alatt
össze lehetett kötni egy Sun Solaris-on futó C alkalmazást, egy IBM
RS/6000-on, AIX operációs rendszeren futó COBOL alkalmazással, ami
akkor, mikor a web szolgáltatásoknak nyoma sem volt, igen kemény feladat
volt. Ma már a banki, sőt a közigazgatási szférában is kvázi standard.

Apropó ár. Az IBM WebSphere MQ [Processor Value Unit
\[PVU\]](http://www-01.ibm.com/software/lotus/passportadvantage/pvu_licensing_for_customers.html)
alapján licencelődik, ami azt jelenti, hogy minden típusú processzorhoz
(, akár meghoz) egy értéket rendelnek, amit aztán be kell szorozni az
árral. Pl. egy Intel Xeon (Nehalem) 70 PVU/processzor mag. Ez egy négy
processzoros, Quad-core processzorokkal felszerelt gép esetén 4 \* 4 \*
70 = 1120, ahol Magyarországra a PVU ára egy éves support-tal 66,65
dollár, az majdnem 75 ezer dollár. A PVU azért jó, mert ha kevesebb
processzormagot dedikálunk, kevesebbet kell fizetni.

Persze vannak nyílt forráskódú változatok is, mint pl. a Apache ActiveMQ
(mely a Geronimo-ban a JMS provider), OpenJMS, JBossMQ (JBoss JMS
provider), OpenMQ (Glassfish JMS provider, support-ált változata a Sun
Java System Message Queue), stb. Amit tudni kell, hogy a JMS csak egy
közös interfész, melyet mindegyiknek implementálnia kell, de ezen felül
rengeteg szolgáltatást biztosítanak. Valamint, ahogy említettem, az
alkalmazásszervereknek is JMS provider-nek kell lenniük. Persze több
kereskedelmi termék is van, mint pl. Oracle Advanced Queuing.

A WebSphere MQ a pontosan egyszeri biztos üzenetküldést garantálja. Ezt
úgy oldja meg, hogy mind a küldő oldalon, mind a fogadó oldalon el kell
indítani egy szoftver komponenst (Queue Manager), mely addig tárolja
lokálisan az üzeneteket, míg a másik oldalra át nem vitte. Ezzel az
alkalmazás fejlesztőjének nem kell foglalkoznia. Használható, ha a
hálózati kapcsolat megbízhatatlan, a hívott fél lassan válaszol, vagy
megbízhatatlan, a platform különbségek áthidalására és
terheléselosztásra. Használatával így lazán kapcsolt rendszerek
alakíthatóak ki.

Az MQ-nak két programozási interfésze is van, az egyik az MQI, mely
hasonlóan van implementálva az összes programozási nyelven, és az MQ
összes speciális szolgáltatását ki tudjuk használni, valamint a JMS, ami
provider független, így az tetszőlegesen cserélhető.

Az MQ-ról annak idején írtam már egy cikket, melyet most teljes
egészében közzéteszek. Ebből az alapok elsajátíthatóak, itt már csak a
tanfolyam által bemutatott újdonságokat, és a Java specifikus dolgokat
mutatnám be.

[Teljes IBM Websphere MQ cikk
letöltése](http://delfin.unideb.hu/%7Evicziani/pdf/ws_mq_middleware.pdf)

Az MQ-val kapcsolatos összes kézikönyv publikus, és elérhető a [IBM
WebSphere MQ V7 information
center-ben](http://publib.boulder.ibm.com/infocenter/wmqv7/v7r0/index.jsp).

Amire vigyázni kell JMS használata esetén, hogy az üzeneteket próbáljuk
egymástól teljesen függetleníteni, egy üzenetben az összetartozó
információk utazzanak, és ne legyenek szétosztva több üzenetre. Ugyanis
egyrészt nem biztosított az üzenetek sorrendje, erre külön oda kell
figyelni, másrészt terheléselosztás esetén nem biztos, hogy ugyanaz a
komponens kap két egymás utáni üzenetet.

A JMS lehetőséget biztosít tranzakciókezelésre, akár lokálisra (JMS
provider-en belül), akár globálisra (több erőforrás kezelő
részvételével). Ez utóbbi esetben megoldható pl. hogy egy tranzakcióba
tartozzon egy adatbázis módosítás és egy JMS művelet. Itt különösen kell
vigyázni arra, hogyha kiveszünk a sorból egy üzenetet, és nem sikerül
feldolgozni, és rollback történik, akkor az üzenet visszakerül a sorba.
Ekkor az alkalmazás újra fel akarja dolgozni, és újra hiba történik. Így
remek végtelen ciklus alakulhat ki, amire figyelni kell. Vagy
alkalmazásban kell kivételt kezelni, és figyelni, hogy ne legyen
rollback, vagy az üzenettől le lehet kérni, hogy hányszor került már
vissza a sorba. Ha ez elér egy határértéket, máshogy kell kezelni. A JMS
provider-ek is tudhatnak olyant, hogy pl. valamennyi visszakerülés után
vagy eldobják az üzenetet, vagy átteszik egy másik sorba. Ennek
megvalósításáról egy remek cikk jelent meg [Handling Poison Messages
With Glassfish](http://java.dzone.com/articles/handling-poison-messages)
címmel. A tranzakciókezelésnél az egyik leggyakoribb hiba, hogy a
programozó egy tranzakcióban próbál üzenetet küldeni, és a választ is
abban fogadni. Ekkor remek kis deadlock alakul ki, hiszen a commit-ig
nem megy ki a kérés üzenet, így a hívott fél válaszolni sem tud, így
hiába vár a hívó fél a válaszra.

Java EE-ben nem lehet szálakat indítani. Viszont szükség lehet olyanra,
hogy egy hosszú folyamatot kell elindítani, de nem kell megvárni a
választ, hanem valami státuszt kell visszaadni bizonyos időközönként. Ez
megoldható úgy is, hogy a web konténerben dobunk szálat, de megoldható
JMS-sel is. Ez az aszinkron tervezési minta, azaz egy üzenetet beteszünk
a sorba, amelynek a másik végén egy Message Driven Bean figyel, és
elindítja egy folyamatot. A szál, amelyik betette az üzenetet a sorba,
nem vár válaszra, folytathatja a futását, visszaadhatja a választ a
felhasználónak. A Bean meg végzi a feladatát. Figyeljünk ilyenkor ilyen
timeout-okra, ugyanis lehet, hogy az alkalmazásszerver egy idő után
lecsapja a folyamatot.

Nézzük, hogy mit érdemes még tudni az MQ-ról adminisztrátori oldalról,
mely számomra is új volt, és nem tartalmaz a fenti dokumentáció.

-   Az üzenet biztonságát az MQ úgy biztosítja, mint a relációs
    adatbázisok. Egyrészt egy külön állományban tartja a sorokban lévő
    üzeneteket (queues könyvtár), másrészt egy napló állományt is
    fenntart (log könyvtár), amit folyamatosan vezet. commit esetén
    addig nem megy tovább a végrehajtás, míg a log fájlba a módosítások
    kiírásra nem kerültek. Amennyiben a sort tartalmazó állomány
    megsérül, vagy nem történt meg a cache-elés miatt az írás, és az MQ
    elszáll, a log alapján mindig vissza lehet állítani az üzeneteket
    (strmqm -r paranccsal). Így pl. az adatok és a naplók külön disk-en
    tartása nem csak a sebességet, de a biztonságot is növeli. A
    checkpoint az a művelet, mikor kiírja a sorokat is a disk-re, így
    annak állapota megegyezik a naplóban rögzítettel. Cirkuláris és
    lineáris naplózás is beállítható. A cirkuláris esetén a régebbi
    napló állományokat felülírja, lineáris esetén az összes előzmény
    megmarad. Az utóbbi sokkal biztonságosabb, de több adminisztrációs
    tevékenységgel jár, hiszen folyamatosan archiválni kell a régi napló
    állományokat.
-   A WebSphere MQ client ingyenes, és arra való, hogy a távoli
    sorkezelővel tartja a kapcsolatot, így az alkalmazásnak elegendő
    lokális hívásokat végrehajtani. Ez nem véd a hálózat
    megszakadásától. Java esetén az MQ kliens csak pár JAR állomány.
-   A listener az a komponens, mely a hálózati hívásokat figyeli, és
    amennyiben ilyen jön, elindítja a megfelelő receiver channel-t,
    amennyiben szükséges. Őt vagy az inetd indítja, vagy manuálisan kell
    (runmqlsr parancs, vagy a START LISTENER MQSC parancs). Az is
    beállítható, hogy a sorkezelővel együtt induljon. A channel a két
    sorkezelő közötti kapcsolatért felelős, és egyirányú. A channel két
    végén a message channel agent van. Az egyszerű mód, mikor az
    üzenetet küldő indítja a kommunikációt (sender - receiver). Azonban
    tűzfalas megfontolások miatt (pl. a DMZ-ből ne indítson kifele
    kapcsolatot a sorkezelő) lehet olyan is, hogy a fogadó fél beszól,
    hogy mostmár küldheti az adatokat a küldő (requester - server).
-   Nem csak közvetlen kapcsolatban álló sorkezelőre, hanem távolabbi
    sorkezelőre is küldhetünk üzenetet. ezt hívják multi-hopping-nak.
-   Adminisztrátori eszköz egy Eclipse 3.3-ra épülő plugin, mellyel
    távoli sorkezelőkhöz is lehet kapcsolódni.
-   Amennyiben hibát kapunk, általában csak egy kód jelenik meg (reason
    code - RC). Ezt feloldani nem kell a dokumentációt megnyitni, hanem
    az MQRC paranccsal a kódhoz lekérdezhető a leírás.
-   Maximálisan átvihető méret 100 megabyte. Amennyiben ennél többet
    akarunk átvinni, szegmentálnunk kell. Ezt az MQ tudja, viszont a JMS
    API nem. Így nekünk kell úgy leprogramoznunk, hogy speciális
    üzenetfejléc értékeket állítunk be.
-   Az üzenet csoportok valók arra, hogy a logikailag egybe tartozó
    üzeneteket összekössünk, valamint biztosítsuk azok sorrendjét, ami
    alapban nem biztosított. Szintén fejlécekkel kezelhető.
-   Az IBM WebSphere MQ-ban az adminisztrációs felületről (WebSphere MQ
    Explorer) egyszerűbben lehet a publish and subscribe módot megadni,
    sorkezelő csoportokat definiálhatunk a könyebb adminisztráció
    érdekében, valamint a JNDI objektumokat is könnyen kezelhetjük, ha
    Java-ban programozunk.
-   Az MQ egy közös kódbázisra alapul, mely a platformok között
    hordozható. Erre épülnek a speciális platformhoz kapcsolódó részek,
    mint pl. Windows esetén a GUI. A z/OS teljesen külön állatfajta, az
    teljesen külön ág.
-   Konfigurációs adatok az mqs.ini állományban, Windows esetén a
    registry-ben találhatóak.
-   Az IBM WebSphere MQ-hoz ún.
    [SupportPacs-ek](http://www-01.ibm.com/support/docview.wss?rs=977&uid=swg27007205)
    tölthetőek le, melyek lehetnek kereskedelmi termékek, ingyenesek és
    támogatottak, ingyenesek, de nem támogatottak és 3rd party termékek
    is. Ezek közül szinte van, ami kötelező darab. Az
    [MS03](http://www-01.ibm.com/support/docview.wss?rs=977&context=SSKMAB&context=SS7J6S&context=SSKM8N&context=SSFKSJ&context=SSFKUX&context=SSWHKB&context=SSVLA5&dc=D410&q1=ms03&uid=swg24000673&loc=hu_HU&cs=utf-8&lang=en+hu)
    egy sorkezelőben definiált objektumokat tudja létrehozó script-ként
    elmenteni. Így egy frissen telepített sorkezelőn futtatva a kapott
    script-et meg fog egyezni az eredeti konfigurációjával. Kiváló
    mentésre. A különböző event üzenetek speciális formátumban kerülnek
    a sorba, mely nem olvasható. Ezen segít az
    [MS0P](http://www-01.ibm.com/support/docview.wss?rs=977&context=SSKMAB&context=SS7J6S&context=SSKM8N&context=SSFKSJ&context=SSFKUX&context=SSWHKB&context=SSVLA5&dc=D410&q1=MS0P&uid=swg24011617&loc=hu_HU&cs=utf-8&lang=en+hu)
    SupportPacs. Az
    [MH03](http://www-01.ibm.com/support/docview.wss?rs=977&context=SSKMAB&context=SS7J6S&context=SSKM8N&context=SSFKSJ&context=SSFKUX&context=SSWHKB&context=SSVLA5&dc=D410&q1=MH03&uid=swg24014179&loc=hu_HU&cs=utf-8&lang=en+hu)
    SupportPacs-szel az SSH konfigurációt tudjuk ellenőrizni. A
    legfontosabb, az
    [IH03](http://www-01.ibm.com/support/docview.wss?rs=977&context=SSKMAB&context=SS7J6S&context=SSKM8N&context=SSFKSJ&context=SSFKUX&context=SSWHKB&context=SSVLA5&dc=D410&q1=ih03&uid=swg24000637&loc=hu_HU&cs=utf-8&lang=en+hu)
    SupportPacs, mellyel üzeneteket tudunk browse-olni, kivenni,
    visszarakni, fejléct módosítani, stb. Az
    [MA0R](http://www-01.ibm.com/support/docview.wss?rs=977&context=SSKMAB&context=SS7J6S&context=SSKM8N&context=SSFKSJ&context=SSFKUX&context=SSWHKB&context=SSVLA5&dc=D410&q1=soap&uid=swg24006280&loc=hu_HU&cs=utf-8&lang=en+hu)
    Axis és .NET keretrendszer számára biztosítja, hogy SOAP átviteli
    protokoll legyen az MQ. A
    [MA0Y](http://www-01.ibm.com/support/docview.wss?rs=977&context=SSKMAB&context=SS7J6S&context=SSKM8N&context=SSFKSJ&context=SSFKUX&context=SSWHKB&context=SSVLA5&dc=D410&q1=http+bridge&uid=swg24016142&loc=hu_HU&cs=utf-8&lang=en+hu)
    gyakorlatilag egy servlet, mely lehetővé teszi, hogy az MQ
    funkcionalitását REST-en keresztül, egyszerű HTTP hívásokkal érjük
    el.
-   A 6-os verziótól kezdve elérhető a File Transfer Application is.
    Hiszen ha kialakítottunk egy MQ vonalat, miért ne vihetnénk át
    egyszerűen fájlokat is át. Ezt megtehetjük GUI felületen a mqftapp
    használatával, de akár parancssorból is a mqftsnd, mqftrcv
    parancsokkal.
-   Létezik egy trace route utility (dspmqrte), mellyel végig lehet
    követni egy üzenet útját, csak a legutolsó művelet visszavonásra
    kerül, így az alkalmazások nem veszik észre ezt a speciális
    üzenetet. Ez könnyen elemezhető szöveges formában írja ki a
    különböző aktivitásokat, azon belül pedig az operációkat. A
    WebSphere MQ Explorer-ből az MS0P SupportPacs telepítése után
    használhatjuk.
-   Amennyiben hiba keletkezik, érdemes benézni az errors könyvtárba. Az
    itt található log állományok egyszerű szöveges állományok. Belső
    hiba esetén FFST (first failure support technology) ún. FDC
    állományokat generál, melyre az errors log is hivatkozik. Trace-elni
    is lehetséges (strmqtrc, endmqtrc, dspmqtrc), de ezt igazából már
    tényleg csak akkor használjuk, ha a support kéri.

Amennyiben Java EE-ből akarjuk használni a JMS-t, nem érdemes beégetni a
sorkezelő elérési paramétereit, sőt még konfigurálhatóvá tenni sem,
hanem ezt oldja meg az alkalmazásszerver. Ezt megoldhatjuk úgy, hogy a
JNDI fájába bejegyezzük az ún. administered object-eket, ilyen a
Connection Factory és a Destination. A Connection Factory, mint a neve
is mutatja, a kapcsolódási beállításokat tartalmazza, és ennek
segítségével lehet konkrét kapcsolatokat kiépíteni, míg a Destionation a
sorok és témák reprezentációja. JNDI-be bejegyezni egyeket az
objektumokat a JMSAdmin utility segítségével is lehet, ekkor a
classpath-ba be kell állítani a Connection Factory osztályt, és meg kell
adni a JNDI url-jét.

Tomcat esetén ez máshogy történik. Első lépésként a következő JAR
állományokat kell bemásolni a Tomcat lib könyvtárába: com.ibm.mq.jar,
com.ibm.mqjms.jar, connector.jar, jms.jar. Ezen kívül a server.xml-be
fel kell venni a Connection Factory-t és a Destination-öket a
GlobalNamingResources tag alá.

{% highlight xml %}
<Resource
name="MyConnectionFactory"
auth="Container"
type="com.ibm.mq.jms.MQQueueConnectionFactory"
factory="com.ibm.mq.jms.MQQueueConnectionFactoryFactory"
description="JMS Queue Connection Factory"
HOST="jtechlog.hu"
PORT="1414"
TRAN="1"
QMGR="MY_QM"        
CCS="437"
/>
{% endhighlight %}

A TRAN a TRANSPORT, ami lehet BIND, CLIENT és DIRECT a dokumentáció
szerint. A dokumentációval ellentétben itt azonban csak számot lehet
megadni, az 1 a CLIENT transport-ot adja meg. A CSS a character code
set.

{% highlight xml %}
<Resource
name="MyQueue"
auth="Container"
type="com.ibm.mq.jms.MQQueue"
factory="com.ibm.mq.jms.MQQueueFactory"
description="JMS Queue"
QU="MY_Q"
TC="1"/>
{% endhighlight %}

A TC a TARGCLIENT, ami megadja, hogy JMS-sel kapcsolódó kliensnek, vagy
egyéb kliensnek akarunk üzenetet küldeni. A TC=1 azt mondja, hogy nem
JMS-es kliensnek, így nem rak az üzenetbe JMS fejléc információkat.

Ekkor a context.xml-ben vegyük fel az erőforrás linkeket.

{% highlight xml %}
<ResourceLink global="MyConnectionFactory" name="jms/MyConnectionFactory" type="javax.jms.QueueConnectionFactory"/>
<ResourceLink global="MyQueue" name="jms/MyQueue" type="javax.jms.Queue"/>
{% endhighlight %}

Ezek után az alkalmazásból egyszerű JNDI lookup-pal lekérhető a
java:/comp/env/jms/MyConnectionFactory és java:/comp/env/jms/MyQueue
neveken.

A cikk írásakor [jelent
meg](http://www-01.ibm.com/common/ssi/cgi-bin/ssialias?infotype=an&subtype=ca&supplier=897&letternum=ENUS209-245)
a 7.0.1-es verzió.
