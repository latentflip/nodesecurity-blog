var exec = require('child_process').exec,
    env = require('getconfig'),
    logger = require('bucker').createLogger(env.bucker);

exports.runHook = function (repo, payload) {
    // got an update to blog-posts repo
    exec('/home/andyet-blog/update.sh', function (err, stdout, stderr) {
        if (err) logger.error(err);
        if (stderr) logger.warn(stderr);
        logger.info(stdout);
    });
};
