---
layout:        post
title:         "Fundamentals: How does IPv6 work?"
date:          "2019-12-27 00:00:00"
categories:    blog
excerpt:       "IPv6 has been around for 20 years now, but it is still not common knowledge. Let's take a look at how it works."
preview:       /assets/img/fundamentals-ipv6.jpg
fbimage:       /assets/img/fundamentals-ipv6.png
twitterimage:  /assets/img/fundamentals-ipv6.png
googleimage:   /assets/img/fundamentals-ipv6.png
twitter_card:  summary_large_image
tags:          [Development, DevOps, Theory]
sharing:
  twitter:  "Still confused about #IPv6? Let me help!" 
  facebook: "Still confused about #IPv6? Let me help!"
  linkedin: "Still confused about IPv6? Let me help!"
  patreon:  "Still confused about IPv6? Let me help!"
  discord:  "@everyone still confused about IPv6? Let me help!"
---

Let's start from a very simple premise. IPv4 has 32 bit address fields. That means that in total there can only ever be
around 4 billion addresses. Sounds like a lot, but it isn't. We are just shy of 8 billon people on the planet, and 
we didn't even count all the embedded devices, cars, and IoT devices that will be connected to the Internet in the
coming years. Just in Austria alone (a country of 8 million people) it is [predicted](https://derstandard.at/2000089727099/Bis-2020-sind-in-Oesterreich-80-Millionen-Geraete-im-Internet)
that there will be 80 million devices by 2020.

So, we are running out of IP addresses. Of course, carrier-grade NAT can help, but it only gives us a longer rope. 