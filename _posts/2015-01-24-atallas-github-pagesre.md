---
layout: post
title: Átállás GitHub Pagesre
date: '2015-01-24T16:00:00.000+01:00'
author: István Viczián
modified_time: '2015-01-24T16:00:00.000+01:00'
---

Már régóta dédelgetem az ötletet, hogy az egész blogot átállítom a GitHub 
Pagesre, ezzel is konszolidálva minden tartalmat, melyet megosztok. Ez most egy
sikeres migrációval megtörtént, így kétszázhúsz posztot böngészhettek az 
[archívumban](/archivum.html), kb. tíz másik oldal vált elérhetővé, valamint az összes
írásom megnézhető a [cikkeknél](/cikkek.html). Bármi hibát találsz, akkor kérlek 
jelezd a viczian.istvan címen a gmailen. 

Eddig a Bloggeren írtam a posztokat, ahol egy szövegbeviteli mezőben lehetett html 
tartalmat írni, és bizonyos formázási lehetőségeket is adott, valamint pl.
képet lehetett feltölteni.

A Blogger több gyerekbetegséggel is küzdött. Volt olyan, hogy elveszett a beírt tartalom.
Ezért egy idő után átálltam arra, hogy Markdownban írom a cikket, átkonvertálom htmllé,
és úgy másolom a Bloggerre. A StackEdit, online Markdown szerkesztő képes azonnal a Bloggerre
publikálni, de ezt nem használtam.

Az oldalak sablonja egy monolitikus html állomány, CSS-sel, JavaScriptekkel.

Ha JavaScriptet akartam hosztolni, vagy egy poszthoz állományokat csatolni, 
azokat valahol máshol kellett tartanom (pl. Dropbox, Google Pages, stb.).

Ezzel a megoldással azonban nem voltam elégedett. Egyrészt szerettem volna a
tartalmat saját gépen előállítani, amit automatikusan, lehetőleg parancssorból
publikálok, valamint a posztokat Markdown formátumban írni.

El is kezdtem írni egy alkalmazást, de a Bloggerre való posztolás nem tűnt egyszerűnek.
Egyrészt kell egy API key-t kérni, mellyel a Blogger REST webszolgáltatásait lehet elérni,
másrészt még az OAuth szabványon keresztül is be kell jelentkezni. Ez nem egyszerű, bár
vannak rá könyvtárak, pl. [google-api-python-client](https://github.com/google/google-api-python-client).

A képek feltöltésével is meggyűlt bajom, ugyanis a Blogger esetén először a Picasara kell
feltölteni az állományt, a [Picasa API](https://developers.google.com/picasa-web/docs/2.0/reference)
szintén REST webszolgáltatás. Ez automatikusan thumbnait is generál, és ezt kell bekötni.

A forráskód színezésével kapcsolatban is keresgélni kellett, kiderült, hogy két
főbb eszköz van, a [Google Code Prettify.js](http://code.google.com/p/google-code-prettify/),
valamint a [Highlight.js](https://highlightjs.org/). Sok különbség nincs közöttük, a Stack Overflow 
pl. a Prettify-t használja.

Azonban mikor a kérelmemre (Blogger API v3 Quota Request) több napig sem 
jött jóváhagyás, más megoldás után néztem. [Már írtam](/2012/09/25/github-pages.html) 
a GitHub Pagesről, mely nem csak oldalak, hanem blog kiszolgálására is megfelelő.

Az összes eddigi követelményt kielégíti, valamint nagyon hasznos új tulajdonságokkal is 
rendelkezik:

* Rendkívül egyszerű a kezelése
* Lokális gépen vannak az állományaim, melyek Git verziókezelő rendszerbe kerülnek, és
egy push utasítással mennek a GitHubra, ahol az oldalak automatikusan legenerálódnak
* Markdown alapú, de amennyiben ez nem elegendő, html formátum is használható
* Ennek folyományaként az összes tartalom verzió kezelt
* Az utolsó bitig mindent én kontrollálok, úgymint a html tartalom generálása, CSS, 
JavaScriptek, RSS és Atom feed, 404 oldal, sitemap, stb.
* Apró sablondarabokból lehet építkezni
* Egyszerűek a tömeges műveletek, pl. több posztban keresni és cserélni valamit, 
mert szöveges állományok egy könyvtárban

Az átállás egyszerű volt, ugyanis a Jekyll, mely a GitHub Pages mögött lévő Ruby-ban implementált
oldal generátor, tartalmaz egy csomó importert. Pl. a [Blogger Importer](http://import.jekyllrb.com/docs/blogger/)
képes átalakítani a Bloggeren kiexportált XML tartalmat a Jekyll formátumba.

Ehhez a következő parancsok kellettek Ubuntun.

	sudo apt-get install ruby-dev
		
	sudo gem install jekyll-import

	# Ezek csak a Blogger Importernek kellenek

	sudo gem install execjs

	sudo gem install therubyracer

Egy üres Jekyll oldal a következő parancsokkal generálható, majd tesztelhető:

	jekyll new jtechlog

	jekyll serve

Ha ez megvan, akkor csak a következő parancsot kellett kiadni a Blogger export xml konvertálásához:

	ruby -rubygems -e 'require "jekyll-import";
		require "execjs";
		JekyllImport::Importers::Blogger.run({
		  "source"                => "blog-01-06-2015.xml",
		  "no-blogger-info"       => false, # not to leave blogger-URL info (id and old URL) in the front matter
		  "replace-internal-link" => false, # replace internal links using the post_url liquid tag.
		})'

Azt, hogy ezt testre szabjuk, még elég sokat kell dolgozni. Ebben segít a [Jekyll-Bootstrap](http://jekyllbootstrap.com/)
projekt, mely rengeteg előre gyártott és paraméterezhető sablont tartalmaz. Én ugyan nem használom, szerettem volna az 
egészet magam kialakítani, azonban rengeteg támpontot nyújtott. A statikus htmlben lévő archívumot is áthoztam, valamint több
átalakítást is elvégeztem, magam által írt pár soros Python szkriptekkel.

Ennek eredményeképp a blog és az összes oldalam elérhető egységes szerkezetben és stílusban a [http://www.jtechlog.hu](http://www.jtechlog.hu) címen.
A régi Blogger oldal még megmarad egy darabig a [http://jtechlog.blogspot.com](http://jtechlog.blogspot.com) címen, majd törlöm.
