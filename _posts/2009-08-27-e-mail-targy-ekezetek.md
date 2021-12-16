---
layout: post
title: E-mail tárgy ékezetek
date: '2009-08-27T13:26:00.000-07:00'
author: István Viczián
tags:
- email
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Az RFC 2822-ben a karakterkódolás 7 bites, azaz csak ASCII karaktereket
tartalmazhat, ezért az ékezetes karaktereknél valamit trükközni kell. Az
[RFC 2047](http://tools.ietf.org/html/rfc2047)-es írja le, az ún. MIME
encoded word formátumot. Ezt az összes fejlécnél használni lehet. Ez a
következőképp néz ki:

    =?charset?encoding?encoded text?=

A charset írja le az eredeti szöveg kódolását (IANA-nál regisztrált), az
encoding pedig azt, hogy ezt hogyan képzi le 7 bitre. Ez utóbbi lehet Q,
azaz Q-encoding, mely hasonló a quoted-printable kódoláshoz, és B, azaz
base64 kódolás. Utána következik a kódolt szöveg.

De hogy függ ez össze a hosszal? Ugyanis a kódolás után a szöveg mérete
megnő, base64 esetén pl. az eredeti szöveg 4/3-ra, és még hozzá kell
tenni a charset-et és az encoding-ot, valamint az elválasztó
karaktereket. A válasz, hogy megvalósításfüggő. A GMail esetén ha pl.
olyan ékezetes karaktereket használok, mely belefér a ISO-8859-1-ba,
akkor úgy kódol, ha nem, akkor UTF-8. És függetlenül, hogy hány
karakterre kódolódik, mindig 250 karaktert enged átvinni.

Az árvíztűrő tükörfúrógép GMail tárgy-ban (Show original):

    =?UTF-8?B?w6FydsOtenTFsXLFkSB0w7xrw7ZyZsO6csOzZ8OpcA==?=
