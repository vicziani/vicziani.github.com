---
layout: post
title: Szoftverfejlesztés okosan Pythonnal
date: '2022-02-03T10:00:00.000+01:00'
author: István Viczián
description: Szoftverfejlesztés okosan Pythonnal könyvbemutató.
---

Bár egyetértek azzal, hogy a programozással kapcsolatos szakirodalom nyelve
az angol, mégis üdvözlöm a magyar nyelvű könyveket, és blogokat
(hiszen ezért írom a JTechLogot is). Ezek a tartalmak itthon egy olyan
réteget is meg tudnak szólítani, akik esetleg kedvet kapva, ezen
az úton elindulva elkezdik fogyasztani az angol szakirodalmat is.
Gondolok például az középiskolásokra, felsőoktatási intézmények
diákjaira, manapság annyira népszerű
bootcampeken tanulókra, rokon szakmákból érdeklődőkre (pl. üzleti
elemzők, manuális tesztelők, matematikusok, stb.)

Ezért is tartom rajta a szemem a magyar nyelven megjelenő
könyveken. Sok megkeresés érkezik hozzám azzal kapcsolatban is,
hogy mivel ajánlott kezdeni, és a programozással kapcsolatos
fórumokon, listákon, csoportokon is újra és újra előjön a kérdés.
Mindig érdekelt az is, hogy egy kezdőknek szóló könyv hogyan
próbál bevezetni rendkívül absztrakt fogalmakat, mennyire hoz új példákat,
mennyire mer elrugaszkodni az eddigi tanítási módszerektől.
Különösen a magyar szerzők könyveinek örülök.

