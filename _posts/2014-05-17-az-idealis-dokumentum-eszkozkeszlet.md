---
layout: post
title: Az ideális dokumentum-előállítási eszközkészlet
date: '2014-05-17T14:44:00.001+02:00'
author: István Viczián
tags:
- Módszertan
modified_time: '2018-06-03T13:08:16.668+02:00'
---

Mindenkinek van egy vagy több olyan terület, melyen a tökéleteset
keresi, és nem sikerül megtalálnia. A [Heti
Meteor](http://hetimeteor.hu/) hallgatása közben gondolkoztam el azon,
hogy nekem ilyen a dokumentum-előállítási eszközkészletem, mely már ezen
a blogon is többször megjelent.

Már korán rájöttem arra, hogy a Word nem az az eszköz, melyet nekem
találtak ki. Egy ajánlat írásának végén egy éjszakán keresztül néztem,
ahogy az ajánlati dokumentumot több órán keresztül formázzák. Talán nem
is kell mondanom, hogy mennyire elveszett és másodrendű volt a tartalom.

Egy olyan eszközt akartam, ahol a tartalom és a forma tökéletesen
különválik, és csak a jelentést hordozó karakterekre kell koncentrálnom.

Biztos mindenki ismeri az Word állományokhoz kötődő munkafolyamatot is,
mely során különböző verziójú állományok utaznak e-mail csatolmányként,
külön életet élnek, és folyamatosan távolodnak attól a lehetőségtől,
hogy fájdalommentesen össze lehessen fésülni őket. Ezen talán a
Microsoft SharePoint lenne képes segíteni, de ettől mindenki retteg.

Sajnos ez a helyzet az OpenOffice/LibreOffice vonallal is, nem old meg
problémákat, csak újakat vezet be. Minden évben kipróbálom, és egy nap
után otthagyom.

Amikor megismertem a [HTML](http://www.w3.org/TR/html4/) nyelvet,
azonnal elgondolkoztam, hogy talán ez lesz a megoldás. Szétválik a
tartalom és a forma (Cascading Style Sheets - CSS), és alapvetően
támogatja a linkek készítését is. Sőt, még a csoportmunkára is
kitaláltak egy megoldást, melyet
[WebDAV](http://en.wikipedia.org/wiki/WebDAV) néven ismerhetünk. Sajnos
láthatjuk, hogy hova jutott a HTML. Bár a neve a HyperText Markup
Language, manapság gyakorlatilag platformként használjuk interaktív
alkalmazások fejlesztésére, a JavaScript és az AJAX térnyerésével. A
formátumot nem egyszerű írni, a WYSIWYG eszközök is gyengén sikerültek,
más formátumokba konvertálás is nehézkes, ne is beszéljünk a
kompatibilitási problémáiról. A WebDAV sem volt képes elterjedni, a
megvalósítások is [hagytak kívánni valót maguk
után](/2009/02/11/webdav-tapasztalatok.html).

Amikor megjelent a wiki, ismét láttam, hogy valami alakul. A Wikipedia
bár beépült a mindennapjainkba, a mögötte álló formátum és munkafolyamat
mégsem hozta el az áttörést. Írtunk egyik kereskedelmi megvalósításával
([Atlassian Confluence](https://www.atlassian.com/software/confluence))
rendszerterveket, és Word sablon alapján generáltuk ki. De sajnos rossz
irányba halad, a formázást kezdi el a középpontba helyezni. Bár a mai
napig előszeretettel használom egy nyílt forráskódú megvalósítását
([RedMine](http://www.redmine.org/)), valami még mindig hiányzik.

Közben próbálkoztam egyéb formátumokkal is. Még az egyetemen találkoztam
a [LaTeX](http://www.latex-project.org/) formátumban, melyben
folyamatosan bíztam, de képtelen volt kitörni a tudományos világból.
Tény, hogy ott gyakorlatilag egyeduralkodó.

Másik
[próbálkozásom](/2009/07/07/rendszerterv-generalas-java-kodbol.html) a
[DocBook](http://www.docbook.org/). Szintén remek kezdeményezés, de
sajnos XML alapú, emiatt itt is megjelenik a tagekkel járó zavaró
tényezők. Valamint sikerült elbonyolítani, nézzük csak végig a
referenciát, és a transzformáció más formátumokba is horror.

A Google docs valahogy sosem győzött meg. A párhuzamos szerkesztés
tényleg egyedülálló, de nem tudtam annyira kihasználni a képességeit,
hogy minden területen bevált volna. Betöltöttem sok dokumentumot, és
valahogy mindig egy kellemetlen érzést éreztem, mikor meg kellett
nyitnom egyet-egyet.

Rengetegféle tartalmat gyártok nap mint nap. Publikálok a blogon, a
forráskódok mellé magyarázó szövegeket, architektúrális leírásokat kell
elhelyezni, stb. Fejlesztő vagyok, tehát alapvetően sokat kell
forráskódot tartalmazó dokumentációt is készítenem. És e mellé még
vegyük hozzá, hogy oktatok, ahol ismét nagy mennyiségű dokumentum készül
el, prezentációk, feladatleírások, tesztek, stb. Konferenciákra a
prezentációk készítése is mindig problémát okozott. A PowerPoint ismét
nem a tartalomra összpontosít, és a forráskód beillesztési lehetőség is
határos. A Prezi szintén nem az az eszköz, mellyel gyorsan lehet
haladni.

És ekkor ismertem meg a
[Markdown](http://daringfireball.net/projects/markdown/) nyelvet.
Szöveges formátum, mely könnyen olvasható egy egyszerű
szövegszerkesztővel is, de a minimális alkalmazott szabály miatt könnyen
lehet más formátumokba is konvertálni, tipikusan HTML-be. A nyelvet John
Gruber találta ki. Igen, a [Daring Fireball](http://daringfireball.net/)
blog írója, Apple megszállott.

Először a GitHub-on [találkoztam](/2012/09/25/github-pages.html) vele,
ezzel tudunk a projektjeink mellé viszonylag egyszerűen dokumentációt
írni, de akár teljes oldalakat, blogokat megvalósítani. Így a
verziókezelővel egybeépítve már a csoportmunka is megoldott. Ezt mára
szinte mindegyik hasonló szolgáltatás átvette. Később találkoztam egy
nagyszerű online szövegszerkesztővel, a
[StackEdittel](http://stackedit.io), melyben ez a cikk is készül.
Támogatja a syntax highlightot, mutatja a renderelt HTML kimenetet, amit
le is lehet tölteni. Ezen kívül képes menteni Google Drive-ra,
Dropboxra, Bloggerre, Tumblrre, WordPressre, GitHubra, SSH-ra. Ezzel a
csoportmunka platformja is választható, én a Dropbox mellett tettem le a
voksom. Ment PDF formátumban. És GitHubról letölthető a forrása.

És ami megdöbbentő, hogy tökéletesen alkalmas prezentációk készítésére
is, érdemes megnézni a [Remark](http://remarkjs.com) projektet. Milyen
egyszerűen szúrhatók be forráskód részletek is. Valamint ott van a
[Pandoc](http://johnmacfarlane.net/pandoc/) projekt is, mellyel
parancssorból lehet formátumok között konvertálni. Tökéletesen működik a
Markdownról minden egyéb formátumra történő konvertálás, akár úgy is,
hogy saját stylesheetet, vagy template-t lehet megadni.

Ezen kívül létezik a [GitBook](http://www.gitbook.com/) projekt is,
mellyel interaktív könyveket is írhatunk, az oldalán fenn van már elég
sok példa is.

Amennyiben ismersz jó Markdown felhasználási módokat, írd ide a
megjegyzések közé!

Sajnos ennek is már minden fajta elfajzása látható, létrejöttek olyan
változatai, mellyel ismét a formátumra lehet hatni.

Én bízom a Markdown minél szélesebb körben való alkalmazásában.
Szeretem, hogy csak a natív szövegre koncentrálhatok, minden zavaró
tényező kiiktatásával. Szeretem, hogy bármely szövegszerkesztőben
(aktívan a Notepad++ és Geditet használom) meg tudom nyitni.

Koncentrálj te is a szövegre, az képvisel értéket. Minden egyes perc,
mely formázással telik, elpazarolt idő.
