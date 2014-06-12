var Hapi = require('hapi');
var config = require('config');
var jade = require('jade');
var bumble = require('bumble');
var bumbleOptions = require('./blogConfig.json');


var server = new Hapi.Server(config.hapi.host, config.hapi.port || process.env.PORT);

server.views({
    engines: {
        jade: jade
    },
    path: 'views',
});

server.route({
    method: 'GET',
    path: '/images/{path*}',
    handler: {
        directory: {
            path: 'public/images',
            index: false
        }
    }
});

server.route({
    method: 'GET',
    path: '/css/{path*}',
    handler: {
        directory: {
            path: 'public/css',
            index: false
        }
    }
});

server.route({
    method: 'GET',
    path: '/js/{path*}',
    handler: {
        directory: {
            path: 'public/js',
            index: false
        }
    }
});

server.pack.register({
    plugin: bumble,
    name: "bumble",
    options: bumbleOptions
    
}, function (err) {
    if (err) throw err;

    server.start(function () {
        console.log('bumble running on the port ' + server.info.port);
    });
});
