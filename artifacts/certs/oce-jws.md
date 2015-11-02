# Oracle Certified Expert, Java EE 6 Web Services Developer segédlet

## SOAP webszolgáltatások JAX-WS-sel

-   Java EE 6 2009. dec. 10-én jött ki: JAX-WS 2.2 (JSR 224), JAX-RS
    1.1, Web Services Metadata for the Java Platform 2.0 (JSR 181), SOAP
    with Attachments API for Java (SAAJ) 1.3
-   MEP: Message Exchange Pattern, típusai: request/response, oneway,
    async callback, async polling
-   SOAP: 1.2-től kezdve nem rövidítés
-   WSDL felépítése: `definitions`, `types`: adattípusok definíciója,
    `message`: üzenetek defincíciója, message part-(ok)ból áll, `portType`:
    operációk halmaza, `binding`: protokoll és adatformátum specifikációk,
    pl. soap, ezen belül operáció, `input`-tal, `output`-tal, majd `service`,
    `port`: `portType` (interfész) és `binding` (implementáció
    összekapcsolása)
-   WS-I: csak RPC/literal vagy document, de az utóbbinál body-n belül
    csak max egy elem lehet
-   WS-I Basic Profile 1.1 egy dokumentum, mely a SOAP 1.1 és WSDL 1.1
    szabványokat pontosítja

## Style és encoding

-   RPC/Literal
    -   Paramétereket tartalmaz a híváshoz
    -   Mindig wrapped
    -   Wrapper element az operation neve
    -   Állhat több part-ból az input message
    -   Part mindig type attribútummal van deklarálva (szemben a
        document element-tel)
    -   csak a part-ok vannak a types részben leírva
    -   Part-nak megfelelő elemek névtér nélkül
    -   Válasz neve nem deklarált
-   Document/Literal
    -   Dokumentumot tartalmaz a híváshoz
    -   Lehet több part
    -   Part mindig element-tel van megadva
    -   A teljes body tartama a sémában van definiálva
    -   Operation neve nem szerepel a soap üzenetben
    -   Part-ok közvetlenül a body-ban vannak, nincs wrapper, névtérrel
        ellátottak
    -   Response ugyanígy
-   Document/Literal wrapped
    -   input message-nek csak egy gyereke van, a wrapper
    -   element-ként leírva, sémával meghatározva
    -   konvenció szerint operation neve = wrapper neve
    -   ugyanígy a response-nál is, konvenció szerint a wrapper neve az
        operation neve + "Response"

## JAX-WS

-   SEI
-   Kötelező: SIB
-   Nem muszáj a SIB-nek implementálnia a SEI-t, megadható az
    annotációban is, csak nem biztonságos -\> futás idejű hiba
-   Ha annotációban sincs megadva, implicit SEI
-   Opcionális: SEI, WSDL, `webservices.xml`
-   Osztály, public, nem lehet `final` vagy `abstract`
-   Default public constructor-nak lennie kell, nem lehet `finalize`, nem
    tárolhat állapotot
-   Metódusai nem lehetnek `static` vagy `final`
-   `Wsgen`, `wsimport`
-   A JAX-WS 2.1.6-tól változott az implicit esetén, több esetben lesz
    kiajánlva a metódus
-   Explicit SEI esetén az összes publikus metódust kiajánlja, a
    `WebMethod` csak további konfigurációkra való
-   A `wsimport` generál: SEI, service, fault-hoz tartozó osztályt, ha
    kell; paraméter osztályokat, ha kell; Async Reponse Bean, ha kell
-   external/embedded binding declaration: SEI, exception, service neve,
    package neve, wrapper style
-   JAXB: sémában `annotation`/`appinfo` tag-en belül
-   JAX-WS kliens: `Service.create(url, qname);`
    `service.getPort(SEI.class);`
-   Deploy JDK-ban: `Endpoint.publish`, egyszálú
-   Default: Wrapped Document/Literal, RPC: `@SOAPBinding(style =
    Style.RPC)`
