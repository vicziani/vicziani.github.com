---
layout: post
title: Spring Security context a hibaoldalon
date: '2009-09-30T07:00:00.000-07:00'
author: István Viczián
tags:
- spring
- java
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Használt technológiák: Spring Security 1

Volt egy [bug a Spring Security-ben](https://github.com/spring-projects/spring-security/issues/567) ami miatt hiba
oldalakra érve már nem volt meg a `SecurityContext`, de ezt azóta már
javították, így elég a `web.xml` fájlban a `springSecurityFilterChain`
filter mappingjét kiegészíteni:

```xml
<filter-mapping>
  <filter-name>springSecurityFilterChain</filter-name>
  <url-pattern>/*</url-pattern>
  <dispatcher>ERROR</dispatcher>
  <dispatcher>REQUEST</dispatcher>
</filter-mapping>
```
