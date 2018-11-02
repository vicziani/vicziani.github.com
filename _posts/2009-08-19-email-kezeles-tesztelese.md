---
layout: post
title: E-mail kezelés tesztelése
date: '2009-08-19T01:15:00.004+02:00'
author: István Viczián
tags:
- Library
- Tesztelés
- Java EE
- Spring
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Többször kellett már olyan alkalmazást fejleszteni, mely elektronikus
levelet küld SMTP protokollon, vagy egy mailbox tartalmát figyeli POP3,
esetleg IMAP protokollon. Ilyen alkalmazás tesztelése elég nehézkes,
hiszen kell hozzá egy mail szerver, megfelelő e-mail címekkel és
folder-ekkel. Vagy rendelkezésre áll ilyenkor az éles környezet, amin
nem szerencsés tesztelni, vagy a legrosszabb esetben még egy mail
szervert is telepíteni kell.

Erre ad megoldást a [Mock JavaMail](https://mock-javamail.dev.java.net/)
projekt. Ez gyakorlatilag négy osztály, mely kihasználja a [JavaMail
API](http://java.sun.com/products/javamail/) plugin-olhatóságát. Ezt a
Session osztály teszi lehetővé, mely lehetőséget biztosít a különböző
protocol provider-ekhez. A protocol provider-ek különböző osztályok,
melyek a különböző protokollokat kezelik. Ezek lehetnek Transport
leszármazottak pl. küldés esetén, melynek egyik leszármazottja a
SMTPTransport osztály az SMTP protokoll kezelése, és lehetnek Store
leszármazottak, melyek egy üzenet tárolót reprezentálnak, és az üzenetek
kezelését, letöltését teszik lehetővé. A Store leszármazottja a
POP3Store POP3 protokoll és az IMAPStore az IMAP protokoll kezelésére. A
Session osztály a protokollokhoz tartozó provider-eket a
javamail.providers vagy javamail.default.providers állományok alapján
tölti be, a protokollokhoz tarozó cím típusokat a javamail.address.map
vagy a javamail.default.address.map alapján tölti be. Tipikusan a cím
típus SMTP esetén rfc822 (rfc-ben meghatározott), NNTP esetén news.

Ezen állományokat a Session vagy a java.home környezeti változóban
meghatározott könyvtár lib alkönyvtárából, vagy a META-INF könyvtárból
tölti be. A Mock JavaMail felüldefiniálja az SMTP, POP3 és IMAP
protokollokhoz tartozó provider-eket, úgy, hogy a META-INF könyvtárában
szerepel a javamail.providers állomány, mely a saját Transport és Store
osztályait állítja be. Emiatt a Mock JavaMail nagyon egyszerűen
használható, hiszen nem kell mást tenni, mint a JAR állományát (a poszt
írásának időpontjában mock-javamail-1.7.jar) el kell helyezni a
CLASSPATH-ban.

Ezután pontosan úgy lehet levelet küldeni, mint a standard JavaMail API
használatakor, azaz:

{% highlight java %}
MimeMessage msg = new MimeMessage(session);
msg.addRecipient(RecipientType.TO, new InternetAddress("foo@bar.com"));
msg.setSubject("Foo subject");
msg.setText("Foo body");
Transport.send(msg);
{% endhighlight %}

Valamint levelet is pontosan ugyanúgy lehet fogadni:

{% highlight java %}
Store store = session.getStore();
store.connect("bar.com", "foo", "bar");
Folder folder = store.getDefaultFolder();
folder.open(Folder.READ_WRITE);
Message[] messages = folder.getMessages();
{% endhighlight %}

Ez a kód semmiben nem tér el a JavaMail API normál használatától, azaz a
kódunkban akár változatlanul is hagyhatjuk. A különbség annyi, hogy a
JAR CLASSPATH-ban való elhelyezése után a teszt eset futtatásakor a
JavaMail API a Mock JavaMail provider-eit fogja használni, azaz a
mailbox-okat és az üzeneteket a memóriában tárolja, amit a
org.jvnet.mock\_javamail.Mailbox osztály valósít meg, mely a
ArrayList&lt;Message&gt; osztály leszármazottja. Egy mailboxes statikus
tagja tárolja az e-mail címekhez tartozó Mailbox példányokat, melyeket a
get statikus metódussal lehet elérni. Azaz pl. az Assert-nél
használhatjuk a következő kódrészletet a levélküldés után:

{% highlight java %}
List inbox = Mailbox.get("foo@bar.com");
assertEquals(1, inbox.size());
assertEquals("Foo subject", inbox.get(0).getSubject());
{% endhighlight %}

Egy Mailbox példányon meghívhatjuk a setError(true) metódust is, ekkor a
Mailbox példányhoz való hozzáférés hibát fog dobni. Ezzel tesztelhetjük
az alkalmazásunk hibakezelését is.

A Session-t lehet direktben is példányosítani, de egy webes alkalmazás
esetében a legszebb megoldás, ha a web konténer vagy az
alkalmazásszerverben definiáljuk erőforrásként, és az alkalmazásunk
JNDI-vel fér hozzá. Persze teszteléskor, ha a teszt esetet out of
container futtatjuk, akkor a Session-t magunknak kell példányosítanunk.
Én Spring-et használok, így a Session-t a Spring dependency
injection-nel állítja be. Viszont a Session-t nem lehet közvetlenül
példányosítani, hanem factory metódusai vannak, mint a
getDefaultInstance. Emiatt a Spring-ben a következőképp lehet
példányosítani:

{% highlight xml %}
<bean id="session" class="org.springframework.beans.factory.config.MethodInvokingFactoryBean">
<property name="targetClass"><value>javax.mail.Session</value></property>
<property name="targetMethod"><value>getDefaultInstance</value></property>
<property name="arguments">
<list>
  <props>
      <prop key="mail.store.protocol">pop3</prop>
   <prop key="mail.smtp.host">bar.com</prop>
      <prop key="mail.smtp.user">foo</prop>      
  </props>
</list>
</property>
</bean>
{% endhighlight %}

Ahhoz, hogy az alkalmazásunk működjön, a JavaMail API JAR-ját is el kell
helyeznünk a CLASSPATH-ban (jelenlegi verzió a 1.4.2, mail.jar),
valamint Java 6 előtt a Java Activation Framework legutolsó verzióját
(1.1.1, activation.jar). A Java 6-nál ez már nem szükséges, ugyanis már
bekerült a javax.activation csomag.

A projekt oldalán lévő letöltés link nekem nem működött, viszont [innen
letölthető](http://download.java.net/maven/2/org/jvnet/mock-javamail/mock-javamail/1.7/),
forráskóddal együtt.

A projekt oldala három alternatívát is megemlít:
[Wiser](http://code.google.com/p/subethasmtp/wiki/Wiser),
[Dumbster](http://quintanasoft.com/dumbster/), és az
[Aspirin](https://aspirin.dev.java.net/), de első látásra mindegyik csak
egy külön indítható, beépíthető pehelysúlyú SMTP szerver, üzenetek
küldésének tesztelésére. Ezzel szemben a Mock JavaMail mock
provider-eket tartalmaz, melyekkel a küldésen kívül a fogadás is
tesztelhető.
