---
layout: post
title: Integrációs tesztelés Concordionnal
date: '2015-04-04T22:00:00.000+02:00'
author: István Viczián
---

Használt technológiák: Concordion 1.4.7

Míg a unit tesztelés egy kiforrott terület, tele eszközökkel,
legjobb gyakorlatokkal, mintákkal, addig az integrációs tesztelés esetén
még nem tapasztalhatunk hasonló egységességet.

Integrációs tesztnek nevezem azokat a teszteket, melyek nem egy-egy osztályt
tesztelnek, hanem lehetőleg egy üzleti értéket, a futtatásához csaknem a 
teljes alkalmazás elindul, mi több, a környezetével együtt, gondolok itt 
például a konténerre (legyen akár Spring context, vagy Java EE container),
vagy az adatbázisra (legtöbbször in memory adatbázissal).

Több problémám is van az ilyen típusú tesztekkel. Egyrészt nagyon nehezen
határozható meg a granularitása. Mit tesztelünk pontosan, mennyi teszt 
esettel, milyen ellenőrzéseket (assert) végzünk, stb. 

Ezen felül az ilyen
típusú tesztek kevésbé olvashatóak, arra koncentrálnak, hogy milyen inputra
milyen outputot várunk el, de azt nem mondja meg, hogy miért. Pont nemrég kellett
hozzányúlnom egy régi alkalmazáshoz, és az integrációs tesztek alapján nagyon
bonyolultan volt csak visszafejthető az üzleti logika.

Kézenfekvő lenne, hogy ezen tesztek pl. a felhasználói felületen keresztül
hajtsák meg az alkalmazást, de ennek nem vagyok híve, ugyanis nagyban függeni
kezd a UI technológiától, és a figyelem túlzottan a frontendre irányul, a 
tényleges üzleti tartalom helyett.

Ezek fejlesztői problémák, de nézzük egy kicsit távolabbról.

Gyakran tapasztalhatjuk egy projektnél, hogy a specifikáció (általánosabban a dokumentáció) és 
az implementáció különválik. Ez nem csak vízesés projektekre jellemző, agilis projektekben is
előfordul. Az is gyakori, hogy bármennyire is körültekintően tervezünk, bizonyos részletek
mégis az implementáció során kerülnek megvilágításra, illetve akkor születik valamiféle döntés.
Ilyen esetben, de ettől függetlenül is előfordul, hogy változik az implementáció, és azt
nem követi le a dokumentáció. Amennyiben a különböző dokumentációkat különböző 
emberek készítik (pl. üzleti elemző, tesztelő, fejlesztő), ezek nem lesznek feltétlen szinkronban.

