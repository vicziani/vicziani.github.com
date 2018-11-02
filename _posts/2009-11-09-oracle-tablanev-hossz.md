---
layout: post
title: Oracle táblanév hossz
date: '2009-11-09T07:15:00.000-08:00'
author: István Viczián
tags:
- jpa
- oracle
- java
modified_time: '2018-06-09T10:00:00.000-08:00'
---

JPA-ban a tábla és mező neveket képes a JPA provider generálni az
entitásaink osztály neve, valamint a property nevek alapján. Amennyiben
van két hosszú nevű entitásunk, és m:n kapcsolatban állnak egymással, a
kapcsolótábla Hibernate esetén úgy képződik, hogy a két entitás neve,
aláhúzásjellel elválasztva.

Az Oracle-ben a tábla- és mezőnevek max. 30 karakter hosszúak lehetnek,
így hibát fogunk kapni.

A @JoinTable annotációval lehet a kapcsolótábla nevét megmondani name
attribútumban.

Ha a mezőnevünk túl hosszú, akkor a @Column annotációt használjuk.

Itt egy
[PDF](http://www.oracle.com/technology/products/lite/pdf/lite_and_bigoracle_diff.pdf),
mely az Oracle és annak Lite verziója közötti különbségeket részletezi,
pl. az Oracle objektumok max. hosszait is megtalálhatjuk menne.
