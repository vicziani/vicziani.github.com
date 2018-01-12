---
layout: post
title: Fizikai rendszerterv generálás Java forráskódból
date: '2009-07-07T11:20:00.005+02:00'
author: István Viczián
tags:
- Módszertan
- Community
modified_time: '2018-01-12T00:33:20.408+02:00'
---

Aktuális feladatunk fizikai rendszerterv írása. Értelmezésünkben a
fizikai rendszerterv abban tér el a logikai rendszertervtől, hogy itt a
technológia független típusok helyett már konkrét típusokat írunk. Pl.
amíg a logikai rendszertervben egy osztálydiagrammon típusként a
`szöveges` szerepelt, addig a fizikai rendszertervben az
osztálydiagramban `String` szerepel, a tábla leírásoknál `VARCHAR(2)`.

A logikai rendszertervben már az osztálydiagrammokat megrajzoltuk, a
kérdés az volt, hogy hogyan tovább. Bizonyos eszközök támogatják a
logikai modellből fizikai modellbe továbblépést, de az általunk használt
nagyon egyszerű UMLet erre nem képes. Így adott volt a kérdés, hogy
először rajzoljuk meg az osztálydiagramot, és abból generáljunk
forráskódot (forward engineering), vagy először írjuk meg a forráskódot
és abbol állítsuk elő az osztálydiagramot (reverse engineering). A
roundtrip engineering, mikor mindkét helyen módosíthatjuk, és az egyik
visszaszinkronizál a másikra nem volt cél, több munka lett volna vele,
mint amennyi haszna. Valamint nem csak az osztálydiagrammokban
gondolkodtunk, hanem a dokumentáció kigenerálhatóságában is. Így esett a
választás a reverse engineeringre, azaz hogy a kódot írjuk, és abból
generálunk osztálydiagramot és dokumentációt is. Ennek két oka volt,
egyrészt a logikai rendszerterv során már előállt a rendszer váza, így
nem volt rizikó egyből a kóddal kezdeni, másrészt a Java programozó
lévén jobban szeretek egyből kódot írni, mint egy UML eszközben
klikkelgetni, és egy refaktoring is könnyebben megy a kedvenc IDE-mben.
Valamint szívesebben írok dokumentációt is JavaDoc-ba, hiszen az mégis
kód közelibb, mint Wordben.

Szóval a cél adott, írjuk meg a program vázát Javaban, generáljuk ki
belőle a dokumentációt, lehetőleg az osztálydiagramot, és mivel JPA-t
használunk, lehetőleg az adatbázis sémát, az adatbázis séma
megjegyzéseit (Oracle `COMMENT ON` utasítások), az adatbázis séma dokumentációját,
lehetőleg ezt is osztálydiagrammal. És lehetőleg semmit ne kelljen két
helyen leírni. Eredményként egy Word dokumentumnak kell előállnia, amit
valamilyen sablonnal lehessen megadni, hiszen saját formátumot kell
használni, ami igazodik a projekt dokumentum formátumához.

