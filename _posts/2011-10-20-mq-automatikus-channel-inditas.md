---
layout: post
title: MQ automatikus channel indítás
date: '2011-10-20T07:37:00.000-07:00'
author: István Viczián
tags:
- mq
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Amennyiben IBM WebSphere MQ-t használunk aszinkron üzenetátvitelre, pl.
JMS esetén, és az üzenetek több sorkezelőn (queue manager) mennek
keresztül, a sorkezelők között a kommunikációs kapcsolatot az egyirányú
csatornák (channel) kezelik. Ezek bizonyos timeout után lebomlanak.

Ahhoz, hogy ezeket ne kézzel kelljen elindítani, ún. channel
initializatort kell alkalmazni, mely egy sort figyel, és ha abba egy
üzenet érkezik, belöki a channeleket. Ezért, amennyiben azt akarjuk,
hogy egy üzenet küldés beindítsa a channelt, a transmission queue-ra
kell egy triggert raknunk, mely egy üzenetet tesz a channel
initializator sorába (`SYSTEM.CHANNEL.INITQ` alapértelmezetten).

Ehhez vagy az Explorerben a transmission queue tulajdonságai között a
trigger ablakon a trigger type-ot kell every-re állítani, és az
initialization queue-hoz kell beírni: `SYSTEM.CHANNEL.INITQ`.

Megadható script-tel is:

    ALTER QL(Q.XMIT) TRIGGER TRIGTYPE(EVERY) INITQ(SYSTEM.CHANNEL.INITQ)
