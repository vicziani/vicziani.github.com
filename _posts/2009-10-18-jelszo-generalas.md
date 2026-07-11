---
layout: post
title: Jelszó generálás
date: '2009-10-18'
author: Viczián István
tags:
- Egyéb nyelvek
- Módszertan

---

Hogyan generáljunk magunknak nyolc karakter hosszú jelszót Linux
parancssorban?

```
openssl rand -base64 20 | tr -d '/' | cut -c1-8
```