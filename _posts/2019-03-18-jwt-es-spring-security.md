---
layout: post
title: JWT és Spring Security
date: '2019-03-18T21:00:00.000+01:00'
author: István Viczián
description: Ez a poszt leírja, mi a JWT és hogyan használjuk Spring Security-vel.
---

Technológiák: Spring Boot 2.1.3.RELEASE, Spring Security 5.1.4.RELEASE,

Manapság a felhő alapú alkalmazások elterjedésével egyre fontosabb, hogy
azok állapotmentesek legyenek, hiszen ezáltal könnyebben skálázhatóak.
Sok alkalmazást láttam, mely ezt az igényt kielégítik, azonban a bejelentkezett
felhasználót mégis sessionben tárolták. Így a bejelentkezés tényének megőrzése
miatt mégis kellett állapotot tárolni, ami miatt a sessiont kellett szinkronizálni
az alkalmazás példányok között, vagy megosztott tárat (pl. elosztott cache-t) alkalmazni,
esetleg sticky sessiont (, mikor a felhasználót mindig ugyanaz az alkalmazás 
példány szolgálja ki).

Divatos architektúra mikor a frontend HTML/CSS/JavaScript, és a backenddel
RESTful webszolgáltatásokkal kommunikál. Valamint a microservice-ek 
elterjedésével is szerepet nyernek a RESTful webszolgáltatások. Itt megint elvárás,
hogy ezek állapotmentesek legyenek. Azaz a bejelentkezés ténye ne legyen szerver
oldalon tárolva.

