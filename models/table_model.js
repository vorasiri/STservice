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
            'Repairing': () => this._models.serviceOrm.repairing.findAll({
                include: { all: true, nested: true }
            }),
            'Returning': () => this._models.serviceOrm.returning.findAll({
                include: { all: true, nested: true }
            }),
            'Delivery': () => this._models.serviceOrm.delivery.findAll({
                include: { all: true, nested: true }
            }),
            'Satellite_Installation': () => this._models.serviceOrm.installation.findAll({
                include: { all: true, nested: true }
            }),
            'AC_Installation': () => this._models.serviceOrm.installation.findAll({
                include: { all: true, nested: true }
            }),
            'Water_Heater_Installation': () => this._models.serviceOrm.installation.findAll({
                include: { all: true, nested: true }
            }),
            'Brand': () => this._models.itemOrm.brand.findAll({
                include: { all: true, nested: true }
            }),
            'Customer': () => this._models.personOrm.customer.findAll({
                include: { all: true, nested: true }
            }),
            'Staff': () => this._models.personOrm.staff.findAll({
                include: { all: true, nested: true }
            }),
            'Service_Partner': () => this._models.personOrm.servicePartner.findAll({
                include: { all: true, nested: true }
            }),
            'Supplier': () => this._models.personOrm.supplier.findAll({
                include: { all: true, nested: true }
            }),
            'Spare_Part': () => this._models.itemOrm.sparePart.findAll({
                include: { all: true, nested: true }
            }),
            'Equipment': () => this._models.itemOrm.equipment.findAll({
                include: { all: true, nested: true }
            }),
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
        var simplifiedJson = []
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
                this._tableJson.forEach((element, index) => {
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
            },
            'Service_Partner': () => { },
            'Supplier': () => { },
            'Spare_Part': () => { },
            'Equipment': () => { },
        }
        process[this._tableName]()
        return simplifiedJson
    }

}