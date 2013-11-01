---
date: "2013-04-29 03:59:00 GMT"
slug: "contributor-spotlight-neal-poole"
tumblr_post_url: "http://blog.nodesecurity.io/post/49155462900/contributor-spotlight-neal-poole"
tags: 
  - spotlight
title: "Contributor Spotlight: Neal Poole"
type: text
---
The Node Security Project wouldn't exist without the help of a lot of contributors (growing daily). Inspired by the "Meet the bugcrowd" series on [blog.bugcrowd.com](http://blog.bugcrowd.com/) we want to showcase contributors and make sure the community knows just who these wonderful people are.

Neal was one of the first to jump in and help with the project and I have a feeling he will be a great core team member.

**Name / Handle?**  
Neal Poole, I don't really have a handle that I go by (maybe NealPoole?)  
  
**Where are the best places to find you online? **  
Definitely my [blog](https://nealpoole.com/blog/) or my [Twitter account](https://twitter.com/NealPoole) where I talk mainly about security-related topics.  
  
**What do you do professionally?**  
I'm a senior at Brown University majoring in Computer Science. I'm graduating at the end of this semester and I'll be doing security work at Facebook starting in August.  
  
**How did you get introduced to node.js?**  
A good friend of mine (@[ddtrejo](https://twitter.com/ddtrejo)) got very interested in Node a couple years back. That was the first time Node popped up on my radar. Since then, I've toyed around with it a little and read presentations about the language by security researchers and software developers.  
  
**What interested you in helping with the node security project?**  
The short answer: I want to help improve the Node ecosystem and provide security guidance to people who are trying to figure out which module they should choose to use.  
  
The longer version: Brown's Computer Science department has a class, "Creating Modern Web Applications," which I helped organize last year. The course switched from using PHP to Node this semester. I was asked to present a lecture on web application security based on a similar talk I had given for the course the last time it was taught. As I updated my slides, I ran into a lot of trouble figuring out which Node modules to recommend to students to address particular issues. I even came across one module (since patched) which claimed to provide XSS protection but which I was able to bypass with relative ease. I decided that I wanted to inspect Node modules more thoroughly once I had a little more free time.  
  
Coincidentally, a few weeks later Adam announced the NodeSecurity project and I found myself with a bit more free time. Serendipity at its finest. ;-)  
  
**If you could suggest one thing to node.js developers to improve the security of things they build what would that be?**  
It would be fantastic if Node developers created something like the [Rails Security Guide](http://guides.rubyonrails.org/security.html) that focused specifically on the native features of Node. For example, the first NodeSecurity audit has focused on how modules execute shell commands. As it turns out, many modules use child\_process.exec, which has the potential to allow for command injection, when they could use the safer function child\_process.execFile very easily and with no loss of functionality. Education about the security concerns raised by various functions would go a long way in allowing developers to make informed choices and write better code.  
  
**Anything else you want to mention?**  
I strongly encourage people with Node experience and/or security experience to sign up and participate in the NodeSecurity project. You will make a positive impact on the real-world applications which use these modules and it's a wonderful opportunity to help improve the security of the Node ecosystem.