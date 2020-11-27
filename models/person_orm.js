const { DataTypes } = require("sequelize");
const sequelize = require('../config/connection.js');

class Person {
    constructor(){
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

class JuristicPerson extends Person {
    constructor(){
        super()
        this._juristic_type = {
            type: DataTypes.STRING(4)
        }
        this._tax_id = {
            type: DataTypes.STRING()
        }
    }
}

class GeneralPerson extends Person {
    constructor(){
        super()
        this._title = {
            type: DataTypes.STRING(10)
        }
        this._id_card = {
            type: DataTypes.STRING(13)
        }
    }
}

class Staff extends GeneralPerson {
    constructor(){
        super()
        this._branch = {
            type: DataTypes.INTEGER
        }
    }
}

class Admin extends Staff {
    constructor(){
        super()
        this._username = {
            type: DataTypes.STRING()
        }
        this._password = {
            type: DataTypes.STRING(1024)
        }
    }
}

module.exports.admin = sequelize.define('admin', new Admin());