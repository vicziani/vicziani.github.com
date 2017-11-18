---
layout: post
title: RESTful webszolgáltatások Jersey-vel
date: '2009-12-27T11:56:00.005+01:00'
author: István Viczián
tags:
- SOA
- JAX-RS
---

Frissítve: 2017. november 18.

Felhasznált technológiák: Java 7, Jersey 2.5.1, JQuery 1.8.3, Jackson
1.9.13, JUnit 4.11, Maven 3.0.3, Jetty 9.1.0

Az általam is már többször részletezett, nehézsúlyú, bonyolult SOAP
alapú webszolgáltatások és API-k összetettségét ellensúlyozva jelent
meg Roy Fielding PhD dolgozata alapján a REST fogalom.

Most egy egyszerű kliens-szerver alkalmazást kellett írnom, ahol
különböző eseményeket kellett küldenem a szerver oldalra. Az RMI-t
elvetettem, hiszen bonyolultabban vezethető át a protokollja a tűzfalon,
és csak Javaból használható, a SOAP-ot ágyúnak éreztem, képbe került
még az XML-RPC, mely nem szabványos, így választásom a JAX-RS-re esett,
mellyel Javaban lehet RESTful webszolgáltatásokat építeni.

A JAX-RS egy specifikáció (JSR 311), melynek több implementációja is
létezik, köztük a referencia implementáció, a Jersey.

A REST egy szoftver architektúra, mely létező, bevált protokollokra,
szabványokra építkezik, ahelyett, hogy újat találjon ki. Úgynevezett
erőforrásokból (resource) építkezik, és mindegyik ilyen erőforrásnak van
egyedi azonosítója, és ezeket össze is lehet linkelni. A kliens ezen
erőforrásokat kéri le, azok azonosítója alapján, de lehetőség van új
erőforrás hozzáadására, módosítására, törlésére is. A kérések egymástól
függetlenek, nem létezik munkamenet (session) fogalom, a kliens mindig
az adott erőforrás egy adott állapotát kapja vissza. (Emiatt egyszerűbb
az architektúra, könnyen megoldható a gyorsítótárazás - cache, valamint
a terhelés elosztás.) Az erőforrásokat különböző módon lehet
megjeleníteni, pl. egy számsort magával a számok sorozatával, de akár
egy grafikonnal. Ezen tulajdonságok alapján jött a rövidítés:
representational state transfer.

A felhasznált létező szabványok az URI, mellyel az erőforrások
azonosítója adható meg. Az erőforrások különböző megjelenítési módjait
MIME type-pal lehet megadni, ami lehet egyszerű szöveg, html, xml, vagy
manapság az egyre divatosabb JSON is, vagy speciálisabb esetekben pl.
kép is. A leggyakrabban használt protokoll a HTTP, hiszen ez biztosítja
a kliens-szerver architektúrát, állapotmentességet, cache-elhetőséget,
különböző rétegek kialakítását (akár transzparens módon a titkosítást,
lásd https), valamint ez van átengedve a legtöbb hálózati eszközön,
tűzfalon. A HTTP metódusaival a CRUD műveleteket is megvalósíthatóak, a
legtöbbet használt GET, POST mellett létezik a PUT és DELETE is.
Ugyanúgy, ahogy a klasszikus webszolgáltatások esetében, más protokoll
is választható.

A JAX-RS a JAX-WS-hez hasonlóan egyszerű POJO-kkal dolgozik, melyekre
annotációkat kell használni.

