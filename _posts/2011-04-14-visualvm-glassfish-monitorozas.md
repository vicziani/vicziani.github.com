---
layout: post
title: VisualVM Glassfish monitorozás
date: '2011-04-14T19:45:00.004+02:00'
author: István Viczián
tags:
- monitorozás
- VisualVM
- glassfish
- JMX
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Technológiák: Java SE 6 Update 23, VisualVM 1.3.2, Glassfish 2.1.1.

A [VisualVM](http://visualvm.java.net/) egy vizuális felület, mellyel a
Java virtuális gépet monitorozhatjuk. Előnye, hogy a JDK-ba is
belekerült, pl. a JDK 6 Update 23-ban a VisualVM 1.3.1 verziója
szerepel, a jvisualvm parancs kiadásával azonnal ki is próbálhatjuk.
Csatlakozhatunk lokális és távoli virtuális gépekhez is, így akár egy
teljes hálózat Java alapú rendszereit monitorozhatjuk. Nem csak külön
futtatható, de akár a NetBeans vagy Eclipse fejlesztőeszközbe is
plugin-ként telepíthető.

A virtuális gépről olyan alap információkat szolgáltat, mint a PID,
indított osztály, parancssori paraméterek, Java Home, JVM pontos
verziószáma, valamint a rendszerváltozók. Olyan teljesítmény adatokat
tudhatunk meg vele, mint a CPU felhasználás, memória felhasználás,
betöltött osztályok száma, szálak száma, stb. A CPU esetén külön mutatja
az alkalmazás és a GC által felhasznált processzor időt. Meghívhatjuk a
GC-t is. Memóriánál külön megtekinthetjük a Heap és a Permgen
kihasználtságát is (, ez utóbbiba kerülnek az osztálydefiníciók).
Kérhetünk Heap Dump-ot, mely egy pillanatfelvételt készít a memóriáról.
Megmondja, hogy melyik osztályból hány objektum került példányosításra,
és ezeket meg is nézhetjük a grafikus felület segítségével, de akár OQL
nyelven lekérdezéseket is végezhetünk. Szálak esetén valós időben
nézhetjük a szálak állapotát. Kérhetünk Thread Dump-ot is, melyből
kiderül, hogy melyik szál éppen mit csinál, melyik kódsorban áll.

CPU és memória profiler funkciókkal is rendelkezik. CPU profile esetén
megtudhatjuk, hogy a CPU idejének hány százalékát melyik metódusban
tölti. Snapshot-okat is kérhetünk, ezeket lementhetjük, és később, vagy
akár más gépen is elemezhetjük. Memória profile estén az objektumok
számát és területfoglalását figyeli. Itt is kérhetünk snapshot-ot, és
ezeket össze is hasonlíthatjuk. Ez egy remek eszköz arra, hogy teszt
előtt és után is készítünk egy snapshot-ot, és összehasonlítva azt
látjuk, hogy a teszt után mennyivel több objektumunk lett, osztályonként
lebontva. A profile azért eléggé megakaszthatja az alkalmazásunkat.

A JConsole bővíthető,
[plugin](http://visualvm.java.net/plugins.html)-okat lehet hozzá
telepíteni. Ezt az alkalmazásból, futás közben is megtehetjük, a
Tools/Plugins menüpontban. Érdekes a VisualVM-MBeans plugin, mellyel
gyakorlatilag JMX műveleteket tudunk elvégezni. A JMX-ről már írtam a
[Java monitorozás és
menedzsment](/2009/09/19/java-monitorozas-es-menedzsment.html) posztban,
míg a Tomcat JMX adminisztrációjáról a [Tomcat JMX tűzfalon
keresztül](/2010/07/30/tomcat-jmx-tuzfal.html) posztban.

Másik érdekes plugin a Visual GC, mely a memóriát memória területekre
lebontva monitorozza, külön az Old, Survivor és Eden területeket.

<a href="/artifacts/posts/2011-04-14-visualvm-glassfish-monitorozas/visualvm_visualgc_b.png" data-lightbox="post-images">![Visual GC](/artifacts/posts/2011-04-14-visualvm-glassfish-monitorozas/visualvm_visualgc.png)</a>

Szintén érdekes a Glassfish plugin, mellyel a Glassfishre érkező HTTP
kéréseket tudjuk
[monitorozni](http://java.dzone.com/articles/monitoring-glassfish),
valamint a telepített web alkalmazásokat, élő sessionök számát, valamint
az egyes servleteket is külön-külön. Ehhez azonban a Glassfishen is
[konfigurálnunk
kell](http://qants.wordpress.com/tag/glassfish-plugin-for-visualvm/). A
bal oldali menüben ki kell választani az Application Server menüpontot,
ott a Monitor majd Runtime fület választani, majd a Configura Monitoring
linkre kell kattintani. Itt a HTTP Service és a Web Container
monitorozását kell minimum LOW-ra állítani. Utána nem árt újraindítani a
VisualVM-et, a Glassfish-t nem kell. Sajnos csak 2-es Glassfish-sel megy,
a 3-as sorozattal próbáltam, de nem sikerült.

<a href="/artifacts/posts/2011-04-14-visualvm-glassfish-monitorozas/visualvm_glassfish_b.png" data-lightbox="post-images">![Glassfish plugin](/artifacts/posts/2011-04-14-visualvm-glassfish-monitorozas/visualvm_glassfish.png)</a>

A VisualVM a [NetBeans Platformra](http://platform.netbeans.org/) épül.
Természetesen [mi is
írhatunk](http://visualvm.java.net/api-quickstart.html) saját
plugineket.
