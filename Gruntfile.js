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
        separator: ';'
      },
      dist: {
        src: ['scripts/**/*.js'],
        dest: 'dist/core.bundle.js'
      }
    },

    less: {
      dist: {
        options: {
          yuicompress: true
        },
        files: {
          'dist/base.css': ['style/base.less']
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
          if(grunt.file.isDir('fortune')) {
            commands.push('cd fortune', 'git pull origin master', 'cd ..');
          } else {
            commands.push('git clone https://github.com/daliwali/fortune.git');
          }
          ['fortune', 'adapter'].forEach(function(module) {
            commands.push(
              'dox < fortune/lib/' + module + '.js > docs/' + module + '.json'
            );
          });
          return commands.join(' && ');
        }
      }
    },

    assemble: {
      options: {
        assets: 'dist',
        helpers: 'helpers/*.js',
        layout: 'main.hbs',
        layoutdir: 'templates/layouts',
        partials: ['templates/partials/**/*.hbs'],
        data: ['docs/**/*.json'],
        marked: {
          sanitize: false,
          gfm: true,
          breaks: true
        }
      },
      home: {
        src: ['templates/index.hbs'],
        dest: 'index.html'
      },
      docs: {
        src: ['templates/docs.hbs'],
        dest: 'docs/index.html'
      },
      guide: {
        src: ['templates/guide.hbs'],
        dest: 'guide/index.html'
      },
      404: {
        src: ['templates/404.hbs'],
        dest: '404.html'
      }
    },

    watch: {
      scripts: {
        files: ['scripts/**/*.js'],
        tasks: ['concat', 'uglify']
      },
      stylesheets: {
        files: ['style/**/*.less'],
        tasks: 'less'
      },
      source: {
        files: [ 'fortune/lib/**/*.js' ],
        tasks: ['exec', 'assemble']
      },
      template: {
        files: ['**/*.hbs'],
        tasks: 'assemble'
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

  [
    'assemble',
    'grunt-exec',
    'grunt-contrib-concat',
    'grunt-contrib-less',
    'grunt-contrib-uglify',
    'grunt-contrib-connect',
    'grunt-contrib-watch'
  ]
  .forEach(function(task) {
    grunt.loadNpmTasks(task);
  });

  grunt.registerTask('default', [
    'concat',
    'uglify',
    'less',
    'exec',
    'assemble',
    'connect',
    'watch'
  ]);

};
