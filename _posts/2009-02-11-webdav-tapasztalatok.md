---
layout: post
title: WebDAV tapasztalatok
date: '2009-02-11T22:19:00.005+01:00'
author: István Viczián
tags:
- Subversion
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Nem kifejezetten Java téma, de szerintem minden fejlesztőnek hasznos
lehet, ha egy kicsit megismerkedik a WebDAV protokollal.

Az utóbbi napokban az volt a feladatom, hogy kialakítsak egy közös
helyet dokumentumok (általában Word állományok) megosztására. Az
elvárások a következők voltak:

-   Maximális biztonság, hiszen komoly projektről van szó
-   Elérés a net bármely pontjáról, hiszen nem egy lokális hálózaton
    belül ülünk
-   Egyszerűen, nem programozók számára is egyszerűen telepíthető és
    használható
-   Jogosultságkezelés
-   Amennyiben lehetséges, legyen automatikus verziókezelés
-   Lehetőleg támogassa a zárolást (lock): ha egy felhasználó elkezd
    szerkeszteni egy dokumentumot, lehetőleg más addig ne szerkessze
    (szemben a merge modellel, ahol lehet szerkeszteni, de ha ütközés
    van, automatikusan vagy kézzel kel feloldanunk)
-   Minél jobban illeszkedjen a jelenlegi eszközökhöz

A következő megoldások jöttek szóba:

-   WebDAV
-   Valamilyen webes document management rendszer, akár egy wiki
-   VPN-nel becsatlakozás a cég hálózatába, majd megosztott könyvtár
    használata
-   Microsoft Windows SharePoint Services vagy Office SharePoint Server

Az első a macerásabb konfiguráció miatt kiesett, a Microsoft termékek az
áruk, valamint Microsoft-os szerverek hiánya miatt nem jöhetett szóba. A
maradék két megoldás közül a WebDAV-ot választottam, hiszen az gyorsan
beüzemelhető és kipróbálható volt, valamint illeszkedett a jelenlegi
architektúrába.

A Web-based Distributed Authoring and Versioning (WebDAV) a HTTP
protokoll kiterjesztése, mely lehetővé teszi azt is, hogy egy web
szerverről ne csak lekérjük az állományokat, hanem feltölthessük,
módosíthassuk és törölhessük őket. A WebDAV főbb jellemzői, melyeket nem
minden kliens támogat: lockolás, tulajdonságok (property-k, metaadatok,
pl. író, módosítás dátuma, stb.), használata, névtér kezelés (namespace
- másolás, mozgatás) és fájlok csoportosítása (collections -
könyvtárral). Az ígéret szerint kellően gyors hálózatnál, és jó
klienssel szinte megkülönböztethetetlen egy lokális meghajtótól. A http
sokak által ismert GET, POST, stb. metódusai mellett megjelentek a
PROPFIND, PROPPATCH metódusok tulajdonságok kezelésére, MKCOL kollekciók
kezelésére, COPY, MOVE az erőforrások kezelésére és a LOCK és UNLOCK a
zárolásra.

Ugye ismerősek? Igen, az egyik legelterjedtebb nyílt forráskódú ingyenes
Subversion verziókezelő is képes WebDAV-on keresztül működni. Ehhez egy
Apache HTTP Server-t kell telepítenünk, és abba a bekapcsolni a mod\_dav
modult, és az Subversion mod\_dav\_svn modult. Ha a Subversion
repository-t HTTP-n keresztül érjük el, akkor valószínűleg így van
beállítva. Ez a konfiguráció többek között a következőket biztosítja:

Apache által támogatott authorizációs mechanizmusok használata

-   Teljes körű jogosultságkezelés
-   Naplózás
-   SSL-lel titkosítható

Ezen megoldásnak nagyon sok előnye van. Egyrészt általában mindenütt
működik egy Subversion szerver, amit ezek után dokumentum tárolásra is
használhatunk. A HTTP(S) átmegy a tűzfalakon, és a repository, ezáltal a
dokumentumaink is böngészőből elérhetőek olvasásra.

A WebDAV-hoz kifejlesztették a DeltaV kiegészítést, ami az eredeti
szabványt megtoldja verziókezeléssel. A Subversion nem egy teljes DeltaV
megoldás, és megvalósítja az un. autoversioning opcionális lehetőséget.
Ez azt jelenti, ha verziókezelést nem megvalósító kliens támad, akkor is
képes a verziók automatikus kezelésére, méghozzá a műveletek után
automatikusan kiad egy commit műveletet, és ekkor egy log üzenet
automatikusan generálódik hozzá.

De nézzük meg, hogy mi kell ahhoz, hogy módosítsunk is. Vagy egy
Subversion kliens, vagy egy kezdő felhasználók számára transzparens
WebDAV kliens. No, itt kezdődtek a problémák. A legtöbb operációs
rendszer, mint a Windows is tartalmaz beépített klienst, sőt ez kettőt
is, korábban Web folders néven, később a Windows XP-ben jelent meg az
újabb verziója WebDAV mini-redirector néven. Az előbbi Windows Explorer
(és nem az Internet Explorer) bővítménye. A WebDAV mini-redirector
fájlrendszer szinten épülne be, de nagyon hibás szoftver, használata nem
javasolt (nem kezeli a https protokollt, és az alapértelmezett, 80-as
porttól eltérő portokat).

