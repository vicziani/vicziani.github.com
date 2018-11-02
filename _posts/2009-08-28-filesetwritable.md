---
layout: post
title: File.setWritable
date: '2009-08-28T09:46:00.000-07:00'
author: István Viczián
tags:
- java
modified_time: '2018-06-09T10:00:00.000-08:00'
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
