---
layout: post
title: ! 'Második nyelv: Python?'
date: '2011-06-14T00:00:00.005+02:00'
author: István Viczián
tags:
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Remélem ezzel a cikkel is sikerül annyi gondolatot megmozgatni, mint az
előbbivel, ha valami eszetekbe jut, ne legyetek rest hozzászólni!

Mostanában divat második/sokadik nyelvet keresni, egy kicsit kiszakadni
a mindennapi munka egyhangúságából, és egy másik világot megismerni, egy
másik programozási nyelvben is jártasságot szerezni.

Bár sokan azt mondják, hogy ha megtanulsz egy programozási nyelvet,
utána a többi gyerekjáték, azért ezzel nem teljesen értek egyet.
Egyrészt igaz lehet ez imperatív nyelveknél, de egy funkcionális vagy
logikai nyelv már távolabb áll ettől a világtól, érdemes rápillantani a
Lispre. Másrészt nem a nyelvben való jártasság, ami a programozó értékét
adja, hanem a köré épülő platform, "ecosystem" ismerete. Megtanulni a
nyelv szintaktikáját egy dolog, de ismerni az elterjedt
keretrendszereket, könyvtárakat, best practice-eket, konvenciókat,
eszközöket. Egy másik nyelv megismerése a többi nyelv használatában is
fejleszt, ugyanis lehet új és hasznos ötletekkel találkozni, melyeket
újra lehet használni.

Én is elindultam keresni, és a Python mellett döntöttem, olvassátok,
miért. A posztban egy nyelv professzionális elsajátítása mellett
érvelek, és nem egyszerű felhasználásról, ami elkerülhetetlen bizonyos
esetekben (pl. mennyien használnak JavaScript-et, PL/SQL-t annak alapos
ismerete nélkül).

![Python](/artifacts/posts/2011-06-14-masodik-nyelv-python/python-logo-master-v3-TM_b.png)

Semmiképp nem akartam nagyon elrugaszkodni, egy imperatív nyelvet
akartam választani. Először egy olyan nyelvet akartam választani, melyet
sokan használnak, a munkám során is gyakran találkozok vele, és az
álláshirdetésekben is gyakran szerepel. Szóba jöttek az előbb említett
nyelvek, a JavaScript, PL/SQL, valamint a PHP is. Ezeket valamilyen
szinten ismerni kell, miért ne ismerje meg az ember a lehető legmélyebb
szinten. A PL/SQL-lel (Procedural Language extensions to the Structured
Query Language) kezdtem. Egy adatorientált imperatív nyelvről van szó
(Adán alapul), mely Oracle adatbázisban fut (embedded - viccesen
platformfüggetlennek nevezik, hiszen amelyik platformra van Oracle
telepítve, ott megy), és emiatt erősen gyártófüggő. Mivel alapvetően
adatokon dolgozunk, gyakran jöhet jól, egy adatokhoz közelibb nyelv. Én
hiszek abba a modellbe, hogy ne vigyünk fel mindent Java szintre, amit
meg lehet egyszerűbben oldani adatbázisban, miért ne. Felesleges
bizonyos dolgokat megjáratni a rétegek között. Tipikus ilyen példa a
nagy adatmennyiséggel dolgozó riportok. A nyelv sajnos nem adta meg azt,
amit vártam tőle, hiányzott a szépség, az elegáns megoldások. Az alap
szinttől a professzionális szintig nehéz út vezet, mely nem olyan
látványos, és sokszor nincs is igazán szükség az emelt szintű dolgokra,
és feltételezem, hogy a látókörömet sem tágítja annyira. Az előnye a
hátránya, kizárólag adatmanipulációra használatos.

A JavaScript fénykorát éli, megvan benne minden, amire a programozónak
szüksége lehet, és úton útfélen találkozik vele az ember. Bár szerver
oldalon is használható, azért mégis kliens oldalon jellemző. Egy erősen
JavaScript/AJAX megoldásokat használó projekt után ezt is elvetettem.
Igaz, hogy vonzóak a nyelv képességei, és az, hogy egy oldal
újratöltéssel azonnal tesztelhető, mégis úgy találtam, hogy a JavaScript
legmélyebb szintű megtanulása a User Interface-hez köt, specializálódsz,
és innentől kellenek a design, tipográfiai és usability ismeretek is. Én
ebbe az irányba nem akartam elmenni, én ezt külön szakmának tartom, és
alapvető hibának, ha a programozókkal akarnak felhasználói felületet
terveztetni (tisztelet a kivételnek).

