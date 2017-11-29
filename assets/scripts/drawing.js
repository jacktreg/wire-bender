// Create a Paper.js Path to draw a line into it:
var path;

function onMouseDown(event) {
  // If we haven't created the path yet, initialize
  if (!path) {
    // Create a new path and set its stroke color to black:
    path = new Path({
      segments: [event.point],
      strokeColor: 'black',
      // Select the path, so we can see its segment points:
      fullySelected: true
    });
  }

}

// While the user drags the mouse, points are added to the path
// at the position of the mouse:
function onMouseDrag(event) {
  path.add(event.point);
}

// When the mouse is released, we simplify the path:
function onMouseUp(event) {
  var segmentCount = path.segments.length;

  // When the mouse is released, simplify it:
  path.smooth();
  path.simplify(25);
  path.flatten(25);

  // Select the path, so we can see its segments:
  path.fullySelected = true;
  // Display the total length of the drawing in mm
	updateTotalLength();
  var newSegmentCount = path.segments.length;
  var difference = segmentCount - newSegmentCount;
  var percentage = 100 - Math.round(newSegmentCount / segmentCount * 100);
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
  return Math.round(p / $("#pixel-input").val() * 100) / 100;
}

// Gets the angle b/t two vectors v1, v2 in degrees
function getAngle(v1, v2) {
  return Math.sign(v2.angle - v1.angle) * Math.acos(dot(v1, v2) / (v1.length * v2.length)) * 57.2958;
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
    var s_init = angle > 0 ? -5 : 5;
    // Set the solenoid in down position
    result += "s 0\n";
    // Extrude the length of the path
    result += "f " + pixelsToMM(current_segment.length) + "\n";
    // Set the solenoid on the correct side (given angle direction)
    result += "b " + s_init + "\n";
    // Set the solenoid in up position
    result += "s 1\n";
    // Move solenoid to angle b/t segments
    result += "b " + angle + "\n";
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
  });

  $('#submit-button').on('mouseup', function(event) {
    if (path && path._segments.length >= 3) {
      rectifyPath(path);
      console.log("Instructions: ");
      console.log(computeInstructions(path._segments));
    } else {
      console.log("Not enough segments in the drawn path!");
    }
  });

	$("#pixel-input").on('input', function(event) {
		updateTotalLength();
	})
});
