###
TransDisc

    A disc on the X/Y axis, which is always 1-voxel thick regardless of z scale
###

define (require) ->

	"use strict"

	THREE = require 'three'
	Util3 = require 'voxel/Util3'
	TransObj = require 'voxel/objects/TransObj'


	class TransDisc extends TransObj

		_radius: null


		constructor: (position, color, radius) ->

			throw new Error('Need radius') if not radius?

			super(position, color)

			@_invScale = new THREE.Vector3(1,1,1)

			@setRadius(radius)


		getRadius: ->

			return @_radius


		setRadius: (value) ->

			@_radius = value
			@_radiusSquared = @_radius * @_radius;

			@setExtents( new THREE.Vector3(@_radius*2, @_radius*2, 1) )


		contains: (x,y,z) ->

			# TODO: bug - leaves holes when parent has assymetric scale values!

			if z >= 0 and z < @_scaledUnit.z
				distance = Math.sqrt( x*x + y*y + z*z )
				return distance <= @_radius
			else
				return false


	return TransDisc