Használatának demonstrálására egy példa projektet készítettem, mely
könyvjelzők nyilvántartását végzi, és [elérhető a
GitHub-on.](https://github.com/vicziani/jtechlog-rest) A következő
URL-eket definiáltam:

-   `/bookmarks`: GET esetén XML vagy JSON formátumban adja vissza az
    eddig elküldött eseményeket, POST esetén az eseményt várja XML vagy
    JSON formátumban, melyet elment
-   `/bookmarks/14`: XML vagy JSON formátumban adja vissza a `14`-es
    azonosítójú eseményt

Első esetben a visszaadott XML:

{% highlight xml %}
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<bookmarks>
 <bookmark>
  <id>1</id>
  <url>http://jtechlog.blogspot.hu</url>
  <title>JTechLog</title>
 </bookmark>
</bookmarks>
{% endhighlight %}

Ugyanez JSON-ben:

{% highlight javascript %}
[{
 "id": 1,
 "url": "http://jtechlog.blogspot.hu",
 "title": "JTechLog"
}]
{% endhighlight %}

Amennyiben egy könyvjelzőt szeretnénk lekérdezni, vagy felküldeni, csak
a `bookmark` tag tartalma használandó. Amennyiben nem XML-lel akarunk
dolgozni, használható az `application/xml` helyett pl. az
`application/json` MIME type is.

Először készítsük el az eseményt reprezentáló osztályt:

{% highlight java %}
@XmlRootElement
public class Bookmark {
 private Long id;

 private String url;

 private String title;

 // konstruktorok, getter/setter metódusok
}
{% endhighlight %}

Figyeljük meg a `@XmlRootElement` annotációt! Utána készítsük el az
erőforrást reprezentáló osztályt:

{% highlight java %}
@Path("/bookmarks")
public class BookmarkResource {

    private static BookmarkDao bookmarkDao = BookmarkDao.getBookmarkDao();

    @GET
    @Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
    public List<Bookmark> listBookmarks() {
        return bookmarkDao.listBookmarks();
    }

    @GET
    @Path("/{id}")
    @Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
    public Bookmark findBookmark(@PathParam("id") long id) {
        Bookmark bookmark = bookmarkDao.findBookmark(id);
        if (bookmark == null) {
            throw new WebApplicationException(Response.Status.NOT_FOUND);
        }
        return bookmark;
    }

    @POST
    @Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
    @Consumes({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
    public Response createBookmark(Bookmark bookmark) {
        Bookmark createdBookmark = bookmarkDao.createBookmark(bookmark);
        return Response.status(Response.Status.CREATED).entity(createdBookmark).build();
    }
}
{% endhighlight %}

Látható, hogy az erőforrásban három metódust definiáltunk, rendre a
következő funkciókkal: könyvjelzők betöltése, könyvjelző betöltése,
könyvjelzők mentése. Mindhárom a `/bookmarks` címen érhető el, mint az
osztályon lévő `@Path` annotáció mutatja. Az első két funkció `GET`
metódussal érhető el, és XML és JSON kimenetet is képes gyártani
(`@Produces` annotáció), a harmadik `POST` metódussal, és képes XML és JSON
bemenetet is fogadni (`@Consumes` annotáció). A második metódusnál
figyeljük meg, hogy az URL-ben megadhatók változók is, melyre később a
`@PathParam` annotációval hivatkozunk.

Ahhoz, hogy a kérés ki is legyen szolgálva, elegendő egy
`@ApplicationPath` annotációval ellátott osztályt készíteni:

{% highlight java %}
@ApplicationPath("resources")
public class JtechlogRestApplication extends ResourceConfig {

    public JtechlogRestApplication() {
        register(org.glassfish.jersey.jackson.JacksonFeature.class);
        packages("jtechlog.rest");
    }
}
{% endhighlight %}

És most nézzük a tesztesetet, mondjuk az események lekérdezését.
Érdekessége, hogy elindít egy inmemory konténert, és azon keresztül
történik a hívás.

{% highlight java %}
@Test
public void testListBookmark() {
 // Given
 BookmarkDao.getBookmarkDao()
  .createBookmark(createBookmark("http://jtechlog.blogspot.hu", "JTechLog"));
 BookmarkDao.getBookmarkDao()
  .createBookmark(createBookmark("https://github.com/vicziani", "GitHub"));

 // When
 List<Bookmark> bookmarks = target("bookmarks")
  .request()
  .accept(MediaType.APPLICATION_JSON_TYPE)
  .get(new GenericType<List<Bookmark>>(){});

 // Then
 assertEquals(2, bookmarks.size());
 assertEquals("JTechLog", bookmarks.get(0).getTitle());
}
{% endhighlight %}

Látható, hogy ez a RESTful web szolgáltatások használata nem csak az API
ismeretét igényli, hanem egy másfajta gondolkodásmódot is.
