---
layout: post
title: NetBeans JDK helye
date: '2010-06-30T07:54:00.000-07:00'
author: István Viczián
tags:
- NetBeans
- java
modified_time: '2018-06-09T10:00:00.000-08:00'
---

A JDK új verziójának feltelepítésekor, és az előző eltávolításakor az
más könyvtárba kerül, így mikor a NetBeanst indítod, a következő
hibaüzenetet kapod:

    Cannot locate java installation in specified jdkhome:
    C:\Kaffe\jdk1.6.0_20
    Do you want to try to use default version?

Ekkor a NetBeans telepítési könyvtárában a etc/netbeans.conf
állomány netbeans\_jdkhome paraméterét kell átszerkezteni.
