
(function (factory) {
    "use strict";

    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        factory(require('jquery'));
    } else {
        factory(jQuery);
    }
}(function ($) {
    "use strict";

    // Default settings
    var defaults = {
        className:     '',
        text:          'Drop Image',
        previewImage:  true,
        value:         null,
        classes: {
            main:      'dropzone',
            hint:      'dropzone-hint',
			inner:     'dropzone-inner',
            enter:     'dropzone-enter',
            reject:    'dropzone-reject',
            accept:    'dropzone-accept',
            focus:     'dropzone-focus'
        },
        validators: {
            maxSize:   null,
            width:     null,
            maxWidth:  null,
            minWidth:  null,
            height:    null,
            maxHeight: null,
            minHeight: null
        },
        init:   function() {},
        enter:  function() {},
        leave:  function() {},
        reject: function() {},
        accept: function() {},
        format: function(filename) {
            return filename;
        }
    };

    // Main plugin
    $.dropzone = function(element, options) {
        this.settings = $.extend(true, {}, defaults, $.dropzone.defaults, options);
        this.$input   = $(element);
        var self      = this,
            settings  = self.settings,
            $input    = self.$input;

        if (!$input.is('input[type="file"]')) {
            return;
        }

        // Stop if not compatible with HTML5 file API
        if (!$.dropzone.isBrowserCompatible()) {
            return;
        }

        // private: Init the plugin
        var init = function() {
            var $dropzone, $container, value;

            // Build the container
            $container = $('<div class="' + settings.classes.main + '" />')

                .on('dragover.dropzone', function() {
                    $(this).addClass(settings.classes.enter);

                    if ($.isFunction(settings.enter)) {
                        settings.enter.apply(this);
                    }
                })

                .on('dragleave.dropzone', function() {
                    $(this).removeClass(settings.classes.enter);

                    if ($.isFunction(settings.leaved)) {
                        settings.leaved.apply(this);
                    }
                })

                .addClass(settings.className);

            // Build the whole dropzone
            $input
                .wrap($container)
                .before('<div class="' + settings.classes.inner + '"><div  class="' + settings.classes.hint + '"><div><i class="fa fa-fw"></i></div>' + settings.text + '</div></div>');

            $dropzone = $input.parent('.' + settings.classes.main);

            // Preview a file at start if it's defined
            value = settings.value || $input.data('value');

            if (value) {
                self.preview(value);
            }

            // Trigger the init callback
            if ($.isFunction(settings.init)) {
                settings.init.apply($input, [ value ]);
            }

            // Events on the input
            $input

                .on('focus.dropzone', function() {
                    $dropzone.addClass(settings.classes.focus);
                })

                .on('blur.dropzone', function() {
                    $dropzone.removeClass(settings.classes.focus);
                })

                .on('change.dropzone', function() {

                    var file = this.files[0];

                    // No file, so user has cancelled
                    if (!file) {
                        return;
                    }

                    // Info about the dropped or selected file
                    var basename  = file.name.replace(/\\/g,'/').replace( /.*\//, ''),
                        extension = file.name.split('.').pop(),
                        formatted = settings.format(basename);

                    file.extension = extension;

                    // Mime-Types
                    var allowed  = $input.attr('accept'),
                        accepted = false,
                        valid    = true,
                        errors   = {
                            'mimeType':  false,
                            'maxSize':   false,
                            'width':     false,
                            'minWidth':  false,
                            'maxWidth':  false,
                            'height':    false,
                            'minHeight': false,
                            'maxHeight': false
                        };

                    // Check the accepted Mime-Types from the input file
                    if (allowed) {
                        var types = allowed.split(/[,|]/);

                        $.each(types, function(i, type) {
                            type = $.trim(type);

                            if ('.' + extension === type) {
                                accepted = true;
                                return false;
                            }

                            if (file.type === type) {
                                accepted = true;
                                return false;
                            }

                            // Mime-Type with wildcards ex. image/*
                            if (type.indexOf('/*') !== false) {
                                var a = type.replace('/*', ''),
                                    b = file.type.replace(/(\/.*)$/g, '');

                                if (a === b) {
                                    accepted = true;
                                    return false;
                                }
                            }
                        });

                        if (accepted === false) {
                            errors.mimeType = true;
                        }
                    } else {
                        accepted = true;
                    }

                    // Reset the accepted / rejected classes
                    $dropzone.removeClass(settings.classes.reject + ' ' + settings.classes.accept);

                    // If the Mime-Type is not accepted
                    if (accepted !== true) {
                        $input.val('');

                        $dropzone.addClass(settings.classes.reject);

                        // Trigger the reject callback
                        if ($.isFunction(settings.reject)) {
                            settings.reject.apply($input, [ file, errors ]);
                        }
                        return false;
                    }

                    // Read the added file
                    var reader = new FileReader(file);

                    reader.readAsDataURL(file);

                    reader.onload = function(e) {
                        var img = new Image(),
                            isImage;

                        file.data = e.target.result;
                        img.src   = file.data;

                        setTimeout(function() {
                            isImage = (img.width && img.height);

                            // Validator
                            if (settings.validators.maxSize && file.size > settings.validators.maxSize) {
                                valid = false;
                                errors.maxSize = true;
                            }

                            if (isImage) {
                                file.width  = img.width;
                                file.height = img.height;

                                if (settings.validators.width && img.width !== settings.validators.width) {
                                    valid = false;
                                    errors.width = true;
                                }

                                if (settings.validators.maxWidth && img.width > settings.validators.maxWidth) {
                                    valid = false;
                                    errors.maxWidth = true;
                                }

                                if (settings.validators.minWidth && img.width < settings.validators.minWidth) {
                                    valid = false;
                                    errors.minWidth = true;
                                }

                                if (settings.validators.height && img.height !== settings.validators.height) {
                                    valid = false;
                                    errors.height = true;
                                }

                                if (settings.validators.maxHeight && img.height > settings.validators.maxHeight) {
                                    valid = false;
                                    errors.maxHeight = true;
                                }

                                if (settings.validators.minHeight && img.height < settings.validators.minHeight) {
                                    valid = false;
                                    errors.minHeight = true;
                                }
                            }

                            // The file is validated, so added to input
                            if (valid === true) {
                                $dropzone.find('img').remove();

                                if (isImage && settings.previewImage === true) {
                                    $dropzone.find('div').html($(img));
                                } else {
                                    $dropzone.find('div').html('<span>' + formatted + '</span>');
                                }

                                $dropzone.addClass(settings.classes.accept);

                                // Trigger the accept callback
                                if ($.isFunction(settings.accept)) {
                                    settings.accept.apply($input, [ file ]);
                                }
                                // The file is invalidated, so rejected
                            } else {
                                $input.val('');

                                $dropzone.addClass(settings.classes.reject);

                                // Trigger the reject callback
                                if ($.isFunction(settings.reject)) {
                                    settings.reject.apply($input, [ file, errors ]);
                                }
                            }
                        }, 250);
                    };
                });
        };

        init();
    };

    // Inject a file or image in the preview
    $.dropzone.prototype.preview = function(path, callback) {
        var settings  = this.settings,
            $input    = this.$input,
            $dropzone     = $input.parent('.' + settings.classes.main),
            basename  = path.replace(/\\/g,'/').replace( /.*\//, ''),
            formatted = settings.format(basename);

        var img = new Image();
        img.src = path;

        // Is an image
        img.onload = function() {
            $dropzone.find('div').html($(img));

            if ($.isFunction(callback)) {
                callback.apply(this);
            }
        };

        // Is not an image
        img.onerror = function() {
            $dropzone.find('div').html('<span>' + formatted + '</span>');

            if ($.isFunction(callback)) {
                callback.apply(this);
            }
        };

        $dropzone.addClass(settings.classes.accept);
    };

    // Destroy dropzone
    $.dropzone.prototype.destroy = function() {
        var settings = this.settings,
            $input   = this.$input;

        $input.parent('.' + settings.classes.main).replaceWith($input);
        $input.off('*.dropzone');
        $input.removeData('dropzone');
    };

    // Extend settings
    $.dropzone.prototype.options = function(options) {
        var settings = this.settings;

        if (!options) {
            return settings;
        }

        $.extend(true, this.settings, options);
    };

    // Get input container
    $.dropzone.prototype.container = function() {
        var settings = this.settings,
            $input   = this.$input;

        return $input.parent('.' + settings.classes.main);
    };

    // Is browser compatible
    $.dropzone.isBrowserCompatible = function() {
        return !!(window.File && window.FileList && window.FileReader);
    };

    // Default options
    $.dropzone.defaults = defaults;

    // jQuery plugin
    $.fn.dropzone = function(options) {
        var args = arguments,
            plugin;

        return this.each(function () {
            plugin = $(this).data('dropzone');

            if (!plugin) {
                return $(this).data('dropzone', new $.dropzone(this, options));
            } if (plugin[options]) {
                return plugin[options].apply(plugin, Array.prototype.slice.call(args, 1));
            } else {
                $.error('Dropzone error - Method ' +  options + ' does not exist.');
            }
        });
    };
}));