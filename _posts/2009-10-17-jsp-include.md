---
layout: post
title: JSP include
date: '2009-10-17T13:45:00.000-07:00'
author: István Viczián
tags:
- jsp
- java
modified_time: '2018-06-09T10:00:00.000-08:00'
---

JSP-ben ugye létezik az include direktíva &lt;%@ include file=”abc.jsp”
%&gt;, és az include tag is &lt;jsp:include page=”abc.jsp” %&gt;. A
kettő között az a különbség, hogy az első az include-ált részletet
szövegszerűen, egy az egyben beilleszti a web konténer az eredeti
oldalba, míg a második esetében a jsp (talán helyesebb lenne a jsp
részlet - jsp fragment - jspf elnevezés) külön Java osztályra fordul le,
melyet az eredeti oldal metódushívással hívja. Az elsőt gyakran statikus
include-nak nevezik, mert fordítási időben történik, mikor a jsp-ből
Java osztály lesz (ez lehet build time, de gyakrabban deploy time, és a
web konténer végzi), a másodikat dinamikus include-nak.

Az elsőnek nem lehet dinamikus nevet átadni, mivel fordításkor nem
futtatja az oldalt a fordító. Viszont gyorsabb, hiszen nincs külön
metódushívás, stack kezelés.
