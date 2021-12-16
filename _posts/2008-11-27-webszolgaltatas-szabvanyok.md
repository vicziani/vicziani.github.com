---
layout: post
title: Webszolgáltatásokkal kapcsolatos szabványok
date: '2008-11-27T00:20:00.003+01:00'
author: István Viczián
tags:
- SOA
---

Frissítve: 2017. november 18.

Az előző posztban is említett integrációs projekt során definiálni kell
a partner rendszerek felé, hogy milyen protokollon és milyen formában
szeretnénk velük kommunikálni. Az ember hajlamos lenne könnyedén
elintézni, hogy webszolgáltatásokkal, de ennél azonban egy kicsit
többre van szükség. Biztos mindenki számára ismert, hogy a webszolgáltatások
környékén előfordulő bűvszavak, és azok jelentése: XML,
SOAP, WSDL és UDDI. Nem is ismertetném ezeket, csak néhány szót róluk.
Leggyakrabban a web szolgáltatások XML formátumú dokumentumokat várnak,
és ilyent adnak vissza. A SOAP egy XML alapú kiterjeszthető boríték
formátumot definiál, a WSDL egy szintén XML alapú interfész leíró nyelv,
és nagyobb rendszereknél alkalmazott szolgáltatástárak egy része XML
alapú UDDI használatával is megszólítható. Ezen leírások mindegyikét a
W3C tartja karban. A SOAP
[1.1](http://www.w3.org/TR/2000/NOTE-SOAP-20000508/)-es verziója
specifikációként használható, míg az
[1.2](http://www.w3.org/TR/2007/REC-soap12-part0-20070427/)-es 2003.
június 24-én vált ajánlássá, majd kijött azóta a 2. kiadása is. A két
verzió között akkora lényegi
[különbség](http://www.idealliance.org/papers/xmle02/dx_xmle02/papers/02-02-02/02-02-02.html)
nincs, pl. a Simple Object Access Protokol elnevezést váltották le,
ugyanis félrevezető, a rövidítést azonban megtartották. A WSDL-ből is az
1.1-es verzió a széles körben támogatott hivatalos szabvány, míg a
[2.0](http://www.w3.org/TR/wsdl20/)-ás csupán ajánlás. Azonban ezek a
szabványok alapban nem biztosítják azt, hogy a szabvány alapján
implementált webszolgáltatás keretrendszerek egymással
együttműködjenek. Így neves gyártók részvételével létrejött a
[WS-Interoperability](http://www.ws-i.org) szervezet, melynek feladata
olyan metodológiák, specifikációk, tesztesetek kialakítása, melyek
használatával tényleg együttműködő web szolgáltatásokat lehet
implementálni. A WS-I ún.
[profilokkal](http://www.ws-i.org/deliverables/matrix.aspx) dolgozik,
melyek egy specifikáció halmazt írnak le, valamint a specifikációkhoz
kapcsolódó megszorításokat, pontosításokat és a félreértések elkerülését
biztosító tisztázó magyarázatokat. Ebből a legelterjedtebb a Basic
Profile 1.1 (BP), mely a SOAP 1.1, WSDL 1.1 és UDDI 2 specifikációkat
pontosítja. A BP 1.0 és 1.1 közötti egyetlen lényeges különbség, hogy a
SOAP perzisztálásával és kötésével (binding) kapcsolatos pontosításokat
átemelték egy új, Simple SOAP Binding Profile 1.0 profilba. A
csatolmányokkal külön, az Attachments Profile 1.0 foglalkozik, mely a
SOAP Messages with Attachments W3C szabványt pontosítja, mely a SOAP 1.1
átvitelét definiálja MIME multipart mechanizmussal. A BP 2.0 már a SOAP
1.2-őt veszi alapul. Ezek alapján biztosított, hogy amelyik web
szolgáltatás implementáció rendelkezik az említett profilokkal, az
együtt fog működni az ugyanazon profilokat biztosító más
implementációkkal. A Glassfish Metro keretében fejlesztett, a JDK-hoz is
csatolt JAX-WS referencia implementáció (mely a JSR 224 RI-ja)
megvalósítja a Basic Profile 1.1, Simple SOAP Binding Profile 1.0 és az
Attachments Profile 1.0 profilokat. Ugyanígy több Java-s keretrendszer,
valamint az ASP .NET 2.0 is. Itt érdemes még megemlíteni azt is, hogy a
SOAP több lehetőséget biztosít a SOAP törzs leírására. Az első lehetőség
az RPC stílusú leírás, mely a távoli metódushíváshoz hasonló, ahol
definiálni kell a hívott metódust, a paramétereket, visszatérési
értéket, hibákat. Második lehetőség a dokumentum típusú (Document), ahol
tetszőleges XML adat szerepelhet. Az üzenet kódolása is fontos szempont,
ami megmondja az adattípusokat, melyeket a SOAP törzsben használhatunk.
Egyik kódolás a literál kódolás (Literal), ahol az adattípusokat egy XML
sémával adjuk meg, másrészt a SOAP kódolás (SOAP encoded/encoded),
amikor nem kell XML sémának megfelelni, és a SOAP-ban definiált
típusokat használhatjuk. A két stílus és két kódolás tetszőlegesen
keverhető, de amennyiben SOA-t szeretnénk felépíteni, javasolt a
document/literal párosítás használata. Interfész egyeztetésnél ezt is
definiálni kell. Javasolt még megállapodni az átviteli protokollban. A
SOAP esetében a leggyakoribb átviteli protokoll a HTTP(S), a SOAP
szabvány ugyan megemlíti, hogy más is használható, de csak a HTTP(S)-t
részletezi. A SOAP bírálói között sokan kritizálják, hogy túl
absztraktra sikerült, és felesleges volt ennyire elválasztani a
borítékot a protokolltól, és a RESTful web szoltáltatások esetén a kettő
kicsit közelebb esik egymáshoz, így csökken a komlexitás. De ez már egy
másik történet...
