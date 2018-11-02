---
layout: post
title: Munka egyszerre több projekten
date: '2009-08-28T00:29:00.005+02:00'
author: István Viczián
tags:
- IDE
- Tomcat
- NetBeans
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Többször adódhat, hogy a munkahelyen is egyidőben több projekten
dolgozunk, sőt esetleg otthon is saját hobbi projektet fejlesztünk,
ugyanazon a számítógépen, pl. notebook-on. Ennek megkönnyítésére a
NetBeans, és webes alkalmazások esetén a Tomcat is hatékony eszközöket
biztosít.

A NetBeans 6.0 Milestone 5-ben [jelent
meg](http://wiki.netbeans.org/NewAndNoteWorthyMilestone5) a Project
Group fogalma. Ezzel projekt csoportokat tudunk definiálni. A
File/Project Group menüpontban tudunk új projekt csoportot hozzáadni.
Egy projekt csoport tartalmazhat szabadon összeválogatott projekteket,
egy projektet, és a tőle függő összes projektet, valamint egy
könyvtárban lévő projekteket. A szabadon összeválogatott projektek
esetén létrehozáskor megadhatjuk, hogy üres projekt csoport jöjjön
létre, és ahhoz adjuk hozzá a projekteket, vagy a megnyitott projekteket
tegye bele alapértelmezetten a projekt csoportba. Megadhatjuk azt is,
hogy új projekt megnyitásakor vagy lezárásakor mentse-e a projekt
listát. Egy projekt és a tőle függő projektek esetén a projekt
könyvtárát kell megadni, míg egy könyvtárban lévő projekteket tartalmazó
projekt csoport esetén a könyvtárat kell megadni. Én általában a
szabadon összeválogatott projektet használom, mert így egy csoporthoz
szabadon adhatom hozzá, és vehetem el a projekteket.

![Csoport létrehozása](/artifacts/posts/2009-08-28-munka-egyszerre-tobb-projekten/netbeans_project_group_create_b.png)

A projekt csoportok váltása között nem kell újraindítani a NetBeans-t,
egyszerűen a File/Project Group menüpontban kell kiválasztani a projekt
csoportot. Ekkor azonnal vált, bazárja a bezárandó projekt csoport
projektjeit, és kinyitja az új projekteket. A váltáskor megjegyzi a
megnyitott állományokat is, így ott folytathatjuk a munkát, ahol
abbahagytuk. Ebben a menüpontban lehet a projekt csoport tulajdonságait
is szerkeszteni, vagy projekt csoportot törölni.

![Csoport választása](/artifacts/posts/2009-08-28-munka-egyszerre-tobb-projekten/netbeans_project_group_menu_b.png)

Ez a koncepció ismerős lehet az Eclipse felhasználóknak, ott Workspace
néven fut ugyanez.

A projekt csoportok különösen hasznosak lehetnek pl. olyanoknak, akik
prezentációkat tartanak, mert így könnyen lehet váltani a bemutatandó
projektek között.

A projekt csoportokat a NetBeans a
\[user\_home/\].netbeans/\[version/\]config/Preferences/org/netbeans/modules/projectui/groups
könyvtárban tárolja el, így újratelepítéskor csak ezt a könyvtárat kell
átmásolni.

A projekt csoportokról egy remek
[videó](http://netbeans.dzone.com/news/how-organize-projects-netbeans)
is készült.

Webes alkalmazások fejlesztésekor a NetBeans-ben alapesetben ugyanazt a
Tomcat példányt használja, melyre az alkalmazást telepíti, és melyet
futtat. A Tools/Servers fülön azonban több Tomcat példányt is fel lehet
venni, ha pl. a különböző alkalmazásokat különböző verziójú Tomcat-ekben
akarjuk futtatni. Azonban ha több alkalmazást fejlesztünk, gyorsabb
lehet, ha mindegyik alkalmazásnak külön Tomcat-et definiálunk, akár
ugyanazt a verziót is, és csak azokat a dolgokat konfiguráljuk be,
melyekre a különböző alkalmazásoknak szüksége lehet (pl. csak az adott
alkalmazáshoz tartozó DataSource-ot inicializálja ekkor). Ezt
megoldhatjuk úgy is, hogy a Tomcat-et több példányba bemásoljuk, de
lehetőséget biztosít arra is (NetBeans-től függetlenül), hogy a
binárisokat megtartsuk egy közös könyvtárba (ezt nevezik Catalina
Home-nak), és csak a konfigurációs állományokat másoljuk le több
példányba, különböző könyvtárakba (ezt nevezik Catalina Base-nek). Ez
utóbbi csak a conf, logs, webapps, work, és temp könyvtárakat
tartalmazza. Amennyiben a NetBeans-ben egy új Tomcat-et veszünk fel,
külön megadhatjuk mindkettőt. Szerver esetén egyedül a CATALINA\_BASE
környezeti változót kell beállítanunk. Ez hasznos lehet akkor, ha
ugyanazon a szerveren több alkalmazást is futtatni akarunk, de nem
akarjuk, hogy egymástól függjenek (pl. az egyik Tomcat-jét a másiktól
függetlenül akarjuk indítani/leállítani, vagy az egyik alkalmazás a
másiktól egy Tomcat-ben elenné a memóriát). Ekkor a Services fülön a
Servers alatt megjelenik a két Tomcat, és jobb klikk/Edit server.xml
menüpontban külön tudjuk szerkesztgetni a server.xml-jüket.

Manapság egy webes alkalmazáshoz több, mint 30 JAR-t használunk (3rd
party library), ami akár a 20 megát is kiteheti. Amennyiben ezt a WAR-ba
csomagoljuk, és újra telepítjük az alkalmazást, ezeket mindig el kell
távolítani, majd be kell tölteni, miközben a Tomcat egy 20 megás WAR
állományt kezel, kitömörít, stb. Ennek elkerülésére megtehetjük azt,
hogy a JAR állományokat nem a WAR-ba csomagoljuk, és a web app
classloader-e tölti be, hanem a Tomcat lib könyvtárába másoljuk ezeket,
így a common classloader fogja betölteni ezeket. Így fejlesztés közben
az alkalmazást újraindítgatva kétszeres sebességnövekedést értem el, így
jelentősen rövidült a fejlesztési iteráció hossza. Persze ennél sokkal
szebb megoldás, ha a JAR-okat nem a lib könyvtárába másoljuk, hanem a
\${catalina.base}/conf/catalina.properties állományában a common.loader
porperty értékét kiegészítjük azzal a könyvtárral, ahol a JAR
állományaink elhelyezkednek. Itt használhatjuk a \${catalina.home} és
\${catalina.base} környezeti változókat is. Így indításkor ezeket is
betölti a Tomcat, és nem kell minden alkalmazás telepítéskor. A
NetBeans-be ehhez még a Project Properties/Libraries fülön be kell
állítani, hogy ne csomagolja a WAR-ba a JAR-okat, hogy a Libraries-eknél
a nevük melletti pipát (Package) kikapcsoljuk. Ezt használhatjuk akkor
is, ha pl. szerverre telepítünk, és nem 20 megás WAR állományokat
akarunk másolni, hanem jelentősen kisebbeket.
