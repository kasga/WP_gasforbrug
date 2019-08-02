(function($) {
  "use strict";

  $.fn.activeLabel = function(option) {
    this.filter("label").each(function() {
      var $label = $(this),
        $tmp,
        $top,
        $height;

      // "Clone" the label
      $tmp = $("<label/>", {
        html: $label.html(),
        class: "is-active"
      });

      // Insert clone into form-group-content
      // to get the css styles applied to it
      $tmp.insertBefore($label).hide();

      // Get height of clone without dicimals
      $height = Math.round($tmp.height());

      // Setup css for negative top style
      $top = { top: "13px" };

      // Clean up
      $tmp.remove();

      // Add css top style to the real label
      $label.addClass("is-active").css($top);

      // Add transition to states
      if (option === "animate") {
        $label.addClass("animate");
      }

      // Disable active state
      if (option === "off") {
        $label.removeClass("is-active").removeAttr("style");
      }
    });

    return this;
  };
})(jQuery);
