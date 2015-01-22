---
layout: post
title: Pre-Authentication Spring Security-vel
date: '2015-01-03T16:04:00.000+01:00'
author: István Viczián
tags:
- security
- Spring
modified_time: '2015-01-03T16:04:40.275+01:00'
blogger_id: tag:blogger.com,1999:blog-7370998606556338092.post-3454714244361191903
blogger_orig_url: http://www.jtechlog.hu/2015/01/pre-authentication-spring-security-vel.html
---

Felhasznált technológiák: Spring Security 3.2.5, Jetty 9.1.0.v20131115

Vannak olyan esetek, mikor ugyan Spring Security-t szeretnénk használni, azonban autentikációra meghagynánk a webkonténer, vagy az alkalmazásszerver mechanizmusát. Ilyen eset lehetséges, mikor alkalmazásszerverben van beállítva az X.509 tanúsítványok kezelése, vagy esetleg az SSO-val való integráció.

Ebben az esetben az alkalmazásszerver végzi a bejelentkeztetést, esetleg még a jogosultságok kiosztását is, de a többit a Spring Security végzi. Az alkalmazásszerver a bejelentkeztetett felhasználót és jogosultságait a szabványos módon adja át, lekérdezni a Servlet API `HttpServletRequest` példányának `getUserPrincipal()` és `isUserInRole(java.lang.String role)` metódusaival lehet. A Spring Security-t tehát arra kell rábeszélni, hogy a megfelelő esetekben ide delegálja a hívásait.

A Spring Security használata azért lehet hasznos ebben az esetben is, mert a Servlet API-hoz képest rengeteg plusz funkciót ad, mint pl. URL-ek védelme, amihez a jogosultságokat bonyolult kifejezésekkel adhatjuk meg. Vagy pl. az annotáció alapú deklaratív jogosultságkezelés, stb. A Spring Security-ről bővebben egy [előző posztomban](/2010/01/spring-security.html) olvashatsz, melyet ismét frissítettem, hogy a legfrissebb verziókat tartalmazza. 

