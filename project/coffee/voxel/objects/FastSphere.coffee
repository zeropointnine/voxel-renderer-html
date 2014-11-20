###
FastSphere

   	Sphere with no local scaling/rotation support
###

define (require) ->

	"use strict"

	THREE = require 'three'
	FastObj = require 'voxel/objects/FastObj'


	class FastSphere extends FastObj

		###
        When true, renders all voxels within sphere's volume, not just its outer 'surface'
		###
		isSolid: false

		_radius: null
		_radiusSquared: null
		_radiusMinus1Squared: null
		_scratch: new THREE.Vector3


		constructor: (position, color, radius) ->

			throw new Error('Need radius') if not radius?

			super(position, color)

			@setRadius(radius)


		getRadius: ->
			return @_radius


		setRadius: (value) ->

			@_radius = value
			@_radiusSquared = @_radius * @_radius;
			@_radiusMinus1Squared = (@_radius - 1) * (@_radius - 1);

			@setExtents( new THREE.Vector3(@_radius*2, @_radius*2, @_radius*2) )


		contains: (x,y,z) ->

			distanceSquared = x*x + y*y + z*z

			if @isSolid
				return distanceSquared <= @_radiusSquared
			else
				return distanceSquared <= @_radiusSquared and distanceSquared > @_radiusMinus1Squared


	return FastSphere
