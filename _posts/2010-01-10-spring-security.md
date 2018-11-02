---
layout: post
title: Spring Security
date: '2010-01-10T22:27:00.006+01:00'
author: István Viczián
tags:
- Servlet
- open source
- JSP
- biztonság
- Spring
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Frissítve: 2014. december 31.

Technológiák: Spring Framework 4.1.4, Spring Security 3.2.5

A [Spring Security](http://projects.spring.io/spring-security/) egy
Apache license alatt futó projekt Java alkalmazások autentikációjának és
autorizációjának megvalósítására. Az előbbi azt jelenti, hogy a
felhasználó tesz egy állítást, hogy ő kicsoda, és azt bizonyítja is. A
legtöbbször ez felhasználónév és jelszó párossal történik, de lehet
bonyolultabb megoldás, mint tanúsítvány (akár hardver tokenen),
ujjlenyomat, stb. Az utóbbi az erőforráshoz való hozzáféréskor
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
aspektus-orientált módon adható meg). Egyszerű módon (XML-lel)
konfigurálható, és a legtöbb beállításnak van alapértelmezett értéke is,
mellyel működik a biztonság, de tetszőleges mértékben testre szabható, a
legtöbb osztály akár saját implementációra is kicserélhető
(pluginelhetőség). Implementálva van benne hozzáférési listák kezelése
(Access Control Lists).

Támogatja a HTTP BASIC, HTTP Digest és form alapú autentikációt,
valamint az OpenID-t és a X.509 tanúsítványt.

