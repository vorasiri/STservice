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

const allNavButton = document.getElementsByClassName('navButton');
Array.from(allNavButton).forEach(navButton => {
  navButton.addEventListener('click', function (e) {
    fs.readFile('info_page.html', function (err, data) {
      console.log(e.target.innerText)
      document.getElementById('mainContent').innerHTML = data.toString();
      if (contains(e.target.innerHTML, ['แอร์', 'เครื่องทำน้ำอุ่น', 'จานดาวเทียม'])) {
        document.getElementById('pageHeader').innerHTML = 'ข้อมูลการติดตั้ง ' + e.target.innerText;
      }
      else {
        document.getElementById('pageHeader').innerHTML = e.target.innerText;
      }
      document.getElementById('addButton').addEventListener('click', function () {
        callHtmlFile(headerToForm(e.target.innerText))
      });
    })
  })
});

function contains(target, pattern) {
  var value = 0;
  pattern.forEach(function (word) {
    value = value + target.includes(word);
  });
  return (value === 1)
}

// call html file to id 'mainContent'
function callHtmlFile(filename) {
  console.log(filename)
  fs.readFile(filename.toString(), function (err, data) {
    document.getElementById('mainContent').innerHTML = data.toString();
  })
};

// put the right forms.html to current page add button
function headerToForm(pageHeader) {
  console.log(pageHeader)
  var form;
  if (pageHeader.includes('ข้อมูลบริการซ่อม')) {
    form = 'forms/repairing_form.html';
  }
  else if (pageHeader.includes('ข้อมูลการคืนสินค้า')) {
    form = 'forms/returning_form.html';
  }
  else if (pageHeader.includes('ข้อมูลการจัดส่งสินค้า')) {
    form = 'forms/delivery_form.html';
  }
  else if (pageHeader.includes('จานดาวเทียม')) {
    form = 'forms/installation_sat_form.html';
  }
  else if (pageHeader.includes('แอร์')) {
    form = 'forms/installation_ac_form.html';
  }
  else if (pageHeader.includes('เครื่องทำน้ำอุ่น')) {
    form = 'forms/installation_wh_form.html';
  }
  else if (pageHeader.includes('รายชื่อยี่ห้อ')) {
    form = 'forms/brand_form.html';
  }
  else if (pageHeader.includes('รายชื่อลูกค้า')) {
    form = 'forms/customer_form.html';
  }
  else if (pageHeader.includes('รายชื่อพนักงาน')) {
    form = 'forms/staff_form.html';
  }
  else if (pageHeader.includes('รายชื่อศูนย์บริการ')) {
    form = 'forms/service_partner_form.html';
  }
  else if (pageHeader.includes('รายการอะไหล่')) {
    // form = '.html';
  }
  return form;
};