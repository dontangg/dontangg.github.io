---
layout: post
published: true
title: Blackbird! - A Game for Rook fans on iPhone, iPad, and iPod Touch
date: '2012-10-30 22:55:57 -0600'
categories:
- Programming
- Projects
tags:
- iPhone
- iOS
- Objective-C
---


Just to get this out of the way: I am not affiliated with Hasbro!

It has been a month now since my iOS card game app based on Rook,
[Blackbird](https://itunes.apple.com/us/app/blackbird!/id563960217?ls=1&mt=8),
has been approved in the App Store. It has been a blast! It is definitely the
funnest project that I have worked on. I think that is mainly due to the fact
that I did it all myself and the App Store is a big market. Well, I can't
really say that because I've had lots of input and help with testing from
friends and family - mostly my dad who is a big Rook fan. I thought I'd just
write up a quick post on some things I've learned, and throw in some app
statistics.

### Some things I have learned

I chose to write an iOS app simply because I have an iPhone and most of my
family have iPhones.

I didn't use a cross-platform developer tool like Titanium that would allow me
to write code once and deploy to iOS and Android. This was a very hard decision
for me, but I'm glad I went the XCode/Objective C route. Here are my reasons:
(Whenever I say, "Titanium", I really mean any project like it. They all work
very similarly.)

* The Objective C language is really growing on me. It's very different at
  first and has some concepts that are unlike any language that I'd learned
  before. But I really like it now. So I'm glad I took the time to learn.
* I have a computer playing AI that I want to be as fast as possible. Even
  though they translate the JavaScript into native code, I can write native
  code that performs faster for my specific tasks than Titanium can. I feel
  comfortable that when I need to work on performance, I can get every inch of
  performance possible.
* I have a problem feeling restricted to the currently implemented features. I
  worry about running into a situation where I want to use a feature that is
  supported by the platform, but not implemented by Titanium. This may be an
  irrational fear, but I still have it.
* I have recently talked to people who have worked on Titanium projects and
  they have told me that they both love it and hate it. They say that some bugs
  are really hard to track down because you're not sure if the bug is in your
  code or theirs. They also say that you still end up writing a lot of
  platform-specific code. You also have to pay for their nicer versions and you
  have to write modules to support native iOS features that aren't yet
  implemented by Titanium.

The up side of writing in a language I'm already familiar with (JavaScript) and
deploying to multiple platforms at the same time just isn't worth it **to me**.

When I released the app, it had relatively few features. I knew that there were
several things that would be in high demand, but I released it without them
anyways. I'm really glad I made that decision. The feedback has poured in and
it has definitely steered me in a different direction that I would have taken
on my own.

I haven't done any marketing yet. I'll be interested to see if I can get some
app review sites to review my app and what effect that will have. I expect that
a multi-player mode and a universal app will also have a big impact. So, I'm
excited for the future!

### Statistics

Here are several statistics so far:

* Initially approved for sale in the App Store: Sept 29, 2012
* Total downloads: 561
* Updates approved: 3
* App store rejections: 0
* Most sessions in 1 day: 979
* Median session length: 6.3 mins
* Total time spent in app yesterday: 5 days 14 hours
* iOS versions: 88.9% iOS 6.0, 10% iOS 5.1.1, 1% iOS 5.1 (my app requires iOS 5.1)
* Users with a device that cannot upgrade to iOS 6: 1%
* Countries of users: USA, Canada, Japan, Australia, Hong Kong, Kuwait

### Update - Nov 28, 2013

There is now an Android version of
[Blackbird](https://play.google.com/store/apps/details?id=net.donwilson.blackbird)
in the Google Play store!

It is also under review in the Amazon store.
