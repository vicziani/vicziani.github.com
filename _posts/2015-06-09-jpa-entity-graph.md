---
layout: post
title: JPA Entity Graph
date: '2015-06-09T22:00:20.000+02:00'
author: István Viczián
---

Használt technológiák: EclipseLink 2.6.0, Hibernate 4.3.9.Final

Már két posztot is írtam arról, hogy hogyan lehet optimalizálni a JPA-ban az entitások betöltését.
Az egyik a [JPA lazy loading](/2012/04/22/jpa-lazy-loading.html) poszt volt, mely során megvizsgáltam,
hogy amennyiben két entitás kapcsolatban áll egymással, hogyan lehet betölteni a kapcsolódó entitásokat. Különösen úgy, hogy ez még hatékony is legyen, tehát a legkevesebb lekérdezés fusson le. Alapértelmezett működés során gyakran belefuthatunk az un. N + 1 lekérdezés problémába, ami pont az, amit a neve is mutat. Amennyiben van egy entitásunk, és hozzá tartozó N kapcsolódó entitás, ezek lazy betöltéssel definiálva, akkor azt láthatjuk, hogy N + 1 lekérdezés fut le. Erre adott egyik provider független megoldás a join fetch használata. Másik posztban azt az esetet vizsgálom, mikor egy entitáshoz több entitás is kapcsolódik 1:n kapcsolattal, és könnyen Descartes-szorzatba futhatunk. Ennek a posztnak a címe a [JPA több one-to-many kapcsolat](/2013/03/17/jpa-tobb-one-to-many-kapcsolat.html).

Az alapvető probléma a join fetch használatával, hogy a JPA lekérdezésbe kell írni. Ennek nagyrészt az az eredménye, hogy van egy entitáshoz több lekérdező DAO metódusunk, mely mindegyik külön adatkört ránt be. Így kapunk olyan metódusneveket, hogy `listEmployees`, `listEmployeesWithPhones`, `listEmployeesWithAddresses`, stb. Itt mindig az `Employee` entitást töltjük be, de hozzá más entitásokat is. A lekérdezések is különbözőek.

