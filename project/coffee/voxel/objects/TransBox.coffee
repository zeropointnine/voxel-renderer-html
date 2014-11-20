###
TransBox
    Box with support for scaling and rotation
###

define (require) ->

	"use strict"

	THREE = require 'three'
	Util3 = require 'voxel/Util3'
	TransObj = require 'voxel/objects/TransObj'


	class TransBox extends TransObj

		constructor: (position, color, dimensions) ->

			super position, color

			if not dimensions?
				throw new Error 'Need dimensions'

			@setExtents dimensions


		###
        @returns {THREE.Vector3} dimensions of box
        ###
		getDimensions: ->

			# note how this is just an alias for _extents
			return @_extents;


		###
        Dimensions of box
        @param {THREE.Vector3}
        ###
		setDimensions: (dimensions) ->

			@setExtents dimensions


		contains: (x,y,z) ->

			if @isSolid
				return @containsSolid(x,y,z)
			else
				return @containsSurface(x,y,z)


		containsSolid: (x,y,z) ->

			if Math.abs(x) <= @_extentsHalf.x
				if Math.abs(y) <= @_extentsHalf.y
					if Math.abs(z) <= @_extentsHalf.z
						return true
			return false


		containsSurface: (x,y,z) ->

			return false if not @containsSolid(x,y,z)

			if Math.abs(x) > @_extentsHalf.x - @_scaledUnit.x
				return true
			if Math.abs(y) > @_extentsHalf.y - @_scaledUnit.y
				return true
			if Math.abs(z) > @_extentsHalf.z - @_scaledUnit.z
				return true

			return false


	return TransBox
