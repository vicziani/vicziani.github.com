---
layout: post
title: JWT és Spring Security
date: '2019-03-18'
last_modified_at: '2026-06-20'
author: István Viczián
description: Ez a poszt leírja, mi a JWT és hogyan használjuk Spring Security-vel.
tags:
- Java
- Spring
- Architektúra
- Biztonság
---

Technológiák: Spring Boot 4, Spring Security 7, JWT

Manapság a felhő alapú alkalmazások elterjedésével egyre fontosabb, hogy
azok állapotmentesek legyenek, hiszen ezáltal könnyebben skálázhatóak.
Sok alkalmazást láttam, melyek ezt az igényt kielégítik, azonban a bejelentkezett
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

{% include github-callout.html url="https://github.com/vicziani/jtechlog-springsec-jwt" %}

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
* A böngésző elküldi a felhasználónevet és jelszót a http post kérés törzsében 
* Az alkalmazás ezt ellenőrzi, és sikeres belépés esetén kiállít egy tokent, melyet elektronikusan aláírt, és szerepel benne
a felhasználónév
* Az alkalmazás visszaküldi a tokent a böngészőnek, http only cookie-ként
* A böngésző a következő kérésben már elküldi a cookie-t, mely tartalmazza a tokent
* Az alkalmazás kiolvassa a tokent, ellenőrzi az elektronikus aláírást, majd a tokenben lévő felhasználónév alapján 
azonosítja a felhasználót és kiszolgálja a kérést

Nézzük meg egy Spring Boot alkalmazás esetén, mely csak RESTful webszolgáltatásokkal rendelkezik, hogyan kell a JWT alapú
autentikációt implementálni.

A Spring Security mélyebb megismeréséhez érdemes elolvasni a [Spring Security és Spring Boot posztomat](/2023/03/28/spring-security-spring-boot.html)
is.

