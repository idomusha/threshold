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
        var classes = _this.$html.attr('class').split(' ').filter(function(c) {
          return c.lastIndexOf(_this.settings.name, 0) !== 0;
        });
        _this.$html.attr('class', $.trim(classes.join(' ')));
      } else {
        _this.$html.removeAttr('data-' + _this.settings.name);
      }

      if (reset) {
        _this.set();
      }
    },

    set: function() {
      if (this._debug) console.log('########### set()');
      var _this = this;

      //_this.width = (window.innerWidth > 0) ? window.innerWidth : screen.width;

      // This will prevent JavaScript from calculating pixels for the child element.
      /*$('.width-full').hide();
       _this.width = $('.width-fixed').eq(0).css('width');
       $('.width-full').attr('style', function(i, style) {
       return style.replace(/display[^;]+;?/g, '');
       });*/

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
            console.log('match: ',  _this.state = name);
            _this.state = name;
          }
          /*if (_this.width === width) {
           _this.state = name;
           }*/
        }
      }

      //if (this._debug) console.log('width:', _this.width);
      if (this._debug) console.log('previousState:', _this.previousState);
      if (this._debug) console.log('state:', _this.state);
      if (this._debug) console.log('callbacks:', _this.callbacks);

      if (_this.settings.class) {
        _this.$html.addClass(_this.settings.name + '-' + _this.state);
      } else {
        _this.$html.attr('data-' + _this.settings.name, _this.state);
      }

      if (_this.previousState !== _this.state) {
        _this.onChange.call(_this);
      } else {
        _this.previousState = _this.state;
      }

    },

    onChange: function() {
      if (this._debug) console.log('########### onChange()');
      var _this = this;

      if (this._debug) console.log('state: ' + _this.state);
      if (_this.callbacks[_this.state] !== undefined) {
        _this.call(_this.callbacks[_this.state]);
      }

      if (_this.callbacks.all !== undefined) {
        _this.call(_this.callbacks.all);
      }

      _this.previousState = _this.state;
    },

    call: function(state) {
      if (this._debug) console.log('########### onChange()');

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

      // checks if state is an array
      if (state instanceof Array) {
        for (var i = 0; i < state.length; i++) {
          _this.after(state[i], callback);
        }

        return;
      }

      // checks if state is a valid state (in default settings)
      if (_this.settings.ranges.hasOwnProperty(state) || state === 'all') {
        _this.store(state, callback);
      }

      if (this._debug) console.log('for', state);
      if (this._debug) console.log('callbacks', _this.callbacks);
      if (state === _this.state || state === 'all') {
        // Clear prev counter, if exist.
        if (_this.interval != null) {
          clearInterval(this.interval);
        }

        // init timer
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

    store: function(state, callback) {
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
    name: 'window',
    ranges: {
      'x-large': ['1600px', -1],      // '1480px'
      large: ['1440px', '1599px'],  // '1360px'
      medium: ['1280px', '1439px'], // '1220px'
      small: ['960px', '1279px'],   // '920px'
      'x-small': ['760px', '959px'],  //'740px',
      mobile: [-1,'759px'],         //'100%',
    },
    class: false,
    debug: false,
  };

})(jQuery, window, document);
