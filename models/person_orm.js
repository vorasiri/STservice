const { DataTypes } = require("sequelize");
const sequelize = require('../config/connection.js');

class Person {
    constructor() {
        this._name = {
            type: DataTypes.STRING
        }
        this._address = {
            type: DataTypes.TEXT
        }
        this._tel = {
            type: DataTypes.STRING
        }
    }
}

class JuristicPerson {
    constructor() {
        this._juristic_type = {
            type: DataTypes.STRING(4)
        }
        this._tax_id = {
            type: DataTypes.STRING()
        }
    }
}

class GeneralPerson {
    constructor() {
        this._title = {
            type: DataTypes.STRING(10)
        }
        this._id_card = {
            type: DataTypes.STRING(13)
        }
    }
}

class Branch {
    constructor() {
        this._name = {
            type: DataTypes.STRING(30)
        }
    }
}

class Staff {
    constructor() {

    }
}

class Admin {
    constructor() {
        this._username = {
            type: DataTypes.STRING()
        }
        this._password = {
            type: DataTypes.STRING(1024)
        }
    }
}

class Saleperson {
    constructor() {
        this._total_sales = {
            type: DataTypes.INTEGER
        }
    }
}

class Technician {
    constructor() {
        this._wage = {
            type: DataTypes.INTEGER
        }
    }
}

class Driver {
    constructor() {
    }
}

class Customer {
    constructor() {
    }
}

class Supplier {
    constructor() {
        this._brand = {
            type: DataTypes.STRING(20)
        }
    }
}

class ServicePartner {
    constructor() {
        this._brand = {
            type: DataTypes.STRING(20)
        }
    }
}

let person = sequelize.define('person', new Person());
let juristicPerson = sequelize.define('juristic_person', new JuristicPerson());
let generalPerson = sequelize.define('general_person', new GeneralPerson());
let branch = sequelize.define('branch', new Branch());
let staff = sequelize.define('staff', new Staff());
let admin = sequelize.define('admin', new Admin());
let saleperson = sequelize.define('saleperson', new Saleperson());
let technician = sequelize.define('technician', new Technician());
let driver = sequelize.define('driver', new Driver());
let customer = sequelize.define('customer', new Customer());
let supplier = sequelize.define('supplier', new Supplier());
let servicePartner = sequelize.define('service_partner', new ServicePartner());

juristicPerson.hasOne(person)
person.belongsTo(juristicPerson)
generalPerson.hasOne(person)
person.belongsTo(generalPerson)
staff.hasOne(person)
person.belongsTo(staff)
branch.hasMany(staff)
staff.belongsTo(branch)
admin.hasOne(staff)
staff.belongsTo(admin)
saleperson.hasOne(staff)
staff.belongsTo(saleperson)
technician.hasOne(staff)
staff.belongsTo(technician)
driver.hasOne(staff)
staff.belongsTo(driver)
customer.hasOne(person)
person.belongsTo(customer)
supplier.hasOne(person)
person.belongsTo(supplier)
servicePartner.hasOne(person)
person.belongsTo(servicePartner)

module.exports.person = person
module.exports.juristicPerson = juristicPerson
module.exports.generalPerson = generalPerson
module.exports.branch = branch
module.exports.staff = staff
module.exports.admin = admin
module.exports.salepersn = saleperson
module.exports.technician = technician
module.exports.driver = driver
module.exports.customer = customer
module.exports.supplier = supplier
module.exports.servicePartner = servicePartner
