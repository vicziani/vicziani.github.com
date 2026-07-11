---
layout: post
title: Oracle szekvencia növelés
date: '2010-09-14'
author: Viczián István
tags:
- Adatkezelés
- Egyéb nyelvek

---

Az Oracle szekvencia aktuális értékét nem lehet direkt módosítani. Jó
trükk, hogy átállítjuk, hogy mennyivel növekedjen, utána kérünk egy
következő szekvenciát, majd visszaállítjuk. Pl.:

    alter sequence seq_name increment by 124;

    select seq_name.nextval from dual;

    alter sequence seq_name increment by 1;
