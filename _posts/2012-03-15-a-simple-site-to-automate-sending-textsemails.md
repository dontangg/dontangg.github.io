---
layout: post
published: true
title: A Simple Site To Automate Sending Texts/Emails
date: '2012-03-15 20:00:39 -0600'
categories:
- Programming
- Productivity
tags:
- Ruby
- Sinatra
- Google API
- SMS
- Email
---

I'm often thinking about things that I could code up that would make tasks
simpler. Generally, that means that I spend a lot of time up front to write a
tool that automates a task. Then, I slowly get that time back over time using
the tool. But, it's fun anyways. So, this is what I decided to automate.

## Justification

[I am a Mormon](http://mormon.org/me/2ZXC/). No one is paid to do anything at
my church. So, we have to setup all the chairs for everyone every Sunday. We
have split into different groups so that we really only have to come setup
chairs once every month. I am in charge of reminding my group that it's our
turn. These groups change pretty often with people moving in and out, so we
keep the list of groups in a Google Spreadsheet. I often forget that I need to
remind everyone until it's inconvenient for me. I have often looked up the list
in the Google spreadsheet on my phone and copied them, 5 at a time, into Google
Voice to send texts. It feels painful.

## Solution

To make this easier for me, I decided to write a simple website that would read
the data from the Google spreadsheet for me. Then, I could type type in my
message and click "Send SMS" and be done. I was able to do this in about 4 days
in my spare time, but there are some caveats. I'm going to give a brief tour of
this tiny little site. I'm not going to talk about any of the code, but it's up
on GitHub. If you're interested, I used [Sinatra](http://www.sinatrarb.com/)
with [Haml](http://haml-lang.com/), the
[Google Spreadsheet API](https://developers.google.com/google-apps/spreadsheets/) 
via the [Google API Ruby Client](http://code.google.com/p/google-api-ruby-client)
and [Faraday](https://github.com/technoweenie/faraday),
[Moonshado SMS](https://addons.heroku.com/moonshadosms),
[MongoDB](http://www.mongodb.org/) with [Mongoid](http://mongoid.org/)
on [MongoLab](https://mongolab.com/home), the 
[Twitter Bootstrap](http://twitter.github.com/bootstrap/),
and [Heroku](http://www.heroku.com/). It was all free!!! If
you want my code, [look here](https://github.com/dontangg/eq_automator).

## Short Tour

The home page is just a simple page with a random quote about time that changes
every time you come to the page and a link to the contact page. I'm guessing
that I might add more tools like this in the future.

![home]({{ site.baseurl }}/assets/eq-automator-1.png)

When you click on the "Contact the quroum" link it takes you to a Google page
where it tells you that I'm asking for permission to use your spreadsheets. If
you give permission, it takes you to the only other page in the app, the
contact page. You can select from a bunch of preset groups of contacts or you
can manually click on the names to add them or remove them from the list. You
can see who has an email or phone number in the spreadsheet with the icons next
to each name. Then, you type in your message and click the SMS button if you
want it to send a text message. Or, click the Email button if you want to send
an email. The site responds to your browser size too. So, if you are on a
mobile phone, it's still pretty usable. Pretty simple. (I removed a bunch of
names and changed the names in the screenshot below).

![home]({{ site.baseurl }}/assets/eq-automator-2.png)

One caveat is that right now, I can only send 17 text message a month for free.
I have 19 people in my group. Also, when it sends the text, it adds "Msg&data
rates may apply txt STOP to opt-out." That's kind of crappy.  Also, if I'm
asking a question and they want to reply, their reply won't make it to my
phone. So, I'm thinking of changing from using MoonShado SMS to Twilio. With
Twilio it won't be free, but I'll get everything that I want for about
$1.17/month. I'm still deciding if it's worth it to me. Either way it was a fun
project and I'll still use it!

