
/*
Controller

	Logic for controlling objects in the scene, etc.
    Should not be concerned with renderer details
 */
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

define(function(require) {
  "use strict";
  var $, Controller, Shared, THREE, Util3;
  $ = require('jquery');
  THREE = require('three');
  Util3 = require('voxel/Util3');
  Shared = require('demo/Shared');
  Controller = (function() {
    var _bitmapCount, _count, _linkSceneBitmap, _linkSceneRot, _linkSceneSphere, _model, _ui;

    Controller.prototype.selectedScene = void 0;

    _model = void 0;

    _count = 0;

    _bitmapCount = 0;

    _linkSceneSphere = $('#sceneSphere');

    _linkSceneRot = $('#sceneRot');

    _linkSceneBitmap = $('#sceneBitmap');

    _ui = $('#ui');

    function Controller(pModel) {
      this.onKeyPress = __bind(this.onKeyPress, this);
      var testing;
      _model = pModel;
      testing = false;
      if (testing) {
        this.selectScene(_model.sceneTest);
      } else {
        this.selectScene(_model.sceneSphere);
      }
      $(document).keypress(this.onKeyPress);
      _linkSceneSphere.click((function(_this) {
        return function() {
          return _this.selectScene(_model.sceneSphere);
        };
      })(this));
      _linkSceneRot.click((function(_this) {
        return function() {
          return _this.selectScene(_model.sceneRot);
        };
      })(this));
      _linkSceneBitmap.click((function(_this) {
        return function() {
          return _this.selectScene(_model.sceneBitmap);
        };
      })(this));
    }

    Controller.prototype.update = function() {
      var foo, mult, radius, sca, x;
      switch (this.selectedScene) {
        case _model.sceneTest:
          if (_model.testTransBox != null) {
            foo = 0;
          }
          if (_model.testSphere != null) {
            foo = 0;
          }
          if (_model.testDisc != null) {
            _model.testDisc.scale.x = 1 + Math.abs(Math.sin(_count * Util3.DEG * 6) * 2.5);
            _model.testDisc.rotation.x += Util3.DEG * 8;
            _model.testDisc.rotation.y += Util3.DEG * 2;
          }
          if (_model.testRect != null) {
            _model.testRect.scale.x = 1 + Math.abs(Math.sin(_count * Util3.DEG * 6) * 2.5);
            _model.testRect.rotation.x += Util3.DEG * 8;
            _model.testRect.rotation.y += Util3.DEG * 2;
          }
          break;
        case _model.sceneRot:
          x = Shared.VOXELS_MAX_X / 2 + Shared.VOXELS_MAX_X * 0.1 * Math.sin(_count * 4 * Util3.DEG);
          _model.rotParentBox.position.x = x;
          sca = 0.66 + Math.abs(Math.sin(_count * 3 * Util3.DEG)) * 1.33;
          _model.rotParentBox.scale.x = _model.rotParentBox.scale.y = _model.rotParentBox.scale.z = sca;
          _model.rotParentBox.rotateOnAxis(new THREE.Vector3(0, 0, 1), Util3.DEG * -3);
          _model.rotChildBox.rotateOnAxis(new THREE.Vector3(0, 0, 1), Util3.DEG * -6.5);
          _model.rotRect1.rotateOnAxis(new THREE.Vector3(0, 0, 1), Util3.DEG * 30);
          _model.rotRect2.rotateOnAxis(new THREE.Vector3(0, 0, 1), Util3.DEG * 30);
          break;
        case _model.sceneSphere:
          mult = Math.sin(_count * Util3.DEG * 3);
          mult = mult * mult;
          radius = 1 + mult * 12;
          _model.pulsingSphere.setRadius(radius);
          x = _model.pulsingSphere.position.x + 0.3;
          if (x > Shared.VOXELS_MAX_X + _model.pulsingSphere.getRadius()) {
            x = _model.pulsingSphere.getRadius() * -1;
          }
          _model.pulsingSphere.position.x = x;
          break;
        case _model.sceneBitmap:
          _model.bitmap.scaleX = _model.bitmap.scaleY = _model.bitmap.scaleZ = 3;
          _model.bitmap.tick();
          if (_bitmapCount % 60 < 18) {
            _model.bitmap.rotation.z -= Util3.DEG * 5;
          }
          if (_bitmapCount % 180 >= 18 && _count % 180 < 18 + 18) {
            _model.bitmap.rotation.x -= Util3.DEG * 5;
          }
          _bitmapCount++;
      }
      return _count++;
    };

    Controller.prototype.getModel = function() {
      return _model;
    };

    Controller.prototype.selectScene = function(scene) {
      this.selectedScene = scene;
      Shared.eventBus.trigger('selectedscene-changed');
      _linkSceneSphere.removeClass('selected');
      _linkSceneRot.removeClass('selected');
      _linkSceneBitmap.removeClass('selected');
      switch (scene) {
        case _model.sceneSphere:
          return _linkSceneSphere.addClass('selected');
        case _model.sceneRot:
          return _linkSceneRot.addClass('selected');
        case _model.sceneBitmap:
          return _linkSceneBitmap.addClass('selected');
      }
    };

    Controller.prototype.onKeyPress = function(je) {
      switch (je.originalEvent.keyCode) {
        case 114:
          return Shared.eventBus.trigger('select-next-renderer');
        case 115:
          switch (this.selectedScene) {
            case _model.sceneSphere:
              this.selectScene(_model.sceneRot);
              break;
            case _model.sceneRot:
              this.selectScene(_model.sceneBitmap);
              break;
            case _model.sceneBitmap:
              this.selectScene(_model.sceneSphere);
              break;
            default:
              this.selectScene(_model.sceneSphere);
          }
          return Shared.eventBus.trigger('selectedscene-changed');
        case 32:
          return Shared.eventBus.trigger('toggle-pause');
        case 13:
          return Shared.eventBus.trigger('one-frame');
      }
    };

    return Controller;

  })();
  return Controller;
});

//# sourceMappingURL=Controller.js.map
