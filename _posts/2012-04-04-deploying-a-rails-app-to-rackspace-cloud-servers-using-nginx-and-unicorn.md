---
layout: post
published: true
title: Deploying A Rails App To Rackspace Cloud Servers On Ubuntu Using Nginx and
  Unicorn
date: '2012-04-04 19:00:02 -0600'
categories:
- Programming
tags:
- envelopes
- Ruby
- Rails
- deployment
- capistrano
- nginx
- unicorn
---

I recently setup a Rails server on Ubuntu using Nginx and Unicorn and a
database running on the same server using Postgres. I also used rbenv and
ruby-build for ruby. I had to look up a lot of information to get this all
working. I just wanted to consolidate everything I did into one place.
Hopefully, all this can help someone else.

Here are some links to the different parts of this post:

* [Why use these technologies?](#why-these)
* [The server](#configure-server)
* [PostgreSQL](#postgresql)
* [Nginx](#nginx)
* [Unicorn](#unicorn)
* [Capistrano](#capistrano)

Here are some resources I used to get everything setup the way I wanted:

* [Setting up Unicorn with Nginx](http://sirupsen.com/setting-up-unicorn-with-nginx/)
* [Setting up PostgreSQL on Ubuntu](https://help.ubuntu.com/community/PostgreSQL)
* [Lighting fast, zero-downtime deployments with git, capistrano, nginx and Unicorn](http://ariejan.net/2011/09/14/lighting-fast-zero-downtime-deployments-with-git-capistrano-nginx-and-unicorn)

I took my approach from many different places and I'll explain why I did what I
did.

**Update** - I have since watched a few Railscasts that are very well done and
explain most of the same concepts. There are several things that he recommends
doing that I will definitely do. He is charging money to see those episodes
($9/month), so I would feel a little guilty posting what I learned here.

* [Deploying To A VPS](http://railscasts.com/episodes/335-deploying-to-a-vps)
* [Nginx & Unicorn](http://railscasts.com/episodes/293-nginx-unicorn)
* [Capistrano Recipes](http://railscasts.com/episodes/337-capistrano-recipes)

<h3 id='why-these'>Why use these technologies?</h3>

#### Hosting

Originally, I wanted to host my website on **Heroku**. Heroku is
easy, awesome, and really simple. One web dyno is free and it can scale really
easily. For the foreseeable future, however, I will have very low traffic and I
want it to be as cheap as possible.

My problem with Heroku came when I realized that I needed more than 5MB of
database space. The next tier up gives me 20GB and costs $15/month. This is way
more space than I need and costs a lot more than I want to pay.

So, I started looking at VPS hosting since I can get a cheap VPS and have more
than 5MB of space for my database, plus I can use it to run jobs if I want,
etc. I looked at the cheapest offered solutions at Linode, Dreamhhost,
MediaTemple, Amazon, and Rackspace. Rackspace beats them all with 256MB of RAM
and 10GB Disk for $11/month + $0.18/GB of bandwidth. I highly doubt that I'll
even use 1GB of bandwidth. Plus, if I do need to scale, it will be really easy
to do it with Rackspace Cloud Servers.

#### Web Framework

Honestly, my main reason for doing my site in Rails is because I love Ruby and
Rails is fun to work in.

#### Http Server

My reasons are better stated by others:

* [Thin vs. Unicorn](http://cmelbye.github.com/2009/10/04/thin-vs-unicorn.html)
* [Unicorn!](https://github.com/blog/517-unicorn)
* [Mongrel vs. Passenger vs. Unicorn](http://labs.revelationglobal.com/2009/10/06/mongrel_passenger_unicorn.html)

Since this is for a low traffic site, I went on the word of others. If I was
expecting a lot of traffic, I probably would have done more research and some
of my own benchmarks. That said, I do feel pretty confident in this setup even
though I didn't do that. Let's get started!

<h3 id='configure-server'>Configure the server</h3>

#### Get a server with Ubuntu

With Rackspace Cloud Servers, this is very easy. Login to Rackspace, choose
Cloud Servers under Hosting, click Add Server, and choose your OS. I chose
Ubuntu 11.10 (Oneiric Ocelot). In just a minute, you'll have an IP address and
root credentials that you can use for ssh.

#### Install Stuff

I did everything using ssh. If you've never done this, Google it and learn the
best way to do it on your platform.

When you first get your server, it is pretty bare. Let's get some stuff
installed. First, you'll want to update apt-get so that it installs the latest
versions of everything:

{% highlight bash %}
$ apt-get update
{% endhighlight %}

Then, upgrade all the currently installed packages (-y means say yes to all
prompts):

{% highlight bash %}
$ apt-get upgrade -y
{% endhighlight %}

Now, we'll install new stuff:

{% highlight bash %}
$ apt-get install git-core, build-essentials, curl, zlib1g-dev, \
    libxml2-dev, libxslt1-dev, openssl, nodejs, postgresql, libpq-dev, \
    nginx
{% endhighlight %}

I installed nodejs, so that I'd have a javascript runtime to compile my static
assets. The postgresql packages is to run a PostgreSQL server on the machine.
The ligpq-dev is so that my pg ruby gem can connect to the PostgreSQL server.
The git-core package is so that I can run a `git pull` command to
update the code on the server. Everything else is a pretty fundamental
need.

Since I used rbenv and ruby-build for ruby, I didn't install any ruby package
here. Instead, I just made sure that all ruby's dependencies were
installed.

{% highlight bash %}
$ apt-get build-dep ruby1.9.3
{% endhighlight %}

#### Create a new user

Now, we need to create a user for our app to run as. I called mine `app_user`.

{% highlight bash %}
$ useradd -m -g staff app_user
{% endhighlight %}

The -m option will create the new user's home directory (/home/app_user). The
-g option tells it which group to add the user to (staff).

Set your new user's password.

{% highlight bash %}
$ passwd app_user
{% endhighlight %}

To allow app_user to execute commands with super-user privileges, you need to
add him to the sudoers file located at /etc/sudoers.

{% highlight bash %}
# /etc/sudoers
app_user ALL=(ALL) ALL
{% endhighlight %}

Now you're set to log out as root and log back in as app_user. If I specify any
commands that it says you don't have rights to access, just put `sudo` in front
of the command, enter app_user's password and it will let you.

#### Ruby

I really like [rbenv](https://github.com/sstephenson/rbenv). These steps are
mostly copied from its homepage, but slightly simplified for my use case.

Clone rbenv into ~/.rbenv.

{% highlight bash %}
$ cd
$ git clone git://github.com/sstephenson/rbenv.git .rbenv
{% endhighlight %}

Add ~/.rbenv/bin to your $PATH for access to the rbenv command-line utility.

{% highlight bash %}
$ echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.bash_profile
{% endhighlight %}

Add rbenv init to your shell to enable shims and autocompletion.

{% highlight bash %}
$ echo 'eval "$(rbenv init -)"' >> ~/.bash_profile
{% endhighlight %}

Restart your shell so the path changes take effect. You can now begin using
rbenv.

{% highlight bash %}
$ exec $SHELL
{% endhighlight %}

Now, we'll install ruby-build that makes it really simple to install ruby.

{% highlight bash %}
$ mkdir -p ~/.rbenv/plugins
$ cd ~/.rbenv/plugins
$ git clone git://github.com/sstephenson/ruby-build.git
{% endhighlight %}

Install the version of ruby that you want.

{% highlight bash %}
$ rbenv install 1.9.3-p125
{% endhighlight %}

Set the global version of ruby to that version (1.9.3).

{% highlight bash %}
$ rbenv global 1.9.3-p125
{% endhighlight %}

Rebuild the shim binaries. You should do this any time you install a new Ruby
binary (for example, when installing a new Ruby version, or when installing a
gem that provides a binary).

{% highlight bash %}
$ rbenv rehash
{% endhighlight %}

We're done installing ruby. Let's add some reasonable defaults for installing
ruby gems.

{% highlight bash %}
# ~/.gemrc
---
:update_sources: true
:verbose: true
:buld_threshold: 1000
:backtrace: false
:benchmark: false
gem: --no-ri --no-rdoc
{% endhighlight %}

Now let's just install a couple ruby gems that will allow us to use capistrano
later.

{% highlight bash %}
$ gem install rake
$ gem install bundler
$ rbenv rehash
{% endhighlight %}

<h3 id='postgresql'>PostgreSQL</h3>

#### Setup the PostgreSQL server

Since I'm installing the web app on the same server as the database, I was able
to take advantage of a cool feature in PostgreSQL: ident sameuser
authentication. Basically, it allows my application to not have to specify a
password. To use this, first we need to create a user in PostgreSQL with the
same username.

{% highlight bash %}
$ sudo -u postgres createuser --superuser $USER
{% endhighlight %}

Then, give your new PostgreSQL user a password:

{% highlight bash %}
# Run the psql command as the postgres user
$ sudo -u postgres psql
postgres=# \password app_user
# Type ctrl-d to exit psql
{% endhighlight %}

Now, you could make it even easier and not even have to specify a database name
if you create a database with the same name as your user, but I didn't do that.
I created a database with the same name as my app.

{% highlight bash %}
$ createdb my_app_name
{% endhighlight %}

You should be done setting up the PostgreSQL server. If you run into any
issues, try looking [here](https://help.ubuntu.com/community/PostgreSQL).

#### Configure Rails to talk to PostgreSQL

Make sure that you have the pg gem in your Gemfile:

{% highlight bash %}
# Gemfile
gem 'pg', group: :production
{% endhighlight %}

Add this to your database.yml file:

{% highlight yaml %}
# config/database.yml
production:
  adapter: postgresql
  database: my_app_name
  pool: 5
  timeout: 5000
{% endhighlight %}

<h3 id='nginx'>Nginx</h3>

I pretty much copied my configuration from
[Ariejan de Vroom](http://ariejan.net/2011/09/14/lighting-fast-zero-downtime-deployments-with-git-capistrano-nginx-and-unicorn)
with some changes for Rails 3.1 assets.

We just need to edit two files.  Make sure that you replace my_app_name with
your app's name.

{% gist 2303555 %}

Now, start nginx.

{% highlight bash %}
$ sudo nginx
{% endhighlight %}

<h3 id='unicorn'>Unicorn</h3>

Add unicorn to your Gemfile:

{% highlight ruby %}
# Gemfile
gem "unicorn"
{% endhighlight %}

Add this file to your rails app.  I pretty much copied this from
[Ariejan de Vroom](http://ariejan.net/2011/09/14/lighting-fast-zero-downtime-deployments-with-git-capistrano-nginx-and-unicorn)
and [GitHub](https://github.com/blog/517-unicorn).

{% gist 2303638 %}

<h3 id='capistrano'>Capistrano</h3>

This is a must-have since I wasn't going with Heroku. You can read more about
configuring Capistrano [here](https://github.com/capistrano/capistrano/wiki/2.x-From-The-Beginning).
First, you'll need the capistrano gem on your development box (not the server).
I put it in my Gemfile in my development group, then run capify.

{% highlight bash %}
$ gem install capistrano
$ capify .
{% endhighlight %}

Open up your Capfile and uncomment the assets line

{% highlight ruby %}
# Capfile
load 'deploy'
load 'deploy/assets' # Using Rails' asset pipeline
Dir['vendor/gems/*/recipes/*.rb','vendor/plugins/*/recipes/*.rb'].each { |plugin| load(plugin) }
load 'config/deploy' # Remove this line to skip loading any of the default tasks
{% endhighlight %}

Now we need to modify the config/deploy.rb file to setup our tasks.

{% gist 2304004 %}

I overrode the assets:precompile task so that it only precompiles them if they
changed. The comments really pretty much describe everything in there.

#### Our first deploy

Run these capistrano tasks and resolve any errors that you may get. (There
should be any).

{% highlight bash %}
# Create directories for your app, etc
$ cap deploy:setup
# Check to make sure everything is ready to go
$ cap deploy:check
# Deploy your code
$ cap deploy:update
{% endhighlight %}

SSH into the server and run this (You can do this part with Capistrano. I
didn't.)

{% highlight bash %}
# load the schema into the database
$ rake RAILS_ENV=production db:schema:load
# see if the application can start
$ bundle exec rails c production
{% endhighlight %}

If your application started up, you're set to go. From now on, to deploy you
can just push your code changes to GitHub and run cap deploy and you're set!

#### Thoughts

I'm really happy with this setup. My website is pretty fast. Pages consistently
load in less than 400ms. It's amazing to me how it can be so fast running on
256MB of RAM.

This was my first time deploying a website like this. I know that I'll learn
more and probably make changes as I go. I'll keep this post up to date with
what I have learned. If you have suggestions or questions, feel free to
ask.

At some point, I'll probably configure upstart to monitor my application. I'll
use an ssl certificate. I'll probably also use this same server to host other
websites. I'm curious to see what effect it will have if I tweak some of the
settings like the number of unicorn workers, etc. It would be fun to test that
and find the right number.

