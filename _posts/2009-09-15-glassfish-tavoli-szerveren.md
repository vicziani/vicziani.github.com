---
layout: post
title: Glassfish távoli szerveren
date: '2009-09-15T01:34:00.005+02:00'
author: István Viczián
tags:
- Oktatás
- Java EE
- NetBeans
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Szintén egy oktatás alkalmával szerettem volna demonstrálni a Java
platformfüggetlenségét, és a Java EE lokális transzparenciáját. Írtam
egy egyszerű Java EE alkalmazást, megy egy Stateless Session Bean-ből
állt, valamint egy Message Driven Bean-ből. Valamint írtam hozzá egy
kliens osztályt, mely egyrészt távolról meghívja a Session Bean
metódusát, valamint egy üzenetet elhelyez abban a JMS sorban, melyen az
MDB hallgat.

A cél az volt, hogy az elkészült EAR-t egy Solaris szerveren futó
alkalmazásszerverre telepítsem, és a kliens alkalmazás azt távolról
hívja meg.

Erről a postot egyrészt azért írom meg, hogy az itt szerzett
tapasztalatok másnak is jól jöhetnek, másrészt feltehetőleg még meg kell
ismételnem későbbi oktatásokon, ezért magamnak is jól fog még jönni.
Fontos, hogy nem vagyok Solaris adminisztrátor, így nem biztos, hogy
mindent úgy állítok be, ahogy egy szerveren kéne, viszont egy fejlesztői
környezet működésre bírásához elegendő.

Használt verziók:

-   Solaris 10 5/08 s10x\_u5wos\_10 x86
-   Java SE Development Kit 6u13, pontosabban 1.6.0\_13-b03
-   NetBeans 6.5.1
-   Glassfish v2.1, melyet a Netbeans Java bundle is tartalmaz, pontos
    száma v2.1 b60e Promoted Build

Első feladatként egy működő Solaris-t kellett szerezni. Kaptam egy előre
telepített VirtualBox VDI (Virtual Disk Image ) állományt, így azt már
csak hálózatba kellett kapcsolni. NAT-tal semmiképp nem tudtam
elindítani, így maradt a bridge-elt kártya, PCnet-Fast III virtuális
hálózati kártyával. Amíg nem sikerültek a beállítások, a Solaris már
boot-oláskor a következő hibaüzenetet adta:

    Failed to plumb IPv4 interface(s): pcn0
    Failed to configure IPv4 DHCP interface(s): pcn0
    Sep 13 08:33:29 svc.startd[7]: svc:/network/physical:default: Method "/lib/svc/method/net-physical" failed with exit status 96.
    Sep 13 08:33:29 svc.startd[7]: network/physical:default misconfigured: transitioned to maintenance (see 'svcs -xv' for details)

Amennyiben a hálózati kártya helyesen lett beállítva, megjelent a pcn0
interfész, de nem kapott a DHCP-től új ip-címet. Új cím kéréséhez a
következő parancsokat kellett kiadni:

    ifconfig pcn0 dhcp release
    ifconfig pcn0 dhcp start

Ekkor a ifconfig –a parancs valami hasonlót adott, amin már látszik a jó
ip-cím:

    lo0: flags=2001000849 mtu 8232 index 1
    inet 127.0.0.1 netmask ff000000
    pcn0: flags=1004843 mtu 1500 index 2
    inet 192.168.68.107 netmask ffffff00 broadcast 192.168.68.255
    ether 8:0:27:7b:8e:7c

Amíg a hálózat nem jól volt beállítva, csak az első sor jelent meg, vagy
a második is, rossz ip-címmel.

Ezután a /etc/hosts fájlban is megjelent a következő sor:

    192.168.68.107  unknown # Added by DHCP

Az unknown lett a host neve, amit meg kell jegyezni, mert később szükség
lesz rá (ezt persze már boot közben is kiírja). Amint van hálózat,
javasolt nem a VirtualBox-ban bejött konzolon tevékenykedni, hanem pl.
putty-tyal SSH-n keresztül bejelentkezve.

