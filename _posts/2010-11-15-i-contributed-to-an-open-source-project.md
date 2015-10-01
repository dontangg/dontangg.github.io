---
layout: post
published: true
title: I Contributed to An Open Source Project!
date: '2010-11-15 04:00:44 -0700'
categories:
- Programming
tags:
- open-source
---

In my last post, I talked about my envelopes budgeting project a little bit.
Well, obviously, I need to display numbers as a currency. I found a convenient
function in Rails where I could supply a number and it would format it nicely
(eg. $50.12). However, I quickly noticed that negative numbers were formatted
incorrectly (eg. $-50.12 instead of -$50.12). I did some searching on the internet and found others
frustrated with that as well, so I just wrote my own function.

I left it for a while, but then I decided to see if I could contribute my
solution to the Ruby on Rails source code. It was a fun process. I had to learn
how to use Git a little more. I had to learn more about the way Rails works.
But, I was finally able to submit a patch that was accepted and will be
incorporated in version 3.0.2 of Rails.

**Edit:** It is now incorporated into Rails. You can see my change in the
documentation
[here](http://api.rubyonrails.org/classes/ActionView/Helpers/NumberHelper.html).

# An Overview of What I Did

Here are the basic steps that I took:

1. Searched for existing tickets and conversations about the issue.
2. Researched and learned the way that the function was currently working.
3. Planned out a solution based on research of how it should work.
4. Cloned the Rails repository and made my changes.
5. Created a patch and attached it to a ticket to be reviewed by the Rails
   team.
6. Implemented feedback from the Rails ticket and submitted patches until it
   was accepted.

That is a lot of steps, but the actual process didn't take very long. I started
researching it and thinking about it on Friday, October 29 and it was accepted
into Rails on Tuesday, November 2. So, that's only 5 days and I wasn't doing it
all the time.

# A Little More Detail

I thought I would describe in more detail what I did, so that you can do it
too, if you want. First of all, I found out that different open source projects
want you to contribute in different ways. Obviously, I'm going to describe the
Rails way. They have an article (<http://guides.rubyonrails.org/contributing_to_rails.html>)
on how to contribute to Rails that I looked at quite a bit.

## Research Current Conditions

I did a lot of Google searches to see if others were seeing the same problem as
me and if there was anyone that had already attempted to fix it. I did find a
lot of people with their own little hacks to get it to work the way they
wanted. I also found one person several years ago that submitted a patch to fix
it, but it went stale and never got incorporated. It was a good way to learn
what people wanted and to see suggestions on how it should work.

## Learn And Research Rails

All of the Rails code is open source (duh, that's why I can contribute). It's
all hosted on [GitHub](https://github.com/rails/rails). So, I went to the code
and started getting familiar with how the number_to_currency function worked. I
found the file I needed to change fairly easily by looking at the
[documentation for the function](http://api.rubyonrails.org/classes/ActionView/Helpers/NumberHelper.html#method-i-number_to_currency)
for the function. The path to the file was right there when I clicked view
source. Finding the files where the tests were stored was a little more
challenging, but not too hard.

## Researched Best Solution

I knew that this was not a simple issue to resolve. Well, it was a simple issue
to resolve, but not a simple issue to decide what the best resolution would be
especially because of how much it can vary by locale. So, I looked at other
languages to see what they did to determine how to format negative currencies.
I looked at all of the people that I found had issues with it and how they
wished it would work and I decided what I thought would be the best way to do
it.

## Fix It

Finally, it was time to get my hands dirty. I already had Git installed on my
computer and I already had a GitHub account (it's free). I went to the Rails
repository on Git and I clicked "Fork." This basically creates a copy of the
repository under your name. I don't know if I would do it this way again,
though. In other open source projects, you fork and then when you're done, you
send a pull request. That's not how Rails does it. With Rails, you just make
your changes and submit a patch. So, it's not necessary to create your own copy
under your account.

Once, I had my forked copy, I cloned it onto my computer.

{% highlight bash %}
$ git clone git://github.com/dontangg/rails.git
{% endhighlight %}

As I'm sure you know, this basically puts a copy of the repository on my
computer in a folder named rails. It also creates a link (called a remote in
Git) to the origin on GitHub.

Since we need to make sure that what we have is always in sync with the actual
rails repository, we have to add another remote.

{% highlight bash %}
$ git remote add upstream https://github.com/rails/rails.git
{% endhighlight %}

This creates another remote called upstream (call it what you want) to the main
rails repository. Now, we can pull the source from the main repository to make
sure we have the latest stuff (if we don't I'd be surprised).

{% highlight bash %}
$ git pull upstream master
{% endhighlight %}

This pulls the code from upstream into our master branch in our local
repository. Now, we can create a branch for our fix. We'll call the branch
currency-fix.

{% highlight bash %}
$ git checkout -b currency-fix
{% endhighlight %}

Now, I was ready to make my changes. Once the changes were made, I modified
Rails tests to help prevent regression (breaking functionality later on). To
run the tests, first I had to make sure that I had all the gems I needed. This
is easy now with bundler. Make sure you have bundler.

{% highlight bash %}
$ gem install bundler<br />
{% endhighlight %}

Then, to install all the needed gems:</p>

{% highlight bash %}
$ bundle install --without db
{% endhighlight %}

Now, with all the prerequisites installed, I went to the actionpack/test/
directory in rails and ran this command:

{% highlight bash %}
$ ruby -I . template/number_helper_test.rb
Loaded suite template/number_helper_test
Started
....................
Finished in 0.459888 seconds.

20 tests, 212 assertions, 0 failures, 0 errors, 0 skips
{% endhighlight %}

Sweet, all the tests passed including the ones I added. We just need to make
sure that we still have the latest rails stuff and then we're ready to go!
Let's switch back to the master branch and get the code again. Then we'll have
to switch back to our branch and "rebase" our branch on the master.

{% highlight bash %}
$ git checkout master
Switched to branch 'master'
$ git pull upstream master
...
$ git checkout currency-fix
Switched to branch 'currency-fix'
$ git rebase master
{% endhighlight %}

Rebase basically rewinds our changes back to where we branched from master
originally. Then, it applies changes made to the master branch and then it
applies our changes again. This way our branch has the latest stuff from the
master branch (that it got from the Rails repository).

## Create A Patch And Create A Ticket

Creating a patch is pretty simple. Just run this:

{% highlight bash %}
$ git format-patch master --stdout > my_new_patch.diff
{% endhighlight %}

That creates a patch in the directory that you run the command. The Rails
community like you to create a ticket in Lighthouse and describe the issue and
attach your patch. You can see the ticket I created
[here](https://rails.lighthouseapp.com/projects/8994/tickets/5894-number_to_currency-doesnt-format-negative-numbers-correctly).

## Implement Feedback and Submit More Patches

I got some feedback and I had to make a couple more changes and resubmit
patches a few times, but the process was always the same. I thought it was a
lot of fun and kind of rewarding to see my changes actually get implemented
into Rails. My name is now also on a list of 1,693 people that have contributed
to Rails. That's a lot of people, but I'm one of them. It was a fun little
project for me. I enjoyed it a lot.

![I'm a Rails contributor]({{ site.baseurl }}/assets/rails-contributor.png)

