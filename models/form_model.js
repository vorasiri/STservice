const { model } = require('../config/connection.js')
const EventEmitter = require('../event_emitter.js')

module.exports = class FormModel extends EventEmitter {
    constructor(){
        super()
    }
}