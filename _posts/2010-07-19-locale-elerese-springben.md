---
layout: post
title: Locale elérése Springben
date: '2010-07-19T04:37:00.000-07:00'
author: István Viczián
tags:
- spring
- java
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Előfordul, hogy többnyelvű alkalmazás esetén a felhasználó által
kiválasztott Locale-hoz szeretnénk hozzáférni. Gyakori lehet ez pl.
validatorban. Erre az egyszerű megoldás:

{% highlight java %}
Locale locale = LocaleContextHolder.getLocale();
{% endhighlight %}
