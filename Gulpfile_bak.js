var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    sourcemaps = require('gulp-sourcemaps'),
    rename = require('gulp-rename'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    babelify = require('babelify'),
    uglify = require('gulp-uglify'),
    browserSync = require('browser-sync').create()

// SETTINGS
var cfg = {
  scripts: {
    src: './frontend/assets/js/**/*.js',
    dist: './public/assets/js/',
    filename: 'bundle.js',
    entrypoint: './frontend/assets/js/main.js',
  },
  styles: {
    src: './frontend/assets/scss/**/*.scss',
    dist: './public/assets/css/',
  },
  img: {
    src: './frontend/assets/img/**/*',
    dist: './public/assets/img/',
  },
  fonts: {
    src: './frontend/assets/fonts/**/*',
    dist: './public/assets/fonts/',
  },
  vendor: {
    css: {
      src: './frontend/assets/vendor/css/**/*.css',
      dist: './public/assets/css/',
    },
    js: {
      src: './frontend/assets/vendor/js/**/*.js',
      dist: './public/assets/js/',
    }
  },
}

// SCRIPTS
gulp.task('js-rebuild', function () {
  return browserify({entries: cfg.scripts.entrypoint, debug: true})
    .transform("babelify", { presets: ["env"] })
    .bundle()
    .pipe(source(cfg.scripts.filename))
    .pipe(buffer())
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest(cfg.scripts.dist))
    .pipe(browserSync.stream())
})

// COPY IMAGES
gulp.task('images-rebuild', function() {
  return gulp.src(cfg.img.src)
    .pipe(gulp.dest(cfg.img.dist))
    .pipe(browserSync.stream())
})

// STYLES
gulp.task('sass-rebuild', function () {
  return gulp.src(cfg.styles.src)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', function(err) {
      console.error(err.message)
      browserSync.notify(err.message, 3000)
      this.emit('end')
    }))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(cfg.styles.dist))
    .pipe(sass({
      outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(cfg.styles.dist))
    .pipe(browserSync.stream())
})

// VENDOR CSS
gulp.task('vendor-css-rebuild', () => {
  return gulp.src(cfg.vendor.css.src)
    .pipe(gulp.dest(cfg.vendor.css.dist))
    .pipe(browserSync.stream())
})

// FONTS
gulp.task('fonts-rebuild', function () {
  return gulp.src(cfg.fonts.src)
    .pipe(gulp.dest(cfg.fonts.dist))
    .pipe(browserSync.stream())
})

// BROWSER SYNC
gulp.task('serve', function() {
  browserSync.init({
    proxy: 'localhost:5000'
  })

  gulp.watch('Gulpfile.js').on('change', () => process.exit(0))
})

// watch just the sass files
gulp.task('watch-sass', gulp.series('sass-rebuild', function() {
  return gulp.watch([cfg.styles.src], gulp.series('sass-rebuild'))
}))

// watch just the sass files
gulp.task('watch-vendor-css', gulp.series('vendor-css-rebuild', function() {
  return gulp.watch([cfg.vendor.css.src], gulp.series('vendor-css-rebuild'))
}))

// watch just the js files
gulp.task('watch-js', gulp.series('js-rebuild', function() {
  return gulp.watch([cfg.scripts.src], gulp.series('js-rebuild'))
}))

// watch just the image files
gulp.task('watch-images', gulp.series('images-rebuild', function() {
  return gulp.watch([cfg.img.src], gulp.series('images-rebuild'))
}))

// watch just the font files
gulp.task('watch-fonts', gulp.series('fonts-rebuild', function() {
  return gulp.watch([cfg.fonts.src], gulp.series('fonts-rebuild'))
}))

gulp.task('default', gulp.series('serve', 'watch-sass', 'watch-vendor-css', 'watch-images', 'watch-fonts', 'watch-js'))

gulp.task('build', gulp.series('sass-rebuild', 'vendor-css-rebuild', 'images-rebuild', 'fonts-rebuild', 'js-rebuild'))