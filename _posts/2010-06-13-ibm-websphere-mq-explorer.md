---
layout: post
title: IBM WebSphere MQ Explorer
date: '2010-06-13T08:42:00.000-07:00'
author: István Viczián
tags:
- mq
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Az IBM WebSphere MQ Explorer (Eclipse alapú admin felület) telepítése
után magyarul írta ki a dolgokat, így nem értettem, mit mond. Ezt
gyorsan vissza lehet állítani:

-   Nyisd meg az `<InstallDir>/Eclipse
    SDK30/eclipse/configuration/config.ini` állományt (nálam: `C:\Program Files\IBM\WebSphere MQ\eclipseSDK33\eclipse\configuration\config.ini`)
-   Írd be a következő két sort:

```
org.osgi.framework.language=en
osgi.nl=en_US
```

Az Eclipse újraindítása után már angolul fog beszélni.
