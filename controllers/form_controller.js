const EventEmitter = require('../event_emitter.js')

module.exports = class FormController extends EventEmitter {
    constructor(model, view, tableModel, tableView){
        super()
        this._model = model
        this._view = view
        this._tableModel = tableModel
        this._tableView = tableView

        this._tableView.on('importButtonClicked', () => this.loadImportForm())
        this._tableView.on('addButtonClicked', () => this.loadEmptyForm())
    }

    loadEmptyForm(){
        console.log('Load Empty Form')
        this._view.loadEmptyForm(this._tableModel._tableName)
    }

    loadImportForm(){
        console.log('Load Import Form')
        this._view.loadImportForm(this._tableModel._tableName)
    }
}