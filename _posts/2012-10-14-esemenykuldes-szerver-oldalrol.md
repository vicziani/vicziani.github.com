---
layout: post
title: Eseményküldés szerver oldalról
date: '2012-10-14T23:54:00.001+02:00'
author: István Viczián
tags:
- Design Patterns
- Ajax
- Spring
modified_time: '2018-02-13T20:52:13.018+01:00'
---

Technológiák: Spring 3.1.1, DWR 3.0, Guava 13.0.1

Egy projektben olyan webes keretrendszert használtam, mely képes volt
szerver oldalról üzeneteket küldeni a kliens oldal felé. Ezt ugyan a
klasszikus http nem teszi lehetővé, hiszen az egy kérés-válasz alapú
kommunikációs mód, ahol mindig a kliens kérdez, azonban vannak kerülő
megoldások, melyekről később lesz szó. Az első probléma ugyanis nem itt,
hanem korábban jelentkezett, méghozzá hogyan lehet egy n-rétegű
alkalmazást felkészíteni erre a kommunikációs formára, anélkül, hogy
megzavarnánk az eddig kialakult architektúrát és szabályokat. A posztban
írok ennek a megoldásáról, de két Springes érdekesség is bemutatásra
kerül, a contextek hierarchiája, a beépített eseménykezelés, szó lesz a
Guava Event Busról is, valamint hogyan lehet [Direct Web
Remoting](http://directwebremoting.org/dwr/index.html) (DWR)
használatával a kliens oldalt értesíteni.

Az alapvető probléma az, hogy ez ellentmond a legtipikusabb esetnek,
mikor van egy webes komponensünk, mely behív az üzleti logikába. Középen
helyezkedik el ugyanis az üzleti logika réteg, és arra épül rá a webes
réteg. A webes réteg az üzleti logikát egy API-n keresztül éri el,
viszont jobb esetben erről az üzleti logika nem tud, ő csak az alatt
lévő réteget (perzisztens) réteget hívja. Itt viszont pont az
ellentettjére van szükségünk, mikor az üzleti logika hív ki a webes
rétegbe. Hogy is oldjuk fel az itt lévő ellentmondást?

Egy megoldás lehet az *Observer* tervezési minta használata. Gyakori
tervezési minta, főleg felhasználói felületeknél használatos, pl. ez
húzódik meg az (MVC) Model-View-Controller mögött is, valamint ismerős
lehet, ha már használtunk eseménykezelőket, listenereket. Az
alapprobléma, hogy van egy objektumunk, és annak állapotának változása
esetén egy másik objektumnak el kell valamit végeznie. Ez történhetne
úgy is, hogy az egyik objektum közvetlenül hívja a másik objektumot,
azonban ennek több hátránya is. Egyrészt szoros kapcsolat van a két
objektum között, melyet nem szeretünk, valamint amennyiben újabb és
újabb műveleteket kellene elvégeznünk, mindig bővítenünk kell a hívást
is. Erre megoldás az, hogy az érdekes állapot változással rendelkező
objektumot kinevezzük megfigyeltnek (*Observable*), és definiálunk egy
interfészt, melyeket a megfigyelők implementálnak (*Observer*). Az
Observable objektumon bármennyi Observer implementációt lehet
regisztrálni, és amennyiben bekövetkezik az állapotváltozás, az
végighívja az összes megfigyelőt. Ezzel megszüntettük a szoros
kapcsolatot, a plusz interfész bevezetésével, valamint bármennyi
megfigyelőt hozzáadhatunk anélkül, hogy a megfigyeltet módosítani kéne.

Természetesen jelen példánkban a megfigyelt az üzleti logika, és a
megfigyelő pedig a webes rétegben egy olyan komponens, mely a böngészőt
tudja értesíteni. Több megoldást is meg fogok mutatni, melyek közül az
igényeknek megfelelően lehet választani, és tetszőlegesen személyre
szabni.

Példaprogram is született, mely [itt elérhető a
GitHub-on.](https://github.com/vicziani/jtechlog-event) A következő
három példát lehet itt találni:

* `jtechlog-event-eo`: `java.util.EventObject` használatával
* `jtechlog-event-ae`: Spring `ApplicationEvent` küldése
* `jtechlog-event-geb`: Guava Event Busszal

Mindhárom példa Maven-nel buildelhető, és a letöltést követően a `mvn
jetty:run` paranccsal futtatható.

Az alkalmazás a következőképp működik. Be kell hívni egy vagy több
böngészőben/böngészőablakban az alkalmazást, majd a szövegbeviteli
mezőbe beírni egy szöveget. Ennek a szövegnek az összes kliensen meg
kell jelennie.

A választott webes keretrendszer, mely képes kliens oldalra hívni a DWR.
A poszt végén kitérek ennek mikéntjére, de most minket az érdekel, hogy
üzleti oldalról hogy jut el az esemény a DWR-ig. A `jtechlog-event-eo`
projektben erre a standard Java megoldást használom, ahogy az AWT
eseménykezelés is működik.

A service rétegben lévő `StatusService` osztály fogadja a felhasználó
felől az interakciót, és szeretné ezt a többi webes kliensnek
továbbítani. Az első példában (`jtechlog-event-eo`) a service rétegben
deklarálok egy StatusEvent esemény osztályt, mely a Javas `EventObject`
osztály leszármazottja. Valamint egy `StatusEventListener` interfészt,
mely a `java.util.EventListener` leszármazottja. Ezt implementálja webes
rétegben a `StatusEventSender` osztály, mely a böngészőnek továbbítja az
eseményt, az implementált `onStatusEvent` metódusban:

{% highlight java %}
@Service
public class StatusEventSender implements StatusEventListener {

    @Override
    public void onStatusEvent(StatusEvent statusEvent) {
        // Küldés a böngésző felé, lásd később
    }
}
{% endhighlight %}

A `StatusService` ilyen listenereket képes regisztrálni, és
állapotváltozás esetén hívni. Először egy Springes trükköt próbáltam
elkövetni, méghozzá az `@Autowired` annotációval automatikusan beállítani
ezeket a listenereket:

{% highlight java %}
@Service
public class StatusService {

  private List<StatusEventListener> statusEventListeners
    = new ArrayList<StatusEventListener>();

  public void postStatus(String status) {
    for (StatusEventListener statusEventListener:
      statusEventListeners) {
        statusEventListener.onStatusEvent(
          new StatusEvent(this, status));
      }
  }

  @Autowired
  public void setStatusEventListeners(List<StatusEventListener>
      statusEventListeners) {
    this.statusEventListeners = statusEventListeners;
  }
}
{% endhighlight %}

A Spring ezt alapból tudná, ugyanis amennyiben az `@Autowired` annotáció
rajta van a metóduson, próbálja begyűjteni az összes `StatusEventListener`
interfészt implementáló osztályt, és azt tenni a listába, és azt értékül
adni az attribútumnak. A szép elképzelést azonban a Spring context
kezelése meghiúsította. Röviden a web contextben lévő beanek nem
látszanak a service contextben lévő beanek számára. (Ez alapjában véve
elfogadható. A Spring context hierarchia kezeléséről amúgy kevés
dokumentáció van, itt található [egy kis
kivétel](http://techo-ecco.com/blog/spring-application-context-hierarchy-and-contextsingletonbeanfactorylocator/).)

Amennyiben a `StatusEventSendert` átmozgatjuk a service-ek közé, a
probléma megoldódik. De amennyiben a klasszikus modellnél akarunk
maradni, nekünk kell gondoskodnunk a listenerek regisztrációjáról.
Egyrészt így módosul a `StatusService`:

{% highlight java %}
@Service
public class StatusService {

  private List<StatusEventListener> statusEventListeners
    = new ArrayList<StatusEventListener>();

  public void postStatus(String status) {
    for (StatusEventListener statusEventListener:
        statusEventListeners) {
      statusEventListener.onStatusEvent(new StatusEvent(this, status));
    }
  }

  public void addStatusEventListener(
      StatusEventListener statusEventListener) {
    statusEventListeners.add(statusEventListener);
  }
}
{% endhighlight %}

Másrészt a `StatusEventSendert` kell kiegészíteni a regisztráció
hívásával. Gyakorlatilag a bean elkészítése után értesítjük a
`StatusServicet` a meglétéről.

{% highlight java %}
@Service
public class StatusEventSender implements StatusEventListener {

    @Autowired
    private StatusService statusService;

    @PostConstruct
    private void register() {
        statusService.addStatusEventListener(this);
    }

    @Override
    public void onStatusEvent(StatusEvent statusEvent) {
   // Kliens értesítése
    }
}
{% endhighlight %}

<a href="/artifacts/posts/2012-10-14-esemenykuldes-szerver-oldalrol/event-osztalydiagram.png" data-lightbox="post-images">
  ![Osztálydiagram](/artifacts/posts/2012-10-14-esemenykuldes-szerver-oldalrol/event-osztalydiagram_600.png)
</a>

Ezzel már teljesítettük a feladatot, a `StatusService` lazán csatolt a
`StatusEventSender`-rel, hiszen nincs rá referenciája, de mégis értesíti
azt az állapotváltozásáról.

A második példában (`jtechlog-event-ae`) a Spring beépített
eseménykezelését szeretném bemutatni. A Springben bármilyen beanből
eseményt lehet küldeni, amit más beanek fogadni tudnak. Először
megcsináljuk az eventünket, mely a
`org.springframework.context.ApplicationEvent` leszármazottja.

{% highlight java %}
public class StatusEvent extends ApplicationEvent {

    private String status;

    public StatusEvent(Object source, String status) {
        super(source);
        this.status = status;
    }

    public String getStatus() {
        return status;
    }
}
{% endhighlight %}

Utána a `StatusService`-t implementáljuk, mely az eseményt elküldi. Ehhez
egy `ApplicationEventPublisher`-re van szükségünk, melyhez a
`ApplicationEventPublisherAware` használatával lehet hozzáférni. Aztán a
`publishEvent` metódussal tudunk eseményt küldeni.

{% highlight java %}
@Service
public class StatusService implements ApplicationEventPublisherAware {

  private ApplicationEventPublisher applicationEventPublisher;

  public void postStatus(String status) {
    applicationEventPublisher
        .publishEvent(new StatusEvent(this, status));
  }

  public void setApplicationEventPublisher(ApplicationEventPublisher
      applicationEventPublisher) {
    this.applicationEventPublisher = applicationEventPublisher;
  }
}
{% endhighlight %}

Utána a `StatusEventSender`-t írjuk meg, mely fogadja az eseményt, és
értesíti a böngészőt. Implementálja az `ApplicationListener` interfészt,
az `onApplicationEvent` metódussal.

{% highlight java %}
@Service
public class StatusEventSender implements
    ApplicationListener<StatusEvent> {

  @Override
  public void onApplicationEvent(StatusEvent statusEvent) {
    // Böngésző hívása
  }
}
{% endhighlight %}

A megoldással pontosan az a baj, melybe az előbbi esetben is
belefutottunk, méghozzá a service contextben lévő beanek nem dobhatnak
üzenetet a web contextben lévő beaneknek, csupán fordítva. Azaz itt is
igaz az állítás, hogy a service réteg nem tudhat a web rétegből. Az a
megoldás, hogy a `StatusEventSender`-t áttesszük a service-ek közé, ismét
működik.

Amennyiben komolyabb megoldásra van szükségünk, használhatjuk a Guava
könyvtár (Google core Java libraryje, collection komponensekkel,
cache-eléssel, párhuzamosságot, Stringeket és fájlokat kezelő
segédosztályokkal) Guava EventBus komponensét. A [csomag leírásában van
egy nagyon jó
dokumentáció](http://docs.guava-libraries.googlecode.com/git/javadoc/com/google/common/eventbus/package-summary.html),
hogy miért jobb, mint a Java beépített eseménykezelése, ezért erre most
nem térnék ki.

Először a Springben definiálni kell az `EventBus`-t, majd definiálni kell
egy POJO eseményt. Az `EventBus`-hoz dependency injectionnel hozzá lehet
férni.

{% highlight java %}
@Service
public class StatusService {

    @Autowired
    private EventBus eventBus;

    public void postStatus(String status) {
        eventBus.post(new StatusEvent(status));
    }
}
{% endhighlight %}

Az `EventBus`-ra regisztrálni kell, és eseményt fogadni a `@Subscribe`
annotáció használatával lehet.

{% highlight java %}
@Service
public class StatusEventSender {

    @Autowired
    private EventBus eventBus;

    @PostConstruct
    private void register() {
        eventBus.register(this);
    }

    @Subscribe
    public void onStatusEvent(StatusEvent statusEvent) {
   // Küldés kliens felé
    }
}
{% endhighlight %}

A Spring integrációhoz jól jöhet a
[`guava-eventbus-spring`](https://github.com/armsargis/guava-eventbus-spring)
projekt is, de mivel nincs fenn a központi Maven repositoryban, én nem
használtam. Ez definiál Spring névteret, így sokkal könnyebben lehet az
`EventBus`-t konfigurálni, valamint annotáció alapján automatikusan képes
beregisztrálni a subscribereket, nem kell nekünk ezt manuálisan
megtennünk.

Most már csak azt az adósságomat kell törleszteni, hogy hogyan lehet
DWR-ben a kliens oldal felé üzenetet küldeni. Erre egy nagyon hatékony
megoldás áll a rendelkezésünkre: szerver oldali Javaból tudunk
JavaScript függvényt hívni! Hogy ez a HTTP-n hogyan történik, a DWR
[három lehetőséget
biztosít](http://directwebremoting.org/dwr/documentation/reverse-ajax/index.html):

-   Polling: nem kell magyarázni, szabványos időközönként megkérdezi a
    szervert, hogy van-e függvényhívás
-   Comet: nyit egy HTTP kérést, és az addig blokkolódik, míg nem
    történik valami, vagy timeout
-   Piggyback: ha történik amúgy is egy szerver oldali kérés, abban
    adott válaszban küldi vissza a DWR a függényhívás tényét is

Mindegyiknek megvan az előnye és hátránya. Alapban csak a Piggyback van
bekapcsolva, a web.xml-ben, valamint a JavaScriptben kell kavarni a
Reverse Ajax bekapcsolásához.

Nézzük a JavaScript oldalt:

{% highlight javascript %}
// http://docs.jquery.com/Using_jQuery_with_Other_Libraries
$j(function () {
dwr.engine.setActiveReverseAjax(true);
$j("#statusForm").submit(function () {
    statusDwrService.postStatus($j("#statusInput").val());
    return false;
  });
});

function showStatus(status) {
  $j("#statusDiv").html(status);
}
{% endhighlight %}

Egyrészt bekapcsolja a Reverse Ajaxot. Valamint a statusForm HTML form
kitöltésekor meghívja a szerver oldali postStatus metódust. Valamint
definiál egy showStatus metódust, melyet meghívva megjelenik a szerver
oldalról érező üzenet. Mindez JQuery használatával.

A szerver oldali hívás a következőképp néz ki:

{% highlight java %}
public void onStatusEvent(StatusEvent statusEvent) {
    ScriptBuffer scriptBuffer = new ScriptBuffer();
    scriptBuffer.appendCall("showStatus", statusEvent.getStatus());
    WebContext webContext = WebContextFactory.get();
    String currentPage = webContext.getCurrentPage();
    Collection sessions =
      webContext.getScriptSessionsByPage(currentPage);
    for (Iterator i = sessions.iterator(); i.hasNext(); ) {
        ScriptSession session = (ScriptSession) i.next();
        session.addScript(scriptBuffer);
    }
}
{% endhighlight %}

Ez hívja meg a kliens oldalon a `showStatus` JavaScript metódust.
