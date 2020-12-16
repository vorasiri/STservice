const EventEmitter = require('../event_emitter.js')

module.exports = class TableController extends EventEmitter {
    constructor(model, view){
        super()
        this._model = model
        this._view = view

        view.on('menuClicked', e => this.updateTable(e))
    }

    async updateTable(e){
        await this._model.loadTable(e)
        await this._view.buildInfoPage()
        this._view.buildTable()
    }

    loadForm(){
        console.log('load form')
    }

    loadMenu(){
        this._view.loadMenu()
    }
}
