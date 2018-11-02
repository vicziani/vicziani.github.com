---
layout: post
title: Windows7 telepítése VirtualBoxon
date: '2012-05-10T04:02:00.001-07:00'
author: István Viczián
tags:
- windows
- virtualization
modified_time: '2018-06-09T10:00:00.000-08:00'
---

A hálózat nem akart működni NAT módban, mert a Windows7-en nem
telepítődött a hálózati kártya driver. A megoldás, hogy át kell állítani
a hálózati kártyát Intel PRO/1000 MT Desktop (82540EM) kártyára. Ezt
csak úgy lehet, ha le van állítva a virtuális gép, mert különben szürke,
read-only.

![Windows7 telepítése VirtualBoxon](/artifacts/posts/2012-05-10-windows7-telepitese-virtualboxon/windows7_virtualbox.png)
