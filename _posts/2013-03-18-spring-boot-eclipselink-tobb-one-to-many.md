---
layout: post
title: JPA több one-to-many kapcsolat Spring Boot és a EclipseLink esetén
date: '2013-03-18'
author: István Viczián
tags:
- Spring
- Adatkezelés
last_modified_at: '2026-06-13'
description: Egy olyan entitás lekérdezése, melynek több one-to-many kapcsolata van Spring Boot alkalmazáson belül Eclipselinkkel.
---

Felhasznált technológiák: Spring Boot 4, Spring Data JPA, EclipseLink 5

Már írtam egy [posztot](/2013/03/17/jpa-tobb-one-to-many-kapcsolat.html), hogy
mi van akkor, ha egy entitásnak több one-to-many kapcsolata van.

A Spring Boot alapesetben a Hibernate JPA providert használja.
Azonban be lehet állítani az EclipseLinket is. Nézzük meg, ez hogy viselkedik.

{% include github-callout.html url="https://github.com/vicziani/jtechlog-jpa-descartes" %}

Ehhez először a `pom.xml`-ben kell a Hibernate-et exlude-olni,
és az EclipseLinket felvenni.

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-data-jpa</artifactId>
  <exclusions>
    <exclusion>
      <groupId>org.hibernate.orm</groupId>
      <artifactId>hibernate-core</artifactId>
    </exclusion>
  </exclusions>
</dependency>

<dependency>
  <groupId>org.eclipse.persistence</groupId>
  <artifactId>org.eclipse.persistence.jpa</artifactId>
  <version>5.0.0</version>
</dependency>
```

Valamint kell egy configuration osztály is.

```java
@Configuration
public class EclipseLinkJpaConfiguration extends JpaBaseConfiguration {

    public EclipseLinkJpaConfiguration(DataSource dataSource, JpaProperties properties, ObjectProvider<JtaTransactionManager> jtaTransactionManager) {
        super(dataSource, properties, jtaTransactionManager);
    }

    @Override
    protected AbstractJpaVendorAdapter createJpaVendorAdapter() {
        return new EclipseLinkJpaVendorAdapter();
    }

    @Override
    protected Map<String, Object> getVendorProperties(DataSource dataSource) {
        return Map.of(
                "eclipselink.logging.level.sql", org.eclipse.persistence.logging.SessionLog.FINE_LABEL
        );
    }
}
```

Azt nem sikerült megoldanom, hogy az EclipseLink sémagenerálása előbb fusson le,
mint az adatbeszúrás. Ezért létrehoztam egy `schema.sql` állományt, mely 
létrehozza a táblákat.

Ezután a teszteset sikeresen lefut, ami azt jelenti, hogy az Eclipselink is
újrahasznosítja a már persistence contextbe került objektumokat.

A kiadott SQL:

```sql
SELECT DISTINCT ... FROM {oj EMPLOYEE t1 LEFT OUTER JOIN PHONE t0 ON (t0.EMPLOYEE_ID = t1.ID)} WHERE (t1.ID = ?)
SELECT ... FROM ADDRESS WHERE (EMPLOYEE_ID = ?)
```

Érdemes összehasonlítani a Hibernate által kiadott SQL-ekkel:

```sql
select distinct ... from employee e1_0 left join phone p1_0 on e1_0.id=p1_0.employee_id where e1_0.id=?
select distinct ... from employee e1_0 left join address a1_0 on e1_0.id=a1_0.employee_id where e1_0.id=?
```

Látható, hogy a második lekérdezés esetén az EclipseLink már csak az `ADDRESS` táblát kérdezte le,
addig a Hibernate ugyanúgy join-olt az `employee` táblával.