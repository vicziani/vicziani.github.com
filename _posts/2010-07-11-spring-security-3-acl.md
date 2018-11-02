---
layout: post
title: Spring Security 3 ACL
date: '2010-07-11T20:51:00.007+02:00'
author: István Viczián
tags:
- open source
- biztonság
- Library
- Tesztelés
- Maven
- Spring
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Frissítve: 2014. január 4.

Felhasznált technológiák: Spring 3.2, Spring Security 3.2, Ehcache
2.6.6, HSQLDB 2.3.1, SLF4J 1.7.5, JUnit 4.11, Maven 3.0.3

A Spring Security-ről már volt szó egy [korábbi
posztban](/2010/01/10/spring-security.html), ebben a cikkben az üzleti
objektumok biztonságáról (Domain Object Security) írok, melyet a Spring
Security ACL-ekkel old meg, valamint megemlíteném a Spring Security 3
egyik fő újdonságát (Expression-Based Access Control).

A Spring Security többek között deklaratív autentikációt (durván
bejelentkezés, azonosítás) és autorizációt (jogosultságkezelés)
biztosít. Ez utóbbit webes alkalmazásoknál úgy használjuk ki, hogy URL
pattern-eket, védett erőforrásokat határozunk meg, és ezekhez
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
SecurityContextHolder.getContext().getAuthentication() metódussal a
bejelentkezett felhasználót, és a szerint végezni el az üzleti
műveletet. Amennyiben szépen akarjuk csinálni, ezt akár AOP-vel is
csinálhatjuk, és külön kódba szervezhetjük ki. Ennek használatával
azonban szoros lesz a kapcsolat az üzleti logika és a
jogosultág-ellenőrzés között, kevésbé lesz átlátható,
újrafelhasználható. Csinálhatjuk azt is, hogy saját AccessDecisionVoter
és GrantedAuthority implementációkat használunk, és minden üzleti
objektumon végezhető művelethez egy GrantedAuthority tartozik. Itt az
üzleti objektumok elszaporodásával a GrantedAuthority példányok száma is
megnövekszik. Valamint az AccessDecisionVoter is hozzáférhetne az üzleti
objektumokhoz, és ez alapján dönthetne a jogosultságról. Ilyenkor kell
neki egy dao referencia, és minden műveletnél az AccessDecisionVoter is
el fog végezni egy plusz műveletet. Azonban minden esetben meg kell
oldanunk a jogosultságok perzisztálását, valamint az üzleti logikát is
módosítanunk kell.

