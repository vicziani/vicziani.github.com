---
layout: post
title: Spring Security ACL
date: '2010-07-11T20:51:00.007+02:00'
author: István Viczián
tags:
- open source
- biztonság
- Library
- Tesztelés
- Maven
- Spring
modified_time: '2023-07-15T10:00:00.000+02:00'
---

Frissítve: 2023. július 15.

Felhasznált technológiák: Spring Boot 3, Spring Security 6

## Bevezetés

A Spring Security-ről már volt szó egy [korábbi
posztban](/2010/01/10/spring-security.html), ebben a cikkben az üzleti
objektumok biztonságáról (Domain Object Security) írok, melyet a Spring
Security ACL-ekkel old meg, valamint megemlíteném a Spring Security 3
egyik fő újdonságát (Expression-Based Access Control).

A Spring Security többek között deklaratív autentikációt (durván
bejelentkezés, azonosítás) és autorizációt (jogosultságkezelés)
biztosít. Ez utóbbit webes alkalmazásoknál úgy használjuk ki, hogy URL
mintákat, védett erőforrásokat határozunk meg, és ezekhez
szerepköröket rendelünk, így ezen oldalakat csak azon felhasználók
tudják megnézni, akik rendelkeznek az elvárt szerepkör(ök)kel. Lehetőség
van ezen kívül metódushívás szintű jogosultságkezelés megvalósítására
is, ilyenkor azt tudjuk megmondani, hogy az adott metódust milyen
szerepkörrel rendelkező felhasználó tudja meghívni. Amennyiben a
felhasználó nem rendelkezik a megadott szerepkörrel, kivétel keletkezik.

Azonban ez sok esetben nem elegendő, komolyabb üzleti alkalmazásnál
szükségünk lehet arra, hogy megmondjuk, hogy melyik üzleti objektumon,
melyik felhasználó (vagy milyen szerepkörrel rendelkező felhasználó),
milyen műveleteket tudjon elvégezni. Pl. vegyünk egy szerkesztőségi
rendszert, ahol minden cikkre megmondhatjuk, hogy melyik felhasználó
tudja az adott cikket megtekinteni, ki tudja szerkeszteni, esetleg
törölni.

Ezt persze a már említett posztban lévő eszközökkel is meg lehet
valósítani. Pl. lehet az üzleti metódusban lekérni a
`SecurityContextHolder.getContext().getAuthentication()` metódussal a
bejelentkezett felhasználót, és a szerint végezni el az üzleti
műveletet. Amennyiben szépen akarjuk csinálni, ezt akár AOP-vel is
csinálhatjuk, és külön kódba szervezhetjük ki. Ennek használatával
azonban szoros lesz a kapcsolat az üzleti logika és a
jogosultág-ellenőrzés között, kevésbé lesz átlátható,
újrafelhasználható.

