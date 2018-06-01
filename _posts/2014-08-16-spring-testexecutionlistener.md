---
layout: post
title: Spring TestExecutionListener
date: '2014-08-16T21:58:00.000+02:00'
author: István Viczián
tags:
- Tesztelés
modified_time: '2018-06-01T21:58:23.382+02:00'
---

Használt technológiák: Spring Framework 4.0.4, Joda-Time 2.3, Hamcrest
Date 1.0.1

Ebben a posztban három library három apró de érdekes képességét
szeretném bemutatni, és hogy hogyan tudnak ezek együttműködni. A
poszthoz tartozó mintakód megtalálható a
[GitHubon](https://github.com/vicziani/jtechlog-spring-listener).

Nálunk gyakran van szükség arra, hogy a teszt esetek különböző
dátumokkal dolgozzanak. Mivel van, hogy a tesztelendő funkció a mai
napot veszi alapul, jól jön egy olyan lehetőség, hogy az aktuális időt
be tudjuk állítani, és utána már könnyebb az asserteket megfogalmazni.
Időgépnek nevezzük, mellyel ide-oda lehet ugrálni az időben.

A Java `Date` magában nem alkalmas erre, általában egy factory metódust
szoktunk létrehozni, mely lekéri az aktuális időt. Ilyenkor figyelni
kell arra, hogy csak ezen metódus meghívásával hozzunk létre dátumot, ne
használjuk a `Date` konstruktorát.

Azonban a [Joda-Time](http://www.joda.org/joda-time/), mely kibővíti a
Java szerény dátumkezelési képességeit, tartalmaz ilyen lehetőséget.

Amennyiben a `DateTimeUtils` `setCurrentMillisOffset` metódusát hívjuk,
a rendszeridőhöz mindig hozzáad annyi ezredmásodpercet, mint amennyit
paraméterként megadtunk. Így nem mindig egy fix időt ad vissza, hanem az
időugrás után gyakorlatilag tovább “jár” az óra. Mivel pl. a `DateTime`
létrehozásakor is a `DateTimeUtils` `currentTimeMillis` metódusát
használja, annak példányosításakor is már a módosított időt kapjuk.
Nézzük tehát, hogy hogy lehet az időugrást elvégezni.

{% highlight java %}
private void engage(DateTime targetTime) {
    DateTime realTime = new DateTime(new Date());
    long offset = targetTime.getMillis() - realTime.getMillis();
    DateTimeUtils.setCurrentMillisOffset(offset);
}
{% endhighlight %}

Valahol láttam, és megtetszett, hogy JUnit teszt esetre vonatkozó
állításokat deklaratív módon, annotációkkal fogalmaztak meg. Kíváncsi
voltam, hogy lehet ezt megvalósítani Spring Framework használatakor.

A megoldás, hogy egy `TestExecutionListener` kell implementálni. Ez
deklarál különböző metódusokat, callbackeket, melyek különböző
eseményekkor lefutnak, pl. teszt osztály/metódus előtt/után, stb.
Létezik egy `AbstractTestExecutionListener` absztrakt osztály is, mely
az interfész minden metódusát üres implementációval valósít meg, és a
leszármazott osztályunknak csak a megfelelő metódust kell felülírnia.

Azt szeretném tehát, ha annotációval tudnám megadni, hogy a teszt eset
futtatásakor mennyi legyen az idő. Pl. a következő kódrészlettel:

{% highlight java %}
@Test
@TimeMachine(targetDate = "2014-01-01 10:00")
public void travelToPast() {
    // ...
}
{% endhighlight %}

Ehhez implementáljuk a megfelelő listenert. A `beforeTestMethod`
metódust írjuk felül, hogy minden teszt metódus futtatása előtt
ellenőrizze, hogy a metóduson van-e `@TimeMachine` annotáció.

{% highlight java %}
public class TimeMachineTestExecutionListener
    extends AbstractTestExecutionListener {

    @Override
    public void beforeTestMethod(TestContext testContext)
            throws Exception {
        TimeMachine timeMachine = testContext.getTestMethod()
            .getAnnotation(TimeMachine.class);

        if (timeMachine != null) {
            DateTimeFormatter formatter =
                DateTimeFormat.forPattern("yyyy-MM-dd hh:mm");
            DateTime targetTime = formatter
                .parseDateTime(timeMachine.targetDate());
            engage(targetTime);
        }
    }
}
{% endhighlight %}

Ezen kívül már csak annyit kell tennünk, hogy a teszt osztályunkra rá
kell tenni a `@TestExecutionListeners` annotációt.

{% highlight java %}
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration
@TestExecutionListeners(TimeMachineTestExecutionListener.class)
public class TimeMachineTest {
    // ...
}
{% endhighlight %}

Most már csak annyit szeretnék, hogy letesztelni, hogy működik-e az
időgép. Írtam már a [Hamcrestről](/2014/05/26/hamcrest.html), így
Hamcrest matchert kerestem, és meg is találtam a [Hamcrest
Date](https://github.com/eXparity/hamcrest-date) projektet, mellyel
hatékonyan tudunk dátumokat összehasonlítani.

Nézzük meg, hogy hogyan is néz ki a teszt metódus, azon belül is
koncentráljunk az assertre.

{% highlight java %}
@Test
@TimeMachine(targetDate = "2014-01-01 10:00")
public void travelToPast() {
    // When
    DateTime now = new DateTime();

    // Then
    DateTime expected = new DateTime(2014, 1, 1, 10, 0);
    assertThat(now.toDate(),
        within(5, TimeUnit.SECONDS, expected.toDate()));
}
{% endhighlight %}

A `DateMatchers` `within` metódusát használva ellenőrizhetjük, hogy két
dátum között mennyi a differencia, itt most max. 5 másodpercet adtunk
meg, feltételezve, hogy ennyi idő alatt biztos lefut a teszteset.
