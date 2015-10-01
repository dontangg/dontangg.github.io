---
layout: post
published: true
title: Programming Is Art
date: '2010-11-02 21:27:49 -0600'
categories:
- Programming
- Opinion
tags: []
---

> "When you don't create things, you become defined by your tastes rather than
> ability. your tastes only narrow & exclude people. so create."
>
> -- <cite>_why the lucky stiff</cite>

I like this quote. One of the reasons the I like programming on the computer is
because it is my way of being creative. What do you think of this quote?

It kind of reminds me of this quote from the movie Dead Poets Society:

> "We don't read and write poetry because it's cute. We read and write poetry
> because we are members of the human race. And the human race is filled with
> passion. And medicine, law, business, engineering, these are noble pursuits
> and necessary to sustain life. But poetry, beauty, romance, love, these are
> what we stay alive for. To quote from Whitman, "O me! O life!... of the
> questions of these recurring; of the endless trains of the faithless... of
> cities filled with the foolish; what good amid these, O me, O life?" Answer.
> That you are here - that life exists, and identity; that the powerful play
> goes on and you may contribute a verse. That the powerful play _goes
> on_ and you may contribute a verse. What will your verse be?"
>
> -- <cite>John Keating</cite>

I'd like to think that there are many ways that I have contributed a verse, but
one of them is definitely through the web development and computer programming
that I have done. For me, writing code is my way of being an artist and my art
project consists of different layers of beauty:

* How nice and usable is it for the user?
* How well does it serve the needs of the user?
* How beautiful is the actual code? Is it efficient? Is it well documented?
  Does it look nice?

I can't say that I've always had the time or been in the mood to do this well
every time, but it important to me.

I'm going to try to quickly explain the languages that I have experience with
what I like or don't like about them. This isn't going to be an in-depth
analysis of them... just a little bit about them... the main reasons that I
have.

# My Experience With Different Languages

I started telling the computer what to do when I was 10 years old and I used
HyperCard. It used a language called HyperTalk and it was based on a concept
that a program consists of a stack of user interfaces. It was a good place to
start for me. It is what got me excited about programming. It's too bad they
don't make it anymore.

Then I found a book in my school library (in 6th grade I think) on BASIC with
tutorials on how to create games. I learned the basics of subroutines/functions
as well as command line input/output. I had a blast with that one, but beyond
that book, I didn't have much resource for learning more.We didn't have the
internet (even if we did, I don't think that there would be much of a resource
back then). Today, I definitely don't like VB.Net very much. C# is much better.
In VB, you have to put "Then" after your If statement among many other syntax
vegetables. Yuck!

Here is a little BASIC. Kind of nostalgic...

```vb
INPUT "What is your name: ", UserName$
PRINT "Hello "; UserName$
DO
  INPUT "How many stars do you want: ", NumStars
  Stars$ = STRING$(NumStars, "*")
  PRINT Stars$
  DO
    INPUT "Do you want more stars? ", Answer$
  LOOP UNTIL Answer$ <> ""
  Answer$ = LEFT$(Answer$, 1)
LOOP WHILE UCASE$(Answer$) = "Y"
PRINT "Goodbye "; UserName$
```

For my math classes in Junior High and High School I had a TI-85 and I created
some games on my calculator. I don't know the name of the language used on the
calculator. Luckily, the calculator came with a great little book with
descriptions on all the commands you could issue to the calculator. This was
awesome because I was great at math and finished my assignments quickly which
left plenty of time for more work on my calculator during class!

My dad noticed my interest in programming and he wanted to learn too. So, we
went to the bookstore and bought a book on C that we read together and did the
exercises together. I loved learning C more than any other language to that
point. It was the first language that I appreciated not only for what I could
tell the computer to do with it, but also the way that it looked. To this day I
like the wide range of ways that you can accomplish things. Programming in
C/C++ feels like I'm breathing a cleaner air and that I have more freedom than
any other language.

In High School, I had a computer science class and we learned both C++ and
Pascal. I liked Pascal, but I loved C++.

Of course, when I went to college, almost all of the computer science classes
were in Java. I really liked Java. Of all the other languages I had learned to
that point, it reminded me most of C++. I know that's weird, but think it was
just because it's object oriented. I don't understand why, but I have this
weird opinion of Java. I really enjoy programming in it, but I don't enjoy
using programs created with it. Maybe I should figure out why, but I don't
really care. :) In college, I also had classes on C++, Python, and Perl. Python
and Perl were okay languages to use, but for some reason I found myself
avoiding them rather than interested in them.

During college, but my job provided an opportunity to learn how to do web
development. At first, I didn't like it very much. It didn't feel like
programming to me. I kept doing it anyways, and I eventually learned to
appreciate PHP and I learned to love JavaScript, HTML, and CSS. Today, I feel
neutral about PHP, but I really like HTML, CSS, and JavaScript. It is so easy
and fun to deliver a great experience to people on the web.

When I graduated, I got a job doing web development with ASP.NET using C#. I
really like C# because it reminds me of C++.

# And Then There Was Ruby

With all the web development that I've done, at some point, I stumbled across
Ruby on Rails. It has taken me a little bit of writing, but that is actually
the reason I wanted to write this post. I love Ruby and I love Rails! I still
love C++, but I feel like Ruby gives me a lot of what I love about the beauty
of code that I enjoy about C++. And, when you pair it with Rails, I get HTML,
CSS, and JavaScript too. Everything that I love.

A man named _why said, "To write Ruby code is to love... to feel passion." I
don't know if I would use the same words, but I feel similarly. I really feel
like I'm creating a work of art when I write Ruby code. It's like I'm creating
an awesome sculpture for the city square or painting the ceiling of a chapel. I
know that may sound crazy or stupid. I may be exaggerating a little too, but it
definitely is more for me than just getting to the end result.

If you want to try Ruby or learn more about Ruby on Rails, here's where I would start:

* Try Ruby: <http://tryruby.org/> (this is a quick, fun, and easy way to try Ruby)
* Railscasts: <http://railscasts.com/">
* </a>Rails for Zombies: <http://railsforzombies.org/">
* Rails Guides: <http://guides.rubyonrails.org/">
* Agile Development with Rails: <http://pragprog.com/titles/rails3/agile-web-development-with-rails-third-edition">
