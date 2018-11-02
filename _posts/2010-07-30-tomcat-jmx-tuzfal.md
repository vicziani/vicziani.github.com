---
layout: post
title: Tomcat JMX tűzfalon keresztül
date: '2010-07-30T19:02:00.007+02:00'
author: István Viczián
tags:
- JMX
- Tomcat
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Technológiák: Tomcat 6.0.24, JMX

Elég nagy problémám volt sokáig, hogyha egy Tomcat-et akartam JMX-en
monitorozni, melyet tőlem egy tűzfal választott el. Írtam már erről
részletesebben egy [korábbi
posztban](/2009/09/19/java-monitorozas-es-menedzsment.html), álljon itt
csak annyi, hogy le kellett kérdeznem egy menedzsment és monitorozó
eszközből a következő értékeket: adatbázis connection pool mérete
(várakozó és aktív kapcsolatok száma), session-ök száma az alkalmazáson
belül, Connector várakozó és kiszolgáló szálak száma,
memóriafelhaszálás, stb.

Ha nincs tűzfal, a megoldás egyszerű. A Tomcat-et úgy kell indítani,
hogy JMX-en keresztül is kapcsolódni lehessen hozzá. Ezt úgy lehet
megtenni, hogy bizonyos környezeti paramétereket át kell neki adni.
Javasolt a bin könyvtárába egy setenv.sh-t elhelyezni, és a következőt
írni:

      set CATALINA_OPTS=-Dcom.sun.management.jmxremote \
       -Dcom.sun.management.jmxremote.port=%my.jmx.port% \
       -Dcom.sun.management.jmxremote.ssl=false \
       -Dcom.sun.management.jmxremote.authenticate=false

Meg kell jegyezni, hogy ezek akár egy külön properties állományban is
megadhatóak, akkor a -Dcom.sun.management.config.file paramétert kell
átadni a Tomcat-et indító JVM-nek.

Ekkor akár jconsole, akár jvisualvm (persze csak az MBean plugin
telepítése után) kapcsolódni lehet a Tomcat-hez, a host és a port
megadásával, és lehet kezelni JMX-en keresztül.

Tűzfal esetén ez nem működött, nosza engedjük át a %my.jmx.port% helyett
megadott port-ot a tűzfalon, vagy SSL tunel-lel hozzuk ki. Sajnos ez sem
jó megoldás, ugyanis igaz, hogy a JMX kliens az ott megadott port-on
próbál kapcsolódni, de utána megbeszélnek egy port-ot, melyen a további
kommunikáció történik. Mivel itt a szerver választ egy következő szabad
port-ot, ezt is át kéne engedni, vagy kihozni, csakhogy ez nem definit.

Egy működő megoldás volt, hogy a JMX klienst az adott szerveren indítjuk
el. Webes eszköz esetén böngészőből lehetett csatlakozni, vastag kliens
esetén azonban az X-et kellett ssh-n keresztül kihozni. Egyik sem
szerencsés megoldás, hiszen viszonylag sok konfigurációt igényel.

A [JDK dokumentációja
szerint](http://download.oracle.com/javase/6/docs/technotes/guides/management/agent.html#gdfvv)
megvalósítható az, hogy rákényszerítjük a JDK-t arra, hogy az
RMIServer-t, melyben a távolról meghívható RMI objektumok vannak, egy
már általunk a megadott porton létrehozott RMI registry-be regisztrálja
be. Ezt Mimicking Out-of-the-Box Management-nek hívja. Tehát ehhez el
kell indítanunk egy RMI registry-t, majd létre kell hoznunk egy
JMXServiceURL példányt, valamint egy JMXConnectorServer-t, melynek
átadjuk ezt. A környezeti változókat nem írva, ez kb. így néz ki:

{% highlight java %}
LocateRegistry.createRegistry(3000);
MBeanServer mbs = ManagementFactory.getPlatformMBeanServer();
JMXServiceURL url =
  new JMXServiceURL("service:jmx:rmi://localhost:3001/jndi/rmi://localhost:3000/jmxrmi");
JMXConnectorServer cs = JMXConnectorServerFactory
  .newJMXConnectorServer(url, env, mbs);
cs.start();
{% endhighlight %}

Ekkor a 3000-es porton indul el az RMI registry, és a 3001-esen az RMI
server.

De nekünk arra van szükségünk, hogy a Tomcat végezze el ezt. A Tomcat
6.0.24-es verziójától jelent meg az extras csomagban a
org.apache.catalina.mbeans.JmxRemoteLifecycleListener osztály. Ehhez a
letöltésnél az
[extras](http://archive.apache.org/dist/tomcat/tomcat-6/v6.0.24/bin/extras/)
könyvtárból le kell töltenünk a catalina-jmx-remote.jar állományt, és
elhelyeznünk a \$CATALINA\_HOME/lib könyvtárunkban. Ha ez megvan, akkor
a következő konfigurációt kell beillesztenünk a server.xml állományba:

{% highlight xml %}
<Listener
  className="org.apache.catalina.mbeans.JmxRemoteLifecycleListener"
  rmiRegistryPortPlatform="3000"
  rmiServerPortPlatform="3001" />
{% endhighlight %}

Amennyiben ez megvan, az RMI registry a 3000-es, az RMI server a 3001-es
port-on fog elindulni, hasonlóan az előző példához. Innentől kezdve ha a
következő URL-t adjuk meg a JMX kliensünkben, és átengedjük a két
port-ot a tűzfalon, vagy SSH tunnel-lel kihozzuk, láthatjuk a Tomcat
MBean-jeit.

    service:jmx:rmi://localhost:3001/jndi/rmi://localhost:3000/jmxrmi

<a href="/artifacts/posts/2010-07-30-tomcat-jmx-tuzfal/tomcat_jmx_b.png" data-lightbox="post-images">![Java VisualVM](/artifacts/posts/2010-07-30-tomcat-jmx-tuzfal/tomcat_jmx.png)</a>
