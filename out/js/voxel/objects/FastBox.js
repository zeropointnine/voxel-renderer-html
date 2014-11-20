
/*
FastBox

	Box with no content scaling or rotation support
    Fills in _all_ voxels within the box's volume !
    TODO: Version that only draws box's 'surface'
 */
var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(function(require) {
  "use strict";
  var FastBox, FastObj;
  FastObj = require('voxel/objects/FastObj');
  FastBox = (function(_super) {
    __extends(FastBox, _super);


    /*
          When true, renders all voxels within sphere's volume, not just its outer 'surface'
     */

    FastBox.prototype.isSolid = false;

    function FastBox(position, color, dimensions) {
      FastBox.__super__.constructor.call(this, position, color);
      if (dimensions == null) {
        throw new Error('Need dimensions');
      }
      this.setDimensions(dimensions);
    }


    /*
          Dimensions of box
     */

    FastBox.prototype.getDimensions = function() {
      return this._extents;
    };

    FastBox.prototype.setDimensions = function(dimensions) {
      return this.setExtents(dimensions);
    };

    FastBox.prototype.contains = function(x, y, z) {
      if (this.isSolid) {
        return this.containsSolid(x, y, z);
      } else {
        return this.containsSurface(x, y, z);
      }
    };

    FastBox.prototype.containsSolid = function(x, y, z) {
      if (Math.abs(x) <= this._extentsHalf.x) {
        if (Math.abs(y) <= this._extentsHalf.y) {
          if (Math.abs(z) <= this._extentsHalf.z) {
            return true;
          }
        }
      }
      return false;
    };

    FastBox.prototype.containsSurface = function(x, y, z) {
      if (!this.containsSolid(x, y, z)) {
        return false;
      }
      if (Math.abs(x) > this._extentsHalf.x - 1) {
        return true;
      }
      if (Math.abs(y) > this._extentsHalf.y - 1) {
        return true;
      }
      if (Math.abs(z) > this._extentsHalf.z - 1) {
        return true;
      }
      return false;
    };

    return FastBox;

  })(FastObj);
  return FastBox;
});

//# sourceMappingURL=FastBox.js.map
