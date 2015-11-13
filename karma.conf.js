
module.exports = function(config) {
    var options = {
        browsers: ['Chrome'],
        frameworks: ['systemjs', 'mocha', 'chai'],
        reports: ['mocha'],
        plugins: ['karma-*'],
        //preprocessor: {
        //    'dist/{**/}*.js': ['babel'],
        //    'test/{**/}*.spec.js': ['babel']
        //},
    };

    config.set(options);
};
