---
layout: page
title: Falling Gems játék
description: Falling Gems, Java logikai és ügyességi játék
keywords: Java, logikai és ügyességi játék
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

<div class="text-center">
  <img src="/assets/img/fallinggems.png" class="img-fluid" alt="Falling Gems">
</div>

A játék letölthető 
[jar fájlként](https://github.com/vicziani/jtechlog-falling-gems/releases/download/1.0.0/jtechlog-falling-gems-1.0.0.jar),
és a `java -jar jtechlog-falling-gems-1.0.0.jar` paranccsal futtatható.
A forráskódja elérhető a
[GitHub-on.](http://github.com/vicziani/jtechlog-falling-gems)