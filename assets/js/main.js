(function($) {
  "use strict";

  window.main = {
    // Page index
    page_index: 0,

    // Set API base
    apiBase: "https://api.de-dynamisk.dk/api",

    // Tracking base
    tracking_base: "beregner/sammenlign_gas/",

    // Initialize
    init: function() {
      // Initialize tooltips
      this.tooltip();

      // Handle navigation
      this.handleNavigation();

      // Disable native autocompletes
      this.disableNativeAutocomplete();

      // Handle autocomplete
      this.handleAutoComplete();

      // Handle newsletter signup
      this.handleNewsletter();

      // Trigger initial page tracking
      this.tracking("Step 1: Start");

      // Handle Accordion
      this.simple_accordion();

      // Handle modals
      this.simple_modal();

      // New custom tooltips
      this.formHelp();

      // Terms popover element
      this.popover();

      // Handle theme background image
      this.imageTheme();

      // Handle arrow links
      this.linkArrow();

      // Initialize data state from query string
      this.querystring();

      // Reset newsletter checkbox state
      $('input[name="newsletterSignup"]').prop("checked", false);
    },

    // Handle tracking
    tracking: function(path) {
      // Is path an array?
      if ($.isArray(path)) {
        path = path.join("/");
      }

      // Track
      if (typeof $netminers !== "undefined") {
        $netminers.push(["postPageView", this.tracking_base + path]);
      }

      // Google analytics?
      if (typeof ga !== "undefined") {
        ga("send", "pageview", this.tracking_base + path);
      }
    },
    simple_modal: function() {
      $(".question-help-trigger")
        .hammer()
        .on("tap", function() {
          var content = $(this)
            .parent()
            .find(".question-help-content");
          if (content.hasClass("_open")) {
            content.removeClass("_open");
          } else {
            content.addClass("_open");
          }
        });
    },
    simple_accordion: function() {
      $(".z_acc_trigger")
        .hammer()
        .on("tap", function() {
          var parent = $(this).closest(".z_acc_wrap");
          if (parent.hasClass("_open")) {
            parent.removeClass("_open");
            var viewport_height = $(".bx-viewport").innerHeight();
            $(".bx-viewport").height(viewport_height - 60);
          } else {
            parent.addClass("_open");
            var viewport_height = $(".bx-viewport").innerHeight();
            $(".bx-viewport").height(viewport_height + 60);
          }
        });
    },

    // Handle newsletter signup
    handleNewsletter: function() {
      // Get checkbox
      var $checkbox = $('input[name="newsletterSignup"]');

      // Get container
      var $container = $(".sign-up-container");

      // Find form
      var $form = $container.find("form.newsletter-form");

      // Handle submit
      $form.on("submit", function(e) {
        // Prevent default
        e.preventDefault();

        // Make sure required fields has been filled
        if (!main.required()) {
          return;
        }

        // Get form data
        var data = main.getFormData($form);

        // Terms checked?
        if (typeof data.terms === "undefined" || data.terms != "1") {
          // Set error
          $container
            .find('input[name="terms"]')
            .closest(".orsted-checkbox")
            .addClass("error");

          // Show error text
          $container.find(".terms-error").removeClass("hidden");

          // Return
          return;
        } else {
          // Set error
          $container
            .find('input[name="terms"]')
            .closest(".orsted-checkbox")
            .removeClass("error");

          // Show error text
          $container.find(".terms-error").addClass("hidden");
        }

        // Fix data
        var fixedData = {
          name: data.name,
          surName: data.surName,
          address: data.address,
          zip: data.zip,
          city: data.city,
          isCustomer: data.orstedCustomer == "1",
          phone: data.phone,
          email: data.email,
          customerId: data.customerId,
          source: "naturgasforbrug"
        };

        // Send request
        $.ajax({
          type: "POST",
          data: JSON.stringify(fixedData),
          contentType: "text/plain",
          processData: false,
          xhrFields: { withCredentials: true },
          url: main.apiBase + "/newsletter",
          success: function(data) {
            // Blur any current active element
            $(document.activeElement).blur();

            // Hide container

            $(".newsletter").remove();

            // Show confirmation
            $(".sign-up-confirmation").removeClass("hidden");

            // Track nyhedsbrev signup
            main.tracking("Step 4: Nyhedsbrev tilmeldt");

            // Uncheck newsletter

            // Kvitteringsside
            $("[data-bind]").each(function(i, item) {
              // Get bind value
              var $el = $(item),
                value = $el.data("bind");

              // Handle name
              if (value === "fullName") {
                $el.html($.trim([fixedData.name, fixedData.surName].join(" ")));
              } else if (value === "address") {
                $el.html(fixedData.address);
              } else if (value === "phone") {
                $el.html(fixedData.phone);
              } else if (value === "mail") {
                $el.html(fixedData.email);
              } else if (value === "customerId") {
                if (fixedData.customerId == "") {
                  $(".customerid-container").hide();
                } else {
                  $el.html(fixedData.customerId);
                }
              }
            });
          },
          error: function(err) {}
        });
      });

      // Handle change
      $checkbox.on("change", function() {});

      // Trigger change
      $checkbox.trigger("change");

      // Handle customerId check
      $container.find('input[name="orstedCustomer"]').on("change", function() {
        // Check value
        if ($(this).val() == 1) {
          $container.find(".customerid").removeClass("hidden");
        } else {
          $container.find(".customerid").addClass("hidden");
        }
      });

      // Trigger change
      $container.find('input[name="orstedCustomer"]:checked').trigger("change");

      // Find terms-overlay
      var $termsOverlay = $container.find(".terms-overlay");

      // Handle close
      $termsOverlay.hammer().on("tap click mousedown", function(e) {
        // Prevent propagation
        e.preventDefault();
        e.stopPropagation();

        // Not tap? skip
        if (e.type !== "tap") {
          return;
        }

        // Hide overlay
        setTimeout(function() {
          $termsOverlay.trigger("hide");
        }, 200);
      });

      // Show event
      $termsOverlay.on("show", function() {
        // Blur any active element
        $(document.activeElement).blur();

        // Show terms
        TweenLite.from($termsOverlay, 0.3, {
          opacity: 0,
          onStart: function() {
            $termsOverlay.removeClass("hidden");
          }
        });
      });

      // Hide event
      $termsOverlay.on("hide", function() {
        // Show terms
        TweenLite.to($termsOverlay, 0.3, {
          opacity: 0,
          onComplete: function() {
            $termsOverlay.addClass("hidden");
            TweenLite.set($termsOverlay, { opacity: 1 });
          }
        });
      });

      // Handle terms
      $container.find('a[data-action="show-terms"]').on("click", function(e) {
        e.preventDefault();
        $termsOverlay.trigger("show");
      });

      $container.removeClass("hidden");
    },

    // Save result
    saveResult: function(data) {
      // Send request
      $.ajax({
        type: "POST",
        data: JSON.stringify(data),
        contentType: "text/plain",
        processData: false,
        xhrFields: { withCredentials: true },
        url: main.apiBase + "/calculator/2",
        success: function(data) {},
        error: function(err) {}
      });
    },

    // Handle reultpage
    handleResultPage: function() {
      // Get form data
      var data = this.getFormData("form.page-form");

      // Get page
      var $page = $(".page.result");

      // Uncheck newsletter
      // $('input[name="newsletterSignup"]').prop('checked', false).trigger('change');

      // Orsted customer?
      $page.find("[data-service]").addClass("hidden");
      if (data.serviceAgreement == "1") {
        $page.find('[data-service="true"]').removeClass("hidden");
      } else {
        $page.find('[data-service="false"]').removeClass("hidden");
      }

      // Handle usage
      if (data.usage === "") {
        data.usage = 0;
      }

      // Get average
      var average =
        parseInt(data.estateSize) * parseFloat(data.estateAge) +
        parseInt(data.residents) * 75;
      var average_price = average * 7.47 + 150;
      var usage_price = data.usage * 7.47 + 150;

      // Handle unit = kr.
      if (data.unit === "kr") {
        usage_price = data.usage;
        data.usage = (data.usage - 150) / 7.47;
      }

      // Calculate savings
      var saving = usage_price - average_price;

      // Set percent
      var percent = Math.round((data.usage / average) * 100) - 100;

      // Save result
      var result_data = {
        estateSize: parseInt(data.estateSize, 10),
        estateAge: $('[name="estateAge"]')
          .children(":selected")
          .text(),
        residents: parseInt(data.residents, 10),
        gasburnerAge: $('[name="gasburnerAge"]')
          .children(":selected")
          .text(),
        serviceAgreement:
          parseInt(data.serviceAgreement, 10) === 1 ? "Ja" : "Nej",
        usage: parseInt(data.usage, 10),
        usagePrice: Math.round(parseInt(usage_price, 10), 2),
        average: Math.round(parseInt(average, 10)),
        averagePrice: Math.round(parseInt(average_price, 10), 2),
        percent: percent
      };

      // Save result
      this.saveResult(result_data);

      // Determine estateType
      var house = data.estateType === "house";

      // Handle 'not found'
      $page.find(".bar-usage,.found,.not-found").removeClass("hidden empty");
      if (data.unit == "0" || data.usage == 0) {
        percent = 0;
        $page.find(".bar-usage").addClass("empty");
        $page.find(".found").addClass("hidden");
      } else {
        $page.find(".not-found").addClass("hidden");
      }

      // Over or under 0?
      var over = percent > 0 ? true : false;

      // Hide and show over/under elements
      $page.find(".over,.under").addClass("hidden");
      if (over) {
        $page.find(".over").removeClass("hidden");
      } else {
        $page.find(".under").removeClass("hidden");
      }

      // Handle text
      var help_text = "";
      if (percent < -12) {
        help_text =
          "Dit naturgasforbrug ligger {percent} under gennemsnittet. Det er virkelig flot. Du er tydeligvis meget opmærksom på dit naturgasforbrug. Måske kan du alligevel spare endnu mere?";
      } else if (percent <= 0) {
        help_text =
          "Dit naturgasforbrug ligger {percent} under gennemsnittet. Godt gået. Du er tydeligvis allerede opmærksom på dit naturgasforbrug. Måske kan du spare endnu mere?";
      } else if (percent > 0 && percent < 21) {
        help_text =
          "Dit naturgasforbrug ligger {percent} over gennemsnittet. Det betyder, at der sandsynligvis er penge at spare, hvis du bliver lidt mere opmærksom på dit natrugasforbrug og følger nogle gode spareråd.";
      } else if (percent > 21) {
        help_text =
          "Dit naturgasforbrug ligger {percent} over gennemsnittet. Det betyder, at der temmelig sikkert er penge at spare, hvis du bliver opmærksom på dit naturgasforbrug og følger nogle gode spareråd.";
      }

      // Not found?
      if (data.unit == "0" || data.usage == 0) {
        help_text =
          "Vi kan ikke fortælle dig, om dit naturgasforbrug ligger under eller over gennemsnittet, men vi kan give dig nogle gode råd til, hvordan du kan opnå besparelser på din varmeregning.";
      }

      // Insert % in help text
      help_text = help_text.replace("{percent}", Math.abs(percent) + " %");

      var result_text;
      if (percent < -26) {
        result_text =
          "<h2>Wauu! Du ligger langt under gennemsnitsforbruget</h2>Du ved tydeligvis en hel masse om, hvor du kan spare. Tjek vores spareråd nedenfor – er der endnu mere at komme efter?";
      } else if (percent >= -25 && percent <= -1) {
        result_text =
          "<h2>Flot! Du ligger under gennemsnitsforbruget</h2>Se vores spareråd nedenfor – kan du spare endnu mere, hvis du justerer lidt på nogle vaner?";
      } else if (percent == 0) {
        result_text =
          "<h2>Du bruger det samme som gennemsnittet</h2>Se vores spareråd nedenfor – kan du komme under gennemsnitsforbruget?";
      } else if (percent > 0) {
        result_text = "<h2>Du kan spare cirka {saving} kr. om året</h2>Du skal bare sænke dit naturgasforbrug til gennemsnitsforbruget. Se vores spareråd nedenfor og få tips til, hvordan du sænker dit forbrug.".replace(
          "{saving}",
          this.formatNumber(Math.max(0, saving))
        );
      }

      // Insert help-text
      $page.find(".help-text").html(help_text);
      $page.find(".result-text").html(result_text);

      // Insert usage + average
      $page.find(".average").html(this.formatNumber(average));
      $page.find(".average_price").html(this.formatNumber(average_price));
      $page.find(".usage").html(this.formatNumber(data.usage));
      $page.find(".usage_price").html(this.formatNumber(usage_price));
      $page.find(".saving").html(this.formatNumber(Math.max(0, saving)));

      // Insert percentage
      $page.find(".percent").html(Math.abs(percent) + " %");

      // Get meter
      var $meter = $("svg.meter");

      // Select SVG-elements
      var $text = $meter.find(".text"),
        $green = $meter.find(".green"),
        $yellow = $meter.find(".yellow"),
        $red = $meter.find(".red");

      // Animate meter
      TweenLite.to($meter.find(".needle"), 3, {
        rotation: Math.min(
          105,
          Math.max(
            -105,
            percent == 0 ? percent : percent > 0 ? percent + 3 : percent - 3
          )
        ),
        transformOrigin: "50% 100%",
        delay: 0.5,
        ease: Elastic.easeOut
      });

      // Animate text
      var tmp = { i: 0 };
      TweenLite.to(tmp, 3, {
        i: percent,
        delay: 0.5,
        ease: Elastic.easeOut,
        onUpdate: function() {
          // Get percent
          var percent = Math.floor(tmp.i);

          // Prepare percent
          var string = Math.abs(percent) + " %";

          // Set barmeter fill colors
          if (percent < (house ? -12 : -10)) {
            /*
                    $green.css({ fill: '#67CECA' });
                    $yellow.css({ fill: '#BFAC5C' });
                    $red.css({ fill: '#CC4646' });
                    */
          } else if (percent < (house ? 21 : 27)) {
            /*
                    $green.css({ fill: '#52A5A2' });
                    $yellow.css({ fill: '#EFD773' });
                    $red.css({ fill: '#CC4646' });
                    */
          } else {
            /*
                    $green.css({ fill: '#52A5A2' });
                    $yellow.css({ fill: '#BFAC5C' });
                    $red.css({ fill: '#FF5757' });
                    */
          }

          // Set percent text
          $text.text(string);
        }
      });

      // Find max
      var max = Math.round(Math.max(average, data.usage));
      max = 250 * Math.ceil(max / 250);

      // Get labels
      var $labels = $page.find(".bar-bg").find(".label");

      // Intervals?
      var interval = 250 * Math.ceil(max / $labels.length / 250);

      // Prepare bar
      for (var i = 1; i <= $labels.length; i++) {
        $labels.eq(i).html(this.formatNumber(parseInt(interval) * i));
      }

      // Get bar usage
      var $bar_usage = $page.find(".bar-usage"),
        $bar_average = $page.find(".bar-average");

      // Animate bar
      TweenLite.to($bar_usage, 3, {
        height:
          Math.round(
            (parseInt(data.usage) / (interval * ($labels.length - 1))) * 100
          ) + "%",
        color: "#fff",
        delay: 0.5,
        ease: Strong.easeOut,
        onUpdate: function() {
          if ($bar_usage.height() < 35) {
            $bar_usage.find(".bar-text-container").addClass("offset");
          } else {
            $bar_usage.find(".bar-text-container").removeClass("offset");
          }
        }
      });

      TweenLite.to($bar_average, 3, {
        height:
          Math.round(
            (parseInt(average) / (interval * ($labels.length - 1))) * 100
          ) + "%",
        delay: 0.5,
        ease: Strong.easeOut,
        onUpdate: function() {
          if ($bar_average.height() < 35) {
            $bar_average.find(".bar-text-container").addClass("offset");
          } else {
            $bar_average.find(".bar-text-container").removeClass("offset");
          }
        }
      });
    },

    formatNumber: function(number) {
      var number = parseFloat(number).toFixed(0) + "";
      var x = number.split(".");
      var x1 = x[0];
      var x2 = x.length > 1 ? "," + x[1] : "";
      var rgx = /(\d+)(\d{3})/;
      while (rgx.test(x1)) {
        x1 = x1.replace(rgx, "$1" + "." + "$2");
      }
      return x1 + x2;
    },

    // Get form data
    getFormData: function($form) {
      // Make sure form is wrapped in jquery
      $form = $($form);

      // Prepare data
      var data = {};

      // Get all form elements
      var $elements = $form.find("input,textarea,select").filter("[name]");

      // Loop through elements
      var $element;
      $elements.each(function() {
        // Get element
        $element = $(this);

        // Handle checkbox arrays
        if ($element.is('[type="checkbox"]')) {
          // Is there multiple checkboxes with same name?
          if (
            $(
              'input[type="checkbox"][name="' + $element.attr("name") + '"]'
            ).not($element).length
          ) {
            if (typeof data[$element.attr("name")] === "undefined") {
              data[$element.attr("name")] = [];
            }
          }

          // Make sure checkbox is selected
          if (!$element.prop("checked")) {
            return true;
          }

          // Handle array
          if ($.isArray(data[$element.attr("name")])) {
            data[$element.attr("name")].push($element.val());
          } else if (typeof data[$element.attr("name")] === "undefined") {
            data[$element.attr("name")] = $element.val();
          }
        } else if ($element.is('[type="radio"]')) {
          // Make sure checkbox is selected
          if ($element.prop("checked")) {
            data[$element.attr("name")] = $element.val();
          } else if (typeof data[$element.attr("name")] === "undefined") {
            data[$element.attr("name")] = "";
          }
        } else {
          data[$element.attr("name")] = $element.val();
        }
      });

      // return data
      return data;
    },

    // Disable autocomplete
    disableNativeAutocomplete: function() {
      $('input[type="text"],input[type="tel"]').prop("autocomplete", "off");
    },

    // Handle required fields
    required: function(index) {
      // Get required fields
      var $required;

      // Make sure to blur active element
      $(":focus").blur();

      // Index provided?
      if (index) {
        // Get active page
        $required = $(".page")
          .slice(0, index)
          .find(".mandatory");
      } else {
        $required = $(".page").find(".mandatory:visible");
      }

      // Any mandatory fields not filled out?
      var not_filled = false;
      $required.each(function() {
        // Get input
        var $input = $(this)
          .find("input,select,textarea")
          .eq(0);

        // Check if it has been filled
        var value = $input.val();

        // Handle radiobutton
        if ($input.is('[type="radio"]') || $input.is('[type="checkbox"]')) {
          if ($('[name="' + $input.attr("name") + '"]:checked').length === 0) {
            value = "";
          }
        }

        if (value === "") {
          // First input?
          if (not_filled === false) {
            $input.focus();
          }

          // Set filled status
          not_filled = true;

          // Show error
          if (
            $(this)
              .closest(".form-group")
              .find(".error-text,.radio-error-text").length
          ) {
            $(this)
              .closest(".form-group")
              .removeClass("has-danger")
              .find(".error-text,.radio-error-text")
              .remove();
          }

          // Append error-message
          $("<div/>")
            .addClass(
              $input.is('[type="radio"]') || $input.is('[type="checkbox"]')
                ? "radio-error-text"
                : "error-text"
            )
            .html(
              $(this).data("error")
                ? $(this).data("error")
                : "Dette felt skal udfyldes"
            )
            .appendTo($(this).closest(".form-group"));

          if (
            $(this).find("input").length &&
            !$(this)
              .find("input")
              .is('[type="radio"]') &&
            !$(this)
              .find("input")
              .is('[type="checkbox"]')
          ) {
            $(this)
              .closest(".form-group")
              .addClass("has-danger");
          }

          // Highlight
          $(this).one("change focus focusin keydown", function() {
            $(this)
              .closest(".form-group")
              .removeClass("has-danger")
              .find(".error-text,.radio-error-text")
              .remove();
          });
        }
      });

      // Make sure theres no visible errors showing
      if ($(".error-text:visible").length) {
        not_filled = true;
      }

      // Return true if all mandatory fields has been filled
      if (!not_filled) return true;

      return false;
    },

    // Show noty
    noty: function(message, type, layout) {
      var n = noty({
        text: message,
        type: type ? type : "alert",
        layout: layout ? layout : "center",
        theme: "relax",
        closeWith: ["click"],
        dismissQueue: true,
        maxVisible: 5,
        timeout: 2000
      });
    },

    // Get url query variable
    getQueryVariable: function(variable) {
      var query = window.location.search.substring(1);
      var vars = query.split("&");
      for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
          return pair[1];
        }
      }
      return false;
    },

    // Handle navigation
    handleNavigation: function() {
      // Handle next buttons
      $('[data-action="next"]')
        .hammer()
        .on("tap", function(e) {
          // Get page index
          var index = $(".page").index($(this).closest(".page"));

          // Increase index
          index += 1;

          // Make sure index is not negative
          index = Math.max(0, index);

          // Change page
          setTimeout(function() {
            main.changePage(index);
          }, 100);
        });

      // Handle prev buttons
      $('[data-action="prev"]')
        .hammer()
        .on("tap", function(e) {
          // Get page index
          var index = $(".page").index($(this).closest(".page"));

          // Decrease index
          index -= 1;

          // Make sure index is not negative
          index = Math.max(0, index);

          // Change page
          setTimeout(function() {
            main.changePage(index);
          }, 100);
        });

      // Handle start-over buttons
      $('[data-action="first"]')
        .hammer()
        .on("tap", function(e) {
          // Get page index
          var index = $(".page").index($(this).first(".page"));

          // Reset index
          index = 0;

          // Make sure index is not negative
          index = Math.max(0, index);

          // Change page
          setTimeout(function() {
            main.changePage(index);
          }, 100);
        });

      // Handle prev buttons
      $(".progress-bar")
        .children()
        .hammer()
        .on("tap", function() {
          // Get page index
          var index = $(this).index();

          // Change page
          setTimeout(function() {
            main.changePage(index);
          }, 100);
        });
    },

    changePage: function(index) {
      // Make sure require fields are filled
      if (this.page_index < index) {
        if (!main.required()) return;
      }

      // Blur active element
      $(document.activeElement).blur();

      // Get pages
      var $pages = $(".page");

      // Result?
      if ($pages.index($(".page.result")) === index) {
        this.handleResultPage();
      }

      // Set index
      this.page_index = index;

      // Handle tracking
      switch (this.page_index) {
        // Track inital page
        case 0:
          this.tracking("Step 1: Start");
          break;
        case 1:
          this.tracking("Step 2: Oplysninger");
          break;
        case 2:
          this.tracking("Step 3: Resultat");
          break;
      }

      // Hide other pages
      $pages.addClass("hidden");

      // Show the correct page
      $pages
        .eq(index)
        .css({ opacity: 0 })
        .removeClass("hidden");

      // Scroll to top
      if ("parentIFrame" in window) {
        // Send scroll event
        parentIFrame.sendMessage("scrollToIframe");
      } else {
        $(window).scrollTop(0);
      }

      // Fade in
      setTimeout(function() {
        // Show page
        $pages.eq(index).css({ opacity: 1 });
      }, 100);
    },

    // Handle autocomplete
    handleAutoComplete: function() {
      // Find autocomplete
      var $input = $('input[data-type="autocomplete"]');

      // Setup autocomplete
      $input.autocomplete({
        serviceUrl: "https://dawa.aws.dk/adresser/autocomplete",
        minChars: 3,
        maxHeight: 300,
        paramName: "q",
        dataType: "json",
        formatResult: function(suggestion, currentValue) {
          return suggestion.value;
        },
        transformResult: function(response) {
          // Return modified suggestions
          return {
            suggestions: $.map(response, function(item) {
              return { value: item.tekst, data: item.adresse };
            })
          };
        },
        onSelect: function(suggestion) {
          // // Build address-string
          // var address = [
          //     suggestion.data.vejnavn,
          //     suggestion.data.husnr,
          //     suggestion.data.etage,
          //     suggestion.data['dør'],
          // ].join(' ');
          // // Trim
          // address = $.trim(address);
          // // Set address
          // $('input[name="address"]').val(address);
          // // Set postal
          // $('input[name="zip"]').val(suggestion.data.postnr);
          // // Set city
          // $('input[name="city"]').val(suggestion.data.postnrnavn);
        }
      });
    },

    // Tooltip
    tooltip: function() {
      $(".help").each(function() {
        $(this).qtip({
          content: {
            text: function() {
              if ($(this).next(".tooltip-text").length) {
                return $(this)
                  .next(".tooltip-text")
                  .html();
              } else {
                return $(this).data("tooltip");
              }
            }
          },
          style: "qtip-bootstrap",
          position: {
            my: "bottom center",
            at: "center top"
          }
        });
      });
    },

    // Initialize state from query string
    querystring: function() {
      // Mapping of local key (input name) names to parameter key names
      var inputNameMapping = {
        usage: "yearlyconsumption",
        // 'unit': 'yearlyconsumptionunit', // not input text (custom setter instead)
        name: "firstname",
        surName: "lastname",
        address: "address",
        email: "email",
        phone: "phonenumber",
        customerId: "customerid",
        estateSize: "estatesize"
      };

      // Check if we have access to the query string
      if (window.location && window.location.search) {
        // Initialize object to hold query string parameters
        var parameters = {};

        // Copy query string to local variable
        var parts = window.location.search + "";

        // Remove question mark
        parts = parts.substring(1);

        // Split into key-value parts
        parts = parts.split("&");

        // Iterate through every key-value pair
        for (var x in parts) {
          // Get reference to current pair
          var pair = parts[x];

          // Split pair into key and value
          var keyAndValue = pair.split("=");

          // Make sure both key and value is present
          if (!keyAndValue[0] || !keyAndValue[1]) {
            continue;
          }

          // Put key and value into parameters object
          // (lowercase key for added flexibility of query string parameters)
          // (decode value as URI component)
          parameters[keyAndValue[0].toLowerCase()] = decodeURIComponent(
            keyAndValue[1].replace(/\+/g, "%20")
          );
        }

        // Iterate through input types to set state
        for (var name in inputNameMapping) {
          // Get parameter key
          var key = inputNameMapping[name];

          // Get parameter value
          var value = parameters[key];

          // Set value for field
          $('input[name="' + name + '"]')
            .val(value)
            .each(function() {
              if ($(this).val()) {
                $(this)
                  .parent()
                  .find("label")
                  .activeLabel();

                if (name == "usage") {
                  //Fix the label which is not positioned right
                  $('input[name="' + name + '"]')
                    .parent()
                    .find("label")
                    .css({ top: "-22px" });
                  $(".usage-none").addClass("hide");
                  $(".usage-you").removeClass("hide");
                }
              }
            });
        }

        // Check if a consumption unit was set
        if (parameters.yearlyconsumptionunit) {
          // Set the unit dropdown to the value provided in query parameter
          $('select[name="unit"]')
            .find(
              'option[value="' +
                parameters.yearlyconsumptionunit.toLowerCase() +
                '"]'
            )
            .attr("selected", true);

          // Provoke change for UI to react
          $('select[name="unit"]').trigger("change");
        }

        // Check if a customer id was set
        if (parameters.customerid) {
          // Get the "is already customer" radio
          var $radio = $('input[name="orstedCustomer"]').filter('[value="1"]');

          // Check the radio telling the system that the visitor is already a customer
          $radio.attr("checked", true);

          // Provoke change for UI to react
          $radio.trigger("change");
        }
      }
    },

    // Tooltip for form elements
    formHelp: function() {
      $(".form-help").each(function() {
        var $formHelp = $(this),
          $label = $formHelp.parent(),
          $text = $formHelp.data("help"),
          $input = $label.parent().find("input"),
          $labels = $("body")
            .find("label, legend")
            .not($label),
          $help = $("<div>", { class: "form-help-text", html: $text });

        // Trigger form help and set position and width
        $formHelp
          .on("mouseenter click", function() {
            var $width = $(this).position().left + $(this).width() * 2,
              $top = $(this).height() + 8;

            // Adjust width for active label
            if ($label.is(".is-active")) {
              $width += 10;
            }

            // Specifically for legend
            if ($label.is("legend")) {
              $top += 4;
              $width -= 16;
            }

            // If input is disabled
            // don't show form help
            if (!$label.is(".disabled")) {
              $label.append($help);
            }

            // Set classes and properties
            $labels.addClass("below");
            $help.css({ top: $top, "min-width": $width + "px" });
            $formHelp.addClass("on");

            return false;
          })
          .on("mouseleave", function() {
            // Remove classes and properties
            $help.remove();
            $labels.removeClass("below");
            $formHelp.removeClass("on");
          });
      });
    },

    // Terms popover
    popover: function() {
      $(".popover, .popunder")
        .each(function() {
          var $pop = $(this),
            $popcon = $pop.find('[class*="-content"]'),
            $closex = $('<span class="close"/>').prependTo($popcon),
            $trigger = $pop.parent().find('[class*="-trigger"]'),
            $parent = $pop
              .parents()
              .filter(function() {
                return $(this).css("position") == "relative";
              })
              .first();

          // There can be only one close X
          if (!$closex.is(":only-of-type")) {
            $closex.siblings("span").remove();
          }

          /*
            // Remove close X if not needed
            if ($pop.is('.no-x') || $trigger.is('.hover-in-out')) {
                $closex.remove();
            }
            */

          // Handle close X click
          $closex.on("click touchstart", function() {
            $pop.removeClass("show").blur();
          });

          // Three ways to trigger pop box
          // Hover-in
          if ($trigger.is('[class*="hover-in"]')) {
            $trigger.on("mouseenter click", popBox);
            // Hover-in-out
            if ($trigger.is('[class*="-out"]')) {
              $trigger.on("mouseleave", function() {
                $pop.removeClass("show").blur();
              });
            }
          } else {
            // Click
            $trigger.on("click", popBox);
          }

          // Calculate and set position of the box
          function popBox() {
            var $popover = $(this).siblings(".popover"),
              $popunder = $(this).siblings(".popunder"),
              $parentLeft = $parent.position().left,
              $parentRight = $parent.width(),
              $triggerLeft = $trigger.position().left,
              $popoverWidth = $pop.outerWidth(),
              $triggerWidth = $trigger.outerWidth(),
              $widthDiff = ($popoverWidth - $triggerWidth) / 2,
              $popoverLeft = $triggerLeft - $widthDiff,
              $popoverRight = $popoverLeft + $popoverWidth,
              $popunderTop = $trigger.position().top + ($trigger.height() + 6);

            // Hide all other popover or popunder boxes
            $(".popover, .popunder").removeClass("show");

            // If left boundary exceeded
            if ($popoverLeft <= $parentLeft) {
              $popoverLeft = $parentLeft;
            }

            // If right boundary exceeded
            if ($popoverRight >= $parentRight) {
              $popoverLeft = $parentRight - $popoverWidth;
            }

            // Set popover position
            $popover
              .css({
                left: $popoverLeft
              })
              .addClass("show")
              .focus();

            // Set popunder position
            $popunder
              .css({
                top: $popunderTop,
                left: $popoverLeft
              })
              .addClass("show")
              .focus();

            return false;
          }

          // Hide box when click anywhere but trigger
          $(document).on("click", function() {
            $pop.removeClass("show").blur();
          });
        })
        .on("click", function() {
          return false;
        });
    },

    // Handle image theme background
    imageTheme: function() {
      $('[class*="theme-image"][data-image]').each(function() {
        var $theme = $(this),
          $size = $theme.data("size"),
          $image = $theme.data("image"),
          $position = $theme.data("position"),
          $background = $("<div/>"),
          $class = $theme.is('[class*="-circle"]')
            ? "theme-image-circle-background"
            : "theme-image-background";

        // Set background css properties
        $background
          .css({
            "background-image": "url(" + $image + ")",
            "background-position": $position,
            "background-size": $size
          })
          .addClass($class);

        // Insert background image
        $theme.prepend($background);

        // Make sure there is only one background
        if (!$background.is(":only-child")) {
          $background.siblings().remove();
        }
      });
    },

    // Wrap last word in arrow span
    linkArrow: function() {
      $('[class*="link-arrow"]')
        .not(".link-arrow-back")
        .each(function() {
          var $link = $(this)
            .html()
            .split(" ");

          // Wrap the last word + arrow in span
          $link =
            $link.slice(0, -1).join(" ") +
            ' <span class="arrow">' +
            $link.pop() +
            "</span>";

          // Insert span tag
          $(this).html($link);
        });
    }
  };

  main.init();
})(jQuery);
