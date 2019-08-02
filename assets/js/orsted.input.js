(function($) {
    "use strict";

    window.input = {
        // Find input elements
        $inputs: $('[data-init="orsted.input"]'),

        // Initialize
        init: function() {
            // Prepare markup for each input element found
            this.$inputs.each(function() {
                var $input = $(this),
                    $label = $input.parent().find('label'),
                    $group = $input.parents('.form-group'),
                    $content = $group.find('.form-group-content'),
                    $mandatory = $content.attr('class').match(/mandatory/) ? true : false;

                // Handle input focus/blur on label click
                $label.on('mousedown touchstart', function() {
                    $label.data('focus', $input.is(':focus'));
                }).click(function() {
                    $label.data('focus') ? $input.blur() : $input.focus();
                });

                // Handle active state
                $input.on('focus', function() {
                    $label.activeLabel('animate');
                }).on('blur change focusout', function() {
                    if ($input.val() || $group.is('.has-danger')) {
                        $label.activeLabel();
                    } else if (!$label.find('.form-help-text').length) {
                        $label.activeLabel('off');
                    }
                });
                
                // Handle disabled state
                if ($label.is('.disabled')) {
                    $input.prop('disabled', true);
                    $content.removeClass('mandatory');
                    // Make sure the input value is empty
                    setTimeout(function() {
                        $input.val('');
                        $label.activeLabel('off');
                    }, 100);
                }

                // Init label state
                $input.trigger('blur');
            });
        }
    };

    input.init();

})(jQuery);