-   `@WebService` annotáció `targetNamespace` attribútuma adja meg a
    névteret, amúgy a package alapján
-   `@RequestWrapper`, `@ResponseWrapper`
-   `WebParam.Mode.OUT`, `Holder`
-   Ne wrapper-ek legyenek: customized binding, `enableWrapperStyle`
-   `@SoapBinding(parameterStyle = SOAPBinding.ParameterStyle.BARE)`
-   Ha aszinkron klienst akarunk, akkor ismét customized binding:
    `enableAsyncMapping`
-   `AsyncHandler`
-   `Response`
-   `wsimport -extension`: SOAP 1.2 esetén
-   Overload-olt metódusok esetén problémás

## Dynamic Invocation Interface (DII)

-   Dispatcher, Provider
-   `@WebServiceProvider`
-   `public Source invoke(Source)`
-   `@ServiceMode`: `PAYLOAD` - csak a tartalom, `MESSAGE` - az egész http
    kérés, fejlécestől
-   `@BindingType()` - `http`
-   Dispatch - `Service.createDispatch`
-   Https: `HttpsURLConnection`, `HttpsServer`
-  `@WebService`-t felismeri a Glassfish, de a `@WebServiceProvider`-t nem

## Handler

-   Chain of responsibility tervezési minta
-   Logical handler: Source, JAXB - protokollfüggetlen - csak a
    payloadhoz tud hozzáférni
-   SOAP/protocol handler: SOAP, SAAJ, hozzáfér a teljes envelope-hoz
-   Kliens oldalon a handler chainben nem csak a konfig sorrend dönt,
    hanem előbb futnak le a logical handlerek, és csak utána a soap
    handlerek
-   Programozottan handler hozzáadása: `HandlerResolver`
-   `SOAPFaultException`
-   SOAP 1.2: `BindingType` annotáció
-   SOAP 1.2: `mustUnderstand`
-   Szerver oldalon: `WebServiceContext.getMessageContext` -\> hozzáférés
    a context-hez (map), és abból a http header-ökhöz
-   Kliens oldalon: a port `BindingProvider`-ré cast-olható, van
    `getRequestContext` metódusa
-   Dependency injection: `WebServiceContext`

## MTOM

-   MTOM: XSD, `@BindingType`, publikálásnál: `((SOAPBinding)
    endpoint.getBinding()).setMTOMEnabled(true);`
-   Kliens: `activation.DataHandler`
-   Kliens file küldés: `((SOAPBinding)((BindingProvider)
    port).getBinding()).setMTOMEnabled(true);`
-   `@MTOM` annotáció

## WSIT

-   Metro: azon része mely az MS-sel való együttműködés: WSIT -
    Webservice Interoperability Technologies - Security, Reliability,
    Transaction, bootstrapping, optimalization (régen project Tango)
-   Bootstrapping: WS-MetadataExchange
-   Reliable messaging: egyszeri, pontosan egyszeri üzenettovábbítás -
    acknowledge-al, sorrend (opcionálisan bekapcsolható)
-   Atomic: AtomicTransaction, Coordination

## Security

-   XML and WebServices Security Project (XWSS)
-   WS-Security: message content integrity and confidentality, Prompter,
    Verifier implements CallbackHandler
-   WS-Security (x) felett: WS-Policy felette WS-SecurityPolicy (x),
    WS-PolicyAttachment (x), WS-Trust (x), WS-Privacy, afelett WS-Secure
    Conversation (x), WS-Federation, WS-Authorization
-   WS-Secure conversation - shared security context, több kérés/válasz
    esetén nem kell mindig az összes security információt küldeni - new
    security token type
-   Trust: security token
-   SecurityPolicy, mely a Policy-ra épül: security követelmények és
    tulajdonságok leírására
-   WS-Trust: security token, Security Token Service - STS, az STS SAML
    tokent küld a kliensnek
