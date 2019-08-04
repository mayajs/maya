const gulp = require('gulp'),
    ts = require("gulp-typescript"),
    tsProject = ts.createProject("tsconfig.json", {
        declaration: true
    }),
    del = require('del'),
    spawn = require('cross-spawn');

const config = {
        src: "./src/**/*.ts",
        out: "./dist/"
    },
    clean = () => {
        return del(["./dist"]);
    },
    tsc = () => {
        const tsResults = tsProject.src().pipe(tsProject());
        return tsResults.pipe(gulp.dest("./dist"));
    },
    publish = (done) => {
        // Copy the files we'll need to publish
        // We just use built-in gulp commands to do the copy
        gulp.src(["package.json", "README.md", "LICENSE"]).pipe(gulp.dest(config.out));

        // We'll start the npm process in the dist directory
        const outPath = config.out.replace(/(\.)|(\/)/gm, '');
        const distDir = __dirname + '\\' + outPath + '\\';
        console.log("Publishing files in directory: " + distDir);

        spawn('npm', ['publish'], {
                stdio: 'inherit',
                cwd: distDir
            })
            .on('close', done)
            .on('error', function (error) {
                console.error('  Underlying spawn error: ' + error);
                throw error;
            });
    };

gulp.task("publish", gulp.series(clean, tsc, publish));