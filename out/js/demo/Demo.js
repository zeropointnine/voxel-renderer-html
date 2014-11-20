var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

define(function(require) {
  "use strict";
  var $, BaseRenderer, Controller, Demo, IsometricRenderer, Model, Shared, THREE, ThreeRenderer, Util3;
  $ = require('jquery');
  THREE = require('three');
  Util3 = require('voxel/Util3');
  BaseRenderer = require('voxel/renderers/BaseRenderer');
  ThreeRenderer = require('voxel/renderers/ThreeRenderer');
  IsometricRenderer = require('voxel/renderers/IsometricRenderer');
  Shared = require('demo/Shared');
  Model = require('demo/Model');
  Controller = require('demo/Controller');
  Demo = (function() {
    Demo.prototype.scene = void 0;

    Demo.prototype.model = void 0;

    Demo.prototype.controller = void 0;

    Demo.prototype.canvas3d = void 0;

    Demo.prototype.canvasIso = void 0;

    Demo.prototype.renderer3d = void 0;

    Demo.prototype.rendererIsometric = void 0;

    Demo.prototype.selectedRenderer = void 0;

    Demo.prototype.targetFrameRate = 30;

    Demo.prototype.flagShowRenderer3d = false;

    Demo.prototype.flagShowRendererIsometric = false;

    Demo.prototype.paused = false;

    Demo.prototype.oneFrameFlag = false;

    function Demo() {
      this.loop = __bind(this.loop, this);
      var allow, useIso;
      useIso = (window.location.href.indexOf('isometric')) !== -1;
      if (!Util3.supportsWebGl()) {
        allow = false;
        if (allow) {
          alert('WebGL is not supported in this browser. Falling back to canvas renderer...');
        } else {
          $('#nowebgl').html('WebGL not supported in this browser.<br>Use of canvas renderer as a fallback is possible, but... let\'s not :/');
          $('#nowebgl').show();
        }
        return;
      }
      Shared.init();
      this.canvas3d = $('#canvas3d')[0];
      this.canvasIso = $('#canvasIso')[0];
      this.scene = new THREE.Scene();
      this.model = new Model(this.scene);
      this.controller = new Controller(this.model);
      BaseRenderer.SHOW_CORNER_BOUNDS = false;
      this.renderer3d = new ThreeRenderer(this.canvas3d, this.controller.selectedScene, Shared.VOXELS_MAX_X, Shared.VOXELS_MAX_Y, Shared.VOXELS_MAX_Z);
      this.rendererIsometric = new IsometricRenderer(this.canvasIso, this.controller.selectedScene, Shared.VOXELS_MAX_X, Shared.VOXELS_MAX_Y, Shared.VOXELS_MAX_Z);
      if (useIso) {
        this.selectRenderer(this.rendererIsometric);
      } else {
        this.selectRenderer(this.renderer3d);
      }
      $('#threeD').click((function(_this) {
        return function() {
          return _this.selectRenderer(_this.renderer3d);
        };
      })(this));
      $('#isometric').click((function(_this) {
        return function() {
          return _this.selectRenderer(_this.rendererIsometric);
        };
      })(this));
      Shared.eventBus.on('select-next-renderer', (function(_this) {
        return function() {
          var ren;
          ren = _this.selectedRenderer === _this.renderer3d ? _this.rendererIsometric : _this.renderer3d;
          return _this.selectRenderer(ren);
        };
      })(this));
      Shared.eventBus.on('selectedscene-changed', (function(_this) {
        return function() {
          return _this.selectedRenderer.setVoxelScene(_this.controller.selectedScene);
        };
      })(this));
      Shared.eventBus.on('toggle-pause', (function(_this) {
        return function() {
          _this.paused = !_this.paused;
          return BaseRenderer.SHOW_CORNER_BOUNDS = _this.paused;
        };
      })(this));
      Shared.eventBus.on('one-frame', (function(_this) {
        return function() {
          _this.paused = true;
          _this.oneFrameFlag = true;
          return BaseRenderer.SHOW_CORNER_BOUNDS = true;
        };
      })(this));
      $(window).resize((function(_this) {
        return function() {
          return _this.selectedRenderer.setSize(window.innerWidth, window.innerHeight);
        };
      })(this));
      $('#ui').show();
      this.loop();
    }

    Demo.prototype.selectRenderer = function(renderer) {
      this.selectedRenderer = renderer;
      this.selectedRenderer.setVoxelScene(this.controller.selectedScene);
      this.selectedRenderer.setSize(window.innerWidth, window.innerHeight);
      if (this.selectedRenderer === this.renderer3d) {
        this.flagShowRenderer3d = true;
        this.flagShowRendererIsometric = false;
        $('#isometric').removeClass('selected');
        return $('#threeD').addClass('selected');
      } else {
        this.flagShowRendererIsometric = true;
        this.flagShowRenderer3d = false;
        $('#threeD').removeClass('selected');
        return $('#isometric').addClass('selected');
      }
    };

    Demo.prototype.loop = function() {
      setTimeout((function(_this) {
        return function() {
          return requestAnimationFrame(_this.loop, null);
        };
      })(this), Math.floor(1000 / this.targetFrameRate));
      if (!this.paused) {
        this.controller.update();
      } else {
        if (this.oneFrameFlag) {
          this.oneFrameFlag = false;
          this.controller.update();
        }
      }
      this.selectedRenderer.render();
      if (this.flagShowRenderer3d) {
        this.flagShowRenderer3d = this.flagShowRendererIsometric = false;
        $('#canvasIso').hide();
        return $('#canvas3d').show();
      } else if (this.flagShowRendererIsometric) {
        this.flagShowRenderer3d = this.flagShowRendererIsometric = false;
        $('#canvas3d').hide();
        return $('#canvasIso').show();
      }
    };

    return Demo;

  })();
  return Demo;
});

//# sourceMappingURL=Demo.js.map
