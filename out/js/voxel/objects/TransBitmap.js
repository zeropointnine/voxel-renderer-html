
/*
TransBitmap

    A 3d plane with colors derived from a bitmap or a sequence of bitmaps

    TODO: should rly extend a class called 'Plane', which is always 1 voxel thin regardless of scale
 */
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(function(require) {
  "use strict";
  var THREE, TransBitmap, TransRect, Util3;
  THREE = require('three');
  Util3 = require('voxel/Util3');
  TransRect = require('voxel/objects/TransRect');
  TransBitmap = (function(_super) {
    __extends(TransBitmap, _super);

    TransBitmap.prototype.imageAdvancesEveryN = 4;

    TransBitmap.prototype.autoAdvanceImage = true;

    TransBitmap.prototype._tick = 0;

    TransBitmap.prototype._imageDatas = void 0;

    TransBitmap.prototype._pingPongs = false;

    TransBitmap.prototype._pingPongForward = true;

    TransBitmap.prototype._paths = void 0;

    TransBitmap.prototype._callback = void 0;

    TransBitmap.prototype._isLoading = false;

    function TransBitmap(position, pImageData) {
      if (pImageData == null) {
        pImageData = null;
      }
      this.loadNext = __bind(this.loadNext, this);
      TransBitmap.__super__.constructor.call(this, position, 0x0, new THREE.Vector2());
      this.setImageDatas(pImageData);
    }


    /*
          Convenience function to load an image or sequence of images
    		paths - can be single path or array of paths
          callback - a function which will be called when images have been loaded
     */

    TransBitmap.prototype.loadImageDatas = function(paths, callback) {
      if (paths == null) {
        this.setImageDatas(null);
        return;
      }
      this._isLoading = true;
      this._paths = Array.isArray(paths) ? paths : [paths];
      this._callback = callback;
      this._imageDatas = [];
      return this.loadNext();
    };

    TransBitmap.prototype.loadNext = function() {
      var img;
      if (this._imageDatas.length === this._paths.length) {
        this._isLoading = false;
        this.setImageDatas(this._imageDatas);
        if (this._callback != null) {
          this._callback();
        }
        return;
      }
      img = new Image();
      img.onload = (function(_this) {
        return function() {
          var canvas, context, imageData;
          canvas = document.createElement("canvas");
          context = canvas.getContext('2d');
          context.drawImage(img, 0, 0);
          imageData = context.getImageData(0, 0, img.width, img.height);
          _this._imageDatas.push(imageData);
          return _this.loadNext();
        };
      })(this);
      return img.src = this._paths[this._imageDatas.length];
    };


    /*
    		Call this (typically on every frame) to advance the image index, if not using 'auto-advance'
     */

    TransBitmap.prototype.tick = function() {
      this._tick++;
      if (this._pingPongs) {
        if (this._pingPongForward) {
          this._tick++;
          if (this.getIndex() >= this._imageDatas.length) {
            this._tick = this._imageDatas.length - 2;
            return this._pingPongForward = false;
          }
        } else {
          this._tick--;
          if (this._tick < 0) {
            this._tick = 1;
            return this._pingPongForward = true;
          }
        }
      } else {
        this._tick++;
        if ((this._imageDatas != null) && this.getIndex() >= this._imageDatas.length) {
          return this._tick = 0;
        }
      }
    };

    TransBitmap.prototype.getImageDatas = function() {
      return this._imageDatas;
    };


    /*
    		val - can be an ImageData or an array of ImageDatas
     */

    TransBitmap.prototype.setImageDatas = function(val) {
      var h, w;
      w = void 0;
      h = void 0;
      if (val == null) {
        this._imageDatas = null;
        w = 0;
        h = 0;
      } else {
        if (!Array.isArray(val)) {
          this._imageDatas = [];
          this._imageDatas.push(val);
        }
        w = this._imageDatas[0].width - 1;
        h = this._imageDatas[0].height - 1;
      }
      this._extents = new THREE.Vector3(w, h, 1);
      return this._extentsHalf.set(this._extents.x / 2, this._extents.y / 2, this._extents.z / 2);
    };

    TransBitmap.prototype.getPingPongs = function() {
      return this._pingPongs;
    };


    /*
          When true, images will cycle from first to last back to first, etc.
     */

    TransBitmap.prototype.setPingPongs = function(b) {
      return this._pingPongs = b;
    };


    /*
          This is ignored. Extents get set to dimensions of image in setImageDatas()
     */

    TransBitmap.prototype.setExtents = function(v) {};

    TransBitmap.prototype.render = function(setVoxel) {
      if (this._isLoading) {
        return;
      }
      TransBitmap.__super__.render.call(this, setVoxel);
      if (this.autoAdvanceImage) {
        return this.tick();
      }
    };

    TransBitmap.prototype.getIndex = function() {
      return Math.floor(this._tick / this.imageAdvancesEveryN);
    };

    TransBitmap.prototype.getColorsAt = function(x, y, z) {
      var data, pixels_b, pixels_c, pixels_c2, pixels_g, pixels_i, pixels_r, pixels_x, pixels_y;
      data = this._imageDatas[this.getIndex()];
      pixels_x = Math.round(x - -this._extentsHalf.x);
      pixels_y = data.height - Math.round(y - -this._extentsHalf.y);
      if (pixels_x > data.width - 1) {
        return null;
      }
      if (pixels_y > data.height - 1) {
        return null;
      }
      pixels_i = (pixels_y * 4) * data.width + pixels_x * 4;
      pixels_r = data.data[pixels_i + 0];
      pixels_g = data.data[pixels_i + 1];
      pixels_b = data.data[pixels_i + 2];
      pixels_c = (pixels_r << 16) + (pixels_g << 8) + pixels_b;
      pixels_c2 = ((pixels_r >> 2) << 16) + ((pixels_g >> 2) << 8) + (pixels_b >> 2);
      return [pixels_c, pixels_c2];
    };

    return TransBitmap;

  })(TransRect);
  return TransBitmap;
});

//# sourceMappingURL=TransBitmap.js.map
