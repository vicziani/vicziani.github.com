---
layout: post
title: Kérés tárgyának meghatározása és kódolások/ékezetek használata webes alkalmazásoknál
date: '2008-12-27T18:47:00.005+01:00'
author: István Viczián
tags:
- Servlet
- Java EE
modified_time: '2018-06-09T10:00:00.000-08:00'
---

A cikk alapvetően a Servlet API-val kapcsolatos, de hasznos
információkat tartalmazhat bármilyen webes keretrendszert használóknak.
Az itt leírt dolgokat érdemes kipróbálni, esetleg a kérések, válaszok
tartalmát egy HTTP proxy-val megvizsgálni.

Webes alkalmazások készítésekor ritkán van olyan eset, mikor minden
URL-t különböző servlet szolgálna ki, és nem kapna az URL-ben különböző
járulékos információkat. Emiatt érdemes az URL felépítését kicsit
megvizsgálni, és megnézni, hogyan lehet a Servlet API felhasználásával
az URL különböző részeit lekérdezni.

A leggyakoribb félreértés az URI, URL és URN közötti különbségekkel
kapcsolatban szokott felmerülni. Az URI (Unified Resource Identifier),
mely egy egyedi erőforrás azonosító. Az erőforrást lehet azonosítani
névvel, elérési helyével vagy mindkettővel. Az URL (Unified Resource
Locator) egy olyan URI, ami az erőforrást annak helyével azonosítja,
azaz megadja, hogy kell ahhoz hozzáférni. Az URN (Unified Resource Name)
szintén egy URI, mely a teljesen egyedi névvel azonosítja az erőforrást,
és nem adja meg, hogy hogyan lehet ahhoz hozzáférni. Az URI
szintaksztisát az [RFC 3986 - Uniform Resource Identifiers Generic
Syntax](http://www.ietf.org/rfc/rfc3986.txt) szabvány írja le, de
hivatkozik több más szabványra is. Az URI, URL és URN közötti
különbségeket a 1.1.3-as fejezet tartalmazza.

A webes alkalmazásokkal a böngészők a HTTP protokollon keresztül
kommunikálnak, melyet a [RFC 2616 - Hypertext Transfer Protocol -
HTTP/1.1](http://www.w3.org/Protocols/rfc2616/rfc2616.html) szabvány
tartalmaz. A lekérdendő erőforrást meg lehet adni abszolút URI-val, mely
egy http sémájú URL.

    GET http://jtechlog.blogspot.com/2008/13/servlet.html HTTP/1.1

Ennél gyakoribb megoldás, mikor a böngésző a HTTP kérés első sorában
csak a host-hoz tartozó abszolút path-t adja meg, és Host nevű HTTP
fejlécben adja meg a host-ot, pl.:

    GET /2008/13/servlet.html HTTP/1.1
    Host: jtechlog.blogspot.com

Ezen definíciókat átfordítva a Servlet API működésére az URL tartalmazza
a teljes címet, sémával (protokollal), szervernévvel és porttal, míg az
URI csak a szerveren belüli erőforrást azonosítja egyedileg. Mint azt
láttuk, a teljes URL ugyan megjelenik a böngésző címsorában, de azt a
böngésző általában nem küldi el egyben a webes alkalmazásnak, így nincs
olyan metódus, mellyel ezt le lehet kérdezni. A HTTP kérés első sorában
lévő értéket a HttpServletRequest interfész getRequestURI() metódusával
lehet lekérni, mely a legtöbb esetben nem adja vissza a sémát, a
szervernevet és a portot. Ezen értékeket rendben a ServletRequest
interfész getScheme(), getServerName() és getServerPort() metódusaival
lehet lekérdeni. A teljes URL előállítására a HttpServletRequest
interfész getRequestURL() metódusa való, mely a háttérben az előbb
említett metódusokat hívja meg, és így állítja össze a végeredményt.
Összegezve:

    requestURL = scheme + serverName + serverPort + requestURI

Dokumentáció szerint a tényleges, böngészőben megjelenő, és az
összeállított URL-ek között minimális különbségek lehetnek, nevezetese,
hogy a szóköz %20 helyett + (pluszjel) karakterként jelenik meg. Ezt
Tomcat-nél nem tapasztaltam.

Ahogy a requestURI sem, így a requestURL sem tartalmazza a HTTP kérés
paramétereit. A kliens oldalról paraméterek két féleképpen jöhetnek.
Egyrészt a HTTP kérés törzsében név = érték formátumban, egymástól &
karakterrel elválasztva. Másrészt jöhetnek az URL-hez hozzáfűzve is
ugyanezen formátumban, ? karakter után. Ha űrlapot használunk POST
metódussal, akkor a HTTP kérés törzsében jönnek a paraméterek, GET
metódus esetén az URL-ben.

Megjegyzendő, hogy bár így szoktuk használni, és így érkezik be a HTML
form-okról, nem kötelező a paramétereknek ezt a formátumot használniuk.

A requestURI is három részből áll. Egyrészt áll a web alkalmazást a
szerveren belül egyedileg azonosító contextPath-ból. Ebből kiemelt a
root contextPath, mely a szerver gyökerére vonatkozó kéréseket szolgálja
ki. Áll a servletPath-ból, mely az adott web alkalmazáson belül a
servlet-et jelöli (egy servlet több path-t is kiszolgálhat). Valamint az
un. extra útinformációból (pathInfo), mely még a CGI-s időkből maradt
ránk. A Servlet API-ból úgy kezelhetjük ezt, ha a servlet-ünket nem egy
konkrét URL-re map-peljük rá, hanem wildcard karaktert alkalmazunk. Pl.,
nézzük a következő web.xml részletet.

```
<servlet>
  <servlet-name>MyServlet</servlet-name>
  <servlet-class>jtechlog.MyServlet</servlet-class>
</servlet>
<servlet-mapping>
  <servlet-name>MyServlet</servlet-name>
  <url-pattern>/MyServlet/*</url-pattern>
</servlet-mapping>
```

Ekkor a MyServlet nem csak a /MyServlet kérést fogja megkapni, hanem pl.
a /MyServlet/jtechlog/servlet.html-re vonatkozó kérést is, és ebben az
esetben a servletPath a /MyServlet lesz, míg a pathInfo a
/jtechlog/servlet.html. A három érték lekérdezhető a HttpServletRequest
interfész getContextPath, getServletPath és getPathInfo metódusaival. A
pathInfo eredetileg arra volt használatos, hogy a fájlrendszerben lévő
állományokat egy servlet szolgálja ki, így meghívva a getPathTranslated
metódust visszaad egy abszolút fájl elérést, a pathInfo-t, mint relatív
útvonalat véve a web alkalmazásunk főkönyvtárához képest. Amennyiben ez
utóbbi nem érhető el, pl. az alkalmazás WAR-ból fut, null-t ad vissza.

Milyen kódolásokat kell használnunk ilyen környezetben?

Az első, és legegyszerűbb kódolás a HttpServletResponse
encodeRedirectURL és encodeURL metódusa. Ezen metódusok valók arra, hogy
a paraméterként megadott URL-hez abban az esetben, ha a kliens böngésző
nem támogatja a sütik használatát (nem képes, vagy ki van kapcsolva),
hozzáfűzze a session azonosítót. Így ilyen böngésző esetén a session
követés csak abban az esetben fog működni, ha az URL-t így kódoljuk. Az
encodeRedirectURL metódust csak akkor használjuk, ha a
response.sendRedirect metódust akarjuk alkalmazni, ugyanis ebben az
esetben a kódolás lehet, hogy másképp történik. Ha JSP-ben használunk
URL-eket, akkor a JSTL core taglib-jének url tag-jét használjuk erre a
célra.

Ennél bonyolultabb annak biztosítása, hogy a speciális és az ékezetes
karakterek jól jelenjenek meg, illetve jól kerüljenek bevitelre. A
kezelésüket is megjelenítés és bevitel szerint csoportosítjuk.

Amennyiben ékezetes karaktereket szeretnénk használni, javasolt az UTF-8
character set használata, hiszen ez egy unicode alapú kódolás, változó
hosszon, maximum 6 byte-on. A 7 bites ASCII karakterek kódja ugyanaz,
azaz egy byte, míg az európai ékezetes karaktereket 2 byte-on kódolja.

Amennyiben előállt az ékezetes szöveg, és a böngészőnek küldjük, ennek
kódolását a Content-Type HTTP fejlécben kell megadni. Ennek beállítása
történhet servlet-ből, vagy JSP direktívával, mint ahogy a következő
sorok mutatják.

``` {.brush: .java}
response.setContentType("text/html;charset=UTF-8");

<%@page contentType="text/html" pageEncoding="UTF-8"%>
```

Régebbi böngészők közül sok úgy értelmezte, ha nem volt küldve character
set, hogy akkor azt a böngészőnek kell kitalálnia. Ez kivédhető, hogy
ISO-8859-1 character set esetén is küldjük azt a Content-Type fejlécben.

Ékezetes karaktereket lehetőleg adatbázisból, properties állományból,
vagy külső erőforrásból vegyünk csak.

Itt jegyzem meg, hogy egy Properties objektumot az 1.4-es Java-ig
bezárólag csak egyszerű properties állományból lehetett betölteni, ami
csak ISO 8859-1 kódolású lehet. Más kódolású állományból ilyent
készíteni a native2ascii programmal lehetséges, ahol a speciális
karakterek unicode escape szekvenciával lesznek kódolva. Az 5.0-ás
Java-ban megjelent, hogy a Properties objektumot már XML állományból is
be lehet tölteni, itt bármilyen kódolás használható. A 6-os Java-ban a
Properties osztálynak megjelent a load(Reader) metódusa is, melyel
bármilyen kódolású properties állományt be lehet tölteni.

Nagyon távol tartanék mindenkit attól, hogy a forráskódban ékezetes
karaktereket használjon. Amennyiben mégis, itt is javasolt az UTF-8
használata, de ekkor a fordítónak meg kell mondani, hogy a forrás
állományok kódolása milyen. Ezt a -encoding utf8 parancssori
paraméterrel kell megadni. Fontos, hogy ilyenkor figyeljünk oda, hogy a
szövegszerkesztőnk nehogy odaírja a BOM (byte order mark) karaktereket a
szöveges állományunk elejére, mert a fordító hibát fog jelezni (a
Windows Notepad pl. odaírja).

Ennél bonyolultabb a speciális és ékezetes karakterek fogadása.
Amennyiben ilyeneket akarunk átvinni, URL kódolást kell alkalmaznunk.
Ennek neve
[Percent-encoding](http://en.wikipedia.org/wiki/Percent-encoding), azaz
százalékjellel történő kódolás, vagy ismert URL encoding, azaz URL
kódolás néven is (ez utóbbit fogom használni). Ezt is az említett RFC
3986 írja le. Lényege, hogy bizonyos karaktereket változatlanul hagy,
bizonyos speciális karaktereket pedig egy százalékjellel és egy kétjegyű
hexadecimális számmal ír le. Később alkalmassá tették bináris adatok
átvitelére is, ahol egy bájtot a % jel utánis hexadecimális értékével
reprezentálnak.

Amennyiben mi állítunk elő olyan linket, mely ilyen karaktereket
tartalmaz, nekünk kell az URL-t kódolnunk. Amennyiben viszont egy
form-on használunk ékezetes karaktereket, a böngésző automatikusan
kódolja azokat. A szerver oldalon ennek megfelelően dekódolásnak kell
következnie.

Ebből következik, ha speciális karaktereket akarunk átküldeni, egyszer
URL-ben, egyszer pl. form hidden field-ben, akkor nekünk kell arra
figyelnünk, hogy URL esetén manuálisan kódoljuk, form esetén ne kódoljuk
az átküldendő karaktereket. (A legjobb persze, ha nem akarunk speciális
karaktereket átvinni.)

A manuális kódolást az URLEncoder.encode és a manuális dekódolást az
URLDecoder.decode metódusokkal tudunk végezni. Ez elvégzi a kódolást
application/x-www-form-urlencoded MIME formátumra, és vissza, melyet a
[HTML szabvány](http://www.w3.org/TR/html4/) tartalmaz. Ennek külön
érdekessége, hogy ez különbözik az URL kódolás szabványától, ami azt
írja, hogy a szóköz karaktert %20 karaktersorra kell leképezni, nem
pedig + (plusz) jelre (ezt az magyarázza, hogy az
application/x-www-form-urlencoded az URL kódolás egy korai verziójából
származott le). Amennyiben szabályos kódolást akarunk, használjuk az URI
osztályt, és annak toURL() metódusát.

Az ékezetes karaktereknek a bájt kódja kerül átküldésre, viszont a
nehézség az, hogy a böngésző nem küldi át, hogy az adott bájt sorozat
milyen character set-en (pl. UTF-8-on) értelmezett. Ezért az ékezetes
karakterek kezelésére a Servlet API automatizmust sem tartalmaz, nekünk
kell azt biztosítani.

A beérkező adatok kódolását és dekódolását is két csoportra kell
osztani. Egyrészt az URL-ben érkező szövegek, másrészt a HTTP kérés
törzsében érkező paraméterek.

A böngésző általában az ékezetes karaktereket abban a character set-ben
küldi el, ahogyan a választ is kapta. Így érdemes úgy írni az
alkalmazásainkat, hogy a böngésző felé küldött szövegek, és a böngésző
felől érkező szövegek is UTF-8 character set-ben legyenek.

Az URL-ben érkező szöveget a konténer dekódolja. Tomcat esetén ez a
server.xml-ben konfigurálható a connector-nál kell beírni a
URIEncoding="utf-8" paramétert. Amennyiben ilyent nem adunk meg, a
dekódolás a ISO-8859-1 karakter set-tel történik.

Bizonyos metódusok elvégzik a dekódolást, de bizonyos metódusok nem.
Lássuk:

  getRequestURI    nincs dekódolás
  getContextPath   nincs dekódolás
  getServletPath   van dekódolás
  getPathInfo      van dekódolás

Emiatt a következő képlet írható fel:

    dekódolt(getRequestURI) = dekódolt(getContextPath) + getServletPath + getPathInfo

A paramétereket két csoportra oszthatjuk: az URL-ben és a HTTP törzsben
érkező paraméterekre.

Az URL-ben érkező paramétereket lekérdezni a HttpServletRequest
interfész getQueryString metódusával lehet, mely nem végez dekódolást,
gyakorlatilag a kérdőjel utáni szöveget kapjuk vissza. A getParameter és
hasonló metódusok meghívásakor ezt dekódolja a konténer a connector
beállításai alapján.

A HTTP törzsben érkező paramétereket is alapértelmezetten a ISO-8859-1
karakter set-tel dekódolja, és ha ezt módosítani akarjuk, akkor be kell
állítanunk a HTTP kérés karakter set-jét a HttpServletRequest
setCharacterEncoding metódusával. Megjegyzendő, hogy ez csak Servlet
2.4+ konténereknél használható. Valamint az első paraméter kiolvasás,
vagy a getReader által visszaadott Reader-ből való olvasás előtt kell
meghívni, különben nem lesz hatása.

Hogy ezt ne kelljen minden egyes servlet elejére beírni, gyakran
alkalmazott módszer egy servlet filter alkalmazása, mely minden kérésre
meghívja az előbb említett metódust. A Spring alapban tartalmazza ezt az
osztályt org.springframework.web.filter.CharacterEncodingFilter néven,
melynek encoding init paraméterben kell megadni a kódolást. Ez az
osztály az org.springframework.web.filter.OncePerRequestFilter
leszármazottja, mely a request scope-ban egy változó elhelyezésével
biztosítja, hogy kérésenként csak egyszer legyen meghívva.

A HttpServletRequest setCharacterEncoding metódusával biztosítjuk tehát
azt, hogy a dekódolás a getParameter és társai metódusok segítségével
milyen character set-tel történjen.

A org.apache.catalina.util.RequestUtil osztályt érdemes olvasgatni az
URL dekódolással, valamint a paraméterek feldolgozásával kapcsolatban.

Összefoglalásképp:

-   Ha mi magunk állítunk össze link-et használjuk az encodeRedirectURL
    és encodeURL metódusokat a session követés érdekében.
-   Ha mi magunk állítunk össze paramétert, akkor URL-ben mi
    gondoskodjunk annak kódolásáról, form esetén a böngésző elvégzi
    helyettünk.
-   Állítsuk be, hogy a konténer milyen kódolás alapján dekódolja az
    URL-eket. Tomcat esetén URIEncoding paramétere a Connector
    konfigurációnak.
-   Használjunk CharacterEncodingFilter-t a form-ról érkező ékezetes
    szövegek helyes dekódolásához.

Amennyiben bináris adatot szeretnénk URL-ben, vagy form-ban átvinni,
figyelni kell arra, hogy URL-ben kell kódolást végeznünk, form-ban nem.
Ezt kikerülhetjük úgy is, hogy [más
kódolást](http://mindprod.com/jgloss/armouring.html) alkalmazunk,
melynek kimenete nem tartalmaz speciális karaktereket. Sajnos a Base64
nem alkalmas erre, mivel a kódolt szöveg tartalmaz olyan karaktert,
melynek URL-ben speciális jelentése lehet. Alkalmazhatjuk ehelyett egy
speciális típusát, a Base64u-t, mely kimenetében nem szerepelhet + / és
= jel.
