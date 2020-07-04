console.log('hello from home.js')
window.$ = window.jQuery = require('jquery');
require('jthailand/jquery.Thailand.js/dependencies/typeahead.bundle.js')
require('jthailand/jquery.Thailand.js/dist/jquery.Thailand.min.js')

// Read MyGlobalVariable.
const { ipcRenderer, remote } = require("electron");
let user = remote.getGlobal("user")
ipcRenderer.send('createMysqlCon')
var con = remote.getGlobal("con");

// Read json
const thaiTranslate = require("./json_information/thai_translate.json")
const headerInfo = require("./json_information/header_info.json")
const colName = require("./json_information/col_name.json")
const tableField = require("./json_information/table_field.json")
const position = require("./json_information/position.json")
const notification = require("./json_information/notification_status.json")

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
        callHtmlFile(headerInfo[pageHeader].form, 1)
      });
      document.getElementById('importButton').addEventListener('click', function () {
        callHtmlFile('info_page.html', 2, pageHeader)
      });

      makeCompleteTable(pageHeader)

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

// notification 
refreshNotificationBar(true)
async function refreshNotificationBar(updateStatus = false) {
  // update rows when condition meet
  if (updateStatus) {
    for (var l = 0; l < notification.updateTable.length; l++) {
      for (var j = 0; j < notification[notification.updateTable[l]].update.length; j++) {
        try {
          await mysqlUpdatingNotification(notification[notification.updateTable[l]].update[j])
        }
        catch (err) {
          console.log(err)
        }
      }
    }
  }

  let notificationBar = $('#notificationBar')
  // clear the bar
  notificationBar.empty()

  // add
  for (var l = 0; l < notification.initTable.length; l++) {
    try {
      let promise = await mysqlFetchingNotification(notification.initTable[l], l)
      let result = promise[0]
      let i = promise[2]

      if (result.length > 0) {
        let installingTask = [notification.header[1], notification.header[2], notification.header[3]]
        if (installingTask.includes(notification.header[i]) && !(includeInAttr(notificationBar[0].children, 'innerText', 'งานติดตั้ง'))) {
          notificationBar.append('<h3>งานติดตั้ง</h3>');
        }
        notificationBar.append(`${notification.header[i]}`);
        for (var j = 0; j < result.length; j++) {
          let resultValue = Object.values(result[j])
          if (i == 0) { // deli
            notificationBar.append(`<div class="card">
            <div class="jobID">
                <b>${resultValue[0]}</b>
            </div>
            <div class="jobDetail">
                นัดหมาย:${resultValue[1].format("dd/mm/yyyy HH:MM")}<br>
                ${resultValue[2]}<br>
                ${resultValue[3]}<br>
                ${deliveryProductRead(resultValue[4], resultValue[5], resultValue[6])}
                พนักงานติดตั้ง:${resultValue[7]}
            </div>
            <div class="groupbtn">
                <button class="editbtn">แก้ไข</button>
                <button class="checkbtn">&#10003;</button>
                <button class="crossbtn">&#10005;</button>
            </div>
            </div>`);
          }
          else if (i == 1 || i == 3) { // installing AC and WH
            notificationBar.append(`<div class="card">
            <div class="jobID">
                <b>${resultValue[0]} ${notification.installingType[resultValue[1]]}</b>
            </div>
            <div class="jobDetail">
                นัดหมาย:${resultValue[2].format("dd/mm/yyyy HH:MM")}<br>
                ${resultValue[3]}<br>
                ${resultValue[4]}<br>
                ${resultValue[5]}/${resultValue[6]}<br>
                พนักงานติดตั้ง:${resultValue[7]}
            </div>
            <div class="groupbtn">
                <button class="editbtn">แก้ไข</button>
                <button class="checkbtn">&#10003;</button>
                <button class="crossbtn">&#10005;</button>
            </div>
            </div>`);
          }
          else if (i == 2) { // installing SAT
            notificationBar.append(`<div class="card">
            <div class="jobID">
                <b>${resultValue[0]} ${notification.installingType[resultValue[1]]}</b>
            </div>
            <div class="jobDetail">
                นัดหมาย:${resultValue[2].format("dd/mm/yyyy HH:MM")}<br>
                ${resultValue[3]}<br>
                ${resultValue[4]}<br>
                ${resultValue[5]}/${resultValue[6]}/${resultValue[7]} = ${resultValue[8]}<br>
                พนักงานติดตั้ง:${resultValue[9]}
            </div>
            <div class="groupbtn">
                <button class="editbtn">แก้ไข</button>
                <button class="checkbtn">&#10003;</button>
                <button class="crossbtn">&#10005;</button>
            </div>
            </div>`);
          }
          else if (i == 4) { // repair
            notificationBar.append(`<div class="card">
            <div class="jobID">
                <b>${resultValue[0]}</b>
            </div>
            <div class="jobDetail">
                วันที่-เวลา ${resultValue[1].format("dd/mm/yyyy HH:MM")}<br>
                ชื่อ-นามสกุล ${resultValue[2]}<br>
                หมายเลขโทรศัพท์ ${resultValue[3]}<br>
                ${resultValue[4]}/${resultValue[5]}/<br>${resultValue[6]} <br>
                พนักงานติดตั้ง ${resultValue[7]}
            </div>
            <div class="groupbtn">
                <button class="editbtn">แก้ไข</button>
                <button class="checkbtn">&#10003;</button>
                <button class="crossbtn">&#10005;</button>
            </div>
            </div>`);
          }
          else if (i == 5) { // return
            notificationBar.append(`<div class="card">
            <div class="jobID">
                <b>${resultValue[0]}</b>
            </div>
            <div class="jobDetail">
                สถานะ:${notification[notification.initTable[i]].read[resultValue[1]].text}<br>
                สิ่งที่ต้องทำ:${notification[notification.initTable[i]].read[resultValue[1]].task}<br>
                ${resultValue[2]}/${resultValue[3]}/${resultValue[4]}<br>
                อาการ:${resultValue[5]}
            </div>
            <div class="groupbtn">
                <button class="editbtn">แก้ไข</button>
                <button class="checkbtn">&#10003;</button>
                <button class="crossbtn">&#10005;</button>
            </div>
            </div>`);
          }
          // get target row of that table
          let jobID = notificationBar.children().last()[0].innerText.split('<br>')[0][0]
          let currentTable = notification.initTable[i]
          // console.log(currentTable, jobID)

          // add event handler
          notificationBar.children().last()[0].getElementsByClassName('editbtn')[0].addEventListener('click', () => {

          })

          if (result.length > 1 && j != result.length - 1) {
            notificationBar.append(`<br><br>`)
          }
        }
      }
    }
    catch (err) {
      console.log(err)
    }

  }
  notificationBar.append(`<br><br><br>`)
}

