/* eslint-disable */
const sass = require('node-sass');
const path = require('path');
const fs = require('fs');

const srcFiles = 'all';

function setCustomElementNativeShim(enable) {
    const files = ['./tests/src/demo-files.js', './tests/src/test-files.js'];
    const IS_IE = 'const isIE = true;';
    const NOT_IE = 'const isIE = false;';
    const from = enable ? NOT_IE : IS_IE;
    const to = enable ? IS_IE : NOT_IE;
    files.forEach((file) => {
        fs.writeFileSync(file, fs.readFileSync(file).toString().replace(from, to));
    });
}

module.exports = function (grunt) {

    const srcFileOptions = {
        all: './build-profiles/all.js'
    };

    // collect dependencies from node_modules
    let nm = path.resolve(__dirname, 'node_modules'),
        vendorAliases = [
            '@clubajax/custom-elements-polyfill',
            '@clubajax/dom',
            '@clubajax/base-component/src/BaseComponent',
            '@clubajax/base-component/src/template',
            '@clubajax/base-component/src/properties',
            '@clubajax/base-component/src/refs',
        ],
        sourceMaps = true,
        watch = false,
        watchPort = 35701,
        serverPort = 9003,
        babelTransform = [['babelify', {
            'presets': ['@babel/preset-env'],
            global: true,
            //only: vendorsToBabelize()
        }]],
        devBabel = 0;

    function vendorsToBabelize() {
        // not all vendors need to be babelized. Most are already ES5.
        const files = '@clubajax/base-component|@clubajax/no-dash';
        return new RegExp(`^(?:.*\/node_modules\/(?:${files})\/|(?!.*\/node_modules\/)).*$`);
    }

    const dev = {
        // dev - concat, no babel (in neither vendor nor src)
        //
        // TODO: use minifier from calendar
        //
        vendor: {
            src: ['.'],
            dest: 'dist/vendor.js',
            options: {
                // expose the modules
                alias: vendorAliases.map(function (module) {
                    console.log('vendor', module);
                    return module + ':';
                }),
                // not consuming any modules
                external: null,
                browserifyOptions: {
                    debug: sourceMaps
                },
                postBundleCB: function (err, src, next) {
                    console.timeEnd('vendor-build');
                    next(err, src);
                }
            }
        },
        dev: {
            files: {
                'dist/dev.js': [srcFileOptions[srcFiles]]
            },
            options: {
                // not using browserify-watch; it did not trigger a page reload
                watch: false,
                keepAlive: false,
                external: vendorAliases,
                browserifyOptions: {
                    debug: sourceMaps
                },
                alias: vendorAliases.map(function (module) {
                    console.log('*vendor: ', module);
                    return module + ':';
                }),
                // transform not using babel.
                transform: false,
                postBundleCB: function (err, src, next) {
                    console.timeEnd('dev-build');
                    next(err, src);
                }
            }
        },
        prod: {
            files: {
                'build/index.js': [srcFileOptions[srcFiles]]
            },
            options: {
                // external: vendorAliases,
                browserifyOptions: {
                    // debug: sourceMaps
                },
                // alias: vendorAliases.map(function (module) {
                //     console.log('*vendor: ', module);
                //     return module + ':';
                // }),
                // transform not using babel.
                transform: false,
                postBundleCB: function (err, src, next) {
                    console.timeEnd('dev-build');
                    next(err, src);
                }
            }
        }
    };

    const ie = {
        vendor: {
            // different convention than "dev" - this gets the external
            // modules to work properly
            //
            // optionally, vendor does not have to run through babel if you are
            // not expecting any transforms. If we were, that could either be built into
            // the app or be another vendor-type file
            //
            // However, we *are* babelizing files based on vendorsToBabelize()
            src: ['.'],
            dest: 'dist/vendor.js',
            options: {
                // expose the modules
                alias: vendorAliases.map(function (module) {
                    console.log('vendor', module);
                    return module + ':';
                }),
                // not consuming any modules
                external: null,
                browserifyOptions: {
                    debug: sourceMaps
                },
                transform: babelTransform,
                postBundleCB: function (err, src, next) {
                    console.timeEnd('vendor-build');
                    next(err, src);
                }
            }
        },
        dev: {
            files: {
                'dist/dev.js': [srcFileOptions[srcFiles]]
            },
            options: {
                // not using browserify-watch; it did not trigger a page reload
                watch: false,
                keepAlive: false,
                external: vendorAliases,
                browserifyOptions: {
                    debug: sourceMaps
                },
                alias: vendorAliases.map(function (module) {
                    console.log('*vendor: ', module);
                    return module + ':';
                }),
                // transform not using babel in dev-mode.
                // if developing in IE or using very new features,
                // change devBabel to `true`
                transform: babelTransform,
                postBundleCB: function (err, src, next) {
                    console.timeEnd('dev-build');
                    next(err, src);
                }
            }
        }
    };

    function setConfig() {
        console.log('build environment:', grunt.option('env'));
        if (grunt.option('env') === 'ie') {
            grunt.config('browserify', ie);
        } else {
            grunt.config('browserify', dev);
        }
    }

    grunt.initConfig({
        // source maps have to be inline.
        // grunt-exorcise promises to do this, but it seems overly complicated
        browserify: null,

        sass: {
            main: {
                options: {
                    // case sensitive!
                    sourceMap: sourceMaps,
                    implementation: sass,
                    // for some reason in this project the source maps is being looked for in /dist/dist
                    // giving a name fixes it
                    sourceMapFilename: 'form.css.map',
                    loadPath: [
                        path.join(__dirname, 'node_modules')
                    ]
                },
                files: {
                    'dist/form.css': 'src/styles/main.scss',
                }
            },
            prod: {
                options: {
                    implementation: sass,
                    loadPath: [
                        path.join(__dirname, 'node_modules')
                    ]
                },
                files: {
                    'build/form.css': 'src/styles/main.scss',
                }
            }
        },

        'http-server': {
            dev: {
                root: __dirname,

                // the server port
                // can also be written as a function, e.g.
                // port: function() { return 8282; }
                port: serverPort,

                // the host ip address
                // If specified to, for example, "127.0.0.1" the server will
                // only be available on that ip.
                // Specify "0.0.0.0" to be available everywhere
                host: '0.0.0.0',

                showDir: true,
                autoIndex: true,

                // server default file extension
                ext: "html",

                // run in parallel with other tasks
                // runInBackground: true,
            }
        },

        watch: {
            sass: {
                files: ['./src/styles/*.scss'],
                tasks: ['sass'],
                options: {
                    // keep from refreshing the page
                    // the page does not care if a less file has changed
                    livereload: false
                }
            },
            css: {
                // css module is needed for css reload
                // watch the main file. When it changes it will notify the page
                // the livereload.js file will check if this is CSS - and if so, reload
                // the stylesheet, and not the whole page
                files: ['dist/form.css']
            },
            dev: {
                files: [
                    './src/**/*.js',
                    'tests/**/*.js',
                    'build-profiles/*.js'
                ],
                tasks: ['build-dev']
            },
            vendor: {
                files: [
                    'node_modules/@clubajax/custom-elements-polyfill/index.js',
                    'node_modules/@clubajax/key-nav/src/keys.js'
                ],
                tasks: ['build-vendor']
            },
            html: {
                files: ['tests/*.html'],
                tasks: []
            },
            // IMPORTANT: this options.livereload will work in the scripts
            // namespace, but then the CSS reload will not work properly
            options: {
                livereload: watchPort
            }
        },

        concurrent: {
            target: {
                tasks: ['watch', 'http-server:dev'],
                options: {
                    logConcurrentOutput: true
                }
            }
        },

        copy: {
            package: {
                files: [
                    {src: './src/package.json', dest: 'build/package.json'}
                ]
            }
        }
    });

    //
    grunt.registerTask('build-dev', function () {
        console.time('dev-build');
        setConfig();
        grunt.task.run('browserify:dev');

    });

    // task that builds vendor files
    grunt.registerTask('build-vendor', function () {
        console.time('vendor-build');
        grunt.task.run('browserify:vendor');
    });

    // task that builds vendor and dev files during development
    grunt.registerTask('build', function () {
        grunt.task.run('build-vendor');
        grunt.task.run('build-dev');
    });

    // task that builds files for production
    grunt.registerTask('deploy', function () {
        setConfig();
        grunt.task.run('sass:prod');
        grunt.task.run('browserify:prod');
        grunt.task.run('copy:package');
    });


    // The general task: builds, serves and watches
    grunt.registerTask('dev', function () {
        grunt.option.init({env: 'dev'});
        setConfig();
        setCustomElementNativeShim(false);
        grunt.task.run('build');
        grunt.task.run('sass');
        // grunt.task.run('http-server');
        grunt.task.run('concurrent:target');
    });

    // The general task: builds, serves and watches
    grunt.registerTask('ie', function () {
        grunt.option.init({env: 'ie'});
        setConfig();
        setCustomElementNativeShim(true);
        grunt.config('browserify', ie);
        grunt.task.run('build');
        grunt.task.run('sass');
        grunt.task.run('concurrent:target');
    });

    // alias for server
    grunt.registerTask('serve', function () {
        grunt.task.run('http-server');
    });

    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-http-server');

    grunt.registerTask('default', function () {
        console.log('default');
    });

};
