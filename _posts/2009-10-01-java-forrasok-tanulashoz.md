---
layout: post
title: Java források tanuláshoz
date: '2009-10-01T00:26:00.010+02:00'
author: István Viczián
tags:
- Java SE
- Oktatás
- Java EE
modified_time: '2018-06-09T10:00:00.000-08:00'
---
Sokan kérdezik tőlem, hogy milyen internetes dokumentáció vagy könyv alapján,
milyen magyar vagy angol nyelv alapján érdemes megtanulni a Java
programozási nyelvet, illetve platformot és az ahhoz tartozó
technológiákat. Ebben a posztban megpróbálom ezeket összegyűjteni, hogy
nekem mik váltak be, mi alapján tanítunk, mi az, amihez többször
visszanyúlok, a teljesen kezdő szinttől a haladó témakörökig.
Megpróbálom ezt a postot folyamatosan karbantartani, frissíteni. A
könyvek az Internetről már hamar beszerezhetők, de az itt említetteknél
javaslom a papír alapú beszerzését.

A legnehezebb a helyzet, ha még egy programozási nyelvet sem ismer az
ember, ugyanis ekkor meg kell ismerni a számítógép belső működését,
adat- és vezérlési szerkezeteket. Legjobb választás a magyar nyelvű
kétkötetes Angster Erzsébet: Objektumorientált tervezés és programozás -
JAVA könyv, mely a programozással, objektum orientáltsággal és a Java
alapjaival ismertet meg. Hasznos lehet még Dr. Juhász István, Vég Csaba:
Java - start ! könyve is. Mindannyiukat személyesen ismerem, főiskolai,
egyetemi tanárok, rengeteg tapasztalattal rendelkező kiváló oktatók, így
könyveik mindenképpen javasolt.

![Objektumorientált tervezés és programozás - JAVA 1.](/artifacts/posts/2009-10-01-java-forrasok-tanulashoz/angster1_b.jpg)

![Objektumorientált tervezés és programozás - JAVA 2.](/artifacts/posts/2009-10-01-java-forrasok-tanulashoz/angster2_b.jpg)

