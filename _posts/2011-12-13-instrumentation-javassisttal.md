---
layout: post
title: Instrumentation Javassisttal
date: '2011-12-13T00:45:00.005+01:00'
author: István Viczián
tags:
- instrumentation
- Java SE
- JMX
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Technológiák: Javassist 3.15

Belefutottam egy olyan
[problémába](http://stackoverflow.com/questions/7096121/profile-entire-java-program-execution-in-visualvm),
hogy egy alkalmazást szeretnék monitorozni VisualVM-mel (régebben már
írtam [róla](/2011/04/14/visualvm-glassfish-monitorozas.html)), azonban
az alkalmazás számomra szignifikáns része már lefut, mielőtt hozzá
tudnák csatlakozni a virtuális géphez. A VisualVM egy monitoring és
menedzsment eszköz, nagyon mélyen lehet a virtuális gép működését
megfigyelni, és a JDK része. A
`-Xrunjdwp:transport=dt_socket,address=8000,server=y,suspend=y`
parancssori kapcsoló használata nem segít, ugyanis ebben az esetben a
megállt alkalmazást csak olyan profiler képes továbblökni, mely beszéli
a Java Debug Wire Protocol (JDWP) protokollt, a VisualVM viszont nem
ilyen. (Míg a Eclipse TPTP vagy a Netbeans Profiler igen. Más kérdés
ugyan, hogy a VisualVM is tartalmaz profiler-t, ráadásul ugyanaz, ami a
NetBeans-ben is van, ez utóbbi csak annyival több, hogy a forráskódhoz
tud pozícionálni.)

A problémára több megoldási javaslatot is lehet kapni a neten, pl. más
profiler (előbb említetteken kívül még sok van, pl. a JDK részeként
szállított parancssori HPROF, vagy a kereskedelmi YourKit vagy
JProfiler), debug módban indítás IDE-ből, valamint az alkalmazásban
várakozás elhelyezése (sleep, Console input).

Gondoltam, ez egy megfelelő alkalom az instrumentation és a Javassist
kipróbálására. Így készítettem egy egyszerű példaprogramot, mely
elérhető a
[GitHub](https://github.com/vicziani/jtechlog-wait4signal)-on. A program
egy Java agent, melynek segítségével egy Java alkalmazás adott szálának
futása a megadott metódusnál felfüggeszthető, és vagy konzolon bevitt,
vagy JMX-en feladott jelre vár. Mindezt az alkalmazás forráskódjának
módosítása nélkül.

Maven-nel build-elhető, és a letöltést követően a 'mvn package
assembly:single' parancs kiadásával a target könyvtárban létrejön egy
jtechlog-wait4signal-1.0-SNAPSHOT-bin.zip és egy
jtechlog-wait4signal-1.0-SNAPSHOT-tar.gz állomány. Valamelyik lib
könyvtárában lévő két jar fájlt kell felhasználni.

A következő parancs kiadásával lehet az agent-et aktiválni:

    java -javaagent:jtechlog-wait4signal-1.0-SNAPSHOT.jar=entryPoint=java2d.Java2Demo.main -jar Java2Demo.jar

Ekkor a konzolon vár egy Enter lenyomásáig, vagy 5 másodperc múlva
mindenképp lefuttatja az alkalmazást.

A következő parancs kiadásával lehet JMX-en értesítést aktiválni:

    java -javaagent:jtechlog-wait4signal-1.0-SNAPSHOT.jar=entryPoint=java2d.Java2Demo.main,mode=JMX,timeout=30 -jar Java2Demo.jar

Ekkor a `jtechlog/SignalMBean signal()` operációjával lehet a futtatást
továbbengedni, vagy 30 másodperc múltán timeout.

Régebben [már írtam
arról](/2009/05/10/hibernate-eclipselink-atallas.html), hogy az
instrumentációt, azaz a bytecode módosítását futásidőben,
osztálybetöltéskor a
[java.lang.instrument](http://docs.oracle.com/javase/6/docs/api/java/lang/instrument/package-summary.html)
csomag felhasználásával lehet megvalósítani. Az agent fő osztálya a
`jtechlog.wait4signal.Wait4SignalMain` osztály, melynek `premain`
metódusa fut le a saját alkalmazásunk main metódusa előtt. Ahhoz, hogy a
-javaagent megadásakor ehhez az osztályhoz kerüljön a vezérlés, a
anifest.mf fájlban a Agent-Class bejegyzésnek rá kell hivatkoznia.

{% highlight java %}
public static void premain(String agentArgs, Instrumentation inst) {
 System.out.println("Initializing Wait4Signal Java agent.");
 Wait4SignalMain wait4SignalMain = new Wait4SignalMain();
 wait4SignalMain.doInstrumentation(agentArgs, inst);
}
{% endhighlight %}

A `doInstrumentation` metódus feldolgozza a parancssori paramétereket (a
JAR neve és egy egyenlőségjel után megadott String), ezek konvenció
szerint név és érték párok, köztük egyenlőségjel, vesszővel elválasztva.
Lehetséges paraméterek: entryPoint (kötelező megadni, osztály és metódus
neve, mely előtt meg kell állítani a program futását), mode (ha nincs
megadva CONSOLE mód, azaz konzolon vár Enter billenytű megnyomását, vagy
JMX), és timeout (másodpercben, alapértelmezett értéke 5). Majd a
következő utasítás megadásával egy új `ClassFileTransformer`
implementációt regisztrál:

{% highlight java %}
inst.addTransformer(new WaitTransformer(entryPoint, waiting));
{% endhighlight %}

Egy ötlet volt az is, hogy a `premain` metódusban állítom meg a program
futását, azonban ez nem volt megfelelő, hiszen a JVM ilyenkor olyannyira
nem inicializálta magát, hogy a VisualVM sem tudott hozzá kapcsolódni
életciklusának ezen pontján.

A `WaitTransformer` a `transform` metódust definiálja felül, és
vizsgálja, hogy az osztály neve megegyezik-e a parancssori kapcsolóként
megadottal.

{% highlight java %}
public byte[] transform(ClassLoader loader, String className,
 Class<?> classBeingRedefined, ProtectionDomain protectionDomain,
 byte[] classfileBuffer) throws IllegalClassFormatException
{% endhighlight %}

A transform metódus számunkra érdekes paraméterei az osztály
osztálybetöltője (null, ha bootstrap osztálybetöltő), az osztály neve
(vigyázat, pontok helyett perjelekkel), valamint az osztály
bytecode-jának byte tömbjét. Ezt szabadon módosíthatjuk, és ezt kell
visszaadni a metódus visszatérési értékeként. Vigyázat, az ebből a
metódusból kilépő kivételeket a JVM elnyeli.

Persze nem kell a byte tömböt közvetlenül módosítani, itt jöhet
segítségünkre a [Javassist](http://www.javassist.org/) (Java Programming
Assistant), mely egy Java bytecode futásidejű manipulálását megkönnyítő
programkönyvtár. Két szintű API-t ad a kezünkbe. A forráskód szintű API
segítségével Java utasításokat, mint String-eket szúrhatunk be, ezeket a
Javassist on-the-fly fogja átfordítani bytecode-dá. Ekkor persze nem
szükséges ismernünk a class fájl szerkezetét. Vagy manipulálhatjuk
alacsonyabb szinten is, közvetlen a bytecode-ot. Ezen lehetőségek
rendkívül alkalmassá teszik a Javassist-ot AOP keretrendszerek
fejlesztésére. Remek
[tutorial](http://www.csg.is.titech.ac.jp/%7Echiba/javassist/tutorial/tutorial.html)
is van hozzá.

A következő részben a Javassist érdekesebb kódrészleteit emelem ki,
melyek a bytecode-ot módosítják.

{% highlight java %}
ClassPool pool = ClassPool.getDefault();
CtClass cl = pool.makeClass(new java.io.ByteArrayInputStream(classfileBuffer));

if (cl.isInterface() == false) {
 CtBehavior[] methods = cl.getDeclaredBehaviors();

 for (int i = 0; i < methods.length; i++) {
  if (entryPoint.endsWith(methods[i].getName())) {
   ctBehavior.insertBefore(waiting.insertBeforeMethod());
  }
 }
 classfileBuffer = cl.toBytecode();
}
cl.detach();
{% endhighlight %}

A fenti kódrészlet először lekér egy ClassPool-t, ez a Javassist-ban
lévő osztályok tárolására szolgáló konténer. Ebbe definiál egy CtClass
(compile-time class) példányt, mely az osztály absztrakt
reprezentációja. Ennek forrása az instrumentálás során átadott byte
tömb. Amennyiben ez egy interfész, lekéri ennek metódusait a
`getDeclaredBehaviors()` metódushívással. Ezeken végigiterál, és ha a
metódus neve megfelelő, akkor beszúr kódrészletet az `insertBefore`
metódushívással. Ennek érdekessége, hogy egy String-et vár, tehát
bármilyen Java forráskódot be lehet illeszteni, mintha csak a .java
forrásfájlba tettük volna ezt.

A `waiting.insertBeforeMethod()` a mode parancssori kapcsoló
függvényében más és más String-et ad vissza. Pl. CONSOLE mode esetén
példányosít egy `ConsoleWaiting` objektumot, majd beállítja a timeout
property-jét, majd meghívja a `wait4signal()` metódusát.

{% highlight java %}
public String insertBeforeMethod() {
 StringBuilder sb = new StringBuilder();
 sb.append("jtechlog.wait4signal.Waiting waiting = new jtechlog.wait4signal.ConsoleWaiting();");
 sb.append(String.format("waiting.setTimeout(%s);", timeout));
 sb.append("waiting.wait4signal();");
 return sb.toString();
}
{% endhighlight %}

Érdekessége, hogy a wait4signal() metódus a `ConsoleInput` és
`ConsoleInputReadTask` osztályokat használja a konzolról való
beolvasásra, és a Java 5-ben megjelent ExecutorService-t használja a
külön szálon való bekérésre. Erre azért van szükség, hogy itt is
működjön a timeout ([The Java Specialists'
Newsletter](http://www.javaspecialists.eu/archive/Issue153.html) cikke
alapján).

A `JmxWaiting` osztály ezzel szemben egy BlockingQueue-t használ, és
abba vár egy üzenetet. A `BlockingQueue.poll(int, TimeUnit)` metódusával
vár egy üzenetre, timeout esetén null a visszatérési értéke. A
BlockingQueue a `SignalMBean` MBean-nek is átadásra kerül. Amennyiben a
felhasználó meghívja a `signal()` operációját, egy üzenetet tesz a
Queue-ba. A `JmxWaiting` ekkor beszünteti a várakozást, és fut tovább. A
JMX-ről egy [korábbi
posztban](/2009/09/19/java-monitorozas-es-menedzsment.html) tettem
említést.

Az agent-nek szüksége van tehát a Javassist JAR fájlra is, ehhez a
manifest.mf fájlba fel kell venni a Boot-Class-Path bejegyzésbe a JAR
fájl nevét. Abszolút (perjel) nélkül adtam meg, így a
jtechlog-wait4signal-1.0-SNAPSHOT.jar állománnyal egy könyvtárban fogja
keresni (függetlenül a JVM indítási könyvtárától).

Látható, hogy a JVM induláskor, az osztálybetöltés során a Java class
fájlok manipulálása korántsem akkora varázslat, mint első látásra
hinnénk. Több nyílt forráskódú alternatíva is létezik bytecode
manipulálásra, többek között a [cglib](http://cglib.sourceforge.net/),
[Apache Commons BCEL](http://commons.apache.org/bcel/index.html),
[ASM](http://asm.ow2.org/).
