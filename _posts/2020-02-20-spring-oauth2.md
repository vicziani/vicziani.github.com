---
layout: post
title: OAuth 2.0 Spring Boot és Spring Security keretrendszerekkel
date: '2020-02-19T11:00:00.000+01:00'
modified_time: '2023-12-15T10:00:00.000+01:00'
author: István Viczián
description: Mi az az OAuth 2.0, és hogyan használjuk vállalati környezetben Spring Boot és Spring Security keretrendszerekkel.
---

Használt technológiák: Spring Boot 3, Spring Security 6, Keycloak 16

Frissítve: 2023. december 15.

Bejelentkezés és jogosultságkezelés témakörben az egyik legelterjedt szabvány az OAuth 2.0.
Vállalati környezetben nem érdemes saját felhasználókezelést 
implementálni, hiszen erre már létező kész megoldások vannak, ebből az egyik a
nyílt forráskódú [Keycloak](https://www.keycloak.org/), amihez
könnyen lehet egy Spring Boot alkalmazást integrálni.

Az OAuth egy nyílt szabány erőforrás-hozzáférés kezelésére, vagy ismertebb nevén
authorizációra (authorization). Alapja, hogy elválik, hogy a felhasználó mit is akar
igénybe venni, és az, hogy hol jelentkezik be. A legismertebb példa erre az, hogy
mostanában ha igénybe akarunk venni egy online szolgáltatást, akkor nem feltétlen
kell magunkat regisztrálnunk, hanem bejelentkezhetünk a Google vagy Facebook
fiókunk használatával is. Ehhez az említett oldalon lehet bejelentkezni, ott megadni a
jelszavunkat, majd folytathatjuk az online szolgáltatás oldalán a tevékenységünket.
Nagy előnye, hogy egyrészt nem kell annyi jelszót megjegyeznünk, valamint az OAuth
kialakítása miatt nem kell a jelszavunk megadni egy harmadik félnek.

Ha valaki most itt abbahagyná az olvasást, hogy az alkalmazásába nem akar
sem Facebook, sem Google bejelentkezést, az is olvasson tovább. Ugyanis az OAuth
szabvány használatával természetesen saját authorizációt is megvalósíthatunk,
sőt, ez a javasolt mód, különösen microservices architektúra használata esetén. 
Ugyanis nagyon hamar eljuthatunk oda, hogy nem csak egy
alkalmazást akarunk üzemeltetni, hanem kettőt, és nem szeretnénk, ha a felhasználóinknak
több jelszót kelljen megjegyezniük. Ezt Single Sign-On-nak (SSO), egyszeri bejelentkezésnek
nevezzük. És ez nem csak a felhasználóinknak jó, hanem a fejlesztőinknek is, hiszen ha
kitaláljuk, hogy módosítani szeretnénk az autentikáción vagy authorizáción,
például kétfaktoros autentikációt szeretnénk bevezetni, akkor elegendő egy helyen módosítani,
nem kell módosítani a többi alkalmazáson. Erre jó példa, hogy a Google különböző
szolgáltatásaiba sem kell külön bejelentkeznünk, mint pl. a GMail, YouTube vagy
Maps.

<!-- more -->

## OAuth 2.0

Az OAuth 2.0 annyi módosítást hozott, hogy a fejlesztőknek sokkal egyszerűbb dolga van
a különböző mechanizmusok megvalósításakor, valamint különböző
forgatókönyveket javasol különböző alkalmazásokhoz, úgymint desktop alkalmazásokhoz,
klasszikus webes alkalmazásokhoz, csak böngészőben futó kliens oldali webes alkalmazásokhoz,
vagy mobil kliens alkalmazásokhoz.

Az OAuth a következő szereplőket definiálja. (Innentől kezdve az érthetőség
kedvéért kicsit pongyolább leszek, hiszen az OAuth mindent _is_ támogat, és
inkább csak a gyakoribb eseteket részletezném, nem akarom a kivételekkel elbonyolítani
a leírást.)

* Resource Owner: aki hozzáfér az erőforráshoz, a szolgáltatáshoz, humán esetben a felhasználó (de lehet alkalmazás is)
* Client: a szoftver, ami hozzá akar férni a felhasználó adataihoz, tipikusan a frontend alkalmazás
* Authorization Server: ahol a felhasználó adatai tárolva vannak, és ahol be tud lépni, esetünkben a KeyCloak server
* Resource Server: ahol a felhasználó igénybe veszi az erőforrásokat, a szolgáltatást, tipikusan a backend alkalmazás, REST API-val

Vigyázzunk, nincs meghatározva, hogy ezek külön alkalmazások legyenek, ugyanaz az
alkalmazás akár több szerepkört is betölthet.

Az elején meg kell adni a Grant Type-ot, ami megmondja, hogy a további lépések milyen
forgatókönyv alapján kerüljenek végrehajtásra. A következő Grant Type-ok vannak:

* Authorization Code: klasszikus mód, ahogy egy webes alkalmazásba lépünk Facebook vagy a Google segítségével, a legbiztonságosabb, de legkomplexebb megoldás
* Implicit: mobil alkalmazások, vagy csak böngészőben futó alkalmazások használják. Ez deprecated, már ne használjuk!
* Resource Owner Password Credentials: ezt olyan megbízható alkalmazások használják, melyek maguk kérik be a jelszót. Ez deprecated, már ne használjuk!
* Client Credentials: ebben az esetben nem a felhasználó kerül azonosításra, hanem az alkalmazás önmaga

Fontos fogalom még a token, mely a belépés tényét igazoló információ darabka. A token
visszavonható, vagy akár le is járhat.

Most nézzük meg, hogy hogy működik az Authorization Code Grant Type, mely webes alkalmazásoknál javasolt:

* A felhasználó elmegy az alkalmazás oldalára
* Az átirányít a Authorization Serverre (pl. Google vagy Facebook), megadva a saját azonosítóját (client id), hogy hozzá szeretne férni a felhasználó adataihoz
* Az Authorization Serveren a felhasználó bejelentkezik
* Az Authorization Serveren a felhasználó jogosultságot ad az alkalmazásnak, hogy hozzáférjen a felhasználó adataihoz
* Az Authorization Server visszairányítja a felhasználót az alkalmazás oldalára, url paraméterként átadva neki egy úgynevezett
  authorization code-ot
* Az alkalmazás megkapja az authorization code-ot, és ezt, valamint a saját azonosítóját (client id), a saját, alkalmazáshoz tartozó "jelszavát" (client secret) felhasználva lekéri az Authorization Servertől a felhasználóhoz tartozó tokent
* Az alkalmazás visszakapja a tokent, mely hordozza a felhasználó adatait

Figyeljük meg, hogy a token lekérése csakis védett csatornán mehet, hiszen aki hozzáfér a client secret-hez, az az adott alkalmazás
nevében lesz képes eljárni.

Azt is láthatjuk, hogy ahhoz, hogy ez működni tudjon, az Authorization Serveren fel kell venni az alkalmazást, és ott el lesz tárolva annak azonosítója (client id), neve, címe, "jelszava" (client secret) és az alapértelmezett url (Redirect URI or Callback URL), ahova vissza kell irányítani a felhasználót. A bejelentkezésnél ezt az alkalmazás felül is bírálhatja url paraméterben, és akkor máshova fogja a felhasználót
visszadobni az Authorization Server. Az Authorization Server ezt is ellenőrzi, nem lehet bármilyan címre átirányítást kérni.

A Client Credentials Grant Type-nál ahogy említettem az alkalmazás önmagát azonosítja.

Beszélni kell még magáról a tokenről is. Ez lehet JSON Web Token (JWT), melyről az előző posztban esett már szó, JSON formátumban
önmaga tárolja a felhasználó adatait.

Hogyan bizonyosodjunk meg arról, hogy a JWT tokent nem egy támadó állította össze, és küldte be? Erre való a JSON Web Signature (JWS)
specifikáció, mely kriptográfiai mechanizmusokat ír le a token integritásának megőrzéséhez. Ez gyakorlatban annyit jelent,
hogy az Authorization Server a tokent elektronikusan aláírja. A Resource Servernek az aláírást ellenőriznie kell, amikor
azt megkapja. Ehhez az ellenőrzéshez azonban szükség van az Authorization Server publikus kulcsára, pontosabban az ezt is tartalmazó tanúsítványára. Itt jön a képbe egy újabb szabvány, a JSON Web Key (JWK), mely egy (megintcsak) JSON formátum arra, hogy hogyan lehet az
alkalmazás számára a tanúsítványt átadni.

A token alapesetben nem feltétlen titkosított, hiszen a felhasználó a saját adatait ismerheti, viszont más nem férhet hozzá. Hamisítani nem lehet, az aláírás miatt. Azonban ha mégis szükség van a token titkosítására, akkor arra a JSON Web Encryption (JWE) használható.

<a href="/artifacts/posts/2020-02-20-spring-oauth2/jwasterix.png" data-lightbox="post-images">![JWT](/artifacts/posts/2020-02-20-spring-oauth2/jwasterix.png)</a>

## Spring Security támogatás

És most nézzük meg, hogyan működik ez a gyakorlatban. Egy Spring Boot alkalmazást készítsünk, melyben
Spring Security lesz felelős az OAuth 2.0 használatáért. Szándékosan nem Google vagy Facebook integrációt szeretnék bemutatni,
hanem saját Authorization Servert szeretnék használni. Az alkalmazás kizárólag REST API interfésszel rendelkezik, nem akarom
a példát elbonyolítani felhasználói felület implementálásával.
[Az alkalmazás letölthető GitHubról](https://github.com/vicziani/jtechlog-spring-oauth2).

A Spring berkein belül az OAuth 2.0 támogatás elég megosztott, ugyanis támogatja a 
[Spring Security OAuth 2.3+](https://spring.io/projects/spring-security-oauth) projekt,
valamint kisebb részek megtalálhatóak a Spring Cloud Security 1.2+ és a Spring Boot 1.5.x
projektekben is. Azonban 2018 januárjában [bejelentették](https://spring.io/blog/2018/01/30/next-generation-oauth-2-0-support-with-spring-security), hogy a teljes OAuth 2.0 támogatás
a Spring Security 5 projekt keretében lesz megvalósítva. Az 5.2-es verzió már 
[elég közel került](https://spring.io/blog/2019/11/14/spring-security-oauth-2-0-roadmap-update) a 
teljes megvalósításhoz, azonban a terv fontos vonatkozásban változott, méghozzá a
Spring Security nem fog tartalmazni Authorization Servert. A döntés oka, hogy egy
teljes Authorization Server egy termék, azonban a Spring Security megpróbál egy
keretrendszer maradni, mely a létező library-kat integrálja egy egységes keretbe.
Ezzel együtt a Spring Security OAuth projekt fejlesztését is leállították.
A neten sok példa található ennek használatával, érdemes odafigyelni. Van egy
[Migration Guide](https://github.com/spring-projects/spring-security/wiki/OAuth-2.0-Migration-Guide)
is a kettő közötti különbségről. Ha a függőségek között `spring-security-oauth2`
projektet találunk, vagy `@EnableResourceServer` és `@EnableAuthorizationServer`
annotációkat, biztosak lehetünk benne, hogy a régi Spring Security OAuth
megoldáshoz van dolgunk.

Ezen kívül a Keycloakhoz külön Spring Boot Starter projekt is van (ún adapter), 
[ennek fejlesztését azonban leállították](https://www.keycloak.org/2023/03/adapter-deprecation-update), 
így ezt nem érdemes tovább használni.

Akkor mit használjunk? Jelenleg, a Spring Security 6.2.0 verzió a legjobb megoldás, melyben van
OAuth 2.0 támogatás.

És most nézzük a példa projektet, egy backend alkalmazást, azaz egy Resource Servert, mely REST API-ját
akarjuk levédeni. Az 
implementálásához a következő lépésekre lesz szükségünk:

* Fel kell telepíteni egy Authorization Servert. Ehhez a Keycloakot fogom
használni, és azért, hogy ne kelljen a telepítéssel fáradozni, Docker konténerben
fogom futtatni.
* Létre kell hozni egy Keycloakon belül egy realmet, mely felhasználók, szerepkörök és 
csoportok halmaza.
* Létre kell hozni egy klienst, amihez meg kell adni annak azonosítóját, és hogy milyen
url-en érhető el
* Létre kell hozni a szerepköröket
* Létre kell hozni egy felhasználót, beállítani a jelszavát, valamint hozzáadni a szerepkört
* Létre kell hozni egy Spring Boot projektet, és felvenni a megfelelő függőségeket
* Létre kell hozni egy REST webszolgáltatást, melyet utána le kell védeni, hogy csak a megfelelő
  szerepkörrel lehessen elérni
* Beállítani az Authorization Server elérését

Az alkalmazás teszteléséhez a következő lépéseket tesszük:

* Felhasználónév/jelszó megadásával az Authorization Servertől egy tokent kérünk le
* Meghívjuk a webszolgáltatást, a token megadásával, melyet az alkalmazás ellenőriz úgy,
  hogy a háttérben lekéri az Authorization Server tanúsítványát
  
## Keycloak

Először indítsuk egy a Keycloak szervert Docker konténerben a következő módon:

```
docker run -e KEYCLOAK_USER=root -e KEYCLOAK_PASSWORD=root -p 8081:8080 --name keycloak jboss/keycloak
```

A `KEYCLOAK_USER` és `KEYCLOAK_PASSWORD` környezeti változókkal megadjuk az alapértelmezett
felhasználónevet és jelszót. A `-p` kapcsolóval a saját gépen a `8081`-es porton elérhetővé
tesszük a Keycloak webes felületét. (A saját alkalmazásunk fog a `8080`-as porton futni.)
Valamint a `keycloak` nevet adjuk a konténernek.

Ekkor a `http://localhost:8081` címen az _Administration Console_ linkre kattintva
az előbb megadott felhasználónévvel és jelszóval be tudunk jelentkezni.

A további műveleteket megtekinthetjük [itt is](https://www.baeldung.com/spring-boot-keycloak)
screenshotokkal illusztrálva.

Itt válasszuk ki az _Add Realm_ gombot, és töltsük ki a nevet:

```
Name: JTechLogRealm
```

Majd vegyük fel a még el nem készült alkalmazásunkat kliensként a _Clients_ menüpontban
a `Create` gomb megnyomásával:

```
Client ID: jtechlog-app
Root URL: http://localhost:8080
```

Ezzel mondjuk meg, hogy az alkalmazásunk azonosítója (client id) `jtechlog-app`, és
elérhető a `http://localhost:8080` címen.

Majd a _Roles_ menüpontban az _Add Role_ gomb megnyomásával vegyünk fel egy új
szerepkört:

```
Role Name: jtechlog_user
```

Végül a _Users_ menüpont alatt vegyünk fel egy felhasználót az _Add user_
gomb megnyomásával:

```
Username: johndoe
```

Aa _Email Verified_ legyen _On_ értéken, hogy be lehessen a felhasználóval jelentkezni.

Mentsük el, majd a _Credentials_ fülön adjunk meg egy új jelszót:

```
Password: johndoe
Password Confirmation: johndoe
```

A _Temporary_ értéke legyen _Off_, hogy ne kelljen jelszót módosítani.

Végül a _Role Mappings_ fülön adjuk hozzá az _Assigned Roles_ közé vegyük fel a 
`jtechlog_user` szerepkört.

<a href="/artifacts/posts/2020-02-20-spring-oauth2/keycloak.png" data-lightbox="post-images">![Keycloak](/artifacts/posts/2020-02-20-spring-oauth2/keycloak_750.png)</a>

Ha ezzel kész is vagyunk, akkor a `http://localhost:8081/auth/realms/JTechLogRealm/.well-known/openid-configuration` címen egy JSON-t kapunk, ami tartalmazza a legfontosabb információkat.

Számunkra érdekes lehet a `token_endpoint`, amin tokent lehet igényelni, de
kelleni fog a `jwks_uri` is, amely címen a tanúsítvány érhető el.

Tokent kérni tehát úgy lehet, hogy a `token_endpoint` címre postot küldünk,
a törzsben átadva a `grant_type` `password` legyen, valamint a `client_id`
értékét, és a felhasználónevet és jelszót, rendre `username` és `password`
nevekkel.

```
curl -s --data "grant_type=password&client_id=jtechlog-app&username=johndoe&password=johndoe" http://localhost:8081/auth/realms/JTechLogRealm/protocol/openid-connect/token | jq
```

A [jq](https://stedolan.github.io/jq/) egy parancssori eszköz JSON feldolgozására, most itt
egyszerűen csak formázunk vele.

Vagy használhatunk egy `.http` fájlt, amit az IDEA Ultimate, vagy a Visual Studio Code a REST Client
extension használatával képes futtatni.

```plain
POST http://localhost:8081/auth/realms/JTechLogRealm/protocol/openid-connect/token
Content-Type: application/x-www-form-urlencoded

grant_type=password&client_id=jtechlog-app&username=johndoe&password=johndoe
```

Ekkor egy hasonló JSON jön vissza:

```javascript
{
  "access_token": "eyJ...",
  "expires_in": 300,
  "refresh_expires_in": 1800,
  "refresh_token": "eyJ...",
  "token_type": "bearer",
  "not-before-policy": 0,
  "session_state": "ee91d614-f350-4067-b67f-01424a10625e",
  "scope": "email profile"
}
```

Itt természetesen az `access_token` és `refresh_token` értéke sokkal hosszabb.
Mivel a token nem kódolt, átmásolhatjuk a [https://jwt.io](https://jwt.io) oldalra, amivel 
megtekinthetjük annak tartalmát.

```javascript
{
  "jti": "4b826032-ff77-4ee6-becc-bd4fe5114623",
  "exp": 1582149546,
  "nbf": 0,
  "iat": 1582149246,
  "iss": "http://localhost:8081/auth/realms/JTechLogRealm",
  "aud": "account",
  "sub": "0e25515b-b915-46a9-aad4-12554c309cd5",
  "typ": "Bearer",
  "azp": "jtechlog-app",
  "auth_time": 0,
  "session_state": "ee91d614-f350-4067-b67f-01424a10625e",
  "acr": "1",
  "allowed-origins": [
    "http://localhost:8080"
  ],
  "realm_access": {
    "roles": [
      "jtechlog_user",
      "offline_access",
      "uma_authorization"
    ]
  },
  "resource_access": {
    "account": {
      "roles": [
        "manage-account",
        "manage-account-links",
        "view-profile"
      ]
    }
  },
  "scope": "email profile",
  "email_verified": false,
  "preferred_username": "johndoe"
}
```

<a href="/artifacts/posts/2020-02-20-spring-oauth2/jwt.png" data-lightbox="post-images">![JWT](/artifacts/posts/2020-02-20-spring-oauth2/jwt_750.png)</a>

Itt látható pár érdekesség. Először a `sub` (Subject) tartalmazza általában a felhasználónevet,
itt ez a Keycloak által kiadott egyedi azonosító, és a felhasználónév a `preferred_username`
mezőben szerepel. A `iat` (Issued at) a kiadás, az `exp` (Expiration time) a lejárat dátuma. Az `iss`-ben (Issuer) a kiadó,
a `azp`-ben (Authorized party) a client id van. A szerepkörök a `realm_access` mezőben vannak.

Ezt a kérést természetesen Postmanben is lefuttathatjuk, ha az _Authorization_ fülre
kattintunk, ott kiválasztjuk az OAuth 2.0 TYPE-ot, majd megnyomjuk a _Get New Access token_
gombot. Itt töltsük ki a következő mezőket:

```
Grant Type: Password Credentials
Access Token URL: http://localhost:8081/auth/realms/JTechLogRealm/protocol/openid-connect/token
Username: johndoe
Password: johndoe
Client ID: jtechlog-app
Scope: profile
```

(A scope-ot nem kitöltve üres stringet küld a Postman, melyet a szerver nem tud értelmezni.)

Majd nyomjuk meg a _Request Token_ gombot, és meg is kapjuk a tokent.

<a href="/artifacts/posts/2020-02-20-spring-oauth2/postman.png" data-lightbox="post-images">![Postman](/artifacts/posts/2020-02-20-spring-oauth2/postman_750.png)</a>

A tanúsítvány a `http://localhost:8081/auth/realms/JTechLogRealm/protocol/openid-connect/certs`
címen érhető el. Itt egy JSON-t kapunk vissza, melynek `x5c` mezője rejti a tanúsítványláncot,
ahol a tanúsítványok a X.509 szabvány formátumban vannak.

## Alkalmazás

A következő feladat az alkalmazás elkészítése. Üres Spring Boot projekttel induljunk,
majd vegyük fel függőségnek a következőt:

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-oauth2-resource-server</artifactId>
</dependency>
```

Ahhoz, hogy az alkalmazás még ellenőrizni tudja a tokent, be kell állítani
az `application.properties` állományban a Keycloak szerverhez kapcsolódás
tulajdonságait:

```properties
spring.security.oauth2.resourceserver.jwt.issuer-uri=http://localhost:8081/auth/realms/JTechLogRealm
```

Valamint vegyük fel a következő konfigurációt:

```java
@Configuration(proxyBeanMethods = false)
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.authorizeHttpRequests(registry -> registry
                                .requestMatchers("/api/hello")
                                .authenticated()
                                .anyRequest()
                                .permitAll()
                )
                .oauth2ResourceServer(conf -> conf.jwt(Customizer.withDefaults()));
        return http.build();
    }
}
```

Az alkalmazást indíthatjuk az `mvn spring-boot:run` paranccsal is parancssorból.

Ha meg akarjuk hívni a `/api/hello` végpontot, akkor a következő üzenetet kapjuk:

```
$curl -s -v http://localhost:8080/api/hello
> GET /api/hello HTTP/1.1
> Host: localhost:8080
> 
< HTTP/1.1 401 
< WWW-Authenticate: Bearer
```

A `-s` (silent) kapcsolóval nem kérjük a letöltést jelző indikátort, a `-v` (verbose) kapcsolóval pedig
nem csak a válasz törzsét, hanem a kérést és a válasz fejlécét is kiíratjuk.

Vagy ugyanez `.http` fájlban:

```plain
GET http://localhost:8080/api/hello
```

Látható, hogy `401` Unauthorized hibával elutasította a kérést, és az
autentikáció módja Bearer, azaz hordozó tokent kell átadni a kérés
fejlécében.

Ezt a következőképpen tudjuk átadni:

```
$curl -s -H "Authorization: bearer eyJ..." http://localhost:8080/api/hello | jq
{
  "message": "Hello JWT!"
}
```

Vagy `.http` fájlban:

```plain
###
GET http://localhost:8080/api/hello
Authorization: bearer eyJ...
```

Ahol a `eyJ...` helyett a teljes token szerepel. Ezt ugyanígy tudjuk Postmanben is használni,
figyeljünk arra, hogy az _Access Token_ beviteli mező értéke fel legyen töltve úgy, hogy az
_Available Tokens_ legördülőből kiválasztunk egyet.

Amikor nem kapunk vissza semmit, akkor a válasz törzse üres, ekkor használjuk a curl
`-v` kapcsolóját, hiszen a státuszkódot és a hibaüzenetet a fejlécben fogjuk megtalálni.

Vigyázzunk, mert a tanúsítvány alapesetben hamar lejár.

Ami még érdekes, hogy bármikor újraindíthatjuk az alkalmazásunkat, újra be tudunk a tokennel
jelentkezni, mert az alkalmazásunk állapotmentes.

Nézzük meg, hogy lehet hozzáférni a JWT-ben tárolt adatokhoz. Ehhez a Spring Controllerben a 
`@RequestMapping` annotációval ellátott metódusban egy `Principal` paramétert
kell deklarálni.

```java
@GetMapping("/api/hello")
public HelloResponse sayHello(Principal principal) {
    log.info("The name of the user: {}", principal.getName());

    return new HelloResponse("Hello JWT!");
}
```

Ha csak a `principal` változó értékét írjuk ki, akkor láthatjuk, hogy sem a felhasználónév
nem megfelelő, sem a szerepkörök.

A felhasználónév kinyeréséhez használjunk egy `UsernameSubClaimAdapter` osztályt:

```java
public class UsernameSubClaimAdapter implements Converter<Map<String, Object>, Map<String, Object>> {

    private final MappedJwtClaimSetConverter delegate = MappedJwtClaimSetConverter.withDefaults(Collections.emptyMap());

    @Override
    public Map<String, Object> convert(Map<String, Object> source) {
        Map<String, Object> convertedClaims = this.delegate.convert(source);
        String username = (String) convertedClaims.get("preferred_username");
        convertedClaims.put("sub", username);
        return convertedClaims;
    }
}
```

És hivatkozzunk rá a `SecurityConfig` osztályból:

```java
@Bean
public JwtDecoder jwtDecoderByIssuerUri(OAuth2ResourceServerProperties properties) {
    String issuerUri = properties.getJwt().getIssuerUri();
    NimbusJwtDecoder jwtDecoder = (NimbusJwtDecoder) JwtDecoders.fromIssuerLocation(issuerUri);
    // Use preferred_username from claims as authentication name, instead of UUID subject
    jwtDecoder.setClaimSetConverter(new UsernameSubClaimAdapter());
    return jwtDecoder;
}
```

A szerepkörökhöz kell egy új `KeycloakRealmRoleConverter` osztály:

```java
public class KeycloakRealmRoleConverter implements Converter<Jwt, Collection<GrantedAuthority>> {

    @Override
    public Collection<GrantedAuthority> convert(Jwt source) {
        var realmAccess = (Map<String, Object>) source.getClaims().get("realm_access");
        var roles = (List<String>) realmAccess.get("roles");
        return roles.stream()
                .map(roleName -> "ROLE_" + roleName)
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());
    }
}
```

És erre is hivatkozzunk a `SecurityConfig` osztályból:

```java
@Bean
public Converter<Jwt,? extends AbstractAuthenticationToken> jwtAuthenticationConverter() {
    JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
    // Convert realm_access.roles claims to granted authorities, for use in access decisions
    converter.setJwtGrantedAuthoritiesConverter(new KeycloakRealmRoleConverter());
    return converter;
}
```