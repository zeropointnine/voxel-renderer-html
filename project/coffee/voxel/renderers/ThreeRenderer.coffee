###
ThreeRenderer

    Renders voxel scene in 3D using THREE.js

    Naive implementation which uses a limited number of mesh objects attached to scene graph,
    which are moved and made visible as needed.
###

define (require) ->

	"use strict"

	THREE = require 'three'
	Util3 = require 'voxel/Util3'
	BaseRenderer = require 'voxel/renderers/BaseRenderer'


	class ThreeRenderer extends BaseRenderer

		# THREE.js objects and related values
		threeScene: undefined
		camera:  undefined
		threeRenderer: undefined
		ambientLight: undefined
		pointLight: undefined
		holder: undefined
		holderOffsetX = undefined
		holderOffsetY = undefined
		holderOffsetZ = undefined
		holderQuat: new THREE.Quaternion()
		holderEuler: new THREE.Euler(0, 0, 0, "XYZ")
		cubes = []  # has a static number of elements, initialized in advance

		numAdded = undefined

		# hash support related:
		hash = []  # key is a hash of an an 'encoded' x/y/z integer value
		hashMultX = undefined
		hashMultY = undefined
		hashMax = undefined

		# used to rotate camera
		mouseRatioX: 0
		mouseRatioY: 0


		constructor: (canvas, voxelScene, @maxX, @maxY, @maxZ, updateFunction=null) ->

			super(canvas, voxelScene, @maxX, @maxY, @maxZ, updateFunction)

			holderOffsetX = @maxX / -2
			holderOffsetY = @maxY / -2
			holderOffsetZ = @maxZ / -2

			# analogy: x as hour; y as minutes; z as seconds
			hashMultX = (@maxY+1) * (@maxZ+1)
			hashMultY = (@maxZ+1)
			hashMax = (@maxY+1) * (@maxZ+1) * (@maxX+1)

			@useHashedSetVoxelFunction(false)

			@init3d()
			@initCubes()

			@setSize 800, 600  # default

			$(@_canvas).mousemove @onCanvasMouseMove


		init3d: ->

			# init THREE.js objects

			if Util3.supportsWebGl()
				@threeRenderer = new THREE.WebGLRenderer( { canvas: @_canvas, antialias: true } )
			else
				@threeRenderer = new THREE.CanvasRenderer( { canvas: @_canvas, antialias: true } )

			@threeRenderer.setClearColor 0x202020, 1  # TODO: parameterize

			w = window.innerWidth
			h = window.innerHeight
			@camera = new THREE.PerspectiveCamera(37, w / h, 0.1, 1000)

			# TODO: is magic number; should rly be some linear relationship between fov and maxY
			# TODO: this logic is a little too implementation-specific for library; should parameterize or remove
			distance = (@maxZ * .5)  +  (@maxY * 1.5)

			@camera.position.set 0, 0, distance

			@threeScene = new THREE.Scene()

			@ambientLight = new THREE.AmbientLight(0xffffff)
			@threeScene.add @ambientLight

			fallOff = new THREE.Vector3(@maxX, @maxY, @maxZ).length() * 2
			@pointLight = new THREE.PointLight(0xffffff, 1, fallOff)
			@pointLight.position.set @camera.position.x, @camera.position.y, @camera.position.z
			@threeScene.add @pointLight

			@holder = new THREE.Object3D()
			@threeScene.add @holder


		initCubes: =>

			# TODO: test grouping cubes into sub-containers etc. re: performance
			# TODO: test other material types re: performance and look

			voxelSize = 0.95 # TODO: parameterize
			geometry = new THREE.BoxGeometry(voxelSize, voxelSize, voxelSize)

			cubes = []
			num = 10000  # TODO: parameterize this
			for i in [0...num]

				# material is _per cube
				material = new THREE.MeshPhongMaterial { ambient: 0x444444, color: 0xcccccc, shading: THREE.FlatShading, specular: 0xffffff, shininess: 2 }

				cubes[i] = new THREE.Mesh(geometry, material)

				@holder.add(cubes[i])


		###
        public
        Used to avoid placing more than one cube at the same point
        Incurs overhead but limits overdraw
		###
		useHashedSetVoxelFunction: (b) ->

			if b
				@_setVoxelFunction = @setVoxelHashed
			else
				@_setVoxelFunction = @setVoxelNoHash


		setSize: (width, height) ->

			@threeRenderer.setSize width, height
			@camera.aspect = width / height
			@camera.updateProjectionMatrix()


		renderStart: () ->

			super()

			numAdded = 0
			hash = []


		renderEnd: () ->

			super()

			# console.log 'numAdded', numAdded

			# hide rest of cubes
			for i in [numAdded...cubes.length]
				cubes[i].visible = false

			if numAdded >= cubes.length
				console.log 'warning - reached voxel limit', cubes.length

			@updateCamera()

			# concrete render using three.js done here
			@threeRenderer.render @threeScene, @camera


		setVoxelHashed: (x,y,z, color, color2) =>

			x = Math.round x
			y = Math.round y
			z = Math.round z

			if x < 0 or y < 0 or z < 0 or x > @maxX or y > @maxY or z > @maxZ
				return false

			if numAdded >= cubes.length
				return false

			# 'encode' the x/y/z coords into a single integer for the hasVoxel array; like a hash
			index = x * hashMultX  +  y * hashMultY  +  z

			# rem, to go in the other direction, you would do this:
			#	ux = Math.floor( i / multx )
			#	uy = Math.floor((i % multx) / multy)
			#	uz = i % multy

			if hash[index]
				return false
			hash[index] = true

			v = cubes[ numAdded++ ]
			v.visible = true
			v.position.set(x + holderOffsetX, y + holderOffsetY, z + holderOffsetZ)
			v.material.color.setHex color
			v.material.ambient.setHex = color2

			return true


		setVoxelNoHash: (x,y,z, color, color2) =>

			x = Math.round x
			y = Math.round y
			z = Math.round z

			if x < 0 or y < 0 or z < 0 or x > @maxX or y > @maxY or z > @maxZ
				return false

			if numAdded >= cubes.length
				return false

			v = cubes[ numAdded++ ]
			v.visible = true
			v.position.set(x + holderOffsetX, y + holderOffsetY, z + holderOffsetZ)
			v.material.color.setHex color

			v.material.ambient.setHex color2

			return true


		updateCamera : ->

			# TODO: this logic is a little too implementation-specific for library; should parameterize or remove

			# (or voxel holder, as the case may be)

			@holderEuler.y = @mouseRatioX * (-90 * Util3.DEG)
			@holderEuler.x = @mouseRatioY * (-90 * Util3.DEG)

			@holderQuat.setFromEuler @holderEuler

			@holder.rotation.setFromQuaternion @holderQuat


		onCanvasMouseMove: (je) =>

			# range: [-1, +1]
			@mouseRatioX = je.clientX / $(@_canvas).width()
			@mouseRatioX = @mouseRatioX * 2 - 1
			@mouseRatioY = je.clientY / $(@_canvas).height()
			@mouseRatioY = @mouseRatioY * 2 - 1

			# debug
			# @mouseRatioX = +0.15;
			# @mouseRatioY = +0.15;


	return ThreeRenderer
