---
layout: post
title: Spring MVC String null-ként
date: '2010-10-05T08:58:00.000-07:00'
author: István Viczián
tags:
- spring
- java
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Amennyiben azt akarjuk, hogy a Spring MVC űrlap esetén, ha nem töltünk
ki egy beviteli mezőt, ne üres Stringet (`“”`), hanem `null` értéket állítson be
a megfelelő form objektum attribútumának, a
[StringTrimmerEditor](%3Ca%20href=%22http://static.springsource.org/spring/docs/3.0.x/spring-framework-reference/html/validation.html#beans-beans-conversion%22%3E)-t kell használnunk.

{% highlight java %}
@InitBinder
public void initBinder(WebDataBinder binder) {
  binder.registerCustomEditor(String.class, new StringTrimmerEditor(true));
}
{% endhighlight %}
