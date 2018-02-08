---
layout: post
title: Ant listener és logger osztályok
date: '2010-01-03T23:31:00.005+01:00'
author: István Viczián
tags:
- Ant
modified_time: '2018-02-08T20:31:00.000+01:00'
---

Az Ant (, a poszt írásakor a legfrissebb verzió a 1.7.1) lehetőséget
biztosít arra, hogy futását monitorozzuk, és a folyamat különböző
eseményeihez különböző műveleteket rendeljünk. Ehhez a `BuildListener` és
`BuildLogger` interfészeket kell implementálni, az abban definiált
metódusokat megvalósítani, és az Antot úgy indítani, hogy igénybe vegye
ezeket. Ezekről a
[kézikönyvön](http://ant.apache.org/manual/listeners.html) kívül a
Manning kiadónál megjelent *Erik Hatcher, Steve Loughran: Java
Development with Ant* könyv *20.2 Listeners and loggers* című fejezete is
részletesen ír.

Ezekből léteznek az Antban már implementációk, de írhatunk sajátokat is
egyszerű időmérésre, saját naplózás megvalósítására, de akár
bonyolultabb műveletekre is, mint pl. IDE fejlesztésekor a
fejlesztőeszközzel való kapcsolattartásra, vagy ha az Anthoz grafikus
felületet fejlesztünk, ezek adhatnak hírt a build folyamat pillanatnyi
állásáról.

A `BuildListener` interfész leszármazottja a `BuildLogger` interfész, ahogy
a következő UML osztálydiagram is mutatja.

![BuildLogger osztálydiagram](/artifacts/posts/2010-01-03-ant-listener-es-logger-osztalyok/buildlogger.png)

A `BuildListener` interfészben a build folyamat különböző lépéseinek
elindításához és elvégzéséhez is tartozik egy metódus, melyet az Ant hív
meg. Így meghívja a build folyamat indításakor a `buildStarted()`
metódust, és a végén a `buildFinished()` metódust. Ugyanígy vannak
metódusok a target és a task futtatásához is. Mindegyik paramétere a
`BuildEvent` osztály egy példánya, melytől le lehet kérni az éppen
feldolgozás alatt álló projektet (`BuildEvent.getProject()`), targetet
(`BuildEvent.getTarget()`) és taskot (`BuildEvent.getTask()`).
Természetesen aminek nincs értelme, `null`-t ad vissza, pl. a
`buildStarted()` esemény esetén a target és a task még `null`. Külön
megjegyzendő, hogy a build folyamat kezdetekor, mikor esemény
generálódik (`buildStarted()` metódus hívásakor) még nem dolgozta fel a
`build.xml` állományt, így a `BuildEvent.getProject()` is `null`-t fog
visszaadni. Ezen események bekövetkeztekor a `BuildEvent.getException()`
metódussal a kivételt is lekérdezhetjük. A `messageLogged()` metódus akkor
hívódik meg, mikor az Ant üzenetet naplóz. Ekkor az üzenetet a
`BuildEvent.getMessage()` metódussal tudjuk lekérni, és az üzenet
prioritását a `BuildEvent.getPriority()` metódussal. Fontos, hogy a
`messageLogged()` metódusban ne használjuk közvetlen `System.out`, vagy
`System.err` stream-ekre írást, mivel az Ant úgy működik, hogy ezen
streamek felett átveszi az irányítást, és ami ezekre kiírásra kerül,
azt adja tovább a `BuildListener`-nek. Így ha ebből ezekre a streamekre
írunk, végtelenciklus lesz a vége. Az inicializációs kódot javasolt a
konstruktorban elhelyezni.

Írjunk is meg egy egyszerű `BuildListener`-t, mely azt méri, hogy mely
target futása mennyi ideig tartott, névvel együtt.

{% highlight java %}
package jtechlog.ant;

import org.apache.tools.ant.BuildEvent;
import org.apache.tools.ant.BuildListener;

public class MeasureBuildListener implements BuildListener {
private long startedAt;
public void buildStarted(BuildEvent be) {
}

public void buildFinished(BuildEvent be) {
}

public void targetStarted(BuildEvent be) {
  startedAt = System.currentTimeMillis();
}

public void targetFinished(BuildEvent be) {
  System.out.println("A " + be.getTarget().getName() +
    " target futási ideje: " + (System.currentTimeMillis() - startedAt) + " ms");
}

public void taskFinished(BuildEvent be) {
}

public void taskStarted(BuildEvent be) {
}

public void messageLogged(BuildEvent be) {
}
}
{% endhighlight %}

Ahhoz, hogy ezt le is futtassuk, a saját osztályunkat el kell helyezni
az Ant classpath-jában, melyre a legegyszerűbb megoldás a `-lib` kapcsoló
használata. Ezen kívül a saját osztályunkat meg kell adni indítási
paraméterként a `-listener` kapcsolóval. Azaz a parancssor, ha az
osztályunk a `lib/jtechlog-listeners.jar` fájlban van, indítsuk így az
Antot:

    ant -lib lib -listener jtechlog.ant.MeasureBuildListener

Ekkor a classpath-hoz a `lib` könyvtárban található összes jar állományt
hozzá fogja adni, és így már megtalálja a
`jtechlog.ant.MeasureBuildListener` osztályt is.

A `BuildLogger` interfész annyival egészíti ki a `BuildListener`-t, hogy
képes hozzáférni a standard outputhoz, valamint errorhoz. Ezen kívül
megkapja a naplózás szintjét, valamint a emacs módot. Indítani a `-logger`
kapcsolóval lehet. Ha ilyent nem adunk meg, a `BuildLogger` interfészt
megvalósító `DefaultLogger` osztály fog elindulni. Ez egyrészt a naplózás
szintje alapján szűri az üzeneteket, valamint az emacs mód is
használható, mely arra való, hogy az IDE-k ezt a naplóformátumot könnyen
tudják feldolgozni. Egy Ant projekthez csak egy logger kapcsolható,
hiszen direkt hozzáférése van az output és error streamhez. A `-emacs`
kapcsolóval állítható az emacs mód, és a naplózás szintje pedig a `-quiet`
(kevés napló), `-verbose` (több napló) és `-debug` (még több napló)
kapcsolókkal. Előfordulhat olyan eset is, mikor még a `BuildLogger` nem
kapja meg az üzeneteket, pl. hibás inicializáció esetén, ha hiányzik a
`build.xml` állomány. Ilyenkor az üzenet a konzolra vagy fájlba mehet.

Több beépített naplózó is van, érdemes ezeket is megvizsgálni, saját
írása esetén ezek forráskódját is:

-   `DefaultLogger`: alapértelmezett naplózó
-   `NoBannerLogger`: nem írja ki a targetek neveit
-   `MailLogger`: e-mailt küld a build befejezésekor, a különböző
    beállítások property-kkel adhatóak meg
-   `AnsiColorLogger`: a különböző üzeneteket színkódokkal együtt írja ki,
    melyeket pl. az XTerm és a Win9x Console is tud értelmezni. A
    színkódokat felül is lehet definiálni egy properties fájlban,
    melynek helye property-ben adható meg.
-   `Log4jListener` (`ant-apache-log4j.jar` állományban): nagyon hasznos
    naplózó, képes a Log4J-t használni naplózáshoz (ha benne van a
    classpath-ban), és ekkor egy `log4j.properties` állománnyal
    konfigurálhatjuk, és kihasználható a Log4J teljes funkcionalitása,
    mint a Layoutok, Appenderek, stb.
-   `XmlLogger`: naplózás XML-be
-   `TimestampedLogger`: kiírja az időpontokat is
-   `BigProjectLogger`: nagy projekteknél alkalmazható, pl. minden task
    nevénél kiírja a projekt nevét is. Ennek akkor van értelme, ha egy
    `build.xml` a subant taskkal egy másik `build.xml` állományt hív meg.
-   `CommonsLoggingListener` (`ant-commons-logging.jar` állományban): a
    Commons Loggingot használja naplózáshoz, ami meg a Log4J-t, ha
    benne van a classpath-ban

Ezen naplózók is a `-logger` kapcsolóval használhatóak, pl.

    ant -logger org.apache.tools.ant.NoBannerLogger

A naplózás szinkron, azaz a lassú naplózás lassíthatja a build
folyamatot. Persze ez kivédhető Log4J esetén az `AsyncAppender`
használatával.

Az itt említett property-k az `ANT_OPTS` környezeti változóban megadott
`-D` kapcsolóval adhatóak meg, vagy a `build.xml`-ben az `init` targetben
megadott taggel.

A `BuildListener`-nek van egy `SubBuildListener` leszármazottja is, ami
olyan metódusokat definiál, melyek akkor hívódnak meg, ha egy gyermek
build folyamat elindul vagy befejeződik (pl. `ant`, `subant`, `antcall`
taskkal).
