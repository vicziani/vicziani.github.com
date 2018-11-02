---
layout: post
title: SSH bejelentkezés kulcspárral
date: '2011-01-26T02:01:00.000-08:00'
author: István Viczián
tags:
- ssh
- Linux
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Ha ssh-val akarunk egy szerverre bejelentkezni, akkor jelszó helyett
használhatunk kulcspárt is. Ehhez azonban az kell, hogy a kulcspár
publikus részét fel kell másolni a `~/.ssh` könyvtárba, `authorized_keys`
néven. Amire nagyon kell figyelni, hogy csak akkor működik, ha mind a
könyvtárnak, mind a fájlnak megfelelő jogosultság van adva, konkrétan:

    chmod 0700 ~/.ssh
    chmod 0600 ~/.ssh/authorized_keys
