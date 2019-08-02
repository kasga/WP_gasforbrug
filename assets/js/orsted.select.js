(function($) {
  'use strict'

  window.select = {
    // Find radiobuttons
    $selects: $('[data-init="orsted.select"]'),

    // Initialize
    init: function() {
      // Prepare markup for each radiobutton found
      this.$selects.each(function() {
        // Prepare markup
        var $container = select.prepareMarkup($(this)),
            $group = $container.closest('.form-group'),
            $content = $group.find('.form-group-content'),
            $label = $content.find('legend'),
            $select = $group.find('select')
        
        // Add correct spacing
        $group.addClass('margin-bottom')

        // Handle disabled state
        if ($label.is('.disabled')) {
          $select.prop('disabled', true)
          $content.removeClass('mandatory')
        }

        // Handle change event
        $container.find('select').on('change', select.changeEvents)

      })
    },

    // Handle open
    onOpen: function(e) {
      // Ignore touch
      if (select.isTouch()) {
        return
      }

      // Prevent default
      e.preventDefault()

      // Get select
      var $select = $(this).siblings('select')

      // Trigger focus
      $select.trigger('focusin')

      // Get container
      var $container = $select.closest('.orsted-select')

      // Already open? close
      if ($container.has('.select-dropdown').length) {
        $container.find('.select-dropdown').remove()
        return
      }

      // Remove any current dropdowns
      $('.select-dropdown').remove()

      // Prepare dropdown
      var $dropdown = $('<ul class="select-dropdown"/>')

      // Populate
      $select.children().each(function() {
        // Append
        $('<li/>')
          .data('option', $(this))
          .html($(this).html())
          .appendTo($dropdown)
      })

      // Handle click
      $dropdown.on('click', 'li', function() {
        $(this).data('option').prop('selected', true)
        $select.trigger('change')
        $dropdown.remove()
      })

      // Append to container
      $container.append($dropdown)

      // Handle clicks outside dropdown
      $(document)
        .off('mousedown.select-dropdown')
        .on('mousedown.select-dropdown', function(e) {
          // Make sure click is outside dropdown
          if ($container.has(e.target).length || $container.is(e.target)) {
            return
          } else {
            $(document).off('mousedown.select-dropdown')
            $dropdown.remove()
          }
        })
    },

    // Detect touch
    isTouch: function() {
      return (
        true ===
        ('ontouchstart' in window ||
          (window.DocumentTouch && document instanceof DocumentTouch))
      )
    },

    // Change events
    changeEvents: function(e) {
      // Get select
      var $select = $(this)

      // Find value
      var value
      if ($select.find('option:selected').data('pretty')) {
        value = $select.find('option:selected').data('pretty')
      } else {
        value = $select.find('option:selected').html()
      }

      // Set value
      $select.siblings('.orsted-select-label').html(value)
    },

    // Handle type
    handleType: function($select) {
      // Prepare min & max
      var min, max, i

      // Handle year-selectors
      if ($select.data('type') === 'year') {
        max = new Date().getFullYear()
        min = $select.data('min') ? $select.data('min') : 0
        for (i = max; i >= min; i--) {
          $('<option/>').val(i).html(i).appendTo($select)
        }
      } else if ($select.data('type') === 'range') {
        // Handle range-selectors
        max = $select.data('max') ? $select.data('max') : 0
        min = $select.data('min') ? $select.data('min') : 0
        for (i = min; i <= max; i++) {
          $('<option/>').val(i).html(i).appendTo($select)
        }
      }

      // Return
      return $select
    },

    // Prepare markup
    prepareMarkup: function($select) {
      // Prepare clone
      var $clone = $select.clone()

      // Handle type
      $clone = this.handleType($clone)

      // Create container
      var $container = $('<div class="orsted-select"/>')

      // Append clone
      $container.append($clone)

      // Find value
      var value
      if ($clone.find('option:selected').data('pretty')) {
        value = $clone.find('option:selected').data('pretty')
      } else {
        value = $clone.find('option:selected').html()
      }

      // Add label
      $('<div class="orsted-select-label"/>').html(value).appendTo($container)

      // Replace
      $select.replaceWith($container)

      // Return
      return $container
    }
  }

  select.init()
})(jQuery)
