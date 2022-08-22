---
layout: post
title: Spring Security
date: '2010-01-10T22:27:00.006+01:00'
author: István Viczián
tags:
- autentikáció
- authorizáció
- nyílt forráskód
- biztonság
- Spring Framework
modified_time: '2019-03-10T10:00:00.000+01:00'
description: Egy részletes poszt a Spring Security-ról.
---

Frissítve: 2019. március 3.

Technológiák: Spring Framework 5.1.5, Spring Security 5.1.4, JPA, H2, Thymeleaf,
Maven, Jetty

A [Spring Security](https://spring.io/projects/spring-security) egy
nyílt forráskódú projekt Java alkalmazások autentikációjának és
autorizációjának megvalósítására. Az autentikáció azt jelenti, hogy a
felhasználó tesz egy állítást, hogy ő kicsoda, és azt bizonyítja is. A
legtöbbször ez felhasználónév és jelszó párossal történik, de lehet
bonyolultabb megoldás, mint tanúsítvány (akár hardver tokenen),
ujjlenyomat, stb. Az autorizáció az erőforráshoz való hozzáféréskor
ellenőrzi, hogy a felhasználónak van-e hozzá jogosultsága. A Spring
Security független projektként indult Acegi Security néven.
Legkönnyebben Springes alkalmazásokkal integrálható, de nem kötelező a
Spring használata. Persze az összes Springes technológiához illeszthető.
Főleg webes alkalmazásoknál szokták használni, de működik vastag
klienses környezetben is. Ez alapján egyszerűen beépíthető egy Spring +
Spring MVC alkalmazásba, de használható többek között Struts-cal,
Swinggel, de gyakorlatilag bármilyen Java alkalmazásban.

Előnye, hogy nem függ a környezettől (pl. alkalmazásszerver), nem kell
az üzleti logikát átfűzni a jogosultságkezelést végző kóddal (, hanem
aspektus-orientált módon adható meg). Egyszerű módon
konfigurálható, és a legtöbb beállításnak van alapértelmezett értéke is,
mellyel működik a biztonság, de tetszőleges mértékben testre szabható, a
legtöbb osztály akár saját implementációra is kicserélhető
(pluginelhetőség). Implementálva van benne hozzáférési listák kezelése
(Access Control Lists).

Támogatja a HTTP BASIC, HTTP Digest és form alapú autentikációt,
X.509 tanúsítványokat, valamint az OAuth 2.0-át, OpenID-t.

A felhasználók és a hozzá kapcsolódó szerepkörök tárolhatóak memóriában,
adatbázisban, LDAP szerveren. Ezekhez adottak beépített implementációk,
de saját is készíthető. Támogatja a jelszó hashelését pl. SCrypt,
PBKDF2 vagy BCrypt algoritmussal. Támogat régebbi algoritmusokat is,
mint pl. MD4, de annak nem biztonságos volta miatt már deprecated.
A felhasználóval kapcsolatos információkat képes cache-elni is.
Különböző eseményekre eseménykezelőket lehet aggatni, pl. bejelentkezés,
így könnyen megoldható pl. audit naplózás. Könnyen illeszthető a [CAS
single sign on](https://www.apereo.org/projects/cas)
megoldáshoz.

Beépítetten nyújt támogatást a [CSRF támadási mód](https://en.wikipedia.org/wiki/Cross-site_request_forgery) ellen.

Kompatibilis a Servlet Security API-val, használhatóak az EJB 3
annotációi, illeszthető a JAAS szabványhoz.

Képes a security propagation-re, azaz az alkalmazások különböző rétegei
között átvinni a security context-et (pl. a vastag kliensről a
szerverre).

Java kódban egyszerűen lehet lekérni a bejelentkezett felhasználót,
valamint annotációkkal adható meg, hogy mely metódus milyen
jogosultsággal hívható meg.

Webes környezetben a védett URL-eket komplex módokon lehet megadni,
akár Ant féle megadási móddal, akár reguláris kifejezésekkel.

Konfigurálható,
hogy védet tartalmak esetén történjen https-re átirányítás. Alapból
implementálva van benne két Remember-Me (Persistent Login) megoldás is,
azaz a böngésző cookie-ban jegyezze meg a bejelentkezés tényét.

Használható WebSockettal, valamint Spring WebFlux-szal.

A Spring Security komplex támogatást nyújt a teszteléshez.

Ebben a posztban egy egyszerű webes alkalmazásba
illesztését fogom bemutatni. A poszthoz egy példa projekt is tartozik,
mely [elérhető a
GitHub-on](https://github.com/vicziani/jtechlog-spring-security). Egyszerű Spring MVC-s
webes alkalmazás, Spring Data JPA perzisztens réteggel, Thymeleaf template engine-nel.

<!-- more -->

Tételezzük fel, hogy van egy webes alkalmazásunk, egy főoldallal. Nézzük meg
lépésenként, hogy kell a Spring Security-t bevezetni.

## Legegyszerűbb megoldás

A Servlet 3.0 szabvány már nem teszi kötelezővé a `web.xml` állomány
használatát, ezért elég létrehozni egy osztályt, mely leszármazik
a `AbstractSecurityWebApplicationInitializer` osztályból. Ez regisztrálja
a Spring Security működéséhez szükséges Servlet Filtereket.

A Spring Security konfigurációját érdemes egy külön `@Configuration`
annotációval ellátott osztályban megadni. A legegyszerűbb konfiguráció a
következő:

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return NoOpPasswordEncoder.getInstance();
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth
                .inMemoryAuthentication()
                .withUser("user")
                .password("user")
                .authorities("USER");
}
```

Ezt az osztályt a be kell töltenünk, ha már van egy
`AbstractAnnotationConfigDispatcherServletInitializer`
osztálytól leszármazó osztályunk, akkor annak `getRootConfigClasses()` metódusában.

```java
public class WebAppInitializer
        extends AbstractAnnotationConfigDispatcherServletInitializer {

    @Override
    protected Class<?>[] getRootConfigClasses() {
        return new Class[]{BackendConfig.class, SecurityConfig.class};
    }

    // ...
}
```

Ennek hatására a következők kerülnek beállításra:

* Minden URL védett lesz, és csak bejelentkezés után lehet megtekinteni.
* Működik a HTTP BASIC autentikáció is
* Bármilyen URL-t beírva a böngésző átirányításra kerül a `/login`
oldalra.
* Bejelentkezni a `user` felhasználónévvel és `user` jelszóval lehetséges.
* Ki lehet jelentkezni a `/logout` címre való `post` metódusú HTTP kéréssel. Vigyázat,
`get` metódussal nem működik! Az űrlapon belül ezen kívül el kell helyezni a CSRF tokent is,
erről még később lesz szó.

Látható, hogy a jelszót plain textben, szövegesen adtuk meg. Ez csak azért lehetséges,
mert a `PasswordEncoder` `NoOpPasswordEncoder` implementációját használtuk. Ez deprecated,
ugyanis sose használjuk élesben. Helyette használjuk a `BCryptPasswordEncoder`
implementációt.

```java
@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
}
```

Ekkor a felhasználó jelszavát is át kell írnunk:

```java
auth
        .inMemoryAuthentication()
        .withUser("user")
        .password("$2a$10$ADR5Ol7to6gUl4zdL1iasu4Oa/J9La4r30Jjbgaq0X946HvsWqTT2")
        .authorities("USER");
```

A Bcrypt egy jelszó hash algoritmus, mely magában foglal egy véletlenszerűen generált
saltot is, azért, hogy ne lehessen jelszó adatbázisok alapján feltörni. Három részből
áll, melyek dollárjelekkel (`$`) vannak elválasztva. Az első az algoritmus
verziója, példánkban `2a`. A második az ún. _cost_ paraméter, példánkban `10`.
A harmadik részben az első 22 karakter a salt, a második 31 karakter pedig a hash.

Hogyan jutottunk ehhez a hash-hez? A következő kódrészlettel:

```java
BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
System.out.println(passwordEncoder.encode("user"));
```

Amennyiben Thymeleaf template engine-t használunk, a Spring Security támogatáshoz
el kell helyeznünk a `thymeleaf-extras-springsecurity5` függőséget is a `pom.xml`
állományban:

```xml
<dependency>
    <groupId>org.thymeleaf.extras</groupId>
    <artifactId>thymeleaf-extras-springsecurity5</artifactId>
    <version>3.0.4.RELEASE</version>
</dependency>
```

Valamint meg kell adni egy `SpringSecurityDialect` példányt.

```java
@Bean
public SpringTemplateEngine templateEngine() {
    SpringTemplateEngine engine = new SpringTemplateEngine();
    engine.setAdditionalDialects(Set.of(new SpringSecurityDialect()));
    engine.setTemplateResolver(templateResolver());
    return engine;
}
```

Ezek után a kijelentkező űrlap a következő:

```xml
<form method="post" th:action="@{/logout}">
    <input type="submit" value="Kijelentkezés" />
</form>
```

A Thymeleaf az előző függőség miatt az űrlapba automatikusan legenerálja egy
rejtett mezőben a CSRF tokent is.

```html
<form method="post" action="/">
  <input type="hidden" name="_csrf" value="21756dda-139c-4e5e-95c4-a9a9aeb14285"/>
  <!-- ... -->              
</form>
```

A CSRF támadási módot egy példával a legegyszerűbb leírni. Amennyiben egy webbankon
bejelentkezik egy felhasználó, majd átnavigál egy rosszindulatú lapra, ott létre lehet
hozni egy olyan űrlapot, mely a webbankra küld egy post metódusú kérést, pl. egy átutalást.
Erre megoldás a CSRF token, melyet a szerver állít elő minden űrlap lekérésekor, elhelyezni
az űrlapban egy rejtett mezőben, és az űrlap mindig vissza is küldi. Ezt támadó oldal
nem ismerheti, így visszaküldeni sem tudja, és így a szerver elutasítja.

## Adatbázis

Amennyiben adatbázisból akarjuk lekérdezni a felhasználókat, erre is van
lehetőség, legegyszerűbben az SQL lekérdezések megadásával.

Egyrészt kell egy tábla, adatokkal. (Itt most csak egy táblát használunk,
a felhasználó egyszerre csak egy szerepkörrel rendelkezhet. Persze gyakoribb,
hogy van egy külön szerepkör tábla.)

```sql
create table users (id bigint generated by default as identity (start with 1),
    username varchar(255), password varchar(255), role varchar(255), primary key (id));

insert into users (username, password, role)
  values ('user', '$2a$10$WK5DYDlnywXj9Yni1kj4WOdEpBOriamVlY8UI8Isa38ermsz1TH4S', 'ROLE_USER');
insert into users (username, password, role)
  values ('admin', '$2a$10$r3fC/h15stMd/RkqSuNaPesFQaFJmg6Z7/x77vWoxsZCUmdbm0gt2', 'ROLE_ADMIN');
```

Természetesen itt már a hash-elt jelszót kell megadnunk. Majd írjuk át a `configure()` metódust:

```java
auth
        .jdbcAuthentication()
        .dataSource(dataSource)
        .usersByUsernameQuery(
        "select username, password, 1 from users " +
                "where username = ?")
        .authoritiesByUsernameQuery(
                "select username, role from users " +
                        "where username = ?");
```

## Saját implementáció

A felhasználók betöltését implementálhatjuk magunk is. Ekkor a `UserDetailsService`
interfészt kell implementálnunk. Én egy Spring Data JPA megoldást választottam,
ehhez kell egy entitás is, mely a `UserDetails` interfészt implementálja.

```java
@Entity
@Table(name="users")
public class User implements UserDetails, Serializable {

   @Id
   @GeneratedValue
   private Long id;

   private String username;

   private String password;

   private String role;

    @Override
    public Collection<GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role));
    }

   @Override
   public String getPassword() {
       return password;
   }

   @Override
   public String getUsername() {
       return username;
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

   // Többi getter és setter metódus
   // ...
}
```

Írtam egy `UserRepository` interfészt a Spring Data JPA szerint, amit aztán így
használtam a `UserService` osztályból.

```java
@Service
public class UserService implements UserDetailsService {

