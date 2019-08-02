(function($) {
    "use strict";

    window.validate = {
        // Initialize
        init: function() {
            // Find all form-elements that has validate-attribute
            var $elements = $('[data-validate]').filter('input,select');

            // Handle validation
            $elements.each(function() {
                // Setup handler
                $(this).on(($(this).is('select')) ? 'change' : 'blur', validate.handler);
            });
        },

        // Handle validation
        handler: function(e) {
            // Get element
            var $element = $(this),
                $group = $element.closest('.form-group'),
                $error = $group.find('.error-text'),
                $label = $group.find('label');

            // Ignore if value is empty
            if ($element.val() === '') {
                $error.remove();
                $label.activeLabel('off');
                $group.removeClass('has-success has-danger');
                return;
            }

            // Prepare regex
            var regex = new RegExp($element.data('validate'));

            // Test value against regex
            if (regex.test($element.val())) {
                // Append error-message
                $error.remove();
                $group.removeClass('has-danger').addClass('has-success');
            } else if ($error.length) { // Error already exists?
                $group.removeClass('has-success');
                return;
            } else { // Append error-message
                $('<div class="error-text"/>').html($element.data('error')).appendTo($group);
                $group.removeClass('has-success').addClass('has-danger');
            }
        }
    };

    validate.init();

})(jQuery);