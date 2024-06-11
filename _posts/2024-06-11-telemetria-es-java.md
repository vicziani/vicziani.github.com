---
layout: post
title: Telemetria és a Java
date: '2024-06-11T10:00:00.000+02:00'
author: István Viczián
description: Telemetria, szabványok és eszközök, pl. OpenTelemetry, Micrometer.
---

Napjainkban a telemetria egy nagyon fejlődő terület, napról napra jelennek meg új eszközök
és szabványok, melyeket igen nehéz nyomonkövetni. 
Ez a poszt ebben szeretne egy kis rendet tenni, hiszen úgy lehet valamit a legjobban megismerni,
hogyha másoknak elmagyarázod.

A telemetria (_telemetry_) klasszikusan egy rendszer különböző elemein mérési adatok előállítása és továbbítása egy központi
helyre. Ennek célja, hogy a múltbéli és jelenlegi adatok elemzésével meg lehessen bizonyosodni a rendszer
helyes működéséről, észlelni, esetleg előre jelezni lehessen annak hibáit. Erre különböző eszközöket és folyamatokat
használunk, melyek biztosítják a rendszer folyamatos megfigyelhetőségét (_observability_).

Szoftverrendszer esetén is pontosan erről van szó, különböző mérési adatokat állítunk elő különböző szinteken,
pl. operációs rendszer szinten mérjük a CPU, memória és lemezhasználatot, de alkalmazás/szolgáltatás szinten
mérhető a bejelentkezett felhasználók, beérkező kérések, tranzakciók száma, válaszidők.
Ezen adatokból kinyert információkból következtethetünk a szoftver állapotára, hibára.
A túl magas válaszidő biztos valami problémára utal, de az rossz jel lehet, ha hirtelen lecsökken 
a tranzakciószám.

<!-- more -->

A beérkező adatokat három fő kategóriába soroljuk:

* metrikák (_metrics_)
* _traces_
* napló (_logs_)

A metrikák valamilyen mérőszámok, hozzárendelt mértékegységgel. Ezek lehetnek valamilyen aktuális 
értékek (pl. szabad lemezterület), számláló (pl. hány kivételt kaptunk), lefutás hossza (pl. beérkező kérés kiszolgálásának ideje), stb.

![Mérők](/artifacts/posts/2024-06-11-telemetria-es-java/gauges.png)

A trace egy bejővő kéréshez, tranzakcióhoz, önálló művelethez tartozik, és leírja, hogy milyen lépésekből épül fel, és melyik lépés
mennyi ideig tart. Egy kérés egy trace, amely egy vagy több _span_-ból épül fel. Pl. egy kérés kiszolgálása két lépésből áll,
hívás egy másik szolgáltatás felé, valamint egy adatbázis lekérdezés. Egy trace-en látszik, hogy melyik mennyi ideig tart.

![Trace](/artifacts/posts/2024-06-11-telemetria-es-java/trace.png)

Természetesen ennek a legnagyobb előnye elosztott rendszereknél jelenik meg, így a különböző szolgáltatásokból
jövő spaneket lehet összerendezni egy trace alá. Ehhez persze a service-ek között továbbítani kell valamilyen
értéket, mely alapján a spaneket trace-hez lehet kötni. Ez a context propagation.

![Context propagation](/artifacts/posts/2024-06-11-telemetria-es-java/context-propagation.drawio.png)

A legismertebb talán a napló, mely az adott szolgáltatásban lévő eseményeket tartalmazza, ún. napló bejegyzésként (_log record_).

```plain
2024-06-11 21:45:22 DEBUG hello.HelloApplication                   Running with Spring Boot v3.1.4, Spring v6.0.12
2024-06-11 21:45:22 INFO  hello.HelloApplication                   No active profile set, falling back to 1 default profile: "default"
2024-06-11 21:45:24 INFO  o.s.b.w.embedded.tomcat.TomcatWebServer  Tomcat initialized with port(s): 8080 (http)
2024-06-11 21:45:24 INFO  o.apache.catalina.core.StandardService   Starting service [Tomcat]
2024-06-11 21:45:24 INFO  org.apache.catalina.core.StandardEngine  Starting Servlet engine: [Apache Tomcat/10.1.13]
2024-06-11 21:45:24 INFO  o.a.c.c.C.[Tomcat].[localhost].[/]       Initializing Spring embedded WebApplicationContext
2024-06-11 21:45:24 INFO  w.s.c.ServletWebServerApplicationContext Root WebApplicationContext: initialization completed in 1769 ms
```

Mindegyikhez további információkat, különböző metaadatokat (_metadata_) rendelhetünk. Ezek kulcs-érték párok,
és itt már nincs egységes elnevezés, előfordul az attribútumok (_attributes_), dimenziók (_dimensions_),
címkék (_labels_), _tags_, stb. A napló mezői (_fields_) is ide taroznak.

