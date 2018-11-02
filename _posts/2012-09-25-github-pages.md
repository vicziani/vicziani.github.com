---
layout: post
title: GitHub Pages
date: '2012-09-25T22:09:00.001+02:00'
author: István Viczián
tags:
- GitHub
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Az egyetemi szerveren lévő honlapom a diploma megszerzése után tizenegy
évvel egyik napról a másikra leállt. Így másik megoldás után kellett
néznem. A legkézenfekvőbb választásnak a [GitHub
Pages](https://pages.github.com/) tűnt, hiszen egyre többet használom,
ráadásul ingyenes. Azért tetszik különösen, mert egyrészt egyszerre meg
van oldva az oldalam verziókezelése és publikálása. Valamint sablonokon
alapul, így megvalósítható a különböző oldalrészek újrafelhasználása,
azaz a fejlécet, menüt és láblécet csak egyszer kell definiálni, ez
különösen jól jön karbantartáskor. Az első lépések megtételében segít a
kellően részletes
[dokumentáció](https://help.github.com/categories/20/articles).

Az új oldal forrása böngészhető a
<https://github.com/vicziani/vicziani.github.com> címen.

Eddig elég manuális megoldást használtam, [Ant-ból hívtam Apache
Texen-t](/2009/03/29/szoveg-generalas.html), mely a háttérben Velocity-t
használ. A GitHub megoldása ennél sokkal jobban kézre esik.

Amennyiben statikus html oldalakat akarunk kirakni, nagyon egyszerű a
használata, létre kell hozni egy username.github.com publikus
repository-t, ahol értelemszerűen a username a felhasználónevünk.
Kizárólag ezt a címet foglalhatjuk le, más névvel nem működik.
Generálhatunk oldalt az automatikus generátor segítségével is, ekkor egy
témát kell kiválasztanunk, és a
[Markdown](http://daringfireball.net/projects/markdown/syntax) leíró
nyelvvel leírni. Én a manuális utat választottam, mikor is a html-t én
írom meg. Parancssori klienst használok, a repository-t ugyanúgy kell
kezelni, mint bármely mást. Létre kell hozni a könyvtárat, elhelyezni
benne az állományainkat, majd kiadni a következő parancsokat
(természetesen a felhasználónevet lecserélve):

    git init
    git add .
    git commit -m "First commit"
    git remote add origin https://github.com/vicziani/vicziani.github.com.git
    git push -u origin master

Ezen parancsokat kiadva rövidesen egy e-mailt kapunk, hogy az oldalunk
sikeresen legyártásra került, kicsit várjunk, de a további
módosításainkat már azonnal érvénybe lépteti.

    From: GitHub noreply@github.com
    Subject: Page build successful

    Your page has been built. If this is the first time you've pushed, it may take
    a few minutes to appear, otherwise your changes should appear immediately.

Amennyiben kicsit bonyolultabb dolgokra van szükségünk, használhatjuk a
Ruby-ban implementált [Jekyll](https://github.com/mojombo/jekyll)
generátort. Ennek használatával valamilyen leíró nyelven meg kell adnunk
a tartalmat (HTML, Textile, Markdown, Liquid), és ebből előállítja a
HTML kimenetet, melyet bárhová kirakhatunk statikus tartalomként. A
Jekyll segítségével akár blogot is írhatunk, amikor csak a posztokat
kell megszerkeszteni, hozzá a körítést a Jekyll legenerálja. Könnyebbség
ráadásul, hogy nem nekünk kell a generálást meghívni, hanem a push után
automatikusan a GitHub szerverein történik, így azonnal láthatjuk az
eredményt.

Nézzünk is egy egyszerű példát. A könyvtárstruktúra kötött, a
főkönyvtárba opcionálisan elhelyezhető a \_config.yml állomány, mellyel
a generálást lehet konfigurálni. Az \_includes könyvtár tartalmazhatja
az újrafelhasználható oldalelemeket ({{ "{%" }} include file.ext %}
szintakszissal használandóak), míg a \_layouts könyvtár az oldal
sablonokat. A \_layouts könyvtárba helyezzük el ennek alapján a
default.html állományt:

{% highlight xml %}
<html>
<head>
</head>
<body>

{{ "{{" }} content }}

</body>
</html>
{% endhighlight %}

Valamint a főkönyvtárba az index.html állományt:

{% highlight xml %}
layout: default

Hello GitHub Pages!
{% endhighlight %}

Ahogy az várható, a Jekyll végigmegy azokon az állományokon, mely elején
a három kötőjelet találja (vigyázzunk, ne szerepeljen a file elején a
[BOM](http://en.wikipedia.org/wiki/Byte_order_mark), és a sablonban a {{
"{{" }} content }} helyére beszúrja a fájl tartalmát. Persze ezt tovább
bonyolíthatjuk, ha pl. oldalanként külön címet akarunk, akkor
definiáljunk egy változót a sablonban (default.html):

