---
layout: post
title: JAX-WS kötelező paraméter
date: '2009-08-27T02:09:00.000-07:00'
author: István Viczián
tags:
- jax-ws
- java
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Egy web szolgáltatás operációnál annak meghatározása, hogy egy paraméter
kötelező legyen, azaz a WSDL-ben a minOccurs=”1” szerepeljen nem
egyszerű feladat. Alapban nincs rá annotáció, hanem wrapper osztályt
kell írni. Ez a legegyszerűbben úgy kivitelezhető, ha java2wsdl/java2ws
eszközt a -wrapperClasses kapcsolóval hívod, ami legenerálja a wrapper
osztály vázát, amit aztán meg lehet szerkeszteni. Az @XmlElement
annotáció required=true attribútumát kell ott használni.

A JAX-WS jelenleg a 2.1-nél tart, és lehet, hogy a 2.2-esben megjelenik,
hogy a paramétert @XmlElement annotációval is el lehessen látni.
