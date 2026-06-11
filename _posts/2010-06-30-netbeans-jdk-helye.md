---
layout: post
title: NetBeans JDK helye
date: '2010-06-30'
author: István Viczián
tags:
- NetBeans
- java

---

A JDK új verziójának feltelepítésekor, és az előző eltávolításakor az
más könyvtárba kerül, így mikor a NetBeanst indítod, a következő
hibaüzenetet kapod:

    Cannot locate java installation in specified jdkhome:
    C:\Kaffe\jdk1.6.0_20
    Do you want to try to use default version?

Ekkor a NetBeans telepítési könyvtárában a etc/netbeans.conf
állomány netbeans\_jdkhome paraméterét kell átszerkezteni.
