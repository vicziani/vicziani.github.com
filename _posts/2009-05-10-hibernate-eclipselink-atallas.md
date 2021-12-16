---
layout: post
title: Hibernate EclipseLink átállás
date: '2009-05-10T17:58:00.009+02:00'
author: István Viczián
tags:
- Java SE
- JPA
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Egy JPA-t használó Spring-es alkalmazásban tesztképpen ideiglenesen
átálltam a JPA implementációval Hibernate-ről EclipseLink-re. Ennek
lépéseit írnám le, hátha még jól fog jönni (akár magamnak, akár másnak).
Akit ez nem annyira érdekel, annak is érdemes végigolvasnia, mert e
kapcsán leírom, hogy mi is az a weaving, Java agent, instrumentation,
stb.

Első lépés a JAR állományok cseréje volt. Míg a Hibernate esetén egy
rakás JAR-t kellett a CLASSPATH-ba tenni (hibernate3.jar,
hibernate-annotations.jar, hibernate-commons-annotations.jar,
hibernate-entitymanager.jar és az összes függőségeik), addig nagyon
szimpatikus az EclipseLink-ben, hogy csak a eclipselink.jar-r kellett
bemásolni.

Következő lépésként a Spring konfigurációs állományában kellett
módosításokat végezni. Az eredeti applicationContext.xml részlet:

{% highlight xml %}
<bean id="entityManagerFactory"
   class="org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean">
 <property name="dataSource" ref="dataSource"/>

 <property name="jpaVendorAdapter">
     <bean
         class="org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter">
         <property name="showSql" value="false" />
         <property name="generateDdl" value="true" />
      <property name="databasePlatform" value="org.hibernate.dialect.MySQL5Dialect" />
     </bean>
 </property>
</bean>
{% endhighlight %}

A módosított applicationContext.xml részlet:

{% highlight xml %}
<bean id="entityManagerFactory"
   class="org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean">
 <property name="dataSource" ref="dataSource"/>

 <property name="jpaVendorAdapter">
     <bean
         class="org.springframework.orm.jpa.vendor.EclipseLinkJpaVendorAdapter">
         <property name="showSql" value="false" />
         <property name="generateDdl" value="true" />
      <property name="databasePlatform" value="org.eclipse.persistence.platform.database.MySQLPlatform" />
     </bean>
 </property>

 <property name="loadTimeWeaver">
<bean class="org.springframework.instrument.classloading.InstrumentationLoadTimeWeaver" />
</property>
</bean>
{% endhighlight %}

Ez még mindig nem volt elég, a JVM-nek paraméterként meg kellett adni a
következő kapcsolót: -javaagent:lib/spring-agent.jar.

Az alkalmazás így tökéletesen futott, az egyetlen különbség az volt,
hogy másképp kezelték az automatikus azonosító generálást. Az
entitásomat a @GeneratedValue(strategy=GenerationType.AUTO) annotációval
láttam el, ami azt jelenti, hogy az adatbázis platform alapján döntsön
generálási mechanizmust. Az EclipseLink az azonosítónak egy sequence
nevezetű táblát generált, melyből vette az azonosítót (alapesetben
50-esével cache-elve), míg a Hibernate az id mezőt a MySQL auto
increment tulajdonsággal látta el.

De miért is kellett a -javaagent kapcsoló? A JPA implementációk a POJO
példányokat különböző mechanizmusok szerint tárolhatják. Kézenfekvő
megoldás lenne a reflection használata, de ennek lassúsága miatt ezt a
gyakorlatban nem használják. A másik megoldás, hogy futás közben ún.
proxy osztályokat generálnak, melyek elvégzik az adatbázis műveleteket,
majd továbbítják a hívást a POJO felé. Ehhez futás közben kell bájtkódot
generálni (runtime bytecode generation), ehhez a Hibernate a CGLIB
könyvtárat használja. Az EclipseLink ezzel szemben a weaving-et
használja, azaz a lefordított bájtkódot (POJO bájtkódját) módosítja. Ez
szükséges a lazy loading, change tracking, fetch groups és a belső
optimalizálások megvalósítására. Ez történhet fordításkor (static
weaving), és történhet futás közben is (dynamic weaving). Ez utóbbit
Java agent-tel lehet megvalósítani.

A Java agent a Java 5-ben jelent meg, és bővebb leírása a
[java.lang.instrument
csomag](http://java.sun.com/javase/6/docs/api/java/lang/instrument/package-summary.html)
dokumentációjában található. Az agent egy JAR állomány, ami a
manifest-ben tartalmaz egy Premain-Class bejegyzést, mely egy osztályra
mutat. Ennek az osztálynak tartalmaznia kell egy public static void
premain(String agentArgs, Instrumentation inst) metódust, vagy ennek
második paraméter nélküli verzióját. A -javaagent JVM kapcsolóval a jar
állományt kell megadni (akár több -javaagent kapcsolót is megadhatunk),
és a VM inicializálásakor, az alkalmazás main metódusának hívása előtt
le fognak futni a premain metódusok is. A VM elindulása után is biztosít
a Java lehetőséget az agent-ek indítására, ekkor az agentmain metódust
kell implementálni. Ilyenkor a manifest.mf fájlban a Agent-Class
bejegyzést kell megadni. A agentmain metódus nem kerül meghívásra a
-javaagent JVM parancssori kapcsoló használatakor. A premain metódus
viszont csak a parancssori kapcsoló használatakor kerül meghívásra.

Mindkettő metódus opcionálisan megkaphat egy Instrumentation példányt.
Ennek feladata az instrumentálás, azaz a bájtkód módosítása
ClassFileTransformer-ek használatával. Ez sok egyéb paraméter mellett a
bájtkódot kapja bájttömbként, és ezt is adja vissza.

Természetesen nem csak a JPA esetén szokták használni, hanem
monitorozásra, profile-olásra, lefedettség mérésre (code coverage),
naplózásra, vagy az aspektus orientált programozás megvalósítására (lsd.
AspectJ). Ezek általában az alkalmazás működését nem módosítják.

Szóval ezért nem kell a -javaagent kapcsoló a Hibernate-hez, ami a
CGLIB-bel generál futásidőben proxy osztályokat, és ezért kell az
EclipseLink-nek, ami a JPA entitás POJO-kat instrumentálja.

[Nalózás megvalósítása agent-tel és javassist bájtkód manipuláló
könyvtárral](http://today.java.net/pub/a/today/2008/04/24/add-logging-at-class-load-time-with-instrumentation.html)

[Weaving használata az
EclipseLink-ben](http://wiki.eclipse.org/Introduction_to_EclipseLink_Application_Development_%28ELUG%29#Using_Weaving)
