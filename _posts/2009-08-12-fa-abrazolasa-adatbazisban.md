---
layout: post
title: Fa ábrázolása adatbázisban
date: '2009-08-12T23:24:00.006+02:00'
author: István Viczián
tags:
- algoritmus
- JPA
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Gyakran megesik, hogy adott egy probléma, melyet már megoldottam az
általam használt eszközökkel, de egy kicsit jobban körülnézve olyan
alternatív megoldásokat találok, melyekről nem is hallottam, sőt a
környezetemben sem ismert, mégis egyszerű, jól használható, csak nem
annyira elterjedt.

Ilyenbe futottam, mikor egy egyszerű fát akartam adatbázisban eltárolni.
Mivel mostanában a perzisztenciát általában JPA-val oldom meg, nem is
foglalkozom az adatbázis tervezéssel, engedem, hogy a JPA provider
kigenerálja helyettem az adatbázis sémát. Definiáltam egy Node osztályt,
melynek van Node típusú attribútuma (parent), mely egy referencia a
szülő objektumra, és van egy List típusú attribútuma (children), mely a
gyermek objektumokra mutató referenciákat tartalmazza. A következő
forráskód mutatja a Node osztály vázát:

{% highlight java %}
@Entity
public class Node {
...

@ManyToOne
private Node parent;

@OneToMany(mappedBy="parent")
private List children = new ArrayList();

...
}
{% endhighlight %}

Az első probléma akkor adódik, ha a gyermekek sorrendje nem mindegy.
Ugyanis a JPA alapban nem veszi figyelembe, hogy a List-ben számít a
sorrend. Amennyiben egy új gyermeket veszek fel már létező gyermekek
mellé, a következő lekérdezésnél nem garantált az, hogy ugyanazon
sorrendbe kapom vissza a gyermekeket, ahogy a List-ben szerepeltek. Ez
abból adódik, hogy az adatbázis rekordok között nincs sorrend
definiálva, így általában olyan sorrendben kapom vissza az elemeket,
ahogy az adatbázisba kerültek (de erre sem szabad építeni, mert
különböző műveletek, optimalizációk miatt más sorrend is lehetséges).

Ennek megoldására definiálni kell egy új mezőt, legyen a neve "rank",
mely alapján a rendezettséget definiálni lehet, és használjuk a
@OneToMany annotációval megjelölt mezőn az @OrderBy annotációt, ami
hatására a lekérdezéskor a children lista elemei a rank szerinti
sorrendben lesznek. Ennek ugye az a hátránya, hogy a rank mezőt mindig
karban kell tartani beszúráskor. A rank lehet egy egész szám 0-tól
indexelve. Ilyenkor beszúráskor a beszúrandó gyermek utáni elemeket
"jobbra kell tolni", a rank értéküket egyel növelni kell. Persze ennél
hatékonyabb algoritmusok is léteznek, de ez a legegyszerűbb. Nézzük
tehát a módosított Node osztályunkat:

{% highlight java %}
@Entity
public class Node{
...

private int rank;

@ManyToOne
private Node parent;

@OneToMany(mappedBy="parent")
@OrderBy("rank ASC")
private List children = new ArrayList();

...
}
{% endhighlight %}

Ennél a megoldásnál jött elő, hogy hogyan kell törölni pl. az összes
elemet a táblából. Egy DELETE FROM Node node utasítás nem volt elegendő,
mert a következő hibaüzenetet kaptam: Cannot delete or update a parent
row: a foreign key constraint fails. Ez azt jelenti, hogy egy elemet nem
lehet letörölni, hiszen a gyermek elemek külső kulccsal hivatkoznak rá.
Ezért először az összes referenciát null-ra kell állítani (UPDATE Node
node SET node.parent = null), és csak aztán lehet a törlést elvégezni.

A következő probléma akkor adódik, mikor egy teljes részfát kell
megjeleníteni. Amennyiben egy listába be akarjuk tenni a részfa teljes
elemét (pl. grafikusan meg akarjuk jeleníteni és listában kívánjuk
átadni a megjelenítési rétegnek), a részfát preorder módon, rekurzívan
be kell járnunk. Ekkor viszont minden egyes Node esetén a gyermek-ek
lekérdezésekor, amennyiben LAZY fetch type-ot alkalmaztunk (és
@OneToMany kapcsolat esetén ez az alapértelmezett), minden esetben lefut
egy query, mely lekérdezi a gyermek Node-okat. Akkor sem jobb a helyzet,
ha EAGER fetch type-ot alkalmazunk, mert ekkor nem a bejáráskor, hanem
már a betöltéskor fog lefutni az összes query, azaz pontosan annyi,
amennyi Node-ból áll az adott részfánk.

A háttérben a Node osztály egy NODE táblára képződik le, melynek van egy
PARENT\_ID külső kulcsa, és a gyermekek lekérdezése esetén egy olyan
SELECT-et futtat, mely lekérdezi az összes olyan NODE sort, melynek
PARENT\_ID mezője megegyezik a szülő azonosítójával (SELECT \* FROM node
WHERE parent\_id = ? ORDER BY rank ASC).

