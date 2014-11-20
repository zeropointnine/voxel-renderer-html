###
BaseRenderer
    Not meant to be used directly
###

define (require) ->

#	"use strict"

	$ = require 'jquery'
	THREE = require 'three'
	Util3 = require 'voxel/Util3'
	Point = require 'voxel/objects/Point'


	class BaseRenderer

		# Draws voxels at corners of voxel bounds and center for debugging purposes
		@SHOW_CORNER_BOUNDS: no

		maxX: undefined
		maxY: undefined
		maxZ: undefined

		_canvas: undefined
		_voxelScene: undefined
		_updateFunction: undefined

		_debugPoints: undefined
		_isLooping: undefined
		_frameCount: 0
		_timeStampFps: Date.now()
		_debugEl: $('#debug');  # TODO paramaterize

		_setVoxelFunction: undefined


		###
        canvas - Canvas DOM element to render to
        voxelScene - The three.js Scene composed of voxel objects to be drawn
        updateFunction - optional function to be called before each render
        maxX/Y/Z - defines the volume within which voxels can be drawn (everything outside those bounds will be clipped)
        ###
		constructor: (canvas, voxelScene, @maxX, @maxY, @maxZ, updateFunction=null) ->

			throw new Error("Need canvas") unless canvas?
			throw new Error("Need voxel scene") unless voxelScene?

			@_canvas = canvas
			@_voxelScene = voxelScene
			@_updateFunction = updateFunction

			@maxX = Math.floor @maxX
			@maxY = Math.floor @maxY
			@maxZ = Math.floor @maxZ

			@initDebugPoints()

			@_setVoxelFunction = @setVoxel


		#########################################
		# 'PUBLIC'
		#########################################

		# Concrete class should override
		setSize: (width, height) ->


		setVoxelScene: (scene) ->
			@_voxelScene = scene


		# Can be used to let Renderer automatically manage drawing on an interval
		start: =>
			@_isLooping = true
			@render()

		stop: ->
			@_isLooping = false


		# Can be called manually as desired, or skip this and just using start() and stop()
		render: () =>

			# print debug info
			@_frameCount++
			if @_debugEl.length > 0 and @_frameCount % 60 is 1
				was = @_timeStampFps
				@_timeStampFps = Date.now()
				msp60f = @_timeStampFps - was
				mspf = msp60f / 60
				fpms = 1 / mspf
				fps = fpms * 1000
				elapsed = @_timeStampFps - was
				s = elapsed + 'ms' + ' (' + Math.round(fps) + 'fps)'
				@_debugEl.text s

			# schedule next call before doing the heavy lifting
			if @_isLooping
				setTimeout(=>
					requestAnimationFrame( @render, null )
				33);  # TODO parameterize

			# call update function if applicable
			if @_updateFunction? and @_isLooping
				@_updateFunction()

			# actually render scene
			@renderVoxelScene()


		getMaxX: ->
			@maxX

		getMaxY: ->
			@maxY

		getMaxZ: ->
			@maxZ


		#########################################
		# 'PROTECTED'
		#########################################

		# Concrete class should do any preparation for drawing the scene here
		renderStart: () ->


		# Concrete class should do any finalization after scene has been drawn here
		renderEnd: () ->


		#########################################
		# 'PRIVATE'
		#########################################

		renderVoxelScene: () ->

			@_voxelScene.updateMatrixWorld()

			@renderStart()

			if BaseRenderer.SHOW_CORNER_BOUNDS
				for point, i in @_debugPoints
					point.render @_setVoxelFunction

			for child, i in @_voxelScene.children
				@renderObj child

			@renderEnd()


		# recursive
		renderObj: (obj) ->

			return if not obj.visible

			obj.render @_setVoxelFunction

			for child, i in obj.children
				@renderObj child

		initDebugPoints: () ->

			@_debugPoints = []
			col = 0x404040

			@_debugPoints.push new Point(new THREE.Vector3(0, 0, 0), col)
			@_debugPoints.push new Point(new THREE.Vector3(1, 0, 0), col)
			@_debugPoints.push new Point(new THREE.Vector3(0, 1, 0), col)
			@_debugPoints.push new Point(new THREE.Vector3(0, 0, 1), col)

			@_debugPoints.push new Point(new THREE.Vector3(@maxX, 0, 0), col)
			@_debugPoints.push new Point(new THREE.Vector3(@maxX, 1, 0), col)
			@_debugPoints.push new Point(new THREE.Vector3(@maxX, 0, 1), col)
			@_debugPoints.push new Point(new THREE.Vector3(@maxX-1, 0, 0), col)

			@_debugPoints.push new Point(new THREE.Vector3(0, @maxY, 0), col)
			@_debugPoints.push new Point(new THREE.Vector3(0, @maxY, 1), col)
			@_debugPoints.push new Point(new THREE.Vector3(1, @maxY, 0), col)
			@_debugPoints.push new Point(new THREE.Vector3(0, @maxY-1, 0), col)

			@_debugPoints.push new Point(new THREE.Vector3(@maxX, @maxY, 0), col)
			@_debugPoints.push new Point(new THREE.Vector3(@maxX-1, @maxY, 0), col)
			@_debugPoints.push new Point(new THREE.Vector3(@maxX, @maxY-1, 0), col)
			@_debugPoints.push new Point(new THREE.Vector3(@maxX, @maxY, 1), col)

			@_debugPoints.push new Point(new THREE.Vector3(0, 0, @maxZ), col)
			@_debugPoints.push new Point(new THREE.Vector3(1, 0, @maxZ), col)
			@_debugPoints.push new Point(new THREE.Vector3(0, 1, @maxZ), col)
			@_debugPoints.push new Point(new THREE.Vector3(0, 0, @maxZ-1), col)

			@_debugPoints.push new Point(new THREE.Vector3(@maxX, 0, @maxZ), col)
			@_debugPoints.push new Point(new THREE.Vector3(@maxX, 1, @maxZ), col)
			@_debugPoints.push new Point(new THREE.Vector3(@maxX-1, 0, @maxZ), col)
			@_debugPoints.push new Point(new THREE.Vector3(@maxX, 0, @maxZ-1), col)

			@_debugPoints.push new Point(new THREE.Vector3(0, @maxY, @maxZ), col)
			@_debugPoints.push new Point(new THREE.Vector3(1, @maxY, @maxZ), col)
			@_debugPoints.push new Point(new THREE.Vector3(0, @maxY-1, @maxZ), col)
			@_debugPoints.push new Point(new THREE.Vector3(0, @maxY, @maxZ-1), col)

			@_debugPoints.push new Point(new THREE.Vector3(@maxX, @maxY, @maxZ), col)
			@_debugPoints.push new Point(new THREE.Vector3(@maxX-1, @maxY, @maxZ), col)
			@_debugPoints.push new Point(new THREE.Vector3(@maxX, @maxY-1, @maxZ), col)
			@_debugPoints.push new Point(new THREE.Vector3(@maxX, @maxY, @maxZ-1), col)

			c = new THREE.Vector3( @maxX/2, @maxY/2, @maxZ/2 )
			@_debugPoints.push new Point(new THREE.Vector3(c.x,c.y,c.z), col)
			@_debugPoints.push new Point(new THREE.Vector3(c.x+1,c.y,c.z), col)
			@_debugPoints.push new Point(new THREE.Vector3(c.x-1,c.y,c.z), col)
			@_debugPoints.push new Point(new THREE.Vector3(c.x,c.y+1,c.z), col)
			@_debugPoints.push new Point(new THREE.Vector3(c.x,c.y-1,c.z), col)
			@_debugPoints.push new Point(new THREE.Vector3(c.x,c.y,c.z+1), col)
			@_debugPoints.push new Point(new THREE.Vector3(c.x,c.y,c.z-1), col)


	return BaseRenderer