A PHP-n kellett a legtöbbet gondolkozni, hogy mivel is érveljek ellene.
Az alapvető unszimpátia megvolt, de nehéz ezt objektív érvekkel
alátámasztani. A Java nagy kihívója webes felületek implementálására, de
lazasága miatt nem köti meg annyira meg az ember kezét (értsd: könnyebb
benne gányolni). Feltehetőleg ezért nem ismerik el annyira pl. bankos
környezetben, és ezért tartják még mindig a Java-t alkalmasabbnak üzleti
logika megfogalmazására. Megtanulásával ott vagyok, ahol a part szakad,
egy újabb technológia, mellyel kb. ugyanúgy és ugyanazt lehet kihozni
webes alkalmazások terén, mint Java használatával. Szerintem ugyanolyan
kvalitású fejlesztők ugyanúgy használják jól vagy rosszul mind a kettőt.
A .NET-tel kapcsolatban is azt érzem, hogy szimmetrikus párja a
Java-nak, szemléletbeli váltást nem hoz, sok pluszt nem nyújt.

A C, C++ mindig is az alacsony szintű programozásra volt alkalmas (értsd
jól, pl. kernel, beágyazott rendszerek fejlesztése, amiről tudjuk, hogy
az egyik legnagyobb szaktudást igényli), ebbe az irányba szintén nem
akartam elmozdulni.

Így kilőttem az első követelményt, hogy lehetőleg olyan nyelvet
válasszak, ami nagyon elterjedt, és divatos, és nem utolsó sorban
keresett. A második legfontosabb követelmény az volt, ha nem is annyira
érték emelő, legalább a mindennapi munkámban bizonyuljon hasznosnak.
Egyrészt gyakran kell ilyen-olyan kisebb feladatokat megoldani,
melyekhez felesleges az IDE-t elindítani, és Java alkalmazást írni rá,
tipikusan shell script-ekkel megoldható problémák. Amikkel ugye az a
baj, hogy nem platformfüggetlenek, persze van pár jó Windows port,
Cygwin pl., melyet aktívan használok. Valamint, ami ehhez is
kapcsolódik, hogy bizonyos feladatok megoldásában nagyon lassúnak
találom a Java fejlesztési ciklusát, kódolás - fordítás - futtatás,
gyakran az effektív munkától veszi el a kapacitásokat, legrosszabb
tapasztalatom ezen belül is a portál keretrendszerekkel való fejlesztés
bizonyult, ahol több perc kellett a keretrendszer elindításához.

Így adott is, hogy a script nyelvek közül választottam, méghozzá a
Python nyelvet. A nyelv fejlesztése 1989-ben kezdték el fejleszteni,
neve a Monty Python’s Flying Circus-ből ered. A nyelvet Guido van Rossum
alkotta azzal a céllal, hogy eszközt teremtsen olyanoknak, akik
érdeklődnek a programozás iránt, és jó eszközt biztosítson olyanoknak,
akik szeretnek és tudnak programozni. Engem az ragadott meg, hogy egy
Python script ránézésre megérthető, annyira tiszta a szintaxisa, olyan
érzésem volt a nyelvvel való ismerkedés közben, hogyha én nyelvet
alkotnék, én is mindent így csinálnék. (Szemben mondjuk egy Perl
programmal.)

A Python általános célú nyelv, interpretált, interaktív, platform
független és ingyenes. Nem szükséges objektum orientáltan programozni,
de megvan rá a lehetőség, támogatja a többszörös öröklődést, és az
operátor overloading-ot.

Mivel oktatok olyan szemmel is néztem, hogy milyen gyorsan tanulható, és
mennyire alkalmas oktatásra. Be kell valljam, sokkal alkalmasabb, mint a
Java. Mivel a program struktúrája a behúzáson alapul (igen!), az ifjú
fejlesztőket rászoktatja a formázásra, és nagyon könnyen össze tudják
kötni a formátumot a struktúrával. Java-ban gyakran látom, hogy küzdenek
a szintaktikával, közben nincs idejük a kódot formázni (bár ebben az IDE
is segít), és szétesik nekik. Valamint aki oktatott már Java-t, és a
változó deklaráció oktatásánál megkérdezi a hallgató, hogy mi az a
public static void main, és miért kell kiírni, az tudja, mire gondolok.

