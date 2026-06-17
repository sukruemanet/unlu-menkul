$(document).ready(function () {
  var navmobilemenu = $('ul.navmobilemenu');
});

;(function ($, window, document, undefined) {
  if ($('ul.navmobilemenu').length) {
    var collapsed = true;
    var close_same_level = false;
    var duration = 400;
    var listAnim = true;
    var easing = 'easeOutQuart';

    $('.navmobilemenu ul').css({ 'overflow': 'hidden', 'height': (collapsed) ? 0 : 'auto', 'display': (collapsed) ? 'none' : 'block' });

    var node = $('.navmobilemenu li:has(ul)');
    node.each(function (index, val) {
      $(this).children(':first-child').css('cursor', 'pointer');
      $(this).addClass('navmobilemenu-node navmobilemenu-' + ((collapsed) ? 'closed' : 'open'));
      $(this).children('ul').addClass('navmobilemenu-level-' + ($(this).parentsUntil($('ul.navmobilemenu'), 'ul').length + 1));
    });

    $('.navmobilemenu li > *:first-child').on('click.navmobilemenu-active', function (e) {
      if ($(this).parent().hasClass('navmobilemenu-closed')) {
        $('.navmobilemenu-active').not($(this).parent()).removeClass('navmobilemenu-active');
        $(this).parent().addClass('navmobilemenu-active');
      } else if ($(this).parent().hasClass('navmobilemenu-open')) {
        $(this).parent().removeClass('navmobilemenu-active');
      } else {
        $('.navmobilemenu-active').not($(this).parent()).removeClass('navmobilemenu-active');
        $(this).parent().toggleClass('navmobilemenu-active');
      }
    });

    node.children(':first-child').on('click.navmobilemenu', function (e) {
      var el = $(this).parent().children('ul').first();
      var isOpen = $(this).parent().hasClass('navmobilemenu-open');

      if (close_same_level && !isOpen) {
        var close_items = $(this).closest('ul').children('.navmobilemenu-open').not($(this).parent()).children('ul');
        if ($.Velocity) {
          close_items.velocity({
            height: 0
          }, {
            duration: duration,
            easing: easing,
            display: 'none',
            delay: 100,
            complete: function () {
              setNodeClass($(this).parent(), true);
            }
          });
        } else {
          close_items.delay(100).slideToggle(duration, function () {
            setNodeClass($(this).parent(), true);
          });
        }
      }

      el.css({ 'height': 'auto' });

      if (!isOpen && $.Velocity && listAnim) el.find(' > li, li.navmobilemenu-open > ul > li').css({ 'opacity': 0 }).velocity('stop').velocity('list');

      if ($.Velocity) {
        el.velocity('stop').velocity({
          height: isOpen ? [0, el.outerHeight()] : [el.outerHeight(), 0]
        }, {
          queue: false,
          duration: duration,
          easing: easing,
          display: isOpen ? 'none' : 'block',
          begin: setNodeClass($(this).parent(), isOpen),
          complete: function () {
            if (!isOpen) $(this).css('height', 'auto');
          }
        });
      } else {
        setNodeClass($(this).parent(), isOpen);
        el.slideToggle(duration);
      }

      e.preventDefault();
    });

    function setNodeClass(el, isOpen) {
      if (isOpen) {
        el.removeClass('navmobilemenu-open').addClass('navmobilemenu-closed');
      } else {
        el.removeClass('navmobilemenu-closed').addClass('navmobilemenu-open');
      }
    }

    if ($.Velocity && listAnim) {
      $.Velocity.Sequences.list = function (element, options, index, size) {
        $.Velocity.animate(element, {
          opacity: [1, 0],
          translateY: [0, -(index + 1)]
        }, {
          delay: index * (duration / size / 2),
          duration: duration,
          easing: easing
        });
      };
    }

    if ($('.navmobilemenu').css('opacity') == 0) {
      if ($.Velocity) {
        $('.navmobilemenu').css('opacity', 1).children().css('opacity', 0).velocity('list');
      } else {
        $('.navmobilemenu').show(200);
      }
    }
  }
}(jQuery, this, this.document));