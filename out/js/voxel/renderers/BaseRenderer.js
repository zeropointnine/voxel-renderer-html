
/*
BaseRenderer
    Not meant to be used directly
 */
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

define(function(require) {
  var $, BaseRenderer, Point, THREE, Util3;
  $ = require('jquery');
  THREE = require('three');
  Util3 = require('voxel/Util3');
  Point = require('voxel/objects/Point');
  BaseRenderer = (function() {
    BaseRenderer.SHOW_CORNER_BOUNDS = false;

    BaseRenderer.prototype.maxX = void 0;

    BaseRenderer.prototype.maxY = void 0;

    BaseRenderer.prototype.maxZ = void 0;

    BaseRenderer.prototype._canvas = void 0;

    BaseRenderer.prototype._voxelScene = void 0;

    BaseRenderer.prototype._updateFunction = void 0;

    BaseRenderer.prototype._debugPoints = void 0;

    BaseRenderer.prototype._isLooping = void 0;

    BaseRenderer.prototype._frameCount = 0;

    BaseRenderer.prototype._timeStampFps = Date.now();

    BaseRenderer.prototype._debugEl = $('#debug');

    BaseRenderer.prototype._setVoxelFunction = void 0;


    /*
          canvas - Canvas DOM element to render to
          voxelScene - The three.js Scene composed of voxel objects to be drawn
          updateFunction - optional function to be called before each render
          maxX/Y/Z - defines the volume within which voxels can be drawn (everything outside those bounds will be clipped)
     */

    function BaseRenderer(canvas, voxelScene, maxX, maxY, maxZ, updateFunction) {
      this.maxX = maxX;
      this.maxY = maxY;
      this.maxZ = maxZ;
      if (updateFunction == null) {
        updateFunction = null;
      }
      this.render = __bind(this.render, this);
      this.start = __bind(this.start, this);
      if (canvas == null) {
        throw new Error("Need canvas");
      }
      if (voxelScene == null) {
        throw new Error("Need voxel scene");
      }
      this._canvas = canvas;
      this._voxelScene = voxelScene;
      this._updateFunction = updateFunction;
      this.maxX = Math.floor(this.maxX);
      this.maxY = Math.floor(this.maxY);
      this.maxZ = Math.floor(this.maxZ);
      this.initDebugPoints();
      this._setVoxelFunction = this.setVoxel;
    }

    BaseRenderer.prototype.setSize = function(width, height) {};

    BaseRenderer.prototype.setVoxelScene = function(scene) {
      return this._voxelScene = scene;
    };

    BaseRenderer.prototype.start = function() {
      this._isLooping = true;
      return this.render();
    };

    BaseRenderer.prototype.stop = function() {
      return this._isLooping = false;
    };

    BaseRenderer.prototype.render = function() {
      var elapsed, fpms, fps, msp60f, mspf, s, was;
      this._frameCount++;
      if (this._debugEl.length > 0 && this._frameCount % 60 === 1) {
        was = this._timeStampFps;
        this._timeStampFps = Date.now();
        msp60f = this._timeStampFps - was;
        mspf = msp60f / 60;
        fpms = 1 / mspf;
        fps = fpms * 1000;
        elapsed = this._timeStampFps - was;
        s = elapsed + 'ms' + ' (' + Math.round(fps) + 'fps)';
        this._debugEl.text(s);
      }
      if (this._isLooping) {
        setTimeout((function(_this) {
          return function() {
            return requestAnimationFrame(_this.render, null);
          };
        })(this), 33);
      }
      if ((this._updateFunction != null) && this._isLooping) {
        this._updateFunction();
      }
      return this.renderVoxelScene();
    };

    BaseRenderer.prototype.getMaxX = function() {
      return this.maxX;
    };

    BaseRenderer.prototype.getMaxY = function() {
      return this.maxY;
    };

    BaseRenderer.prototype.getMaxZ = function() {
      return this.maxZ;
    };

    BaseRenderer.prototype.renderStart = function() {};

    BaseRenderer.prototype.renderEnd = function() {};

    BaseRenderer.prototype.renderVoxelScene = function() {
      var child, i, point, _i, _j, _len, _len1, _ref, _ref1;
      this._voxelScene.updateMatrixWorld();
      this.renderStart();
      if (BaseRenderer.SHOW_CORNER_BOUNDS) {
        _ref = this._debugPoints;
        for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
          point = _ref[i];
          point.render(this._setVoxelFunction);
        }
      }
      _ref1 = this._voxelScene.children;
      for (i = _j = 0, _len1 = _ref1.length; _j < _len1; i = ++_j) {
        child = _ref1[i];
        this.renderObj(child);
      }
      return this.renderEnd();
    };

    BaseRenderer.prototype.renderObj = function(obj) {
      var child, i, _i, _len, _ref, _results;
      if (!obj.visible) {
        return;
      }
      obj.render(this._setVoxelFunction);
      _ref = obj.children;
      _results = [];
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        child = _ref[i];
        _results.push(this.renderObj(child));
      }
      return _results;
    };

    BaseRenderer.prototype.initDebugPoints = function() {
      var c, col;
      this._debugPoints = [];
      col = 0x404040;
      this._debugPoints.push(new Point(new THREE.Vector3(0, 0, 0), col));
      this._debugPoints.push(new Point(new THREE.Vector3(1, 0, 0), col));
      this._debugPoints.push(new Point(new THREE.Vector3(0, 1, 0), col));
      this._debugPoints.push(new Point(new THREE.Vector3(0, 0, 1), col));
      this._debugPoints.push(new Point(new THREE.Vector3(this.maxX, 0, 0), col));
      this._debugPoints.push(new Point(new THREE.Vector3(this.maxX, 1, 0), col));
      this._debugPoints.push(new Point(new THREE.Vector3(this.maxX, 0, 1), col));
      this._debugPoints.push(new Point(new THREE.Vector3(this.maxX - 1, 0, 0), col));
      this._debugPoints.push(new Point(new THREE.Vector3(0, this.maxY, 0), col));
      this._debugPoints.push(new Point(new THREE.Vector3(0, this.maxY, 1), col));
      this._debugPoints.push(new Point(new THREE.Vector3(1, this.maxY, 0), col));
      this._debugPoints.push(new Point(new THREE.Vector3(0, this.maxY - 1, 0), col));
      this._debugPoints.push(new Point(new THREE.Vector3(this.maxX, this.maxY, 0), col));
      this._debugPoints.push(new Point(new THREE.Vector3(this.maxX - 1, this.maxY, 0), col));
      this._debugPoints.push(new Point(new THREE.Vector3(this.maxX, this.maxY - 1, 0), col));
      this._debugPoints.push(new Point(new THREE.Vector3(this.maxX, this.maxY, 1), col));
      this._debugPoints.push(new Point(new THREE.Vector3(0, 0, this.maxZ), col));
      this._debugPoints.push(new Point(new THREE.Vector3(1, 0, this.maxZ), col));
      this._debugPoints.push(new Point(new THREE.Vector3(0, 1, this.maxZ), col));
      this._debugPoints.push(new Point(new THREE.Vector3(0, 0, this.maxZ - 1), col));
      this._debugPoints.push(new Point(new THREE.Vector3(this.maxX, 0, this.maxZ), col));
      this._debugPoints.push(new Point(new THREE.Vector3(this.maxX, 1, this.maxZ), col));
      this._debugPoints.push(new Point(new THREE.Vector3(this.maxX - 1, 0, this.maxZ), col));
      this._debugPoints.push(new Point(new THREE.Vector3(this.maxX, 0, this.maxZ - 1), col));
      this._debugPoints.push(new Point(new THREE.Vector3(0, this.maxY, this.maxZ), col));
      this._debugPoints.push(new Point(new THREE.Vector3(1, this.maxY, this.maxZ), col));
      this._debugPoints.push(new Point(new THREE.Vector3(0, this.maxY - 1, this.maxZ), col));
      this._debugPoints.push(new Point(new THREE.Vector3(0, this.maxY, this.maxZ - 1), col));
      this._debugPoints.push(new Point(new THREE.Vector3(this.maxX, this.maxY, this.maxZ), col));
      this._debugPoints.push(new Point(new THREE.Vector3(this.maxX - 1, this.maxY, this.maxZ), col));
      this._debugPoints.push(new Point(new THREE.Vector3(this.maxX, this.maxY - 1, this.maxZ), col));
      this._debugPoints.push(new Point(new THREE.Vector3(this.maxX, this.maxY, this.maxZ - 1), col));
      c = new THREE.Vector3(this.maxX / 2, this.maxY / 2, this.maxZ / 2);
      this._debugPoints.push(new Point(new THREE.Vector3(c.x, c.y, c.z), col));
      this._debugPoints.push(new Point(new THREE.Vector3(c.x + 1, c.y, c.z), col));
      this._debugPoints.push(new Point(new THREE.Vector3(c.x - 1, c.y, c.z), col));
      this._debugPoints.push(new Point(new THREE.Vector3(c.x, c.y + 1, c.z), col));
      this._debugPoints.push(new Point(new THREE.Vector3(c.x, c.y - 1, c.z), col));
      this._debugPoints.push(new Point(new THREE.Vector3(c.x, c.y, c.z + 1), col));
      return this._debugPoints.push(new Point(new THREE.Vector3(c.x, c.y, c.z - 1), col));
    };

    return BaseRenderer;

  })();
  return BaseRenderer;
});

//# sourceMappingURL=BaseRenderer.js.map