Ezen problémák megoldására alakult ki a Specification By Example (SBE) módszer, melyről
[magyar nyelven](﻿http://beu.hu/blog/specification-by-example-a-modszertan/) is lehet olvasni, vagy
javaslom Gojko Adzic kiváló Specification by example: How successful teams deliver the right software 
könyvét a témában. Kicsit jobban tanulmányozva ezt a módszert felfedezhető, hogy eléggé összefonódnak
a manapság olyan divatos szoftverfejlesztési módszertanok, mint a TDD, ATTD, BDD, DDD.

Nem akarok ennek elméleti hátterébe belemenni, csupán néhány alapelvét szeretném kiemelni.
A Specification By Example használatával a csapat szoros együttműködéssel határozza meg az
üzleti cél alapján a scope-ot, és alkotja meg a specifikációt, méghozzá a funkciót
lefedő példákkal illusztrálva. A példákkal magyarázható a funkció, valamint 
a specifikációs hiányosságok is felfedhetőek. Ennek következő lépése, hogy ezeket a példákat automatizálni is kell,
ezáltal összekötésre kerül a specifikáció és az implementáció, és alakul ki egy un. "élő" dokumentáció,
mely mindenki számára érthető, konzisztens, az implementációval kapcsolatban lévő dokumentáció, melyet
újra és újra fel lehet használni.

Az elhangzottakon túl ennek további előnyei is vannak. Mivel a dokumentáció közösen kerül kialakításra,
a különböző területek tudása összegződik (pl. üzleti elemző, tesztelő, fejlesztő). Ezáltal
mindenki egy kicsit magáénak is érzi. Mi több, ezt a 
dokumentumot használhatja a megrendelő, vagy akár a support team is. Ez egész dokumentum
üzleti cél alapú, minden ettől független sallangot ki kell belőle irtani, elsődleges cél
az újrafelhasználhatóság. Pl. nem érdemes felhasználói felületre vonatkozó utalásokat
sem benne hagyni. Nagyon hasznos, ha egy projektbe új
emberek csatlakoznak, netalántán hosszabb szünet után kell a projekthez visszatérni,
újra felvenni a fonalat.

Az automatizálás miatt a módszer egyik kulcsfontosságú szereplője az eszköz. Többet fel lehet sorolni,
megemlíthető a Cucumber, FitNesse, JBehave és Concordion. Ezek közül most a Concordiont 
szeretném kiemelni. Ez egy nyílt forrású Java alapú keretrendszer kifejezetten a Specification by Example
támogatására. Azért tetszik, mert nagyon könnyen tanulható (pár parancs), pehelykönnyű eszköz, mellyel készített specifikációk,
pontosabban a benne szereplő példák integrációs tesztként akár IDE-ből, akár build folyamatból egyszerűen futtathatóak.
Nem kell benne kötött nyelvtant használni, szabad szöveget írhatunk html formában. Nem kavarja be a Java kódot,
nem kell a természetes nyelvi szöveget Java kódba injektálni (pl. annotációk segítségével). A kimenete szépen html-ben 
formázott természetes nyelvi szöveg.

Talán a legegyszerűbb, ha egy példán mutatom be, ráadásul egy elképzelt agilis team munkájába illesztve. A GitHubon 
már van egy [jtechlog-activiti](https://github.com/vicziani/jtechlog-activiti) projekt, mely az Activiti workflow
motort mutatja be, valamint olvasható róla [poszt](http://www.jtechlog.hu/2014/07/25/pehelysulyu-workflow-activitivel.html) is. Ez a projekt lett kiegészítve Concordion tesztekkel.

Első körben a csapat kiválaszt egy sztorit, és az üzleti elemző vezetésével definiálja a feladatot immár
html formátumban (`Workflow.html`).

	Amennyiben a felhasználó bead egy szabadságigényt, az megjelenik az 
	adminisztrátornak a feladatok között, mint jóváhagyandó szabadságigény. 

Következő körben főleg a tesztelő segítségével kialakításra kerül egy vagy több példa.

	Amennyiben egy felhasználó foo@example.org e-mail címmel szabadságigényt 
	ad fel, a jóváhagyandó szabadságigények száma 1, és az első jóváhagyandó 
	szabadságigény foo@example.org e-mail címmel szerepel.

Érdemes további részleteket, pontosításokat, alternatív eseteket is felsorolni, hogy ezekhez is később
lehessen specifikációkat rendelni.

	Mi van, ha nem kell jóváhagyni a szabadságigényt?
	Mi van, ha a szabadságigény jóváhagyásra kerül?

A következő körben a specifikációhoz hozzá kell tenni az állításokat, és az ellenőrzéseket (assert). Ez a html-ben
mint tagek jelennek meg. Ez főleg a fejlesztő feladata. Itt kell eldönteni, hogy milyen adatokat kell a specifikációban
megadni, és mik azok a részletek, melyek a sztori szempontjából lényegtelenek, és csak a Java kódban
specifikáljuk ezeket. Ennek az egyensúlynak a megtalálása talán a legnehezebb. A példánkban a következő
tageket helyezzük el.

{% highlight html %}
<html xmlns:concordion="http://www.concordion.org/2007/concordion">
<body>
<h1>Workflow</h1>

<p>Amennyiben a felhasználó bead egy szabadságigényt, az megjelenik az 
adminisztrátornak a feladatok között, mint jóváhagyandó 
szabadságigény.</p>

<div class="example">
	<h2>Példa</h2>

	<p>Amennyiben egy felhasználó 
	    <span concordion:execute="requestTimeOff(#TEXT)">foo@example.org</span> 
		e-mail címmel szabadságigényt ad fel, a jóváhagyandó 
		szabadságigények száma 
		<span concordion:assertEquals="numberOfTimeOffRequests()">1</span>,
	    és az első jóváhagyandó szabadságigény 
		<span concordion:assertEquals="mailOfFirstTimeOffRequest()">foo@example.org</span> 
		e-mail címmel szerepel.
	</p>
</div>

<ul>
	<li><a concordion:run="concordion" href="ShouldNotApprove.html">
		Mi van, ha nem kell jóváhagyni a szabadságigényt?</a></li>
	<li><a concordion:run="concordion" href="Approve.html">
		Mi van, ha a szabadságigény jóváhagyásra kerül?</a></li>
</ul>

</body>
</html>
{% endhighlight %}

Két taget használtunk. Az egyik a `concordion:execute`, mely a Java teszt esetben egy metódust hív meg.
Mi most egy paraméterrel deklaráltuk, ráadásul a paraméter a `span` tag tartalma, erre utal a `#TEXT` kulcsszó.
A specifikáció itt a `requestTimeOff` metódust hívja `foo@example.org` paraméterrel.
Természetesen lehetőség van változókat is deklarálni, ezeknek értéket adni, és ezeket használni a metódushívás
paramétereiként. A változók deklarálásához használható a `concordion:set` attribútum. Lehetőség van metódushívás
ciklusban hívására is, ekkor egy táblázatban kell megadni a paraméter értékeket.
 
A `concordion:assertEquals` attribútum pedig egy metódust hív, melynek visszatérési értékét hasonlítja össze
a tag tartalmával. A specifikációban a `numberOfTimeOffRequests` metódus kerül meghívásra, és ennek visszatérési
értékét hasonlítja össze 1-gyel. Majd a `mailOfFirstTimeOffRequest` metódust hívja, és visszatérési értékét hasonlítja
a `foo@example.org` szöveghez.

Ez után a csapat szétszéledhet, és a fejlesztő feladata a specifikációt támogató Java kód megírása. Először a 
Concordiont kell felvenni a projektbe, Maven esetén a következő `pom.xml` részlethez:

{% highlight xml %}
<dependency>
    <groupId>org.concordion</groupId>
    <artifactId>concordion</artifactId>
    <version>1.4.7</version>
    <scope>test</scope>
</dependency>
{% endhighlight %}

Majd a specifikációhoz tartozó Java teszt esetet kell implementálni.

{% highlight java %}
public class WorkflowTest extends ConcordionTest {

	public void requestTimeOff(String mail) {
	    when(workflowSupport.shouldApprove()).thenReturn(true);
	    TimeOffRequest request = 
			new TimeOffRequest(mail, new Date(), new Date());
	    workflow.requestTimeOff(request);
	}

	public int numberOfTimeOffRequests() {
	    return workflow.listTimeOffRequests().size();
	}

	public String mailOfFirstTimeOffRequest() {
	    return workflow.listTimeOffRequests().get(0).getMail();
	}
}
{% endhighlight %}

Látható, hogy gyakorlatilag csak a metódusokat kellett implementálni. A `requestTimeOff` metódus
tartalmaz pár beégetett paramétert is, mely a specifikáció szempontjából érdektelen (`new Date()`). Mivel nem egy teszt metódus van, hanem a teszt eset több jól meghatározott felelősségkörű metódusból áll, a tesztek jobb felépítésűek és olvashatóbbak. 

Normál esetben a futtatáshoz elegendő a teszt esetet a `@RunWith(ConcordionRunner.class)` annotációval ellátni. 
Mivel a példa Springet tartalmaz, melyhez a `@RunWith(SpringJUnit4ClassRunner.class)` annotáció is szükséges,
ezért egy trükköt kell alkalmazni. Az ősosztályban következő kódot kell elhelyezni:

{% highlight java %}
@Test
public void runSpecification() throws IOException {
    Concordion concordion = new ConcordionBuilder().build();

    ResultSummary resultSummary = concordion.process(this);
    System.out.print("Successes: " + resultSummary.getSuccessCount());
    System.out.print(", Failures: " + resultSummary.getFailureCount());
    if (resultSummary.hasExceptions()) {
        System.out.print(", Exceptions: " + 
			resultSummary.getExceptionCount());
    }
    System.out.print("\n");

    resultSummary.assertIsSatisfied(concordion);
}
{% endhighlight %}

Amikor a teszt eset után elkészítjük a funkciót a Test Driven Developmentnek megfelelően, majd a teszt
esetet lefuttatva a következő eredményt kapjuk:

	/tmp/concordion/jtechlog/activiti/concordion/Workflow.html
	Successes: 2, Failures: 0

A kigenerált html oldal helye a `concordion.output.dir` környezeti változóval adható meg, ez pl.
Continuous Integrationbe kötésnél hasznos.

A html a következőt tartalmazza:

![Concordion sikeres futás eredménye](/artifacts/posts/2015-04-04-concordion/concordion-success.png)

Látható, hogy azok az értékek, melyek sikeresen ellenőrizve lettek, zöld színnel kerültek kiemelésre.
A következő képen látható, hogy amennyiben a visszaadott érték nem egyezik az elvárttal, pirossal kerül
kiemelésre.

![Concordion sikertelen futás eredménye](/artifacts/posts/2015-04-04-concordion/concordion-failure.png)

Amennyiben nem egy értéket, hanem egy listát akarunk ellenőrizni, akkor az elvárt értékeket
egy táblázatban is meg lehet adni használva a `concordion:verifyRows` attribútumot.

Mit adhat ez az eszköz fejlesztői szempontból? Egyrészt a teljes csapat közös munkája miatt
egyfajta egységességet, kevesebb félreértést, hiszen a specifikáció, a példák közösen kerülnek megalkotásra.
Az egységes, élő dokumentációnál érdemes arra is koncentrálni, hogy azonos nevek, fogalmak kerüljenek 
felhasználásra, ezt segítheti egy fogalomszótár is. Az automata tesztek mellé akár lehet rögzíteni a manuális teszteket is, melyek mögött ugyan nincs Java kód, de a tesztelő egy helyen találja a teszt eseteket specifikálva,
és később akár automatizálni is lehet.

A legnehezebb annak megtalálása, hogy mennyi és milyen specifikációt érdemes írni. Nem érdemes túl sokat,
hiszen akkor egyre nehezebbé válik a karbantartása. Csak üzleti értékekhez, folyamatokhoz érdemes, hiszen pl. törzsadat karbantartó képernyő, vagy paraméterező képernyő önmagában nem hordoz értéket. De pl. az már hasznos, hogy ezen adatok, paraméterek milyen hatással vannak a rendszerre.

A példában is látható, hogy a funkció más specifikációkra is hivatkozásokat tartalmaz. Ez nagyon hasznos, hogy egy specifikáció csak a lényegre koncentrál, de további linkeket tartalmaz, így vezetve az olvasót további információkhoz. Mi több, ezek sikeres futtatását is jelzi, méghozzá a link zöld hátterével.

Összehasonlításképpen idemásolom ugyanezen funkcióra írt klasszikus integrációs teszt esetet is. Látható, hogy ez egy üzleti elemző, tesztelő számára kevésbé hasznos, és egy bonyolultabbat akár egy fejlesztő is nehezebben fejt vissza.

{% highlight java %}
@Test
public void afterRequestTimeOffShouldListIt() {
    when(workflowSupport.shouldApprove()).thenReturn(true);
    TimeOffRequest request = new TimeOffRequest("foo@example.org", 
		new Date(), new Date());
    workflow.requestTimeOff(request);

    assertThat(workflow.listTimeOffRequests(), not(empty()));
    assertThat(workflow.listTimeOffRequests().iterator().next().getMail(),
		is(equalTo("foo@example.org")));
}
{% endhighlight %}
