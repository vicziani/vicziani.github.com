---
layout: post
title: Java API for JSON processing
date: '2012-12-26T01:14:00.000+01:00'
author: István Viczián
tags:
- JSR
- JSON
- Java EE
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Úgy tűnik, az Oracle eléggé felpörgeti a Java EE 7 ([JSR
342](http://jcp.org/en/jsr/detail?id=342)) körüli munkálatokat, sorra
[jönnek ki a
hírek](https://blogs.oracle.com/jcp/entry/jsr_updates_java_ee_7) az
előrehaladásról. Erre szükség is van, hiszen bár a határidőt
[eltolták](http://jcp.org/en/jsr/detail?id=342#updates) 2012 harmadik
negyedévéről 2013 első negyedévére, még elég sok specifikáció Early
Draftban van.

A Java EE 7 újdonságai a JCACHE Java Temporary Caching API ([JSR
107](http://jcp.org/en/jsr/detail?id=107)), Concurrency Utilities for
Java EE ([JSR 236](http://jcp.org/en/jsr/detail?id=236)), Java API for
JSON Processing ([JSR 353](http://jcp.org/en/jsr/detail?id=353)), Java
API for WebSocket ([JSR 356](http://jcp.org/en/jsr/detail?id=356)) , és
a [már
említett](/2012/12/22/batch-application-for-java-platform-jsr.html)
Batch Applications for the Java Platform ([JSR
352](http://jcp.org/en/jsr/detail?id=236)). A többi specifikáció nem új,
hanem csak egy új verzió jön ki belőlük.

A mostani poszt témája a Java API for JSON Processing ([JSR
353](http://jcp.org/en/jsr/detail?id=353)), melynek Public Review-ja
2012\. december 22-től zajlik. Az JSR oldalán a megszokottakkal
ellentétben semmilyen specifikáció nem olvasható, helyette csak az API-t
lehet letölteni. Szerencsére a frissebb JCP-nek megfelelően a szabvány
fejlesztése átlátható, minden információ megtalálható a projekt
[honlapján](http://json-processing-spec.java.net/). Az API-t a Batch
Applications for the Java Platform szabványhoz hasonlóan szintén újra
feltalálták, méghozzá Jitendra Kotamraju (Oracle) vezetésével, bár a
támogatók között van a FasterXML cég, mely a [Jackson streaming JSON
parser](http://jackson.codehaus.org/)-ért felelős, valamint Doug
Crockford, kinek [nagy szerepe volt](http://json.org/) a JSON
elterjesztésében. Mivel specifikációról beszélünk, az implementációk
cserélhetőek lesznek (plug-in provider), és külön [referencia
implementációval](http://java.net/projects/jsonp/) is rendelkezik.

A JSON kezelés elég gyakori manapság, ezért kívánják szabványosítani a
Java berkein belül. Azonban a JSON kezelést két részre kell felbontani.
Az egyik a feldolgozás és parse-olás, a másik a binding, mely Java
objektumokat feleltet meg JSON struktúrákkal. (Ez a kettősség fennáll az
XML esetén is, az előbbire a JAXP, az utóbbira a JAXB ad megoldást.) A
Java API for JSON processing csak az előbbivel foglalkozik, ráadásul
kétféle módon. Egyrészt áll egy Streaming API-ból, mely a StAX API-hoz
hasonlít, valamint egy Object model-ből, mely a DOM API-ra hajaz. A
Streaming API csak olvasásra használatos, és a JsonParser interfész a
kulcs, ami egy pull parser, azaz mi tudjuk irányítani a feldolgozást,
pl. a next() metódus segítségével. Az Object model esetén a JsonReader
és JsonWriter használandó, mellyel írni és olvasni is tudunk, és a
DOM-hoz hasonlóan a teljes reprezentáció felépül a memóriában. Modern
API-hoz méltóan hemzseg tervezési mintáktól. Ritkán fogunk vele
közvetlenül találkozni, hiszen általában valamilyen binding megoldást
használunk, de amennyiben mégis natívan akarunk JSON-t feldolgozni, a
Java EE 7-től kezdődően már szabványos módon tehetjük.
