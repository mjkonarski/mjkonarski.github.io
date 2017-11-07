---
layout: post
title: Advanced SQL - window functions
date: 2017-11-10 08:00:00 +0000
published: true
---

This post starts a series of articles discussing advanced SQL concepts that are well supported in popular database management systems for quite some time, but somehow many people still don’t know about their existence. I'd like to explain them on examples, first giving a problem to solve using "plain old" SQL and then showing a better solution using advanced SQL.

First feature that I’d like to present are **window functions**.

In this article I'll be using PostgreSQL 10, because it's the most feature-rich open source database available. 10 is the just released version, but window functions have been available since 8.4, so any modern version will be fine.

### The problem

 As I promised, let’s start with a problem. We'll be working on a very simple one-table database. The table contains information about films and stores their titles, years they were released in, ID of a category and their ratings according to some imaginary movie database:

![Films table schema](/images/blog/advanced-sql-window-functions/films_schema.svg){: .center-image }
*Films table schema*
![Input rows](/images/blog/advanced-sql-window-functions/input-rows.svg){: .center-image }
*Input rows*

Here comes the task:

##### Example 1. For each film select an average rating for all films released in the same year.

The result should look like this. All films released in the same year have the same average:

![Result rows with year_avg](/images/blog/advanced-sql-window-functions/result-rows-1.svg){: .center-image }
*Result rows with year's average*

Stop here for a second and think how would you tackle that problem using plain old SQL concepts like `JOIN`, `GROUP BY` and other things that come to your mind. There are at least few possible solutions.

One of the them is to use a subquery computing averages for all distinct years and joining them back with the query fetching all films:

```sql
SELECT
  f.title, f.release_year, f.rating, years.year_avg
FROM films f
LEFT JOIN (
  SELECT f.release_year, rating AS year_avg
  FROM films f
  GROUP BY f.release_year
) years ON f.release_year = years.release_year
```

Doesn't look very complicated, does it? What don't why solve one more problem then?

##### Example 2. For each film select average scores within its year and category.

And I’m expecting the following. Again, the same categories have equal values:

![Result rows with year_avg and category_avg](/images/blog/advanced-sql-window-functions/result-rows-2.svg){: .center-image }
*Result rows with year's and category's averages*

Again, looks easy. We just have to count the category averages in a similar way and join them together with the previous query:

```sql
SELECT
  f.title, f.release_year, f.rating,
  years.year_avg, categories.category_avg
FROM films f
LEFT JOIN (
  SELECT f.release_year, AVG(rating) AS year_avg
  FROM films f
  GROUP BY f.release_year
) years ON f.release_year = years.release_year
LEFT JOIN (
  SELECT f.category_id, AVG(rating) AS category_avg
  FROM films f
  GROUP BY f.category
) categories ON f.category_id = categories.category_avg
```

This is right. But you may also notice that our query grows bigger and bigger. It takes some time to read this and realize what exactly are we joining.

Please notice also a pattern here: we select a set of rows from a table and then join it with aggregated versions of the same row set. But we can’t just use the `GROUP BY` in the main query because want to get the full list of films as a result. Thus we have to copy-paste the main query to each subquery. Just imagine what if the main query would be complicated itself with a lot of joins, where clauses or even its own grouping… Ideally we’d like to have a way to do some computations on a row set, but not altering it at the same time.

And this is exactly what **window functions** are about.

### The solution - window functions

PostgreSQL documentation has a nice definition of what window functions are:

> A window function performs a calculation across a set of table rows that are somehow related to the current row. This is comparable to the type of calculation that can be done with an aggregate function. However, window functions do not cause rows to become grouped into a single output row like non-window aggregate calls would. Instead, the rows retain their separate identities.

In other words window functions allow to get aggregated results without actually making the result set aggregated. Let’s see how they work in practice.

A simplified syntax looks like this:

