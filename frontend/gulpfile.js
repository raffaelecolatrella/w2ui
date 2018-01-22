var gulp        = require('gulp');
var cache       = require('gulp-cache');
var concat      = require('gulp-concat');
var header      = require('gulp-header');
var iconfont    = require('gulp-iconfont');
var jshint      = require('gulp-jshint');
var less        = require('gulp-less');
var prompt      = require('gulp-prompt');
var shell       = require('gulp-shell');
var ssh         = require('gulp-ssh');
var uglify      = require('gulp-uglify');
var minimist    = require('minimist');

var defaultOptions = {
    string  : 'env',
    default : { 
        env : 'prod' 
    }
};
var options = minimist(process.argv.slice(2), defaultOptions);

//remove BUILD
// gulp.task('clean', function () {  
//     gulp.src('build', { read: false })
//         .pipe(shell('rm -rf build/'));
// });

//gulp.task('clean-log', function () {  
//    gulp.src('log', { read: false })
//        .pipe(shell('rm -rf log/'));
//});

// LESS -> CSS
gulp.task('less', function() {
    // all *.less in each modeule
    gulp.src(['!web/app/main/less/*.less', '!web/app/main/less-alt/*.less', 'web/app/**/*.less'])
        .pipe(less({ cleancss : true }))
        .on('error', function (err) {
            console.log(err.toString());
            this.emit('end');
        })
        .pipe(header('/* generated file, do not change */\n'))
        .pipe(gulp.dest('web/app'));
});

// icon font
gulp.task('iconfont', function() {
    var fs  = require('fs');
    var css = '@font-face {\n' +
              '    font-family: "icon-font";\n' +
              '    src: url("icon-font.woff");\n' +
              '    font-weight: normal;\n' +
              '    font-style: normal;\n' +
              '}\n' +
              '[class^="icon-"]:before,\n' +
              '[class*=" icon-"]:before {\n' +
              '    font-family: "icon-font";\n' +
              '    display: inline-block;\n' +
              '    vertical-align: middle;\n' +
              '    line-height: 1;\n' +
              '    font-weight: normal;\n' +
              '    font-style: normal;\n' +
              '    speak: none;\n' +
              '    text-decoration: inherit;\n' +
              '    text-transform: none;\n' +
              '    text-rendering: optimizeLegibility;\n' +
              '    -webkit-font-smoothing: antialiased;\n' +
              '    -moz-osx-font-smoothing: grayscale;\n' +
              '}\n';
    var html = '<!doctype html>\n'+
               '<html>\n'+
               '<head>\n'+
               '    <meta charset="utf-8">\n'+
               '    <link href="icon-font.css" rel="stylesheet">\n'+
               '    <title>icon-font</title>\n'+
               '    <style>\n'+
               '        body { font-family: verdana; font-size: 13px }\n'+
               '        .preview { padding: 8px; margin: 4px; width: 200px; box-shadow: 1px 1px 2px #ccc; float: left } \n'+
               '        .preview:hover { background-color: #f5f5f5 } \n'+
               '        .preview span.icon { font-size: 16px; padding: 8px }\n'+
               '    </style>\n' +
               '</head>\n'+
               '<body>\n'+
               '    <h1 style="font-family: arial; padding-left: 15px;">icon-font $count</h1>';
    var json = [];

    gulp.src(['web/app/icons/svg/*.svg'])
        .pipe(iconfont({
            fontName: 'icon-font', 
            normalize: true,
            fixedWidth: true,
            centerHorizontally: true
        }))
        .on('error', function (err) {
            console.log(err.toString());
            this.emit('end');
        })
        .on('codepoints', function (icons, options) {
            var cnt = 0;
            for (var i in icons) {
                cnt++;
                var hex = cnt.toString(16);
                html += '<div class="preview">\n'+
                        '   <span class="icon icon-'+ icons[i].name +'"></span>\n'+
                        '   <span>icon-'+ icons[i].name +'</span>\n'+
                        '</div>\n';
                css  += '.icon-'+ icons[i].name + ':before { content: "\\e'+ (hex.length == 1 ? '00' : '') + (hex.length == 2 ? '0' : '') + hex +'" }\n';
                json.push(icons[i].name);
            }
            html += '<div style="clear: both; height: 10px;"></div></body>\n</html>';
            html = html.replace('$count', ' - ' + cnt + ' icons');
            fs.writeFileSync('web/app/icons/icon-font.css', css);
            fs.writeFileSync('web/app/icons/preview.html', html);
            fs.writeFileSync('web/app/icons/icons.json', JSON.stringify(json));
        })
        .pipe(gulp.dest('web/app/icons/'));
});

// generate archive
// gulp.task('build', shell.task([
//     'mkdir -p build',  // only when does not exist
//     'tar -czf build/build.tar.gz api web package.json'
// ]));

//watch
// gulp.task('dev', function() {
//     gulp.watch('web/app/**/*.less', ['less']);
//     gulp.watch('web/app/icons/svg/*.svg', ['iconfont']);
// });

// default
//gulp.task('default', ['clean', 'less']);
gulp.task('default', ['less']);

// list tasks
if (options.l === true || options.h === true || options.help === true) {
    console.log('==> List of Tasks');
    for (var i in gulp.tasks) {
        var task = gulp.tasks[i];
        console.log('   - ' + pad(task.name, 14) + (task.dep.length > 0 ?  ' depends: ' + task.dep : ''));
    }
    function pad(str, max) {
        for (var i = str.length; i < max; i++) str += ' ';
        return str;
    }
    process.exit(0);
}