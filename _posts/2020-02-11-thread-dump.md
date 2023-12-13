---
layout: post
title: Java Thread Dump
date: '2020-02-11T11:00:00.000+01:00'
author: István Viczián
description: Hogyan elemezzünk thread dumpot?
---

Mostanában úgy alakult, hogy egy webes alkalmazás belső működését kellett
elemeznem. Ennek több oldalról is neki lehet ugrani, mint memóriahasználat,
garbage collector működése, heap dump (JVM memóriájának tartalma),
thread dump (futó szálak állapota), napló állományok, stb.

Vannak eszközök, amelyeknél nem kell feltétlen a JVM működésébe avatkoznunk, pl.
naplófájl elemzésekor. Persze itt is előfordulhat olyan eset, hogy
a naplózás szintjét állítanunk kell, ez történhet az alkalmazás újraindításával,
de bizonyos megoldások engedik a naplózás szintjének futás szintű állítását (pl.
Spring Boot Actuator `/logger` endpoint).

Vannak eszközök, melyekkel futó JVM-hez lehet csatlakozni, anélkül, hogy ezt erre
felkészítettük volna. (Tipikusan az adott gépről, távoli hozzáféréshez biztos,
hogy további konfiguráció szükséges.) Ilyen pl. a `jstat` a GC működésének és a memóriahasználat
elemzésére, a `jstack` a thread dump lekéréséhez, valamint a `jconsole`
mely egy komplex grafikus eszköz a JVM monitorozására. (Ez utóbbi használata már
problémákba ütközhet, hiszen szerveren nem feltétlen van grafikus felület, a
távoli hozzáférés meg további konfigurációkat igényel.)

Egyes eszközöket pedig már előre kell telepíteni és konfigurálni, hogy használni tudjuk.

Ez a poszt a thread dump készítéséről fog szólni, valamint annak elemzéséről, értelmezéséről. Szó esik hogy
milyen eszközöket tudunk erre használni. A legtöbb poszt ezzel kapcsolatban arról szól,
hogy lehet a hibásan programozott párhuzamosságból adódó deadlockokat, livelockokat kiszűrni,
de én arra koncentrálok, hogy hogy lehet egyáltalán értelmezni a thread dumpot, hogy épp
mit is csinál az alkalmazás.

<!-- more -->

A thread dump tehát a JVM-en belül futó szálak állapotát mutatja. Minden egyes szállal
kapcsolatban sokmindent kiír, ezek közül a lefontosabbak a szál neve, állapota, valamint
hogy éppen melyik utasítást hajtja végre. Ezt a klasszikus stack trace formátumban
adja vissza, mely tartalmazza a teljes hívási láncot.
Ezt egyszerű szöveges formában lehet lekérni.

Ehhez először tudni kell a Java alkalmazásunk PID-jét (Process Id, az operációs rendszer
által kiadott egyedi azonosító.) Ennek megállapítása történhet a `jps` paranccsal, mely
az összes Java alapú processzt kilistázza.

A thread dumpot ezután a `jstack 18620` paranccsal kérhetjük le konzolra (, ahol a szám a PID), 
vagy irányítsuk fájlba a `jstack 18620 -> threaddump.txt` paranccsal.

