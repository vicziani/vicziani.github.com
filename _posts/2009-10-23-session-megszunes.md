---
layout: post
title: Session megszűnés
date: '2009-10-23T05:10:00.000-07:00'
author: István Viczián
tags:
- java
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Amennyiben olyan architektúránk van, hogy elöl van egy web szerver, pl.
Apache http server, és mögötte az alkalmazás szervereink (esetleg web
konténer, pl. Tomcat), belefuthatunk olyan problémába, hogy két kérés
között eltűnik a session.

Ez akkor lehet, mikor a web szerver által kiszolgált cím context path-a,
és az alkalmazás szerver által kiszolgált context path eltér egymástól.
Ilyenkor érdemes megnézni a kérések fejlécét, mind a web szerver előtt,
mind mögött. Valami ilyesmit kell látni a header-ben:

    Set-Cookie: JSESSIONID=99E2B69BF4FF243F3463134D36703F81; Path=/context

Ekkor lehet, hogy a Path nem stimmel, ilyenkor rá lehet venni pl. az
Apache mod\_proxy-t, hogy ezeket egyeztesse. Ehhez érdemes a következő
direktívákat megnézni: ProxyPassReverseCookieDomain,
ProxyPassReverseCookiePath.

Tomcat esetén érdemes lehet még megnézni a emptySessionPath beállítást,
ekkor a Tomcat a Path-ban nem fogja elküldeni a context nevét.