Amennyiben már rendelkezünk programozási ismeretekkel, a legteljesebb,
gördülékenyen olvasható könyv [Cay S. Horstmann, Gary Cornell: Core
Java: Volume I, Fundamentals](http://www.horstmann.com/corejava.html),
valamint ennek második kötete a Core: Java: Volume II, Advanced
Features. Legnagyobb előnye, hogy a Sun adja ki, és mindig követi a
nyelv változásait, jelenlegi 8. kiadás tartalmazza a Java SE 6 minden
újdonságát. Mi is ez alapján tanítunk. Jó választás az angol nyelvű
[Bruce Eckel: Thinking in Java](http://www.mindview.net/Books/TIJ/),
mely harmadik kiadása ingyenesen letölthető, negyedik kiadását viszont
már meg kell vásárolni. A legteljesebb magyar nyelvű kétkötetes könyv a
[Nyékyné Gaizler Judit (szerk.): Java 2 útikalauz programozóknak
5.0](http://ecoop2001.inf.elte.hu/), de ehhez az előzőleg felsorolt
könyvek valamelyikén már mindenképp legyünk túl, főleg referencia
jellegű, amikor egy konkrét API-val, témával ismerkedtem, akkor vettem
elő, nem érdemes az elejétől a végéig elolvasni. Minden (legalább céges)
polcon legyen ott egy példány. Remek, több, mint 250 oldalas letölthető
jegyzet [Nagy Gusztáv: Java programozás
1.3](http://nagygusztav.hu/java-programozas) című munkája, mely
Kecskeméti Főiskola GAMF Karán tanuló műszaki informatikus hallgatóknak
készült. Auth Gábor munkáját dícséri a magyar nyelvű [JavaForum
Java-Suli](http://www.javaforum.hu/javaforum/10/java_suli). Reméljük jön
folytatás. A JavaGrund-on is található egy ingyenes bevezetés [Bevezetés
a programozásba a Jáva nyelven
keresztül](http://www.javagrund.hu/web/java/learn/kezdo/javatanfolyam)
címmel, de mivel 2001-es, pár rész már igen elavult. Ingyen
végignézhetőek a [Sun
tutorial-jai](http://java.sun.com/docs/books/tutorial/) is, bár nem
adnak egységes képet, szintén egy téma elsajátításakor érdemes az adott
fejezetet elővenni.

A feltelepített JDK-ban is találunk érdekes anyagokat. Javasolt
tanulmányozni a JAVA\_HOME/src.zip állományt, melyben a teljes Java
osztálykönyvtár forráskódja megtalálható. Valamint a demókat is
feltelepítve elérhető a JAVA\_HOME/demo/jfc/SwingSet3/readme.html
állomány, mellyel elindítható a SwingSet3 alkalmazás, mely bemutatja a
Swing lehetőségeit, az összes komponenst, forráskóddal együtt.

Sajnos már a tanuláskor le kell tenni a voksot egy fejlesztőeszköz
mellett. A két nagy a Sun támogatását élvező NetBeans és az IBM által
támogatott Eclipse. Mi próbáltuk oktatásban mindkettőt, és meg kell
mondani, a visszajelzések alapján a NetBeans jobb választásnak tűnt, az
Eclipse inkább profi programozók szeretik jobban. NetBeans esetén
rengeteg példa található a [General Java Development Learning
Trail](http://www.netbeans.org/kb/trails/java-se.html) oldalon, érdemes
a [NetBeans IDE Java Quick Start
Tutoriallal](http://www.netbeans.org/kb/docs/java/quickstart.html)
kezdeni, valamint sok videót is találunk a [All Video Tutorials and
Demos of NetBeans IDE
6.x](http://www.netbeans.org/kb/docs/screencasts.html) oldalon. Az
Eclipse-et választóknak is indult egy [Eclipse And Java: Free Video
Tutorials](http://eclipsetutorial.sourceforge.net/) projekt, ahol
szintén videók érhetők el, teljesen kezdő Java programozóknak javasolt a
[Eclipse and Java for Total
Beginners](http://eclipsetutorial.sourceforge.net/totalbeginner.html).
Ez utóbbinak elkészült a [magyar
fordítása](http://sourceforge.net/projects/eclipsetutorial/files/1.%20Total%20Beginners-Hungarian/)
is [Dorothy](http://eclipsefelfedezo.blogspot.com/) jóvoltából.

![Java 2 útikalauz programozóknak 5.0](/artifacts/posts/2009-10-01-java-forrasok-tanulashoz/se_utikalauz_b.jpg)

Az ingyen letölthető [The Java Language
Specification](http://java.sun.com/docs/books/jls/) a Java nyelv
specifikációja, de bevallom, nagyon ritkán néztem bele.

Aki a SCJP vizsgát akarja letenni, annak kötelező darab az SCJP
vizsgasorokat is fejlesztők könyve: Sun Certified Programmer for Java 6
Study Guide, CD melléklettel, egy csomó példa teszttel. Mivel nagyon
trükkös kérdések vannak, érdemes átolvasni annak is, aki biztos a Java
tudásában, hogy mire kell figyelni.

Aki profibb, de még mindig a Java SE-ről akar többet tudni, annak
javasolt a [Joshua Bloch: Effective
Java](http://java.sun.com/docs/books/effective/) (magyarul is megjelent
Hatékony Java címmel). Ez már nagyon mélyen tárgyalja a Java nyelvet, és
78 tippet ad ahhoz, hogy hatékonyabb Java kódot írjunk.

![Hatékony Java](/artifacts/posts/2009-10-01-java-forrasok-tanulashoz/hatekony_java_b.jpg)

Aki az elméletet is szereti, annak ajánlom [Bruce Eckel: Thinking in
Patterns with Java](http://www.mindview.net/Books/TIPatterns/) ingyen
letölthető könyvét, valamint Steven John Metsker, William C. Wake:
Design Patterns in Java című könyvét a tervezési mintákról Java-ban
történő megvalósításáról (a klasszikus Design Patterns: Elements of
Reusable Object-Oriented Software könyv ugye C++ mintákat tartalmaz, ami
magyarul is megjelent Programtervezési minták címmel. Valamint érdekes
Martin Fowler: Refactoring: Improving the Design of Existing Code könyve
(magyarul Refactoring - Kódjavítás újratervezéssel).

![Refactoring - Kódjavítás újratervezéssel](/artifacts/posts/2009-10-01-java-forrasok-tanulashoz/refactoring_b.jpg)

Aki a webes fejlesztés irányába akar elmenni, az Java nyelven nem
kerülheti ki a Servlet és JSP technológiát. Ebben a témakörben a
következő könyveket tudnám kiemelni: Jason Hunter: Java Servlet
Programming, Hans Bergsten: JavaServer Pages. Mindkettő megjelent magyar
nyelven is, a Servlet esetén javaslom, de a JSP esetén semmiképp sem,
mert nem a legfrissebb kiadás, és nagyon sok minden változott azóta.
Mindkét könyv főleg a Tomcat web konténert használja. Sun-os Core
sorozat tagja, a [Marty Hall, Larry Brown: Core Servlets and JavaServer
Pages](http://pdf.coreservlets.com/) ingyen letölthető, szintén
Tomcat-tel. A [Eric Jendrock, Jennifer Ball, Debbie Carson, Ian Evans,
Scott Fordin, Kim Haase: The Java EE 5
Tutorial](http://java.sun.com/javaee/5/docs/tutorial/doc/) második
fejezete szintén ezt a témakört tárgyalja, NetBeans fejlesztőeszközzel
és Glassfish alkalmazásszerverrel. Itt már megjelenik a JSF technológia,
melyről jó könyv a [David Geary, Cay Horstmann: Core JavaServer
Faces](http://horstmann.com/corejsf/).

Aki a Java EE teljes világát szeretné felfedezni, annak az előbb
említett tutorial szintén kötelező darab, de már gyakran olvasgatni kell
a különböző specifikációkat a [Java Community
Process](http://www.jcp.org/en/home/index) honlapján. A két legjobb
könyv az ingyen letölthető [Rima Patel Sriganesh, Gerald Brose, Micah
Silverman: Mastering Enterprise JavaBeans
3.0](http://www.theserverside.com/news/1369778/Free-Book-Mastering-Enterprise-JavaBeans-30),
valamint az Debu Panda, Reza Rahman, Derek Lane: EJB 3 in Action,
melyből szintén oktatunk. Ide kapcsolódik a Mike Keith, Merrick
Schincariol: Pro EJB 3 Java Persistent API című könyv is. Java EE
témában megjelent Imre Gábor (szerk.): Szoftverfejlesztés Java EE
platformon könyv, ami nagyon jó elméleti bevezető (servlet, JSP, JSF is
van benne), de aki ezeket a technológiákat élesben akarja használni,
annak nem elég, még egy másik könyvet is el kell olvasnia. Van a J2EE
Útikalauz Java Programozóknak zöld könyv is, de az csak a J2EE 1.4-es
szabványt tárgyalja, ezért csak annak lehet érdekes, aki ezen a verzión
beragadt alkalmazást fejleszt.

![J2EE Útikalauz Java Programozóknak](/artifacts/posts/2009-10-01-java-forrasok-tanulashoz/javaee_b.jpg)

Kiemelném még Anil Hemrajani: Agile Java Development with Spring,
Hibernate and Eclipse könyvét, ami nem csak azért jó, mert bevezet az
agilis programozás alapjaiba, de rengeteg Java-val kapcsolatos szoftvert
bemutat, és azok együttműködését, gyakorlatilag egy "software
ecosystem"-et, mint pl. Spring, Spring MVC, Eclipse, Hibernate, Log4J,
JUnit, stb.

Web szolgáltások és SOA témakörben: Steve Graham, Doug Davis, ...:
Building Web Services with Java: Making Sense of XML, SOAP, WSDL, and
UDDI, ez nagyon részletes és rengeteg szabványt ecsetel, magyar kiadása
is van, de azt semmiképp nem ajánlom, mert nagyon elavult. Ennél sokkal
olvasmányosabb, emészthetőbb a [Mark D. Hansen: SOA Using Java Web
Services](http://soabook.com/) című könyv.

Alapvetően azonban hiszek az oktatás hatékonyságában is (, különben
miért is oktatnék), egy hét intenzív Java tanfolyam alatt sok mindent
meg lehet tanulni, főleg, ha az ember felkészülve megy oda, és mindent
ki akar hozni az egy hétből. Azért is jó, mert akkor az embernek egy
hete erre van dedikálva, ami munka mellett ritkán adatik meg. Oktatóink
a SZÁMALK-nál éles projektekben dolgozó szakemberek, akik nem csak
szárazon adják le az elméleti anyagot, hanem rengeteg gyakorlat van, és
valós életből vett tapasztalatokat is megosztanak.
