---
layout: post
title: Jelszó generálás
date: '2009-10-18T04:58:00.000-07:00'
author: István Viczián
tags:
- Linux
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Hogyan generáljunk magunknak nyolc karakter hosszú jelszót Linux
parancssorban?

```
openssl rand -base64 20 | tr -d '/' | cut -c1-8
```