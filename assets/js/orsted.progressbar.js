(function($) {
    "use strict";

    window.progressbar = {
        // Find progressbars
        $progressbars: $('[data-init="orsted.progressbar"]'),

        // Initialize
        init: function() {
            // Prepare markup for each progressbars found
            this.$progressbars.each(function(){
                progressbar.prepareMarkup($(this));
            });
        },

        // Prepare markup
        prepareMarkup: function($progressbar) {
            // Set class name and data-items attribute
            $progressbar.addClass('progress-bar').attr('data-items', $progressbar.children().length);

            // Wrap $progressbar in a <nav>
            if (!$progressbar.parent().is('nav')) {
                $progressbar.wrap('<nav class="progress">');
            } else {
                $progressbar.parent().addClass('progress');
            }

            // Make sure $progressbars is an <ol>
            if (!$progressbar.is('ol')) {
                var $attributes = $progressbar.prop('attributes');
                $.each($attributes, function() {
                    $progressbar.replaceWith($('<ol>').addClass('progress-bar').attr(this.name, this.value).append($progressbar.contents()));
                });
                $progressbar = $('.progress-bar');
            }

            // Handle list elements
            $progressbar.children().each(function(i){
                var $step = $(this).addClass('progress-bar-step');

                $step.wrapInner('<div class="progress-bar-step-label">'+
                                '<div class="progress-bar-step-label-text">');
                $step.append('<div class="progress-bar-step-number">'+ (i + 1) +'</div>');

                //$step.wrapInner('<div class="progress-bar-step-label"/>');
                
                // Make sure $step is a <li>
                if (!$step.is('li')) {
                    $step = $step.replaceWith($('<li>').addClass('progress-bar-step').append($step.contents()));
                }
            });

            // Set first step to be active if none are set
            if (!$progressbar.children().is('.active')) {
                $progressbar.children().first().addClass('active');
            }

            // Show $progressbar
            $progressbar.css({visibility: 'visible'});
        }
    };

    progressbar.init();

})(jQuery);