    private UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) {
        return userRepository.findUserByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }

    // ...
}
```

Ezt aztán így kell használnunk:

```java
@Override
protected void configure(AuthenticationManagerBuilder auth) throws Exception {
    auth.userDetailsService(userDetailsService);
}
```

## Felhasználó lekérése

A Java kódból ezután a következőképpen kérhetjük le a bejelentkezés után
a felhasználót:

```java
User user = (User) securityContextHolder.getContext().getAuthentication().getPrincipal();
```

A `Context` `ThreadLocal` változó, így szálanként egyedi. A metódus
visszatérési értékét kényszeríthetjük a saját `User` osztályunkra.

Sőt, egy Spring MVC controller `@RequestMapping` annotációjával ellátott
metódusának paramétereként is definiálhatjuk a bejelentkezett felhasználót,
ellátva az `@AuthenticationPrincipal` annotációval, akkor a Spring MVC
paraméterül átadja azt.

```java
@GetMapping(value = "/")
public ModelAndView index(@AuthenticationPrincipal User user) {
    logger.debug("Logged in user: {}", user);
    return new ModelAndView("index",
      Map.of("users", userService.listUsers(), "user", new User()));
}
```

## Használat Thymeleafben

Amennyiben használni akarjuk a Spring Security funkcióit Thymeleaf template-ben,
definiálnunk kell a névteret:

```html
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org"
      xmlns:sec="http://www.thymeleaf.org/thymeleaf-extras-springsecurity5">
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

