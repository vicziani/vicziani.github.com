import re

def findsignificantwords():
	words = []
	f = open('all.ics', 'r')
	for line in f:
		if line.find('SUMMARY') == 0 or line.find('DESCRIPTION') == 0:
			wordsofline = line.split()
			for wordofline in wordsofline:
				if wordofline[0].isupper() and not wordofline in words:
					words.append(wordofline)

	print words

def printsignificantwords(significantwords):
	words = re.findall(r'\w+', significantwords)
	words.sort()
	s = ""

	print " ".join(words)

significanthadoopwords = """
Accumulo Aerospike Ambari Avro Bigtop Cassandra CouchDB Crunch Drill 
Elasticsearch Falcon Flink Flume GemFire Greenplum HAWQ HBase HBase HDFS 
Hadoop Hermes Hive Hypertable IPython Ignite Impala Kafka Kappa Knox Kylin 
MADlib Magellan Marmotta Mesos Oozie Parquet Phoenix Pig R Samza Slider Solr 
Spark Storm Tachyon Tajo Tez Tika YARN Zeppelin"""

significantotherwords = """Consul Docker HTML5 Hazelcast Java Jenkins 
Kerberos OpenStack Python S3 SQL Scala Spring Tableau
"""

significantwords = []
significantwords = significantwords + re.findall(r'\w+', significanthadoopwords)
significantwords = significantwords + re.findall(r'\w+', significantotherwords)

f = open('all.ics', 'r')
counters = {}
for line in f:
	if line.find('SUMMARY') or line.find('DESCRIPTION') == 0:
		for significantword in significantwords:		
			if significantword.lower() in [s.lower() for s in re.findall(r'\w+', line)]:
				if not significantword in counters:
					counters[significantword] = 1
				else:
					counters[significantword] = counters[significantword] + 1

finalstring = ""
for key, value in counters.items():
	finalstring = finalstring + " " + " ".join([key] * value)

print finalstring
