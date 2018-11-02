---
layout: post
title: Mérgezett üzenetek
date: '2010-04-21T01:49:00.004+02:00'
author: István Viczián
tags:
- MQ
- JMS
- Spring
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Amennyiben aszinkron üzenetkezelést használunk, Java-ban tipikusan JMS
API használatával, szembesülhetünk a poisoned message fogalmával.
Amennyiben az egyik soron vagy témán kapunk egy üzenetet, és nem tudjuk
feldolgozni, pl. valamilyen belső hiba történt (hibás az alkalmazás),
dönthetünk, hogy mit kezdünk az üzenettel. Ezek a következők lehetnek:

-   Visszagörgetjük a tranzakciót
-   Eldobjuk az üzenetet
-   Magunk tároljuk a hibás üzenetet (pl. naplózzuk, adatbázisba
    mentjük, vagy áttesszük egy másik sorba), majd eldobjuk az üzenetet

Legegyszerűbb megoldás, hogy tranzakciót visszagörgetjük (rollback),
ekkor az üzenet visszakerül a sorba (pontosabban ki sem kerül onnan,
csak a kliens megjelöli, hogy éppen feldolgozás alatt van, így más
kliensek nem férhetnek hozzá). Ez után a JMS provider újra kioszthatja
az üzenetet. Feltehetőleg az eddigi hiba magától nem javul meg, hiszen
sem az alkalmazás, sem az üzenet nem változott, így újra hiba
keletkezik, és újra visszakerül a sorba. Így hamar végtelenciklus
alakulhat ki. Persze lehet az is, hogy közben az alkalmazás állapota
változik, és ezért már be tudja fogadni az üzenetet, de ennek kicsi a
valószínűsége, és amúgy is tervezési hibára utalhat.

Alkalmazásból is le tudjuk kérdezni, hogy az üzenet rollback-kel került
már-e vissza a sorba, ekkor a javax.jms.Message getJMSRedelivered()
metódusát kell meghívni. Sőt annak számát is le tudjuk kérdezni, hogy az
üzenet hányszor került vissza a sorba, erre a
getIntProperty("JMSXDeliveryCount") metódushívás való. Így akár
alkalmazásból is kezelhetjük, ha ez elér egy határértéket, kezeljük
másképp az üzenetet.

Azonban bizonyos JMS provider-ek képesek arra, hogy ezt automatikusan
kezeljék. Az IBM WebSphere MQ pl. a "Backout" terminológiát használja a
visszakerült üzenetre. Egy sornál meg lehet adni egy Backout threshold
tulajdonságot, mely alapesetben 0, mely azt jelenti, hogy nem kezd
semmit az ilyen üzenettel. Ha ezt egy nullánál nagyobb pozitív egész
számra állítjuk (a sor BOTHRESH tulajdonságának állításával), akkor
amennyiben az üzenet visszakerülését számláló tulajdonsát eléri ezt a
küszöbértéket, az MQ az üzenetet eldobja. Azonban érdemes beállítani egy
sort, ahova az üzenetet az MQ áttegye. Ezt a sor BOQNAME tulajdonságában
lehet megadni, ahol a cél sor nevét kell megadni. Ez lehet pl. a dead
letter queue (alapértelmezetten a SYSTEM.DEAD.LETTER.QUEUE nevet
viseli), de én javaslok ezeknek az üzeneteknek egy külön sort
létrehozni.

