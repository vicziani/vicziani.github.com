---
layout: post
title: Apache Lucene keresőmotor
date: '2009-01-25T12:25:00.006+01:00'
author: István Viczián
tags:
- Library
modified_time: '2022-08-31T22:30:00.000+02:00'
---

Oktatás során szoktam hangsúlyozni, hogy a Java nem csak egy
programozási nyelv, hanem sokkal több annál, divatos szóval nevezhetnénk
akár platformnak, egy blogger nézőpontjából életformának.

A Sunnak ezzel kapcsolatban van egy nagyon jól eltalált Java
Technology Concept
Map nevezetű kiadványa,
mely egy lapon próbálja a Java részeit, és a Java világához tartozó
dolgokat megemlíteni.

![Java Technology Concept Map](/artifacts/posts/2009-01-25-apache-lucene-keresomotor/java_map.png)

Nézzük melyek is azok a nevek, technológiák, szabványok nagy vonalakban,
melyeket mindenképp érdemes megemlíteni:

-   Java mint objektum-orientált programozási nyelv, mely egy
    [specifikáció](https://docs.oracle.com/javase/specs/).
-   A Java virtuális gépet (Java Virtual Machine - JVM), mely szintén
    egy [specifikáció](https://docs.oracle.com/javase/specs/).
-   [Java SE (Standard Edition)](https://docs.oracle.com/javase/6/docs/),
    mely egy fejlesztési platform asztali, egyszerűbb szerver
    alkalmazások fejlesztésére, mely már tartalmaz egy kiterjedt
    [osztálykönyvtárat,
    API-t](https://docs.oracle.com/javase/6/docs/api/index.html).
-   Ezen specifikációk legelterjedtebb megvalósítása a Sun Java SE
    Runtime Environment (JRE), mely egy futtató környezet, benne a Sun
    HotSpot virtuális géppel, valamint a Java SE Development Kit (JDK),
    mely parancssori fejlesztő eszközöket is tartalmaz. Ne feledjük,
    léteznek alternatív megvalósítások is, pl. virtuális gépre a Bea, ma
    már Oracle JRockit.
-   A SE nem elegendő minden igény kiszolgálására, ezért kialakítottak
    két új, bár az SE-re épülő változatot, a mobil fejlesztésre
    koncentráló Micro Edition-t, ME (ide tartoznak nem csak a
    mobiltelefonok, de az összes ún. limited device, mint pda, set-top
    box, stb.), valamint a nagyvállalati fejlesztésre szolgáló
    Enterprise Edition-t, EE. Intelligens kártyákra a Java Card
    technológiával lehet fejleszteni.
-   A Java elvei közé tartozik, hogy specifikációkat hoznak ki, és arra
    több gyártó, sőt akár nyílt forráskódú közösség is adhasson ki
    implementációt. A szabványok kidolgázásáért felelős szervezet az
    [Java Community Process (JCP)](https://jcp.org/en/home/index),
    melynek keretében szabvány kérelmeket (Java Specification Request -
    JSR) állítanak elő. Van JSR olyan alap dologhoz is, mint a
    programozási nyelv maga ([JSR
    901](https://jcp.org/en/jsr/detail?id=901)), de olyan nagyvállalati
    specifikációk is, mint a Java EE, EJB3, JPA, portlet, stb.
-   Természetesen egy nyelv keveset ér a fejlesztők nélkül. A Sun a Java
    fejlesztők számát 10 millió fölé tippeli.
-   Ide tartoznak azok az eszközök, melyek képesek Java-t futtatni. Ezek
    nem csak személyi számítógépek, de szerver szintű számítógépek, a
    másik oldalon mobiltelefonok, PDA-k, de beágyazott rendszerek is,
    pl. kenyérpirító szoftvere. :)
-   Szerencsére, bár ezt sokan elfelejtik, a Java-nak a célja SEM a
    fejlesztők érdeklődésének, tanulási, fejlődési vágyának
    kiszolgálásra, hanem a felhasználók kiszolgálása. Számítógépet
    használók szinte mindegyike találkozott már tudva, tudatlanul,
    akarva akaratlanul Java-ban implementált szoftverekkel, pl. Java
    applet-tel, vagy pl. a telefonhívásából számlát gyártó, vagy banki
    hitelét elbíráló nagyvállalati alkalmazással.
-   A Java elterjedését nagyban segítette az Internet. Egyrészt a Java
    nyelv és osztálykönyvtár elemei a kezdetektől támogatják elosztott
    rendszerek fejlesztését, Internet-et használó alkalmazások
    elkészítését. Másrészt az Internet remek közeg arra, hogy a
    fejlesztők kommunikáljanak, a gondolataikat megosszák egymással
    levelező listákon, fórumokon, blogokon, verziókövető és
    hibabejelentő rendszereken, stb. keresztül.
-   Ezen fejlesztők hatalmas mennyiségű nyílt forráskódú, valamint
    kereskedelmi terméket állítanak elő. Érdemes megnézni a Sourceforge,
    Java-Source.net, Codehaus, Apache oldalakat, hogy csak a nagyokat
    említsem, valamint a Sun, IBM, Oracle is több százas nagyságrendben
    kínál Java alapú szoftvereket, nem beszélve a kisebb cégekről. Ide
    tartoznak a fejlesztéshez használt eszközök, tool-ok (pl. modellező
    eszköz, IDE, projekt menedzsment, build és continouus integration
    eszköz, tudásmenedzsment eszköz, verziókezelő, issue tracker, teszt
    eszközök), library-k, middleware-ek, keretrendszerek, de a
    végfelhasználói programok is.
-   A legtöbb termékhez (legyen akár nyílt forráskódú, akár
    kereskedelmi), rengeteg információ áll rendelkezésre, melyeket
    különböző csatornákon lehet megszerezni, mint portálok, wiki-k,
    blogok, RSS feed-ek, fórumok, levelezési listák, podcast-ok.
    Információkat szerezhetünk nyomtatott és elektronikus könyvekből,
    cikkekből, tutorial-okból, FAQ-kból, példaprogramokból és ha adott,
    akár a forráskód is segíthet. A Java-hoz különböző események,
    konferenciák, közösségek (pl. a magyar Java Users Group - JUG, a
    Java User Meeting - JUM is ilyen).
-   A Java alapú szoftverfejlesztéshez (de a szoftverfejlesztéshez
    általában) rengeteg elméleti tudás, metodológia, módszertan is
    kapcsolódik, melynek széles körű áttekintse, megismerése is
    lehetetlen feladat. Ilyenek a fejlesztési módszertanok (unified
    process, agilis szoftverfejlesztés) és a hozzájuk tartozó modellező
    eszközök, objektum-orientált paradigmák, tervezési minták,
    refactoring, AJAX, Web 2.0, RIA, EAI, SOA, stb.

Ezt a szerteágazó világot megismerni, követni, a részeit JÓL alkalmazni
nem egyszerű feladat, hatalmas kihívás egy fejlesztő számára.

Ebben a blogban próbálok ebben segíteni, különböző hasznos eszközöket,
library-ket bemutatni.

Ezek közül egyik a Lucene könyvtár, mely egy nagy teljesítményű, minden
alkalmazási területet lefedő, Java nyelven implementált ingyenes, nyílt
forráskódú keresőmotor (az Apache Software Licence alatt).

A Lucene-ről már már letölthető egy [cikkem](/artifacts/lucene.pdf).

A [példaalkalmazás](https://github.com/vicziani/jtechlog-lucene) megtalálható a GitHubon.

A következő forráskód megmutatja, hogyan kell
egy JavaMail API részét képző üzenetet indexelni (nem teljes
részletességgel).

```java
public void indexMessages(Message[] messages) {
...
Directory directory = new RAMDirectory();
// Directory directory = FSDirectory.getDirectory("/tmp/testindex");
Analyzer analyzer = new StandardAnalyzer();
IndexWriter writer = new IndexWriter(directory, analyzer, MaxFieldLength.UNLIMITED);
for (Message message : messages) {
 Document document = new Document();
     document.add(new Field("fromAddress", ((InternetAddress) message.getFrom()[0]).getAddress(), Field.Store.YES, Field.Index.NOT_ANALYZED));
     document.add(new Field("fromPersonal", ((InternetAddress) message.getFrom()[0]).getPersonal(), Field.Store.YES, Field.Index.NOT_ANALYZED));
     document.add(new Field("sentDate", DateTools.dateToString(message.getSentDate(), DateTools.Resolution.MINUTE), Field.Store.YES, Field.Index.NOT_ANALYZED));
     document.add(new Field("subject", message.getSubject(), Field.Store.YES, Field.Index.ANALYZED));
     document.add(new Field("size", Integer.toString(message.getSize()), Field.Store.YES, Field.Index.NO));
     if (message.getContent()instanceof String) {
         document.add(new Field("content", (String) message.getContent(), Field.Store.NO, Field.Index.ANALYZED));
     }
     writer.addDocument(document);
}
writer.close();
...
}
```

A kódrészlet először létrehoz egy `RAMDirectory` példányt, ami az indexet a
memóriában tárolja. Majd példányosítja a beépített szabványos
feldolgozót (`Analyzer`), létrehoz egy `IndexWriter` objektumot. Majd
végigiterál az üzeneteken, és mindegyik üzenethez létrehoz egy üres
dokumentumot (`Document`). A dokumentumhoz hozzáadja a különböző mezőket.
A tárolt mezőt kereséskor le lehet kérni az eredeti formában a találati
listából. Az indexelt mezőre lehet keresni.

A következő kódrészlet megmutatja, hogyan kell keresni.

```java
public void searchMessages(Directory dir, String query) {
 ...
 IndexSearcher s = new IndexSearcher(dir);
 Query q = new QueryParser("content", new StandardAnalyzer()).parse(query);
 TopFieldDocs docs = s.search(q, null, 100, new Sort("sentDate", true));
 for (ScoreDoc scoreDoc : docs.scoreDocs) {
     Document doc = s.doc(scoreDoc.doc);
     System.out.println("Subject: " + doc.get("subject"));
 }
 ...
}
```

Először egy `IndexSearcher` objektumot kell példányosítani, melyek
konstruktorban egy `Directory`-t kell átadni. Majd egy `Query`-t kell
létrehozni a szöveges keresési feltétel elemzésével (ez dobhat
`ParseException` kivételt), a `QueryParser` osztállyal lehetséges. Ennek meg
kell adni a keresési feltétel szöveges ábrázolását, az alapértelmezett
mezőt és egy feldolgozót. A keresést futtatva egy `TopFieldDocs`
objektumot kapunk vissza, amitől le lehet kérdezni a találatokat
reprezentáló `ScoreDoc` objektumokat a dokumentum azonosítójával és
pontszámával. A dokumentumot az `IndexSearcher`-től lehet elkérni annak
azonosítója alapján, és a dokumentum egy mezőjét pedig a
`Document.get(String fieldName)` metódussal.

A forráskód magyarázata, és a Lucene-nel kapcsolatos rengeteg információ
elolvasható a cikkben.
