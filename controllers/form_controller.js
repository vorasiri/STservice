const EventEmitter = require('../event_emitter.js')

module.exports = class FormController extends EventEmitter {
    constructor(model, view, tableView){
        super()
        this._model = model
        this._view = view
        this._tableView = tableView

        this._tableView.on('importButtonClicked', () => this.loadForm())
    }

    loadForm(){
        console.log('load Form')
    }
}