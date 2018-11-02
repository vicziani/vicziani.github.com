---
layout: post
title: JPA persistence.xml entity-k
date: '2009-08-26T07:08:00.000-07:00'
author: István Viczián
tags:
- jpa
- java
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Amennyiben a webes alkalmazásunk nem a WAR, hanem egy, a lib-ben lévő
JAR entitásait akarja elérni, azokat elegendő a persistence.xml-ben a
&lt;class&gt; tag-ek között felsorolni.

Ezt háromszor érdemes használni:

-   Az entitásaink más JAR-ban vannak
-   Az entitásaink közül valamennyit ki akarunk hagyni, lsd.
    exclude-unlisted-classes
-   Java SE esetén, ha másképp nem működik az automatikus keresés

