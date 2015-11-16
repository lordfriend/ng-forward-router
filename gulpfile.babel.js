'use strict';
import gulp from 'gulp';
import ts from 'gulp-typescript';
import sourcemaps from 'gulp-sourcemaps';
import runSequence from 'run-sequence';
import merge from 'merge2';
import del from 'del';
import {Server as KarmaServer, LOG} from 'Karma';
import {join} from 'path';
import filter from 'gulp-filter';

//const tsconfig = require('./tsconfig.json');

function typescriptToES6() {
    const tsBuildProject = ts.createProject('tsconfig.json', {
        declaration: true,
        noLib: true,
        outDir: 'es6'
    });
    let result = tsBuildProject.src()
        //.pipe(sourcemaps.init())
        .pipe(ts(tsBuildProject));

    return merge([
        result.js
            //.pipe(sourcemaps.write())
            .pipe(gulp.dest('dist')),
        result.dts.pipe(gulp.dest('dist'))
    ])
}

function buildES6Dist() {
    let jsFiles = gulp.src('dist/lib/*.js')
        .pipe(filter(['*.js', '!*.spec.js']))
        .pipe(gulp.dest('dist/es6'));

    let tsFiles = gulp.src('dist/lib/*.d.ts')
        .pipe(filter(['*.d.ts', '!*.spec.d.ts']))
        .pipe(gulp.dest('dist/es6'));
    return merge([jsFiles, tsFiles]);
}

function typescriptToCJS() {
    const tsBuildProject = ts.createProject('tsconfig.json', {
        declaration: true,
        noLib: true,
        outDir: 'cjs',
        target: 'ES5',
        module: 'commonjs'
    });

    let result = tsBuildProject.src()
    .pipe(ts(tsBuildProject));

    return merge([
        result.js.pipe(gulp.dest('dist')),
        result.dts.pipe(gulp.dest('dist'))
    ]);
}

function buildCJSDist() {
    let jsFiles = gulp.src('dist/lib/*.js')
        .pipe(filter(['*.js', '!*.spec.js']))
        .pipe(gulp.dest('dist/cjs'));
    let tsFiles = gulp.src('dist/lib/*.d.ts')
        .pipe(filter(['*.d.ts', '!*.spec.d.ts']))
        .pipe(gulp.dest('dist/cjs'));
    return merge([jsFiles, tsFiles]);
}

function testES6(done) {
    let config = {configFile: join(__dirname, 'karma.conf.js')};

    config.singleRun = true;
    //config.reporters = ['dots'];

    let server = new KarmaServer(config, done);
    server.start();
}
function deleteDistFolder() {
    return del('dist/**');
}

function cleanDistFolder() {
    return del([
        'dist/lib'
    ]);
}

function moveMiscToDist() {
    return gulp.src([
        './package.json',
        './README.md'
    ])
        .pipe(gulp.dest('./dist'));
}

gulp.task('delete-dist', deleteDistFolder);

gulp.task('clean-up', cleanDistFolder);

gulp.task('build/ts-to-es6', typescriptToES6);

gulp.task('build/lib-to-es6', buildES6Dist);

gulp.task('build/ts-to-cjs', typescriptToCJS);

gulp.task('build/lib-to-cjs', buildCJSDist);

gulp.task('test', testES6);

gulp.task('build/move-misc-files', moveMiscToDist);

gulp.task('build', (done) => {
    runSequence(
        'delete-dist',
        'build/ts-to-es6',
        'test',
        'build/lib-to-es6',
        'clean-up',
        'build/ts-to-cjs',
        'build/lib-to-cjs',
        'clean-up',
        'build/move-misc-files',
        done
    )
});
