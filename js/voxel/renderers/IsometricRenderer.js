
/*
IsometricRenderer

    Renders voxel scene in 2D using PIXI.js

    Implementation uses an array to cache textures per-color.
 */
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(function(require) {
  "use strict";
  var BaseRenderer, IsometricRenderer, PIXI, Util3;
  Util3 = require('voxel/Util3');
  PIXI = require('pixi');
  BaseRenderer = require('voxel/renderers/BaseRenderer');
  IsometricRenderer = (function(_super) {
    var cube_w, cubes, diamond_h, diamond_h5, hash, hashMax, hashMultX, hashMultY, numAdded, origin_x, origin_y, para_h, para_slope, para_w, para_y1, para_y2, _lastTexture, _pixiRenderer, _renderTexture, _renderTextureSprite, _scratchContainer, _scratchSprite, _stage, _textureCache;

    __extends(IsometricRenderer, _super);


    /*
          Outline stroke color of drawn voxels
     */

    IsometricRenderer.prototype.lineColor = 0x0;


    /*
          Determines whether or not already 'drawn' voxels get
          overwritten by later ones in the rendering process
     */

    IsometricRenderer.prototype.firstOneWins = false;

    _pixiRenderer = void 0;

    _stage = void 0;

    _renderTexture = void 0;

    _renderTextureSprite = void 0;

    _scratchSprite = void 0;

    _scratchContainer = void 0;

    _textureCache = [];

    _lastTexture = void 0;

    para_w = 10;

    para_h = 12;

    para_slope = 1 / 3;

    cube_w = para_w * 2;

    diamond_h5 = para_h * para_slope;

    diamond_h = diamond_h5 * 2;

    para_y1 = diamond_h5 + para_h;

    para_y2 = diamond_h + para_h;

    origin_x = void 0;

    origin_y = void 0;

    cubes = [];

    numAdded = void 0;

    hash = [];

    hashMultX = void 0;

    hashMultY = void 0;

    hashMax = void 0;

    function IsometricRenderer(canvas, voxelScene, maxX, maxY, maxZ, updateFunction) {
      this.maxX = maxX;
      this.maxY = maxY;
      this.maxZ = maxZ;
      if (updateFunction == null) {
        updateFunction = null;
      }
      this.setVoxel = __bind(this.setVoxel, this);
      this.drawCube = __bind(this.drawCube, this);
      IsometricRenderer.__super__.constructor.call(this, canvas, voxelScene, this.maxX, this.maxY, this.maxZ, updateFunction);
      hashMultX = (this.maxY + 1) * (this.maxZ + 1);
      hashMultY = this.maxZ + 1;
      hashMax = (this.maxY + 1) * (this.maxZ + 1) * (this.maxX + 1);
      this.initPixi();
    }

    IsometricRenderer.prototype.initPixi = function() {
      var tmp;
      if (Util3.supportsWebGl()) {
        _pixiRenderer = new PIXI.WebGLRenderer(0, 0, {
          view: this._canvas
        });
      } else {
        _pixiRenderer = new PIXI.CanvasRenderer(0, 0, {
          view: this._canvas,
          clearBeforeRender: true
        });
      }
      _stage = new PIXI.Stage(0xe0e0e0);
      _scratchContainer = new PIXI.DisplayObjectContainer;
      tmp = this.makeBlockTexture(0xff8800);
      _scratchSprite = new PIXI.Sprite(tmp);
      _scratchContainer.addChild(_scratchSprite);
      _renderTexture = new PIXI.RenderTexture(100, 100);
      _renderTextureSprite = new PIXI.Sprite(_renderTexture);
      _stage.addChild(_renderTextureSprite);
      return this.setSize(800, 600);
    };

    IsometricRenderer.prototype.setSize = function(width, height) {
      var ht_y, top_y, w_full;
      _pixiRenderer.resize(width, height);
      _renderTexture = new PIXI.RenderTexture(width, height);
      _renderTextureSprite.texture = _renderTexture;
      w_full = para_w * (this.maxX + 1) + para_w * (this.maxZ + 1);
      origin_x = Math.floor((width - w_full) / 2);
      ht_y = (this.maxY + 1) * para_h;
      top_y = Math.floor((height - ht_y) / 2);
      return origin_y = top_y + ht_y;
    };

    IsometricRenderer.prototype.renderStart = function() {
      IsometricRenderer.__super__.renderStart.call(this);
      numAdded = 0;
      return hash = [];
    };

    IsometricRenderer.prototype.renderEnd = function() {
      var color, i;
      IsometricRenderer.__super__.renderEnd.call(this);
      _renderTexture.clear();
      for (i in hash) {
        color = hash[i];
        this.drawCube(i, color);
      }
      return _pixiRenderer.render(_stage);
    };

    IsometricRenderer.prototype.drawCube = function(hashVal, color) {
      var px, py, tex, x, y, z;
      x = Math.floor(hashVal / hashMultX);
      x = this.maxX - x;
      y = Math.floor((hashVal % hashMultX) / hashMultY);
      z = hashVal % hashMultY;
      px = origin_x;
      py = origin_y;
      px += x * para_w;
      py -= x * diamond_h5;
      py -= y * para_h;
      px += z * para_w;
      py += z * diamond_h5;
      _scratchSprite.x = px;
      _scratchSprite.y = py;
      tex = this.getTextureByColor(color);
      if (tex !== _lastTexture) {
        _scratchSprite.setTexture(tex);
        _lastTexture = tex;
      }
      return _renderTexture.render(_scratchContainer);
    };

    IsometricRenderer.prototype.get2dPos = function(voxelX, voxelY, voxelZ) {
      var px, py;
      px = origin_x;
      py = origin_y;
      px += voxelX * para_w;
      py -= voxelX * diamond_h5;
      py -= y * para_h;
      px += voxelZ * para_w;
      py += voxelZ * diamond_h5;
      return {
        x: px,
        y: py
      };
    };

    IsometricRenderer.prototype.setVoxel = function(x, y, z, color, color2) {
      var index;
      x = Math.round(x);
      y = Math.round(y);
      z = Math.round(z);
      if (x < 0 || y < 0 || z < 0 || x > this.maxX || y > this.maxY || z > this.maxZ) {
        return false;
      }
      index = (this.maxX - x) * hashMultX + y * hashMultY + z;
      if (hash[index] != null) {
        if (this.firstOneWins) {
          return false;
        }
      }
      hash[index] = color;
      numAdded++;
      return true;
    };

    IsometricRenderer.prototype.getTextureByColor = function(color) {
      var b, collapsedColor, g, r;
      r = (color & 0xff0000) >> 16;
      g = (color & 0x00ff00) >> 8;
      b = color & 0x0000ff;
      r = (r >> 4) << 4;
      g = (g >> 4) << 4;
      b = (b >> 4) << 4;
      collapsedColor = (r << 16) + (g << 8) + b;
      if (_textureCache[collapsedColor] == null) {
        _textureCache[collapsedColor] = this.makeBlockTexture(color);
      }
      return _textureCache[collapsedColor];
    };

    IsometricRenderer.prototype.makeBlockTexture = function(color) {
      var b, darker, db, dg, dr, g, graphics, lb, lg, lighter, lr, r;
      r = (color & 0xff0000) >> 16;
      g = (color & 0x00ff00) >> 8;
      b = color & 0x0000ff;
      dr = Math.round(r * 0.75);
      dg = Math.round(g * 0.75);
      db = Math.round(b * 0.75);
      darker = (dr << 16) + (dg << 8) + db;
      lr = Math.round(r + (255 - r) * 0.25);
      lg = Math.round(g + (255 - g) * 0.25);
      lb = Math.round(b + (255 - b) * 0.25);
      lighter = (lr << 16) + (lg << 8) + lb;
      graphics = new PIXI.Graphics();
      graphics.beginFill(lighter);
      graphics.lineStyle(1, this.lineColor, 1);
      graphics.moveTo(para_w, 0);
      graphics.lineTo(cube_w - 1, diamond_h5);
      graphics.lineTo(para_w, diamond_h);
      graphics.lineTo(0 + 1, diamond_h5);
      graphics.lineTo(para_w, 0);
      graphics.endFill();
      graphics.beginFill(color);
      graphics.lineStyle(1, this.lineColor, 1);
      graphics.moveTo(para_w, diamond_h);
      graphics.lineTo(cube_w, diamond_h5);
      graphics.lineTo(cube_w, para_y1);
      graphics.lineTo(para_w, para_y2);
      graphics.lineTo(para_w, diamond_h);
      graphics.endFill();
      graphics.beginFill(darker);
      graphics.lineStyle(1, this.lineColor, 1);
      graphics.moveTo(para_w, diamond_h);
      graphics.lineTo(0, diamond_h5);
      graphics.lineTo(0, para_y1);
      graphics.lineTo(para_w, para_y2);
      graphics.lineTo(para_w, diamond_h);
      graphics.endFill();
      return graphics.generateTexture();
    };

    return IsometricRenderer;

  })(BaseRenderer);
  return IsometricRenderer;
});

//# sourceMappingURL=IsometricRenderer.js.map
