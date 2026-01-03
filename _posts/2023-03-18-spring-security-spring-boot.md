---
layout: post
title: Spring Security és Spring Boot
date: '2023-03-28T10:00:00.000+02:00'
author: István Viczián
description: Spring Security és Spring Boot
modified_time: '2023-11-15T10:00:00.000+01:00'
---

Frissítve: 2023. november 15.

Technológiák: Spring Security 6.1, Spring Boot 3.1, Thymeleaf, Spring Data JPA, H2

(Azért írtam meg ezt a posztot, mert sokan kerestek a Spring Security-re,
továbbá 2022 novemberében kijött a Spring Security 6 és Spring Boot 3, valamint
teljesértékű Spring Security poszt Spring Boottal eddig hiányzott. 
A [Spring Security használata Springgel Frameworkkel poszt](/2010/01/10/spring-security.html) 
továbbra is elérhető.)

A Spring Security egy olyan keretrendszer, mely támogatja az autentikációt,
autorizációt és védelmet biztosít bizonyos támadási formák ellen. A Spring Security
a de-facto szabványos eszköz a biztonság megvalósítására Springes alkalmazásokon belül.

A Spring Security támogatja a felhasználónév és jelszó párossal történő bejelentkezést,
de ezen kívül pl. webszolgáltatások védelmére támogatja a HTTP BASIC, HTTP Digest
és tanúsítvány alapú bejelentkezést, sőt az OAuth 2.0 használatát is.

A felhasználók és a hozzá kapcsolódó szerepkörök tárolhatóak memóriában, adatbázisban, LDAP szerveren, stb. 
Ezekhez adottak beépített implementációk, de saját is készíthető. Támogatja a jelszó hashelését
különböző algoritmusokkal. A felhasználóval kapcsolatos információkat képes cache-elni is. Különböző eseményekre eseménykezelőket lehet 
aggatni, pl. bejelentkezés, így könnyen megoldható pl. audit naplózás.

Az alkalmazáson belül szerepkörökhöz lehet kötni bizonyos url-eket, valamint metódus szinten is
meg lehet adni, hogy milyen szerepkörrel rendelkező felhasználó hívhatja meg.

