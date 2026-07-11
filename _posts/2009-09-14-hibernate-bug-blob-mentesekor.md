---
layout: post
title: Hibernate bug blob mentésekor
date: '2009-09-14'
author: Viczián István
tags:
- Java
- Spring
- Egyéb nyelvek

---

Ismét más tollával ékeskedem.

[Ismert
bug](http://opensource.atlassian.com/projects/hibernate/browse/HHH-2680)
a Hibernate 3.2.2, 3.2.4.sp1 verzióiban biztos, hogyha van egy detached
entitásunk, beállítgatjuk a property-jeit, majd azt mondjuk, hogy
entityManager.merge(), akkor minden property mentésre kerül, kivéve azt,
amelyik Blob típusú.

Workaround, hogy beállítjuk az entitásunk szükséges property-jeit,
kivéve a blob típusút. Majd entityManager.merge(), és az általa
visszaadott, immáron attached entitáson beállítjuk a blob property-t
null-ra.
