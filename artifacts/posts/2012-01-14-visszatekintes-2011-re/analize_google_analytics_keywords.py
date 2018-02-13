# coding=UTF-8

import sys
import os
import codecs
from collections import defaultdict

words = defaultdict(int)
syns = {"viczian": "viczián", "istvan": "istván", "konyv": "könyv", "alkalmazas": "alkalmazás", "java2": "java"}

for filename in os.listdir("."):
  if filename.startswith("Analytics_jtechlog.blogspot.com"):
    f = codecs.open(filename, encoding='utf-8', mode='r')
    i = 0;
    for line in f:
      if (i >= 8):
        if (line.startswith("\"")):
          continue
        try:
          tokens = line.split(",")
          #print(filename)
          #print(i)
          #print(tokens)
          #print("\n")
          keyword = tokens[0]
          #print(keyword)
          visits = int(tokens[1])
          for word in keyword.split(" "):
            if (word in syns):
              print("Syn found: " + word)
              word = syns[word].decode("UTF-8")
            words[word] += visits
        except:
          print(keyword)
      i += 1

resf = codecs.open('result.txt', encoding='utf-8', mode='w+')

omitted = ["6", "5.0", "a", "az", "és".decode("UTF-8"), "mi", "site:jtechlog.blogspot.com"]
th = 500
low = 30

for key in words:
  if (key not in omitted):
    c = words[key]    
    if (c > th):
      print(key + " >" + str(th))
      c = th
    if (c > low):
      try:
        resf.write((key + " ") * c)
      except:
        print("Hiba" + key);
  