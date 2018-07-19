var gulp = require('gulp'),
    browserSync = require('browser-sync'),
    autoprefixer = require('gulp-autoprefixer'),
    imagemin = require('gulp-imagemin'),
    imageminPNG = require('imagemin-pngquant'),
    cssmin = require('gulp-minify-css'),
    pug = require('gulp-pug'),
    rigger = require('gulp-rigger'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    watch = require('gulp-watch'),
    rimraf = require('rimraf'),
    htmlBeautify = require('gulp-html-beautify'),
    plumber = require('gulp-plumber'),
    reload = browserSync.reload;

var path = {
    build: {
        pug: 'build/',
        js: 'build/js/',
        css: 'build/css/',
        img: 'build/img/',
        fonts: 'build/fonts/'
    },
    src: {
        pug: 'src/*.pug',
        js: 'src/js/main.js',
        style: 'src/sass/main.sass',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    watch: {
        pug: 'src/**/*.pug',
        img: 'src/img/**/*.*',
        style: 'src/sass/**/*.(sass|scss)',
        js: 'src/js/**/*.js',
        fonts: 'src/fonts/**/*.*'
    },
    clean: './build'
};

var config = {
    server: {
        baseDir: './build'
    },
    tunnel: true,
    host: 'localhost',
    port: 9000,
    logPrefix: 'FrontendPortfolio'
};

gulp.task('build:html', () => {
    gulp.src(path.src.pug)
        .pipe(plumber())
        .pipe(pug())
        .pipe(htmlBeautify({ indentSize: 2 }))
        .pipe(gulp.dest(path.build.pug))
        .pipe(reload({ stream: true }));
})

gulp.task('build:css', () => {
    gulp.src(path.src.style)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(autoprefixer({ browsers:['ie >= 8', 'last 4 version'] }))
        //.pipe(cssmin())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({ stream: true }))
})

gulp.task('build:js', () => {
    gulp.src(path.src.js)
        .pipe(plumber())
        .pipe(rigger())
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.js))
        .pipe(reload({ stream: true }))
})

gulp.task('build:img', () => {
    gulp.src(path.src.img)
        .pipe(plumber())
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{ removeViewBox: false }],
            use: [imageminPNG()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.img))
        .pipe(reload({stream: true}))    
})

gulp.task('build:svg', ()=>{
    gulp.src('src/img/**/*.svg')
        .pipe(plumber())
        .pipe(gulp.dest(path.build.img))

})

gulp.task('build:fonts', () => {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
})

gulp.task('build', 
    [   'build:html',
        'build:css', 
        'build:js',
        'build:img',
        'build:fonts',
        'build:svg' ])

gulp.task('watch', ()=>{
    watch([path.watch.pug], (event,cb)=>{
        gulp.start('build:html')
    });
    watch([path.watch.style], (event,cb)=>{
        gulp.start('build:css')
    });
    watch([path.watch.js], (event,cb)=>{
        gulp.start('build:js')
    })
    watch([path.watch.img], (event,cb)=>{
        gulp.start('build:img')
    })
    watch([path.watch.fonts], (event,cb)=>{
        gulp.start('build:fonts')
    })
    watch([path.watch.img], (event,cb)=>{
        gulp.start('build:svg')
    })
    gulp.start('webserver')
})

gulp.task('webserver', () => {
    browserSync(config)
})

gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});

gulp.task('default', ['build', 'webserver', 'watch']);