{% highlight xml %}
...
<title>{{ "{{" }} page.title }}</title>
...
{% endhighlight %}

Majd állítsuk be az értékét a konkrét oldalon (index.html):

{% highlight xml %}
layout: default
title: GitHub pages

Hello GitHub Pages!
{% endhighlight %}

A Jekyll a [Liquid](http://liquidmarkup.org/) template engine-t
használja. A standard Liquid
[filtereket](http://www.rubydoc.info/gems/liquid/2.2.2/Liquid/StandardFilters)
a Jekyll [továbbiakkal egészítette
ki](https://github.com/mojombo/jekyll/wiki/liquid-extensions). Például
régóta szerettem volna, hogyha generáláskor bekerül az aktuális dátum a
Date html meta tag-be. Ráadásul nem is akárhogyan, henm a HTML szabvány
által ajánlott ISO 8601 formátumban (pl. 2012-09-25). Ehhez a következőt
kellett csinálni:

{% highlight xml %}
<meta name="Date" lang="hu" content="{{ "{{" }} site.time | date: '%Y-%m-%d' }}"/>
{% endhighlight %}

A Jekyll [adja](https://github.com/mojombo/jekyll/wiki/template-data) a
site.time adatot, és ez a date filterrel formázott.

Persze jöttek nehézségek is, pl. a title változóba szerettem volna
kettőspontot elhelyezni. Ekkor a következő hibaüzenet fogadott:

    Building site: /cygdrive/d/download/qqqq -> /cygdrive/d/download/qqqq/_site
    /usr/lib/ruby/1.9.1/psych.rb:203:in `parse': (): mapping values are not allowed in this context at line 3 column 20 (Psych::SyntaxError)
            from /usr/lib/ruby/1.9.1/psych.rb:203:in `parse_stream'

Megoldásként a címet idézőjelek közé kell tenni:

{% highlight xml %}
title: "GitHub: pages"
{% endhighlight %}

Ahhoz, hogy ne csak élesben tudjam kipróbálni a generálást, fel
szerettem volna tenni a Jekyllt saját gépre is. (Van olyan lehetőség is,
hogy a Jekyll egy web szervert futtat, és úgy lehet kipróbálni a
tartalmat.) Linuxon ez valószínűleg egy egyszerűbb művelet, én Windowsra
próbáltam, Cygwin környezettel. Ez már varázslás kategória, [ebből a
cikkből](http://matt.scharley.me/2012/03/10/windows-cygwin-and-jekyll.html)
indultam ki. (Közben próbálkoztam Python megvalósítással is, létezik az
is, [Obraz](http://obraz.pirx.ru/) néven, de az a
[Jinja2](http://jinja.pocoo.org/) Python-ban implementált template
engine-t használja, és vannak ugyan átfedések, de inkompatibilitás is
bőven, a fentebb említett filterek például különböznek.

Ezt feltéve újabb probléma fogadott, nem sikerült a generálás, és a
következő jelent meg a konzolon:

    Liquid Exception: incompatible character encodings: UTF-8 and CP852 in default

Erre is volt megoldás, természetesen a karakterkódolással volt a
probléma, ezt a következőképp lehet orvosolni:

    set LC_ALL=en_US.UTF-8
    set LANG=en_US.UTF-8

Ezzel tökéletesen tesztelhető lokálisan a Jekyll generálás, így
bízhatunk, hogy a Github Pages is ugyanígy fog működni. Nem csak
magunknak, hanem egy szervezetnek, és a projektjeinknek is tudunk így
oldalakat készíteni. Java projekteknél pl. a mvn site parancs kimenetét
lehet így feltenni, sőt akár Maven repository-ként is használhatjuk.
