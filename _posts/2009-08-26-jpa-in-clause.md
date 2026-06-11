---
layout: post
title: JPA IN clause
date: '2009-08-26'
author: István Viczián
tags:
- jpa
- java

---

JPA 1.0 esetén az IN (‘a’, ‘b’, ‘c’) clause dinamikus paraméterekkel nem
értelmezett, pl: IN (:params), ahol a paraméter pl. egy
java.util.List&lt;String&gt; típusú objektum. Azonban a Hibernate
támogatja, szóval az alatt működik. A JPA 2.0 már támogatja, de nem kell
zárójel a paraméter köré.
