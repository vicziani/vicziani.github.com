---
layout: post
title: Locale elérése Springben
date: '2010-07-19'
author: István Viczián
tags:
- spring
- java

---

Előfordul, hogy többnyelvű alkalmazás esetén a felhasználó által
kiválasztott Locale-hoz szeretnénk hozzáférni. Gyakori lehet ez pl.
validatorban. Erre az egyszerű megoldás:

{% highlight java %}
Locale locale = LocaleContextHolder.getLocale();
{% endhighlight %}