function mysqlFetchingNotification(targetTable, i) {
  return new Promise((resolve, reject) => {
    let query = `${notification[targetTable].query}`
    con.query(query, function (err, result, field) {
      console.log(`notification fetching table: ${targetTable}`)
      if (err) {
        reject(err);
      }
      else
        resolve([result, field, i]);
    })
  })
}

function mysqlUpdatingNotification(queryText) {
  return new Promise((resolve, reject) => {
    con.query(queryText, function (err) {
      if (err) {
        reject(err);
      }
      else
        resolve();
    })
  })
}

function deliveryProductRead(product, brand, model) {
  let spliter = ','
  let productArray = product.split(spliter)
  let brandArray = brand.split(spliter)
  let modelArray = model.split(spliter)

  var notiString = ''
  for (i = 0; i < productArray.length; i++) {
    notiString += `${productArray[i]}/${brandArray[i]}/${modelArray[i]}<br>`
  }

  return notiString
}

// call html file to id 'mainContent'
function callHtmlFile(filename, mode = 0, pageHeader = '') {
  console.log(filename)
  fs.readFile(filename.toString(), function (err, data) {
    document.getElementById('mainContent').innerHTML = data.toString();
    if (mode == 1)
      loadFunctionalElements()
    else if (mode == 2)
      loadExInfoPage(pageHeader)
    else if (mode == 3) {
      document.getElementById('pageHeader').innerHTML = pageHeader
      loadFunctionalElements()
    }
  })
};

