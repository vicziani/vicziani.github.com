---
layout: post
title: MySQL tippek
date: '2009-09-29T13:02:00.000-07:00'
author: István Viczián
tags:
- mysql
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Nyolc óra után automatikusan bontja a MySQL a kapcsolatot. [E
levél](http://mail-archives.apache.org/mod_mbox/db-ojb-user/200504.mbox/%3C42708881.6030202@apache.org%3E)
alapján Konfiguráljuk a connection pool-t úgy, hogy validálja a
kapcsolatot.

validationQuery=”SELECT 1” testOnBorrow=”true”

UTF-8 adatbázis készítés MySQL 5 alatt:\
\
CREATE DATABASE uksim CHARACTER SET utf8 COLLATE utf8\_general\_ci;

Felhasználónak jogosultság adása:\
\
GRANT ALL PRIVILEGES ON \*.\* TO ‘monty’@’localhost’ IDENTIFIED BY
‘some\_pass’ WITH GRANT OPTION;

FLUSH PRIVILEGES;

UTF-8 URL Tomcat server.xml-ben:

jdbc:mysql://localhost:3306/schema?autoReconnect=true&useUnicode=true&characterEncoding=UTF-8&characterSetResults=UTF-8
