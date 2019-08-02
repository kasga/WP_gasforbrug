(function($) {
    "use strict";

    window.checkbox = {
        // Find checkboxs
        $checkboxes: $('[data-init="orsted.checkbox"]'),

        // Initialize
        init: function() {
            // Prepare markup for each checkbox found
            this.$checkboxes.each(function() {
                var $checkbox = $(this),
                    $label = $checkbox.closest('label'),
                    $group = $label.closest('.form-group'),
                    $elements = $label.find('*:not(input)'),
                    $labelClass = $label.attr('class'),
                    $labelText = $('<span>', { text: $label.clone().find('>*').remove().end().text() });

                // Wrap the label text inside a span tag and insert it after input
                $label.append($labelText).html($label.children()).append($elements);
        
                // Make sure there's only on span tag
                if (!$labelText.is(':only-of-type')) {
                    $labelText.siblings('span').remove();
                }

                // Display property on breakpoint
                $(window).on('resize', function() {
                    var $breakpoint = 700;
                    if ($(window).width() < $breakpoint && 
                        $labelClass.indexOf('-inline') > -1 && 
                        $label.siblings('label').length > 1) {
                        $label.attr('class', $labelClass.replace('-inline', ''));
                    } else {
                        $label.attr('class', $labelClass);
                    }
                }).resize();
            });
        }
    };

    checkbox.init();

})(jQuery);