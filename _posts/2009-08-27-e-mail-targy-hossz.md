---
layout: post
title: E-mail tárgy hossz
date: '2009-08-27T10:02:00.000-07:00'
author: István Viczián
tags:
- email
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Az e-mail formátumát az [RFC 822](http://ietf.org/rfc/rfc822.txt),
illetve annak korszerűsített változata, a [RFC
2822](http://ietf.org/rfc/rfc2822.txt) írja le. A hossz korlátot sorra
ad meg, méghozzá 998 karaktert, de a 78 karaktert javasolja. A tárgy
(subject) egy fejléc mező (header field). A fejléc mezőknél azonban, ha
hosszabbak, mint a kötelező vagy javasolt hossz, több sorra lehet törni,
ezt nevezik “folding”-nak. Tehát a mezők hossza így nem korlátos. Sajnos
a 998 és 78 számokat másképp is szokták értelmezni, olvastam olyan
értelmezést, hogy 998 karakter lehet maximum, de 78 karakterenként törni
kell (a szabvány nem ezt mondja).

Persze a különböző implementációk ezt máshogy valósítják meg. A GMail
pl. maximum 250 karaktert enged küldeni, a többit levágja. Ezt egy
sorban küldi, nem veszi figyelembe a 78 karakteres ajánlást. Van aki a
64 KB-ra esküszik.
