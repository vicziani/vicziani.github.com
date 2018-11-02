---
layout: post
title: Oracle Java vizsgák
date: '2012-09-16T23:49:00.000+02:00'
author: István Viczián
tags:
- vizsga
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Mióta letettem a 6-os Javahoz tartozó [SCJP](/2009/10/16/scjp.html)
vizsgát, elég sok minden változott, így érdemes még egyszer rátekinteni.
Egyrészt az Oracle felvásárolta a Sunt, és ez a vizsgáknál is látszik,
próbálja idomítani a jelenlegi Associate, Professional, Master vonalba.
Az Sun Certified Java Programmer, majd későbbi nevén az Oracle Certified
Professional Java SE Programmer helyét most két vizsga vette át.
Egyrészt [1Z0-803 - Java SE 7 Programmer
I](http://education.oracle.com/pls/web_prod-plq-dad/db_pages.getpage?page_id=41&p_org_id=&lang=&p_exam_id=1Z0_803),
valamint a [1Z0-804 - Java SE 7 Programmer
II](http://education.oracle.com/pls/web_prod-plq-dad/db_pages.getpage?page_id=41&p_org_id=&lang=&p_exam_id=1Z0_804).
Az előbbi alap Java programozói tudást tesztel, tisztában kell lenni a
Java alapjaival, valamint az objektumorientáltság alapfogalmaival. Ez
kicsit több, mint a Sun Certified Java Associate, mely nem követelt meg
ekkora programozói tudást, inkább egy áttekintő képet próbált adni a
Java platformmal kapcsolatban, így egy kicsit a webes technológiákat,
mobil programozást és az UML-t is érintette. A Java SE 7 Programmer I
ezzel szemben kizárólag a Java programozási nyelvre megy rá. A Java SE 7
Programmer II már sokkal mélyebben kérdez bele az objektumorientált
fogalmakba és konstrukciókba és kivételekbe, valamint új téma a
generikusok, Collections Framework, String műveletek, Java I/O, Java
File I/O (NIO.2), szálak, lokalizáció és nem is az Oracle lenne, ha nem
került volna bele a JDBC. Ez az Oracle kommunikációja szerint komolyabb,
mint az SCJP volt. A második vizsgának előfeltétele az első vizsga.
Akinek SCJA vagy OCJA 5/6 vizsgája van, az sajnos semmit nem ér, újra
kell tennie a Java SE 7 Programmer I vizsgát. Szerencsére az Oracle
eddigi gyakorlatával szakítva nem kötelező az Oracle tanfolyamok
elvégzése, csak erősen ajánlott. (Ezen tanfolyamok elérhetőek a vizsgák
oldalairól.) Persze akinek már megvan az SCJP vagy az OCPJP, az se
szomorkodjon, ugyanis létezik egy upgrade vizsga [1Z0-805 - Upgrade to
Java SE 7
Programmer](http://education.oracle.com/pls/web_prod-plq-dad/db_pages.getpage?page_id=41&p_org_id=&lang=&p_exam_id=1Z0_805)
néven. Itt a témakörök: Java 7 nyelvi újdonságai, tervezési minták,
JDBC, párhuzamos programozás új elemei, lokalizáció és a Java File I/O
(NIO.2).

A többi dolog alapjában véve megmaradt, minden vizsgára jellemző, hogy
90 tesztkérdés, 140-150 perc, 60-77% megfelelés. Lesz könyv is [OCA/OCP
Java SE 7 Programmer I & II Study Guide (Exams 1Z0-803 & 804)
(Certification
Press)](http://www.amazon.com/Programmer-Study-Guide-1Z0-803-Certification/dp/0071772006).
A vizsgák ára darabja kb. 65 000 Ft, ez azonban több, mint régen, hiszen
most ugyanahhoz a szinthez két vizsgát kell letenni, így ennek
kétszeresével kell számolni.

Master szintű vizsga még nincs, arra várnunk kell, a hírek szerint
fejlesztés alatt. Azonban szerencsére még bármelyik régebbi vizsgával
(valamint az újból a Professional, azaz kettes szintűvel) is letehetők
az alábbi Oracle Certified Expert vizsgák: Java EE 6 Enterprise
JavaBeans Developer, Java EE 6 Java Persistence API Developer (e
kettőről már írtam
[korábban](/2011/02/21/ejb-es-jpa-developer-certified-expert.html)),
Java EE 6 Web Services Developer, Java Platform, EE 6 Web Component
Developer, Java ME 1 Mobile Application Developer. Java EE 7 még sehol,
valamint a 6-os sorozatból sem létezik Enterprise Architect, ahogyan az
5-öshöz volt (, feltehetőleg EE-ből ez lenne a Master szint).

A véleményem a vizsgáról azóta sem változott. Amíg az Oracle nem tesz
valamit itthon, addig ez nem lesz elfogadott, esetleg megkövetelt
vizsga. Viszont az ember kipróbálhatja önmagát, jó juttatás lehet ez a
cégek részéről, és mint felvételiztető is becsülöm azt, aki időt és
energiát áldozott a vizsga letételére, hiszen biztos, hogy tanult meg új
dolgokat, szélesedett a látóköre, és a fogalmakat és elnevezéseket is
ezentúl konzisztensen tudja használni, így könnyebb lesz vele a
kommunikáció. Viszont a vizsgától még nem lesz senki jó programozó.
