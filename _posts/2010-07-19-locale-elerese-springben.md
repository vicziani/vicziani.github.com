---
layout: post
title: Locale elérése Springben
date: '2010-07-19'
author: István Viczián
tags:
- Java
- Spring

---

Előfordul, hogy többnyelvű alkalmazás esetén a felhasználó által
kiválasztott Locale-hoz szeretnénk hozzáférni. Gyakori lehet ez pl.
validatorban. Erre az egyszerű megoldás:

```java
Locale locale = LocaleContextHolder.getLocale();
```
