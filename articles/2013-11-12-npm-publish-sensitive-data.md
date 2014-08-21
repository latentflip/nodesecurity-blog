---
date: "2013-11-13 00:17:11 GMT"
slug: "npm-publish-sensitive-data"
tags: npm, confidential, publish, leak
title: "npm publish sensitive-data"
type: text
---
Most developers using version control systems have heard the advice to be careful about what they publish into their repository. If you haven't it's pretty simple --

Don't publish secret things like keys, passwords, or test data based on real customer data, etc., and if you do clean it up immediately.

The same advice is true when it comes to publishing your module on npm. Don't publish any sensitive information.  
  
This last week I found two instances of data published to a npm package by accident. The point is raise awareness of this issue, not to shame the authors so I'm leaving out those details here.  
  
The first was identified because it was 486 MB in size. It was a caching proxy package and it had accidentally included a copy of a live cache directory with some Debian binaries included. Not that serious but it did use excessive disk space and bandwidth when installed.  
  
The second was a bit more anxiety inducing. It had published with it 377 customer records that included:

> - Names  
> - Email addresses  
> - Physical addresses  
> - First 6 and last 2 of credit card \#
> 

Additionally, it had a script that contained a working username and password that would access a payment gateway.  
  
**What should you do if you have published something by accident?**  
  
First things first, depending on the information that's out there, you might be obligated by law to disclose the data leak. Talk to legal counsel about this should it be anything related to financial details or personally identifiable information.  
  
Next figure out what package the sensitive data may be included in. You can either delete the old packages or a better option would be to repush with updated code over top of those versions.  
  
To update a previously published package

> npm publish ---force
> 

  
To get rid of a specific version

> npm unpublish testpackage-asdf@0.0.0
> 

Finally, make sure the sensitive information is not in your version control history. If it is and you use git you can find out more about removing it with this handy [Github article](https://help.github.com/articles/remove-sensitive-data).  
  
One behavior that's good to understand is that npm publish will honor your .gitignore file, but only if you don't have a .npmignore.   
  
That means if your private files were being ignored by .gitignore in the past and you happen to add a .npmignore file that is different than your .gitignore, or is empty, the ignore rules for publishing to npm have been changed.  
  
Take a few minutes and audit your published packages, you may be surprised at what you find.  
  
If you have found a package that you think contains sensitive information please responsibly disclose this to the module author. You can always [_contact the Node Security Project_](mailto:contact@liftsecurity.io?subject=Node%20Security%20Project%20) if you are having difficulties getting a vulnerability addressed.  
  

_A special thank you to the module authors that responded extremely quickly to address the concerns about their modules_!