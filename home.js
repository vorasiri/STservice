console.log('hello from home.js')
window.$ = window.jQuery = require('jquery');

// Read MyGlobalVariable.
const { ipcRenderer, remote } = require("electron");
let user = remote.getGlobal("user")
ipcRenderer.send('createMysqlCon')
const con = remote.getGlobal("con");

// Read json
const thaiTranslate = require("./thai_translate.json")
const headerInfo = require("./header_info.json")
const position = require("./position.json")

// drop down of mainMenu
var dropdown = document.getElementsByClassName("dropdown-btn");

for (var i = 0; i < dropdown.length; i++) {
  dropdown[i].addEventListener("click", function () {
    this.classList.toggle("active");
    var dropdownContent = this.nextElementSibling;
    if (dropdownContent.style.display === "block") {
      dropdownContent.style.display = "none";
    } else {
      dropdownContent.style.display = "block";
    }
    for (var i = 0; i < dropdown.length; i++) {
      if (dropdown[i] != this) {
        dropdown[i].classList.remove("active");
        dropdown[i].nextElementSibling.style.display = "none"
      }
    }
  });
}
// deal with idle user
(function () {

  const idleDurationSecs = 30 * 60;    // X number of seconds
  let idleTimeout; // variable to hold the timeout, do not modify

  const resetIdleTimeout = function () {

    // Clears the existing timeout
    if (idleTimeout) clearTimeout(idleTimeout);

    // Set a new idle timeout to load the redirectUrl after idleDurationSecs
    idleTimeout = setTimeout(() => logout(), idleDurationSecs * 1000);
  };

  // Init on page load
  resetIdleTimeout();

  // Reset the idle timeout on any of the events listed below
  ['click', 'touchstart', 'mousemove'].forEach(evt =>
    document.addEventListener(evt, resetIdleTimeout, false)
  );

})();

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

      mysqlFetching(pageHeader, function (err, result, field) {
        if (err) {
          // error handling code goes here
          console.log("ERROR : ", err);
        } else {
          // code to execute on data retrieval
          console.log("result from db is : ", result);
          let infoTable = new Table('#infoTable', 30, result, field);

          infoTable.clearTable()
          infoTable.loadField()
          infoTable.loadTable()

          // create pagination button
          var currentPage = 1
          let pagination = document.getElementById('pagination')
          pagination.appendChild(aTag('&laquo;')).addEventListener('click', function () {
            if (currentPage != 1)
              currentPage--;
          })
          console.log(infoTable)
          for (var i = 1; i <= infoTable.totalPage; i++) {
            pagination.appendChild(aTag(`${i}`)).addEventListener('click', function () {
              currentPage = parseInt(this.innerHTML);
            })
          }
          pagination.appendChild(aTag('&raquo;')).addEventListener('click', function () {
            if (currentPage != infoTable.totalPage)
              currentPage++;
          })
          pagination.addEventListener('click', function () {
            infoTable.clearTable(1)
            infoTable.loadTable(currentPage)
            highlightPageNumber(pagination, currentPage)
          })
          highlightPageNumber(pagination, currentPage)
        }

      });

    })
  })
});

// staffName and position
document.getElementById('staffName').innerText = user[0];
document.getElementById('staffPosition').innerText = position[user[1]];

// logout
function logout() {
  ipcRenderer.send("loginUser", '');
  location.replace("./login.html")
}

document.getElementById('logoutButton').addEventListener('click', function (event) {
  event.preventDefault();
  logout()
})

// init Table class with fetched data from mysql
function mysqlFetching(pageHeader, callback) {
  var query = ''
  if (headerInfo[pageHeader].table.includes('info')) {
    query = `${headerInfo[pageHeader].query}`
  }
  else {
    query = `SELECT * FROM ${headerInfo[pageHeader].table}`
  }
  con.query(query, function (err, result, field) {
    console.log(`fetching table: ${headerInfo[pageHeader].table}`)
    if (err) {
      ipcRenderer.send('createMysqlCon')
      callback(err, null, null);
    }
    else
      callback(null, result, field);
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

// Part form //
// modal function for modalID
function showModal(modalID) {
  console.log('Loading Modal..')
  document.getElementById(modalID).style.display = 'block'
}

// Others //

function contains(target, pattern) {
  var value = 0;
  pattern.forEach(function (word) {
    value = value + target.includes(word);
  });
  return (value === 1)
}

function aTag(innerText) {
  var newElement = document.createElement('a')
  newElement.innerHTML = `${innerText}`
  return newElement
}

function highlightPageNumber(pagination, pageNumber) {
  for (let i = 0; i < pagination.children.length; i++) {
    if (pagination.children[i].text == pageNumber) {
      pagination.children[i].classList.add("active")
    }
    else
      pagination.children[i].classList.remove("active")
  }
}

// table related
class Table {
  constructor(jQueryTableID, pageSize, fetchResult, fetchField) {
    this.table = $(jQueryTableID)
    this.result = fetchResult
    this.field = fetchField
    this.pageSize = pageSize
    this.totalPage = Math.ceil(fetchResult.length / pageSize)
  }

  clearTable(startRow = 0) {
    while (this.table[0].rows.length > startRow) {
      this.table[0].deleteRow(startRow);
    }
  }

  loadField() {
    var tagTH = ''
    for (var value of this.field) {
      if (value !== undefined) {
        tagTH += `<th>${thaiTranslate[0][value.name]}</th>`
      }
    }
    this.table.append(`<tr>${tagTH}</tr>`);
  }

  loadTable(page = 1) {
    let start = (page - 1) * this.pageSize
    let end = start + this.pageSize
    for (var i = start; i < end; i++) {
      let row = this.result[i]
      if (row !== undefined) {
        var tagTD = ''
        for (var propName in row) {
          if (row.hasOwnProperty(propName)) {
            if (propName == 'staff_position') {
              tagTD += `<td>${position[row[propName]]}</td>`
            }
            else {
              tagTD += `<td>${row[propName]}</td>`
            }
          }
        }
        this.table.append(`<tr>${tagTD}</tr>`);
      }
    }
  }

}