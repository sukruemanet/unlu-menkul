
$(document).ready(function () {
$('.selectBox').SumoSelect({
  placeholder: 'Style Select'
});

$('.selectBox').on('change', function () {
  let selectedText = $(this).find('option:selected').text();
  let parentBox = $(this).closest('.selectbox');
  if (parentBox.find('.selected-item').length) {
    parentBox.find('.selected-item').text(selectedText);
  }
  parentBox.find('.selectBox').addClass('active');
});

$('.selectBox').on('sumo:opening', function () {
  let $dropdown = $(this).parent().find('.optWrapper');
  let spaceBelow = $(window).height() - $(this).offset().top - $(this).outerHeight();
  let spaceAbove = $(this).offset().top;
  if (spaceBelow < 200 && spaceAbove > spaceBelow) {
    $dropdown.addClass('up');
  } else {
    $dropdown.removeClass('up');
  }
});
});