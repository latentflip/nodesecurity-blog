---
date: "2013-05-15 19:27:00 GMT"
slug: "contributor-spotlight-bear"
tumblr_post_url: "http://blog.nodesecurity.io/post/50512779769/contributor-spotlight-bear"
tags: 
  - spotlight
title: "Contributor Spotlight: Bear"
type: text
---
**  
**Bear keeps the Node security project infrastructure working, patched and polished. It's one of the non-glamorous jobs of the project that Bear takes pride in helping with. Thanks for all your help Bear.

**Name / Handle?**  
My handle is "bear." I don't really go by my name, Mike Taylor. At &yet I'm known as "Opsasaurus Ursus."  
  
**Where are the best places to find you online?**  
For most things:  
  

* [Twitter](https://twitter.com/bear)
* [Github](https://github.com/bear)
* Or [http://code-bear.com](http://code-bear.com) for others.

  
**What do you do professionally?**  
I am the Operations person for &yet and along with my teammates [Nathan LaFreniere](https://twitter.com/quitlahok), and [Stephanie Maier,](https://twitter.com/StephanieMaier) am part of the Ops Team.  
  
Okay, great, so what the heck does "Ops" mean...  
  
I manage the external server resources -- keep the servers running, manage all of the domain name setups and also help with things like GMail and GApps, other developer tools and messaging.  
  
**How did you get introduced to node.js?**  
Through other realtime coders -- a lot of people were switching to node.js from Python in the geek circles I inhabit.  
  
**What interested you in helping with the node security project?**  
Raising the bar for security in node.js makes my life so much easier for me when creating and running servers. Having the baseline for security in node.js start at a very high level is good for the community.  
  
**If you could suggest one thing to node.js developers to improve the security of things they build what would that be?**  
Two points: the first being to never have your node app running straight off of a public IP; always proxy it behind Nginx or HAProxy or something. The second is a simple item to always put into your Nginx config:  "server\_tokens off;" - it will prevent Nginx from leaking the details of Nginx version inside of error pages.