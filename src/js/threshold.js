/**
 * threshold - v0.0.1
 * manages window width change
 *
 * Under MIT License
 */

;
(function($, window, document, undefined) {
  'use strict';

  var pluginName = 'Threshold';
  var debug;

  function Plugin(options) {

    this._name = pluginName;

    this._defaults = window[ pluginName ].defaults;
    this.settings = $.extend({}, this._defaults, options);

    debug = this.settings.debug;
    if (debug) console.log('defaults', this._defaults);
    if (debug) console.log('settings', this.settings);

    this.init();
  }

  $.extend(Plugin.prototype, {

    init: function() {
      var _this = this;
      _this.buildCache();
      _this.bindEvents();

      _this.callbacks = {};
      _this.set();
    },

    // Remove plugin instance completely
    destroy: function() {
      var _this = this;

      _this.unbindEvents();
      _this.unset();
      _this.window.removeData();
    },

    // Cache DOM nodes for performance
    buildCache: function() {
      var _this = this;

      _this.window = $(window);
      _this.$html = $('html');
    },

    // Bind events that trigger methods
    bindEvents: function() {
      var _this = this;

      _this.window.on('resize' + '.' + _this._name, function() {
        if (debug) console.log('----------- resize' + '.' + _this._name);
        _this.reset();
      });
    },

    // Unbind events that trigger methods
    unbindEvents: function() {
      var _this = this;

      _this.window.off('.' + _this._name);
    },

    reset: function() {
      if (debug) console.log('########### reset()');
      var _this = this;

      _this.unset(true);
    },

    unset: function(reset) {
      if (debug) console.log('########### unset()');
      var _this = this;

      var classes = _this.$html.attr('class').split(' ').filter(function(c) {
        return c.lastIndexOf(_this.settings.class, 0) !== 0;
      });

      _this.$html.attr('class', $.trim(classes.join(' ')));

      if (reset) {
        _this.set();
      }
    },

    set: function() {
      if (debug) console.log('########### set()');
      var _this = this;

      // This will prevent JavaScript from calculating pixels for the child element.
      $('.width-full').hide();
      _this.width = $('.width-fixed').eq(0).css('width');
      $('.width-full').show();

      var obj = _this.settings.widths;
      for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
          if (debug) console.log(prop + ' = ' + obj[prop]);
          var name = prop;
          var width = obj[prop];
          if (_this.width === width) {
            _this.state = name;
          }
        }
      }

      if (debug) console.log('width:', _this.width);
      if (debug) console.log('previousState:', _this.previousState);
      if (debug) console.log('state:', _this.state);
      if (debug) console.log('callbacks:', _this.callbacks);

      _this.$html.addClass(_this.settings.class + '-' + _this.state);

      if (_this.previousState !== _this.state) {
        _this.onChange.call(_this);
      } else {
        _this.previousState = _this.state;
      }

    },

    onChange: function() {
      if (debug) console.log('########### onChange()');
      var _this = this;

      if (debug) console.log('state: ' + _this.state);
      if (_this.callbacks[_this.state] !== undefined) {
        if (debug) console.log(_this.callbacks[_this.state]);
        $.each(_this.callbacks[_this.state], function(i, v) {
          if (typeof v === 'function') {
            v.call();
          }
        });
      }

      _this.previousState = _this.state;
    },

    after: function(state, callback) {
      if (debug) console.log('########### after()');
      var _this = this;

      // checks if state is an array
      if (state instanceof Array) {
        for (var i = 0; i < state.length; i++) {
          _this.after(state[i], callback);
        }
        return;
      }

      // checks if state is a valid state (in default settings)
      if (_this.settings.widths.hasOwnProperty(state)) {
        // checks if one or more callbacks already exist
        if (_this.callbacks[state] === undefined) {
          _this.callbacks[state] = [];
        }
        // store callback
        _this.callbacks[state].push(callback);
      }

      if (debug) console.log('for', state);
      if (debug) console.log('callbacks', _this.callbacks);
      if (state === _this.state) {
        _this.onChange.call(_this);
      }
    },

  });

  window[ pluginName ] = function(options) {
    if (!$.data(window, pluginName)) {
      $.data(window, pluginName, new Plugin(options));
    }
  };

  window[ pluginName ].defaults = {
    class: 'window',
    widths: {
      'mobile': '100%',
      'x-small': '740px',
      'small': '920px',
      'medium': '1220px',
      'large': '1360px',
      'x-large': '1480px',
    },
    debug: true,
  };

})(jQuery, window, document);
