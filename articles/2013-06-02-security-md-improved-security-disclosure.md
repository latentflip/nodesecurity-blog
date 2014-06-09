---
date: 2013-06-02 23:31:00 GMT
slug: security-md-improved-security-disclosure
tumblr_post_url: http://blog.liftsecurity.io/post/52010883123/security-md-improved-security-disclosure
tags: security, security.md, jsconf, communication
title: SECURITY.md - Improved Security Disclosure Communication
type: text
---

During [my][0] JSConf 2013 talk on Builders vs. Breakers I suggested that one way developers can communicate with breakers (security researchers) better would be to include a SECURITY.md file with their projects. Often times it's difficult for security researchers to find out how to contact a project. This helps ensure issues are sent to you, the developer or company, instead of just put out there publicly (unless that's what you want).

Since we already are very used to adding a README.md and CONTRIBUTORS.md to a project, why not SECURITY.md?

The intention of this file is to explain how you as the project maintainer would like security issues handled for your project and would include:

1\. How to report security issues

How should contact be made and to whom? Maybe you want them sent privately to a specific email address or possibly just submit them via Github issues.

Is there a backup contact?

2\. Communication expectations

Define the rough expectations for when the finder / reporter will hear back from the project. Explain that these are rough guidelines and that sometimes security researchers need to remember that the project maintainers typically have real jobs, lives and other things on their plate than just this project so they need to be patient through the process.

3\. Credit

Give credit where credit is due. Remember security researchers, fellow developers or users of your library are reporting these things with good intention and tend to be using their own free time to do so. It's a nice gesture to make sure and tip your hat to them.

4\. History (recommended but optional)

For an example of something that is straight forward and very well documented take a look at how ember.js has defined their [security disclosure process][1], they have done a great job.

Also be sure and check out the &yet [SECURITY.md][2] for [And Bang][3], and command below of send a pull request if you have thoughts of changes we should incorporate.

[0]: https://twitter.com/adam_baldwin
[1]: http://emberjs.com/security/
[2]: https://github.com/andyet/andbang.js/blob/master/SECURITY.md
[3]: http://andbang.com