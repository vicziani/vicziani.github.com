---
layout: post
title: Statikus erőforrások cache-elése Spring MVC-vel
date: '2015-09-08T23:45:00.000+02:00'
author: István Viczián
---

Webes alkalmazások esetén statikus erőforrásnak nevezzük a JavaScript, valamint a megjelenést biztosító CSS és képi tartalmakat. Ezek ritkán, tipikusan új alkalmazás verzió kiadásakor változnak, így remekül cache-elhetőek, tehermentesítve ezzel a hálózatot és a szervert.

A cache-elés egészen HTTP protokoll szinten támogatott, erről a Google is részletesen ír a [HTTP caching](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/http-caching?hl=en) oldalán. A cache-elés szabályozására alapvetően három eszköz áll rendelkezésünkre. Az egyik a `Cache-Control` szerepeltetése a válasz HTTP fejlécében. A másik ugyanott az `ETag` érték. A harmadik tulajdonképpen egy trükk, miszerint a változott erőforrást más URL-en publikáljuk.

<!-- more -->

Talán a legismertebb a `Cache-Control` használata. Az alapötlet az, hogy utasítjuk a böngészőt, hogy a letöltött erőforrást a meghatározott ideig ne töltse le újra, hanem amennyiben hivatkozás van rá, azt a lokális cache-ből szolgálja ki. Ehhez gyakorlatilag a `Cache-Control` fejléc bejegyzésnél meg kell adnunk a `max-age` értéket.

A következő fejléc bejegyzés tehát azt mondja meg a böngészőnek, hogy amennyiben a következő órában (60 * 60 másodperc) újra hivatkozás történik az adott erőforrásra, azt ne kérje el újra a szervertől.

```
Cache-Control: max-age=3600
```

Az `Etag` használata már ennél trükkösebb. Amennyiben a válasz fejlécben egy `Etag` bejegyzést küldünk, ez azonosítja az adott erőforrás verzióját. Így amennyiben a böngésző úgy dönt, hogy az erőforrást már nem szolgálhatja ki lokális cache-ből, visszaküldi az előbb kapott verzió azonosítót a kérés fejlécének `If-none-match` bejegyzésében. A szerver amennyiben úgy találja, hogy a nála nyilvántartott és a kapott verziószám megegyezik, nem küldi vissza az erőforrás tartalmát, csak egy `304 Not Modified` státuszt. Ebből a böngésző tudja, hogy az erőforrás nem változott, visszaadhatja azt a cache-ből, így spórolva meg a hálózati forgalmat. Ha a szerver különbséget észlel, visszaadja a teljes erőforrást.

