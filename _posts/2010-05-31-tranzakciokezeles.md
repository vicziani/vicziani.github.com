---
layout: post
title: Tranzakciókezelés EJB 3 és Spring környezetben
date: '2010-05-31T23:10:00.007+02:00'
author: István Viczián
tags:
- Java EE
- EJB
- Spring
modified_time: '2021-01-04T10:00:00.000+01:00'
---

Technológiák: Spring, Java EE, EJB
Utolsó módosítás dátuma: 2021. január 04.

Az előző posztban említett *Spring In Action* könyv olyan szépen tárgyalta
a tranzakciókezelést, hogy muszáj írnom egy kicsit. Ebben a posztban
csupán megpróbálom összegyűjteni a és megnevezni a fogalmakat,
összehasonlítani a Spring és EJB technológiát, nem célom a részletes
bemutatás.

Először is definiálni kell a tranzakció fogalmát. Nagyon fontos, hogy
tranzakció bár először adatbáziskezelő rendszerekben terjedt el, ma már
egyéb rendszerek is ismerik a tranzakció fogalmát, mint pl. message
oriented middleware (Java környezetben JMS provider). Ezeket tehát a
továbbiakban *erőforráskezelőknek* fogom nevezni. A tranzakció logikailag
összetartozó, és egy egységként kezelt műveletsor. A műveletsor több
lépésből is állhat, de ezek összetartoznak, azaz vagy mindnek le kell
futnia (*commit*), vagy egyiknek sem (*rollback*). Ezzel egyrészt
biztosítható az adatbázis konzisztencia (ellentmondás mentesség), és
eszköze a párhuzamos kiszolgálásnak is. A tranzakciónak rendelkeznie
kell az *ACID* tulajdonságokkal, mely betűszó feloldása: Atomic
(atomicitás), consistent (konzisztencia), izolated (izoláció), durable
(tartósság). Az atomicitás azt jelenti, hogy a tranzakcióba tartozó
minden műveletet el kell végezni, vagy egyiket sem. A konzisztencia
jelentése, hogy az adatoknak a tranzakció után ellentmondás menteseknek
kell maradniuk. Az izoláció szerint minden tranzakciónak úgy kell
lefutnia, mintha egyedül lenne. A tartósság biztosítja, hogyha a
tranzakció befejeződött, annak kifejtett hatása már nem "veszhet el".

Az unalomig emlegetett példa az átutalás, mikor az egyik bankszámláról
pénzt emelünk le, és a másikra jóváírjuk, ugye nem jó, ha bármelyik
művelet is "elveszik". (Egyszer hallottam, hogy a banknál a
programozóknak nem szabad hinniük a tranzakciókezelésben, és úgy kell a
programot megírniuk, a műveleteket sorba állítaniuk, hogyha nem működik
a tranzakciókezelés, és az egyik művelet végrehajtódik, és a másik nem,
akkor ez csak úgy történhessen, hogy a banknak legyen jó.)

Az izolációnál kell megemlíteni, hogy a probléma abból adódhat, hogyha
párhuzamosan történnek a módosítások. Ekkor a következő problémák
merülhetnek fel. Piszkos olvasásnak (*dirty read*) nevezzük, ha egy
tranzakció által módosított, de még jóvá nem hagyott adatot olvas ki egy
másik tranzakció. A megismételhetetlen olvasás (*non-repetable read*) az
jelenti, hogy kétszer olvasunk ki egy adatot, de másodjára más eredményt
kapunk, ugyanis egy másik jóváhagyott tranzakció módosította azt. A
fantom olvasás (*phantom read*) az előbbi egy speciális esete, mikor
kétszer olvasunk ki adatokat, de másodjára már több eredményt kapunk,
ugyanis egy másik jóváhagyott tranzakció új adatot vitt fel. Ezen
problémák megoldására vezették be az *izolációs szinteket*, melyeket az
adatbáziskezelők biztosítják (nem mindegyik adatbáziskezelő ismeri
mindegyik izolációs szintet, és a default izolációs szintek is
eltérhetnek), és programból lehet állítani, akár tranzakciónként. A read
uncommitted izolációs szint esetén a tranzakció hatása már a tranzakció
közben látszik másik tranzakciónál. A többi izolációs szint mindegyike
megoldja a soron következő izolációs problémát. A *read commited*
izolációs szint megoldja a dirty readet, csak a jóváhagyott
módosításokat látja a másik tranzakció. A *repeatable read* garantálja,
hogy egy sort a tranzakció közben újraolvasva ne változzon. A
*serializable* a tranzakciókat sorosítja, így megszünteti az összes
párhuzamosságból adódó problémát. De miért is nem állítjuk a legmagasabb
izolációs szintet be, hogy ne legyen problémánk? Azért, mert ahogy
növeljük az izolációs szintet, úgy lassulhat be a kiszolgálás sok
párhuzamos kérés esetén.

