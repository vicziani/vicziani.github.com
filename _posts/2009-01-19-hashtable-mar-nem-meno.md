---
layout: post
title: A Hashtable már nem menő
date: '2009-01-19T01:43:00.008+01:00'
author: István Viczián
tags:
- Java SE
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Kedves kollégáim ihletésére született ez a poszt, nem az első, akiket
jól belinkelek ide, amint hajlandóak végre blogot indítani.

Az blog poszt tartalma, hogy mi a különbség a Hashtable és a HashMap
között.

Az eredeti ötlet onnan jött, hogy a Masterfield Oktatóközpont indított
egy új blogot, melyen egy
[poszt](http://masterfield.blog.hu/2008/12/05/hogyan_hasznaljuk_hatekonyan_a_java_hashtable_osztalyat)
arról szól, hogyan használjuk hatékonyan a Hashtable-t.

Ezen kicsit meglepődtem, hiszen a Java 1.2-es verziója óta, amikor is
bevezették a [collections
framework-öt](http://java.sun.com/docs/books/tutorial/collections/index.html),
én csak HashMap-et használok. De miért, milyen technológiai
megfontolások állhatnak ennek a hátterében.

Mindkét osztály implementálja a Map interfészt, de nézzük meg a
különbségeket:

-   A legfőbb különbség, hogy amíg a Hashtable osztály szinkronizált,
    addig a HashMap osztály nem
-   A HashMap engedélyezi null értékek használatát is
-   A Hashtable nem követi a camelcase elnevezési konvenciót :)
-   A Hashtable metódusai nincsenek ellátva a final módosítószóval,
    ahogy Bruce Eckel a [Thinking in
    Java](http://www.mindview.net/Books/TIJ/) könyvében rámutat

Funkcionalitás szempontjából foglalkozzunk csak az első különbséggel. A
collections framework azt mondja, hogyha a collections framework osztály
példányait szinkronizálni akarjuk, akkor használjuk a Collections
osztály metódusait, az adott példában a Collections.synchronizedMap
statikus metódust.

Van-e különbség a Hashtable példányunk és a szinkronizált HashMap
között? A válasz, hogy nincs, hiszen a két osztály működése nagyon
hasonló, ez az osztálykönyvtár forráskódjából hamar kiderül. Sokan
tesztelték, de az előző állításból is levezethető, hogy szignifikáns
performancia különbség sincs a kettő között.

Akkor mi alapján válasszunk, döntsünk? Semmiképp ne a funkcionalitás
alapján, mert ott nincs különbség. De mivel minden dokumentáció és könyv
(a collections framework tutorial-ja, a Sun-os SCJP vizsgára felkészítő,
és Bruce Eckel könyve is) a Hashtable-t legacy osztálynak minősíti,
ezért kerüljük a használatát, hátha előbb-utóbb módosítás következik be
kettőjük viszonyában. Persze feltehetőleg egyhamar nem fogják
eltávolítani, depracated-dé tenni, hiszen annyi program használja. A
különös, hogy erről a JavaDoc semmit nem ír.

Itt érdemes még megemlíteni, hogy a collections framework vezette be az
Enumeration helyett az Iterator osztályt is. A Hashtable osztály elemein
mindkét osztály példányával végigmehetünk, lásd a kódot. A
values().iterator() ún. fail-fast iterator-t ad vissza, ami azt jelenti,
hogy amennyiben nem az iterator módosító metódusain keresztül módosítjuk
a Hashtable-t, kivétel fog keletkezni. Az Enumeration amúgy szintén egy
ilyen maradványosztály a Java 1.0, 1.1 időkből, mely annyiban különbözik
az Iterator-tól, hogy hosszabbak a metódusnevei, valamint nem
rendelkezik egy remove() metódussal. Ezt viszont már megemlíti a
JavaDoc, hogy az Iterator-t használjuk.

```
import java.util.ConcurrentModificationException;
import java.util.Enumeration;
import java.util.Hashtable;
import java.util.Iterator;
import junit.framework.Assert;
import org.junit.Test;

public class HashTest {

  @Test
  public void hashtableEnumeration() {
      Hashtable hashtable = new Hashtable(){{ "{{" }}
          put("key0", "value");
      }};
      Enumeration enumeration = hashtable.elements();
      hashtable.put("key1", "value1");
      Assert.assertEquals("value1", enumeration.nextElement());
  }

  @Test(expected=ConcurrentModificationException.class)
  public void hashtableIterator() {
      Hashtable hashtable = new Hashtable(){{ "{{" }}
          put("key0", "value");
      }};
      Iterator iterator = hashtable.values().iterator();
      hashtable.put("key1", "value1");
      // ConcurrentModificationException kivetelt valt ki
      iterator.next();
  }
}
```
