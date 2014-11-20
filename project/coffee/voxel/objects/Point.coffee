###
Point
###

define (require) ->

	"use strict"

	THREE = require 'three'
	BaseObj = require 'voxel/objects/BaseObj'


	class Point extends BaseObj

		constructor: (position, color) ->

			super position, color


		render: (setVoxel) ->

			@updateMatrix()

			gpos = @position.clone()
			if @parent?
				gpos.applyMatrix4 @parent.matrixWorld  # NB!
			else
				gpos.applyMatrix4 @matrixWorld

			# no need for contains() test

			cols = @getColorsAt(gpos.x, gpos.y, gpos.z)
			if cols?
				setVoxel(gpos.x, gpos.y, gpos.z, cols[0], cols[1])


	return Point
