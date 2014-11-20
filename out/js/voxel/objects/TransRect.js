
/*
TransRect

    A rectangle on the X/Y axis, which is always 1-voxel thick regardless of scale
 */
var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(function(require) {
  "use strict";
  var THREE, TransObj, TransRect, Util3;
  THREE = require('three');
  Util3 = require('voxel/Util3');
  TransObj = require('voxel/objects/TransObj');
  TransRect = (function(_super) {
    __extends(TransRect, _super);

    TransRect.prototype._dimensions = new THREE.Vector2;


    /*
    		@param {THREE.Vector2} dimensions
     */

    function TransRect(position, color, dimensions) {
      if (dimensions == null) {
        throw new Error('Need dimensions');
      }
      TransRect.__super__.constructor.call(this, position, color);
      this.setDimensions(dimensions);
    }


    /*
          @returns {THREE.Vector2} dimensions of rectangle
     */

    TransRect.prototype.getDimensions = function() {
      return this._dimensions;
    };


    /*
          Dimensions of rectangle
          @param {THREE.Vector2}
     */

    TransRect.prototype.setDimensions = function(dimensions) {
      this._dimensions.set(dimensions.x, dimensions.y);
      return this.setExtents(new THREE.Vector3(this._dimensions.x, this._dimensions.y, 0));
    };

    TransRect.prototype.contains = function(x, y, z) {
      if (z >= 0 && z < this._scaledUnit.z) {
        if (Math.abs(x) <= this._extentsHalf.x) {
          if (Math.abs(y) <= this._extentsHalf.y) {
            return true;
          }
        }
      }
      return false;
    };

    return TransRect;

  })(TransObj);
  return TransRect;
});

//# sourceMappingURL=TransRect.js.map
