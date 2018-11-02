---
layout: post
title: VirtualBox image egyedi azonosító
date: '2011-10-11T05:16:00.000-07:00'
author: István Viczián
tags:
- virtualization
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Történt, hogy egy VirtualBox image-et úgy akartam klónozni, hogy
lemásolom, és újra hozzáadom. Azért nem sikerült, mert minden image-hez
egy egyedi belső azonosítót (UUID) rendel, és ennek egyediségét
ellenőrzi. Egy image-hez új egyedi azonosítót a következő paranccsal
lehet rendelni:

    VBoxManage.exe internalcommands setvdiuuid image.vdi

Későbbi verzióban:

    VBoxManage.exe internalcommands sethduuid image.vdi 
