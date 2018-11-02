---
layout: post
title: ! 'Spring Recipes: A Problem-Solution Approach'
date: '2010-07-27T00:38:00.007+02:00'
author: István Viczián
tags:
- Spring
- könyv
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Egyikőtök hívta fel a figyelmem a Spring Recipes: A Problem-Solution
Approach könyvre a [Spring In Action](/2010/05/28/spring-in-action.html)
könyvről szóló post-om után. Mivel a könyv a Spring In Action-höz képest
más megközelítést alkalmaz, és a Spring 2.5-t is lefedi szemben az
előzővel, kíváncsiságból elolvastam. Jelen post-omban próbálok azoknak
is csemegét nyújtani, akiket nem érdekel a könyvismertető, ezért
megpróbálom kérdés-felelet formájában ismertetni az érdekesebb részeket,
így mindenki ellenőrizheti kicsit a Spring-es tudását.

![Spring Recipes](/artifacts/posts/2010-07-27-spring-recipes/spring_recipes_cover_b.png)

A Spring Recipes könyv tematikája szinte teljesen megegyezik a Spring In
Action könyv tematikájával, a tartalmi különbségek főleg a a 2.5-ös
Spring verzió újdonságaiból adódnak, valamint a más megközelításből.
Ugyanis a könyv felépítése úgy néz ki, hogy minden részben felvet egy
problémát (Problem), aminek leírja a megoldását (Solution), valamint
leírja ábrákkal, kóddal illusztrálva, hogy hogyan is működik (How It
Works). Ebből adódik, hogy nem egy-két példát visz végig, mint a Spring
in Action könyv, hanem mindig újat vesz elő. Ezzel néha feleslegesen
telik a hely.

Szerintem nagyon hasznos, hogy az első fejezet a konténer,
interfészekkel való programozás, service locator, Inversion of Control,
Dependency Injection és a konténer konfigurációs állománnyal való
konfigurációját úgy mutatja be, hogy a Java SE eszközeivel (Spring
nélkül) le is programoz egy megoldást. Ez nagyon hasznos lehet azoknak,
akik nem az elméleti oldalról szeretnék megközelíteni ezen fogalmakat,
hanem látni akarnak egy működő példát, gyakorlatilag ebből kiderül, hogy
hogyan is indulhatott a Spring, mi is lehet a motorháztető alatt.

