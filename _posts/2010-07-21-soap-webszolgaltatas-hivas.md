---
layout: post
title: SOAP webszolgáltatás hívás parancssorból
date: '2010-07-21T10:03:00.000-07:00'
author: István Viczián
tags:
- SOAP
modified_time: '2018-06-09T10:00:00.000-08:00'
---

A curl parancssoros alkalmazás (Linux-on simán, Windows-on pl.
Cygwin-nel futtatható) segítségével tudunk pl. HTTP POST műveletet
végrehajtani, és paraméterezni tudjuk, hogy mit küldjön HTTP fejlécben
és törzsben. Így egy web szolgáltatás hívás HTTP-n a következőképp néz
ki:

    curl -H "Content-Type:text/xml; charset=UTF-8" -d@request.xml http://jtechlog.hu/service

Itt a request.xml állomány tartalmazza a kérést XML formátumban (SOAP
Envelope). Nagyon figyeljünk arra, hogy ne legyen a -d kapcsoló után
szóköz!

Amennyiben ezt meg is akarjuk formázni, használhatjuk a parancssori
XMLStarlet eszközt. Szintén letölthető Linux-ra és Windows-ra is.

    curl -H "Content-Type:text/xml; charset=UTF-8" -d@request.xml  http://jtechlog.hu/service | xml.exe fo
