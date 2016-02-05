module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        uglify: {
            build: {
                options: {
                    mangle  : false,
                    beautify: false,
                    compress: true,
                    banner  : '/*! <%= pkg.name %> - v<%= pkg.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd") %> */'
                },
                files: {
                    'src/assets/js/main.min.js': ['src/assets/js/main.js']
                }
            }
        },

        sass: {

            build  : {
                options: {
                    style: 'expanded'
                },

                files: {
                    "src/assets/css/main.css": "src/assets/css/main.scss"
                }
            },
        },

        watch: {

            css: {
                options : {
                    terminate: true
                },
                files   : ['assets/scss/*.scss'],
                tasks   : ['sass']
            },

            js: {
                options : {
                    terminate: true
                },
                files: ['assets/js/main.js'], 
				tasks: ['uglify']
            },
        },

    });


    grunt.registerTask('build', ['sass','uglify']);
    grunt.registerTask('default', ['sass', 'uglify']);

    // Load plugins here
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-sass');

};
