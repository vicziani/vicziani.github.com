---
layout: post
title: Kedvenc Java eszközök
date: '2010-02-07T12:13:00.004+01:00'
author: István Viczián
tags:
- Utils
- infrastruktúra
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Az előző posztban azon kedvenc Java library-ket mutattam be, melyeket
gyakran használok webes alkalmazások fejlesztése közben. A mostaniban
azon Java-s eszközöket szeretném bemutatni, melyek ugyan az alkalmazás
futása közben nem kellenek, de nagyon hasznos segítséget nyújtanak a
fejlesztés közben.

A megjegyzések között ti is több hasznos library-t írtatok, melyeket
ezúttal is köszönök, és erre most is szeretnélek benneteket bátorítani,
hogy írjátok ide kedvenc kipróbált és bizonyított eszközeiteket.

Most is megpróbálom ezeket hasznosság szerint sorrendbe szedni. Nem
térek ki a tervezéshez használt eszközökre, valamint a különböző
adatbázisokra, és hozzájuk kapcsolódó egyéb eszközökre.

[NetBeans](http://netbeans.org/): Régebben azért választottam, mert
mindent tartalmazott, ami a fejlesztéshez szükséges volt, nagyon jó
wizard-okkal rendelkezett. Az [Eclipse](http://www.eclipse.org/)-et
sokat kellett konfigurálni, hogy minden működjön, de ha időt szántál rá,
sokkal jobban személyre tudtad szabni. Ez az Eclipse package-ek óta már
nem így van (pl. a legfrissebb Galileo), az is tartalmazza az egymással
kompatibilis, a fejlesztéshez szükséges legtöbb plugint. Régebben
[JDeveloper](http://www.oracle.com/technology/products/jdev/index.html)-t
használtam, azt is nagyon szerettem, a GUI szerkesztője még máig is a
legjobb, és ingyenes.

[Apache Ant](http://ant.apache.org/): A klasszikus build tool. Valahogy
nem tudtak még a [Maven](http://maven.apache.org/) hasznosságáról
meggyőzni, de ez csak környezeti sajátosság lehet. Egyszerűen nem olyan
bonyolultak a projektjeink, nem dolgozunk rajta annyian, nincs akkora
szervezet, infrastruktúra, nem fejlesztünk open source eszközöket, stb.
Az Ant azért már szerzett néhány bosszúságot, mert nem könnyű
elsajátítani a deklaratív gondolkodását. Azonban pont most vezetjük be
nem csak build folyamatra, hanem általánosabb folyamatirányításra, és
meglepetésre a kiterjeszthetőségének hála remekül megállja a helyét.
Erről szintén [cikket](http://vicziani.github.com/artifacts/ant.pdf)
írtam.

[Apache Tomcat](http://tomcat.apache.org/): Sokak szerint nem a
leggyorsabb, és nem is a legjobb web konténer (servlet és JSP
támogatás), de a legelterjedtebb, így bármi problémám van vele, azonnal
találok rá valami megoldást a weben. Nagyon bevált, egyelőre nincs
szükségem olyan funkcionalitásra, melyet nem biztosítana. Ahogy az előző
post-omban írtam, nem bízom az alkalmazásszerverekben.

[JAD](http://www.varaneckas.com/jad): Egyszerű, jól használható,
parancssori Java Decompiler. Fejlesztése megszűnt, oldala eltűnt és már
csak egy mirror van fenn.

[Apache JMeter](http://jakarta.apache.org/jmeter/): Terhelés tesztre
kiváló, de ha csak gyorsan össze kell dobni egy integrációs teszt
esetet, vagy akár csak monitorozni kell egy alkalmazást, a JMeter erre
alkalmas, és könnyen bővíthető.

[SOAPUi](http://www.soapui.org/): Web szolgáltatások tesztelésére remek
eszköz. Nem csak web szolgáltatások felderítésére képes WSDL alapján,
majd azok meghívására, hanem képes mock web szolgáltatásokat is
biztosítani, ahol a konstans választ mi adhatjuk meg SOAP XML
formátumban.

[Hudson](https://hudson.dev.java.net/): Continuous integration eszköz.
Viszonylag új szerzemény, amire szükségünk volt, még mind tudta, mint
release-ek kiadása, vagy telepítés előkészítése a teszt és éles
környezetekre. Mivel a build eszközünk az Ant, illesztése könnyű volt.

[Atlassian JIRA](http://www.atlassian.com/software/jira/) és [Atlassian
Confluence](http://www.atlassian.com/software/confluence/): Az előbbi
egy issue tracker, az utóbbi egy wiki. Bár kereskedelmi alkalmazások,
annyira szervesen beépültek a fejlesztési folyamatainkba, hogy nem
hagyhatom ki őket. Nyílt forráskódú termékek fejlesztésekor ingyenesen
használható.

[Subversion](http://subversion.tigris.org/) és
[TortoiseSVN](http://tortoisesvn.tigris.org/): Nem szorosan ide
tartozik, azért került a végére. Verziókezelésre kizárólag ezt
használom. A NetBeans is támogatja, de annak csak azt a képességét
használom ki, hogy a forráskód szerkesztésekor a margón mutatja, hogy mi
változott az Subversion-ben tárolt állományokhoz képest. A többi
műveletet a TortoiseSVN-ből végzem. (Egy-két IDE-ben szerzett rossz
tapasztalat után.) A [GIT](http://git-scm.com/)-tel is szemezgetek, de a
jelenlegi projektjeink mérete és a lineáris fejlesztési menete miatt még
biztos nem váltanék.

Általam használt további, nem csak Java fejlesztéshez használt
alkalmazásaimat is [összegyűjtöttem
itt](http://vicziani.github.com/alkalmazasok.htm).
