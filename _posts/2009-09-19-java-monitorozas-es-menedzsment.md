---
layout: post
title: Java monitorozás és menedzsment
date: '2009-09-19T23:05:00.004+02:00'
author: István Viczián
tags:
- Java SE
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Technológiák: Servlet 3.0, JMX

Sajnos fejlesztés közben viszonylag kevés figyelmet fordítunk arra, hogy
könnyen üzemeltethető alkalmazásokat készítsünk. Pedig a Java
technológia lehetőséget biztosít, csak kicsit jobban oda kell
figyelnünk, kicsit jobban ki kell használni az eszközöket és az API-kat.

Hogy erre felhívjam a figyelmet, 2009. szeptember 16-án a SZÁMALK
Aktuális 2009 rendezvényén előadást tartottam "Hol a határ? - Java
alkalmazások üzemeltetéséről fejlesztőknek és üzemeltetőknek" címmel.

Az előadás során végigvettem egy fejlesztési életciklust, valamint egy
tipikus n-rétegű alkalmazás architektúrát, és elemeztem a fejlesztők és
az üzemeltetők feladatait, valamint a lehetséges konfliktus forrásokat.

Konklúzióként levonható, hogy a technológia már nagyon jó eszközöket ad
a kezünkbe, a probléma mindig emberi oldalon szokott jelentkezni.

Java szempontjából talán a következőket érdemes kiemelni:

-   Vastag kliens esetén a telepítés és a frissítések kezelésére érdemes
    a Java Web Start technológiát használni, mely alapban a JRE része.
-   Hasznos eszköz a JConsole, mely a JDK része, és a futó Java
    alkalmazásokhoz képes hozzákapcsolódni, és azok állapotát
    lekérdezni.
-   Hasznos API a Java Management Extensions (JMX), mely használatával
    könnyen üzemeltethető alkalmazásokat tudunk készíteni.

