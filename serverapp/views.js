var env = require('getconfig'),
    logger = require('bucker').createLogger(env.bucker, module),
    marked = require('marked'),
    sugar = require('sugar'),
    util = require('util'),
    gravatar = require('gravatar'),
    fs = require('fs'),
    _ = require('underscore'),
    config = require('../serverapp/useconfig').file('blogConfig.json'),
    paginator = require('./paginator'),
    allNums = /^\d+$/,
    allTags = {},
    tagCounts = {},
    postDates = {};

var parsePosts  = new (require('./ParsePost'))(),
    postSetData,
    postData;

// go get a gravatar
// gravatar = gravatar.url(config.blogAuthorEmail, 100);

function parse_month(month) {
    // only do anything, if month isn't a number
    if (!allNums.test(month)) {
        // temp_month is undefined, if not a valid month name
        var temp_month = Date.create(month).getMonth() + 1;
        if (temp_month) {
            if (temp_month <= 9) {
                month = '0' + temp_month;
            } else {
                month = temp_month;
            }
        }
    }
    return month;
}

function slugify(string) {
    return string.replace(/[\s\.]+/g, '-').replace(/[^a-zA-Z0-9-]+/g, '').toLowerCase();
}

exports.addTags = function (req, res, next) {
    res.locals.allTags = allTags;
    res.locals.tagCounts = tagCounts;
    next();
};

exports.addPostDates = function (req, res, next) {
    res.locals.postDates = postDates;
    next();
};

function loadPosts(posts) {
    postData = _(posts).sortBy(function (post) {
        return -post.date.getTime();
    }).each(function (post) {
        // add an author slug, if not already existent
        post.author_slug = post.author_slug || slugify(post.author);
        // store some date metadata for date-based pages
        var postDate = Date.create(post.date),
        postYear = postDate.format('{yyyy}'),
        postMonth = postDate.format('{MM}'),
        postMonthName = postDate.format('{Month}'),
        postDatesYear = postDates[postYear] || (postDates[postYear] = {});
        if (!postDatesYear[postMonth]) postDatesYear[postMonth] = postMonthName;
        // process tags
        var tagSlugs = {}, lastTag, tagCount;
        if (typeof post.tagsRaw === 'string' && typeof post.tags === 'object') post.tags = post.tagsRaw;
        _(post.tags ? post.tags.split(',') : []).each(function (tag, index, tags) {
            tag = tag.trim();
            if (!tagCount) tagCount = tags.length;
            var slug = slugify(tag);
            tagSlugs[slug] = tag;
            if (!tagCounts[slug]) tagCounts[slug] = 0;
            tagCounts[slug] += 1;
            allTags[slug] = tag;
            if (index + 1 === tags.length) {
                lastTag = slug;
            }
        });
        post.tagsRaw = post.tags;
        post.tags = tagSlugs;
        // needed for formatting 'tag, tag, and lastTag'
        post.lastTag = lastTag;
        // needed to prevent 'and lastTag' when 
        post.tagCount = tagCount;
    });
    postSetData = _.first(postData, [config.maxPosts]);
}
// parse and load the post files into memory
parsePosts.on('ready', function (posts) {
    loadPosts(posts);
});

parsePosts.on('update', function (posts) {
    loadPosts(posts);
});

parsePosts.setup();

// homepage
exports.index = function (req, res) {
    res.render('index', {
        pageTitle: 'home',
        bodyId: 'home'
    });
};

exports.tumblrRedirect = function (req, res) {
    var slug = req.params.tslug;
    var thisPost = _.findWhere(postData, {fullSlug: slug });
    res.redirect(301, thisPost.permalink);
    logger.info(thisPost.permalink);
    logger.info('Request:  ' + req.url + '\n>>>>> Redirect: ' + slug);
};

exports.blogIndex = function (req, res) {
    paginator.paginate(postData, req, res, function (realPage) {
        if (realPage) return res.redirect('/?page=' + realPage);
        res.render('blogIndex', {
            bodyId: 'archive',
            gravatar: gravatar,
            pageTitle: 'The blog'
        });
    });
};

// rss
exports.rss = function (req, res) {
    res.set('Content-Type', 'text/xml');
    res.render('rss', {
        postData: postSetData
    });
};


