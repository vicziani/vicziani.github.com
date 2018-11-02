---
layout: post
title: HTML default button
date: '2009-11-05T05:10:00.000-08:00'
author: István Viczián
tags:
- javascript
- html
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Default buttonnak nevezzük azt a gombot, mely megnyomásra kerül abban
az esetben, ha nem egy gombon, hanem egy beviteli mezőn van a fókusz, és
a felhasználó egy Enter billentyűt nyom.

Erre természetesen a HTML-ben nincs támogatás, a form-on lévő első gomb
kerül megnyomásra. Láttam trükköket:

-   A default gombot definiáló html részletet elhelyezik REJTVE a form
    elején is, így az kerül megnyomásra
-   A többi gombot nem `submit`-ként, hanem `button`-ként definiálják, és
    JavaScript submitol
-   A beviteli mezőkön kezelik az Enter gomb lenyomását. Ezt
    választottam, erre [itt van egy egyszerű JQuery-s
    megoldás](http://greatwebguy.com/programming/dom/default-html-button-submit-on-enter-with-jquery/).
