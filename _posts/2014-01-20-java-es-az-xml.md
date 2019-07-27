---
layout: post
title: Java és az XML
date: '2014-01-20T00:23:00.000+01:00'
author: István Viczián
tags:
- xml
- Tesztelés
modified_time: '2019-07-27T10:00:00.000+02:00'
---

Frissítve: 2019. július 27.

Felhasznált technológiák: Java 12, JUnit 5, XmlUnit 2, Maven 3

Van pár régebbi anyagom, melyet szeretnék publikálni, mielőtt új témákba
kezdenék bele. Ebből egyik a Java XML kezeléséről szól, ami ugyan nem a
legforróbb terület manapság, azonban mégsem árthat egy kis összefoglaló.

Ehhez poszthoz is található egy [projekt a
GitHub-on](https://github.com/vicziani/jtechlog-xml), melyben rengeteg
példa van.

Java SE-n belül a The Java™ API For XML Processing (JAXP) API, specifikáció
felelős az XML feldolgozásért.

A JAXP-hez remek
[tutorial](http://docs.oracle.com/javase/tutorial/jaxp/) is található az
Oracle oldalán.

A JAXP-ben három parser található. A Simple API for XML (SAX), Document
Object Model (DOM) és a Streaming API for XML (StAX). A
[SAX](http://www.saxproject.org/) (mely egy de facto szabvány) egy push
parser, a [DOM](http://www.w3.org/DOM/) (mely egy W3C szabvány)
memóriában felépíti a teljes fát és a StAX pedig egy pull parser, és
önmagán belül is még két lehetőséget tartalmaz parse-olásra. Mindegyikre
található példa a példa alkalmazásban, és a StAX-ról régebben egy
[posztot is írtam](/2009/11/30/stax.html).

XML séma (XSD) alapján validálni a `Validator` osztállyal lehetséges, a
`Schema` betöltése `SchemaFactory`-val történik. DTD alapján nem tud
validálni, ha mégis ilyent szeretnénk, akkor a parsernél kell a
validációt beállítani.

A `TransformerFactory` és `Transformer` osztályok használatával lehet
XML transzformációkat végezni.

A JAXP XPath kiértékelési lehetőségeit a `XPathFactory` osztályon és
`XPath` interfészen keresztül lehet kihasználni.

A JAXP minden része fel van szerelve névterek kezelésére is.

A JAXP specifikációt megvalósító két Apache projekt került a JDK-ba, az egyik az XML
parse-olást végző [Xerces2](http://xerces.apache.org/xerces2-j/), a
másik az XML transzformációt végző
[Xalan-Java](http://xalan.apache.org/xalan-j/index.html). A JDK `/legal/java.xml`
könyvtárában lévő fájlok alapján a 12.0.2 verzióba a Xerces 2.11.0,
a Xalan 2.7.2 verziója került bele.

Gyakorlatilag annyi történt, hogy a csomag neve elé még betették a
`com.sun.org` előtagot.

Mivel a JAXP csak egy API, könnyen lehet az implementációt is cserélni
alatta. Ennek mikéntje a Java API
`DocumentBuilderFactory` `newInstance()`
metódusánál [van leírva](https://docs.oracle.com/en/java/javase/12/docs/api/java.xml/javax/xml/parsers/DocumentBuilderFactory.html#newInstance()).

Az XML funkciók unit tesztelésére alkalmas az
[XMLUnit](http://xmlunit.sourceforge.net/) könyvtár, mely képes XML dokumentumok
összehasonlításra (nem szöveg összehasonlítás), XPath kifejezések
futtatására, validációra és transzformációk ellenőrzésére.

Amennyiben két XML-t szeretnénk struktúrálisan összehasonlítani, a 
következő kódrészletet alkalmazhatjuk. A legegyszerűbb az `XmlAssert`
használata, mely egy AssertJ assert, ezért a `org.xmlunit:xmlunit-core` artifacton túl
a `org.xmlunit:xmlunit-assertj` függőséget is fel kell vennünk.

```java
XmlAssert.assertThat(actual).and(expected).areSimilar();
```

Az `actual` változó tartalmazza a visszakapott XML dokumentumot, amit ellenőrizni
szeretnénk, az `expected` pedig az elvártat. Ami különösen hasznos, hogy az
XMLUnit különböző típusú objektumokat képes fogadni: pl. DOM `Document` vagy
`Node`, `String`, `byte[]`, `InputStream`, `File`, stb.

Amennyiben XPath kifejezés eredményére szeretnénk ellenőrizni, használjuk a következő
kódrészletet.

```java
XmlAssert.assertThat(actual).valueByXPath("/catalog/book[@isbn10 = '1590597060']/title")
    .isEqualTo("Pro XML Development with Java Technology");
```

A validálás a következőképp történhet:

```java
XmlAssert.assertThat(actual)
    .isValidAgainst(ValidatorApi.class.getResourceAsStream("/catalog.xsd"));
```

Az XMLUnit segítségével tudunk XML transzformációt is futtatni:

```java
Transformation transformation = new Transformation(new StreamSource(new StringReader(xml)));
transformation.setStylesheet(
    new StreamSource(XsltTest.class.getResourceAsStream("/catalog.xslt")));
String result = transformation.transformToString();
```

Az XML-lel kapcsolatban még érdemes megjegyezni, hogy a properties
állományokat is lehet XML formában tárolni, ekkor a `Properties` osztály
`loadFromXML` metódusát kell meghívni.

Nagyon egyszerű esetben, amennyiben JavaBean-eket akarunk kiírni, majd
visszaolvasni, és nem számít az XML felépítése, használhatjuk a Java
`XMLEncoder` és `XMLDecoder` osztályát.

Léteznek még a JDK-n kívül is XML feldolgozásra könyvtárak, mint pl. a
[dom4j](https://dom4j.github.io/).

A témával kapcsolatban két könyvet ajánlok. Az egyik a [Brett
McLaughlin, Justin Edelson: Java and
XML](http://www.amazon.com/Java-XML-Brett-McLaughlin/dp/059610149X/ref=sr_1_1?ie=UTF8&qid=1390171771&sr=8-1&keywords=java+xml),
a másik a
[Ajay Vohra: Pro XML Development with Java Technology
Paperback](http://www.amazon.com/Pro-XML-Development-Java-Technology/dp/1590597060/ref=sr_1_3?ie=UTF8&qid=1390171885&sr=8-3&keywords=java+xml).
