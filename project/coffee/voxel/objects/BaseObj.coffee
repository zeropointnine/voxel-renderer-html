###
BaseObj

    Base class for voxel objects.
    Can be used as empty container object.

    Extends Object3D, but is not part of the three.js scene graph proper.

    Position and visibility properties are always supported.
    Rotation and scale are applied to any children.
    Rotation and scale of local contents _can_ be supported based on implementation (see subclasses of TransObj)

    Has a color property, which subclass may or may not make meaningful
###

define (require) ->

	"use strict"

	THREE = require 'three'
	Util3 = require 'voxel/Util3'
	Shared = require 'demo/Shared'


	class BaseObj extends THREE.Object3D

		_extents: undefined
		_extentsHalf: undefined
		_color: undefined
		_colorAlt: undefined


		constructor: (position, color) ->

			super()

			position = position || new THREE.Vector3()
			@position.x = position.x
			@position.y = position.y
			@position.z = position.z

			@setColor color or 0x0

			@_extents = new THREE.Vector3
			@_extentsHalf = new THREE.Vector3()


		###
		public
        Some subclasses may not use this value fyi
		###
		getColor: ->

			return @_color


		###
        public
        ###
		setColor: (value) ->

			@_color = value

			c = new THREE.Color value
			c2 = new THREE.Color( c.r / 2, c.g / 2, c.b / 2 );
			@_colorAlt = c2.getHex()

			# TODO: renderer should rly be the one to determine 'alternate color' but that's ok


		###
        package private
        Should be and overridden and super'ed
		###
		render: (setVoxel) ->


		###
		protected
		The volume which will be iterated thru by render()
		###
		getExtents: ->

			return @_extents


		setExtents: (v) ->

			@_extents = v
			@_extentsHalf.x = @_extents.x / 2
			@_extentsHalf.y = @_extents.y / 2
			@_extentsHalf.z = @_extents.z / 2


		###
		protected
		Return colors for a point which should already assumed to be inside
		@param x, y, z - floating point
		@returns {array} - returns main color and 'alternate color'
        ###
		getColorsAt: (x,y,z) ->

			return [@_color, @_colorAlt]


		###
        protected
        Subclass should override
        Should return true if given local coordinates are inside of object
		@param x,y,z - coordinates in *local space*; doesn't have to be ints
		###
		contains: (x,y,z) ->

			return false


	return BaseObj
