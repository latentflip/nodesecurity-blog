---
date: 2014-07-15 20:33:45 GMT
slug: introducing-burpbuddy
tags: security
title: Introducing Burpbuddy
author: Tom Steele
type: text
---

Here at ^Lift we perform a lot of application assessments. One of the greatest tools at our disposal is [Burp Suite](http://portswigger.net/burp/), specifically Burp Suite Pro (go buy it). If you're doing this type of work, you're certainly familiar with Burp. And if you're an experienced Burp user, perhaps you have used the [extender API](http://portswigger.net/burp/help/extender.html), which allows you to extend the functionality of Burp by writing your own extensions using Java, Python with Jython, or Ruby with Jruby. It's awesome, check it out. But, while it's awesome, it is restricted to these languages, and well... we really like working with other languages.

That's the problem we've attempted to solve. With [burpbuddy](https://github.com/liftsecurity/burpbuddy) we took the API and exposed it over various mediums including WebSockets, HTTP, and Webhooks. Now you can write plugins quickly in any language you choose, and can extend Burp in incredible ways.

Here is a quick node example using the WebSocket functionality, which is great for doing things outside of Burp. We ingest incoming requests, strip out any session cookies, and make the request outside of Burp to check for forceful browsing. It's not a bullet proof design, and leaves a lot to be desired, but for the purpose of demonstration, is adequate.

~~~~~javascript
var WebSocket = require('ws');
var request = require('request');
var ws = new WebSocket('ws://127.0.0.1:8000/');
// Open WebSocket connection.
ws.on('open', function() {
  console.log('opened connection to ws://localhost:8000/');
});
// Receive messages.
ws.on('message', function(data, flags) {
  var obj = JSON.parse(data);
  // Message type is a request.
  if (obj.messageType === 'request' && typeof obj.headers.Cookie !== 'undefined') {
    // Create a request object and remove cookies.
    var req = {
        url: obj.url,
        method: obj.method,
        headers: stripCookies(obj.headers),
        followRedirect: false,
        strictSSL: false,
    };
    if (['patch', 'post', 'put'].indexOf(obj.method.toLowerCase()) !== -1 && obj.body.length > 0)  {
        req.body = new Buffer(obj.body);
    }
    // Send request.
    request(req, function(err, resp, body) {
        if (err) {
            return;
        }
        // Show status.
        console.log(resp.statusCode + " " + req.method + " " + obj.url);
        if (resp.statusCode < 300 && !err ) {
            console.log(body);
        }
    });
  }
});

ws.on('error', function(err) {
  console.log(err);
  process.exit(1);
});

function stripCookies(headers) {
    delete headers.Cookie;
    return headers;
}
~~~~~

You can also intercept requests before they reach Burp's proxy and responses before they reach the browser via Webhooks. Here we'll add a header to the request using node and a simple [hapi](http://hapijs.com/) server.

~~~~~javascript
var Hapi = require('hapi');
var server = Hapi.createServer('localhost', 3001);
server.route({
    method: 'POST',
    path: '/request',
    handler: function (req, reply) {
        // Add a beep/boop header in Substack fashion.
        req.payload.headers.beep = 'boop';
        reply(req.payload);
    }
});
server.start();
~~~~~

Lastly, we have the HTTP API. We took the majority of API methods from Burp (and some of our own) and exposed them over HTTP. You can do all manner of things including querying/updating scope, sending URL's to the spider, performing active scans, sending alerts, etc. As an example, let's use curl to get a list of cookies.

~~~~~shell
$ curl http://localhost:8001/jar | python -mjson.tool
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100  2446  100  2446    0     0   259k      0 --:--:-- --:--:-- --:--:--  265k
{
    "data": [
        {
            "domain": "www.teamliquid.net",
            "name": "SID",
            "value": "475da742f56bd306ed7289f98d227dc5"
        },
    ]
}
~~~~~

Anyway, we think this is great for building plugins and hope you all like it too. Give it a shot, and if you build something cool, [tell us](https://twitter.com/liftsecurity).
