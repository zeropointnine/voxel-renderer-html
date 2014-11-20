###
IsometricRenderer

    Renders voxel scene in 2D using PIXI.js

    Implementation uses an array to cache textures per-color.
###

define (require) ->

	"use strict"

	Util3 = require 'voxel/Util3'
	PIXI = require 'pixi'
	BaseRenderer = require 'voxel/renderers/BaseRenderer'


	class IsometricRenderer extends BaseRenderer

		###
        Outline stroke color of drawn voxels
		###
		lineColor: 0x0

		###
        Determines whether or not already 'drawn' voxels get
        overwritten by later ones in the rendering process
		###
		firstOneWins: false


		_pixiRenderer = undefined
		_stage = undefined

		_renderTexture = undefined
		_renderTextureSprite = undefined
		_scratchSprite = undefined
		_scratchContainer = undefined

		_textureCache = []
		_lastTexture = undefined

		para_w = 10                         # parallelogram width
		para_h = 12                         # parallelogram height
		para_slope = 1 / 3                  # parallelgram slope
		cube_w = para_w * 2                 # cube width (ie, two parallelograms)
		diamond_h5 = para_h * para_slope    # diamond half-height
		diamond_h = diamond_h5 * 2          # diamond height
		para_y1 = diamond_h5 + para_h       # upper-y where parallelograms meet
		para_y2 = diamond_h + para_h        # lower-y where parallelograms meet

		origin_x = undefined                # pixel coords of voxel at (0,0,0)
		origin_y = undefined

		cubes = []
		numAdded = undefined

		hash = []  # key is an 'encoded' x/y/z integer value; value is the color
		hashMultX = undefined
		hashMultY = undefined
		hashMax = undefined


		constructor: (canvas, voxelScene, @maxX, @maxY, @maxZ, updateFunction=null) ->

			super(canvas, voxelScene, @maxX, @maxY, @maxZ, updateFunction)

			# analogy: x as hour; y as minutes; z as seconds
			hashMultX = (@maxY+1) * (@maxZ+1)
			hashMultY = (@maxZ+1)
			hashMax = (@maxY+1) * (@maxZ+1) * (@maxX+1)

			@initPixi()


		initPixi: ->

			if Util3.supportsWebGl()
				_pixiRenderer = new PIXI.WebGLRenderer 0, 0, { view: @_canvas }
			else
				# TODO: bug in pixi ATM where canvas is not cleared outside dirty rect?...
				_pixiRenderer = new PIXI.CanvasRenderer 0, 0, { view: @_canvas, clearBeforeRender:yes }

			_stage = new PIXI.Stage(0xe0e0e0)


			_scratchContainer = new PIXI.DisplayObjectContainer
			tmp = @makeBlockTexture(0xff8800)
			_scratchSprite = new PIXI.Sprite tmp
			_scratchContainer.addChild _scratchSprite

			_renderTexture = new PIXI.RenderTexture 100,100
			_renderTextureSprite = new PIXI.Sprite _renderTexture

			_stage.addChild _renderTextureSprite

			@setSize 800, 600  # default; should be called again from outside


		setSize: (width, height) ->

			_pixiRenderer.resize(width, height)

			_renderTexture = new PIXI.RenderTexture width, height
			_renderTextureSprite.texture = _renderTexture

			# calc 'origin' point such that voxel volume's bounds will be centered within canvas
			w_full = para_w * (@maxX + 1)  +  para_w * (@maxZ + 1)
			origin_x = Math.floor (width - w_full) / 2

			ht_y = (@maxY + 1) * para_h
			top_y = Math.floor (height - ht_y) / 2
			origin_y = top_y + ht_y
			# ... note how we're vertically centering y content where x and z = 0


		renderStart: ->

			super()

			numAdded = 0
			hash = []


		renderEnd: () ->

			super()

			_renderTexture.clear()

			# real draw happens here
			for i, color of hash
				@drawCube(i, color)

			_pixiRenderer.render _stage

		drawCube: (hashVal, color) =>

			# Decode voxel coords from hash value
			x = Math.floor( hashVal / hashMultX )
			x = @maxX - x  # rem, this is done to force drawing row in correct order
			y = Math.floor((hashVal % hashMultX) / hashMultY)
			z = hashVal % hashMultY

			# Same logic as get2dPos, but 'inlined':
			px = origin_x
			py = origin_y
			px += x * para_w
			py -= x * diamond_h5
			py -= y * para_h
			px += z * para_w
			py += z * diamond_h5

			_scratchSprite.x = px
			_scratchSprite.y = py

			tex = @getTextureByColor(color)



			if tex isnt _lastTexture
				_scratchSprite.setTexture tex
				_lastTexture = tex

			_renderTexture.render _scratchContainer


		get2dPos: (voxelX, voxelY, voxelZ) ->

			px = origin_x
			py = origin_y

			# adjust for voxel x value (as voxel x value increases, px increases and py decreases)
			px += voxelX * para_w
			py -= voxelX * diamond_h5

			# adjust for voxel y value (as voxel y increases, py decreases)
			py -= y * para_h

			# adjust for voxely z value
			px += voxelZ * para_w
			py += voxelZ * diamond_h5

			return { x: px, y: py }


		setVoxel: (x,y,z, color, color2) =>

			# note how this function does not actually do any drawing

			x = Math.round x
			y = Math.round y
			z = Math.round z

			if x < 0 or y < 0 or z < 0 or x > @maxX or y > @maxY or z > @maxZ
				return false

			# Encode the x/y/z coords into a single integer for the hasVoxel array.
			# Note how x is stored in such a way that when the array is iterated upon in ascending order,
			# it will draw in the correct order.
			index = (@maxX - x) * hashMultX  +  y * hashMultY  +  z
			if hash[index]?
				if @firstOneWins
					return false

			hash[index] = color
			numAdded++
			return true


		getTextureByColor: (color) ->

			r = (color & 0xff0000) >> 16
			g = (color & 0x00ff00) >> 8
			b = color & 0x0000ff

			# Round color channels to multiples of 16 (0, 16, ... 240), hah
			# This limits the number of possible elements in textureCache to 4096,
			# which limits memory usage, and as a side-effect, and
			# arguably makes aesthetic sense in a kind of pixel-art sort of way

			r = (r >> 4) << 4
			g = (g >> 4) << 4
			b = (b >> 4) << 4
			collapsedColor = (r << 16) + (g << 8) + b

			if not _textureCache[collapsedColor]?
				_textureCache[collapsedColor] = @makeBlockTexture color

			return _textureCache[collapsedColor]


		makeBlockTexture: (color) ->

			r = (color & 0xff0000) >> 16
			g = (color & 0x00ff00) >> 8
			b = color & 0x0000ff

			dr = Math.round r * 0.75
			dg = Math.round g * 0.75
			db = Math.round b * 0.75
			darker = (dr << 16) + (dg << 8) + db

			lr = Math.round r + (255-r) * 0.25
			lg = Math.round g + (255-g) * 0.25
			lb = Math.round b + (255-b) * 0.25
			lighter = (lr << 16) + (lg << 8) + lb

			graphics = new PIXI.Graphics();

			# top diamond
			graphics.beginFill(lighter);
			graphics.lineStyle(1, @lineColor, 1);
			graphics.moveTo(para_w,0);
			graphics.lineTo(cube_w-1, diamond_h5);
			graphics.lineTo(para_w, diamond_h);
			graphics.lineTo(0+1, diamond_h5);
			graphics.lineTo(para_w,0);
			graphics.endFill();

			# right parallelogram
			graphics.beginFill(color);
			graphics.lineStyle(1, @lineColor, 1);
			graphics.moveTo(para_w,diamond_h);
			graphics.lineTo(cube_w,diamond_h5);
			graphics.lineTo(cube_w,para_y1);
			graphics.lineTo(para_w,para_y2);
			graphics.lineTo(para_w,diamond_h);
			graphics.endFill();

			# left parallelogram
			graphics.beginFill(darker);
			graphics.lineStyle(1, @lineColor, 1);
			graphics.moveTo(para_w,diamond_h);
			graphics.lineTo(0,diamond_h5);
			graphics.lineTo(0,para_y1);
			graphics.lineTo(para_w,para_y2);
			graphics.lineTo(para_w,diamond_h);
			graphics.endFill();

			# console.log 'makeBlockTexture - main', hexColor.toString(16), 'darker', darker.toString(16), 'lighter',lighter.toString(16)

			return graphics.generateTexture()


	return IsometricRenderer
