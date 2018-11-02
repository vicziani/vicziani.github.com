---
layout: post
title: JavaMail API
date: '2009-08-29T11:57:00.000-07:00'
author: István Viczián
tags:
- javamail
- java
modified_time: '2018-06-09T10:00:00.000-08:00'
---

A JavaMail API 1.4.2-ben nincs metódus üzenet átmozgatására az egyik
folder-ből a másikba, helyette használandó a másolás, majd törlés:

folder.copyMessages

message.setFlag(Flags.Flag.DELETED,true);

Vigyázat, a POP3 csak az INBOX mappát ismeri, ott nem lehet ilyent.
