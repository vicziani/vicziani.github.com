---
layout: post
title: Linux alapok fejlesztőknek
date: '2009-11-07T06:56:00.000-08:00'
author: István Viczián
tags:
- ssh
- Linux
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Bejelentkezni
[Putty](http://www.chiark.greenend.org.uk/~sgtatham/putty/)-al szoktam
(SSH kliens), általában nem jelszóval, hanem kulccsal, melyet a
Pageant-tal (an SSH authentication agent for PuTTY, PSCP and Plink)
töltök be. Kulcs generálás a PuTTYgen-nel.

Tunel-t beállítani a Connection/SSH/Tunnels fülön lehet, Source port,
melyen a mi gépünkön látszani fog, Destination, melyet ki akarunk hozni,
pl. localhost:8080. Ne felejtsük el megnyomni az Add gombot, és menteni
sem.

A “sudo su -” parancs jelszó nélkül átenged root-ként a /opt/sudoers
fájl tartalma miatt.

Parancssorból tunel-ezni:

ssh -L 11521:localhost:1521 root@123.123.123.123

Ezzel a paranccsal a 123-as ip-jű gépre lépünk be (standard SSH 22-es
porton), és a saját gép 11521 portjára hozzuk ki a 1521-es portját.

Szolgáltatások a etc/init.d könyvtárban vannak, pl. itt lehet egy Tomcat
script is.

Boot-olás utáni automatikus indítás beállítása a

chkconfig —add scriptnév

paranccsal történik, listázni a következő paranccsal lehet:

chkconfig —list
