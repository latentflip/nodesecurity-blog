---
date: "2015-01-21 17:12:11 GMT"
slug: "tooling
tags: blog, rss
title: "Take the most out of the Node Security Project with tooling"
type: text
author: David Dias
---

The Node Security Project team has been working alongside the Node.js community to for more than one year now, with the goal of identifying vulnerabilities in open source modules people use and love, provide quantifiable action items when these vulnerabilities are found and assuring that patches for the same get in place, helping developer ship better secure code. 

Today, in this blog post, we want to tell you how you can levarage this effort, so that your code goes into projection without known vulnerabilities.

# Command line tools


# Use it programatically 


# Task runners


# Learn from previous vulnerabilities

It is said that "those who don't know their past, are condemned to repeat it", but we don't want that you happen, all the vulnerabilities catalogued by the Node Security Project are published with an Advisory, a simple and easy to read document explaining what was the vulnerability, so that developers can learn what were the problems and how were they fixed. These Advisories can be found at [http://nodesecurity.io/advisories](http://nodesecurity.io/advisories).

# Great ways to stay up to date with your dependencies

![](https://cldup.com/gCUifGVO9_-1200x1200.png)

One of our favorite tools is [david-dm](http://david-dm.org), david-dm is a dependency manager, it checks your projects to tell you if any of your dependencies is out of date, this information is crucial when you want to stay ahead of the game about out of date dependencies with security vulnerabilities, plus, they did an extraordinary job of integrating the Node Security Project database in david-dm's service, so that you know when a dependency is also insecure, just by checking at david-dm's badge. 

[![](https://david-dm.org/alanshaw/david-www.svg)](https://david-dm.org/)


# Contribute

Do you want of a vulnerability but don't know how to get it published? Ping us at report@nodesecurity.io. 

Have some spare time to code and want to contribute to the project? Our code is 100% open source on github and we are very welcome to receive patches! Check it here: https://github.com/nodesecurity . 

Want to contribute but you are not sure how yet, feel free to jump on gitter and say hi! Our room is https://gitter.im/nodesecurity/community .

Thank you for your time, looking forward to hear from you!
