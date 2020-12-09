const { DataTypes } = require("sequelize")
const sequelize = require("../config/connection")
const personOrm = require("./person_orm.js")
const itemOrm = require("./item_orm.js")

class Service {
    constructor(){
        this._status = {
            type: DataTypes.STRING
        }
        this._date = {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        }
        this._appointment = {
            type: DataTypes.DATE
        }
        this._receive_admin = {
            type: DataTypes.INTEGER,
            references: {
                model: personOrm.admin,
                key: 'id',
            }
        }
        this._return_admin = {
            type: DataTypes.INTEGER,
            references: {
                model: personOrm.admin,
                key: 'id',
            }
        }
    }
}

class Delivery extends Service {
    constructor(){
        super()
        this._location = {
            type: DataTypes.TEXT
        }
        this._equipment = {
            type: DataTypes.INTEGER
        }
        this._fee_amount = {
            type: DataTypes.INTEGER
        }
        this._fee_paid = {
            type: DataTypes.INTEGER
        }
        this._driver = {
            type: DataTypes.INTEGER
        }
    }
}

class Installation extends Service {
    constructor(){
        super()
        this._location = {
            type: DataTypes.TEXT
        }
        this._equipment = {
            type: DataTypes.INTEGER
        }
        this._fee_amount = {
            type: DataTypes.INTEGER
        }
        this._fee_paid = {
            type: DataTypes.INTEGER
        }
        this._technician = {
            type: DataTypes.INTEGER
        }
    }
}

class Repairing extends Service {
    constructor(){
        super()
        this._need_pickup = {
            type: DataTypes.BOOLEAN
        }
        this._pickup_appointment = {
            type: DataTypes.DATE
        }
        this._pickup_driver = {
            type: DataTypes.INTEGER
        }
        this._need_delivery = {
            type: DataTypes.BOOLEAN
        }
        this._delivery_appointment = {
            type: DataTypes.DATE
        }
        this._delivery_driver = {
            type: DataTypes.INTEGER
        }
        this._warranty = {
            type: DataTypes.BOOLEAN
        }
        this._seutrong = {
            type: DataTypes.BOOLEAN
        }
        this._accessory_detail = {
            type: DataTypes.TEXT
        }
        this._flaw = {
            type: DataTypes.STRING
        }
        this._failure = {
            type: DataTypes.STRING
        }
        this._budget = {
            type: DataTypes.INTEGER
        }
        this._location = {
            type: DataTypes.TEXT
        }
        this._spare_part = {
            type: DataTypes.INTEGER
        }
        this._fee_amount = {
            type: DataTypes.INTEGER
        }
        this._fee_paid = {
            type: DataTypes.INTEGER
        }
        this._technician = {
            type: DataTypes.INTEGER
        }
        this._service_partner = {
            type: DataTypes.INTEGER
        }
    }
}

class Returning extends Service {
    constructor(){
        super()
        this._failure = {
            type: DataTypes.STRING
        }
        this._supplier = {
            type: DataTypes.INTEGER
        }
        this._compensate_method = {
            type: DataTypes.INTEGER
        }
        this._compensate_invoice = {
            type: DataTypes.STRING
        }
        this._compensate_date = {
            type: DataTypes.DATE
        }
        this._compemsate_product_sn = {
            type: DataTypes.STRING
        }
        this._compensate_amount = {
            type: DataTypes.INTEGER
        }
    }
}

let delivery = sequelize.define('delivery', new Delivery())
let installation = sequelize.define('installation', new Installation())
let repairing = sequelize.define('repairing', new Repairing())
let returning = sequelize.define('returning', new Returning())



module.exports.delivery = delivery
module.exports.installation = installation
module.exports.repairing = repairing
module.exports.returning = returning