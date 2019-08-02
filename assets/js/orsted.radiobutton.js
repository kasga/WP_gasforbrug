(function($) {
    "use strict";

    window.radiobutton = {
        // Find radiobuttons
        $radiobuttons: $('[data-init="orsted.radiobutton"]'),

        // Initialize
        init: function() {
            // Prepare markup for each radiobutton found
            this.$radiobuttons.each(function() {
                var $radio = $(this),
                    $label = $radio.closest('label'),
                    $text = $('<span>', { text: $label.text() });

                // Wrap the label text inside a span tag
		        $label.append($text).html($label.children());
        
                // Make sure there's only on span
                if (!$text.is(':only-of-type')) {
                    $text.siblings('span').remove();
                }
            });
        }
    };

    radiobutton.init();

})(jQuery);