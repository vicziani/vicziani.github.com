---
layout: page
title: Gem Game játék
description: Gem Game, Java ügyességi és logikai játék
keywords: Java, logikai játék
---

# Gem Game

A Gem Game egy egyszerű ügyességi és logikai játék, melynek célja minél több pont
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

<div class="text-center">
  <img src="/assets/img/gemgame.png" class="img-fluid" alt="Gem Game">
</div>

A játék letölthető 
[jar fájlként](https://github.com/vicziani/jtechlog-gem-game/releases/download/1.0.0/jtechlog-gem-game-1.0.0.jar),
és a `java -jar jtechlog-gem-game-1.0.0.jar` paranccsal futtatható.
A forráskódja elérhető a
[GitHub-on.](http://github.com/vicziani/jtechlog-gem-game)