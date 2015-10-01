---
layout: post
published: true
title: Why I like MVC (A Non-Technical Reasoning)
date: '2010-07-27 22:51:00 -0600'
categories:
- Programming
- Opinion
tags:
- MVC
---

I love developing. In particular, I love web development. Recently, I have been
learning a lot about a specific way to do web development and I really like it.
This is a technical topic, but I'm going to try to explain it in a way that
anyone can understand. The specific way to do web development that I am talking
about is called the Model-View-Controller (MVC) pattern.

I have to admit, that even though I am writing this as though you aren't savvy
in the web development field, it probably still isn't the most interesting for
most people.

## I love learning and trying new things

The first thing about this that I have to admit is that I just like learning
new things. This is not like any other pattern of development that I have ever
done before. The new ways of thinking and doing things really excites me.

The rest of the reasons that I like it will probably only make sense once I
explain some of the other patterns I have used for web development first.

## Scripting languages

Probably, the most common way to do web development is through using scripting
languages. Let's say that I wanted to write Facebook. The first thing I would
do is write code for the logo. It doesn't change, so putting the logo there is
just as easy as writing the HTML to point to the Facebook logo. Next, there
is the icon for friend requests. This icon will change depending on whether
or not I have any friend requests. If I don't have any, the icon will look
like this. But, if I have two friend requests, the icon will look like this.
In order to accomplish this dynamic (changing) behavior, scripting languages
will run all of the code to handle all of this logic when it gets to the
point that it needs to display it. So, to summarize my point here, scripting
languages will:

1. Put the Facebook image on the web page
2. Run the logic to determine what logo to display for friend requests
3. Place the correct logo on the web page

## .NET Web Forms

At my current job, I have been developing using .Net Web Forms. There are a lot
of differences between scripting and using .NET Web Forms. But, the main
difference that applies to this topic is that all the code for a web page is
split into two parts: what to display and the logic that determines the
changing parts of a web page. They can be run in any order. In the example of
Facebook, usually the logic to determine the icon for friend requests will run
before the Facebook logo is placed on the page. The result of this logic is
just stored until it is needed later when the entire page is rendered at once.

## MVC

In the MVC pattern, everything is split into 3 parts: The model, the view, and
the controller.

### The model

The model is where all of the data comes from. If you want to know if you have
friend requests, you'll get that information from that model. Also, if an
invalid email address is typed in, the model is the one that will tell you.
That's all it is. It's really nice to have this stuff consolidated into one
central spot and that's all it does.

### The view

The view is where you display everything. The job of the view is just to
present everything. It doesn't do any calculations. It doesn't pull anything
from the database. It just displays things. Pretty simple, huh?

### The controller

Obviously, the model and the view have a pretty narrow view and they can't do
much without each other. The controller is the one that controls it all. It
gets the data from the model and gives it to the view. It is the one that
handles everything from the start to finish, but it stays out of the models
business and the views business. It only does what it needs to in order to let
the model and the view do their jobs.

So, in the Facebook example, first, the controller would ask the model if there
are any friend requests. Then, it would pass that data to the view and the view
would display it all.

## Why I love MVC

Now that you know what it is, I feel like I can talk about why I love it. Some
of the reasons that I have don't directly relate to the differences that I
pointed out, but they are still things that I love about it. Like I said at the
beginning, part of the reason that I love it is because it's new and I like
learning new things. But, there are many other reasons that I love MVC:

* It separates the different tasks into different places so that all of the
  code isn't all mashed in together. This makes it easy to conceptualize what
  will happen when the web page loads. It also makes it easier to debug and fix
  code later on.
* There are lots of "helper" functions that do lots of things for me so that I
  don't have to write it.
* The URLs are easier to read (they don't have an extension like .php or
  .aspx).
* The code is easier to test.
* It promotes convention over configuration (you don't have to configure as
  many things if you just do it the conventional way).
* It supports other principles that I enjoy like DRY (Don't Repeat Yourself)
  and KISS (Keep It Simple Stupid).
* It's new and I like to learn new things... wait, I already said that.

Well, now that you know why I like MVC, here are some links to get started
using it for yourself!!!

* [Build Your First ASP.NET Application with ASP.NET MVC](http://www.asp.net/general/videos/build-your-first-asp-net-application-with-asp-net-mvc)
* [Lots of tutorials and other videos on ASP.NET MVC](http://www.asp.net/mvc)
* [A List Apart: Getting Started with Ruby on Rails](http://www.alistapart.com/articles/gettingstartedwithrubyonrails)
* [Official Rails Guides: Getting Started with Rails](http://guides.rubyonrails.org/getting_started.html)
* [Try Ruby! An Interactive Ruby Tutorial](http://tryruby.org/)
* [Wikipedia's explanation of MVC as well as a list of other options besides ASP.NET MVC and Ruby on Rails](http://en.wikipedia.org/wiki/Model%E2%80%93View%E2%80%93Controller)

You may not be a developer but I love it, so why not try to get others to love it too?

