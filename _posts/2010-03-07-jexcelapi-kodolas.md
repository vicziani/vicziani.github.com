---
layout: post
title: JExcelApi kódolás
date: '2010-03-07T14:23:00.000-08:00'
author: István Viczián
tags:
- jexcelapi
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Amikor ékezetes karaktereket olvastam Excel-ből
[JExcelApi](http://jexcelapi.sourceforge.net/) segítségével, másképp
működött Windows és Linux operációs rendszereket. Windows-on minden
működött, de Linux-on azon szövegeknél, amiben nem szerepelt ő és ű
betű, ott kérdőjel szerepelt.

Feltehetőleg úgy működik az Excel, hogy azon szavaknál, ahol nincs ő és
ű betű, a cp1250 kódolást használja, ahol van, ott az UTF-8-at.
Windows-on ez nem baj, mert cp1250-nel olvassa be, de Linux-nál az
alapértelmezettel, UTF-8-cal. Emiatt meg kell mondani, hogy amennyiben
nem talál kódolást, a cp1250-t használja. Megoldás:

    WorkbookSettings settings = new WorkbookSettings();
    settings.setEncoding("Cp1250");
    Workbook wb = Workbook.getWorkbook(new File(args[0]), settings);
