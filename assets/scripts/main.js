function processContent(content){
  var data = [];
  var allLines = content.split(/\r\n|\n/);
  $.each(allLines, function(index, line){
    var actions = line.split(" ");
    if (actions.length >= 2) {
      data.push(actions[0] + actions[1]);
    }
  });
  return data;
}

function fileToInstructions(content) {
  data = processContent(content);
  $("#file_contents").val(data.join(",") + ",");
}

function submitDrawing(content) {
  data = processContent(content)
  var chunked_data = [];
  var current_chunk = "";
  var pushed_last = false;
  for (var i=0; i<data.length; i++) {
    if (current_chunk.length + data[i].length + 1 < 63) {
      current_chunk += data[i] + ",";
      pushed_last = false;
    } else {
      chunked_data.push(current_chunk);
      current_chunk = data[i] + ",";
      pushed_last = true;
    }
  }
  if (!pushed_last) {
    chunked_data.push(current_chunk);
  }
  console.log("total chunks: " + chunked_data.length);
  for (var i=0; i<chunked_data.length; i++) {
    console.log("bending chunk: " + chunked_data[i]);
    $("#file_contents").val(chunked_data[i]);
    $("#file_form").submit();
  }

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
    	fileToInstructions(content)
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
        async:false,
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

  $('#rotate_form').on('submit', function(event) {
      event.preventDefault();
      var $form = $(this);
      var device_id = $("#device_id").val()
      var access_token = $("#access_token").val()
      var url = 'https://api.particle.io/v1/devices/'+device_id+'/rotate?access_token='+access_token
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