async function callfilledForm(pageHeader, id) {
  let tableName = headerInfo[pageHeader].table
  var filename = ''
  if (headerInfo[pageHeader].viewPage === undefined)
    filename = headerInfo[pageHeader].form
  else
    filename = headerInfo[pageHeader].viewPage
  try {
    let promise = await mysqlFetchingRow(tableName, id)
    let result = Object.values(promise[0][0])
    let field = Object.values(promise[1])
    console.log([result[2], result[1]])

    fs.readFile(filename.toString(), function (err, data) {
      document.getElementById('mainContent').innerHTML = data.toString();
      field.forEach((item, index) => {
        if (tableField[tableName][item.name].radio !== undefined) {
          document.forms['form'][tableField[tableName][item.name].id + result[index]].checked = true;
        }
        else if (['customerName', 'partnerName'].includes(tableField[tableName][item.name])) {
          var subject = 'partner'
          if (tableField[tableName][item.name] == 'customerName')
            subject = 'customer'
          if (document.forms['form'][subject + 'Type1'].checked) {
            let fullName = result[index].split(' ')
            document.getElementById(subject + 'Name').value = fullName[0]
            document.getElementById(subject + 'LastName').value = fullName[1]
          }
          else {
            document.getElementById('companyName').value = result[index]
          }
        }
        else {
          document.getElementById(tableField[tableName][item.name]).value = result[index]
        }
      })
    })
  }
  catch (err) {
    console.log(err)
  }
}

// import thing
function loadExInfoPage(pageHeader) {
  if (pageHeader == 'รายการอะไหล่')
    document.getElementById('pageHeader').innerHTML = 'รับสินค้า อะไหล่'
  else
    document.getElementById('pageHeader').innerHTML = 'รับสินค้า อุปกรณ์'
  document.getElementById('addButton').addEventListener('click', function () {
    callHtmlFile(headerInfo[`${document.getElementById('pageHeader').innerHTML}`].form, 3, `${document.getElementById('pageHeader').innerHTML}`)
  });
  makeCompleteTable(`${document.getElementById('pageHeader').innerHTML}`)
}

// Part form //
// modal function for modalID
function showModal(modalID) {
  console.log('Loading Modal..')
  document.getElementById(modalID).style.display = 'block'
}