A JMX a Java SE 5.0-tól a platform része, olyan szabványos programozói
interfész ([JSR 3](http://jcp.org/en/jsr/detail?id=3)), melyel
monitorozható és menedzselhető alkalmazásokat tudunk készíteni. A JMX
alapját egy vagy több Java objektum, ún. managed bean (MBean) képviseli.
Az MBean-eket az MBean szerverbe kell regisztrálni, hogy a kliensek el
tudják érni. Egy MBean-nek lehetnek attribútumai, melyeket lehet írni
és/vagy olvasni, lehetnek műveletek (operations), melyeket meg lehet
hívni, valamint bizonyos értesítéseket küldhetnek. Ezáltal az MBean-eken
keresztül megfigyelhető egy alkalmazás állapota, közbe lehet avatkozni,
és bizonyos eseményekről is értesítést kaphat az üzemeltető. Az MBean-ek
lokálisan, de távolról is elérhetőek ([JSR 160, Java Management
Extensions Remote API](http://jcp.org/en/jsr/detail?id=160)).

Amennyiben elindítunk egy Java programot, és elindítjuk a JConsole
alkalmazást, információt kaphatunk a memóriafogyasztásról, futó
szálakról, betöltött osztályokról, stb. Az utolsó, MBeans nevezetű fülön
jelennek meg az MBean-ek. Látható, hogy minden konfiguráció nélkül is
van pár MBean, melyek a JVM-ről adnak információkat (memóriahasználat,
szemétgyűjtő, osztálybetöltő, operációs rendszer környezet, stb.),
valamint a JVM működésébe lehet beavatkozni (pl. java.lang/Memory - gc
művelet).

A legtöbb alkalmazásszerver menedzsmentje is a JMX-re épül. Ilyen a
Tomcat is, mely szintén JMX-en biztosítja a [monitorozást és a
menedzsmentet](http://tomcat.apache.org/tomcat-6.0-doc/monitoring.html).
Ekkor amint csatlakozunk a JConsole-lal a Tomcat-et futtató JVM-hez, az
MBeans fülön megjelenik a Catalina és a Users folder. Ezekben rengeteg
MBean-t találhatunk. A Tomcat olyan szinten biztosít információkat, mint
pl. egy servlet betöltési ideje, meghívásának száma, legkisebb és
legnagyobb lefutási idő, összes idő, mennyit hibázott, stb
(Catalina/Servlet folder).

Nézzünk is egy példát, írjunk egy egyszerű webes alkalmazást. Letölthető
a <https://github.com/vicziani/jtechlog-jmx> címről. Jettyn is megy,
Maven-nel build-elhető, és a letöltést követően a 'mvn jetty:run'
paranccsal futtatható. Az alkalmazás egy servletből áll, mely egy
számlálót növel minden egyes meghívásakor. Ezt szeretnénk kiajánlani
JMX-en. A számlálóhoz készítsünk egy külön osztályt Counter néven.

{% highlight java %}
public class Counter
    implements CounterMBean {

private long value;

public long getValue() {
    return value;
}

public void setValue(long value) {
    this.value = value;
}

public void storno() {
    value = 0;
}

synchronized public void incrementCounter() {
    value++;
}
}
{% endhighlight %}

Ennek incrementCounter metódusát hívja a szerver. Ahogy látható,
implementálja a CounterMBean interfészt, melyen keresztül a JMX-en ki
lesz ajánlva.

{% highlight java %}
public interface CounterMBean {
public long getValue();
public void setValue(long counter);
public void storno();
}
{% endhighlight %}

Eztán már csak egy ServletContextListener-t kell implementálni, mely az
induláskor regisztrálja az MBean-t, leálláskor meg megszünteti a
regisztrációt.

{% highlight java %}
@WebListener
public class InitServletListener implements ServletContextListener {
public void contextInitialized(ServletContextEvent sce) {
    try {
        MBeanServer mbs = ManagementFactory.getPlatformMBeanServer();
        CounterMBean counter = new Counter();
        mbs.registerMBean(counter,
    new ObjectName("jtechlog:type=Counter"));

        sce.getServletContext().setAttribute("counter", counter);
    } catch (Exception e) {
        e.printStackTrace();
    }
}

public void contextDestroyed(ServletContextEvent sce) {
    try {
     MBeanServer mbs = ManagementFactory.getPlatformMBeanServer();
     mbs.unregisterMBean(new ObjectName("jtechlog:type=Counter"));
    } catch (Exception e) {
        e.printStackTrace();
    }
}
}
{% endhighlight %}

A web alkalmazást, majd a JConsole-t elindítva láthatjuk, hogy megjelent
a jtechlog folder, és azon belül a Conter MBean. Lekérdezhetjük vagy
beállíthatjuk a value értékét, vagy meghívhatjuk a storno műveletet.

Amennyiben értesítést is szeretnénk kapni a számláló értékének
változásáról, a NotificationBroadcasterSupport osztályból kell
származtatni, implementálni kell a getNotificationInfo metódust, majd
meghívni a sendNotification metódust.

{% highlight java %}
...
synchronized public void incrementCounter() {
    value++;
    Notification n =
        new AttributeChangeNotification(this,
        sequenceNumber++,
        System.currentTimeMillis(),
        "Counter value has changed",
        "Counter value",
        "long",
        value - 1,
        value);

        sendNotification(n);
}

@Override
public MBeanNotificationInfo[] getNotificationInfo() {
    String[] types = new String[]{
        AttributeChangeNotification.ATTRIBUTE_CHANGE
    };
    String name = AttributeChangeNotification.class.getName();
    String description = "An attribute of this MBean has changed";
    MBeanNotificationInfo info =
            new MBeanNotificationInfo(types, name, description);
    return new MBeanNotificationInfo[]{info};
}
...
{% endhighlight %}

A legjobb, hogy ezeket az értékeket nem csak JConsole-ról tudjuk
lekérdezni, hanem parancssorból is, a Tomcat Ant task-okat definiál
erre. (Használatához a catalina-ant.jar-t kell a \$CATALINA\_HOME/lib
könyvtárból az \$ANT\_HOME/lib könyvtárba másolni.) A következő
build.xml részlettel lehet lekérni a számláló értékét.

{% highlight xml %}
<jmx:open
host="${jmx.server.name}"
port="${jmx.server.port}"/>
<jmx:get
name="jtechlog:type=Counter"
attribute="Value"
resultproperty="value"
echo="false"
/>
<echo message="${value}" />
{% endhighlight %}

Ez azért nagyszerű, mert így bármilyen monitorozó vagy menedzsment
eszközbe (pl. Munin, Nagios) könnyen be tudjuk kötni.