-   Signing and encription: WSDL-be plusz tag-ek

## WS-Addressing

-   WS-Addressing: protokollfüggetlen címzés
-   Kettő spec van: W3C WS-Addressing, Member Submission WS-Addressing,
    a Metro mindkettőt támogatja
-   Standard tag-ek: To, From, ReplyTo, FaultTo, MessageID, Action,
    RealtesTo
-   Végpont referencia: EPR
-   MI header: message information
-   Message Addressing Properties (MAPs)
-   Anonymous uri: nem címezhető, pl. request/response request párja
-   Annotáció: `@javax.xml.ws.soap.Addressing`, `@Action`, `@FaultAction`
-   WSDL-ben: `wsdl11:port` vagy `wsdl11:binding` tag-be új tag
-   Kliens oldal: `WebServiceFeature` -\> `AddressingFeature`
-   `BindingProvider.SOAPACTION_URI_PROPERTY`-t kell kliens oldalon
    beállítani
-   Két paraméter: `enabled`, `required`

## SAAJ

-   Új `SOAPMessage` létrehozásánál létrehozza a `Part`-ot, `Envelope`-ot és
    `Header`-t
-   Attachment Part, mime headers, Content
-   `SOAPConnection`
-   Attachment: `Content-Type`, `-Id`, `-Location`
-   Attachment `setContent`: `String`, stream, `javax.xml.transform.Source`
    vagy `javax.activation.DataHandler`
-   A SOAP 1.1 specifikáció közvetlenül a header-ben csak a következő
    attribútumokat engedi: `actor` és `mustUnderstand`
-   A SOAP 1.2 spec. ellenben: `role` (actor új neve), `mustUnderstand`, és
    `relay`
-   Ha van `SOAPFault` a `Body`-n belül, nem lehet más
-   code, string kötelező, lehet actor, SOAP 1.2-nél code, role,
    reasonText (locale-lal)
-   A kódok QName-ek - SOAP specifikáció definiálja

## RESTful

-   Roy Fielding: Architectural Styles and the Design of Network-based
    Software Architectures, 2000 (HTTP specifikáció egyik írója), Apache
    Software Foundation egyik alapítója
-   Egyedileg címezhető erőforrások: resource, URI
-   Uniform, constrained interface for manipulate resources
-   Representation-oriented, content negotiation
-   Stateless
-   Hypermedia As The Engine Of Application State (HATEOAS): embedded
    links

## JAX-RS

-   JAX-RS 1.1 (JSR 311)
-   Referencia implementáció: Jersey
-   POJO, annotation alapú
-   Annotációk öröklése: super-class előnyt élvez az interfészen lévővel
    szemben
-   Ha az implementáción van annotáció, akkor a többi helyen lévő
    annotációt nem veszi figyelembe
-   Application osztály, kiterjeszteni kell, osztályokat ad vissza,
    melyet a provider példányosít, illetve példányokat, melyeket
    singleton-ként használ. Mindkettőn elvégzi az injection-t.
-   Application erőforrásokat (`@Path` annotációval ellátott osztályokat),
    és provider-eket adhat vissza
-   A JAX-RS provider cserélhető, erre van a `RuntimeDelegate`, saját
    alkalmazásban nem kell használni

## Provider

-   A provider, melyen rajta van a `@Provider` annotáció, és valamilyen
    JAX-WS interfészt implementál
-   Kell minimum egy publikus konstruktor, akár paraméterezett. Mindig a
    legtöbb paraméterrel rendelkező konstruktort választja
-   Provider pl. a `MessageBodyReader`, `Writer`
-   Provider pl. a `ContextResolver`, mellyel saját Context, pl.
    `JAXBContext` példányosítható
-   `ExceptionMapper`-ek is provider-ek

## Context

