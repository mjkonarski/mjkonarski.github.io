---
layout: post
title: Advanced SQL - window frames
excerpt: Deep dive into more advanced use of window functions with window frames
date: 2019-09-16 08:00:00 +0000
published: true
---

This article is a part of my series of articles discussing advanced SQL concepts that are supported by popular databases for quite some time, but are not very well known by database users. My idea is to explain them in simple terms, with examples.

What you’re reading is a continuation of my [post](/advanced-sql-window-functions/) published almost two years ago describing one of the most powerful features of modern SQL - **window functions**. It allows to perform calculations across a set of related rows, without actually grouping these rows together. In this article, I’m going to focus on an important aspect of window functions, which make them even more flexible and useful - **window frames**.

Window frames have been a part of the SQL standard for some time now. All popular database systems [support them to some extent](https://data-xtractor.com/blog/query-builder/window-functions-support/), but none of them has all features implemented. PostgreSQL is currently [a leader in this field](https://modern-sql.com/blog/2019-02/postgresql-11#over). Its latest version 11 introduced most of the window frames related features described by the standard. Therefore I’ll be using it throughout this article. 

### Window functions - a quick recap

Let’s start with a quick reminder about what window functions are. Let’s say that we’re working with the following table:

![Table schema](/images/blog/advanced-sql-window-frames/films-schema.svg){: .center-image }
*Table schema*  

![Input rows](/images/blog/advanced-sql-window-frames/input-rows.svg){: .center-image }
*Input rows*  

Now we have the following task to solve:

##### For each film find an average rating of all films in its release year.

![Result rows with year_avg](/images/blog/advanced-sql-window-frames/result-rows-year-avg.svg){: .center-image }

To solve this problem we have to aggregate the input rows. We need to take rows belonging to the same year, then group them and compute an average for every group. This can be easily done with `GROUP BY` statement, but in the result set we’d get just one row for every `release_year`. The output set should contain an additional column, but the same number of rows as the input set. This is a job for a window function:

```sql
SELECT
 f.id, f.release_year, f.rating,
 AVG(rating) OVER (PARTITION BY release_year) AS year_avg
   FROM films f ORDER BY release_year, rating
```

The above code (`PARTITION BY release_year`) instructs the database engine to divide the input rows into disjoint sets called partitions, using the `release_year` column. Each partition receives only the rows that have the same value of `release_year`. Then, by using an aggregate function `AVG(rating)`, we tell the database engine how to calculate the final result for each partition. This diagram below presents the whole operation:

![Partitioning](/images/blog/advanced-sql-window-frames/partitioning.svg){: .center-image }
*Window functions partitioning*

Now, let’s complicate our initial problem a little bit:

##### For each film find an average rating of all strictly better films in its release year.

![Result rows with avg_of_better](/images/blog/advanced-sql-window-frames/result-rows-avg-better.svg){: .center-image }

It’s clear that now we also need to divide the rows into `release_year` partitions. But the calculation of average needs to be done only on a subset of a partition. The subset needs to be different for every row - we need to consider rows that have a greater value in the `rating` column only. Partitions are exactly the same for every row they contain, so they will not help us achieve this effect. We need something more powerful.

### Window frames

Window frames are a feature that allows us to divide partitions into smaller subsets. What’s even more important, these subsets can differ from a row to row. This is something that can’t be achieved with partitioning only. For example, we can have window frames that contain all the rows with the same or greater value in a given column: 

![Window frames](/images/blog/advanced-sql-window-frames/window-frames.svg){: .center-image }
*Mechanism of creating window frames*

SQL gives us many ways to specify which rows should be included in window frames. In the next paragraphs I will describe all these ways in detail.

#### Syntax

A general (and [much simplified](https://www.postgresql.org/docs/11/sql-expressions.html#SYNTAX-WINDOW-FUNCTIONS)) format of a window function call is:

```sql
function_name OVER (PARTITION BY ... ORDER BY ... frame_clause)
```

`frame_clause` is the part that defines window frames. It looks as follows:

```sql
mode BETWEEN frame_start AND frame_end [ frame_exclusion ]
```

This syntax can be divided into three sections:

* ***mode*** sets the way a database engine treats input rows. There are three possible values: `ROWS`, `GROUPS` or `RANGE`.
* ***frame_start*** and ***frame_end*** define where a window frame starts and where it ends.
* ***frame_exclusion*** can be used to specify parts of a window frame that have to be excluded from the calculations.

It’s important to remember is that window frames are constructed for every single input row separately, so their content can differ from row to row. Therefore it’s essential to consider a window frame with regard to the row that that frame is built for. We’ll call it **the current row**.

What is also usually crucial is to specify the order in which rows appear in a window frame. In most cases the exact position of the current row compared to other rows will have a direct impact on the content of a frame. Therefore it’s always safe to assume that if you want to use window framing you need to have the rows sorted consistently. It can be done by adding an `ORDER BY` clause to a window function call. 

All the following examples have the rows sorted by the `rating` column in ascending order.

### Window frame modes

#### Rows mode

The `ROWS` mode is the simplest one. It instructs the database to treat each input row separately, as an individual entity:

![Window frames](/images/blog/advanced-sql-window-frames/rows-mode.svg){: .center-image }
*ROWS mode*

In the `ROWS` mode ***frame_start*** and ***frame_end*** allow us to specify which rows the window frame starts and ends with. They accept the following values:

* `UNBOUNDED PRECEDING` - (possible only in ***frame_start***) start with the first row of the partition
* `offset PRECEDING` - start/end with a given number of rows before the current row
* `CURRENT ROW` - start/end with the current row
* `offset FOLLOWING` - start/end with a given number of rows after the current row
* `UNBOUNDED FOLLOWING` - (possible only as a ***frame_end***) end with the last row of the partition

Let’s take a look at some examples. Remember that it’s crucial to know which row is **the current row**, because for different rows the window frame can look differently. All the figures below present how the frame looks like for a single, chosen input row.

This is a do-nothing option. It simply selects all rows from the beginning of the partition to the end:

```sql
ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
```
![UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING](/images/blog/advanced-sql-window-frames/rows-unbound-preceding-unbound-following.svg){: .center-image }

Let’s do something more interesting. In the example below we start with the beginning of the partition, but end with the current row. This is where the order of rows starts to matter:

```sql
ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
```
![ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW](/images/blog/advanced-sql-window-frames/rows-unbound-preceding-current-row.svg){: .center-image }


Now we start with the first row before the current row and end with the first row after the current row:

```sql
ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING
```

![ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING](/images/blog/advanced-sql-window-frames/rows-1-preceding-1-following.svg){: .center-image }

It’s not mandatory to include the current row though. In the example below we start and end before the current row:

```sql
ROWS BETWEEN 3 PRECEDING AND 1 PRECEDING
```

![ROWS BETWEEN 3 PRECEDING AND 1 PRECEDING](/images/blog/advanced-sql-window-frames/rows-3-preceding-1-preceding.svg){: .center-image }

We can do more interesting things using the ***frame_exclusion*** part. 

***frame_exclusion*** allows to exclude some specific rows from the window frame, even if they would be included according to the ***frame_start*** and ***frame_end*** options. What’s worth mentioning is that ***frame_exclusion*** works exactly the same regardless of the selected mode. Possible values are:

* `EXCLUDE CURRENT ROW` - exclude the current row.
* `EXCLUDE GROUP` - exclude the current row and all peer rows, i.e rows that have the same value in the sorting column.
* `EXCLUDE TIES` - exclude all rows that have the same value in the sorting column, but not the current row.
* `EXCLUDE NO OTHERS` - exclude nothing. This is the default option in case you omit the ***frame_exclusion*** part altogether.

Here are the examples.

Select all rows from the beginning of the partition to the end of the partition, but exclude the current row:

```sql
ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING EXCLUDE CURRENT ROW
```

![ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING EXCLUDE CURRENT ROW](/images/blog/advanced-sql-window-frames/rows-unbouned-preceding-unbounded-following-exclude-current-row.svg){: .center-image }

The rest of ***frame_exclusion*** options become interesting only in the case when the partition has duplicate values in the sorting column. I haven’t included them in the examples above on purpose, because there’s an important caveat when the `ROWS` mode is used together with sorting duplicates.  In that case, the rows with duplicated sorting values are processed in an unspecified order, so it’s not deterministic what are their relative positions. This can lead to incorrect results when `offset PRECEDING` and `offset FOLLOWING` clauses are specified. The next section will explain the rest of the frame_exclusion options.

#### Groups mode

`GROUPS` mode is made exactly for the case when the sorting column contains duplicates. Therefore in this paragraph I’ll use a sample of input rows that contains duplicates. In the `GROUPS` mode rows that with duplicate sorting values are grouped together: 

![Window frames](/images/blog/advanced-sql-window-frames/groups-mode.svg){: .center-image }
*GROUPS mode*

The syntax looks as follows:

```sql
GROUPS BETWEEN frame_start AND frame_end [ frame_exclusion ]
```

The ***frame_start*** and ***frame_end*** parameters accept the same options as in `ROWS` mode, but the meaning of some of them differ:

* `UNBOUNDED PRECEDING` and `UNBOUNDED FOLLOWING` work the same and mean either the first row or the last row of the current partition.
* `offset PRECEDING` and `offset FOLLOWING` now work with regard to groups. You can use them to specify a number of groups before or after the current group to be taken into account.
* `CURRENT ROW` also gets a different meaning, which might seem a bit misleading. When used as ***frame_start*** it means the first row in a group containing the current row. When used as ***frame_end*** it means the last row in a group containing the current row. 

As always it’s best to look at the examples.

Let’s start with a default option. It simply includes all partition rows:

```sql
GROUPS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
```

![GROUPS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING](/images/blog/advanced-sql-window-frames/groups-between-unbounded-preceding-and-unbounded-following.svg){: .center-image }

The example below shows the real power of the GROUPS mode. We start with the first row in the partition, but we want to include the whole current group:

```sql
GROUPS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
```

![GROUPS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW](/images/blog/advanced-sql-window-frames/groups-between-unbounded-preceding-and-current-row.svg){: .center-image }

In the case of any duplicates we can be sure that all of them will be either included or excluded from the calculation. 


The example below is symmetrical. Here we start with the current group and end at the end of the partition. As you can see, the meaning of `CURRENT ROW` changes depending on whether it used to define a beginning or an end of the window frame. Once again, however, all duplicates are included:

```sql
GROUPS BETWEEN CURRENT ROW AND UNBOUNDED FOLLOWING
```

![GROUPS BETWEEN CURRENT ROW AND UNBOUNDED FOLLOWING](/images/blog/advanced-sql-window-frames/groups-between-current-row-and-unbounded-following.svg){: .center-image }

Now, let’s include other groups too. In the below example we start with the first group before the current group and end with the first group after the current group: 

```sql
GROUPS BETWEEN 1 PRECEDING AND 1 FOLLOWING
```

![GROUPS BETWEEN 1 PRECEDING AND 1 FOLLOWING](/images/blog/advanced-sql-window-frames/groups-between-1-preceding-and-1-following.svg){: .center-image }

We can make it more complicated by using frame exclusions. For example, the statement below gives us the same result as above, but with the current group excluded:

```sql
GROUPS BETWEEN 1 PRECEDING AND 1 FOLLOWING EXCLUDE GROUP
```

![GROUPS BETWEEN 1 PRECEDING AND 1 FOLLOWING](/images/blog/advanced-sql-window-frames/groups-between-1-preceding-and-1-following-exclude-group.svg){: .center-image }

Here we exclude not the whole current group, but only the current row:

```sql
GROUPS BETWEEN 1 PRECEDING AND 1 FOLLOWING EXCLUDE CURRENT ROW
```

![GROUPS BETWEEN 1 PRECEDING AND 1 FOLLOWING EXCLUDE CURRENT ROW](/images/blog/advanced-sql-window-frames/groups-between-1-preceding-and-1-following-exclude-current-row.svg){: .center-image }


In the last example we exclude ties, i.e all peer rows, but we leave the current row intact:

```sql
GROUPS BETWEEN 1 PRECEDING AND 1 FOLLOWING EXCLUDE TIES
```

![GROUPS BETWEEN 1 PRECEDING AND 1 FOLLOWING EXCLUDE CURRENT ROW](/images/blog/advanced-sql-window-frames/groups-between-1-preceding-and-1-following-exclude-ties.svg){: .center-image }

#### Range mode

`RANGE` mode is different from the previous two, because it doesn’t tie the rows together in any way. It instructs the database work on a given range of values instead. The values that it looks at are the values of the sorting column. Postgres imposes a requirement, that in this mode you can put only one column in the `ORDER BY` clause.

The syntax is as follows:

```sql
RANGE BETWEEN frame_start AND frame_end [ frame_exclusion ]
```

Instead of specifying the number of rows or groups, here we have to specify the maximum difference of values that the window frame should comprise. Both ***frame_start*** and ***frame_end*** have to be expressed in the same units as the sorting column is.

Let’s look at some examples. 

In the below one we want to include all rows which sorting values differ no more than by 0.5 from the current row. The boundaries are inclusive, which means that the rows that differ by exactly 0.5 will be taken into consideration:

```sql
RANGE BETWEEN 0.5 PRECEDING AND 0.2 FOLLOWING
```

![GROUPS BETWEEN 1 PRECEDING AND 1 FOLLOWING EXCLUDE CURRENT ROW](/images/blog/advanced-sql-window-frames/ranges-between-05-and-02.svg){: .center-image }

We can also mix the range with `CURRENT ROW`, which means *the current group*. The effect is similar to what we saw in `GROUPS` mode. Again, all duplicates are included:

```sql
RANGE BETWEEN 0.5 PRECEDING AND CURRENT ROW
```

![RANGE BETWEEN 0.5 PRECEDING AND CURRENT ROW](/images/blog/advanced-sql-window-frames/ranges-between-05-and-current-row.svg){: .center-image }

Frame exclusion options will work exactly the same as in the other modes. For example, to exclude the current row:

```sql
RANGE BETWEEN 0.5 AND CURRENT ROW EXCLUDE CURRENT ROW
```

![RANGE BETWEEN 0.5 PRECEDING AND CURRENT ROW](/images/blog/advanced-sql-window-frames/ranges-between-05-and-current-row-exclude-current-row.svg){: .center-image }

### Real-world examples

Now, it’s finally time to do some realistic examples (or at least as close to being realistic as possible). Let’s start with the problem I mentioned at the beginning of the article. For the sake of simplicity, I have slightly modified the input set - now it contains films released in one year only.

#### Example 1. For each film find an average rating of all strictly better films in its release year.

![Result rows with average ratings of better films](/images/blog/advanced-sql-window-frames/result-rows-1.svg){: .center-image }
*Result rows with average ratings of better films*

Because it’s a real-world example we can’t just assume that the input set will not contain duplicates in the rating column. Therefore using `ROWS` mode would give us a correct result. We have to choose `GROUPS` mode instead.

What we need here is all the films that are *strictly better* than the current one. We need to exclude the current row and all others that are rated the same as the current row, regardless of the order they come in. 

To achieve that we should start with the first row in the group after the current group and finish at the end of the partition:

```sql
SELECT
 f.id, f.release_year, f.category_id, f.rating,
 AVG(rating) OVER (PARTITION BY release_year ORDER BY rating 
   GROUPS BETWEEN 1 FOLLOWING AND UNBOUNDED FOLLOWING) 
AS avg_of_better
FROM films f 
ORDER BY release_year, rating;
```

Of course, there are many correct solutions. We can also start with the current group and exclude it:

```sql
SELECT
 f.id, f.release_year, f.category_id, f.rating,
 AVG(rating) OVER (PARTITION BY release_year ORDER BY rating 
   GROUPS BETWEEN CURRENT ROW AND UNBOUNDED FOLLOWING EXCLUDE GROUP)
AS avg_of_better
FROM films f 
ORDER BY release_year, rating;
```

#### Example 2. How many other films have the same rank as me?

![Result rows with a count of equally rated films](/images/blog/advanced-sql-window-frames/result-rows-2.svg){: .center-image }
*Result rows with a rating of an immediately better film*

Now we need to select all the rows belonging to the current row’s peer group and count them:

```sql
SELECT
 f.id, f.release_year, f.category_id, f.rating,
 COUNT(*) OVER (PARTITION BY release_year ORDER BY rating 
   GROUPS BETWEEN CURRENT ROW AND CURRENT ROW EXCLUDE CURRENT ROW)
AS count_of_equal
FROM films f 
ORDER BY release_year, rating;
```

We use `CURRENT ROW` as both the beginning and the end of the partition in order to narrow the window frame down to the current group only. Remember that we’re in the `GROUPS` mode, so `CURRENT ROW` actually means the current group. The last thing is to exclude the actual current row, so we add `EXCLUDE CURRENT ROW` clause, which always mean just the current row. If you think that this syntax is misleading, don’t worry, you’re not the only one.

#### Example 3. Find the rank of an immediately better rated film

![Result rows with a rating of an immediately better film](/images/blog/advanced-sql-window-frames/result-rows-3.svg){: .center-image }
*Result rows with a rating of an immediately better film*

This example becomes tricky when we think about duplicates. There can be many rows with the same value as the current row, but we’re interested in the first one that has a greater value. We need to skip all the duplicates.

```sql
SELECT
 f.id, f.release_year, f.category_id, f.rating,
FIRST_VALUE(rating) OVER (PARTITION BY release_year ORDER BY rating 
   GROUPS BETWEEN 1 FOLLOWING AND 1 FOLLOWING) AS rating_of_better
FROM films f 
ORDER BY release_year, rating;
```

Here, with the `GROUPS` mode, we narrow down the framing window to the group immediately after the current group. Because this is a single group, all sorting values in the group are the same. We can choose any of them, e.g. by using `FIRST_VALUE()`.

We can also use the solution from Example 1 and use `MIN()` function. As always, there are many correct answers.

#### Example 4. How many films are better by 0.5 or less?

The last example requires `RANGE` mode. One important thing to remember about is excluding the current group. In this example, we don’t consider equally rated films as better.

![Result rows with a count of films with ratings higher by 0.5 or less](/images/blog/advanced-sql-window-frames/result-rows-4.svg){: .center-image }
*Result rows with a count of films with ratings higher by 0.5 or less*

This example allows us to use the `RANGE` mode. Specifying the upper boundary is easy - `0.5 FOLLOWING`. But the lower one is more problematic. To start with exactly the first strictly better film, we need to include the current group and everything above (`CURRENT ROW`) but then exclude the current group again (`EXCLUDE GROUP`). We’re not in the `GROUPS`, so we can’t just say `1 FOLLOWING`.


```sql
SELECT
 f.id, f.release_year, f.category_id, f.rating,
COUNT(*) OVER (PARTITION BY release_year ORDER BY rating 
   RANGE BETWEEN CURRENT ROW AND 0.5 FOLLOWING EXCLUDE GROUP)
AS count_of_better
FROM films f 
ORDER BY release_year, rating;
```

### Summary

Window frames are a very powerful SQL feature that can be extremely useful when you need your relational database system to do more complicated calculations for you. This article described window frames, which make window functions even more powerful. They allow you to flexibly narrow down the set of rows being used for calculations, so you can solve problems that previously couldn’t be solved with window functions only. 

It’s worth to keep track of the latest SQL features being introduced to the popular relational database systems. It might take some time to learn and fully understand them, but if you like to do as many calculations inside your database as possible, then they will prove useful for you.

### Resources

* [PostgreSQL documentation](https://www.postgresql.org/docs/11/sql-expressions.html#SYNTAX-WINDOW-FUNCTIONS)
* [Modern SQL](https://modern-sql.com)
