###
Model

	A collection of view objects
###

define (require) ->

	"use strict"

	$ = require 'jquery'
	THREE = require 'three'
	Util3 = require 'voxel/Util3'
	BaseObj = require 'voxel/objects/BaseObj'
	TransObj = require 'voxel/objects/TransObj'
	Point = require 'voxel/objects/Point'
	FastSphere = require 'voxel/objects/FastSphere'
	TransSphere = require 'voxel/objects/TransSphere'
	TransDisc = require 'voxel/objects/TransDisc'
	TransBox = require 'voxel/objects/TransBox'
	TransRect = require 'voxel/objects/TransRect'
	FastBox = require 'voxel/objects/FastBox'
	TransBitmap = require 'voxel/objects/TransBitmap'
	Shared = require 'demo/Shared'


	class Model

		constructor: ->

			# Init Obj's, and init scene hierarchy
			# Sends event when object assets are loaded

			# [0] 'unit test' sandbox

			@sceneTest = new THREE.Scene()

			# holder with some 'irregular' values
			@testHolder = new BaseObj(new THREE.Vector3(Math.floor(Shared.VOXELS_MAX_X/2), Math.floor(Shared.VOXELS_MAX_Y/2), Math.floor(Shared.VOXELS_MAX_Z/2)))
#			@testHolder.scale.x = 2.3
#			@testHolder.scale.y = 1.5
#			@testHolder.scale.z = 1
			@testHolder.rotation.x = 15 * Util3.DEG
			@testHolder.rotation.z = 10 * Util3.DEG
			@sceneTest.add @testHolder

			if no
				@testTransBox = new TransBox(new THREE.Vector3(1,2,3), 0xaaaa00, new THREE.Vector3(5,6,7))
				@testTransBox.isSolid = no
				@testTransBox.rotation.y = 30 * Util3.DEG
				@testTransBox.scale.x = 2.5
				@testTransBox.scale.y = 1.3
				@testTransBox.scale.z = 3
				@testHolder.add @testTransBox

			if no
				@testSphere = new TransSphere( new THREE.Vector3(1,2,3), 0xff8888, 8)
				@testSphere.scale.y = 1.5
				@testSphere.scale.x = .38
				@testSphere.isSolid = no
				@testHolder.add @testSphere

			if no
				@testDisc = new TransDisc(new THREE.Vector3(5,2,1), 0x00ffff, 5)
				@testDisc.scale.z = 2.2
				@testHolder.add @testDisc

			if yes
				@testRect = new TransRect(new THREE.Vector3(2,2,1), 0xffff00, new THREE.Vector2(5,10))
				@testRect.rotation.z = 45 * Util3.DEG
				@testRect.rotation.x = 45 * Util3.DEG
				@testRect.scale.y = 1.5
				@testRect.scale.x = 2.2
				@testHolder.add @testRect


			# [1] pulsing sphere scene

			@sceneSphere = new THREE.Scene()

			@pulsingSphere = new FastSphere( new THREE.Vector3(15, Shared.VOXELS_MAX_Y * .5, Shared.VOXELS_MAX_Z * .5), 0xaa0000, 15 )
			@sceneSphere.add @pulsingSphere


			# [2] compose scene of rotating objects

			@sceneRot = new THREE.Scene()

			pos = new THREE.Vector3(Math.floor(Shared.VOXELS_MAX_X * 0.5), Math.floor(Shared.VOXELS_MAX_Y * .5), Math.floor(Shared.VOXELS_MAX_Z * 0.5))
			@rotParentBox = new TransBox(pos, 0x00aa00, new THREE.Vector3(6,6,6))
			@rotParentBox.isSolid = no
			@sceneRot.add @rotParentBox

			pos = new THREE.Vector3 Math.floor(Shared.VOXELS_MAX_X * 0.15), 0, 0
			@rotChildBox = new TransBox pos, 0x4400aa, new THREE.Vector3(2.5,2.5,2.5)
			@rotParentBox.add @rotChildBox

			pos = new THREE.Vector3 Shared.VOXELS_MAX_X * 0.06, 0, 0
			@rotRect1 = new TransRect pos, 0xff8800, new THREE.Vector3(3,5)
			@rotRect1.rotation.y = Util3.DEG * 90
			@rotChildBox.add @rotRect1

			pos = new THREE.Vector3 Shared.VOXELS_MAX_X * -0.06, 0, 0
			@rotRect2 = new TransRect pos, 0xff8800, new THREE.Vector3(3,5)
			@rotRect2.rotation.y = Util3.DEG * 90
			@rotChildBox.add @rotRect2

			# [3] bitmap sequence scene

			@sceneBitmap = new THREE.Scene()

			pos = new THREE.Vector3(Math.floor(Shared.VOXELS_MAX_X * .5), Math.floor(Shared.VOXELS_MAX_Y * .5), Math.floor(Shared.VOXELS_MAX_Z * .5))
			@bitmap = new TransBitmap pos
			@sceneBitmap.add @bitmap
			@bitmap.autoAdvanceImage = no

			# make image list, and load
			paths = []
			for i in [0..24]
				sub = if i < 10 then ('0' + i) else i
				s = 'img/karanokyoukai2_' + sub + '.png'
				paths.push s
			@bitmap.loadImageDatas(paths, => Shared.eventBus.trigger('model-ready') )


	return Model
