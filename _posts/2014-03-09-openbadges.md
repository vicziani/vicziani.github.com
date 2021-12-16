---
layout: post
title: OpenBadges
date: '2014-03-09T13:42:00.002-07:00'
author: István Viczián
tags:
- oktatás
modified_time: '2018-06-09T12:27:02.479-07:00'
---

### Bevezetés

Az ötlet alapvetően onnan indult ki, hogy hiszek a
[gamification](http://hu.wikipedia.org/wiki/Gamification)
létjogosultságában. Különösen abban, hogy az oktatásba vigyünk
valamiféle játékosságot.

A Mozilla ehhez egy remek kezdeményezést indított
[OpenBadges](http://openbadges.org/) néven, mely egy nyílt forráskódú
platform arra, hogy jelvényeket lehessen szerezni, és ezeket megosztani.
Gyakorlatilag az oktatást akarják azzal színesíteni, hogy ilyen
jelvényeket lehet gyűjteni, melyek hitelesek, és megosztani. Hiszen
manapság mindenki az oktatás megreformálásáról, annak digitális térbe
való átültetéséről, az
[MOOC-ről](http://en.wikipedia.org/wiki/Massive_open_online_course)
beszél, és nem véletlen az ilyen platformok, pl. a Coursera
népszerűsége.

![OpenBadges](/artifacts/posts/2014-03-09-openbadges/OpenBadges_Insignia_WeIssue.png)

### Hogyan működik?

Az elv nagyon egyszerű. Elvégzel egy tanfolyamot, az intézmény
rendszerében rögzítésre kerül, és tartalmaz pár adatot, mint a tanfolyam
neve, időpontja, résztvevő e-mail címe, stb. Ezután előállítja a
jelvényt. Ez nem más mint egy képállomány, és a hozzá tartozó adatok. A
legszebb az egészben, hogy az adatokat maga a képállomány digitális
formában képes tartalmazni. Ezt a jelvényt utána lehet továbbküldeni,
megosztani, publikálni. De erre egy hivatalos infrastruktúra is van, a
[Mozilla Backpack](http://backpack.openbadges.org/). Ide akár az
intézmény is felküldheti a jelvényeket, de kézzel is fel lehet őket
tölteni. Aztán a felhasználó csoportokba rendezheti, adminisztrálhatja a
jelvényeit, és dönthet arról, hogy ki melyiket láthatja. A jelvény
bármikor később visszaellenőrizhető.

![Mozilla Backpack](/artifacts/posts/2014-03-09-openbadges/backpack.png)

### Mi a technológia?

A kiállító (számára a dokumentáció [elérhető
itt](https://wiki.mozilla.org/Badges/Onboarding-Issuer)) egy JSON
fájlban leírja, hogy ki, mikor milyen jelvényt kapott, ez az ún.
assertion. Ugyanígy JSON formátumban le kell írni a tanfolyam
tulajdonságait és egy másikban a kiállító adatait. Ezek ellenőrzésére
van egy [online validator](http://validator.openbadges.org/) is. Az
assertionben meg kell adni egy még üres png állományt. Ezt a képet kell
összepárosítani az assertionnel mely kettő együtt a jelvény. Ezt a
Mozilla
[bakeringnek](https://github.com/mozilla/openbadges/wiki/Badge-Baking)
nevezi. Ekkor a png-be belekerül vagy az assertion url-je, vagy a teljes
JSON tartalom. Ezt megteheti a kiállító rendszere (több programozási
nyelven is elérhető hozzá API), de megteheti a Mozilla infrastruktúrája
is (REST API hívással). Ez úgy lehetséges, hogy a png egy nagyon szabad
formátum, bármit bele lehet kódolni. Amennyiben azonban kiállító egy
JavaScript állományt is elhelyez a lapján (un. [Issuer
API](https://github.com/mozilla/openbadges/blob/development/docs/apis/issuer_api.md)),
ez képes a böngészőt átirányítani a Mozilla Backpack oldalára, ahová már
felkerül a jelvény, és itt megtörténik a bakering is. Amennyiben ezt nem
teszi meg, a felhasználó kézzel is feltöltheti a png állományt. A png
állományban a JSON dokumentumban ott van egy pár URL a kiállító
rendszerére, az ellenőrzéshez ezeket fenn kell tartani.

Egy jó tutorial [itt
olvasható](http://billymeinke.wordpress.com/2012/05/24/open-badges-want-to-make-your-own-badges-by-hand-heres-how/).
