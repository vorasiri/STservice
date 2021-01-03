const EventEmitter = require('../event_emitter.js')

module.exports = class FormModel extends EventEmitter {
    constructor(models) {
        super()
        this._models = models
        this._details
    }

    async getDataById(tableName, pk) {
        let table = {
            'Returning': () => { },
            'Delivery': () => { },
            'Satellite_Installation': () => { },
            'AC_Installation': () => { },
            'Water_Heater_Installation': () => { },
            'Brand': () => { },
            'Customer': () => { },
            'Staff': () => this._models.personOrm.staff.findByPk(pk, {
                include: [{
                    model: this._models.personOrm.branch
                }, {
                    model: this._models.personOrm.person,
                    include: [{
                        model: this._models.personOrm.generalPerson
                    }]
                }],
            }),
            'Service_Partner': () => { },
            'Supplier': () => { },
            'Spare_Part': () => { },
            'Equipment': () => { },
        }
        this._details = await table[tableName]()
        this.emit('formLoaded', tableName)
    }

    saveDetail(tableName) {
        let details = this._details
        let table = {
            'Returning': () => { },
            'Delivery': () => { },
            'Satellite_Installation': () => { },
            'AC_Installation': () => { },
            'Water_Heater_Installation': () => { },
            'Brand': () => { },
            'Customer': () => { },
            'Staff': () => { 
                details.save()
                details.person.save()
                details.person.general_person.save()
            },
            'Service_Partner': () => { },
            'Supplier': () => { },
            'Spare_Part': () => { },
            'Equipment': () => { },
        }
        table[tableName]()
        this.emit('detailSaved')
    }

    create(tableName) {
        let details = this._details
        let table = {
            'Returning': () => { },
            'Delivery': () => { },
            'Satellite_Installation': () => { },
            'AC_Installation': () => { },
            'Water_Heater_Installation': () => { },
            'Brand': () => { },
            'Customer': () => { },
            'Staff': () => { 
                let obj = {}
                this._models.personOrm.staff.create( obj )        
            },
            'Service_Partner': () => { },
            'Supplier': () => { },
            'Spare_Part': () => { },
            'Equipment': () => { },
        }
        table[tableName]()
        this.emit('detailSaved')
    }

    staffType() {
        
        return
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