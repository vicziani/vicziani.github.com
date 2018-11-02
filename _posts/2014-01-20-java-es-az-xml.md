---
layout: post
title: Java és az XML
date: '2014-01-20T00:23:00.000+01:00'
author: István Viczián
tags:
- xml
- Tesztelés
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Felhasznált technológiák: Java 7, JUnit 4.11, XmlUnit 1.5, Hamcrest 1.3,
xml-matchers 1.0-RC1, Maven 3.0.3

Van pár régebbi anyagom, melyet szeretnék publikálni, mielőtt új témákba
kezdenék bele. Ebből egyik a Java XML kezeléséről szól, ami ugyan nem a
legforróbb terület manapság, azonban mégsem árthat egy kis összefoglaló.

Ehhez poszthoz is található egy [projekt a
GitHub-on](https://github.com/vicziani/jtechlog-xml), melyben rengeteg
példa van.

Maga a Java SE is meglehetősen komplex [XML támogatást
tartalmaz](http://docs.oracle.com/javase/7/docs/technotes/guides/xml/index.html),
méghozzá a The Java™ API For XML Processing (JAXP), The Java
Architecture For XML Binding (JAXB) és The Java API for XML Web Services
(JAX-WS) specifikációk formájában. Az
[JAXP](http://docs.oracle.com/javase/7/docs/technotes/guides/xml/jaxp/index.html)
egyszerű alap XML feldolgozást támogat, ide tartozik pl. a SAX, DOM,
validáció, XPath, transzformáció, stb. A
[JAXB](http://docs.oracle.com/javase/7/docs/technotes/guides/xml/jaxb/index.html)
egy binding megoldás, mellyel Java objektumokat tudunk XML
dokumentumohoz rendelni. És végül a
[JAX-WS](http://docs.oracle.com/javase/7/docs/technotes/guides/xml/jax-ws/index.html),
mellyel webszolgáltatásokat tudunk hívni, és implementálni.

Természetesen a JAXP maga is egy specifikáció,
[JSR-206](https://www.jcp.org/en/jsr/detail?id=206). Itt az is látható,
hogy melyik Java verzióban ennek melyik verziója szerepel:

-   JAXP 1.6: Java Platform, Standard Edition 8
-   JAXP 1.5: Java Platform, Standard Edition 7u40
-   JAXP 1.4.5: Java Platform, Standard Edition 7
-   JAXP 1.4: Java Platform, Standard Edition 6
-   JAXP 1.3: Java Platform, Standard Edition 5

Az 1.4-es újdonsága a Streaming API for XML (StAX), míg az 1.5 bizonyos
biztonsági funkciókkal egészítette ki az előző verziót. A JAXP 1.5 2013
augusztus 30-án jött ki, és a következő szabványokat támogatja:

-   SAX 2.0.2
-   StAX 1.2, JSR 173
-   XML 1.0, XML 1.1
-   XInclude 1.0
-   DOM Level 3 Core, DOM Level 3 Load and Save
-   W3C XML Schema 1.0
-   XSLT 1.0
-   XPath 1.0

A JAXP-hez is tartozik referencia implementáció, mely frappánsan a [JAXP
reference implementation](https://jaxp.java.net/) nevet kapta.
Alapvetően két Apache-s projekttől forkolt el, az egyik az XML
parse-olást végző [Xerces2](http://xerces.apache.org/xerces2-j/), a
másik az XML transzformációt végző
[Xalan-Java](http://xml.apache.org/xalan-j/).

Gyakorlatilag annyi történt, hogy a csomag neve elé még betették a
com.sun.org előtagot. Bármikor megtudhatjuk, hogy az aktuális JDK-ban
hanyas Xerces és Xalan található:

{% highlight java %}
System.out.println(com.sun.org.apache.xerces.internal.impl.Version
    .getVersion());
System.out.println(com.sun.org.apache.xalan.internal.Version
    .getVersion());
{% endhighlight %}

Ez nekem a JDK 1.7.0\_51 esetén a következőt írja ki:

  Xerces-J 2.7.1
  Xalan Java 2.7.0

A cikk írásának pillanatában mindkettőből van frissebb verzió, a
Xerces-ből 2.11.0, a Xalan-ból a 2.7.1.

Mivel a JAXP csak egy API, könnyen lehet az implementációt is cserélni
alatta. Ennek mikéntje a Java API
[DocumentBuilderFactory](http://docs.oracle.com/javase/7/docs/api/javax/xml/parsers/DocumentBuilderFactory.html)
osztályánál van leírva.

Ha nem tudjuk, hogy éppen melyik verziót használjuk (mert pl. a
classpath-on szerepel egy más implementáció, ami alkalmazásszerverek
használata esetén is gyakori), akkor a következőképpen állapíthatjuk meg
azt:

{% highlight java %}
System.out.println(getJaxpImplementationInfo("DocumentBuilderFactory",
    DocumentBuilderFactory.newInstance().getClass()));
System.out.println(getJaxpImplementationInfo("XPathFactory",
    XPathFactory.newInstance().getClass()));
System.out.println(getJaxpImplementationInfo("TransformerFactory",
    TransformerFactory.newInstance().getClass()));
System.out.println(getJaxpImplementationInfo("SAXParserFactory",
    SAXParserFactory.newInstance().getClass()));
{% endhighlight %}

Ez amúgy a példaprojektben is kijött, ugyanis az xml-matchers berántotta
a Xerces újabb, 2.8.0 verzióját, ami az egyik XML-t más formátumban írta
ki (az `mvn dependency:tree` paranccsal ellenőrizhető).

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

A `TransformerFactory` és `Transformer` osztályok használatával lehet
XML transzformációkat végezni.

XML séma alapján validálni a `Validator` osztállyal lehetséges, a
`Schema` betöltése `SchemaFactory`-val történik. DTD alapján nem tud
validálni, ha mégis ilyent szeretnénk, akkor a parsernél kell a
validációt beállítani.

A JAXP XPath kiértékelési lehetőségeit a `XPathFactory` osztályon és
`XPath` interfészen keresztül lehet kihasználni.

A JAXP minden része fel van szerelve névterek kezelésére is.

Az XML funkciók unit tesztelésére több könyvtár is rendelkezésünkre áll
(mindegyikre található példa a példa projektben). Az
[XMLUnit](http://xmlunit.sourceforge.net/) alkalmas XML
összehasonlításra (nem szöveg összehasonlítás), XPath kifejezések
futtatására, validációra és transzformációk ellenőrzésére. A Hamcrest is
tartalmaz egy HasXPath osztályt, azonban ha komolyabb dolgokra van
szükségünk, javasolt az
[xml-matchers](https://code.google.com/p/xml-matchers/) használata, ami
szintén Hamcrest matchereket tartalmaz.

Az XML kezeléshez tartozó következő API a JAXB, melyről már írtam a
[JAXB](/2009/07/02/jaxb.html) és [JAXB
trükkök](/2009/07/02/jaxb-trukkok.html) cikkben.

A JAX-WS-ről írtam a [JAX-WS mélyvíz](/2009/11/22/jax-ws-melyviz.html)
posztban, tesztelésükről a [Webszolgáltatások integrációs tesztelése
soapUI és JUnit használatával](/2012/08/14/soapui-junit-teszteles.html)
posztban. Könyvről a [SOA Using Java Web
Services](/2012/08/12/soa-using-java-web-services.html) posztban, és
vizsgáról a [Oracle Certified Expert, Java EE 6 Web Services
Developer](/2012/12/22/oracle-certified-expert-java-ee-6-web.html)
posztban.

Az XML-lel kapcsolatban még érdemes megjegyezni, hogy a properties
állományokat is lehet XML formában tárolni, ekkor a `Properties` osztály
`loadFromXML` metódusát kell meghívni.

Nagyon egyszerű esetben, amennyiben JavaBean-eket akarunk kiírni, majd
visszaolvasni, és nem számít az XML felépítése, használhatjuk a Java
`XMLEncoder` és `XMLDecoder` osztályát.

A `javax.xml.soap` csomag felelős a SOAP üzenetek alacsony szintű
feldolgozásáért.

A két legelterjedtebb nyílt forráskódú XML feldolgozást végző XML
library a [JDOM](http://www.jdom.org/) és
[dom4j](http://dom4j.sourceforge.net/). Alternatív binding könyvtár a
[Castor](http://castor.codehaus.org/). Alternatív JAXB implementáció az
[EclipseLink MOXy](http://www.eclipse.org/eclipselink/moxy.php).

A témával kapcsolatban két könyvet ajánlok. Az egyik a [Brett
McLaughlin, Justin Edelson: Java and
XML](http://www.amazon.com/Java-XML-Brett-McLaughlin/dp/059610149X/ref=sr_1_1?ie=UTF8&qid=1390171771&sr=8-1&keywords=java+xml),
a másik a\
[Ajay Vohra: Pro XML Development with Java Technology
Paperback](http://www.amazon.com/Pro-XML-Development-Java-Technology/dp/1590597060/ref=sr_1_3?ie=UTF8&qid=1390171885&sr=8-3&keywords=java+xml).
