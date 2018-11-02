---
layout: post
title: Oracle Fusion Middleware
date: '2008-11-28T20:06:00.004+01:00'
author: István Viczián
tags:
- Oracle
modified_time: '2018-06-09T10:00:00.000-08:00'
---

A felvásárlások miatt lassan a legtöbb Java termék mögött (akár ingyenes
is!) néhány multi áll, érdemes nyomon követni ezek termékstruktúráját.
Mivel úgy is át kell néznem az Oracle termékeit, írok egy rövid
összefoglalót a 2008. október 9-én tartott [Oracle Fusion Middleware
Forum](http://www.oracle.com/global/hu/events/20081009.html)
rendezvényről, melynek apropója az volt, hogy az Oracle felvásárolta a
BEA Systems-t, és előadások hangoztak el a címben szereplő fogalomról,
valamint a felvásárlás következményeiről. Az Oracle Fusion Middleware
nem egy termék, hanem bizonyos Oracle termékek összefoglaló neve, melyek
magukban foglalnak Java EE-re épülő termékeket és fejlesztőeszközöket,
integrációs, folyamatvezérlő, üzleti intelligencia, csoportmunka és
tartalomkezelő megoldásokat. A cél szabványokon alapuló, egymással
integrálható, un. hot-pluggable eszközök gyártása, melyek biztosítják,
vagy könnyen beilleszthetőek a SOA architektúrába. Az egységesítés
következményeképp csökkenhetnek az üzemeltetési költségek, javulhat a
terméktámogatás. A felvásárlás miatt azonban lehetnek konkurens
termékek, és emiatt a következő szempontok szerint kategóriákra
osztották ezeket: mennyire illik bele a jelenlegi architektúrába,
mennyire támaszkodik szabványokra, mekkora a piaci részesedése, és
mennyire szolgálja ki az Oracle Applications elemeit. Ezek alapján a
különböző termékeket három kategóriára bontották: stratégia termékek,
konvergáló termékek és karbantartott termékek. A BEA termékek közül
stratégiai termékeket azonnal, 12 - 18 hónapon belül integrálják, ezek
főleg azok, melyek nagyon befutottak, vagy nincs Oracle-ös megfelelője,
a konvergáló termékeket nem fejlesztik akkora ütemben, de folyamatosan
integrálják, és 9 évig biztosítják a fejlesztést és követést, valamint a
karbantartott termékek azon termékek lettek, melyeket már a BEA a
felvásárlás előtt leállított, ezeknek a fejlesztése még 5 évig tart. Az
Oracle a következő csoportokra bontotta a Middleware termékpalettáját,
egymásra épülve alulról felfelé:

-   Grid kiszolgáló elemek
-   Alkalmazás szerver
-   SOA és folyamatirányítás
-   Tartalomkezelés
-   Üzleti intelligencia
-   Enterprise Performance Management
-   Felhasználói felület

Valamint mindezek mellett találhatóak a fejlesztőeszközök, menedzsment
és felhasználó- és jogosultságkezelő rendszerek. Ebben a posztban csak
az infrastrukturális elemekkel foglalkozom, úgymint grid, alkalmazás
szerver és fejlesztő eszközök, a SOA termékekről szóljon a következő
poszt. Az infrastruktúra alapját a BEA JRockit JVM (mely a Sun JVM-nél
gyorsabb működést, priorizált GC-t, és instrumentáció nélküli profile-t
ígér), vagy valós rendszerekben a BEA JRockit Real Time adja.
Megemlítésre került a BEA JRockit Liquid VM, mely virtualizációs
környezetben megkerüli a virtuális operációs rendszert, így nagyobb
hardver kihasználást biztosít. Az Oracle Coherence egy tranzakcionális,
in-memory, több szerveren elosztott (akár 2000 szerverig is skálázható),
transzparens adatréteg/grid (ezzel kapcsolatban egy meggyőző demó is
volt). Jól alkalmazható second level cache-ként, webes alkalmazásoknál
session szinkronizálásra, lekérdezések párhuzamosítására, vagy valós
idejű eseményfigyelésre (Java-n kívül létezik .NET és C++ kliens is). Az
Oracle TopLink (11g verziója szeptember 22-én jött ki) nem csak egy JPA
implementáció, hanem egyrészt támogat object-XML binding-ot is, valamint
bizonyos entitások megjelölhetők úgy, hogy a Coherence tárolja őket,
egyszerűen beillesztve így a grid architektúrába. Az Oracle átadta a
TopLink forráskód egy részét a nyílt forráskódú közösségnek, ebből lett
az EclipseLink projekt, melyet a JPA 2.0 referencia implementációjának
válaszottak. A BEA Kodo-ról nem esett szó, de gondolom az Oracle TopLink
mellett labdába sem rúghat. A BEA WebLogic Server alkalmazás szerver
lett a stratégiai termék, míg az Oracle OC4J pehelysúlyú konténer,
valamint az erre épülő Oracle Application Server már csak konvergáló
termék, számos komponensét már át is emeltek a BEA WebLogic Server-be. A
BEA WebLogic Server a RASP (Reliability, availability, scalability,
performance) infrastruktúrára épít, Java EE 5 tanúsított, jellemzői a
FastSwap (hot-deployment), a WS/SOA, RIA (Rich Internet Application) és
OSS (open source software) támogatása. Menedzsment szempontból fontos,
hogy a menedzsment teendőket tranzakciókba lehet foglalni, melyeket a
végén érvényesíteni vagy visszavonni is lehet. A webes Administration
Console-t ki is lehet bővíteni saját fejlesztéssel, valamint
parancssorból is menedzselhető, Jython alapú script-ekkel. Kiegészíthető
a WebLogic Operation Control-lal, mely biztosítja az adaptív, dinamikus
erőforrás optimalizációt, ezzel az elvárt szolgáltatási szintet (SLA).
Fejlesztő eszközök és keretrendszerek közül az Oracle JDeveloper, Oracle
ADF és az Oracle Enterprise Pack for Eclipse a stratégiai termék, az
Oracle Forms & Reports, BEA Workshop konvergáló termék, és a BEA
Beehive-ról pedig már a BEA is letett, ezért karbantartott termék marad.
Nem szerencsés, de az Oracle kijött egy szintén Beehive nevű
csoportmunkát támogató keretrendszerrel, ami viszont stratégiai termék,
nem szabad keverni a kettőt. A konferencián elhangzott, hogy a Java EE
eszközöket a Oracle Enterprise Pack for Eclipse és Oracle JDeveloper
J2EE Edition-be fogják pakolni, míg a SOA eszközöket a JDeveloper Studio
Edition-be, mint régen. Azonban most letölthető Studio Edition-ben
nincsenek SOA eszközök, J2EE Edition meg nem letölthető. Az Oracle ADF
egy MVC architektúrán alapuló keretrendszer, Java EE fejlesztéshez, mely
deklaratív megközelítése miatt lehetővé teszi a RAD-ot (demóval - de
ezzel a kódolás nélküli klikkelgetős alkalmazás fejlesztéssel mindig
fenntartásaim vannak - a RAD Delphi-ig működött). Menedzsmentre
természetesen marad a bevált Oracle Enterprise Manager. A model,
controller és view réteg is tetszőlegesen választható a [különböző
technológiákból](http://en.wikipedia.org/wiki/Oracle_ADF). Segíti a RIA
fejlesztést, pl. az Apache MyFaces Trinidad projekten alapuló
komponensekkel. Java programozók számára kevésbé érdekes, de fontos
termék a C, C++ és Cobol programok elosztott tranzakciókezeléséért
felelős BEA Tuxedo Transaction Processing Platform. A konferencia előtt
két nappal jelent meg az Oracle JDeveloper és Oracle ADF 11g végleges
verziója, mely már az Oracle WebLogic Server 10g (10.3)-t tartalmazza.
