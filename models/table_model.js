const EventEmitter = require('../event_emitter.js')


module.exports = class TableModel extends EventEmitter {
    constructor(models){
        super()
        this._models = models
        this._tableName
        this._tableJson
    }

    async loadTable(tableName){
        this._tableName = tableName
        this._tableJson = await this._models[this._tableName].findAll()
        this.emit('tableUpdated')
    }

}