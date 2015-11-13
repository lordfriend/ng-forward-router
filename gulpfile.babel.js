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

const tsconfig = require('./tsconfig.json');
const tsBuildProject = ts.createProject('tsconfig.json', {
    declaration: true,
    noLib: true,
    outDir: 'es6'
});

function typescriptToES6() {
    let result = tsBuildProject.src()
        .pipe(sourcemaps.init())
        .pipe(ts(tsBuildProject));

    return merge([
        result.js.pipe(sourcemaps.write()).pipe(gulp.dest('dist')),
        result.dts.pipe(gulp.dest('dist'))
    ])
}

function buildES6Dist() {
    let jsFiles = gulp.src('dist/lib/*.js')
        .pipe(gulp.dest('dist/es6'));
    let tsFiles = gulp.src('dist/lib/*.d.ts')
        .pipe(gulp.dest('dist/es6'));
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

gulp.task('delete-dist', deleteDistFolder);

gulp.task('clean-up', cleanDistFolder);

gulp.task('build/ts-to-es6', typescriptToES6);

gulp.task('build/lib-to-es6', buildES6Dist);

gulp.task('test', testES6);

gulp.task('build', (done) => {
    runSequence(
        'delete-dist',
        'build/ts-to-es6',
        'build/lib-to-es6',
        'clean-up',
        //'test',
        done
    )
});
