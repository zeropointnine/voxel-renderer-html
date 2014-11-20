###
Shared
    Constants, etc.
    Static class
###

define (require) ->

	"use strict"

	$ = require 'jquery'


	class Shared

		@VOXELS_MAX_X = 70
		@VOXELS_MAX_Y = 70
		@VOXELS_MAX_Z = 70

		@eventBus = undefined

		@init = ->
			# low-rent eventbus
			el = $('<div id="eventbus" style="display:none;"></div>')
			$('body').append(el)
			Shared.eventBus = el
			return

	return Shared
