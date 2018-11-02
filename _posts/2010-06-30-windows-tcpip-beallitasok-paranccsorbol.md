---
layout: post
title: Windows TCP/IP beállítások paranccsorból
date: '2010-06-30T07:48:00.000-07:00'
author: István Viczián
tags:
- Windows
- hálózat
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Előfordult már, hogy több környezetben dolgozol, és minden környezetben
más a hálózati beállítások? Pl. az egyik helyen statikus ip-cím, a másik
helyen DHCP?

Ilyenkor lehet a Hálózati kapcsolatok ablakban a Helyi kapcsolatnál a
TCP/IP protokoll tulajdonságait állítani.

De jó hír, hogy ezt parancssorból is meg lehet tenni, és ilyenkor elég
pár bat állományt létrehozni, környezetenként.

Példa a statikus ip-címre (ip-cím, alhálózati maszk, gateway, dns):

    netsh interface ip set address name="Helyi kapcsolat" static 172.16.96.69 255.255.255.0 172.16.96.254 1
    netsh interface ip set dns "Helyi kapcsolat" static 172.16.69.254

Példa a dinamikus ip-címre:

    netsh interface ip set address "Helyi kapcsolat" dhcp
    netsh interface ip set dns "Helyi kapcsolat" dhcp