Pl. a bejövő http kérésekhez rendelhető `method` attribútum `GET`, `POST`, `PUT`, stb. értékekkel, akár metrika, trace vagy log esetén is.
Napló esetén gyakori az esemény időpontja, esemény fontossága, szöveges leírása, stb.

Ezeket az adatokat mérni és gyűjteni kell a különböző szolgáltatásokban. 
Azon kódrészlet elhelyezését, mely ezt csinálja, instrumentálásnak (_instrumentation_) nevezik.
Továbbítani egy központi hely
felé, ezt az ún. _exporter_ vagy _reporter_ komponens végzi. A továbbítás valamilyen egyéni vagy
szabványos formában, protokollon történhet.
Bizonyos esetekben az adatokat gyűjteni, konvertálni kell, valamint protokollok között fordítani. Majd megfelelő, gyorsan kereshető, aggregálható formában kell letárolni.
Mivel ezek általában speciális formátumú, és  felhasználású adatok, ezért a relációs adatbázisok gyakran
nem megfelelőek, és valamilyen NoSQL adatbázist használnak.
Végül az adatokat aggregálni kell és a felhasználó számára könnyen emészthető formában megjeleníteni. 

![Workflow](/artifacts/posts/2024-06-11-telemetria-es-java/workflow.drawio.png)

Nem feltétlen szükséges minden feladatot megvalósítani, és vannak eszközök melyek több feladatot is megvalósítanak.

