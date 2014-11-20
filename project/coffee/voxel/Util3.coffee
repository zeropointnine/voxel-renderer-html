###*
Util3
    three.js specific utility functions
###
define (require) ->

	THREE = require("three")

	# static class; has no instance members
	class Util3


	# do not change these properties at runtime, of course
	Util3.DEG = Math.PI / 180
	Util3.X_AXIS = new THREE.Vector3(1, 0, 0).normalize()
	Util3.Y_AXIS = new THREE.Vector3(0, 1, 0).normalize()
	Util3.Z_AXIS = new THREE.Vector3(1, 0, 0).normalize()

	Util3._scratch = new THREE.Vector3()


	###
    from https://github.com/mrdoob/three.js/blob/master/examples/js/Detector.js
	###
	Util3.supportsWebGl = ->

		try
			return false  if !!window.WebGLRenderingContext is false
			canvas = document.createElement("canvas")
			return false  if !!canvas is false
			if !!(canvas.getContext("webgl") or canvas.getContext("experimental-webgl")) is true
				return true
			else
				return false
		catch e
			return false


	###
    from THREE.Matrix4.decompose()
	###
	Util3.putScaleFromMatrix = (matrix, outScale) ->

			te = matrix.elements

			sx = Util3._scratch.set(te[0], te[1], te[2]).length()
			sy = Util3._scratch.set(te[4], te[5], te[6]).length()
			sz = Util3._scratch.set(te[8], te[9], te[10]).length()

			# if determine is negative, we need to invert one scale
			det = matrix.determinant()
			sx = -sx  if det < 0

			outScale.x = sx
			outScale.y = sy
			outScale.z = sz


	Util3.printMatrix = (matrix) ->

		s = "\r\n"
		count = 0
		h = 0

		while h < 4
			i = 0

			while i < 4
				s += matrix.elements[count++]
				if i < 4 - 1
					s += "\t"
				else
					s += "\r\n"
				i++
			h++
		console.log "matrix:", s

	return Util3
