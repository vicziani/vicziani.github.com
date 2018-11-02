---
layout: post
title: Batch Application for the Java Platform (JSR 352)
date: '2012-12-22T02:03:00.000+01:00'
author: István Viczián
tags:
- JSR
- batch
- Java SE
- Java EE
- Community
modified_time: '2018-06-09T10:00:00.000-08:00'
---

A Java EE 7 szabványba [tervezik
beletenni](https://blogs.oracle.com/arungupta/entry/java_ee_7_key_features)
a Batch Application for the Java Platform ([JSR
352](http://jcp.org/en/jsr/detail?id=352)) szabványt is. Egy kicsit
csúszásban vannak, 2012 első negyedévére tervezték a Public Review-t, de
csak novemberre sikerült eljutni idáig, és nemrég, december 4-én lett
elfogadva.

A szabvány a Java azon hiányosságát próbálja pótolni, hogy nem nyújtott
egységes fogalomrendszert, modellt, leíró nyelvet és környezetet batch
alkalmazások fejlesztésére, habár nagyvállalati környezetben az
alkalmazások nagy része ilyen jellegű, és a technológia sem friss,
hiszen ez a megállapítás már a Cobol alkalmazásokra is igaz volt, és már
ott kialakultak az egységes fogalmak, best practice-ek. A batch
feldolgozás általában nagy tömegű adattal dolgozó és/vagy
számításigényes, nem interaktív, háttérben futó folyamat. Vagy az egész,
vagy csak bizonyos részei párhuzamosíthatóak. Gyakori követelmények
között szerepel a újraindíthatóság, checkpoint kezelés (leállás esetén
honnan lehet újraindulni), párhuzamosság, naplózás, management. A
specifikáció erre próbál standard megoldást adni, mind a Java, mind a
Java EE környezetben, javax.batch csomagban lévő API-val. A negyedik
fejezetben definiálja a fogalmakat, mely egy az egyben a Spring Batch
felhasználói kézikönyvének [idevágó
fejezete](http://static.springsource.org/spring-batch/reference/html/domain.html).
A Spring Batch egyedül itt van megemlítve hivatkozásképp.

A dolog érdekessége éppen ez. A specifikációt [Chris
Vignola](https://sites.google.com/site/chrisvignola/) készítette, aki az
IBM színeiben versenyez, és [ismeri annak
technológiáját](http://www.ibm.com/developerworks/websphere/techjournal/0801_vignola/0801_vignola.html),
mely a WebSphere Extended Deployment Compute Grid névet viseli. Azonban
megvizsgálta a Spring Batch-t is, és arra jutott, hogy inkább azt veszi
alapul. Azonban nem teljes mértékben, hanem bizonyos dolgokat
átalakítva, átnevezve (pl. tasklet -&gt; batchlet), bizonyos dolgokat
elhagyva, és pár dolgot az IBM megoldásából beemelve. A vicces még az,
hogy a referencia implementációt és a TCK-t is az IBM kívánja
elkészíteni. Az IBM XML leírója (Job Specification Language) ebben a
témában az xJCL nyelv, mely a régi JCL nyelv XML reinkarnációja, és elég
egyszerűnek tűnik a Spring leírója mellett. A szabvány számomra
meglehetősen szegényes a Spring Batch dokumentációjához képest. A
csapatban amúgy szerepel képviselő a Spring oldaláról is.

Az elfogadás körül is voltak problémák, ugyanis az első verziót azért
nem fogadta el két szereplő (London Java Community, Twitter, Inc.), mert
nem felelt meg a JCP akkori (2.8) kívánalmainak, miszerint a JSR
készítése legyen teljesen átlátható. A specifikáció körüli megbeszélések
ugyanis privát levelezési listákon folytak. Ezt javították azzal, hogy a
projekt [immár követhető a
Java.net](http://java.net/projects/jbatch)-en. Most már el is lett
fogadva a Public Review azzal a feltétellel, hogy az annotációk
használatát a végleges verzióban közelíteni kell a Java EE
konvenciókhoz, hiszen most jelentősen eltér attól. (A Java EE szerint
minden konfigurálható annotációval és XML-lel is, amennyiben mindkettő
meg van adva, az XML megadási mód nyer.)

Véleményem szerint teljesen logikátlan lépés az IBM ilyen erős jelenléte
ebben a specifikációban, ha már a Spring Batch lett véve alapul.
Érdekes, hogy erről alapvetően nem is lehet olvasni, a fórumon lehet egy
két üzenetváltásból elcsípni, hogy a szerző tényleg mindkét megoldást
alaposan megvizsgálta. Persze érthető, hogy az IBM-nek ebben a témában
sokkal nagyobb a múltja és a részesedése is a rengeteg legacy rendszer
miatt. Amennyiben azonban a közösség nem áll a specifikáció mögé, megy a
Sun/Oracle többi elfelejtett próbálkozása közé (lásd pl. JDO).
