var express     = require('express'),
    env         = require('getconfig'),
    logger      = require('bucker').createLogger(env.bucker, module),
    semiStatic  = require('semi-static'),
    config      = require('./serverapp/useconfig').file('blogConfig.json'),
    _           = require('underscore'),
    cgh         = require('connect-githubhook'),
    webhook     = require('./serverapp/webhook.js');

var views       = require('./serverapp/views');

var app = express();

app.configure(function () {
    app.use(express.compress());
    app.use(express.static(__dirname + '/public'));
    // app.use(express.favicon(__dirname + '/public/images/favicon.ico'));
    app.use(express.bodyParser());

    app.use(function (req, res, next) {
        res.locals = _.extend(res.locals, config);
        next();
    });

    app.use(views.addTags);

    app.use(views.addPostDates);

    app.use(logger.middleware());
    app.use(cgh({
        '/callback/webhook': 'https://github.com/andyet/blog-posts'
    }, webhook.runHook));

});

// use jade
app.set('view engine', 'jade');
// 301 redirects for old tumblr blog posts

app.get('/post/:tid/:tslug', views.tumblrRedirect);

// rss
app.get('/rss', views.rss);

var home = config.blogHome;

// author index
app.get(home + ':slug', views.authorIndex);
// tag index
app.get(home + 'tag/:slug', views.tagIndex);

// blog post indexes
app.get(home, views.blogIndex);
app.get(home + ':year', views.blogYearIndex);
app.get(home + ':year/:month', views.blogMonthIndex);
app.get(home + ':year/:month/:day', views.blogDateIndex);

// blog posts
app.get(home + ':year/:month/:day/:pslug', views.blogPost);

// TODO
// quotes, talks, links, tools, apps, music, micro

// home
app.get('/', views.index);

// semi-static views
app.get('/*', semiStatic());

// 404
app.get('*', views.notFound);

app.listen(env.http.port);
logger.info('bumble running on port: ' + env.http.port);
