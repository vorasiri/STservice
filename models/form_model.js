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

    async saveDetail() {
        let details = this._details
        console.log(details)
        await details.save()
        await details.person.save()
        await details.person.general_person.save()
        this.emit('detailSaved')
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