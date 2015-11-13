
module.exports = function(config) {
    var options = {
        basePath: 'dist',
        browsers: ['Chrome'],
        frameworks: ['browserify', 'mocha', 'chai'],
        reports: ['mocha'],
        plugins: ['karma-*'],
        files: [
            'lib/*.js',
            'lib/*.spec.js'
        ],
        preprocessors: {
            'lib/*.js': ['browserify'],
            'lib/*.spec.js': ['browserify']
        },
        browserify: {
            watch: false,
            transform: [
                ['babelify', {presets: 'es2015'}]
            ]
        }
    };

    config.set(options);
};
