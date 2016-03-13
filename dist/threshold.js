/*
 *  threshold - v1.0.0
 *  manages window width changes
 *  https://github.com/idomusha/threshold
 *
 *  Made by idomusha
 *  Under MIT License
 */
/*! matchMedia() polyfill - Test a CSS media type/query in JS. Authors & copyright (c) 2012: Scott Jehl, Paul Irish, Nicholas Zakas, David Knight. Dual MIT/BSD license */

window.matchMedia || (window.matchMedia = function() {
    "use strict";

    // For browsers that support matchMedium api such as IE 9 and webkit
    var styleMedia = (window.styleMedia || window.media);

    // For those that don't support matchMedium
    if (!styleMedia) {
        var style       = document.createElement('style'),
            script      = document.getElementsByTagName('script')[0],
            info        = null;

        style.type  = 'text/css';
        style.id    = 'matchmediajs-test';

        script.parentNode.insertBefore(style, script);

        // 'style.currentStyle' is used by IE <= 8 and 'window.getComputedStyle' for all other browsers
        info = ('getComputedStyle' in window) && window.getComputedStyle(style, null) || style.currentStyle;

        styleMedia = {
            matchMedium: function(media) {
                var text = '@media ' + media + '{ #matchmediajs-test { width: 1px; } }';

                // 'style.styleSheet' is used by IE <= 8 and 'style.textContent' for all other browsers
                if (style.styleSheet) {
                    style.styleSheet.cssText = text;
                } else {
                    style.textContent = text;
                }

                // Test if media query is true or false
                return info.width === '1px';
            }
        };
    }

    return function(media) {
        return {
            matches: styleMedia.matchMedium(media || 'all'),
            media: media || 'all'
        };
    };
}());

/*
 *  threshold - v0.3.2
 *  manages page width change
 *  https://github.com/idomusha/threshold
 *
 *  Made by idomusha
 *  Under MIT License
 */

;

