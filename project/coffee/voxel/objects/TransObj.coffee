###
TransObj

    Subclass of BaseObj that supports rotation and scale of its own contents
	Think 'transformable object'
    Subclasses should override contains()
###

define (require) ->

	"use strict"

	THREE = require 'three'
	Util3 = require 'voxel/Util3'
	BaseObj = require 'voxel/objects/BaseObj'


	class TransObj extends BaseObj

		###
        For subclasses that support it, when false, only renders the 'surface' of the object
        rather than filling in entire its entire volume (which can be costly at draw time)
        ###
		isSolid: no

		_inverseWorld: new THREE.Matrix4
		_scaleWorld: new THREE.Vector3
		_scaledUnit: new THREE.Vector3


		constructor: (position, color) ->

			super(position, color)


		render: (setVoxel) ->

			@updateMatrix()  # TODO only if dirty?

			if not @isSolid
				Util3.putScaleFromMatrix(@matrixWorld, @_scaleWorld)
				@_scaledUnit.set(1/@_scaleWorld.x, 1/@_scaleWorld.y, 1/@_scaleWorld.z)

			# make local bounding box points, and trans
			pts = []
			pts.push new THREE.Vector3 -@_extentsHalf.x, -@_extentsHalf.y, -@_extentsHalf.z
			pts.push new THREE.Vector3 -@_extentsHalf.x, +@_extentsHalf.y, -@_extentsHalf.z
			pts.push new THREE.Vector3 +@_extentsHalf.x, -@_extentsHalf.y, -@_extentsHalf.z
			pts.push new THREE.Vector3 +@_extentsHalf.x, +@_extentsHalf.y, -@_extentsHalf.z
			pts.push new THREE.Vector3 -@_extentsHalf.x, -@_extentsHalf.y, +@_extentsHalf.z
			pts.push new THREE.Vector3 -@_extentsHalf.x, +@_extentsHalf.y, +@_extentsHalf.z
			pts.push new THREE.Vector3 +@_extentsHalf.x, -@_extentsHalf.y, +@_extentsHalf.z
			pts.push new THREE.Vector3 +@_extentsHalf.x, +@_extentsHalf.y, +@_extentsHalf.z


			lb = new THREE.Vector3 Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE
			ub = new THREE.Vector3 Number.MIN_VALUE, Number.MIN_VALUE, Number.MIN_VALUE

			for pt, i in pts

				# transform them into global space
				pt.applyMatrix4 @matrixWorld

				# get min, max
				lb.x = Math.min lb.x, pt.x
				lb.y = Math.min lb.y, pt.y
				lb.z = Math.min lb.z, pt.z
				ub.x = Math.max ub.x, pt.x
				ub.y = Math.max ub.y, pt.y
				ub.z = Math.max ub.z, pt.z

			x1 = Math.floor lb.x
			y1 = Math.floor lb.y
			z1 = Math.floor lb.z
			x2 = Math.ceil ub.x
			y2 = Math.ceil ub.y
			z2 = Math.ceil ub.z

			@_inverseWorld.getInverse @matrixWorld
			localPos = new THREE.Vector3()

			# iterate voxels in global space
			for gx in [x1..x2]
				for gy in [y1..y2]
					for gz in [z1..z2]

						localPos.set gx,gy,gz
						localPos.applyMatrix4 @_inverseWorld

						if @contains localPos.x, localPos.y, localPos.z

							cols = @getColorsAt localPos.x, localPos.y, localPos.z
							if cols?
								setVoxel gx, gy, gz, cols[0], cols[1]

		###
		Should be overridden
        @param x,y,z - int coordinates in local space, already assumed to be inside local bounding-box
		###
		contains: (x,y,z) ->

			return false


	return TransObj
