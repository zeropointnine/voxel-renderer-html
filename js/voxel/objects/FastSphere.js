
/*
FastSphere

   	Sphere with no local scaling/rotation support
 */
var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(function(require) {
  "use strict";
  var FastObj, FastSphere, THREE;
  THREE = require('three');
  FastObj = require('voxel/objects/FastObj');
  FastSphere = (function(_super) {
    __extends(FastSphere, _super);


    /*
          When true, renders all voxels within sphere's volume, not just its outer 'surface'
     */

    FastSphere.prototype.isSolid = false;

    FastSphere.prototype._radius = null;

    FastSphere.prototype._radiusSquared = null;

    FastSphere.prototype._radiusMinus1Squared = null;

    FastSphere.prototype._scratch = new THREE.Vector3;

    function FastSphere(position, color, radius) {
      if (radius == null) {
        throw new Error('Need radius');
      }
      FastSphere.__super__.constructor.call(this, position, color);
      this.setRadius(radius);
    }

    FastSphere.prototype.getRadius = function() {
      return this._radius;
    };

    FastSphere.prototype.setRadius = function(value) {
      this._radius = value;
      this._radiusSquared = this._radius * this._radius;
      this._radiusMinus1Squared = (this._radius - 1) * (this._radius - 1);
      return this.setExtents(new THREE.Vector3(this._radius * 2, this._radius * 2, this._radius * 2));
    };

    FastSphere.prototype.contains = function(x, y, z) {
      var distanceSquared;
      distanceSquared = x * x + y * y + z * z;
      if (this.isSolid) {
        return distanceSquared <= this._radiusSquared;
      } else {
        return distanceSquared <= this._radiusSquared && distanceSquared > this._radiusMinus1Squared;
      }
    };

    return FastSphere;

  })(FastObj);
  return FastSphere;
});

//# sourceMappingURL=FastSphere.js.map