function loadFunctionalElements() {
  if (document.getElementById('customerSearchButton')) {
    console.log('try load up modal')
    document.getElementById('customerSearchButton').addEventListener('click', function (event) {
      event.preventDefault()
      showModal('searchModal')
    })
  }

  // date time picker
  var idList = ['appointmentDate', 'purchaseDate', 'jobReceiveDate']
  idList.forEach(value => {
    if (document.getElementById(value)) {
      loadDatePickerToID(value, true)
    }
  })

  // date only picker
  idList = ['importDocDate', 'refImportDocDate', 'recieveDate', 'warrantyDate']
  idList.forEach(value => {
    if (document.getElementById(value)) {
      loadDatePickerToID(value)
    }
  })

  for (i = 1; i < 4; i++) {
    let staffID = document.getElementById(`staffID${i}`)
    if (staffID) {
      staffID.addEventListener('change', async (event) => {
        try {
          let result = await mysqlFetchingRow('staff', staffID.value)
          console.log(result[0][0].staff_name)
          console.log(event.target.id)
          $(`#staffName${event.target.id.match(/\d/g)}`).val(`${result[0][0].staff_name}`)
        }
        catch (err) {
          console.log(err)
        }
      })
    }
  }

  if (document.getElementById('input_zipcode')) {
    $.Thailand({
      database: './node_modules/jthailand/jquery.Thailand.js/database/db.json',

      $district: $('#input_district'),
      $amphoe: $('#input_amphoe'),
      $province: $('#input_province'),
      $zipcode: $('#input_zipcode'),

      onDataFill: function (data) {
        console.log(data);
        /*
        ผลลัพธ์ที่ได้
        {
            district: '',
            district_code: '',
            amphoe: '',
            amphoe_code: '',
            province: '',
            province_code: '',
            zipcode: ''
        }
        */
      }
    });
  }

  var form = 'customer'; // need to refactor!
  if (document.getElementById(form + 'Type1') && document.getElementById(form + 'Type2')) {
    document.getElementById(form + 'Type1').addEventListener('click', function () {
      if (document.getElementById(form + 'Type1').checked) {
        document.getElementById('companyName').readOnly = true;
        document.getElementById('TaxIDNumber').readOnly = true;
        document.getElementById(form + 'Name').readOnly = false;
        document.getElementById(form + 'LastName').readOnly = false;
        document.getElementById('IDCardNumber').readOnly = false;
      }
    })
    document.getElementById(form + 'Type2').addEventListener('click', function () {
      if (document.getElementById(form + 'Type2').checked) {
        document.getElementById('companyName').readOnly = false;
        document.getElementById('TaxIDNumber').readOnly = false;
        document.getElementById(form + 'Name').readOnly = true;
        document.getElementById(form + 'LastName').readOnly = true;
        document.getElementById('IDCardNumber').readOnly = true;
      }
    })
    document.getElementById('companyName').readOnly = true;
    document.getElementById('TaxIDNumber').readOnly = true;
    document.getElementById(form + 'Name').readOnly = true;
    document.getElementById(form + 'LastName').readOnly = true;
    document.getElementById('IDCardNumber').readOnly = true;
  }

  if (document.getElementById('productNoEquip') && document.getElementById('productWithEquip')) {
    document.getElementById('productNoEquip').addEventListener('click', function () {
      if (document.getElementById('productNoEquip').checked) {
        document.getElementById('equipment').style.display = 'none';
      }
    })
    document.getElementById('productWithEquip').addEventListener('click', function () {
      if (document.getElementById('productWithEquip').checked) {
        document.getElementById('equipment').style.display = 'block';
      }
    })
  }

  if (document.getElementById('productNoAcc') && document.getElementById('productWithAcc')) {
    document.getElementById('productNoAcc').addEventListener('click', function () {
      if (document.getElementById('productNoAcc').checked) {
        document.getElementById('acc').style.display = 'none';
      }
    })
    document.getElementById('productWithAcc').addEventListener('click', function () {
      if (document.getElementById('productWithAcc').checked) {
        document.getElementById('acc').style.display = 'block';
      }
    })
  }

  if (document.getElementById('productNoDeliver')) {
    document.getElementById('productNoDeliver').addEventListener('click', function () {
      if (document.getElementById('productNoDeliver').checked) {
        document.getElementById('delivery').style.display = 'none';
      }
    })
    document.getElementById('productPickUp').addEventListener('click', function () {
      if (document.getElementById('productPickUp').checked) {
        document.getElementById('delivery').style.display = 'block';
        document.getElementById('appointmentDateDelivery').readOnly = true;
        document.getElementById('staffID3').readOnly = true;
      }
    })
    document.getElementById('productBothDeliver').addEventListener('click', function () {
      if (document.getElementById('productBothDeliver').checked) {
        document.getElementById('delivery').style.display = 'block';
        document.getElementById('appointmentDateDelivery').readOnly = false;
        document.getElementById('staffID3').readOnly = false;
      }
    })
  }

  if (document.getElementById('installTypeSet')) {
    document.getElementById('installTypeSet').addEventListener('change', function () {
      if (document.getElementById('installTypeSet').checked) {
        document.getElementById('refJob').style.display = 'none';
      }
    })
  }
  if (document.getElementById('installTypeFix')) {
    document.getElementById('installTypeFix').addEventListener('change', function () {
      if (document.getElementById('installTypeFix').checked) {
        document.getElementById('refJob').style.display = 'block';
      }
    })
  }
  if (document.getElementById('installTypeClean')) {
    document.getElementById('installTypeClean').addEventListener('change', function () {
      if (document.getElementById('installTypeClean').checked) {
        document.getElementById('refJob').style.display = 'block';
      }
    })
  }
  if (document.getElementById('installTypeAddOn')) {
    document.getElementById('installTypeAddOn').addEventListener('change', function () {
      if (document.getElementById('installTypeAddOn').checked) {
        document.getElementById('refJob').style.display = 'block';
      }
    })
  }
}

