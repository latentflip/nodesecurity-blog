#date: 2012-12-07 05:41:00 GMT
#slug: writing-secure-express-js-apps
#tumblr_post_url: http://blog.liftsecurity.io/post/37388272578/writing-secure-express-js-apps
#tags: express.js, csrf, privileges, sessions, headers, node.js
#title: Writing secure express.js apps
#type: text

Here is a starting guide for securing express.js applications, specifically Express v3\. It is by no means a comprehensive guide on web application security. Standard rules and practices apply to express.js apps just as if they would to Rails, Django or any other web application.  
  
I'm going to hit the high points of items that always seem to come up.  
  
**Don't run as root**  
It's been long foretold by the ancient bearded ops that one shall run a service with the least amount of privilege necessary and no more. However this ancient folklore seems to be forgotten from time to time when less experienced devs run into the obvious problem of running their new webapp on ports 80 and 443\. Running as root solves this quickly and they can move on to other, more fun challenges.   
  
One way to approach this is to drop process privileges after you bind to the port using something like this:

    http.createServer(app).listen(app.get('port'), function(){  
        console.log("Express server listening on port " + app.get('port'));  
        process.setgid(config.gid);  
        process.setuid(config.uid);  
    });

Note: As Joshua Heiks points out in the comments below the gid should be set before the uid.

  
There are a couple caveats to this. It's not available on Windows and if you drop privileges before your bind actually finishes you could run into issues, but to be honest, I have never had this happen.  
  
Another is to use something like [authbind][0] or by putting something like nginx or another proxy in front of your application. Whatever you do, just don't freak'n run as root.  
  
**Sessions**  
Most express apps are going to deal with user sessions at some point.  
  
Session cookies should have the SECURE and HTTPOnly flags set. This ensures they can only be sent over HTTPS (you are using HTTPS, right?) and there is no script access to the cookie client side.

      app.use(express.session({  
        secret: "notagoodsecretnoreallydontusethisone",  
        cookie: {httpOnly: true, secure: true},  
      }));

  
**Security Headers**  
There are plenty of security headers that help improve security with just a line or two of code. I'm not going to explain them all, but you should read and familiarize yourself with them. A great article to read is [Seven Web Server HTTP Headers that Improve Web Application Security for Free][1]  
  
The easiest way to implement most of these headers in Express is to use the [helmet][2] middleware.  
  
npm install helmet  
  
Then we can add them to our _app.configure_ for express

    app.configure(function(){  
      app.set('port', process.env.PORT || 3000);  
      app.set('views', __dirname + '/views');  
      app.set('view engine', 'jade');  
      app.use(express.favicon());  
      app.use(express.logger('dev'));  
      app.use(express.bodyParser());  
      app.use(helmet.xframe());  
      app.use(helmet.iexss());  
      app.use(helmet.contentTypeOptions());  
      app.use(helmet.cacheControl());  
      app.use(express.methodOverride());  
      app.use(express.cookieParser());  
      app.use(express.session({  
        secret: "notagoodsecret",  
        cookie: {httpOnly: true, secure: true},  
      }));  
      app.use(app.router);  
      app.use(express.static(path.join(__dirname, 'public')));  
    });

  
  
**Cross-Site Request Forgery (CSRF) Protection**   
Express provides CSRF protection using built in middleware. It's not enabled by default. Documentation for the express.csrf() middleware is available [here][3].  
  
To enable CSRF protection let's add it to the app.configure section. It should come after the session parser and before the router.  
  
The first line we add is to add csrf tokens to the users session.

        app.use(express.csrf());

Then, since Express v3 did away with dynamic helpers, we use a small middleware to add the token to our locals making it available to templates.

      app.use(function (req, res, next) {  
        res.locals.csrftoken = req.session._csrf;  
        next();  
      });

  
The final example, putting it together:

    app.configure(function(){  
      app.set('port', process.env.PORT || 3000);  
      app.set('views', __dirname + '/views');  
      app.set('view engine', 'jade');  
      app.use(express.favicon());  
      app.use(express.logger('dev'));  
      app.use(express.bodyParser());  
      app.use(helmet.xframe());  
      app.use(helmet.iexss());  
      app.use(helmet.contentTypeOptions());  
      app.use(helmet.cacheControl());  
      app.use(express.methodOverride());  
      app.use(express.cookieParser());  
      app.use(express.session({  
        secret: "notagoodsecret",  
        cookie: {httpOnly: true},  
      }));  
      app.use(express.csrf());  
      app.use(function (req, res, next) {  
        res.locals.csrftoken = req.session._csrf;  
        next();  
      });  
      app.use(app.router);  
      app.use(express.static(path.join(__dirname, 'public')));  
    });

  
Here is an example of using the csrf token in a jade template:

    form(method="post",action="/login")  
      input(type="hidden", name="_csrf", value="#{csrftoken}")  
      button(type="submit") Login

  
NOTE: I removed the secure: true for this example so it would work without SSL if you wanted to test it out.  
  
Those are just a few things to get you started securing your Express app. Chances are you will be doing that in every app you create, so I created the [express-secure-skeleton][4] app to make playing around with these security features a bit easier. Please fork and contribute.

[0]: http://manpages.ubuntu.com/manpages/hardy/man1/authbind.1.html
[1]: http://recxltd.blogspot.com/2012/03/seven-web-server-http-headers-that.html
[2]: http://github.com/evilpacket/helmet
[3]: http://expressjs.com/api.html#csrf
[4]: https://github.com/evilpacket/express-secure-skeleton