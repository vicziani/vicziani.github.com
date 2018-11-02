---
layout: post
title: JPA XML mapping állományok
date: '2010-05-16T23:20:00.004+02:00'
author: István Viczián
tags:
- JPA
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Adott egy web alkalmazás, mely perzisztenciához Hibernate JPA provider-t
és Oracle 10g adatbázist használ. A JPA nagy ígérete a
platformfüggetlenség, azaz az alkalmazás minimális erőfeszítéssel
futtatható másik adatbázison.

Ki is próbáltam, és a Hibernate specifikus databasePlatform beállítást
org.hibernate.dialect.Oracle10gDialect értékről átírtam MySQL5Dialect-re
(normál esetben ez a persistence.xml-ben van, de én Spring-ből
használtam, így az applicationContext.xml-ben).

Ekkora következő hibaüzeneteket kaptam:

    Caused by: org.hibernate.MappingException: could not instantiate id generator
    Caused by: org.hibernate.MappingException: Dialect does not support sequences

Ez azért van, mert a forráskódban az entitás id attribútumán a következő
annotáció szerepelt:

{% highlight java %}
public class Employee {

  @Id
  @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "EmployeeSeq")
  @SequenceGenerator(name="EmployeeSeq", sequenceName = "seq_employee")
  private Long id;

...
}
{% endhighlight %}

Ez azt jelenti, hogy az id értéke automatikusan generált, az EmployeeSeq
generátor által, mely egy Oracle szekvencia, seq\_employee néven.
Azonban a MySQL nem ismeri a szekvencia fogalmát, helyette a mezőnek egy
tulajdonsága az auto increment.

Az automatikus azonosító generálásra a JPA a következő lehetőségeket
biztosítja:

-   Table: ekkor egy tábla tartalmazza a kiosztható azonosítókat - ez
    minden adatbázison működő megoldás
-   Sequence: azonosító generálása szekvencia alapján - pl. az Oracle
    ismeri
-   Identity: elsődleges kulcs identity, vagy más néven autonumber vagy
    auto increment - a MySQL ezt ismeri
-   Auto: a provider választ

Így tehát a kóddal, a forráskódban szereplő annotációkkal az
adatbázishoz kötöttük magunkat, bukva a platformfüggetlenséget. Vagy
mégsem?

A JPA-ban (ugyanúgy mint az EJB3-ban) ugyanis lehetőség van a
konfiguráció megadására annotációként, és ezt felül lehet definiálni a
kódon kívül XML konfigurációs állományokban (EJB esetén deployment
descriptor-nak hívják). Ezek a konfigurációs állományok JPA esetén a JPA
XML mapping állományok. Minden egyes annotációval megadható
konfigurációt meg lehet adni XML konfigurációval is. Amennyiben nincs
sem annotációval, sem XML-ben konfiguráció megadva, un. intelligens
default értékek kerülnek alkalmazásra. Ilyen intelligens alapértelmezett
érték pl. az, hogy a tábla neve megegyezik az entitás nevével, annyi
oszlop van benne, amennyi nem tranziens attribútum.

Tehát a cél, hogy az alkalmazás kódjának módosítása nélkül képes legyen
MySQL adatbázison is működni. Ehhez először a persistence.xml
állományban kell megadni az XML konfigurációs állomány helyét. Legyen ez
is a persistence.xml állomány mellett, mapping-mysql.xml néven (a WAR
állományban a WEB-INF/classes/META-INF könyvtárban kell elhelyezni).

Ehhez módosítsuk a persistence.xml állományt a következő módon:

{% highlight xml %}
<persistence-unit name="jtechlogPU" transaction-type="RESOURCE_LOCAL">
      <mapping-file>META-INF/mapping-mysql.xml</mapping-file>
</persistence-unit>
{% endhighlight %}

Az állomány helyét a CLASSPATH-hoz képest kell megadni.

A mapping-mysql.xml állományban definiáljuk, hogy az Employee osztály id
attribútumának generátora identity típusú legyen:

{% highlight xml %}
<?xml version="1.0" encoding="UTF-8"?>

<entity-mappings xmlns="http://java.sun.com/xml/ns/persistence/orm"
               xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
               xsi:schemaLocation="http://java.sun.com/xml/ns/persistence/orm
               http://java.sun.com/xml/ns/persistence/orm_1_0.xsd"
               version="1.0">
  <entity class="jtechlog.Employee">
      <attributes>
          <id name="id">
              <generated-value strategy="IDENTITY" />
          </id>
      </attributes>
  </entity>
</entity-mappings>
{% endhighlight %}

Ezzel a beállítással az alkalmazás azonnal képes volt MySQL adatbázison
is működni. Már csak a build folyamatot kell úgy módosítani, hogy a
persistence.xml állományban egy környezeti beállítás alapján helyezze el
a mapping állomány hivatkozást.
