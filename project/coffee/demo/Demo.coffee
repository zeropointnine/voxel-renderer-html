define (require) ->

	"use strict"

	$ = require 'jquery'
	THREE = require 'three'
	Util3 = require 'voxel/Util3'
	BaseRenderer = require 'voxel/renderers/BaseRenderer'
	ThreeRenderer = require 'voxel/renderers/ThreeRenderer'
	IsometricRenderer = require 'voxel/renderers/IsometricRenderer'
	Shared = require 'demo/Shared'
	Model = require 'demo/Model'
	Controller = require 'demo/Controller'


	class Demo

		# public so visible to debugger via window.app
		scene: undefined
		model: undefined
		controller: undefined
		canvas3d: undefined
		canvasIso: undefined
		renderer3d: undefined
		rendererIsometric: undefined
		selectedRenderer: undefined

		targetFrameRate: 30
		flagShowRenderer3d: false
		flagShowRendererIsometric: false
		paused: false
		oneFrameFlag: false


		constructor: ->

			useIso = (window.location.href.indexOf 'isometric') isnt -1

			if not Util3.supportsWebGl()
				allow = no
				if allow
					alert('WebGL is not supported in this browser. Falling back to canvas renderer...')
				else
					$('#nowebgl').html('WebGL not supported in this browser.<br>Use of canvas renderer as a fallback is possible, but... let\'s not :/')
					$('#nowebgl').show()
				return

			Shared.init()

			@canvas3d = $('#canvas3d')[0]
			@canvasIso = $('#canvasIso')[0]

			@scene = new THREE.Scene()
			@model = new Model @scene
			@controller = new Controller @model

			BaseRenderer.SHOW_CORNER_BOUNDS = no
			@renderer3d = new ThreeRenderer @canvas3d, @controller.selectedScene, Shared.VOXELS_MAX_X, Shared.VOXELS_MAX_Y, Shared.VOXELS_MAX_Z
			@rendererIsometric = new IsometricRenderer @canvasIso, @controller.selectedScene, Shared.VOXELS_MAX_X, Shared.VOXELS_MAX_Y, Shared.VOXELS_MAX_Z

			if useIso
				@selectRenderer @rendererIsometric
			else
				@selectRenderer @renderer3d

			# Not bothering to wait for image assets to load, whatevr
			# Shared.eventBus.on 'model-ready', @init2

			$('#threeD').click( =>
				@selectRenderer @renderer3d
			)

			$('#isometric').click( =>
				@selectRenderer @rendererIsometric
			)

			Shared.eventBus.on('select-next-renderer', =>
				ren = if @selectedRenderer is @renderer3d then @rendererIsometric else @renderer3d
				@selectRenderer ren
			)

			Shared.eventBus.on('selectedscene-changed', =>
				@selectedRenderer.setVoxelScene @controller.selectedScene
			)

			Shared.eventBus.on('toggle-pause', =>
				@paused = ! @paused
				BaseRenderer.SHOW_CORNER_BOUNDS = @paused
			)

			Shared.eventBus.on('one-frame', =>
				@paused = yes
				@oneFrameFlag = yes
				BaseRenderer.SHOW_CORNER_BOUNDS = yes
			)

			$(window).resize( =>
				@selectedRenderer.setSize window.innerWidth , window.innerHeight
			)

			$('#ui').show()

			@loop()


		selectRenderer: (renderer) ->

			@selectedRenderer = renderer
			@selectedRenderer.setVoxelScene @controller.selectedScene
			@selectedRenderer.setSize window.innerWidth , window.innerHeight

			if @selectedRenderer is @renderer3d
				@flagShowRenderer3d = yes
				@flagShowRendererIsometric = no
				$('#isometric').removeClass('selected')
				$('#threeD').addClass('selected')
			else
				@flagShowRendererIsometric = yes
				@flagShowRenderer3d = no
				$('#threeD').removeClass('selected')
				$('#isometric').addClass('selected')


		loop: =>

			setTimeout( =>
				requestAnimationFrame @loop, null
			Math.floor 1000 / @targetFrameRate);

			if not @paused
				@controller.update()
			else
				if @oneFrameFlag
					@oneFrameFlag = no
					@controller.update()

			@selectedRenderer.render()


			# show-renderer-flag used to ensure updated frame is drawn before showing its canvas
			if @flagShowRenderer3d
				@flagShowRenderer3d = @flagShowRendererIsometric = no
				$('#canvasIso').hide()
				$('#canvas3d').show()
			else if @flagShowRendererIsometric
				@flagShowRenderer3d = @flagShowRendererIsometric = no
				$('#canvas3d').hide()
				$('#canvasIso').show()


	return Demo
