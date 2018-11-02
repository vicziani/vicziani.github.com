---
layout: post
title: Model-View-Controller
date: 2003-09-07T08:00:00.000+01:00
author: Viczián István
tags:
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Többször is szó esett az MVC technikáról, így most kifejtem, mit is
jelent az a 3 betű. A
[Model-View-Controller](http://www.enode.com/x/markup/tutorial/mvc.html%20)
rövidítése, ami nem más, mint egy tervezési minta a felhasználói
felületek megvalósításához. Először a Smalltalk-80 grafikus
framework-jében jelent meg, tulajdonképpen egy technika a prezentációs
réteg és az üzleti logika szétválasztására.

Három egymással kommunikáló objektumból áll, egyrészt a modellből, mely
a logikai reprezentációt végzi (tulajdonképpen ez a feldolgozó rész,
tartalmazza az adattárolást és a rajta végzett műveleteket), egy
viewból, mely a megjelenítést vezérli, hogy hogy legyen az adat
megjelenítve (output rész), illetve egy controller, mely a bevitelért
felelős, hogy reagáljon egy komponens a bevitelre (input).

Hogy miért is hasznos ez a technika, szemben azzal, hogy jelentős
tervezési és fejlesztési munkával jár? Egyrészt nagyban megkönnyíti a
karbantartást, hiszen átlátható, a GUI és a modell egymástól viszonylag
függetlenül módosítható, illetve egy modellhez több view-t is
regisztrálhatunk.

Sajnos azért nem ennyire egyszerű, főleg ha a [tervezési minták
felöl](http://c2.com/cgi/wiki?ModelViewControllerAsAnAggregateDesignPattern)
közelítjük meg a dolgot, hiszen többet is találunk benne. Egyrészt a
modell hierarchikus is lehet, ekkor a Composite pattern-ről beszélünk. A
modelltől a view felé a kapcsolat viszonylag laza, hiszen a modellnek
nem szükséges tudnia, hogy kik a view-k. Ekkor az Observer minta
használható, ahol a modell az observable és a view-k az observer-ek. Ezt
tipikusan eseményekkel valósítják meg. A cél az, hogy amint a modell
állapotot változtat, az összes view-nak (1-n kapcsolat) erről értesülnie
kell anélkül, hogy a modell tudná, mely view-ok figyelik. A visszafele
irány már szoros, hiszen a view-nak pontosan ismernie kell a modellt. A
controller-nek pontosan ismernie kell a modellt és a view-t is. A
view-tól a controller felé szintén lazább a kapcsolat, hiszen a
controller-nek cserélhetőnek kell lennie. A controller Strategy mintát
valósítja meg, aminek az a tartalma, hogy az algoritmuscsaládokat zárjuk
egységbe, és tegyük őket felcserélhetővé. Ezáltal az algoritmusok
cserélhetők az őket használó kliensek módosítása nélkül.

A [Swing
komponensei](http://java.sun.com/developer/onlineTraining/GUI/Swing2/shortcourse.html#JFCMVC)
is alapvetően az MVC mintára épülnek annyi változtatással, hogy a Sun
szakemberei összevonták a view és a controller objektumot, és
delegate-nek nevezték el. Ez azért logikus lépés, mert a kettő közti
kommunikáció megvalósítása általában bonyolult, pláne ha több view-ról
és controller-ről beszélünk. Másrészt pl. egy textfield logikusan maga
végzi a bevitelt és a megjelenítést is, illetve sok komponens beépített
kontroll elemeket is tartalmaz, pl. scrollbar-t egy szövegbeviteli mező.
Az IBM VisualAge for Java kitünően [támogatja az MVC
mintát](http://www.software.ibm.com/vad.nsf/Data/Document2672?OpenDocument&p=1&BCT=1&Footer=1).