## Használat JSP-ben

JSP-ben használhatjuk a Spring Security tag library-t is, melynek definíciója:

```xml
<%@ taglib prefix="security"
    uri="http://www.springframework.org/security/tags" %>
```

Az `authentication` tag visszaadja az `Authentication` objektumot, és
annak tulajdonságait tudjuk lekérni:

```xml
<security:authentication property="principal.username" />
```

Valamint az `authorize` tag törzse csak a feltétel teljesítésekor
jelenik meg. Az `access` attribútumának kell egy EL kifejezést
átadni.

```xml
<security:authorize access="hasRole('ROLE_ADMIN')">
       <!-- Felhasználók felvételére szolgáló form. -->
</security:authorize>
```

## Saját bejelentkező képernyő

Ez esetben még mindig nem vagyunk megelégedve a Spring Security által
biztosított alapértelmezett bejelentkező képernyővel, emiatt szabjuk azt
testre. A `WebSecurityConfigurerAdapter` `configure(HttpSecurity http)`
metódusát kell felülírnunk.

Itt kell megadni a védendő URL-eket.
Természetesen többet is megadhatunk, akár Ant típusú
kifejezéssel, és hozzájuk szabályokat, hogy milyen feltételekkel érhető el.
A Spring Security használatakor az egyik leggyakoribb hiba, hogy a
bejelentkezési képernyőt is letiltjuk, így végtelen ciklus alakulhat ki,
erre a böngésző figyelmeztet.

