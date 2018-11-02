---
layout: post
title: JAXB hibák
date: '2009-09-28T12:19:00.000-07:00'
author: István Viczián
tags:
- jaxb
- java
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Amennyiben az XJC a következő hibaüzenetet írja, a probléma, hogy az xjb
állományban ugyanarra a névtérre több definíció lett megadva. Ez nálam
akkor történt, mikor egy névtér több XSD-ben volt szétszórva, és
többször adtam meg az xjb állományban.

    Multiple <schemaBindings> are defined for the target namespace

A következő Exception akkor jött, mikor szerepelt az XSD-ben a
complexType-ban a mixed attribútum. Megoldást csak ennek eltávolítása
jelentette.

    parsing a schema...
    Exception in thread "main" java.lang.NullPointerException
            at com.sun.tools.internal.xjc.reader.xmlschema.BGMBuilder._getBindInfoReadOnly(BGMBuilder.java:392)
            at com.sun.tools.internal.xjc.reader.xmlschema.BGMBuilder.getBindInfo(BGMBuilder.java:376)
            at com.sun.tools.internal.xjc.reader.xmlschema.BGMBuilder.getLocalDomCustomization(BGMBuilder.java:414)
            at com.sun.tools.internal.xjc.reader.xmlschema.RawTypeSetBuilder.particle(RawTypeSetBuilder.java:85)
            at com.sun.tools.internal.xjc.reader.xmlschema.RawTypeSetBuilder.build(RawTypeSetBuilder.java:49)
            at com.sun.tools.internal.xjc.reader.xmlschema.ct.MixedComplexTypeBuilder.build(MixedComplexTypeBuilder.java:46)
            at com.sun.tools.internal.xjc.reader.xmlschema.ct.ComplexTypeFieldBuilder.build(ComplexTypeFieldBuilder.java:64)