Jelenlegi poszthoz egy példaprogram is [letölthető a GitHub-ról](https://github.com/vicziani/jtechlog-spring-security-container). Az `mvn jetty:run` paranccsal indítható. Bejelentkezni az `admin1`/`admin1` és a `user1`/`user1` felhasználónév jelszó párosokkal lehetséges. és Egy Jetty beépített webkonténert tartalmaz, melybe fel vannak véve a felhasználók, és a hozzá tartozó szerepkörök. Első körben a Jetty Maven pluginnak kell megmondani, hogy hol található a Jetty-hez tartozó konfigurációs állomány.

{% highlight xml %}
<plugin>
    <groupId>org.eclipse.jetty</groupId>
    <artifactId>jetty-maven-plugin</artifactId>
    <version>9.1.0.v20131115</version>
    <configuration>
            <webAppXml>src/main/webapp/WEB-INF/jetty.xml</webAppXml>
    </configuration>
</plugin>
{% endhighlight %}

Amennyiben ez megvan, az `src/main/webapp/WEB-INF/jetty.xml` konfigurációs állományban kell megadni, hogy mely állomány tartalmazza a felhasználókat és szerepköröket.

{% highlight xml %}
<?xml version="1.0" encoding="ISO-8859-1"?>
<!DOCTYPE Configure PUBLIC "-//Jetty//Configure//EN" "http://www.eclipse.org/jetty/configure.dtd">
<Configure class="org.eclipse.jetty.webapp.WebAppContext">
    <Get name="securityHandler">
        <Set name="loginService">
            <New class="org.eclipse.jetty.security.HashLoginService">
                <Set name="name">UserRealm</Set>
                <Set name="config">
                    src/main/webapp/WEB-INF/jetty-realm.properties</Set>
                <Call name="start"/>
            </New>
        </Set>
        <Set name="checkWelcomeFiles">true</Set>
    </Get>
</Configure>
{% endhighlight %}

A `src/main/webapp/WEB-INF/jetty-realm.properties` egy elég egyszerű állomány, elöl a felhasználónév, majd a jelszó (plain-text-ben), majd a szerepkör. Teszteléshez tökéletes.

{% highlight xml %}
admin1: admin1,admin
user1: user1,user
{% endhighlight %}

Majd megadjuk a `web.xml`-ben, hogy Basic autentikációt használjon. Ilyenkor a böngésző feldob egy ablakot, és az autentikációs információk a HTTP kérés fejlécében utaznak, plain textben. Ez már szabványos Servlet API megoldás.

{% highlight xml %}
<security-constraint>
    <web-resource-collection>
        <web-resource-name>allwebresource</web-resource-name>
        <url-pattern>/*</url-pattern>
    </web-resource-collection>
    <auth-constraint>
        <role-name>user</role-name>
        <role-name>admin</role-name>
    </auth-constraint>
</security-constraint>

<login-config>
    <auth-method>BASIC</auth-method>
    <realm-name>UserRealm</realm-name>
</login-config>

<security-role>
    <role-name>user</role-name>
</security-role>

<security-role>
    <role-name>admin</role-name>
</security-role>
{% endhighlight %}

Ezután már csak a Spring Security-t konfiguráltam be az `applicationContext-security.xml` állományban, hogy a web konténertől vegye át a felhasználót és a hozzá tartozó szerepköröket. Nézzük az ehhez tartozó konfigurációt.

{% highlight xml %}
<http entry-point-ref="entryPoint" auto-config="false">
        <intercept-url pattern="/index.html" 
            access="IS_AUTHENTICATED_ANONYMOUSLY" />
        <intercept-url pattern="/user.html" 
            access="ROLE_USER,ROLE_ADMIN" />
        <intercept-url pattern="/admin.html" 
            access="ROLE_ADMIN" />
        <custom-filter position="PRE_AUTH_FILTER" 
            ref="preAuthFilter" />
</http>

<authentication-manager alias="authenticationManager">
    <authentication-provider ref="authenticationProvider" />
</authentication-manager>

<beans:bean id="entryPoint"
    class="org.springframework.security.web.authentication.Http403ForbiddenEntryPoint"/>

<beans:bean id="authenticationProvider"
        class="org.springframework.security.web.authentication.preauth.PreAuthenticatedAuthenticationProvider">
    <beans:property name="preAuthenticatedUserDetailsService" 
        ref="userDetailsService"/>
</beans:bean>

<beans:bean id="userDetailsService" 
    class="jtechlog.springsecurity.service.JpaAuthenticationUserDetailsService"/>

<beans:bean id="preAuthFilter" 
        class="org.springframework.security.web.authentication.preauth.j2ee.J2eePreAuthenticatedProcessingFilter">
    <beans:property name="authenticationManager" 
        ref="authenticationManager"/>
    <beans:property name="authenticationDetailsSource">
        <beans:bean 
                class="org.springframework.security.web.authentication.preauth.j2ee.J2eeBasedPreAuthenticatedWebAuthenticationDetailsSource">
            <beans:property name="mappableRolesRetriever">
                <beans:bean 
                    class="org.springframework.security.web.authentication.preauth.j2ee.WebXmlMappableAttributesRetriever" />
            </beans:property>
            <beans:property name="userRoles2GrantedAuthoritiesMapper">
                <beans:bean 
                        class="org.springframework.security.core.authority.mapping.SimpleAttributes2GrantedAuthoritiesMapper">
                    <beans:property name="convertAttributeToUpperCase" 
                        value="true"/>
                </beans:bean>
            </beans:property>
        </beans:bean>
    </beans:property>
</beans:bean>
{% endhighlight %}

Ez talán már igényelhet némi magyarázatot. Az `entryPoint` bean mondja meg, hogy a konténerre van bízva az autentikáció. Az `authenticationProvider` mondja meg, hogy honnan kell a felhasználót feltölteni. Itt egy `PreAuthenticatedAuthenticationProvider` példányt használunk, ami azt mondja, hogy az autentikációt már elvégezte a konténer, és ennek eredménye alapján tölthetünk be saját `User` példányt. Ezt a saját `JpaAuthenticationUserDetailsService` példányunk teszi, adatbázisból a felhasználónév alapján JPA technológiával. A `preAuthFilter` bean a `web.xml`-ben talált szerepköröket mappeli át Spring Security-sra, nagybetűsít, és alapértelmezetten hozzáfűzi a `ROLE_` prefixet. tehát az `admin` és a `user` szerepkörből csinál `ROLE_ADMIN` és `ROLE_USER` szerepköröket, vagy ahogy a Spring Security hívja, granted authority-ket.

A saját `JpaAuthenticationUserDetailsService` lényeg része a következőképp néz ki.

{% highlight java %}
@Override
public UserDetails 
        loadUserDetails(PreAuthenticatedAuthenticationToken token) 
        throws UsernameNotFoundException {
    try {        
        User user = entityManager
            .createQuery("select u from User u where u.username = :username", User.class)
            .setParameter("username", token.getName())
            .getSingleResult();

        PreAuthenticatedGrantedAuthoritiesWebAuthenticationDetails details =
            (PreAuthenticatedGrantedAuthoritiesWebAuthenticationDetails) token.getDetails();

        user.setAuthorities(details.getGrantedAuthorities());
        return user;
    } catch (NoResultException nre) {
        throw new UsernameNotFoundException("A felhasználó a megadott felhasználónévvel nem található: " + token.getName(), nre);
    }
}
{% endhighlight %}

A paraméterként kapott `token` már tartalmazza az alkalmazásszerver által meghatározott felhasználónév és szerepkör információkat, ez alapján betöltjük adatbázisból a felhasználót, és beállítjuk a szintén megkapott szerepköröket.
