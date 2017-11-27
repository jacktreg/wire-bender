function readTextFile(filename)
{
    var rawFile = new XMLHttpRequest();
    var data = [];
    rawFile.open("GET", "shapes/square.dat", false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                var allLines = allText.split(/\r\n|\n/);
                $.each(allLines, function(index, line){
                  var actions = line.split(" ");
                  if (actions.length >= 2) {
                    data.push(actions[0] + "-" + actions[1]);
                  }
                });
                console.log(data.join(",") + ",")
                // $.("#form_data").val(JSON.stringify(data));
                // $.("#post_form").submit();
            }
        }
    }
    rawFile.send(null);
}

function processContent(content){
  var data = [];
  var allLines = content.split(/\r\n|\n/);
  $.each(allLines, function(index, line){
    var actions = line.split(" ");
    if (actions.length >= 2) {
      data.push(actions[0] + actions[1]);
    }
  });
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
  document.getElementById('file')
    .addEventListener('change', processFile)
});
