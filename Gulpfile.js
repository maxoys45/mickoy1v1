const { src, dest, watch, series, parallel } = require('gulp')
const sass = require('gulp-sass')
const autoprefixer = require('gulp-autoprefixer')
const sourcemaps = require('gulp-sourcemaps')
const rename = require('gulp-rename')
const browserify = require('browserify')
const source = require('vinyl-source-stream')
const buffer = require('vinyl-buffer')
const babelify = require('babelify')
const uglify = require('gulp-uglify')
const browserSync = require('browser-sync').create()

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
  files: {
    src: './frontend/assets/files/**/*',
    dist: './public/assets/files/',
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
  templates: {
    src: './views/**/*.ejs',
  },
}

// SCRIPTS
function jsRebuild() {
  return browserify({entries: cfg.scripts.entrypoint, debug: true})
    .transform("babelify", { presets: ["env"] })
    .bundle()
    .pipe(source(cfg.scripts.filename))
    .pipe(buffer())
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write('./maps'))
    .pipe(dest(cfg.scripts.dist))
    .pipe(browserSync.stream())
}

// SCSS
function scssRebuild() {
  return src(cfg.styles.src)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', function(err) {
      console.error(err.message)
      browserSync.notify(err.message, 3000)
      this.emit('end')
    }))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write())
    .pipe(dest(cfg.styles.dist))
    .pipe(sass({
      outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(dest(cfg.styles.dist))
    .pipe(browserSync.stream())
}

// VENDOR CSS
function vendorCSS() {
  return src(cfg.vendor.css.src)
    .pipe(dest(cfg.vendor.css.dist))
    .pipe(browserSync.stream())
}

// COPY IMAGES
function copyImages() {
  return src(cfg.img.src)
    .pipe(dest(cfg.img.dist))
    .pipe(browserSync.stream())
}

// FONTS
function copyFonts() {
  return src(cfg.fonts.src)
    .pipe(dest(cfg.fonts.dist))
    .pipe(browserSync.stream())
}

// FILES
function copyFiles() {
  return src(cfg.files.src)
    .pipe(dest(cfg.files.dist))
    .pipe(browserSync.stream())
}

// BROWSER SYNC SERVE
function browserSyncServe(cb) {
  browserSync.init({
    proxy: 'localhost:5000',
  })

  cb()

  // gulp.watch('Gulpfile.js').on('change', () => process.exit(0))
}

// BROWSER SYNC RELOAD
function browserSyncReload(cb) {
  browserSync.reload()
  cb()
}

// WATCHER
function watchTask() {
  watch([cfg.templates.src], browserSyncReload)
  watch([cfg.scripts.src, cfg.styles.src, cfg.vendor.css.src, cfg.img.src, cfg.fonts.src, cfg.files.src],
    series(
      parallel(jsRebuild, scssRebuild, vendorCSS, copyImages, copyFonts, copyFiles, browserSyncReload)
    ))
}

exports.default = series(
  parallel(jsRebuild, scssRebuild, vendorCSS, copyImages, copyFonts, copyFiles),
  browserSyncServe,
  watchTask
)