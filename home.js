window.$ = window.jQuery = require('jquery');

// Read MyGlobalVariable.
const { ipcRenderer, remote } = require("electron");
let user = remote.getGlobal("user")
const con = remote.getGlobal("con");

// Read json
const thaiTranslate = require("./thai_translate.json")

// drop down of mainMenu
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

// mainMenu navigation
var fs = require('fs');
var pageHeader;

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
      pageHeader = e.target.innerText
      document.getElementById('addButton').addEventListener('click', function () {
        callHtmlFile(headerToForm(pageHeader))
      });
      mysqlFetching(pageHeader)
    })
  })
});

// staffName
document.getElementById('staffName').innerText = user;

// logout
document.getElementById('logoutButton').addEventListener('click', function (event) {
  event.preventDefault();
  ipcRenderer.send("loginUser", '');
  location.replace("./login.html")
})

function contains(target, pattern) {
  var value = 0;
  pattern.forEach(function (word) {
    value = value + target.includes(word);
  });
  return (value === 1)
}

function clearTable(startRow = 0) {
  var table = document.getElementById('infoTable');
  while (table.rows.length > startRow) {
    table.deleteRow(startRow);
  }
}

function loadDefault(result, field) {
  var table = $('#infoTable')
  var tagTH = ''
  for (var value of field) {
    if (value !== undefined) {
      tagTH += `<th>${thaiTranslate[0][value.name]}</th>`
    }
  }
  table.append(`<tr>${tagTH}</tr>`);
  for (var row of result) {
    if (row !== undefined) {
      var tagTD = ''
      console.log(row)
      for (var propName in row) {
        if (row.hasOwnProperty(propName)) {
          tagTD += `<td>${row[propName]}</td>`
        }
      }
      table.append(`<tr>${tagTD}</tr>`);
    }
  }
}

// infoPage mysql fetching
function mysqlFetching(pageHeader) {
  clearTable()
  con.query(`SELECT * FROM ${headerToTable(pageHeader)}`, function (err, result, field) {
    if (err) throw err;
    console.log(`fetching table: ${headerToTable(pageHeader)}`)
    loadDefault(result, field)
  })
}

// call html file to id 'mainContent'
function callHtmlFile(filename) {
  console.log(filename)
  fs.readFile(filename.toString(), function (err, data) {
    document.getElementById('mainContent').innerHTML = data.toString();
  })
};

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

function headerToTable(pageHeader) {
  var table;
  if (pageHeader.includes('ข้อมูลบริการซ่อม')) {
    table = 'info_repairing';
  }
  else if (pageHeader.includes('ข้อมูลการคืนสินค้า')) {
    table = 'info_returning';
  }
  else if (pageHeader.includes('ข้อมูลการจัดส่งสินค้า')) {
    table = 'info_delivery';
  }
  else if (pageHeader.includes('จานดาวเทียม')) {
    table = 'info_installation_sat';
  }
  else if (pageHeader.includes('แอร์')) {
    table = 'info_installation_ac';
  }
  else if (pageHeader.includes('เครื่องทำน้ำอุ่น')) {
    table = 'info_installation_wh';
  }
  else if (pageHeader.includes('รายชื่อยี่ห้อ')) {
    table = 'brands';
  }
  else if (pageHeader.includes('รายชื่อลูกค้า')) {
    table = 'customers';
  }
  else if (pageHeader.includes('รายชื่อพนักงาน')) {
    table = 'staff';
  }
  else if (pageHeader.includes('รายชื่อศูนย์บริการ')) {
    table = 'service_suppliers';
  }
  else if (pageHeader.includes('รายการอะไหล่')) {
    table = 'spare_parts';
  }
  return table;
};