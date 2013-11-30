#date: 2013-02-05 00:38:00 GMT
#slug: authy-two-factor-dashboard-security
#tumblr_post_url: http://blog.liftsecurity.io/post/42313703061/authy-two-factor-dashboard-security
#tags: two-factor, auth
#title: Authy Two-Factor Dashboard Security
#type: text

[Authy][0] is a useful service for adding two-factor authentication to any app.

One problem: authy.com isn't thoroughly two-factor.

So if you are considering adding Authy two-factor support to your application, please [contact their customer support ][1]and request that they enable true two-factor authentication on your developer dashboard account._(Based on our communication with Authy support, it was a calculated decision not to enabled this by default and require that you request it through customer service.)_

You see, authy.com only requires an email and token to log into your account, effectively allowing anybody with this token access to your account.

![image](http://cl.ly/image/390s253t3T1W/Screen%20Shot%202013-02-03%20at%2011.20.06%20AM.png)

The tokens that the authy app generates are time based and can be submitted multiple times. The tokens are not tied to any specific web application so a token provided to one web app can be submitted to another Authy enabled application.

I hope you can see where I'm going with this.

Here is how an exploitation scenario would work.

1\. An admin / user of the Authy dashboard would have to visit and log into another site using Authy for two factor authentication.   This site would either have to be compromised by or run by the attacker so they would have access to the submitted token.

2\. The attacker would then quickly submit a login request using the email address and token provided by the user to log into the authy.com account.

So what information can the attacker gain?

The attacker would gain access to the following.

* API Keys for registered applications. They could do anything outlined in the API documentation, such as deleting registered users. Also API keys can not be changed from the Authy dashboard.

* User details for registered users including:

* Authy ID

* Email

* Partial cell phone \#  (Example 509-XXX-1212)

* Device type

* Last Login

* Ability to add user collaborator accounts

**D****evelopers****:** I really don't want this to dissuade you from using Authy or any other two factor solution for your application. (In fact, Authy seems like a pretty great service, we like it so much we maintain the [node-authy ][2]library for integrating Authy into node.js projects.)

  
**Authy****:** I urge you to consider changing your default authentication scheme to be true two-factor.

If you enjoyed this, say hi to [@adam\_baldwin][3] on twitter.  


[0]: https://authy.com
[1]: https://www.authy.com/help/contact
[2]: https://github.com/evilpacket/node-authy
[3]: https://twitter.com/adam_baldwin