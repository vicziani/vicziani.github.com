---
layout: post
title: UMLet saját komponens
date: '2010-09-29T02:01:00.007+02:00'
author: István Viczián
tags:
- UML
---

Felhasznált technológiák: UMLet 14.2

Utolsó frissítés: 2017. március 24.

Már egy előző posztban ([UML
tevékenységdiagram](/2009/05/02/uml-tevekenysegdiagram.html)) írtam az
[UMLet](http://www.umlet.com/) UML diagram rajzoló eszközről, és több
diagramot is ezzel készítettem, mint pl. a [Fa ábrázolása
adatbázisban](/2009/08/12/fa-abrazolasa-adatbazisban.html) posztban
lévőt is. Ez utóbbiban látható, hogy olyan komponenst használtam, mely
nincs az UMLet-ben (lekerekített sarkú téglalap, árnyékkal és
színátmenettel).

Ezen eszköz alapvető előnye két dologban rejlik. Egyrészt, ahogy már
írtam, kellően egyszerű, nem kell dialógusablakok garmadán
keresztülvergődni egy UML diagram elkészítéséhez, hanem ki kell tenni a
komponenst, melyhez egy darab Properties beviteli mező tartozik. Ebben
lehet minden leírni, gyakorlatilag egy kötött formátumot használva
(script-szerűen). Másik előnye, hogy saját komponenseket nagyon egyszerű
benne megvalósítani, Java nyelven, így gyakorlatilag tetszőlegesen
testre szabható, bármilyen saját komponens létrehozható.

Az UMLet-ben saját elem létrehozására a Custom Element való, melyről az
UMLet honlapján egy [tutorial](http://www.umlet.com/ce/ce.htm) is
található.

Custom Element szerkesztéséhez először a Custom Elements/New...
menüpontot válasszuk ki. Ekkor megjelenik az alsó szerkesztő ablak,
három szövegmezővel. Az első szövegmezőben a komponens tulajdonságait
adhatjuk meg. A másodikban a forráskódját, a harmadikban pedig látunk
egy előnézeti képet.

<a href="/artifacts/posts/2010-09-29-umlet-sajat-komponens/umlet_screenshot.png" rel="sonarqube">![UMLet](/artifacts/posts/2010-09-29-umlet-sajat-komponens/umlet_screenshot_600.png)</a>

A példában a következő forráskód szerepel:

{% highlight java %}
int y=textHeight();

drawRectangle(0,0,width,height);

for(String textline : textlines) {
	y += printCenter(textline,y);
}
{% endhighlight %}


Gyakorlatilag a kód kirajzol egy téglalapot, és beleírja a szöveget. A
`width`, `height`, `textlines` változók lokális változók, míg a `textHeight()`,
`drawRectangle()` metódusok.

Ha valami szebb megjelenítést akarunk, akkor írjuk ide következő kódot:

{% highlight java %}
// Változó inicializációk
int dontHideBorder = 1;
int roundedCorner = 5;
int shadowOffset = (int) (5 * zoom);
Color bg = new Color(Integer.decode("#58ACFA"));

// Árnyék
g2.setColor(new Color(200, 200, 200));
g2.fillRoundRect(shadowOffset, shadowOffset, getWidth() - shadowOffset - dontHideBorder, getHeight() - shadowOffset - dontHideBorder, 10, 10);  

// Színátmenettel feltöltött téglalap
g2.setPaint(new GradientPaint(1, 0, bg, getWidth() + 1, 0, Color.WHITE, false));
g2.fillRoundRect(dontHideBorder, dontHideBorder, getWidth() - shadowOffset, getHeight() - shadowOffset, roundedCorner, roundedCorner);

// Keret
g2.setColor(Color.BLACK);
g2.drawRoundRect(dontHideBorder, dontHideBorder, getWidth() - shadowOffset, getHeight() - shadowOffset, roundedCorner, roundedCorner);

// Szöveg
int y = textHeight();
for (String textline : textlines) {
 if (!textline.contains("=")) {
  printCenter(textline, y);
  y = y + textHeight();
 }
}
{% endhighlight %}

A komponensünket elmenteni a képernyő jobb alsó sarkában elbújó Add to diargram and close editor gombbal lehet.

![UMLet custom element](/artifacts/posts/2010-09-29-umlet-sajat-komponens/umlet_custom_element.png)

Itt a legérdekesebb, hogy a `g2` egy `Graphics2D` objektum, melyre lehet
rajzolni, ez egy standard JDK-ban található osztály. Ez gyakorlatilag a
komponens vászna. A `0,0` a bal felső sarka. Bizonyos számolásoknál
figyelembe kell venni azt is, hogy nemrég jelent meg a zoomolás
lehetősége az UMLet-ben, így a helyes koordináták meghatározásakor a
zoommal való szorzás elengedhetetlen (zoom = 1 a 100%-nál, zoom = 0.5
az 50%-nál).

Látható, hogy a forráskód írása közben fordítás történik, a hibás sorok
pirossal kerülnek kiemelésre, és az egeret felé víve megjelenik a
hibaüzenet. A háttérben ugyanis az történik, hogy a `custom_elements`
könyvtárban van egy `Default.java`, mely a default package-ben van,
osztályának nevét (`<!CLASSNAME!>`) kicseréli a `CustomElementImpl`-re, valamint a
`/****CUSTOM_CODE START****/` és a `/****CUSTOM_CODE END****/` szöveg közötti
szöveget kicseréli a szöveges mezőbe beírt
értékre. Ezt elmenti a Windowson a `custom_elements/tmp`, Linuxon a tmp könyvtárba, és futás közben
lefordítja az [Eclipse Java development tools
(JDT)](http://www.eclipse.org/jdt/) Core komponensével. Ez a
`com.baselet.element.old.custom.CustomElementCompiler` csomagban található. A
`Default.java` forráskódja a következő:

{% highlight java %}
import java.awt.*;
import java.util.*;

import com.baselet.control.constants.Constants;
import com.baselet.control.util.Utils;
import com.baselet.element.old.custom.CustomElement;

@SuppressWarnings("serial")
public class <!CLASSNAME!> extends CustomElement {

	public CustomElementImpl() {

	}

	@Override
	public void paint() {
		Vector<String> textlines = Utils.decomposeStrings(this.getPanelAttributes());

		/****CUSTOM_CODE START****/
//Modify the code below to define the element's behavior.
//
//Example:  Change the line
//  y += printCenter(textline,y);
//to
//  y += 2*printCenter(textline,y);
//and observe the element preview.

int y=textHeight();

drawRectangle(0,0,width,height);

for(String textline : textlines) {
	y += printCenter(textline,y);
}
		/****CUSTOM_CODE END****/
	}
}
{% endhighlight %}

Ebből a következő dolgok következnek. Az új komponens a
`com.baselet.element.old.custom.CustomElement` osztály leszármazottja, mely a
`com.baselet.element.old.OldGridElement` leszármazottja. Ezért ezekből származott
(nem private) változóit és metódusait el lehet érni. A `java.awt` és
`java.util` csomagban lévő osztályok használhatóak közvetlenül, a többit
teljes névvel (csomaggal együtt) kell megadni. A `textlines` változó is
elérhető a kódból, ami a Custom Code előtt lett definiálva. Ez tartalmazza
soronként a Properties ablak tartalmát, azaz ha paraméterezhetővé
akarjuk tenni a komponensünket, akkor ezt kell felhasználnunk, kiolvasva
innen a különböző értékeket (akár egyszerű szövegeket, akár kulcs-érték
párokat.)

Láthattuk azt is, hogy automatikus kódkiegészítés van a szövegszerkesztő
mezőben. Ez úgy lett megvalósítva, hogy a megfelelő metódusok a
`CustomElement` osztályban `@CustomFunction` annotációval vannak ellátva.

Persze ebben a környezetben kényelmetlen szerkeszteni, megtehetjük azt
is, hogy kedvenc IDE-nkbe csináljuk ugyanezt. Sajnos az UMLet legfrissebb
verziója nincs a központi Maven repository-ban. Hogy a lokális
repository-ban benn legyen, klónozzuk a Git repositry-t (https://github.com/umlet/umlet),
majd adjuk ki a
`mvn -pl .,umlet-elements,umlet-res,umlet-swing install` Maven parancsot.
Hozzuk létre egy Maven projektet `com.umlet:umlet-swing:14.3.0-SNAPSHOT`
függőséggel, és hozzunk létre egy osztályt a `Default.java` alapján. A
Custom Code közé írni a saját kódot, és ezt másolgatni az UMLet-be.
Egy példa projekt megtalálható a https://github.com/vicziani/umlet-components
címen.

Hasznos metódus még a `int textWidth(String)` metódus is, nézzük meg pl, ha a szöveget
nem középre, hanem lépcsőzetesen akarjuk elhelyezni:

{% highlight java %}
int x = 0;
int y = textHeight();
for (String textLine : textlines) {
    print(textLine, x, y);
    y = y + textHeight();
    x = x + textWidth(textLine);
}
{% endhighlight %}

![UMLet lépcsős komponens](/artifacts/posts/2010-09-29-umlet-sajat-komponens/umlet_custom_element_step.png)

Ha elmentjük a diagramot, akkor a Custom Element kódját is bele menti,
tehát hordozható.

Ha gyakran használunk egy bonyolultabb struktúrát (több komponenst),
akkor érdemes egy új komponenst létrehozni, mintegy sablonként, saját
szöveges konvenciót kitalálni a komponensek leírására, azt parse-olni,
és a megjelenítését megvalósítani. Példaképp vegyünk egy
csomagdiagramot. Ennek hierarchikus szerkezetét összerakhatjuk
komponensekből egyenként, a csomag komponensekből és a közöttük lévő
kapcsolatokból, de használhatunk összetett komponenst is. A következő
leíráson látható, hogy a struktúrát a behúzás mértéke adja meg:

<pre>
  root
   name
   name
    name
    name
  root
   name</pre>

Ennek grafikus reprezentációja:

![UMLet könyvtárstruktúra](/artifacts/posts/2010-09-29-umlet-sajat-komponens/umlet_package_tree.png)

Jó egy kicsit elszakadni a webes alkalmazásoktól, HTML-től, és kézben
tartani minden pixelt.