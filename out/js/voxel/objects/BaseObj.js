
/*
BaseObj

    Base class for voxel objects.
    Can be used as empty container object.

    Extends Object3D, but is not part of the three.js scene graph proper.

    Position and visibility properties are always supported.
    Rotation and scale are applied to any children.
    Rotation and scale of local contents _can_ be supported based on implementation (see subclasses of TransObj)

    Has a color property, which subclass may or may not make meaningful
 */
var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(function(require) {
  "use strict";
  var BaseObj, Shared, THREE, Util3;
  THREE = require('three');
  Util3 = require('voxel/Util3');
  Shared = require('demo/Shared');
  BaseObj = (function(_super) {
    __extends(BaseObj, _super);

    BaseObj.prototype._extents = void 0;

    BaseObj.prototype._extentsHalf = void 0;

    BaseObj.prototype._color = void 0;

    BaseObj.prototype._colorAlt = void 0;

    function BaseObj(position, color) {
      BaseObj.__super__.constructor.call(this);
      position = position || new THREE.Vector3();
      this.position.x = position.x;
      this.position.y = position.y;
      this.position.z = position.z;
      this.setColor(color || 0x0);
      this._extents = new THREE.Vector3;
      this._extentsHalf = new THREE.Vector3();
    }


    /*
    		public
          Some subclasses may not use this value fyi
     */

    BaseObj.prototype.getColor = function() {
      return this._color;
    };


    /*
          public
     */

    BaseObj.prototype.setColor = function(value) {
      var c, c2;
      this._color = value;
      c = new THREE.Color(value);
      c2 = new THREE.Color(c.r / 2, c.g / 2, c.b / 2);
      return this._colorAlt = c2.getHex();
    };


    /*
          package private
          Should be and overridden and super'ed
     */

    BaseObj.prototype.render = function(setVoxel) {};


    /*
    		protected
    		The volume which will be iterated thru by render()
     */

    BaseObj.prototype.getExtents = function() {
      return this._extents;
    };

    BaseObj.prototype.setExtents = function(v) {
      this._extents = v;
      this._extentsHalf.x = this._extents.x / 2;
      this._extentsHalf.y = this._extents.y / 2;
      return this._extentsHalf.z = this._extents.z / 2;
    };


    /*
    		protected
    		Return colors for a point which should already assumed to be inside
    		@param x, y, z - floating point
    		@returns {array} - returns main color and 'alternate color'
     */

    BaseObj.prototype.getColorsAt = function(x, y, z) {
      return [this._color, this._colorAlt];
    };


    /*
          protected
          Subclass should override
          Should return true if given local coordinates are inside of object
    		@param x,y,z - coordinates in *local space*; doesn't have to be ints
     */

    BaseObj.prototype.contains = function(x, y, z) {
      return false;
    };

    return BaseObj;

  })(THREE.Object3D);
  return BaseObj;
});

//# sourceMappingURL=BaseObj.js.map
