---
layout: post
title: Tapasztalatok a Java Platform Module Systemmel
date: '2018-04-15T11:00:00.000+02:00'
author: István Viczián
description: Példa projekt a Java 9 Java Platform Module Systemmel (Jigsaw).
---

Nagy rajongója vagyok a modularizálás témakörének, mint ezt több korábbi posztban is említettem ([Modularizáció Servlet 3, Spring és Maven környezetben](/2015/08/27/modularizacio.html), [Java Application Architecture](/2014/10/04/java-application-architecture.html)). A Java Application Architecture könyv szerint a modularizálás első eszköze a csomagok, azonban ezek nem adnak megfelelő felügyeletet a láthatóság felett, hiszen nem lehet definiálni egy csomag láthatóságát, így azt sem lehet megmondani, hogy egy csomagban lévő osztályok, interfészek, stb. mely más csomagban található osztályok, interfészek, stb. számára legyenek láthatóak. A következő szint a JAR állományok, azonban az alapvető elvárásokat ez sem teljesítette, mint pl. az előbb említett láthatóságokkal kapcsolatos igényeket. Erre egy kezdeti megoldást a build eszköz (pl. Maven) adott, multi-module projektek használatával. Azonban itt sem lehetett definiálni, hogy egy modulon belül mi látható, és mi nem. Kizárólag modulokat lehetett definiálni, és ezek közötti függőségeket. A másik megoldás a Java részét nem képező OSGi jelentette, azonban ennek nehézkessége elég sokakat eltántorított.

A Java 9-ben jelent meg egy megoldás a fentebb vázolt problémákra, Java Platform Module System néven. Elég régóta húzódik ennek kiadása, egészen a Java 7-től kezdve ígérgették, akkor még Jigsaw néven. Figyelembe kell venni azonban azt is, hogy nem csak a lehetőségét adták meg a modularizációnak, hanem a teljes JDK-t is modularizálták. Már nem egy `rt.jar` állományban van a teljes osztálykönyvtár, hanem a `jmods` könytárban van majdnem száz `jmod` kiterjesztésű állomány, mely a modulokat tartalmazza.

