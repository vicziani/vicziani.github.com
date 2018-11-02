---
layout: post
title: JBoss portok
date: '2011-03-01T05:32:00.000-08:00'
author: István Viczián
tags:
- jboss
- java
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Amennyiben port ütközésünk van, ha a JBoss-t indítjuk, felmerülhet, hogy
állítsuk át a portokat (pl. a 8080 porton már ül egy Tomcat, vagy Oracle
XE admin felület). Vagy egyszerűen több JBoss példányt akarunk
elindítani.

Ekkor megtehetjük, hogy az összes portot átírjuk, de ebből [rengeteg
van, és rengeteg állományban kéne
átírnunk](http://community.jboss.org/wiki/UsingJBossBehindAFirewall).

De megtehetjük azt is, hogy bekonfiguráljuk, hogy a JBoss minden egyes
portszámhoz adjon hozzá egy standard számot. Ezt a
[ServiceBindingSet](http://community.jboss.org/wiki/ConfigurePorts)
osztálynak lehet megadni paraméterként (port offset), mely a JBoss
5.x-ben a
`\server\default\conf\bindingservice.beans\META-INF\bindings-jboss-beans.xml`
állományban van definiálva.

Itt láthatjuk, hogy több ilyen is van megadva, alapesetben a
`PortsDefaultBindings` érvényes, ahol nincs port eltolás. A
`Ports01Bindings`, mely `ports-01` néven fut, már 100-as eltolást alkalmaz.
Ennek aktiválásához indítsuk a JBosst a következő paranccsal:

```
run -Djboss.service.binding.set=ports-01
```
