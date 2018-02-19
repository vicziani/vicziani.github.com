---
layout: post
title: Szöveg generálás
date: '2009-03-30T00:26:00.006+02:00'
author: István Viczián
tags:
- Utils
modified_time: '2018-02-19T21:11:00.000+01:00'
---

Lehet olyan eset, mikor egy weboldalnak nem kell dinamikusnak lennie,
egyszerűen elegendő, ha dinamikusan generáljuk a statikus HTML
oldalakat. Ez lehet egyszerű eset, mikor csak nem akarunk HTML kódot
ismételni, és ezért a fejlécet, láblécet külön állományba tesszük ki,
mert gyakrabban változik (persze ha a webszerverünk ismeri a server
side include-ot, az is jó választás lehet, de abban az esetben az
összeállt oldalt csak a webszerveren tudjuk megnézni). Ezt használom
például a honlapom előállításakor, valamint több felhasználói interfész
prototípust is így készítettem. Gondoljuk el, elkészítjük a HTML
terveket, majd a felhasználó a menüben kér egy módosítást. Persze ez is
kikerülhető, ha már rögvest egy dinamikus prototípust állítunk össze
(pl. kizárólag JSP alapokon), de ahhoz már környezet kell, valamint
kicsit több munkabefektetés, és nem lehet az egészet egy ZIP állományban
átküldeni. Ezzel megoldhatóak apróbb trükkök is, pl. lapozás, de akár
bizonyos tartalmak esetén adatbázisból való kiolvasás.

Ennek egy továbbgondolt változata, a statikus HTML tartalom dinamikus
előállításának, hogy egy CMS-be visszük fel a tartalmat, ami viszonylag
ritkán változik, és az generál ki statikus tartalmat. Akár több
formátumban is. Az Atlassian Confluence nagyvállalati wiki pl. képes
HTML vagy PDF exportra is. Használható belső szerkesztőségi rendszernek,
és a tartalmat módosítás esetén elegendő kipublikálni a webszerverre.
Ekkor a szerveren egy webszerveren kívül semmilyen más szoftvert nem
kell telepíteni, üzemeltetni, kevéssé terheli az erőforrásokat, stb.

Szóval gondoljuk meg, ha ritkán változó tartalmunk van, nem érdemes-e
dinamikus forrásból időnként kigenerálni, és azt publikálni.