A könnyű megértést az is bizonyítja, hogy egy projektben dokumentum
generálásra vezettem be, és anélkül, hogy még bárkinek is részleteztem
volna, másnapra többen lemásolták és adaptálták a megfelelő script-eket
kizárólag a script és a Google alapján, és mindenkinek tetszett
alapvetően.

Gyakran kell fájlokon matató segédprogramokat írnom, pl. napló
állományok elemzésére, amire sosem találtam általános eszközt, a
grep/sed párosításból kell általában kihoznom a megoldásokat. Ahhoz,
hogy Java-val nyúljunk a problémához, ahhoz egyrészt osztályt, main
metódust kell deklarálnunk, majd jön a rémálom, a Stream-ek, Reader-ek
használata, ami ugyan koncepció szinten nagyon szép, a decorator design
pattern egy remek megvalósítása, de gyakorlatban sajnos használhatatlan.
Szóval jó, ha egyszerűen lehet állományokat kezelni.

Ugyanúgy ilyen jellegű tool-oknál nem hátrány, ha nem kell objektum
orientáltan fejleszteni, valamint nem baj, hogy dinamikus típusú, azaz
nem kell előre definiálni a típusokat. Nem kell memóriát foglalgatnunk,
felszabadítanunk, automatikusan kezeli az erőforrásokat. Nyelvi szinten
támogatja a listákat, szótárakat, ami szintén tömör és jól olvasható
kódot eredményez. Hibakezelése kivételkezelésen alapszik, mely szintén a
kód tisztaságán segít, hiszen tisztán elválik a hibaág. Azért mégsem
enged mindent, erős típusosság jellemzi.

Dinamikus, azaz Python kifejezéseket és utasításokat ki lehet
értékeltetni. Ortogonális, azaz kevés fogalommal nagy számú konstrukció
írható le, melytől szintén a tanulási görbe lesz meredekebb. Reflektív,
azaz futásidőben lehet az osztályokon matatni és introspektív, azaz
számos eszköz, mint a debugger és a profiler is, Pythonban implementált.

A Python abban hasonlít a Java-hoz hogy hatalmas osztálykönyvtár adott
hozzá, csak néhány a sok közül: regexp, diff, io, objektum
szerializáció, tömörítés, CSV feldolgozás, hash függvények és
kriptográfiai funkciók, naplózás, többszálúság, hálózatkezelés és
internetes protokollok (socket, ssl, e-mail, json, http kliens és
szerver, ftp), formátumok (xml, html), I18N, GUI, stb.

Néhány kódrészlet, futtatható, ha bemásolod egy állományba és `python
[fájlnév.py]`:

{% highlight python %}
# Hello World
print "Hello World"

# Listán iterálás
for t in ["a", "b"]:
 print t

# Egy állományban a # karakterrel kezdődő sorok eltávolítása
import fileinput, re

for s in fileinput.input(inplace = 1):
   print re.sub("#.*", "", s),

# Két változó értékének megcserélése
a, b = b, a

# Állomány tartalmának kiírása
f = open("file.txt")
print (f.read())

# Függvény dokumentációjának definiálása és kiírása
def add(a, b):
 "Két szám összeadása"
 return a + b

print add.__doc__

# Egy weboldal letöltése, és a linkek kigyűjtése
import httplib, re

conn = httplib.HTTPConnection("jtechlog.blogspot.com")
conn.request("GET", "/")
r = conn.getresponse()
d = r.read()
for l in re.findall("<a href=\"([^\"]+)\"", d):
 print l

# coding=UTF-8

print "árvíztűrő tükörfúrógép".decode("UTF-8")

# XML beolvasása
import xml.dom.minidom

document = """
<books>
<book title="Beginning Python From Novice to Professional" />
</books>
"""
dom = xml.dom.minidom.parseString(document)
for book in dom.getElementsByTagName("book"):
 print book.getAttribute("title")
{% endhighlight %}

Ha kedvet kaptál, lájkolj!

Azért nem szabad letagadni, hogy azért álltam egyből pozitívan a
nyelvhez, mert létezik a Jython, ami egy JVM-en futó Python
implementáció, gyakorlatilag Java bytekódot állít elő. Emiatt azonban
könnyen integrálható a Java-hoz, minden Java könyvtárat tudunk
Python-ból is használni.

