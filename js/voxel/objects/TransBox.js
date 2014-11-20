
/*
TransBox
    Box with support for scaling and rotation
 */
var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(function(require) {
  "use strict";
  var THREE, TransBox, TransObj, Util3;
  THREE = require('three');
  Util3 = require('voxel/Util3');
  TransObj = require('voxel/objects/TransObj');
  TransBox = (function(_super) {
    __extends(TransBox, _super);

    function TransBox(position, color, dimensions) {
      TransBox.__super__.constructor.call(this, position, color);
      if (dimensions == null) {
        throw new Error('Need dimensions');
      }
      this.setExtents(dimensions);
    }


    /*
          @returns {THREE.Vector3} dimensions of box
     */

    TransBox.prototype.getDimensions = function() {
      return this._extents;
    };


    /*
          Dimensions of box
          @param {THREE.Vector3}
     */

    TransBox.prototype.setDimensions = function(dimensions) {
      return this.setExtents(dimensions);
    };

    TransBox.prototype.contains = function(x, y, z) {
      if (this.isSolid) {
        return this.containsSolid(x, y, z);
      } else {
        return this.containsSurface(x, y, z);
      }
    };

    TransBox.prototype.containsSolid = function(x, y, z) {
      if (Math.abs(x) <= this._extentsHalf.x) {
        if (Math.abs(y) <= this._extentsHalf.y) {
          if (Math.abs(z) <= this._extentsHalf.z) {
            return true;
          }
        }
      }
      return false;
    };

    TransBox.prototype.containsSurface = function(x, y, z) {
      if (!this.containsSolid(x, y, z)) {
        return false;
      }
      if (Math.abs(x) > this._extentsHalf.x - this._scaledUnit.x) {
        return true;
      }
      if (Math.abs(y) > this._extentsHalf.y - this._scaledUnit.y) {
        return true;
      }
      if (Math.abs(z) > this._extentsHalf.z - this._scaledUnit.z) {
        return true;
      }
      return false;
    };

    return TransBox;

  })(TransObj);
  return TransBox;
});

//# sourceMappingURL=TransBox.js.map
