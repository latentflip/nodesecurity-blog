var Hapi          = require('hapi');
var config        = require('config');
var jade          = require('jade');
var bumble        = require('bumble');
var electricfence = require('electricfence');
var bumbleOptions = require('./blogConfig.json');


var server = new Hapi.Server(config.hapi.host, config.hapi.port || process.env.PORT);

server.views({
    engines: {
        jade: jade
    },
    path: 'views',
});


server.pack.register({
    plugin: electricfence,
    name: 'electricfence',
    options: {}
}, function (err) {
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
