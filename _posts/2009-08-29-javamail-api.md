---
layout: post
title: JavaMail API
date: '2009-08-29'
author: István Viczián
tags:
- Java
- Egyéb nyelvek

---

A JavaMail API 1.4.2-ben nincs metódus üzenet átmozgatására az egyik
folder-ből a másikba, helyette használandó a másolás, majd törlés:

folder.copyMessages

message.setFlag(Flags.Flag.DELETED,true);

Vigyázat, a POP3 csak az INBOX mappát ismeri, ott nem lehet ilyent.