A `pom.xml`-be a függőségek közé fel kell venni a következőt:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-oauth2-resource-server</artifactId>
</dependency>
```

A Spring Security a konfigurációja a `WebSecurityConfig` osztályban található.

```java
@Bean
public SecurityFilterChain securityFilterChain(
        HttpSecurity http, 
        BearerTokenResolver bearerTokenResolver) {
    http
            .csrf(AbstractHttpConfigurer::disable) // 1
            .sessionManagement(session -> 
                    session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // 2
            .authorizeHttpRequests(auth -> auth
                    .requestMatchers("/api/auth")
                    .permitAll()
                    .anyRequest()
                    .authenticated()) // 3
            .oauth2ResourceServer(conf -> conf
                    .bearerTokenResolver(bearerTokenResolver)
                    .jwt(Customizer.withDefaults())); // 4
    return http.build();
}
```

A lépések:

1. Beállítjuk, hogy ne legyen CSRF token ellenőrzés.
2. Beállítjuk, hogy ne legyen session, így az alkalmazásunk
állapotmentes, nem oda történik a felhasználó mentése.
3. Beállítjuk, hogy a `/api/auth` URL ne legyen védett, az 
összes többi bejelentkezéshez kötött.
4. Beállítjuk, hogy JWT token alapú bejelentkezés legyen,
és a feloldása a cookie-ból történjen, és ne az alapértelmezett beállításból, az `Authorization` headerből.

A 4. ponthoz kell a következő kódrészlet is, ahol a `bearerTokenResolver`-t hozzuk létre:

```java
@Bean
public BearerTokenResolver bearerTokenResolver() {
    return request -> {
        Cookie[] cookies = request.getCookies();

        if (cookies == null) {
            return null;
        }

        return Arrays.stream(cookies)
                .filter(cookie -> "access_token".equals(cookie.getName()))
                .map(Cookie::getValue)
                .findFirst()
                .orElse(null);
    };
}
```

A konfigurációban még meg kell adni, hogy honnan kell betölteni a felhasználókat.
Jelen esetben a memóriából.

```java
@Bean
public UserDetailsService userDetailsService() {
    return new InMemoryUserDetailsManager(
            User
                    .withUsername("user")
                    .password("{noop}user")
                    .roles("USER")
                    .build()
    );
}
```

Valamint ahhoz, hogy token generálásnál be tudjuk jelentkeztetni a felhasználót, szükséges, hogy legyen
egy `AuthenticationManager` az application contextben.

```java
@Bean
public AuthenticationManager authenticationManager(
        AuthenticationConfiguration configuration) {
    return configuration.getAuthenticationManager();
}
```

A token generáláshoz kell egy titkos kulcs, amivel aláírjuk a tokent, és
kell egy encoder és decoder is a contextbe.

```java
private final OctetSequenceKey jwk = new OctetSequenceKey.Builder(
        Base64URL.from("eQHD2h293EzWJtGdZ3cb2KmLV3gTxSyna-NeHKCwZ4s"))
        .build();

@Bean
public JwtEncoder jwtEncoder() {
    JWKSource<SecurityContext> source = new ImmutableJWKSet<>(new JWKSet(jwk));
    return new NimbusJwtEncoder(source);
}

@Bean
public JwtDecoder jwtDecoder() {
    return NimbusJwtDecoder.withSecretKey(jwk.toSecretKey()).build();
}
```

Utána kell megírni a controllert, ami kiadja a tokent. Ehhez először kell egy
dto, ami a felhasználónevet és a jelszót tartalmazza, ez a POST http kérés
törzséből kerül példányosításra.

```java
public record TokenRequest(String username, String password) {
}
```

Majd álljon itt a controller kódja:

```java
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class TokenController {

    private final AuthenticationManager authenticationManager;

    private final JwtEncoder jwtEncoder;

    @PostMapping
    public ResponseEntity<Void> token(@RequestBody TokenRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.username(), request.password())); // 1
        
        String scope = authentication.getAuthorities()
                .stream().map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(" ")); // 2

        Instant now = Instant.now();
        JwtClaimsSet claims =
                JwtClaimsSet.builder()
                        .issuer("self")
                        .issuedAt(now)
                        .expiresAt(now.plus(30, ChronoUnit.MINUTES))
                        .subject(authentication.getName())
                        .claim("scope", scope)
                        .build(); // 3

        JwsHeader header = JwsHeader.with(MacAlgorithm.HS256).build(); // 4

        String token = jwtEncoder.encode(JwtEncoderParameters.from(header, claims)).getTokenValue(); // 5

        ResponseCookie cookie = ResponseCookie.from("access_token", token)
                .httpOnly(true)
                .secure(true)
                .sameSite("Lax")
                .path("/")
                .maxAge(0)
                .build(); // 6

        return ResponseEntity.noContent()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .build(); // 7
    }

}
```

A lépések:

1. Bejelentkeztetjük a felhasználót a felhasználónévvel és jelszóval, hogy le tudjuk kérdezni a tulajdonságait.
2. Lekérdezzük a felhasználó szerepköreit.
3. Létrehozzuk a JWT token mezőit, és feltöltjük értékekkel.
4. Beállítjuk a JWT token fejlécét.
5. Megtörténik a JWT token kódolása, előáll az headerben is szállítható Base64-gyel kódolt érték.
6. Létrehozzuk a különböző támadási módoknak ellenálló cookie-t.
7. Visszatérünk egy üres válasszal és beállított cookie-val.

Ekkor ha elmegy a következő kérés:

```plain
POST http://localhost:8080/token
Content-Type: application/json

{
    "username": "user",
    "password": "user"
}
```

Akkor visszakapunk egy http választ, ahol beállításra kerül a cookie:

```plain
HTTP/1.1 204 
Set-Cookie: access_token=aaa.bbb.ccc; Path=/; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Secure; HttpOnly; SameSite=Lax
```

És a következő kéréssel már lekérhetünk egy védett oldalt:

```plain
GET http://localhost:8080/api/hello
Cookie: access_token=aaa.bbb.ccc
```

És végül álljon itt egy gif animáció (a képre kattintva elérhető), mely bemutatja, hogy működik a bejelentkezés
Postmannel.

<a href="/artifacts/posts/images/jwt-postman.gif" class="glightbox"><img src="/artifacts/posts/images/jwt-postman_750.png" alt="RESTful hívások Postmannel" /></a>