Szerencsére a Spring Security beépített megoldást ad a problémára,
melynek neve a [Domain Object
Security](https://docs.spring.io/spring-security/reference/servlet/authorization/acls.html),
melyet ACL-ek (access control list), hozzáférési listákkal valósít meg.
Az [ACL-ek](http://en.wikipedia.org/wiki/Access_Control_List) használata
a számítástechnikában máshol is igen elterjedt. Egy ACL egy erőforráshoz
tartozik, egy lista, ami tartalmazza, hogy az adott erőforráson mely
felhasználók milyen műveleteket végezhetnek. Tipikus példa erre a
fájlrendszerek, ahol minden fájlhoz/könyvtárhoz tartozik egy ACL, mely
leírja, hogy mely felhasználók és csoportok
olvashatják/írhatják/futtathatják (listázhatják) az adott
fájlt/könyvtárat. Az ACL elemei az ACE-k (access control entry), mely
egy sor az ACL-ben.

<!-- more -->

## Spring Security ACL fogalmai

Nézzük, a Spring Security milyen fogalmakat definiál, és ezekhez milyen
interfészek kapcsolódnak. Először is egy UML diagram.

<a href="/artifacts/posts/2010-07-11-spring-security-3-acl/SpringSecurityAclModel_b.png" data-lightbox="post-images">![UML osztálydiagram](/artifacts/posts/2010-07-11-spring-security-3-acl/SpringSecurityAclModel_b.png)</a>

Forrás: [Grzegorz Borkowski: Spring Security ACL - very basic
tutorial](http://grzegorzborkowski.blogspot.com/2008/10/spring-security-acl-very-basic-tutorial.html).

A Spring Security alapban biztosít egy Spring `JDBCTemplate`-tel
megvalósított perzisztenciát is a Domain Object Security-hez, mely a
legtöbb adatbáziskezelőn működik, hiszen ANSI SQL utasításokat
használnak benne. Így az interfészeknél leírom, hogy példányait milyen
táblában tárolja a Spring Security.

-   A fő interfész az `Acl`, mely a listát tartalmazza egy üzleti
    objektumhoz. Ahogy említettem, egy üzleti objektumhoz egy ACL
    tartozik, és ez tárolja a listaelemeket, melyek felhasználó/művelet
    párosok, és egy ilyen elem adja meg, hogy az adott üzleti objektumra
    van-e az adott felhasználónak jogosultsága. Az ACL-ek fa hierarchiát
    alkothatnak, így a szülőre is tartalmaz egy referenciát (`parent`). Az
    `Acl` `isGranted` metódusát hívva lehet eldönteni, hogy az adott
    felhasználó(k)nak van-e joga az adott üzleti objektumon a kérdéses
    műveletet elvégeznie. Az első paramétere a `Permission` lista, melyben
    a műveleteket adhatjuk meg, a második paramétere a felhasználók
    listája, és a harmadik paramétere, hogy kell-e audit naplózni a
    műveletet, vagy adminisztratív okokból történt az esemény, ekkor nem
    kell naplózni. Erre választ a kapcsolódó példányok alapján tud
    választ adni. Valamint tartalmaz egy referenciát a tulajdonos
    felhasználóra is (`owner`).
-   A felhasználót Sid-nek nevezi (Security Identity), ugyanis lehet
    principal név (ami vagy egy személyhez, vagy egy rendszerhez
    kapcsolódó felhasználónév), vagy lehet szerepkör is, azaz a Spring
    Security szóhasználatban `GrantedAuthority` név. A Sid-en kívül a
    másik gyűjtőnevük a recipient. Így a `Sid` interfésznek két
    leszármazottja is van, `PrincipalSid`, valamint `GrantedAuthoritySid`.
-   Az `Acl` nem tartalmaz közvetlen referenciát az üzleti objektumra,
    hanem helyette egy `ObjectIdentity` példányra. Ennek két attribútuma
    az üzleti objektum osztálya (`javaType`), valamint egyedi azonosítója
    (`identifier`). Ennek egy implementációja a `ObjectIdentityImpl`. A
    Domain Object Security úgy lett megvalósítva, hogy megfelelően
    kezeli a `Long`, vagy `Long`-gá konvertálható egyedi azonosítóval
    rendelkező üzleti objektumokat. Amennyiben nem ilyen üzleti
    objektumaink vannak bizonyos interfészeket magunknak kell
    implementálnunk. A Spring Security készítői később sem kívánják
    támogatni a `Long`-tól eltérő egyedi azonosítókat. (Én személy szerint
    amúgy is mindenkinek javaslom, hogy minden üzleti objektumnak legyen
    egy `Long` egyedi azonosítója, és kerüljük pl. szöveget, dátumot
    tartalmazó, valamint az összetett elsődleges kulcsokat.
-   Az ACL ACE elemeket tartalmaz, melyeket az `AccessControlEntry`
    interfész reprezentálja. Ez tartalmaz egy referenciát egy műveletre
    (`Permission`), valamint egy `Sid`-re, van egy egyedi azonosítója,
    valamint egy `granting` attribútuma, ami azt mondja meg, hogy az adott
    jogosultság aktív-e, vagy visszavonásra került.
-   Lehet saját `Permisson` megvalósítást is alkalmazni, de a Spring
    Security alapértelmezetten tartalmazza a `BasePermission` osztályt,
    mely a következő műveleteket definiálja: `CREATE`, `READ`, `WRITE`,
    `DELETE`, `ADMINISTRATION`, a legtöbb esetben ez is elég lehet.

A Spring Security ezen interfészek példányaihoz, illetve a példányok
által ábrázolt információkhoz a `AclService` interfészen keresztül enged
hozzáférést, melyre kérhetünk
referenciát dependency injectionnel. Ennek a `readAclById` és
`readAclsById` metódusaivel férhetünk hozzá az ACL-ekhez. Nem mindig
használjuk ezt direktben, később látni fogjuk, hogy lehet deklaratív
módon használni.

Az `AclService` leszármazottja a `MutableAclService`, mely már módosítási
műveleteket is megenged az ACL-eken. Ugyanis ezen alkalmazásokban már
nem lehet deklaratív módon felvenni az ACL-eket, hiszen maguk az üzleti
objektumok is folyamatosan változnak, jönnek létre és szűnnek meg, ezért
az üzleti logikának kell arról is gondoskodnia, hogy az ACL-eket is az
üzleti objektumokkal együtt módosítsa. Az `AclService` egyik
implementációja a `JdbcAclService`, a `MutableAclService` implementációja a
`JdbcMutableAclService`, mely ANSI SQL műveletekkel kezeli az ACL-ek
perzisztenciáját relációs adatbázisokban. A `JdbcMutableAclService` a
lekérdezéseket egy `LookupStrategy` implementációnak delegálja, mely az
adatbázisra optimalizált lekérdezést tartalmazhatja. Ennek egy
implementációja megtalálható a Spring Security-ban is
`BasicLookupStrategy` néven. Ha az adott adatbázis speciális lehetőségeit
(pl. hierarchikus lekérdezések, materializált nézet, reduce
normalization) ki akarjuk használni, saját osztályt kell írni, mely
implementálja a `LookupStrategy` interfészt. A `BasicLookupStrategy` nem
támogatja a leszármaztatást. Mind a `JdbcMutableAclService`-nek, mind a
`BasicLookupStrategy`-nek szüksége van egy `DataSource`-ra.

Ahogy említettem a jogosultság ellenőrzéséhez használhatnánk az
`AclService` megfelelő metódusait, de van egy egyszerűbb deklaratív
módszer is, mely a Spring Security 3-asban jelent meg, és erősen
támaszkodik a Spring 3 Spring Expression Language-ére. Ezt
Expression-Based Access Control-nak nevezi, melyet annotációkban
alkalmazhatunk. Ebből az ACL is elérhető, és pl. deklarálni lehet, hogy
az adott metódus hívása előtt vagy után milyen üzleti objektumon
(metódus paraméter vagy visszatérési érték), milyen műveletre való
jogosultságot kell ellenőrizni. Valamint lehetőség van filterezésre is,
ami pl. egy metódus visszatérési értékeként szereplő listából
eltávolítja azon üzleti objektumokat, melyekre a bejelentkezett
felhasználónak nincs meg a megfelelő műveletre a megfelelő jogosultsága.
Persze a háttérben ebből ugyanúgy egy ACL lekérdezés, majd metódushívás
lesz.

A Domain Object Security ezeken felül a következőket biztosítja:

-   Caching
-   Transzparens adatbázis műveletek
-   Perzisztencia úgy megvalósítva, hogy minimális legyen a deadlock
    valószínűsége
-   ORM-től való függetlenség, hiszen plain JDBC van a háttérben
-   Egységbezárás

## Spring Security ACL adatbázis szerkezet

Most, hogy ismerjük a Java interfészeket, nézzük, hogy történik a
kapcsolódó objektumok perzisztenciája.

<a href="/artifacts/posts/2010-07-11-spring-security-3-acl/springsecurityacl_b.png" data-lightbox="post-images">![Adatbázis](/artifacts/posts/2010-07-11-spring-security-3-acl/springsecurityacl_b.png)</a>

A `ACL_OBJECT_IDENTITY` tábla egy sora tartozik minden egyes üzleti objektumhoz.
Ez tartalmaz egy külső kulcsot az `ACL_CLASS` táblára, mely tartalmazza
az üzelti objektum osztályának teljes nevét (fully qualified name -
csomaggal együtt). Egy `ACL_OBJECT_IDENTITY` táblabeli sorhoz több `ACL_ENTRY`
táblabeli sor
tartozhat, mely összeköti az üzleti objektumot, a Sid-et, valamint a
`MASK` mezőben (32 biten) tárolja, hogy mely műveletek megengedettek.
Ebből pl. a `BasePermission` csak 5 bitet használ fel, hiszen 5 műveletet
definiál (read - bit 0, write - bit 1, create - bit 2, delete - bit 3 és
administer - bit 4). Az `ACL_SID` tábla tartalmazza a Sid-eket, vagyis a
felhasználók vagy szerepkörök neveit.

## Példa alkalmazás

Bár a disztribúció tartalmaz egy [példa
alkalmazást](https://github.com/spring-projects/spring-security/tree/master/samples/contacts-xml/),
készítettem én is egyet, mely talán egy kicsit egyszerűbb, és
[megtalálható a
GitHub-on](https://github.com/vicziani/jtechlog-spring-security-acl).

Az alkalmazás Maven-nel buildelhető. A különböző funkciókat JUnit teszt
esetek tesztelik, szóval a `mvnw integration-test` parancs kiadásával fordítható és
tesztelhető a projekt.

Az példa egy egyszerű szerkesztőségi rendszer service rétege, melyben
cikkeket lehet felvenni, és be lehet állítani, hogy melyik cikken melyik
felhasználó milyen műveletet végezhet. Az entitás az `Article` osztály,
év van egy `ArticleRepository` Spring Data JPA repository, 
és egy `ArticleService`, osztály.

Az ACL használatához először létre kell hozni a fentebb bemutatott
táblákat. A létrehozó script megtalálható a
[dokumentációban](https://docs.spring.io/spring-security/reference/servlet/appendix/database-schema.html)
HyperSQL-re és PostgreSQL-re, de megtalálhatóak a
`spring-security-acl.jar` fájlban is `createAclSchema.sql` néven.

### Példa alkalmazás konfiguráció

A Spring Security konfigurációja a `SecurityConfig` osztályban 
található.

```java
@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    @Autowired
    private DataSource dataSource;

    @Bean
    public AuditLogger auditLogger() {
        return new ConsoleAuditLogger();
    }

    @Bean
    public PermissionGrantingStrategy permissionGrantingStrategy() {
        return new DefaultPermissionGrantingStrategy(auditLogger());
    }

    @Bean
    public Cache cache() {
        return new ConcurrentMapCache("acl");
    }

    @Bean
    public AclAuthorizationStrategy aclAuthorizationStrategy() {
        return new AclAuthorizationStrategyImpl(new SimpleGrantedAuthority("ROLE_ADMIN"));
    }

    @Bean
    public AclCache aclCache() {
        return new SpringCacheBasedAclCache(cache(), permissionGrantingStrategy(), aclAuthorizationStrategy());
    }

    @Bean
    public LookupStrategy lookupStrategy() {
        return new BasicLookupStrategy(dataSource, aclCache(), aclAuthorizationStrategy(), auditLogger());
    }

    @Bean
    public MutableAclService mutableAclService() {
        return new H2JdbcMutableAclService(dataSource, lookupStrategy(), aclCache());
    }

    @Bean
    public AclPermissionEvaluator permissionEvaluator() {
        return new AclPermissionEvaluator(mutableAclService());
    }

    @Bean
    public DefaultMethodSecurityExpressionHandler expressionHandler() {
        var expressionHandler = new DefaultMethodSecurityExpressionHandler();
        expressionHandler.setPermissionEvaluator(permissionEvaluator());
        return expressionHandler;
    }

}
```

Az `@EnableMethodSecurity` mondja meg,
hogy a metódusokon szereplő `Pre/PostAuthorize` és `@Pre/PostFilter` annotációkban adjuk meg az authorizációs szabályokat.

A `aclCache` bean állítja be, hogy az ACL jelenleg egy `ConcurrentMap`-et használjon cache-eléshez. 

Az `AclAuthorizationStrategyImpl` azt adja meg,
hogy milyen jogosultságok szükségesek ahhoz, hogy módosítani lehessen az
ACL tulajdonosát, módosítani az audit naplózás beállításokat, valamint
módosítani egyéb ACL és ACE beállításokat.

Megadjuk az ACL-ek lekérdezéséhez szükséges `lookupStrategy` bean-t. 

Szükséges egy `AuditLogger` is, melynek egyetlen beépített implementációja a
`ConsoleAuditLogger`.

A `mutableAclService`-t használjuk az alkalmazásunkból is, melyekkel az Acl-eket tudjuk módosítani.

Az annotációkban az authorizációs szabályokat SpEL-lel adjuk meg, ehhez kell az `expressionHandler` és a `permissionEvaluator`.
Az utóbbi dolga a expression system és a Spring Security's ACL system közötti híd megépítése.

Sajnos a Spring Security ACL nem támogatja a H2 adatbázist, ugyanis a `JdbcMutableAclService` a generált
azonosítókat a `call identity()` hívással kéri le, melyet az újabb H2 már nem támogat.
Ezért egy új `H2JdbcMutableAclService` leszármazottat kellett létrehoznom.

### Üzleti objektumhoz ACL rendelése

Nézzük először, hogy hogyan történik az üzleti objektumhoz ACL
rendelése, ehhez nézzük meg a `grantPermission` metódus implementációját.

```java
@Transactional
public void grantPermission(String principal, Article article, ArticlePermission... permissions) {
    log.info("Grant {} permission to principal {} on article {}", permissions, principal, article);
    ObjectIdentity oi = new ObjectIdentityImpl(Article.class, article.getId());
    Sid sid = new PrincipalSid(principal);

    MutableAcl acl;
    try {
        acl = (MutableAcl) aclService.readAclById(oi);
    } catch (NotFoundException nfe) {
        acl = aclService.createAcl(oi);
    }

    for (ArticlePermission permission : permissions) {
        acl.insertAce(acl.getEntries().size(), permission.getBasePermission(), sid, true);
    }
    aclService.updateAcl(acl);
}
```

Először példányosítunk az üzleti objektum alapján egy `ObjectIdentityImpl`
példányt. Majd lekérdezzük hozzá az ACL-t, és ha nincs, létrehozunk hozzá egyet. Majd
az ACL-be felveszünk egy ACE-t, sorrendben a végére, mely tartalmaz egy
referenciát a paraméterként átadott felhasználóra és műveletekre. 

Azaz a `ArticleServiceIT` teszt osztályban a
következő sor (mely a `BeforeEach` annotációval ellátott `init()` metódusban
található) a `user1` felhasználónak megadja a jogosultságot, hogy az `1`-es
azonosítójú cikket szerkeszteni és módosítani tudja.

```java
articleService.grantPermission("user1", article1, ArticlePermission.READ, ArticlePermission.WRITE);
```

### Üzleti objektumhoz való hozzáférés ellenőrzése

A következő lépésben meg kell valósítani a jogosultságkezelést. Ez
történhet kódból is, javasolt AOP-vel, pl. metódushívás előtt
`AccessDecisionVoter` használata, metódushívás után
`AfterInvocationProvider` használata. Ezekben az `aclService` használatával
le kell kérni az üzleti objektumhoz tartozó ACL-t, majd annek kell
meghívni a `isGranted` metódusát. De vannak erre az ACL-ben megfelelő
osztályok is, mint az `AclEntryVoter`, `AclEntryAfterInvocationProvider`
vagy az `AclEntryAfterInvocationCollectionFilteringProvider`. De sokkal
egyszerűbb a Expression-Based Access Control használata, amit az
annotációk paramétereként használhatunk.

Nézzük is a `findArticleById` és `updateArticle` metódusok implementációját.

```java
@Override
@PreAuthorize("hasPermission(#id, 'jtechlog.acltutorial.Article', 'READ') or hasRole('ADMIN')")
public Article findArticleById(long id) {
    return articleRepository.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("Can not find article with id: %d".formatted(id)));
}

@Transactional
@PreAuthorize("hasPermission(#id, 'jtechlog.acltutorial.Article', 'WRITE') or hasRole('ADMIN')")
public void updateArticle(long id, String text) {
    Article article = articleRepository.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("Can not find article with id: %d".formatted(id)));
    article.setText(text);
}
```

Az első `PreAuthorize` annotációban lévő kifejezés azt jelenti, hogy a
metódust csak az futtathatja, akinek az `id` paraméterben átadott id-jú
`Article` típusú üzleti objektumhoz van read jogosultsága (azaz az 1-es
Article ACL-jének ACE-i között szerepel), vagy `ADMIN` szerepkörű. 

A
második `PreAuthorize` annotációban szereplő kifejezés azt jelenti, hogy
csak az hívhatja meg a metódust, akinek a paraméterként átadott `Article`
üzleti objektra van `write` jogosultsága vagy `ADMIN` szerepkörű. Tehát
látható, hogy feltételt lehet megadni üzleti objektum azonosítójára és
magára az objektumra is. Az ehhez tartozó teszt eset pl. a
`userWithRead`, akinek van olvasási de nincs írási jogosultsága az
`1`-es `Article` üzleti objektumhoz. A `#`-os megadási módhoz szükséges a
debug információkat is a kódba fordítani.

```java
@Test
void userWithReadAndWrite() {
    asUser("user1", "ROLE_USER");
    articleService.findArticleById(1);
    articleService.updateArticle(1L, "test");
}
```

Az első sorban beállítjuk a bejelentkezett felhasználót, majd meghívjuk
a két üzleti metódust, amiből az elsőhöz lesz, a másodikhoz nem lesz
jogosultsága. És ne feledjük, az üzleti objektum alapján!

Az `asUser` metódus bejelentkezteti a felhasználót a következő módon:

```java
void asUser(String username, String... authorities) {
    SecurityContextHolder.getContext()
        .setAuthentication(new UsernamePasswordAuthenticationToken(username, "pass1",
            Arrays.stream(authorities).map(SimpleGrantedAuthority::new).toList()));

}
```

Azért nem használhatjuk pl. a `@WithMockUser` annotációt, mert annak használatával nem lehet megoldani,
hogy a teszt metódus az egyik felhasználó nevében fusson, de a `@BeforeEach`
annotációval ellátott metódus pedig a másik (admin) felhasználó nevében.

### Filterelés

Még egy érdekes funkció, hogy az ACL képes filter-elni, szűrni az üzleti
objektumokat egy kollekcióból a jogosultság alapján.

```java
@PostFilter("hasPermission(filterObject, 'READ') or hasRole('ADMIN')")
public List<Article> findAllArticles() {
    return articleRepository.findAll();
}
```

A `@PostFilter` annotáció hatására a visszaadott listából kiveszi az ACL
azon üzleti objektumokat, melyekre nincs olvasási jogosultsága a
bejelentkezett felhasználónak. Vigyázzunk, hogy nagy listák esetén ne
így használjuk, mert az adatbázisból lekérdezésre kerül, majd onnan
lesznek kiszórva. Hatékonyabb megoldás, ha már eleve csak a megfelelő
üzleti objektumokat kérdezzük le. A hozzá tartozó teszt eset a
`filterUser2`, ugyanis a `user2`-nek kevesebb cikkre van
jogosultsága.

```java
@Test
void filterUser2() {
    asUser("user2", "ROLE_USER");
    List<Article> articles = articleService.findAllArticles();
    assertEquals(1, articles.size());
}
```

Tesztelés közben tudatosult bennem, hogy ne módosítgassuk a táblákat az
ACL alatt, hiszen a cache miatt az adatbázis módosítás nem fog látszani.

További olvasnivalók:

[Heraclitus on software blog: Simple web application with Spring
Security](http://heraclitusonsoftware.wordpress.com/software-development/spring/simple-web-application-with-spring-security-specification/)
