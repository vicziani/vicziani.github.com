---
layout: post
title: Java Performance
date: '2012-03-31T00:16:00.000+02:00'
author: István Viczián
tags:
- performance
- monitorozás
- Módszertan
- scalability
- könyv
modified_time: '2018-06-09T10:00:00.000-08:00'
---

A [Java memóriakezelés, szemétgyűjtő
algoritmusok](/2011/12/30/java-memoriakezeles-szemetgyujto.html) postom
egy részét a [Java
Performance](http://amazon.com/Java-Performance-Charlie-Hunt/dp/0137142528/ref=sr_1_1?s=books&ie=UTF8&qid=1327511447&sr=1-1)
könyv ihlette.

A könyv a maga nemében egyedülálló. Ebben a témában viszonylag kevés
szakirodalom létezik, még kevesebb, ami ebből még aktuális is. (2011.
októberében került kiadásra.) A könyvet Charlie Hunt és Binu John írta.
Az előbbi az Oracle-nél vezető beosztásban van, ő a JVM
performanciájával foglalkozik, és a HotSpot JVM és a Java SE
osztálykönyvtárának gyorsításán dolgozik, valamint Java EE környezetben
is járatos, foglalkozott a Oracle GlassFish-sel és az Oracle WebLogic
Server-rel is. Binu John jelenleg a Ning, Inc.-nél dolgozik, de előtte a
Sun-nál több, mint egy évtizedett töltött teljesítményoptimalizálással,
az Enterprise Java Performance csapat tagja volt. Hozzáértésük,
tapasztalatuk nagyban meglátszik a könyvön is. A könyvvel kapcsolatban
[egy interjú](https://www.infoq.com/articles/book-java-performance) is
készült velük.

![Java Performance](/artifacts/posts/2012-03-31-java-performance/JavaPerformanceCover_375x500.gif)

A könyv egészen az alapoktól indul. A teljesítmény optimalizálás
fogalmait, és egy lehetséges módszertanát ismerteti. Két megközelítést
is tárgyal, a top down, és a bottom up megközelítést. A top down a
leggyakoribb módszer, a teljes rendszert megfigyelik, és egyre mélyebbre
fúrnak, és próbálják megtalálni a gyenge pontokat, és azokat kiemelni. A
bottom up megközelítés inkább specialisták egyik eszköze, mikor egy kész
rendszert visznek át egyik platformról a másikra, és a másik platform
előnyeit próbálják minél jobban kiaknázni. Olyan fogalmakat tisztáz,
mint performance monitoring, profiling és tuning.

A második fejezet kizárólag az operációs rendszerről szól. Leírja, hogy
különböző rendszereken (Windows, Linux, Solaris) miként monitorozhatjuk
a CPU-t, memóriahasználatot, lock-okat, hálózati forgalmat és disk
használatot. Tippeket ad, hogy milyen jelenség esetén mire kell
gyanakodnunk. Sokat foglalkozik a több magot tartalmazó processzorokkal
is.

A következő fejezet a HotSpot VM felépítésével, alapfogalmaival
foglalkozik. A könyv kizárólag az Oracle JVM-jével foglalkozik, nem tér
ki más gyártók megoldásaira, de azt hiszem ez igazán elfogadható, nagyon
ritkán láttam más JVM-en futó alkalmazásokat (, sőt egy ilyent
kiváltásában is részt vettem az akkor még Sun-os JVM-re). A JVM-et három
részre bontja, Runtime-ra, JIT compilerre és memory managerre, mely a
Garbage Collector-t foglalja magában. Nagyon részletesen leírja a JVM
indulását (20 pontban) és leállását is. Olyan részletesen, hogy volt egy
pont, mely nem volt tiszta, utána akartam nézni a weben, és semmi
információt nem talaltam róla, kivéve a JDK forráskódjában. Egészen C++
mélységekbe merül. Nagyon jó írás található itt az osztálybetöltésről
is, valamint a Java 5-ben megjelent Class data sharingról. Itt a kedvenc
részem a 32 és 64 bites architektúra összehasonlítása, ahol kiderül,
hogy a 64 bites architektúrára átállás átlagos esetekben miért okozhat
8-15%-os sebességlassulást. Áttekintést ad a GC-ről és a JIT
compiler-ről is. Megemlíti a JDK 6 update 20-tól elérhető G1
szemétgyűjtőt is, leírja a működését, bár bevallja, hogy értékelhető
mennyiségű tapasztalat még nem gyűlt össze ezzel kapcsolatban. Itt
egy-két paragrafusnál elő kellett venni a fordítóprogramok és automaták
tárgyon tanultakat.

A 4. fejezet a monitoringról szól. Tisztázza a célokat, leírja a
parancssori kapcsolókat, valamint részletesen tárgyalja a Java 6-ban
alapból elérhető JConsole-t és VisualVM-et, és annak VisualGC plugin-ját
is. Itt főleg a GC és a JIT monitorozására koncentrál. Az 5. fejezet
témája a profiling. A profiling már olyan megfigyelés, ami módosítja a
megfigyeltet ("tolakodó"). Itt is a terminológiával indít, majd az
Oracle Solaris Studio bemutatása következik. Eztán jön a NetBeans
Profiler.

A következő fejezet már gyakorlatibb jellegű, forráskódok is jócskán
szerepelnek benne (furcsa, hogy ezek a könyv végén találhatóak, én nem
találtam ezeket a neten). E fejezet felépítése úgy néz ki, hogy bemutat
egy programozói hibát, annak feltárásának módját, azaz a jelenséget
magát, valamint a megoldást. A 7. fejezet egy konkrét algoritmust mutat
be (folyamatábrával), hogy a JVM hogyan finomhangolható, milyen
parancssori kapcsolókat lehet használni, azoknak milyen kihatása
lehetséges. Bevallom őszintén, ez számomra kevésbé érdekes téma, azt
vallom ugyanis, hogy alkalmazás szinten sokkal kevesebb
energiabefektetéssel sokkal többet lehet hangolni. Ez ott jöhet jól,
ahol a forráskód nem elérhető, vagy láttam már olyant is, hogy a
fejlesztőknek nem volt idejük finomhangolásra, így az üzemeltetők
próbáltak plusz százalékokat kihozni. Itt az az érdekes, hogy
definiálnunk kell a célokat. Ezek a magas rendelkezésre állás, könnyű
konfigurálhatóság, áteresztő képesség, gyors válaszidő,
memóriahasználat, indulási idő. Ezek közül azonban nem lehet mindnek
megfelelni, ugyanis több alapból ellentmond egymásnak. Pl. amennyiben
magas rendelkezésre állást akarunk, cluster-es környezetben, azt nem
olyan egyszerű konfigurálni.

A 8. fejezet a benchmarking-ról szól. Na ez az a terület, ahol a legtöbb
tévhit van, valamint a legegyszerűbb módon tudjuk magunkat félrevezetni.
Szó esik it a warmupról, a System.gc() hívással kapcsolatos tévhitekről,
a System.currenTimeMillis() és nanoTime() metódusokról, compiler
optimalizációjáról (pl. ha egy metódus visszatérési értékét nem
használjuk fel, és nincs mellékhatása, símán kioptimalizálja),
inliningról. Rengeteg tippet és trükköt oszt meg. A biztosítékot nálam a
statisztikai módszerek alfejezet ütötte ki, ahol standard eloszlástól
kezdve nagyon sok mindenről szó esik.

Ez után következnek a könnyed részek. Hogyan vizsgáljunk többrétegű
alkalmazásokat, hogyan monitorozzunk Glassfish-t. Szó esik a web
konténerről, NIO-ról, HTTP szálakról, thread pool-okról, connection
queue-król. Igaz, GlassFish környezetben, de elég könnyen lehet ezt a
tudást más webkonténerre is kiterjeszteni. Megemlíti a JMeter-t. Ír
Servlet, JSP és JSTL legjobb gyakorlatokról, a cache-elés fontosságáról,
és megemlíti, hogy sokszor akkor is létrejön session, mikor nem is
gondolunk rá. A 11. fejezetben szó esik a webszolgáltatásokról, és az
alapját képző XML feldolgozásról (pl. JAXB). Külön piros pont, hogy
részletesen ír az EntityResolver-ekről (lásd [Apache xml-commons
resolver](http://xerces.apache.org/xml-commons/components/resolver/)),
és a CatalogResolver-ekről is, melyek a szívem csücskei. A különböző XML
processzorokat is összehasonlítja, SAX, DOM, StAX, JAXB. Érdekes
megfigyelés, hogy az xsd:any használata mennyire lassít, és még egy
érdekes adat, hogy az EJB-ből kiajánlott webszolgáltatások sokkal
lassabbak a webkonténerből kiajánlott társaiknál. Ezek a fejezetek még
mindig egyedülállóak.

Az utolsó, 12. fejezet a JPA és EJB teljesítményhangolásáról szól. No,
ez már olyan fejezet, amely más könyvekben is megjelenik, talán
ugyanilyen részletességgel. Szó esik therad pool-ról, cache-ekról,
tranzakciókról, és természetesen a kihagyhatatlan lazy loadingról is.

Az A függelék a HotSpot VM parancssori kapcsolóit sorolja fel, és
magyarázza meg, olyan részletességgel, amilyennel talán sehol máshol nem
lehet találkozni. B függelék a forráskódoké, majd következik a
részletes, nagyon jól használható tárgymutató.

Sajnos gyakran észreveszem, hogy ezzel a témával kapcsolatban nagyon
sokan helytelen, téves fogalmakat használnak. A könyv rendkívül
részletesen ismerteti, magyarázza és definiálja ezeket.

Egyetlen hátránya a könyvnek, melyet a különböző fórumokon többen is
jeleznek, az az írok Sun, illetve most már Oracle iránti elfogultsága.
Már az első fejezetben indokolatlanul fényezik az UltraSPARCT T-series
processzorokat, és ez a teljes könyvön végigvonul, gyakran említi a
Solaris-t, illetve a különböző eszközök közül is csak az Oracle-ösöket
tárgyalja ki, mint pl. a NetBeans Profiler-t. Ez utóbbi számomra nem
zavaró, hiszen nem lehet a teljes palettát bemutatni, és igazából ezen
eszközök nem nagyon térnek el egymástól, a Solaris-os fejezeteket is át
lehet ugrani, de a CPU hangsúlyozása már kicsit kínos.

A könyv majdnem 700 oldal, és nagyon sűrűen van szedve, nincs
teletűzdelve feleslegesen ábrákkal sem, emiatt a témát nagyon alaposan
bemutató, hosszú, részletes könyv. Nem is lehet egyhuzamban elolvasni,
inkább részleteiben, mindig arra a témakörre koncentrálva, amit éppen
teljesítmény-hangolni kell. Remélem sikerült kedvet hozni hozzá, és
mindenkinek a könyvespolcára kerül ez a könyv.