A következő feladat a JDK feltelepítése volt a /opt könyvtárba. Ehhez a
jdk-6u13-solaris-i586.sh állományt töltöttem le, mely egy önkicsomagoló
állomány. Letöltés után állítsuk futtathatóra (chmod +x), és indítsuk
el. Én elkövettem azt a klasszikus hibát, hogy szöveges módban scp-ztem
fel a Windows-os gépről a Solaris-ra (az sh kiterjesztés miatt az
alapértelmezett mód), és így állandóan hibát jelzett (megsérült az
állomány - corrupted), és az állomány mérete sem egyezett. Ezen
túllendülve létrejött a jdk1.6.0\_13 könyvtár. Ezután a
.bash\_profile-ba beállítottam a megfelelő környezeti változókat:

    export JAVA_HOME=/opt/jdk1.6.0_13
    export PATH=$JAVA_HOME/bin:/usr/local/bin:$PATH

Ezután következett a Glassfish telepítése. Ehhez a
glassfish-installer-v2.1-b60e-sunos\_x86.jar állományt töltöttem le.
Először próbálkoztam a V2 UR2 verzióval is, de nagyon rejtélyes
kivételeket kaptam, mire rájöttem, hogy a V2 UR2, és a NetBeans-emmel
telepített 2.1 nem kompatibilis egymással, így a távoli metódushívás nem
jött össze. Telepíteni a java -Xmx256m -jar
glassfish-installer-v2.1-b60e-sunos\_x86.jar parancs kiadásával kell, a
256 mega memória megadása nélkül nem sikerült. Ezt is a /opt könyvtárban
indítottam. Mégegy érdekesség, hogy csak parancssort használva képtelen
volt elindulni, a következő hibaüzenetet dobta:

    X connection to localhost:10.0 broken (explicit kill or server shutdown).

Igen, egy X-et kellett hozzá indítani, csak azért, hogy kitegye a
Licence Agreement képernyőt.

![Licence Agreement](/artifacts/posts/2009-09-15-glassfish-tavoli-szerveren/licence_agreement_b.png)

Ezután
konfigurálni kellett Ant alapú eszközzel a Glassfish-t a következő
parancsok kiadásával:

    cd glassfish
    chmod -R +x lib/ant/bin
    lib/ant/bin/ant -f setup.xml

Eztán már csak el kellett indítani a /opt/glassfish könyvtárban:

    bin/asadmin start-domain domain1

Leállítása:

    bin/asadmin stop-domain domain1

A napló állomány a /opt/glassfish/domains/domain1/logs/server.log. A
webes adminisztrációs felületet a http://unknown:4848 címen lehet
elérni, ahol a default felhasználónév "admin", és a default jelszó
"adminadmin".

Az alkalmazás egy NetBeans-ben létrehozott Enterprise Application, ami a
következőkből állt. Távoli interfész:

{% highlight java %}
@Remote
public interface HelloEJB {
public String sayHello(String name);
}
{% endhighlight %}

Stateless session bean:

{% highlight java %}
@Stateless
public class HelloEJBBean implements HelloEJB {
public String sayHello(String name) {
    System.out.println("Invoking sayHello");
    return "Hello " + name;
}
}
{% endhighlight %}

És a Message driven bean:

{% highlight java %}
@MessageDriven(mappedName = "jms/MyQueue", activationConfig = {
@ActivationConfigProperty(propertyName = "acknowledgeMode", propertyValue = "Auto-acknowledge"),
@ActivationConfigProperty(propertyName = "destinationType", propertyValue = "javax.jms.Queue")
})
public class HelloMDB {

public void onMessage(Message message) {
    try {
        System.out.println(((TextMessage) message).getText());
    } catch (JMSException jmse) {
        jmse.printStackTrace();
    }
}
}
{% endhighlight %}

Ez utóbbihoz létre kellett hozni az adminisztrációs felületen
(Resources/JMS Resources/Connection Factories és Destination resources)
egy jms/MyConnectionFactory és egy jms/MyQueue JNDI néven található JMS
objektumokat.

