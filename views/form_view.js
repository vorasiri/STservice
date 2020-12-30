const EventEmitter = require('../event_emitter.js')
const fs = require('fs');
const fsPromises = fs.promises;

module.exports = class FormView extends EventEmitter {
    constructor(model, elements) {
        super()
        this._model = model
        this._elements = elements
        this._elements.mainContent = $('#mainContent')
        this._elements.header = () => $('#pageHeader')
        this._elements.submitButton = () => $('.submit-btn')

        this._model.on('formLoaded', (tableName) => this.mapValue(tableName))
    }

    async buildEmptyForm(tableName) {
        let formFileLocation = {
            'Returning': './views/forms/returning_form.html',
            'Delivery': './views/forms/delivery_form.html',
            'Satellite_Installation': './views/forms/installation_sat_form.html',
            'AC_Installation': './views/forms/installation_ac_form.html',
            'Water_Heater_Installation': './views/forms/installation_wh_form.html',
            'Brand': './views/forms/brand_form.html',
            'Customer': './views/forms/customer_form.html',
            'Staff': './views/forms/staff_form.html',
            'Service_Partner': './views/forms/service_partner_form.html',
            'Supplier': './views/forms/supplier_form.html',
            'Spare_Part': './views/forms/sp_form.html',
            'Equipment': './views/forms/equipment_form.html',
        }

        this._elements.mainContent[0].innerHTML = await fsPromises.readFile(formFileLocation[tableName], 'utf8')
        if (['Spare_Part', 'Equipment'].includes(tableName)) {
            if (tableName === 'Spare_Part') {
                this._elements.header()[0].innerHTML = 'รับสินค้า อะไหล่'
            }
            else {
                this._elements.header()[0].innerHTML = 'รับสินค้า อุปกรณ์'
            }
        }

        this._elements.submitButton().on('click', (event) => {
            event.preventDefault()
            this.getValue(tableName)
            console.log('From submit', tableName)
        })
    }

    async buildImportForm(tableName) {
        this._elements.mainContent[0].innerHTML = await fsPromises.readFile('./views/forms/import_form.html', 'utf8')
        if (tableName === 'Spare_Part') {
            this._elements.header()[0].innerHTML = 'รับสินค้า อะไหล่'
        }
        else {
            this._elements.header()[0].innerHTML = 'รับสินค้า อุปกรณ์'
        }
    }

    mapValue(tableName) {
        let details = this._model._details
        console.log(details)
        let thailandAddress = new ThailandAddress()
        let table = {
            'Returning': () => { },
            'Delivery': () => { },
            'Satellite_Installation': () => { },
            'AC_Installation': () => { },
            'Water_Heater_Installation': () => { },
            'Brand': () => { },
            'Customer': () => { },
            'Staff': () => {
                thailandAddress.init()
                $('#staffID').prop('readonly', false)
                $('#staffID').val(details.id)
                $('#staffID').prop('readonly', true)
                $('#staffBranch').val(details.branchId)
                $('#staffTitle').val(details.person.general_person._title)
                $('#staffName').val(details.person._name)
                $('#staffTel').val(details.person._tel)
                $('#IDCardNumber').val(details.person.general_person._id_card)
                $('#staffAddress').val(thailandAddress.deCombine(details.person._address))
                $('#input_zipcode')[0].dispatchEvent(new Event('change'))
                let elements = [
                    ['#staffAdmin', details.adminId],
                    ['#staffSaleperson', details.salepersonId],
                    ['#staffDriver', details.driverId],
                    ['#staffTechnician', details.technicianId]
                ]
                elements.forEach(element => {
                    if (element[1] === 1) {
                        $(element[0]).prop('checked', true)
                    }
                })
            },
            'Service_Partner': () => { },
            'Supplier': () => { },
            'Spare_Part': () => { },
            'Equipment': () => { },
        }
        table[tableName]()
    }

    getValue(tableName) {
        let details = this._model._details
        let thailandAddress = new ThailandAddress()
        let table = {
            'Returning': () => { },
            'Delivery': () => { },
            'Satellite_Installation': () => { },
            'AC_Installation': () => { },
            'Water_Heater_Installation': () => { },
            'Brand': () => { },
            'Customer': () => { },
            'Staff': () => {
                details.id = $('#staffID').val()
                details.branchId = $('#staffBranch').val()
                details.person.general_person._title = $('#staffTitle').val()
                details.person._name = $('#staffName').val()
                details.person._tel = $('#staffTel').val()
                details.person.general_person._id_card = $('#IDCardNumber').val()
                details.person._address = thailandAddress.combine($('#staffAddress').val())
                let elements = [
                    ['#staffAdmin', details.adminId],
                    ['#staffSaleperson', details.salepersonId],
                    ['#staffDriver', details.driverId],
                    ['#staffTechnician', details.technicianId]
                ]
                elements.forEach(element => {
                    if ($(element[0]).is(':checked')) {
                        element[1] = details.id
                    }
                    else {
                        element[1] = null
                    }
                    console.log(element)
                })
                this.emit('formSubmitted')
            },
            'Service_Partner': () => { },
            'Supplier': () => { },
            'Spare_Part': () => { },
            'Equipment': () => { },
        }
        table[tableName]()
    }


}

// address related
class ThailandAddress {
    thai = require('thai-data')
    idList = ['input_zipcode', 'input_district', 'input_amphoe', 'input_province']
    idListDisplay = ['input_zipcode', 'input_province', 'input_amphoe', 'input_district']
    idListForCombine = ['input_district', 'input_amphoe', 'input_province', 'input_zipcode']

    constructor() { }

    init() {
        var allField
        let zipCode = document.getElementById('input_zipcode')
        zipCode.addEventListener('change', () => {
            allField = this.thai.allField(zipCode.value)
            Object.values(allField).forEach((value, index) => {
                if (Array.isArray(value)) {
                    if (index > 0) {
                        var select = document.getElementById(this.idList[index])
                        var selectedValue = select.options[0].value
                        select.options.length = 0
                        value.forEach((option) => {
                            option = Object.values(option)
                            select.options[select.options.length] = new Option(`${option[option.length - 1]}`, `${option[option.length - 1]}`, false, false);
                        })
                        select.value = selectedValue
                    }
                }
            })
        })
    }

    combine(detail) {
        var combinedAddress = detail
        this.idListForCombine.forEach((DOM, index) => {
            combinedAddress += ' '
            if (index == 0)
                combinedAddress += 'ต.'
            else if (index == 1)
                combinedAddress += 'อ.'
            else if (index == 2)
                combinedAddress += 'จ.'
            combinedAddress += document.getElementById(DOM).value
        })
        return combinedAddress
    }

    deCombine(combinedAddress) {
        var addressList = combinedAddress.split(' ').filter((value) => {
            return value != ''
        })

        var j = 0
        for (let i = addressList.length - 1; i >= addressList.length - 4; i--) {
            var pureName = addressList[i].split('.')[0]
            if (j == 0) {
                document.getElementById(this.idListDisplay[j]).value = pureName
                j++
                continue
            }
            var select = document.getElementById(this.idListDisplay[j])
            if (j > 0)
                pureName = addressList[i].split('.')[1]

            select.options.length = 0
            select.options[select.options.length] = new Option(`${pureName}`, `${pureName}`, false, false);
            j++
        }

        var leftOver = ''
        for (let i = 0; i < addressList.length - 4; i++) {
            leftOver += addressList[i]
            leftOver += ' '
        }
        return leftOver
    }
}
