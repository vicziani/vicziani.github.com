---
layout: post
title: Log4J appender additivity
date: '2009-08-29T17:24:00.000'
author: István Viczián
tags:
- log4j
- java

---

Log4j-nél, ahogy a Logger-ek fa hierarchiát alkotnak, öröklődik, hogy
mely appender-re továbbítja a napló üzenetet a Logger. Azaz ha pl. a
rootLogger-nek be volt állítva egy stdout appender, ami a konzolra
naplóz, meg egy foo.bar Logger-nek, hogy fájlba, akkor a foo.bar-on
naplózott üzenet mindkát appender-re továbbításra fog kerülni. Ez az
appender additivity, és alapesetben true. Ezt megfelelő konfigurációval
ki lehet kapcsolni.