Mivel a szöveges dokumentáció JavaDoc-ként kerül elkészítésre, adott az
ötlet, hogy valamilyen doclettel kell megoldani a problémát. A doclet
egy olyan programrész, mely a doclet API használatával a JavaDoc
megjegyzéseket képes feldolgozni, és abból valamilyen kimenetet
gyártani. A Sun standard docletje generálja ki a mindenki számára jól
ismert HTML JavaDoc dokumentációt, de tölthetőek le
[3rd party docletek](http://www.doclet.com/)
is, és magunk is írhatunk ilyeneket. Első
körben a
[DocFlex/Javadoc](http://www.filigris.com/products/docflex_javadoc/about.php)
lett szimpatikus, de csak úgy ingyenes a használata, hogy nem nyúlunk a
template-ekhez. Van hozzá template szerkesztő is, de annak használata
már fizetős. Majd próbálkoztam a
[JELDoclet](http://jeldoclet.sourceforge.net/) eszközzel is, mely egy
saját formátumú XML generál ki, és ezt lehet tovább XSLT
transzformációval alakítani. Nem tetszett, hogy egy saját formátumon
kell dolgozni, és az XSLT sem tetszik. Ezután akadt meg a szemem a
[Fikin Ant Tasks](http://fikin-ant-tasks.sourceforge.net/) projekten,
melynek része a VelocityDoclet is. A Velocity-vel nagyon jó
tapasztalataim voltak, így kapott egy esélyt.

A kérdés már csak az volt, hogy hogyan állítsak elő Word állományt.
Natívan egyik eszköz sem támogatta, gyakorlatilag a működő megoldás Java
platformon kizárólag a HTML, RTF vagy PDF generálás. Az RTF hamar
kiesett, mert a táblázatok kezelése nagyon macerás. A PDF-ből a
copy-paste szintén nem hozott szép eredményt, és a gyakori ékezetes
probléma is hamar előjött. Így maradt a HTML, és Internet Explorerben
egy viszonylag egyszerűen formázott HTML minden gond nélkül átvihető
copy-paste-tel Wordbe (Firefox-ból másolva már megint problémák
adódtak).

De hogy is állítsuk elő a HTML dokumentációt? Írhattam volna a
Velocity-ben egyből HTML template-et, de hogy megbizonyosodjak az előző
állításokról, valamint kicsit szabványos legyen a megoldás, és ha
véletlenül később más formátumra is szükség van, adoptálni lehessen a
módszert, a DocBook mellett döntöttem. A
[DocBook](http://en.wikipedia.org/wiki/DocBook) egy tiszta XML formátum
technikai dokumentációk írására, és több formátumba is lehet
transzformálni, mint pl. HTML, XHTML, EPUB, PDF, man pages és HTML Help.

Tehát a megálmodott és később megvalósított folyamat a következő:

-   Java osztályok vázának megírása, JavaDoc-kal ellátása
-   Kialakításra kerül egy DocBook Velocity template
-   A VelocityDoclet a template alapján legenerálja a kész, kitöltött
    DocBook dokumentációt
-   A DocBook XML-ből egy XML transzformáció előállítja a HTML
    dokumentációt
-   Kézzel egy Word állományba átmásolásra kerül

A teljes folyamat persze automatizált, Ant végzi. Ehhez a következő
szoftver elemeket kellett felhasználni:

-   [Fikin Ant Tasks 1.7.3](http://fikin-ant-tasks.sourceforge.net/)
-   [DocBook 4.x sémák](http://www.docbook.org/schemas/4x), hogy az XML
    szerkesztő eszköz syntax highlight-olja, és automatikus
    kódkiegészítsen
-   [Xalan-Java 2.7.1](http://xml.apache.org/xalan-j/), az XSLT
    transzformációhoz
-   [DocBook xsl
    1.75.1](http://wiki.docbook.org/topic/DocBookXslStylesheets), mely
    az XSLT transzformációt végzi DocBook-ról HTML-re
-   [DocBook xsl Xalan
    1.0](http://wiki.docbook.org/topic/DocBookXslStylesheets), Xalan
    kiegészítés az XSLT transzformációhoz
-   [Apache FOP 0.95](http://xmlgraphics.apache.org/fop/), XSL-FO
    engine, amennyiben nem csak HTML-t, hanem RTF-et vagy PDF-et akarok
    gyártani

Sajnos a Fikin Ant Tasksnak van egy-két hiányossága, amiért bele
kellett nyúlni. Az utolsó kiadás 2007. márciusában volt. Egyrészt még
nem támogatja a Java 1.5 nyelvi elemeit, pl. a generikusokat, valamint
problémája van a karakterkódolásokkal, gyakorlatilag nem lehet ezeket
megadni. Javítottam, és a
[patch-t](https://sourceforge.net/tracker/index.php?func=detail&aid=2817845&group_id=168390&atid=846618)
el is küldtem a projektnek.

Ezzel a dokumentum generálás megvan, de mi van az osztálydiagrammal? Az
UMLetnek nagyon egyszerű saját XML formátuma van, melyet szintén ki
lehet generálni. Az osztályok síkbeli pozícionálásával nem is érdemes
vesződni, az úgy is kézi munka, hogy logikusan kerüljenek elhelyezésre,
a köztük lévő kapcsolatokkal együtt. Ugyanezen módszerrel egy másik
template-tel az Oracle `COMMENT ON` parancsai is kigenerálhatóak.

Az érdekesebb probléma az adatbázis táblák dokumentációjának
kigenerálása. Mivel JPA-t használunk, az adatbázis séma is generálásra
kerül. Mivel Hibernate JPA provider-t használunk, az képes arra, hogy a
`persistence.xml`, és az annotált Java osztályokat felolvassa, és a
belőlük generálandó táblákat és mezőket, mint meta-adatot el lehet kérni
(ezt használja a séma generálás is). Ezt mutatja a következő kód:

{% highlight java %}
// Első paraméter a Presistence Context neve a persistence.xml-ben
Ejb3Configuration cfg = new Ejb3Configuration().configure("FooPU", new HashMap());
Configuration hbmcfg = cfg.getHibernateConfiguration();
Dialect dialect = new Oracle10gDialect();
Mapping mapping = hbmcfg.buildMapping();
for (Iterator i = hbmcfg.getTableMappings(); i.hasNext(); ) {
  Table t = (Table) i.next();
  System.out.println("Table: " + t.getName());
  for (Iterator it = t.getColumnIterator(); it.hasNext(); ) {
    Column c = (Column) it.next();
    System.out.println("Column: " + c.getName() + " " + c.getSqlType(dialect, mapping));
  }
}
{% endhighlight %}

Ebből már az adatbázis dokumentáció is kigenerálható. Ahhoz, hogy ez
bekerüljön a Velocity Contextbe, kiegészítettem a VelocityDocletet az
előbb említett patch-ben azzal, hogy az Ant tasknak paraméterként
osztályneveket lehet megadni, azokat példányosítja, és helyezi el a
Contextben.
