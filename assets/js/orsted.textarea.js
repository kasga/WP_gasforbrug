(function($) {
    "use strict";

    window.textarea = {
        // Find textarea elements
        $textareas: $('[data-init="orsted.textarea"]'),

        // Initialize
        init: function() {
            // Prepare markup for each textarea element found
            this.$textareas.each(function() {
                var $textarea = $(this),
                    $group = $textarea.closest('.form-group'),
                    $label = $textarea.parent().find('label');

                // Handle input focus/blur on label click
                $label.on('mousedown touchstart', function() {
                    $label.data('focus', $textarea.is(':focus'));
                }).click(function() {
                    $label.data('focus') ? $textarea.blur() : $textarea.focus();
                });

                // Handle active state
                $textarea.on('focus', function() {
                    $label.activeLabel('animate');
                }).on('blur change', function() {
                    if ($textarea.val() || $group.is('.has-danger')) {
                        $label.activeLabel();
                    } else if (!$label.find('.form-help-text').length) {
                        $label.activeLabel('off')
                    }
                });

                // Handle disabled state
                if ($label.is('.disabled')) {
                    $textarea.prop('disabled', true);
                    $content.removeClass('mandatory');
                    // Make sure the input value is empty
                    setTimeout(function() {
                        $textarea.val('');
                        $label.activeLabel('off');
                    }, 100);
                }

                // Init label state
                $textarea.trigger('blur');
            });
        }
    };

    textarea.init();

})(jQuery);