---
layout: post
title: Spring Security frissítés
date: '2019-03-10T10:00:00.000+01:00'
author: István Viczián
description: Egy poszt a Spring Boot és Spring Security integrációjáról.
---

Technológiák: Spring Boot 2.1.3.RELEASE, Spring Security, Thymeleaf, Spring Data JPA,
H2, Flyway

Frissítettem a [Spring Security](/2010/01/10/spring-security.html)
cikkemet a legfrissebb Java 11, Spring Framework 5.1.5 és Spring Security 5.1.4
verziókra.

A poszthoz tartozó [Spring Security példa projekt elérhető a
GitHubon](https://github.com/vicziani/jtechlog-spring-security).

Azonban mivel már új projektet kizárólag Spring Boottal érdemes kezdeni,
ugyanezen alkalmazást elkészítettem Spring Boottal is. A 
[Spring Security Spring Boottal példa projekt szintén elérhető a GitHubon](https://github.com/vicziani/jtechlog-boot-security).

Most nézzük meg a két projekt közötti hasonlóságokat és különbségeket.

<!-- more -->

A generált, `main` metódust tartalmazó `BootSecurityApplication` osztályt egészítettük ki
a `@EnableWebSecurity` és `@EnableGlobalMethodSecurity` annotációkkal,
valamint leszármaztattuk a `WebSecurityConfigurerAdapter` osztályból.
Ebben az osztályban írtuk meg a `configure` metódust, valamint hoztuk létre a
`PasswordEncoder` és `UsernameInUrlAuthenticationFailureHandler` beaneket.
Itt állítottuk be a `UserDetailsService`-t is.

A többi osztály és Thymeleaf template valójában változatlan. A `User` hordozza
a felhasználó entitást, amihez a `UserRepository` Spring Data JPA repository
tartozik. A `UserService` adja a középső, üzleti logika réteget, és a `UserController`
a Spring MVC controllert. A `UsernameInUrlAuthenticationFailureHandler` osztály
menti el a felhasználónevet a sessionbe sikertelen bejelentkezés esetén, hogy
utána visszaírásra kerüljön az űrlapba.

Az `index.html` template a főoldal, a `login.html` a bejelentkező űrlap.
Az adatbázis inicializálását itt a Flyway végzi a `V1__init.sql` szkript alapján.

A tesztesetek pontosan ugyanolyanok, azzal a különbséggel, hogy a `@SpringBootTest`
annotációval vannak ellátva.

És most nézzük meg a különbségeket. A Spring Boot alkalmazás esetén nincs szükség
a JPA és a Spring Data JPA konfigurálására, az automatikusan megtörténik. Ugyanígy
nincs szükség az adatbázis elindítására, a `DataSource` létrehozására, hiszen azt
is létrehozza.

A `SecurityConfig` tartalma került át a `BootSecurityApplication` osztályba.
Valamint nincs szükség manuálisan konfigurálni a Thymeleafet. Ezen kívül nincs
szükség a `AbstractAnnotationConfigDispatcherServletInitializer` és `AbstractSecurityWebApplicationInitializer`
leszármazottakra sem.