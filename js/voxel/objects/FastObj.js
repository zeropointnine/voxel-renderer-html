
/*
FastObj

    Base class of objects whose content stays unrotated and unscaled.
    (Its rotation and scale properties will still be applied to its children).

    Is faster than TransObj (which requires a matrix calculation on every tested voxel).
 */
var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(function(require) {
  "use strict";
  var BaseObj, FastObj, THREE, Util3;
  THREE = require('three');
  Util3 = require('voxel/Util3');
  BaseObj = require('voxel/objects/BaseObj');
  FastObj = (function(_super) {
    __extends(FastObj, _super);

    function FastObj(position, color) {
      FastObj.__super__.constructor.call(this, position, color);
    }

    FastObj.prototype.render = function(setVoxel) {
      var cols, gpos, x, x1, x2, y, y1, y2, z, z1, z2, _i, _results;
      this.updateMatrix();
      x1 = Math.floor(-this._extentsHalf.x);
      x2 = Math.ceil(+this._extentsHalf.x);
      y1 = Math.floor(-this._extentsHalf.y);
      y2 = Math.ceil(+this._extentsHalf.y);
      z1 = Math.floor(-this._extentsHalf.z);
      z2 = Math.ceil(+this._extentsHalf.z);
      gpos = new THREE.Vector3();
      gpos.applyMatrix4(this.matrixWorld);
      _results = [];
      for (x = _i = x1; x1 <= x2 ? _i <= x2 : _i >= x2; x = x1 <= x2 ? ++_i : --_i) {
        _results.push((function() {
          var _j, _results1;
          _results1 = [];
          for (y = _j = y1; y1 <= y2 ? _j <= y2 : _j >= y2; y = y1 <= y2 ? ++_j : --_j) {
            _results1.push((function() {
              var _k, _results2;
              _results2 = [];
              for (z = _k = z1; z1 <= z2 ? _k <= z2 : _k >= z2; z = z1 <= z2 ? ++_k : --_k) {
                if (this.contains(x, y, z)) {
                  cols = this.getColorsAt(x, y, z);
                  _results2.push(setVoxel(gpos.x + x, gpos.y + y, gpos.z + z, cols[0], cols[1]));
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

    return FastObj;

  })(BaseObj);
  return FastObj;
});

//# sourceMappingURL=FastObj.js.map
