---
layout: post
title: Web Component Developer
date: '2013-11-17T16:47:00.002+01:00'
author: István Viczián
tags:
- Servlet
- JSP
- vizsga
- Java EE
- könyv
modified_time: '2013-12-25T20:33:36.897+01:00'
blogger_id: tag:blogger.com,1999:blog-7370998606556338092.post-8235707600371192448
blogger_orig_url: http://www.jtechlog.hu/2013/11/web-component-developer.html
---

Ebben a hónapban tettem le a 
[Java EE 6 Web Component Developer Certified Expert Exam (1Z0-899)](http://education.oracle.com/pls/web_prod-plq-dad/db_pages.getpage?page_id=5001&get_params=p_exam_id:1Z0-899&p_org_id=⟨=)
vizsgát, mely alapvetően a Java EE 6 szabványon belül a Servlet és JSP
technológiára koncentrált. Ahhoz képest, hogy napi életben ezt használom
a legtöbbet, ez volt az eddigiek közül (Java SE, EJB, JPA, Web Services)
a legnehezebb, annak ellenére, hogy 40 órát biztos készültem rá.

A vizsga a szokásos, 140 perc, 57 kérdés, tesztek, ahol előre megmondják
a jó válaszok számát. Sikeres vizsgához 64% kell, ami egyáltalán nem
tűnik soknak. Az egész körítés nem változott a legutóbbi 
[Web Services vizsgám](/2012/12/22/oracle-certified-expert-java-ee-6-web.html) 
óta, bővebb információk ott.

A témakörök a következők voltak:

-   Web alkalmazások tervezése, protokollok, technológiák, komponensek:
    5 kérdés
-   Controller fejlesztése a navigáció implementálásához: 5 kérdés
-   Biztonság: 7 kérdés
-   Hibák kezelése: 4 kérdés
-   JSP és JSTL: 12 kérdés
-   Model, View és Controller tervezési minta használata: 5 kérdés
-   Alkalmazás és felhasználó állapotának kezelése: 6 kérdés
-   Kérés és válasz kezelése servletekkel: 6 kérdés
-   Tesztelés, csomagolás és telepítés: 7 kérdés

A technológiák közül érintett volt a Servlet, JSP, JSTL, EL. És a
Servlet API 3.0-ás verziójára is vonatkoztak kérdések, mint később látni
fogjuk.

Felkészüléshez az 
[OCEJWCD Study Companion: Certified Expert Java EE 6 Web Component Developer (Oracle Exam 1Z0-899)](http://www.amazon.com/dp/0955160340) 
könyvet választottam. Másik lehetőség a 
[Head First Servlets and JSP](http://www.amazon.com/Head-First-Servlets-Bert-Bates-ebook/dp/B006ORP9DQ/)
lett volna, ami szintén azt hirdeti magáról, hogy a vizsgára készít fel.
Én az előbbit választottam, hiszen hivatalosabbnak tűnt, gondoltam
jobban ismeri, hogy a vizsga mire koncentrál, jobban érzi a
hangsúlyokat. Valamint a Head First könyvek jók valamilyen technológiát
megismerni, de ha az ember már évek óta használja, akkor inkább a
referencia jellegű könyv a jobb. Harmadrészt a Head First könyv nem
tartalmazza a Servlet 3.0 újdonságait, SWCD exam for J2EE 1.4-re készít
fel. Sajnos a könyv választással alapvetően tévedtem, az első könyv
ugyanis abszolút nem arra koncentrált, amit a vizsgán kérdeztek.
Vizsgára felkészítő könyvhöz képest is túl száraz volt. Tele volt
hibákkal, amiknek egy része van a honlapján feltüntetve. Sajnos ezek
nagy része az ellenőrző kérdésekben és megoldásokban van. Van egy
fejezet, ahova nem tettek be kódrészletet, hanem a netről letöltendő
példa alkalmazásokban kellett turkálni. Azért a teszteket érdemes belőle
megnézegetni, de semmiképp nem javaslom egyedüli felkészítő anyagnak.
Szemben pl. az OCJP könyvvel. Érződik, hogy a Servlet 3.0 részeket is
utólag belegányolták, nem integráns része, nem illeszkedik bele a könyv
egészébe. A neten található bónusz kérdéssor sem tartalmaz ezzel
kapcsolatban kérdéseket.

A kiinduló oldal, ahonnan még érdemes információkat beszerezni, az a
JavaRanch [OCEJWCD](http://www.coderanch.com/how-to/java/ScwcdLinks)
vizsgával kapcsolatos oldala, valamint egy csomó példa kérdéssor
található mock examra keresve [itt](http://nikojava.wordpress.com),
[itt](http://exam.piotrnowicki.com/viewQuestion.xhtml?q=Q67),
[itt](http://www.javaranch.com/carl/scwcd/scwcd_mock_logo.jsp) és
[itt](http://www.cafe4java.com/mockexams/scwcd/mock1/q1.php). Sokan
javasolják a
[Enthuware](http://enthuware.com/index.php/mock-exams/oracle-certified-expert/oce-jsp-servlet-mock-questions)
programját is, én erre nem költöttem, de ma már másképp tennék.

És akkor konkrétan a kérdésekről. Több kérdés volt a HTTP metódusokról,
külön kérdés a DELETE-ről is. Egy kérdés, hogyha formon nem írsz ki
metódust, akkor az defultban POST-e? Ha egy JSP egy JS fájlt szolgál ki,
de JSP kiterjesztéssel, headerben be kell-e állítani a content-type-ot?
Ismerni kell a Last-Modified headert.

Nagyon fontos a Dispatcher include és forward ismerete, az include
direktíva és az import jsp tag, és az ezek közötti különbségek, valamint
mikor mit lehet csinálni, mikor van commit, mikor van
IllegalStateException. Ismerni kell mindegyik paraméterezését, mert hát
nyilván eltérnek. Ismerni kell az url rewrite-ot is.

Volt kérdés a role-link deployment descriptor elemről. A security
annotációk szintakszisát fejből kell ismerni.

Számomra a legérdekesebb, és legkevésbé ismert rész a hibakezelés volt.
Pl. ha az adatbázis 5 perccel később indul el, mint az alkalmazás, akkor
mit kell csinálni. Servlet init-ben várni rá, vagy hibát dobni? Mi van,
ha megbízhatatlan az adatbázis, többször elvesztjük a kapcsolatot, ez
hogyan kell kezelni? Erősen kell ismerni, hogy mi a különbség a
ServletException és a UnavailableException között. Deployment
descriptor-ban milyen exception-öket lehet megadni, Throwable, Error,
IOException? Sorrend számít, lehet többet megadni?

Volt jsp documenttel kapcsolatos kérdés is. Mivel én kizárólag
scriptless JSP-ket írok, megdöbbentett a nagyon sok useBean és
getProperty és setProperty-s kérdés. A legapróbb részletekig tisztában
kell lenni velük. Ismerni kell a JSTL tag-ek nevét és paraméterezését.
Amin meglepődtem, hogy saját tag-ek írása alap szinten volt. Én legtöbb
energiát ebbe öltem, mert ritkán kell ilyen, és nagyon bonyolult a
szintakszisa, és nem egyszerű megtanulni, az összes interfésszel,
telepítési leíróval. Egy nagyon alap dolgot kérdeztek, ami kitalálható.
A kedvencem az volt, hogy a taglib-nek prefixként meg lehet-e adni a
java szót, és érzékeny-e a kis és nagybetűre.

Ismerni kell a session metódusokat: getCreationTime,
getLastAccessedTime, és hogy ezek miket adnak vissza (long).

EL szinten nagyon ráment a típuskonverzióra, van-e String konkatenáció,
és fejből kell tudni a precedenciát. Több kérdésben is rákérdezett, hogy
a pont és szögletes zárójel operátort jól tudod-e használni, pl. map-ek,
bean-ek esetén.

Kérdés, hogy Servlet 3.0 esetén az injection az init után van vagy
előtt? Volt pár listeneres kérdés, pl. a getSession melyik listener
eventjében van. Több kérdés is volt a web fragmentekről, különösen az
orderingre szerettek rákérdezni. Érdekes kérdés, hogy vajon a web.xml
vagy a fragment filtere fut-e előbb? Sok filteres és egy wrapperes
kérdés volt. Filterből vajon hány példányt hoz létre a konténer?
@Multipart annotáció paramétereit is ismerni kell. Egy asynccontext-es
kérdés volt, kitalálható. Design patternnel foglalkozó kérdés nálam nem
volt.

Ahhoz képest, hogy ennél a vizsgánál tanultam direkt vizsgára felkészítő
könyvből, és a legtöbb anyag erről van fenn a neten, ez volt a
legnehezebb vizsga, itt ért a legtöbb meglepetés a kérdésekkel
kapcsolatban, hogy olyan dologra kérdezett rá, mely egyik felkészítő
anyagban sem volt, és a mock vizsgákban sem.

Végül álljon itt egy 
[segédlet](/artifacts/certs/oce-jws.md),
mely a vizsgára készülés során összeszedett dolgokat tartalmazza. Aki
erre a vizsgára készül, annak hasznos lehet, ha felkészülés gyanánt
átfutja.
