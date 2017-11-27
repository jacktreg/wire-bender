$( document ).ready(function() {
  $('#file_form').on('submit', function(event) {
      event.preventDefault();
      $.post({
        url: $form.attr('action'),
        data: $form.serialize(),
        success: function(data, status, xhr) {
          console.log(data);
        }
      });
      return false;
  });

  $('#bend_form').on('submit', function(event) {
      event.preventDefault();
      var $form = $(this);
      $.post({
        url: $form.attr('action'),
        data: $form.serialize(),
        success: function(data, status, xhr) {
          console.log(data);
        }
      });
  });

  $('#feed_form').on('submit', function(event) {
      event.preventDefault();
      var $form = $(this);
      $.post({
        url: $form.attr('action'),
        data: $form.serialize(),
        success: function(data, status, xhr) {
          console.log(data);
        }
      });
  });

  $('#solenoid_form').on('submit', function(event) {
      event.preventDefault();
      var $form = $(this);
      $.post({
        url: $form.attr('action'),
        data: $form.serialize(),
        success: function(data, status, xhr) {
          console.log(data);
        }
      });
  });
});
