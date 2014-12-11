/*!
 * Vanillay Mask
 * https://github.com/carlosrberto/VanillaMask
 *
 * Copyright (c) 2014 Carlos Roberto Gomes Junior
 *
 * Licensed under MIT License
 *
 * Version: 0.1
 */

(function(global){
    var $ = global.jQuery || false;

    var addEvent = function(evnt, elem, func) {
        if (elem.addEventListener)  // W3C DOM
            elem.addEventListener(evnt,func,false);
        else if (elem.attachEvent) { // IE DOM
            elem.attachEvent("on"+evnt, func);
        }
        else {
            elem[evnt] = func;
        }
    };

    var VanillaMask = function(input, options) {
        var that = this;

        if (!input || !options) {
            return;
        }

        if ($ && input instanceof $) {
            this.jquery = true;
            this.$input = input;
            this.input = input.get(0);
        } else {
            this.jquery = false;
            this.input = input;
        }
        this.options = options;
        this.placeholderChar = /[0-9a-zA-Z]/;
        this.masks = options.masks;
        this.render();
        addEvent('keyup', this.input, function(event){
            var code = event.keyCode || event.which;
            if(code != 37 && code != 39){
                that.render();
            }
        });
    };

    VanillaMask.prototype = {
        _getMaskPartial: function(mask, length){
            var resultMask = "";
            var placeholderCount = 0;
            for(var i=0; i< mask.length; i++) {
                resultMask += mask.charAt(i);
                if(mask.charAt(i).match(this.placeholderChar)) {
                    placeholderCount++;
                }

                if(placeholderCount == length){
                    break;
                }
            }

            return resultMask;
        },

        _getLargerMask: function() {
            if (this.masks.length > 1) {
                return this.masks[0].length > this.masks[1].length ? this.masks[0] : this.masks[1];
            } else {
                return this.masks[0];
            }
        },

        _getLowerMask: function() {
            if (this.masks.length > 1) {
                return this.masks[0].length < this.masks[1].length ? this.masks[0] : this.masks[1];
            } else {
                return this.masks[0];
            }
        },

        _getMaskPositions: function(mask){
            var placeholders = mask.replace(/\D/g, '');
            return placeholders.length;
        },

        _getMask: function(value) {
            if(this.masks.length === 1) {
                return this.masks[0];
            } else {
                var largeMask = this._getLargerMask();
                var lowerMask = this._getLowerMask();
                var largeMaskPos = this._getMaskPositions(largeMask);
                return value.length < largeMaskPos ? lowerMask : largeMask;
            }
        },

        render: function() {
            var valOriginal = this.input.value.replace(/\D/g, '');
            var mask = this._getMask(valOriginal);
            var maskPartial = this._getMaskPartial(mask, valOriginal.length);
            var originalPos = 0;
            var finalValue = "";

            for(var i=0; i<maskPartial.length; i++) {
                if(maskPartial.charAt(i).match(this.placeholderChar)) {
                    finalValue += valOriginal.charAt(originalPos);
                    originalPos++;
                } else {
                    finalValue += maskPartial.charAt(i);
                }
            }

            if(valOriginal === "") {
                finalValue = "";
            }

            if (this._getMaskPositions(mask) === valOriginal.length) {
                var args = [valOriginal, this.input, mask];
                if (typeof this.options.onComplete === 'function') {
                    this.options.onComplete.apply(this, args);
                }

                if (this.jquery) {
                    this.$input.trigger('complete.VanillaMask', args);
                }
            }

            this.input.value = finalValue;
        }
    };

    if ($) {
        $.fn.VanillaMask = function( method ) {
            var args = arguments;

            return this.each(function() {
                if ( !$.data(this, 'VanillaMask') ) {
                    $.data(this, 'VanillaMask', new VanillaMask($(this), method));
                    return;
                }

                var api = $.data(this, 'VanillaMask');

                if ( typeof method === 'string' && method.charAt(0) !== '_' && api[ method ] ) {
                    api[ method ].apply( api, Array.prototype.slice.call( args, 1 ) );
                } else {
                    $.error( 'Method ' +  method + ' does not exist on jQuery.VanillaMask' );
                }
            });
        };
    }

    global.VanillaMask = VanillaMask;
})(window);
