###
TransSphere

	Sphere with local scaling/rotation support ('ovoid')
###

define (require) ->

	"use strict"

	THREE = require 'three'
	TransObj = require 'voxel/objects/TransObj'


	class TransSphere extends TransObj

		###
        When true, all voxels within sphere's volume are drawn, not just its surface
		###
		isSolid: false

		_radius: null
		_radiusSquared: null
		_scaledUnitLength: null
		_localPointLengthSquared: null
		_scratch: new THREE.Vector3()


		constructor: (position, color, radius) ->

			throw new Error('Need radius') if not radius?

			super(position, color)

			@setRadius(radius)


		getRadius: ->
			return @_radius


		setRadius: (value) ->

			@_radius = value
			@_radiusSquared = @_radius * @_radius;

			@setExtents( new THREE.Vector3(@_radius*2, @_radius*2, @_radius*2) )


		render: (setVoxel) ->

			@_scaledUnitLength = null

			@updateMatrix()

			super(setVoxel)


		contains: (x,y,z) ->

			if @isSolid
				return @containsSolid(x,y,z)
			else
				return @containsSurface(x,y,z)


		containsSolid: (x,y,z) ->

			return (x*x + y*y + z*z) <= @_radiusSquared


		containsSurface: (x,y,z) ->

			rad = Math.sqrt(x*x + y*y + z*z)

			return false if rad > @_radius

			# TODO: this works out in that it leaves no holes, even with different combinations of assymetric scaling on self and parent
			# TODO: but draws more voxels than it should i'm pretty sure
			# TODO: the logic is really not right...

			if not @_scaledUnitLength?
				@_scaledUnitLength = @_scaledUnit.length()

			return rad > @_radius - @_scaledUnitLength

	return TransSphere
