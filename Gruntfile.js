module.exports = function(grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),
    meta: {
      banner: '/*! \n * <%= pkg.name %>\n * Built on ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? " * " + pkg.homepage + "\\n" : "" %>' +
        ' */\n'
    },

    concat: {
      options: {
        banner: '<%= meta.banner %>',
        separator: ';'
      },
      dist: {
        src: ['src/scripts/**/*.js'],
        dest: 'dist/core.bundle.js'
      }
    },

    less: {
      dist: {
        options: {
          compress: true
        },
        files: {
          'dist/css/base.min.css': ['src/style/base.less']
        }
      }
    },

    uglify: {
      dist: {
        options: {
          banner: '<%= meta.banner %>'
        },
        files: {
          'dist/core.min.js': ['dist/core.bundle.js']
        }
      }
    },

    exec: {
      compile: {
        cmd: function() {
          var commands = [];
          ['fortune', 'adapter'].forEach(function(module) {
            commands.push(
              'dox < node_modules/fortune/lib/' + module +
              '.js > src/data/' + module + '.json'
            );
          });
          return commands.join(' && ');
        }
      }
    },

    copy: {
      package: {
        files: [{
          src: 'node_modules/fortune/package.json',
          dest: 'src/data/package.json'
        }]
      },
      content: {
        files: [{
          expand: true,
          cwd: 'src/content/',
          src: ['**/*.html'],
          dest: './'
        }]
      },
      icons: {
        files: [
          {
            expand: true,
            cwd: 'bower_components/font-awesome/',
            src: ['css/*.min.css', 'fonts/*'],
            dest: 'dist/'
          }
        ]
      }
    },

    bower: {
      install: {
        options: {
          copy: false
        }
      }
    },

    clean: {
      content: [
        'src/content/**/*.html'
      ]
    },

    assemble: {
      options: {
        assets: 'src/content/dist',
        helpers: 'src/helpers/*.js',
        layout: 'main.hbs',
        layoutdir: 'src/templates/layouts',
        partials: ['src/templates/partials/**/*.hbs'],
        data: ['src/data/**/*.json'],
        marked: {
          sanitize: false,
          gfm: true,
          breaks: true
        }
      },
      content: {
        src: ['src/content/**/*.hbs'],
        dest: './'
      }
    },

    prettify: {
      options: {
        condense: true,
        brace_style: 'collapse'
      },
      html: {
        expand: true,
        cwd: 'src/content/',
        src: ['**/*.html'],
        dest: 'src/content/'
      }
    },

    watch: {
      scripts: {
        files: ['src/scripts/**/*.js'],
        tasks: ['concat', 'uglify']
      },
      stylesheets: {
        files: ['src/style/**/*.less'],
        tasks: ['less']
      },
      templates: {
        files: ['src/**/*.hbs'],
        tasks: ['assemble', 'prettify', 'copy:content', 'clean']
      }
    },

    connect: {
      server: {
        options: {
          port: 4000
        }
      }
    }

  });

  var tasks = [
    'assemble',
    'grunt-exec',
    'grunt-prettify',
    'grunt-bower-task',
    'grunt-contrib-concat',
    'grunt-contrib-less',
    'grunt-contrib-uglify',
    'grunt-contrib-connect',
    'grunt-contrib-copy',
    'grunt-contrib-clean',
    'grunt-contrib-watch'
  ];

  tasks.forEach(function(task) {
    grunt.loadNpmTasks(task);
  });

  grunt.registerTask('default', [
    'bower',
    'concat',
    'uglify',
    'less',
    'exec',
    'copy:package',
    'assemble',
    'prettify',
    'copy:content',
    'copy:icons',
    'clean',
    'connect',
    'watch'
  ]);

};
