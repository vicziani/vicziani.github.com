---
layout: post
title: Branch-eljünk-e vagy sem?
date: '2011-08-09T01:03:00.003+02:00'
author: István Viczián
tags:
- Módszertan
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Amíg a szoftverfejlesztés az elején tart, nem adtunk még ki verziót, a
folyamat legtöbb esetben lineáris, egy kódbázison dolgozunk, minden
fejlesztő ugyanazt látja. Bizonyos esetekben ez így is marad, és sorban
fejleszthetjük bele az adott funkciókat, adhatunk ki újabb verziókat.
Sajnos azonban ez a legtöbb esetben nem elegendő, így előbb-utóbb
szükség lehet eltérni a fősodortól, és párhuzamos fejlesztéseket
végezni, elágazunk, branch-et képzünk. Remélhetőleg a legtöbb helyen már
rendelkeznek valamilyen verziókezelő eszközzel, mely képes állományokat,
és ezek összességét véve a teljes projektet (forrás, erőforrás
állományok, script-ek, dokumentáció) hisztorikusan tárolni, ezzel
segítve a változások nyomon követését, ki, mikor, mit módosított. Sajnos
munkám során láttam olyan fejlesztőcsapatot, ahol még mindig megosztott
meghajtókon tárolják a projektet. A fejlesztési munkafolyamatot, a
branch-ek kezelését és a fejlesztők közötti kollaborációt pedig ezen
eszközök emelik egy magasabb szintre.

A fő fejlesztési sodor a mainline, melyen a fő fejlesztés történik.
Branch-re több esetben is szükség lehet. A klasszikus példa, mikor
kiadjuk az 1.0 verziót, elkezdjük a 2.0-ás verzió fejlesztését, és
közben derül ki, hogy az 1.0-ás verzióban hibák vannak, melyre az ügyfél
azonnali javítást vár, és nem várja meg a 2.0-ás verzió kifejlesztését.
Ekkor elágazhatunk az 1.0-ás verziónál, és létrehozhatunk egy külön
branch-et az 1.1-es verziónak, mely a hibajavítást fogja tartalmazni. A
példán máris látszik, hogy később szükséges lesz a hibajavítás
visszavezetése a 2.0-ás verzióba is. Ez a merge, mely során az egyik
branch módosításait kell átvezetni egy másik branch-be, jelen esetben a
mainline-ba. A jelenlegi eszközök a branch-ek elkészítését nagymértékben
támogatják, általában egy parancs, azonban a merge már sokkal
problematikusabb művelet.

Az előbbi használati eseten (, amit nevezzünk bug-fix branch-nek) kívül
is szükség lehet branch-ek használatára. Mostanában egyre divatosabb a
feature branch-ek és release branch-ek használata, a branch-ek
nagymértékű elszaporodása. A feature branch esetén a fejlesztők minden
egyes szoftver funkciót (feature, de nevezik story-nak is) külön ágon
fejlesztenek. Ezen funkciók lehetőleg legyenek egy jól körülhatárolható
és azonosítható egységek, pl. bugtracker issue-k, de láttam már olyant
is, hogy mivel ezek túl kis egységek voltak (granularitás), ezeket
összefogták nagyobb egységekbe. (Direkt nem nevezném külön verziónak,
később kiderül, miért.) Egy feature branch-en egy vagy több fejlesztő is
dolgozhat. Amíg a funkció el nem készül, a fejlesztés ezen a branch-en
folyik, és párhuzamosan mellette más feature branch-eket is lehet
fejleszteni. Amikor egy feature branch elkészül, ez visszavezetésre
kerülhet a fősodorba, és kiadható.

Ez az elmélet, de a használat során felmerülnek kérdések. Egyrészt miért
is hasznos, miért nem a fősodorban történik a fejlesztés? A feature
branch használatával ugyanis egy adott időpillanatban választhatunk,
hogy mely funkciók állnak készen, melyikeket lehet kiadni. Ez a
klasszikus szoftverfejlesztéssel, ahol is előre kitűzzük a
verziószámokat, és hogy abban milyen funkciók lesznek elérhetőek (,
maximum kicsit sakkozunk közöttük) teljesen ellentétes, hiszen itt a
következő verzió azokat a fejlesztéseket fogja tartalmazni, amik készen
vannak. A funkciók ilyen szintű összeválogatását nevezzük
cherry-picking-nek. Ezért nem kell a branch létrehozását verzióhoz
kötni. Sok helyen történik ilyen típusú fejlesztés, általában ott, ahol
bizonyos okok miatt (politikai indokok, megrendelői bizonytalanság,
fejlesztőcsapat képzettsége, stb.) a funkciók kifejlesztésének
erőforrásigénye nem kalkulálható, vagy a különböző funkciók szintén
ugyanilyen okokra visszavezethetően előzgethetik egymást (pl. épp melyik
osztály az erősebb a megrendelőnél). A funkciók külön ágon készülnek,
egymást nem zavarják, bármikor bármelyiket be lehet hozni. A probléma
természetesen itt is az lesz, hogy mi van akkor, ha két branch
módosításait kell összevezetni. Ilyenkor ismét merge-ölni kell.

