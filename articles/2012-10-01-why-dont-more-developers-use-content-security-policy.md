#date: 2012-10-01 23:49:00 GMT
#slug: why-dont-more-developers-use-content-security-policy
#tumblr_post_url: http://blog.liftsecurity.io/post/32699583470/why-dont-more-developers-use-content-security-policy
#tags: 
#title: Why don’t more developers use Content Security Policy?
#type: text

A question that has been on my mind lately is why don't more web developers implement Content Security Policy (CSP)? I think the same of other security headers, but I'm going to try and keep this focused.  
  
Here is what I speculate are some of the core reasons.

1. Developers don't know what CSP is
2. It's experimental and support is limited
3. Adapting policies to existing web apps can be frustratingly difficult.

  
Immediately after writing the above, I polled Twitter and got some responses---including a couple from my coworkers at &yet.  
  

> @[adam\_baldwin][0] I'd bet people just don't even know it exists or what it is. I've never seen any developers write or talk about it.
> --- Henrik Joreteg (@HenrikJoreteg) [September 29, 2012][1]

> @[adam\_baldwin][0] lack of knowledge, time, expertise and "if it hasn't hurt me so far i'm probably ok" illogical thinking...
> --- Jack Dempsey (@jackdempsey) [September 29, 2012][2]

  
**Developers don't know what CSP is**  
I was recently disappointed in my own internal evangelizing efforts when one of our developers didn't know what CSP was. The majority of the time I bring up CSP to developers, they either haven't heard of it or have heard of it but haven't implemented it.

Content security policies are just big words (headers) for saying "Hey, browser, all my resources from this app will come from the following domains. Don't load anything else." They can also block inline script from executing or style from being loaded, which is handy for blocking pesky vulnerabilities like cross-site scripting.

  
Here are some great resources to get familiar with Content Security Policy. (Psst, share these with a friend and make the world a better place.)  
  
[Content Security Policy 1.1 Draft Spec][3]  
  
[An Introduction to Content Security Policy by Mike West][4]  
  
  
**It's experimental and support is limited**  
It's true, CSP is not a finalized spec and is only supported by Firefox, Chrome, and Safari, but that's a pretty huge chunk of the browser market---especially when it comes to users of modern web apps, so I don't think that's actually a valid excuse. Other browsers will ignore the header and there are ways to [report policy violations][5].  
  
  

> @[adam\_baldwin][0] sounds like work.
> --- fritzy (@fritzy) [September 29, 2012][6]

Now, Fritzy's just a troll, but at least he's an honest one.  
  
**Adapting policies to existing webapps can be difficult**  
If I had to pick one reason why developers won't implement CSP is that it's just a pain in the posterior to add policies to existing complex web apps.  
  
Figuring out what policies should be in place to not allow something silly can be confusing enough but then you add in the fact that people working on the project might not be developers. Designers are adding styles and some interaction---and you could easily have all different levels of knowledge and skill contributing on a project.  

> @[adam\_baldwin][0] I'd say inline scripting all over the codebase.
> --- kkotowicz (@kkotowicz) [September 29, 2012][7]

  
One tip I can give here for new projects is to not put any script or style inline and load all static resources like css, javascript and images from a consistent source. That will make writing a policy a lot less painful.  
  
If you are building node / express.js applications I suggest you use [helmet][8] to quickly add security headers to your application, including a restrictive default content security policy.   
  
There are also some additional surprises that I have in store for helmet users that should aid in the adoption of CSP, so watch this space.  
  
- - -  
  
If you enjoyed this post, please send it to at least one developer you know that might not know anything about Content Security Policy, oh and follow me on twitter; [@adam\_baldwin][0]  
  


[0]: https://twitter.com/adam_baldwin
[1]: https://twitter.com/HenrikJoreteg/status/251928293585088512
[2]: https://twitter.com/jackdempsey/status/251949492633468928
[3]: https://dvcs.w3.org/hg/content-security-policy/raw-file/tip/csp-specification.dev.html
[4]: http://www.html5rocks.com/en/tutorials/security/content-security-policy/
[5]: https://dvcs.w3.org/hg/content-security-policy/raw-file/tip/csp-specification.dev.html#report-uri
[6]: https://twitter.com/fritzy/status/251928512020242432
[7]: https://twitter.com/kkotowicz/status/252069280886181889
[8]: https://github.com/evilpacket/helmet