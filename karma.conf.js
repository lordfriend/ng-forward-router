
module.exports = function(config) {
    var options = {
        basePath: 'dist',
        browsers: ['Chrome'],
        frameworks: ['browserify', 'angular', 'mocha', 'chai'],
        angular: ['angular'],
        reports: ['mocha'],
        plugins: ['karma-*'],
        files: [
            '../node_modules/reflect-metadata/Reflect.js',
            '../node_modules/ui-router/release/angular-ui-router.js',
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
            ],
            extensions: ['.js']
        }
    };

    config.set(options);
};
