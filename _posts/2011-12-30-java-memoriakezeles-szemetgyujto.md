---
layout: post
title: Java memóriakezelés, szemétgyűjtő algoritmusok
date: '2011-12-30T02:10:00.018+01:00'
author: István Viczián
tags:
- hotspot
- jvm
modified_time: '2014-02-02T16:24:41.207+01:00'
---

Technológiák: Java Development Kit 1.6

A Java tervezésekor egyik legfőbb szempont a biztonság volt. Ez egyrészt
megnyilvánul abban, hogy a felhasználó tudja kontrollálni egy nem
megbízható forrásból szerzett program hozzáféréseit, másrészt támogatja
a programozókat abban, hogy minél kevesebb hibát vétsenek.

Ez utóbbi egy szelete az, hogy nem explicit kell memóriát lefoglalnunk,
és felszabadítanunk, hanem a virtuális gép megteszi ezt helyettünk.
Pontosabban a szemétgyűjtő mechanizmus (garbage collector - GC), melynek
feladata a nem használt objektumok eltakarítása a memóriaterületről. Így
sokkal kisebb a hibalehetőség, cserébe egy automatizmus szabadítja fel a
memóriát, aminek külön erőforrásra van szüksége, ami kiélezett
helyzetekben (magas terhelés esetén) akár az alkalmazás teljesítményére
is hatással lehet. A hibajelenség, amitől megszabadulunk, az a
memóriaszivárgás (memory leak). Ez gyakorlatilag akkor történik, mikor
már nincs szükségünk egy objektumra, nincs rá referencia, de a
memóriaterületet nem szabadítottuk fel. Szerencsére a szemétgyűjtő
mechanizmus megteszi ezt helyettünk.

(Zárójelben jegyzem meg, hogy Java esetén is szoktak memóriaszivárgásról
beszélni, azonban ennek kicsit más a jelentése. Ez a leggyakrabban
kollekciók használatakor szokott felmerülni. Képzeljük el, hogy egy
dinamikus méretű listát egy tömbbel ábrázolunk. Mivel a tömb mérete fix,
egy változó jelzi, hogy a tömb épp hány elemét használjuk ki. Amennyiben
töröljük az utolsó elemet, a működés szempontjából elegendő csak ennek a
változónak az értékét csökkenteni. Ekkor azonban a tömb változón felüli
eleme még tart referenciát az adott objektumra, ezért a szemétgyűjtő nem
tudja kidobni. Emiatt kell `null`-ra állítanunk a tömb megfelelő elemét.
Tipikus hiba még az eseménykezelők nem használatos objektumon tartása.)

Fontos megkülönböztetni két memóriaterület, a heap és a stack fogalmát.
A példányváltozók és az az összes példányosított objektum a heap-en
helyezkedik el. A metódusban definiált, úgynevezett lokális változók
vannak a stacken (, ide tartoznak a metódushívás aktuális paraméterei
is). Vigyázzunk, amennyiben a stacken szereplő lokális változó típusa
osztály, az osztály példánya már a heapen helyezkedik el, a stacken
kizárólag az erre mutató referencia.

Ezzel kapcsolatban párszor már találkoztam azzal a tévhittel, hogy a
Java szemétgyűjtő mechanizmusa referenciaszámláló alapján működik. Azaz
nézi, hogy egy objektumra hány hivatkozás van, és amennyiben ez nullára
csökken, az objektum eldobható a memóriából. Ez nem így van. Képzeljük
el, hogy A objektum hivatkozik B objektumra, és vissza. Amennyiben más
hivatkozás nincs rájuk, mindkettő eltávolítható, de a
referenciaszámlálója mindegyiknek egy. Ehelyett a JVM a következőképpen
működik. Az élő szálak stackjeiből elérhető objektumokat járja végig.
Ez azt jelenti, hogy végigmegy a referenciákon, azaz az objektumokból
elérhető objektumokon is. Ezeket megjelöli. (Ezen szabály alkalmazásán
kívül még végigmegy a betöltött és még nem kidobott osztályok statikus
tagjain, valamint a JNI-ből bejegyzett objektumokon is.) Eztán a nem
megjelölt objektumokat kidobja. Azaz kidobja az összes olyan objektumot
mely nem érhető el referenciákon keresztül egy élő szálból sem.

