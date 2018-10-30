---
layout: post
title: Spring tranzakciókezelés
date: '2018-10-29T23:10:00.007+02:00'
author: István Viczián
tags:
- Spring
description: A Spring tranzakciókezelésének részletes bemutatása.
---

Technológiák: Spring Framework, Spring Boot 2.0.5

Ezen poszt bemutatja a Spring tranzakciókezelés mélységeit,
a propagációs tulajdonságokkal, valamint kivételkezeléssel.

Előtte érdemes elolvasni a [Tranzakciókezelés EJB 3 és Spring környezetben](/2010/05/31/tranzakciokezeles.html)
című régebbi posztomat, mely az alapfogalmakat mutatja be.

A példában egy DAO/repository osztály egyik metódusa meghív egy másik osztály egy metódusát. Először nézzük meg, hogy mi történik alapértelmezett
esetben, mikor az első osztály metódusa van ellátva `@Transactional` annotációval, és kivétel történik, akár az első,
akár a második metódusban. Majd nézzük meg, hogy lehet megvalósítani, hogy a két metódus külön tranzakcióban fusson, azaz
az egyikben keletkezett kivételnek ne legyen kihatása a másik metódus tranzakciójára.

A másik érdekesség az szokott lenni, hogy ugyan lekezeljük a kivételt, mégis rollback történik. Nézzük meg, hogy lehet ezt megakadályozni.

A kivetelkezeléssel kapcsolatba belefutottam a Spring Boot egy érdekes tulajdonságába is, ami a repository rétegben keletkező kivételeket
átfordítja.

<!-- more -->

