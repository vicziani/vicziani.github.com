---
layout: post
title: File.setWritable
date: '2009-08-28'
author: Viczián István
tags:
- Java
- Egyéb nyelvek

---

Java 1.6-ban megjelent a File.setWritable(boolean) és a
File.setWritable(boolean, boolean) metódus is. Amennyiben létrehozok egy
állományt Java-ból Linux-on, a következő permission-ökkel jön létre:

File.setWritable nélkül: -rw-r—r— (csak owner számára írható)

File.setWritable(false): -rw-r—r—

File.setWritable(true): -rw-r—r—

File.setWritable(true, true): -rw-r—r—

File.setWritable(true, false): -rw-rw-rw- (group és others számára is
írható)

A fájl létrehozása után hívjuk meg!
