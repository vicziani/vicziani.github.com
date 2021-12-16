---
layout: post
title: Pehelysúlyú workflow Activitivel
date: '2014-07-26T01:36:00.000+02:00'
author: István Viczián
tags:
- open source
- Library
- Módszertan
- Workflow
- Spring
modified_time: '2018-02-11T21:04:00.652+01:00'
---

Használt technológiák: Activiti 5.15.1

Ismét egy olyan 3rd party library kerül terítékre, mellyel kapcsolatban
szkeptikus voltam. A nagy SOA divat tetőpontján a workflow engine
fogalma számomra egyet jelentett egy külön infrastruktúrán külön
alkalmazásként futó, nehézsúlyú, nehezen fejleszthető, üzemeltethető és
használható eszközzel. Főleg dedikált alkalmazásszervereken futó BPEL
engine-t használtunk, melyre a fejlesztés BPEL nyelven történt,
általában valami modellező eszközben. Akkor még nem gondoltam, hogy
másképp is lehet csinálni.

Ezzel szemben az Activiti egy pehelysúlyú, az alkalmazás memóriájában
embedded módon is futtatható workflow engine, mely a BPMN 2 standard
workflow leíró nyelvet képes értelmezni. Nyílt forráskódú, könnyen
integrálható a Spring keretrendszerrel. Kompatibilis a H2 in-memory
módban is futtatható adatbázissal, ez is egy oka annak, hogy nagyszerűen
integrációs tesztelhető. Bekapcsolható az audit naplózás, könnyen lehet
a historikus adatokat kezelni. Nagyon jó
[dokumentációval](http://activiti.org/userguide/index.html) rendelkezik,
és teszt esetekkel is le van fedve. Sőt, már több könyv is megjelent
róla, pl. az [Activiti in
Action](http://www.amazon.com/Activiti-Action-Executable-business-processes/dp/1617290122)

A BPMN 2 egy XML alapú, az OMG szervezet által karbantartott,
technológiától független modellező nyelv, üzleti folyamatok
modellezésére, mely kifejezetten alkalmas grafikus ábrázolásra. (Hiszen
egy irányított gráfról beszélünk.) Standard, tehát akár különböző
motorok is képesek végrehajtani, de kiterjeszthető, ahogy ezt
valamennyire az Activiti is teszi. Nem csak fejlesztők, de üzleti
elemzők számára is értelmezhető és használható. Folyamatábra alapú,
alapvetően taskokból (activity-kből) áll, melyek egymásutániságát lehet
definiálni. Különböző taskok lehetnek, pl. human task, Java komponenst,
webszolgáltatást, szabálymotort, szkriptet hívó task, e-mail küldés,
stb. Lehetőség van különböző vezérlőelemek megadására, mint elágazás,
párhuzamos végrehajtás, stb. Lehet benne különböző eseményeket
definiálni, melyekkel pl. megoldható az ütemezett végrehajtás,
hibakezelés. Lehet beágyazott munkafolyamatokat definiálni, mely
munkafolyamat részletek így újrafelhasználhatóak.

Egy kicsit a történeti hátterét is érdemes megismerni. A JBossnál
fejlesztették a jBPM motort. Először ezzel kezdtem el ismerkedni, de
számomra szegényes volt a dokumentációja, és a Spring integráció sem
sikerült azonnal. Ekkor kerestem egy másik motort, és így találtam az
Activitire. Mint később kiderült, a jBPM fejlesztői jöttek el a JBosstól
és az ott szerzett tapasztalatok alapján kezdték el fejleszteni az
Activitit (amúgy főleg az Alfresco támogatásával). Azóta egy kisebb
vihar is kialakult körülötte, a Camunda cég, mely BPMN szolgáltatásokat
nyújtott, és fejlesztői kontributáltak rendesen az Activitibe, fogták
magukat, és minden indok nélkül elforkoltak, és megalapították a szintén
nyílt forráskódú Camunda Process Engine-t, melyet többen [nem néztek jó
szemmel](http://www.jorambarrez.be/blog/2013/03/18/a-sad-day-for-open-source-camunda-decides-to-fork-activiti/).

Az ezzel kapcsolatos tapasztalataimról a [2012 szeptemberi
JUM-on](http://wiki.javaforum.hu/display/JAVAFORUM/JUM1209) előadást is
tartottam, melyről [videó](https://www.youtube.com/watch?v=66FavTUB7AM)
is készült, és a diái is
[letölthetőek](http://www.jtechlog.hu/artifacts/2012-09_workflow.pdf).

A poszthoz szokás szerint [példaprojektet is találsz a
GitHub-on](https://github.com/vicziani/jtechlog-activiti). Egy egyszerű
munkafolyamatot implementáltam, mely során egy szabadságigényt kell
jóváhagyni. Ezt először ábrázoljuk UML activity diagramon.

![Activity diagram](/artifacts/posts/2014-07-26-pehelysulyu-workflow-activitivel/activity_diagram_1.png)

A workflow motorral járó kockázatokat úgy próbáltam csökkenteni, hogy a
vele kapcsolatos műveleteket egy interfész mögé próbáltam elrejteni,
hogy az implementáció később bármikor cserélhető legyen, akár később
natívan, Javaban is le tudjam programozni. Szerencsére erre nem került
sor, azonban az architektúra tisztasága miatt ez a döntés később is
jónak bizonyult.

<a href="/artifacts/posts/2014-07-26-pehelysulyu-workflow-activitivel/class_diagram_1.png" data-lightbox="post-images">
![Class diagram](/artifacts/posts/2014-07-26-pehelysulyu-workflow-activitivel/class_diagram_1_600.png)
</a>

A példa projekten is tehát definiáltam egy `TimeOffRequest` osztályt,
mely a jóváhagyandó szabadság kérelmet reprezentálja, valamint egy
`Workflow` interfészt. A `requestTimeOff` elindítja a workflow-t, a
`listTimeOffRequests` metódus az éppen futó workflow-kat listázza ki,
míg a `approve` metódus pedig a jóváhagyást végzi el. Nézzük hát ennek
az implementációját.

Először rajzoljuk meg a workflow-t. Ehhez az Activiti Eclipse Designert
kell használnunk. Ez gyakorlatilag egy egyszerűen telepíthető Eclipse
plugin. Feltelepítése után New Activiti Diagram. Látható, hogy a
diagramon egy start event, egy end event, és köztük egy user task. (Egy
egyszerű IDEA plugin is létezik már.)

<a href="/artifacts/posts/2014-07-26-pehelysulyu-workflow-activitivel/activiti_eclipse_designer.png" data-lightbox="post-images">
  ![Activiti Eclipse Designer](/artifacts/posts/2014-07-26-pehelysulyu-workflow-activitivel/activiti_eclipse_designer_600.png)
</a>

Ennek XML ábrázolása is nagyon egyszerű, semmi rémisztő nincs benne,
akár kézzel is szerkeszthető.

{% highlight xml %}
<definitions>
  <process id="timeoffrequest" name="Time off request" isExecutable="true">
    <startEvent id="startevent" name="Start"></startEvent>
    <endEvent id="endevent" name="End"></endEvent>
    <userTask id="approve" name="Approve"></userTask>
    <sequenceFlow id="flow1" sourceRef="startevent" targetRef="approve">
    </sequenceFlow>
    <sequenceFlow id="flow2" sourceRef="approve" targetRef="endevent">
    </sequenceFlow>
  </process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_timeoffrequest">
    <!-- Itt van a diagram grafikus leírása, az alakzatok
         koordinátáival. -->
  </bpmndi:BPMNDiagram>
</definitions>
{% endhighlight %}

Ha ez megvan, akkor ezt tegyük a classpath-ra, hogy egyszerű legyen
betölteni. A következő lépés az Activiti függőség deklarálása a
`pom.xml`-ben, szerencsére fenn van a central repository-ban.

{% highlight xml %}
<dependency>
    <groupId>org.activiti</groupId>
    <artifactId>activiti-spring</artifactId>
    <version>5.15.1</version>
</dependency>
{% endhighlight %}

Amennyiben Springben deklarálva van `dataSource` és
`transactionManager`, definiálhatjuk az ún. *process engine*-t.

{% highlight xml %}
<bean id="processEngineConfiguration"
        class="org.activiti.spring.SpringProcessEngineConfiguration">
    <property name="dataSource" ref="dataSource" />
    <property name="transactionManager" ref="transactionManager" />
    <property name="databaseSchemaUpdate" value="true" />
</bean>

<bean id="processEngine"
        class="org.activiti.spring.ProcessEngineFactoryBean">
    <property name="processEngineConfiguration"
            ref="processEngineConfiguration" />
</bean>
{% endhighlight %}

Azt is beállítjuk, hogy a tábláit maga hozza létre. Itt lehetne megadni
a deploy-olandó workflow-t, azonban egy trükk miatt nem itt teszem.
Ugyanis integrációs teszteket akarok futtatni, és akkor szeretném mindig
újrainicializálni az Activiti-t. Ezt a legegyszerűbben úgy tehetem, hogy
mindig kitörlöm a *workflow definitiont*, és cascade módban törli a
hozzá tartozó *process instance*-eket, majd újra deploy-olom a
definitiont.

Az Activiti API használatához definiálni kell egy csomó service-t. Pl. a
`repositoryService` felelős a workflow definitionök karbantartásáért, a
`runtimeService` segítségével lehet pl. process instance-t indítani, és
a `taskService` segítségével lehet lekérdezni az elvégzendő feladatokat.
Van még egy pár, úgymint `managementService`, `identityService`,
`historyService` és `FormService`.

![Activity API](http://activiti.org/userguide/images/api.services.png)

Definiáljuk tehát őket.

{% highlight xml %}
<bean id="repositoryService" factory-bean="processEngine"
        factory-method="getRepositoryService" />
<bean id="runtimeService" factory-bean="processEngine"
        factory-method="getRuntimeService" />
<bean id="taskService" factory-bean="processEngine"
        factory-method="getTaskService" />
{% endhighlight %}

Implementáljuk tehát a metódusokat. A `requestTimeOff` indít egy új
process instance-t. Érdekessége, hogy lehet neki megadni ún.
paramétereket, melyeket lement. (Komplex objektumok esetén blobba az
adatbázisba, szerializálva, ezért ezt nem is javaslom, elégedjünk meg az
egyszerű típusokkal.)

{% highlight java %}
public void requestTimeOff(TimeOffRequest timeOffRequest) {
    Map<String, Object> parameters = new HashMap<>();
    parameters.put(PROCESS_VARIABLE_TIME_OFF_REQUEST, timeOffRequest);
    runtimeService.startProcessInstanceByKey(DEPLOYMENT_NAME,
        timeOffRequest.getId(), parameters);
}
{% endhighlight %}

A feladatok lekérdezése nagyon egyszerű. Látható, hogy az Activiti a
lekérdezésre fluent API-t bocsájt a rendelkezésünkre. A trükk az, hogy
lekérdezzük a feladatokat, és a feladatokhoz tartozó process
instance-okban futó ún. *process variable*-öket is.

{% highlight java %}
public List<TimeOffRequest> listTimeOffRequests() {
    List<TimeOffRequest> requests = new ArrayList<>();
    List<Task> tasks = taskService.createTaskQuery()
        .orderByTaskCreateTime().includeProcessVariables()
        .desc().list();
    for (Task task: tasks) {
        requests.add((TimeOffRequest) task.getProcessVariables()
            .get(PROCESS_VARIABLE_TIME_OFF_REQUEST));
    }
    return requests;
}
{% endhighlight %}

A jóváhagyás a `taskService` `complete` metódusával történik. Minden
egyes process instance-nak kell egy egyedi azonosítót adni, amivel
később hivatkozhatunk rá. Most én az e-mail cím, és a kezdő dátumot
adtam. Mindenképpen érdemes valami olvashatót választani, és nem egy
generált számot.

{% highlight java %}
public void approve(TimeOffRequest timeOffRequest) {
    List<Task> tasks = taskService.createTaskQuery()
        .processInstanceBusinessKey(timeOffRequest.getId()).list();
    taskService.complete(tasks.iterator().next().getId());
}
{% endhighlight %}

Ezt lehet két lépésben is csinálni, mikor a feladatot először a
felhasználó magához rendeli (`claim`), dolgozik rajta, és csak később
fejezi be. Ekkor más már nem tudja a feladatot magához rendelni.

Nézzük, hogy a teszteléskor hogyan adjuk meg a deploy-olandó BPMN 2.0
fájlt.

{% highlight java %}
private void deploy() {
    repositoryService.createDeployment()
        .name("timeoffrequest")
        .addInputStream("timeoff.bpmn", WorkflowIntegrationTest.class
        .getResourceAsStream("/timeoff.bpmn"))
        .deploy();
}
{% endhighlight %}

Utána nincs más dolgunk, mint az interfészünkön keresztül tesztelni a
folyamatunkat. A példa érdekessége, hogy nem is használtunk saját
entitást, hanem a szükséges adatokat a process instance-ben tároltuk.
Persze érdemes saját entitásokat használni, és itt csak az id-kat
tárolni.

Most bonyolítsuk annyival a feladatot, hogy ne csak mi hívjuk a
workflow-t, hanem a workflow is hívjon ki. Pl. a szabadság jóváhagyása
nem minden esetben szükséges, amennyiben kellően távol van,
automatikusan jóváhagyásra kerül. Ezzel egy elágazást is teszünk azonnal
a workflow-ba. A feltételt egy Java metódusban implementáljuk.
Tapasztalat szerint az is jó rossz irány, hogy azokat a műveleteket is,
melyeket a workflow hív, kitenni egy külön interfészbe, így jól
mockolható is. Valamint érdemes egy darab ilyen interfészt kialakítani,
a Facade tervezési mintának megfelelően.

<a href="/artifacts/posts/2014-07-26-pehelysulyu-workflow-activitivel/timeoff_2.png" data-lightbox="post-images">
  ![Activiti Eclipse Designer](/artifacts/posts/2014-07-26-pehelysulyu-workflow-activitivel/timeoff_2_600.png)
</a>


Legyen ez pl. a `WorkflowSupport` interfész, benne a `shouldApprove`
metódussal.

A BPMN állományba egy *service taskot* kell tenni, ahol expressionnek
megadható a hívás.

{% highlight xml %}
#{workflowSupport.shouldApprove()}
{% endhighlight %}

Ekkor a Spring application contextben lévő `workflowSupport` bean
`shouldApprove()` metódusát fogja meghívni. Ha van visszatérési értéke,
megadható, hogy milyen változóba tegye, legyen ez a
`shouldApproveResult`. Az elágazás egy *exclusive gateway*, melyből
kivezető élnek a következő feltételt adhatjuk meg:

{% highlight xml %}
${!shouldApproveResult}
{% endhighlight %}

Az Activiti ennél sokkal többet tud, pl. felhasználókezelés, teljeskörű
audit naplózás, listenerek kezelése (, melyek különböző workflow
eseményeket figyelnek), egyszerű űrlapok definiálása, e-mail küldés,
stb., melyek alkalmassá teszik egy teljes értékű workflow motornak.

Összességében elmondható, hogy az Activiti egy pehelysúlyú, nagyon
könnyen használható, és a Springhez nagyon jól illeszthető workflow
engine. Annyit azonban meg kell jegyezni, hogy az üzleti folyamatok
ilyen fajta ábrázolása egy kötöttséget ad, nincs akkora szabadságunk,
mintha csak státuszokat állítgatnánk. Ebből következik, hogy nem annyira
egyszerű a táblaszerkezete, így nem olyan könnyű adatbázisba hátulról
belenyúlni. Viszont egy folyamatosan naprakész dokumentációt kapunk az
üzleti folyamatokról, ami biztos, hogy nem avul el. Valamint biztosítja,
hogy ne legyenek elvarratlan szálak, nem maradhat ki *else* ág.

Ami még elég macerás, az a migráció. Az Activiti verziózva tárolja a
workflow definitionöket. Lehet új verziót deploy-olni, de minden process
instance azzal a verzióval fut végig, amivel elindult. Lehet migrálni,
de az nagyon fájdalmas, ha lehet, kerüljük azzal, hogy végigvisszük új
verzió kiadása előtt a process instance-eket.

Az Activiti Engine és Designer komponenseken kívül más komponensek is
vannak. Van pl. a Modeller, mellyel webes felületen tudjuk szerkeszteni
a workflow-kat. Van a Activiti Explorer, mely szintén webes, és workflow
definitionöket lehet deploy-olni, azokat futtatni, rendelkezik
valamiféle felhasználókezeléssel, és ad felületet a taskok kezelésére,
sőt grafikusan mutatja, hogy hol állnak a process instance-ek. Az
Activiti REST API-n keresztül is elérhető.

Azt még külön kiemelném, hogy bár a munkafolyamatok tervezéséhez nem
kell fejlesztői tudás, ez nem jelenti azt, hogy egyszerű. Teljesen
másképp kell gondolkodni, másképp kell az ügyféllel egyeztetni. Vannak
itt is legjobb gyakorlatok, érdemes konvenciókat alkalmazni. Egy külön
tudomány, melyhez rengeteg jó könyv is elérhető.
