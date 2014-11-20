
/*
ThreeRenderer

    Renders voxel scene in 3D using THREE.js

    Naive implementation which uses a limited number of mesh objects attached to scene graph,
    which are moved and made visible as needed.
 */
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(function(require) {
  "use strict";
  var BaseRenderer, THREE, ThreeRenderer, Util3;
  THREE = require('three');
  Util3 = require('voxel/Util3');
  BaseRenderer = require('voxel/renderers/BaseRenderer');
  ThreeRenderer = (function(_super) {
    var cubes, hash, hashMax, hashMultX, hashMultY, holderOffsetX, holderOffsetY, holderOffsetZ, numAdded;

    __extends(ThreeRenderer, _super);

    ThreeRenderer.prototype.threeScene = void 0;

    ThreeRenderer.prototype.camera = void 0;

    ThreeRenderer.prototype.threeRenderer = void 0;

    ThreeRenderer.prototype.ambientLight = void 0;

    ThreeRenderer.prototype.pointLight = void 0;

    ThreeRenderer.prototype.holder = void 0;

    holderOffsetX = void 0;

    holderOffsetY = void 0;

    holderOffsetZ = void 0;

    ThreeRenderer.prototype.holderQuat = new THREE.Quaternion();

    ThreeRenderer.prototype.holderEuler = new THREE.Euler(0, 0, 0, "XYZ");

    cubes = [];

    numAdded = void 0;

    hash = [];

    hashMultX = void 0;

    hashMultY = void 0;

    hashMax = void 0;

    ThreeRenderer.prototype.mouseRatioX = 0;

    ThreeRenderer.prototype.mouseRatioY = 0;

    function ThreeRenderer(canvas, voxelScene, maxX, maxY, maxZ, updateFunction) {
      this.maxX = maxX;
      this.maxY = maxY;
      this.maxZ = maxZ;
      if (updateFunction == null) {
        updateFunction = null;
      }
      this.onCanvasMouseMove = __bind(this.onCanvasMouseMove, this);
      this.setVoxelNoHash = __bind(this.setVoxelNoHash, this);
      this.setVoxelHashed = __bind(this.setVoxelHashed, this);
      this.initCubes = __bind(this.initCubes, this);
      ThreeRenderer.__super__.constructor.call(this, canvas, voxelScene, this.maxX, this.maxY, this.maxZ, updateFunction);
      holderOffsetX = this.maxX / -2;
      holderOffsetY = this.maxY / -2;
      holderOffsetZ = this.maxZ / -2;
      hashMultX = (this.maxY + 1) * (this.maxZ + 1);
      hashMultY = this.maxZ + 1;
      hashMax = (this.maxY + 1) * (this.maxZ + 1) * (this.maxX + 1);
      this.useHashedSetVoxelFunction(false);
      this.init3d();
      this.initCubes();
      this.setSize(800, 600);
      $(this._canvas).mousemove(this.onCanvasMouseMove);
    }

    ThreeRenderer.prototype.init3d = function() {
      var distance, fallOff, h, w;
      if (Util3.supportsWebGl()) {
        this.threeRenderer = new THREE.WebGLRenderer({
          canvas: this._canvas,
          antialias: true
        });
      } else {
        this.threeRenderer = new THREE.CanvasRenderer({
          canvas: this._canvas,
          antialias: true
        });
      }
      this.threeRenderer.setClearColor(0x202020, 1);
      w = window.innerWidth;
      h = window.innerHeight;
      this.camera = new THREE.PerspectiveCamera(37, w / h, 0.1, 1000);
      distance = (this.maxZ * .5) + (this.maxY * 1.5);
      this.camera.position.set(0, 0, distance);
      this.threeScene = new THREE.Scene();
      this.ambientLight = new THREE.AmbientLight(0xffffff);
      this.threeScene.add(this.ambientLight);
      fallOff = new THREE.Vector3(this.maxX, this.maxY, this.maxZ).length() * 2;
      this.pointLight = new THREE.PointLight(0xffffff, 1, fallOff);
      this.pointLight.position.set(this.camera.position.x, this.camera.position.y, this.camera.position.z);
      this.threeScene.add(this.pointLight);
      this.holder = new THREE.Object3D();
      return this.threeScene.add(this.holder);
    };

    ThreeRenderer.prototype.initCubes = function() {
      var geometry, i, material, num, voxelSize, _i, _results;
      voxelSize = 0.95;
      geometry = new THREE.BoxGeometry(voxelSize, voxelSize, voxelSize);
      cubes = [];
      num = 10000;
      _results = [];
      for (i = _i = 0; 0 <= num ? _i < num : _i > num; i = 0 <= num ? ++_i : --_i) {
        material = new THREE.MeshPhongMaterial({
          ambient: 0x444444,
          color: 0xcccccc,
          shading: THREE.FlatShading,
          specular: 0xffffff,
          shininess: 2
        });
        cubes[i] = new THREE.Mesh(geometry, material);
        _results.push(this.holder.add(cubes[i]));
      }
      return _results;
    };


    /*
          public
          Used to avoid placing more than one cube at the same point
          Incurs overhead but limits overdraw
     */

    ThreeRenderer.prototype.useHashedSetVoxelFunction = function(b) {
      if (b) {
        return this._setVoxelFunction = this.setVoxelHashed;
      } else {
        return this._setVoxelFunction = this.setVoxelNoHash;
      }
    };

    ThreeRenderer.prototype.setSize = function(width, height) {
      this.threeRenderer.setSize(width, height);
      this.camera.aspect = width / height;
      return this.camera.updateProjectionMatrix();
    };

    ThreeRenderer.prototype.renderStart = function() {
      ThreeRenderer.__super__.renderStart.call(this);
      numAdded = 0;
      return hash = [];
    };

    ThreeRenderer.prototype.renderEnd = function() {
      var i, _i, _ref;
      ThreeRenderer.__super__.renderEnd.call(this);
      for (i = _i = numAdded, _ref = cubes.length; numAdded <= _ref ? _i < _ref : _i > _ref; i = numAdded <= _ref ? ++_i : --_i) {
        cubes[i].visible = false;
      }
      if (numAdded >= cubes.length) {
        console.log('warning - reached voxel limit', cubes.length);
      }
      this.updateCamera();
      return this.threeRenderer.render(this.threeScene, this.camera);
    };

    ThreeRenderer.prototype.setVoxelHashed = function(x, y, z, color, color2) {
      var index, v;
      x = Math.round(x);
      y = Math.round(y);
      z = Math.round(z);
      if (x < 0 || y < 0 || z < 0 || x > this.maxX || y > this.maxY || z > this.maxZ) {
        return false;
      }
      if (numAdded >= cubes.length) {
        return false;
      }
      index = x * hashMultX + y * hashMultY + z;
      if (hash[index]) {
        return false;
      }
      hash[index] = true;
      v = cubes[numAdded++];
      v.visible = true;
      v.position.set(x + holderOffsetX, y + holderOffsetY, z + holderOffsetZ);
      v.material.color.setHex(color);
      v.material.ambient.setHex = color2;
      return true;
    };

    ThreeRenderer.prototype.setVoxelNoHash = function(x, y, z, color, color2) {
      var v;
      x = Math.round(x);
      y = Math.round(y);
      z = Math.round(z);
      if (x < 0 || y < 0 || z < 0 || x > this.maxX || y > this.maxY || z > this.maxZ) {
        return false;
      }
      if (numAdded >= cubes.length) {
        return false;
      }
      v = cubes[numAdded++];
      v.visible = true;
      v.position.set(x + holderOffsetX, y + holderOffsetY, z + holderOffsetZ);
      v.material.color.setHex(color);
      v.material.ambient.setHex(color2);
      return true;
    };

    ThreeRenderer.prototype.updateCamera = function() {
      this.holderEuler.y = this.mouseRatioX * (-90 * Util3.DEG);
      this.holderEuler.x = this.mouseRatioY * (-90 * Util3.DEG);
      this.holderQuat.setFromEuler(this.holderEuler);
      return this.holder.rotation.setFromQuaternion(this.holderQuat);
    };

    ThreeRenderer.prototype.onCanvasMouseMove = function(je) {
      this.mouseRatioX = je.clientX / $(this._canvas).width();
      this.mouseRatioX = this.mouseRatioX * 2 - 1;
      this.mouseRatioY = je.clientY / $(this._canvas).height();
      return this.mouseRatioY = this.mouseRatioY * 2 - 1;
    };

    return ThreeRenderer;

  })(BaseRenderer);
  return ThreeRenderer;
});

//# sourceMappingURL=ThreeRenderer.js.map