A tranzakciókezelésnél először meg kell különböztetni a lokális és a
globális tranzakció (vagy más néven *elosztott tranzakció*) fogalmát. A
lokális tranzakció, mikor egy erőforráskezelőn belül akarunk tranzakciót
végezni. A globális/elosztott tranzakciók esetén egy tranzakció több
erőforráskezelőn is átívelhet, pl. két adatbázison, vagy egy
tranzakcióban akarunk pl. egy adatbázis sort módosítani, és egy JMS üzenetet
elküldeni.

Ezen fogalmakat amúgy minden Java EE könyv, így a magyar nyelven elérhető
*Szerk: Imre Gábor - Szoftverfejlesztés Java EE platformon* című könyv is
részletesen leírja.

Természetesen mind az EJB, mind a Spring támogatja a tranzakciókezelést,
méghozzá mindkettő kétféleképpen. Adott a *programozott
tranzakciókezelés*, mikor a fejlesztőnek kell meghívni a commit vagy
rollback műveleteket, de lehetőség van *deklarativ tranzakciókezelésre*
is, mikor a fejlesztő csak deklarálja a tranzakciókat, megszabja, hogy
hol induljon a tranzakció és hol fejeződjön be (transaction demarcation,
transaction boundaries), a tranzakciókezelést maga a környezet végzi.

EJB és Spring esetén is használhatunk lokális és elosztott tranzakciókat
is. Elosztott tranzakciók használata a JTA API használatával
történik, és szükség
van egy tranzakció koordinátorra. Az alkalmazásszerverek
beépítetten tartalmaznak egyet, Spring esetén pedig külső függőségként
kell egy beágyazható tranzakció koordinátort felvenni. 

A Java EE 6-os verziójáig csak EJB-kben lehetett
tranzakciót kezelni.
Az első EJB hívás alapértelmezetten 
mindig indít egy tranzakciót.
Az
alapértelmezett a Container-Managed Transaction (CMT), azaz deklaratív
tranzakciókezelés, és érdemes mindig ezt is használni. A
tranzakciókat az alkalmazásszerverben implementált Java EE transaction
manager vezérli. Deklaratív esetben
a tranzakciókezelés személyreszabására annotációkat, pl. a 
`@javax.ejb.TransactionAttribute` annotációt használhatjuk. Ez esetben is megjelöletjük
visszagörgetésre a tranzakciót az `EJBContext.setRollbackOnly()` metódussal.
Lekérdezni ennek tényét a `getRollbackOnly()` metódussal tudjuk. Az
`EJBContext` példányhoz dependency injectionnel jutunk (`@Resource`).
A programozott tranzakciókezelést (Bean-Managed
Transaction (BMT)) a
`@TransactionManagement(TransactionManagementType.BEAN)` annotációval,
vagy a vele ekvivalens deployment descriptor beállítással
(`<transaction-type>BEAN</transaction-type>`) adhatjuk meg.
Ez esetben az `EJBContext`
`getUserTransaction` metódusa által visszaadott `UserTransaction` példány
`begin()`, `commit()` és `rollback()` metódusait hívhatjuk.

A Java EE 7-es verziójától kezdve azonban minden CDI beanen
használhatjuk a `@javax.transaction.Transactional` annotációt, mely annotáció a JTA része.
Ettől a verziótól kezdve javasolt ezt az annotációt használni, és nem az EJB
szabványban lévőt.

