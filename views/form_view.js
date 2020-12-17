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

    }

    async loadEmptyForm(tableName) {
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
    }

    async loadImportForm(tableName) {
        this._elements.mainContent[0].innerHTML = await fsPromises.readFile('./views/forms/import_form.html', 'utf8')
        if (tableName === 'Spare_Part') {
            this._elements.header()[0].innerHTML = 'รับสินค้า อะไหล่'
        }
        else {
            this._elements.header()[0].innerHTML = 'รับสินค้า อุปกรณ์'
        }
    }
}
