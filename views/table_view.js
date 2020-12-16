const EventEmitter = require('../event_emitter.js')
window.$ = window.jQuery = require('jquery')
const thaiTranslate = require('../src/json_information/thai_translate.json')
const fs = require('fs');
const fsPromises = fs.promises;

module.exports = class TableView extends EventEmitter {
  constructor(model, elements) {
    super()
    this._model = model
    this._elements = elements
    this._elements.menuBar = $('#menuBar')
    this._elements.mainContent = $('#mainContent')
    this._elements.infoTable = () => $('#infoTable')
    this._elements.pagination = () => $('#pagination')
    this._elements.header = () => $('#pageHeader')
    this._elements.addButton = () => $('addButton')
    this._elements.importButton = () => document.getElementById('importButton')
    this._elements.searchSubmitButton = () => $('searchSubmit')
    this._elements.searchField = () => $('searchField')

    this.loadMenu()
    this.loadUser()
    this._model.on('tableUpdated', () => this.buildTable())
  }

  async buildInfoPage() {
    //elements
    this._elements.mainContent[0].innerHTML = await fsPromises.readFile('./views/info_page.html', 'utf8')
    //header
    this._elements.header()[0].innerHTML = thaiTranslate.header[this._model._tableName]
    //search
    //add
    //import
    if(['Spare_Part', 'Equipment'].includes(this._model._tableName)){
      this._elements.importButton().style.visibility = 'visible'
      this._elements.importButton().addEventListener('click', () => {
        this.emit('importButtonClicked')
      })
    }
    //pagination

  }

  buildTable() {
    //table
    //row handler
  }

  paginationButton() {
    var currentPage = 1
    let pagination = this._elements.pagination[0]
    pagination.appendChild(aTag('&laquo;')).addEventListener('click', function () {
      if (currentPage != 1)
        currentPage--;
    })
    console.log(this._elements.infoTable)
    for (var i = 1; i <= this._elements.infoTable.totalPage; i++) {
      pagination.appendChild(aTag(`${i}`)).addEventListener('click', function () {
        currentPage = parseInt(this.innerHTML);
      })
    }
    pagination.appendChild(aTag('&raquo;')).addEventListener('click', function () {
      if (currentPage != this._elements.infoTable.totalPage)
        currentPage++;
    })
    pagination.addEventListener('click', function () {
      this._elements.infoTable.clearTable(1)
      this._elements.infoTable.loadTable(currentPage)
      highlightPageNumber(pagination, currentPage)
    })
    highlightPageNumber(pagination, currentPage)
  }

  highlightPageNumber(pagination, currentPage) {
    for (let i = 0; i < pagination.children.length; i++) {
      if (pagination.children[i].text == pageNumber) {
        pagination.children[i].classList.add("active")
      }
      else
        pagination.children[i].classList.remove("active")
    }
  }

  clearTable(startRow = 0) {
    while (this._elements.infoTable[0].rows.length > startRow) {
      this._elements.infoTable[0].deleteRow(startRow);
    }
  }

  loadField() {
    var tagTH = ''
    for (var value of this.field) {
      if (value !== undefined) {
        tagTH += `<th>${thaiTranslate[0][value.name]}</th>`
      }
    }
    this._elements.infoTable.append(`<tr>${tagTH}</tr>`);
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
        this._elements.infoTable.append(`<tr>${tagTD}</tr>`);
      }
    }
  }

  search(spacifiColName, keyword) {
    var table, tr, td, i, txtValue;
    table = this._elements.infoTable[0]
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

  loadMenu() {
    ['Repairing', 'Returning', 'Delivery'].forEach(
      menu => {
        this._elements.menuBar.append(`<a id="${menu}" class="navbutton">${thaiTranslate['menu'][menu]}</a>`)
        $(`#${menu}`).on('click',
          e => { this.emit('menuClicked', e.target.id) })
      }
    )
    this._elements.menuBar.append(`
            <button class="dropdown-btn">${thaiTranslate['menu']['Installation']}
            <i class="fa fa-caret-down"></i> </button>
        `);

    (() => {
      let dropdownContainer = $('<div/>', { class: 'dropdown-container' });
      this._elements.menuBar.append(dropdownContainer);
      ['Satellite_Installation', 'AC_Installation', 'Water_Heater_Installation'].forEach(
        menu => {
          dropdownContainer.append(`<a id="${menu}" class="navbutton">
                    <i class="fa fa-caret-right"></i>
                    ${thaiTranslate['menu'][menu]}</a>
                    `);
          $(`#${menu}`).on('click',
            e => { this.emit('menuClicked', e.target.id) })
        }
      )
    })()

    this._elements.menuBar.append(`
                <button class="dropdown-btn">${thaiTranslate['menu']['Manage_Detail']}
                <i class="fa fa-caret-down"></i> </button>
        `);

    (() => {
      let dropdownContainer = $('<div/>', { class: 'dropdown-container' });
      this._elements.menuBar.append(dropdownContainer);
      ['Brand', 'Customer', 'Staff', 'Service_Partner', 'Supplier'].forEach(
        menu => {
          dropdownContainer.append(`<a id="${menu}" class="navbutton">
                    <i class="fa fa-caret-right"></i>
                    ${thaiTranslate['menu'][menu]}</a>
                    `);
          $(`#${menu}`).on('click',
            e => { this.emit('menuClicked', e.target.id) })
        }
      )
    })()

    this._elements.menuBar.append(`
            <button class="dropdown-btn">${thaiTranslate['menu']['Manage_Product']}
            <i class="fa fa-caret-down"></i> </button>
        `);

    (() => {
      let dropdownContainer = $('<div/>', { class: 'dropdown-container' });
      this._elements.menuBar.append(dropdownContainer);
      ['Spare_Part', 'Equipment'].forEach(
        menu => {
          dropdownContainer.append(`<a id="${menu}" class="navbutton">
                    <i class="fa fa-caret-right"></i>
                    ${thaiTranslate['menu'][menu]}</a>
                    `);
          $(`#${menu}`).on('click',
            e => { this.emit('menuClicked', e.target.id) })
        }
      )
      this._elements.menuBar.append(dropdownContainer)
    })()

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

  }

  async loadUser() {
    let user = await JSON.parse(window.sessionStorage.getItem('user'))[0]
    console.log(user)
    $('#staffName')[0].innerText = `${user.staff.person.general_person._title} ${user.staff.person._name}`
    $('#staffPosition')[0].innerText = `${user.staff.branch._name}`
  }
}