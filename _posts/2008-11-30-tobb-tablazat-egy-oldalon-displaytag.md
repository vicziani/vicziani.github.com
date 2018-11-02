---
layout: post
title: Több táblázat egy oldalon Display taggel
date: '2008-11-30T23:41:00.009+01:00'
author: István Viczián
tags:
- JSP
modified_time: '2018-06-09T10:00:00.000-08:00'
---

A [Display tag library](http://displaytag.sourceforge.net)
leggyakrabban használt nyílt forráskódú JSP tag library táblázatok
megjelenítésére. Az MVC architektúrális mintára épül. Annak ellenére,
hogy a jelenleg legfrissebb 1.1.1-es verziót 2007 augusztus 15-én adták
ki, elég jól tartja magát. Képes a táblázatokkal kapcsolatos,
legmacerásabban megvalósítható elvárásoknak eleget tenni, mint a
rendezhetőség, lapozás, szűrés, csoportosítás, exportálás CSV, Excel és
XML formátumokba. Szép XHTML kódot állít elő, fel van készítve a
többnyelvűségre, és CSS-sel remekül formázható. A decorator tervezési
mintát megvalósítva lehetőség van mind a táblázat, mind a cella XHTML
kód generálásának befolyásolására. Az egyik leggyakoribb kérdés vele
kapcsolatban, hogy megvalósították-e, hogy az adatokat adatbázisból
vegye. Erre a válasz konkrétan, hogy nem, hiszen a Display tag library
alapvető feladata a megjelenítés, hogy a mögötte lévő modell hogy áll
elő, az már a programozó dolga. Emiatt a lapozást is úgy szeretnénk
megoldani, hogy az adatbázisból csak a megfelelő rekordokat kérdezzük
le, magunknak kell megoldani. Alapból nem támogatja az AJAX-ot, de lehet
találni fejlesztéseket ezzel kapcsolatban, többek között az
[AjaxTags](http://ajaxtags.sourceforge.net/), vagy egy [DWR alapú
megoldás](http://blog.xebia.com/2007/12/10/how-to-make-displaytag-ajax-enabled-using-dwr/),
vagy
[AjaxAnywhere-rel](http://raibledesigns.com/rd/entry/the_future_of_the_displaytag).
Már az 1.0-ás verzió is képes volt arra, hogy egy oldalon több
táblázatot jelenítsen meg, és a lapozást, rendezést és exportálást külön
kezelni mindkét táblázat esetén. Ehhez semmi mást nem kell tenni, mint
hogy a táblázatnak különböző id-t adunk. Az id attribútum szolgál arra,
hogy a táblázatnak azonosítót adjunk, valamint ez jelöli annak a
változónak a nevét, mellyel a táblázat soraira hivatkozunk. Képzeljük el
azonban, hogy mi egy tag állományban szeretnénk a táblázat generálását
elhelyezni, és egy oldalon többször is meghívni. A táblázat oszlopán
belül mivel valami műveletet szeretnénk végezni még az oszlop értékkel
(pl. linkben használni), a column tag törzsén belül használjuk, és nem
attribútumként adjuk meg. A megoldás lehet a következő:

```
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@taglib uri="http://displaytag.sf.net" prefix="display" %>
...
<%@attribute name="element" required="true" type="java.util.List"%>
...
<display:table name="${elements}" id="element">
  <display:column>
    <c:url var="url" value="/element">
      <c:param name="id" value="${element.id}" />
    </c:url>
    <a href="${url}">${element.name}</a>
  </display:column>
</display:table>
```

Ez azonban nem jó megoldás akkor, ha egy oldalon több táblázatot akarunk
megjeleníteni, hiszen a táblázat id-ja minden esetben az element lesz.
Erre való azonban az uid paraméter, amit az id helyett használunk,
ugyanis ezzel adhatunk meg id-ként EL kifejezést. Adjuk meg ez a nevet
is tableId paraméterként a tag-nek (opcionális, csak akkor használjuk,
ha tényleg több táblázatot akarunk használni egy oldalon). Ekkor azonban
a sort tartalmazó változó értéke nem element lesz, hanem a \${tableId}
EL kifejezés értéke. Így erre a következő módon kell hivatkoznunk:
pageScope\[tableId\]. A helyes kód tehát ez lehet:

```
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@taglib uri="http://displaytag.sf.net" prefix="display" %>
...
<%@attribute name="element" required="true" type="java.util.List"%>
<%@attribute name="tableId" required="false" type="java.lang.String"%>
...
<c:if test="${tableId == null}">
  <c:set var="tableId" value="element" />
</c:if>
<display:table name="${elements}" uid="${tableId}">
  <display:column>
    <c:url var="url" value="/element">
      <c:param name="id" value="${pageContext[tableId].id}" />
    </c:url>
    <a href="${url}">${pageContext[tableId].name}</a>
  </display:column>
</display:table>
```