-   Per request esetén nincs párhuzamossági probléma
-   Per request esetén attribútum is injektálható
-   Konstruktor paraméter mindig injektálható
-   A három első olvasó, aki ide eljut, vendégem egy sörre a következő
    JUM-on. Dobj egy e-mailt!
-   `@Context` annotációval injektálunk
-   A következőkbe injektálhatók: resource, provider, Application
    leszármazott
-   A következők injektálhatók: `Application` (önmagába nem), `UriInfo`,
    `HttpHeaders`, `Request`, `SecurityContext`, `Providers`
-   A `Providers`-en keresztül hozzá tudunk férni a `MessageBodyReader`,
    `Writer`-ekhez, `ContextResolver`-hez, `ExceptionMapper`-hez, azaz amit a
    `@Provider` annotációval elláthatunk

## Erőforrások

-  ` @Path`
-   Root resource class: vagy `@Path`-tal annotált, vagy van legalább egy
    Path-tal vagy request method designatorral (`@GET`, stb.) annotált
    metódusa
-   Request method: request method designatorral annotált metódus
-   Egy metóduson csak egy `@GET`, `@PUT`, stb. annotáció lehet, különben
    deployment error
-   A `@HttpMethod` annotáció egy metaannotáció, mely rajta van a `@GET`,
    stb. metódusokon
-   `HEAD` kérés esetén először `@HEAD` metódust keres, ha nincs, akkor a
    `@GET`-et hívja, csak nem ad Response-t
-   `OPTIONS` kérés először `@OPTIONS` metódust keres, ha nincs választ
    generál az annotációk alapján -\> WADL
-   `@ApplicationPath` globális url megadásra, ehhez jön hozzá a
    resource-onkénti
-   A `/{foo}` path-ra nem illeszkedik a `/foo/bar`, de a `/{foo: .+}` path-ra
    igen (lásd perjelek értelmezése)
-   Amennyiben egy url több path-ra is illeszkedik, a provider a
    legpontosabbra próbálja illeszteni. Van egy nem minden esetet lefedő
    precedencia szabály, mely általában jó. Először a literálok számát
    nézi, majd a template-ek számát, majd a reguláris kifejezésekkel
    ellátott template-ek számát.
-   Nem minden karakter megengedett az uri-ban, valamint van, aminek
    speciális jelentése van. A többit escape-elni kell. A `@Path`
    annotációban nem kötelező escape-elni.
-   A subresource olyan POJO, melyhez egy resource POJO továbbítja a
    kiszolgálást. Nem kell rá `@Path` annotáció, hiszen nem a root uri-hoz
    képest figyel, valamint nem kell az Application osztályban
    regisztrálni.
-   Ha az illeszkedő path-ban két mátrix paraméter ugyanazon a néven
    szerepel, akkor `PathSegment`-et kell használni, mert nem egyértelmű a
    `@MatrixParam` injection. `@PathParam` `List<PathSegment>` formában
-   `@FormParam` esetén implicit dekódolás van,
    `@Consumes("application/x-www-form-urlencoded")`
-   Primitív típus, String mappelésén kívül minden olyan típust mappel,
    melynek van `String` paramétert váró konstruktora, vagy statikus
    `valueOf` metódusa `String` paraméterrel
-   Van automatikus collection konverzió
-   `@HeaderParam`, `@CookieParam` mappelési hiba esetén 400-as hiba, amúgy
    404
-   `@DefaultValue` annotációval adhatjuk meg az alapértelmezett értékeket
-   `@Encoded` annotációval adhatjuk meg, hogy mi akarjuk dekódolni, tehát
    azt kapjuk, amit a HTTP ad, dekódolás nélkül

## Content Handlers

-   A következő típusokat standard `MessageBodyReader`-ek és `Writer`-ek
    kezelik, ezek entity provider-ek
-   `StreamingInput`, `StreamingOutput` - callback model, általában
    performancia okokból jobb, ha a provider hív vissza (pl. lehet, hogy
    új szálon), valamint illeszkedik az aszinkron modellbe.
