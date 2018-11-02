---
layout: post
title: Virtualization for Dummies
date: '2009-10-18T04:03:00.000-07:00'
author: István Viczián
tags:
- virtualization
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Ingyenesen letölthető a [Virtualization for
Dummies](http://www.sun.com/systems/solutions/virtualizationfordummies/index.jsp)
könyv a Sun-tól, illetve annak egy speciális, a Sun és az AMD által
támogatott kiadása.

Alapvetően egy könnyű, 50 oldalas olvasmány, mely egyrészt szól a
virtualizáció alapjairól, másrészt természetesen az ehhez tartozó Sun
(AMD processzorra épülő szerverek, VirtualBox, Solaris ilyen irányú
fejlesztései és a storage rendszerek) és AMD (AMD Opteron processzorban
alkalmazott AMD-V) technológiákról.

![Virtualization for
Dummies](/artifacts/posts/2009-10-18-virtualization-for-dummies/tumblr_krphvaQehp1qzkp8u.png)

Itt összefoglalnám az általános dolgokat. Mikor jó a virtualizáció:

-   kihasználatlan hw
-   szolgáltatók kifogynak a helyből
-   zöld (érdekes adat, az USA-ban a szolgáltatók a teljes
    energiafelhasználás 1,2 %-át teszik ki)
-   magas üzemeltetési költségek
-   több op. rendszerre való fejlesztésnél

Virtualizációs technikák:

-   szerver virtualizáció:
    -   type 1 hypervisor - direkt a hw-en hatékonyabb a direkt
        erőforrás hozzáférés miatt, ilyen a VMWare ESX server, MS
        Hyper-V, Citrix XenServer, Sun xVM, Xen - open source
    -   type 2 hypervisor (aka os virtualization) - host operációs
        rendszeren. Limitáció: ugyanazon op. rendszerek futhatnak csak
        egy időben - ez homogén rendszereknél jó. Van a Solaris-ban,
        Virtuozzo Parallels, os: OpenVZ Storage virtualization.
-   centralized: virtualized storage. Megoldja: sok adat, több
    alkalmazás is használhatja, elosztott gépeken nehéz menteni.
-   kliens virtualizáció: pl. VirtualBox, és az image-t egyből lehet
    futtatni VMWare ESX server, MS Hyper-V környezetekben.

Hogyan vezessük be a virtualizációt:

1.  kicsiben kezdeni
2.  betanulás
3.  virtualizáció is változik, folyamatosan követni kell
4.  üzlet menjen tovább, nem mehet annak rovására
5.  válaszd ki jól a hardvert
6.  adminisztrátori teendők módosítása
7.  adj lehetőséget a storage & client virtualizációnak
8.  mgmt eszköz
9.  vezető virtualizációs szoftvereket érdemes választani
10. ünnepeld meg :)
