#date: 2012-10-03 00:24:00 GMT
#slug: that-thing-where-you-didnt-change-the-redis-default
#tumblr_post_url: http://blog.liftsecurity.io/post/32770744557/that-thing-where-you-didnt-change-the-redis-default
#tags: Redis, secure defaults, ec2
#title: That thing where you didn't change the Redis default config...
#type: text

One of the best ways you can secure your [Redis][0] instance is to make it listen only on the localhost interface, or firewall it from the rest of the Internet.  

Unfortunately, by default Redis listens on all interfaces.. (By the way, antirez: if you are reading this, please consider changing the default.)

This means that if you don't change the default, all the data you store is potentially just sitting out there to be read, modified or deleted. Changing the default behavior is very simple.

  
Binding to a single interface can be done in the redis.conf file by adding a line like this.  
  

    bind 127.0.0.1

  
I was curious to see just how many people take that basic security advice to heart so I scanned across Amazon EC2\.  
  
Out of 2,375,680 IP Address scanned only 1,805 hosts were found to have redis installed and running on it's default port of 6379/TCP.   
  
That's not very many servers, but **out of 1805, only 25% required authentication**, leaving a pile of servers exposed.  
  
In other terms, that was:

* 180,800,802 Million keys
* 375.3436 GB of exposed data

  
Now it's possible, but I highly doubt that it was all worthless cache data. I didn't go pillaging and plundering---though I could have!  
  
Here is a breakdown of the top 10 versions found.  
  
The latest version of "stable" Redis is 2.4.17\.   
  
111 |   Version            2.4.8  
105 |   Version            2.4.15  
102 |   Version            2.4.17  
96 |   Version            2.2.12  
93 |   Version            2.4.10  
75 |   Version            2.4.16  
74 |   Version            2.4.14  
65 |   Version            2.4.13  
51 |   Version            2.2.11  
46 |   Version            2.4.2  
  
The oldest version we found deployed was 1.2.0 --- on 12 hosts!   
  
tl;dr: Step one in keeping your Redis instance safe is to just keep it off the damn Internet.  
  
----  
Learn more tips we use to secure our Redis servers by joining @HenrikJoreteg, @fritzy, and myself in our [Redis master class][1] the day before [RedisConf][2] in Portland, OR. I can be found on the twitters at [@adam\_baldwin][3]

[0]: http://redis.io
[1]: http://redisconf.com/training.html
[2]: http://redisconf.com/
[3]: https://twitter.com/adam_baldwin