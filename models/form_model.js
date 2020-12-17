const EventEmitter = require('../event_emitter.js')

module.exports = class FormModel extends EventEmitter {
    constructor(models){
        super()
        this._models = models
    }

    getDataById(id){
        table = {
            'Returning': () => {},
            'Delivery': () => {},
            'Satellite_Installation': () => {},
            'AC_Installation': () => {},
            'Water_Heater_Installation': () => {},
            'Brand': () => {},
            'Customer': () => {},
            'Staff': () => {},
            'Service_Partner': () => {},
            'Supplier': () => {},
            'Spare_Part': () => {},
            'Equipment': () => {},
        }
    }
}
// this._combindTable = {
//     'Returning': () => {},
//     'Delivery': () => {},
//     'Satellite_Installation': () => {},
//     'AC_Installation': () => {},
//     'Water_Heater_Installation': () => {},
//     'Brand': () => {},
//     'Customer': () => {},
//     'Staff': () => {},
//     'Service_Partner': () => {},
//     'Supplier': () => {},
//     'Spare_Part': () => {},
//     'Equipment': () => {},
// }