---
layout: post
title: JExcelAPI kivétel
date: '2009-10-07T17:04:00.000'
author: István Viczián
tags:
- java
modified_time: '2018-06-09T10:00:00.000-08:00'
---

Amikor a JExcelAPI-t használva be akartam tölteni egy fájlt, írni bele,
majd elmenteni, kivételt kaptam Linux-on (Windows-on tökéletesen
működött):

```
Caused by: java.lang.ArrayIndexOutOfBoundsException
at java.lang.System.arraycopy(Native Method)
at jxl.biff.StringHelper.getBytes(StringHelper.java:127)
at jxl.write.biff.WriteAccessRecord.&lt;init&gt;(WriteAccessRecord.java:60)
at jxl.write.biff.WritableWorkbookImpl.write(WritableWorkbookImpl.java:726)
```

A nyomozás azt derítette ki, hogy a write access hossza túl nagy volt,
bármit jelentsen is ez. Megoldás:

{% highlight java %}
WorkbookSettings workbookSettings = new WorkbookSettings();
workbookSettings.setWriteAccess("rövidnév");
WritableWorkbook w = Workbook.createWorkbook(out, template, workbookSettings);
{% endhighlight %}
