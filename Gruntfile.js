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
        src: ['src/scripts/**/*.js'],
        dest: 'dist/core.bundle.js'
      }
    },

    less: {
      dist: {
        options: {
          yuicompress: true
        },
        files: {
          'dist/base.css': ['src/style/base.less']
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
              'dox < fortune/lib/' + module + '.js > src/data/' + module + '.json'
            );
          });
          return commands.join(' && ');
        }
      }
    },

    copy: {
      content: {
        files: [{
          expand: true,
          cwd: 'src/content/',
          src: ['**/*.html'],
          dest: './'
        }]
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

    watch: {
      scripts: {
        files: ['src/scripts/**/*.js'],
        tasks: ['concat', 'uglify']
      },
      stylesheets: {
        files: ['src/style/**/*.less'],
        tasks: ['less']
      },
      source: {
        files: [ 'fortune/lib/**/*.js' ],
        tasks: ['exec', 'assemble', 'copy', 'clean']
      },
      templates: {
        files: ['src/**/*.hbs'],
        tasks: ['assemble', 'copy', 'clean']
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
    'concat',
    'uglify',
    'less',
    'exec',
    'assemble',
    'copy',
    'clean',
    'connect',
    'watch'
  ]);

};