function loadDatePickerToID(id, includeTimePicker = false) {
  $.datetimepicker.setLocale('th');
  document.getElementById(id).type = 'text'
  $(function () {

    var thaiYear = function (ct) {
      var leap = 3;
      var dayWeek = ["พฤ.", "ศ.", "ส.", "อา.", "จ.", "อ.", "พ."];
      if (ct) {
        var yearL = new Date(ct).getFullYear() - 543;
        leap = (((yearL % 4 == 0) && (yearL % 100 != 0)) || (yearL % 400 == 0)) ? 2 : 3;
        if (leap == 2) {
          dayWeek = ["ศ.", "ส.", "อา.", "จ.", "อ.", "พ.", "พฤ."];
        }
      }
      this.setOptions({
        i18n: { th: { dayOfWeek: dayWeek } }, dayOfWeekStart: leap,
      })
    };

    if (includeTimePicker) {
      $(`#${id}`).datetimepicker({
        format: 'd/m/Y H:i',  // กำหนดรูปแบบวันที่ ที่ใช้ เป็น 00-00-0000            
        lang: 'th',  // แสดงภาษาไทย
        onChangeMonth: thaiYear,
        onShow: thaiYear,
        yearOffset: 543,  // ใช้ปี พ.ศ. บวก 543 เพิ่มเข้าไปในปี ค.ศ
        closeOnDateSelect: true,
      });
    }
    else {
      $(`#${id}`).datetimepicker({
        timepicker: false,
        format: 'd/m/Y',  // กำหนดรูปแบบวันที่ ที่ใช้ เป็น 00-00-0000            
        lang: 'th',  // แสดงภาษาไทย
        onChangeMonth: thaiYear,
        onShow: thaiYear,
        yearOffset: 543,  // ใช้ปี พ.ศ. บวก 543 เพิ่มเข้าไปในปี ค.ศ
        closeOnDateSelect: true,
      });
    }
  });

}

// Others //

function mysqlFetchingRow(table, id) {
  return new Promise((resolve, reject) => {
    con.query(`SELECT * FROM ${table} WHERE ${tableField[table].pk} = ${id}`, function (err, result, field) {
      if (err) {
        reject(err);
      }
      else
        resolve([result, field]);
    })
  })
}

function contains(target, pattern) {
  var value = 0;
  pattern.forEach(function (word) {
    value = value + target.includes(word);
  });
  return (value === 1)
}

function findWithAttr(array, attr, value) {
  for (var i = 0; i < array.length; i += 1) {
    if (array[i][attr] === value) {
      return i;
    }
  }
  return -1;
}

