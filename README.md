# JTechlog blog

A JTechLog blog és a hozzá tartozó oldalak forrása. GitHub Pages, Jekyll static site generatort használja.

viczian.istvan a gmail-en

## Poszt sablon

```
---
layout: post
title: Példa cím
date: '2018-10-29'
author: István Viczián
tags:
- JTechLog
- Blog
description: Rövid összefoglaló, ez jelenik meg pl. a Facebookon. Max. 108 - 110 karakter.
image: /artifacts/posts/pelda/og.png
last_modified_at: '2023-10-10'
---

Bevezetés, mely az első oldalon, valamint az RSS-ben jelenik meg.

<!-- more -->

![Kép leírása](/img.png)

<a href="/artifacts/posts/slug/img.png" class="glightbox">![Kép leírása](/artifacts/posts/slug/img_750.png)</a>

```java
public class HelloWorld {

}
```

## Méretek

A fő div 856 pixel.

Jelenleg 99 karakter fér ki a forráskódból.

Az OG kép mérete 1200 × 630 pixel.

LinkedIn-re javasolt kép 1200 × 1200 pixel.

### Képek

A képek beszúrása úgy történik, hogy amennyiben a fő div-nél keskenyebb,
Markdown formátumban beszúrható.

Amennyiben szélesebb, át kell méretezni a következő
paranccsal:

    convert -resize 750x img.png img_750.png

Majd a fenti módon html taggel szúrandó be, mert akkor a böngésző nem visz át
a nagyobb képre, hanem a GLightbox nyitja meg.

### Sortörés kötőjelnél

Ha nem akarjuk, hogy megtörje a sort egy kötőjelnél, akkor a CSS `nowrap` értéket használjuk,
pl. ``<span style="white-space: nowrap;">`Premain-Class`</span>``