(function($, window, document, undefined) {
  'use strict';

  var pluginName = 'threshold';

  function Plugin(options) {

    this._name = pluginName;

    this._defaults = window[ pluginName ].defaults;
    this.settings = $.extend({}, this._defaults, options);

    this._debug = this.settings.debug;
    if (this._debug) console.log('defaults', this._defaults);
    if (this._debug) console.log('settings', this.settings);

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
        if (this._debug) console.log('----------- resize' + '.' + _this._name);
        _this.reset();
      });
    },

    // Unbind events that trigger methods
    unbindEvents: function() {
      var _this = this;

      _this.window.off('.' + _this._name);
    },

    reset: function() {
      if (this._debug) console.log('########### reset()');
      var _this = this;

      _this.unset(true);
    },

    unset: function(reset) {
      if (this._debug) console.log('########### unset()');
      var _this = this;

      if (_this.settings.class) {
        if (_this.$html.attr('class') !== undefined) {
          var classes = _this.$html.attr('class').split(' ').filter(function(c) {
            return c.lastIndexOf(_this.settings.name, 0) !== 0;
          });

          _this.$html.attr('class', $.trim(classes.join(' ')));
        }
      } else {
        _this.$html.removeAttr('data-' + _this.settings.name);
      }

      if (reset) {
        _this.set();
      }
    },

    /**
     * set
     * after init or resize: change state
     */
    set: function() {
      if (this._debug) console.log('########### set()');
      var _this = this;

      var obj = _this.settings.ranges;
      for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
          if (this._debug) console.log(prop + ' = ' + obj[prop]);
          var name = prop;
          var width = obj[prop];
          var mq = 'only screen';
          mq += obj[prop][0] !== -1 ? ' and (min-width: ' + obj[prop][0] + ')' : '';
          mq += obj[prop][1] !== -1 ? ' and (max-width: ' + obj[prop][1] + ')' : '';
          if (matchMedia(mq).matches) {
            if (this._debug) console.log('match: ',  _this.state = name);
            _this.state = name;
          }
        }
      }

      if (this._debug) console.log('previousState:', _this.previousState);
      if (this._debug) console.log('state:', _this.state);
      if (this._debug) console.log('callbacks:', _this.callbacks);

      if (_this.settings.class) {
        _this.$html.addClass(_this.settings.name + '-' + _this.state);
      } else {
        _this.$html.attr('data-' + _this.settings.name, _this.state);
      }

      _this.check.call(_this);

    },

    /**
     * get
     * get callbacks
     */
    get: function() {
      if (this._debug) console.log('########### get()');
      var _this = this;

      if (this._debug) console.log('callbacks: ', _this.callbacks);

      var obj = _this.callbacks;
      for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
          var name = prop;
          var value = obj[prop];
          var _states = [];

          if (this._debug) console.log('name: ', name);
          if (this._debug) console.log('name.indexOf("|")', name.indexOf('|'));

          if (name.indexOf('|') !== -1) {
            for (var i = 0; i < name.split('|').length; i++) {
              _states.push(name.split('|')[i]);
              if (i === name.split('|').length - 1) {

                if (this._debug) console.log('previousState ', this.previousState);
                if (this._debug) console.log('_states ', _states);
                if (this._debug) console.log('_states.indexOf(_this.previousState) ', _states.indexOf(_this.previousState));

                if (_states.indexOf(_this.state) !== -1) {
                  if (_states.indexOf(_this.previousState) === -1 || _this.previousState === undefined) {
                    _this.call(_this.callbacks[name]);
                  }
                }
              }

            }
          } else {
            if (_this.callbacks[name] !== undefined && name === _this.state) {
              _this.call(_this.callbacks[name]);
            }
          }

        }
      }

      if (_this.callbacks.all !== undefined) {
        _this.call(_this.callbacks.all);
      }

    },

    /**
     * check
     * check if the current state has a callback to must be call
     */
    check: function() {
      if (this._debug) console.log('########### check()');
      var _this = this;

      if (_this.previousState !== undefined) {
        ;
        if (_this.previousState !== _this.state) {
          _this.onChange.call(_this);
        } else {
          _this.previousState = _this.state;
        }
      }
    },

    onChange: function() {
      if (this._debug) console.log('########### onChange()');
      var _this = this;

      if (this._debug) console.log('#####################');
      if (this._debug) console.log('state: ', _this.state);
      if (this._debug) console.log('#####################');

      _this.get();

      _this.previousState = _this.state;
    },

    call: function(state) {
      if (this._debug) console.log('########### call()');

      if (this._debug) console.log(state);
      $.each(state, function(i, v) {
        if (typeof v === 'function') {
          v.call();
        }
      });
    },

    after: function(state, callback) {
      if (this._debug) console.log('########### after()');
      var _this = this;
      var _valid = true;

      // checks if state is an array
      if (state instanceof Array) {

        var _states = [];
        for (var i = 0; i < state.length; i++) {

          var _state = state[i];

          // checks if state is a valid state (in default settings)
          if (!_this.settings.ranges.hasOwnProperty(state[i])) {
            _valid = false;
          }

          if (_state.indexOf('|') !== -1) {
            for (var i = 0; i < _state.split('|').length; i++) {

              if (!_this.settings.ranges.hasOwnProperty(_state.split('|')[i])) {
                _valid = false;
              }

              if (i === _state.split('|').length - 1 && _valid) {
                _this.store(_state, callback);
              }

            }
          } else if (/*i === state.length - 1 && */_valid) {
            //_state = state.join('|');
            _this.store(_state, callback);
          }

        }

      } else {

        // checks if state is a valid state (in default settings)
        if (state.indexOf('|') !== -1) {
          for (var i = 0; i < state.split('|').length; i++) {

            if (!_this.settings.ranges.hasOwnProperty(state.split('|')[i])) {
              _valid = false;
            }

            if (i === state.split('|').length - 1 && _valid) {
              _this.store(state, callback);
            }

          }
        } else if (_this.settings.ranges.hasOwnProperty(state) || state === 'all') {
          _this.store(state, callback);
        }

      }

      if (this._debug) console.log('for', state);
      if (this._debug) console.log('callbacks', _this.callbacks);
      if (state === _this.state || state === 'all') {
        // Clear prev counter, if exist.
        if (_this.interval != null) {
          clearInterval(this.interval);
        }

        // init timer : launch callbacks after the last 'after' method invoked
        _this.timer = 0;
        _this.interval = setInterval(function() {
          if (_this.timer == 1) {
            _this.onChange.call(_this);
            clearInterval(_this.interval);
            _this.interval = null;
          }

          _this.timer++;
        }.bind(_this), 100);

        // Important to .bind(this) so that context will remain consistent.
      }
    },

    store: function(state, callback, states) {
      if (this._debug) console.log('########### store()');
      var _this = this;

      // checks if one or more callbacks already exist
      if (_this.callbacks[state] === undefined) {
        _this.callbacks[state] = [];
      }

      // store callback
      _this.callbacks[state].push(callback);

    },

  });

  window[ pluginName ] = function(options) {
    if (!$.data(window, pluginName)) {
      $.data(window, pluginName, new Plugin(options));
    }
  };

  window[ pluginName ].defaults = {

    // breakpoints (minimum: 2)
    ranges: {
      'x-large': ['1600px', -1],      // '1480px'
      large: ['1440px', '1599px'],    // '1360px'
      medium: ['1280px', '1439px'],   // '1220px'
      small: ['960px', '1279px'],     // '920px'
      'x-small': ['760px', '959px'],  // '740px',
      mobile: [-1,'759px'],           // '100%',
    },

    // data attribute name (or class name prefix)
    name: 'window',

    // data attribute (false) or class (true)
    class: false,

    // debug mode
    debug: false,
  };

})(jQuery, window, document);