Nézzünk is egy példát, méghozzá a QDox Java 3rd party library-t, mely a
Java forráskódot tudja elemezni, és API-t biztosít annak bejárására. Egy
könyvtárban lévő forráskódok beolvasása, majd az osztályok és azok
metódusainak bejárása a következőképp történik Java-ban:

{% highlight java %}
import com.thoughtworks.qdox.*;
import com.thoughtworks.qdox.model.*;
import java.io.File;

public class QDoxSample {

public static void main(String args[]) {
 JavaDocBuilder builder = new JavaDocBuilder();
 builder.addSourceTree(new File(args[0]));
 for (JavaClass clazz: builder.getClasses()) {
   System.out.println("Class: " + clazz.getName());
   for (JavaMethod method: clazz.getMethods()) {
     System.out.println("Method: " + method.getName());
   }
 }
}

}
{% endhighlight %}

Ugyanez Pythonban (Jythonban), figyeljük, milyen elegánsan történik a
külső függőség használata:

{% highlight python %}
import sys

sys.path.append("qdox-1.12.jar")

from com.thoughtworks.qdox import JavaDocBuilder
from java.io import File

builder = JavaDocBuilder()
builder.addSourceTree(File(sys.argv[1]))
for clazz in builder.getClasses():
  print "Class: " + clazz.getName()
  for method in clazz.getMethods():
    print "Method: " + method.getName()
{% endhighlight %}

Mivel nem kell mindig fordítgatnunk, hanem azonnal futtatható a
scriptünk, tényleg gyorsabb lehet a fejlesztés. Pont emiatt, ha valamit
gyorsan ki kell próbálni Java-ban, akkor is a Jython-t veszem elő, és
nem egy Java-s IDE-t.

A Python azért is lehet ismerős, mert a Google a [Google App Engine-t
Pythonban](https://cloud.google.com/appengine/docs/python/)
és Javaban bocsájtja rendelkezésünkre. Ahhoz, hogy elkezdjünk
fejleszteni, le kell tölteni a [Google App Engine SDK for
Python](https://cloud.google.com/appengine/downloads)
környezetet. Hozzunk létre egy állományt, mely kiírja standard kimenetre
a szokásos üdvözlő szöveget.

print 'Content-Type: text/plain' print '' print 'Hello, world!'

Ezt az SDK majd HTTP kérésre fogja meghívni, és a kimenetet HTTP
válaszba írja vissza. Ehhez konfigurálnunk kell, hogy az összes HTTP
kérést ez a script szolgálja ki:

    application: helloworld
    version: 1
    runtime: python
    api_version: 1

    handlers:
    - url: /.*
    script: helloworld.py

Ha elindítjuk az SDK-t, akkor a menüből a File/Add Existing
Application-re kattintva válasszuk ki a script-et és a konfigurációs
állományt tartalmazó könyvtárat. Az alkalmazást kiválasztva, a script-et
a http://localhost:8080 címen ki is próbálhatjuk. Ha fel akarjuk tölteni
a felhőbe, akkor az [App Engine Administration
Console-on](https://appengine.google.com/) létre kell hozni egy
alkalmazást, adni neki egy nevet, melyet az előbbi konfig állományban is
át kell írni. Az SDK-ban a Deploy gombot megnyomva máris próbálhatjuk az
alkalmazásunkat a http://\[alkalmazás neve\].appspot.com címen.

<a href="/artifacts/posts/2011-06-14-masodik-nyelv-python/google-app-engine-python-sdk_b.png" data-lightbox="post-images">![Google App Engine](/artifacts/posts/2011-06-14-masodik-nyelv-python/google-app-engine-python-sdk.png)</a>

Ugyanilyen egyszerű az ütemezés, valamint a hozzáférés a Datastore-hoz,
Memcache-hez, stb.

Ne értsetek félre, a Java továbbra is az elsődleges nyelv és platform,
melyet használok, és javaslok, de a Python remek kiegészítő tud lenni a
mindennapi munkában, hiszen általános célú nyelv, és bizonyos
feladatokat könnyebben és gyorsabban lehet megvalósítani.

Ti mit használtok Java-n kívül önszántatokból, és nem kötelező
jelleggel, és miért?
