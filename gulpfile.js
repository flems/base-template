'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const insert = require('gulp-insert');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const imagemin = require('gulp-imagemin');
const svgSprite = require('gulp-svg-sprite');

sass.compiler = require('node-sass');

const path = {
  styles: [
    "htdocs/css/scss/*.scss",
    "htdocs/css/scss/modules/*.scss",
  ],
  img: [
    "htdocs/img/**/*"
  ],
  svg: {
    folder: "htdocs/img/svg/*.svg",
    dest: "htdocs/img/svg/"
  }
}

function style() {
  return (
    gulp
      .src(path.styles)
      .pipe(insert.prepend('@import "htdocs/css/scss/global/variables.scss";'))
      .pipe(sass())
      .on("error", sass.logError)
      .pipe(autoprefixer({
        cascade: false
      }))
      .pipe(cleanCSS())
      .pipe(gulp.dest("./htdocs/css/"))
  )
}

function images() {
  return (
    gulp
      .src(path.img, { base: './htdocs/' })
      .pipe(
        imagemin([
          imagemin.gifsicle({ interlaced: true }),
          imagemin.jpegtran({ progressive: true }),
          imagemin.optipng({ optimizationLevel: 5 }),
          imagemin.svgo({
            js2svg: {
              pretty: true
            }
          })
        ])
      )
      .pipe(gulp.dest('./htdocs/'))
  )
}

function svgSpriteBuild() {
  const configSprite = {
    svg: {
      rootAttributes: {
        width: '0',
        height: '0',
        style: 'position:absolute'
      }
    },
    shape: {
      transform: [
        {svgo: {
          js2svg: {
            pretty: true,
          },
          plugins: [
            { inlineStyles: false },
            { convertStyleToAttrs: false },
            { removeViewBox: false },
            { removeAttrs: { attrs: ['style', 'fill'] } },
          ],
        }}
      ],
      id: {
        generator: (name) => {
          return 'icon-' + name.split('.')[0]
        }
      },

    },
    mode: {
      symbol: {
        dest: '.',
        sprite: 'symbol_sprite.html',
        prefix: 'icon-%s',
        bust: false,
        example: true,
      }
    }
  };
  return (
    gulp
    .src(path.svg.folder)
    .pipe(svgSprite(configSprite))
    .on('error', function(error) {
      console.log(error);
    })
    .pipe(gulp.dest(path.svg.dest))
  )
}

function watchFiles() {
  gulp.watch(path.svg.folder, svgSpriteBuild);
  gulp.watch(path.styles, style);
}


exports.style = style;
exports.images = images;
exports.svgSpriteBuild = svgSpriteBuild;
exports.default = gulp.series(images, svgSpriteBuild, style, watchFiles);
