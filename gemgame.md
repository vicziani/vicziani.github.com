---
layout: default
title: Gem Game játék
description: Gem Game, Java logikai játék applet
keywords: Java, applet, logikai játék
---

# Gem Game

A Gem Game egy egyszerű ügyességi játék, melynek célja minél több pont
elérése. Pontokat az alsó táblák betelítésével lehet szerezni. A
játéktéren elhelyezkedő objektumok a nagy felső tábla, illetve a négy
kis alsó tábla. A nagy tábla folyamatosan, egyre gyorsabban, telik meg
új oszlopokkal, és ha ez betelt, akkor a játéknak vége van. A felső
tábláról eltüntetni oszlopokat az alsó kis táblák egyikébe lehet, melyek
közül az aktuálisat a középső kis tábla mutatja, illetve a jelzőtáblák
közül az sötétebb. Váltani a kis jelzőtáblákra való kattintással lehet.
Tehát ha a "lyuk" fölötti oszlopra kattintasz, akkor az lecsúszik az
alsó kis tábla megfelelő oszlopába, és annyi pontot kapsz, ahány színes
kis négyzet volt a leejtett oszlopban. A szürke négyzettel jelzett
rublikák nem változnak, míg a színes négyzettel jelzett rublikák
színessé válnak az alsó táblában.

Az alsó táblák megtöltését segítik, hogy a felső táblát jobbra-balra
mozgatni lehet, ha a nagy tábla melletti nyilakra klikkelünk. Az alsó
táblát is lehet mozgatni jobbra-balra, ha a kis tábla és a jelzők
közötti nyilakra klikkelünk. Illetve forgathatjuk is, ha rá klikkelünk.
Ha egy kis alsó tábla azonos színű négyzetekkel betelik, akkor az üressé
fog válni. Minden 50. pont után nőni fog az új oszlopok érkezési
sebessége.

<!--[if !IE]>-->
<object classid="java:GemGameApplet.class" archive="artifacts/gem-game.jar"
	type="application/x-java-applet"
	width="600" height="206">
<!--<![endif]-->
<object classid="clsid:8AD9C840-044E-11D1-B3E9-00805F499D93" 
		type="application/x-java-applet"
		width="600" height="206">
	<param name="archive" value="artifacts/gem-game.jar" />
	<param name="code" value="GemGameApplet" />
<!--[if !IE]>-->
</object>
<!--<![endif]-->
</object>

A játék forráskódja elérhető a
[GitHub-on.](http://github.com/vicziani/jtechlog-gem-game)

A játék futtatásához Java szükséges, melyet letölthetsz a
[http://www.java.com](http://www.java.com) címről.

A játék Java Web Start-tal is indítható, így ha a Java telepítve van a
gépeden, [és ide kattintasz](artifacts/gemgame.jnlp), a játék a
számítógépedre kerül, akár az asztalra is integrálhatod és bármikor
futtathatod Internet elérés nélkül is.