A példában egy apró Spring Bootos webalkalmazást használtam, mely REST webszolgáltatásokat
nyújtott, és MariaDB adatbázishoz csatlakozott. Az alkalmazást terheléses tesztnek vetettem
alá, [Apache JMeter](http://jmeter.apache.org/)-rel 20 szálon terheltem. Az alkalmazás
alkalmazottakat tart nyilván, a kérésekben új alkalmazottakat vettem fel, és alkalmazottak
listáját kértem le.

A példa [thread dump megtekinthető itt](/artifacts/posts/threaddump.txt).
Látható, hogy ez egy kb. 220 kb-os, 2377 soros szöveges állomány, melynek értelmezése nem annyira egyszerű.
Azért annyi látszik, hogy felépítése rendkívül egyszerű, a szálakat tartalmazza,
valamint mindegyikhez a stack trace-t, egymástól üres sorral elválasztva.

Első körben nekiugorhatunk pl. Linux parancssori eszközökkel, mint a `grep`, `sed` és `awk`,
azonban ehhez mélyebb tudás szükségeltetik, valamint mivel egy szál több sorban jelenik meg,
bonyolultabb az elemzése.

Egyszerűbb dolgokat még meg tudunk oldani, pl. kérjük le a futó szálak neveit (ezek idézőjellel kezdődnek):

```
$grep "^\"" threaddump.txt

"Reference Handler" #2 daemon prio=10 os_prio=2 cpu=0.00ms elapsed=4616.87s tid=0x0000014dd23dc000 nid=0x241c waiting on condition  [0x00000047e99ff000]
"Finalizer" #3 daemon prio=8 os_prio=1 cpu=0.00ms elapsed=4616.87s tid=0x0000014dd23e1000 nid=0x35e8 in Object.wait()  [0x00000047e9aff000]
...
"http-nio-8080-exec-1" #28 daemon prio=5 os_prio=0 cpu=718.75ms elapsed=4606.41s tid=0x0000014ddaf06800 nid=0x2e54 runnable  [0x00000047eb3fb000]
"http-nio-8080-exec-5" #32 daemon prio=5 os_prio=0 cpu=718.75ms elapsed=4606.41s tid=0x0000014ddaf09000 nid=0x4ccc runnable  [0x00000047eb7fa000]
...
```

Látható, hogy itt vannak a JVM belső működéséhez tartozó szálak (pl. `Reference Handler`, `Finalizer`, stb.), a GC-vel kapcsolatos
szálak (`GC Thread#0`, `G1 Young RemSet Sampling`, stb.), a Tomcathez és Spring Boothoz tartozó szálak.
A szálak legnagyobb részét mégis a `http-nio-8080-exec` kezdetű szálak teszik ki, melyek a http kérések kiszolgálását végzik.
Számoljuk meg, mennyi van ebből!

```
$grep "http-nio-8080-exec" threaddump.txt | wc -l

22
```

Számunkra tehát ez a 22 szál érdekes.

Annak kiderítése, hogy ez a 22 szál mit csinált, már kicsit munkásabb. Rákeresve, hogy jelenleg milyen eszközök állnak
rendelkezésre ennek elemzésére, először egy [fastThread Java Thread Dump Analyzer](https://fastthread.io/) online szolgáltatást kaptam.
Bevallom nem szívesen töltöm fel a thread dumpot egy online szolgáltatásra, valamint megint az a baj, hogy böngésző és internet kell hozzá.
Nekem valami olyasmire volt szükségem, mint a `grep`, ami parancssorból működik, különböző szűréseket és transzformációkat
tud végezni, de úgy, hogy megfelelően értelmezi a thread dumpot. És meg is találtam az [mjprof](https://github.com/AdoptOpenJDK/mjprof)
nevezetű eszközt, mely pont ezt tudja. Különböző forrásokból fel tudja olvasni a thread dumpot, különböző
közbülső operációkat lehet végrehajtani (pl. szűrés), és megfelelő lezáró operációkat (pl. fa-szerű kiírás, számlálás).
Letölthető [zip formátumban](https://github.com/AdoptOpenJDK/mjprof/releases), de mivel Javas, JDK kell a futtatásához.
Sajnos a `Threads class SMR info` részt nem tudja értelmezni, azt hagyjuk mi is figyelmen kívül.

A következő paranccsal számoljuk meg a szálak számát. Ehhez a `count` terminált kell használni.

```
$mjprof count < threaddump.txt

53
```

Közbülső operátor a szűrés, először szűrjünk a `http-nio-8080-exec` szálakra, és nézzük meg, mennyi van.
Ehhez a `contains` filtert kell használni. Ennek első paraméterként (figyeljük meg, a paramétereket
perjelek közé kell írni, és egymástól vesszővel elválasztani) a szál tulajdonságát kell írni, második paraméterként a szöveget, melyre
szűrünk.

```
$mjprof contains/name,http-nio-8080-exec/.count < threaddump.txt

22
```

Azaz 22 szál érdekes számunkra az 53 szálból.

Annyira megtetszett az eszköz, hogy azért, hogy ne kelljen a futtatásához letöltögetni, kicsomagolni,
path-ba tenni, JDK-t beállítani, létrehoztam és publikáltam egy [Docker image-et is](https://github.com/vicziani/mjprof-docker),
így akinek Docker van telepítve a gépére, azonnal tudja használni:

```
$docker run --rm -i vicziani/mjprof contains/name,http-nio-8080-exec/.count < threaddump.txt
```

Látható, hogy a `name` tulajdonságra
szűrünk. Ezen kívül lehetne a szál állapotára, azonosítójára, sőt, a stack trace-re is szűrni.
Mivel a saját osztályaink a `training.employees` csomagban vannak, szűrjünk rá azokra a
szálakra, melyeknek a stack trace-ében szerepel ez a szó.

```
$mjprof contains/stack,training.employees/.count < threaddump.txt

20
```

Ebből látszik, hogy 20 szál van, amiben ez szerepel. Ez teljesen logikus, hiszen
20 szálon terheltük a JMeterrel.

A legérdekesebb funkció nekem mégis az, hogy képes csoportosítani, és egy darab
fa szerkezetben megjeleníteni az összes hívást.

```
$mjprof contains/stack,training.employees/.tree < threaddump.txt
```

Ez azonban még mindig elég sok információ, szerepeltessük benne csak a
saját csomagunkban található osztályokat.

```
$mjprof frame/training.employees/.tree < threaddump.txt

 23.08%    [9/39]\ at training.employees.EmployeesController.createEmployee(EmployeesController.java:44)
 23.08%    [9/39] \ at training.employees.EmployeesService$$EnhancerBySpringCGLIB$$e99d5c57.createEmployee(<generated>)
 23.08%    [9/39]  \ at training.employees.EmployeesService$$FastClassBySpringCGLIB$$55d6b46d.invoke(<generated>)
 23.08%    [9/39]   V at training.employees.EmployeesService.createEmployee(EmployeesService.java:26)
 28.21%   [11/39]\ at training.employees.EmployeesController.listEmployees(EmployeesController.java:23)
 28.21%   [11/39] \ at training.employees.EmployeesService$$EnhancerBySpringCGLIB$$e99d5c57.listEmployees(<generated>)
 28.21%   [11/39]  \ at training.employees.EmployeesService$$FastClassBySpringCGLIB$$55d6b46d.invoke(<generated>)
 28.21%   [11/39]   V at training.employees.EmployeesService.listEmployees(EmployeesService.java:32)
```

Ez már gyönyörűszépen mutatja, hogy 9 szál a `createEmployee()` metódusban van, ami az alkalmazottat veszi fel,
és 11 szál a `listEmployees()` metódusban, mely az alkalmazottakat listázza.

Most már csak az érdekel, hogy mit csinál a maradék 2 szál.

```
$mjprof contains/name,http-nio-8080-exec/.-contains/stack,training.employees/.tree < threaddump.txt

100.00%     [2/2]\ at java.lang.Thread.run(java.base@13.0.1/Thread.java:830)
100.00%     [2/2] \ at org.apache.tomcat.util.threads.TaskThread$WrappingRunnable.run(TaskThread.java:61)
100.00%     [2/2]  \ at java.util.concurrent.ThreadPoolExecutor$Worker.run(java.base@13.0.1/ThreadPoolExecutor.java:628)
100.00%     [2/2]   \ at java.util.concurrent.ThreadPoolExecutor.runWorker(java.base@13.0.1/ThreadPoolExecutor.java:1114)
100.00%     [2/2]    \ at java.util.concurrent.ThreadPoolExecutor.getTask(java.base@13.0.1/ThreadPoolExecutor.java:1053)
100.00%     [2/2]     \ at org.apache.tomcat.util.threads.TaskQueue.poll(TaskQueue.java:33)
100.00%     [2/2]      \ at org.apache.tomcat.util.threads.TaskQueue.poll(TaskQueue.java:89)
100.00%     [2/2]       \ at java.util.concurrent.LinkedBlockingQueue.poll(java.base@13.0.1/LinkedBlockingQueue.java:458)
100.00%     [2/2]        \ at java.util.concurrent.locks.AbstractQueuedSynchronizer$ConditionObject.awaitNanos(java.base@13.0.1/AbstractQueuedSynchronizer.java:2123)
100.00%     [2/2]         \ at java.util.concurrent.locks.LockSupport.parkNanos(java.base@13.0.1/LockSupport.java:235)
100.00%     [2/2]          \ - parking to wait for  <0x0000000602ed37d8> (a java.util.concurrent.locks.AbstractQueuedSynchronizer$ConditionObject)
100.00%     [2/2]           V at jdk.internal.misc.Unsafe.park(java.base@13.0.1/Native Method)
```

Ezek láthatóan új bejövő http kapcsolatokra várnak.

Nézzük meg, hogy ezek milyen állapotban vannak:

```
$mjprof contains/name,http-nio-8080-exec/.-contains/stack,training.employees/.-prop/stack/ < threaddump.txt

"http-nio-8080-exec-34" prio=5 tid=0x0000014ddaf08000 nid=0x3bd0 waiting on condition  [0x00000047ebffe000]
   java.lang.Thread.State: TIMED_WAITING (parking)

"http-nio-8080-exec-35" prio=5 tid=0x0000014ddaf05800 nid=0x5e48 waiting on condition  [0x00000047ec1fe000]
   java.lang.Thread.State: TIMED_WAITING (parking)
```

Láthatóan `TIMED_WAITING` állapotban.

Kérjük le azokat a szálakat, amikben szerepel a saját csomagunk.

```
$mjprof contains/name,http-nio-8080-exec/.contains/stack,training.employees/.-prop/stack/ < threaddump.txt
```

Ekkor látszik, hogy itt `RUNNABLE` és `TIMED_WAITING` szálak is vannak.

Kérjük le, hogy hány szál beszélget az adatbázissal.

```
$mjprof contains/name,http-nio-8080-exec/.contains/stack,org.mariadb/.count < threaddump.txt

10
```

Ennek értéke pont 10, ami azért van, mert a DataSource connection pool size maximális mérete 10,
ez a [HikariCP](https://github.com/brettwooldridge/HikariCP) `maximumPoolSize` property default értéke.

Rendben, de mit csinálnak a `TIMED_WAITING` állapotban lévő (alvó) szálak?

```
$mjprof contains/stack,training/.sleeping < threaddump.txt
```

Szépen látható, hogy ebből elég sok a `HikariDataSource.getConnection()` metódusban áll,
azaz arra várnak, hogy a connection pooltól JDBC connectiont kapjanak.

Azaz parancssori parancsok futtatásával szépen rá lehetett jönni, hogy mit is csinál
voltaképp az alkalmazás.

<table class="table table-striped">
  <thead>
    <tr>
      <td>Szálak száma</td>
      <td>Mit csinál</td>
    </tr>
  </thead>
  <tbody>
  <tr>
    <td>53</td><td>Összes szál</td>
  </tr>
  <tr>
    <td>22</td><td>Összes http kiszolgáló szál</td>
  </tr>
  <tr>
    <td>10</td><td>Adatbázissal kommunikál, HikariCP maximum pool size, futó szál</td>
  </tr>
  <tr>
    <td>9</td><td>JDBC Connectionre vár, alvó szál</td>    
  </tr>
  <tr>
    <td>2</td><td>Új http kérésre váró alvó szál</td>    
  </tr>
</tbody>
</table>