Spring környezetben egy transaction manager áll a háttérben, melyből több mint tíz áll
rendelkezésre, köztük a `DataSourceTransactionManager`,
`JpaTransactionManager`, vagy a `JtaTransactionManager`.
Springben is javasolt a deklaratív tranzakciókezelés a 
Spring
saját `@org.springframework.transaction.annotation.Transactional` annotációjának
használatával.
Régebbi Springes projektekben beállíthatjuk a tranzakciókezelést a 
`TransactionProxyFactoryBean` használatával vagy
AOP-vel. Ez utóbbi esetben is van választási lehetőségünk, használhatjuk
az `applicationContext.xml`-ben a `tx` névtérrel a Spring 2.0-ás
konfigurációs elemeket, mint `tx:advice`, `tx:attributes`, `tx:method`.
A programozott tranzakciókezelés a `TransactionTemplate`-tel történhet.

A *Spring In Action* könyvben van egy nagyon szemléletes ábra, hogy mire
kell figyelni a deklaratív tranzakcióknál.

![Tranzakciókezelés tulajdonságai](/artifacts/posts/2010-05-31-tranzakciokezeles/tranzakcio-kezeles1.png)

Az izolációt már említettem az izolációs szinteknél. A JSR 220:
Enterprise JavaBeans, Version 3.0 - EJB Core Contracts and Requirements
specifikáció 13.3.2-es fejezete (324. old.) írja, hogy az izolációs
szint beállítása az adott erőforráskezelőre jellemző, annak API-ja
definiálja, így az EJB szabvány nem foglalkozik vele. A
`java.sql.Connection` osztálynak van pl. `setTransactionIsolation(int
level)` metódusa.

A Spring ezzel szemben a `TransactionDefinition` interfészben definiálja
az izolációs szinteket az `ISOLATION` prefixszel rendelkező
konstansokban. Ezt meg lehet adni paraméterül a 
`@Transactional` annotáció `isolation` attribútumának. Régebbi Springes projekt esetén
a `TransactionProxyFactoryBean` `transactionAttributes` attribútumának, vagy a
`tx:method` konfigurációs elem `isolation` tulajdonságának.

A következő tulajdonság a read-only tulajdonság. Ezt csak a Spring
definiálja, és ezt állítsuk `true`-ra csak olvasást végző műveleteknél, ha
azt akarjuk, hogy bizonyos optimalizációkat elvégezzen az
erőforráskezelő. Pl. Hibernate esetén a flush mode-ot `FLUSH_NEVER`-re
állítja, ami azt jelenti, hogy a session állapotát, azaz a perzisztens
példányokat nem írja ki az adatbázisba, tehát nem hívja meg a `flush()`
metódust. Ez csak olvasást végző tranzakcióknál sebességet növelhet.
Ugyan a `javax.sql.Connection` osztálynak is van `setReadOnly(boolean readOnly)` metódusa, 
azonban máshogy valósíthatják meg a különböző
adatbázis driver-ek. Az Oracle JDBC driver pl. abszolút nem valósítja
meg ezt a metódust.

A következő az időtúllépés (timeout). Az EJB 3.0 szabvány 
deklaratív esetben nem definiál erre megoldást, viszont az alkalmazásszerver
gyártóknak van saját megoldásuk. Általában több helyen lehet megadni a
timout értékét. Meg lehet adni globálisan valamilyen konfigurációs
állományban, vagy meg lehet adni beanre is. Ekkor vagy gyártófüggő
deployment descriptorba kell írnunk valamit, vagy saját annotáció is
létezhet rá. Pl. JBoss esetén a `jboss-service.xml`-ben kell keresni
vagy használható a `@TransactionTimeout`.

Programozott tranzakciókezelés esetén biztosítja a
`UserTransaction.setTransactionTimeout(int seconds)` metódust. 

A Spring erre biztosít lehetőséget a `@Transactional` annotáció `timeout`
attribútumának használatával. Régebbi Springes projekt esetén a `TransactionProxyFactoryBean`
`transactionAttributes` attribútumának, vagy a `tx:method` konfigurációs
elem timeout tulajdonságának használatával állíthatjuk be.

