const EventEmitter = require('../event_emitter.js')
window.$ = window.jQuery = require('jquery')
const thaiTranslate = require('../src/json_information/thai_translate.json')

module.exports = class TableView extends EventEmitter {
    constructor(model, elements) {
        super()
        this._model = model
        this._elements = elements
        this._elements.menuBar = $('#menuBar')

        this.loadMenu()
        this.loadUser()
        this._model.on('tableUpdated', () => this.rebuildTable())
    }

    rebuildTable() {

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
        $('#staffName')[0].innerText = `${user._title} ${user._name}`
        $('#staffPosition')[0].innerText = `${user.branch._name}`
    }
}