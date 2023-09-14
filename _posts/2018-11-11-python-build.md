---
layout: post
title: Python build és Continuous Integration
date: '2018-11-04T23:10:00.007+01:00'
author: István Viczián
tags:
-
description: Hogyan álljunk neki egy Python projektnek, amit aztán Continuous Integrationbe szeretnénk kötni.
---

Technológiák: Python 3, venv, pip, make, pytest, coverage, pytest-cov, pylint, SonarQube, Jenkins

Frissítve: 2018. december 14.

Amint az már egy [korábbi posztból](/2011/06/13/masodik-nyelv-python.html) kiderülhetett,
a Java mellett a Python az egyik kedvenc programozási nyelvem, ráadásul mostanában
sok inspirációt és motivációt kapok, hogy foglalkozzam vele, egészen a nyelvi alapoktól
(például az objektumorientáltság is) egy teljes projekt felépítéséig.

A Python nézetem szerint különösen alkalmas nyelv a programozás oktatására, valamint
a programozásba való bevezetésbe, sőt akár olyanoknak is megmutatható, akiknek
csak érintőleges kapcsolata lesz a programozáshoz.

A Python nyelvvel kapcsolatban nagyon sok írást, könyvet, videót lehet találni, azonban arról,
hogy hogyan építsünk fel egy projektet, milyen build eszközt használjunk, hogyan integráljuk
Continuous Integration eszközbe, hogyan biztosítsuk a kódminőséget, valamint mindezt hogyan
érjük el fejlesztőkörnyezetből, arról már sokkal kevesebb, és egymással ellenmondó (esetleg elavult)
információt lehet találni.

Java esetén viszonylag egyszerű, a Maven, JUnit, Jacoco, Jenkins, SonarQube eszközökkel nem lehet hibázni. Python
esetén kicsit színesebb a kép. Nem árulok el titkot, hogy a SonarQube, melyről nemrég [írtam](/2017/03/21/sonarqube.html), Python forráskód elemzésére is alkalmas, így azt megtartom.

Ezen poszt összefoglalja, hogy ezzel kapcsolatban meddig jutottam a kutatással.
Amennyiben tévedést találsz, esetleg jobb megoldásod van, kérlek ne késlekedj velem
megosztani. Természetesen több megoldás is elképzelhető, tetszőlegesen bonyolítható,
azonban próbáltam egy minimális eszközkészletet összetenni, ráadásul olyanokat összeválogatni,
melyek kellően elterjedtek.

<!-- more -->

