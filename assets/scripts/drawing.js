// Create a Paper.js Path to draw a line into it:
var path;
// If true smooth drawing tool is on
var smooth = false;

function onMouseDown(event) {
  if (!path) {
    // Create a new path and set its stroke color to black:
    path = new Path({
      segments: [event.point],
      strokeColor: 'black',
      // Select the path, so we can see its segment points:
      fullySelected: true
    });
  } else {
    path.add(event.point);
  }
  // Select the path, so we can see its segments:
  path.fullySelected = true;
}

// While the user drags the mouse, points are added to the path
// at the position of the mouse:
function onMouseDrag(event) {
  if (smooth) {
    path.add(event.point);
  } else {
    // Update the last segment to follow the user's mouse
    path.removeSegment(path.segments.length-1);
    path.add(event.point);
    // Select the path, so we can see its segments:
    path.fullySelected = true;
  }
}

// When the mouse is released, we simplify the path:
function onMouseUp(event) {

  if (smooth) {
    // When the mouse is released, simplify it:
    path.smooth();
    path.simplify(25);
    path.flatten(25);
    // Used to calculate how simplified the path has been
    // var segmentCount = path.segments.length;
    // var newSegmentCount = path.segments.length;
    // var difference = segmentCount - newSegmentCount;
    // var percentage = 100 - Math.round(newSegmentCount / segmentCount * 100);
  } else {
    // Place the point for good once the user lifts their mouse
    path.removeSegment(path.segments.length-1);
    path.add(event.point);
  }
  // Select the path, so we can see its segments:
  path.fullySelected = true;
  // Display the total length of the drawing in mm
  updateTotalLength();
}

function updateTotalLength() {
	if (path) {
		$("#total-length-span").html(pixelsToMM(path.length));
	} else {
		$("#total-length-span").html(0);
	}
}

// Mapping from screen pixels to mm
function pixelsToMM(p) {
  // Round to at most 2 decimal places
  var pixels = $("#pixel-input").val();
  if (pixels == 0 || pixels == NaN) {
    pixels = 1;
  }
  return Math.round(p / pixels);
}

// Gets the angle b/t two vectors v1, v2 in degrees
function getAngle(v1, v2) {
  var angle =  Math.round(v1.getDirectedAngle(v2));
  return angle < 0 ? Math.max(angle,-90) : Math.min(angle, 90);
}

// Gets the dot product b/t two vectors v1, v2
function dot(v1, v2) {
  var result = v1 * v2;
  return result.x + result.y;
}

function rectifyPath(_path) {
  // TODO: Make this actually rectify the path, lol
  for (var i = 0; i < _path._segments.length - 2; i++) {
    var current_segment = _path._segments[i + 1]._point - _path._segments[i]._point
    var next_segment = _path._segments[i + 2]._point - _path._segments[i + 1]._point
    // Make sure the angle isn't bigger than 90 degs
    var angle = getAngle(current_segment, next_segment);
  }
}

function computeInstructions(segments) {
  var result = "";
  for (var i = 0; i < segments.length - 2; i++) {
    var current_segment = segments[i + 1]._point - segments[i]._point
    var next_segment = segments[i + 2]._point - segments[i + 1]._point
    var angle = getAngle(current_segment, next_segment);
    // Find the proper solenoid initialization angle
    var s_init = angle > 0 ? -15 : 15;
    // Set the solenoid in down position
    result += "s 0\n";
    // Extrude the length of the path
    result += "f " + Math.max(40, pixelsToMM(current_segment.length)) + "\n";
    // Set the solenoid on the correct side (given angle direction)
    result += "b " + s_init + "\n";
    // Set the solenoid in up position
    result += "s 1\n";
    // Move solenoid to angle b/t segments
    result += "b " + angle + "\n";
    // Move the solenoid away from the wire a tad
    angle = angle > 0 ? angle - 40 : angle + 40;
    result += "b " + angle + "\n";
    if (i == segments.length - 3) {
      // Set the solenoid in down position
      result += "s 0\n";
      // Extrude the length of the last path
      result += "f " + pixelsToMM(next_segment.length) + "\n";
    }
  }
  // End the job by putting the solenoid in the down position
  return result + "s 0";
}

$(document).ready(function() {
  $('#clear-button').on('mouseup', function(event) {
    path = null;
    paper.project.clear();
    paper.project.activate();
		updateTotalLength();
    $("#file_contents").val("");
  });

  $('#bend-button').on('mouseup', function(event) {
    if (path && path._segments.length >= 3) {
      // rectifyPath(path);
      var instr = computeInstructions(path._segments);
      submitDrawing(instr);
    } else {
      console.log("Not enough segments in the drawn path!");
    }
  });

	$("#pixel-input").on('input', function(event) {
		updateTotalLength();
	});

  $(".drawing-tool").on('mouseup', function(event) {
    if ($(this)[0].id == "smooth-button") {
      smooth = true;
    } else if ($(this)[0].id == "vector-button") {
      smooth = false;
    }
    // Deselect the selected tool
    $(".selected-tool").removeClass("selected-tool")
    // Select the newly selected tool
    $(this).addClass("selected-tool")
  });

  $('.preset-button').on('click', function(evnet) {
    $this = $(this);
    instruction = $this.data('instructions');
    $('#preset-contents').val(instruction);
    $('#preset-form').submit()
  });

  $('#preset-form').on('submit', function(event) {
      event.preventDefault();
      var $form = $(this);
      var device_id = $("#device_id").val();
      var access_token = $("#access_token").val();
      var url = 'https://api.particle.io/v1/devices/' + device_id + '/preset?access_token=' + access_token;
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
});
