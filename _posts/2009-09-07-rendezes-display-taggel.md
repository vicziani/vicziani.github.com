---
layout: post
title: Rendezés Display taggel
date: '2009-09-07'
author: Viczián István
tags:
- Java
- Spring
- Egyéb nyelvek

---

Táblázat megjelenítésére a [Display
tag](http://displaytag.sourceforge.net/1.2/) JSP taglib-et használjuk.
Rengeteg hasznos funkciója van, könnyű használat, CSS testre
szabhatóság, rendezés, lapozás, export különböző formátumokba, stb.

Amennyiben rendezést akarunk, egy oszlopnak be kell állítani a sortable
attribútumát true-ra. Ekkor azonban a DefaultComparator szerint rendez.
Ez amiatt nem jó, mert egyrészt megkülönbözteti a kis és nagybetűket
(utóbbi van előrébb a ábécében), és nem kezeli az ékezetes karaktereket.
Ehhez egy saját Comperator-t kell implementálnunk, egy saját HU locale
szerinti Collator-ral. A Display tag azonban nem képes a column tag-ek
közötti értékre rendezni, csak a megadott property attribútumra.
