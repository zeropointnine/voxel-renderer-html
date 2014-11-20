###
FastBox

	Box with no content scaling or rotation support
    Fills in _all_ voxels within the box's volume !
    TODO: Version that only draws box's 'surface'
###

define (require) ->

	"use strict"

	FastObj = require 'voxel/objects/FastObj'


	class FastBox extends FastObj

		###
        When true, renders all voxels within sphere's volume, not just its outer 'surface'
		###
		isSolid: false


		constructor: (position, color, dimensions) ->

			super position, color

			if not dimensions?
				throw new Error 'Need dimensions'

			@setDimensions dimensions


		###
        Dimensions of box
        ###
		getDimensions: ->

			# note how this is just an alias for _extents
			return @_extents;


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

			if Math.abs(x) > @_extentsHalf.x - 1
				return true
			if Math.abs(y) > @_extentsHalf.y - 1
				return true
			if Math.abs(z) > @_extentsHalf.z - 1
				return true

			return false


	return FastBox
