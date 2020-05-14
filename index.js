var dropdown = document.getElementsByClassName("dropdown-btn");
var i;

for (i = 0; i < dropdown.length; i++) {
  dropdown[i].addEventListener("click", function () {
    this.classList.toggle("active");
    var dropdownContent = this.nextElementSibling;
    if (dropdownContent.style.display === "block") {
      dropdownContent.style.display = "none";
    } else {
      dropdownContent.style.display = "block";
    }
  });
}

// button for load external html to mainpage
var fs = require('fs');

document.getElementById('my-button').addEventListener('click', function () {
  fs.readFile('info_page.html', function (err, data) {
    document.getElementById('my-div').innerHTML = data.toString()
  })
})