function includeInAttr(array, attr, value) {
  for (var i = 0; i < array.length; i += 1) {
    if (array[i][attr] === value) {
      return true;
    }
  }
  return false;
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
function makeCompleteTable(pageHeader) {
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

      // add row handler
      for (var i = 1; i < infoTable.table[0].rows.length; i++) {
        let id = infoTable.table[0].rows[i].getElementsByTagName('td')[0].innerText
        infoTable.table[0].rows[i].addEventListener('click', function () {
          callfilledForm(pageHeader, id)
        })
      }

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

      // fill up options in dropdown
      let colNameDropdown = document.getElementById('searchDropdown');
      for (var i = 0; i < infoTable.field.length; i++) {
        var opt = document.createElement('option');
        opt.appendChild(document.createTextNode(`${thaiTranslate[0][infoTable.field[i].name]}`));
        opt.value = `${infoTable.field[i].name}`;
        colNameDropdown.appendChild(opt);
      }

      // event in search button
      colNameDropdown.addEventListener('change', function () {
        var keyword = document.getElementById('searchField').value
        console.log(keyword)
        if (keyword.length != 0) {
          infoTable.clearTable(1)
          infoTable.loadTable(0, true)
          infoTable.search(colNameDropdown.value, keyword)
        }
        else {
          infoTable.clearTable(1)
          infoTable.loadTable()
        }
      })
      document.getElementById('searchSubmit').addEventListener('click', function (event) {
        event.preventDefault()
        var keyword = document.getElementById('searchField').value
        console.log(keyword)
        if (keyword.length != 0) {
          infoTable.clearTable(1)
          infoTable.loadTable(0, true)
          infoTable.search(colNameDropdown.value, keyword)
        }
      })
    }

  });
}

//fetched data from mysql
function mysqlFetching(pageHeader, callback) {
  var query = ''
  if (contains(headerInfo[pageHeader].table, ['info', 'service_partners'])) {
    query = `${headerInfo[pageHeader].query}`
  }
  else {
    let colNameArray = colName[headerInfo[pageHeader].table]
    var colNameString = ''
    for (var i = 0; i < colNameArray.length; i++) {
      colNameString += colNameArray[i]
      if (i != colNameArray.length - 1)
        colNameString += ','
    }
    query = `SELECT ${colNameString} FROM ${headerInfo[pageHeader].table}`
    console.log(query)
  }
  con.query(query, function (err, result, field) {
    console.log(`infoPage fetching table: ${headerInfo[pageHeader].table}`)
    if (err) {
      callback(err, null, null);
    }
    else
      callback(null, result, field);
  })
}

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

  loadTable(page = 1, loadAll = false) {
    let start = (page - 1) * this.pageSize
    let end = start + this.pageSize
    if (loadAll) {
      start = 0
      end = this.result.length
    }
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
              if (row[propName] instanceof Date) {
                var d = row[propName]
                var dformat = d.format("dd/mm/yyyy") + d.format(" HH:MM")
                tagTD += `<td>${dformat}</td>`
              }
              else
                tagTD += `<td>${row[propName]}</td>`
            }
          }
        }
        this.table.append(`<tr>${tagTD}</tr>`);
      }
    }
  }

  search(spacifiColName, keyword) {
    var table, tr, td, i, txtValue;
    table = this.table[0]
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
      if (spacifiColName == 'any') {
        var j = 0
        while (j < tr[i].getElementsByTagName("td").length) {
          td = tr[i].getElementsByTagName("td")[j];
          if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.indexOf(keyword) > -1) {
              tr[i].style.display = "";
              break
            } else {
              tr[i].style.display = "none";
            }
          }
          j++
        }
      }
      else {
        let colNameIndex = findWithAttr(this.field, 'name', spacifiColName)
        td = tr[i].getElementsByTagName("td")[colNameIndex];
        if (td) {
          txtValue = td.textContent || td.innerText;
          if (txtValue.indexOf(keyword) > -1) {
            tr[i].style.display = "";
          } else {
            tr[i].style.display = "none";
          }
        }

      }
    }
    var alter = 1
    for (i = 0; i < tr.length; i++) {
      if (tr[i].style.display != 'none') {
        if (alter == 0) {
          tr[i].style.backgroundColor = '#FFFFFF';
          alter += 1
        }
        else {
          tr[i].style.backgroundColor = '#EEEEEE';
          alter -= 1
        }
      }
    }
  }
}

