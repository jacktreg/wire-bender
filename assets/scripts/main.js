function processContent(content){
  var data = [];
  var allLines = content.split(/\r\n|\n/);
  $.each(allLines, function(index, line){
    var actions = line.split(" ");
    if (actions.length >= 2) {
      data.push(actions[0] + actions[1]);
    }
  });
  $("#file_contents").val(data.join(",") + ",");
  console.log(data.join(",") + ",")
}

function processFile(event) {
	const input = event.target
  if ('files' in input && input.files.length > 0) {
	  var file = input.files[0];
    const reader = new FileReader();
    var result = new Promise((resolve, reject) => {
      reader.onload = event => resolve(event.target.result)
      reader.onerror = error => reject(error)
      reader.readAsText(file)
    })
    result.then(content => {
    	processContent(content)
    }).catch(error => console.log(error))
  }
}

$( document ).ready(function() {
  if (document.getElementById('file') ) {
    document.getElementById('file').addEventListener('change', processFile)
  }

  $('#file_form').on('submit', function(event) {
      event.preventDefault();
      var $form = $(this);
      var device_id = $("#device_id").val()
      var access_token = $("#access_token").val()
      var url = 'https://api.particle.io/v1/devices/'+device_id+'/process?access_token='+access_token
      $.post({
        url: url,
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
      var device_id = $("#device_id").val()
      var access_token = $("#access_token").val()
      var url = 'https://api.particle.io/v1/devices/'+device_id+'/bend?access_token='+access_token
      $.post({
        url: url,
        data: $form.serialize(),
        success: function(data, status, xhr) {
          console.log(data);
        }
      });
  });

  $('#feed_form').on('submit', function(event) {
      event.preventDefault();
      var $form = $(this);
      var device_id = $("#device_id").val()
      var access_token = $("#access_token").val()
      var url = 'https://api.particle.io/v1/devices/'+device_id+'/feed?access_token='+access_token
      $.post({
        url: url,
        data: $form.serialize(),
        success: function(data, status, xhr) {
          console.log(data);
        }
      });
  });

  $('#solenoid_form').on('submit', function(event) {
      event.preventDefault();
      var $form = $(this);
      var device_id = $("#device_id").val()
      var access_token = $("#access_token").val()
      var url = 'https://api.particle.io/v1/devices/'+device_id+'/solenoid?access_token='+access_token
      $.post({
        url: url,
        data: $form.serialize(),
        success: function(data, status, xhr) {
          console.log(data);
        }
      });
  });
});
