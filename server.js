var Hapi = require('hapi');
var config = require('config');
var blogConfig = require('./blogConfig.json');

var server = new Hapi.Server(config.hapi.host, config.hapi.port || process.env.PORT);

server.views({
    engines: {
        jade: 'jade'
    },
    path: 'views',
});

server.pack.require({
    'electricfence': config.electricfence,
    'bumble': blogConfig
}, function (err) {
//    console.log(server._router.routes);
    if (err) throw err;

    server.start(function () {
        console.log('bumble running on the port ' + server.info.port);
    });
});
