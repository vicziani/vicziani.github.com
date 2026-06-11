---
layout: post
title: IBM WebSphere MQ licence
date: '2011-10-12'
author: István Viczián
tags:
- mq

---

Az IBM WebSphere MQ az IBM-től publikusan [letölthető
trial](https://www.ibm.com/products/mq) telepítőkészlete
semmiben nem különbözik a nem trial változattól. Nyugodtan
feltelepíthető, és upgrade-elhető, csupán egy licence fájlra van
szükségünk, melynek neve `amqpcert.lic`.

Ezt a következő paranccsal tudjuk telepíteni:

    setmqprd amqpcert.lic
