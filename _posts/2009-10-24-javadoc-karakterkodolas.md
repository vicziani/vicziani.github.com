---
layout: post
title: JavaDoc karakterkódolás
date: '2009-10-24'
author: Viczián István
tags:
- Java
- Módszertan

---

Ha UTF-8-asak a forrásfájlok, akkor ahhoz, hogy jó JavaDoc dokumentációt
lehessen generálni, a következő paramétereket kell elhelyezni a
`build.xml` fájlban a `javadoc` targethez:


  encoding=”UTF-8”
  docencoding=”UTF-8”
  charset=”UTF-8”
