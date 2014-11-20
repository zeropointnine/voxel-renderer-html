
/*
Point
 */
var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(function(require) {
  "use strict";
  var BaseObj, Point, THREE;
  THREE = require('three');
  BaseObj = require('voxel/objects/BaseObj');
  Point = (function(_super) {
    __extends(Point, _super);

    function Point(position, color) {
      Point.__super__.constructor.call(this, position, color);
    }

    Point.prototype.render = function(setVoxel) {
      var cols, gpos;
      this.updateMatrix();
      gpos = this.position.clone();
      if (this.parent != null) {
        gpos.applyMatrix4(this.parent.matrixWorld);
      } else {
        gpos.applyMatrix4(this.matrixWorld);
      }
      cols = this.getColorsAt(gpos.x, gpos.y, gpos.z);
      if (cols != null) {
        return setVoxel(gpos.x, gpos.y, gpos.z, cols[0], cols[1]);
      }
    };

    return Point;

  })(BaseObj);
  return Point;
});

//# sourceMappingURL=Point.js.map
