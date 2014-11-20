
/*
Model

	A collection of view objects
 */
define(function(require) {
  "use strict";
  var $, BaseObj, FastBox, FastSphere, Model, Point, Shared, THREE, TransBitmap, TransBox, TransDisc, TransObj, TransRect, TransSphere, Util3;
  $ = require('jquery');
  THREE = require('three');
  Util3 = require('voxel/Util3');
  BaseObj = require('voxel/objects/BaseObj');
  TransObj = require('voxel/objects/TransObj');
  Point = require('voxel/objects/Point');
  FastSphere = require('voxel/objects/FastSphere');
  TransSphere = require('voxel/objects/TransSphere');
  TransDisc = require('voxel/objects/TransDisc');
  TransBox = require('voxel/objects/TransBox');
  TransRect = require('voxel/objects/TransRect');
  FastBox = require('voxel/objects/FastBox');
  TransBitmap = require('voxel/objects/TransBitmap');
  Shared = require('demo/Shared');
  Model = (function() {
    function Model() {
      var i, paths, pos, s, sub, _i;
      this.sceneTest = new THREE.Scene();
      this.testHolder = new BaseObj(new THREE.Vector3(Math.floor(Shared.VOXELS_MAX_X / 2), Math.floor(Shared.VOXELS_MAX_Y / 2), Math.floor(Shared.VOXELS_MAX_Z / 2)));
      this.testHolder.rotation.x = 15 * Util3.DEG;
      this.testHolder.rotation.z = 10 * Util3.DEG;
      this.sceneTest.add(this.testHolder);
      if (false) {
        this.testTransBox = new TransBox(new THREE.Vector3(1, 2, 3), 0xaaaa00, new THREE.Vector3(5, 6, 7));
        this.testTransBox.isSolid = false;
        this.testTransBox.rotation.y = 30 * Util3.DEG;
        this.testTransBox.scale.x = 2.5;
        this.testTransBox.scale.y = 1.3;
        this.testTransBox.scale.z = 3;
        this.testHolder.add(this.testTransBox);
      }
      if (false) {
        this.testSphere = new TransSphere(new THREE.Vector3(1, 2, 3), 0xff8888, 8);
        this.testSphere.scale.y = 1.5;
        this.testSphere.scale.x = .38;
        this.testSphere.isSolid = false;
        this.testHolder.add(this.testSphere);
      }
      if (false) {
        this.testDisc = new TransDisc(new THREE.Vector3(5, 2, 1), 0x00ffff, 5);
        this.testDisc.scale.z = 2.2;
        this.testHolder.add(this.testDisc);
      }
      if (true) {
        this.testRect = new TransRect(new THREE.Vector3(2, 2, 1), 0xffff00, new THREE.Vector2(5, 10));
        this.testRect.rotation.z = 45 * Util3.DEG;
        this.testRect.rotation.x = 45 * Util3.DEG;
        this.testRect.scale.y = 1.5;
        this.testRect.scale.x = 2.2;
        this.testHolder.add(this.testRect);
      }
      this.sceneSphere = new THREE.Scene();
      this.pulsingSphere = new FastSphere(new THREE.Vector3(15, Shared.VOXELS_MAX_Y * .5, Shared.VOXELS_MAX_Z * .5), 0xaa0000, 15);
      this.sceneSphere.add(this.pulsingSphere);
      this.sceneRot = new THREE.Scene();
      pos = new THREE.Vector3(Math.floor(Shared.VOXELS_MAX_X * 0.5), Math.floor(Shared.VOXELS_MAX_Y * .5), Math.floor(Shared.VOXELS_MAX_Z * 0.5));
      this.rotParentBox = new TransBox(pos, 0x00aa00, new THREE.Vector3(6, 6, 6));
      this.rotParentBox.isSolid = false;
      this.sceneRot.add(this.rotParentBox);
      pos = new THREE.Vector3(Math.floor(Shared.VOXELS_MAX_X * 0.15), 0, 0);
      this.rotChildBox = new TransBox(pos, 0x4400aa, new THREE.Vector3(2.5, 2.5, 2.5));
      this.rotParentBox.add(this.rotChildBox);
      pos = new THREE.Vector3(Shared.VOXELS_MAX_X * 0.06, 0, 0);
      this.rotRect1 = new TransRect(pos, 0xff8800, new THREE.Vector3(3, 5));
      this.rotRect1.rotation.y = Util3.DEG * 90;
      this.rotChildBox.add(this.rotRect1);
      pos = new THREE.Vector3(Shared.VOXELS_MAX_X * -0.06, 0, 0);
      this.rotRect2 = new TransRect(pos, 0xff8800, new THREE.Vector3(3, 5));
      this.rotRect2.rotation.y = Util3.DEG * 90;
      this.rotChildBox.add(this.rotRect2);
      this.sceneBitmap = new THREE.Scene();
      pos = new THREE.Vector3(Math.floor(Shared.VOXELS_MAX_X * .5), Math.floor(Shared.VOXELS_MAX_Y * .5), Math.floor(Shared.VOXELS_MAX_Z * .5));
      this.bitmap = new TransBitmap(pos);
      this.sceneBitmap.add(this.bitmap);
      this.bitmap.autoAdvanceImage = false;
      paths = [];
      for (i = _i = 0; _i <= 24; i = ++_i) {
        sub = i < 10 ? '0' + i : i;
        s = 'img/karanokyoukai2_' + sub + '.png';
        paths.push(s);
      }
      this.bitmap.loadImageDatas(paths, (function(_this) {
        return function() {
          return Shared.eventBus.trigger('model-ready');
        };
      })(this));
    }

    return Model;

  })();
  return Model;
});

//# sourceMappingURL=Model.js.map