Következő fejezetben kitér a Spring IDE használatára is. Tapasztalatom
alapján a Spring IDE már nem nagyon érhető el, a [website-ja
is](http://springide.org/) áll, a SpringSource is a [SpringSource Tool
Suite](http://www.springsource.com/developer/sts) már ingyenesen
használható eszközét preferálja. Ki is próbáltam, de számomra olyan
minősíthetetlen lassú volt, hogy visszaálltam NetBeans-re.

A 2007 novemberében kiadott Spring 2.5 a következő újításokat hozta,
melyekre ki is tér a könyv.

-   Bean-ek konfigurációja annotációkkal, mint az @Autowired, vagy a
    JSR-250 által bevezetett @Resource, @PostConstruct, @PreDestroy
    annotációk.
-   Component scanning: stereotype annotációkkal jelölt bean-ek
    automatikus feltérképezése, konfigurációja.
-   AspectJ load-time weaving: AspectJ osztálybetöltés közben képes az
    osztályainkat buherálni, így elérhető, hogy nem a konténerben
    definiált bean-ekre is működjön az AOP, valamint a teljes AspectJ
    arzenált bevethessük.
-   Kontrollerek konfigurációja annotációkkal: talán a legnagyobb
    újdonság, mely a Spring MVC-t érinti. Már nem kell a kontrollereknek
    Spring-es Controller osztályokból leszármaznia, nem kell azok
    metódusait ismerni, hanem sokminden rugalmasan annotációkkal is
    megadható.
-   Spring TestContext framework: annotációk használata a teszt
    eseteknél, úgy, hogy akár el is szakadhatunk a konkrét teszt
    implementációktól.

Nézzük, hogy milyen kérdéseket válaszol meg ez a könyv, melyeket a
Spring In Action nem említett, a Spring alapelemeivel kapcsolatban:

Constructor Ambiguity, azaz hogyan lehet a túlterhelt (overload) konstruktorok közül kiválasztani a nekünk megfelelőt a konstruktor alapú dependency injection-nél?
:   Az applicationContext.xml-ben használhatjuk a constructor-arg
    tag-nek a type és index attribútumát, ahol az elsőnek lehet megadni
    a konstruktor típusát, másodiknak a pozícióját. Ezzel egyértelműen
    definiálható a konstruktor szignatúra, így nem esik a Spring abba a
    hibába, hogy a property editor-ok miatt nem tud választani a
    konstruktorok közül, hiszen mindre tudna konvertálni.

Hogyan állítható be, hogy ellenőrizze a Spring, hogy bizonyos attribútumainkra megtörtént-e a dependency injection (dependency-checking)?
:   Egyrészt bean szinten is beállíthatunk dependency-check attribútumot
    (none, simple, objects, all - egyszerű típusok - primitívek és
    Collection-ök - és objektumok tetszőleges kombinációjára). Másrészt
    használhatjuk a @Required annotációt.

Milyen annnotációkkal lehet a dependency injection-t kérni?
:   Vagy a Spring-es @Autowired vagy a JSR-250-es @Resource
    annotációval.

Mi van, ha egy interfész több implementációját is le akarjuk kérni, valamint lehet-e választani, hogy melyikre van szükségünk.
:   A típusnál megadhatunk interfész tömböt vagy collection-t is, ekkor
    az összes implementáló bean-t injektálni fogja a Spring. Amennyiben
    válogatni akarunk, egyrészt megtehetjük a @Qualifier annotációval,
    vagy a @Resource annotáció name attribútumával.

Szülő-gyerek bean-nél lehet-e egy collection elemeit a szülőnél és a gyermeknél is meghatározni?
:   Igen, lehetőség van a szülő bean-nél deklarált collection elemeinek
    merge-ölésére a gyermek bean-nél (merge="true" attribútum).

Lehet-e szabályozni, hogy a collection mely implementációja legyen példányosítva, valamint az elemeknek mi legyen a pontos típusa?
:   A kollekcióknál a type attribútummal adható meg a konkrét
    implementáció (pl. ha rendezettet akarunk, akkor egy SortedSet), az
    elemeknél a value-type-pal adható meg a típus. Amennyiben a bean
    implementációban generikust használunk, a konverzió automatikusan
    megtörténik.

Van-e a collection-ök megadására rövidebb mód?
:   A util sémát kell használni, mellyel rövidebben adhatóak meg az
    elemek, és a konfigurációs állomány is séma alapján validálható.

Állhat-e bean-ként önmagában egy collection?
:   A util sémát nem csak bean property-n belül használhatjuk, hanem
    bean szinten is, ekkor egy id attribútumot kell neki adni, amivel
    aztán a ref-ben hivatkozhatunk rá (un. stand-alone collection).

Hogyan adhatunk meg bean-eket annotációval?
:   A @Component annotációt használhatjuk, aminek attribútumként a bean
    nevét is megadhatjuk. Ahhoz, hogy a Spring fel is olvassa ezeket, a
    konfig állományban a context:component-scan tag-et kell használnunk.
    Különböző rétegeknek megfelelően használhatjuk a @Repository és
    @Service annotációkat is. A felolvasást filter-elhetjük is a
    minősített osztálynévre (FQN - fully qualified name - csomag és
    osztálynév), reguláris kifejezéssel.

Mivel lehet egy bean-t egy osztály statikus attibútuma alapján definiálni?
:   A FieldRetrievingFactoryBean osztályt használhatjuk.

Mivel lehet egy bean-t egy másik bean attibútuma alapján definiálni?
:   A PropertyPathFactoryBean osztályt használhatjuk.

Hogyan tölthetünk be egy külső erőforrást, állományt?
:   ResourceLoader-t alkalmazhatunk, melyre referenciát a
    ResourceLoaderAware interfész implementálásával kaphatunk, mely a
    Resource címe alapján különböző helyről töltheti be azt (pl.
    ClassPath, fájl, URL, stb.). Természetesen itt is működik a
    Dependency Injection is.

A Spring In Action könyv szerintem sokkal érthetőbben, nagyon jó ábrával
magyarázza el a bean-ek életciklusát, ezt hiányoltam ebből a könyvből.
Persze a Spring Recipes viszont ír a 2.5-ben megjelent @PostConstruct,
@PreDestroy annotációkról, melyekhez a annotation-config tag is kell a
konfig állományban. Valamint a script-elés is külön fejezetet kapott,
ahol megemlíti a lang sémát is.

Az AOP rész leírása, elméleti háttere is jobb a Spring In Action
könyvben, viszont nem hangsúlyozza eléggé, hogy hol a határ a régi,
Classic Spring AOP és az új, 2.x-ben használt AOP között. Persze
mindkettő mögött a JDK Dynamic Proxy van, melyet a Spring Recipes
szintén bemutat, első körben még Spring nélkül (naplózásra,
validálásra). Szépen kifejti, hogy az AspectJ használata a POJO-kon,
akár az xml konfiguráció, akár az annotációval végzett konfiguráció
(melyet mellesleg preferál az xml-lel szemben) még nem jelenti a teljes
AspectJ-s arzenált (pl. csak a konténerben definiált bean-ekre lehet
használni). Az AspectJ pointcut-okat deklaráló nyelvét is jobban leírja.
Ír az advice precedence-ről (Ordered interface, @Order annotáció).
Részletesen ír az introduction-ről is, tudunk futásidőben mellyel
interfészeket adni egy bean-hez, és implementálni azokat úgy, hogy
implementáló osztályokat adunk meg. Ennek hatása gyakorlatilag
megegyezik azzal, mintha többszörös öröklődésünk lenne. Az implementáló
osztály akár attribútumokat is tartalmazhat, ezeket state-nek nevezi.

Amennyiben az AspectJ többi részét is ki akarjuk használni, pl.
AspectJ-s aspect-ek, additional pointcut types, konténeren kívüli
bean-ek AOP-ozása, Load-Time Weaving-et kell alkalmaznunk. Ehhez a
context:load-time-weaver tag használata szükséges az xml
konfigurációban, valamint a -javaagent kapcsoló a JDK-nak.

Egy nagyon gyakorlatias fejezet azt mutatja be, hogy mit kell tennünk,
ha Domain Driven Design alapján pl. Domain Object-be akarunk Dependency
Injection-t. (Ugye itt az a probléma, hogy nincs a konténerben a
példányunk.) Ekkor kell a context:spring-configured tag az xml
konfigurációban, valamint a @Configurable annotáció.

Az adatbázis kezelést bemutató részben nem sok különbség van, a Spring
Recipes annyiban több, hogy leírja a PreparedStatementCreator,
(Batch)PreparedStatementSetter interfészek használatát, valamint a
operation object-ek kezelését, valamint egy gyakorlatias példát hoz
arra, hogy hogy hozzunk létre saját kivételt egy adatbázis specifikus
hibához. Nagy hibája, hogy nem ír a pool-ozásról, míg a Spring In Action
szépen leírja az Ehcache konfigurációját (később ez a könyv is megemlíti
a Security részben). A Spring In Action elméleti háttere a
tranzakciókezelésnél szintén jobb, de a Spring Recipes az izolációs
szintekre kódot mutat, amivel jobban megérthető. Itt is megemlíti a
Load-Time Weaving-et (tranzakciókezelés nem publikus metódusokban, nem a
konténerben lévő bean-ekben).

A Spring MVC fejezetben a Spring In Action megint jobb alapozást ad,
szépen felsorolja az összes interceptor-t. A Spring Recipes ezzel
szemben saját interceptor megvalósítását is leírja (HandlerInterceptor),
valamint leírja, hogyan választja ki a Spring MVC a Locale-t
(LocaleResolver), és hogyan lehet Locale-t váltani
(LocaleChangeInterceptor) nemzetköziesített alkalmazásoknál. Ír a
HandlerExceptionResolver-ről a kivéltelek kezelésére, valamint a
ParameterizableViewController-ről, ahol nem kell a view neveit a
Controller-be égetnünk. Nagy piros pont, hogy leírja, hogy kell a
Post/Redirect/Get Design Pattern-t alkalmazni. Írja, hogy hogyan
használjuk a MultiActionController-t, ha egy Controller-be több
műveletet akarunk lekezelni (pl CRUD alkalmazásnál a különböző
képernyők, vagy egy form-on több gomb). Viszont a Spring beépített
validációján kívül nem ír sem a 3rd party commons, sem a valang
validációról. Viszont részletesen ír a Spring 2.5 újdonságáról az
annotációkkal való Controller fejlesztésről, valamint nekem új volt a
SessionStatus is.

A Spring In Action viszont említi a következő témákat, amikről a Spring
Recipes nem ír: Tiles, Velocity, Freemarker integráció, RSS tartalom
gyártása, Struts2, Tapestry integráció.

A Spring In Action a tesztelést csak függelékben említi, és az
annotációkat még csak egy külön projekttel, a Gienah Testing-gel
ismertette. A Spring Recipes részletezi a JUnit 3.x, 4.x és TestNG
tesztelést is (@RunWith(SpringJUnit4ClassRunner.class),
@ContextConfiguration). Külön megemlítendő a @IfProfileValue annotáció,
amivel profilokat tudunk deklarálni JUnit esetén is, hasonlóan a
TestNG-hez.

A Spring Security leírásánál ismerteti a saját névteret, saját
AccessDecisionVoter-t implementál az ip-cím ellenőrzésére, sőt az ACL-t
is részletesen kifejti. Persze nem a 3-asban bevezetett Expression
Language-t használja, hanem after invocation providers-eket.

A Spring Web Flow-nál részletezi a Spring Security integrációt, a
perzisztenciát és a JSF-fel való integrációt is, de nem szól a Struts
integrációról.

A Spring-WS-nél már ír az annotációkról, valamint hogy hogyan lehet
Marsheller-t váltani.

Az EJB integrációnál csupán a JNDI-ből való lekérést írja le. A Spring
In Action használja a PitchFork-ot, ami egy pehelysúlyú konténer, mely
implementálja az EJB IoC-t és interception-t.

JMS-nél szintén ismerteti a jms séma használatát. Viszont a Spring In
Action-ben nagyon érdekes rész volt a Lingo integráció, mellyel úgy
tudtunk metódust hívni, hogy alatta észrevétlenül JMS volt az átviteli
protokoll. Ez a Spring Recipes könyvben nem szerepel.

JMS esetén új tag a context:mbean-export a konfig xml-ben.

Levélküldésnél érdekes, hogy leírja, hogy kell belőni a JAMES Java-ban
írt mail szervert, valamint mime levelet is küld (nem sima szöveg, hanem
HTML tartalom - akár CSS-sel, képekkel).

Ütemezésnél leírja, hogy kell Task-ot, Quartz Job-ot hívni, de nem írja,
hogy kell egy egyszerű metódust hívni ütemezetten.

Összességében elmondható, hogy a Spring Recipes könyv már haladó Spring
fejlesztőknek szól inkább. Jobban referencia jellegű, és felépítéséből
adódóan gyakrabban leveszi az ember a polcról, ha valami problémába
ütközik. A Spring In Action ezzel szemben jobban elméleti jellegű,
segítségével megérthetjük, hogy a Spring fejlesztésben honnan indultak,
hogyan jutottak el egy-egy megoldásig, milyen döntések születtek közben,
stb. Inkább kezdőknek javaslom, vagy akit érdekel a mélyebb elméleti
áttekintés. A részletes leírások miatt tapasztalatlanabb programozónak
működő kódig eljutnia is egyszerűbb a Spring In Action használatával.

De itt van már a Spring 3, melyet a Spring Recipes könyv augusztusra
ígért második kiadása fog lefedni (ilyen izgalmas témaköröket ígér, mint
Spring Batch, jBPM integráció, Terracotta és GridGrain integráció,
Spring Roo, Grails Framework (és Groovy) integráció, REST web
szolgáltatások, OSGi használata Spring Dynamic Modules-szal és
SpringSource dm Server - ami közben beolvadt az [Eclipse
Virgo](http://www.eclipse.org/virgo) projektbe.)

És még [Spring
oktatás](http://mylearn.vmware.com/mgrReg/courses.cfm?ui=S2&a=det&id_course=68949)
is lesz augusztus 3-6 között Budapesten.
