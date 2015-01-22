---
date: "2015-01-21 17:12:11 GMT"
slug: "tooling"
tags: tools, security, code
title: "Take the most out of the Node Security Project with tooling"
type: text
author: David Dias
---

The Node Security Project team has been working alongside the Node.js community for more than one year. Our goal is to identify vulnerabilities in open source module ecosystem that people use and love, provide quantifiable action items when these threats are found and assure that patches get landed, helping developers ship better secure code.

Today, in this blog post, we want to tell you how you can levarage this effort, so that your code goes into projection without known vulnerabilities.

# Command line tools

```
$ npm i nsp -g
```

This is all you need to do to start auditing your dependencies against the Node Security Project database. Currently the tool supports two ways of auditing, for package.json and for shrinkwrap.json, you can them as follows (e,g):

```
$ nsp audit-package
Name     Installed  Patched  Vulnerable Dependency
connect    2.7.5    >=2.8.1  nodesecurity-jobs > kue > express

$ nsp audit-shrinkwrap
Name     Installed  Patched  Vulnerable Dependency
connect    2.7.5    >=2.8.1  nodesecurity-jobs > kue > express
```

This information tells you that your project, named `nodesecurity-jobs` has a dependency `kue` which is requiring another module, `express` which has an identified vulnerability and you should update it in order to avoid being exploited for that specific vulnerability, or in this case, request to your dependency author, to update their module, so that you don't inject a vulnerability into your code.

# Use it programatically 

We've developed two modules that abstract the communication with the Node Security API, so that developing tools, continuous integration auditing middlewares and others, becomes easier. These modules are:

- https://www.npmjs.com/package/nsp-api
- https://www.npmjs.com/package/nsp-audit-shrinkwrap

# Task runners

Adding to ability to create your own tools around the Node Security Project API clients, we've also release two modules dedicated to use with [grunt](http://gruntjs.com/), you can find these at:

- https://github.com/nodesecurity/grunt-nsp-package
- https://github.com/nodesecurity/grunt-nsp-shrinkwrap

# Learn from previous vulnerabilities

It is said that "those who don't know their past, are condemned to repeat it", but we don't want that you happen, all the vulnerabilities catalogued by the Node Security Project are published with an Advisory, a simple and easy to read document explaining what was the vulnerability, so that developers can learn what were the problems and how were they fixed. These Advisories can be found at [http://nodesecurity.io/advisories](http://nodesecurity.io/advisories).

# Keep posted about your dependencies updates

![](https://raw.githubusercontent.com/alanshaw/david-www/master/src/img/logo-david.jpg)

One of our favorite tools is [david-dm](http://david-dm.org), david-dm is a dependency manager, it checks your projects to tell you if any of your dependencies is out of date, this information is crucial when you want to stay ahead of the game about out of date dependencies with security vulnerabilities, plus, they did an extraordinary job of integrating the Node Security Project database in david-dm's service, so that you know when a dependency is also insecure, just by checking at david-dm's badge:

[![](https://david-dm.org/alanshaw/david-www.svg)](https://david-dm.org/)

# Contribute

Do you want of a vulnerability but don't know how to get it published? Ping us at report@nodesecurity.io. 

Have some spare time to code and want to contribute to the project? Our code is 100% open source on github and we are very welcome to receive patches! Check it here: https://github.com/nodesecurity . 

Want to contribute but you are not sure how yet, feel free to jump on gitter and say hi! Our room is https://gitter.im/nodesecurity/community .

Also, if you build something you would like to share that is using our tooling, let us know!

Thank you for your time, looking forward to hear from you!
