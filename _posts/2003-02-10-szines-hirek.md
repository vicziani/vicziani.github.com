---
layout: post
title: Színes hírek
date: 2003-02-10T08:00:00.000+01:00
author: Viczián István
tags:
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Pörögnek itt a dolgok rendesen a Java világban. Egyrészt kiszivárgott a
Sun egy belső
[jelentése](http://www.internalmemos.com/memos/memodetails.php?memo_id=1321),
melyről a [Prog.Hu](http://www.prog.hu/news.php?qnid=1182) is ír,
nevezetesen arról van szó, hogy több belső munkatárs is kritizálja a
Java nyelvet (főleg Solaris operációs rendszer esetén), és nem találják
elég produktívnak, valamint megbízhatónak. Azóta megjelent egy cikk a
Root.Hu-n is ugyanerről. (Azóta a Root.Hu portál megszűnt létezni, ezért
a további linkeket is kénytelen vagyok eltávolítani.)

Több ingyenesen is letölthető könyvet is találtam, elsősorban a J2EE
szerelmeseinek, ezeket érdemes letölteni:

-   [Mastering
    EJB](http://www.theserverside.com/books/wiley/masteringEJB/index.jsp)
-   [EJB Design
    Patterns](http://www.theserverside.com/books/wiley/EJBDesignPatterns/index.jsp)
-   [J2EE and XML
    Developement](http://www.theserverside.com/books/manning/J2EEXML/index.jsp)

Persze ezen kívül rengeteg cikket, készülő könyvet, segédanyagot
találunk a
[TheServerSide.com](http://www.theserverside.com/articles/index.jsp)
resources oldalain.

Közben végre megnyílt az [OpenEAI Project Web
Site](http://www.openeai.org/), letölthető dokumentációkkal (üzenet
protokoll, API bevezetés, implementációs stratégiák és deployment
minták) és ígéretekkel (bevezető, metodológia, üzenet definíciók).
Alkalmazás integrátoroknak kötelező darab.

Közben megtaláltam, hogy nem csak az Ant project ment át top level
projectnek az Apache-nál, hanem az Avalon (keretrendszer és
komponensek), James (e-mail/news/messaging szerver) és az
ObJectRelationalBridge (objektum/relációs mapping tool). Ez utóbbi az
[Apache DP project](http://db.apache.org) alá költözött a Torque-csal
együtt, mely egy eredetileg a Turbine keretrendszer részeként
fejlesztett perzisztens réteg. Egyéb kavar is volt az Apache háza táján,
de én csak a Java-s részekre koncentráltam. Elindult egy Web Services
project is, a webes szolgáltatások írásának, használatának
megkönnyítésére. Sőt, wikit is indítottak, melyről már beszéltem. Az
xml-lel még mindig a [xml.apache.org](http://xml.apache.org)
foglalkozik, az Incubator a kezdeti stádiumban lévő projectek/ötletek
gyűjtőhelye (2002 októberétől), a Commons pedig az újrafelhasználható
kódok gyűjteménye lenne (kezdeti stádiumban van még).

Ha már volt szó a Borland OptimizeIt szoftveréről, érdemes megemlíteni a
[Optimizeit ServerTrace](http://www.borland.com/opt_servertrace/)
alkalmazást is, mely egy J2EE teljesítmény monitorozó eszköz, mellyel a
tesztelés közben kiszűrhetők a potenciális erőforrás-zabáló helyek, stb.
Figyelemmel kísérhetjük a legfőbb J2EE komponenseket, beleértve a JDBC,
JSP, JNDI, EJB és JMS komponenseket.