A felhasználók és a hozzá kapcsolódó szerepkörök tárolhatóak properties
vagy XML állományban, adatbázisban, LDAP-ban, de saját implementáció is
megadható. Támogatja a jelszó kódolását pl. SHA vagy MD5 algoritmussal.
A felhasználóval kapcsolatos információkat képes cache-elni is.
Különböző eseményekre eseménykezelőket lehet aggatni, pl. bejelentkezés,
így könnyen megoldható pl. audit naplózás. Könnyen illeszthető a [CAS
single sign on](http://jasig.github.io/cas/4.0.x/index.html)
megoldáshoz.

Kompatibilis a Servlet Security API-val, használhatóak vele az EJB 3
annotációi, valamint a WSS-hez (korábban WS-Security) is illeszthető.
Képes a security propagation-re, azaz az alkalmazások különböző rétegei
között átvinni a security context-et (pl. a vastag kliensről a
szerverre).

Webes környezetben egy filtert kell a `web.xml`-be betenni. Képes
mindarra, amire a `web.xml`-ben definiálható biztonság, de azt rengeteg
egyéb funkcióval egészíti ki, mint pl. a védett URL-eket nem csak a
Servlet specifikációban megadott korlátozott URL mintákkal lehet
megadni, hanem használható az Ant féle megadási mód is. Konfigurálható,
hogy védet tartalmak esetén történjen https-re átirányítás. Alapból
implementálva van benne két Remember-Me (Persistent Login) megoldás is,
azaz a böngésző cookie-ban jegyezze meg a bejelentkezés tényét. A Spring
Security tag library-t is biztosít funkcióinak elérésére JSP oldalból.

Ebben a posztban egy egyszerű Spring MVC-s webes alkalmazásba
illesztését fogom bemutatni. A poszthoz egy példa projekt is tartozik,
mely [elérhető a
GitHub-on](https://github.com/vicziani/jtechlog-spring-security), és a
teljes forrás akár egy zip fájlban is letölthető. Egyszerű Spring MVC-s
webes alkalmazás JPA perzisztens réteggel.

Első lépésként szerkesszük meg az `web.xml` állományt, és adjuk meg a
Spring Security-t konfiguráló `applicationContext-security.xml`
állományt (a jó elkülöníthetőség kedvéért konfigurálom külön
állományban), valamint a filtert, mely a http(s) kéréseket elkapja, és
ellenőrzi.

{% highlight xml %}
<context-param>
    <param-name>contextConfigLocation</param-name>
    <param-value>
     WEB-INF/applicationContext.xml
     WEB-INF/applicationContext-security.xml
    </param-value>
</context-param>

<filter>
    <filter-name>springSecurityFilterChain</filter-name>
    <filter-class>org.springframework.web.filter.DelegatingFilterProxy
        </filter-class>
</filter>

<filter-mapping>
    <filter-name>springSecurityFilterChain</filter-name>
    <url-pattern>/*</url-pattern>
</filter-mapping>
{% endhighlight %}

A következő lépésben írjuk meg az `applicationContext-security.xml`
állományt.

{% highlight xml %}
<beans:beans xmlns="http://www.springframework.org/schema/security"
    xmlns:beans="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/security
        http://www.springframework.org/schema/security/spring-security.xsd">

    <http auto-config="true">
        <intercept-url pattern="/" access="ROLE_USER, ROLE_ADMIN" />
        <intercept-url pattern="/index.html"
            access="ROLE_USER, ROLE_ADMIN" />
        <intercept-url pattern="/addUser.html"
            access="ROLE_ADMIN" />
        <logout />
    </http>

    <authentication-manager alias="authenticationManager">
        <authentication-provider>
            <password-encoder hash="md5"/>
            <user-service>
                <user name="jtechlog"
                    password="26b91b96e2e8adc37cd26cff6a6b2eba"
                    authorities="ROLE_USER" />
            </user-service>
        </authentication-provider>     
    </authentication-manager>
</beans:beans>
{% endhighlight %}

Az `auto-config` tulajdonság egy rövidítés, a következő alapértelmezett
beállításokat tartalmazza:

{% highlight xml %}
<http>
  <form-login />
  <http-basic />
  <logout />
</http>
{% endhighlight %}

Az `authentication-provider` elemben az XML szerepel egy `jtechlog` nevű
felhasználó, akinek a jelszava MD5-tel kódolva szerepel (`jtechlog12`).
Ezzel készen is van. Az alkalmazásunkat elindítva bármelyik URL-re egy
(Spring Security által generált) bejelentkezési form jön be, hiszen
deklarálva lett, hogy a `/` URL megtekintéséhez a felhasználónak
rendelkeznie kell a `ROLE_USER` vagy `ROLE_ADMIN` szerepkörrel, a
`/addUser.html`-hez `ROLE_ADMIN` szerepkörrel (lásd `intercept-url`
elem). Az azonosítás formon, jelszóval történik (`form-login`).

A `security` névtérben a következőkre adhatunk meg konfigurációkat:

-   Web/HTTP Security
-   Business Object (Method) Security
-   AuthenticationManager
-   AccessDecisionManager
-   AuthenticationProviders
-   UserDetailsService

Amennyiben kijelentkezést is meg akarunk valósítani, a JSP-ben csak
helyezzük el a következő linket:

{% highlight xml %}
<a href="<c:url value='/j_spring_security_logout'/>">Kijelentkezés</a>
{% endhighlight %}

Következő lépésként implementáljuk magunk a felhasználó adatbázisból
való betöltését, méghozzá pl. JPA segítségével. Ehhez kell egy `User`
entitás, melynek különlegessége, hogy implementálnia kell a
`UserDetails` interfészt, és annak több metódusát. Pl.:

{% highlight java %}
@Entity
public class User implements UserDetails, Serializable {

   @Id
   @GeneratedValue
   private Long id;

   private String username;

   private String password;

   private String roles;

    @Override
    public Collection<GrantedAuthority> getAuthorities() {
        Collection<GrantedAuthority> authorities =
            new ArrayList<GrantedAuthority>();
        for (String s: roles.split(", ")) {
            authorities.add(new SimpleGrantedAuthority(
                "ROLE_" + s.toUpperCase()));
        }
        return authorities;
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
{% endhighlight %}

Valamint definiáljunk egy `UserService` nevű `@Repository` osztályt, és
a trükk csak annyi, hogy implementálnia kell a `UserDetailsService`
interfészt.

{% highlight java %}
@Repository("userService")
@Transactional
public class DefaultUserService implements UserDetailsService {

   @PersistenceContext
   private EntityManager em;

   @Override
   public UserDetails loadUserByUsername(String username)
        throws UsernameNotFoundException, DataAccessException {
       try {
           return (UserDetails) em
                .createQuery("select u from User u" +
                    " where u.username = :username", User.class)
                .setParameter("username", username).getSingleResult();
       }
       catch (EntityNotFoundException enfe) {
           throw new UsernameNotFoundException(
                "A felhasznalo nem talalhato: " + username, enfe);
       }
   }

   // Többi üzleti metódus
   // ...
}
{% endhighlight %}

Mivel az `applicationContext.xml`-ben `context:annotation-config` van
beállítva, ami a `@Repository` annotáció miatt példányosítja a
`DefaultUserService` osztályunkat.

A Spring Security-ben az `AuthenticationProvider` is cserélhető, és
ebben az esetben a `DaoAuthenticationProvider`-t kell használnunk. Ennek
megadhatunk egy `userDetailsService` tulajdonságot, melynek a
`UserDetailsService`-t kell implementálnia, és ennek fogja meghívni a
`loadUserByUsername` metódusát. Ezt egy rövidebb konfigurációval is
megadhatjuk az `applicationContext-security.xml` állományban a következő
módon:

{% highlight xml %}
<authentication-provider user-service-ref="userService" />
{% endhighlight %}

Egy `authentication-manager`-en belül több `authentication-provider`-t
is megadhatunk. Ekkor sorban nézi végig a providereket, és ahol először
sikerül az autentikáció, az nyer. Így előbb az XML-ben szereplő
felhasználókat, majd az adatbázisban szereplő felhasználókat fogja
alapul venni, a `User` entitásunk alapján. Ekkor a jelszó még plain
textben kerül letárolásra, de ha mi MD5-öt szeretnénk, konfiguráljuk
így:

{% highlight xml %}
<authentication-provider user-service-ref="userService">
   <password-encoder hash="md5"/>
</authentication-provider>
{% endhighlight %}

A Java kódból ezután a következőképpen kérhetjük le a bejelentkezés után
a felhasználót:

{% highlight java %}
SecurityContextHolder.getContext().getAuthentication().getPrincipal();
{% endhighlight %}

A `Context` `ThreadLocal` változó, így szálanként egyedi. A metódus
visszatérési értékét kényszeríthetjük a saját `User` osztályunkra.

JSP-ben használhatunk tag library-t is, melynek definíciója:

{% highlight xml %}
<%@ taglib prefix="security"
    uri="http://www.springframework.org/security/tags" %>
{% endhighlight %}

Az `authentication` tag visszaadja az `Authentication` objektumot, és
annak tulajdonságait tudjuk lekérni:

{% highlight xml %}
<security:authentication property="principal.username" />
{% endhighlight %}

Valamint az `authorize` tag törzse csak a feltétel teljesítésekor
jelenik meg. A feltételek a következők lehetnek: `ifAllGranted` -
vesszővel megadott szerepkörök mindegyikével rendelkezik, `ifAnyGranted`
- vesszővel megadott szerepkörök egyikével rendelkezik, `ifNotGranted` -
vesszővel megadott szerepkörök egyikével sem rendelkezik.

{% highlight xml %}
<security:authorize ifAllGranted="ROLE_ADMIN">
       <!-- Felhasználók felvételére szolgáló form. -->
</security:authorize>
{% endhighlight %}

Ez esetben még mindig nem vagyunk megelégedve a Spring Security által
biztosított alapértelmezett bejelentkező képernyővel, emiatt szabjuk azt
testre. Az `intercept-url`-lel kell megadni a védendő URL-eket.
Természetesen többet is megadhatunk, egy URL-hez több szerepkört is
megadhatunk vesszővel elválasztva, valamint használhatunk Ant típusú
mintákat. A Spring Security használatakor a leggyakoribb hiba, hogy a
bejelentkezési képernyőt is letiltjuk, így végtelen ciklus alakulhat ki.
Erre a Spring Security egy üzenettel figyelmeztet is:

{% highlight xml %}
org.springframework.security.config.FilterChainProxyPostProcessor: Anonymous access to the login page doesn't appear to be enabled. This is almost certainly an error. Please check your configuration allows unauthenticated access to the configured login page. (Simulated access was rejected: org.springframework.security.AccessDeniedException: Access is denied).
{% endhighlight %}

Ekkor be kell állítani, hogy a `login.html` oldalhoz ne kelljen
bejelentkezés. Sikertelen bejelentkezés esetén történjen átirányítás a
`/login.htm?login_error=1` oldalra, sikeres bejelentkezés esetén a `/`
oldalra. Kijelentkezés után ismét a `/login.htm` oldal jön be. A
konfiguráció a következőképpen alakul:

{% highlight xml %}
<http auto-config="true">
    <intercept-url pattern="/login.html"
        access="IS_AUTHENTICATED_ANONYMOUSLY" />
    <intercept-url pattern="/" access="ROLE_ADMIN, ROLE_USER" />
    <intercept-url pattern="/addUser.html" access="ROLE_ADMIN" />
    <form-login login-page="/login.html" default-target-url="/"
        authentication-failure-url="/login.htm?login_error=1" />
    <logout logout-success-url="/login.html"/>
</http>
{% endhighlight %}

Majd nézzük a bejelentkező formot tartalmazó JSP részletet:

{% highlight xml %}
<c:if test="${not empty param.login_error}">
    Sikertelen bejelentkezés
</c:if>

<form action="<c:url value='/j_spring_security_check'/>" method="POST">
    <input type="text" name="j_username" value=""/>
    <input type="password" name="j_password" value="" />
    <input type="submit" value="Bejelentkezés"/>
</form>
{% endhighlight %}

A formot a `j_spring_security_check` címre kell postolni, amit a filter
fogad. Tartalmaznia kell egy `j_username` és `j_password` mezőt.
Amennyiben nem sikerült a bejelentkezés, a sessionben egy változó lesz
`SPRING_SECURITY_LAST_EXCEPTION` néven.

Régebbi verziókban a sessionbe sikertelen bejelentkezés esetén beletett
egy `SPRING_SECURITY_LAST_USERNAME` nevű változót is, melyet a
felhasználónév mezőbe visszaírva nem kellett a felhasználónak beírnia
újra a nevét. Azonban ez deprecated lett.

Ennek megoldására a `form-login` taghez írni kell egy
`authentication-failure-handler-ref` attribútumot egy saját
implementációval. A saját osztályunk terjessze ki a
`SimpleUrlAuthenticationFailureHandler` osztályt, és önmaga tegye a
felhasználónevet a session scope-ba. Utána a bejelentkező oldalon ezt ki
kell venni.

A következő változott tehát az `applicationContext-security.xml`
állományban.

{% highlight xml %}
<form-login login-page="/login.html" default-target-url="/"
    authentication-failure-handler-ref=
        "usernameInUrlAuthenticationFailureHandler" />

<beans:bean id="usernameInUrlAuthenticationFailureHandler"
        class="jtechlog.springsecurity.service.
            UsernameInUrlAuthenticationFailureHandler">
    <beans:property name="defaultFailureUrl"
        value="/login.html?login_error=1" />
</beans:bean>
{% endhighlight %}

A `UsernameInUrlAuthenticationFailureHandler` implementációja:

{% highlight java %}
public class UsernameInUrlAuthenticationFailureHandler
        extends SimpleUrlAuthenticationFailureHandler {

    public static final String LAST_USERNAME_KEY = "LAST_USERNAME";

    private UsernamePasswordAuthenticationFilter
        usernamePasswordAuthenticationFilter;

    @Autowired
    public UsernameInUrlAuthenticationFailureHandler(
            UsernamePasswordAuthenticationFilter
            usernamePasswordAuthenticationFilter) {
        this.usernamePasswordAuthenticationFilter =
            usernamePasswordAuthenticationFilter;
    }

    @Override
    public void onAuthenticationFailure(
            HttpServletRequest request, HttpServletResponse response,
            AuthenticationException exception)
            throws IOException, ServletException {

        super.onAuthenticationFailure(request, response, exception);

        String usernameParameter =
                usernamePasswordAuthenticationFilter.getUsernameParameter();
        String lastUserName = request.getParameter(usernameParameter);

        HttpSession session = request.getSession(false);
        if (session != null || isAllowSessionCreation()) {
            request.getSession().setAttribute(LAST_USERNAME_KEY,
                lastUserName);
        }
    }
}
{% endhighlight %}

Valamint a megváltozott form:

{% highlight xml %}
<input type="text" name="j_username"
    value='<c:if test="${not empty param.login_error}">
               <c:out value="${sessionScope.LAST_USERNAME}"/>
           </c:if>'/>
{% endhighlight %}

Ezen kívül a Spring Security képes arra is, hogy különböző metódusok
meghívása esetén is végezzen jogosultság ellenőrzést. Ezt deklaratív
módon, annotációval is meg lehet adni. Ekkor egyrészt deklarálni kell,
hogy metódus szintű hozzáférés ellenőrzést szeretnénk, ekkor a
következőt kell elhelyezni az `applicationContext-security.xml`-ben:

{% highlight xml %}
<global-method-security pre-post-annotations="enabled" />
{% endhighlight %}

Valamint használjuk a `@PreAuthorize` annotációt a védendő metóduson:

{% highlight java %}
@PreAuthorize("hasRole('ROLE_ADMIN')")
public void addUser(String name, String password, String roles) {
  // ...
}
{% endhighlight %}