Az alkalmazást a NetBeans EAR-ba csomagolta, amit a következő módok
egyikén lehet telepíteni:

-   EAR bemásolása a /opt/glassfish/domains/domain1/autodeploy
    könyvtárba
-   Webes adminisztrációs felületen: Applications/Enterprise
    Applications képernyőn a deploy gombbal
-   Meglepően jól működik a NetBeans távoli deploy szolgáltatása is.
    Ekkor fel kell venni egy új szervert (Tools/Servers képernyő Add
    server gomb), ki kell választani a lokális telepítési könyvtárat,
    majd a Register Remote Domain rádiógombot, majd meg kell adni a
    távoli szerver ip címét és az admin portját (4848). Az alkalmazásnál
    a Properties ablakban válasszuk ki ezt az alkalmazásszervert, és a
    projekten a jobb gomb/deploy-ra nyomva települ az alkalmazás a
    távoli alkalmazásszerverre. Az alkalmazásszerver a Services fülön is
    megjelenik, ahol alapvető információkat kapunk róla, és alap
    műveleteket el tudunk végezni.

Ha telepítettük az alkalmazást, érdemes megnézni, hogy sikerült-e, pl. a
globális JNDI nevek megjelentek-e a JNDI fában. Ezt a webes felületen az
Application Server képernyőn a JNDI browsing gombra kattintva lehet
előhívni. Itt a session bean nevének meg kell jelennie:
jtechlog.HelloEJB.

A kliens elkészítéséhez két megoldás közül választhattam volna. Vagy egy
Application Client Container-ben (ACC) futó alkalmazást készíthettem
volna, vagy egy különálló alkalmazást. Az előbbinél a deployment
descriptor-okban kell leírni, hogy hol vannak a távoli erőforrások, és
egy pehelysúlyú alkalmazásszerverben fut. Az utóbbi esetén csak a JNDI
context-et kell definiálni, lookup műveletekkel lekérni a távoli
referenciákat, és egy egyszerű JVM-ben fut. Emiatt az utóbbira esett a
választásom. Tehát a NetBeans-ben elegendő volt egy Java Application
projektet létrehozni. Ehhez persze a távoli interfészt is a projektbe
kellett másolni. A kliens alkalmazás így nézett ki:

{% highlight java %}
public class Main {
public static void main(String[] args) throws Exception {
Context ic = new InitialContext();
HelloEJB helloEJBBean = (HelloEJB) ic.lookup("jtechlog.HelloEJB");
System.out.println(helloEJBBean.sayHello("jtechlog"));
}
}
{% endhighlight %}

Ehhez persze el kellett helyezni a következő JAR állományokat is a
CLASSPATH-ban: \$GLASSFISH\_HOME/lib/appserv-rt.jar,
\$GLASSFISH\_HOME/lib/javaee.jar (, ahol értelemszerűen a
\$GLASSFISH\_HOME a lokális GlassFish telepítési könyvtára). Ekkor a
appserv-rt.jar-ban lévő jndi.properties miatta localhost-hoz
csatlakozna, így a következő jndi.properties állományt kellett
elhelyezni a CLASSPATH-ban:

    java.naming.factory.initial=com.sun.enterprise.naming.SerialInitContextFactory
    java.naming.factory.url.pkgs=com.sun.enterprise.naming
    java.naming.factory.state=com.sun.corba.ee.impl.presentation.rmi.JNDIStateFactoryImpl
    org.omg.CORBA.ORBInitialHost=192.168.68.107

Ahol az utolsó sor mutatja a szerver ip címét. Ezután már a Solaris-on
futó alkalmazásszerverbe telepített EJB meghívása egy Windows-os
kliensről tökéletesen müködött.

A következő feladat a JMS beállítása volt. Ehhez a következővel
egészítettem ki a kliens alkalmazást:

