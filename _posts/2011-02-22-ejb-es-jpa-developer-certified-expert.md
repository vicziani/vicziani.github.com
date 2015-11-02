---
layout: post
title: EJB és JPA Developer Certified Expert
date: '2011-02-22T00:18:00.003+01:00'
author: István Viczián
tags:
- vizsga
- Oracle
- Java EE
- JPA
modified_time: '2012-12-22T14:43:10.729+01:00'
blogger_id: tag:blogger.com,1999:blog-7370998606556338092.post-7968961481638103983
blogger_orig_url: http://www.jtechlog.hu/2011/02/ejb-es-jpa-developer-certified-expert.html
---

*Frissítés 2011. április 28.*: ma jöttek meg a bizonyítványok, egy
kártya és egy levél társaságában.

​2010. szeptember 2-án és 3-án tettem le a 
[Java Platform, Enterprise Edition 6 Enterprise JavaBeans Developer](http://education.oracle.com/pls/web_prod-plq-dad/db_pages.getpage?page_id=41&p_org_id=1001⟨=US&p_exam_id=1Z0_895),
régi nevén Sun Certified EJB Developer for the Java EE6 Platform
(CX-311-093), és a 
[Java Platform, Enterprise Edition 6 Java Persistence API Developer](http://education.oracle.com/pls/web_prod-plq-dad/db_pages.getpage?page_id=41&p_org_id=1001⟨=US&p_exam_id=1Z0_898),
régi nevén Sun Certified JPA Developer for the Java EE6 Platform
(CX-311-094) vizsgákat. A Java EE6 esetén vált a kettő külön, előtte egy
volt, Sun Certified Business Component Developer (SCBCD) EE5 néven.
Mindkettő vizsga béta vizsga, tehát a publikus kiadás előtt lehetett
ezekre jelentkezni. Ez azt jelenti, hogy nem véglegesek a kérdések, erős
fejlesztés alatt állnak, segíteni lehet az Oracle-nek egyrészt ezek
tökéletesítésében, másrészt meg tudják határozni a nehézségi
fokozatukat. A kérdések erőssége igen nagy szórású, vannak túl egyszerű,
és túl nehéz kérdések is közöttük. Viszonylag alacsony áron lehet
hozzájuk jutni (, ez esetemben 50\$ volt vizsgánként - a Sun esetében
ezek még ingyenesek voltak), viszont rengeteg kérdésere kell válaszolni
(175 - 220), és kb. 5 óra van rájuk.

A 
[SCBCD vizsga oldalán](http://education.oracle.com/pls/web_prod-plq-dad/db_pages.getpage?page_id=41&p_exam_id=1Z0_860)
részletesebb listát lehet találni a tematikáról, és itt találhatóak
[példa kérdések](http://education.oracle.com/pls/web_prod-plq-dad/db_pages.getpage?page_id=303&p_certName=SQ1Z0-860)
is.

A felkészülés során a JPA-t az 
[Apress kiadó Pro JPA 2 Mastering the Java Persistence API](http://apress.com/book/view/9781430219569)
könyvből tanultam, mely messze a legrészletesebb és legprofibb szakmai
könyv, melyet valaha olvastam. Érződik, hogy nem csak azt írja le, hogy
hogyan néz ki a szabvány, hanem azt is, hogy miért jutottak a tervezők
arra a döntésre, valamint az implementációs különbségekről is lehet
olvasni. A szakmai precizitás miatt persze nem mindenütt kellően
olvasmányos, 10-15 oldalakon keresztül lazán elkalandozik az ember
figyelme. Nálam fejezetek voltak, amik totálisan kiestek. Véleményem
szerint a felkészüléshez bőven elegendő könyv. Jó EJB 3.1 könyv
szerintem még nem jelent meg, így a 
[Manning kiadó EJB 3 in Action](http://www.manning.com/panda/) könyvét ajánlom, valamint az EJB
3.1 felkészüléshez a
[TheServerSide](http://www.theserverside.com/news/1363656/New-Features-in-EJB-31)
cikket, az 
[Oracle cikket](http://www.oracle.com/technetwork/articles/javaee/javaee6overview-141808.html),
a specifikációt ([JSR 318](http://jcp.org/en/jsr/detail?id=318)),
valamint az 
[Apress kiadó Beginning Java EE 6 Platform with GlassFish 3](http://apress.com/book/view/9781430219545) 
könyvét, nem is azért,
mert annyira jó, hanem mert ez az elérhető egyetlen EJB 3.1 könyv.
Létezik még EJB vonalon a OReilly Enterprise JavaBeans 3.0 (5th
Edition), és az ingyen letölthető Mastering EJB 3.0 (4th Edition) könyv
is, lapozgattam őket korábban, de a vizsgára készülésnél nem vettem elő
őket. A JavaRanch-on is lehet találni nagyon sok
[forrást](http://www.coderanch.com/how-to/java/ScbcdLinks#scbcd50), de
szerintem ennyi időt már nem éri meg rá áldozni. Ami még sokat
számított, az Enthuware's mock simulator, valamint ezúton szeretnék
köszönetet mondani Karakó Miklósnak (alias palacsint), többek között a
[remek oldala](http://palacsint.hu/blog/20100418/scbcd-jegyzetek) miatt
is. Én nem nagyon gyakorolgattam fejlesztőeszközzel, egy-két dolgot
próbáltam ki NetBeans IDE és Glassfish környezetben.

A körítés ugyanaz volt, mint az SCJP esetén, melyről már 
[korábban írtam](/2009/10/16/scjp.html).

Sajnos a kérdések pontos számát nem tudom, mert nem írták ki előre,
hanem a gép témakörönként adta ki, és nem tudtam megjegyezni a
témakörönkénti kérdések számát. Érdekes, hogy az eredményen sem a valódi
kérdések és helyes válaszok számát írták le, hanem a végleges vizsga 60
és 63 kérdése szerepel rajta, mindkét esetben 60%-ot kell teljesíteni a
sikerességhez. Szerintem a JPA vizsga sokkal nehezebb, sokkal több
tárgyi tudást és gyakorlatot igényel.

Nagy negatívuma, hogy megterheli az embert, kb. 200 kérdés 5 órán
keresztül nagyon fárasztó tud lenni. Míg az SCJP esetén nagyon sok időm
maradt a végén, e kettő vizsgánál minden percet kihasználtam, úgy, hogy
arra sem volt időm, hogy átnézzem a válaszokat, csak amiket
elhalasztottam, azokon tudtam átrohanni. Igazából akkora engedmény sincs
rajta, hiszen 300\$ helyett 50\$-t kell fizetni érte. Valamint nagy
csúszás volt rajta, ugyanis az ígért 12 hét helyett, a 2010. szeptember
elején letett béta vizsgák eredményeit 2011. február 4-én és február
11-én kezdték el kipostázni. A végleges vizsgák február 21-én éles
üzembe álltak. (
[Bejelentés itt](http://blogs.oracle.com/certification/2011/02/0520.html), 
belső technikai problémákra hivatkoznak.) Érdekes, hogy az 
[Oracle Certification Database - régebben Sun](http://www.certmanager.net/sun)
oldalon már a levél megérkezése előtt pár nappal fenn volt az eredmény a
History-ban, de a Current Certifications panelen még a mai napig nem
szerepelnek.

További Java vizsgák az 
[Oracle Certification Program / Oracle Middleware](http://education.oracle.com/pls/web_prod-plq-dad/db_pages.getpage?page_id=140)
oldalon, valamint a 
[Oracle Certification Program / Available Certification Exams](http://education.oracle.com/pls/web_prod-plq-dad/db_pages.getpage?page_id=42#2)
oldalon.

És itt egy 
[segédlet](https://github.com/vicziani/vicziani.github.com/blob/master//artifacts/certs/oce-ejb_oca-jpa.md), 
mely pár érdekességet tartalmaz, melyekre a vizsgára való készülés közben 
bukkantam, vagy a vizsga közben tapasztaltam.
