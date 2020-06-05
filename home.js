console.log('hello from home.js')
window.$ = window.jQuery = require('jquery');

// Read MyGlobalVariable.
const { ipcRenderer, remote } = require("electron");
let user = remote.getGlobal("user")
const con = remote.getGlobal("con");

// Read json
const thaiTranslate = require("./thai_translate.json")
const headerInfo = require("./header_info.json")

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

// mainMenu navigation & infoPage functionallity
var fs = require('fs');
var pageHeader;

const allNavButton = document.getElementsByClassName('navButton');
Array.from(allNavButton).forEach(navButton => {
  navButton.addEventListener('click', function (e) {
    fs.readFile('info_page.html', function (err, data) {
      pageHeader = e.target.innerText.replace(/\s/g, '')
      console.log(pageHeader)
      document.getElementById('mainContent').innerHTML = data.toString();
      if (contains(e.target.innerHTML, ['แอร์', 'เครื่องทำน้ำอุ่น', 'จานดาวเทียม'])) {
        document.getElementById('pageHeader').innerHTML = 'ข้อมูลการติดตั้ง ' + e.target.innerText;
      }
      else if (contains(e.target.innerHTML, ['รายการอะไหล่', 'รายการอุปกรณ์'])) {
        document.getElementById('importButton').style.visibility = 'visible'
        document.getElementById('pageHeader').innerHTML = e.target.innerText;
      }
      else {
        document.getElementById('pageHeader').innerHTML = e.target.innerText;
      }
      document.getElementById('addButton').addEventListener('click', function () {
        callHtmlFile(headerInfo[pageHeader].form)
      });
      document.getElementById('importButton').addEventListener('click', function () {
        callHtmlFile(headerInfo[pageHeader].import)
      });
      mysqlFetching(pageHeader)
    })
  })
});

// staffName and position
document.getElementById('staffName').innerText = user[0];
document.getElementById('staffPosition').innerText = user[1];

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

function loadTable(result, field) {
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
  var query = ''
  if (headerInfo[pageHeader].table.includes('info')) {
    query = `${headerInfo[pageHeader].query}`
  }
  else {
    query = `SELECT * FROM ${headerInfo[pageHeader].table}`
  }
  con.query(query, function (err, result, field) {
    if (err) throw err;
    console.log(`fetching table: ${headerInfo[pageHeader].table}`)
    loadTable(result, field)
  })
}

// call html file to id 'mainContent'
function callHtmlFile(filename) {
  console.log(filename)
  fs.readFile(filename.toString(), function (err, data) {
    document.getElementById('mainContent').innerHTML = data.toString();
    if (document.getElementById('customerSearchButton')) {
      document.getElementById('customerSearchButton').addEventListener('click', function (event) {
        event.preventDefault()
        showModal('searchModal')
      })
    }
  })
};

// modal function for modalID
function showModal(modalID) {
  console.log('Loading Modal..')
  document.getElementById(modalID).style.display = 'block'
}
