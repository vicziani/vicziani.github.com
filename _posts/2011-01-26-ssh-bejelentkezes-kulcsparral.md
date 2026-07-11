---
layout: post
title: SSH bejelentkezés kulcspárral
date: '2011-01-26'
author: Viczián István
tags:
- Biztonság
- Egyéb nyelvek

---

Ha ssh-val akarunk egy szerverre bejelentkezni, akkor jelszó helyett
használhatunk kulcspárt is. Ehhez azonban az kell, hogy a kulcspár
publikus részét fel kell másolni a `~/.ssh` könyvtárba, `authorized_keys`
néven. Amire nagyon kell figyelni, hogy csak akkor működik, ha mind a
könyvtárnak, mind a fájlnak megfelelő jogosultság van adva, konkrétan:

    chmod 0700 ~/.ssh
    chmod 0600 ~/.ssh/authorized_keys
