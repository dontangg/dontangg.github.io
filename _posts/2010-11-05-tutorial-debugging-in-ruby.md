---
layout: post
published: true
title: 'Tutorial: Debugging in Ruby'
date: '2010-11-05 20:15:20 -0600'
categories:
- Programming
tags:
- Ruby
---

Debugging is extremely useful to find problems in code. I'm going to give a
really brief tutorial on how to use Ruby's built-in debugger for the most
common debugging reasons. When I debug, these constitute 95% of what I ever
want to do when I'm debugging. In simple terms, here's what I like to do when
debugging:

* Pause the code in the middle of execution (breakpoint)
* View the contents of variables (locals, watch, etc.)
* Run one line of code at a time (step over, step into, etc.)
* Run my own code while the program is paused

Just to be clear, this is not a tutorial on how to use the gem ruby-debug. This
is also not a tutorial on how to use irb. There are a lot of great tools and
methods out there for debugging, but this is just about how to use the built-in
ruby debugger. I am also only going to talk about the basics of debugging in
Ruby. The built-in debugger, does much more than what I will show you. Learn
more here: <http://www.ruby-doc.org/docs/ProgrammingRuby/html/trouble.html>.

Here is the code I'm going to be working with:

{% highlight ruby %}
# lottery_numbers.rb
def next_lottery_number(last_number)
  case last_number
  when nil
    4
  when 4
    8
  when 8
    15
  when 15
    16
  when 16
    23
  when 23
    42
  else
    nil
  end
end

current_number = 1
while current_number
  current_number = next_lottery_number(current_number)
  puts current_number
end
{% endhighlight %}

Basically, all that it should do is output the lottery ticket numbers that
would make you win the lottery (4, 8, 15, 16, 23, 42). When I run the program
nothing outputs. It doesn't work and I can't figure out why. So, we'll debug
it.

To start the debugger, we just type:

{% highlight bash %}
ruby -r debug lottery_numbers.rb
{% endhighlight %}

The -r option tells Ruby to require a library before it runs my program and I
specified to require the debug library.

When I run that, it responds with this:

{% highlight bash %}
Debug.rb
Emacs support available.

lottery_numbers.rb:2:def next_lottery_number(last_number)
(rdb:1)
{% endhighlight %}

