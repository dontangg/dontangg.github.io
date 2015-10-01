---
layout: post
published: true
title: Constructing A Less Than Simple Query With Rails And ARel
date: '2011-11-27 00:38:31 -0700'
categories:
- Programming
tags:
- Ruby
- Rails
---

I say the query is less than simple because it's not really complicated either.
In my little application, I really only have one query that is like this and
this is the one. This is the query that I wanted to run:

{% highlight sql %}
SELECT "envelopes".*, COALESCE(SUM("transactions"."amount"), 0) AS total_amount
FROM "envelopes" LEFT OUTER JOIN "transactions" ON "envelopes"."id" = "transactions"."envelope_id"
WHERE "envelopes"."user_id" = 3
GROUP BY "envelopes"."id", "envelopes"."name", "envelopes"."user_id", "envelopes"."income", "envelopes"."unassigned", "envelopes"."parent_envelope_id", "envelopes"."expense", "envelopes"."created_at", "envelopes"."updated_at"
ORDER BY "envelopes"."name"
{% endhighlight %}

Don't try to read that. It looks more complicated than it is because it's long.
In my application, users have envelopes and those envelopes have transactions
and transactions have a cash amount. Basically, I'm getting all the envelopes
owned by a user and the total amount for each envelope (a SUM of all the
amounts of all the transactions in those envelopes). This query is definitely
more complicated than the typical query, but as far as SQL goes, it's still
pretty simple. Here were my priorities for this:

* One query that gets the job done. Not more than one query.
* Use ActiveRecord to consume the query. I still wanted to work with Envelope
  objects even though I also wanted the total.
* No extensive use of strings because I use SQLite3 for development and
  Postgres for production. There are differences in syntax (quoting, etc.) that
  I don't want to worry about.

My first attempt was just creating a SQL string to see if I could just use the
`find_by_sql` method to get all the data back and still access the total.

{% highlight ruby %}
sql = 'SELECT "envelopes".*, COALESCE(SUM("transactions"."amount"), 0) AS total_amount FROM "envelopes" LEFT OUTER JOIN "transactions" ON "envelopes"."id" = "transactions"."envelope_id" WHERE "envelopes"."user_id" = 3 GROUP BY "envelopes"."id", "envelopes"."name", "envelopes"."user_id", "envelopes"."income", "envelopes"."unassigned", "envelopes"."parent_envelope_id", "envelopes"."expense", "envelopes"."created_at", "envelopes"."updated_at" ORDER BY "envelopes"."name"'
envelopes = Envelope.find_by_sql(sql)
{% endhighlight %}

This worked great. It turns out that all the columns returned were accessible.
For example, when I have an envelope populated with data from this query, I can
just say `envelope.total_amount` to get the value and it doesn't do any other
queries even though `total_amount` isn't a column in the envelopes table. To
make this access even nicer, I added a method to my Envelope class.

{% highlight ruby %}
def total_amount
  @total_amount ||= read_attribute(:total_amount) || transactions.sum(:amount)
end
{% endhighlight %}

`read_attribute` is what is called behind the scenes whenever you access your
data. I call that since it won't get to `method_missing` anymore when I try to
access `total_amount`. If that value wasn't provided in the query that
populated this envelope object, then I get it by summing all the transactions'
amounts. Either way, I memoize the value in an instance variable. If the
instance variable is set, it will return it's value before doing anything else.
Using a tip found on [Jamis Buck's blog](http://weblog.jamisbuck.org/2007/1/8/watching-activerecord-do-it-s-thing)
was very helpful in testing this to make sure it was working. To see all the
SQL queries that are run, you can just run `ActiveRecord::Base.logger =
Logger.new(STDOUT)` in the Rails console.

This solution is nice because it solves the first two concerns I had. However,
it isn't very portable. The whole query is just a string. So I looked through
the Rails documentation to see if it was possible to build this query just
using the Active Record Query Interface. The things that I was having a hard
time figuring out how to do was getting all of the envelopes columns while
summing the transactions as well as getting an outer join in the query. If
there aren't any transactions, I still want the envelope to return (inner join
doesn't work). I could get it to do an outer join if I used the `includes`
method and I put something in the `where` that required the included table.
Anyways... I decided to just build the SQL string using ARel and just plop it
into the `find_by_sql` method. After a lot of digging through ARel
documentation and looking through the source code, I finally found a way to do
it. Here it is:

{% highlight ruby %}
et = Envelope.arel_table
tt = Transaction.arel_table

envelopes_columns = Envelope.column_names.map {|column_name| et[column_name.to_sym] }

sum_function = Arel::Nodes::NamedFunction.new('SUM', [tt[:amount]])
aggregation = Arel::Nodes::NamedFunction.new('COALESCE', [sum_function, 0], 'total_amount')

sql = et.project(et[Arel.star], aggregation)
        .join(tt, Arel::Nodes::OuterJoin).on(et[:id].eq(tt[:envelope_id]))
        .where(et[:user_id].eq(user_id))
        .group(*envelopes_columns)
        .order(et[:name]).to_sql

Envelope.find_by_sql(sql)
{% endhighlight %}

There are a couple of tricks that I learned worth mentioning. The first one
that appears in the code above is that you can get ARel to do any function
supported in databases even if ARel doesn't natively understand it. Just use
the NamedFunction class and pass in all the arguments for that function as an
array. The 3rd argument is an optional alias. Even though `SUM()` is natively
supported, I had to add it this way because it puts an alias in the wrong spot
if I used the native way since I want the `SUM()` inside the `COALESCE()`. I
want the `COALESCE()` because if it returns null, then I'll do another
database query in my `total_amount` function.

The next trick is that you can do `et[Arel.star]` to generate `"Envelopes".*`.
This is nice because the Envelopes table is quoted in the database-specific way
(for sqlite here) and the splat is not quoted.

The last thing that if you want to use an outer join, just pass in the join
class you want to use as a second parameter to the `join` method...  easy!

That's it. This worked. (If you're wondering about the `*envelopes_columns`
part, you need to go through [Try Ruby](http://tryruby.org)).

This actually met all of my initial priorities, but something didn't sit right
with me. I didn't like how this query was not chainable like all of the other
ActiveRecord queries. I can't use any of my other scopes with it. So, I went
back to the ActiveRecord Query Interface and this time, I dug into the
documentation more and looked through some Rails code. I found a way to make it
all work using a combination of ActiveRecord and ARel.

{% highlight ruby %}
et = Envelope.arel_table
tt = Transaction.arel_table

envelopes_columns = Envelope.column_names.map {|column_name| et[column_name.to_sym] }

sum_function = Arel::Nodes::NamedFunction.new('SUM', [tt[:amount]])
aggregation = Arel::Nodes::NamedFunction.new('COALESCE', [sum_function, 0], 'total_amount')

select([et[Arel.star], aggregation])
  .joins(Arel::Nodes::OuterJoin.new(tt, Arel::Nodes::On.new(et[:id].eq(tt[:envelope_id]))))
  .group(envelopes_columns)
{% endhighlight %}

I'm not going to explain all of this, but it's pretty cool that all of the
ActiveRecord methods take ARel as parameters. Notice that the where clause is
missing from this. That's because I moved it out into its own scope that I can
chain on when I want. This also now uses my default scope which just specifies
the order.

I think that this is great because it works with all my scopes and it's
chainable and everything. I hope that this can be of some use to someone other
than me. I learned a lot while trying to do this and I'm actually pretty
surprised that it is all possible. I was half expecting to just have to use my
string SQL query and leave it at that.