Ennek megvalósítására kitűnő eszköz lehet a [Apache
Texen](https://velocity.apache.org/texen/1.0/), mely a
Velocity projekt része. Valójában egy nagyon egyszerű Ant task, mely a
Velocity-t hívja szöveg generálására. Persze nem csak HTML tartalom
kigenerálására használható, hanem bármilyen, sablon alapú szövegre. Pl.
ezt használja a Turbine web framework Torque ORM része SQL és a mapping
file kigenerálására. De generálhatunk vele XML-t, Java forráskódot, így
akár egy MDA keretrendszerbe is beilleszthető lenne, stb.

[Példa projekt](https://github.com/vicziani/jtechlog-texen) megtalálható a GitHub-on.
Ez nem Ant projekt, hanem Maven projekt, mely Antot hív.

A Texent egy control template irányítja, amiben a Velocity nyelvén kell
leírnunk, hogy hogyan is történjen a generálás. Ez tipikusan végigmegy a
szintén Velocity nyelvén írt sablon állományokon (egyen akár többször
is), és kigenerálja a szöveges állományokat. A Velocity contextbe több
segédobjektumot is elhelyezésre kerül, pl. a generálást végző
`Generator`
objektumot, az output könyvtár nevét, egy szövegműveletekre használható
`StringUtils`
példányt, fájlműveletekre használható
`FileUtil`
példányt, vagy property-k kezelésére való
`PropertiesUtil`
példányt. A Velocity nyelve azért alkalmas különösen erre, mert a
context-be rakott objektumokat nem csak olvasni tudjuk, hanem
tetszőleges metódusukat is meg tudjuk hívni (szemben pl. a JSP-vel).

Egy példa Velocity vezérlő állomány lehet a következő:

    Generating mockups for templates in $generator.getTemplatePath() directory.

    #foreach ($file in $files.file($generator.getTemplatePath()).list())
     #if ($file.endsWith(".htm") || $file.endsWith(".html"))
    Generating file to $file template.
       $generator.parse($file, "UTF-8", $file, "UTF-8", null, null)
     #end
    #end

Az állomány végigmegy a sablonokat tartalmazó könyvtár összes
állományán, és ha `htm` vagy `html` kiterjesztésre végződik, akkor végrehajtja azokat
(látszik, hogy itt kell a kódolást is megadni). A generálás kimenete egy
riport lesz, mely ezen vezérlő állomány alapján keletkezik.

A Texent futtatni Anttal lehetséges, melynek egy példa `build.xml`
állománya:

{% highlight xml %}
<project name="generator" default="gen" basedir=".">

 <path id="classpath">
   <fileset dir="lib" includes="*.jar"/>
 </path>

 <taskdef name="texen"
   classname="org.apache.texen.ant.TexenTask"
   classpathref="classpath"/>

 <target name="gen">
   <texen controlTemplate="control.vm"
          outputDirectory="build"
          templatePath="templates"    
          outputFile="generation.report"
          outputEncoding="UTF-8" inputEncoding="UTF-8"/>
 </target>
</project>
{% endhighlight %}

Ekkor a Texenhez szükséges JAR-okat a lib könyvtárban helyezzük el
(`commons-collections`, `commons-lang`, `texen`, `velocity`). A templates
könyvtárban kell elhelyezni a `control.vm` állományt és a HTML sablonokat
is. Az állományokat, és a riportot tartalmazó (`generation.report`)
állományt a `build` könyvtárban fogja elhelyezni. Figyeljük meg, hogy itt
adható meg a kódolás is. A következő példa egy egyszerű sablon állományt
mutat, mely beemeli a fejlécet és láblécet:

{% highlight xml %}
<html>
 <body>
   #parse('header.vm')
   Content.
 </body>
</html>
{% endhighlight %}

Amennyiben személyre akarjuk szabni a Texent, a
`org.apache.texen.ant.TexenTask` Ant taskot kell leszármaztatnunk, és a
`populateInitialContext` metódusát implementálnunk. Ennek a metódusnak a
feladata a Velocity context feltöltése. Ide akár egyszerű szöveg
konstruálásától kezdve adatbázisból való lekérdezéséig bármit
implementálhatunk. Példánkban írjuk ki magyar formátumban a generálás
dátumát. A szükséges Java osztályt a következő kódrészlet mutatja:

{% highlight java %}
package jtechlog.mytexentask;

import java.util.Date;
import java.util.Locale;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import org.apache.texen.ant.TexenTask;
import org.apache.velocity.context.Context;

public class MyTexenTask extends TexenTask {

private static final String FORMAT = "yyyy MMMM dd. hh:mm";

private static final Locale HU = new Locale("hu", "HU");

   protected void populateInitialContext(Context context)
                                  throws Exception {
       DateFormat df = new SimpleDateFormat(FORMAT, HU);
    context.put("dateOfGeneration", df.format(new Date()));
   }

}
{% endhighlight %}

Ez a `dateOfGeneration` névvel fog betenni egy String objektumot a
contextbe. Ahhoz, hogy ebből egy Ant task legyen, használjuk az Ant
1.7-től rendelkezésre álló antlib lehetőséget, a `jtechlog.mytexentask`
package-ben hozzunk létre egy `antlib.xml` állományt, majd csomagoljuk a
lefordított class, valamint az xml állományt egy `mytexentask.jar`
állományba. Az `antlib.xml` tartalma:

{% highlight xml %}
<?xml version="1.0" ?>
<antlib>
 <typedef name="MyTexenTask"
  classname="jtechlog.mytexentask.MyTexenTask" />
</antlib>
{% endhighlight %}

Hogy ezt felhasználhassuk, az `mytexentask.jar` állományt tegyük az
eredeti projektünk `lib` könyvtárába, és a `build.xml` állományba módosítsuk
a `project`, `taskdef` és a `texen` tageket.

{% highlight xml %}
<project name="name="generator" " default="gen" basedir="."
  xmlns:mytexentask="antlib:jtechlog.mytexentask">
...
<taskdef uri="antlib:jtechlog.mytexentask"
  resource="jtechlog/mytexentask/antlib.xml"
  classpathref="classpath"/>

<mytexentask:MyTexenTask
 controlTemplate="control.vm"
 outputDirectory="build"
 templatePath="templates"
 outputFile="generation.report"
 outputEncoding="UTF-8" inputEncoding="UTF-8"/>
{% endhighlight %}

Eztán máris használhatjuk a `dateOfGeneration` változót a sablonunkban:

{% highlight xml %}
<html>
 <body>
   #parse('header.vm')
   Content. $dateOfGeneration
 </body>
</html>
{% endhighlight %}