A hierarchikus adatok kezelésére bizonyos adatbázisok beépített
megoldásokat tartalmaznak, pl. Oracle esetén a START WITH és CONNECT BY
parancs, vagy esetleg tárolt eljárásban is megvalósíthatjuk a hierarchia
elemeinek összegyűjtését. Mindkettő használható JPA-ból is, de ekkor
bukjuk a platform függetlenséget.

Viszont van egy ennél sokkal hatékonyabb hierarchikus adatszerkezet
reprezentáció, melyet nested tree-nek hívnak. Ez ugyan lekérdezéskor
gyors, de módosításkor a több művelet miatt lassabb, így csak akkor
érdemes használni, ha sok a lekérdezés, és viszonylag kevés a módosítás.
Azért a legtöbb CRM rendszer ebbe a kategóriába sorolható.

A megértéshez nézzünk is egy példa fát. A trükk, hogy minden egyes
Node-hoz felveszünk egy bal és egy jobb értéket. Egy létező fa esetén
ezeket a számokat úgy osztjuk ki, hogy a gyökér elem bal értéke lesz az
1, és megyünk végig gyermekeken mélységi kereséssel, és a bal értékhez
mindig hozzáadunk egyet. Ha levélelemhez érünk, akkor folytatjuk a
számolást visszafele, a szülő fele, és kitöltjük a jobb értékeket, míg
egy testvérhez érünk, és ekkor ismét a bal értékeket osztjuk ki, és így
tovább. Gyakorlatilag óramutató járásával ellentétes irányban
körbejárjuk a fát.

<a href="/artifacts/posts/2009-08-12-fa-abrazolasa-adatbazisban/nested_1_b.png" data-lightbox="post-images">![Kép leírása](/artifacts/posts/2009-08-12-fa-abrazolasa-adatbazisban/nested_1.png)</a>

Az így nyert számozás azért nagyon hatékony részfák lekérdezésére, mert
egy elem részfáját úgy kérhetjük le, ráadásul a preorder bejárással
adott sorrendnek megfelelően, hogy lekérdezzük azon elemeket, melyek bal
értéke a szülő bal értékénél nagyobbak és a jobb értékénél kisebbek, a
bal érték alapján rendezve. Így a teljes részfa egy lekérdezéssel
előállítható, szemben a rekurzív módszerrel, ahol annyi lekérdezésre
volt szükség, ahány elemből állt a fa. Ez a sorrend tökéletes a fák
ábrázolására, pl. egy menü vagy egy oldaltérkép megjelenítésére.

A számozás alapján látható, hogy egy elem összes leszármazottjának a
számát is könnyen megkaphatjuk: (bal érték - jobb érték - 1) / 2. Ez
akkor lehet különösen hasznos, ha ezt a felületen is meg szeretnénk
jeleníteni.

Szintén könnyen észrevehető összefüggés, hogy a levélelemekre igaz az az
állítás, hogy jobb érték - bal érték = 1.

Az egyszerűség kedvéért hagyjuk meg a szülőre mutató referenciát,
valamint javasolt egy attribútum felvétele, mely megadja az adott elem
mélységét a fában (level). Mindkettőt persze ki lehet számolni
lekérdezésekkel is. De ezen attribútumok használatával egyszerűbbek
lesznek a lekérdező műveleteink, de több helyet foglal, és módosításkor
többet kell adminisztrálni. Valamint a rank attribútumra már nem lesz
szükség, hiszen a bal értékek már definiálnak egyfajta sorrendet. Így
néz ki tehát az osztályunk:

{% highlight java %}
public class Node {
...

private int level;

@ManyToOne
private Node parent;

private int left;

private int right;
...
}
{% endhighlight %}

Egy adott elem és annak leszármazottainak lekérdezése tehát a következő
JPA lekérdezéssel adható meg, ahol az első paraméter a kiválasztott elem
bal értéke, a második paraméter a kiválasztott elem jobb értéke:

{% highlight sql %}
SELECT node FROM Node node WHERE node.left BETWEEN :first AND :last ORDER BY node.left
{% endhighlight %}

Tehát ha pl. a java.awt.Window elemet és annak összes leszármazottját
akarjuk lekérdezni, akkor az összes elemet kell lekérdezni, melynek a
bal értéke nagyobb, mint 3, és a jobb értéke kisebb, mint 14, a bal
érték szerint rendezve. Igaz, hogy a lekérdezés nagyon egyszerű, de a
beszúrás viszont bonyolultabb. Amennyiben ugyanis egy elemet akarunk
beszúrni, először ki kell választani a beszúrás helyét. Ha a beszúrandó
elem

-   a kiválaszott elem első gyermeke lesz, az új elem bal értéke a
    kiválasztott elem bal értéke + 1 lesz
-   a kiválaszott elem utolsó gyermeke lesz, az új elem bal értéke a
    kiválasztott elem jobb értéke lesz
-   a kiválaszott elem bal testvére lesz, az új elem bal értéke a
    kiválasztott elem bal értéke lesz
-   a kiválaszott elem jobb testvére lesz, az új elem bal értéke a
    kiválasztott elem jobb értéke + 1 lesz

