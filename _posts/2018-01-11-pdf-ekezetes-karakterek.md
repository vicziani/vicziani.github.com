---
layout: post
title: Ékezetes karakterek PDF állományban
date: '2018-01-11T11:00:00.000+02:00'
author: István Viczián
description: Egy poszt arról, hogyan lehet Javaban generált PDF dokumentumokban ékezetes karaktereket használni.
---

Ismét egy régi tartozásomat pótolom. Aki próbált már magyar nyelvű PDF dokumentumot generálni, akár Java, akár más
programozási nyelven, belefuthatott abba a problémába, hogy az ékezetes karakterek rosszul jelentek meg.

Ebben a posztban azt mutatom meg, hogyan lehet ékezetes karaktereket helyesen megjeleníteni olyan
eszközökkel, mint az [iText](https://itextpdf.com/), [PDFBox](https://pdfbox.apache.org/) vagy a
DocBook ([Docbkx Tools](http://docbkx-tools.sourceforge.net/) használatával). De ha már itt tartunk, megnézzük,
hogy mik is azok a betűtípusok, hogyan lehet osztályozni, milyen főbb betűtípusok vannak, valamint hogyan lehet ezeket használni
PDF dokumentumban. Megnézzük hogyan épül fel ebből a szempontból egy PDF dokumentum, mi a
kódolás, és milyen kódolást kell használni.

<!-- more -->

A poszthoz több példa projekt is tartozik, mely elérhető a [GitHub-on](https://github.com/vicziani/jtechlog-pdf-font).

## Betűtípusok

Alapesetben miért nem jelennek meg az ékezetes karakterek? A PDF szabvány definiál 14 standard betűtípust (betűkép),
melyeket a legtöbb PDF olvasónak ismernie kell, és meg kell jelenítenie. Ettől függetlenül nem biztos, hogy
helyesen jelennek meg, a PDF olvasó dönthet úgy, hogy valamilyen helyettesítő betűtípust alkalmaz.

Ezen 14 standard betűtípus (*standard/base 14 fonts*):

* Times Roman (négy változatban: normál, dőlt, félkövér és félkövér dőlt)
* Courier (szintén négy változatban: itt döntött szerepel dőlt helyett)
* Helvetica (szintén négy változatban, köztük döntött)
* Symbol
* Zapf Dingbats

Érdekesség, hogy míg a Times Roman esetén dőlt (*italic*) változat van, addig a Courier és Helvetica esetén döntött (*oblique*).
A különbség, hogy a dőlt esetén a betűk külön vannak megrajzolva, ami hasonlít a kézíráshoz, és kevesebb helyet is foglal,
a döntött esetén nincsenek rajzolatbéli eltérések a döntött és álló verzió között.

Kis színesként nézzük meg a betűtípusok történetét, és tulajdonságait. A betűtípusokat két csoportba sorolhatjuk: talpas és talpatlan betűk.
A talpas, vagy *serif* betűk nyomtatásban könnyebben olvashatóak. A talpatlan (*sans-serif*, a *sans* francia fosztóképző) betűtípusok nyomtatásban
főleg címekben jelennek meg, viszont képernyőn jobban olvashatóak, mint a talpas betűtípusok. A talpatlan betűtípusok állandó vonalvastagságú
változatát *groteszk* betűtípusoknak is szokták nevezni.
 Azon betűtípusok, melyekben a karakterek szélessége változó a képüknek megfelelően, arányos betűtípusok. Ahol a karakterek azonos
szélességűek, azok az aránytalan, vagy rögzített szélességű betűtípusok. Kezdetben a legtöbb írógép aránytalan betűtípust használt, valamint
ott használatos, ahol elvárás, hogy a karakterek egymás alá megfelelően legyenek igazítva, például számoknál, vagy programozásnál.

A Times Roman talpas (és barokk) betű, melyet a Linotype tervezett a Times New Roman kiváltására. A második világháború alatt az
Egyesült Államokban annyira elterjedt volt, hogy csak ezzel nyomtattak újságot.
A Times New Roman betűtípust az 1930-as években tervezték, a The Times újság
számára. Digitalizált változatát a Monotype tervezte a Microsoft részére, és azóta is benne van minden Windows operációs rendszerben. A Times Roman
ellenétben a Macintosh gépek operációs rendszerébe került.

A Helvetica talpatlan (és újgroteszk) betűtípus, és 1957-ben tervezték Svájcban. A Microsoft Windowsban lévő Ariel betűtípus is a Helvetican alapszik.

A Courier egy aránytalan betűtípus, melyet az IBM fejlesztett ki az írógépek számára.

Azonban ezen betűtípusok azon részhalmazát támogatja a PDF szabvány, melyben nem szerepelnek az ékezetes karakterek.
Ezért általában a helyükön egy üres téglalap, vagy egy un. *replacement character* (`U+FFFD`) jelenik meg.
Ahhoz, hogy ezek is
helyesen megjelenjenek, olyan betűtípust kell választani, amiben léteznek az ékezetes karakterek, és
ezt a betűtípust be kell ágyazni a PDF dokumentumba.

A legegyszerűbb megoldás, hogy a fent említett betűtípusok valamely olyan változatát használjuk, melyekben szerepelnek az ékezetes karakterek.
Azonban ezen betűtípusok licenszelése nem egyszerű, és jogilag nem is feltétlen beágyazhatóak.

A PDF-be a betűtípusokat Type 1 (Adobe nevéhez kötődik), TrueType (Apple és Microsoft közös alternatívája a Type 1 formátumra) vagy OpenType formátumban lehet beágyazni.

A betűkészlet formátum esetében szükség van a kódolásra, mely a karakterkódokat összeköti a betűk rajzolatával. Erre van például a *WinAnsi*, *MacRoman*,
azonban itt csak korlátozott számú karakter ábrázolható. Nagyszámú, speciális, például ékezetes karaktereket is tartalmazó betűkészlet formátumot más kódolással kell ellátni, pl. *Identity-H* kódolással (ahol a `h` a horizontal, azaz vízszintes írásra utal).

Ezért érdemes olyan betűtípusokat választani, amelyek ingyenesen használhatóak, és tartalmaznak ékezetes karaktereket. Ilyen például a GNU FreeFont (más néven Free UCS Outline Fonts), innen ismeretes például a FreeSerif, FreeSans és FreeMono. Tipikusan GNU rendszerekre, és Linuxra jellemző.
Az Adobe is közzétett nyílt forrású betűtípusokat Source Sans Pro, Source Code Pro és Source Serif Pro néven. Elterjedt még a *DejaVu* betűtípus,
melyet szintén sok Linux disztribúció tartalmaz. A példákban ezt használom. A DejaVu nagyon sok írásrendszer (pongyolábban a továbbiakban ábécé) karaktereit tartalmazza, viszont van egy részhalmaza, *DejaVu LGC* néven, mely csak a latin, görög és cirill ábécé karaktereit tartalmazza. Mivel kisebb, és része a magyar ábécé, ezért megfelelő a számunkra.

A Unicode egy szabvány, mely leírja a különböző írásrendszerek egységes kódolását. A Unicode 10.0 több, mint 136 000 karaktert ír le, melyek 139 féle ábécé és több szimbólumrendszer részei. A Unicode tehát ezen karakterekhez egy egész számot rendel. A Unicode több részhalmazból (*range*) áll, pl. az első 65 000 karakter Basic Multilingual Plane (BMP) néven ismert, de létezik latin, görög, cirill, arab, stb. részhalmaz is. Unicode karaktereket tartalmazó szövegeket különböző kódolással tárolhatjuk, attól függően, hogy a különböző karaktereket hány biten ábrázoljuk. Ilyen kódolás pl. az UTF-8, UTF-16, stb.

## PDFBox

Nézzük tehát, hogy hogyan lehet a DejaVu LGC betűkészletet beágyazni PDFBox esetén. Ha olyan karaktert használunk, amit a standard 14 betűkészlet nem
tud ábrázolni, kivételt kapunk.

```
java.lang.IllegalArgumentException: U+0171 ('udblacute') is not available in this font Helvetica (generic: NimbusSanL-Regu) encoding: WinAnsiEncoding
  at org.apache.pdfbox.pdmodel.font.PDType1Font.encode(PDType1Font.java:406)
```

Látható, hogy az alapértelmezett betűtípus a Helvetica (WinAnsi kódolással), és ebben nincs `ű` karakter.

A `ttf` kiterjesztésű állományokat helyezzük el a classpath-on, majd PDF generálásakor használjuk a következő kódrészletet:

{% highlight java %}
PDDocument document = new PDDocument();
PDPage page = new PDPage();
document.addPage(page);

PDPageContentStream content = new PDPageContentStream(document, page);
content.beginText();
content.newLineAtOffset(25, 700);
content.setLeading(14.5f);

PDFont sans = PDType0Font.load(document, PdfGenerator.class.getResourceAsStream("/ttf/DejaVuLGCSans.ttf"));
content.setFont(sans, 12);
content.showText(s);
content.newLine();

content.endText();
content.close();

document.save(stream);
document.close();
{% endhighlight %}

A tesztesetet lefuttatva létrejön egy PDF állomány, mely már helyesen tartalmazza az ékezetes karaktereket.

Ha megnézzük a PDF tulajdonságait (a legtöbb PDF megjelenítő biztosít erre lehetőséget), a Fonts fülön
láthatók a beágyazott betűtípusok TrueType (CID), Identity-H encoding és embedded subset tulajdonságokkal.

Az *embedded subset* ebben az esetben azt jelenti, hogy nem a teljes betűkészlet van beágyazva, csak azon karakterek,
melyek a dokumentumban használva lettek (látható, hogy nem is nőtt a PDF mérete szignifikánsan).

## iText

Az iText 7 esetén is hasonlóképp kell eljárni. Amennyiben nem ágyazunk be betűkészletet, az iText nem ad hibaüzenetet, csak
nem jelennek meg az ékezetes karakterek. Az alapértelmezett betűtípus itt is a Helvetica.
A beágyazáshoz használjuk a következő kódrészletet:

{% highlight java %}
PdfWriter writer = new PdfWriter(stream);

PdfFont sans = PdfFontFactory.createFont(
        "/ttf/DejaVuLGCSans.ttf", PdfEncodings.IDENTITY_H, true);
PdfDocument pdf = new PdfDocument(writer);
Document document = new Document(pdf);
document.add(new Paragraph()
        .setFont(sans)
        .add(s)
        );
document.close();
{% endhighlight %}

## DocBook

Amennyiben DocBook formátumból akarunk PDF formátumot generálni, a Docbkx Maven Plugint használhatjuk. Ez először
XSL-FO formátumba konvertál, majd FOP-pal PDF formátumba. Amennyiben nem talál megfelelő betűkészletet, a következő
hibaüzenetet írja ki:

```
75 [main] WARN org.apache.fop.apps.FOUserAgent  - Glyph "ű" (0x171, udblacute) not available in font "DejaVuLGCSerif".
```

Egyrészt meg kell adnunk a beágyazandó betűtípusokat. Azonban a FOP-nak át kell adni egy un. metrics állományt is. Ezeket
szerencsére a `docbkx-fop-support` Maven plugin le tudja generálni a TTF állományok alapján.

{% highlight xml %}
<plugin>
    <groupId>com.agilejava.docbkx</groupId>
    <artifactId>docbkx-fop-support</artifactId>
    <version>${docbkx-tools.version}</version>
    <executions>
        <execution>
            <phase>generate-resources</phase>
            <goals>
                <goal>generate</goal>
            </goals>
            <configuration>
                <ansi>false</ansi>
            </configuration>
        </execution>
    </executions>
</plugin>
{% endhighlight %}

Az `ansi` tag értéke mondja meg, hogy itt Identity-H kódolás lesz.

A következő kódrészlet egyrészt beágyazza a betűkészleteket, valamint beállítja, hogy a címsor
alapértelmezett betűtípusa DejaVuLGCSans legyen, a bekezdések szövege DejaVuLGCSerif betűtípussal kerüljön
kiírásra.

{% highlight xml %}
<plugin>
    <groupId>com.agilejava.docbkx</groupId>
    <artifactId>docbkx-maven-plugin</artifactId>
    <version>${docbkx-tools.version}</version>

    <executions>
        <execution>
            <id>generate-pdf</id>
            <phase>compile</phase>
            <goals>
                <goal>generate-pdf</goal>
            </goals>
        </execution>
    </executions>
    <configuration>
        <titleFontFamily>DejaVuLGCSans</titleFontFamily>
        <bodyFontFamily>DejaVuLGCSerif</bodyFontFamily>
        <fonts>
            <font>
                <name>DejaVuLGCSans</name>
                <style>normal</style>
                <weight>bold</weight>
                <embedFile>${basedir}/src/fonts/DejaVuLGCSans-Bold.ttf</embedFile>
                <metricsFile>${basedir}/target/fonts/DejaVuLGCSans-Bold-metrics.xml</metricsFile>
            </font>
            <font>
                <name>DejaVuLGCSerif</name>
                <style>normal</style>
                <weight>normal</weight>
                <embedFile>${basedir}/src/fonts/DejaVuLGCSerif.ttf</embedFile>
                <metricsFile>${basedir}/target/fonts/DejaVuLGCSerif-metrics.xml</metricsFile>
            </font>
        </fonts>
    </configuration>
</plugin>
{% endhighlight %}
