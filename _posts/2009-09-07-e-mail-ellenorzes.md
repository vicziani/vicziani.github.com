---
layout: post
title: E-mail ellenőrzés
date: '2009-09-07T04:10:00.000-07:00'
author: István Viczián
tags:
- spring
- struts
- java
modified_time: '2018-06-09T10:00:00.000-08:00'
---

A form-ok ellenőrzését végző modul a Struts 0.5 óta létezik valamilyen
formában, majd átkerült az [Apache Commons
Validator](http://commons.apache.org/validator/) projektbe, és a
Struts-ba ennek ennek Struts specifikus kiegészítései kerültek.

Az e-mail ellenőrzés a Sandeep V. Tamhankar által
írt [JavaScript](http://javascript.internet.com/forms/email-address-validation.html)
alapján történik.

Több probléma is van vele. Egyrészt beenged szóközöket az e-mail cím
elején és végén, valamint az e-mail cím domain részére sem végez
semmilyen ellenőrzést, még hosszt sem.

A [springmodules](https://springmodules.dev.java.net/) ugyanezt egy
saját reguláris kifejezés alapján végzi. A
org.springmodules.validation.valang.functions.EmailFunction osztály
tartalmazza:

```
\^((\[A-Za-z0-9\]+\_+)|(\[A-Za-z0-9\]+\\-+)|(\[A-Za-z0-9\]+\\.+)|(\[A-Za-z0-9\]+\\++))\*\[A-Za-z0-9\]+@((\\w+\\-+)|(\\w+\\.))\*\\w{1,63}\\.\[a-zA-Z\]{2,6}\$
```
