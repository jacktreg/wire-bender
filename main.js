function readTextFile()
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
                $.("#form_data").val(data.join(",")+",");
                $.("#post_form").submit();
            }
        }
    }
    rawFile.send(null);
}
$( document ).ready(function() {
  $('#file_form').on('submit', function () {
      readTextFile();
      return false;
  });
});
