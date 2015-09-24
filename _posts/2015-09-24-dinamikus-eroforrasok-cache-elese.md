---
layout: post
title: Dinamikus erőforrások cache-elése Spring MVC-vel
date: '2015-09-24T23:00:00.000+02:00'
author: István Viczián
---

Az előző [poszt](/2015/09/08/statikus-eroforrasok-cache-elese.html) 
bemutatta, hogyan működik a HTTP protokoll szintű cache-elés, valamint
Spring MVC segítségével hogyan lehet olyan statikus erőforrásokat (pl.
CSS és JavaScript állományok) cache-elni. Ott szó esett az `Etag` HTTP
fejlécről is, ez a poszt ennek használatát mutatja be dinamikus erőforrások
esetén.

Emlékeztetőül egy erőforrás lekérdezésekor annak verziójának egy 
azonosítóját is küldjük a HTTP válasz `Etag` fejlécében. Amennyiben a 
böngésző nem automatikusan a cache-ből szolgálja ki az erőforrást, 
megkérdezi a szervert, hogy történt-e ott módosítás. Ezt úgy teszi, hogy
elküldi a kapott verziószámot a HTTP kérés `If-none-match` fejlécében. 
Amennyiben a szerver azt látja, hogy az erőforrás nem változott, azaz az 
aktuális és a küldött verziószám megegyezik, akkor egy `304 Not Modified`
státuszt küld vissza a böngészőnek. Ekkor a böngésző a tartalmat a 
cache-ből fogja kiszolgálni. Amennyiben az erőforrás változott, és a két
verziószám eltér, a szerver visszaküldi az erőforrás teljes tartalmát.

A GitHubon lévő 
[példakód](https://github.com/vicziani/jtechlog-spring-cache)
szemlélteti, hogy hogyan használhatjuk az ETaget Springes controller
osztályból.

Az Etag beállítása a `ResponseEntity` használatával történhet, ahogy a 
következő példa is mutatja.

{% highlight java %}
@RequestMapping(value = "/employees", method = RequestMethod.GET)
public ResponseEntity<List<Employee>> findAll() {
    List<Employee> employees = employeeService.findAll();
    return ResponseEntity
            .ok()
            .eTag(hashToEtag(employees))
            .body(employees);
}
{% endhighlight %}

Itt az Etag értékét a `hashToEtag` metódus az objektum hashkódja alapján 
számolja. Amire vigyázni kell, hogy aposztrófok között kell szerepelnie.

{% highlight java %}
private String hashToEtag(Object o) {
    return "\"" + Integer.toString(o.hashCode()) + "\"";
}
{% endhighlight %}

A példában ez azért működik, mert bár az osztályok `hashCode()` metódusát
ugyan nem írtam felül, de egy `ConcurrentMap` alapú cache-ben eltároltam, 
így nem kerülnek újra lepéldányosításra, ezért hashkódjuk megmarad. 
Módosítás esetén a cache-be új példány kerül, így új hashkódja lesz.

Nézzük meg, hogy hogyan is működik. Teszteléshez a 
[HTTPie](https://github.com/jkbrzt/httpie) eszközt használtam, mely 
hasonló, mint a curl, csak egyszerűbben használható, és a kimenete 
színezett, ezért könnyebben olvasható.

Először tehát lekérjük az alkalmazottak listáját (a lényegtelen sorokat 
töröltem).


	vicziani@jtechlog:~$ http get localhost:8080/api/employees
	HTTP/1.1 200 OK
	Content-Type: application/json;charset=UTF-8
	ETag: "785565526"

	[
		{
		    "id": 1, 
		    "name": "John Doe"
		}
	]


Látható, hogy egy elemű lista. Ha még egyszer lekérjük, immár a 
`If-none-match` fejléccel, `304 Not Modified` választ kapunk.

	vicziani@jtechlog:~$ http get localhost:8080/api/employees 'If-none-match:"785565526"'
	HTTP/1.1 304 Not Modified
	ETag: "785565526"

Felveszünk egy új entitást.


	vicziani@jtechlog:~$ http post localhost:8080/api/employees name='John Roe'
	HTTP/1.1 200 OK
	Content-Type: application/json;charset=UTF-8

	{
		"id": 2, 
		"name": "John Roe"
	}

Majd újra lekérjük az alkalmazottak listáját.

	vicziani@jtechlog:~$ http get localhost:8080/api/employees 'If-none-match:"785565526"'
	HTTP/1.1 200 OK
	Content-Type: application/json;charset=UTF-8
	ETag: "-1478013167"

	[
		{
		    "id": 1, 
		    "name": "John Doe"
		}, 
		{
		    "id": 2, 
		    "name": "John Roe"
		}
	]

Láthatjuk, hogy most már `200 OK` státuszt kapunk, és az erőforrás újra 
letöltésre kerül új Etaggel.

![HTTPie](/artifacts/posts/2015-09-24-dinamikus-eroforrasok-cache-elese/httpie.png)

Ugyanez megfogalmazva a [Spring MVC Test Frameworkkel](http://docs.spring.io/spring/docs/current/spring-framework-reference/htmlsingle/#spring-mvc-test-framework) a következőképp néz 
ki.

{% highlight java %}
@Test
public void getEmployeeNotModified() throws Exception {
    String etag = this.mockMvc.perform(get("/api/employees"))
            .andReturn().getResponse().getHeader("ETag");

    this.mockMvc.perform(get("/api/employees")
            .header("If-none-match", etag))
            .andExpect(status().isNotModified());
}

@Test
public void getEmployeeModified() throws Exception {
    String etag = this.mockMvc.perform(get("/api/employees"))
            .andReturn().getResponse().getHeader("ETag");

    this.mockMvc.perform(post("/api/employees")
            .contentType(MediaType.APPLICATION_JSON)
            .content("{\"name\": \"John Roe\"}"));

    this.mockMvc.perform(get("/api/employees")
            .header("If-none-match", etag))
            .andExpect(status().isOk());
}
{% endhighlight %}


