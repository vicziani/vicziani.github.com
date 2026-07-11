---
layout: post
title: IBM WebSphere MQ bekötése Nagios-ba
date: '2010-10-01'
author: Viczián István
tags:
- Java
- DevOps
- Egyéb nyelvek

---

Ahhoz, hogy bekössük az MQ-t a Nagiosba, egy plugint kell
választatnunk a [Nagios Exchange](http://exchange.nagios.org/)-ről, vagy
egy sajátot implementálnunk.

Sokat szenvedtünk a PERL-esekkel, de addig sikerült eljutni, hogy
ki-timeoutolt a plugin, és a hibaüzenet: Unexpected error.

Végül a Java-s [check_mq IBM WebSphere MQSeries Queues
Monitor](http://exchange.nagios.org/directory/Plugins/Uncategorized/Operating-Systems/Linux/check_mq-IBM-WebSphere-MQSeries-Queues-Monitor/details)
mellett döntöttünk. Ez egy egyszerű JAR (`mq-utils.jar`), mely tartalmazza
az összes szükséges osztályt (az MQ jar-jaiból átemelve), így nem kell a
függőségekkel sem foglalkozni.

Gyakorlatilag képes visszaadni egy sorban lévő üzenetek számát, melyhez
warning és error riasztási szintet lehet definiálni. A használata
magáért beszél:

    java -jar mq-utils.jar [qmgr] [port] [mqServerName] [channelName] [queueName] {-w [warning threshold]} {-c [critical threshold]} {-debug}

Ehhez persze kell Java a gépre, ahol fut. Viszont, mivel képes hálózaton
is csatlakozni, tehetjük arra a gépre, ahol a Nagios van, és arra a
gépre is, ahol az MQ.
