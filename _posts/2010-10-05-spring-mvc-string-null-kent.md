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
ki egy beviteli mezőt, ne üres Stringet (`""`), hanem `null` értéket állítson be
a megfelelő form objektum attribútumának, a
[StringTrimmerEditor](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/beans/propertyeditors/StringTrimmerEditor.html)-t kell használnunk.

{% highlight java %}
@InitBinder
public void initBinder(WebDataBinder binder) {
  binder.registerCustomEditor(String.class, new StringTrimmerEditor(true));
}
{% endhighlight %}
