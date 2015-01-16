---
layout: default
title: Falling Gems játék
description: Falling Gems, Java ügyességi játék applet
keywords: Java, applet, ügyességi játék
---

# Falling Gems

A Falling Gems egy egyszerű logikai játék, melynek célja minél több pont
elérése. A köveket úgy kell mozgatni, hogy sorban vagy átlósan több 5
vagy több azonos színű kő legyen. Akkor azok eltűnnek, és annyi pontot
ér, ahány kő eltűnik. A játék körökre osztott. Ha nem sikerült
eltüntetni 5 vagy annál több követ, akkor újabb 3 kő esik a 9x9-es
táblára. Minden körben egy követ el lehet mozgatni egy másik helyre, de
a kő útjának szabadnak kell lennie. A játéknak vége, ha a tábla betelik.
A program kezelése kizárólag egérrel történik. Egy követ ki úgy lehet
kiválasztani, hogy rá kell klikkelni. Ekkor egy kis négyzet jelenik meg
a jobb alsó sarokban. A kiválasztást megszüntetni ismételt
ráklikkeléssel lehet. Mozgatni a kivánt helyre klikkeléssel kell.

<!--[if !IE]>-->
<object classid="java:FallingGemsApplet.class" archive="artifacts/falling-gems.jar"
	type="application/x-java-applet"
	width="610" height="216" class="applet">
<!--<![endif]-->
<object classid="clsid:8AD9C840-044E-11D1-B3E9-00805F499D93" 
		type="application/x-java-applet"
		width="600" height="206">
	<param name="archive" value="artifacts/falling-gems.jar" />
	<param name="code" value="FallingGemsApplet" />
<!--[if !IE]>-->
</object>
<!--<![endif]-->
</object>

A játék forráskódja elérhető a
[GitHub-on.](http://github.com/vicziani/jtechlog-falling-gems)

A játék futtatásához Java szükséges, melyet letölthetsz a
[http://www.java.com](http://www.java.com) címről.

A játék Java Web Start-tal is indítható, így ha a Java telepítve van a
gépeden, [és ide kattintasz](artifacts/fallinggems.jnlp), a játék a
számítógépedre kerül, akár az asztalra is integrálhatod és bármikor
futtathatod Internet elérés nélkül is.
