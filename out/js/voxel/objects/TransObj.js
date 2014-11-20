
/*
TransObj

    Subclass of BaseObj that supports rotation and scale of its own contents
	Think 'transformable object'
    Subclasses should override contains()
 */
var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(function(require) {
  "use strict";
  var BaseObj, THREE, TransObj, Util3;
  THREE = require('three');
  Util3 = require('voxel/Util3');
  BaseObj = require('voxel/objects/BaseObj');
  TransObj = (function(_super) {
    __extends(TransObj, _super);


    /*
          For subclasses that support it, when false, only renders the 'surface' of the object
          rather than filling in entire its entire volume (which can be costly at draw time)
     */

    TransObj.prototype.isSolid = false;

    TransObj.prototype._inverseWorld = new THREE.Matrix4;

    TransObj.prototype._scaleWorld = new THREE.Vector3;

    TransObj.prototype._scaledUnit = new THREE.Vector3;

    function TransObj(position, color) {
      TransObj.__super__.constructor.call(this, position, color);
    }

    TransObj.prototype.render = function(setVoxel) {
      var cols, gx, gy, gz, i, lb, localPos, pt, pts, ub, x1, x2, y1, y2, z1, z2, _i, _j, _len, _results;
      this.updateMatrix();
      if (!this.isSolid) {
        Util3.putScaleFromMatrix(this.matrixWorld, this._scaleWorld);
        this._scaledUnit.set(1 / this._scaleWorld.x, 1 / this._scaleWorld.y, 1 / this._scaleWorld.z);
      }
      pts = [];
      pts.push(new THREE.Vector3(-this._extentsHalf.x, -this._extentsHalf.y, -this._extentsHalf.z));
      pts.push(new THREE.Vector3(-this._extentsHalf.x, +this._extentsHalf.y, -this._extentsHalf.z));
      pts.push(new THREE.Vector3(+this._extentsHalf.x, -this._extentsHalf.y, -this._extentsHalf.z));
      pts.push(new THREE.Vector3(+this._extentsHalf.x, +this._extentsHalf.y, -this._extentsHalf.z));
      pts.push(new THREE.Vector3(-this._extentsHalf.x, -this._extentsHalf.y, +this._extentsHalf.z));
      pts.push(new THREE.Vector3(-this._extentsHalf.x, +this._extentsHalf.y, +this._extentsHalf.z));
      pts.push(new THREE.Vector3(+this._extentsHalf.x, -this._extentsHalf.y, +this._extentsHalf.z));
      pts.push(new THREE.Vector3(+this._extentsHalf.x, +this._extentsHalf.y, +this._extentsHalf.z));
      lb = new THREE.Vector3(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
      ub = new THREE.Vector3(Number.MIN_VALUE, Number.MIN_VALUE, Number.MIN_VALUE);
      for (i = _i = 0, _len = pts.length; _i < _len; i = ++_i) {
        pt = pts[i];
        pt.applyMatrix4(this.matrixWorld);
        lb.x = Math.min(lb.x, pt.x);
        lb.y = Math.min(lb.y, pt.y);
        lb.z = Math.min(lb.z, pt.z);
        ub.x = Math.max(ub.x, pt.x);
        ub.y = Math.max(ub.y, pt.y);
        ub.z = Math.max(ub.z, pt.z);
      }
      x1 = Math.floor(lb.x);
      y1 = Math.floor(lb.y);
      z1 = Math.floor(lb.z);
      x2 = Math.ceil(ub.x);
      y2 = Math.ceil(ub.y);
      z2 = Math.ceil(ub.z);
      this._inverseWorld.getInverse(this.matrixWorld);
      localPos = new THREE.Vector3();
      _results = [];
      for (gx = _j = x1; x1 <= x2 ? _j <= x2 : _j >= x2; gx = x1 <= x2 ? ++_j : --_j) {
        _results.push((function() {
          var _k, _results1;
          _results1 = [];
          for (gy = _k = y1; y1 <= y2 ? _k <= y2 : _k >= y2; gy = y1 <= y2 ? ++_k : --_k) {
            _results1.push((function() {
              var _l, _results2;
              _results2 = [];
              for (gz = _l = z1; z1 <= z2 ? _l <= z2 : _l >= z2; gz = z1 <= z2 ? ++_l : --_l) {
                localPos.set(gx, gy, gz);
                localPos.applyMatrix4(this._inverseWorld);
                if (this.contains(localPos.x, localPos.y, localPos.z)) {
                  cols = this.getColorsAt(localPos.x, localPos.y, localPos.z);
                  if (cols != null) {
                    _results2.push(setVoxel(gx, gy, gz, cols[0], cols[1]));
                  } else {
                    _results2.push(void 0);
                  }
                } else {
                  _results2.push(void 0);
                }
              }
              return _results2;
            }).call(this));
          }
          return _results1;
        }).call(this));
      }
      return _results;
    };


    /*
    		Should be overridden
          @param x,y,z - int coordinates in local space, already assumed to be inside local bounding-box
     */

    TransObj.prototype.contains = function(x, y, z) {
      return false;
    };

    return TransObj;

  })(BaseObj);
  return TransObj;
});

//# sourceMappingURL=TransObj.js.map