A legegyszerűbb megoldás, hogyha kiválasztunk egy eszközt, pl. trace-ek esetén a [Zipkin](https://zipkin.io/) eszközt.
A Zipkin saját modellt, protokollt, saját [nyílt REST API-t definiál](https://zipkin.io/zipkin-api/), de ezen
kívül küldhetők trace-ek Kafkán vagy Scribe-on.
Várja és validálja a trace-eket, majd letárolja (eredetileg Cassandra NoSQL adatbázisban, de már más is választható, pl. ElasticSearch
vagy MySQL). A Zipkin saját felhasználói felülettel is rendelkezik.

Ahhoz, hogy egy service ide trace-eket tudjon küldeni, instrumentálni kell, kell egy könyvtár (_instrumentation library_). Java esetén ez a [Brave](https://github.com/openzipkin/brave).

![Zipkin](/artifacts/posts/2024-06-11-telemetria-es-java/zipkin.drawio.png)

Ennek a megoldásnak több hátránya is van. A service csak egy trace eszközzel, a Zipkinnel képes kommunikálni, és ha cserélni akarjuk, akkor
át kell írni az alkalmazást. Valamint a Zipkin csak a trace-eket kezeli, külön eszköz kell a metrikák és a napló kezelésére.

Erre két megoldást is kapunk. Egyrészt a platform és nyelvfüggetlen OpenTelemetry, másrészt a Java specifikus Micrometer.

## OpenTelemetry

Az OpenTelemetry elődje az [OpenTracing](https://opentracing.io/), mely egy specifikáció és az [OpenCensus](https://opencensus.io/), mely egy nyelvfüggetlen implementáció
metrikák és trace kezelésére. Az OpenTelemetry e kettő összeolvadásából jött létre, továbbfejlesztve azokat. Így az előbbieket már ne használjuk.

Az OpenTelemetry [Cloud Native Computing Foundation (CNCF) inkubátor projekt](https://www.cncf.io/projects/).

Abból a célból jött létre, hogy adjon egy eszközfüggetlen telemetria szabványt, és egységesítse
a metrikák, trace-k és a naplók kezelését, amit összefoglaló néven _signaloknak_ nevez.

<img src="/artifacts/posts/2024-06-11-telemetria-es-java/opentelemetry.svg" alt="OpenTelemetry" width="750px">

Az OpenTelemetry szabványok, API-k, SDK-k és eszközök összessége, nézzük [ezek közül](https://opentelemetry.io/docs/what-is-opentelemetry/#main-opentelemetry-components) 
a legfontosabbakat:

* Szabványos protokoll: _OpenTelemetry Protocol_ (OTLP), melyen a telemetria adatokat lehet továbbítani.
* Különböző programozási nyelvhez SDK-k, mellyel az instrumentálást és exportálást lehet elvégezni.
* [OpenTelemetry Collector](https://opentelemetry.io/docs/collector/) egy olyan központi komponens, mely képes az adatokat különböző protokollokon fogadni,
  ha kell transzformálni, és ha kell, más protokollokon exportálni.

Az adatok küldése történhet HTTP-n (JSON vagy Protobuf) vagy gRPC-n.

Az instrumentálásnak két formája van:

* Automatic, ún. _no-code instrumentation_. Ennek használatával az alkalmazáshoz nem kell hozzányúlni. Ez általában elegendő szokott lenni.
* _Manual instrumentation_: az OpenTelemetry Java SDK API-ját használva programozható.

A no-code instrumentation Java esetén Java agenttel működik. Azaz az alkalmazást úgy kell indítani, hogy a JVM-nek plusz paramétert kell átadni.
Rengeteg [támogatott Java library van](https://github.com/open-telemetry/opentelemetry-java-instrumentation/blob/main/docs/supported-libraries.md#libraries--frameworks),
melynek kódját bájtkód manipulációval módosítja, így azok telemetria adatokat fognak szolgáltatni. Néhány érdekes ezek közül: Spring Boot, Spring WebFlux, Spring Web MVC, Tomcat, Logback, JDBC, HikariCP, Hibernate, Spring Kafka, Apache CXF, AWS SDK, stb.

(Az OpenTelemetry-vel kapcsolatos eszközök kereshetőek a [Registry-ben](https://e-learning.training360.com/account/certificates), mely jelenleg 770 eszközt tartalmaz.)

Amennyiben saját magunk szeretnénk adatot szolgáltatni, megtehetjük programozottan, trace esetén pl. a `Tracer` interfész használatával.

```java
@Inject
Tracer tracer;

public void createEmployee(String name, EmployeeType type) {
    Span span = tracer.spanBuilder("create-employee")
        .setAttribute("type", type)
        .setParent(Context.current().with(Span.current()))
        .setSpanKind(SpanKind.INTERNAL)
        .startSpan();

    // traced work, create and save employee entity

    span.end();
}
```

Vagy deklaratív módon használhatunk annotációt is.

```java
@WithSpan("create-employee")
public void createEmployee(String name, @SpanAttribute(value = "type") EmployeeType type) {
    // traced work, save employee entity
}
```

Az OpenTelemetry Collector _receivereken_ keresztül fogadja az adatokat különböző protokollokon és formátumokban,
pl. OLTP, Jaeger, Prometheus, stb. Az adatokat képes szűrni, transzformálni, valamint attribútumokat módosítani és 
kiegészíteni (_enrich_). Exporterek segítségével pedig képes központi hely felé továbbítani, szintén különböző protokollokon
és formátumokban. Ezért tökéletesen használható protokollfordításra is, azaz ha a szolgáltatás exportere, valamint az adatokat
fogadó és tároló rendszer nem ugyanazt a protokollt beszéli.

<img src="/artifacts/posts/2024-06-11-telemetria-es-java/otel-collector.svg" alt="OpenTelemetry Collector" width="750px">

## Micrometer

A Micrometer kicsit más megközelítést alkalmaz. A cél itt is, hogy ne kelljen implementációfüggő kódokat alkalmazni,
így a Micrometerre úgy kell gondolni, mint egy interfész, egy facade, mely alatt az implementációt lehet cserélgetni.
Azonban ez nem nyelvfüggetlen, itt csak a Javara koncentrálnak. A Micrometer is segít a metrikák, trace-ek és
napló összekötésében.

A Micrometer különböző típusú metrikák létrehozását segíti, melyet a `Meter` interfész reprezentál.
Ezeket a `MeterRegistry` interfésszel lehet létrehozni.

A `Meter` leszármazottai: `Timer`, `Counter`, `Gauge`, `DistributionSummary`, `LongTaskTimer`, `FunctionCounter`, `FunctionTimer` és `TimeGauge`

* Counter: számláló, legyen inkább `Timer` vagy `DistributionSummary`, ugyanis azok kiegészitik további adatokkal ezt
* Gauge: aktuális érték (pl. szabad lemezterület)
* Timer: egyszerre méri a lefutás hosszát, és milyen gyakran történik
    * Pl.: kérések kiszolgálása
* DistributionSummary: egy esemény eloszlása, hasonló, mint a timer, de nem lefutás hosszát méri, hanem egy értéket
    * Pl.: beérkező kérések mérete
* LongTaskTimer: akkor is ad információt, amikor még nem futott le 
    * Pl. az ütemezett feladat

Ehhez a `MeterRegistry`-hez különböző implementációk adhatóak meg. A `PrometheusMeterRegistry` gyűjti az adatokat, és képes
ezeket a Prometheus-nak, annak a formátumában kiajánlani.

Ide tartozik a Micrometer Tracing is, mely a trace adatokat képes gyűjteni és továbbítani.
Az API használható programozottan a `Tracer` és `Span` interfészek használatával, vagy használható a
`@NewSpan` annotáció.

E mögött különböző _tracer_ implementációk használhatóak. Egyrészt az előbb említett Zipkin formátumot támogató Brave-et használó tracer,
vagy a szintén előbb említett OpenTelemetry-t használó tracer.

A küldéshez a tracerhez egy _exporter_/_reporter_ könyvtárat kell kapcsolni. Ez Brave esetén lehet Zipkin vagy Wavefront felé kommunikáló tracer,
OpenTelemetry esetén Zipkin, Wavefront vagy bármilyen OTLP (OpenTelemetry Protocol) protokollt támogató eszköz felé kommunikáló tracer.

![Micrometer](/artifacts/posts/2024-06-11-telemetria-es-java/micrometer.drawio.png)

Különösen érdekes az a megoldás, amikor az alkalmazásban Micrometer Tracinget használunk, amit át lehet forgatni
OpenTelemetry-re egy bridge-dzsel, azt OTLP exporterrel lehet bármilyen OLTP protokollt támogató eszközhöz, akár
pl. OpenTelemetry Collectorhoz kötni.

![Micrometer OpenTelemetry](/artifacts/posts/2024-06-11-telemetria-es-java/micrometer-otel.drawio.png)

Ide tartozik még a [Micrometer Observation](https://micrometer.io/docs/observation) is. Itt az ötlet az,
hogy egy helyen instrumentáljuk a kódot, egy közös absztrakciót használunk, és az ezzel nyert adatok megjelenthetnek a metrikák, trace-ek és logok
között is.

Erről már írtam egy [korábbi posztban](/2022/09/13/spring-boot-3.html).

Ennél is sok library-hez elkészültek ilyen instrumentációk, listájuk
[itt olvasható](https://micrometer.io/docs/observation#_existing_instrumentations).

Valamint magunk is tudunk adatokat előállítani akár programozott módon az `ObservationRegistry` és `Observation`
interfészek használatával, vagy deklaratívan az `@Observed` annotáció használatával.

## Observability backends

Nagyon sok olyan eszköz van, melyek képesek a telemetria adatokat fogadni és tárolni. A teljesség igénye nélkül most felsorolok párat.

A [Prometheus](https://prometheus.io/) az egyik legelterjedtebb metrikákat gyűjtő eszköz (CNCF projekt). Különösen alkalmas idősoros adatok tárolására
és lekérdezésére. Bizonyos feltételek teljesítése esetén képes riasztásokat is képes küldeni. A Prometheus ún. _pull modelben_
dolgozik, azaz ő kéri le az adatokat. Bár van grafikus felülete,
gyakran együtt szokták használni a [Grafanával](https://grafana.com/), mely segítségével nagyon látványos irányítópultokat (_dashboard_)
lehet létrehozni, és adatforrásként mindegyik itt említett eszközt tudja használni, és még ennél is többet.

![Grafana Dashboard](/artifacts/posts/2024-06-11-telemetria-es-java/grafana-dashboard.png)

![Prometheus és Grafana](/artifacts/posts/2024-06-11-telemetria-es-java/prometheus-grafana.drawio.png)

Trace gyűjtésére és megjelenítésére használható a Zipkin, valamint a [Jaeger](https://www.jaegertracing.io/) (CNCF projekt).

Napló gyűjtésére gyakran használják az ELK vagy EFK stacket. Az előbbi az ElasticSearch-Logback-Kibana, míg az utóbbi az
ElasticSearch-Fluentd-Kibana.

![EFK](/artifacts/posts/2024-06-11-telemetria-es-java/efk.png)

A napló adatokat a [Logstash](https://www.elastic.co/logstash), vagy a [Fluentd](https://www.fluentd.org/) fogadja.
Több protokollt és formátumot támogatnak, melyek használatával képesek adatot fogadni és adatot továbbítani.
Talán az utóbbi modernebb, kevesebb erőforrásra van szüksége.

Az [ElasticSearch](https://www.elastic.co/elasticsearch) egy NoSQL adatbázis, egy kereső- és analitikai motor, mely
úgy indexeli a tárolt adatokat, hogy könnyen elő lehessen azokat keresni.

A [Kibana](https://www.elastic.co/kibana) pedig egy grafikus felület, mely képes több adatforrásból is dolgozni.

Természetesen keresgélhetünk integrált megoldásokat is, melyek a teljes OpenTelemetry-t megvalósítják.

Ingyenes pl. a [docker-otel-lgtm](https://github.com/grafana/docker-otel-lgtm), amely egy Docker image-ben
biztosítja az összes funkciót. Itt egy OpenTelemetry Collector gyűjti az adatokat.
A metrikákat a Prometheusnak továbbítja. A Trace-eket a [Grafana Tempo](https://grafana.com/oss/tempo/)
adatbázisba. A naplókat pedig a [Grafana Loki](https://grafana.com/oss/loki/) adatbázisba.
Ez utóbbi háromból dolgozik a Grafana felület.

![otel-lgtm](/artifacts/posts/2024-06-11-telemetria-es-java/otel-lgtm.png)

Fizetős pl. az [Elastic Observability](https://www.elastic.co/observability).

![Elastic Observability](/artifacts/posts/2024-06-11-telemetria-es-java/elastic-observability.png)



