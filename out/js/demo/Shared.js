
/*
Shared
    Constants, etc.
    Static class
 */
define(function(require) {
  "use strict";
  var $, Shared;
  $ = require('jquery');
  Shared = (function() {
    function Shared() {}

    Shared.VOXELS_MAX_X = 70;

    Shared.VOXELS_MAX_Y = 70;

    Shared.VOXELS_MAX_Z = 70;

    Shared.eventBus = void 0;

    Shared.init = function() {
      var el;
      el = $('<div id="eventbus" style="display:none;"></div>');
      $('body').append(el);
      Shared.eventBus = el;
    };

    return Shared;

  })();
  return Shared;
});

//# sourceMappingURL=Shared.js.map
