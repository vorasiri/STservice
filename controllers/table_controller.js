const EventEmitter = require('../event_emitter.js')

module.exports = class TableController extends EventEmitter {
    constructor(model, view){
        super()
        this._model = model
        this._view = view

        view.on('menuClicked', e => this.updateTable(e))
        view.on('detailSaved', () => this.updateTable(this._model._tableName))
    }

    async updateTable(e){
        this._model.loadTable(e)
        this._view.buildInfoPage()
    }

    loadForm(){
        console.log('load form')
    }

    loadMenu(){
        this._view.loadMenu()
    }
}
