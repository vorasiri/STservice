const { DataTypes } = require("sequelize")
const sequelize = require("../config/connection")
const serviceOrm = require("./service_orm.js")
const personOrm = require("./person_orm.js")

class Invoice {
    constructor() {
        this._invoice_number = {
            type: DataTypes.STRING
        }
    }
}

class Item {
    constructor() {
        this._name = {
            type: DataTypes.STRING
        }
        this._model = {
            type: DataTypes.STRING
        }
        this._price = {
            type: DataTypes.INTEGER
        }
        this._quantity = {
            type: DataTypes.INTEGER
        }
    }
}

class Product extends Item {
    constructor() {
        super()
        this._serial_number = {
            type: DataTypes.STRING
        }
    }
}

class SparePart extends Item {
    constructor() {
        super()
        this._cost = {
            type: DataTypes.INTEGER
        }
        this._for_model = {
            type: DataTypes.STRING
        }
    }
}

class Equipment extends Item {
    constructor() {
        super()
        this._serial_number = {
            type: DataTypes.STRING
        }
        this._cost = {
            type: DataTypes.INTEGER
        }
        this._for_model = {
            type: DataTypes.STRING
        }
    }
}

class Brand {
    constructor(){
        this._name = {
            type: DataTypes.STRING
        }
    }
}

let invoice = sequelize.define('invoice', new Invoice())
let product = sequelize.define('product', new Product())
let sparePart = sequelize.define('spare_part', new SparePart())
let equipment = sequelize.define('equipment', new Equipment())
let brand = sequelize.define('brand', new Brand())

personOrm.supplier.hasMany(invoice)
invoice.belongsTo(personOrm.supplier)
product.hasOne(invoice)
invoice.belongsTo(product)
sparePart.hasOne(invoice)
invoice.belongsTo(sparePart)
equipment.hasOne(invoice)
invoice.belongsTo(equipment)
personOrm.customer.hasMany(product)
product.belongsTo(personOrm.customer)

module.exports.invoice = invoice
module.exports.product = product
module.exports.sparePart = sparePart
module.exports.equipment = equipment
module.exports.brand = brand