Az új elem jobb értéke, mivel az elemnek még nincs gyermeke, az új elem
bal értéke + 1 lesz. Ez után egy "eltoltást" kell elvégezni, ugyanis
lehetséges, hogy az így kiosztott számok már foglaltak. Ehhez két
művelet szükséges, egyrészt az összes olyan elem bal értékéhez, melynek
a bal értéke nagyobb, vagy egyenlő, mint a beszúrandó elem bal értéke,
hozzá kell adni 2-t. Valamint az összes olyan elem jobb értékéhez,
melynek a jobb értéke nagyobb, vagy egyenlő, mint a beszúrandó elem bal
értéke, hozzá kell adni 2-t. Ez két egyszerű JPA bulk update művelettel
is elvégezhető, ahol a paraméter a beillesztendő elem bal értéke:

{% highlight sql %}
UPDATE Node node SET node.left = node.left + 2 WHERE node.left >= :position
UPDATE Node node SET node.right = node.right + 2 WHERE node.right >= :position
{% endhighlight %}

Vegyük példaként, hogy a java.awt.Dialog elem első gyermekeként egy
java.awt.FileDialog elemet akarunk felvenni. Az új elem bal értéke 9
lesz és a jobb értéke 10. Majd az összes elem bal értékét 2-vel növelni
kell, melynek bal értéke nagyobb vagy egyenlő, mint 9, és ugyanígy az
összes elem jobb értékét 2-vel növelni kell, melynek jobb értéke nagyobb
vagy egyenlő, mint 9.

<a href="/artifacts/posts/2009-08-12-fa-abrazolasa-adatbazisban/nested_2_b.png" data-lightbox="post-images">![Kép leírása](/artifacts/posts/2009-08-12-fa-abrazolasa-adatbazisban/nested_2.png)</a>

Ezek alapján a további műveletek is könnyen implementálhatóak. Egy
részfa törlésénél töröljük az adott elemet, majd az így keletkezett
"lyukra" húzzuk vissza a mögötte elhelyezkedő elemeket. Mivel nem csak
egy elemet, hanem teljes részfát is törölhetünk, az eltolás nem 2-vel
történik, hanem a részfa elemszáméval, melynek kiszámolását már fentebb
leírtam.

A gyökértől adott elemhez vezető utat is egy lekérdezéssel megkaphatjuk,
ugyanis a felmenő elemek mindegyikére igaz, hogy bal értékük kisebb,
mint a kiválasztott elem bal értéke, és a jobb értékük viszont nagyobb,
mint a kiválaszott elem jobb értéke. Ezt tehát a következő JPA
lekérdezéssel kapjuk meg, ahol az első paraméter a kiválasztott elem
jobb, a második a bal értéke:

{% highlight sql %}
SELECT node FROM Node node WHERE node.left < :left AND node.right > :right ORDER BY node.left
{% endhighlight %}

Az elem közvetlen gyermekeinek, valamint egy elem testvéreinek
lekérdezése a parent mutató miatt nagyon egyszerű. A legbonyolultabb
persze a részfa mozgatása, itt is először meg kell határozni a mozgatni
kívánt elem új bal és jobb értékét. Ez megegyezik a beszúrással. Ezután
helyet kell csinálni a részfának, azaz a kiszámolt bal értékhez el kell
tolni az elemeket annyival, amennyi elem van a részfában. Mind az
eltolást, mind az elemek számának kiszámolását említettem. Eztán el kell
mozgatni a részfát az üres helyre, szintén a bal és jobb elemek
frissítésével, majd a keletkezett üres hely mögötti elemeket kell
"visszahúzni" (bal és jobb értékek csökkentésével).

Ebből látszik, hogy ez a megoldás sem egyértelműen jobb, mint a
klasszikus mutatós megoldás, de akkor jobban használható, ha sokkal több
a lekérdezés, mint a módosítás. Én úgy valósítottam meg a fa
műveleteket, hogy definiáltam egy interfészt, melybe felsoroltam a
metódusokat, és az interfészt két osztály implementálta, az egyik a
klasszikus műveletekkel, a másik a nested tree-vel. Persze az elemnek is
csináltam egy közös absztrakt osztályt, melynek egyik leszármazottja
mutatókat tartalmazott, másik leszármazottja pedig a bal és jobb
értékeket. Persze Spring service-ként implementáltam őket, emiatt
konfigurációval azonnal választani lehet a két implementáció között. Ez
gyakorlatilag a strategy tervezési minta egy megvalósítása.

A témáról egy [angol nyelvű cikk
ír](http://www.sitepoint.com/article/hierarchical-data-database/2/),
mely egy PHP-s megoldást mutat be, bár a mozgatást nem részletezi. Sőt
egy [magyar cikk](http://weblabor.hu/cikkek/hierarchikusadatkezeles3) is
megjelent, szintén PHP megvalósítással, miközben ezt a post-ot írtam
(három részes, a negyedik cikk még nem jelent meg, ami a fa
módosításáról fog szólni). A poszt írásakor ez a [Java
kódrészlet](http://affy.blogspot.com/ntm/Ntm.java) is nagyon hasznos
volt, mely egyszerű JDBC-t használ.
