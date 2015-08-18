module.exports = function(grunt) {

  /**
	 * Dynamically load npm tasks
	 */
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({

    // Import package manifest
    pkg: grunt.file.readJSON('package.json'),

    // Banner definitions
    meta: {
      banner: '/*\n' +
      ' *  <%= pkg.title || pkg.name %> - v<%= pkg.version %>\n' +
      ' *  <%= pkg.description %>\n' +
      ' *  <%= pkg.homepage %>\n' +
      ' *\n' +
      ' *  Made by <%= pkg.author.name %>\n' +
      ' *  Under <%= pkg.license %> License\n' +
      ' */\n',
    },

    // Concat definitions
    concat: {
      options: {
        banner: '<%= meta.banner %>',
      },
      dist: {
        src: ['src/js/threshold.js'],
        dest: 'dist/threshold.js',
      },
    },

    /**
		 * less
		 * LESS/CSS compilation
		 * https://github.com/sindresorhus/grunt-contrib-less
		 */
    less: {
      development: {
        options: {
          compress: false,
          cleancss: false,
          ieCompact: true,
          sourceMap: true,
          strictMath: true,
        },
        src: ['src/less/threshold.less'],
        dest: 'dist/threshold.css'
      },
      production: {
        options: {
          compress: true,
          cleancss: true,
          ieCompact: true,
          sourceMap: true,
          strictMath: true,
        },
        src: ['src/less/threshold.less'],
        dest: 'dist/threshold.min.css',
      },
      demo: {
        options: {
          compress: false,
          cleancss: false,
          ieCompact: true,
          sourceMap: true,
          strictMath: true,
        },
        src: ['src/less/demo.less'],
        dest: 'dist/demo.css',
      }
    },

    /**
		 * Autoprefixer
		 * Adds vendor prefixes if need automatcily
		 * https://github.com/nDmitry/grunt-autoprefixer
		 */
    autoprefixer: {
      options: {
        browsers: ['last 2 version', 'safari 6', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'],
      },
      development: {
        src: 'dist/threshold.css',
        dest: 'dist/threshold.css',
      },
      production: {
        src: 'dist/threshold.min.css',
        dest: 'dist/threshold.min.css',
      }
    },

    // Minify definitions
    uglify: {
      my_target: {
        src: ['dist/threshold.js'],
        dest: 'dist/threshold.min.js',
      },
      options: {
        banner: '<%= meta.banner %>',
      }
    },

    // watch for changes to source
    // Better than calling grunt a million times
    // (call 'grunt watch')
    watch: {
      files: ['src/**/*'],
      tasks: ['default'],
    },

  });

  grunt.registerTask('build', ['less:development', 'autoprefixer:development', 'less:production', 'autoprefixer:production', 'less:demo', 'concat', 'uglify']);
  grunt.registerTask('default', ['build']);

};