A konfiguráció tehát a következő:

```java
@Override
protected void configure(HttpSecurity http) throws Exception {
    http
            .authorizeRequests()
            .antMatchers("/")
                .access("hasRole('ROLE_USER') or hasRole('ROLE_ADMIN')")
            .and()
            .formLogin()
            .loginPage("/login")
            .and()
            .logout();
}
```

Látható, hogy csak a főoldal ("/") van levédve, a többi bejelentkezés nélkül
megtekinthető. Vigyázzunk, nehogy levédjük pl. a statikus tartalmakat
(CSS, JavaScript fájlok).

Majd nézzük a bejelentkező formot tartalmazó Thymeleaf részletet:

```xml
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
```

Ahogy említettem, a Thymeleaf a CSRF tokent automatikusan beleteszi egy
hidden inputként.

Ugyanez JSP-vel:

```xml
<c:if test="${not empty param.error}">
    Sikertelen bejelentkezés
</c:if>

<c:if test="${not empty param.logout}">
    Sikeres kijelentkezés
</c:if>

<c:url value="/login" var="loginUrl"/>

<form action="${loginUrl}" method="post">
    <input type="text" name="username" value=""/>
    <input type="password" name="password" value="" />
    <input type="hidden"
        name="${_csrf.parameterName}"
        value="${_csrf.token}"/>
    <input type="submit" value="Bejelentkezés"/>
</form>
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

    public static final String LAST_USERNAME_KEY = "LAST_USERNAME";

    public UsernameInUrlAuthenticationFailureHandler() {
        super("/login?error");
    }

    @Override
    public void onAuthenticationFailure(
            HttpServletRequest request, HttpServletResponse response,
            AuthenticationException exception)
            throws IOException, ServletException {

        String usernameParameter =
                UsernamePasswordAuthenticationFilter.SPRING_SECURITY_FORM_USERNAME_KEY;
        String lastUserName = request.getParameter(usernameParameter);

        HttpSession session = request.getSession(false);
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
@Override
protected void configure(HttpSecurity http) throws Exception {
    http
            .authorizeRequests()
            .antMatchers("/")
                .access("hasRole('ROLE_USER') or hasRole('ROLE_ADMIN')")
            .and()
            .formLogin()
            .loginPage("/login")
            .failureHandler(usernameInUrlAuthenticationFailureHandler())
            .and()
            .logout();
}

@Bean
public UsernameInUrlAuthenticationFailureHandler usernameInUrlAuthenticationFailureHandler() {
    return new UsernameInUrlAuthenticationFailureHandler();
}
```

Valamint a megváltozott form:

```xml
Felhasználónév: <input th:field=*{username} type="text" />
```

## Metódus szintű jogosultságkezelés

Ezen kívül a Spring Security képes arra is, hogy különböző metódusok
meghívása esetén is végezzen jogosultság ellenőrzést. Ezt deklaratív
módon, annotációval is meg lehet adni. Ekkor egyrészt deklarálni kell,
hogy metódus szintű hozzáférés ellenőrzést szeretnénk, ekkor a
`@EnableGlobalMethodSecurity` annotációt kell elhelyezni az `SecurityConfig`
osztályunkon:

```java
@EnableGlobalMethodSecurity(prePostEnabled = true, proxyTargetClass = true)
public class SecurityConfig extends WebSecurityConfigurerAdapter {
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
