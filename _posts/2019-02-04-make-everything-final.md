---
layout:        post
title:         "Make all classes final!"
date:          "2019-02-04 00:00:00"
categories:    blog
excerpt:       "I have a pretty radical suggestion for clean code: make all your classes final!"
preview:       /assets/img/make-everything-final.jpg
fbimage:       /assets/img/make-everything-final.png
twitterimage:  /assets/img/make-everything-final.png
googleimage:   /assets/img/make-everything-final.png
twitter_card:  summary_large_image
tags:          [Clean Code, Development]
sharing:
  twitter:  "Here's a radical idea: why not make all classes final? #cleancode #development"
  facebook: "Here's a radical idea: why not make all classes final? #cleancode #development"
  linkedin: "Here's a radical idea: why not make all classes final?"
  patreon:  "Here's a radical idea: why not make all classes final?"
  discord:  "@everyone Here's a radical idea: why not make all classes final?"
---

Wait, what? Now I must have surely lost my marbles, right?

Well, let's back up a bit. What is final and why am I making such a recommendation?

In Java and other OOP the `final` keyword can be used to prevent a class from being extended. This is an effective
method to lock down a class. It works like this:

```java
final class MyClass {
}
```

If you now try to extend this class, you will get an error:

```java
class MySubClass extends MyClass {
}
```

So, why am I claiming you should make all (well, most) of your classes final? 

## The Open-Closed principle

If you have heard about the S.O.L.I.D. principles before you may be thinking that I've completely lost it. Specifically,
my suggestion seems to violate the Open-Closed principle (OCP).

There are multiple authors who described this principle, but all of them boil down to the same point:

> **Open-Closed Principle**: Software entities (classes, modules, functions, etc.) should be open for extension, but 
> closed for modification. *&mdash; Robert C. Martin*

The reason for the open part should be pretty obvious: if a module / class / etc is not open, there is no way to extend
it with additional functionality without modifying the code of the original module.

When you want a long term maintainable code base having to touch existing modules just to implement new functionality
is evil. Because of a new feature you would have to touch old code. In other words, you implement a new feature and you
may end up breaking some old functionality. This is especially true if you do not have tests.

So what about the closed part? The closed part says that you should not allow a module / class / etc to be modified 
externally. A most prominent example of a non-closed module is the following implemented in Java:

```java
class UserLister {
  private List<User> users;
  
  public List<User> getUsers() {
    return user;
  }
}
``` 

Why is this a problem? The `getUsers` method returns the original user list, which, if you are not familiar with Java,
sounds ok. However, most implementations of `List` implement the interface faithfully, making it mutable. In other 
words this is possible:

```java
userLister
  .getUsers()
  .add(
    new User("Janos")
  );
```

Because `getUsers` returns a reference to the original, internal `users` variable of the `UserLister`. We can **modify
the internal state of `UserLister`** without the class even knowing about it. We are violating the **closed** part of 
the Open-Closed principle. Or, if you want to put it differently, we are violating
[encapsulation](/blog/oop-misunderstandings).

## Missing the closed part

What does all this have to do with `final`? Why are we even talking about it? Let me explain.

Classes, by default, can be extended. In my read this means that they are *open* by default. Without any design.

In fact, I find that most class authors don't even think about how a certain class will be extended. In other words,
the class is not *designed* to be extended.

This, of course, is a clear violation of the OCP. Ideally this shouldn't happen, but let's be honest, we all make
mistakes and create too open classes just because it is the default.

## Closed by default

Most OOP languages, like Java, are open by default when it comes to extending. However, because we tend to not think
about OCP so much, that we make our classes *closed by default*. One method to ensure that a class is closed is to
apply the `final` keyword to all classes.

When a class then needs to be extended by design, the final keyword can be removed. However,
[as I argued before](/blog/oop-misunderstandings), it is better to use composition rather than extension to make 
classes open.

It is also important to note that `final` itself does not prevent a class to be *accidentally open*, as demonstrated
before the usage of `List` in Java can lead to internal state leakage. To prevent those kind of issues you can
use [immutability](/blog/why-immutability-matters). But, of course, thinking always helps.

## Sources:

- [Robert C. Martin: The Open-Closed Principle](https://web.archive.org/web/20060822033314/http://www.objectmentor.com/resources/articles/ocp.pdf)
- [Craig Larman: Protected Variation: The Importance of Being Closed](http://codecourse.sourceforge.net/materials/The-Importance-of-Being-Closed.pdf)