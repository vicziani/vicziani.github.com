---
layout: post
title: JavaDoc karakterkódolás
date: '2009-10-24T04:00:00.000-07:00'
author: István Viczián
tags:
- javadoc
- java
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Ha UTF-8-asak a forrásfájlok, akkor ahhoz, hogy jó JavaDoc dokumentációt
lehessen generálni, a következő paramétereket kell elhelyezni a
`build.xml` fájlban a `javadoc` targethez:


  encoding=”UTF-8”
  docencoding=”UTF-8”
  charset=”UTF-8”
