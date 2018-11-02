---
layout: post
title: Oracle szekvencia növelés
date: '2010-09-14T01:53:00.000-07:00'
author: István Viczián
tags:
- oracle
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Az Oracle szekvencia aktuális értékét nem lehet direkt módosítani. Jó
trükk, hogy átállítjuk, hogy mennyivel növekedjen, utána kérünk egy
következő szekvenciát, majd visszaállítjuk. Pl.:

    alter sequence seq_name increment by 124;

    select seq_name.nextval from dual;

    alter sequence seq_name increment by 1;
