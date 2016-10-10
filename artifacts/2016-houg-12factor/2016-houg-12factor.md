class: inverse, center, middle

# Üzemeltethető Java alkalmazások

HOUG Szakmai Nap - 2016. október

.card[
* .card-img[![Viczián István](belyegkep.png)]
* Viczián István
* Java fejlesztő - [IP Systems](http://ipsystems.hu/)
* @vicziani at Twitter
* http://jtechlog.hu
]

---

# Twelve-factor app

* [Twelve-factor app](https://12factor.net/) egy manifesztó, metodológia felhőbe telepíthető alkalmazások fejlesztésére
* Heroku platform fejlesztőinek ajánlása
* Előtérben a cloud, PaaS, continuous deployment

---

# Cloud native

* Jelző olyan szervezetekre, melyek képesek az automatizálás előnyeit kihasználva gyorsabban megbízható és skálázható alkalmazásokat szállítani
* Pivotal, többek között a Spring mögött álló cég
* Előtérben a continuous delivery, DevOps, microservices
* [Beyond the Twelve-Factor App](https://pivotal.io/beyond-the-twelve-factor-app) eBook

---

# Spring Boot

* Convention over configuration
* Spring alkalmazás fejlesztésének könnyítésére, auto-configuration
* "Just run"
* Üzemeltetés támogatás: embedded web container, externalized configuration, metrics, health check

---

# Spring Cloud

* Eszközök elosztott rendszereknél alkalmazott olyan minták megvalósítására, mint configuration management, service discovery, routing, load balancing, circuit breakers, stb.
* Előtérben a cloud, microservices

---

# Verziókezelés

* Egy alkalmazás, egy repository
* A többi függőségként definiálandó
* Maven/Gradle plugin Git információk kinyerésére
* Git információk mutatása az `/info` endpointon

---

# Konfigurációkezelés

* Kód és konfiguráció különválasztása
* Konfiguráció a környezethez tartozik
* Ne alkossunk csoportokat, "környezeteket"
* Környezeti változók
* Backing service

---

# Spring Cloud Config

* [Spring Cloud Config](https://cloud.spring.io/spring-cloud-config/) kliens-szerver típusú konfiguráció tárolás
* Config repository: Git, Subversion
* REST API
* Titkosítás
* Refresh

---

# Port binding

* Self-contained, beágyazott web konténer
* Port konfigurációban szabályozható

---

# Naplózás

* Alkalmazásnak nem feladata napló fájlok kezelése
* Pull `stdout`
* JUL, Log4J, Logback támogatás
* Externalized configuration
* Hierarchia, szintek
* Futás közbeni módosítás

---

# Üzemeltetési feladatok

* Adatbázis migráció: [Liquibase](http://www.liquibase.org/), [Flyway](https://flywaydb.org/)
* Spring Boot Actuator
* `info`, `env`, `beans` endpoint
* Metrics, Healthcheck
* Audit
* Trace
* REPL
* Admin Server

---

# Összefoglalás

* Ismerjük meg a Twelve-factor app mintáit, és használjuk a nyelvezetét
* Nem feltétlenül felhős környezetben
* Figyeljünk az üzemeltethetőségre
