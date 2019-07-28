# JTechlog blog

A JTechLog blog és a hozzá tartozó oldalak forrása. GitHub Pages, Jekyll static site generatort használja.

viczian.istvan a gmail-en

## Poszt sablon

```
---
layout: post
title: Példa cím
date: '2018-10-29T23:10:00.007+02:00'
author: István Viczián
tags:
- JTechLog
- Blog
description: Rövid összefoglaló, ez jelenik meg pl. a Facebookon. Max. 108 - 110 karakter.
---

Bevezetés, mely az első oldalon, valamint az RSS-ben jelenik meg.

<!-- more -->

![Kép leírása](/img.png)

<a href="img.png" data-lightbox="post-images">![Kép leírása](/img_750.png)</a>

```java
public class HelloWorld {

}
```

### Képek

A képek beszúrása úgy történik, hogy amennyiben 750 pixelnél keskenyebb,
Markdown formátumban beszúrható.

Amennyiben 750 pixelnél szélesebb, át kell méretezni a következő
paranccsal:

    convert -resize 750x img.png img_750.png

Majd a fenti módon html taggel szúrandó be, mert akkor a böngésző nem visz át
a nagyobb képre, hanem a LightBox nyitja meg.
