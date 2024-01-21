---
layout: post
title: JSF használata Spring Boottal
date: '2019-08-27T22:00:00.000+02:00'
author: István Viczián
description: Hogyan integráljuk Spring Boot projektünkbe a JSF-et.
modified_time: '2023-12-14T10:00:00.000+01:00'
---

Frissítve: 2023. december 14.

Tudom, a mai HTML/CSS/JavaScript világban a JSF, mint felületi technológia nem
túl csábító, azonban bizonyos helyzetekben jó választásnak tűnhet. A JSF a
Java EE szabvány része, minden alkalmazásszerver beépítetten támogatja.
Komponens alapú fejlesztést tesz lehetővé, és MVC tervezési minta szerint épül fel.
Java programozók pillanatokon belül használatba tudják venni, egy teljes 
másik stack megtanulása nélkül, és nagyon gyorsan lehet vele haladni. Persze
ha nagyon egyéni képernyőket és komponenseket kell fejleszteni, máris előjön a
gyengesége. Olyan projektet is láttam, ahol a belső felhasználású admin felületeket 
JSF-ben készítették el, és csak a publikus oldalakon használtak
valami modern JavaScript keretrendszert.

Bár a JSF a Java EE része, remekül integrálható Spring Frameworkkel, sőt
Spring Boottal is. Bár a Spring Boot beépített JSF támogatást nem tartalmaz,
létezik a [JoinFaces](http://joinfaces.org/) projekt, mely remek
startereket tartalmaz szinte az összes JSF implementációhoz (pl. Mojarra,
PrimeFaces, stb.). Sőt Spring Security integrációt is tartalmaz.

Akit nem hoz lázba a JSF, annak is érdemes a posztot elolvasnia, mert
szó esik majd a JSF néhány furcsa tulajdonságáról, a tesztelésről (, ami
mostanában a szívügyem) és még Demeter törvényéről is.

A poszthoz természetesen a GitHubon működő [példaprojekt](https://github.com/vicziani/jtechlog-jsf) érhető el.

<!-- more -->

Az alkalmazás háromrétegű Spring Boot alkalmazás, H2 beágyazott adatbázissal,
Spring Data JPA perzisztens réteggel, Liquibase adatbázis séma inicializációval. 
Getter/setterek, konstruktorok generálására Lombokkal. Unit és integrációs tesztekkel.

A JSF használatába vételéhez kizárólag egy JoinFaces starter projektet kell
függőségként felvenni a `pom.xml` fájlban.

```xml
<dependencyManagement>
  <dependencies>
    <dependency>
      <groupId>org.joinfaces</groupId>
      <artifactId>joinfaces-platform</artifactId>
      <version>5.2.0</version>
      <type>pom</type>
      <scope>import</scope>
    </dependency>
  </dependencies>
</dependencyManagement>

  
<dependencies>
  <!-- ... -->
  
  <dependency>
    <groupId>org.joinfaces</groupId>
    <artifactId>jsf-spring-boot-starter</artifactId>
  </dependency>
</dependencies>    
```

A Spring Boot integráció azonnal látható előnye, hogy a JSF managed beanek lehetnek
egyszerű Spring beanek (, nem szükséges a CDI használata). Ekkor csak egy `@Component`
annotációval kell ellátni, és lehetőleg válasszuk a legkisebb scope-ot, tipikusan a
`@RequestScope` annotációval (lásd pl. a `CreateEmployeeController` osztály).

A példa projekt egy klasszikus CRUD alkalmazás, mely a JSF következő képességeit mutatja be:

* CRUD képernyők felépítése, listázás, beszúrás, módosítás, törlés
* Táblázat komponens
* Űrlapok kezelése
* Backendből előre feltöltött legördülő menü
* URL paraméter kezelés
* Redirect after post minta megvalósítása
* Flash attribútumok kezelése - ezek élettartama a következő kérésig tart. Bekerül a sessionbe,
  de a következő kérésnél a JSF gondoskodik róla, hogy onnan eltávolításra kerüljön.
* Űrlapok tartalmának ellenőrzése (validáció). A JSF és a Spring Boot is remekül integrálható
  a Bean Validation szabványhoz, melynek implementációja a Hibernate Validator. Pl. a 
  `CreateEmployeeCommand` `name` attribútumán egy `@NotBlank` annotáció van. Az is megoldott, hogy
  a hibás komponens másképp jelenjen meg, és a hibaüzenet is a komponens alatt legyen olvasható.
* Üzenetek kezelése
* Több nyelv használata, nyelvváltás. (Ez csak a klasszikus JSF eszközökkel 
  lehetséges, a Spring `LocalResolver` és `LocaleChangeInterceptor`-ával nem integrálható, mert ahhoz MVC kell.)
* Mojarra implementáció komponenseinek formázása BootStrappel. Érdekessége, hogy a BootStrap
  [WebJars](https://www.webjars.org/)-ból jön, azaz klasszikus Maven függőség.
  
A problémák főleg a tesztelésnél jöttek, mind a unit, mind az integrációs tesztelésnél. Sajnos
meglehetősen látszik, hogy a Java EE tervezői a tesztelhetőséget nem tartották szem előtt.

Unit tesztelésnél remekül demonstrálható, hogy miért is kell betartani a függőségekkel kapcsolatos klasszikus szabályokat.

Amennyiben egy üzenetet szeretnénk JSF-ben megjeleníteni, a következő kódrészletet kell használnunk.

```java
FacesContext.getCurrentInstance()
    .getExternalContext()
    .getFlash()
    .put("successMessage", "Employee has created with name " + command.getName());
```

Ez több sebből is vérzik. Amennyiben egy controllerre unit tesztet írunk, a service réteget
mockolva (Mockitoval, lásd `CreateEmployeeControllerTest` osztály) ez a kód
`NullPointerException` kivételt dob, hiszen nem JSF és Servlet konténer környezetben fut, így 
a `FacesContext` `null` értéket ad vissza. Ami ezen a kódon még látszik, hogy statikus metódushívás van,
így a controller és a `FacesContext` között egy erős kapcsolat alakul ki. Ez pont azért rossz, mert nem
mockolható, az implementáció nem cserélhető egy test double-re. Harmadrészt remek példáját
láthatjuk a train wreckre, azaz indokolatlan metódushívás láncolás. Ez a Demeter törvényét sérti,
ugyanis a `FacesContext` belső felépítését is ismernünk kell. A Demeter törvénye szerint ugyanis csak a
_csak a közvetlen barátaiddal beszélgess_, ami azt jelenti, hogy a közvetlen függőségen még lehet matatni,
de ennyire tranzitív módon már ne hívjunk metódusokat. Ha a `FacesContext`-nek nem statikus metódusa lenne,
hanem be lehetne injektálni, még az sem lenne elegendő megoldás, mert ennyi metódust kimockolni teljesen
átláthatatlan kódot eredményezne. Én ezért azt javaslom, hogy direktben ne használjunk `FacesContext`-et,
hanem helyette hozzunk létre egy saját osztályt, Spring beant, melyet utána injektálni lehet, és ezt unit
tesztekben mockolni. Valamint hogy ne sértsük meg a Demeter-törvényét vezessük ki ide az összes szükséges metódust.

```java
@Component
public class MessageContext {

  // ...
  
  public void addMessage(String key, String... arguments) {
    // ..
  }
}
```

Utána persze ezt már a tesztesetben mockolhatjuk és validálhatjuk, hogy a megfelelő paraméterekkel került-e
meghívásra. Persze előbb a helyes üzleti funkcionalitást teszteljük, és csak utána azt az ágat, ahol validációs 
hibaüzenetet kapunk.

```java
@ExtendWith(MockitoExtension.class)
class CreateEmployeeControllerTest {

    @Mock
    MessageContext messageContext;

    @Mock
    EmployeeService employeeService;

    @InjectMocks
    CreateEmployeeController createEmployeeController;

    @Test
    void testCreateEmployee() {
        createEmployeeController.setCommand(new CreateEmployeeCommand("John Doe", 100_000));
        createEmployeeController.createEmployee();

        verify(messageContext).addFlashMessage(eq("employee_has_been_created"), eq("John Doe"));
        verify(employeeService).createEmployee(argThat(command -> command.getName().equals("John Doe")));
    }

    @Test
    void testCreateEmployeeWhenEmployeeExists() {
        doThrow(new NameAlreadyExistsException("Name already exists")).when(employeeService).createEmployee(any());
        createEmployeeController.setCommand(new CreateEmployeeCommand("John Doe", 100_000));
        createEmployeeController.createEmployee();

        verify(messageContext).addMessage("name_already_exists");
    }
}
```

Figyeljük meg, hogy Java 8 óta a Mockitoba mennyire elegánsan használható ellenőrzés a paraméterre
lambda kifejezéssel `ArgumentCaptor` helyett.

A következő probléma az integrációs tesztelésnél jelentkezett. Sajnos a JSF annyira épít az
alatta elhelyezkedő servlet containerre, hogy nem lehet anélkül futtatni, valamint a 
MockMVC sem használható. Azaz integrációs teszteléshez el kell indítani a konténert is,
és ezen futtathatóak pl. end-to-end tesztek pl. Selenium WebDriverrel.

Spring Boot esetén ez is könnyen implementálható, a teszt esetnél csak a következő annotációt kell megadni:

```java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
```

Ekkor a beépített (Tomcat) konténer is el fog indulni véletlenszerűen választott üres porton, és így
tesztelhető az alkalmazás JSF rétege.
  
Amennyiben át akarunk váltani más implementációra, pl. PrimeFaces-re, csak a
függőséget kell átírnunk.

```xml
<dependency>
	<groupId>org.joinfaces</groupId>
	<artifactId>primefaces-spring-boot-starter</artifactId>
</dependency>
```

Ezen kívül a JSF elejére tegyük be a névtér deklarációt, és máris használhatjuk a 
további komponenseket.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en"
    xmlns:h="http://xmlns.jcp.org/jsf/html"
      xmlns:f="http://xmlns.jcp.org/jsf/core"
      xmlns:ui="http://xmlns.jcp.org/jsf/facelets"
      xmlns:p="http://primefaces.org/ui"
      >
      
      <!-- ... -->

      <p:clock />
      
      <!-- ... -->

</html>
```

És az ígérteknek megfelelően még néhány JSF érdekesség. 

A JSF alapbeálítással a `*.xhtml` állományokat szolgálja ki. Amennyiben azt szeretnénk, hogy
a főoldalon bejöjjön egy JSF oldal a `*.xhtml` kiterjesztés használata nélkül is, akkor
írjunk egy egyszerű Spring MVC controllert, mely a `/` címen hallgat, és átirányítja a kérést a
megfelelő `*.xhtml` kiterjesztésű oldalra (lsd. `IndexForwardController`). 

Amennyiben két JSF tag között nem
szerepel egyéb karakter, a whitespace karaktereket eltávolítja. A `&nbsp;` egyedhivatkozás 
használata hibát dob. Tehát a következőképp tudunk pl. egy space karaktert kiírni két tag közé:

```xml
<h:outputText value=" " />
```

Másik érdekesség, hogy amennyiben megjegyzést szeretnénk használni, a klasszikus HTML megjegyzés meg fog 
jelenni az oldal forrásában. Tehát ha csak a Faceletben szeretnénk látni, akkor a következőképp adjuk meg:


```xml
<ui:remove>
  <!-- Magyarázó comment. Nem az hogy mit, hanem hogy miért! -->
</ui:remove>
```