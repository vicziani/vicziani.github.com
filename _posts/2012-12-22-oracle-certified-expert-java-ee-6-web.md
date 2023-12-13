---
layout: post
title: Oracle Certified Expert, Java EE 6 Web Services Developer
date: '2012-12-22T17:31:00.000+01:00'
author: István Viczián
tags:
- SOA
- JAX-WS
- vizsga
- JAX-RS
- könyv
modified_time: '2012-12-23T22:08:45.713+01:00'
---

​2012. december 12-én tettem le az 
[Oracle Certified Expert, Java EE 6 Web Services Developer](http://education.oracle.com/pls/web_prod-plq-dad/db_pages.getpage?page_id=458&get_params=p_track_id:JEE6WSD)
(1Z0-897) vizsgát. Alapvetően a webszolgáltatások (mind SOAP, mind REST)
alapfogalmaira, és a JAX-WS 2.2 és JAX-RS 1.1 specifikációkra
koncentrál. Ahogy már 
[korábban írtam róla](/2012/09/16/oracle-java-vizsgak.html), 
ez a Oracle Certified Professional, Java (SE 5, SE 6, vagy SE 7) Programmer 
vizsgára épül, de még a régebbi SCJP-vel is letehető.

A vizsgát a [Training360-nál](http://training360.com/) tettem, ők
intézték a regisztrációt is. A változatosság kedvéért ez most Pearson
VUE-nál történik, küldik is utána szépen a tudnivalókat és a számlát
levélben. A vizsga ára jelenleg 63 185 Ft. Hogy ne legyen olyan
egyszerű, a Pearson VUE-nál is kell regisztrálni, utána az 
[Oracle CertView programjában](http://www.certview.oracle.com/) is, ugyanis 
csak ott tudom az eredményt megtekinteni.

A vizsga menete alapvetően változatlan, készítenek rólad egy fényképet,
beülsz egy terembe hatodmagaddal egy gép elé minden nélkül, és sorban
válaszolsz a feltett kérdésekre. Teszt jellegű, 60 kérdés van, 90 perc
alatt kell megoldani, és 60%-ot kell elérni. Bejelölhetők a kérdések,
hogy még vissza akarsz rájuk később térni, és bármikor kérheted, hogy
vigyen végig újra a bejelölt, vagy az összes kérdéseken. A 90 perc
elegendő, belefért, hogy nagyon alaposan végigmenjek az összes kérdésen,
majd a bejelölteken, majd gyorsan még átnéztem újra az összeset (a végén
már pár kimaradt). Annyi változott mostanság, hogy nem ott nyomtatják ki
az eredményt előtted, hanem e-mailben kapsz egy értesítést, és egy
PDF-et tudsz letölteni a CertView oldaláról. Gyakorlatilag amint
kijöttem, már kaptam az értesítést, annak ellenére, hogy 30 perc
türelmet kértek.

A vizsgára felkészülni az SCJP-hez képest sokkal nehezebb volt, hiszen
az utóbbihoz rettentő mennyiségű anyag, mock exam, könyv áll
rendelkezésre, itt gyakorlatilag csak egy 
[Oracle tanfolyam](http://education.oracle.com/pls/web_prod-plq-dad/db_pages.getpage?page_id=609&p_org_id=8&lang=HU&get_params=dc:D65185GC10,p_preview:N)
áll rendelkezésre, aminek nem is teljesen ugyanaz a tematikája, és el
sem végeztem. Az eredményben azonban látható, hogy mely témakörben hány
kérdést tettek fel, számomra kicsit meglepő:

-   Legjobb gyakorlatok: 9 kérdés
-   RESTful webszolgáltatások: 5 kérdés
-   RESTful webszolgáltatások megvalósítása EJB-kkel: 3 kérdés
-   SOAP webszolgáltatások EJB-kkel: 4 kérdés
-   SOAP webszolgáltatások: 4 kérdés
-   Alacsony szintű SOAP webszolgáltatások (Dispatcher): 4 kérdés
-   Kliensek implementálása: 4 kérdés
-   Java EE webszolgáltatások konfigurációja, biztonság beállítása,
    telepítése: 8 kérdés
-   SOAP üzenetszintű biztonság: 7 kérdés
-   MTOM/MIME: 7 kérdés
-   WS-Addressing: 7 kérdés

A DOM, SAX, StaX technológiákról csak koncepcionális szinten esett szó,
mikor melyiket kell használni, tudjunk a StaX pull parser-jéről. JAX-B
kérdésre nem emlékszem. Számomra az volt meglepő, hogy érzésre rengeteg
biztonsággal, MTOM-mal és WS-Addressing-gel kapcsolatos kérdés volt,
amit ráadásul a különböző könyvek nem jól tárgyalnak. Övön alulinak
éreztem a Jersey kliens használatára vonatkozó kérdést is, hiszen az meg
nem a szabvány része.

Felkészülésként mindenképpen érdemes felkeresni a JavaRanch 
[ide vonatkozó oldalát](https://www.coderanch.com/how-to/java/ScdjwsLinks),
valamint Mikalai Zaikin 
[felkészítő anyagát](http://java.boot.by/ocewsd6-guide/), ami kicsit hiányos ugyan,
de megéri elolvasni. Kereskedelmi felkészítő anyaga az EPractize-nak és
a Whizlabsnak van, én egyiket sem használtam.

A következő könyvekből készültem: [már
írtam](/2012/08/12/soa-using-java-web-services.html) Mark D. Hansen: SOA
Using Java Web Services (Prentice Hall) könyvéről, mely egy jó kiinduló
alap, bár talán a vizsgához nem elég mély. SOAP fronton ezen kívül a
Martin Kalin: Java Web Services Up and Running (O'Reilly) könyvből
készültem. Ez utóbbi egy rendkívül jó könyv, és bár sokan ezt mondják
magukról, ez tényleg gyakorlatias. Már az elején elmondja, hogy hogyan
kell debugolni, hogy lehet a dróton átmenő üzenettartalmaz kiíratni,
amit még egy könyvben sem láttam ilyen részletesen kifejtve, különböző
operációs rendszereken. A felépítése is ilyen, szóval nem a specifikáció
alapján, hanem egy természetes íve van, ahogy kellenek az újabb és újabb
feature-ök. A mintapéldák sem voltak annyira mondvacsináltak. Egyedül az
nem tetszett, ahogy mind a két könyv a REST-ről beszél, feltehetőleg
akkr még nem volt ekkora hype, így egyrészt keveset írnak róla, másrészt
a JAX-WS specifikációval próbálják megugrani, ami erre alkalmatlan,
pláne a JAX-RS-hez hasonlítva. Az utóbbi könyv említi ugyan a Jersey-t,
de nagyon felületesen, ennél a vizsgára jóval több kell.

[![Java Web Services - Up and Running](/artifacts/posts/2012-12-22-oracle-certified-expert-java-ee-6-web/up_and_running_x320.jpg)](/artifacts/posts/2012-12-22-oracle-certified-expert-java-ee-6-web/up_and_running.jpg)

Ezen kívül a következő dokumentációkat érdemes elolvasni. A 
[Metro projekt dokumentációját](http://metro.java.net/guide/ch01.html)
mindenképp a security, MTOM, WSIT, WS-Addressing fejezetek miatt, máshol
erre nem találunk jó dokumentációt. A 
[Java EE 6 tutorial](http://docs.oracle.com/javaee/6/tutorial/doc/bnayk.html) ide
vonatkozó fejezete is elég rövid ahhoz, hogy érdemes legyen átlapozni. A
SAAJ-ról ugyan nem ír, de az 
[előző verzió igen](http://docs.oracle.com/javaee/5/tutorial/doc/bnbhf.html).
Amennyiben nem tiszta, hogy mi a különbség az RPC/Literal,
Document/Literal, Wrapped Document/Literal között, 
[itt egy gyakran idézett cikk](http://www.ibm.com/developerworks/webservices/library/ws-whichwsdl/).
[Ez a poszt](https://blogs.oracle.com/artf/entry/using_jax_ws_2_1) pedig
a WS-Addressing használatáról ír a JAX-WS 2.1-ben.

A REST témával kapcsolatban a Bill Burke: RESTful Java with JAX-RS
(O'Reilly) könyvet ajánlom. Kötelező olvasmány mindenkinek, aki JAX-RS-t
fejleszt. Két részből áll. Az egyik leírja a teljes JAX-RS szabványt, 14
fejezetben, példákkal együtt, a másik pedig egy workbook, gyakorlatilag
egy tutorial, 10 fejezeten keresztül. Olyan dolgokat mutatott be, melyek
létezéséről nem is tudtam a JAX-RS-ben, mindezt példás részletességgel.

[![RESTful Java with JAX-RS](/artifacts/posts/2012-12-22-oracle-certified-expert-java-ee-6-web/restful_java_x320.jpg)](/artifacts/posts/2012-12-22-oracle-certified-expert-java-ee-6-web/restful_java.jpg)

Még egy kis magyarázkodás, hogy mi értelme is volt letenni a vizsgát,
hiszen közvetlen előnye nincs. Egyrészt én oktatom ezt az anyagot, ezért
kapóra jött, hogy egyúttal a vizsgát is leteszem. Másrészt nem árt egy
kis vizsgadrukk, az ember munkakörnyezetben már ritkán kerül olyan
helyzetbe, hogy egy nagyobb átfogó témakört ilyen alaposan fel kelljen
dolgoznia, megtanulnia úgy, hogy még számonkérés is van, ezt a rutint
sem szeretném elveszíteni. Persze a papírgyűjtés is motivál, újabb
[achivement](http://en.wikipedia.org/wiki/Achievement_%28video_gaming%29).
Ha a munkahely meg támogatja, akár a vizsgadíj megfizetésével, akár
felkészülési idővel, egyszerűen bűn kihagyni.

Letölthető egy 
[segédlet](/artifacts/certs/oce-jws.md) 
mely azoknak hasznos, akik vagy komolyan foglalkoznak a
témával, vagy le akarják tenni a vizsgát. Megpróbáltam minden fogalmat
összeszedni, nekem volt egy vázlat. Talán egy öntesztnek sem utolsó,
hogy tényleg tisztában vagy-e mindennel.