A poszthoz egy példa projekt is tartozik, mely [elérhető a GitHub-on](https://github.com/vicziani/jtechlog-boot-security). 
Egyszerű Spring Boot webes alkalmazás, Spring Data JPA perzisztens réteggel, Thymeleaf template engine-nel.

<!-- more -->

## Legegyszerűbb védelem

A Spring Security már akkor védi az alkalmazást, ha szerepel a classpath-on. Ehhez elegendő
létrehozni egy üres alkalmazást a https://start.spring.io/ címen a Spring Web és Spring Security 
függőségekkel, és egy `index.html` oldalt.

Az alkalmazást elindítva a Spring Security csak bejelentkezés
után enged hozzáférést. A bejelentkező képernyőt a Spring Security generálta ki,
valamint a háttérben létrehozott egy felhasználót `user` névvel. Minden indításkor új jelszót generál, melyet kiír a konzolra.
Ha a jelszót elrontom, hibaüzenetet kapok.
Sikeres bejelentkezés után megjelenik az `index.html` állomány tartalma. Az oldal újratöltésekor sem kér jelszót.
A Spring Security automatikusan létrehozz egy kijelentkezési lehetőséget is, mely elérhető a `/logout` címen.
Ezt meghívva a Spring Security rákérdez, hogy biztos ki akarok-e jelentkezni. Majd megjelenik a bejelentkező
képernyő egy üzenettel.

A Spring Security automatikusan létrehoz egy Basic autentikációs bejelentkezési lehetőséget is.
Ekkor a http kérés fejlécében kell elküldeni a felhasználónevet és a jelszót.

## Felhasználók betöltése adatbázisból saját implementációval

A felhasználók betöltését implementálhatjuk magunk is. Ekkor a `UserDetailsService`
interfészt kell implementálni. Én egy Spring Data JPA megoldást választottam,
ehhez kell egy entitás is, mely a `UserDetails` interfészt implementálja.

```java
@Entity
@Table(name="users")
@NoArgsConstructor
@Data
public class User implements UserDetails, Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String username;
    private String password;
    private String role;

    public User(String username, String password, String role) {
        this.username = username;
        this.password = password;
        this.role = role;
    }

    @Override
    public Collection<GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role));
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

}
```

Látható, hogy a szerepkörök kezelését leegyszerűsítettem úgy, hogy a felhasználónak
csak egy szerepköre lehet, melyet a `role` attribútuma tartalmaz. Ezt a `getAuthorities()`
metódus konvertál a Spring Security által emészthető formába.

Írtam egy `UserRepository` interfészt a Spring Data JPA szerint.

```java
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findUserByUsername(String username);

}
```

Majd írtam egy `UserService` osztályt, melynek implementálnia kell
a `UserDetailsService` interfészt, melynek van egy
`public UserDetails loadUserByUsername(String username)` metódusa.
Ez továbbhív a repository-ba. A Spring Security ezt a metódust
fogja meghívni a felhasználó bejelentkezésekor.

```java
@Service
@AllArgsConstructor
public class UserService implements UserDetailsService {

    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) {
        return userRepository.findUserByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }
    
}
```

Majd konfigurálom a Spring Security-t a `SecurityConfig` osztályban.

```java
@Configuration(proxyBeanMethods = false)
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests(
                        registry -> registry
                                .requestMatchers("/login")
                                .permitAll()
                                .requestMatchers("/")
                                // ROLE_ prefixet auto hozzáfűzi
                                .hasAnyRole("USER", "ADMIN")
                )
                .formLogin(conf -> conf
                        .loginPage("/login")
                )
                .logout(Customizer.withDefaults());
        return http.build();
    }

    @Bean
    public PasswordEncoder encoder() {
        return new BCryptPasswordEncoder();
    }

}
```

Az `@EnableWebSecurity` annotációt rá kell tenni arra a `@Configuration`
annotációval ellátott osztályra, mely a `SecurityFilterChain` beant fogja létrehozni.

A `filterChain()` metódus adja meg a részletes konfigurációt. A bejelentkező
oldal a `/login` címen lesz elérhető, és ezt bejelentkezés nélkül el kell tudni érni.
Az összes többi oldal eléréséhez szükséges a `ROLE_USER` és `ROLE_ADMIN` szerepkör. Fontos,
hogy a `hasAnyRole()` hívásakor már ne használjunk `ROLE_` előtagot, azt a metódus
alapból hozzáfűzi.
Kijelentkezni a `/logout` alapértelmezett címen lehet.

A Spring Security használatakor az egyik leggyakoribb hiba, hogy a
bejelentkezési képernyőt is letiltjuk, így végtelen ciklus alakulhat ki,
erre a böngésző figyelmeztet.

A jelszó hasheléséhez a BCrypt algoritmust használom, ehhez létrehoztam egy `BCryptPasswordEncoder`
beant.

## Adatbázis létrehozása

Létre kell hozni a táblát is, valamint létrehozok két alapértelmezett felhasználót.

Ehhez a `schema.sql` fájlban létrehozom a táblát.

```sql
create table users (id bigint generated by default as identity (start with 1),
    username varchar(255), password varchar(255), role varchar(255), primary key (id));
```

A felhasználóknál szükségem van a jelszavuk hash-ére. Ehhez létrehozok egy teszt osztályt.

```java
class BCryptTest {

    @Test
    void testEncode() {
        System.out.println(new BCryptPasswordEncoder().encode("user"));
    }

}
```

Ennek eredménye:

```plain
$2a$10$WK5DYDlnywXj9Yni1kj4WOdEpBOriamVlY8UI8Isa38ermsz1TH4S
```

Érdekessége, hogy futtatásonként más értéket ad vissza. A hash magában foglal egy véletlenszerűen generált
saltot is, azért, hogy ne lehessen jelszó adatbázisok alapján feltörni. Három részből
áll, melyek dollárjelekkel (`$`) vannak elválasztva. Az első az algoritmus
verziója, példánkban `2a`. A második az ún. _cost_ paraméter, példánkban `10`.
A harmadik részben az első 22 karakter a salt, a második 31 karakter pedig a hash.


A `data.sql` fájlba hozom létre a felhasználókat.

```sql
insert into users (username, password, role) values ('user', '$2a$10$WK5DYDlnywXj9Yni1kj4WOdEpBOriamVlY8UI8Isa38ermsz1TH4S', 'ROLE_USER');
insert into users (username, password, role) values ('admin', '$2a$10$r3fC/h15stMd/RkqSuNaPesFQaFJmg6Z7/x77vWoxsZCUmdbm0gt2', 'ROLE_ADMIN');
```

## Saját bejelentkezési űrlap létrehozása

Saját űrlap létrehozásához Thymeleafet használtam. Ehhez kell egy `UserController` controller.

```java
package jtechlog.jtechlogbootsecurity;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.servlet.ModelAndView;

import java.util.Map;

@Controller
public class UserController {

    @GetMapping("/login")
    public ModelAndView login() {
        return new ModelAndView("login");
    }

}
```

És a Thymeleaf template `login.html` néven.

```html
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">

<body>
    <div th:if="${param.error}">
        Sikertelen bejelentkezés
    </div>

    <div th:if="${param.logout}">
        Sikeres kijelentkezés
    </div>

    <form th:action="@{login}" method="post">
        <input type="text" name="username"/>
        <input type="password" name="password"/>
        <input type="submit" value="Bejelentkezés"/>
    </form>

    </body>
</html>
```

A Thymeleafen kívül a `org.thymeleaf.extras:thymeleaf-extras-springsecurity6` függőségre is szükség van,
és ekkor az űrlapba automatikusan legenerálja egy
rejtett mezőben a CSRF tokent is.

```html
<form action="login" method="post">
    <input type="hidden" name="_csrf" value="R2gwhxjM6tmpj-kCsdOwjy-52oT1Mjh35HfNrrGjEIQ4BzcDclpSsC74jOyEuI8x1f6EvRvf9-XFVwpa3UP8mIfAJOEOMA81"/>
    <!-- ... --> 
</form>
```

A CSRF támadási módot egy példával a legegyszerűbb leírni. Amennyiben egy webbankon
bejelentkezik egy felhasználó, majd átnavigál egy rosszindulatú lapra, ott létre lehet
hozni egy olyan űrlapot, mely a webbankra küld egy post metódusú kérést, pl. egy átutalást.
Erre megoldás a CSRF token, melyet a szerver állít elő minden űrlap lekérésekor, elhelyezni
az űrlapban egy rejtett mezőben, és az űrlap mindig vissza is küldi. Ezt támadó oldal
nem ismerheti, így visszaküldeni sem tudja, és így a szerver elutasítja.

## Felhasználó lekérése

Egy controller `@RequestMapping` annotációjával ellátott
metódusának paramétereként is definiálhatjuk a bejelentkezett felhasználót,
ellátva az `@AuthenticationPrincipal` annotációval, akkor a Spring
paraméterül átadja azt.

```java
@GetMapping(value = "/")
public ModelAndView index(@AuthenticationPrincipal User user) {
    log.debug("Logged in user: {}", user);
    return new ModelAndView("index",
      Map.of("users", userService.listUsers(), "user", new User()));
}
```

A Java kódból a következőképpen kérhetjük le a bejelentkezés után
a felhasználót:

```java
var user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
```

A `Context` `ThreadLocal` változó, így szálanként egyedi. A metódus
visszatérési értékét kényszeríthetjük a saját `User` osztályunkra.

## Használat Thymeleafben

Amennyiben használni akarjuk a Spring Security funkcióit Thymeleaf template-ben,
definiálnunk kell a névteret:

```html
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org"
      xmlns:sec="http://www.thymeleaf.org/thymeleaf-extras-springsecurity6">
```

A felhasználó nevének és különböző tulajdonságainak megjelenítésére a `authentication`
tag való:

```xml
<span sec:authentication="name">Bob</span>
```

Egy feltétel szerint megjeleníteni egy HTML részletet a következőképp lehet.
A `div` törzse csak akkor jelenik meg, ha a felhasználó belépett.

```xml
<div sec:authorize="isAuthenticated()">

</div>
```

A következő `div` törzse csak akkor jelenik meg, ha a felhasználó rendelkezik
`ROLE_ADMIN` jogosultsággal.

```xml
<div sec:authorize="hasRole('ROLE_ADMIN')">
</div>
```

## Felhasználónév megjegyzése

A Spring Security sikertelen bejelentkezés esetén nem jegyzi meg a
felhasználónevet. Ezt nekünk kell implementálni.

Ennek megoldására írni kell egy
`SimpleUrlAuthenticationFailureHandler` leszármazottat, mely sikertelen
bejelentkezés esetén kerül meghívásra, és a felhasználónevet a sessionbe menti.
Utána a bejelentkező oldalon ezt ki kell venni.

A `UsernameInUrlAuthenticationFailureHandler` implementációja:

```java
public class UsernameInUrlAuthenticationFailureHandler extends SimpleUrlAuthenticationFailureHandler {

    private static final String LAST_USERNAME_KEY = "LAST_USERNAME";

    public UsernameInUrlAuthenticationFailureHandler() {
        super("/login?error");
    }

    @Override
    public void onAuthenticationFailure(
            HttpServletRequest request, HttpServletResponse response,
            AuthenticationException exception)
            throws IOException, ServletException {

        var usernameParameter =
                UsernamePasswordAuthenticationFilter.SPRING_SECURITY_FORM_USERNAME_KEY;
        var lastUserName = request.getParameter(usernameParameter);

        var session = request.getSession(false);
        if (session != null || isAllowSessionCreation()) {
            request.getSession().setAttribute(LAST_USERNAME_KEY, lastUserName);
        }

        super.onAuthenticationFailure(request, response, exception);
    }
}
```

Ezt természetesen beanként kell deklarálni, és beállítani a `configure(HttpSecurity http)`
metódusban:

```java
@Bean
public SecurityFilterChain filterChain(HttpSecurity http, UsernameInUrlAuthenticationFailureHandler failureHandler) throws Exception {
    http
            .authorizeHttpRequests()
            .requestMatchers("/login")
            .permitAll()
            .requestMatchers("/")
            // ROLE_ prefixet auto hozzáfűzi
            .hasAnyRole("USER", "ADMIN")
            .and()
            .formLogin()
            .loginPage("/login")
            .failureHandler(failureHandler)
            .and()
            .logout();
    return http.build();
}

@Bean
public UsernameInUrlAuthenticationFailureHandler usernameInUrlAuthenticationFailureHandler() {
    return new UsernameInUrlAuthenticationFailureHandler();
}
```

Valamint a megváltozott form, az előző felhasználónevet a sessionből veszi ki:

```xml
Felhasználónév: <input type="text" name="username" th:value="${session.lastUsername}"/>
```

## Metódus szintű jogosultságkezelés

Ezen kívül a Spring Security képes arra is, hogy különböző metódusok
meghívása esetén is végezzen jogosultság ellenőrzést. Ezt deklaratív
módon, annotációval is meg lehet adni. Ekkor egyrészt deklarálni kell,
hogy metódus szintű hozzáférés ellenőrzést szeretnénk, ekkor a
`@EnableMethodSecurity` annotációt kell elhelyezni az `SecurityConfig`
osztályunkon:

```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {
  // ...
}
```

Valamint használjuk a `@PreAuthorize` annotációt a védendő metóduson:

```java
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public void addUser(String name, String password, String roles) {
  // ...
}
```

## Tesztelés

Amennyiben az autentikációt is tesztelni akarjuk, a következőket használhatjuk.
Először kell a következő függőség.

```xml
<dependency>
    <groupId>org.springframework.security</groupId>
    <artifactId>spring-security-test</artifactId>
    <scope>test</scope>
</dependency>
```

A `@WithMockUser` annotáció bejelentkeztet egy `user` felhasználót, `USER`
szerepkörrel.

Ezt természtesen paraméterezni is lehet, pl. `@WithMockUser(roles = {"ADMIN"})`.

Amennyiben azonban egy felhasználót a klasszikus módon szeretnénk bejelentkeztetni,
úgy, mintha az űrlapon történne a bejelentkezés, adjuk meg a felhasználónevét
a `@WithUserDetails` annotációval, pl. `@WithUserDetails("admin")`.

A MockMvc-nek is meg lehet adni a bejelentkezett felhasználót a következőképp:

```java
mockMvc.perform(post("/")
                .param("username", "johndoe")
                .param("password", "johndoe")
                .param("role", "ROLE_USER")
                .with(user("admin").roles("ADMIN"))
                .with(csrf()))
                .andExpect(status().is3xxRedirection());
```
