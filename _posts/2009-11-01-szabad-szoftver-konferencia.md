---
layout: post
title: Szabad Szoftver Konferencia
date: '2009-11-01T19:34:00.004+01:00'
author: István Viczián
tags:
- open source
- infrastruktúra
- Community
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Ma volt a Free Software Foundation Hungary Alapítvány által szervezett
[Szabad Szoftver Konferencia és Kiállítás
2009](http://konf.fsf.hu/cgis/ossc/2009/index). Úgy látszik, mostanában
főleg konferenciabeszámolókat írok, de nagy a termés, érdemes
ellátogatni ezekre, nyomon követni a trendeket. A mostani konferenciáról
is a meglátogatott előadásokról fogok írni, címszavakban az
érdekességekről. A konferencia oldaláról letölthető egy közel kétszáz
oldalas kiadvány is.

Dr. Szentiványi Gábor A felhőkön túl című előadásából kiderült, hogy az
előadó kicsit szkeptikus a felhők jelenlegi felhasználását illetően. A
semmibe vezető hídhoz hasonlította a jelenlegi állapotot. Számolni kell
a vendor lock-innel, a kisebb versenyzők a "nagyokat" (Amazon, Google)
követve próbálnak felemelkedni, nincs kiforrott, all-in-one üzleti
modell. Érdemes figyelni, merre tartanak, de merészség teljes
lendülettel beszállni.

### Trencséni Márton: Skálázható elosztott rendszerek

A kulcs-érték alapú adatbázisokról, MapReduce-ról, CouchDB-ről már írtam
egy [előző posztban](/2009/10/06/web-konferencia-2009.html).

[Keyspace](http://scalien.com/keyspace/)
:   Az előadó cége (Scalien) által BSD alatt fejlesztett kulcs-érték
    adatbázis. A NoSQL irányvonal megtestesítője, mely azon adatbázisok
    gyűjtő neve, melyek használatához nem szükséges SQL. C/C++-ban
    íródott, BerkleyDB-n alapul, de a következő verzióban ezt szeretnék
    kiváltani. Alapvetően konzisztenciát tart, de minden műveletnek van
    egy un. dirty párja, mely könnyen párhuzamosítható, de sérülhet a
    konzisztencia. Szóba került még a
    [Paxos](http://en.wikipedia.org/wiki/Paxos_algorithm) és a [Vector
    Clock](http://en.wikipedia.org/wiki/Vector_clock) algoritmusok is.

[Shared nothing architektúra](http://en.wikipedia.org/wiki/Shared_nothing_architecture)
:   Az SN egy olyan elosztott architektúra, ahol nincs verseny egy közös
    erőforrásért, mint pl. egy központi adatbázis. Most a webes
    fejlesztéseknél, valamint a felhők világában különösen fontos,
    hiszen nagyon jól skálázható, újabb alacsony költségű gépek
    beállításával növelhető a teljesítmény, és nincs szűk
    keresztmetszet, illetve olyan meghibásodási pont, mely a teljes
    rendszert megbénítaná (single point of failure). Ezt a Google is
    bebizonyította, az ilyen típusú adattárolást shardingnak hívja,
    aminek lényege, hogy az adatokat valamilyen osztályozás szerint
    külön tárolja (horizontális partícionálás), ezáltal egyszerre kisebb
    adatmennyiségen kell dolgozni.

Eventual consistency
:   Olyan konzisztencia modell (elosztott rendszerek esetén használatos,
    van-e ellentmondás a tárolt adatok között), melynek használatával
    lehetséges, hogyha egy adatot módosítunk, majd visszaolvasunk, nem a
    módosított értéket kapjuk. Ez úgy lehetséges, hogy a konzisztenciát
    feláldozzuk a teljesítmény oltárán, azaz nem blokkoljuk a módosítást
    addig, míg az szét nem terjed a replikátumokon. Pl. egy közösségi
    oldal képfeltöltésénél elfogadható, de banki rendszernél ne
    használjuk. Hátránya, hogy amikor inkonzisztencia lép fel, nem
    kezelhető automatikusan, hanem az alkalmazást kell rá felkészíteni,
    ami vagy feloldja, vagy a felhasználóra bízza a konfliktus
    feloldását.

Distributed lock manager
:   A megosztott erőforráshoz való hozzáféréseket vezérli.

[Memcached](http://www.danga.com/memcached/)
:   Nagy teljesítményű, elosztott, memóriában helyet foglaló cache
    rendszer, mely nagyszerűen tehermentesítheti az adatbázist.
    Legnagyobb felhasználója pl. a Facebook, ahol a tartalom 95%-a
    cache-ből jön.

[Redis](http://code.google.com/p/redis/)
:   A Memcachedhez hasonló, memóriában tartott kulcs-érték adatbázis,
    azzal a különbséggel, hogy az adatokat bizonyos időközönként képes
    aszinkron módon lemezre menteni, valamint szövegen kívül halmazokat
    és listákat is kezel, valamint képes replikációra.

[MemcacheDB](http://memcachedb.org/)
:   Bár nevében hasonlít a Memcachedre, és másra asszociálnánk, nem egy
    cache, hanem egy BerkleyDB-t használó perzisztens megoldás, mely API
    szinten nagyon hasonlít a Memcachedre, és C-ben lett megírva.

Google stack
:   Google File System (GFS), Chubby distributed lock manager, BigTable
    adatbázis kezelő és a MapReduce.

Hypertable
:   Nyílt forráskódú adatbázis a BigTable hasonlatosságára, C++-ban.

Dynamo
:   Az Amazon kulcs-érték adatbázisa.

[Dynomite](http://github.com/cliffmoon/dynomite/tree/master)
:   Dynamo klón, nyílt forráskóddal, Erlangban megvalósítva.

[Apache Hadoop](http://hadoop.apache.org/)
:   A Yahoo! által használt nyílt forráskódú, Javaban fejlesztett
    szoftverek gyűjtőprojektje a megbízható, skálázható, elosztott
    rendszerek fejlesztéséhez. Része a HBase, mely egy nyílt forrású
    BigTable klón.

PNUTS
:   A Yahoo! által használt elosztott adatbázis, mely nem nyílt.

Cassandra
:   Facebook mögött lévő adatbázis, Javaban.

[Project Voldemort](http://project-voldemort.com/)
:   LinkedIn mögött lévő kulcs-érték adatbázis, Javaban.

[MongoDB](http://www.mongodb.org/display/DOCS/Home)
:   Nyílt forráskódú, dokumentum-orientált adatbázis, C++-ban.

[Tokyo Cabinet](http://1978th.net/tokyocabinet/)
:   Egy újabb kulcs-érték adatbázis, C-ben.

[Neo4j](http://neo4j.org/)
:   Beágyazható, lemezre perzisztáló, tranzakcionált gráf alapú
    adatbázis.

[Eucalyptus](http://open.eucalyptus.com/)
:   Amazon API kompatibilitást ígérő nyílt forráskódú megoldás.

[Hail](http://hail.wiki.kernel.org/index.php/Main_Page)
:   Célja nyelv- és platformfüggetlen, felhő építését lehetővé tévő,
    nyílt forráskódú infrastruktúra szolgáltatások kifejlesztése.

[Deltacloud](http://deltacloud.org/)
:   Egységes REST API a különböző felhők (cloud) kezelésére,
    megszabadulva ezzel a vendor lock-intől. Jelenleg támogatott felhők:
    EC2, RHEV-M, RackSpace; VMWare ESX.

