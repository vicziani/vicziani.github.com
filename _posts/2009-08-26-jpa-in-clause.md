---
layout: post
title: JPA IN clause
date: '2009-08-26T07:50:00.000-07:00'
author: István Viczián
tags:
- jpa
- java
modified_time: '2018-06-09T10:00:00.000-08:00'
---

JPA 1.0 esetén az IN (‘a’, ‘b’, ‘c’) clause dinamikus paraméterekkel nem
értelmezett, pl: IN (:params), ahol a paraméter pl. egy
java.util.List&lt;String&gt; típusú objektum. Azonban a Hibernate
támogatja, szóval az alatt működik. A JPA 2.0 már támogatja, de nem kell
zárójel a paraméter köré.
