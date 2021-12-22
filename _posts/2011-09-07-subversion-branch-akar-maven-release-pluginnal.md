---
layout: post
title: Subversion branch, akár Maven Release pluginnal
date: '2011-09-07T02:02:00.002+02:00'
author: István Viczián
tags:
- Subversion
- Módszertan
- Maven
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Technológiák: Subversion 1.6, Maven 3.0.3, Maven Release Plugin 2.0

Amennyiben mégis amellett döntünk, hogy branch-elni (, és ennek
következtében merge-ölni is) fogunk, rengeteg szempontot kell figyelembe
venni. Hogyan működik a branch-elés, milyen szabályokat kell és milyen
best practice-eket érdemes betartani, hogyan illeszkedik a fejlesztési
munkafolyamatba, stb. Bár sok helyen használják, kevés helyen láttam
ezek használatát kellően (teljes körűen) leszabályozva, dokumentálva, és
bevetve. Nincsenek konvenciók, nem egységes a használata, nehéz
beszerezni az információt, hogy honnan kell leágazni, kallódó, már senki
által nem karbantartott és ismert branch-ek vannak. Ez a poszt ismerteti
az alapfogalmakat, a Subversion lehetőségeit, valamint hogyan
illeszthető a branch-elés a Mavenes munkafolyamatainkba, és milyen
problémába ütközhetünk, és oldhatjuk meg. Ez a poszt előkészíti azt a
posztot, ami abban próbál majd segíteni, hogy felállítsunk egy
szabályrendszert, megpróbál rávilágítani a lehetőségekre,
előnyeikre/hátrányaikra, hogy miket kell szem előtt tartani, hogy a
fejlesztési munkafolyamatunkat tökéletesítsük, gyakorlatilag legjobb 
gyakorlatokat ad.

Mivel azt látom, hogy jelenleg a Subversion a legelterjedtebb
verziókezelő rendszer, így erről fogok írni. Bizonyos dolgok mások,
bizonyos dolgok egyszerűbbek elosztott verziókezelő rendszer (pl. Git,
Mercurial, stb.) esetén. Abban bízom, hogy az itt (, de inkább a
következő posztban) leírt dolgok egy része azért ott is felhasználható.

