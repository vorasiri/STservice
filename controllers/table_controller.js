const EventEmitter = require('../event_emitter.js')

module.exports = class TableController extends EventEmitter {
    constructor(model, view){
        super()
        this._model = model
        this._view = view

        view.on('menuClicked', e => this.updateTable(e))
    }

    updateTable(e){
        this._model.loadTable(e)
    }

    loadMenu(){
        this._view.loadMenu()
    }
}
