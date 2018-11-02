---
layout: post
title: JBoss Application Server biztonságossá tétele
date: '2012-01-27T14:49:00.000-08:00'
author: István Viczián
tags:
- jboss
- java
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Technológiák: JBoss 5, 6

Egy alapértelmezett telepítés után a JBoss Application Server
(továbbiakban JBoss) főleg fejlesztésre való. Alapesetben csak
localhostról fogad kéréseket, tehát megfelelően biztonságos, de ahhoz,
hogy meg lehessen nyitni a nagyvilág elé, pár biztonsági beállítást el
kell végezni.

A JBoss-t általában egy web szerver, pl. egy Apache HTTP Server mögé
szokták helyezni, és a kettő között valamilyen modullal kell kapcsolatot
létesíteni. (Erről már korábban esett szó a [Tomcat
clusterezése](/2010/06/20/clusterezes-altalaban-es-tomcaten.html)
kapcsán, szóba jövő variációk a mod_jk, mod_proxy_http és
mod_proxy_ajp, melyből a mod_proxy_http bizonyult nyerőnek.
Amennyiben a JBoss web szerver mögött helyezkedik el, bizonyos
biztonsági beállításokat ott is el lehet végezni. Én most azt az esetet
tárgyalom, amikor a JBoss közvetlen elérhető.

A biztonsági kérdéseket az Open Web Application Security Project (OWASP)
szerint is osztályozni fogom. Az OWASP egy nonprofit szervezet, mely
célja az alkalmazások biztonságossá tétele. Ennek a szervezetnek bárki
tagja lehet, aki értéket tud hozzáadni. A [OWASP Testing
Project](https://www.owasp.org/index.php/Category:OWASP_Testing_Project)
keretein belül a készült egy OWASP Testing Guide v3 (még 2008-ban), mely
Creative Commons 2.5 License keretein belül elérhető, és célja egy olyan
tesztelési keretrendszer biztosítása, melynek használatával feltárhatók
a webes alkalmazások gyakori hibái. A dokumentum 11 kategóriában több
mint hatvan teszt esetet tartalmaz. Olyan kategóriák vannak, mint
információgyűjtés, autentikáció, session management, dos,
webszolgáltatások, AJAX, stb. Olyan teszt esetekre kell gondolni, mint
pl. lekérhető-e a web szerver típusa és pontos verziószáma, hozzá
lehet-e férni alapértelmezett jelszavakkal adminisztrációs felületekhez,
SQL injection, stb.

Az OWASP kiad egy [OWASP Top
10](https://www.owasp.org/index.php/Category:OWASP_Top_Ten_Project)
dokumentumot is, melyben az általa az adott évben leggyakrabban
előforduló biztonsági problémákat sorolja fel. 2010-ben az első három
biztonsági probléma az Injection, Cross-Site Scripting (XSS) és a Broken
Authentication and Session Management. Ezekről a 2011-es Magyarországi
Web Konferencián Karóczkai Krisztián tartott egy
[előadást](http://webkonf.org/2011/eloadasok.html#webalkalmazasok-biztonsaga),
egy Liferay portálon fejlesztett minta alkalmazáson prezentálva a
hibákat.

Én most nem a fejlesztési, hanem a JBoss adminisztrációs aspektusokra
szeretnék kitérni.

A OWASP-IG-004 teszt eset célja a web szerverről információkat gyűjteni.
Ez ezárt fontos egy támadó számára, hiszen ismertek a különböző web
szerverek bizonyos verzióinak hibái, amiket a pontos típus és verzió
ismeretében ki lehet használni. Egy JBoss-t indítva a http header-t
figyelve láthatjuk (pl. [Live HTTP
Headers](https://addons.mozilla.org/en-US/firefox/addon/live-http-headers/)
Firefox plugin használatával, vagy Linux-on a
`curl -I http://localhost:8080` parancs kiadásával), hogy a következő
információk jelennek meg:

    HTTP/1.1 200 OK
    Server: Apache-Coyote/1.1
    X-Powered-By: Servlet 2.5; JBoss-5.0/JBossWeb-2.1
    ...

A Server fejléc kikapcsolását a
`$JBOSS_HOME\server\[config]\deploy\jbossweb.sar\server.xml`
állományban kell megtenni, a Connector tag-nek kell adni egy server
tulajdonságot. Vigyázzunk, ez nem lehet üres String, hanem legalább egy
karakter hosszúnak lennie kell. Tehát használjuk pl. az alábbi
beállítást.

{% highlight xml %}
<Connector protocol="HTTP/1.1" port="8080" address="${jboss.bind.address}"
    connectionTimeout="20000" redirectPort="8443" server=" " />
{% endhighlight %}

Néhány cikk a neten azt írja, hogy itt kell használni a xpoweredBy
tulajdonságot is, de ez csak a JBoss-4.x alkalmazásszerverekre volt
megfelelő. Ehelyett a
\$JBOSS\_HOME\\server\\\[config\]\\deployers\\jbossweb.deployer\\web.xml
állományban kell a CommonHeadersFilter-ben a X-Powered-By paramétert
beállítani, lásd az alábbi példát.

{% highlight xml %}
<filter>
  <filter-name>CommonHeadersFilter</filter-name>
  <filter-class>org.jboss.web.tomcat.filters.ReplyHeaderFilter</filter-class>
  <init-param>
    <param-name>X-Powered-By</param-name>
    <param-value></param-value>
  </init-param>
</filter>
{% endhighlight %}

Az OWASP-IG-005 teszt eset az alkalmazás felderítését írja le. Ennek
során több minden kerül kivizsgálásra, ide tartoznak az admin felületek
is. A JBoss alapbeállítással tartalmaz egy indító felületet, melyen pár
link található. Innen érhető el az Administration Console
`/admin-console/` néven (alapértelmezett felhasználónév/jelszó az
`admin`/`admin`), a JMX Console `/jmx-console/` címen, és a JBoss Web Console
`/web-console/` címen. Az utóbbi kettő nem is kér autentikációt. A Tomcat
status az indító felület része.

Ezek mindegyike egy-egy webes alkalmazás, melyek a
`$JBOSS_HOME\server\[config]\deploy` könyvtárban telepítettek a
következő néven.

<table>
  <tr>
    <th>Felület</th>
 <th>URL</th>
 <th>Könyvtár</th>
  </tr>
  <tr>
     <td>Indító felület</td>
  <td>/</td>
  <td>ROOT.war</td>
  </tr>
  <tr>
     <td>Administration Console</td>
  <td>/admin-console/</td>
  <td>admin-console.war</td>
  </tr>
  <tr>
     <td>JMX Console</td>
  <td>/jmx-console/</td>
  <td>jmx-console.war</td>
  </tr>
  <tr>
     <td>JBoss Web Console</td>
  <td>/web-console/</td>
  <td>management</td>
  </tr>
</table>

A legbiztonságosabb, ha ezeket letöröljük.

Amennyiben mégis meg akarjuk tartani, figyelni kell arra, hogy ne
sértsük meg az előző (OWASP-IG-005) teszt esetet. Ugyanis ezek léte már
árulkodik az alkalmazásszerverről. Így célszerű ezen URL-eket tűzfal
szinten is levédeni.

Az Administration Console egy kicsit kilóg a többi közül, ugyanis annak
biztonságát a Seam Security része őrzi. Gyakorlatilag a jmx-console JAAS
konfiguráció névre hivatkozik. A JAAS-t a
`/server/[config]/conf/login-config.xml` állomány konfigurálja. Ebben
található a jmx-console néven egy `UsersRolesLoginModule` (un. security
domain), mely a felhasználókat a
`/server/[config]/conf/props/jmx-console-users.properties`, a hozzá
tartozó szerepköröket ugyanitt a `jmx-console-roles.properties` fájlban
tárolja. Alapértelmezetten itt az `admin` felhasználó szerepel, `admin`
jelszóval, és `JBossAdmin` szerepkörrel. Ennek a szerepkörnek a meglétét
ellenőrzi az alkalmazás.

A JMX Console és a Web Console a Servlet API által specifikált
deklaratív biztonságot használják, a `web.xml`-ben kell konfigurálni. A
konfigurációk megtalálhatók ezekben az állományokban
(`$JBOSS_HOME\server\[config]\deploy\jmx-console.war\WEB-INF\web.xml`,
`$JBOSS_HOME\server\[config]\deploy\management\console-mgr.sar\web-console.war\WEB-INF\web.xml`),
csak megjegyzésben.

{% highlight xml %}
<security-constraint>
 <web-resource-collection>
   <web-resource-name>HtmlAdaptor</web-resource-name>
   <description>An example security config that only allows users with the
  role JBossAdmin to access the HTML JMX console web application
   </description>
   <url-pattern>/*</url-pattern>
   <http-method>GET</http-method>
   <http-method>POST</http-method>
 </web-resource-collection>
 <auth-constraint>
   <role-name>JBossAdmin</role-name>
 </auth-constraint>
</security-constraint>
{% endhighlight %}

Ez a részlet definiálja, hogy mely erőforrásokhoz milyen szerepkör
szükséges, valamint az autentikáció formája Basic Authentication. Az
alkalmazásszerverfüggő, hogy honnan veszi a felhasználókat. A JBoss
esetén a `web.xml` mellett lévő `jboss-web.xml` írja le (JNDI névvel), hogy
milyen security domainben kell keresni a felhasználókat. Ez szintén
megjegyzésben van. Pl. JMX Console esetén a `jmx-console` security domain.

{% highlight xml %}
<security-domain>java:/jaas/jmx-console</security-domain>
{% endhighlight %}

Ez az előbb említett `login-config.xml` állományban van definiálva. A
JBoss Web Console esetén a `web-console` a security domain, amely a
`login-config.xml` állományban a `web-console-users.properties` és
`web-console-roles.properties` állományokra hivatkozik, melyek nem
léteznek. Átírhatjuk ezt is a `props/jmx-console-users.properties` és
`props/jmx-console-roles.properties` értékekre.

Tehát ezekben az állományokban ezen részek ne legyenek megjegyzésben, és
változtassuk meg a jelszót a
`$JBOSS_HOME\server\[config]\conf\props\jmx-console-users.properties`
állományban.

A OWASP-IG-006 teszt eset írja le a hibakódok elemzését. Itt tipikusan a
404 oldalakra kell gondolni, és ezek közül is azokra, amelyek az
alkalmazáson kívül esnek. (Hiszen az alkalmazáson belüli hibakezelést
végezze maga az alkalmazás.) Amennyiben a ROOT.war könyvtár szerepel a
deploy könyvtárban, a hibaoldalak információt szolgáltatnak ki az
alkalmazásszerver típusáról. Javasolt a ROOT.war könyvtár törlése, ekkor
válaszként egy üres oldal jön vissza nem található URL beírása esetén.
