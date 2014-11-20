###
TransBitmap

    A 3d plane with colors derived from a bitmap or a sequence of bitmaps

    TODO: should rly extend a class called 'Plane', which is always 1 voxel thin regardless of scale
###

define (require) ->

	"use strict"

	THREE = require 'three'
	Util3 = require 'voxel/Util3'
	TransRect = require 'voxel/objects/TransRect'


	class TransBitmap extends TransRect

		# Advance to next image every n frames
		imageAdvancesEveryN: 4

		# When true, Bitmap advances on every render; otherwise, must call advance()
		autoAdvanceImage: true

		_tick: 0
		_imageDatas: undefined
		_pingPongs: false
		_pingPongForward: true
		_paths: undefined
		_callback: undefined
		_isLoading:false


		constructor: (position, pImageData=null) ->

			super( position, 0x0, new THREE.Vector2() )

			@setImageDatas(pImageData)


		###
        Convenience function to load an image or sequence of images
		paths - can be single path or array of paths
        callback - a function which will be called when images have been loaded
        ###
		loadImageDatas: (paths, callback) ->

			if not paths?
				@setImageDatas(null)
				return

			@_isLoading = yes
			@_paths = if Array.isArray(paths) then paths else [paths]
			@_callback = callback

			@_imageDatas = []
			@loadNext()

		loadNext: () =>

			if @_imageDatas.length is @_paths.length  # done
				@_isLoading = no
				@setImageDatas @_imageDatas
				@_callback() if @_callback?
				return

			img = new Image();

			img.onload = () =>
				canvas = document.createElement("canvas")
				context = canvas.getContext('2d');
				context.drawImage(img, 0,0);
				imageData = context.getImageData(0, 0, img.width, img.height);
				@_imageDatas.push imageData

				@loadNext()

			img.src = @_paths[ @_imageDatas.length ]


		###
		Call this (typically on every frame) to advance the image index, if not using 'auto-advance'
        ###
		tick: ->

			@_tick++

			if @_pingPongs
				if @_pingPongForward
					@_tick++
					if @getIndex() >= @_imageDatas.length
						@_tick = @_imageDatas.length - 2
						@_pingPongForward = no
				else
					@_tick--
					if @_tick < 0
						@_tick = 1
						@_pingPongForward = yes
			else
				@_tick++
				if @_imageDatas? and @getIndex() >= @_imageDatas.length
					@_tick = 0


		getImageDatas: ->

			return @_imageDatas


		###
		val - can be an ImageData or an array of ImageDatas
        ###
		setImageDatas: (val) ->

			w = undefined
			h = undefined

			if not val?
				@_imageDatas = null
				w = 0
				h = 0
			else
				if not Array.isArray(val)
					@_imageDatas = []
					@_imageDatas.push(val)
				w = @_imageDatas[0].width - 1
				h = @_imageDatas[0].height - 1

			@_extents = new THREE.Vector3(w, h, 1)
			@_extentsHalf.set( @_extents.x / 2, @_extents.y / 2, @_extents.z / 2 )


		getPingPongs: () ->
			return @_pingPongs


		###
        When true, images will cycle from first to last back to first, etc.
		###
		setPingPongs: (b) ->
			@_pingPongs = b


		###
        This is ignored. Extents get set to dimensions of image in setImageDatas()
		###
		setExtents: (v) ->


		render: (setVoxel) ->

			return if @_isLoading

			super(setVoxel)

			if @autoAdvanceImage
				@tick()

				
		getIndex: ->
			return Math.floor @_tick / @imageAdvancesEveryN


		getColorsAt: (x,y,z) ->

			data = @_imageDatas[@getIndex()]

			pixels_x = Math.round(x - -@_extentsHalf.x)
			pixels_y = data.height - Math.round(y - -@_extentsHalf.y)

			if (pixels_x > data.width-1)
				return null # pixels_x = data.width-1
			if (pixels_y > data.height-1)
				return null # pixels_y = data.height-1

			# get color from bitmap
			pixels_i = (pixels_y * 4) * data.width + pixels_x * 4  # TODO: may just need to add to index on every call
			pixels_r = data.data[pixels_i+0]
			pixels_g = data.data[pixels_i+1]
			pixels_b = data.data[pixels_i+2]
			# pixels_a = data.data[pixels_i+3]
			pixels_c = (pixels_r << 16) + (pixels_g << 8) + pixels_b
			pixels_c2 = ((pixels_r >> 2) << 16) + ((pixels_g >> 2) << 8) + (pixels_b >> 2)  # ha
			return [pixels_c, pixels_c2]

			# TODO: return null if no alpha
			# TODO: handle that null result elsewhere


	return TransBitmap
