---
layout: post
title: VirtualBox image egyedi azonosító
date: '2011-10-11'
author: István Viczián
tags:
- virtualization

---

Történt, hogy egy VirtualBox image-et úgy akartam klónozni, hogy
lemásolom, és újra hozzáadom. Azért nem sikerült, mert minden image-hez
egy egyedi belső azonosítót (UUID) rendel, és ennek egyediségét
ellenőrzi. Egy image-hez új egyedi azonosítót a következő paranccsal
lehet rendelni:

    VBoxManage.exe internalcommands setvdiuuid image.vdi

Későbbi verzióban:

    VBoxManage.exe internalcommands sethduuid image.vdi 
