---
date: 2014-1-6 20:33:00 GMT
slug: lenovo-ix2-csrf-root
tags: lenovo,ix2,csrf,root,shell
title: Lenovo IX2 Remote Root(CSRF), Multiple Vulnerabilities
author: Jon Lamendola
type: text
---

Over the holidays, we did an internal hackathon. I had access to a Lenovo IX2 NAS device, and I love breaking physical boxes - of course I had to go for it as my target. It's a simple ARM device running LifeLine Linux, a distribution designed by Lenovo to run on their NAS devices, both consumer and enterprise level. Within 5 minutes of opening the box and turning it on, I noticed there's absolutely no CSRF protection on any pages. 

So naturally, I spent a good deal of time looking for SQL/Command Injection. I came up with nothing. They sanitize all input fields very well. So I continued digging around on the device, with my sights set on getting a root shell. I discovered that you can turn on SSH, as well as set the SSH port/password via a hidden /manage/diagnostics.html page, that once again doesn't have CSRF protection on it. That was something, but seeing as how most of these devices are behind a firewall, the SSH was fairly useless from a remote attacker standpoint. 



I noticed an 'Applications' page on the device, that allows users to extend the functionality of their NAS device by installing third party apps. I started by trying to upload simple shell/php/cgi scripts, but with no luck. It's pretty picky about the formatting. I then tried to upload a valid third party app available from their lifelineapps store, and noticed it was in a strange .o2 file. After running the file command on it, turns out it's just a dpkg. 

I tried modifying files inside it and installing, but at compilation it creates an encrypted md5 hidden somewhere inside the .o2 file, making my modified .o2 invalid. After some searching around, I found the SDK available at http://www.developer.lifelineapps.com, available for the price of an email address. Unfortunately, it's not very well documented, and I didn't have a whole lot of time to figure out how their compiler expects the apps to be built. So I went for plan b - make an evil app from a demo. I downloaded the source for the Resource Monitor app, which is available once you've signed up for the SDK. 

Here's how I got a remote root shell running via CSRF.
  
**Lenovo IX2**
  
First, I opened up the main.c file inside the 'cpumon' folder. Pretty simple C program that retrieves system resource information, and prints it out into a JSON object. Here's what my modifications looked like:

[ Redacted until Lenovo can provide a patch ]


After modifying the main.c file, I compiled the app from the 'resmon' folder using 'make target=arm-ix2-ng', and packed it into the required .tar.gz, assuming it would run upon install. Nope. I was able to get the shell to spawn by manually sshing in and executing, so I knew it was working as intended, but it wouldn't run. After some digging around, and a whole lot of frustration, I found the application.xml file had some options I could use to my advantage, particularly the cgibinDir option. 

I added the following to the application.xml files existing options:

[ Redacted until Lenovo can provide a patch ] 

The options will enable the cgi bin directory to be navigable, set the executable to run at boot and schedule it to run every 30 minutes. The compiler is so kind as to create a symlink to the cpumon executable in the cgi directory(remember we can't modify any files after compilation or it will break). Alright, so now we've got an evil installer that can be run via CSRF, but how do we go about exploiting it?

The first step is to generate the CSRF file upload. This can be done using an XMLHTTPRequest, which burp is handy enough to make with just a few clicks. There are two ways we can go about finding the IP of the internal device: 1, we can use the default mdns(ix2-dl.local) and hope the user hasn't changed it, or two, we can use webRTC to reveal the internal netmask and then force the user to ping scan their own network via XMLHTTPRequests. The PoC's for both are available on request. The exploit then sends the payload to all live IP's. Once the file has been uploaded, the executable should run automatically, as we've set it to be a scheduled with the application.xml. If it doesn't run for some reason, or you want to force it to run outside of the scheduled timing, that's why we set up the cgibinDir option. Simply navigate to http:ix2-dl.local/cpumon/cpumon-cgi/cpumon(no auth required), and we have a shell!

**Demonstration Video**
<iframe src="//player.vimeo.com/video/83540983" width="500" height="281" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe> <p><a href="//vimeo.com/83540983">Lenovo ix2-dl Root via CSRF</a> from <a href="//vimeo.com/andyet">&amp;yet</a> on <a href="https:////vimeo.com">Vimeo</a>.</p>

**Alright, so who's vulnerable?**
Any device running the Lenovo LifeLineEMC software version 4.0.6.19294 and prior is vulnerable. Simply change the compile target and rebuild. It does require that the user who visits the malicious page be logged in as admin, however.

**Hidden Page allows user to enable SSH and set Port+Password**
Example: http://ix2-dl/manage/diagnostics.html
This page allows a user to set the root SSH password and port, prefixed by the easily bruteforced word 'soho'. I.E. password test requires a logon password of sohotest. It appears this is intended behavior, but is a huge risk given that there are no anti-CSRF tokens present on the page.

**Information Leakage**
The Lenovo device automatically sets the internal address to http://ix2-dl.local via MDNS. This makes it a whole lot easier to exploit the formentioned CSRF Vulnerabilities.

**Weak Session Cookies**

The Lenovo IX2-DL appears to set session cookies as
```
<User IP Address>.<Current Epoch Time>. 
```
This is not an adequate amount of entropy to prevent bruteforcing. In reality, an attacker only needs to guess 7-8 numeric characters before he has an authenticated session. Adding a secret nonce and hashing of the value before making it a session cookie would make the session cookie much more difficult to bruteforce.

