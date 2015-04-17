"use strict";

var Base = require('superjs-base');
var SuperJS = require('superjs');
var colors = require('colors/safe');
var util = require('util');
var merge = require('recursive-merge');

module.exports = Base.extend(SuperJS.Meta, {

  _metaFile: function() {
    this._loadMeta(__filename);
  },

  init: function (app, options) {

    this.config = {
      prefix: '',
      styles: {
        debug: colors.cyan,
        error: colors.red,
        warning: colors.yellow,
        notice: colors.white,
        info: colors.gray,
        default: colors.grey
      },
      types: ['error', 'warning', 'notice', 'info', 'debug'],
      objectDepth: 1
    };

    this.configure(options)
  },

  configure: function(config) {

    config = config || {};

    if( typeof config.prefix === 'string' ) {
      this.config.prefix = config.prefix;
    }

    if( typeof config.types === 'object' ) {
      this.config.types = config.types;
    }

    if( typeof config.objectDepth === 'number' && config.objectDepth > 0 ) {
      this.config.objectDepth = config.objectDepth;
    }

    if( typeof config.styles === 'object' ) {
      for( var style in this.config.styles ) {
        if( typeof config.styles[style] === 'function' ) {
          this.config.styles[style] = config.styles[style];
        }
      }
    }
  },

  log: function(message,data) {
    if( this.config.types.indexOf('info') !== -1 ) {
      message = this.config.prefix + message;
      this.print(this.config.styles.default(message), data, console.log);
    }
  },

  info: function(message, data) {
    if( this.config.types.indexOf('info') !== -1 ) {
      message = this.config.prefix + message;
      this.print(this.config.styles.info(message), data, console.log);
    }
  },

  notify: function(message, data) {
    if( this.config.types.indexOf('notice') !== -1 ) {
      message = this.config.prefix+message;
      this.print(this.config.styles.notice(message), data, console.log);
    }
  },

  warn: function(message, data) {
    if( this.config.types.indexOf('warning') !== -1 ) {
      message = this.config.prefix+message;
      this.print(this.config.styles.warning(message), data, console.warn);
    }
  },

  error: function(message, data) {
    if( this.config.types.indexOf('error') !== -1 ) {
      message = this.config.prefix+message;
      this.print(this.config.styles.error(message), data, console.error);
    }
  },

  debug: function(message, data) {
    if( this.config.types.indexOf('debug') !== -1 ) {
      message = this.config.prefix+message;
      this.print(this.config.styles.debug(message), data, console.error);
    }
  },

  print: function( message, data, logMethod ) {

    if( typeof data === 'undefined' ) {
      logMethod(message);
    } else {
      try {
        logMethod(message, JSON.stringify(data));
      } catch (e) {
        logMethod(message, '"' + data + '"');
      }
    }

  },

  object: function(data) {
    this.debugPrint('',data,console.log);
  },

  debugPrint: function(message, data, logMethod) {

    logMethod = (logMethod) ? logMethod : console.log;

    if (typeof data === 'object' ) {
      try {
        logMethod(message);
        logMethod(util.inspect(data, {showHidden: true, colors: true, depth: this.config.objectDepth}));
      } catch (e) {
        logMethod(message, '"failed to inspect object"');
      }
    } else if( typeof data === 'function' ) {
      logMethod(message, util.inspect(data, {colors: true}));
    } else if( typeof data === 'string' ) {
      logMethod(message, '"' + data + '"');
    } else if( typeof data === 'number' || typeof data === 'boolean' ) {
      logMethod(message, data);
    } else {
      logMethod(message);
    }

  },

  break: function() {
    console.log("");
  }

});