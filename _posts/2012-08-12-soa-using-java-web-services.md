---
layout: post
title: SOA Using Java Web Services
date: '2012-08-12T22:52:00.001+02:00'
author: István Viczián
tags:
- JAXB
- JAX-WS
- könyv
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Egy előző posztban, melyben Java tanuláshoz javasoltam forrásokat,
említettem a [Mark D. Hansen: SOA Using Java Web
Services](http://soabook.com/) című könyvet, de most jutott arra időm,
hogy végigolvassam a majdnem 600 oldalas könyvet. A poszt egy
könyvleírás, de érdemes végigolvasni, egy-két trükköt, tippet olvasható
a webszolgáltatások használatával kapcsolatban. Régebben már írtam egy
[posztot a JAX-WS-ről](/2009/11/22/jax-ws-melyviz.html), ott is
merítettem ebből a könyvből.

![SOA Using Java Web Services](/artifacts/posts/2012-08-12-soa-using-java-web-services/cover_300wide.jpg)

A könyv alapvetően a JAX-WS 2.0, JAXB 2.0, WS-Metadata 2.0 és a WSEE 1.2
szabványt mutatja be. A könyv nem új, 2007-ben jelent meg, de
aktualitását még nem vesztette el, hiszen ugyan van már JAX-WS 2.2,
JAX-B 2.2, de igazán kevés újdonság van benne, módosítás még kevesebb. A
[JAX-WS
újdonságai](http://jax-ws.java.net/nonav/2.2.1/docs/UsersGuide.html#2.0_Features)
között talán a
[WebServiceFeature](http://docs.oracle.com/javase/7/docs/api/javax/xml/ws/WebServiceFeature.html)
megjelenése az érdekes, valamint a WS-Addressing említésre méltó. A JAXB
[specifikáció](http://jcp.org/aboutJava/communityprocess/maintenance/jsr222/222ChangeLog.html)
vagy
[implementáció](http://jaxb.java.net/nonav/2.2.6/docs/ch02.html#jaxb-2-0-changelog)
újdonságai között talán az
[XmlSeeAlso](http://docs.oracle.com/javase/7/docs/api/javax/xml/bind/annotation/XmlSeeAlso.html)
annotáció lehet érdekes.

Igaz, a könyv címében benne van a SOA, alapvetően nem foglalkozik a SOA
architektúrával, csak azzal, hogy egy SOA architektúrába hogyan tudjuk a
saját alkalmazásunkat legjobban beilleszteni. Arról viszont nagyon
részletesen szól, hogy azt hogyan kell felépíteni, milyen rétegekből
álljon, milyen eszközöket érdemes használni, és hogy ezek az eszközök
hogyan működnek. Nagyon jó és részletes áttekintés található a könyvben
az említett szabványok tulajdonságairól, de a részletekbe már nem
annyira megy bele. Említi ugyan a REST-et, de akkor még csak a JAX-WS-be
próbálja Provider-rel és Dispatch-csel beilleszteni, a JAX-RS-t meg sem
említi. A SOAP, WSDL szabványra csak hivatkozik, nem magyarázza, nem
tárgyalja részletesen.

A könyv egy elég jó bevezetővel indul, ahol megnyugtatja az olvasót,
hogy nem meglepő, ha nem tudja elsőre átlátni a webszolgáltatások
világát, ugyanis tényleg nem egyszerű. A webszolgáltatások írását
biztosító eszközrendszer tulajdonságait három részre bontja: hívás
(invocation), szerializáció (serialization) és telepítés (deployment).
Az hívás alatt azt érti, hogy hogyan kerül meghívásra egy adott
webszolgáltatás az adott architektúrán, milyen rétegeken megy keresztül,
hogyan talál a megfelelő helyre. A szerializáció biztosítja a
paraméterek, visszatérési értékek, kivételek átvitelét. A telepítés azt
írja le, hogyan lehet az adott technológiával implementált
webszolgáltatás komponenst telepíteni, és hogyan inicializálja, indítja
be az adott környezet.

A könyv szerintem legerősebb fejezete a második fejezet, amikor
végigmegy a fentebb említett szabványokon, és
hívás/szerializáció/telepítés aspektusok alapján sorba veszi őket. Ennek
a fejezetnek dőltem be, ugyanis itt több olyan dolgot is említ, melyre
utána később nem tér ki. Ha kitérne, egy teljes technológiát lefedő
könyv lenne, de nem is állna meg 600 oldalnál.

A könyv már az 1. fejezettől kezdve emlegeti, hogy a JAX-WS inkább a
bottom up, általa "Start from Java"-nak hívott megközelítést támogatja.
Ez azt jelenti, hogy adott a Java forrás, és az alapján szeretnénk
webszolgáltatást kiajánlani. Gyakran azonban a top down megközelítésre
(előbb a WSDL adott, ő "Start from WSDL"-nek nevezi), vagy inkább a meet
in the middle (általa "Start from Java and WSDL"-nek nevezett)
megközelítésre van szükség, mikor adott a WSDL is, és egy létező
rendszer is. Ekkor gyakran tapasztalhatjuk, hogy a kettő nem felel meg
egymásnak. Az üzleti objektumaink felépítése, elnevezése általában nem
felel meg annak, amit interfésznek is ki szeretnénk, vagy ki kell
ajánlani. A könyv un. wrapper osztályok alkalmazását javasolja.
Gyakorlatilag egyrészt kigenerálja az osztályokat a WSDL-ből, valamint
meghagyja az üzleti objektumokat is. A kettő között másolást végez.
Ettől egyrészt tisztább lesz a kód, viszont több manuális munka van
vele. A másolást getter/setter hívásokkal oldja meg, és javasolja, hogy
ezeket érdemes különszervezni. Nem említi, hogy erre vannak kész
megoldások, pl. BeanUtils.copyProperties vagy a
[Dozer](http://dozer.sourceforge.net/). Javasolja még azt is, hogy
XSLT-vel is lehet konvertálni a megfelelő formátumra.

A könyv 3. fejezete a REST-et tárgyalja. Furcsa a sorrend, az író azzal
magyarázza, hogy első körben érdemes megérteni a webszolgáltatásokat a
SOAP boríték nélkül. Erre ugyanúgy a JAX-WS-t használja, és XML-t küld
át. Erre manapság már ott van a JAX-RS. Amúgy nagyon lehúzza a REST-et,
hogy alkalmatlan a SOA-ra az interfész leíró nyelv hiánya miatt. Azóta
ott a
[WADL](http://en.wikipedia.org/wiki/Web_Application_Description_Language),
de nem annyira elterjedt még.

A 4. fejezet szól kicsit a WSDL-ről és a SOAP-ról, egy nagyon jó leírás
található az RPC/Literal, Document/Literal és Document/Literal Wrapped
közötti különbségekről. A fejezet alapul vette a gyakran idézett [Which
style of WSDL should I
use?](http://www.ibm.com/developerworks/webservices/library/ws-whichwsdl/)
cikket is. Az előbb már említett integrációs réteget itt írja le,
valamint egy workaroundot, hogy hogy lehet megkerülni azt a kötöttséget,
hogy egy WSDL-hez csak egy Java osztály tartozhat. (Igen, két osztály
esetén tenni kell elé egy Facade osztályt, mely delegálja tovább a
hívásokat.)

A következő fejezet a JAXB alapfogalmakkal ismertet meg. Érdekes a
Binding Language-ről szóló leírás, valamint az XmlAdapter használata
típus konverzióra. Ennek használatát nehézkesnek ítéli, nem javasolja
nagyobb, bonyolultabb struktúrák konverziójára. Nem igazán megy bele a
JAXB részleteibe.

A 6. és 7. fejezet a JAX-WS fejlesztést mutatja meg a gyakorlatban, az
előbbiben egy klienst, az utóbbiban egy szervert fejleszt. Szépen leírja
a hívási modellt, majd sorra a példák: natív XML küldése, SOAP küldése,
Castor XML mapping használata, aszinkron web szolgáltatás hívás, SOAP
message handlerek, hibakezelés. Valamint említi a
[Endpoint](http://docs.oracle.com/javase/7/docs/api/javax/xml/ws/Endpoint.html)
osztályt is, mellyel Java SE-ben lehet webszolgáltatás futtatni. A Java
SE-ben ugyanis van egy pehelysúlyú [HTTP
server](https://blogs.oracle.com/michaelmcm/entry/http_server_api_in_java).
Ez pl. integrációs tesztelésre tökéletes.

A 8. fejezet azt írja le, hogy lehet alkalmazásszerverbe
webszolgáltatásokat telepíteni. Ezt Glassfish-re írja le. Sajnos
hiányzik, hogy mi van csak egy web konténer (pl. Tomcat esetén). Tény,
hogy ezzel a szabvány sem foglalkozik. A biztonságot is hamar elintézi
egy BASIC autentikációval. Viszont említi az OASIS XML Catalog 1.1-et.

A 9. fejezet egy példa alkalmazás, mely az eBay, Amazon és Yahoo!
szolgáltatásai felé húz egy alkalmazást, melyet szintén meg lehet hívni
SOAP és REST webszolgáltatásokon keresztül is. Itt nagyon jó a bridge
tervezési minta használata, csak ezért is érdemes elolvasni a fejezetet.

A 10. fejezet az AJAX és a Java webszolgáltatások kapcsolatáról ír, azt
hiszem ma már senki nem így használja. Konkrétan natívan használja a
XMLHttpRequest-et, böngészőfüggetlenül implementálja, és XML-t küld.
Manapság már valamilyen JavaScript keretrendszerrel oldjuk ezt meg, és
JSON-nal. A 11. fejezet egy saját SOA-J keretrendszer fejlesztéséről ír,
melyet a könyv szerzőjén kívül szerintem még senki nem használt, így nem
is érdemes rá szót vesztegetni.

A könyv mintapéldái elérhetők, érdekes módon félig Maven-nel
build-elődnek, de az alkalmazásszerverre deploy, bizonyos generálások
Ant task-kal történnek. Furcsa, hogy nem hív Ant-ot Maven-ből, vagy nem
valami Maven JAXB és JAX-WS plugin-eket használ. Bár ez utóbbit
megértem, mert elég nagy a kavar körülöttük.

Kinek érdemes elolvasnia a könyvet? Aki a JAX-WS világában frissen el
akar merülni, annak nagyon javaslom. A JAXB-re szerintem jobb a Java EE
tutorial, de a JAX-WS-re olvasmányosabb ez, és sokkal több
háttérinformációt tartalmaz, kicsit kitekint, hogy valós projektekben
milyen problémák szoktak előfordulni, és hogyan kell azokat megoldani.
Szerintem a legjobb fejezet a 2. fejezet, mely az említett szabványok
összes tulajdonságait, lehetőségeit végigpörgeti, példa nélkül. Aki még
nem írt ilyent, annak jók a gyakorlati részek is, de aki már egy-kettőt
összedobott, nem fog újdonságot találni, kivéve talán a
Dispatch/Provider intenzív használatát. Gyakorlottabb webszolgáltatás
fejlesztők sok újdonságot nem fognak találni, nekik elég, ha a 2.
fejezetet végigpörgetik, hogy minden tulajdonságáról tudnak-e az adott
szabványokról.