A poszthoz létezik példaprogram a GitHubon, [vicziani/spring-transaction](https://github.com/vicziani/spring-transaction) néven. Ebben szereplő hívásokat mutatja az alábbi UML szekvenciadiagram.

![szekvenciadiagram](/artifacts/posts/2018-10-29-Spring-tranzakciokezeles/seq-diagram.png)

A példaprogramban létezik egy `EmployeeDao` osztály, annak egy `saveEmployee(String name)` metódusa,
mely hívja a `LoggerDao` osztály `saveLog(String message)` metódusát.

Az `EmployeeDao` egy `Employee` entitást ment el, melynek egy automatikusan generált `id` és egy `name` attribútuma van. A `LoggerDao`
egy `LogEntry` entitást ment el, melynek egy automatikusan generált `id` és egy `message` attribútuma van.

{% highlight java %}
@Repository
public class EmployeeDao {

  // ...

  public void saveEmployee(String name) {
      entityManager.persist(new Employee(name));
      loggerDao.saveLog(name);
  }

}
{% endhighlight %}

{% highlight java %}
@Repository
public class LoggerDao {

  // ...

  public void saveLog(String message) {
      entityManager.persist(new LogEntry(message));
  }

}
{% endhighlight %}

Látható, hogy a kódban még nem helyeztünk el a tranzakciókra vonatkozó utasításokat, így a következő kivételt kapjuk:

```
Caused by: javax.persistence.TransactionRequiredException: No EntityManager with actual transaction available for current thread - cannot reliably process 'persist' call
```

Ezért a `saveEmployee()` metódust ellátjuk a `@Transactional` annotációval. Ekkor az `Employee` és `LogEntry` entitás is lementésre kerül.
A `org.springframework.transaction` csomag és az `org.springframework.orm.jpa.JpaTransactionManager` osztály naplózását `TRACE` szintre állítottam, hogy nyomon tudjuk követni, hogy mi történt. Ha megnézzük a naplót, akkor ilyen üzeneteket láthatunk:

```
2018-10-29 20:05:24.335 DEBUG 4636 --- [           main] o.s.orm.jpa.JpaTransactionManager        : Creating new transaction with name [jtechlog.springtransaction.EmployeeDao.saveEmployee]: PROPAGATION_REQUIRED,ISOLATION_DEFAULT
2018-10-29 20:05:24.337 TRACE 4636 --- [           main] o.s.t.i.TransactionInterceptor           : Getting transaction for [jtechlog.springtransaction.EmployeeDao.saveEmployee]

2018-10-29 20:05:24.406 TRACE 4636 --- [           main] o.s.t.i.TransactionInterceptor           : Completing transaction for [jtechlog.springtransaction.EmployeeDao.saveEmployee]
2018-10-29 20:05:24.406 DEBUG 4636 --- [           main] o.s.orm.jpa.JpaTransactionManager        : Initiating transaction commit
```

Ebből látható, hogy egy tranzakció került elindításra, és a végén commit történt.  Ahogy már az említett posztban már kifejtésre került, a tranzakciókezelést a proxy objektum végzi.

Most nézzük meg, hogy mi történik, ha egy `IllegalArgumentException` kivételt dobunk az `EmployeeDao.saveEmployee()` metódus végén.

Az első furcsaság, ami azonnal kiderül a stacktrace-ből:

```
org.springframework.dao.InvalidDataAccessApiUsageException: Cannot create employee with name starting with lowercase character; nested exception is java.lang.IllegalArgumentException: Cannot create employee with name starting with lowercase character
```

Itt valójában annyi történik, hogy a Spring Boot a `@Repository` osztályok metódusának hívásakor használ egy exception translatort,
mely átfordítja a kivételt, ha az nincs a metódus fejében deklarálva (unchecked kivételt!). Ha a metódusunk fejét kiegészítjük
a `throws IllegalArgumentException` résszel, máris az `IllegalArgumentException` kivételt kapjuk, ami nincs becsomagolva a
`InvalidDataAccessApiUsageException` kivételbe.

A logból a következő olvasható ki:

```
2018-10-29 21:36:45.483 DEBUG 5746 --- [           main] o.s.orm.jpa.JpaTransactionManager        : Creating new transaction with name [jtechlog.springtransaction.EmployeeDao.saveEmployee]: PROPAGATION_REQUIRED,ISOLATION_DEFAULT

2018-10-29 21:36:45.553 TRACE 5746 --- [           main] o.s.t.i.RuleBasedTransactionAttribute    : Applying rules to determine whether transaction should rollback on java.lang.IllegalArgumentException: Cannot create employee with name starting with lowercase character

2018-10-29 21:36:45.554 TRACE 5746 --- [           main] o.s.t.i.RuleBasedTransactionAttribute    : No relevant rollback rule found: applying default rules

2018-10-29 21:36:45.554 DEBUG 5746 --- [           main] o.s.orm.jpa.JpaTransactionManager        : Initiating transaction rollback
```

Azaz mivel kivétel keletkezett, méghozzá egy unchecked kivétel, rollback történt. Mivel az `Employee` és a `LogEntry` mentése egy tranzakcióban volt, egyik sem került elmentésre.

Nézzük, hogy lehet megoldani, hogy a hívott metódus új tranzakcióban legyen, azaz ne kerüljön visszagörgetésre.

Tegyük a `LoggerDao` osztály `saveLog()` metódusára a `@Transactional(Transactional.TxType.REQUIRES_NEW)` annotációt, beállítva a propagációs szintet `REQUIRES_NEW` értékre. Ennek hatására új tranzakció indul. Az `employees` tábla üres marad, azonban a `log_entries` táblában megjelenik az adott rekord.

Ide vonatkozó naplóbejegyzések:

```
2018-10-29 21:56:49.584 DEBUG 5992 --- [           main] o.s.orm.jpa.JpaTransactionManager        : Creating new transaction with name [jtechlog.springtransaction.EmployeeDao.saveEmployee]: PROPAGATION_REQUIRED,ISOLATION_DEFAULT

2018-10-29 21:56:49.643 DEBUG 5992 --- [           main] o.s.orm.jpa.JpaTransactionManager        : Suspending current transaction, creating new transaction with name [jtechlog.springtransaction.LoggerDao.saveLog]

2018-10-29 21:56:49.693 TRACE 5992 --- [           main] o.s.t.i.TransactionInterceptor           : Completing transaction for [jtechlog.springtransaction.LoggerDao.saveLog]
2018-10-29 21:56:49.697 DEBUG 5992 --- [           main] o.s.orm.jpa.JpaTransactionManager        : Initiating transaction commit

2018-10-29 21:56:49.712 DEBUG 5992 --- [           main] o.s.orm.jpa.JpaTransactionManager        : Resuming suspended transaction after completion of inner transaction
2018-10-29 21:56:49.713 TRACE 5992 --- [           main] o.s.t.i.TransactionInterceptor           : Completing transaction for [jtechlog.springtransaction.EmployeeDao.saveEmployee] after exception: java.lang.IllegalArgumentException: Cannot create employee with name starting with lowercase character
2018-10-29 21:56:49.713 DEBUG 5992 --- [           main] o.s.orm.jpa.JpaTransactionManager        : Initiating transaction rollback
```

Látható, hogy a `saveEmployee` metódus hívásakor elindult egy tranzakció, mely a `saveLog()` metódus hívásakor felfüggesztésre került, és indult egy új tranzakció.

Vigyázzunk, ez csak akkor működik, ha a metódus egy másik bean publikus metódusa, hiszen csak ekkor megy át a hívás a proxy-n, ami a tranzakciókezelést végzi.

Ami még egy érdekes jelenség, hogy mi történik akkor, ha kivétel van a hívott metódusban, de a hívó metódusban elkapjuk és lekezeljük azt. Módosítsuk úgy a `saveEmployee()` metódust, hogy try-catch-ben legyen a `loggerDao.saveLog(name)` hívás. A `LoggerDao` `saveLog()`
metódusáról távolítsuk el az annotációt, ne felejtsük el a fejlécben deklarálni, hogy `IllegalArgumentException` kivételt dob, és
dobjunk is egyet.

{% highlight java %}
@Transactional
public void saveEmployee(String name) throws IllegalArgumentException {
    entityManager.persist(new Employee(name));

    try {
        loggerDao.saveLog(name);
    } catch (IllegalArgumentException iae) {
        LOGGER.error("Error by logging", iae);
    }
}
{% endhighlight %}

{% highlight java %}
public void saveLog(String message) throws IllegalArgumentException {
    entityManager.persist(new LogEntry(message));

    throw new IllegalArgumentException("Message is too short");    
}
{% endhighlight %}

Ebben az esetben sikeresen lefut a teszteset, és mindkét táblába bekerül az adott rekord.

Azonban most tegyünk a `saveLog()` metódusra egy `@Transactional` annotációt. Elvileg ugyanannak kéne történnie, hiszen a `@Transactional` annotáció alapértéke a `REQUIRED` propagációs szint. Azonban a `saveEmployee()` metódus hívásakor a következő kivételt kapjuk:

```
org.springframework.orm.jpa.JpaSystemException: Transaction was marked for rollback only; cannot commit; nested exception is org.hibernate.TransactionException: Transaction was marked for rollback only; cannot commit
```

Azaz nem tud commit műveletet elvégezni. Nézzük a naplóbejegyzéseket:

```
2018-10-29 22:10:07.819 DEBUG 6916 --- [           main] o.s.orm.jpa.JpaTransactionManager        : Creating new transaction with name [jtechlog.springtransaction.EmployeeDao.saveEmployee]: PROPAGATION_REQUIRED,ISOLATION_DEFAULT

2018-10-29 22:10:07.913 TRACE 6916 --- [           main] o.s.t.i.RuleBasedTransactionAttribute    : No relevant rollback rule found: applying default rules
2018-10-29 22:10:07.913 DEBUG 6916 --- [           main] o.s.orm.jpa.JpaTransactionManager        : Participating transaction failed - marking existing transaction as rollback-only
2018-10-29 22:10:07.930 DEBUG 6916 --- [           main] o.s.orm.jpa.JpaTransactionManager        : Initiating transaction rollback after commit exception
```

Mi történhetett itt? Mivel a `saveLog()` metódusra most került a `@Transactional` annotáció, a Spring most hozott létre egy tranzakcionális proxy-t. Viszont ilyenkor figyeli, hogy ezen a proxy-n megy-e át exception. És mivel a metódus hívása közben `IllegalArgumentException`
kivétel keletkezett, a tranzakciót rollback-only-ra állította. (Függetlenül attól, hogy a hívó oldalon a kivételt lekezeltük.)
És mivel erre állította, a tranzakció végén rollbacket hív.

Ha a kivételt nem kezeljük le, hanem egyszerűen továbbengedjük, akkor is rollback van, és akkor hívó oldalon nem a `JpaSystemException` keletkezik.

Amennyiben azt akarjuk, hogy a kivétel ugyan keletkezzen, de hatására ne legyen rollback, a `saveLog()` metóduson alkalmazzuk a következő paraméterezett annotációt: `@Transactional(dontRollbackOn = IllegalArgumentException.class)`. Ennek hatására nem lesz rollback.