A szemétgyűjtő mechanizmus megvalósítása nem a szabvány része, ezért
különböző gyártók különbözőképpen implementálhatják azokat. Én most a
legelterjedtebb, Sun (már Oracle) által gyártott, a Java 2 Platform,
Standard Edition JDK-ban megtalálható Java HotSpot virtuális gépről
fogok írni, továbbiakban JVM. Jó referencia a [Memory Management in Java
HotSpot Virtual
Machine](http://www.oracle.com/technetwork/java/javase/tech/memorymanagement-whitepaper-1-150020.pdf)
dokumentum. A JVM-nek három fő része van: runtime, JIT, és a
memóriakezelést végző szemétgyűjtő mechanizmus.

A szemétgyűjtő mechanizmus un. weak generational hypothesisre épül.
Megfigyelték az alkalmazások működését, és a következő szabályokat
vették észre:

-   Az objektumok nagy része rövid életű
-   Régi objektumból új objektumra viszonylag kevés hivatkozás van

Ezen megfigyelések az alkalmazások nagy részére igazak, persze lehetnek
kivételek. Azaz a legtöbb alkalmazás úgy működik, hogy üzemelése közben
gyakorta nagyon rövid életű, temporális objektumot gyárt, mely igazából
csak az algoritmusok lefutásáig, a felhasználó kiszolgálásáig kellenek,
utána el is dobhatóak. Csak viszonylag kevés objektum kell hosszú távon,
és ezek utána hosszú életűek, és általában ritkán hivatkoznak újabb
objektumokra. Ezen hipotézis alapján építették fel a szemétgyűjtő
mechanizmust, és ezen szabályokkal szembe menni akár a szemétgyűjtő
működését is megzavarhatják. (Tipikus példa erre az objektum cache, mely
tipikusan a legrégebbi objektum, melybe újabb és újabb objektumok
kerülhetnek. Ezeket a szemétgyűjtő kevésbé szereti.)

A Sun mérnökei a JVM-be ráadásul nem csak egy, hanem több szemétgyűjtő
mechanizmust is építettek. Ezek közül a JVM automatikusan képes
választani, de akár explicit is megmondhatjuk, hogy melyiket használja.
Bizonyos szemétgyűjtő algoritmusok más-más alkalmazások esetén, más-más
architektúrákon különbözőképpen teljesíthetnek, így nincs mindenre jó
megoldás, nekünk kell vagy a JVM-re hagyatkozni, vagy kiválasztani, hogy
melyik a legmegfelelőbb. A választásnál a következőket kell figyelembe
venni:

-   Áteresztőképesség (throughput): a futási idő hány százalékát tölti a
    CPU az alkalmazásunk futtatásakor nem a szemétgyűjtő futtatásával
    (persze megfelelő nagy időszeletre nézve)
-   GC pluszmunka (overhead): az előző inverze, mennyi időt tölt a CPU a
    GC futtatásával az összes időhöz képest
-   Állási idő (pause time): mennyi ideig áll az alkalmazás, míg a GC
    fut
-   Szeméggyűjtő mechanizmus futtatásának gyakorisága (frequency):
    milyen gyakran fut a GC
-   Memóriaigény (footprint): az alkalmazás memóriaigénye, pl. a heap
    mérete
-   Reakcióidő (promptness): az idő aközött, amikor az objektum
    begyűjthetővé válik, és aközött, hogy a memória újra
    felhasználhatóvá válik

Ráadásul ezen mérőszámok egyikének javításakor a másik mérőszám rosszabb
lesz, hiszen ellentmondanak egymásnak. Pl. amennyiben azt akarjuk, hogy
kevesebbet álljon az alkalmazás, pl. a szemétgyűjtő több szálon
dolgozzon, akkor a szálak adminisztrációja megnövekedett
erőforrásidénnyel (mind CPU, mind memória) jár.

Ahhoz, hogy megértsük a szemétgyűjtők működését, először meg kell
értenünk a JVM memóriamodelljét. Talán legjobb vizuálisan szemléltetni.
Az alábbi ábrára klikkelve bejön egy VisualVM-ben futó Visual GC plugin
alapján készített GIF animáció, melyen egy JBoss alkalmazásszervert
látunk futni. A VisualVM a JDK-ban megtalálható, a `jvisualvm` paranccsal
indítható. A VisualGC plugin a Tools/Plugins menüpontból indítva külön
letölthető. Mindkettő ingyenes, nyílt forráskódú eszköz.

![Visual GC plugin egy JBoss futtatása
közben](/artifacts/posts/2011-12-30-java-memoriakezeles-szemetgyujto/visualgc_gifanim.gif)

A Spaces ablakban a JVM heapje látható, ami három részre van felosztva:
permanent generation (permgen), young és old. A permgen memóriaterületen
helyezkednek el a betöltött osztályok definíciói, valamint a String pool
(un. Interned Strings). A young területen (un. generation) helyezkednek
el a fiatal objektumok, és az old területen helyezkednek el az idősebb
objektumok (az előbb említett hipotézis miatt van ez a megbontás). A
szemétgyűjtő mechanizmus mindkét területen lefut, de meg kell
különböztetni ezeket. Tehát gyakran lefut az un. minor szemétgyűjtő,
mely csak az young generationön dolgozik, és ritkábban a major/full
szemétgyűjtő, ami az old generationön is lefut. Ez ritkábban fut,
hiszen lassabban nő, és tovább tarthat, hiszen nagyobb területet kell
átvizsgálnia a szemétgyűjtőnek.

A young generation három részből áll: eden, survivor 0, survivor 1. A
frissen példányosított objektumok először az edenre kerülnek, amikor
lefut rajtuk a szemétgyűjtő mechanizmus, és túlélnek (nem kerülnek
eldobásra, élő objektumok), akkor kerülnek a survivor (túlélő) egyikére.
Egyszerre mindig csak az egyik használt a survivorök közül. Amikor
lefut a szemétgyűjtő, az a használt survivorön is lefut, és a túlélő
objektumok átkerülnek a másik survivor területre. Az előző survivor
tehát teljesen üres marad. Utána a szemétgyűjtő ismételt lefutásakor a
fordított irányban vándorolnak a túlélő objektumok a survivorök között.
Amennyiben az objektum túlélése elért egy megfelelő számot, átkerül az
old generationbe.

A [Garbage Collection in the Java HotSpot Virtual
Machine](http://www.devx.com/Java/Article/21977) cikk ábráit
használva a következő lépésekből áll tehát a young generationön a
szemétgyűjtés. Az eden és az egyik survivor területen is gyűltek az
objektumok.

![Mark-sweep-compact algoritmus első
lépése](/artifacts/posts/2011-12-30-java-memoriakezeles-szemetgyujto/yg_1.png)

A túlélő objektumok az edenből és az egyik survivorből is a másik
survivor területre kerülnek, valamint az egyik survivorből a bizonyos
kort megélt objektumok az old generationbe kerülnek.

![Mark-sweep-compact algoritmus második
lépése](/artifacts/posts/2011-12-30-java-memoriakezeles-szemetgyujto/yg_2.png)

A szemétgyűjtés után mind az eden, mind az egyik survivor teljesen
kiürül.

![Mark-sweep-compact algoritmus harmadik
lépése](/artifacts/posts/2011-12-30-java-memoriakezeles-szemetgyujto/yg_3.png)

Ha megnézünk egy más parancssori paraméterekkel indított JVM-et (a JDK
`demo/jfc/Java2D` könyvtárában a Java2D-t demonstráló példaprogramot a
`java -jar Java2Demo.jar` paranccsal elindítva) kicsit más
karakterisztikát láthatunk, de a működés alapvetően hasonlít. Itt
megjelent egy Histogram nevezetű ablak, mely százalékosan mutatja a
young generation objektumait, hogy hány százaléka hány szemétgyűjtést
élt túl. Az ábrán a Tenuring threshold azt jelenti, hogy 15
szemétgyűjtés túlélése után kerül az objektum az old generation-be.

![Visual GC a Java2Demo futtatása
közben](/artifacts/posts/2011-12-30-java-memoriakezeles-szemetgyujto/visualgc.png)

Vizsgáljuk meg az első ábrát, az talán látványosabb. Egyrészt kevésbé
észrevehető, hogy a Spaces ablakban a háttér világosabb és sötétebb
szürke négyzetekkel van behálózva. A sötétszürke a ténylegesen lefoglalt
memóriát (utilized, commited), míg a világosabb szürke a JVM által
lefoglalható, de még nem lefoglalt memóriát jelzi (uncommited). A
konkrét értékek látszanak a Graphs ablakban is. Látható, hogy a young
generation esetén az edenben lévő objektumok összmérete folyamatosan
nő, mígnem a GC grafikonon látjuk, hogy lefut egy szemétgyűjtés (zöld
tüske), és ekkor az eden kiürül. Ezzel egy időben azt is látjuk, hogy a
túlélő objektumok az egyik survivorből átkerülnek a másikba, nagyon
szépen látható a narancs grafikonon, hogy egyszerre csak az egyik
használt, és mérete nem változik, csak a szemétgyűjtés lefutásakor. Egy
normál működésű szerver alkalmazásnál ha ilyen szép fűrészfoggal
találkozunk, akkor megnyugodhatunk. Amennyiben a fogak túl sűrűek, ott
baj lehet, hiszen a GC-nek gyakran kell futnia, ez egyrészt gyakrabban
állítja le az alkalmazást, másrészt több erőforrást is igényel.
Amennyiben a szemétgyűjtő lefutása után nem esik vissza a
memóriahasználat, akkor is baj van, mert akkor valószínű, hogy
memóriaszivárgásunk van. A permgen mérete általában állandó, vagy nagyon
lassan növekszik. Ha az telik be, akkor találkozhatunk a
java.lang.OutOfMemoryError: PermGen space hibával. Ez általában akkor
van, amikor újratelepítgetünk egy alkalmazást az alkalmazásszerveren, és
valami osztálybetöltő probléma miatt az előző alkalmazásunkat a konténer
nem tudja kidobni, így annak class-ai is a permgen-en maradnak. Ami egy
idő után, bizonyos számú telepítés után elfogyhat.

Amennyiben az egyik survivor betelne, az ide kerülendő objektumok
automatikusan az old generationbe kerülnek átmásolásra. Ezt a
hibajelenséget premature promotionnek nevezik. Amennyiben emiatt
betelik az old generation is, és le kell futtatni a GC-t, promotion
failure-nek nevezik.

Amennyiben elfogy a memória, az `OutOfMemoryError`-t kapjuk. Jegyezzük meg
azonban, hogy a JVM garantálja, hogy csak akkor dobja, ha a GC lefutott,
és ezután nincs szabad memória. Azaz a szemétgyűjtőt mindenképpen
meghívja. Emiatt sem érdemes kezelni catch ágban az `OutOfMemoryError`-t.
És azért sem, mert ilyenkor már arra sem lesz memória, hogy kezeljük.

A memóriakezelésben találunk még egyéb finomságokat, amiket érdemes
megjegyezni. Egyrészt úgy kéne kiválogatni a young generationből azokat
az objektumokat (mark), melyek használtak, hogy ne kelljen az egész old
generationt átvizsgálni, hogy nincs-e visszafele hivatkozás. Ehhez a
garbage collector egy card table-t tart nyilván. Az old generationt 512
bájtos darabokra bontja (chunks), és mindegyikhez egy flaget társít.
Amennyiben az old genben egy objektum referálni kezd egy young genben
lévő objektumra, a beállító művelet a hozzá tartozó flaget is (egy un.
write barrieren keresztül) átbillenti. A végén csak a billentett
flaggel rendelkező old genben lévő objektumokkal kell törődni.

Másik érdekes technika a gyors memóriafoglaláshoz szükséges. A JVM egy
bump-the-pointer mechanizmust alkalmaz, ami egy mutatót használ annak a
memóriahelynek a megjelölésére, ahova az új objektumot el lehet tenni.
Elteszi az objektumot, majd feljebb emeli a pointert. Azonban
többszálas környezetben ez macerás lehet, hiszen szinkronizálni kéne
erre a mutatóra, és ott szűk keresztmetszet lehet. Ezért a JVM un.
Thread-Local Allocation Buffereket (TLAB-ok) tart fenn szálanként. Ezek
gyakorlatilag szálanként különböző memóriaterületek, így nincs szükség
lockra.

Ahhoz, hogy megértsük, mikor melyik szemétgyűjtő fut, valamint hogyan
lehet bekapcsolni őket, beszélni kell a parancssori kapcsolókról,
valamint az ergonomicsról.

A parancssori kapcsolóknak három fajtája van. A standard, non-standard
(`-X` kapcsolóval kezdődnek) és a developer (`-XX:` kapcsolóval kezdődnek).
A szabványos kapcsolókat a Java Virtual Machine Specification
definiálja. Az utóbbi két kapcsoló nem szabványos, JVM-enként mások
lehetnek. Minden további nélkül változhat a működésük különböző JDK
verziók között, tehát mindig érdemes figyelni a release notesokat. A
developer kapcsolók felépítése a következő. Minden paraméternek van egy
típusa, általában boolean vagy int. Amennyiben boolean, a paraméter neve
előtt + vagy - karakterrel lehet be vagy kikapcsolni (pl.
`-XX:+UseSerialGC` a serial collector bekapcsolására). Amennyiben int, a
paraméter neve után kell írni, egyenlőségjellel elválasztva, és gyakran
egy mértékegységet is írhatunk utána (pl. `-XX:NewSize=64m`, amivel az új
generáció kezdeti és minimális méretét állítjuk 64 megára). A
paraméterek rendelkeznek valamilyen default értékkel. A developer
paraméterek egy listája a [Java HotSpot VM
Options](http://www.oracle.com/technetwork/java/javase/tech/vmoptions-jsp-140102.html)
címmel található az Oracle oldalán.

A JDK az 1.5 verziótól kezdve felismeri az alatta lévő architektúrát, és
két osztály egyikébe sorolja, vagy kliens osztályú, vagy szerver
osztályú gépek csoportjába. A JDK 6-ban a detektálásról JDK
dokumentációjának [Server-Class Machine
Detection](http://docs.oracle.com/javase/6/docs/technotes/guides/vm/server-class.html)
fejezete ír. Alapvetően a legalább 2 CPU-val (maggal) és legalább 2 GB
memóriával rendelkező nem Windows-os gépeket soroljuk ide. Az osztályt
explicit is meg lehet adni a `-client` vagy `-server` parancssori kapcsolók
megadásával. Az ergonomics másik része, hogy a egyrészt az osztály
alapján választ szemétgyűjtő mechanizmust, valamint a megadott
paraméterek alapján automatikusan finomhangolja a heap memóriaterületek
méretét, nem nekünk kell megadni azokat. Erről a JDK dokumentációjának
[Garbage Collector
Ergonomics](http://docs.oracle.com/javase/6/docs/technotes/guides/vm/gc-ergonomics.html)
fejezete ír. Ha egyéb kapcsolót nem adunk meg, kliens osztályú gép
esetén client JVM fut, serial collector (lsd. később), 4 mega kezdeti
heap méret, és 64 mega maximum heap méret. Szerver esetén a kezdeti heap
méret a fizikai memória hatvannegyede, minimum 32 mega, maximum 1 giga.
Maximum heap méret a fizikai memória egynegyede, maximum 1 giga.

És akkor következzenek a szemétgyűjtő mechanizmusok, a következő
sorrendben:

-   Serial Collector
-   Parallel/Throughput Collector
-   Parallel Compacting Collector
-   Concurrent Mark-Sweep (CMS) Collector

### Serial Collector

A serial collector esetén a young és az old terület szemétgyűjtése is
egy szálon történik, un. stop-the-world módon. Ez azt jelenti, hogy a
JVM az alkalmazást teljesen leállítja, amíg a szemétgyűjtés folyik. Ez
valójában úgy történik, hogy az összes Java szálat leállítja (un.
safepoint), hogy ne változzon a heap, sem a szálhoz tartozó stack.
Érezhető, hogy ez a megállás gyakorlatilag a szemétgyűjtéses
megközelítés legnagyobb hátránya. Ez normális működés esetén
észrevehetetlen, de nagy terhelés, intenzív memóriahasználat, sok
párhuzamos felhasználó esetén már nagyban ronthatja az alkalmazásunk
teljesítményét. A young generation szemétgyűjtése a fentebb leírt módon
történik, azaz a túlélő objektumok a survivorre, majd az old generation
területre kerülnek. Az old generation és permanent generation
szemétgyűjtése un. mark-sweep-compact algoritmussal történik. Mark
fázisban a szemétgyűjtő megjelöli az élő objektumokat, a sweep fázisban
kitakarítja a nem élő objektumokat, és a compact fázisban az élő
objektumokat a megfelelő memóriaterület elejére tolja. Így a
memóriaterületen nem lesznek lyukak, az elején lesznek az élő
objektumok, a végén az üres hely. Így használható a fentebb említett
bump-the-pointer mechanizmus. Ezt használva nem jelentkezik a memória
töredezettsége, melyet később részletezek.

A serial collector általában remek választás kliens oldali alkalmazások
esetén, akár egy 64 megás heap esetén is viszonylag ritka és rövid (\<
0,5 mp) leállásokkal jár. Ez felhasználói felületekkel rendelkező, egy
felhasználót kiszolgáló alkalmazások esetén megfelelő. Akkor is jól
jöhet, ha több JVM osztozik egy processzoron, hiszen ekkor úgysem tud
párhuzamosan futni a szemétgyűjtés a processzorok kihasználtsága miatt,
ugyanis a többi algoritmus valahogy párhuzamosítani próbál. A serial
collector az alapértelmezett a nem szerver-osztályú gépek esetén. Egyéb
esetben a `-XX:+UseSerialGC` parancssori kapcsolóval lehet bekapcsolni.

### Parallel/Throughput Collector

A parallel/throughput collector annyival másabb, mint a serial
collector, hogy a young generation szemétgyűjtése nem egy szálon, hanem
több szálon fut. De ugyanúgy megállítja a többi szálat, és másolja az
objektumokat a memóriaterületek között. Az old generation szemétgyűjtése
megegyezik a serial collector szemétgyűjtésével, ami a
mark-sweep-compact algoritmus. Ennek a szemétgyűjtőnek használatát több
processzor(mag) kihasználására tervezték, és ott érdemes alkalmazni,
ahol nem baj, ha az old generation meg is akasztja az alkalmazás
futását. A young generation szemétgyűjtése tehát rövidebb megállást
eredményez, de több processzoridőt és memóriát igényel a szálak
karbantartása miatt. Hasznos lehet pl. nagytömegű batch feldolgozások,
számlázás, tudományos számítások, stb. Automatikusan kiválasztásra kerül
szerver osztályú gépeken, egyéb esetben a `-XX:+UseParallelGC`
parancssori kapcsolóval lehet bekapcsolni.

![Serial és parallel collector
összehasonlítása](/artifacts/posts/2011-12-30-java-memoriakezeles-szemetgyujto/serial_parallel.png)

### Parallel Compacting Collector

Ez a szemétgyűjtő algoritmus a J2SE 5.0 update 6-ban került bevezetésre.
A young generation szemétgyűjtése megegyezik az előző,
parallel/throughput collector működésével. A különbség csak az old
generation szemétgyűjtésénél van, konkrétan ez is több szálon képes
futni. Ez a szemétgyűjtés három fázisból áll: marking, summary,
compaction. A marking fázisban a memória régiókra kerül felosztásra. Az
alkalmazásból közvetlenül elérhető objektumokat a szálak szétosztják
egymás között, és elkezdenek végigmenni a referenciákon, és megjelölik a
használt objektumokat. A második, summary fázis már nem objektumokon,
hanem régiókon dolgozik. A szemétgyűjtő működésének eredményeképpen egy
olyan állapot jön létre, hogy a memóriaterület elején sűrűbb rész van, a
végén ritkább. A sűrűbb azt jelenti, hogy onnan viszonylag ritkán kell
objektumokat kidobálni. A szemétgyűjtő az elejétől a végéig végigmegy a
régiókon, és kitalálja, hogy melyik régiótól kezdve éri meg kidobálni az
objektumokat. Ezen pont előtt lévő terület a dense prefix, ezt a
szemétgyűjtő nem bántja. A compaction fázisban történik a lyukak
feltöltése a ritkább területen. Tehát ennek a szemétgyűjtésnek is a
végén a memóriaterület eleje összefüggő, teli, míg a vége üres.

Ez a szemétgyűjtő akkor lehet megfelelő, ha a szemétgyűjtő által
okozott állási idő igenis fájdalmas, így ezt kell csökkenteni,
párhuzamossággal. A `-XX:+UseParallelOldGC` parancssori kapcsolóval
lehet bekapcsolni.

### Concurrent Mark-Sweep (CMS) Collector

A CMS collector-t olyan alkalmazások számára fejlesztették ki, ahol igen
fontos a válaszidő, pl. webes alkalmazásoknál. Mivel a young generation
szemétgyűjtése annak kis méretéből adódóan igen gyors, az ugyanúgy
működik, mint a Parallel/Throughput Collector esetében. A változás itt
is az old generation szemétgyűjtésében van. A szemétgyűjtés itt négy
fázisból áll: initial mark, concurrent marking phase/pre-cleaning,
remarking, concurrent sweeping. Az első, initial mark fázisban a
szemétgyűjtő megjelöli az alkalmazásból közvetlenül elérhető
objektumokat. Ekkor stop the world van, azaz az alkalmazás szálai
leállnak. Majd a concurrent marking phase fázisban az alkalmazás
futásával egy időben (és ettől konkurens) bejelöli a tranzitíven elérhető
objektumokat. A remark fázisban ismét stop the world, a szemétgyűjtő
bejárja az előző fázis közben módosult objektumokat, ezzel véglegesíti
az élő objektumok bejelölését. Ez már több szálon történik. A concurrent
sweep fázis eltávolítja a szemetet. Látható, hogy egyrészt több munkával
jár, másrészt lehetnek olyan nem használt objektumok, amik nem
takarodnak ki az első szemétgyűjtéskor (ez az un. floating garbage). Ez
az ára a rövidebb válaszidőnek. Látható, hogy a CMS collector un.
non-compacting szemétgyűjtő, azaz a memóriaterületen nem egybefüggően
lesznek az objektumok, hanem lyukak lesznek közöttük. Ez egyrészt
megnehezíti a kezelést, hiszen nem egy pointert kell nyilvántartani,
hanem egy listában kell nyilvántartani a szabad területeket. Másrészt
fragmentálódáshoz is vezet, azaz nem egyszerű betenni sem egy újonnan
példányosított objektumot. A többi szemétgyűjtővel ellentétben a CMS
collector nem akkor fut le, mikor betelik a memóriaterület, hanem
hamarabb, hogy még képes legyen lefutni. Ha ez nem sikerül, akkor
mindenképpen a jól ismert mark-sweep-compact algoritmus fut le, mely az
előző szemétgyűjtőknél is.

A CMS collector jól alkalmazható ott, ahol fontos a gyors válaszidő, és
több processzor tud a szemétgyűjtő munkájában részt venni, valamint
viszonylag sok hosszú életű objektum van. Ilyenek tipikusan a
többprocesszoros gépeken futó webes alkalmazások. A
`-XX:+UseConcMarkSweepGC` parancssori kapcsolóval lehet bekapcsolni.

![Serial és CMS collector
összehasonlítása](/artifacts/posts/2011-12-30-java-memoriakezeles-szemetgyujto/serial_cms.png)

Összefoglalva a következőket lehet megállapítani, a szemétgyűjtőket a
következő tulajdonságok alapján lehet vizsgálni:

-   A serial szemétgyűjtés jó egy processzoros gépen, de a parallel
    szemétgyűjtés, amennyiben több processzor tud részt venni, rövidebb
    ideig tarthat, de több erőforrás szükséges hozzá.
-   A stop the world megközelítés biztosítja, hogy nem módosul a
    stack/heap, de cserébe leállással jár. A concurrent szemétgyűjtés az
    alkalmazás mellett fut, így több processzor szükséges, és több
    erőforrás is szükséges hozzá. Nincs teljesen concurrent
    szemétgyűjtő, kizárólag olyan, melynek valamely fázisa concurrent.
-   A compacting lassabb ugyan, mert objektumokat kell másolgatni, de
    egy pointerrel elintézhető a szabad hely nyilvántartása. Non
    compacting esetben az adminisztráció is bonyolultabb, valamint
    töredezettség léphet fel.

![Szemétgyűjtő algoritmusok
összehasonlítása](/artifacts/posts/2011-12-30-java-memoriakezeles-szemetgyujto/tablazat.png)

[Our
Collectors](https://blogs.oracle.com/jonthecollector/our-collectors)
címmel egy elég jó cikket és grafikát találunk a young és old generation
szemétgyűjtő algoritmusainak, valamint parancssori paramétereinek
kapcsolatáról.

A Java 6 update 20-ban megjelent, és a 7-es sorozatban is megtalálható a
Garbage First Collector, vagy röviden G1. Ez teljesen más megközelítést
használ, viszont kevesebb tapasztalat van vele, ezért erről sem írni nem
tudok, és mindenkit óvatosságra intenék ezzel kapcsolatban.

Mivel nézzük, hogy hogyan működik a szemétgyűjtő? Az első, legegyszerűbb
eszköz a JVM `-verbose:gc` vagy `-XX:PrintGCDetails` paraméterrel való
futtatása. Nézzünk szét a JVM developer paraméterei között, rengeteg
statisztikát ki lehet nyerni. A másik megoldás, ha a fentebb említett
VisualVM Visual GC plugin-ját használjuk.

![A JVM -XX:PrintGCDetails paraméterrel
indítva](/artifacts/posts/2011-12-30-java-memoriakezeles-szemetgyujto/gc_details.png)

Nem szorosan ide tartozik, de nagyon hasznos lehet a JVM un. Fatal Error
Handling tulajdonsága. Amennyiben olyan hiba keletkezik, melyet nem
tudunk kódból lekezelni, pl. `OutOfMemoryError`, megadhatunk a JVM-nek
olyan kapcsolókat, melyeket használva mégis előrébb vagyunk. Pl.
`-XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=<path>` paraméterekkel
megmondhatjuk, hogy a JVM készítsen egy heap dumpot. Amit akár
VisualVM-be is betölthetünk, és grafikusan elemezhetünk. A
`-XX:OnOutOfMemoryError=<parancs(ok)>` paraméterekkel
operációs rendszerbeli parancsokat adhatunk meg, melyeket lefuttat a JVM
hiba esetén (bármilyen scriptet hívhatunk itt). A
`-XX:+ShowMessageBoxOnError` parancssori kapcsoló hatására feldob egy
dialógusablakot. Ez azért jó, mert ekkor még nem áll le a JVM, így akár
egy profilerrel is neki tudunk menni.

Ez alapján el lehet kezdeni a GC tuningolását, mely egy külön tudomány.
Jó kiindulási alap lehet az Oracle [Java SE 6 HotSpot[tm] Virtual
Machine Garbage Collection
Tuning](http://www.oracle.com/technetwork/java/javase/gc-tuning-6-140523.html)
cikke.
