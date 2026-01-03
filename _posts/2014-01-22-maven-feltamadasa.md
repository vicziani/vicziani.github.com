---
layout: post
title: A Maven feltámadása
date: '2014-01-22T00:25:00.001+01:00'
author: István Viczián
tags:
- Maven
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Frissítve: Egy [blog
poszt](http://takari.io/2014/02/03/maven-speed.html) is megjelent azóta.

A mai napon Jason van Zyl, a Maven alkotója egy prezentációt tartott
arról, hogy milyen tervei vannak a jövővel kapcsolatban, ezt szeretném
összefoglalni ebben a posztban.

Jason eddig a Sonatype-nál volt, aminek a nevéhez fűződik a Nexus
repository manager alkalmazás, valamint a remek Mavennel foglalkozó,
ingyenesen letölthető
[könyvek](http://www.sonatype.com/resources/books). Azonban mostanában
főleg a biztonsággal kapcsolatban lehetett róluk hallani, pontosabban a
nyílt forráskódú library-k használatának biztonsági kockázatának
minimalizálását tűzték ki célul.

Jason fő területe azonban a Maven, és továbbra is ezzel szeretne
foglalkozni, így megalapította a [Takari](http://takari.io) céget, mely
Maven oktatással, tanácsadással foglalkozik, erősen támaszkodva a nyílt
forráskódú közösségre.

Az utóbbi hónapokban több cégnél dolgozott azon, hogy a JVM alapú
alkalmazások életciklusa gyorsabb legyen, gyorsabban lehessen szállítani
az ügyfélnek. Persze ez több tényezőn múlik, nyilván a Maven közeli
dolgokra koncentráltak, a fejlesztés és a build gyorsítására. Több
eredményt is sikerült elérni, melyből már van, amit publikáltak, és van
amit a közeljövőben szeretnének nyílt forráskódúvá tenni.

Sebességgel kapcsolatos fejlesztések:

-   Inkrementális fordítás
-   További párhuzamos működés bevezetése (aggressive parallelization)
-   Generációk (generations)

Ezek mellett egyéb érdekes dolgokat is csináltak:

-   Projekt leírása más nyelveken (polyglot support)
-   Konzolban futó shell eszköz

Az összes témakör nagyon érdekes, és előremutató, érdemes ezeket
bővebben kifejteni. Az biztosan látszik, hogy nem öncélú fejlesztés
történik, hanem a fejlesztők leggyakoribb problémáit igyekszik
megoldani. Az is látható, hogy még szorosabb lesz a kapcsolat az IDE, a
Maven és a repository között. Azonban az újdonságok parancssorból is
kihasználhatóak majd.

Az inkrementális fordítás alapvetően az Eclipse beépített inkrementális
fordítójára, a [JDT](http://www.eclipse.org/jdt/core/)-re épül. Már az
[m2eclipse](http://www.eclipse.org/m2e/) Maven-t támogató Eclipse plugin
is képes egy önálló erőforrást egy önálló MOJO (Maven plugin)-n
keresztül hívni. Ez lett API-ként bevezetve, ez elég durva módosítást
eredményezett, hiszen, hozzá kellett nyúlni az életciklusokhoz, a
fordítóhoz, és a megfelelő pluginekhez. A függőségek feltérképezésével
igen bonyolult impact analyzis végezhető, mit kell újragenerálni,
újrafordítani. Konfiguráció változásnál pl. érdemes újra elvégezni. De
akár el lehet menni addig, hogy milyen teszt eseteket érdemes
újrafuttatni.

Párhuzamos fordítás a Maven 3-ban [jelent
meg](https://cwiki.apache.org/confluence/display/MAVEN/Parallel+builds+in+Maven+3),
mely feltérképezi a függőségi struktúrát, szinteket alkot, és ezeket a
szinteken lévő projekteket buildeli párhuzamosan. Az aggressive
parallelization használatával további gyorsulást sikerült elérni. Ennek
az az alapja, hogy egy sorba dobálja be azokat a projekteket, melyeknek
már elkészült a függősége, és ezeket sorba veszi attól függően, hogy
hány szál van, stb. Kiderült, hogy létezik egy critical path mely az a
függőségi ág, mely fordítása a legtöbb időt veszi igénybe. Igazából úgy
kell ütemezni a többi fordítást, hogy e mellett párhuzamosan
egyenletesen elosztva menjen. Így érdemes pl. ezt a critical path
hosszát is csökkenteni.

<a href="/artifacts/posts/2014-01-22-maven-feltamadasa/2014-01-parallel_b.png" data-lightbox="post-images">![Parallel build](/artifacts/posts/2014-01-22-maven-feltamadasa/2014-01-parallel.png)</a>

Annak azonban, aki már küzdött azzal, hogy a Mavent Continuous Delivery
(CD) környezetben használja, a legérdekesebb újdonság a generációk
bevezetése lesz. Ennek használatával ugyanis az artifactok egy számot
kapnak. Hatalmas előnye, hogy multi module project artifaktjai is
ugyanazt a számot kapják. Ez a szám a verziókezelő revision és branch
vonatkozásában egyedi. Ez rengeteg problémát megold. Egyrészt nem kell
innentől SNAPSHOT, azzal amúgy is volt olyan baj, hogy a multimodule
projektek más számot kaptak, és nem lehetett egymáshoz rendelni őket.
Nem kell ezek után használni sokunk ellenségét, a release plugint. Nem
kell release-elni, nem kell újra buildelni, nem kell a verziókezelővel
játszani, ugyanaz az artifact kerülhet ki.

Ezzel egy időben még azt is kitalálták, hogyan legyen az új artifactok
repository-ba juttatása, és onnan terítése még gyorsabb és hatékonyabb.
Erre egy delta protocol került kialakításra (JSON alapú). Nevéből
adódóan az az alapja, hogy csak a különbség utazik, és tárolva sem
lesznek az azonos artifactok, hanem egy operációs rendszerbeli hardlink
készül.

<a href="/artifacts/posts/2014-01-22-maven-feltamadasa/2014-01-gen-collab_b.png" data-lightbox="post-images">![Delta protocol](/artifacts/posts/2014-01-22-maven-feltamadasa/2014-01-gen-collab.png)</a>

A polygot támogatás lehetővé teszi a pom (Project Object Model) más
nyelvekben való meghatározását, pl. Ruby, Groovy, Scala, stb. Az
említett három nyelv érdekessége, hogy inline lehet plugineket
megvalósítani az adott nyelven.

A parancssoros konzol Tesla shell néven szintén nagyon érdekes dolog,
rengeteg jó ötlet van benne. Ebből láttunk egy élő demót is. El kell
indítani, és folyamatosan fut, így a memóriában marad, ami megtakarítja
a JVM állandó indítgatását. Gyakorlatilag az m2eclipse-el közös
alapokkal fog rendelkezni, az inkrementális forráskód generálást és
fordítást támogatni fogja. Alapból támogatja a GitHub-ot, ha olyan
könyvtárba lépünk, ahol git repository van, azonnal jelzi. Egy pufferben
tárolja az előző parancs kimenetét, amit a következő parancsban fel
tudunk használni. A demóban azt láttuk, hogy lefordított egy projektet,
a kimenetét Gist-ként feltette GitHubra, majd megnyitotta böngészőben.
Egy parancsból létrehozott egy GitHub issue-t. Parancsokat tartalmaz a
pom kezelésére, pl. Java verzió állítás, új függőség felvétele,
erőforrások filterelése (ezen parancsok hatására átírta a pom.xml-t). És
nem utolsó sorban szép színes!

Az itt ismertetett összes funkciót nyílttá teszik a GitHub-on, és utána
kerülhet a Maven-be. A legtöbb újdonsággal az elkövetkezendő két-három
hónapban fognak kijönni. A polygot támogatás már letölthető a GitHubról
[tesla-polyglott](https://github.com/tesla/tesla-polyglot) néven.
Egyelőre elég nagy a disztibúció, mert az összes nyelvhez tartozó
library-t tartalmazza, ezen majd javítanak, hogy csak azt töltse le,
amire szüksége van. A `translate` parancsot kiadva lehet a pom.xml-ünket
átkonvertálni más nyelvre. Ki is
[próbáltam](https://gist.github.com/vicziani/8527744) gyorsan, egy
egyszerű Spring Security-s projekt pom.xml-jét konvertáltam Groovy-ba. A
Tesla shellt már egy héten belül megkaphatjuk, még elég kísérleti
változatot. (A Tesla névvel még lesznek licensz gondok.)

A fáma alapvetően az Eclipse és m2eclipse-ről szól, de később
integrálható a többi IDE-hez is, hiszen az API elérhető lesz azokból is.

Az előadás alapján én nagyon bizakodó vagyok, ugyanis nem apró,
szükségtelen funkciók kerültek bele, hanem felismerték a valós
igényeket, a valós használati eseteket, elismerték a Maven hibáit
(SNAPSHOT-kezelés), és nem féltek hozzányúlni az alapjaihoz, hogy
kijavítsák.
