###
FastObj

    Base class of objects whose content stays unrotated and unscaled.
    (Its rotation and scale properties will still be applied to its children).

    Is faster than TransObj (which requires a matrix calculation on every tested voxel).
###

define (require) ->

	"use strict"

	THREE = require 'three'
	Util3 = require 'voxel/Util3'
	BaseObj = require 'voxel/objects/BaseObj'


	class FastObj extends BaseObj

		constructor: (position, color) ->

			super(position, color)


		render: (setVoxel) ->

			@updateMatrix()

			x1 = Math.floor(-@_extentsHalf.x)
			x2 = Math.ceil(+@_extentsHalf.x)
			y1 = Math.floor(-@_extentsHalf.y)
			y2 = Math.ceil(+@_extentsHalf.y)
			z1 = Math.floor(-@_extentsHalf.z)
			z2 = Math.ceil(+@_extentsHalf.z)

			gpos = new THREE.Vector3()
			gpos.applyMatrix4 @matrixWorld

			# iterate voxels in local space
			for x in [x1..x2]
				for y in [y1..y2]
					for z in [z1..z2]
						if @contains(x,y,z)
							cols = @getColorsAt(x,y,z)
							setVoxel(gpos.x + x, gpos.y + y, gpos.z + z, cols[0], cols[1])


	return FastObj