Ebben a posztban egy példa alkalmazás implementációja közben szerzett tapasztalatokat szeretném megosztani. A projekt elérhető a [GitHubon](https://github.com/vicziani/jtechlog-modulesystem).

<!-- more -->

Az alkalmazás könyvjelzők kezeléséért felelős, RESTful API-val rendelkező webes alkalmazás. Alapvetően két modulból áll, ebből egyik a `backend` modul, mely a `Bookmark` osztályt, valamint a példányainak kezeléséért felelős `BookmarkService` interfészt deklarálja. Itt szerepel még ennek egy implementációja is `BookmarkServiceImpl` néven, mely egy szinkronizált statikus kollekcióban tartja nyilván az elemeket. A `frontend` modul Jersey alkalmazás, ami a Java SE beépített HTTP szerverét használja, és egy `/bookmarks` erőforráson lehet JSON-ben a könyvjelzőket letölteni, valamint új könyvjelzőt postolni.

Java 8, de későbbi JDK-k esetén is felépíthető klasszikus multi-module Maven projektként, ahol függőség csak a `frontend` modulról a `backend` modulra van. Ezt szerettem volna úgy továbbfejleszteni, hogy megfeleljen a Java Platform Module Systemnek.

Ehhez mindkét modulban egy `module-info.java` állományt kellett definiálni. A `backend` modulban csak deklarálni kellett a modult a következőképp:

{% highlight java %}
module backend {
    exports jtechlog.backend to frontend;
}
{% endhighlight %}

Ez azt mondja meg, hogy a `frontend` modul számára a `backend` modul tegye láthatóvá a `jtechlog.backend` csomag tartalmát. Itt van egy kis ellentmondás, hogy a `backend` modul tud a `frontend` modulról, de ez csak szigorítás, írhatnánk az `exports` részt `to` nélkül is. A modul többi csomagja rejtett marad a külvilág elől.

A `frontend` modulnak csak annyit kell definiálnia, hogy használja a `backend` modult. Ennek formája a következő:

{% highlight java %}
module frontend {
    requires backend;
}
{% endhighlight %}

Ezzel elméletileg működőképes is az alkalmazás, adott két modul, a `frontend` modul használja a `backend` modult, de számára abból csak a `jtechlog.backend` csomag látszik, a többi nem hozzáférhető. Már ezzel elég sok architektúrális hibát ki lehet védeni. De látni fogjuk, hogy még sokat kellett dolgozni, hogy a projekt működőképessé váljon, miután megjelentek a `module-info.java` állományok.

Amiről még szót szeretnék ejteni, az a Java SE service provider megoldása. Ez azt jelenti, hogy definiálunk egy interfészt, és a moduljainkban közreadhatjuk ezek implementációit. Az implementációra nem is kell rálátnia az azt használó modulnak, elég az interfészre. Az implementációkhoz utána a `ServiceLoader` osztállyal tudunk később hozzáférni. Ez a mechanizmus tökéletesen alkalmas arra, hogy pl. létezik valamilyen szabványunk, valamilyen interfész gyűjteményünk, és ezen valamely implementációját szeretnénk használni. Elvárt igény, hogy az implementáció cserélhető legyen, lehetőleg egy függőség kicserélésével. (Ez valójában a Bridge tervezési minta.) Jó példa erre pl. a JDBC, az összes XML API, pl. JAXP, StAX, JAXB, stb. Ezek szabványok, és különböző implementációik léteznek.

Ennek demonstrálására készült a `BookmarkService` és ennek implementációja, a `BookmarkServiceImpl`. Azonban azért, hogy az interfész látható legyen a `frontend` modul számára, az implementáció viszont ne, ez utóbbit elmozgattam a `jtechlog.backend.impl` csomagba. A `module-info.java` állományt a következőképp kellett módosítani:

{% highlight java %}
module backend {
    exports jtechlog.backend to frontend;
    provides jtechlog.backend.BookmarkService with jtechlog.backend.impl.BookmarkServiceImpl;
}
{% endhighlight %}

Ez mondja meg, hogy a modul a `BookmarkService` interfésznek ad egy implementációt a `BookmarkServiceImpl` osztállyal.

Nézzük, hogyan kell ezt a `frontend` modulból használni. A `module-info.java` állományt a következőképp kellett módosítani:

{% highlight java %}
module frontend {
    requires backend;
    uses jtechlog.backend.BookmarkService;
}
{% endhighlight %}

Ez mondja, hogy a modulnak szüksége van egy `BookmarkService` implementációra.

Hozzáférni a `ServiceLoader` osztállyal lehet. Mivel egyszerre több implementáció is lehet a classpath-on, akár különböző modulokban, ezért ezekhez egy iterátorral lehet hozzáférni. Nézzük, hogyan:

{% highlight java %}
ServiceLoader<BookmarkService> bookmarkServices = ServiceLoader.load(BookmarkService.class);
Iterator<BookmarkService> i = bookmarkServices.iterator();
if (i.hasNext()) {
    return i.next();
}
else {
    throw new IllegalStateException("Service not found");
}
{% endhighlight %}

Bár itt van egy statikus metódus hívás, a Spring Framework pl. képes a `ServiceLoader` példányt dependency injectionnel értékül adni.

Ezzel el is készült az alkalmazásunk. Nézzük sorban, hogy a megvalósítás során milyen problémákba futottam bele.

Egyrészt a `pom.xml` állományban feljebb kellett állítani a Java verziószámot.

{% highlight xml %}
<maven.compiler.source>10</maven.compiler.source>
<maven.compiler.target>10</maven.compiler.target>
{% endhighlight %}

Mivel már a 10-es JDK-t telepítettem, ez valós verziószám. Azonban ahhoz, hogy működjön, az IntelliJ IDEA-ból is a legfrissebbet, a 2018.1.1 verziót kellett telepítenem, ugyanis korábbiban nem tudtam hozzáadni a 10-es JDK-t.

A következő meglepetés az volt, hogy a Jersey előző verziója nem volt hajlandó a 10-es JDK-val működni. A legutolsóra állítva (2.27) azonban a hiba megoldódott, így ez egy tanulság, hogy lehet, hogy egy 3rd party library régebbi verziója nem fog a legfrissebb Javaval és a Java Platform Module Systemmel együttműködni.

A következő meglepetés, hogy a Java SE 9-ben arról döntöttek, hogy eltávolítják a Java EE API-kat. Ennek esett áldozatául pl. a JAXB, valamint az Activation is. Ezért ezeket explicit módon fel kellett venni Maven függőségként.

{% highlight xml %}
<dependency>
    <groupId>javax.xml.bind</groupId>
    <artifactId>jaxb-api</artifactId>
    <version>2.2.11</version>
</dependency>
<dependency>
    <groupId>com.sun.xml.bind</groupId>
    <artifactId>jaxb-impl</artifactId>
    <version>2.2.11</version>
</dependency>
<dependency>
    <groupId>javax.activation</groupId>
    <artifactId>activation</artifactId>
    <version>1.1.1</version>
</dependency>
{% endhighlight %}

A `frontend` modulban a `module-info.java` állományba is fel kellett venni azon modulokat, melyeket használ, ilyen a JAX-WS AP (`java.ws.rs`), Jersey (`jersey.server`, `jersey.container.jdk.http`), valamint a Java SE HTTP szerver is (`jdk.httpserver`).

Így módosul a `frontend` modulban a `module-info.java` állomány:

{% highlight java %}
module frontend {
    requires jdk.httpserver;
    requires jersey.server;
    requires jersey.container.jdk.http;
    requires java.ws.rs;
    requires backend;

    uses jtechlog.backend.BookmarkService;
}
{% endhighlight %}

Ezen kívül a Jersey a működéséhez hozzá kell, hogy férjen a `frontend` osztályaihoz, hiszen reflectionnel deríti fel őket, pl. a `@Path` és `@Provider` annotációval ellátott osztályokat. Valamint a JSON-né konvertáláshoz a `backend` modulban a `Bookmark` osztályhoz is hozzá kell férnie. Így azonban kialakul egy körkörös függőség, ami bár most szükséges, nem megnyugtató.

A végleges állományok tehát így néznek ki:

{% highlight java %}
module backend {
    exports jtechlog.backend to frontend, hk2.locator, jackson.databind;
    provides jtechlog.backend.BookmarkService with jtechlog.backend.impl.BookmarkServiceImpl;
}
{% endhighlight %}

{% highlight java %}
module frontend {
    requires jdk.httpserver;
    requires jersey.server;
    requires jersey.container.jdk.http;
    requires java.ws.rs;
    requires backend;

    exports jtechlog.frontend to jersey.server, hk2.locator;
    uses jtechlog.backend.BookmarkService;
}
{% endhighlight %}