A FizzBuzz feladatot megoldó függvénnyel, valamint egy tesztesettel illusztrálom egy
projekt felépítését. A példa fenn van a GitHubon is [jtechlog-python](https://github.com/vicziani/jtechlog-python)
néven.

Azért, hogy struktúráltabb legyen, és jobban hasonlítson egy valódi projektre, a `fizzbuzz.py`
modul (fájl) a `jtechlog` csomagba került.

```
jtechlog-python/
└── jtechlog/
    └── fizzbuzz.py
```

Maga a modul egyetlen `fizzbuzz` függvényt definiál:

{% highlight python3 %}
def fizzbuzz(to_number):
    # ...
{% endhighlight %}

Ez első probléma, amibe belefutottam, hogy amennyiben a Pythont globálisan telepítjük
az operációs rendszerünkre, valamint abba installáljuk a különböző függőségeinket, akkor
projektenként nem tudjuk megmondani, hogy melyik verziójú Pythont használjuk,
valamint a projektünkbe melyik függőség melyik verzióját szeretnénk használni.

Erre nyújt megoldást a `venv` modul, mely valójában egy pehelysúlyú virtuális
környezetet (virtual environment) teremt, elszigetelve a globális telepítéstől. Gyakorlatilag létrehoz egy
külön könyvtárat, ahová a Python futtatható állományok kerülnek,
valamint a projektben használt függőségek. A `venv` a Python része a 3.3 verzió óta.

Egy virtual environment létrehozás a következőképp működik, a legjobb módja, ha Python modulként
futtatjuk a következőképp a projektünk gyökérkönyvtárában:

```
python3 -m venv venv
```

A `-m` kapcsoló után a modul nevét adjuk meg, majd a könyvtárat, melybe szeretnénk, hogy létrejöjjön a
virtual environment.

Ekkor létrejön valami hasonló könyvtárszerkezet:

```
bin
include
lib
lib64 -> lib
share
pyvenv.cfg
```

A `venv` könyvtárat vegyük fel a `.gitignore` fájlba.

Amennyiben parancs sorban akarjuk használni a Python parancsokat, az adott virtual environmentet aktiválni kell.
Ehhez adjuk ki a következő parancsot a projektünk gyökérkönyvtárában, ahol kiadtunk az előző parancsot is:

```
source venv/bin/activate
```

Figyeljük meg, hogy a `source` paranccsal futtatjuk. Ekkor a prompt is mutatja, hogy virtual environmentben vagyunk, nálam pl.:

```
(venv) vicziani@viprobook:~/Documents/projects/jtechlog-python
```

Ezután ha kiadjuk pl. a `python` parancsot, a `venv` virtal environmentben telepített Python fog indulni.

A környezet deaktiválhatjuk is, visszatérve a globális Python telepítésre:

```
deactivate
```

A következő kérdés, hogy mivel telepítsük a függőségeinket, melyeket pl. az internetről tudunk beszerezni. Erre
a legelterjedtebb eszköz a `pip`, mely a Python 3.4 verzió óta a Python része, sőt ettől a verziótól kezdve
ha létrehozunk egy virtual environmentet, abba is telepítve lesz a `pip`. A nyílt forráskódú Python
csomagok elérhetőek a [Python Packaging Index](https://pypi.org/) nyilvános repository-ban.

Ezután természetesen egyesével is telepíthetjük a `pip` parancs használatával, azonban újrafelhasználhatóbb módja, ha a
projekt gyökerében lévő `requirements.txt` fájlban adjuk meg a függőségeinket. Ebben felsorolhatjuk a függőségeinket,
valamint a [formátum](https://pip.pypa.io/en/stable/reference/pip_install/#requirements-file-format) megengedi, hogy
szabályokat adjunk meg a verziószámokra vonatkozóan is. Érdemes mindig explicit verziószámokat megadni, különben egy
új, visszafele nem kompatibilis verzióval már nem fog működni az alkalmazásunk.

A `pip` a következő paranccsal futtatható, hogy felolvassa a `requirements.txt` állományt, és telepítse a benne felsorolt
függőségeket:

```
pip install -Ur requirements.txt
```

A `-U` kapcsoló mondja meg, hogy amennyiben már vannak függőségek telepítve, frissítse azokat.

Mivel itt már legalább két parancs kiadásáról volt szó, és feltételezhető, hogy több is lesz, érdemes bevezetni valami
build rendszert, aminek használatával reprodukálhatóak a buildek, és nem kell ezeket a parancsokat megjegyezni, és képes ezeket
újra és újra futtatni.

Erre kitűnő megoldás lehet a `make`, mely a C programozási nyelvvel együtt terjedt el, de nekünk is tökéletes lesz. Ennek
konfigurálására a `Makefile` fájlt használjuk, nézzük meg ennek kiindulási verzióját:

```
install: venv/bin/activate
venv/bin/activate: requirements.txt
        test -d venv || python3 -m venv venv
        venv/bin/pip install -Ur requirements.txt
        touch venv/bin/activate
```

Ennek első sora egy szabály (ami kettőspontot tartalmaz), ami azt jelenti, hogy az `install`
lefuttatásához szükség van a `venv/bin/activate` fájlhoz. A következő szabály, a második sor
azt határozza meg, hogy a `venv/bin/activate` fájlhoz viszont szükség van a `requirements.txt` állományra.

Adjuk ki a `make` parancsot.

Amennyiben még nem hoztuk létre a virtual environmentet, lefutnak a második szabály alatt lévő parancsok.
Ha nem létezik a `venv` könyvtár, kiadásra kerül a `python3 -m venv venv` parancs. Majd meghívásra kerül a
`pip`, valamint az `activate` fájl utolsó módosításának idejét az aktuális időre állítjuk. Ez azért kell,
mert amennyiben változik a `requirements.txt`, és annak utolsó módosításának ideje később lesz, mint az
`activate` fájl utolsó módosításának ideje, újra le fogja futtatni ezeket a parancsokat. Ekkor már meglesz a `venv`
könyvtár, és a `pip` parancs `-u` kapcsolója miatt frissíteni fogja a függőségeket.

Természetesen a kódhoz teszteset is kell, ehhez a `pytest` keretrendszert használtam, mely modernebb,
mint a `unittest`, egyszerűbben lehet teszteseteket implementálni, a futtató modulja is könnyebben
használható, valamint a kódlefedettség is egyszerűbben illeszhető. Szóba jött még a `nose` is, de ennek már leállt a fejlesztése.

Tegyük be a `requirements.txt` állományba:

```
pytest==4.0.1
```

A teszt így néz ki, és a `tests/jtechlog/fizzbuzz_test.py` állományban kapott helyet:

{% highlight python3 %}
from jtechlog.fizzbuzz import fizzbuzz


def test_for_many():
    assert fizzbuzz(16) == "1 2 fizz 4 buzz fizz 7 8 fizz buzz 11 fizz 13 14 fizzbuzz 16"
{% endhighlight %}

Látható, hogy a `jtechlog` csomag `fizzbuzz` moduljából importáljuk a `fizzbuzz` függvényt, amit meg is hívunk.

A teszteket azonban a legegyszerűbb installált modulokon futtatni, ezért installálni kell a modulunkat a következő paranccsal, ami szintén
bekerült a `Makefile`-ba:

```
venv/bin/pip install -e .
```

A `-e` kapcsoló az ún. *editable mode*, vagy setuptools terminológiában *develop mode*, ami azt jelenti, hogy nem kell a projektünket
állandóan buildelgetni, meg installálni, elegendő egyszer, és ahogy szerkesztjük, az azonnal érvénybe is lép.

Az, hogy ez a parancs le tudjon futni, el kell készíteni a projekt leíró állományát is, mely a `setup.py` állományban történik, tartalma:

{% highlight python3 %}
#env/bin python

from distutils.core import setup

setup(name='jtechlog',
      version='1.0',
      packages=['jtechlog'],
     )

{% endhighlight %}

A `make` parancsot futtatva már installálva lesz a modulunk:

```
Obtaining file:///home/vicziani/Documents/projects/jtechlog-python
Installing collected packages: jtechlog
  Found existing installation: jtechlog 1.0
    Uninstalling jtechlog-1.0:
      Successfully uninstalled jtechlog-1.0
  Running setup.py develop for jtechlog
Successfully installed jtechlog
```

A teszteket futtatni a `pytest` parancs kiadásával lehet. Be is került egy új szabály a `Makefile` fájlba:

```
test: install
        venv/bin/pytest
```

Ez azt is jelenti, hogy a tesztek futtatásának előfeltétele az `install`. Futtatáskor (`make test` paranccsal)
valami hasonlót kapunk:

```
============================= test session starts =============================
platform win32 -- Python 3.6.4, pytest-4.0.1, py-1.7.0, pluggy-0.8.0
rootdir: D:\vicziani\Work\jtechlog-python, inifile:
plugins: cov-2.6.0collected 1 item

test_fizzbuzz.py .                                                       [100%]

========================== 1 passed in 0.02 seconds ===========================
```

A tesztlefedettséget a `coverage` modullal ([coveragepy on GitHub](https://github.com/nedbat/coveragepy))
mérem, melyet a `pytest` modulhoz a pytest coverage pluginnal illesztettem ([pytest-cov on GitHub](https://github.com/pytest-dev/pytest-cov/)).
Ezért mindkettő bekerült a `requirements.txt` fájlba:

```
pytest-cov==2.6.0
coverage==4.5.2
```

A tesztek futtatásakor kiadott parancsot a következőképp kell módosítani, hogy lefedettséget is mérjen:

```
venv/bin/pytest --cov=jtechlog --cov-report xml
```

Azért szükséges az xml formátumú riport, mert a SonarQube majd ezt képes feldolgozni. A futtatás hatására
létrejön a `.coverage` és a `coverage.xml` állomány, melyet érdemes elhelyezni a `.gitignore` fájlban.

A Python forráskód elemzésre a [Pylint](https://www.pylint.org/) eszközt választottam. Szintén fel kell venni a `requirements.txt` fájlba:

```
pylint==2.2.2
```

Majd újra `make` kiadása következhet.

A `pylint` a következő paranccsal futtatható:

```
venv/bin/pylint jtechlog
```

Azonban ha be akarjuk kötni a SonarQube-ba, speciális üzenetformátumot kell alkalmaznunk, valamint nincs szükség a teljes riportra.
Így a parancs:

```
venv/bin/pylint --rcfile=.pylintrc jtechlog -r n > pylint-report.txt
```

A SonarQube a kimenetként előállt `pylint-report.txt` állományt fogja feldolgozni. A `pylint` konfigurációja a
`.pylintrc` állományban található, melynek tartalma:

```
[MESSAGES CONTROL]
msg-template="{path}:{line}: [{msg_id}({symbol}), {obj}] {msg}"

disable=C0111
```

Látható, hogy meg van adva az üzenetformátum, melyet a SonarQube fel fog tudni dolgozni. Valamint a C0111 szabályt kikapcsoltam. Az
eredmény fájlt szintén felvettem a `.gitignore` fájlba.

Mivel előállt a kódminőség ellenőrzést tartalmazó `pylint-report.txt` állomány, valamint a kódlefedettséget tartalmazó
`coverage.xml`, már csak a SonarQube-ba kell betölteni. Ehhez a [SonarQube Scannert](https://docs.sonarqube.org/display/SCAN/Analyzing+with+SonarQube+Scanner)
kell használnunk, melyet csak ki kell csomagolnunk, majd meghívnunk. A konfigurációs állománya magáért beszél:

```
sonar.projectKey=jtechlog-python
sonar.sources=jtechlog
sonar.host.url=http://localhost
sonar.language=py
sonar.python.pylint.reportPath=pylint-report.txt
sonar.sourceEncoding=UTF-8
sonar.python.coverage.reportPath=coverage.xml
```

Futtatásához a következővel bővítettem a `Makefile` fájlt:

```
sonar: install
        /opt/sonar-scanner-3.2.0.1227/bin/sonar-scanner
```

A futtatás előtt azonban a SonarQube-on is konfigurálni kell. Először fel kell telepíteni a [SonarPython](https://docs.sonarqube.org/display/PLUG/SonarPython) plugint, majd a SonarQube-ot újraindítani. A másik, melyet nehezen találtam, hogy a Pylint szabályokat is be kell kapcsolni az adott Quality Profile-ba. Ehhez rá kell keresni a szabályokra (`pylint` szót tartalmazza), majd tömegesen bekapcsolni őket.

Így kiadva a `make sonar` parancsot, a kódminőség és tesztlefedettség adatok meg fognak jelenni a SonarQube felületén.

A fejlesztéshez a PyCharm IDE-t használtam. Ez is támogatja a `venv`-et, a `requirements.txt` fájlt, valamint a tesztesetek futtatását is.
Ehhez csak a `venv`-et kell bekonfigurálnunk. Ehhez a File/Settings... menüpontot kell kiválasztatnunk, majd ott a projektnél a Project Interpreter ablakot. Itt a kis fogaskereket ábrázoló gombra kell kattintani, majd Add... menüpont. Itt a Virtualenv Environmentet kell kiválasztanunk, és itt kijelölni azt a könyvtárat, ahová a virtual environmentet (`venv`) telepítettük. Ezután a PyCharm már a `requirements.txt` fájlt is fel fogja ismerni, és felindexeli a megfelelő modulokat, és a kódkiegészítés is működni fog.

Érdemes feltelpíteni a [SonarLint](https://www.sonarlint.org/) plugint, ami lokálisan ellenőrzi ugyanazokat a szabályokat, amit a SonarQube is,
így már commit előtt kijavíthatjuk azokat.

Az idáig tartó út igen sok tanulással és próbálkozással járt, és különösen érdekes volt összehasonlítani
pl. a Javas megoldásokkal. Ezen kívül tényleg nagy élmény volt, mikor a jelentések megjelentek a SonarQube-ban.
Természetesen rengeteg eszköz van, ami még kipróbálásra vár, de ezen az úton már el lehet indulni.