Így amennyiben a Backout threshold-ot 3-ra állítjuk, és a kapott üzenet
hibás, rollback történik, az üzenet visszakerül a sorba. A JMS provider
még kétszer megpróbálja kézbesíteni. Mivel az alkalmazásunk hibás, nincs
felkészülve a kapott üzenetre, mindkétszer rollback történik. Ezt
érdemes alkalmazásszinten is naplózni. Ekkor az MQ átteszi egy másik
sorba az üzenetet. Amikor látjuk, a napló állományba, hogy hiba történt,
vagy hogy a sorba üzenet került, kivizsgáljuk a hibát, és javítjuk az
alkalmazást. Telepítés után a backout queue-ból az üzeneteket áttehetjük
az eredeti sorba (pl. MQ esetén a [IH03: WebSphere Message Broker
V7-Message display, test & performance
utilities](http://www-01.ibm.com/support/docview.wss?rs=977&context=SSKMAB&context=SS7J6S&context=SSKM8N&context=SSFKSJ&context=SSFKUX&context=SSWHKB&context=SSVLA5&dc=D410&q1=ih03&uid=swg24000637&loc=hu_HU&cs=utf-8&lang=en+hu)
alkalmazással, mely SupportPac-ként ingyenesen letölthető).

Azonban a 7.0.1.1-es IBM WebSphere MQ-ban is van egy IBM által is ismert
[hiba](http://www-01.ibm.com/support/docview.wss?uid=swg1IZ64620), mely
szerint az MQ ugyan átteszi az üzenetet a backout queue-ba, de ott nem
commit-olja. Ekkor azt vesszük észre, hogy a sor mélysége (queue depth)
ugyan nő, de az üzenetet se browse-olni, sem kivenni nem tudjuk. Hotfix
lehet, hogy az alkalmazás végzi el a megfelelő műveletet, és teszi át a
hibát okozó üzenetet egy másik sorba, de akár egy külön agent is
végezheti ezt. Azonban a 7.0.1.2-es verzióban már benne lesz a javítás.
Mi felvettük a kapcsolatot az IBM Magyarországi Kft., és nagyon
készségesek voltak, és jelezték, hogy az adott patch már létezik, és el
is küldték nekünk egy napon belül. Ez tulajdonképpen a
com.ibm.mq.jmqi.jar és com.ibm.mqjms.jar állományt érintette, ezek
bemásolásával azonnal működött a funkció.

Persze más JMS provider-ek is tudják ezt, pl. a Glassfish-ben is lévő
[Open Message Queue](https://mq.dev.java.net/) (Sun Java System Message
Queue) endpointExceptionRedeliveryAttempts tulajdonságát kell keresni,
mely alapesetben 6, tehát nem kell végtelenciklusra számítani (ez
oktatásnál sokszor jól jött), valamint a sendUndeliverableMsgsToDMQ
tulajdonsága állítja be, hogy ezen üzenetek a dead message queue-ba
kerüljenek-e. A JBoss új üdvöskéje, a
[HornetQ](http://jboss.org/hornetq) ezt Message Redelivery and
Undelivered Messages néven ismeri, és a max-delivery-attempts,
dead-letter-address tulajdonságokat kell használni. Nagyon jó ötlet, és
nem értem, hogy a többi implementációnál miért nem szerepel, hogy meg
lehet adni, hogy a sorba mennyi idő múlva kerüljön vissza
(redelivery-delay). Ezzel csökkenteni lehet a CPU és hálózat terhelést,
hiszen pl. egy nagy terhelésű rendszeren, ahol folyamatosan jönnek az
üzenetek, és alkalmazásba hiba történik, csak a rengeteg üzenet újra és
újra feldolgozása rengeteg erőforrást foglalhat le.

Egy [előző posztban](/2003/01/05/ibm-websphere-mq.html) már említettem,
hogy hogyan kell a JMS QueueConnectionFactory-t és Destination-t (Queue)
felvenni Tomcat-ben a JNDI, de most nézzük meg, hogy mi kell ahhoz, hogy
ezt Spring-ből használni tudjuk.

A Spring definiálja a Message-Driven POJO fogalmát a Java EE
Message-Driven Bean-hez (MDB) hasonlóan. Ez egy egyszerű bean, melynek
implementálnia kell a javax.jms.MessageListener interfészt, és ennek
onMessage(Message) metódusát fogja a Spring több szálon hívni. Ehhez az
applicationContext.xml-ben a következőket kell felvenni.

{% highlight xml %}
<!-- Bean az onMessage(Message) metódussal, mely megvalósítja a MessageListener interfészt -->
<bean id="messageListener" class="jtechlog.FooListener" />

<!-- Message Listener Container -->
<bean id="jmsContainer" class="org.springframework.jms.listener.DefaultMessageListenerContainer">
  <property name="connectionFactory">
 <jee:jndi-lookup jndi-name="java:/comp/env/jms/myQueueConnectionFactory"/>
</property>
  <property name="destination">
 <jee:jndi-lookup jndi-name="java:/comp/env/jms/myQueue"/>
</property>
  <property name="messageListener" ref="messageListener" />
</bean>
{% endhighlight %}

Természetesen ahhoz, hogy a poisoned message legyen, be kell állítanunk
a tranzakciókezelést. Ehhez a DefaultMessageListenerContainer bean
sessionTransacted attribútumát kell true-ra állítanunk, és ekkor lokális
tranzakciókezelés lesz megvalósítva, azaz a Spring külön tranzakciókat
kezel a JMS műveleteken.

{% highlight xml %}
<bean id="jmsContainer" class="org.springframework.jms.listener.DefaultMessageListenerContainer">
  ...
<property name="sessionTransacted" value="true"/>
...
</bean>
{% endhighlight %}

Amennyiben azonban elosztott tranzakciókezelést akarunk használni, pl.
egy tranzakcióba venni egy adatbázis és egy JMS provider műveletet, a
DefaultMessageListenerContainer transactionManager attribútumát kell
állítanunk.

{% highlight xml %}
<bean id="transactionManager" class="org.springframework.transaction.jta.JtaTransactionManager"/>

<bean id="jmsContainer" class="org.springframework.jms.listener.DefaultMessageListenerContainer">
  ...
  <property name="transactionManager" ref="transactionManager"/>
...
</bean>
{% endhighlight %}

[How WebSphere Application Server handles poison
messages](http://www.ibm.com/developerworks/websphere/library/techarticles/0405_titheridge/0405_titheridge.html)\
[Spring Framework Reference - 21. JMS (Java Message
Service)](http://static.springsource.org/spring/docs/3.0.x/spring-framework-reference/html/jms.html)