/*
 * Date Format 1.2.3
 * (c) 2007-2009 Steven Levithan <stevenlevithan.com>
 * MIT license
 *
 * Includes enhancements by Scott Trenda <scott.trenda.net>
 * and Kris Kowal <cixar.com/~kris.kowal/>
 *
 * Accepts a date, a mask, or a date and a mask.
 * Returns a formatted version of the given date.
 * The date defaults to the current date/time.
 * The mask defaults to dateFormat.masks.default.
 */

var dateFormat = function () {
  var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
    timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
    timezoneClip = /[^-+\dA-Z]/g,
    pad = function (val, len) {
      val = String(val);
      len = len || 2;
      while (val.length < len) val = "0" + val;
      return val;
    };

  // Regexes and supporting functions are cached through closure
  return function (date, mask, utc) {
    var dF = dateFormat;

    // You can't provide utc if you skip other args (use the "UTC:" mask prefix)
    if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
      mask = date;
      date = undefined;
    }

    // Passing date through Date applies Date.parse, if necessary
    date = date ? new Date(date) : new Date;
    if (isNaN(date)) throw SyntaxError("invalid date");

    mask = String(dF.masks[mask] || mask || dF.masks["default"]);

    // Allow setting the utc argument via the mask
    if (mask.slice(0, 4) == "UTC:") {
      mask = mask.slice(4);
      utc = true;
    }

    var _ = utc ? "getUTC" : "get",
      d = date[_ + "Date"](),
      D = date[_ + "Day"](),
      m = date[_ + "Month"](),
      y = date[_ + "FullYear"](),
      H = date[_ + "Hours"](),
      M = date[_ + "Minutes"](),
      s = date[_ + "Seconds"](),
      L = date[_ + "Milliseconds"](),
      o = utc ? 0 : date.getTimezoneOffset(),
      flags = {
        d: d,
        dd: pad(d),
        ddd: dF.i18n.dayNames[D],
        dddd: dF.i18n.dayNames[D + 7],
        m: m + 1,
        mm: pad(m + 1),
        mmm: dF.i18n.monthNames[m],
        mmmm: dF.i18n.monthNames[m + 12],
        yy: String(y).slice(2),
        yyyy: y + 543,
        h: H % 12 || 12,
        hh: pad(H % 12 || 12),
        H: H,
        HH: pad(H),
        M: M,
        MM: pad(M),
        s: s,
        ss: pad(s),
        l: pad(L, 3),
        L: pad(L > 99 ? Math.round(L / 10) : L),
        t: H < 12 ? "a" : "p",
        tt: H < 12 ? "am" : "pm",
        T: H < 12 ? "A" : "P",
        TT: H < 12 ? "AM" : "PM",
        Z: utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
        o: (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
        S: ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
      };

    return mask.replace(token, function ($0) {
      return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
    });
  };
}();

// Some common format strings
dateFormat.masks = {
  "default": "ddd mmm dd yyyy HH:MM:ss",
  shortDate: "m/d/yy",
  mediumDate: "mmm d, yyyy",
  longDate: "mmmm d, yyyy",
  fullDate: "dddd, mmmm d, yyyy",
  shortTime: "h:MM TT",
  mediumTime: "h:MM:ss TT",
  longTime: "h:MM:ss TT Z",
  isoDate: "yyyy-mm-dd",
  isoTime: "HH:MM:ss",
  isoDateTime: "yyyy-mm-dd'T'HH:MM:ss",
  isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};

// Internationalization strings
dateFormat.i18n = {
  dayNames: [
    "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
  ],
  monthNames: [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
  ]
};

// For convenience...
Date.prototype.format = function (mask, utc) {
  return dateFormat(this, mask, utc);
};