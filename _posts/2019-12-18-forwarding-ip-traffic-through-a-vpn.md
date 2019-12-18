---
layout:        post
title:         "Forwarding IP traffic through a VPN"
date:          "2019-12-18"
categories:    blog
excerpt:       "You have two servers and want to serve the traffic for an IP address on one server from another server? "
preview:       /assets/img/forward-ip-traffic-vpn.jpg
fbimage:       /assets/img/forward-ip-traffic-vpn.png
twitterimage:  /assets/img/forward-ip-traffic-vpn.png
googleimage:   /assets/img/forward-ip-traffic-vpn.png
twitter_card:  summary_large_image
tags:          [Linux, Netowrking]
sharing:
  twitter:  "Want to serve traffic for an IP from a different server? Here's how!"
  facebook: "Want to serve traffic for an IP from a different server? Here's how!"
  linkedin: "Want to serve traffic for an IP from a different server? Here's how!"
  patreon:  "Want to serve traffic for an IP from a different server? Here's how!"
  discord:  "@everyone @krnlpnc#1927 asked for it: how do do you forward IP traffic through a VPN"
---

One of my readers has posed me the question a while ago: I have two servers, A and B. How do I run a webserver on 
server B, but still forward the traffic from server A's IP address to it?

## The test setup

Before we start our little experiment, let's make one thing abundantly clear: creating a firewall for a production-grade
server is way, way out of scope for this document, so we will use Docker containers to simulate our environment.

First of all we will create a network:

```
docker network create --gateway 192.168.0.254 --subnet 192.168.0.1/24 test
```

Then create the first (A) server:

```
docker run --cap-add NET_RAW --cap-add NET_ADMIN --name server-a --network test --ip 192.168.0.1 -dti ubuntu
```

Then we create the second (B) server with nginx in it:

```
docker run --cap-add NET_RAW --cap-add NET_ADMIN --name server-b --network test --ip 192.168.0.2 -d nginx
```

If we did everything correctly, `docker ps` should yield the following:

```
CONTAINER ID        IMAGE    COMMAND                  CREATED             STATUS              PORTS               NAMES
1d8d2a56af5b        nginx    "nginx -g 'daemon of…"   3 seconds ago       Up 2 seconds        80/tcp              server-b
1566ff29bf76        ubuntu   "/bin/bash"              14 seconds ago      Up 13 seconds                           server-a
```

Next, let's install some utilities:

```
docker exec -ti server-a /bin/sh -c "apt update && apt install -y tcpdump iproute2 iptables
docker exec -ti server-b /bin/sh -c "apt update && apt install -y tcpdump iproute2 iptables
```

Let's check if our servers have the correct IP addresses:

```
# docker exec -ti server-a ip addr show dev eth0
36: eth0@if37: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP group default 
    link/ether 02:42:c0:a8:00:01 brd ff:ff:ff:ff:ff:ff link-netnsid 0
    inet 192.168.0.1/24 brd 192.168.0.255 scope global eth0
       valid_lft forever preferred_lft forever
# docker exec -ti server-b ip addr show dev eth0
38: eth0@if39: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP group default 
    link/ether 02:42:c0:a8:00:02 brd ff:ff:ff:ff:ff:ff link-netnsid 0
    inet 192.168.0.2/24 brd 192.168.0.255 scope global eth0
       valid_lft forever preferred_lft forever
```

If your IP's are different at this point, note them and adjust them accordingly. As a final test, let's open 
http://192.168.0.2 from the host machine:

```
curl http://192.168.0.2
```

The result should be the source code of the default nginx page. Now, our goal is to be able to access the webserver
running in `server-b` on the IP address `http://192.168.0.1`

## The simple answer

Let's look at it from the perspective of `server-a`. You can run a `tcpdump` to see the packets coming in when a 
connection is attempted:

```
# docker exec -ti server-a tcpdump -i eth0 -n port 80
tcpdump: verbose output suppressed, use -v or -vv for full protocol decode
listening on any, link-type LINUX_SLL (Linux cooked), capture size 262144 bytes
22:15:17.405131 IP 192.168.0.254.56988 > 192.168.0.1.80: Flags [S], seq 1891979943, win 29200, options [mss 1460,sackOK,TS val 1916994860 ecr 0,nop,wscale 7], length 0
22:15:17.405150 IP 192.168.0.1.80 > 192.168.0.254.56988: Flags [R.], seq 0, ack 1891979944, win 0, length 0
```

Pay attention to the IP's. The first packet is coming in, then a response is going out. If you look at the flags, the
first one is a SYN (to open a connection), the response is a RST (to reject the connection). What we want to do is get
server A to, instead of rejecting the packet, forwarding it to `server-b`. In order to do that we need to *hack*
server A to change the destination IP address of this packet:

```
docker exec -ti server-a iptables -t nat -A PREROUTING -d 192.168.0.1 -p tcp --dport 80 -j DNAT --to 192.168.0.2
```

After this let's run the test again and try to query `http://192.168.0.1`, this is the result:

```
# docker exec -ti server-a tcpdump -i eth0 -n port 80
tcpdump: verbose output suppressed, use -v or -vv for full protocol decode
listening on eth0, link-type EN10MB (Ethernet), capture size 262144 bytes
22:18:24.217281 IP 192.168.0.254.57022 > 192.168.0.1.80: Flags [S], seq 2407047481, win 29200, options [mss 1460,sackOK,TS val 1917181674 ecr 0,nop,wscale 7], length 0
22:18:24.217348 IP 192.168.0.254.57022 > 192.168.0.2.80: Flags [S], seq 2407047481, win 29200, options [mss 1460,sackOK,TS val 1917181674 ecr 0,nop,wscale 7], length 0
22:18:25.242603 IP 192.168.0.254.57022 > 192.168.0.1.80: Flags [S], seq 2407047481, win 29200, options [mss 1460,sackOK,TS val 1917182699 ecr 0,nop,wscale 7], length 0
22:18:25.242666 IP 192.168.0.254.57022 > 192.168.0.2.80: Flags [S], seq 2407047481, win 29200, options [mss 1460,sackOK,TS val 1917182699 ecr 0,nop,wscale 7], length 0
```

So you can see, the packet with the destination IP `192.168.0.1` is coming in, and the packet to `192.168.0.2` is going
out. Please note that the source IP address has *not changed*. This is called a destination NAT. In contrast, changing
the source IP is called a source NAT. Destination and source NAT together give a full NAT.

Now, this is all cool, but it still isn't working, so let's take a look what's happening in the mean time on server B:

```
# docker exec -ti server-b tcpdump -i eth0 -n port 80
docker exec -ti server-b tcpdump -i eth0 -n port 80
tcpdump: verbose output suppressed, use -v or -vv for full protocol decode
listening on eth0, link-type EN10MB (Ethernet), capture size 262144 bytes
22:20:56.454868 IP 192.168.0.254.57046 > 192.168.0.2.80: Flags [S], seq 3125382617, win 29200, options [mss 1460,sackOK,TS val 1917333912 ecr 0,nop,wscale 7], length 0
22:20:56.454884 IP 192.168.0.2.80 > 192.168.0.254.57046: Flags [S.], seq 498628625, ack 3125382618, win 28960, options [mss 1460,sackOK,TS val 3129097399 ecr 1917333912,nop,wscale 7], length 0
22:20:56.454911 IP 192.168.0.254.57046 > 192.168.0.2.80: Flags [R], seq 3125382618, win 0, length 0
```

Something very strange is going on. We receive the incoming packet with a SYN flag, to which our server correctly 
responds with a SYN-ACK to establish a connection, but then the client sends an RST, rejecting the SYN-ACK packet sent
in response.

This is happening because the host machine that originally sent the packet expect the answer from `192.168.0.1`, and
not `192.168.0.2`, so it rejected the packet. In a production network environment you may also see that this packet
simply disappear, but more on that later.

So how do we change the path of the returning packet? We can't intercept it on server A because our return packet
is not going through server A, it is directly going back to the querying host.

In order to make the response packet go back to server A we can ask server A to not only do a DNAT, but also an SNAT, 
so it will appear to server B that server A was actually opening the connection:

```
docker exec -ti server-a iptables -t nat -A POSTROUTING -d 192.168.0.2 -p tcp --dport 80 -j SNAT --to 192.168.0.1
```

Hooray! After this everything will work! However, if we inspect the traffic on server B we will see a strange thing:

```
docker exec -ti server-b tcpdump -i eth0 -n port 80tcpdump: verbose output suppressed, use -v or -vv for full protocol decode
listening on eth0, link-type EN10MB (Ethernet), capture size 262144 bytes
22:26:16.070868 IP 192.168.0.1.57130 > 192.168.0.2.80: Flags [S], seq 3230417142, win 29200, options [mss 1460,sackOK,TS val 1917653529 ecr 0,nop,wscale 7], length 0
```

The traffic *appears* to be coming from `192.168.0.1` and the information where the connection came from is completely
lost.

## Routing to the rescue

So let's remove that last iptables rule:

```
docker exec -ti server-a iptables -t nat -D POSTROUTING -d 192.168.0.2 -p tcp --dport 80 -j SNAT --to 192.168.0.1
```

Instead, we should tell server B to send the traffic back via server A. This can be done using a simple routing rule:

```
$ docker exec -ti server-b ip route del default via 192.168.0.254 dev eth0
$ docker exec -ti server-b ip route del 192.168.0.0/24 dev eth0 proto kernel scope link src 192.168.0.2
$ docker exec -ti server-b ip route add 192.168.0.1/32 dev eth0 proto kernel scope link src 192.168.0.2
$ docker exec -ti server-b ip route add default via 192.168.0.1
```

This way the routing will be reconfigured on server B such that it can only send packets directly to server A, and
everything else goes over server A. This way server A acts as a router for server B and translates the packets back to
the IP address of server A.