Már 2020-ban láttam Guta Gábor _Szoftverfejlesztés okosan Pythonnal : agilis csapatok közös nyelve_
című könyvét, és múltkor, mikor ki szerettem volna venni a könyvtárból, hogy 
belelapozzak, és nem találtam benn, döntöttem el, hogy írok neki, hátha van neki
egy-két elfekvőben lévő példány. Gáborral már régóta ismerjük egymást,
akkor még mindketten Javaval foglalkoztunk, azóta váltott át, és merült bele
nagyon mélyen a Python világába. Mostanában ebben a témában ad elő
különböző szakmai konferenciákon is, pl. kifejezetten ajánlom a 
_Python és a turbó csiga_ című előadását a Python teljesítményhangolásról,
mely a HWSW free! meetup-sorozaton [hangzott el](https://www.youtube.com/watch?v=MCJZWrPVgcs) 2020. februárjában.

<a href="/artifacts/posts/images/szoftverfejlesztes-okosan-pythonnal-agilis-csapatok-kozos-nyelve.jpg" data-lightbox="post-images">![Kép leírása](/artifacts/posts/images/szoftverfejlesztes-okosan-pythonnal-agilis-csapatok-kozos-nyelve-thumb.jpg)</a>


<!-- more -->

Pár napon belül már meg is kaptam a dedikált példányt, és nagy lelkesedéssel vetettem
bele magam. Már az elején nagy várakozásokkal indultam neki, ismervén Gábort,
valamint láttam, hogy dr. Juhász István lektorálta, aki a legnagyobbra becsült tanáraim
egyike a Debreceni Egyetemen. Sőt a köszönetnyilvánításban Szathmáry László is megjelenik,
aki évfolyamtársam volt, és mindig szakmai precizitásáról volt híres (nem egy jegyzetéből tanultam). 
A könyv a következő témákat tárgyalja, ebben a sorrendben:

* Kifejezés
* A függvény
* Az osztály
* A vezérlési szerkezet
* A szekvencia
* A modul

A könyv tehát a Python programozási nyelv alapjait mutatja be 118 oldalon.
A felépítése több helyen is okozott nekem kellemes meglepetéseket. Egyrészt
már a tartalomjegyzékben is látható, hogy előbb tárgyalja az osztályokat,
és csak utána a vezérlési szerkezeteket, ami egy elég merész döntés,
különösen Python esetén. Én teljes mértékben támogatom ezt a sorrendet,
Javaban sokkal jobban adja magát, de Pythonban még nem mertem vele kísérletezgetni
oktatásaim során.

A másik érdekessége, ami szintén egy nagyon jó döntés, hogy minden fejezet két részből áll.
Az első rész fontosabb koncepciók mentén tárgyalja a nyelvet, míg a második rész
megy bele részletekbe, tárgyalja a pontos szintaktikát, mintegy referenciaszerűen.

Belelapozva azonnal látható, hogy jó sok kód van benne. Sőt, a könyv folyamatosan hivatkozik
egy példaprojektre, mely a könyv végén is megtalálható, de regisztráció után a
[könyv honlapjáról is letölthető](https://smartpython.axonmatics.com/).

Ami szintén azonnal látható, hogy a könyv tele van sok, a megértést segítő
ábrával. A vezérlési szerkezeteknél természetesen folyamatábrákkal,
az osztályoknál azonban UML osztálydiagramokkal találkozhatunk. Bár 
az UML manapság nem annyira divatos, én szeretem, mert ez a szabványos
jelölésrendszer lehetővé teszi, hogy egy pillantásra megértsük az osztályokat
és közöttük lévő kapcsolatokat. És a könyv csak annyit mutat be és használ az UML
nyelvből, amennyit feltétlenül szükséges.

Letudja a kötelező köröket is, az első fejezet bemutatja, hogyan kell elindulni a 
fejlesztéssel, mit és hogyan kell telepíteni a különböző operációs rendszerekre
(Windows 10, MacOS X, Ubuntu Linux 18.04).

Ami egy magyar könyv esetén rendkívül idegesítő tud lenni, az az erőltetett
magyarítások használata. Van kiadó, ahol minden angol szót kötelező lefordítani,
és így gyakorlatilag olvashatatlan, úgy kell visszafejteni, hogy miről is van szó.
Gábor nem esett ebbe a hibába, nagyon-nagyon könnyeden, folyamatosan olvasható a 
könyv, látszik, hogy gyakorló szakember írta.

És talán a legnehezebb kérdés, kinek szól a könyv? A könyv hátoldalán szereplő szöveg
szerint hasznos lehet olyanoknak, akik csak szeretnének belelátni a programozók munkájába, valamint
kezdő és gyakorlott programozóknak is. A bevezető kitér arra, hogy a könyv tömörsége miatt
nem fért bele irgalmatlan mennyiségű gyakorlati feladat, ami a programozói tudás elsajátításához szükséges.

Kihangsúlyoznám, hogy a könyv rendkívül tömör (118 oldal!). Gyakorlott programozóként,
akinek a Python nyelv sem volt ismeretlen, egy A4-esnyi dolgot gyűjtöttem ki,
aminek a könyv elolvasása után még utána szerettem volna nézni. Olyan fogalmakba
megy bele, amelybe a kezdő Python könyvek többszörös oldalszám mellett sem jutnak el 
(különösen az objektumorientáltság terén, de szó esik a Python-projektek szerkezetéről,
virtuális környezetekről, kódellenőrző eszközökről, dokumentáció generálásról).

Én ezért azoknak ajánlanám a könyvet, akiknek már van valamennyi programozói gyakorlatuk,
akár más nyelven, akár csak felszínesen ismerik a Pythont, és szeretnék megismerni, hogy
mire képes, milyen lehetőségei vannak, és az utalások alapján képesek továbbmenni.

Nekik kiváló, mert tömörsége, felépítése, és nem utolsó sorban, mert jól van megírva,
a lehető legrövidebb idő alatt a lehető legtöbbet lehet megtudni a Pythonról.

A könyv tökéletes lehet egy Python oktatás támogatására is, ahol a bővebb magyarázatot
szóban mellé lehet tenni. És ismétlésképp is elegendő a könyv megfelelő
fejezeteit átnézni.

Azoknak is javaslom, akik most tanulnak programozni, vagy most tanulják a Pythont, de én egy másik, szájbarágósabb,
sokkal több gyakorlati példát tartalmazó könyv mellé javaslom. Amellett képes abszolút kezdők számára ez a
könyv tündökölni, hiszen ad egyfajta iránymutatást, hogy meddig érdemes eljutni, valamint egy tömör referenciát,
amit később újra és újra fel lehet lapozni.

A teljesség kedvéért hadd említsem még meg a magyar nyelven megjelent Python programozással foglalkozó könyveket.
Az egyik a Mark Summerfield: _Python ​3 programozás_. Itt egy fordításról van szó. A könyv több, mint 500 oldal,
és referenciaszerűen tárgyalja a Python programozási nyelvet. Ezt a könyvet nem ajánlom kezdőknek,
inkább a tudás csiszolására, esetleg vizsgára való felkészülésre javaslom. A fordítást sok helyen
meg kell fejteni, emiatt, és a szakmai tömörsége miatt az olvasásban gyakran meg kell állni, és elgondolkodni,
hogy pontosan hogy kell ezt értelmezni. Azonban van szó XML-ről, szálakról, hálózatkezelésről, adatbázis programozásról,
reguláris kifejezésekről és a GUI programozásról is.

Emellett még két könyv elérhető magyarul, ráadásul ingyen. Az egyik Gérard Swinnen: _Tanuljunk meg programozni Python nyelven_,
mely [letölthető](https://mek.oszk.hu/08400/08435/08435.pdf) a Magyar Elektronikus könyvtárból. Ez is fordítás, és 
abszolút kezdőknek szól. Ez azonban sajnos elavult, mert a Python 2-es verzióját tárgyalja.

A másik a Peter Wentworth, Jeffrey Elkner, Allen B. Downey, and Chris Meyers: _Hogyan gondolkozz úgy, mint egy informatikus: tanulás Python3 segítségével_,
mely szintén fordítás. A könyv szintén teljesen kezdőknek való és már a Python 3-as verziójáról szól. 
Én sokat tanítottam az előző és ebből a könyvből is, arra tökéletesen megfelel. Bár ez hamar behozza a teknőcgrafikát,
aminek én annyira nem vagyok nagy barátja. Ez utóbbi könyveket nem ajánlom olyan szakembereknek,
akik már ismernek egy másik programozási nyelvet.

És bónuszként említeném meg Carol Vorderman: _Programozás gyerekeknek_ című könyvét, melynek fordítása
a HVG Kiadó gondozásában jelent meg. Ez egy rendkívül szórakoztató könyv a gyerekeknek,
mely először a Scratch világába vezet be, és arról nyergel át a Python nyelvre.
A gyerekek izlésének tökéletesen megfelel, tele van színes képekkel, apró, sikerélményt biztosító
gyakorlati játékokkal, feladatokkal, és még kitekintést is ad, pl. hogy hogyan épül fel a 
számítógép, illetve mit kell tudni valóságban a programozásról, milyen programozási nyelvek vannak,
hogyan lehet mobilalkalmazást fejleszteni, és mik azok a vírusok. Ez a könyv sok közös vidám órát
szerzett a kisfiammal, pláne az online oktatás időszakában.


