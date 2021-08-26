---
layout: post
title: What every software engineer should know about databases - sources
excerpt: "What every software engineer should know about databases"
search_omit: false
---

<div markdown="block" class="pres-slide">
![Welcome screen](/images/blog/databases/db02.png)
</div>

<div markdown="block" class="pres-slide">
![Four database types](/images/blog/databases/db03.png)
</div>

<div markdown="block" class="pres-slide">
![Relational databases](/images/blog/databases/db04.png)
* [Relational database (Wikipedia)](https://en.wikipedia.org/wiki/Relational_database)
</div>

<div markdown="block" class="pres-slide">
![Relational schema](/images/blog/databases/db05.png)
* [Database normalization (Wikipedia)](https://en.wikipedia.org/wiki/Database_normalization)
</div>

<div markdown="block" class="pres-slide">
![SQL query](/images/blog/databases/db06.png)
* [modern-sql.com](https://modern-sql.com/) - latest features in SQL 
</div>

<div markdown="block" class="pres-slide">
![ACID in relational database](/images/blog/databases/db07.png)
* [ACID (Wikipedia)](https://en.wikipedia.org/wiki/ACID)
* M. Kleppmann, Designing Data-Intensive Applications, chapter 7. Transactions
</div>

<div markdown="block" class="pres-slide">
![Scalability](/images/blog/databases/db08.png)
* [Scalability (Wikipedia)](https://en.wikipedia.org/wiki/Scalability)
</div>

<div markdown="block" class="pres-slide">
![Reasons for scalability](/images/blog/databases/db09.png)
* <span><i> "There are various reasons why you might want to distribute a database across multiple machines: Scalability (data volume, read load, or write load) (...), 
Fault tolerance/high availability, (...), Latency (...)"</i><br />
M. Kleppmann, Designing Data-Intensive Applications, Part II. Distributed Data</span>
</div>

<div markdown="block" class="pres-slide">
![Vertical and horizontal scaling](/images/blog/databases/db10.png)
* [Scalability (Wikipedia)](https://en.wikipedia.org/wiki/Scalability)
</div>

<div markdown="block" class="pres-slide">
![Horizontal scaling](/images/blog/databases/db11.png)
* [Replication (wikipedia)](https://en.wikipedia.org/wiki/Replication_(computing))
* [Partitioning (wikipedia)](https://en.wikipedia.org/wiki/Partition_(database))
* M. Kleppmann, Designing Data-Intensive Applications, chapter 5. Replication
* M. Kleppmann, Designing Data-Intensive Applications, chapter 6. Partitioning
</div>

<div markdown="block" class="pres-slide">
![Partitioning and replication](/images/blog/databases/db12.png)
* <span><i>"Partitioning is usually combined with replication so that copies of each partition are stored on multiple nodes. This means that, even though each record belongs to exactly one partition, it may still be stored on several different nodes for fault tolerance.” </i> <br />M. Kleppmann, Designing Data-Intensive Applications, chapter 5. Replication </span>

</div>

<div markdown="block" class="pres-slide">
![Can relational database scale vertically?](/images/blog/databases/db13.png)
* [Scaling Your Amazon RDS Instance Vertically and Horizontally](https://aws.amazon.com/blogs/database/scaling-your-amazon-rds-instance-vertically-and-horizontally/)
</div>

<div markdown="block" class="pres-slide">
![Can relational database scale horizontally?](/images/blog/databases/db14.png)

Replication:
* <span>[Scaling Your Amazon RDS Instance Vertically and Horizontally](https://aws.amazon.com/blogs/database/scaling-your-amazon-rds-instance-vertically-and-horizontally/)<br />(note that the horizontal part is only about replication)</span>
* [High Availability, Load Balancing, and Replication in PostgreSQL](https://www.postgresql.org/docs/current/high-availability.html)

Partitioning:
* [Sharding in Oracle Database](https://docs.oracle.com/en/database/oracle/oracle-database/21/shard/oracle-sharding-architecture-and-concepts1.html#GUID-9DC0048A-2D6E-4759-BA80-10F8855E6871)
* [Limitation in Oracle Database sharding](https://docs.oracle.com/en/database/oracle/oracle-database/21/shard/supported-dmls-and-examples.html#GUID-128B938E-D931-4D47-B75D-5F979FE90E14)
* [Citus](https://www.citusdata.com/product/community) - an extension to PostgreSQL that adds partitoning
* [MySQL sharding approaches? (Stack Overflow)](https://stackoverflow.com/questions/5541421/mysql-sharding-approaches)
</div>

<div markdown="block" class="pres-slide">
![Relational databases summary](/images/blog/databases/db15.png)
</div>

<div markdown="block" class="pres-slide">
![Wide-column stores](/images/blog/databases/db16.png)

* <span><i>"Traditionally  production  systems  store  their  state  in  relational  databases. For many of the more common usage patterns of state persistence, however, a relational database is a solution that is far from ideal. (...) Although  many advances have been made in the recent years, it is still not easy to  scale-out  databases  or  use  smart  partitioning  schemes  for  load balancing."</i><br />
[2007 Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)
</span> 
* [Wide-column store (Wikipedia)](https://en.wikipedia.org/wiki/Wide-column_store)
* [2006 Bigtable paper](https://static.googleusercontent.com/media/research.google.com/pl//archive/bigtable-osdi06.pdf)
* [Google Bigtable](https://cloud.google.com/bigtable/)

</div>

<div markdown="block" class="pres-slide">
![Wide-column store schema](/images/blog/databases/db17.png)

* <span><i>Apache Cassandra stores data in tables, with each table consisting of rows and columns. CQL (Cassandra Query Language) is used to query the data stored in tables. Apache Cassandra data model is based around and optimized for querying. Cassandra does not support relational data modeling intended for relational databases.</i><br />
[Cassandra documentation - Introduction to Data Modeling](https://cassandra.apache.org/doc/latest/cassandra/data_modeling/intro.html)</span>
* [Storage model in Bigtable](https://cloud.google.com/bigtable/docs/overview#storage-model)

</div>

<div markdown="block" class="pres-slide">
![db19](/images/blog/databases/db19.png)
* [NoSQL Design for DynamoDB](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/bp-general-nosql-design.html)
* [Designing schema in Bigtable](https://cloud.google.com/bigtable/docs/schema-design)
* [Data modeling in Cassandra](https://cassandra.apache.org/doc/latest/cassandra/data_modeling/data_modeling_rdbms.html)
</div>

<div markdown="block" class="pres-slide">
![Partition key and sort key](/images/blog/databases/db21.png)
* [Partition key and sort key in DynamoDB](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.CoreComponents.html#HowItWorks.CoreComponents.PrimaryKey)
* [Partition key in Cassandra](https://cassandra.apache.org/doc/latest/cassandra/cql/ddl.html#partition-key)
</div>

<div markdown="block" class="pres-slide">
![Wide-column store schema with attributes](/images/blog/databases/db21b.png)
* [Writing data to table in DynamoDB](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/SQLtoNoSQL.WriteData.html)
* [Single-Table Design with DynamoDB](https://www.alexdebrie.com/posts/dynamodb-single-table/)
</div>

<div markdown="block" class="pres-slide">
![Know your access patterns](/images/blog/databases/db22.png)
* [Advanced Design Patterns for DynamoDB (YouTube)](https://www.youtube.com/watch?v=HaEPXoXVf2k)
* [Defining application queries in Cassandra](https://cassandra.apache.org/doc/4.0/cassandra/data_modeling/data_modeling_queries.html)
</div>

<div markdown="block" class="pres-slide">
![db23](/images/blog/databases/db23.png)
* [Martin Fowler, Introduction to NoSQL, NoSQL and consistency (YouTube)](https://www.youtube.com/watch?v=qI_g07C_Q5I&t=1547s)
* [Read consistency in DynamoDB](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.ReadConsistency.html)
* [Tunable consistency in Cassandra](https://cassandra.apache.org/doc/4.0/cassandra/architecture/dynamo.html#tunable-consistency)
</div>

<div markdown="block" class="pres-slide">
![Wide-column stores summary](/images/blog/databases/db24.png)
</div>

<div markdown="block" class="pres-slide">
![Document databases](/images/blog/databases/db31.png)
* [Document-oriented database (Wikipedia)](https://en.wikipedia.org/wiki/Document-oriented_database)
</div>

<div markdown="block" class="pres-slide">
![Documents](/images/blog/databases/db25.png)
* [Documents in MongoDB](https://docs.mongodb.com/manual/core/document/)
</div>

<div markdown="block" class="pres-slide">
![Collections](/images/blog/databases/db26.png)
* [Collections in MongoDB](https://docs.mongodb.com/manual/core/databases-and-collections/)
* [Indexes in Elasticsearch](https://www.elastic.co/guide/en/elasticsearch/reference/master/documents-indices.html)
</div>

<div markdown="block" class="pres-slide">
![Aggregation framework](/images/blog/databases/db27.png)
* [Aggregation in Elasticsearch](https://docs.mongodb.com/manual/aggregation/)
* [Aggregation in MongoDB](https://docs.mongodb.com/manual/aggregation/)

</div>

<div markdown="block" class="pres-slide">
![Replication and partitioning](/images/blog/databases/db28.png)
* [Sharding in MongoDB](https://docs.mongodb.com/manual/sharding/)
* [Replication in CouchDB](https://docs.couchdb.org/en/stable/replication/index.html)
* [Scalability in Elasticsearch](https://www.elastic.co/guide/en/elasticsearch/reference/current/scalability.html)
</div>

<div markdown="block" class="pres-slide">
![ACID?](/images/blog/databases/db29.png)
* [ACID in MongoDB](https://www.mongodb.com/basics/transactions)
* [Transactions in MongoDB](https://docs.mongodb.com/manual/core/transactions/)
* [Consistency in CouchDB](https://docs.couchdb.org/en/stable/intro/consistency.html)
</div>

<div markdown="block" class="pres-slide">
![Document databases - ideal?](/images/blog/databases/db30.png)
* <span><i>Mongo hits a sweet spot between the powerful queryability of a relational database and the distributed nature of other databases, like HBase. Project founder Dwight Merriman has said that MongoDB is the database he wishes he’d had at DoubleClick, where as the CTO he had to house large-scale data while still being able to satisfy ad hoc queries.</i><br />
Luc Perkins, Seven Databases in Seven Weeks 
</span>
* [Was MongoDB ever the right choice?](https://www.simplethread.com/was-mongodb-ever-the-right-choice/)
* [Everything You Know About MongoDB is Wrong!, Myth 5. Sharding](https://www.mongodb.com/developer/article/everything-you-know-is-wrong/#myth-5--mongodb-is-all-about-sharding)
</div>

<div markdown="block" class="pres-slide">
![Document databases summary](/images/blog/databases/db32.png)
</div>

<div markdown="block" class="pres-slide">
![OLTP](/images/blog/databases/db33.png)
* [OLTP (Wikipedia)](https://en.wikipedia.org/wiki/Online_transaction_processing)
</div>

<div markdown="block" class="pres-slide">
![OLAP](/images/blog/databases/db34.png)
* [OLAP (Wikipedia)](https://en.wikipedia.org/wiki/Online_analytical_processing)
</div>

<div markdown="block" class="pres-slide">
![Data warehouses](/images/blog/databases/db35.png)
* [Data warehouse (Wikipedia)](https://en.wikipedia.org/wiki/Data_warehouse)
</div>

<div markdown="block" class="pres-slide">
![ETL](/images/blog/databases/db36.png)
* [Extract, transform, load (Wikipedia)](https://en.wikipedia.org/wiki/Extract,_transform,_load)
</div>

<div markdown="block" class="pres-slide">
![Relational databases vs data warehouses](/images/blog/databases/db37.png)
* [Amazon Redshift and PostgreSQL](https://docs.aws.amazon.com/redshift/latest/dg/c_redshift-and-postgres-sql.html)
</div>

<div markdown="block" class="pres-slide">
![Row-oriented databases](/images/blog/databases/db38.png)
* [Row-oriented systems (Wikipedia)](https://en.wikipedia.org/wiki/Column-oriented_DBMS#Row-oriented_systems)
</div>

<div markdown="block" class="pres-slide">
![Column-oriented databases](/images/blog/databases/db39.png)
* [Column-oriented systems (Wikipedia)](https://en.wikipedia.org/wiki/Column-oriented_DBMS#Column-oriented_systems)
* [cstore_fdw - columnar storage extension for PostgreSQL](https://github.com/citusdata/cstore_fdw)
* [A Billion Taxi Rides in PostgreSQL](https://tech.marksblogg.com/billion-nyc-taxi-rides-postgresql.html)
</div>

<div markdown="block" class="pres-slide">
![Wide-column stores vs column-oriented databases](/images/blog/databases/db40.png)
* [List of column-oriented DBMSes (Wikipedia)](https://en.wikipedia.org/wiki/List_of_column-oriented_DBMSes)
* [Is Cassandra a column oriented or columnar database? (Stackoverflow)](https://stackoverflow.com/questions/25441921/is-cassandra-a-column-oriented-or-columnar-database)
* [How is Cassandra a columnar database? (Quora)](https://www.quora.com/How-is-Cassandra-a-columnar-database)
</div>

<div markdown="block" class="pres-slide">
![Data warehouses summary](/images/blog/databases/db41.png)
</div>

<div markdown="block" class="pres-slide">
![Houlihan's triangle](/images/blog/databases/db42.png)
* [NoSQL Optimization with Rick Houlihan](https://softwareengineeringdaily.com/2020/01/09/nosql-optimization-with-rick-houlihan/)
</div>

<div markdown="block" class="pres-slide">
![Things I didn't mention](/images/blog/databases/db43.png)
</div>

<div markdown="block" class="pres-slide">
![Distributed relational databases](/images/blog/databases/db44.png)
* [What is Cloud Spanner?](https://cloud.google.com/blog/topics/developers-practitioners/what-cloud-spanner)
* [Living Without Atomic Clocks](https://www.cockroachlabs.com/blog/living-without-atomic-clocks/)
</div>

<div markdown="block" class="pres-slide">
![Graph databases](/images/blog/databases/db45.png)
* [Graph database (Wikipedia)](https://en.wikipedia.org/wiki/Graph_database)
</div>

<div markdown="block" class="pres-slide">
![Key-value databases](/images/blog/databases/db46.png)
* [Key–value database (Wikipedia)](https://en.wikipedia.org/wiki/Key%E2%80%93value_database)
</div>

<div markdown="block" class="pres-slide">
![Time series databases](/images/blog/databases/db47.png)
* [Time series database (Wikipedia)](https://en.wikipedia.org/wiki/Time_series_database)
</div>

<div markdown="block" class="pres-slide">
![db48](/images/blog/databases/db48.png)
</div>

<div markdown="block" class="pres-slide">
![db49](/images/blog/databases/db49.png)
</div>