Persze voltak provider függő megoldások, melyekkel ezeket kissé dinamikusabban lehetett megadni. Ilyen a [Hibernate Fetch profiles](https://docs.jboss.org/hibernate/core/4.3/manual/en-US/html/ch20.html#performance-fetching-profiles), vagy az [EclipseLink Fetch groups](http://www.eclipse.org/eclipselink/documentation/2.6/concepts/descriptors002.htm#CHEJJCCG).

Szerencsére a JPA 2.1 megjelenésével egy szabványos eljárás is született, melynek neve JPA Entity Graphs. Az Entity Graph azt definiálja, hogy egy entitás betöltésekor mely attribútumait, valamint mely hozzá tartozó egyéb entitásokat kell betölteni. Előnye, hogy ez több mélységben is megadható, tehát egy teljes gráfot lehet így leírni. Részletesen olvashatunk róla a specifikációban ([JSR 338](https://jcp.org/en/jsr/detail?id=338)), de a The Java EE Tutorialba is bekerült a [Creating Fetch Plans with Entity Graphs](https://docs.oracle.com/javaee/7/tutorial/persistence-entitygraphs.htm#BABIJIAC) fejezettel.

Két módszerrel lehet ezt a gráfot megadni. Egyrészt statikus módon annotációk használatával (, és persze ennek megfelelően XML descriptorban is), de megadható programozott módon az `EntityGraph` API használatával is. Egy entitáshoz tartozó default entity graph az entitás összes olyan mezője, mely `FetchType.EAGER` típusú, akár explicit, akár implicit módon. A gráfot ezután a `find` műveletnél, valamint a lekérdezésekkor használhatjuk. A lekérdezésekkor két féle hintet adhatunk meg, melyek nevei `javax.persistence.fetchgraph` és `javax.persistence.loadgraph`. Míg a fetchgraph nem veszi figyelembe az entitás default entity graph-ját és csak a gráfban megadott attribútumokat tölti be, addig a loadgraph betölti a gráfban megadott és a default entity graph-ban lévő mezőket is.

Ámbár az entity graph-fal megadhatjuk azokat az attribútumokat, melyeket a persistence providernek kötelező betöltenie, az dönthet úgy, hogy további mezőket is betölt. Egy entitás id és version attribútumai mindig betöltésre kerülnek.

A poszthoz nem írtam külön példaprogramot, hanem az előző posztokban használt példaprogramokat használtam, melyek elérhetők a GitHubon, a [jtechlog-lazy](https://github.com/vicziani/jtechlog-lazy) és a [jtechlog-jpa-descartes](https://github.com/vicziani/jtechlog-jpa-descartes) projekteket kell keresni. Mindkét régebbi posztot frissítettem, és mindkét projektben áttértem az EclipseLink és Hibernate jelenlegi legfrissebb verzióira. Az Entity Graph kódrészletek commentezve szerepelnek.

Először nézzük meg a konfigurációt annotációkkal. Adott az `Employee` entitás, hozzá a `Phone` entitás, a `phones` mezővel, `@OneToMany` annotációval ellátva. A hozzá tartozó annotáció:

{% highlight java %}
@NamedEntityGraph(name = "graph.Employee.phones",
    attributeNodes = @NamedAttributeNode("phones"),
    subgraphs = {
        @NamedSubgraph(name = "phones",
            attributeNodes = {@NamedAttributeNode("type")})
})
{% endhighlight %}

Ezt a `find` metódus esetén a következőképp tudjuk használni.

{% highlight java %}
Map hints = new HashMap();
hints.put("javax.persistence.fetchgraph",
    em.getEntityGraph("graph.Employee.phones"));
return em.find(Employee.class, id, hints);
{% endhighlight %}

EclipseLink esetén azonnal kivételt kaptam.

	Exception [EclipseLink-6114] (Eclipse Persistence Services - 2.6.0.v20150309-bf26070): org.eclipse.persistence.exceptions.QueryException
	Exception Description: You must define a fetch group manager at descriptor (jtechlog.lazy.service.Employee) in order to set a fetch group on the query (readEmployee)
	Query: ReadObjectQuery(name="readEmployee" referenceClass=Employee sql="SELECT ID, CV, EMP_NAME FROM EMPLOYEE WHERE (ID = ?)")
	FetchGroup(graph.Employee.phones){phones => {} => {}}
		at org.eclipse.persistence.exceptions.QueryException.fetchGroupValidOnlyIfFetchGroupManagerInDescriptor(QueryException.java:1305)

Mint kiderült, kizárólag akkor volt hajlandó működni, ha lefuttattam a weavinget. Ráadásul az erre való Maven plugint is le kellett cserélnem a `de.empulse.eclipselink:staticweave-maven-plugin` pluginra, mert az új verzió már csak ezzel működik.

Az EclipseLink a `javax.persistence.fetchgraph` hatására a következő három lekérdezést futtatta le:

{% highlight java %}
SELECT ID FROM EMPLOYEE WHERE (ID = ?)
SELECT ID, PHONE_NUMBER, PHONE_TYPE, EMPLOYEE_ID FROM PHONE
    WHERE (EMPLOYEE_ID = ?)
SELECT ID, EMP_NAME FROM EMPLOYEE WHERE (ID = ?)
{% endhighlight %}

Az EclipseLink a `javax.persistence.loadgraph` hatására a következő két lekérdezést:

{% highlight java %}
SELECT ID, EMP_NAME FROM EMPLOYEE WHERE (ID = ?)
SELECT ID, PHONE_NUMBER, PHONE_TYPE, EMPLOYEE_ID FROM PHONE
    WHERE (EMPLOYEE_ID = ?)
{% endhighlight %}

Figyeljük meg, hogy join műveletet nem használ, legalább két lekérdezést futtat. Ami viszont pozitív, hogy az `Employee` osztály `cv` attribútumát nem kérdezi le, mikor `@Basic(fetch = FetchType.LAZY)` annotációval láttam el. Az is látható, hogy habár a `Phone` osztálynál csak a `type` attribútumot adtam meg, mindig lekérdezte `number` attribútumhoz tartozó oszlopot is.

Hibernate esetében ekkor ugyanúgy egy outer joinos lekérdezés fut le, mint join fetch esetében. Az `Employee` osztály `cv` attribútumát hiába láttam el `@Basic(fetch = FetchType.LAZY)` annotációval, mindenképp betöltötte. A `Phone` osztálynál mindig betöltésre került a `type` és a `number` értéke is.

Programozottan a következőképp hozhatunk létre gráfot:

{% highlight java %}
EntityGraph<Employee> graph = em.createEntityGraph(Employee.class);
graph.addAttributeNodes("name");
Subgraph<Phone> subgraph = graph.addSubgraph("phones", Phone.class);
subgraph.addAttributeNodes("type");
List<Employee> employees =
    em.createNamedQuery("listEmployees", Employee.class)
        .setHint("javax.persistence.fetchgraph", graph)
        .getResultList();
{% endhighlight %}

EclipseLink esetén két `Employee`, és hozzá tartozó két-két `Phone` esetén a következő indokolatlan számú SQL fut le:

{% highlight sql %}
SELECT ID, EMP_NAME FROM EMPLOYEE
SELECT ID FROM PHONE WHERE (EMPLOYEE_ID = ?)
SELECT ID FROM PHONE WHERE (EMPLOYEE_ID = ?)
SELECT ID, PHONE_NUMBER, PHONE_TYPE, EMPLOYEE_ID FROM PHONE WHERE (ID = ?)
SELECT ID, EMP_NAME FROM EMPLOYEE WHERE (ID = ?)
SELECT ID, PHONE_NUMBER, PHONE_TYPE, EMPLOYEE_ID FROM PHONE WHERE (ID = ?)
SELECT ID, PHONE_NUMBER, PHONE_TYPE, EMPLOYEE_ID FROM PHONE WHERE (ID = ?)
SELECT ID, EMP_NAME FROM EMPLOYEE WHERE (ID = ?)
SELECT ID, PHONE_NUMBER, PHONE_TYPE, EMPLOYEE_ID FROM PHONE WHERE (ID = ?)
{% endhighlight %}

A `javax.persistence.loadgraph` hatására kicsit jobb a helyzet.

{% highlight sql %}
SELECT ID, EMP_NAME FROM EMPLOYEE
SELECT ID, PHONE_NUMBER, PHONE_TYPE, EMPLOYEE_ID FROM PHONE
    WHERE (EMPLOYEE_ID = ?)
SELECT ID, PHONE_NUMBER, PHONE_TYPE, EMPLOYEE_ID FROM PHONE
    WHERE (EMPLOYEE_ID = ?)
{% endhighlight %}

Mivel nincs join, `distinct` kulcsszót sem kell alkalmaznunk a lekérdezésben. Az `Employee` osztály `cv` attribútumát sem tölti be. A `Phone` osztálynál mindig betöltésre került a `type` és a `number` értéke is.

Hibernate esetében ugyanúgy egy outer joinos lekérdezés fut le, mintha join fetch-t alkalmaztunk volna. Furcsasága, hogy a `distinct` kulcsszót ugyanúgy ki kell írni, különben ugyanazt az entitást többször adja vissza. A `Phone` osztálynál mindig betöltésre került a `type` és a `number` értéke is.

	select distinct e from Employee e

Végül a [jtechlog-jpa-descartes](https://github.com/vicziani/jtechlog-jpa-descartes) projekten próbálkoztam. Itt az a trükk, hogy az `Employee` entitásnak két `@OneToMany` kapcsolata van, egy `Address` és egy `Phone` entitás felé. Az Entity Graph viszonylag egyszerű lett:

{% highlight java %}
@NamedEntityGraph(name = "graph.Employee.phonesAndAddresses",
        attributeNodes = {@NamedAttributeNode("phones"),
            @NamedAttributeNode("addresses")})
{% endhighlight %}

Sajnos a Hibernate itt is egy lekérdezést adott ki, két join művelettel, meg is lett az eredménye, a Descartes-szorzat, a teszt elbukott. Így itt is azt a trükköt kell alkalmazni, hogy két lekérdezést kell kiadnunk.

2013 decemberében született egy blogposzt [JPA 2.1 Entity Graphs: We’re getting close!](https://javaeeblog.wordpress.com/2013/12/06/jpa-2-1-entity-graphs-were-getting-close/), mely szintén talált pár hibát mindkét implementációban. Írt egy pár teszt esetet is, elérhető a GitHubon [jpa-entitygraph-test](https://github.com/dirkweil/jpa-entitygraph-test) néven. A 19 tesztesetből EclipseLink esetén 4, Hibernate esetén 2 bukik. A helyzet azóta sem változott, hiába emeltem a verziókat mindkét providerből a legfrissebbre.

Összegezve elmondható, hogy a JPA Entity Graph egy jó ötlet, a megvalósítása mindkét nagyobb provider esetén kisebb-nagyobb kivetnivalókat hagy maga után. Alapvetően ugyan betöltik azt, amire szükség van, de korántsem azon a módon, ahogy számítanánk rá. Emiatt mindenképp javaslom, hogy ellenőrizzük a háttérben kiadott SQL lekérdezéseket, és a visszaadott entitások számosságát.