exports.blogYearIndex = function (req, res, next) {
    var year  = req.params.year,
    posts = [];
    if (!allNums.test(year)) return next();
    for (var i = 0; i < postData.length; i++) {
        var postYear = Date.create(postData[i].date).format('{yyyy}');
        if (postYear == year) {
            posts.push(postData[i]);
        }
    }

    paginator.paginate(posts, req, res, function (realPage) {
        if (realPage) return res.redirect('/' + year + '/?page=' + realPage);
        res.render('blogIndex', {
            pageTitle: 'All of ' + year,
            bodyId: 'archive',
            gravatar: gravatar,
            year: year
        });
    });
};

exports.blogMonthIndex = function (req, res, next) {
    var year  = req.params.year,
    month = parse_month(req.params.month),
    posts = [];

    if (!allNums.test(year) || !allNums.test(month)) {
        return next();
    }
    for (var i = 0; i < postData.length; i++) {

        var postYear = Date.create(postData[i].date).format('{yyyy}');
        var postMonth = Date.create(postData[i].date).format('{MM}');

        if (postYear == year && postMonth == month) {
            logger.info('dates match for ' + postData[i].title);
            posts.push(postData[i]);
        } else {
            logger.info('No match — year: ' + postYear + " (" + year + ") | month: " + postMonth + " (" + month + ")");
        }
    }

    paginator.paginate(posts, req, res, function (realPage) {
        if (realPage) return res.redirect('/' + year + '/' + month + '/?page=' + realPage);
        res.render('blogIndex', {
            pageTitle: 'All of ' + Date.create(month + '-' + year).format('{Month}, {yyyy}'),
            bodyId: 'archive',
            gravatar: gravatar
        });
    });
};


exports.blogDateIndex = function (req, res, next) {
    var year  = req.params.year,
    month = parse_month(req.params.month),
    day   = req.params.day,
    posts = [];

    if (!allNums.test(year) || !allNums.test(month)) {
        return next();
    }

    for (var i = 0; i < postData.length; i++) {
        var postYear = Date.create(postData[i].date).format('{yyyy}');
        var postMonth = Date.create(postData[i].date).format('{MM}');
        var postDay = Date.create(postData[i].date).format('{dd}');

        if (postYear == year && postMonth == month && postDay == day) {
            posts.push(postData[i]);
        }
    }

    paginator.paginate(posts, req, res, function (realPage) {
        if (realPage) return res.redirect('/' + year + '/' + month + '/' + day + '/?page=' + realPage);
        res.render('blogIndex', {
            pageTitle: Date.create(year + '-' + month + '-' + day).format('{Month} {d}, {yyyy}'),
            bodyId: 'archive',
            gravatar: gravatar
        });
    });
};

exports.blogPost = function (req, res, next) {
    var slug = req.params.pslug,
    year  = req.params.year,
    month = parse_month(req.params.month),
    day   = req.params.day;

    if (!allNums.test(year) || !allNums.test(month) || !allNums.test(day)) {
        return next();
    }

    var thisSlug = year + '-' + month + '-' + day + '-' + slug;
    var thisPost = _.findWhere(postData, {fullSlug: thisSlug });

    res.render('post', {
        gravatar: gravatar,
        bodyId: 'post',
        slug: slug,
        title: thisPost.title,
        date: thisPost.formattedDate,
        author: thisPost.author,
        content: thisPost.postBody,
        post: thisPost
    });

};

exports.authorIndex = function (req, res, next) {
    var slug = req.params.slug,
    posts = _(postData).filter(function (post) {
        return post.author_slug === slug;
    });
    logger.info('authorIndex called with "' + slug + '"');
    if (!posts.length) return next();
    res.render('blogIndex', {
        postData: posts
    });
};

exports.tagIndex = function (req, res, next) {
    var slug = req.params.slug,
    posts = _(postData).filter(function (post) {
        return slug in post.tags;
    });
    if (!posts.length) return next();
    res.render('blogIndex', {
        postData: posts
    });
};

// 404
exports.notFound = function (req, res) {
    res.render('404', {status: 404, bodyId: 'fourohfour'});
};
