---
layout: post
title: Windows7 telepítése VirtualBoxon
date: '2012-05-10'
author: István Viczián
tags:
- windows
- virtualization

---

A hálózat nem akart működni NAT módban, mert a Windows7-en nem
telepítődött a hálózati kártya driver. A megoldás, hogy át kell állítani
a hálózati kártyát Intel PRO/1000 MT Desktop (82540EM) kártyára. Ezt
csak úgy lehet, ha le van állítva a virtuális gép, mert különben szürke,
read-only.

![Windows7 telepítése VirtualBoxon](/artifacts/posts/2012-05-10-windows7-telepitese-virtualboxon/windows7_virtualbox.png)
