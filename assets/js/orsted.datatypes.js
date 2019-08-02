(function($){
    "use strict";

    window.datatypes = {
        // Initialize
        init: function () {
            // Handle numeric
            this.handleNumeric();
        },

        // Handle numeric
        handleNumeric: function () {
            // Find all numeric inputs
            var $inputs = $('input[data-type="numeric"]');

            // No numerics?
            if ($inputs.length === 0) return;

            // Handle keydown
            $inputs.on('keydown', function(e) {
                // Allow: backspace, delete, tab, escape, enter and .
                if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
                     // Allow: Ctrl+A
                    (e.keyCode == 65 && e.ctrlKey === true) ||
                     // Allow: CMD+A
                    (e.keyCode == 65 && e.metaKey === true) ||
                     // Allow: home, end, left, right
                    (e.keyCode >= 35 && e.keyCode <= 39)) {
                         // let it happen, don't do anything
                         return;
                }
                // Ensure that it is a number and stop the keypress
                if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                    e.preventDefault();
                }
            });
        }
    };

    datatypes.init();

})(jQuery);