-   `InputStream`, `Reader`
-   `File`, `byte[]`, `String`, `char[]` is használható input/output
    paraméterként
-   Activation `DataSource` is kezelendő
-   `MultivaluedMap<String, String>` form értékekhez, dekódolja a
    provider, használható az `@Encoded` annotáció
-   `javax.xml.transform.Source`, a `Document`-et nem definiálja a
    specifikáció
-   JAXB: `XmlRootElement`, `XmlType` annotációval jelölt osztályok és
    `JAXBElement` példányba burkolt objektumok leképzését is támogatja
-   `JAXBContext`-et tud példányosítani, de felüldefiniálhatjuk
    `ContextResolver<JAXBContext>`-ben (pluggable factories), amit az
    Application-ben definiálhatunk
-   JSON-höz nem kell speciális kezelés, egyedül a mime type-ot kell
    `application/json`-ként jelölni
-   Saját marshallinghoz: `MessageBodyWriter`, sorbarendezés, legjobb
    illesztés a mime type-ra, `@Provider` annotáció, `@Produces` annotáció
-   `MessageBodyReader`, `@Provider`, `@Consumes` annotáció
-   `isWritable`, `isReadable` - a paraméterként adott objektumot tudja-e
    kezelni (+generikus típus, annotáció, media type)

## Response code, response, exception

-   `ResponseBuilder`-rel előállítható a `Response`
-  ` WebApplicationException` saját kivétel
-   Megadható benne saját Response
-   Error vagy unchecked exception megy a konténer felé, a többit
    viszont be kell csomagolni, és úgy megy a konténer felé
-   `ExceptionMapper` a kivételek kezelésére, generikussal
    paraméterezhető, mindig a kivételre legjobban illeszkedőt keresi
-   `ExceptionMapper`-t a `@Provider` annotációval kell ellátni

## Content Negotiation

-   `@Produces`, `@Consumes`, tehető resource-ra, metódusra, és a content
    handlerre is
-   Variant: media type, language, encoding
-   `VariantListBuilder`: builder

## HATEOAS

-   `UriBuilder` URI-k összeállítására, template paraméter is használható
-   Az `UriBuilder` egy resource osztályt kapva paraméterként is képes
    összeállítani az URI-t
-   `UriInfo`-val is létrehozható `UriBuilder`, ekkor adott a séma, szerver,
    port, context
-   Cache-elés a `CacheControl` osztályon keresztül, nincs rá annotáció
-   `EntityTag` osztály az `ETag` kezelésére
-   Szerver oldalon kezelni a `If-Modified-Since` vagy `ETag` headereket:
    `Request` interfész (injektálható) `evaluatePreconditions` metódusai.
-   Nem csak cache-elésre használható, hanem konkurrencia kezelésre is,
    hogy csak akkor történjen a módosítás, ha nem változott az erőforrás

## Deploy

-   Deploy: JAX-RS unaware konténerben egy servletet, és annak
    `int-param`-ként kell megadni az `Application`-t, aware konténerben az
    `Application` tehető közvetlenül a `web.xml`-be. Java EE 6-nál nem kell
    semmi az xml-be, classpath-t bejárja, és nézi az annotációkat.
-   `@Context` annotációval a `ServletContext` és a `ServletConfig`
    injektálható
-   Java EE 6 konténerben a szokásos dolgok injektálhatók: `@Resource,`
    `@PersistenceContext`, `@PersistenceUnit`, és `@EJB`, támogatja Java EE
    6-ban a JSR-299 szabványt.
-   Java EE konténer által biztosított autentikáció és authorizáció
    adott. Programozott esetben a `SecurityContext` `@Context` annotációval
    injektálható

## Kliens

-   Szabvány nem szól róla
-   Legegyszerűbb esetben `HttpURLConnection`
-   `setDoOutput` - request body-ba is lehet írni
-   Jersey Client API