A `Cache-Control` bejegyzésnek további értékek is adhatóak. A `no-store` például azt mondja meg, hogy az erőforrást abszolút nem lehet cache-elni. A `no-cache` viszont azt jelenti, hogy ugyan a böngésző cache-elhet, de minden esetben kérdezze meg a szervert, hogy van-e új verzió. A `private` megjelölés azt jelenti, hogy a kiszolgált erőforrás egy adott felhasználóhoz tartozik, így közbülső eszközök azt nem cache-elhetik, kizárólag a felhasználó böngészője. (Létezik a `public` érték is, de ennek kiírása nem kötelező, hiszen a többi cache beállítás explicit jelzi, hogy a tartalom cache-elhető-e vagy sem.

Azonban a statikus erőforrások esetén ez az eszköztár számunkra nem megfelelő. Hiszen egyrészt szeretnénk nagyra állítani a cache időtartamát, hogy a lehető legkevesebb kérés érkezzen a szerverhez, azonban ha új verziót teszünk ki, azt szeretnénk, hogy a böngészők erről azonnal értesüljenek. Ehhez azon kívül, hogy a `max-age` értékét magasra állítjuk, még azt is meg kell tennünk, hogy az erőforrás címébe beletesszük a verziószámot is, például a következőképpen, ahol a verziószám az `1.0`.

```
http://localhost:8080/css/1.0/jtechlog.css
```

Szerencsére a Spring ezeket alapból támogatja. A poszthoz szokás szerint megtalálható [példa projekt a GitHub-on](https://github.com/vicziani/jtechlog-spring-cache).

Kezdjük először a statikus erőforrások cache-elésével. Ehhez a következő XML konfigurációt kell használni, melynek természetesen van Java konfigurációs párja is.

{% highlight xml %}
<mvc:resources mapping="/css/**" location="/css/">
    <mvc:cache-control max-age="31556926" cache-public="true"/>
    <mvc:resource-chain resource-cache="false">
        <mvc:resolvers>
            <mvc:version-resolver>
                <mvc:fixed-version-strategy version="1.0" patterns="/**"/>
            </mvc:version-resolver>
        </mvc:resolvers>
    </mvc:resource-chain>
</mvc:resources>
{% endhighlight %}

Az adott kódrészlet azt jelenti, hogy a `/css` URL-en szereplő statikus erőforrásokat a Spring MVC szolgálja ki, méghozzá úgy, hogy azokat a webalkalmazás (WAR) `css` könyvtárából olvassa fel, és a válasz előállításakor elhelyezi a fejlécben a `max-age` értéket, melyet több, mint egy évre állít. Ahhoz, hogy feloldja az URL-eket, un. `ResourceResolver` példányokat kell deklarálni. A példában egy `VersionResourceResolver` van, mely egy `FixedVersionStrategy` osztályt használ, hogy az `1.0` verziószámot feloldja az URL-ben. Van `ContentVersionStrategy` is, mely MD5 hash-t generál a tartalom alapján. Ez nem túl erőforráskímélő, ezért ekkor mindenképpen állítsuk be a `resource-cache` attribútum értékét `true` értékre. (Fejlesztés közben maradjon `false`.)

Ahhoz azonban, hogy az URL-be be is kerüljön ez a verziószám, legegyszerűbb, ha egy `ResourceUrlEncodingFilter` osztályt használunk. Ez nem csinál más, mint a `ServletResponse` objektumot becsomagolja, és felülírja a `encodeURL` metódusát, hogy ezt hívva a megfelelő helyen bekerüljön a verziószám az URL-be. A következőképp deklarálhatjuk a `web.xml` fájlban.

{% highlight xml %}
<filter>
    <filter-name>ResourceUrlEncodingFilter</filter-name>
    <filter-class>org.springframework.web.servlet.resource.ResourceUrlEncodingFilter</filter-class>
</filter>
{% endhighlight %}

Ekkor a JSP-ben amennyiben a `c:url` taget használjuk, az URL kiegészül a verziószámmal. Azaz a következő JSP részletből:

{% highlight xml %}
<link href="<c:url value='/css/jtechlog.css' />" rel="stylesheet" 
	type="text/css" />
{% endhighlight %}

A következő HTML részlet generálódik:

{% highlight xml %}
<link href="/css/1.0/jtechlog.css" rel="stylesheet" type="text/css" />
{% endhighlight %}

A verziószámot több helyről is vehetjük, egy pár példát említ egy korábbi, [Verziószám megjelenítése az alkalmazásban](/2011/09/13/verzioszam-megjelenitese.html) című posztom.

A böngésző Web Developer tooljában (Firefox esetén), vagy Developer tools (Chrome esetén) azt látjuk, hogy az első kérés `200 OK` státuszkódot ad vissza, míg a másodikat már cache-ből szolgálja ki. Ne zavarjon meg minket, hogy refresh esetén (F5 billentyű) újra lekéri, ekkor már `304 Not Modified` státuszt kapunk. A böngészőt kérhetjük arra, hogy ne használjon cache-t, és mindenképpen kérje le a tartalmat a szerverről, erre Shift+Refresh (Ctrl + F5 billentyűkombináció) megnyomásával utasíthatjuk.


