---
layout:        post
title:         "VIM is not an IDE"
date:          "2019-02-19 00:00:00"
categories:    blog
excerpt:       "VIM is not an IDE. Time to get one if you are serious about writing clean code."
preview:       /assets/img/vim-is-not-an-ide.jpg
fbimage:       /assets/img/vim-is-not-an-ide.png
twitterimage:  /assets/img/vim-is-not-an-ide.png
googleimage:   /assets/img/vim-is-not-an-ide.png
twitter_card:  summary_large_image
tags:          [Development, Clean Code]
sharing:
  twitter:  "Hey #vim lovers, if you write a lot of code, you may want to consider an IDE. #cleancode"
  facebook: "Hey #vim lovers, if you write a lot of code, you may want to consider an IDE. #cleancode"
  linkedin: "Hey #vim lovers, if you write a lot of code, you may want to consider an IDE. #cleancode"
  patreon:  "Hey #vim lovers, if you write a lot of code, you may want to consider an IDE. #cleancode"
  discord:  "@everyone Hey vim lovers, if you write a lot of code, you may want to consider an IDE."
---

I admit, that tagline might have been a bit provocative. There are many good uses for simple editors like vim,
especially when it comes to administering servers, writing scripts, and so on. However, when it comes to writing
large, complex applications simple editors are actually encouraging bad practices.

## The directory tree

Our editors and IDEs heavily influence what we optimize for. For example, if you use an IDE, a glance to the left
give you the directory tree. Therefore it is not a big hassle to create more files.

<figure><img src="/assets/img/ide-directory-tree.png" alt="" /><figcaption>The directory tree of this website, as I'm writing it.</figcaption></figure>

You can, of course, achieve a [similar setup with vim](https://shapeshed.com/vim-netrw/), but you will need to do the
config legwork to get netrw or NERDtree running. In addition, netrw, as I have tested it, doesn't work well with tabs,
since tabs open on top of the split layout.

<figure><img src="/assets/img/vim-split.png" alt="" /><figcaption>A split view directory tree in vim.</figcaption></figure>

**Vim is immensely powerful, but at its core it is designed to work on one, or very few files.** In the last decade
development of more complex software has moved to more, smaller files, self-contained, small, testable units. I have
made the experience that coders using an editor that does not make handling a large number of files are usually
afraid from having many files resulting in arguments like &ldquo;*In Java you need 42 classes for a
Hello world!*&rdquo;.

Putting aside how nonsensical this argument is (it can be done in one class), the reason why many Java devs use so many
classes is because they want to have testable units, as well as easy to replace parts. In the face of changing 
requirements it is better to have smaller, easy to replace units than huge chunks of code.

When I see people using &ldquo;simple&rdquo; editors (I know, vim is massively powerful) that do not encourage working
with multiple files well, I usually also see very very long sections of code. Often several thousand lines long.

It's not just the editors fault, of course, but as the saying goes, if all you have is a hammer, everything looks like
a nail. Again, not wanting to detract from the immense toolset vim brings to *editing individual files*.

> **Further reading:** [The Cookie Cutter Architecture](/blog/the-cookie-cutter-architecture)

## No early warning system

Another important feature modern IDEs bring is in-depth code analysis. This is especially important if you are working
in a [dynamically typed language](/blog/loose-strict-static) since there is no compiler that will throw the code
back in your face when you have a string but you try to use it as an int.

However, this goes further than just a simple type-check. After all, you could use a static type checker for that. The
idea is that the IDE will tell you about potential mistakes *as you write them*. A good IDE will root out your bad 
practices. The turnaround time between making a mistake and fixing it is much faster.

<figure><img src="/assets/img/ide-static-code-analysis.png" alt="" /><figcaption>A code analysis warning in a modern IDE.</figcaption></figure>

This, of course, also influences how you write code. If you pay attention to these kind of warnings you will stop being
callous about writing potentially unsafe code.

Look, I get it when someone writes a genious piece of code that compresses several hundred lines of code down to five,
but you have to realize that in most cases those five lines will be utterly unreadable. When the next guy comes along
to edit something they will have a hard time to work with it.

In most cases good code is simple, boring and easy to read. That means I shouldn't have to figure out by what dark 
magic your variable exists. I should be able to Ctrl+Click in my modern IDE and it should get me to where that 
variable is defined.

And in the odd chance that you really, really need to do micro-optimization in the code instead of macro optimization,
it should be really really well documented.

<figure><img src="/assets/img/ide-suppressed-inspection.png" alt="" /><figcaption>A suppressed inspection in a modern IDE</figcaption></figure>

These kind of inspections are basically like a quick code review, but automated. You should use them.

> **Further reading:** [The loose, the strict and the static typing](/blog/loose-strict-static)

## Discoverability

This leads us right into the next topic: discoverability. When diving into some unknown piece of code 
readability and discoverability are the two most important aspects. Having a
[good architecture](/blog/structure-based-on-intent) is, of course, paramount, but diving into the code is still a
challenge, especially when the code is a bit older and has overgone a few iterations.  

Most of us developers, at some point in our lives, get a piece of code we haven't written and the original maintainer
is long gone. The first reaction, of course, is *&ldquo;This is shit. We need to rewrite it.&rdquo;* However, if
that particular piece of code is making a lot of money simply rewriting it is simply not an option. Not to mention that
the business rules that govern that piece of code may not even be written down and we would have to spend months trying
to learn it.

This is when having a powerful IDE comes in handy. Most modern IDEs index the code and let us search very quickly. We
can often even specify context, such as search for this only in comments, or only in code. We can then also Ctrl+Click
our way through the codebase. 

You may be thinking that you will not deal with code someone else wrote. Guess what! If you leave your own code alone 
for six months down the line your own code is going to look alien to you. You will have to re-learn the structures
of your project, what is where, etc.

## Refactoring

Once we have done our discovery, it is often time to refactor. Badly named variables and classes can make our own life 
hell, so how about changing them?

If you have an IDE that has code analysis and refactoring capabilities, you're all set. Right click, refactor, rename.
Do a test run, if it still works, you're good.

However, this is only possible if the IDE *understands* how the code is structured. A simple search and replace won't do
as you might replace a lot of things you didn't intend to.

<figure><img src="/assets/img/ide-refactor.png" alt="" /><figcaption>Refactor operation in a modern IDE.</figcaption></figure>

## Not the tools you are looking for

These are just a few examples how IDEs help getting a better coder. They certainly helped me learn new programming 
languages by pointing out inefficient code or bad practices. 

In general, as you go into larger, team projects, having an IDE that helps you reign in the chaos is definitely a must.
In my eyes &ldquo;simple&rdquo; editors are just not suitable for projects above a few thousand lines of code as they
will not give you the tooling support.

And they don't even have to be expensive! [Visual Studio Code](https://code.visualstudio.com/), or
[PyCharm Community Edition](https://www.jetbrains.com/pycharm/) are just a few examples for free, powerful IDEs.
Take your pick!

## You can still use vim

If you're a vim addict, you don't have to give up any of that despite using a modern IDE. Most development environments
offer vim emulation, so you can use all your vim text editing goodies. There is no reason not to embrace the IDE as a
powerful tool to help you with your code, but still keep your keyboard-only text editing superpowers.