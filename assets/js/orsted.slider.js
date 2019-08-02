(function($) {
    "use strict";
  
    window.slider = {
      // Find slider elements
      $sliders: $('select[data-init="orsted.slider"]'),
  
      // Initialize
      init: function() {
        // Prepare markup for each slider element
        this.$sliders.each(function() {
          var $select = $(this),
              $option = $select.children(),
              $slider = $('<div class="slider">'),
              $bar = $('<ul class="slider-bar">'),
              $opt, $stp, $lbl, $txt, $btn, $reg = /[a-zA-Z]/;
          
          // Add slider class to parent form-group
          $select.closest('.form-group').addClass('slider');
          
          // Make sure it hasn't been initialized before
          if ($select.closest('.orsted-slider').length) return true;
  
          // Wrap select in div
          $select.wrap($slider);
  
          // Insert ul after select
          $bar.insertAfter($select);
  
          // Get options and add lists
          $option.each(function(index) {
            $opt = $(this).html().replace(/m+([0-9].*?)/g, 'm<sup>$1</sup>');
            $stp = $('<li class="slider-bar-step">').appendTo($bar);
            $lbl = $('<div class="slider-bar-step-label">').prependTo($stp);
            $txt = $('<div class="slider-bar-step-label-text">').html($opt).appendTo($lbl);
            $btn = $('<div class="slider-bar-step-button">').appendTo($stp);
  
            // Handle button click
            $stp.on('click', function() {
              // Find and select option
              $option.filter(function() { return $(this).index() == index;
              }).attr('selected', true).siblings().removeAttr('selected');
  
              // Add selected class to clicked step
              $(this).addClass('selected').siblings().removeClass('selected');
            });
  
            // Add selected class to step if option is selected
            if ($(this).is('[selected]')) $stp.addClass('selected');
            
            // Check for are any letters
            $stp.filter(function() {
              return $reg.test($txt.html());
            }).parent().addClass('letters');
          });
        });
      }
    };
  
    slider.init();
  
  })(jQuery);