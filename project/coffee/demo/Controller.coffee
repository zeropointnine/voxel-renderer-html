###
Controller

	Logic for controlling objects in the scene, etc.
    Should not be concerned with renderer details
###

define (require) ->

	"use strict"

	$ = require 'jquery'
	THREE = require 'three'
	Util3 = require 'voxel/Util3'
	Shared = require 'demo/Shared'


	class Controller

		selectedScene: undefined

		_model = undefined
		_count = 0
		_bitmapCount = 0

		_linkSceneSphere = $('#sceneSphere')
		_linkSceneRot = $('#sceneRot')
		_linkSceneBitmap = $('#sceneBitmap')
		_ui = $('#ui')


		constructor: (pModel) ->

			_model = pModel

			testing = no
			if testing
				@selectScene(_model.sceneTest)
			else
				@selectScene(_model.sceneSphere)

			$(document).keypress @onKeyPress

			#

			_linkSceneSphere.click( => @selectScene _model.sceneSphere )
			_linkSceneRot.click( => @selectScene _model.sceneRot )
			_linkSceneBitmap.click( => @selectScene _model.sceneBitmap )


		update: () ->

			switch @selectedScene

				when _model.sceneTest

					if _model.testTransBox?
						foo = 0

					if _model.testSphere?
						foo = 0
						# _model.testSphere.rotation.x += Util3.DEG * 8
						# _model.testSphere.rotation.y += Util3.DEG * 2

					if _model.testDisc?
						_model.testDisc.scale.x = 1  +  Math.abs(Math.sin(_count * Util3.DEG * 6) * 2.5 )
						_model.testDisc.rotation.x += Util3.DEG * 8
						_model.testDisc.rotation.y += Util3.DEG * 2

					if _model.testRect?
						_model.testRect.scale.x = 1  +  Math.abs(Math.sin(_count * Util3.DEG * 6) * 2.5 )
						_model.testRect.rotation.x += Util3.DEG * 8
						_model.testRect.rotation.y += Util3.DEG * 2


				when _model.sceneRot

					x = Shared.VOXELS_MAX_X / 2  + Shared.VOXELS_MAX_X * 0.1 * Math.sin( _count * 4 * Util3.DEG )
					_model.rotParentBox.position.x = x

					sca = 0.66 + Math.abs( Math.sin(_count * 3 * Util3.DEG) ) * 1.33
					_model.rotParentBox.scale.x = _model.rotParentBox.scale.y = _model.rotParentBox.scale.z = sca
					_model.rotParentBox.rotateOnAxis( new THREE.Vector3(0,0,1), Util3.DEG * -3 )

					_model.rotChildBox.rotateOnAxis( new THREE.Vector3(0,0,1), Util3.DEG * -6.5 )

					_model.rotRect1.rotateOnAxis( new THREE.Vector3(0,0,1), Util3.DEG * 30 )
					_model.rotRect2.rotateOnAxis( new THREE.Vector3(0,0,1), Util3.DEG * 30 )


				when _model.sceneSphere

					mult = Math.sin(_count * Util3.DEG * 3)
					mult = mult * mult
					radius = 1 + mult * 12
					_model.pulsingSphere.setRadius radius

					x = _model.pulsingSphere.position.x + 0.3;
					x = _model.pulsingSphere.getRadius() * -1 if x > Shared.VOXELS_MAX_X + _model.pulsingSphere.getRadius()
					_model.pulsingSphere.position.x = x


				when _model.sceneBitmap

					_model.bitmap.scaleX = _model.bitmap.scaleY = _model.bitmap.scaleZ = 3
					_model.bitmap.tick()

					if _bitmapCount % 60 < 18
						_model.bitmap.rotation.z -= Util3.DEG * 5

					if _bitmapCount % 180 >= 18 and _count % 180 < 18 + 18
						_model.bitmap.rotation.x -= Util3.DEG * 5

					_bitmapCount++

			_count++


		getModel: ->
			_model


		selectScene: (scene) ->

			@selectedScene = scene
			Shared.eventBus.trigger('selectedscene-changed')

			_linkSceneSphere.removeClass('selected')
			_linkSceneRot.removeClass('selected')
			_linkSceneBitmap.removeClass('selected')

			switch scene
				when _model.sceneSphere
					_linkSceneSphere.addClass('selected')
				when _model.sceneRot
					_linkSceneRot.addClass('selected')
				when _model.sceneBitmap
					_linkSceneBitmap.addClass('selected')


		onKeyPress: (je) =>

			# console.log je.originalEvent.keyCode

			switch je.originalEvent.keyCode

				when 114  # r

					Shared.eventBus.trigger('select-next-renderer')

				when 115  # s

					switch @selectedScene
						when _model.sceneSphere then    @selectScene _model.sceneRot
						when _model.sceneRot then       @selectScene _model.sceneBitmap
						when _model.sceneBitmap then    @selectScene _model.sceneSphere
						else                            @selectScene _model.sceneSphere

					Shared.eventBus.trigger('selectedscene-changed')

				when 32 # space

					Shared.eventBus.trigger('toggle-pause')

				when 13 # enter

					Shared.eventBus.trigger('one-frame')


	return Controller
