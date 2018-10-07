---
layout:        post
title:         "The State of Docker Orchestration"
date:          "0000-00-00 00:00:00"
categories:    blog
excerpt:       ""
preview:       /assets/img/docker-orchestration.jpg
fbimage:       /assets/img/docker-orchestration.png
twitterimage:  /assets/img/docker-orchestration.png
googleimage:   /assets/img/docker-orchestration.png
twitter_card:  summary_large_image
tags:          [DevOps, Docker]
---

I get a lot of questions about running Docker in production: should you run it by itself? Or use `docker-compose`?
Swarm sounds kinda easy, but is it stable? And Kubernetes is scary.... so why don't we have a gander through the most
well known techniques to run Docker in production and what they entail.

> **Hint:** if you don't yet know how Docker works and what it actually is, [take a look behind the scenes in this
> article](/blog/under-the-hood-of-docker)

## Before we begin: why orchestration is important

You might wonder, what's the deal with Docker orchestration anyway? Is it not enough if I just start my Docker
containers by hand?

And the answer may be that it's perfectly fine to start a Docker container by hand, if you just need to start them once
and don't really want to update them.

You see, the best practice update strategy for Docker is actually not updating at all. When you need an updated piece
of software, you simply *replace* the Docker container. In essence, stop the old one, start the new one. If you have
shared data, you can &ldquo;simply&rdquo; mount the folders for that from the host machine.

If you don't have orchestration, you will need to do the legwork every time you want to update your services: stop the
container by hand, dig up the command line to start the container from the wiki, start it, if it fails, debug it.

It's simply time consuming and unnecessary. That's where orchestration tools come into play: they let you describe
how to run a Docker container in a configuration file and will take care of calling the Docker API on behalf of you.  

## docker-compose, the poor mans orchestrator

Let's say you only have one or two servers and you don't really want to make a huge fuss around this whole orchestration
business: you don't want to run any special software, you don't want to have to deal with it.

Yet, you want a self-documenting infrastructure that can be reproduced easily. That's when docker-compose comes in
handy. It simply takes a file in YAML format that describes what containers should be run and runs them when you prompt
it to run.

Yes, that's it, no fuss. And there's no shame in using docker-compose either, I use it for running my monitoring system,
for example. It's simple and stable.

So how does such a file look like? Well, it's pretty simple, something like this:

```yaml
version: '3.4'
services:
  mysql:
    container_name: mysql
    image: "opsbears/mysql"
    volumes:
      - type: bind
        source: /srv/mysql
        target: /srv/mysql
      - type: bind
        source: /srv/secrets/mysql_root_password
        target: /srv/secrets/mysql_root_password
    environment:
      - "MYSQL_ROOT_PASSWORD_FILE=/var/run/secrets/mysql_root_password"
      - "MYSQL_ROOT_HOST=${MYSQL_ROOT_HOST}"
    ports:
      - "3306:3306"
    restart: unless-stopped
```

As you can see, it's pretty simple, you just put the parameters you would normally specify via the command line into
a file. Needless to say, you can also specify multiple containers, and they will even be able to reach each other via
their respective names as long as they run on the same machine.

Once you have this file created, you can then start the containers:

```bash
docker-compose up -d
```

Often docker-compose gets the job done quite nicely, especially in conjunction with Ansible as an automation tool.
The [official documentation](https://docs.docker.com/compose/) is also quite nice and if this is all that you need,
you can stop reading here.

## Docker Swarm