Szerencsére a Spring Security beépített megoldást ad a problémára,
melynek neve a [Domain Object
Security](http://docs.spring.io/spring-security/site/docs/3.2.0.RELEASE/reference/htmlsingle/#domain-acls),
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

Nézzük, a Spring Security milyen fogalmakat definiál, és ezekhez milyen
interfészek kapcsolódnak. Először is egy UML diagram.

<a href="/artifacts/posts/2010-07-11-spring-security-3-acl/SpringSecurityAclModel_b.png" data-lightbox="post-images">![UML osztálydiagram](/artifacts/posts/2010-07-11-spring-security-3-acl/SpringSecurityAclModel.png)</a>

Forrás: [Grzegorz Borkowski: Spring Security ACL - very basic
tutorial](http://grzegorzborkowski.blogspot.com/2008/10/spring-security-acl-very-basic-tutorial.html).

A Spring Security alapban biztosít egy Spring JDBCTemplate-tel
megvalósított perzisztenciát is a Domain Object Security-hez, mely a
legtöbb adatbáziskezelőn működik, hiszen ANSI SQL utasításokat
használnak benne. Így az interfészeknél leírom, hogy példányait milyen
táblában tárolja a Spring Security.

-   A fő interfész az Acl, mely a listát tartalmazza egy üzleti
    objektumhoz. Ahogy említettem, egy üzleti objektumhoz egy Acl
    tartozik, és ez tárolja a listaelemeket, melyek felhasználó/művelet
    párosok, és egy ilyen elem adja meg, hogy az adott üzleti objektumra
    van-e az adott felhasználónak jogosultsága. Az Acl-ek fa hierarchiát
    alkothatnak, így a szülőre is tartalmaz egy referenciát (parent). Az
    Acl isGranted metódusát hívva lehet eldönteni, hogy az adott
    felhasználó(k)nak van-e joga az adott üzleti objektumon a kérdéses
    műveletet elvégeznie. Az első paramétere a Permission lista, melyben
    a műveleteket adhatjuk meg, a második paramétere a felhasználók
    listája, és a harmadik paramétere, hogy kell-e audit naplózni a
    műveletet, vagy adminisztratív okokból történt az esemény, ekkor nem
    kell naplózni. Erre választ a kapcsolódó példányok alapján tud
    választ adni. Valamint tartalmaz egy referenciát a tulajdonos
    felhasználóra is (owner).
-   A felhasználót Sid-nek nevezi (Security Identity), ugyanis lehet
    principal név (ami vagy egy személyhez, vagy egy rendszerhez
    kapcsolódó felhasználónév), vagy lehet szerepkör is, azaz a Spring
    Security szóhasználatban GrantedAuthority név. A Sid-en kívül a
    másik gyűjtőnevük a recipient. Így a Sid interfésznek két
    leszármazottja is van, PrincipalSid, valamint GrantedAuthoritySid.
-   Az Acl nem tartalmaz közvetlen referenciát az üzleti objektumra,
    hanem helyette egy ObjectIdentity példányra. Ennek két attribútuma
    az üzleti objektum osztálya (javaType), valamint egyedi azonosítója
    (identifier). Ennek egy implementációja a ObjectIdentityImpl. A
    Domain Object Security úgy lett megvalósítva, hogy megfelelően
    kezeli a Long, vagy Long-gá konvertálható egyedi azonosítóval
    rendelkező üzleti objektumokat. Amennyiben nem ilyen üzleti
    objektumaink vannak bizonyos interfészeket magunknak kell
    implementálnunk. A Spring Security készítői később sem kívánják
    támogatni a Long-tól eltérő egyedi azonosítókat. (Én személy szerint
    amúgy is mindenkinek javaslom, hogy minden üzleti objektumnak legyen
    egy Long egyedi azonosítója, és kerüljük pl. szöveget, dátumot
    tartalmazó, valamint az összetett elsődleges kulcsokat.
-   Az Acl ACE elemeket tartalmaz, melyeket az AccessControlEntry
    interfész reprezentálja. Ez tartalmaz egy referenciát egy műveletre
    (Permission), valamint egy Sid-re, van egy egyedi azonosítója,
    valamint egy granting attribútuma, ami azt mondja meg, hogy az adott
    jogosultság aktív-e, vagy visszavonásra került.
-   Lehet saját Permisson megvalósítást is alkalmazni, de a Spring
    Security alapértelmezetten tartalmazza a BasePermission osztályt,
    mely a következő műveleteket definiálja: CREATE, READ, WRITE,
    DELETE, ADMINISTRATION, a legtöbb esetben ez is elég lehet.

A Spring Security ezen interfészek példányaihoz, illetve a példányok
által ábrázolt információkhoz a AclService interfészen keresztül enged
hozzáférést, ez egy normál service osztály, melyet a szokásos módon
deklarálhatunk az applicationContext.xml-ben, és kérhetünk rá
referenciát dependency injection-nel. Ennek a readAclById és
readAclsById metódusaivel férhetünk hozzá az Acl-ekhez. Nem mindig
használjuk ezt direktben, később látni fogjuk, hogy lehet deklaratív
módon használni.

Az AclService leszármazottja a MutableAclService, mely már módosítási
műveleteket is megenged az Acl-eken. Ugyanis ezen alkalmazásokban már
nem lehet deklaratív módon felvenni az Acl-eket, hiszen maguk az üzleti
objektumok is folyamatosan változnak, jönnek létre és szűnnek meg, ezért
az üzleti logikának kell arról is gondoskodnia, hogy az Acl-eket is az
üzleti objektumokkal együtt módosítsa. Az AclService egyik
implementációja a JdbcAclService, a MutableAclService implementációja a
JdbcMutableAclService, mely ANSI SQL műveletekkel kezeli az Acl-ek
perzisztenciáját relációs adatbázisokban. A JdbcMutableAclService a
lekérdezéseket egy LookupStrategy implementációnak delegálja, mely az
adatbázisra optimalizált lekérdezést tartalmazhatja. Ennek egy
implementációja megtalálható a Spring Security-ban is
BasicLookupStrategy néven. Ha az adott adatbázis speciális lehetőségeit
(pl. hierarchikus lekérdezések, materializált nézet, reduce
normalization) ki akarjuk használni, saját osztályt kell írni, mely
implementálja a LookupStrategy interfészt. A BasicLookupStrategy nem
támogatja a leszármaztatást. Mind a JdbcMutableAclService-nek, mind a
BasicLookupStrategy-nek szüksége van egy DataSource-ra.

Ahogy említettem a jogosultság ellenőrzéséhez használhatnánk az
AclService megfelelő metódusait, de van egy egyszerűbb deklaratív
módszer is, mely a Spring Security 3-asban jelent meg, és erősen
támaszkodik a Spring 3 Spring Expression Language-ére. Ezt
Expression-Based Access Control-nak nevezi, és akár XML leíróban
(security namespace), akár annotációban (@Pre és @Post) is
alkalmazhatjuk. Ebből az ACL is elérhető, és pl. deklarálni lehet, hogy
az adott metódus hívása előtt vagy után milyen üzleti objektumon
(metódus paraméter vagy visszatérési érték), milyen műveletre való
jogosultságot kell ellenőrizni. Valamint lehetőség van filterezésre is,
ami pl. egy metódus visszatérési értékeként szereplő listából
eltávolítja azon üzleti objektumokat, melyekre a bejelentkezett
felhasználónak nincs meg a megfelelő műveletre a megfelelő jogosultsága.
Persze a háttérben ebből ugyanúgy egy Acl lekérdezés, majd metódushívás
lesz.

A Domain Object Security ezeken felül a következőket biztosítja:

-   Caching: Ehcache backend-del
-   Transzparens adatbázis műveletek
-   Perzisztencia úgy megvalósítva, hogy minimális legyen a deadlock
    valószínűsége
-   ORM-től való függetlenség, hiszen plain JDBC van a háttérben
-   Egységbezárás

Most, hogy ismerjük a Java interfészeket, nézzük, hogy történik a
kapcsolódó objektumok perzisztenciája.

<a href="/artifacts/posts/2010-07-11-spring-security-3-acl/springsecurityacl_b.png" data-lightbox="post-images">![Adatbázis](/artifacts/posts/2010-07-11-spring-security-3-acl/springsecurityacl.png)</a>

Egy ACL\_OBJECT\_IDENTITY sor tartozik minden egyes üzleti objektumhoz.
Ez tartalmaz egy külső kulcsot az ACL\_CLASS táblára, mely tartalmazza
az üzelti objektum osztályának teljes nevét (fully qualified name -
csomaggal együtt). Egy ACL\_OBJECT\_IDENTITY sorhoz több ACL\_ENTRY sor
tartozhat, mely összeköti az üzleti objektumot, a Sid-et, valamint a
MASK mezőben (32 biten) tárolja, hogy mely műveletek megengedettek.
Ebből pl. a BasePermission csak 5 bitet használ fel, hiszen 5 műveletet
definiál (read - bit 0, write - bit 1, create - bit 2, delete - bit 3 és
administer - bit 4). Az ACL\_SID tábla tartalmazza a Sid-eket, vagyis a
felhasználók vagy szerepkörök neveit.

Bár a disztribúció tartalmaz egy [példa
alkalmazást](https://github.com/spring-projects/spring-security/tree/master/samples/contacts-xml/),
készítettem én is egyet, mely talán egy kicsit egyszerűbb, és
[megtalálható a
GitHub-on](https://github.com/vicziani/jtechlog-spring-security-acl).

Az alkalmazás Maven-nel build-elhető. A különböző funkciókat JUnit teszt
esetek tesztelik, szóval a mvn test parancs kiadásával fordítható és
tesztelhető a projekt.

Az példa egy egyszerű szerkesztőségi rendszer service rétege, melyben
cikkeket lehet felvenni, és be lehet állítani, hogy melyik cikken melyik
felhasználó milyen műveletet végezhet. Az entitás az Article osztály, a
service interfész a ArticleService, melynek egy megvalósítása a
ArticleServiceImpl. Az egyszerűség kedvéért egy Map-ben tárolja el a
cikkeket. Az alkalmazás felépítése az UML diagram alapján egyértelmű.

<a href="/artifacts/posts/2010-07-11-spring-security-3-acl/springsecurityacl_pelda_b.png" data-lightbox="post-images">![Példa alkalmazás UML osztálydiagram](/artifacts/posts/2010-07-11-spring-security-3-acl/springsecurityacl_pelda.png)</a>

Az alkalmazás egy applicationContext.xml-lel rendelkezik, de
bonyolultabb alkalmazás esetén javasolt a biztonsággal kapcsolatos
konfigurációt egy másik (applicationContext-security.xml) állományba
kiszervezni. Az adatforrás (DataSource) és a tranzakciókezelő
beállításait külön XML-be szerveztem (applicationContext-test.xml),
hiszen feltehetőleg egy éles alkalmazás komolyabb adatbáziskezelővel
futna, csak a teszt esetek futnak HSQLDB-vel.

Az ACL használatához először létre kell hozni a fentebb bemutatott
táblákat. A létrehozó script megtalálható a
[dokumentációban](http://docs.spring.io/spring-security/site/docs/3.2.0.RELEASE/reference/htmlsingle/#dbschema-acl)
HyperSQL-re és PostgreSQL-re, de megtalálhatóak a
spring-security-acl-3.2.0.RELEASE.jar-ban is createAclSchema.sql néven.

A következő lépésként hozzuk létre az applicationContext.xml állományt.

{% highlight xml %}
<?xml version="1.0" encoding="UTF-8"?>

<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:security="http://www.springframework.org/schema/security"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-3.2.xsd
       http://www.springframework.org/schema/security http://www.springframework.org/schema/security/spring-security-3.2.xsd">

    <bean id="articleService" class="jtechlog.acltutorial.ArticleServiceImpl" />

    <security:global-method-security pre-post-annotations="enabled">
        <security:expression-handler ref="expressionHandler"/>
    </security:global-method-security>

    <bean id="expressionHandler"
          class="org.springframework.security.access.expression.method.DefaultMethodSecurityExpressionHandler">
        <property name="permissionEvaluator" ref="aclPermissionEvaluator"/>
    </bean>

    <bean id="aclPermissionEvaluator" class="org.springframework.security.acls.AclPermissionEvaluator">
        <constructor-arg ref="aclService" />
    </bean>

    <bean id="aclCache"
          class="org.springframework.security.acls.domain.EhCacheBasedAclCache">
        <constructor-arg>
            <bean class="org.springframework.cache.ehcache.EhCacheFactoryBean">
                <property name="cacheManager">
                    <bean class="org.springframework.cache.ehcache.EhCacheManagerFactoryBean" />
                </property>
                <property name="cacheName" value="aclCache" />
            </bean>
        </constructor-arg>
    </bean>

    <bean id="lookupStrategy"
          class="org.springframework.security.acls.jdbc.BasicLookupStrategy">
        <constructor-arg ref="dataSource" />
        <constructor-arg ref="aclCache" />
        <constructor-arg>
            <bean
                    class="org.springframework.security.acls.domain.AclAuthorizationStrategyImpl">
                <constructor-arg>
                    <list>
                        <!-- authority for taking ownership -->
                        <bean class="org.springframework.security.core.authority.SimpleGrantedAuthority">
                            <constructor-arg value="ROLE_ADMIN" />
                        </bean>
                        <!-- authority to modify auditing -->
                        <bean class="org.springframework.security.core.authority.SimpleGrantedAuthority">
                            <constructor-arg value="ROLE_ADMIN" />
                        </bean>
                        <!-- authority to make general changes -->
                        <bean class="org.springframework.security.core.authority.SimpleGrantedAuthority">
                            <constructor-arg value="ROLE_ADMIN" />
                        </bean>
                    </list>
                </constructor-arg>
            </bean>
        </constructor-arg>
        <constructor-arg>
            <bean class="org.springframework.security.acls.domain.ConsoleAuditLogger" />
        </constructor-arg>
    </bean>

    <bean id="aclService"
          class="org.springframework.security.acls.jdbc.JdbcMutableAclService">
        <constructor-arg ref="dataSource" />
        <constructor-arg ref="lookupStrategy" />
        <constructor-arg ref="aclCache" />
    </bean>

</beans>
{% endhighlight %}

Az articleService a saját service osztályunk. A következő
global-method-security tag pre-post-annotations attribútuma mondja meg,
hogy annotációkban adjuk meg a biztonsági beállításokat. Amennyiben nem
használunk ACL-t, ennyi elegendő is, de esetünkben meg kell adni azt is,
hogy Expression-Based Access Control-t használunk, és használni akarjuk
majd a hasPermission függvényt, mellyel az ACL alapján lehet majd
jogosultságot ellenőrizni. Erre kell a expressionHandler és a
aclPermissionEvaluator is. Az utóbbi dolga a expression system és a
Spring Security's ACL system közötti híd megépítése. A aclCache bean
állítja be, hogy az ACL az Ehcache-t használja cache-eléshez. Majd
megadjuk az ACL-ek lekérdezéséhez szükséges lookupStrategy bean-t
(használja a cache-t és a DataSource-ot is). Valamint konstruktorának
első paramétere egy AclAuthorizationStrategyImpl, mely azt adja meg,
hogy milyen jogosultságok szükségesek ahhoz, hogy módosítani lehessen az
ACL tulajdonosát, módosítani az audit naplózás beállíásokat, valamint
módosítani egyéb ACL és ACE beállításokat. A második paramétere egy
AuditLogger, melynek egyetlen beépített implementációja a
ConsoleAuditLogger. Az utolsó bean a aclService, melyet az
alkalmazásunkból is használni fogunk.

A applicationContext-test.xml állományban állítjuk be az adatforrást
(beépített adatbáziskezelőt futtat, és végrehajtja a sémát létrehozó
szkriptet), a tranzakciókezelőt, valamint azt, hogy a tranzakció
konfigurációja annotációkban történjen.

{% highlight java %}
<?xml version="1.0" encoding="UTF-8"?>

<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:tx="http://www.springframework.org/schema/tx"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:jdbc="http://www.springframework.org/schema/jdbc"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-3.2.xsd
       http://www.springframework.org/schema/tx http://www.springframework.org/schema/tx/spring-tx-3.2.xsd
       http://www.springframework.org/schema/jdbc http://www.springframework.org/schema/jdbc/spring-jdbc-3.2.xsd">

    <tx:annotation-driven />

    <jdbc:embedded-database id="dataSource" >
        <jdbc:script location="classpath*:/createAclSchema.sql" />
    </jdbc:embedded-database>


    <bean id="transactionManager"
          class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
        <property name="dataSource" ref="dataSource" />
    </bean>

</beans>
{% endhighlight %}

Elengedhetetlen az ACL használatához a tranzakciós környezet, hiszen az
ACL-ek adatbázisba kerülnek mentésre (JdbcTemplate-tel).

Nézzük először, hogy hogyan történik az üzleti objektumhoz ACL
rendelése, ehhez nézzük meg a grantPermission metódus implementációját.

{% highlight java %}
@Override
@Transactional
public void grantPermission(String principal, Article article, Permission[] permissions) {
 LOGGER.info("Grant {} permission to principal {} on article {}", permissions, principal, article);
 ObjectIdentity oi = new ObjectIdentityImpl(Article.class, article.getId());
 Sid sid = new PrincipalSid(principal);

 MutableAcl acl;
 try {
  acl = (MutableAcl) aclService.readAclById(oi);
 } catch (NotFoundException nfe) {
  acl = aclService.createAcl(oi);
 }

 for (Permission permission : permissions) {
  switch (permission) {
   case READ:
    acl.insertAce(acl.getEntries().size(), BasePermission.READ, sid, true);
    break;
   case WRITE:
    acl.insertAce(acl.getEntries().size(), BasePermission.WRITE, sid, true);
    break;
  }
 }
 aclService.updateAcl(acl);
}
{% endhighlight %}

Először példányosítunk az üzleti objektum alapján egy ObjectIdentityImpl
példányt. Majd lekérdezzük, ha nincs, létrehozunk hozzá egy Acl-t. Majd
az Acl-be felveszünk egy Ace-t, sorrendben a végére, mely tartalmaz egy
referenciát a BasePermission.READ műveletre, valamint a paraméterként
átadott felhasználóra. Azaz a ArticleServiceTest teszt osztályban a
következő sor (@Before annotációval ellátott init() metódusban
található) a user1 felhasználónak megadja a jogosultságot, hogy az 1-es
azonosítójú cikket szerkeszteni és módosítani tudja.

{% highlight java %}
articleService.grantPermission("user1", article1, new
    ArticleService.Permission[]{ArticleService.Permission.READ, ArticleService.Permission.WRITE});
{% endhighlight %}

A következő lépésben meg kell valósítani a jogosultságkezelést. Ez
történhet kódból is, javasolt AOP-vel, pl. metódushívás előtt
AccessDecisionVoter használata, metódushívás után
AfterInvocationProvider használata. Ezekben az aclService használatával
le kell kérni az üzleti objektumhoz tartozó Acl-t, majd annek kell
meghívni a isGranted metódusát. De vannak erre az ACL-ben megfelelő
osztályok is, mint az AclEntryVoter, AclEntryAfterInvocationProvider
vagy a AclEntryAfterInvocationCollectionFilteringProvider. De sokkal
egyszerűbb a Expression-Based Access Control használata, amit
használhatunk XML konfigurációban is a security:intercept-url access
paraméterének, vagy a protect-pointcut expression paraméterének, vagy a
@PreAuthorize, @PostAuthorize, @PreFilter, @PostFilter annotációk
paraméterének. Én az utóbbit, az annotációk használatát javasoltam,
ezért kellett a global-method-security pre-post-annotations attribútuma
az applicationContext.xml-ben.

Nézzük is a findArticleById és updateArticle metódusok implementációját.

{% highlight java %}
@Override
@PreAuthorize("hasPermission(#id, 'jtechlog.acltutorial.Article', 'read') or hasRole('ADMIN')")
public Article findArticleById(long id) {
 return articles.get(id);
}

@Override
@PreAuthorize("hasPermission(#article, 'write') or hasRole('ADMIN')")
public void updateArticle(Article article) {
 articles.put(article.getId(), article);
}
{% endhighlight %}

Az első PreAuthorize annotációban lévő kifejezés azt jelenti, hogy a
metódust csak az futtathatja, akinek az id paraméterben átadott id-jú
Article típusú üzleti objektum-hoz van read jogosultsága (azaz az 1-es
Article ACL-jének ACE-i között szerepel), vagy ADMIN szerepkörű. A
második PreAuthorize annotációban szereplő kifejezés azt jelenti, hogy
csak az hívhatja meg a metódust, akinek a paraméterként átadott Article
üzleti objektra van write jogosultsága vagy ADMIN szerepkörű. Tehát
látható, hogy feltételt lehet megadni üzleti objektum azonosítójára és
magára az objektumra is. Az ehhez tartozó teszt eset pl. a
testUserWithRead, akinek van olvasási de nincs írási jogosultsága az
1-es Article üzleti objektumhoz. A \#-os megadási módhoz szükséges a
debug információkat is a kódba fordítani.

{% highlight java %}
@Test
public void testUserWithReadAndWrite() {
 SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken("user1", "pass1", Collections.
   singletonList(new SimpleGrantedAuthority("USER"))));
 articleService.findArticleById(1);
 articleService.updateArticle(new Article(1, "test"));
}
{% endhighlight %}

Az első sorban beállítjuk a bejelentkezett felhasználót, majd meghívjuk
a két üzleti metódust, amiből az elsőhöz lesz, a másodikhoz nem lesz
jogosultsága. És ne feledjük, az üzleti objektum alapján!

Még egy érdekes funkció, hogy az ACL képes filter-elni, szűrni az üzleti
objektumokat egy kollekcióból a jogosultság alapján.

{% highlight java %}
@Override
@PostFilter("hasPermission(filterObject, 'read') or hasRole('ADMIN')")
public List<Article> findAllArticles() {
 return new ArrayList<>(articles.values());
}
{% endhighlight %}

A PostFilter annotáció hatására a visszaadott listából kiveszi az ACL
azon üzleti objektumokat, melyekre nincs olvasási jogosultsága a
bejelentkezett felhasználónak. Vigyázzunk, hogy nagy listák esetén ne
így használjuk, mert az adatbázisból lekérdezésre kerül, majd onnan
lesznek kiszórva. Hatékonyabb megoldás, ha már eleve csak a megfelelő
üzleti objektumokat kérdezzük le. A hozzá tartozó teszt eset a
testFilterUser2, ugyanis a user2-nek a három cikk közül csak kettőre van
jogosultsága.

{% highlight java %}
@Test
public void testFilterUser2() {
 SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken("user2", "pass2", Collections.
   singletonList(new SimpleGrantedAuthority("USER"))));
 List<Article> articles = articleService.findAllArticles();
 assertEquals(1, articles.size());
}
{% endhighlight %}

Az ACL funkcióit JSP-ből is kihasználhatjuk a security:accesscontrollist
tag segítségével.

Tesztelés közben tudatosult bennem, hogy ne módosítgassuk a táblákat az
ACL alatt, hiszen a cache miatt az adatbázis módosítás nem fog látszani.

További olvasnivalók:

[Heraclitus on software blog: Simple web application with Spring
Security](http://heraclitusonsoftware.wordpress.com/software-development/spring/simple-web-application-with-spring-security-specification/)\
[Denksoft Blog: ACL Spring Security
tutorial](http://www.denksoft.com/wordpress/?page_id=20)