{% highlight java %}
ConnectionFactory connectionFactory = (ConnectionFactory) ic.lookup("jms/MyConnectionFactory");
Queue queue = (Queue) ic.lookup("jms/MyQueue");
Connection connection = connectionFactory.createConnection();
Session session = connection.createSession(false, Session.AUTO_ACKNOWLEDGE);
MessageProducer messageProducer = session.createProducer(queue);
TextMessage message = session.createTextMessage();
message.setText("Message");
messageProducer.send(message);
messageProducer.close();
session.close();
connection.close();
{% endhighlight %}

Az import-ok és a kivételkezelés az olvasó feladata. Ezt elindítva a
következő osztályt hiányolta: java.lang.NoClassDefFoundError:
org/netbeans/modules/schema2beans/BaseBean. Melyet kicsit furcsálok,
hogy mit keres benne netbeans-es osztály. A megoldáshoz a következő JAR
állományokat kellett még a CLASSPATH-ba tennem:
\$GLASSFISH\_HOME/lib/appserv-admin.jar,
\$GLASSFISH\_HOME/lib/appserv-ws.jar,
\$GLASSFISH\_HOME/lib/install/applications/jmsra/imqjmsra.jar. Ez után a
futtatás a következő hibával szállt el:

    May 19, 2009 1:36:24 PM com.sun.messaging.jms.ra.ResourceAdapter start
    INFO: MQJMSRA_RA1101: SJSMQ JMS Resource Adapter starting...
    May 19, 2009 1:36:26 PM com.sun.messaging.jmq.jmsclient.ExceptionHandler throwConnectionException
    WARNING: [C4003]: Error occurred on connection creation [unknown:7676]. - cause: java.net.UnknownHostException: unknown

Ez ugye azt jelenti, hogy a visszaadott JNDI referencia tartalmazza a
JMS server host nevét, ami jelen esetben az unknown. Ezt a
/opt/glassfish/domains/domain1/config/sun-acc.xml tartalmazza, valami
ilyen formában:

    <target-server name="unknown" address="unknown" port="3700"/>

Ebben a sorban az address értékét kicseréltem a megfelelő ip címre, de
ez nem segített, így egyszerűen a Windows host fájljába felvettem a
unknown nevet a Solaris virtuális gép ip-címére.

Ennek megoldására ezen a
[fórumon](http://forums.sun.com/thread.jspa?threadID=5283256&tstart=0)
kaptam tippet.

Így az alkalmazás lefutott, de a kapcsolat bezárása után sem lépett ki,
folyamatosan futott. A futó szálakat elemzve kiderült, hogy
imqConnectionFlowControl és iMQReadChannel nevű szálak sokasága fut,
melyek miatt nem tud leállni a kliens alkalmazás.

Erről több írás is van a weben, [ez a legérdekesebb
fórum](http://forums.java.net/jive/thread.jspa?threadID=37143), valamint
itt van felvéve [egy Glassfish
bug](https://glassfish.dev.java.net/issues/show_bug.cgi?id=1429) és
[mégegy Glassfish
bug](https://glassfish.dev.java.net/issues/show_bug.cgi?id=636). Sajnos
javítás rájuk még nem érkezett. Addig is a javasolt megoldás a
System.exit metódus hívása.

Összegzésként megállapítható, hogy még mindig nem hiszek az
alkalmazásszerverekben, szerintem egy ilyen egyszerű demonstrációnak
sokkal gördülékenyebben kellett volna mennie, hiszen nagyon egyszerű
alkalmazást próbáltam, és az alkalmazásszerver nagyon alap
funkcionalitását szerettem volna kipróbálni. Sajnos az utolsó problémára
megoldást sem találtam.

Hivatkozások:

[JavaTM SE 6 Release Notes Solaris Operating System Installation
(32-bit)](http://java.sun.com/javase/6/webnotes/install/jdk/install-solaris.html)

[GlassFish Project - v2.1
FinalBuild](https://glassfish.dev.java.net/downloads/v2.1-b60e.html)

[Sun Java System Application Server Platform Edition 9 Developer's
Guide, Chapter 11 Developing Java
Clients](http://docs.sun.com/app/docs/doc/819-3659/beakt?a=view)

[EJB FAQ](https://glassfish.dev.java.net/javaee5/ejb/EJB_FAQ.html)