A következő tulajdonság a propagáció, melynek a deklaratív
tranzakciókezelésnél van értelme, hiszen a propagációs tulajdonságokkal
adhatjuk meg egy metódusra, hogy hogyan vegyen részt egy tranzakcióban.

![Tranzakció propagáció UML szekvencia diagram](/artifacts/posts/2010-05-31-tranzakciokezeles/seq-diagram.png)

Először nézzünk egy egyszerű esetet, mikor is egy kliens meghívja a
`Bean1` beanünk üzleti metódusát, ami meghívja a `Bean2` beanünk üzleti
metódusát. A tranzakciókezelés deklaratív, és a tranzakciókezelést az
inversion of control miatt nem a beanek végzik, hanem pl. proxy
objektumok, melyek a beanek előtt helyezkednek el. Amikor a `Bean1`
metódusát meghívjuk (proxy-n keresztül), a proxy észleli, hogy nincs
tranzakció, ezért indít egyet. Majd meghívja a `Bean1` beanünk metódusát,
ami szintén proxy-n keresztül meghívja a `Bean2` beanünk metódusát. Itt a
proxy észleli, hogy már van nyitott tranzakció, így csatlakozik ehhez,
majd meghívja a `Bean2` beanünk metódusát (delegáció). Visszatéréskor a
`Bean2` proxy továbbengedi a visszatérési értéket, de a `Bean1` proxy
észleli, hogy ő nyitotta a tranzakciót, és ezért neki is kell valamit
kezdenie vele, alapesetben így ő fogja a commit műveletet elvégezni. Ez
az alapértelmezett működési mód, mely a legtöbb esetben elegendő nekünk,
és ezt hívják `REQUIRED` propagációs attribútumnak.

Azonban vannak más tranzakciós attribútumok is, összegezve:

* `REQUIRED` (default): ha nincs tranzakció, indít egyet, ha van
    csatlakozik hozzá
* `REQUIRES_NEW`: mindenképp új tranzakciót indít
* `SUPPORTS`: ha van tranzakció, abban fut, ha nincs, nem indít újat
* `MANDATORY`: ha van tranzakció, abban fut, ha nincs, kivételt dob
* `NOT_SUPPORTED`: ha van tranzakció, a tranzakciót felfüggeszti, ha
    nincs, nem indít újat
* `NEVER`: ha van tranzakció, kivételt dob, ha nincs, nem indít újat

A tranzakciós attribútumot CDI esetén a `javax.transaction.Transactional`
annotáció `value` attibútumaként adhatjuk meg, mely a `TxType` enum
egy elemét veheti fel.

Az EJB szabványon belül maradva a tranzakciós attribútumot az EJB-ben deployment descriptorban vagy a
`@javax.ejb.TransactionAttribute` annotáció attribútumaként is meg lehet adni.

Springben a `@Transactional` annotáció `propagation`
attribútumának lehet megadni. Az EJB-hez képesti különbség annyi, hogy a
nevek elé elé kell tenni a `PROPAGATION` prefixet is.

Régebbi Springes projekt esetén a `TransactionProxyFactoryBean` `transactionAttributes`
attribútumának, vagy a `tx:method` konfigurációs elem `propagation`
tulajdonságaként adhatjuk meg.

A `REQUIRED`-en kívül a többit ritkán használjuk. A `REQUIRES_NEW` akkor
jöhet jól, mikor egy olyan műveletet akarunk futtatni, aminek
mindenképpen le kell futnia, a hívó tranzakció rollbackje esetén is.
Gondoljunk el pl. egy audit naplózást. Az nem lehet, hogyha a művelet
rollbackre fut, akkor a naplózás sem történik meg. A többi attribútumra
már csak nagyon mondvacsinált példákat tudok hozni. A `SUPPORTS` read-only
műveleteknél jó, mert ha nem jön tranzakció, akkor nem indít újat
feleslegesen. A `MANDATORY`-t akkor használjuk, ha biztosak akarunk lenni
abban, hogy egy rollback visszahat a hívó félre. A `NOT_SUPPORTED` akkor
használható, ha pl. EJB környezetben az MDB-nk nem tranzakcionálisan
kapcsolódik a JMS providerhez. A `NEVER`-t használhatjuk akkor, ha nem
tranzakcionális erőforrást piszkálunk, és tudatosítani akarjuk a hívó
félben, hogy itt ne is számítson tranzakcionális működésre.