Ezen problémák kiküszöbölésére használható a _JSON Web Tokens_ (továbbiakban JWT)
szabvány ([RFC 7519](https://tools.ietf.org/html/rfc7519)). Az alapötlet egyszerű.
A bejelentkezés után a sikeres bejelentkezés tényét, a felhasználónevet és egyéb hasznos adatokat 
(pl. a felhasználó szerepköreit)
a szerver becsomagol egy tokenbe, amit elektronikusan aláír, és eljuttat a kliensnek,
ez esetben a böngészőnek. A böngésző minden egyes kéréssel elküldi a tokent, melyet
a szerver ellenőriz, hogy hiteles-e, tényleg ő állította-e ki, majd használja a
tokenben lévő adatokat. Így a szerver oldalon nem kell állapotot tárolni,
a bejelentkezés tényét a kliens mindig újra elküldi.

A token úgy lett megtervezve, hogy rövid, tetszőlegesen bővíthető,
és akár URL-ben is átadható legyen.

A JWT ezen kívül másra is használható, pl. alkalmazások között átadni a bejelentkezés
tényét (egyfajta SSO megoldásként), valamint pl. egyszeri bejelentkezés esetén akár
e-mailben kiküldhető, melyben egy link paraméterként tartalmazza a tokent.

Ebben a posztban nézzük meg, hogyan is működhet egy JWT alapú autentikáció, és
hogyan kell azt Spring Security-val implementálni.

A poszthoz egy példa [projekt is elérhető a GitHubon](https://github.com/vicziani/jtechlog-springsec-jwt).

<!-- more -->

A token három részből áll. Az első rész (_Header_) írja le, hogy az elektronikus aláírás elkészítése milyen
algoritmussal történt. Az algoritmus lehet HMAC (titkos kulcs és hash függvény kombinációja),
vagy történhet kulcspárral, RSA vagy ECDSA algoritmusokkal.

A második rész (_Payload_) tartalmazza JSON formátumban a konkrét adatokat.
Vannak szabványos mezők, pl. a Subject (`sub`), mely tartalmazhatja a felhasználó nevét, az Expiration Time (`exp`)
a lejárat idópontja, az Issued at (`iat`), mely a kiadás időpontja. Ezen kívül el lehet helyezni benne saját mezőket is.
A harmadik rész (_Signature_) tartalmazza az elektronikus aláírást. Azért, hogy URL paraméterként könnyen átadható legyen,
a token három része  Base64url Encoding kódolással van kódolva, és pont (`.`) karakterrel elválasztva. A Base64url Encoding
a Base64 kódolás azon formája, amikor az URL-ben használatos `+` és `/` jeleket kicseréljük rendre `-` és `_` karakterekre,
valamint elhagyjuk a padding karaktert (, az egyenlőségjelet, azaz `=`).

Egy példa JWT token:

```
eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ1c2VyIiwiYXV0aG9yaXRpZXMiOlsiVVNFUiJdLCJpYXQiOjE1NTMzNTkyMDIsImV4cCI6MTU1MzM2MTAwMn0.cSyALuca7ob9l5b_X1wbP5Aj0JlZWM3To9OyigpBKRAXQFvB1_aBJ1PnI3LcvDRYwE1FehqHwKaecHHWUXe9ow
```

Ennek payload része:

```javascript
{
  "sub": "user",
  "authorities": [
    "USER"
  ],
  "iat": 1553359202,
  "exp": 1553361002
}
```

Az aláírás `HS512` algoritmussal történt, a secret `jtechlog`, ezzel lehet az aláírást és ezzel a JWT tokent ellenőrizni.
Ez a `https://jwt.io/#debugger` címen is megtehető.

![JWT Debugger](/artifacts/posts/images/jwt-debugger_750.png)

Természetesen a token birtoklása belépést biztosít az azt kiállító rendszerbe, ezért nagyon kell rá vigyázni.
Mindig használjunk https protokollt, és válasszunk meg reális lejárati időt.

Hol tároljuk böngésző oldalon a JWT tokent? Sokan azt a megoldást választják, hogy a tokent `Authorization` fejlécben
küldik, azonban ehhez azt a belépés után el kéne tárolni a sorozatos RESTful hívásokhoz. Ez persze történhet
a böngésző memóriájában, egy JavaScript változóban, azonban oldalváltáskor olyan helyen kéne tárolni, ahol megmarad.
Ez lehet pl. Web Storage, vagy egyszerű cookie is. Azonban
mindkettő megszerezhető XSS támadással. Ezért érdemes kizárólag HttpOnly cookie-ban tárolni. Ugyanis ehhez nem
lehet hozzáférni JavaScriptből, kizárólag a böngésző küldi mindig vissza a http kérés fej részében.

A bejelentkezés folyamata a következő lehet:

* A felhasználó a böngészőben megadja a felhasználónevét és jelszavát
* A böngésző elküldi a felhasználónevet és jelszót
* Az alkalmazás ezt ellenőrzi, és sikeres belépés esetén kiállít egy tokent, melyet elektronikusan aláírt, és szerepel benne
a felhasználónév
* Az alkalmazás visszaküldi a tokent a böngészőnek, cookie-ként
* A böngésző a következő kérésben már elküldi a cookie-t, mely tartalmazza a tokent
* Az alkalmazás kiolvassa a tokent, ellenőrzi az elektronikus aláírást, majd a tokenben lévő felhasználónév alapján 
azonosítja a felhasználót és kiszolgálja a kérést

Nézzük meg egy Spring Boot alkalmazás esetén, mely csak RESTful webszolgáltatásokkal rendelkezik, hogyan kell a JWT alapú
autentikációt implementálni.

A Spring Security mélyebb megismeréséhez érdemes elolvasni a [Spring Security posztomat](/2010/01/10/spring-security.html)
is.

A Spring Security a `WebSecurityConfigurerAdapter` osztály leszármaztatásával, a `configure(HttpSecurity)` metódus
felülírásával konfigurálható.

```java
@Override
protected void configure(HttpSecurity http) throws Exception {
    String secret = environment.getProperty(SECRET_PROPERTY_NAME);
    JwtCookieStore jwtCookieStore = new JwtCookieStore(secret.getBytes());
    http.csrf().disable()
            .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS) // 1
            .and()
            .exceptionHandling()
                .authenticationEntryPoint(WebSecurityConfig::handleException) // 2
            .and()
            .addFilter(new JwtUsernameAndPasswordAuthenticationFilter(jwtCookieStore, 
                authenticationManager())) // 3
            .addFilterAfter(new JwtTokenAuthenticationFilter(jwtCookieStore), 
              UsernamePasswordAuthenticationFilter.class) // 4
            .authorizeRequests() // 5
            .antMatchers(HttpMethod.POST, "/api/auth/**").permitAll()
            .antMatchers("/**").hasRole("USER")
            .anyRequest().authenticated();
}
```

Nézzük, hogy ebben a konfigurációban mi mit jelent.

Az `1`-essel jelölt sorban beállítjuk, hogy ne legyen session, így az alkalmazásunk
állapotmentes, nem oda történik a felhasználó mentése.

Az `5`-össel jelölt sorban az `authorizeRequests()` után beállítjuk, hogy az `/api/auth` cím
ne legyen védett, mert ott történik az autentikáció, viszont az összes címhez `ROLE_USER`
jogosultság szükséges (a `ROLE_` előtagot később automatikusan elékonkatenálja).

A `2`-essel jelölt sor, az `exceptionHandling()` után mondja meg, hogy pontosan mi történjen,
ha védett cím kerül lekérésre, és nincs bejelentkezve. Ez a következőképp implementáltam:

```java
private static void handleException(HttpServletRequest req, HttpServletResponse rsp, 
        AuthenticationException e) throws IOException {
    PrintWriter writer = rsp.getWriter();
    writer.println(new ObjectMapper().writeValueAsString(
        new AuthorizationResponse("error", "Unauthorized")));
    rsp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
}
```

Itt egy saját `AuthorizationResponse` objektum kerül JSON-né alakításra, és kerül visszaküldésre
`401`-es státuszkóddal.

Valahogy így:

```javascript
{"status":"error","message":"Unauthorized"}
```

A `3`-assal jelölt sor egy saját filtert ad hozzá, mely feladata, hogy amennyiben a `/api/auth`
címre kérés érkezik, annak tartalmából kiolvassa a felhasználónevet és jelszót, autentikálja
a felhasználót, és sikeres esetben elhelyezi a JWT tokent HttpOnly cookie-ban.

Az a legegyszerűbb, ha kiterjesztjük a `UsernamePasswordAuthenticationFilter` osztályt. A
konstruktorában meghívjuk az ős konstruktorát a `/api/auth` címmel, hogy itt kell várnia a
bejelentkezési adatokat.

```java
@Override
public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response)  {
    UserCredentials credentials = readUserCredentials(request);

    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
        credentials.getUsername(), credentials.getPassword(), 
        Collections.emptyList());

    return authenticationManager.authenticate(authToken);
}
```

A `UserCredentials` saját osztály, melyet a kérésben átadott JSON-ből deszerializáljuk a `readUserCredentials`
metódusból. A kérésnek tehát így kell kinéznie:

```javascript
{
	"username": "user",
	"password": "user"
}
```

Sikeres esetben a `successfulAuthentication()` metódus fut le, mely egyrészt elhelyezi a JWT tokent cookie-ként a válaszban,
majd visszaad egy JSON választ.

```java
@Override
protected void successfulAuthentication(HttpServletRequest request, 
        HttpServletResponse response, 
        FilterChain chain, Authentication auth) throws IOException {
    jwtCookieStore.storeToken(response, auth);

    writeResponse(response);
}
```

A válasz JSON tartalma:

```javascript
{"status":"ok","message":"Successful authentication"}
```

A JWT token elhelyezésének a kódja:

```java
public void storeToken(HttpServletResponse response, Authentication auth) {
    long now = System.currentTimeMillis();

    String token = Jwts.builder()
        .setSubject(auth.getName())
        .claim("authorities", auth.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority).collect(Collectors.toList()))
        .setIssuedAt(new Date(now))
        .setExpiration(new Date(now + EXPIRATION))
        .signWith(SignatureAlgorithm.HS512, secret)
        .compact();
        
    Cookie cookie = new Cookie(COOKIE_NAME, token);
    cookie.setMaxAge(EXPIRATION);
    cookie.setPath("/api");
    cookie.setHttpOnly(true);
    response.addCookie(cookie);
}
```

Látható, hogy a token a [Java JWT](https://github.com/jwtk/jjwt) library-vel kerül
legenerálásra, ehhez a következő függőséget kellett elhelyezni a `pom.xml` fájlban.

```xml
<dependency>
  <groupId>io.jsonwebtoken</groupId>
  <artifactId>jjwt</artifactId>
  <version>0.9.1</version>
</dependency>
```

Egyrészt beállítom a standard `sub` (Subject) mezőt, valamint saját mezőt is adok hozzá
`authorities` névvel, valamint beállítom a létrehozás dátumát, valamint a lejárat dátumát.
Legvégül HS512 algoritmussal aláírom, megadva a titkos kulcsot.

A metódus második részében beállítom a HttpOnly cookie-t, ugyanazzal a lejárattal.

Eztán már csak a `4`-es pontban megadott `JwtTokenAuthenticationFilter` osztályt kell megnézni.
Ennek feladata, hogyha a böngésző cookie-t küld, ezt kicsomagolja, ellenőrzi, majd ez
alapján bejelentkezteti a felhasználót.

Ennek kódja valami hasonló:

```java
@Override
protected void doFilterInternal(HttpServletRequest request,
                                HttpServletResponse response,
                                FilterChain chain) throws ServletException, IOException {
    try {
        jwtCookieStore.retrieveToken(request)
                .ifPresent(auth -> SecurityContextHolder.getContext()
                .setAuthentication(auth));
    } catch (Exception e) {
        SecurityContextHolder.clearContext();
    }

    chain.doFilter(request, response);
}
```

Ez lekéri a tokent, és ha megtalálható, bejelentkezteti a felhasználót. Nézzük meg,
hogy lehet lekérni a tokent.

```java
public Optional<Authentication> retrieveToken(HttpServletRequest request) {
    Optional<Cookie> cookie = findCookie(request);
    if (cookie.isEmpty()) {
        return Optional.empty();
    }
    String token = cookie.get().getValue();

    Claims claims = Jwts.parser()
            .setSigningKey(secret)
            .parseClaimsJws(token)
            .getBody();

    String username = claims.getSubject();
    if (username != null) {
        @SuppressWarnings("unchecked")
        List<String> authorities = (List<String>) claims.get("authorities");

        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                username, null, 
                authorities.stream().map(SimpleGrantedAuthority::new)
                    .collect(Collectors.toList()));

        return Optional.of(auth);
    }
    return Optional.empty();
}
```

Itt csak lekérésre kerül a cookie, majd a Java JWT ellenőrzi azt, ezért kellett megadni
a titkos kulcsot is. Majd a felhasználónév és a jogosultságok is lekérésre kerülnek.

És végül álljon itt egy gif animáció (a képre kattintva elérhető), mely bemutatja, hogy működik a bejelentkezés
Postmannel.

<a href="/artifacts/posts/images/jwt-postman.gif" data-lightbox="post-images"><img src="/artifacts/posts/images/jwt-postman_750.png" alt="RESTful hívások Postmannel" /></a>