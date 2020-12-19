const EventEmitter = require('../event_emitter.js')

module.exports = class TableModel extends EventEmitter {
    constructor(models) {
        super()
        this._models = models
        this._tableName
        this._tableJson
        this._pageSize = 30
        this._totalPage
        this._combindTable = {
            'Repairing': () => this._models.serviceOrm.repairing.findAll(),
            'Returning': () => this._models.serviceOrm.returning.findAll(),
            'Delivery': () => this._models.serviceOrm.delivery.findAll(),
            'Satellite_Installation': () => this._models.serviceOrm.installation.findAll(),
            'AC_Installation': () => this._models.serviceOrm.installation.findAll(),
            'Water_Heater_Installation': () => this._models.serviceOrm.installation.findAll(),
            'Brand': () => this._models.itemOrm.brand.findAll(),
            'Customer': () => this._models.personOrm.customer.findAll(),
            'Staff': () => this._models.personOrm.staff.findAll({
                include: [{
                    model: this._models.personOrm.branch
                }, {
                    model: this._models.personOrm.person,
                    include: [{
                        model: this._models.personOrm.generalPerson
                    }]
                }],
            }),
            'Service_Partner': () => this._models.personOrm.servicePartner.findAll(),
            'Supplier': () => this._models.personOrm.supplier.findAll(),
            'Spare_Part': () => this._models.itemOrm.sparePart.findAll(),
            'Equipment': () => this._models.itemOrm.equipment.findAll(),
        }
    }

    async loadTable(tableName) {
        console.log(tableName)
        this._tableName = tableName
        this._tableJson = await this._combindTable[this._tableName]()
        this._tableJson = await this.simplify()
        this._totalPage = Math.ceil(this._tableJson.length / this._pageSize)
        console.log(this._tableJson)
        this.emit('tableUpdated')
    }

    simplify() {
        let process = {
            'Repairing': () => { },
            'Returning': () => { },
            'Delivery': () => { },
            'Satellite_Installation': () => { },
            'AC_Installation': () => { },
            'Water_Heater_Installation': () => { },
            'Brand': () => { },
            'Customer': () => { },
            'Staff': () => {
                var simplifiedJson = []
                this._tableJson.forEach((element, index) => {
                    console.log(element, index)
                    simplifiedJson[index] = {
                        id: element.id,
                        branch: element.branch._name,
                        position: (() => {
                            if (element.adminId === 1)
                                return 'admin'
                            else if (element.salepersonId === 1)
                                return 'sale person'
                            else if (element.technicianId === 1)
                                return 'technician'
                            else if (element.driverId === 1)
                                return 'driver'
                        })(),
                        name: element.person.general_person._title + ' ' + element.person._name,
                        tel: element.person._tel,
                    }
                });
                return simplifiedJson
            },
            'Service_Partner': () => { },
            'Supplier': () => { },
            'Spare_Part': () => { },
            'Equipment': () => { },
        }
        return process[this._tableName]()
    }

}