Abban az esetben, ha több feature branch-et szeretnénk egy release-be
összevonni, akkor az integráció, a merge akár hosszabb folyamat is
lehet. Ilyenkor az integrációval akár meg is akaszthatjuk a fő
fejlesztést, ha azt a mainline-on végezzük. Ilyenkor szokták bevetni a
release branch fogalmát. A release branch-en történik a merge, valamint
történhet a tesztek, akár QA tesztek elvégzése is. És amikor ez
sikeresen befejeződik, csak ekkor kerülnek vissza a módosítások a
mainline-ba. Ezzel a fősodorban mindig az aktuálisan működő, kitesztelt
verziónk lesz, melyből biztonságosan le lehet ágazni, és nem kell
kérdezni, hogy egy új fejlesztés (branch nyitása) most honnan történjen.

Ez a fejlesztési folyamat elsőre tökéletesnek tűnhet, de az ördög a
részletekben lakozik. Jelen esetben a merge-ben. Amennyiben mindkét ágon
módosítás történik, akkor ütközés léphet fel (conflict). Ez szöveges
állomány esetén, ha külön sorokban történt a módosítás, egész könnyen,
automatikusan kezelhető. Ellenkező esetben humán beavatkozás szükséges.
A kezdeti verziókezelők viszont már azt sem tudták kezelni, ha az egyik
ágon egy állományban módosítás, a másik ágon ugyanazon állománynak az
átnevezése történt. Szerencsére a modern verziókezelőknek ez már nem
jelent problémát, hiszen a merge során felhasználják azt az információt
is, hogy átnevezés történt. A probléma [Martin
Fowler](http://martinfowler.com/) által elnevezett [szemantikai
ütközéssel](http://martinfowler.com/bliki/SemanticConflict.html) van.
Mivel ő a refactoring atyja, ilyen példával a legkönnyebb magyarázni. Az
egyik ágon egy refactoring, egy metódus átnevezés történik, a másik ágon
meg bevezetésre kerül újabb metódushívás még a régi névvel. A merge
során azonnal conflict történik, hiszen a második branch-ben még a régi
névvel történik metódushívás. Ezt az eszközök képtelenek feloldani, mert
ugyan az állomány átnevezést tudják kezelni, de az ilyen mély, nyelvi
szintű refactoring-ot nem. (Vajon elgondolkodott már valaki olyan
verziókezelőn, mely egy speciális programozási nyelvre lenne
kifejlesztve, és érzékelné a struktúrális változásokat?) A legrosszabb
az olyan conflict és annak feloldása, ami során ugyan a forráskód
lefordul, de a szoftver nem az elvártnak megfelelően működik

Fowler nagy híve a Test Driven Development-nek, így az utóbbira az
azonnali válasza, hogy minél több teszt esetet írjunk, mely során
kijönnek a szemantikai ütközések. Valamint még egy, a bug-fix
branch-eken kívül ne használjunk branch-eket, azaz az egész eddigi
okfejtést negálja.

Erre találta ki ugyanis a [continuous
integration](http://martinfowler.com/articles/continuousIntegration.html)
fogalmát, mely az Extreme Programming egyik alapelve is. Egy dolgot
szeretnék ezzel kapcsolatban mindenekelőtt tisztázni. Azért, mert a
fejlesztési folyamatunkban van CI eszköz (pl. a legelterjedtebb
Hudson/Jenkins), még nem használunk CI-t. Láttam több helyen olyant,
hogy minden egyes branch-re rá volt fűzve a CI, ami a branch-eket
build-elgette. Ez nem CI, a CI tagadja a branch-ek használatát, így nem
barátja a [feature
branching-nek](http://martinfowler.com/bliki/FeatureBranch.html) sem!
Fowler ezt continuous building-nek nevezi, ami ugyan jó dolog, de
szerinte nem elegendő.

A continuous integration gyakorlatilag arra épít, hogy a fejlesztési
folyamatban az egyik legfájóbb pont a merge. Ezt úgy próbálja
kiküszöbölni, hogy kizárólag a mainline-ban történik a fejlesztés, így
nincs szükség merge-ölésre. A mainline-nak mindig egy működő,
futtatható, tesztelhető állapotnak kell lennie, hogy ne akassza meg a
többiek munkáját. A fejlesztés során így a fejlesztők kötelesek azonnal
kommunikálni, hiszen nem vonulhatnak el külön kis branch-ükbe, hanem ha
olyan funkciókat fejlesztenek, melyek közös területeket érintenek,
azonnal össze kell dolgozniuk. A külön branch-ek esetén erre nincs
szükség, két teljesen különböző irányokba elmehetnek, és csak a conflict
során derül ki, hogy esetleg már az elején közösen kellett volna
dolgozniuk (nem tudta az egyik kéz, mit csinál a másik). A CI arra
ösztökéli a fejlesztőket, hogy minél gyakrabban tegyék vissza a saját
gépükről a változásokat a mainline-ba (minimum naponta egyszer),
megelőzve ezzel az ütközéseket, valamint kis, atomi egységekben
dolgozzanak. Szemben a branch-ek esetén, ahol igen nagy méretű
módosításokat kellhet összevezetni. A branch-ek használata esetén
megfigyelték, hogy a fejlesztők féltek a refactoring-tól, hiszen
leggyakrabban azok okoznak szemantikai ütközést. CI esetén a
refactoring-ot el lehet végezni, folyamatosan javítva ezzel a
kódminőséget.

Amennyiben a feature branch-ing esetén csökkenteni akarjuk a merge
veszélyét megtehetjük azt is, hogy merge-ölgetünk a branch-ek között.
Ezt Fowler promiscuous integration-nek nevezi, de ezt sem tartja jó
megoldásnak. Több branch esetén már problémás lehet, valamint nagy
adminisztrációs terhe van, hogy mi hova lett már merge-ölve (ezen az
eszközök kicsit enyhíthetnek).

Mi van akkor, ha az ügyfél mégis azt kéri, hogy kell neki egy olyan
verzió, ami nem tartalmaz olyan funkciókat, amiket mi már elkezdtünk
fejleszteni. A CI megoldása erre a [funkciók ki- és
bekapcsolása](http://martinfowler.com/bliki/FeatureToggle.html). Ugyanis
a branch-ek hiánya miatt nincs cherry-picking. Úgy fejlesszük le az új
funkciókat, hogy azok kikapcsolhatóak legyenek - például menüpont
eltüntetésével. (Azért azt ő sem tagadja, hogy ez több hibalehetőséget
is magában rejthet - pl. furcsa olyan teszt esetet írni, ami azt
ellenőrzi, hogy nincs-e valami plusz.)

A CI-nek több eleme is van (automatikus build, melynek időtartamát illik
10 perc alatt tartani, staged build/build pipeline, tesztelés,
deployment, CI eszköz, stb.), de a branch-elés szempontjából a posztban
említettek a kiemelendők.

Martin Fowler szerint a CI szinte mindenütt bevethető. Én ennél sokkal
óvatosabban fogalmaznék, szerintem mindkét megközelítésnek megvan a
megfelelő alkalmazási környezete. Mint sok mindenben, itt is a projekt
ismeretében lehet dönteni. Kevésbé képzett, kevésbé agilis
fejlesztőteam-ek, kevésbé rugalmas, vagy problémásabb megrendelő,
nagyobb projekt büdzsé esetében kellő körültekintéssel nem lehet
probléma a branch-ek használatával. Vigyázzunk, ezek ne szaporodjanak
el, kontrolláljuk őket, mert nem egy céget/fejlesztést láttam, ahol
annyira szétcsúsztak a branch-ek, hogy a fejlesztők nem látnak esélyt
arra, hogy valaha is merge-öljenek, pl. ügyfelenként külön branch-ük
van. A menedzsment meg nem biztosít erre erőforrást (idő/pénz), hiszen a
problémát sem érti. Vigyázzunk, hogy a branch-ek kellően rövid
élettartamúak legyenek, és szüntessük meg őket. A CI egy nagyon jó
irány, amennyiben kellően pörgős vagy kicsi a team, a projekt, sikerrel
alkalmazhatjuk. Mi saját fejlesztéseinkben a CI-t alkalmazzuk, de több
esetet láttam, ahol indokolt a branch-ek használata. Az alkalmazás
megfelelő modularizálásával szintén léphetünk egyet a CI felé, egy
monolitikus maradványrendszer megkövetelheti a branch-ek használatát. A
fejlesztők képzettsége nem biztos, hogy számottevő tényező, mert branch
esetén a merge-ben kell nagyon jónak lenni, CI esetén viszont úgy kell
fejleszteni, hogy véletlenül se tegyünk a mainline-ba olyan dolgot, ami
megakasztja a többi fejlesztőt. Mindkét esetben nagy odafigyeléssel
dolgozó, motivált és kommunikációra képes kollégákra van szükségünk.

A következő posztban arról fogok írni, hogyha a branch-elés mellett
döntünk, mire kell figyelni, milyen lehetőségeink vannak, milyen
eszközök támogatnak ebben.

Te milyen aktívan branch-elsz és miért?
