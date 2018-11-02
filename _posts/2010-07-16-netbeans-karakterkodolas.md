---
layout: post
title: NetBeans karakterkódolás
date: '2010-07-16T06:30:00.000-07:00'
author: István Viczián
tags:
- netbeans
- java
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Maven projektben webes alkalmazás fejlesztésénél jól ismerte fel az
UTF-8 kódolású ékezetes karaktereket a forráskódban, JSP-ben, de
helytelenül a JS fájlokban.

A megoldás, hogy a NetBeans konfigurációs állományában
(`NETBEANS_HOME\etc\netbeans.conf`) deklarálni kell az
alapértelmezett kódolást:

netbeans_default_options=”... -J-Dfile.encoding=UTF-8”