A leggyakoribb hiba a tranzakciós attribútumokkal kapcsolatban, hogy van
egy osztályon belül két metódus, ahol az egyik hívja a másikat, és más a
tranzakciós attribútumuk. Normál esetben ugyanis azt tapasztaljuk, hogy
a második metódus tranzakciós attribútuma hatástalan. Ez azért van, mert
az egy példányon belüli hívás nem megy át a proxy-n, így nem tudja
kezelni a tranzakciós attribútumot, tehát mintha ott sem lenne. A
megoldás, hogy a hívást mindenképp átvezetjük valahogy a proxy-n. Vagy
átszervezzük a kódot, és a két metódust külön bean-be tesszük. EJB
esetén pl. a `SessionContext.getEJBObject()` metódus adja vissza a proxy
objektumot. Spring esetén három megoldás közül is választhatunk. Vagy az
`ApplicationContext`-től a `getBean()` metódussal név alapján lekérjük a proxy
példányt, vagy az `AopContext.currentProxy()` metódusát hívjuk, de
mindkettővel kötjük magunkat a Springhez. A harmadik megoldás az
AspectJ weaving használata, mikor nem proxy végzi a tranzakciókezelést,
hanem maga az objektum, ugyanis az AOP ekkor nem proxy-val valósul meg,
hanem bytecode buherálással.

Az utolsó tulajdonság a visszagörgetési szabályok alkalmazása kivétel
esetén, deklaratív környezetben. Az EJB-ben a következőképpen működik.
Megkülönböztetünk rendszerszintű kivételeket (`RuntimeException` és
`RemoteException` vagy leszármazottai), és alkalmazásszintű kivételeket
(többi). Rendszerszintű kivételek esetén mindig rollback van, alkalmazás
szintű kivételeknél commit, kivéve, ha meghívtuk a cache ágban a
`EJBContext.setRollbackOnly()` metódust, vagy saját kivétel esetén
rátettük a `@ApplicationException(rollback = true)` annotációt, mert
ilyenkor itt is rollback lesz.

A JTA `@Transactional` annotációjának használata esetén ezt
felülbírálhatjuk a `rollbackOn` és `dontRollbackOn` attribútumok használatával,
melyeknek kivétel osztályokat adhatunk meg értékként.

Spring esetében az alapértelmezett működés, hogy `RuntimeException` és
leszármazottja esetén rollback, amúgy commit (az EJB-vel megegyező
módon). 

A `@Transactional` annotációnál `rollbackFor` attribútummal felsorolhatjuk a metódusnál azokat a
kivételeket, melyekre rollbacket akarunk, és
`noRollBackFor` attribútummal azon kivételeket, ahol ne történjen
rollback. Azaz így meg tudunk adni metódusonként olyan `RuntimeException`
leszármazottakat, amire ne legyen rollback, és olyan alkalmazás szintű
kivételeket, melyekre rollback legyen.

XML-ben ezek a `rollback-for` és `no-rollback-for` attribútumokkal szabályozhatók.

És végezetül egy saját probléma megoldása. Szükségünk volt a Spring-ben
több tranzakció menedzserre, adatforrásonként egyre. A Spring 2.5 esetén
nem lehetett megadni, hogy az annotációval jelölt beaneknél melyik
tranzakciómenedzser legyen a nyerő, hanem globálisan lehetett csak
megadni. Ezért a beanek egyik felét XML-ben, a másik felét `@Transactional`
annotációval konfiguráltuk (persze lehetett volna mindet XML-lel is. A
Spring 3 egyik újdonsága, hogy a `@Transactional` annotációnak a `value`
attribútumában meg lehet adni, hogy melyik tranzakciómenedzsert
használja.

További források:

-   [Spring AOP top problem \#1 - aspects are not
    applied](http://blog.harmonysoft.tech/2009/07/spring-aop-top-problem-1-aspects-are.html)
