module.exports = (grunt) ->

	grunt.initConfig

		# variables
		pkg:
			grunt.file.readJSON("package.json")
		projDir:
			'./project'
		outDir:
			'./out'

		clean:
			main: ['<%= outDir %>']

		coffee:
			dev:
				files: [
					expand: true
					ext: '.js'
					cwd: "<%= projDir %>/coffee"
					src: ['**/*.coffee']
					dest: '<%= outDir %>/js'
				]
				options:
					sourceMap: true
					bare: true
			dist:
				files: [
					expand: true
					ext: '.js'
					cwd: "<%= projDir %>/coffee"
					src: ['**/*.coffee']
					dest: '<%= outDir %>/js'
				]
				options:
					sourceMap: true  # NB
					bare: true

		requirejs:
			compile:
				options:
					baseUrl: '<%= outDir %>/js/'
					mainConfigFile: '<%= outDir %>/js/boot.js'
					name: 'boot'
					optimize: 'none'
					include: ['lib/almond-0.3.0']
					out: "<%= outDir %>/js/boot-built.js"

		sync:
			main:
				files: [
					cwd:'<%= projDir %>/assets'
					src: ['**']
					dest: '<%= outDir %>'
				]
				verbose: true

		watch:
			coffee:
				files: ['<%= projDir %>/coffee/**/*.coffee']
				tasks: ['newer:coffee:dev']  # , 'notify:watch_coffee']
			sync:
				files: ['<%= projDir %>/assets/**/*']
				tasks: ['sync', 'notify:watch_sync']

		notify:
			watch_coffee:
				options:
					title: 'CoffeeScript'
					message: 'Updated'
			watch_requirejs:
				options:
					title: 'Require.js'
					message: 'Concatenated'
			watch_sync:
				options:
					title: 'Files'
					message: 'Updated'


	grunt.loadNpmTasks 'grunt-contrib-clean'
	grunt.loadNpmTasks "grunt-contrib-coffee"
	grunt.loadNpmTasks "grunt-contrib-requirejs"
	grunt.loadNpmTasks 'grunt-contrib-watch'
	grunt.loadNpmTasks "grunt-newer"
	grunt.loadNpmTasks 'grunt-notify'
	grunt.loadNpmTasks "grunt-sync"

	grunt.registerTask "default", ["clean", "coffee:dev", "sync", "watch"]  # watch > sync is not fully working?...
	grunt.registerTask "dist", ["clean", "coffee:dist", "sync", "requirejs"]