```sql
SELECT
function_name OVER ( window_definition )
FROM (...)
```
`window_definition` defines the set of rows that the current row is related to (I'm going to call it "a window") and `function_name` specifies the function that we’re gonna use to aggregate rows in each window.

Let’s get back to the initial problem, where we needed to calculate year's average for each film. The solution using window functions is much simpler:

```sql
SELECT
  f.title, f.release_year, f.score,
  AVG(score) OVER (PARTITION BY release_year) AS year_avg,
FROM films
```

The window here is defined by a `PARTITION BY` clause. It instructs the database to divide the row set into smaller parts, partitions, putting all rows with same `release_year` together. Then for each partition it runs the aggregation function `AVG(score)` to get the result and add it as a new column to each row.

![Partitioning](/images/blog/advanced-sql-window-functions/partitioning.svg){: .center-image }
*Window functions partitioning*

As you can see all input rows are transfered to the result set, safe and sound. Additionally, any condition that we set on a main query applies to a window functions input also. In other words if we had added a `WHERE` clause filtering out some rows, these rows would have been also missing from a window function computation.

Window functions are a powerful feature. We can choose from a wide range of functions to use and ways to define windows. I’ll mention just few interesting possibilities here.

##### Example 3. For each film find its ranking position within corresponding year.

![Result rows with year's ranking position](/images/blog/advanced-sql-window-functions/result-rows-rank.svg){: .center-image }
*Result rows with year's ranking position*

This task is different, because each row has now a distinct value within a partition - its position according to the ranking. To solve this we have to use of the order-aware functions - `RANK()`:

```sql
SELECT
 f.title, f.release_year, f.rating,
 RANK() OVER (PARTITION BY release_year ORDER BY rating DESC) AS year_rank
FROM films f
```

`RANK()` returns the position of a row within a window (with appropriate gaps when two or more rows have the same rank). To make it possible we had not only to partition the row set by a release year, but also to ensure that the rows inside each partition are sorted properly (otherwise we would get just rubbish). That's why we used the `ORDER BY` clause.

##### Example 4. For each film find its general ranking position.

![Result rows with general ranking position](/images/blog/advanced-sql-window-functions/result-rows-general-rank.svg){: .center-image }
*Result rows with general ranking position*

It's also possible to have the `ORDER BY` without `PARTITION BY`:

```sql
SELECT
 f.title, f.release_year, f.rating,
 RANK() OVER (ORDER BY rating DESC) AS general_rank
FROM films
```

This way we instructed the database to create one big partition with all rows. It useful when we want to operate on the whole row set altogether.

##### Example 5. For each film find the rating of the best film in its year.

![Result rows with year's best rating](/images/blog/advanced-sql-window-functions/result-rows-best-rating.svg){: .center-image }
*Result rows with year's best rating*

```sql
SELECT
 f.title, f.release_year, f.rating,
 FIRST_VALUE(title) OVER (PARTITION BY category_id ORDER BY rating DESC)
FROM films f
```

In the above query I used a new function `FIRST_VALUE()` which returns the requested value of the first row in a window. There are also other similar functions like `LAST_VALUE()` or `NTH_VALUE()`. What's worth mentioning here it's possible to change the boundaries of a window, so that it doesn't contain the whole partition. This can be done by using `RANGE` or `ROWS` clause. This syntax is more complicated though and has some limitations in Postgres, so I don’t want to get into details here.

### Window functions - are they useful?

I think so. They are my personal favourite advanced SQL feature. They simply allow to do aggregations without aggregating the result set. PostgreSQL and other databases offer a wide variety of different functions and options to specify the exact subset of rows we’d like to operate on. They are a flexible way to create sophisticated SQL queries, that otherwise would need to be long, complicated and hard to read and maintain.

Window functions were introduced in SQL 2003. Quite some time ago. Therefore, almost all popular RDBMSes implement them at least to some extent. The only exceptions are MySQL and SQLite. When it comes to MySQL however, it has been announced that the upcoming version 8.0 will support window functions.

Even that window functions are often considered as “advanced SQL”, I believe that they are something that every SQL-oriented software developer should be familiar with.
