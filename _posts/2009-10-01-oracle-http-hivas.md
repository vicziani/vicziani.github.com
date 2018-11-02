---
layout: post
title: Oracle http hívás
date: '2009-10-01T16:32:00.000'
author: István Viczián
tags:
- oracle
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Amikor Oracle 9i-ben tárolt eljárásból próbáltunk HTTP hívást
kezdeményezni, minden remekül ment. De amikor elkezdtünk RAC-t
használni, hibába botlottunk. Következő volt a forgatókönyv:

-   Írtunk egy táblába
-   Commit
-   HTTP hívás egy másik rendszer felé
-   A másik rendszer ennek hatására az előbbi táblából olvasott
-   Választ írt ugyanabba a táblába
-   Commit

Ha nem azonos RAC lábon futott a két - egymástól független - session
(egyik és másik rendszer), úgy elég gyakran nem tudta beolvasni a másik
lábon már commitált sorokat.
