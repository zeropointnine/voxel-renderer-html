
/**
Util3
    three.js specific utility functions
 */
define(function(require) {
  var THREE, Util3;
  THREE = require("three");
  Util3 = (function() {
    function Util3() {}

    return Util3;

  })();
  Util3.DEG = Math.PI / 180;
  Util3.X_AXIS = new THREE.Vector3(1, 0, 0).normalize();
  Util3.Y_AXIS = new THREE.Vector3(0, 1, 0).normalize();
  Util3.Z_AXIS = new THREE.Vector3(1, 0, 0).normalize();
  Util3._scratch = new THREE.Vector3();

  /*
     from https://github.com/mrdoob/three.js/blob/master/examples/js/Detector.js
   */
  Util3.supportsWebGl = function() {
    var canvas, e;
    try {
      if (!!window.WebGLRenderingContext === false) {
        return false;
      }
      canvas = document.createElement("canvas");
      if (!!canvas === false) {
        return false;
      }
      if (!!(canvas.getContext("webgl") || canvas.getContext("experimental-webgl")) === true) {
        return true;
      } else {
        return false;
      }
    } catch (_error) {
      e = _error;
      return false;
    }
  };

  /*
     from THREE.Matrix4.decompose()
   */
  Util3.putScaleFromMatrix = function(matrix, outScale) {
    var det, sx, sy, sz, te;
    te = matrix.elements;
    sx = Util3._scratch.set(te[0], te[1], te[2]).length();
    sy = Util3._scratch.set(te[4], te[5], te[6]).length();
    sz = Util3._scratch.set(te[8], te[9], te[10]).length();
    det = matrix.determinant();
    if (det < 0) {
      sx = -sx;
    }
    outScale.x = sx;
    outScale.y = sy;
    return outScale.z = sz;
  };
  Util3.printMatrix = function(matrix) {
    var count, h, i, s;
    s = "\r\n";
    count = 0;
    h = 0;
    while (h < 4) {
      i = 0;
      while (i < 4) {
        s += matrix.elements[count++];
        if (i < 4 - 1) {
          s += "\t";
        } else {
          s += "\r\n";
        }
        i++;
      }
      h++;
    }
    return console.log("matrix:", s);
  };
  Util3.round = function(n, v) {
    n = n / v;
    n = Math.round(n) * v;
    return n;
  };
  return Util3;
});

//# sourceMappingURL=Util3.js.map
