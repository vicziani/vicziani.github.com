---
layout: post
title: JAXB trükkök
date: '2009-07-03T01:09:00.004+02:00'
author: István Viczián
tags:
- JAXB
- Java SE
---
Frissítve: 2017. november 18.

Felhasznált technológiák: JAXB

A poszthoz tartozó példaprogram elérhető a
[GitHubon](https://github.com/vicziani/jtechlog-xml).

### Körkörös referencia

Amennyiben JAXB esetén azt szeretnénk, hogy két osztály között a
kapcsolat kétirányú legyen, azaz pl. a `Catalog` osztály is hivatkozzon
a `Book` osztályra, és fordítva, a következő kivételt kapjuk:
`com.sun.istack.internal.SAXException2: A cycle is detected in the object graph. This will cause infinitely deep XML:`.
Ez azt jelenti, hogy először mentené a `Catalog` példányát, majd a
`Book` példányát, majd újra a `Catalog` példányt, és így tovább, tehát
egy körkörös hivatkozás alakul ki. Ennek
elkerülésére
a visszamutató getterét `@Transient` annotációval lássuk el, és a `Book`
objektumba vegyük fel az `afterUnmarshal` metódust.

{% highlight java %}
public class Book {

  private Catalog catalog;

  @XmlTransient
  public Catalog getCatalog() {
    return catalog;
  }

  public void afterUnmarshal(Unmarshaller u, Object parent) {
    this.catalog = (Catalog) catalog;
  }

  // ... stb...
}
{% endhighlight %}

Az `afterUnmarshal` használatakor kiderült még egy érdekes dolog. A JDK
1.6.0\_13-asban lévő JAXB 2.1.3 a kivételt elnyeli, és a program fut
tovább. A 1.6.0\_14-es verziószámú JDK-ba
[került](http://www.oracle.com/technetwork/java/javase/6u14-137039.html)
JAXB RI 2.1.10-es verziója viszont nem kezeli le, hanem kivételt okoz.
Azaz a kivétel elnyelése, az üres catch ágak használata nem csak azért
rossz, mert amennyiben hiba van, nehezen találjuk meg, hanem azért is,
mert amikor a hibát kijavítjuk, melyre egy másik hibát építettünk, az
első javításakor előjön a másik. Tanulság, hogy két update között is
lehetnek kompatibilitási problémák, így érdemes minden szóbajöhető JDK
verzión letesztelni az alkalmazásunkat, vagy specifikáljuk a
verziószámot kínosan pontosan. Az előbbi tovább erősíti az automatikusan
futtatható teszt esetek hasznosságát.

A JAXB RI 2.1 EA2-ban a körkörös referencia feloldására jelent meg a
`CycleRecoverable` interfész is.

### Ős és leszármazott

Amennyiben azt szeretnénk, hogy legyen egy `Item` osztály, annak két
leszármazottja legyen, pl. `Book` és `Magazine`, és azt szeretnénk, hogy
az XML-ben a `<catalog>` tag alatt egyszer a `<book>`, egyszer a `<magazine>` tag szerepeljen,
mindkettő leszármazotton definiáljuk az `@XmlRootElement` annotációt, és
adjuk meg `name` paraméterül a kívánt nevet, és a `Catalog` osztály
`items` változójára tegyük rá a `@XmlElementRef` annotációt. Ez
megoldja, hogy ne az attribútum neve alapján nevezze el a taget, hanem
dinamikusan, a konkrét példány osztályában az `@XmlRootElement`
annotáció name attribútuma alapján.

### Típuskonverzió

Van, hogy nem megfelelő nekünk a JAXB által választott típus, hanem
saját osztályunkból akarjuk példányosítani. Pl. a
`Book` osztályunk `isbn` attribútuma ne `String`, hanem `Isbn10` típusú
legyen (mely egy saját osztály).

Ez könnyedén megtehető. Egyrészt kell írnunk egy adaptert, mely a
típusok közötti konverziót elvégzi.

{% highlight java %}
public class Isbn10Adapter extends XmlAdapter<String, Isbn10> {

    public Isbn10 unmarshal(String value) {
        return new Isbn10(value);
    }

    public String marshal(Isbn10 value) {
        return value.getValue();
    }
}
{% endhighlight %}

Másrészt használjuk az `@XmlJavaTypeAdapter` annotációt.

{% highlight java %}
public class Book {

    @XmlAttribute
    @XmlJavaTypeAdapter(Isbn10Adapter.class)
    public Isbn10 getIsbn10() {
        return isbn10;
    }

    // stb...
}
{% endhighlight %}
