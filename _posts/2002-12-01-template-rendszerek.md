---
layout: post
title: Template rendszerek
date: 2002-12-01T08:00:00.000+01:00
author: Viczián István
tags:
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Mostanában kedvenceim a szervletek, és emlékszem, mikor kezdtem velük
ismerkedni, csak úgy ontottam a `out.println("<html>blabla</html>");`
sorokat. Azt hiszem más sem volt ezzel másképp. Aztán megírtam a saját
kis sablonmotoromat, ez is sokaknak ismerős lehet. Utána ismertem csak
meg haladóbb technikákat, melyek különválasztották a megjelenési réteget
az üzleti logikától, elválasztották a kódot a HTML tag-ektől. Ilyenek
pl. a [Tea Framework](http://teatrove.sourceforge.net/), a
[WebMacro](http://www.webmacro.org/), az [Elements Construction
Set](http://jakarta.apache.org/ecs/), és az
[XMLC](http://xmlc.objectweb.org/). A Sun válasza erre a problémára a
[JSP](http://java.sun.com/products/jsp/) (JavaServer Pages), mely
lehetővé teszi a programozónak, hogy elválassza a megjelenítési és
üzleti réteget, de nem kényszeríti rá. Ha a JSP-ben gyakran alkalmazunk
Java kódot, és itt valósítunk meg különböző funkciókat, akkor Model 1
technikáról beszélünk, ha szervletek biztosítják ezeket a funkciókat a
JSP mögött, akkor Model 2 technikáról. Ezekről bővebben ír az O'Reilly
Servlet könyv is.

A következő lépés volt a Swing-ből is ismert Model-View-Controller
szemlélet megvalósítása a szervletek terén is, így kialakultak nagyon
komplex frameworkök, melyek teljes környezetet nyújtanak szervletek
fejlesztéséhez. Többjük több alprojektből is áll. Ilyen például a
[Turbine](http://jakarta.apache.org/turbine/index.html), vagy a már
említett [Struts](http://jakarta.apache.org/struts/index.html).

Jelenlegi kedvencem a
[Velocity](http://jakarta.apache.org/velocity/index.html), mely egy
nagyon jó sablon motor, ami szervletekben és standalone alkalmazásokban
is nagyon jól használható. Állítólag WebMacro klón. Saját nyelve van,
többet is olvashatsz róla a cikkemben, melyet a főlapomról elérsz.

Itt beszélek még a PULL és PUSH technikáról is, ami ebben a
fogalomkörben elterjedt. Az előbbi azt jelenti, hogy a sablon szedi ki
az információt az üzleti rétegből, az utóbbi azt, hogy a megjelenő
adatokat úgy kell hozzárendelni a sablonhoz.

Most olvastam egy jót: *"Of course, there is nothing new under the
Sun..."*, hehe, [Sun](http://www.sun.com/index.xml), érted?