No gondoltam, akkor válasszunk egy 3rd party megoldást a következők
közül:

-   [WebDrive](http://www.webdrive.com/)
-   [NetDrive](http://www.netdrive.net/)
-   Novell NetDrive 4.0, mely megtalálható a NetWare 6 Client CD-n,
    valamint a [neten](http://www.theblog.ca/novell-netdrive) is nem
    teljesen legálisan.

Mindegyik előnye, hogy egy WebDAV elérést drive-ként tudna bemappelni.
Három géppel próbálkoztunk, és mindegyik kliens képes volt ezek közül
legalább egyet lefagyasztani. Azért sem jó megoldás a használatuk, mert
nem működik a zárolás, a Word speciális nevű fájlokat helyez el.
Valamint a mentésnél nem egy létezőt módosít, hanem letörli az előzőt,
és újra létrehozza.

Ezért maradtam a Windows beépített megoldásánál, de nem a hibás
mini-redirector-nál, hanem a Windows Explorer-ből elérhető Web
folders-nél, amit a következőképpen kell beüzemelni:

-   Hálózati helyek (Asztalról a legegyszerűbben elérhető)
-   Hálózati hely hozzáadása
-   A varázslóban a „Válasszon másik hálózati helyet” kiválasztása
-   Internet- vagy hálózati cím beviteli mezőben az URL megadása
-   A tovább gombra, ha HTTPS kapcsolat van, nem böngésző által
    elfogadott hitelesítésszolgáltató által kiadott tanúsítvánnyal, el
    kell fogadni (amennyiben nem akarjuk mindig elfogadni, telepíthetjük
    is), majd ha autentikáció van beállítva, meg kell adni a
    felhasználónevet és jelszót. Végül adjunk meg egy nevet.
-   Fejezzük be a varázslót, és nyissuk meg a hálózati helyet.
-   Ekkor megjelenik a megosztott könyvtár.
-   Később, ha Windows Explorer-t használunk, akkor megjelenik a
    Hálózati helyek között a megosztás a bal oldali fában. A megosztás
    megjelenik a Word Fájl/Megnyitás menüre előugró ablakában is, a
    Hálózati helyek gombra klikkelve bal alul. Az Office is alapban
    használja a WebDAV klienst, azaz megnyitáskor megadhatunk WebDAV
    URL-t is.

Sajnos ez sem tökéletes megoldás, a Word néha elveszíti a kapcsolatot,
ekkor lokálisan kell elmenteni, majd újra a megosztásra menteni, és
kiválasztani, hogy csak új verziót akarunk feltölteni, nem akarjuk
törölni a régit. Linux alatt WebDAV mount-olható a davfs2 vagy fusedav
alkalmazásokkal, a Konqueror és a Nautilus beépített támogatást
tartalmaz, valamint elérhető egy parancssoros Cadaver kliens is.

Nagyon sokat küzdöttem azzal is, hogy Internet Explorer-ből (vagy
Firefox-ból) egy dokumentumra kattintva úgy nyissa meg a Word, hogy
azonnal menteni is lehessen. Találtam registry buherálós megoldást, HTTP
header módosítással operáló megoldást (MS-Author-Via: "DAV"), Firefox
plugin-okat, de sajnos nekem egyik sem hajlandó működni.

Szóval az elképzelés nem rossz, de a silány Windows-os WebDAV kliensek
miatt még mindig nincs kényelmes megoldás.

Lehet, hogy mégis inkább egy Wiki alapú megoldást kell keresni. Sőt,
ennek keveréke is elképzelhető, hiszen pl. az Atlassian Confluence (ami
ugyan kereskedelmi termék) képes a tartalmat WebDAV-on keresztül
kiajánlani (ez is verziókövetett), valamint egy WebDAV kliens plugin is
van hozzá, más szerverek elérésére.

Hogy kicsit a Java-hoz is köze legyen, vannak Java-s kliensek, mint az
[DAV Explorer](http://www.davexplorer.org/). Volt egy Apache Slide is,
tartalomkezelésre, de ennek fejlesztése leállt, javasolt az Apache
Jackrabbit használata. Ezen kívül egyszerűen tesztelhetünk WebDAV-ot,
hiszen az Apache Tomcat is tartalmaz egy
[org.apache.catalina.servlets.WebdavServlet](http://tomcat.apache.org/tomcat-6.0-doc/api/org/apache/catalina/servlets/WebdavServlet.html)
nevű servlet-et, mely megvalósítja a WebDAV protokollt.

**Frissítés:** Sajnos a Word gyakran veszti el
a kapcsolatot a WebDAV szerverrel, és ilyenkor csak akkor sikerül neki
lementeni a fájlt, ha az eredetit törli. Ezzel viszont ugrik a
verziókezelés, hiszen egy törlés, majd egy hozzáadás művelet zajlik a
háttérben.

Találtam egy kereskedelmi terméket is [IT Hit Map WebDAV
Drive](http://www.webdavsystem.com/mapdrive/home) néven, lehet, hogy
érdemes lenne ezt is megvizsgálni.
