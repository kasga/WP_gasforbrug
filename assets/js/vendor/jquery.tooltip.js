/**
 * Tooltip plugin
 * 
 * Plugin to show tooltips or small popups next to the target.
 */
(function($) {
	$.fn.tooltips = function(opt) {
		var options = $.extend({
			tooltip: '.tooltip',				// The selector for the tooltip
			arrowClass: '.tooltip-arrow',		// The class of the arrow in the tooltip
			openEvent: "mouseenter",			// If the tooltip should show on click or mouseenter
			closeEvent: "mouseleave",			// If the tooltip should hide on click or mouseleave
			closeClass: ".tooltip-close",		// The class of the close button in the tooltip
			topContainer: ".main-container",	// Define the element which is the tooltips constrains
			alignment: "top",					// Should the tooltip show above ("top") or below ("bottom") the target?
			offset: 10							// Define the top/bottom offset from the target
		}, opt);
		return this.each(function() {
			var $target = $(this),
				hideTimer = null,
				stayOpen = false,
				tooltipOpen = false,
				openEvent = options.openEvent,
				offsetValue = options.offset,
				isTouchDevice = ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch,
				isMobile = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent||navigator.vendor||window.opera)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test((navigator.userAgent||navigator.vendor||window.opera).substr(0,4));

			var tooltip = $target.siblings(options.tooltip),
				pos_left = '',
				off_left = '',
				pos_top = '',
				off_top = '';

			// Function to positon the tooltip.
			var pos_tooltip = function(alignment) {
                $(tooltip).show();
                if ($("*:focus").is("textarea, input, select")) {
                    return;
                }
				if (alignment.toString() !== "top" && alignment !== "bottom" && alignment !== "left" && alignment !== "right") {
					alignment = options.alignment;
				}
                var targetMargin = '',
                    arrow_pos = '';
                $(tooltip).removeClass("top left bottom right").find(options.arrowClass).removeAttr("style");
				pos_left = $target.position().left + ( $target.outerWidth() / 2 ) - ( $(tooltip).outerWidth() / 2 );
				off_left = $target.offset().left + ( $target.outerWidth() / 2 ) - ( $(tooltip).outerWidth() / 2 );
				pos_top  = $target.position().top - $(tooltip).outerHeight() - 20;
				off_top  = $target.offset().top - $(tooltip).outerHeight() - 20;
				var containerOffset = ($(options.topContainer).outerWidth() - $(options.topContainer).width()) / 2;

				// Checking if the tooltip will go out of the container to the left. If it does it will position it inside.
				if (off_left < $(options.topContainer).offset().left) {
                    targetMargin = parseInt($target.css("marginLeft").replace("px", ""));
					pos_left = $target.position().left + targetMargin + $target.outerWidth() / 2 - 35;
					$(tooltip).addClass('left');
				}
				else {
					$(tooltip).removeClass('left');
				}

				// Checking if the tooltip will go out of the container to the right. If it does it will position it inside.
				if (off_left + $(tooltip).outerWidth() > $(options.topContainer).offset().left + $(options.topContainer).width()) {
                    targetMargin = parseInt($target.css("marginLeft").replace("px", ""));
					pos_left = $target.position().left + targetMargin + $target.outerWidth() / 2 + 35 - $(tooltip).outerWidth();
					$(tooltip).addClass('right');
				}
				else {
					$(tooltip).removeClass('right');
				}

				// Positioning the tooltip below the target if it is assigned through the options, or if the top of the tooltip is above the containers top.
				if (off_top < $(options.topContainer).offset().top && alignment === "top" || alignment === "bottom" ) {
					offsetValue = -Math.abs(offsetValue);
					$(tooltip).removeClass('bottom').addClass('top');
					pos_top = pos_top + $(tooltip).outerHeight() + $target.outerHeight() + 40;
					off_top = off_top + $(tooltip).outerHeight() + $target.outerHeight() + 40;
				}
				else if (alignment === "top") {
					offsetValue = Math.abs(offsetValue);
					$(tooltip).removeClass('top').addClass('bottom');
				}
				else if (alignment === "left") {
					$(tooltip).removeClass('bottom top');
					$(tooltip).removeClass("left").addClass("right");
					offsetValue = Math.abs(offsetValue);
					pos_top = $target.position().top + ($target.outerHeight() / 2) - ($(tooltip).outerHeight() / 2);
					pos_left = $target.position().left - $(tooltip).outerWidth() + offsetValue - 20;
					off_top = $target.offset().top - $target.position().top + pos_top;
					$(tooltip).width($(tooltip).width());
					if ($target.offset().left - $(tooltip).outerWidth() - offsetValue - 20 < $(options.topContainer).offset().left + containerOffset) {
						offsetValue = -Math.abs(offsetValue);
						if ($target.offset().left + $target.outerWidth() - offsetValue + 20 + $(tooltip).outerWidth() > $(options.topContainer).offset().left + containerOffset + $(options.topContainer).width()) {
							pos_tooltip("top");
							return;
						} else {
							pos_tooltip("right");
							return;
						}
					}
					if (off_top < $(window).scrollTop() || off_top < $(options.topContainer).offset().top) {
                        pos_top = $target.position().top - 16;
                        $(tooltip).find(options.arrowClass).css({
                            top: "16px",
                            bottom: "auto"
                        });
                        if ($target.offset().top - 16 < $(window).scrollTop()) {
                            pos_tooltip("bottom");
                            return;
                        }
					} else if ($target.offset().top - $target.position().top + pos_top + $(tooltip).outerHeight() > $(window).scrollTop() + window.innerHeight) {
						pos_top = $target.position().top - $(tooltip).outerHeight() + ($target.outerHeight() * 1.5);
						arrow_pos = $target.outerHeight();
						$(tooltip).find(options.arrowClass).css("bottom", arrow_pos);
					} else {
						$(tooltip).find(options.arrowClass).css({
							top: "auto",
							bottom: "50%"
						});
					}
				}
				else if (alignment === "right") {
					$(tooltip).removeClass("right").addClass("left");
					offsetValue = -Math.abs(offsetValue);
					pos_top = $target.position().top + ($target.outerHeight() / 2) - ($(tooltip).outerHeight() / 2);
					pos_left = $target.position().left + $target.outerWidth() - offsetValue + 20;
					off_top = $target.offset().top - $target.position().top + pos_top;
					if ($target.offset().left + $target.outerWidth() - offsetValue + 20 + $(tooltip).outerWidth() > $(options.topContainer).offset().left + containerOffset + $(options.topContainer).width()) {
						offsetValue = Math.abs(offsetValue);
						$(tooltip).width($(tooltip).width());
						if ($target.offset().left - $(tooltip).outerWidth() - offsetValue - 20 < $(options.topContainer).offset().left + containerOffset) {
							pos_tooltip("top");
							return;
						} else {
							pos_tooltip("left");
							return;
						}
					}
					if (off_top < $(window).scrollTop() || off_top < $(options.topContainer).offset().top) {
						pos_top = $target.position().top - 16;
						$(tooltip).find(options.arrowClass).css({
							top: "16px",
							bottom: "auto"
						});
                        if ($target.offset().top - 16 < $(window).scrollTop()) {
                            pos_tooltip("bottom");
                            return;
                        }
					} else if ($target.offset().top - $target.position().top + pos_top + $(tooltip).outerHeight() > $(window).scrollTop() + window.innerHeight) {
						pos_top = $target.position().top - $(tooltip).outerHeight() + ($target.outerHeight() * 1.5);
						arrow_pos = $target.outerHeight();
						$(tooltip).find(options.arrowClass).css("bottom", arrow_pos);
					} else {
						$(tooltip).find(options.arrowClass).css({
							top: "auto",
							bottom: "50%"
						});
					}
				}

				// If the tooltip should align below the target and the bottom of the tooltip is below the bottom of the screen viewport, then it will align above the target instead.
				if (alignment === "bottom" && off_top + $(tooltip).outerHeight() > $(window).scrollTop() + window.innerHeight) {
					pos_top  = $target.position().top - $(tooltip).outerHeight() - 20;
					off_top  = $target.offset().top - $(tooltip).outerHeight() - 20;
					offsetValue = Math.abs(offsetValue);
					$(tooltip).removeClass('top').addClass('bottom');
				}

				// If the top of the tooltip is above the screen viewport, then it will align below the target.
				if (alignment === "top" && off_top < $(window).scrollTop()) {
					offsetValue = -Math.abs(offsetValue);
					$(tooltip).removeClass('bottom').addClass('top');
					pos_top = pos_top + $(tooltip).outerHeight() + $target.outerHeight() + 40;
				}

				// Checking if you are on a mobile. It you are, then it will align the tooltip to the edges of the container.
				if (isMobile) {
					pos_left = ($target.parent().offset().left - $(options.topContainer).offset().left) * -1 + containerOffset;
					var pos_right = ($(options.topContainer).offset().left + $(options.topContainer).outerWidth() - ($target.parent().offset().left + $target.parent().outerWidth()) - containerOffset) * -1;
					$(tooltip).css('right', pos_right).removeClass("left right");
					var tarCenter = $target.offset().left + ($target.outerWidth() / 2) - containerOffset;
					$(tooltip).css("width", "auto");
					$(tooltip).find(options.arrowClass).css('left', tarCenter);
					if (alignment === "left" || alignment === "right") {
						options.alignment = "top";
						pos_tooltip(options.alignment);
					}
				}

				// Giving the tooltip its new top and left values.
				$(tooltip).css({
					left: pos_left,
					top: pos_top
				});
                $(tooltip).hide();
			};

			// Function to initialize the tooltip.
			var init_tooltip = function() {
				$target.parent().css('position', 'relative');
                
                $target.addClass("tooltip-is-open");
                
                $target.on("click",function(e){
                	e.preventDefault();
                });
                

				// Hiding other open tooltips.
				$(options.tooltip).not($(tooltip)).hide();

				pos_tooltip(options.alignment);

				// Showing the tooltip and doing a small animation the fade in the tooltip.
                if (!isMobile) {
                    if (options.alignment === "bottom" || options.alignment === "top") {
                        $(tooltip).css({
                            top: pos_top - offsetValue,
                            'display': 'block'
                        }).animate({
                            top: pos_top,
                            opacity: 1
                        }, 50, function() {
                            tooltipOpen = true;
                        });
                    } else if (options.alignment === "left" || options.alignment === "right") {
                        $(tooltip).css({
                            left: pos_left - offsetValue,
                            'display': 'block'
                        }).animate({
                            left: pos_left,
                            opacity: 1
                        }, 50, function() {
                            tooltipOpen = true;
                        });
                    }
                } else {
                    if (options.alignment === "bottom" || options.alignment === "top") {
                        $(tooltip).css({
                            top: pos_top,
                            'display': 'block'
                        }).animate({
                            opacity: 1
                        }, 50, function() {
                            tooltipOpen = true;
                        });
                    } else if (options.alignment === "left" || options.alignment === "right") {
                        $(tooltip).css({
                            left: pos_left,
                            'display': 'block'
                        }).animate({
                            opacity: 1
                        }, 50, function() {
                            tooltipOpen = true;
                        });
                    }
                }
			};

			// Function to close the tooltip with offset animation.
			var close_tooltip = function() {
                $target.removeClass("tooltip-is-open");
				tooltipOpen = false;
				if (options.alignment === "bottom" || options.alignment === "top") {
					$(tooltip).animate({
						top: pos_top - offsetValue,
						opacity: 0
					}, 50, function() {
						$(this).css('display', 'none');
						// Unbinding the resize and scroll events on the window. Then the functions won't run after the tooltip closes.
						$(window).off("resize scroll", pos_tooltip);
					});
				} else if (options.alignment === "left" || options.alignment === "right") {
					$(tooltip).animate({
						left: pos_left - offsetValue,
						opacity: 0
					}, 50, function() {
						$(this).css('display', 'none');
						// Unbinding the resize and scroll events on the window. Then the functions won't run after the tooltip closes.
						$(window).off("resize scroll", pos_tooltip);
					});
				}
			};

			if (isMobile || isTouchDevice) {
				openEvent = "click";
			}

			$target.on(openEvent, function() {

				stayOpen = true;

				init_tooltip();

				// Calling the function to position the tooltip correctly on resize and scroll.
                if (!isTouchDevice && !isMobile) {
                    $(window).on("resize scroll", pos_tooltip);
                }

				// Checking which close event is defined and acting according to it.
				if (options.closeEvent === "mouseleave" && !isTouchDevice) {
					// Defining a function to set a timeout for when the tooltip should fadeout.
					function setHideTimer() {
						// Clearing the hideTimer, to make sure no previous timeout is running.
						clearTimeout(hideTimer);
						hideTimer = setTimeout(function() {
							// If the stayOpen is true, the tooltip should stay open, then we will leave the timeout function.
							if (stayOpen) {
								return;
							}
							close_tooltip();
						}, 500);
					}
					$target.on(options.closeEvent, function() {
						stayOpen = false;
						setHideTimer();
					});
					$(tooltip).on("mouseenter", function() {
						stayOpen = true;
					}).on("mouseleave", function() {
						stayOpen = false;
						setHideTimer();
					});
					$(options.closeClass).on("click", function() {
						close_tooltip();
						return false;
					});
					
				} else {
					if(isTouchDevice){
						$(options.closeClass).off("click");
						$(options.closeClass).on("click", function(e) {
							e.preventDefault();
							close_tooltip();
							return false;
						});
					}
				
					var touchStart = 0;
					var mobileClickClose = function(e) {
						if ($(e.target).parents().andSelf().hasClass(options.tooltip.replace(".", ""))) {
                            return;
                        }
                        if ($(e.target).hasClass(options.closeClass.replace('.', ''))) {
							e.preventDefault();							
						}
						if (e.type === "touchstart") {
							touchStart = e.originalEvent.targetTouches[0].pageY;
						}
						else if (e.type === "touchend") {
							var touchEnd = e.originalEvent.changedTouches[0].pageY;
							if (touchStart - touchEnd > -10 && touchStart - touchEnd < 10) {
                                close_tooltip(e);
                                $("body").off("touchstart touchend", mobileClickClose);
							}
						}
					};
					var bodyClickClose = function(e) {
						// Closing the tooltip if you click outside the element.
						if ($(e.target).hasClass(options.closeClass.replace('.', ''))) {
							e.preventDefault();
						}
						if (tooltipOpen && !$(e.target).is($target) && !$(e.target).is($(tooltip)) && !$(e.target).parents().is($(tooltip)) || $(e.target).hasClass(options.closeClass.replace('.', ''))) {
							stayOpen = false;
							//close_tooltip();
                            $("body").off("click", bodyClickClose);
						}
					};

					if (isTouchDevice && 'ontouchstart' in document.documentElement) {
						$("body").on("touchstart touchend", mobileClickClose);
					} else {
						$("body").on("click", bodyClickClose);
					}
				}

				return false;
			});
		});
	};
})(jQuery);