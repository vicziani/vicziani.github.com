---
layout: post
title: Szöveges állomány generálása JSP-vel
date: '2008-11-24T21:29:00.009+01:00'
author: István Viczián
tags:
- JSP
modified_time: '2018-06-09T10:00:00.000-08:00'
---

A közelmúltban azt a feladatot kaptam, hogy szöveges állományt
generáljak ki egy webes alkalmazással, mely formátuma plain text, azaz
nem a leggyakrabban használt XML vagy (X)HTML formátum. Ráadásul
formázott plain text, azaz pontosan meghatározott, hogy mit és hova,
hány karakterre kell írni. A web alkalmazás a megjelenítési rétegben a
JSP view technológiát használja. A következő megoldások jöttek szóba:

-   Servlet
-   JSP
-   Velocity
-   Utófeldolgozás servlet filter segítségével

Ami a fejtörést okozta, hogy sem a JSP, sem a Velocity használatával nem
lehet egzakt módon megadni a whitespace-ek kezelését. Persze ez oda
vezet vissza, hogy ezek a nyelvek elsősorban az XML és (X)HTML
formátumokra lettek kitalálva, ahol a whitespace-eket kellő hanyagsággal
lehet kezelni, hiszen a böngésző feldolgozáskor a közvetlen egymás
mögött álló whitespace sorozatot egy whitespace karakterre cseréli. A
JSP specifikáció is úgy definiálja, hogy az XML-ben meghatározott
whitespace kezelést kell követni. Mindig zavart, hogy szöveg
generálására kitalált template engine-ekben mért nem lehet trükközés
nélkül a whitespace karaktereket kezelni, gondoltam, utánajárok. A
felsorolt technológiák közül az alkalmazásban már szerepelt a
servlet-ben megvalósított implementáció, de a több oldalon keresztül
húzódó, különböző metódusokba szétszórt out.println(); és out.printf();
utasítások tömege visszatetszést keltett. Használjunk hát template
engine-t, de minek válasszunk egy újat (Velocity - melyekkel szintén
kétes élményeim voltak whitespace ügyben), ha már az alkalmazásunkban
úgy is szerepel a JSP technológia. Első ötletet hamar elvetettem, amit
már a Velocity esetében is használtam, hogy úgy kell elhelyezni a
megjegyzéseket, hogy közvetlenül két tag közé, és akkor, mivel ezeket a
JSP fordító úgyis figyelmen kívül hagyja, megvan az általam kívánt
működés. A megoldás működik is, de a szépérzékemet bántotta. A következő
felfedezés a JSP 2.1-ben bevezetett trimDirectiveWhitespaces nevű
direktívája volt, mely hatására a kimenetben nem szerepelnek a
felesleges whitespace karakterek. (A fejlesztői közösség kérte, hogy a
felesleges whitespace-ek eltávolításával a sávszélesség felhasználás
csökkenjen - erre eddig formázó filtereket használtak, ami azért
erőforrás igényesebb művelet, vagy közvetlen a JSP-re engedték rá
telepítés/fordítás előtt. Erre remek eszköz a
[JTidy](http://jtidy.sourceforge.net/), melyet Java-ból hívhatunk.)
Természetesen a direktíva hatására nem az összes whitespace kerül
eltávolításra, hanem a a tag végétől a következő hasznos karakterig
szereplő whitespace-ek. Azaz ha egy szó közé több whitespace karaktert
teszünk, azok megmaradnak. Mivel az alkalmazás lokalizált, ezért szöveg
nem is szerepelt a JSP-ben, minden csak a c:out és fmt:message standard
tag-ekkel került kiírásra, a legenerált szöveg gyakorlatilag egy sorba
került. A következő meglepetés ott ért, hogy a JSP specifikáció
egyértelműen leírja, hogy nem lehet speciális karaktereket, pl. \\n
escape szekvenciát használni a JSP oldalakban. Egyedül a \\', \\" és
\\\\ escape szekvenciák megengedettek, de nekem sem a NetBeans, sem a
Tomcat nem fogadta el ezeket sem. A specifikáció javasolja, hogy
ilyenkor Java kódot alkalmazzunk. A &lt;% out.println("\\n"); %&gt;
scriptlet nem nyerte el a tetszésem, hiszen sosem alkalmazok JSP-ben
scriptlet-et, így egy egyszerű JSP függvényt definiáltam, mellyel egy
sortörést lehet kiírni. Ezen kívül definiáltam egy függvényt, mely a
háttérben a printf metódust hívja. Ilyen JSP-ben nincs, és mivel a
printf függvénnyel lehet pl. megadott mezőhosszra szöveget kiíratni, és
azon belül is jobbra, valamint balra helyezni azt, szintén tökéletes a
whitespace-ek explicit kezelésére, lsd. a
[Formatter](http://java.sun.com/j2se/1.5.0/docs/api/java/util/Formatter.html)
osztályt. A függvény kódja:

``` {.brush: .java}
package jtechlog;

import java.io.PrintWriter;
import java.io.StringWriter;

public class Functions {
 public static String br() {
     return "\r\n";
 }

 public static String printf(String format, String param) {
     StringWriter sw = new StringWriter();
     PrintWriter pw = new PrintWriter(sw);
     pw.printf(format,  param);
     return sw.toString();
 }
}
```

Eztán már csak a következő részt kellett elhelyezni a TLD állományban:

``` {.brush: .xml}
<function>
<description>Line break.</description>
<name>br</name>
<function-class>jtechlog.Functions</function-class>
<function-signature>java.lang.String br()</function-signature>
</function>

<function>
<description>Printf.</description>
<name>printf</name>
<function-class>jtechlog.Functions</function-class>
<function-signature>java.lang.String printf(java.lang.String, java.lang.String) </function-signature>
</function>
```

Így két függvényt is kaptam, mellyel egzakt módon tudom a whitespace
karaktereket befolyásolni. Egyrészt a &lt;c:out "\${jtechlog:br()}"
/&gt; sorral tudok sortörést elhelyezni, valamint a &lt;c:out
value="\${jtechlog:printf('%1\$-14s', '')}" /&gt; sorral tudok egy
szöveget 14 karakteren kiírni, balra igazítva, ahol ha a szöveg kisebb,
mint 14 karakter, kiegészíti még szóközökkel (padding). Ezen kívül a
JSP-t is tetszőlegesen formázhatom.
