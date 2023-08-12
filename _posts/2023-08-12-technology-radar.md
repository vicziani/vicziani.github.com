---
layout: post
title: JTechLog Technology Radar
date: '2023-08-12T10:00:00.000+02:00'
author: István Viczián
description: Mely technológiákat használnám, és melyeket csak fenntartásokkal?
---

Emlékszem régebben mennyire nagy esemény volt mindig, mikor kijött a Thoughtworks
[Technology Radar](https://www.thoughtworks.com/radar) legfrissebb kiadása.
A Thoughtworksről annyit kell tudni, hogy 1999-ben csatlakozott a céghez
Martin Fowler, és több munkatársával együtt jelentős és meghatározó könyveket írtak,
melyeket én is javaslok elolvasni. Ezek például:

* Martin Fowler - Refactoring
* Martin Fowler - Patterns of Enterprise Application Architecture
* Jez Humble, David Farley - Continuous Delivery
* Sam Newman - Building Microservices

A cég mindig nagyon haladó gondolkodású volt, és bizonyos időközönként
közreadta a Technology Radart, melyben grafikusan ábrázolták, hogy mi is
a véleményük az épp aktuális technológiákról, eszközökről, módszertanokról.

<!-- more -->

Ezeket koncentrikus körökben helyezték el, melyet négy cikkre (quadrants) osztottak:

* Techniques
* Tools
* Platforms
* Languages & Frameworks

A koncentrikus körök, azaz gyűrűk a következő neveket és jelentéseket kapták:

* Adopt: olyan technológiák, melyeket nagy biztonsággal lehet használni. Természetesen
  nem jók mindenre, de az adott probléma megoldására tökéletesek.
* Trial: nem feltétlenül érdemes az itt lévő technológiákat használni, de javasolt kipróbálni,
  és ha bizonyít, használni.
* Assess: nem biztos, hogy érdemes ezeket a technológiákat használni, de mindenképp érdekesek és javasolt
  őket szemmel tartani.
* Hold: olyan technológiák, melyeket nem érdemes használni. Vagy mert nem volt velük jó tapasztalat,
  tele vannak hibával, vagy egyszerűen kimentek a divatból.

Sőt, még időbeliséget is lehet rajta jelezni, egy kis nyillal jelölve a technológiánál, hogy befele vagy
kifele mozdult-e a gyűrűk között.

Sajnos azonban a Thoughtworks radarja egy idő után már nem volt számunkra releváns, túl sok olyan 
technológiát tartalmazott, melyek nálunk szóba se jöhettek.

Nemrég olvastam a szintén a Thoughtworks holdudvarába tartozó 
_Mark Richards, Neal Ford - Fundamentals of Software Architecture_ könyvet, mely felveti, hogy
érdemes ilyen radart kidolgozni akár magunknak, akár a csoportunknak, akár a cégünknek is.

Ezt a könyvet érdemes amúgy is elolvasni, mert nagyon sok jó ötletet, praktikát és eszközt
javasol az architect munkák megkönnyítésére.

<a href="/artifacts/posts/2023-08-12-technology-radar/Fundamentals_of_Software_Architecture.jpg" data-lightbox="post-images">![Fundamentals of Software Architecture](/artifacts/posts/2023-08-12-technology-radar/Fundamentals_of_Software_Architecture_400px.png)</a>

Több cég is készített magának ilyen radart:

* [Zalando Tech Radar](https://opensource.zalando.com/tech-radar/)
* [AOE Technology Radar](https://www.aoe.com/techradar/index.html)
* [SumUp Tech Radar](https://medium.com/inside-sumup/tech-at-sumup-its-on-our-radar-fab975ac3d17)
* [Zup Tech Radar](https://opensource.zup.com.br/radar/radar/)
* [Preply Tech Radar](https://tech-radar.preply.com/)
* [Avito Backend Tech Radar](https://techradar.avito.ru/backend)
* [Software AG Technology Radar](https://techradar.softwareag.com/)
* [ClearScore Tech Radar 2021](https://medium.com/clearscore/clearscore-tech-radar-2021-549f2f62c95b)

Sőt már kész eszközök is vannak arra, hogy saját radart készítsünk. Például:

* [Thoughtworks - Build your own radar](https://www.thoughtworks.com/radar/byor)
* [AOE Technology Radar static site generator](https://github.com/AOEpeople/aoe_technology_radar)
* [Zalando visualization](https://github.com/zalando/tech-radar)

Ezzel át tudjuk gondolni, hogy hogyan viszonyulunk a különböző technológiákhoz, és
másokkal is könnyebben meg tudjuk osztani. Természetesen én is kidolgoztam egy ilyet, csak kicsit átszabtam.
A Zalando JavaScriptjét használtam ehhez.

A körcikkek:

* Languages, frameworks and libraries
* Methods and patterns
* Platforms and operations
* Tools

A gyűrűk:

* Adopt: szívesen használom/használnám éles projektben.
* Trial: használtam már valamilyen szinten, azonban éles projektben még meg kéne róla győződnöm, hogy tényleg használható-e.
* Assess: szeretném kipróbálni.
* Hold: vagy rossz tapasztalatom volt vele, kiment a divatból, vagy találtam jobb megoldást.

A 2023.08-as JTechLog Technology Radar tehát a következő:

<a href="/artifacts/posts/2023-08-12-technology-radar/jtechlog-technology-radar.png" data-lightbox="post-images">![Fundamentals of Software Architecture](/artifacts/posts/2023-08-12-technology-radar/jtechlog-technology-radar_700px.png)</a>

Interaktív formában elérhető a következő linken is: [JTechLog Technology Radar](/artifacts/technology-radar/index.html)


  
