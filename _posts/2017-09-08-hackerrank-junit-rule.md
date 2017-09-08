---
layout: post
title: Hackerrank megoldások JUnit Rule-lal
date: '2017-09-08T22:00:00.000+02:00'
author: István Viczián
---

A [JUnit Rule-ok](https://github.com/junit-team/junit4/wiki/rules) gyakran méltánytalanul
mellőzött osztályai a JUnit keretrendszernek. A rule-ok használatával pedig
kibővíthetjük a teszteseteinket újrafelhasználható funkciókkal. Léteznek már
előre megírt rule-ok, mint a `TemporaryFolder` rule
fájlműveletek teszteléséhez, vagy az `ExpectedException` rule, melynek
használatával az elvárt kivételekre tudunk pontosabb feltételeket megfogalmazni.
Természetesen saját rule-okat is írhatunk, ha szabadidőnket erre áldozzuk, ahelyett, hogy a
kora őszi erdőt járnánk szarvasbőgést hallgatva.

A [Hackerrank](https://www.hackerrank.com) egy olyan oldal, ahol
különböző nehézségű programozási
feladatok vannak a kezdőtől a profiig, melyek megoldásával pontokat gyűjthetünk. Választhatunk
különböző témakörök közül, használhatunk különböző programozási nyelveket.
A feladatok angolul vannak leírva, és több teszt eset is tartozik hozzájuk,
jellemzőjük, hogy a standard bemenetről kell beolvasni a teszt adatokat, és
a standard kimenetre kell a megoldást
kiírni. A tesztesetek (bemenet és kimenet) fájlként letölthetőek.

Természetesen nem túl kényelmes a megoldásokat a weboldal beviteli mezőjében
megírni, sokkal jobb kedvenc fejlesztőeszközünkben. Java esetén JUnit teszteket
is használhatunk, ekkor azonban a Hackerranken publikált kódvázat kell
átalakítanunk. Ahhoz, hogy ezt a lépést ne kelljen megtennünk, és egyszerűen
másolhassuk le a kódot, készítettem egy JUnit rule-t, mely a standard inputra
irányítja a példa bemenetet tartalmazó állomány tartalmát, naplózza a standard
kimenetre az írásokat, és szabályos assert hívással összehasonlítja a kimenetre
írt tartalmat a megoldást tartamazó állomány tartalmával.

Így ezen poszt bemutatja a JUnit rule-ok használatát, valamint egy eszközt biztosít,
mellyel kényelmesebben lehet Hackerrank feladatokat megoldani.

<!-- more -->

Abban az esetben, ha bizonyos kódrészleteket szerettünk volna újra felhasználni
JUnit teszt eseteinkben, logikus megoldásnak tűnhetett ősosztály használata.
Ha minden teszt eset előtt és után le szerettünk volna futtatni különböző
metódusokat, azokat `@Before` és `@After` annotációkkal láthattuk el, így
azok a leszármazott futtatásakor is lefutottak.

Ennek a megoldásnak több hátránya is van. Egyrészt az egyszeres öröklődés
Javaban komoly korlát, és azóta már tudjuk, hogy az öröklődés helyett
gyakran érdemes kompozíciót alkalmazni. Azaz a megfelelő funkciókat külön
osztályokba szervezzük, és a feladatokat ezen osztály példányainak delegáljuk.
Másrészt a `@Before` és `@After` annotációkkal ellátott metódusok nem feltétlenül
kapcsolódtak össze, és ezzel a megoldással nem lehetett a teszt metódus
törzsét "körbevenni", pl. egy try-catch blokkban futtatni.

Ezen problémákat kiküszöbölhetjük JUnit rule-ok használatával. A rule-ok
valójában közrefogják a teszt metódusainkat, a rule-ban definiált metódus
hívja a teszt metódust. Így a rule-okra úgy is gondolhatunk, mint
servletek esetén a filterekre, vagy AOP esetén az around advice-okra. Ezzel az is
lehetővé válik, hogy a teszt metódust try-catch-ben futtatjuk, erre épül pl.
az `ExpectedException` rule.

Nézzük is meg ennek a használatát (példa a hivatalos dokumentációból).

{% highlight java %}
public static class HasExpectedException {
  @Rule
  public final ExpectedException thrown = ExpectedException.none();

  @Test
  public void throwsNothing() {

  }

  @Test
  public void throwsNullPointerException() {
    thrown.expect(NullPointerException.class);
    throw new NullPointerException();
  }

  @Test
  public void throwsNullPointerExceptionWithMessage() {
    thrown.expect(NullPointerException.class);
    thrown.expectMessage("happened?");
    thrown.expectMessage(startsWith("What"));
    throw new NullPointerException("What happened?");
  }
}
{% endhighlight %}

Először a `@Rule` annotációval létrehozunk egy `public` láthatóságú attribútumot.
A JUnit keretrendszer minden egyes metódus futtatásakor példányosít egy
rule objektumot (hiszen a teszt esetet magát is példányosítja - biztosítva ezzel
a teszt metódusok közötti függetlenséget).

A `throwsNothing()` metódus nem vár és nem is dob kivételt. A `throwsNullPointerException()`
metódus vár egy `NullPointerException` kivételt, melyet aztán dob is. Ha a metódus futtatásakor
nem keletkezne megfelelő kivétel, a teszteset elbukna. Ez a megoldás ekvivalens azzal,
mikor a `@Rule` annotációnak az `expected` attribútumot adjuk meg. Ott azonban nem lehet
további feltételeket megadni a kivételre vonatkozóan, pl. ellenőrizni a üzenettet, vagy a kiváltó
okot. A `throwsNullPointerExceptionWithMessage()` metódus mutatja, hogy a kivétel üzenetére
nemhogy pontos egyezőséget adhatunk meg, de akár Hamcrest matchert is hívhatunk. A dobott
kivételhez is hozzáférhetünk, és a kiváltó okot is lekérdezhetjük. Ez korábban csak
úgy volt lehetséges, ha a metódusunkban try-catch blokkot alkalmaztunk.

Fájl olvasások és írások tesztelése sem olyan egyszerű. Gondoskodnunk kell egy könyvtárról,
ahova büntetlenül lehet írni és olvasni. Valamint figyelnünk kell arra is, hogy a teszt
lefutása utána az ideiglenes állományok törlésre kerüljenek.

A `TemporaryFolder` rule használatával mindez sokkal egyszerűbb, mint ahogy az alábbi
példa is mutatja.

{% highlight java %}
public static class HasTempFolder {
  @Rule
  public final TemporaryFolder folder = new TemporaryFolder();

  @Test
  public void testUsingTempFolder() throws IOException {
    File createdFile = folder.newFile("myfile.txt");
    File createdFolder = folder.newFolder("subfolder");
    // ...
  }
}
{% endhighlight %}

Ezzel létrehozunk egy ideiglenes könyvtárat, és ebben létrehozhatunk újabb
könyvtárokat és fájlokat. Ezeket paraméterül beadhatjuk a tesztelendő metódusainknak.
A rule fog arról gondoskodni, hogy ezt a könyvtárat letörölje (a finally ágban). Az
ideiglenes könyvtárat az operációs rendszer temp könyvtárában hozza létre.

A [System Rules](http://stefanbirkner.github.io/system-rules/) egy nyílt forráskódú könyvtár, ami
további rule-okat tartalmaz:

* `System.out`, `System.err` naplózása, assert, `System.in` beállítása
* `System.exit` hívásának ellenőrzésére
* Rendszerváltozók (system properties) beállítására, vagy beállításának
ellenőrzésére. Teszt futtatása előtt be lehet állítani különböző értékeket,
és ezek a teszt végén a teszt előtti értékekre állnak vissza.
* Környezeti változókra (environment variables) ugyanaz
* Security Manager beállítására, majd teszt után az alapértelmezett visszaállítására

Ha saját rule-t akarunk létrehozni, akkor leszármazhatunk pl. az `ExternalResource`
osztályból. Ekkor írjuk felül a `before()` és `after()` metódusokat, melyek
le fognak futni a teszt metódusunk előtt és után is.

Ha a tesztesetről további információkat szeretnénk, a `TestRule` interfészt kell implementálni,
abban is az `apply()` metódust. Paraméterül több információt is kapunk a futtatott
tesztesetről, pl. annak osztályát (`Description`-től kérhető le).

{% highlight java %}
public interface TestRule {
    Statement apply(Statement base, Description description);
}
{% endhighlight %}

A `Statement` egy absztakt osztály, mely `evaluate()` metódusát kell implementálni.

{% highlight java %}
public abstract class Statement {
    public abstract void evaluate() throws Throwable;
}
{% endhighlight %}

Ezzel a megoldással nem csak hogy a rule-t tudjuk a teszt metódus "körül" futtatni,
de a rule-okat is egymásba ágyazhatjuk.

Nézzük is meg, hogy van a `ExternalResource` osztály `statement()` metódusa implementálva.

{% highlight java %}
private Statement statement(final Statement base) {
  return new Statement() {
      @Override
      public void evaluate() throws Throwable {
          before();
          try {
              base.evaluate();
          } finally {
              after();
          }
      }
  };
}
{% endhighlight %}

Remekül látszik, hogy egyrészt delegálja a hívást az eredeti `Statement` példánynakés a finally-ágban
hívja az `after()` metódust.

És most nézzük is meg, hogyan implementáltam a Hackerrank használatához egy
saját `HackerrankRule` rule-t, valamint hogyan kell használni. A forráskódja
elérhető a [Gitub-on](https://github.com/vicziani/junit-rule).

A Hackerranken a legegyszerűbb feladat a
[Java Stdin and Stdout I](https://www.hackerrank.com/challenges/java-stdin-and-stdout-1/problem),
ahol az a feladat, hogy olvassuk fel sorokat a standard bementről, majd írjuk vissza a standard kimenetre.

A példában kizárólag egy `main` metódust kell implementálni. Valamint le lehet tölteni egy
`input00.txt` és egy `output00.txt` állományt, melyek rendre a standard bemenetről
beolvasott adatokat, valamint az elvárt kimenetet tartalmazzák.

Az állományokat el kell helyezni a classpath-on, valamint a következő teszt esetet kell megírni.

{% highlight java %}
public class JavaStdinAndStdoutTest {

    @Rule
    public HackerrankRule hackerrankRule = new HackerrankRule();

    @Test
    public void testSolution() {
        hackerrankRule.activate();

        StreamSupport
                .stream(Spliterators.spliterator(
                        new Scanner(System.in),
                        Integer.MAX_VALUE,
                        Spliterator.NONNULL | Spliterator.IMMUTABLE),
                        false)
                .forEach(System.out::println);

        hackerrankRule.assertOutput();
    }
}
{% endhighlight %}

A streamet feldolgozó sor tartalmazza a beolvasást a standard bemenetről, és a standard kimenetre való írást (soronként).
Látható, hogy a `System.in`-ről olvas, és a `System.out`-ra ír.

Előtte az `activate()` metódus, mely kicseréli a `System.in` referenciáját egy olyan `InputStream`-re, mely a példa fájlból olvas,
valamint a `System.out` referenciáját egy olyan `PrintStream`-re, mely egy `ByteArrayOutputStream`-re is naplózza a kimenetet.

Amennyiben a fejlesztőeszköz konzolján is szeretnénk látni a kimenetet, akkor hívjuk a `enableSystemOut()` metódust a következőképp.

{% highlight java %}
hackerrankRule
  .enableSystemOut()
  .activate();
{% endhighlight %}

A `assertOutput()` metódus hívás leellenőrzi, hogy a `System.out`-ra írt tartalom megegyezik-e a példa fájlban lévő tartalommal.

A rule-nak még arról kell gondoskodni, hogy a `System.in` és `System.out` referenciákat a teszteset lefuttatása után visszaállítsa.

Nézzük meg a rule forráskódját nagyvonalakban.

{% highlight java %}
public class HackerrankRule implements TestRule {

    private Class testClass;

    private InputStream tmpIn;

    private PrintStream tmpOut;

    private LoggerOutputStream loggerOutputStream;

    public void activate() {
        tmpIn = System.in;
        tmpOut = System.out;

        String filename = "input/input00.txt";
        InputStream is = testClass.getResourceAsStream(filename);
        System.setIn(new BufferedInputStream(is));

        loggerOutputStream = new LoggerOutputStream(System.out);
        System.setOut(new PrintStream(loggerOutputStream));
    }


    @Override
    public Statement apply(Statement base, Description description) {
        testClass = description.getTestClass();
        return new Statement() {
            @Override
            public void evaluate() throws Throwable {
                try {
                    base.evaluate();
                }
                finally {
                    System.setIn(tmpIn);
                    System.setOut(tmpOut);
                }
            }
        };
    }

    public void assertOutput() {
        // Assert
        assertThat(new ByteArrayInputStream(loggerOutputStream.getLog().toByteArray()),
                containsSameLines(testClass.getResourceAsStream("output/output00.txt")));
    }

}
{% endhighlight %}

Látható, hogy a `activate()` metódus menti le az eredeti `System.in` és `System.out`
értékeket.

Az `apply()` metódus delegálja a hívást a paraméterként átadott `Statement`-nek,
majd a finally-ágban visszacseréli a `System.in` és `System.out`
értékeket.

Az `assertOutput()` metódus összehasonlítja a standard kimenetre írt értékeket a
teszt fájl tartalmával.
