---
layout: post
title: Java monitorozás és menedzsment
date: '2009-09-19'
author: István Viczián
tags:
- Java
- Spring
- DevOps
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

<iframe id="iframe_container" webkitallowfullscreen="" mozallowfullscreen="" allowfullscreen="" src="https://prezi.com/embed/gmyp8jz3v3aw/?bgcolor=ffffff&amp;lock_to_path=0&amp;autoplay=0&amp;autohide_ctrls=0&amp;landing_data=bHVZZmNaNDBIWnNjdEVENDRhZDFNZGNIUE43MHdLNWpsdFJLb2ZHanI5KzYxeUhOOVMxVEdqcVhTdnM2MlRSdDVBPT0&amp;landing_sign=Lp3-adHbQu8nCGOY-PL4gNaTESQH067DNwaC-FYUYw4" width="550" height="400" frameborder="0"></iframe>

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
interfész ([JSR 3](https://jcp.org/en/jsr/detail?id=3)), melyel
monitorozható és menedzselhető alkalmazásokat tudunk készíteni. A JMX
alapját egy vagy több Java objektum, ún. managed bean (MBean) képviseli.
Az MBean-eket az MBean szerverbe kell regisztrálni, hogy a kliensek el
tudják érni. Egy MBean-nek lehetnek attribútumai, melyeket lehet írni
és/vagy olvasni, lehetnek műveletek (operations), melyeket meg lehet
hívni, valamint bizonyos értesítéseket küldhetnek. Ezáltal az MBean-eken
keresztül megfigyelhető egy alkalmazás állapota, közbe lehet avatkozni,
és bizonyos eseményekről is értesítést kaphat az üzemeltető. Az MBean-ek
lokálisan, de távolról is elérhetőek ([JSR 160, Java Management
Extensions Remote API](https://jcp.org/en/jsr/detail?id=160)).

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

Nézzünk is egy példát, írjunk egy egyszerű webes alkalmazást. 

{% include github-callout.html url="https://github.com/vicziani/jtechlog-jmx" %}

Jettyn is megy,
Maven-nel build-elhető, és a letöltést követően a `mvn jetty:run`
paranccsal futtatható. Az alkalmazás egy servletből áll, mely egy
számlálót növel minden egyes meghívásakor. Ezt szeretnénk kiajánlani
JMX-en. A számlálóhoz készítsünk egy külön osztályt Counter néven.

```java
public class Counter implements CounterMBean {

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
```

Ennek `incrementCounter` metódusát hívja a szerver. Ahogy látható,
implementálja a `CounterMBean` interfészt, melyen keresztül a JMX-en ki
lesz ajánlva.

```java
public interface CounterMBean {
public long getValue();
public void setValue(long counter);
public void storno();
}
```

Eztán már csak egy `ServletContextListener`-t kell implementálni, mely az
induláskor regisztrálja az MBean-t, leálláskor meg megszünteti a
regisztrációt.

```java
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
```

A web alkalmazást, majd a JConsole-t elindítva láthatjuk, hogy megjelent
a `jtechlog` folder, és azon belül a `Counter` MBean. Lekérdezhetjük vagy
beállíthatjuk a `value` értékét, vagy meghívhatjuk a `storno` műveletet.

Amennyiben értesítést is szeretnénk kapni a számláló értékének
változásáról, a `NotificationBroadcasterSupport` osztályból kell
származtatni, implementálni kell a `getNotificationInfo` metódust, majd
meghívni a `sendNotification` metódust.

```java
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
```

A legjobb, hogy ezeket az értékeket nem csak JConsole-ról tudjuk
lekérdezni, hanem parancssorból is, a Tomcat Ant task-okat definiál
erre. (Használatához a `catalina-ant.jar`-t kell a `$CATALINA_HOME/lib`
könyvtárból az `$ANT_HOME/lib` könyvtárba másolni.) A következő
`build.xml` részlettel lehet lekérni a számláló értékét.

```xml
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
```

Ez azért nagyszerű, mert így bármilyen monitorozó vagy menedzsment
eszközbe (pl. Munin, Nagios) könnyen be tudjuk kötni.
