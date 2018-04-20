---
layout:        post
title:         "Why testing is hard"
date:          "2018-05-23 00:00:00"
categories:    blog
excerpt:       "&ldquo;Thou shall test your code!&rdquo; — the theory says. But in practice it's very hard to do that. Let's take a look at why that is."
preview:       /assets/img/why-testing-is-hard.jpg
fbimage:       /assets/img/why-testing-is-hard.png
twitterimage:  /assets/img/why-testing-is-hard.png
googleimage:   /assets/img/why-testing-is-hard.png
twitter_card:  summary_large_image
tags:          [Development, Clean Code, Testing]
---

For years and years I've tried — unsuccessfully — to implement testing into my code. I tried everything: have an
automatic script click through the website and see if it still works, I tried writing tests against the whole
application with a test database I always had to reset.

It just wouldn't work. The tests always broke, nobody had time to maintain, and at one occasion a fellow developer
ran the tests against a production database. Exactly as funny as you think it is. Not ha-ha funny, but it's
a good story to tell.

At the time I was furious at the person in question, but thinking back, the application just didn't lend itself
to being tested.

## Writing a testable application

Over the last two years I took a different approach to development. Not because I necessarily wanted to write more 
*testable* code, but because I wanted to have a cleaner, more maintainable piece of code. The testability came as an
added bonus.

So, what did I do?

If you look at [some of my old code](https://github.com/opsbears?utf8=%E2%9C%93&q=obf&type=public&language=php) I
left up for posterity, you will see that I used to use a lot of static function calls. At that time I simply looked 
at classes as a container for functions. I wanted to write a wrapper that made built-in functions in PHP better, but
I didn't look at classes and objects as things to be passed around.

However, as I've [written previously](/blog/oop-basics), the whole point of object-oriented programming is to have
a data structure paired with functionality, that can be moved between the different parts of our application. At some
point I've abandoned the OBF project since I realized that having a system made of static calls was basically procedural
programming.

For a brief period of time I switched over to Symfony. However, my controllers looked like this:

```php?start_inline=1
class AdminController extends Controller {
    /**
     * @Route("/admin/users/{id}", name="admin_user_edit")
     */
    public function editUserAction(Request $request, $id) {
        $em = $this->get('doctrine')->getManager();
        //Do database stuff with $em here
    }
}
```

There are two problems with this piece of code. First of all, through `$em` I was accessing the database directly from
the controller. No separated business logic, everything in one class.

The second problem was that the controller method in this case used the `$this->get('doctrine')` call to obtain a 
service. This is called a *Service Locator Pattern*. The Service Locator is often referred to as an anti-pattern because
when looking at the class without looking at the code, you don't see the dependencies of that class.

At some point a friend pointed me towards [Auryn](https://github.com/rdlowrey/auryn), a dependency injector for PHP. At
the time I didn't fully understand what it did, but I was intrigued. After some research [I started anew with my own
project](https://github.com/opsbears?utf8=%E2%9C%93&q=piccolo&type=public&language=php). This time around I embraced the
concept of [dependency injection](/blog/clean-code-dependencies), writing the new system around that. All the system
components were replaceable, but my application itself didn't have that  
   
