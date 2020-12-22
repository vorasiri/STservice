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
    this._elements.addButton = () => $('#addButton')
    this._elements.importButton = () => document.getElementById('importButton')
    this._elements.searchDropdown = () => $('#searchDropdown')
    this._elements.searchSubmitButton = () => $('#searchSubmit')
    this._elements.searchField = () => $('#searchField')

    this._currentPage = 1
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
    this._elements.searchField().on('change', () => {
      var keyword = this._elements.searchField()[0].value
      if (keyword.length != 0) {
        this.clearTable(1)
        this.loadTable(0, true)
        this.search(this._elements.searchDropdown()[0].value, keyword)
      }
      else {
        this.clearTable(1)
        this.loadTable()
      }
    })
    this._elements.searchSubmitButton().on('click', event => {
      event.preventDefault()
      var keyword = this._elements.searchField()[0].value
      if (keyword.length != 0) {
        this.clearTable(1)
        this.loadTable(0, true)
        this.search(this._elements.searchDropdown()[0].value, keyword)
      }
    })
    //add
    this._elements.addButton().on('click', () => {
      this.emit('addButtonClicked')
    })
    //import
    if (['Spare_Part', 'Equipment'].includes(this._model._tableName)) {
      this._elements.importButton().style.visibility = 'visible'
      this._elements.importButton().addEventListener('click', () => {
        this.emit('importButtonClicked')
      })
    }
  }

  buildTable() {
    //pagination
    this.paginationButton()
    //table
    this.clearTable()
    this.loadField()
    this.loadTable()
  }

  paginationButton() {
    let pagination = this._elements.pagination()
    pagination.append($('<a />', { html: '&laquo;' }).on('click', (e) => {
      if (this._currentPage != 1) {
        this._currentPage = this._currentPage - 1
      }
    }))
    for (var i = 1; i <= this._model._totalPage; i++) {
      pagination.append($('<a />', { text: `${i}` }).on('click', (e) => {
        this._currentPage = parseInt(e.target.text);
      }))
    }
    pagination.append($('<a />', { html: '&raquo;' }).on('click', (e) => {
      if (this._currentPage != this._model._totalPage) {
        this._currentPage = this._currentPage + 1
      }
    }))
    pagination.on('click', (e) => {
      console.log(this._currentPage)
      this.clearTable(1)
      this.loadTable(this._currentPage)
      this.highlightPageNumber(pagination, this._currentPage)
    })
    this.highlightPageNumber(pagination, this._currentPage)
  }

  highlightPageNumber(pagination, pageNumber) {
    pagination = pagination[0]
    for (let i = 0; i < pagination.children.length; i++) {
      if (pagination.children[i].text == pageNumber) {
        pagination.children[i].classList.add("active")
      }
      else
        pagination.children[i].classList.remove("active")
    }
  }

  clearTable(startRow = 0) {
    while (this._elements.infoTable()[0].rows.length > startRow) {
      this._elements.infoTable()[0].deleteRow(startRow);
    }
  }

  loadField() {
    var tagTH = ''
    Object.keys(this._model._tableJson[0]).forEach(value => {
      tagTH += `<th>${thaiTranslate.field[value]}</th>`
      this._elements.searchDropdown().append(
        $('<option />', {
          text: thaiTranslate.field[value],
          value: value
        }))
    })
    this._elements.infoTable().append(`<tr>${tagTH}</tr>`);
  }

  loadTable(page = 1, loadAll = false) {
    let start = (page - 1) * this._model._pageSize
    let end = start + this._model._pageSize
    if (loadAll) {
      start = 0
      end = this._model._tableJson.length
    }
    for (var i = start; i < end; i++) {
      let row = this._model._tableJson[i]
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
        this._elements.infoTable().append($(`<tr>${tagTD}</tr>`).on('click', (e) => {
          this.emit('rowClicked', e)
        }));
      }
    }
  }

  search(spacifiColName, keyword) {
    console.log(spacifiColName, keyword)
    var table, tr, td, i, txtValue;
    table = this._elements.infoTable()[0]
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
        var colNameIndex
        Object.keys(this._model._tableJson[0]).forEach((value, index) => {
          if (value === spacifiColName) {
            colNameIndex = index
          }
        })
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