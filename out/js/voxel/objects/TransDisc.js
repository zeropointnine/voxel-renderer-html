
/*
TransDisc

    A disc on the X/Y axis, which is always 1-voxel thick regardless of z scale
 */
var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(function(require) {
  "use strict";
  var THREE, TransDisc, TransObj, Util3;
  THREE = require('three');
  Util3 = require('voxel/Util3');
  TransObj = require('voxel/objects/TransObj');
  TransDisc = (function(_super) {
    __extends(TransDisc, _super);

    TransDisc.prototype._radius = null;

    function TransDisc(position, color, radius) {
      if (radius == null) {
        throw new Error('Need radius');
      }
      TransDisc.__super__.constructor.call(this, position, color);
      this._invScale = new THREE.Vector3(1, 1, 1);
      this.setRadius(radius);
    }

    TransDisc.prototype.getRadius = function() {
      return this._radius;
    };

    TransDisc.prototype.setRadius = function(value) {
      this._radius = value;
      this._radiusSquared = this._radius * this._radius;
      return this.setExtents(new THREE.Vector3(this._radius * 2, this._radius * 2, 1));
    };

    TransDisc.prototype.contains = function(x, y, z) {
      var distance;
      if (z >= 0 && z < this._scaledUnit.z) {
        distance = Math.sqrt(x * x + y * y + z * z);
        return distance <= this._radius;
      } else {
        return false;
      }
    };

    return TransDisc;

  })(TransObj);
  return TransDisc;
});

//# sourceMappingURL=TransDisc.js.map
