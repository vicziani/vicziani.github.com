---
layout: post
title: StringBuffer
date: 2002-12-03T08:00:00.000+01:00
author: Viczián István
tags:
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Annyira közhely számba megy, hogy most már muszáj itt is szerepeltetnem,
hogy mennyire nem jó, ha `String` objektumokat + művelettel
konkatenálunk, ahelyett, hogy a `StringBuffer` osztályt alkalmaznánk.

Nézzük a következő kódot, ahol az egyik metódus az egyik, a másik a
másikat használja.

    public class Test {

    public void good() {
    StringBuffer sb = new StringBuffer();
    for (int i = 0; i < 10; i++) {
    sb.append("a");
    }
    System.out.println(sb);
    }

    public void bad() {
    String s = new String();
    for (int i = 0; i < 10; i++) {
    s += "a";
    }
    }

    }

Ha lefordítjuk, és utána ráengedjük a javap utilt (javap -c Test), akkor
láthatjuk, a disassemblált kódot.

A rossz megoldásnál a ciklus törzsében mindig létrehoz egy
`StringBuffer`-t, és a két szöveget hozzákapcsolja, majd meghívja a
`toString` metódust. Mint tudjuk, a példányosítás elég erőforrásigényes
művelet, így sokat takarítunk meg, ha csak egyszer fut le.
