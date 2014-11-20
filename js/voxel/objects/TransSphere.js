
/*
TransSphere

	Sphere with local scaling/rotation support ('ovoid')
 */
var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(function(require) {
  "use strict";
  var THREE, TransObj, TransSphere;
  THREE = require('three');
  TransObj = require('voxel/objects/TransObj');
  TransSphere = (function(_super) {
    __extends(TransSphere, _super);


    /*
          When true, all voxels within sphere's volume are drawn, not just its surface
     */

    TransSphere.prototype.isSolid = false;

    TransSphere.prototype._radius = null;

    TransSphere.prototype._radiusSquared = null;

    TransSphere.prototype._scaledUnitLength = null;

    TransSphere.prototype._localPointLengthSquared = null;

    TransSphere.prototype._scratch = new THREE.Vector3();

    function TransSphere(position, color, radius) {
      if (radius == null) {
        throw new Error('Need radius');
      }
      TransSphere.__super__.constructor.call(this, position, color);
      this.setRadius(radius);
    }

    TransSphere.prototype.getRadius = function() {
      return this._radius;
    };

    TransSphere.prototype.setRadius = function(value) {
      this._radius = value;
      this._radiusSquared = this._radius * this._radius;
      return this.setExtents(new THREE.Vector3(this._radius * 2, this._radius * 2, this._radius * 2));
    };

    TransSphere.prototype.render = function(setVoxel) {
      this._scaledUnitLength = null;
      this.updateMatrix();
      return TransSphere.__super__.render.call(this, setVoxel);
    };

    TransSphere.prototype.contains = function(x, y, z) {
      if (this.isSolid) {
        return this.containsSolid(x, y, z);
      } else {
        return this.containsSurface(x, y, z);
      }
    };

    TransSphere.prototype.containsSolid = function(x, y, z) {
      return (x * x + y * y + z * z) <= this._radiusSquared;
    };

    TransSphere.prototype.containsSurface = function(x, y, z) {
      var rad;
      rad = Math.sqrt(x * x + y * y + z * z);
      if (rad > this._radius) {
        return false;
      }
      if (this._scaledUnitLength == null) {
        this._scaledUnitLength = this._scaledUnit.length();
      }
      return rad > this._radius - this._scaledUnitLength;
    };

    return TransSphere;

  })(TransObj);
  return TransSphere;
});

//# sourceMappingURL=TransSphere.js.map
