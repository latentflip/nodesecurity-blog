#date: 2013-02-16 02:14:00 GMT
#slug: node-js-0-8-20-released-with-security-fix-for-http
#tumblr_post_url: http://blog.liftsecurity.io/post/43192873488/node-js-0-8-20-released-with-security-fix-for-http
#tags: nodesecurity, response splitting, node.js
#title: Node.js 0.8.20 Released with Security fix for HTTP Response Splitting Fix
#type: text

[Node.js 0.8.20][0] was just released and contains a security fix for response splitting.

[Response splitting][1] is when a user controlled value (such as a query string parameter) containing new line characters is put in to a header of the response. The injection of additional carriage returns gives an attacker control of the response allowing injection of content into the headers and body.

Let's take a look at the simple example @[charliesome][2] provided in the [pull request][3] when he initially reported the issue.

> var http = require("http"),      
> url  = require("url");  
> http.createServer(function (req, res) {  
> var queryData = url.parse(req.url, true).query;  
> res.writeHead(302, { "Location": queryData.redirect });  
> res.end();}).listen(1337, "127.0.0.1");
> 

Using this properly a request and response would look like this.  
Request:

> GET /?redirect=**[http://liftsecurity.io][4]** HTTP/1.1  
> Host: 127.0.0.1:1337  
> User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:18.0) Gecko/20100101 Firefox/18.0  
> Accept: text/html,application/xhtml+xml,application/xml;q=0.9,\*/\*;q=0.8  
> Accept-Language: en-US,en;q=0.5  
> Accept-Encoding: gzip, deflate  
> Connection: keep-alive
> 

Response:

> HTTP/1.1 302 Moved Temporarily  
> Location: **[http://liftsecurity.io][4]**  
> Date: Sat, 16 Feb 2013 01:51:27 GMT  
> Connection: keep-alive  
> Content-Length: 0
> 

Note: there is no body to the response.

Charlie's example malicious request injects a marquee but it could be any script or body, even other headers.

Request:

> GET /?redirect=**%0D%0AContent-Length:%2033%0D%0A%0D%0A%3Ch1%3E%3Cmarquee%3Eowned%3C/marquee%3E%3C/h1%3E%0D%0A **HTTP/1.1  
> Host: 127.0.0.1:1337  
> User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:18.0) Gecko/20100101 Firefox/18.0  
> Accept: text/html,application/xhtml+xml,application/xml;q=0.9,\*/\*;q=0.8  
> Accept-Language: en-US,en;q=0.5  
> Accept-Encoding: gzip, deflate  
> Connection: keep-alive
> 

Response:

> HTTP/1.1 302 Moved Temporarily  
> Location:  
> **Content-Length: 33**  
>   
> **<h1\><marquee\>owned</marquee\></h1\>**  
> Date: Sat, 16 Feb 2013 01:54:08 GMT  
> Connection: keep-alive  
> Transfer-Encoding: chunked  
> 0
> 

The modified redirect includes a content-length header and a new "malicious" body.

Even though this patch addresses this vulnerability it's best practice to always properly santize any user provided data before sending it on, be that a browser, a database or some other system.

Want to keep up on node.js security related issues, follow us on twitter at @nodesecurity

  
Edit: Interesting timeline note, is that it appears this was brought up about a year ago in [this issue][5].

[0]: http://blog.nodejs.org/2013/02/15/node-v0-8-20-stable/
[1]: http://cwe.mitre.org/data/definitions/113.html
[2]: http://twitter.com/charliesome
[3]: https://github.com/joyent/node/pull/4290
[4]: http://liftsecurity.io
[5]: https://github.com/joyent/node/issues/2602