Bár Subversion parancsokat parancssorból kiadni menő, azért néha szóba
hozom a [TortoiseSVN](http://tortoisesvn.tigris.org/) klienst is, ami
azon szinte megbocsájthatatlan hibáján kívül, hogy a Windows Explorerbe
épül, az egyik legjobb kliens. Próbáltam Subversiont használni mind
NetBeans, mind Eclipse IDE-kből is, de valahogy mindig csak bajom volt
vele, sokszor a galibát csak TortoiseSVN-nel tudtam rendbetenni.

A branch nem más, mint egy új fejlesztési ág, mely már független attól,
melyből kinőtt, mégis közös a történelmük. A Subversionben a branch (és
a tag) létrehozása is egy egyszerű másolás (copy), ebben rejlik az
egyszerűsége. A mantra, amit mondogathatunk magunkba, hogy a branch-elés
(technikailag) nem költséges. Nem lesz tőle nagyobb a repository, nem
fog belassulni, stb. Unix hasonlattal élve, valójában egy hard link
létrehozásának felel meg. Azért olcsó csak technikailag, mert az
erőforrásigény csak a fejlesztési munkafolyamatba illesztésnél, projekt
adminisztrációnál, és a rettegett merge-nél fog megjelenni.

A branch és merge az 1.5-ös Subversion előtt nagyon problémás. Ennek
használatát mindenképp el kell kerülni, érdemes a legfrissebb, 1.6-os
verzióval dolgozni, mind szerver, mind kliens oldalon. (Annak
megakadályozására, hogy 1.5 előtti klienssel használjuk a Subversion
szervert, ezzel veszélyeztetve a merge-höz szükséges adatokat, egy
commit hook is telepíthető.) Az 1.5-ös verzióban jelent meg ugyanis a
mergeinfo, mely nagyon hasznos a merge-ök nyomon követésénél. Az
`svn:mergeinfo` gyakorlatilag egy közönséges property. Bár lehetőség van
rá, lehet kézzel is szerkeszteni, de ez meglehetősen ellenjavalt,
hagyjuk a kezelését a merge parancsra.

A témában az egyik legjobb olvasmány a [Version Control with
Subversion](http://svnbook.red-bean.com/) könyv, mely ingyenesen
elérhető. Ez a changeset elnevezést használja, és már az elején
definiálja is, ugyanis sokféleképpen szokták ezt a fogalmat használni. A
könyv terminológiájában a changeset az változások halmaza (ahol a
változás lehet egy állományban történt változás, de akár egy állomány
törlése, vagy átmozgatása is), mely egy nevet kap. Subversionben minden
commit egy külön azonosítót kap (revision), ami gyakorlatilag szintén
egy changeset, de implicit névvel, hiszen a verziókövető rendszer adja.
A merge legkisebb egysége a changeset.

A klasszikus használati mód a következő. Elindul a fejlesztés a
fősodron, és kiderül, hogy szükség van egy branch-re. Ekkor az `svn copy` 
használatával (másolással) gyakorlatilag létrehozzuk az új ágat. Mivel a
főágon is folyik a fejlesztés, ezt bizonyos időközönként át kell hozni a
módosításokat. Ezt már a `merge` paranccsal tudjuk elvégezni. A Subversion
automatikusan karbantartja a `mergeinfo` property-t is, amibe bekerül,
hogy mely revisionök kerültek már át. Tehát egy újabb merge esetén
tudja, hogy mik kerültek már át, és amelyek nem, azokat a módosításokat
gyakorlatilag lejátssza az új ágon is. Az állományokat lokálisan
módosítja, szóval itt lehet fordítani, tesztelni, és ha minden helyes,
akkor lehet commitolni. Amennyiben vissza akarjuk a branch-ben történt
módosításokat vezetni a főágra, először mindenképpen ellenőrizzük, hogy
a főág módosításai átkerültek-e, majd a `merge`-öt a `--reintegrate`
kapcsolóval kell kiadni. Itt a működés teljesen más, ezért kell a
`--reintegrate` kapcsolót használni, ugyanis a branch-en találhatók saját
fejlesztések, valamint a főágon történt merge-ök is. Ennek a kapcsolónak
a használatával valójában összehasonlítja a két ágat, és a különbséget
próbálja a főágra rájátszani. (A merge kiadható a `--dry-run` kapcsolóval
is, ekkor nem módosulnak az állományok, csak egy áttekintést kapunk,
hogy mely állományok hogyan módosulnának.) Ha ez megvan, akkor ezt is
lehet commitolni, majd az új ágat törölni lehet.

Ez a klasszikus eset, azonban fejlesztés közben ez nagyon ritkán ilyen
egyszerű. Először is sokszor van conflict. Ez az, mikor a két ágon olyan
változás történik, ami látszólag ellentmond egymásnak. A Subversion
amúgy is híresen rosszul kezeli ezeket az elosztott verziókezelőkhöz
képest. És ráadásul még ott van az előző
[posztban](/2011/08/08/branch-eljunk-e-vagy-sem.html) említett
szemantikus ütközés is, amikor fordulni fordul ugyan a módosított
projekt, azonban nem fog helyesen működni.

Különösen átnevezésekkel van gond. Ugyanis a Subversion átnevezése
effektív egy copy, majd egy delete, és nem őrzi meg az információt, hogy
ez valójában egy átnevezés volt. Képzeljük el, hogy egy külön ágon
javítunk egy állományon, míg a főágon egy mozgatást hajtunk végre. Mikor
ezt a külön ágra akarjuk merge-ölni, az eredeti állományt letörli, és az
újat hozzáadja. Csak közben elveszik a külön ágon történt javítás. A
könyv szerint, amíg ezen nem javítanak, óvatosan merge-öljünk
átnevezést.

Amúgy a könyv a merge parancsra azt mondja, hogy jobb lenne
diff-and-apply-nak hívni, mert semmi bűvészkedés nincs a háttérben, a
merge összehasonít két ágat, és a különbséget a working copy-ra
alkalmazza.

Ezen eszközökkel haladóbb feladatokat is el tudunk végezni. Pl. ha egy
revisionben hibás kódot commitoltunk, vissza tudjuk ezt vonni,
méghozzá a reverse merge használatával (`-c` kapcsolóval). Persze a
history-ban megmarad, de legalább automatikusan megtörténik az "undo"
művelet. Ez TortoiseSVN-ben is megtalálható, bár nem utal a reverse
merge-re: Revert changes from this revision menüpont. Ebben az esetben
nem keletkezik vagy módosul a mergeinfo.

Törölt elemet is vissza lehet állítani a merge-gel, azonban javasolt
inkább a `copy` parancs használata, hiszen ha egy revision-ben más is
történt a törlésen kívül, akkor az is visszajátszásra kerül, míg a `copy`
esetén kedvünkre tudunk válogatni.

A cherrypicking szintén egy haladó fogalom, magyar fordításban
mazsolázásnak, csemegézésnek, szemezgetésnek lehetne fordítani. 
Verziókezelés terén ez gyakorlatilag
azt jelenti, hogy én egyenként kiválogatom, hogy milyen módosításokat
szeretnék merge-ölni az egyik ágról a másik ágra. Ez Subversion esetén
annyit tesz, hogy egy vagy több revisionre tudom megmondani, hogy annak
a módosításaival történjen a merge (elég bonyolult feltételeket,
intervallumokat fogalmazhatok meg). Ez különösen fontos akkor, ha a
másik ágon folyik egy hosszabb fejlesztés, de közben egy bugot is
kijavítottak, amit érdemes áthozni az én ágamba is. Persze ez is
eltárolásra kerül a mergeinfoban, így ha később az ágban lévő többi
módosítást is merge-ölni akarjuk, akkor ezt a revisiont automatikusan
átugorja. Itt azonban lehet egy probléma, méghozzá egy revision
intervallum közepén lévő merge két intervallumra bontja a módosításokat.
Ha ez elsőben elhal a merge conflicttal, és elhalasztjuk a conflict
feloldását, a teljes merge elhal. Ez lehet, hogy későbbi Subversion
verziókban javítják, de addigis két részletben kell ilyenkor
merge-ölnünk.

Egy kicsit bővebben a mergeinforól. Egy normál merge esetén létrejön
vagy módosul ez a property, azonban vannak esetek, mikor mégsem. Ez
lehet akkor, ha a forrás és cél URL nincs egymással kapcsolatban, azaz
nincs közös history-juk. Ugyanez van akkor is, ha másik repository-ból
merge-ölünk. A mergeinfo-t a TortoiseSVN-nel a Properties menüponttal
tudjuk megnézni, nincs rá külön menüpont, hiszen standard property. Ezt
amúgy az Subversion explicit mergeinfonak nevez. Az implicit mergeinfo
nem más, mint a közös history. Ez annyit jelent, ha a közös history-ban
lévő módosítást akarunk merge-ölni, akkor a Subversion tudja, hogy
semmit nem kell tennie, hisz a közös history miatt a módosítás mindkét
ágon benne van.

A merge tehát figyelembe veszi a history-t. Képzeljünk el egy esetet,
ahol az egyik ágon törlünk egy állományt, commit, majd újra hozzáadjuk,
és commit. Ebben az esetben az első és második módosításban szereplő
állományoknak nincs közös history-ja. Ekkor a merge is törölni, majd
hozzáadni fog. Abban az esetben, ha a `--ignore-ancestry` kapcsolót
használjuk, a history-t nem veszi figyelembe a merge, úgy működik, mint
egy szimpla diff. Ekkor sem keletkezik vagy módosul a mergeinfo.

Ha megvizsgáljuk a merge parancsot, három paramétert lehet átadni.
Initial repository tree, hasonlítás jobb oldalának is hívják. A final
repository tree, a hasonlítás bal oldalának is hívják. A working copy,
ahova az összehasonlítás eredményeként előállt diff rá lesz módosítva.
Ezzel a paraméterezéssel nagyon vigyázzunk, hisz olyan tree-ket is
megadhatunk, aminek semmi köze nincs egymáshoz, ennek az eredménye nagy
kavarodás lehet. A könyv még azt is javasolja, hogy a merge-öt mindig a
branch főkönyvtárán hajtsuk végre, ne alkönyvtárakon.

A TortoiseSVN ezt úgy oldja meg, hogy mikor merge-ölni akarunk,
megkérdezi, hogy mit szeretnénk.

-   Merge a range of revisions
-   Reintegrate a branch
-   Merge two different trees

Ez alapján a fenti paraméterezések helyett csak nekünk kell
választanunk, hogy melyiket szeretnénk.

Mint később látni fogjuk, a `--record-only` kapcsoló nagyon hasznos lehet.
Ezzel ugyanis egy változásra azt mondhatjuk, hogy nem akarjuk, hogy a
merge figyelembe vegye. Gyakorlatilag ekkor az történik, hogy a
mergeinfo módosul, mintha a kiválasztott módosítás már be lenne
merge-ölve (konkrétan behazudjuk a merge-t). Ezért a következő merge ezt
ki fogja hagyni.

Ha branch-ekkel dolgozunk, hasznos lehet a `switch` parancs használata,
mellyel a working copy-t tudjuk update-elni egy másik URL-re. Azaz
megadunk egy másik branch-et, és a working copy-nk átáll arra. Pl. jól
jöhet akkor, ha fejlesztünk, és rájövünk, hogy ez akkora módosítás, hogy
érdemes lenne branch-be tenni. Akkor létrehozzuk a branch-et,
át-switch-elünk rá, majd oda történhet a commit. Mivel ez alkönyvtárra
is működik, tudunk ún. mixed working copy-t is csinálni, ahol az egyik
könyvtár az egyik branch-et, a másik könyvtár a másik branch-et
tartalmazza. Ezzel egyrészt nagyon vagány dolgokat is meg lehet
csinálni, viszont rettenetesen be tud kavarni egy merge esetén.
Javaslom, hogy kerüljük ilyenkor a mixed working copy használatát, azaz
olyan working copy-val dolgozzunk, melynek minden eleme ugyanahhoz az
időpontbeli állapothoz tartozik.

A tag létrehozása nem sokban különbözik a branch-től, hiszen itt is egy
másolás történik, valójában egy pillanatnyi állapot (snapshot), mely egy
egyedi nevet kap. A revision is egy ilyen snapshot, azonban számmal
azonosított. Konvenció szerint a projekt alá érdemes létrehozni a `trunk`,
`tags` és `branches` könyvtárat, tartalmuk értelemszerű. A TortoiseSVN szól
is, ha a `tags`-be akarunk commit-olni. Ezt ugyan lehet, hiszen a
Subversion nem különbözteti meg a tag és branch fogalmát, azonban mégis
jó, ha betartjuk a konvenciókat.

Ezen ismeretekkel már meg lehet valósítani az előző
[posztban](/2011/08/08/branch-eljunk-e-vagy-sem.html) említett feature
és release branch-eket.

A könyv megemlíti a vendor branches fogalmát is. Ezt akkor
használhatjuk, ha egy 3rd party library-t patch-elünk, de szeretnénk
mindig a módosításokat rávezetni, de a mi módosításunkat nem akarjuk
kiadni (persze, ha a licence engedi). Ekkor importáljuk saját
repository-ba a 3rd party library-t. Módosítjuk. Amint a 3rd party
library-ból kijön egy következő verzió, merge-el vezetjük rá a
változásokat, annak a repositry-jából. Így egyrészt a saját
módosításaink is megmaradnak, valamint a verziókat is tudjuk emelni.

Ahhoz azonban, hogy a post-nak valami köze legyen a Java-hoz is,
belekeverem a Mavent is, pontosabban annak [Release
Plugin](http://maven.apache.org/maven-release/maven-release-plugin/)-ját,
ami ugyanis a [`release:branch` céllal (goal)](http://maven.apache.org/maven-release/maven-release-plugin/branch-mojo.html)
remekül tud branch-elni is, nem csak release-elni, mint egy [előző
posztban írtam](/2010/10/24/release-mavennel-es-hudsonnel.html). Ez a
cél igen jól paraméterezhető, de az alapbeállításokkal is el lehet
boldogulni. A kötelező paramétere a `branchName`, amivel a branch nevét
kell megadni. Amennyiben ezt nem adjuk meg, a következő hibaüzenetet
kapjuk:

    [ERROR] Failed to execute goal org.apache.maven.plugins:maven-release-plugin:2.0:branch (default-cli) on project acltuto
    rial: The parameters 'branchName' for goal org.apache.maven.plugins:maven-release-plugin:2.0:branch are missing or inval
    id -> [Help 1]

Adjuk meg tehát a branch nevét! Tartsuk észben, hogy ezzel a
paraméterezéssel létrejön egy branch (copy a branch-es könyvtárba),
melyben lévő projekt az aktuális verziószámot fogja tartalmazni, és a
working copy verziószáma fog emelkedni.

```shell
mvn release:branch -DbranchName=my-branch
```

A következő dolgok fognak megtörténni. A paraméterek alapértelmezettek,
azaz `updateBranchVersions=false`, `updateWorkingCopyVersions=true`.

1.  Megvizsgálja, hogy nincs-e lokális módosítás, mely nem lett
    commitolva. Ha van, hibaüzenettel leáll (Cannot prepare the release
    because you have local modifications).
2.  Megkérdezi, hogy mi legyen a working copy új verziószáma. (Persze
    ezt parancssorban is meg lehet adni, ha nem interaktív módot
    akarunk.)
3.  Módosítja a `pom.xml`-ben az scm helyét, hogy a branch-re mutasson.
4.  Commitolja a `pom.xml`-t. A commit comment szövege:
    `[maven-release-plugin] prepare branch my-branch`
5.  Végrehajtja a branch-et. A commit comment szövege:
    `[maven-release-plugin] copy for branch my-branch`
6.  Megemeli a `pom.xml`-ben a verziószámot, és visszaállítja a scm
    helyét.
7.  Commitolja a `pom.xml`-t. A commit szövege: `[maven-release-plugin] prepare release my-branch`

Amennyiben azonban azt akarjuk, hogy a branch-ünk verziószáma ugorjon,
viszont a working copy verziószáma maradjon, a következő parancsot adjuk
ki:

```shell
mvn release:branch -DbranchName=my-branch -DupdateBranchVersions=true -DupdateWorkingCopyVersions=false
```

Ekkor a folyamat hasonló, mint az előbb, csak a working copy új
verziószáma helyett a branch verziószámát kéri be a 2. lépéseben, és a
`pom.xml`-ben is átírja a verziószámot. Ebben az esetben a 6. lépésben nem
emel verziószámot, csak az scm helyét állítja vissza.

Meg lehet adni azt is, hogy mindkét verziószám változzon, mindkét
property igazra állításával.

És valójában itt jön a feketeleves. Amennyiben van két fejlesztési
águnk, és mindkettőn folyamatosan fejlesztünk, és adjuk ki a verziókat,
mindkét ágon a release során változnak a `pom.xml`-ek, kizárólag az scm
url-ek és a verziószámok. Amennyiben merge-ölni akarunk, a `pom.xml`-ek
conflict-olni fognak, hiszen külön vezettük a verziószámokat mindkét
ágon. Ez a conflict azonban a fejlesztési munkafolyamatunkba nem illik
bele, hiszen nem akarunk `pom.xml`-ekben verziószámot szerkesztgetni, az
kizárólag release során a release plugin feladata. Azaz ennek a
merge-nek úgy kell lefutnia, hogy a `pom.xml`-ekben a verziószám
változásokat ne vegye figyelembe.

Itt vethetjük be a Subversion `--record-only` kapcsolóját. Nem kell mást
csinálnunk, mint azokra a revision-ökre, melyekben a `pom.xml`-ben csak a
verziószám változott, lefuttatni a merge-öt a `--record-only` kapcsolóval.
Így gyakorlatilag becsapom a Subversiont, a mergeinfoba bekerül, hogy
ezen revisionök már merge-ölve lettek. És a következő merge-nél már nem
lesz conflict a `pom.xml`-re. Ettől függetlenül az olyan `pom.xml`
változások, melyek lényegi részt érintenek, és nem a csak a release
plugin által szerkesztett verziószámot, pl. dependency, stb.,
merge-ölésre kerülnek. Erre a problémára könnyű scriptet is írni,
hiszen a Release plugin mindig úgy commitol, hogy a commit message-be
szerepel a `[maven-release-plugin]` szó, valamint konfigurálhatunk saját
commit message-eket is, így ezekre lehet szűrni, és rájuk futtatni a
merge-öt `--record-only` kapcsolóval.
