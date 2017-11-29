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

	var newSegmentCount = path.segments.length;
	var difference = segmentCount - newSegmentCount;
	var percentage = 100 - Math.round(newSegmentCount / segmentCount * 100);
}

$(document).ready(function() {
  $('#clear-button').on('mouseup', function(event) {
		path = null;
		paper.project.clear();
		paper.project.activate();
  });

	$('#submit-button').on('mouseup', function(event) {
      console.log("bending the drawing!");
  });
});
