---
layout: post
title: OAuth 2.0 támogatás a Spring Boot 3.3-ban és a Pécs IT Meetup
date: '2024-06-27T10:00:00.000+02:00'
author: István Viczián
description: A Spring Boot 3.3-ban még könnyebb az OAuth 2 integráció. Erről is beszéltem a XV. Pécs IT Meetupon.
---

A Spring Boot 3.3 verzióban tovább egyszerűsítették az OAuth 2.0 integrációt.
Az előző verziók esetén, amennyiben a JWT tokenben a felhasználónév nem a `sub` claim alatt szerepelt,
saját magunk kellett ezt kiolvasni, pl. egy saját `JwtDecoder` bean
megadásával. Amennyiben a JWT token tartalmazta a szerepköröket is,
saját `JwtAuthenticationConverter` beant kellett felvennünk, mely
képes volt a szerepkörök kiolvasására.

Erre a Spring Boot 3.3 verziótól kezdve nincs szükség, hiszen beállíthatjuk ezt
az `application.properties` állományban, és a Spring Boot
automatikusan konfigurál egy `JwtAuthenticationConverter` (vagy reaktív
esetben egy `ReactiveJwtAuthenticationConverter` beant).

Ezt is említettem a [XV. Pécs IT Meetupon](https://www.meetup.com/pecs-it-meetup/events/301596694).
A meghívást ezennel is köszönöm a Kovács Bálintnak, a meetup egyik szervezőjének,
aki többedmagával a [Webstar](https://www.webstar.hu/) céget is képviselte.

![XV. Pécs IT Meetup](/artifacts/posts/2024-06-27-spring-security-pecs-meetup/meetup.webp)

<!-- more -->

Ez előadás címe _OAuth 2.0, implementációja Keycloakkal és Spring Security-val_,
és az OAuth 2.0 és OIDC szabványokról,
az azokban szereplő fogalmakról, az Authorization Code Grant with Proof Key for Code Exchange (PKCE)
Grant Type-ról
esett szó, valamint a [Keycloak](https://www.keycloak.org/) szerverről,
mely leveszi a vállunkról a felhasználókezeléssel és bejelentkezéssel kapcsolatos
nehézségeket.

Az előadáshoz példakód is elérhető a [GitHubon](https://github.com/vicziani/oauth2-spring-security-2024-06-20),
sőt a [slide-ok tartalma](https://github.com/vicziani/oauth2-spring-security-2024-06-20/blob/master/slides/slides.md) is
megtekinthető.

Az Authorization Code Grant Grant Type-hoz egy ábrát is készítettem, melyen szerepelnek a kommunikáció során átadott adatok is.

<a href="/artifacts/posts/2024-06-27-spring-security-pecs-meetup/oauth-auth-code-grant-type_3.drawio.svg" data-lightbox="post-images">
    <img src="/artifacts/posts/2024-06-27-spring-security-pecs-meetup/oauth-auth-code-grant-type_3.drawio.svg" style="width:750px">
</a>

A Spring Boot 3.3-ban megjelent lehetőséget a Backend alkalmazásnál tudjuk kihasználni.
Erről már írtam az [_OAuth 2.0 Spring Boot és Spring Security keretrendszerekkel_](/2020/02/19/spring-oauth2.html) posztomban.
A poszt végén szereplő `JwtDecoder` és `JwtAuthenticationConverter` beaneket tudjuk kiváltani.

A Backend alkalmazáshoz a JWT token Bearer tokenként érkezik be a HTTP kérés fejlécében.

```text
POST /api/employees HTTP/1.1
Authorization: Bearer token-érték
Content-Type: application/json

{
  "name": "Jack Doe"
}
```

![Spring Security](/artifacts/posts/2024-06-27-spring-security-pecs-meetup/jwtauthenticationprovider.png)

A beérkező kérés során autentikációt az `AuthenticationManager` fogadja, annak is a `ProviderManager`
implementációja. Ez végighívja a különböző providereket, hogy valamelyik tudja-e kezelni a kérést.
JWT Bearer token esetén a `JwtAuthenticationProvider` kerül meghívásra, mely továbbhív először
egy `JwtDecoder` példányhoz, mely a beérkező `String`-et `Jwt` példánnyá konvertálja, majd azt továbbítja egy
`JwtAuthenticationConverter` példányhoz, mely ezt egy `AbstractAuthenticationToken` példánnyá konvertálja
(ez utóbbi implementálja az `Authentication` interfészt, mely a `Principal` leszármazottja, és a bejelentkezés
tényét tárolja).

Nézzük a következő JWT token részletet:

```json
{
  "exp": 1719499649,
  "iat": 1719499349,
  "jti": "266a2e20-908c-4b1c-9d26-751d59240f0f",
  "iss": "http://localhost:8080/realms/employees",
  "aud": "account",
  "sub": "637d1c8e-8127-412b-9c74-58de09c65207",
  "typ": "Bearer",
  "azp": "employees-frontend",
  "sid": "2493ba51-114c-4df6-9b6c-8ff5ecba57a3",
  "acr": "1",
  "allowed-origins": [
    "http://localhost:8082"
  ],
  "roles": [
    "default-roles-employees",
    "offline_access",
    "uma_authorization",
    "employees_admin",
    "employees_user"
  ],
  "scope": "profile email",
  "email_verified": true,
  "name": "John Doe",
  "preferred_username": "johndoe",
  "given_name": "John",
  "family_name": "Doe",
  "email": "johndoe@localhost"
}
```

Itt látszik, hogy a `sub` claim értéke egy egyedi azonosító, `637d1c8e-8127-412b-9c74-58de09c65207`,
és a felhasználónév a `preferred_username` claimben van, értéke `johndoe`.

A szerepkörök pedig a `roles` claim alatt vannak. Ekkor az `application.properties`
fájlba a következő kulcsokat kell felvennünk:

```properties
spring.security.oauth2.resourceserver.jwt.principal-claim-name=preferred_username
spring.security.oauth2.resourceserver.jwt.authorities-claim-name=roles
spring.security.oauth2.resourceserver.jwt.authority-prefix=ROLE_
```

A háttérben a `OAuth2ResourceServerJwtConfiguration.JwtConverterConfiguration` osztálya van
(ez a `spring-boot-autoconfigure` modul része),
melynek a `getJwtAuthenticationConverter()` metódusa,
mely létrehoz egy `JwtAuthenticationConverter` példányt,
meghívva annak `setPrincipalClaimName()` metódusát, valamint
`setJwtGrantedAuthoritiesConverter()` metódusát, ez utóbbinak átadva egy új
`JwtGrantedAuthoritiesConverter` példányt.

A probléma csak ott van, hogy az elterjedten használt Keycloak
alapértelmezetten a következő formátumban adja vissza a szerepköröket.

```json
{
  "realm_access": {
    "roles": [
      "default-roles-employees",
      "offline_access",
      "uma_authorization",
      "employees_admin",
      "employees_user"
    ]
  }
}
```

Azaz a `realm_access` claimen belül van egy `roles` mező is. Ezt a beágyazott adatstruktúrát
viszont nem tudjuk átadni a `spring.security.oauth2.resourceserver.jwt.authorities-claim-name`
property értékének.

Esetleg annyit tudunk variálni, hogy a Keycloakban beállítjuk, hogy milyen claim értékeként
adja vissza a szerepköröket. Ez átírható a _Client scopes_ / _roles_ / _Mappers_ / _realm roles_
képernyőn a _Token Claim Name_ beviteli mezőben. Ennek alapértelmezett értéke `realm_access.roles`.
Ha ezt átírjuk `roles` értékre, akkor már egyszerűbb struktúrában adja vissza a szerepköröket,
melyet már a Spring Boot is tud kezelni.

Szóval kaptunk ugyan egy lehetőséget, hogy megadjuk hogy a szerepkörök milyen claim értékeként
vannak tárolva, de jobb lett volna, ha ide pl. egy Spring EL kifejezést tudnánk írni (pl. `realm_access.roles`),
hogy bonyolultabb struktúrákat is kezelni tudjon.
