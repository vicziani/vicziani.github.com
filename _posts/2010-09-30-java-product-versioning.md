---
layout: post
title: Java Product Versioning
date: '2010-09-30T16:00:00.000'
author: István Viczián
tags:
- java
modified_time: '2018-06-09T10:00:00.000-08:00'
---

A [Java Product
Versioning](http://download.oracle.com/javase/6/docs/technotes/guides/versioning/spec/versioningTOC.html),
mely a JDK része, írja le, hogy hogyan lehet a különböző csomagokat
verziózni.

Ezen információkat a `META-INF/MANIFEST.MF` állományban kell megadni. A
csomagokra vonatkozó információkat üres sorral kell egymástól
elválasztani.

Pl:

    Manifest-version: 1.0

    Name: java/util/
    Specification-Title: "Java Utility Classes"
    Specification-Version: "1.2"
    Specification-Vendor: "Sun Microsystems Inc.".
    Package-Title: "java.util"
    Package-Version: "build57"
    Package-Vendor: "Sun Microsystems. Inc."

Utána ezt le is lehet kérdezni a `Package` osztály metódusaival, pl.:

{% highlight java %}
package java.util;

public class Test {
  public static void main(String[] args) {
    System.out.println(Test.class.getPackage().getSpecificationTitle() );
  }
}
{% endhighlight %}

A különleges az egészben, hogy ez kicsomagolva nem működik, kizárólag
JAR-ból futtatva, valamint nem működik WAR állományoknál sem, bárhova is
tesztem a `MANIFEST.MF`-et.