It shows the line that it is about to execute. Of course, it skipped the first
line because it was a comment and we are now looking at line 2. Just to feel
safe that we are where we think we are, lets run 'list' to see for sure.
(Also, the commands I type all start with (rdb:#).  Everything else is output
by the debugger.)

{% highlight bash %}
(rdb:1) list
[-3, 6] in lottery_numbers.rb
   1  # 4 8 15 16 23 42
=> 2  def next_lottery_number(last_number)
   3    case last_number
   4    when nil
   5      4
   6    when 4
{% endhighlight %}

Yep, that's where we are! Ok we're not too interested in this line. This line
is just going to define a method, let's go to the "next" line.

{% highlight bash %}
(rdb:1) next
lottery_numbers.rb:21:current_number = 1
{% endhighlight %}

It skipped the entire method definition because it doesn't execute anything
inside the method until the method is called. So, now we are on the line that
defines our variable. We are definitely interested in this. Let's tell it to
keep us updated on the contents of that variable by running the "display"
command.

{% highlight bash %}
(rdb:1) display current_number
1: current_number =
{% endhighlight %}

Currently, our variable doesn't have anything. That will change when we go to
the next line ("n" is a shortcut for the next command).

{% highlight bash %}
(rdb:1) n
lottery_numbers.rb:22:while current_number
1: current_number = 1
{% endhighlight %}

Alright, now we can see that our `current_number` has the value of 1 in it.
Everything is going the way we planned it. I'll keep going to the next line
until I see something suspicious.

{% highlight bash %}
(rdb:1) n
lottery_numbers.rb:23:  current_number = next_lottery_number(current_number)
1: current_number = 1
(rdb:1) n
lottery_numbers.rb:24:  puts current_number
1: current_number =
{% endhighlight %}

Uh oh! For some reason, `current_number` was set back to nothing before
anything was output. We also learned that the next (n) command steps over
methods. It didn't take us into the next_lottery_number method. Let's quit the
debugger, and debug again. This time we'll step into the method.

{% highlight bash %}
(rdb:1) q
Really quit? (y/n) y
$ ruby -r debug lottery_numbers.rb
Debug.rb
Emacs support available.

lottery_numbers.rb:2:def next_lottery_number(last_number)
(rdb:1) b 23
Set breakpoint 1 at lottery_numbers.rb:23
(rdb:1) c
Breakpoint 1, toplevel at lottery_numbers.rb:23
lottery_numbers.rb:23:  current_number = next_lottery_number(current_number)
{% endhighlight %}

Notice that this time, I set a breakpoint on line 23 (b 23) then I told the
program to continue (c) until it hit that breakpoint. Now, we're ready to step
in with the step command ("s" is the shortcut).

{% highlight bash %}
(rdb:1) s
lottery_numbers.rb:3:  case last_number
(rdb:1) l
[-2, 7] in lottery_numbers.rb
   1  # 4 8 15 16 23 42
   2  def next_lottery_number(last_number)
=> 3    case last_number
   4    when nil
   5      4
   6    when 4
   7      8
{% endhighlight %}

Alright! We're in the method now. Now we can follow it to see what went wrong.

{% highlight bash %}
(rdb:1) disp last_number
1: last_number = 1
(rdb:1) s
lottery_numbers.rb:24:  puts current_number
1: last_number =
{% endhighlight %}

Oh, I guess the way that I wrote it, we don't really get to see much by
stepping into the method. Let's experiment. I'm going to quit the debugger, go
back to line 23 and manually set current_number to 4 before it calls the method
to get the next number.

{% highlight bash %}
(rdb:1) q
Really quit? (y/n) y
dons-macbook:Sites don$ ruby -r debug lottery_numbers.rb
Debug.rb
Emacs support available.

lottery_numbers.rb:2:def next_lottery_number(last_number)
(rdb:1) b 23
Set breakpoint 1 at lottery_numbers.rb:23
(rdb:1) c
Breakpoint 1, toplevel at lottery_numbers.rb:23
lottery_numbers.rb:23:  current_number = next_lottery_number(current_number)
(rdb:1) current_number = 4
4
(rdb:1) disp current_number
1: current_number = 4
(rdb:1) l
[18, 27] in lottery_numbers.rb
   18    end
   19  end
   20
   21  current_number = 1
   22  while current_number
=> 23    current_number = next_lottery_number(current_number)
   24    puts current_number
   25  end
(rdb:1) n
lottery_numbers.rb:24:  puts current_number
1: current_number = 8
{% endhighlight %}

To run my own line of code, all I had to do is type in the code that I wanted
to run! That's pretty easy, right? And look! When I started out as 4, it
correctly set the next number to 8. Well, as you probably noticed, I originally
thought that I would pass nil into the function the first time through. That
changed when I got to the bottom and I realized that I couldn't pass nil in if
I wanted to use it in the while loop the way that I did. Then, I just forgot
that it would affect the method that I wrote. Let's make a small change to line
4 to check for the number 1 instead of nil.

{% highlight ruby %}
def next_lottery_number(last_number)
  case last_number
  when 1
    4
{% endhighlight %}

{% highlight bash %}
$ ruby lottery_numbers.rb
4
8
15
16
23
42
{% endhighlight %}

Awesome! When we run the program now, it works!

This was a pretty basic example and it doesn't show all the commands you can
use with the built-in debugger. I hope it can be a quick helpful tutorial for
people trying to debug their Ruby code.

This would actually be a fun way to debug:
[YouTube clip](http://www.youtube.com/watch?v=8_HSCMTo6xw).

