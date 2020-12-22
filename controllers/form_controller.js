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
        this._tableView.on('rowClicked', (e) => this.loadFilledForm(e))
    }

    loadEmptyForm(){
        console.log('Load Empty Form')
        this._view.buildEmptyForm(this._tableModel._tableName)
    }

    loadImportForm(){
        console.log('Load Import Form')
        this._view.buildImportForm(this._tableModel._tableName)
    }

    loadFilledForm(e){
        console.log('Load Filled Form', this._tableModel._tableName, e.currentTarget.cells[0].innerText)
    }
}