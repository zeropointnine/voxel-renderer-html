###
TransRect

    A rectangle on the X/Y axis, which is always 1-voxel thick regardless of scale
###

define (require) ->

	"use strict"

	THREE = require 'three'
	Util3 = require 'voxel/Util3'
	TransObj = require 'voxel/objects/TransObj'


	class TransRect extends TransObj

		_dimensions: new THREE.Vector2


		###
		@param {THREE.Vector2} dimensions
        ###
		constructor: (position, color, dimensions) ->

			throw new Error('Need dimensions') if not dimensions?

			super(position, color)

			@setDimensions(dimensions)


		###
        @returns {THREE.Vector2} dimensions of rectangle
        ###
		getDimensions: ->

			return @_dimensions;

		###
        Dimensions of rectangle
        @param {THREE.Vector2}
        ###
		setDimensions: (dimensions) ->

			@_dimensions.set dimensions.x, dimensions.y
			@setExtents new THREE.Vector3 @_dimensions.x, @_dimensions.y, 0


		contains: (x,y,z) ->

			# TODO: bug - leaves holes when parent has assymetric scale values!

			if z >= 0 and z < @_scaledUnit.z
				if Math.abs(x) <= @_extentsHalf.x
					if Math.abs(y) <= @_extentsHalf.y
						return true
			return false


	return TransRect
