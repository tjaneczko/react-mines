import gulp from 'gulp';
import sourcemaps from 'gulp-sourcemaps';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import browserify from 'browserify';
import watchify from 'watchify';
import babel from 'babelify';

function compile(watch) {
  var bundler = browserify('./src/index.jsx', {debug: true}).transform(babel);
  function rebundle() {
    console.log('-> bundling...');
    bundler.bundle()
      .on('error', function(err) {
        console.error(err);
        this.emit('end');
      })
      .on('end', function() {
        console.log('done');
      })
      .pipe(source('build.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./build'));
  }

  if (watch) {
    bundler = watchify(bundler);
    bundler.on('update', () => rebundle());
  }

  rebundle();
}

gulp.task('build', () => compile());
gulp.task('watch', () => compile(true));

gulp.task('default', ['watch']);