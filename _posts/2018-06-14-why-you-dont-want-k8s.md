---
layout:        post
title:         "Why you don't want Kubernetes (yet)?"
date:          "2019-06-14 00:00:00"
categories:    blog
excerpt:       "Kubernetes won the container wars... allegedly. Yet, there are a million reasons not to use it to run your containers. Let's look at a few of them."
preview:       /assets/img/why-you-dont-want-k8s.jpg
fbimage:       /assets/img/why-you-dont-want-k8s.png
twitterimage:  /assets/img/why-you-dont-want-k8s.png
googleimage:   /assets/img/why-you-dont-want-k8s.png
twitter_card:  summary_large_image
tags:          [DevOps, Kubernetes, Docker]
---

## How does Kubernetes work?

In broad strokes, Kubernetes or K8s seems to be very simple. The nodes (machines) you run Kubernetes on are split into
(at least) two types: the master and the workers. The master (or masters), by default, does not run any actual
workload, that's the workers job.

The Kubernetes master includes a component called the API server which provides an API that you can talk to using the
`kubectl`. In addition it also includes a scheduler, which makes decisions on which container is supposed to run where
(*schedules* the containers). The final component is the controller-manager, which is actually a set of multiple
controllers responsible for handling node outages, handling replications, joining services and pods (sets of containers),
and finally dealing with service accounts and API access tokens. All the data is being stored in etcd, which is a NoSQL
style database. So to sum it up, the master is responsible for managing the cluster. No big surprise there.

The worker, on the other hand, is running the actual workloads. To do that it includes, again, a number of components.
First off, it runs the *kubelet*, which is again an API that works with the containers on that node. (We'll mention this
later.) There's also the kube-proxy, which forwards network connections, containerd to run containers, and depending on
your configuration there may be other things such as gVisor.

You get the picture. There are *a lot of moving parts* in Kubernetes. If you want a more complete overview, I recommend
doing Kelsey Hightowers [Kubernetes - The Hard Way](https://github.com/kelseyhightower/kubernetes-the-hard-way).

## Running in the cloud

Cloud providers, of course, have recognized that running K8s isn't exactly trivial, so all big three providers (GCloud,
AWS, Azure) now have offerings to run Kubernetes as a service. However, beware of the differences between these
offerings. While GCloud and Azure don't charge you for running the master, Amazon Web Services does. At the time of
writing running an empty (!) cluster costs around 144$ per month, and then you pay extra for your worker nodes.

Also, cloud offerings are, by necessity, limited. I myself have had the displeasure of experiencing them, even 
though I only run a few thousand containers. If you want to run something that's a bit out of the ordinary, you may find
that it is neither easy nor really supported. Cloud support engineers often scratch their heads when I confront them 
with the issues I'm having.

There is a lot to be said for running things in the cloud, but let's face it: not everybody can or wants to do that.
Some folks will have to do what [I have dubbed SmallOps](https://twitter.com/janoszen/status/1002477201944694784):
renting 2-3 servers and *that has to be enough*. Not everybody has a budged of several thousand USD per month to run
servers.

## Ways of shooting yourself in the foot

As demonstrated, Kubernetes is a highly complex beast. But surely, if you use some tool to manage that for you this
isn't as much of a problem, right? Well, wrong. Let's look at just a few ways of shooting yourself in the foot. They
can be worked around it, but they require work.

### Kubernetes API access ☠

The blindingly trivial case of stupid is when someone leaks their API keys for Kubernetes. One would think this is
not really an issue, but people still leak their AWS API keys in git commits and are surprised by a massive bill due to
cryptomining happening on their account.

The same can happen to your Kubernetes certificates. Need a quick script to provision something? Do you, by any chance,
want to run Ansible from a CI system and put your API keys in a git repo? Well, there's a prime starting point for
leaks.

A ton of tutorials tell you to put your K8s API on the public internet... what happens if your API keys are leaked? Or,
even worse, what happens if *there is a bug* in the Kubernetes API? Your *only* layer of defense in this case is the API
server. If people get into that, it's game over for your whole cluster. Being able to run containers on your
infrastructure, especially with elevated privileges, means that you will have to *wipe the whole thing*.

### Internal network access ☠

What if there are no public APIs one can attack? Ok, how about an internal API? If you are thinking, oh, I'm just
running the code Joe over there wrote, remember, Joe is the guy who ships 5 PM on Fridays and writes no unit tests for
his code. He doesn't look at his app from a security perspective, and as such, may not consider that his yolo-style curl
call to open a webpage may be used to access services on the internal network. I'm talking about things like the
[AWS](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-metadata.html) or
[GCloud metadata API](https://cloud.google.com/compute/docs/storing-retrieving-metadata)
which may contain sensitive information in the user data, your Redis instance or even the various Kubernetes APIs, not
to mention the cloud provider API keys that the server itself has. This key allows you to do whatever the server 
is allowed to do.

### Kubelet API ☠

As I mentioned above, if you get access to the Kubelet API (the thing on a single node) you can run a container on that
node. Running a container without security contraints, again, means you'll have a really bad day. As such, it needs to
be secured, even from an internal network. A good Kubernetes installation secures it via the usual public-private key
certificate solution, but again, if your keys are leaked, this could be a good avenue for attack.

### Open etcd ☠

The etcd database is your primary source of truth. It contains a lot of your secrets, and possibly even your cloud API
keys. Etcd does have an authentication option, but a lot of sysadmins failed to enable it, and even worse, put it on a 
public IP address. Or even if it's not a public IP, if it's exposed to your workers, an attacker could trick an
application running on those workers to connect to etcd, which conveniently talks HTTP.

### Running untrusted containers ☠

Often times you see people advocating for you to run their Docker containers as an easy means to run a software. Docker
and Kubernetes is secure, right? First of all, how do you know
[it doesn't contain Bitcoin miner](https://arstechnica.com/information-technology/2018/06/backdoored-images-downloaded-5-million-times-finally-removed-from-docker-hub/)?
Or even if that's not the case, your internal services are now wide open to the creator of that image.

### Other APIs

Again, depending on how you install Kubernetes, there may be more APIs that are open to the internal network: cadvisor,
the Kubernetes dashboard, etc all create interfaces accessible using a HTTP request.

A lot of these issues are **now resolved as a default** or have the option to lock them down. However, the complexity is
your enemy, as accidentally disabling a setting can leave your cluster vulnerable. Unless you are prepared to do
detailed security scanning and audits, Kubernetes may not be for you.

To be clear, these are issues that are not unique to Kubernetes, but because of the sheer number of things going on
you may lose track of something.

## Debugging Kubernetes

Assuming you just installed Kubernetes using some fancy tool, such as kubeadm or kops... how will you debug it if things
go wrong? Do you know enough about the details and inner workings to fix issues that pop up?

## Updating Kubernetes

What few people pay attention to in the beginning is that Kubernetes has a maintenance period of only 6 months. That
means that in 6 months *latest* you **have** to update, which in and of itself isn't exactly a walk in the park.

## Should you use Kubernetes?

In my opinion, unless are using a cloud provider or you have a dedicated ops team to run it for you, **probably not**.
In SmallOps you want to focus on your money making venture, and not spend your time on running something as complex
as K8s.

## Alternatives?

Despite the hype surrounding Kubernetes, there are alternatives. For one, if you really just need to run a few 
containers on one server, docker-compose is a very handy tool to do that. To scale to a couple of servers, Docker Swarm
does a nice job and has a low complexity. Other folks have also reported that Mesos seems to work nicely.

**There is room in the world for more than one container orchestrator.** Not everyone has to run Kubernetes.
