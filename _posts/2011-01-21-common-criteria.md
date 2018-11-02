---
layout: post
title: Common Criteria
date: '2011-01-21T14:17:00.000-08:00'
author: István Viczián
tags:
- security
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Mostanában egyre gyakoribb, hogy a különböző állami pályázati
kiírásokban egyre többet szerepel, hogy a fejlesztési folyamatnak, a
szállított termékeknek meg kell felelnie Common Criteria valamelyik EAL
szintjének. Történhet ez mindazért, mert az Európa Tanács felkérte a
tagállamokat, hogy támogassák Common Criteria szabvány használatát, és a
tanúsítványok kölcsönös elfogadását, melyhez Magyarország is
csatlakozott. A Common Criteria nemzetközi (ISO-IEC 15408) és magyar
szabvány is (MSZ ISO/IEC 15408:2002). Feltehetőleg emiatt az Államreform
Operatív Program (ÁOP) "Elektronikus közigazgatási keretrendszer
kialakítása" című projektjében is igen hangsúlyos a Common Criteria. Az
[E-közigazgatási Keretrendszer](http://kovetelmenytar.complex.hu/)
gyakorlatilag a államigazgatási szoftverfejlesztés interoperabilitását
próbálja megvalósítani. Ennek eszközei többek között pl. a SOA
alkalmazása, vagy a biztonsági szabványoknak való közös megfelelés. A
Keretrendszer nem más, mint 20 új szabvány, 100 új publikáció, melyek
megteremtik az elektronikus közigazgatás teljes fejlesztéséhez és
üzemeltetéséhez az egységes technikai, szemantikai, IT biztonsági,
alkalmazásfejlesztés-módszertani, valamint projektmenedzselési és
monitoring platformot. A Keretrendszert a Budapesti Műszaki és
Gazdaságtudományi Egyetem Informatikai Központja (BME IK) által vezetett
konzorcium nyerte, melynek tagjai még a szabványtárat elkészítő CompLex
Kiadó Kft., a projektvezetésért és a minőségbiztosításért felelős Hendra
Kft., a biztonsági előírásokat kidolgozó HunGuard Kft., a
projektmenedzsment módszertant kidolgozó, valamint a tesztkörnyezetet
biztosító Kopint-Datorg Zrt., továbbá az interoperabilitási és
biztonsági követelményeket elkészítő Stratis Kft. A Követelménytárba
kerülő dokumentumokkal kapcsolatos döntést a Közigazgatási Informatikai
Bizottság (KIB) végzi. A Követelménytár a KIB 28. számú ajánlás részét
képezi.

A Common Criteria for Information Technology Security Evaluation (Common
Criteria - CC) informatikai termékek és rendszerek biztonsági
értékelésének követelményrendszere, mely alapján ezek minősíthetőek,
gyakorlatilag egy biztonsági szabványgyűjtemény. Az informatikai termék
vagy rendszer az értékelés tárgya, Target of Evaluation (TOE). Fő
fogalma a védelmi profil, Protection Profile (PP), mely egy
termékfüggetlen, előre megadott és formalizált követelményeket
tartalmazó dokumentum. Egy típusfeladatra több védelmi profil is
készíthető, pl. lásd tűzfalakra vonatkozó védelmi profilok. Ezek a
védelmi profilok szakemberek által elbírált, hitelesített dokumentumok.
A TOE fejlesztői biztonsági rendszertervet készítenek már a konkrét
termékre vonatkozóan, ez a Security Target (ST). Ez a PP-ben leírt
elvekre (mit) konkrét megoldásokkal (hogyan?) válaszol.

A CC a követelményeket funkcionális és garancia csoportba osztja. Az
előbbi írja le a funkcionális követelményeket, a második, hogy mik az
elvárások a vizsgálatokkal. A vizsgálatok garantálják, hogy a TOE eleget
tesz a funkcionális követelményeknek. A követelmények osztályokba, azon
belül családokra, majd komponensekre oszthatók. A garancia szintek,
Evaluation Assurance Level (EAL), mutatják meg, hogy a TOE milyen
mélységben, erőforrás ráfordítással lett vizsgálva, hogy mennyire felel
meg a követelmányeknek. Ezt hét szinten adják meg. Pl. EAL1
funkcionálisan tesztelve, míg az EAL4, mely a legjobban elterjedt, azt
jelenti, hogy tervszerűen tervezve, tesztelve és átnézve. Igazából ez
csak a termék dokumentáltságának a szintjét méri. Ez ellent is mond az
Open Source termékeknek, valamint az agilis módszertanoknak, ahol a
szoftver fontos, nem a dokumentáció. A CC inkább a klasszikus vízesés
módszertannak felel meg. A legkomolyabb az EAL7 szint, ahol már formális
bizonyítás van. Minél magasabb a biztonsági szint, annál drágább elérni.
Fontos, hogy a szint nem a vizsgált rendszer biztonságának szintjét
méri, hanem azt, hogy ez milyen szinten vizsgálták.

A minősített rendszerek (hardverek, szoftverek) listája publikusan
[elérhető](http://www.commoncriteriaportal.org/products/), szűrhető és
akár CSV-ben letölthető. Jelenleg 1396 tételt tartalmaz. Itt azért főleg
biztonsági eszközök találhatóak, minél magasabbra megyünk a szoftver
stack-en, annál kevesebb eszköz található.

Nézzük, hogy mi is lehet fontos pl. egy átlagos webes/intranetes
n-rétegű alkalmazás architektúrájának kialakításánál. Operációs
rendszerek közül még jó a felhozatal, adatbázisok szintjén sem
panaszkodhatunk annyira, de Message Oriented Middleware és Java web
konténerek és alkalmazásszerverek már nagyon ritkán minősítettek. Álljon
itt egy táblázat, összefoglalásul.

<table>
<tbody><tr>
<th>Típus</th>
<th>Termék</th>
<th>Legfrissebb verziószám</th>
<th>EAL szint</th>
</tr>

<tr>
<td>Operációs rendszer</td>
<td>Windows Vista Enterprise; Windows Server 2008 Standard Edition; Windows Server 2008 Enterprise Edition; Windows Server 2008 Datacenter Edition</td>
<td>Windows Server 2008 R2 SP1 RC</td>
<td>EAL4+</td>
</tr>

<tr>
<td>Operációs rendszer</td>
<td>Red Hat Enterprise Linux Ver. 5.3 on Dell 11G Family Servers</td>
<td>Red Hat Enterprise Linux 6</td>
<td>EAL4+</td>
</tr>

<tr>
<td>Operációs rendszer</td>
<td>Oracle Enterprise Linux Version 5 Update 1</td>
<td>Oracle Linux 5 update 5</td>
<td>EAL4+</td>
</tr>

<tr>
<td>Operációs rendszer</td>
<td>SUSE Linux Enterprise Server 10 SP1</td>
<td>SUSE Linux Enterprise 11</td>
<td>EAL4+</td>
</tr>

<tr>
<td>Operációs rendszer</td>
<td>Solaris 10 Release 11/06 Trusted Extensions</td>
<td>Solaris 10 10/09.</td>
<td>EAL4+</td>
</tr>

<tr>
<td>Adatbázis</td>
<td>Oracle Database 11g Enterprise Edition with Oracle Database Vault Release 11.1.0.7 with Critical Patch Updates up to and including July 2009</td>
<td>Oracle Database 11g Release 2</td>
<td>EAL4+</td>
</tr>

<tr>
<td>Adatbázis</td>
<td>IBM DB2 Version 9.7 Enterprise Server Edition for Linux, Unix, and Windows</td>
<td>IBM DB2 Version 9.7</td>
<td>EAL4+</td>
</tr>

<tr>
<td>Adatbázis</td>
<td>PostgreSQL Certified Version V8.1.5 for Linux</td>
<td>PostgreSQL 9.0</td>
<td>EAL1</td>
</tr>

<tr>
<td>Message oriented middleware</td>
<td>IBM WebSphere MQ 6.0.1.1</td>
<td>IBM WebSphere MQ  7.0.1.3</td>
<td>EAL4+</td>
</tr>

<tr>
<td>Alkalmazásszerver</td>
<td>JBoss Enterprise Application Platform Version 4.3 CP03</td>
<td>JBoss Application Server 6.0</td>
<td>EAL2+</td>
</tr>

<tr>
<td>Alkalmazásszerver</td>
<td>IBM WebSphere Application Server V6.1.0.2</td>
<td>IBM WebSphere Application Server V7</td>
<td>EAL4+</td>
</tr>

<tr>
<td>Alkalmazásszerver</td>
<td>BEA WebLogic Server 8.1 SP6</td>
<td>Oracle WebLogic Server 11g Enterprise Edition</td>
<td>EAL2+</td>
</tr>

<tr>
<td>Alkalmazásszerver</td>
<td>Oracle Application Server 10g</td>
<td>Helyette: Oracle WebLogic Server 11g</td>
<td>EAL4</td>
</tr>

</tbody>
</table>

Látható, hogy sok helyen feltüntetik, hogy milyen környezetben, milyen
service vagy fix pack-kel érvényes.

Azt a következtetést is levonhatjuk, hogy viszonylag lassan követi a
minősítés a kiadást. Java web konténerek és alkalmazásszerverek között
meg gyakorlatilag már nem találunk olyant, melyet szívesen használnánk,
mert támogatja a legújabb szabványokat (pl. EJB 3), és minősítéssel is
rendelkezik.
