const EventEmitter = require('../event_emitter.js')

module.exports = class FormController extends EventEmitter {
    constructor(model, view, tableModel, tableView) {
        super()
        this._model = model
        this._view = view
        this._tableModel = tableModel
        this._tableView = tableView
        this._formType

        this._tableView.on('importButtonClicked', () => this.loadImportForm())
        this._tableView.on('addButtonClicked', () => this.loadEmptyForm())
        this._tableView.on('rowClicked', (e) => this.loadFilledForm(e))
        this._view.on('formSubmitted', () => this.updateData())
        this._model.on('detailSaved', () => this._tableView.emit('detailSaved'))
    }

    loadEmptyForm() {
        console.log('Load Empty Form', this._tableModel._tableName)
        this._formType = 'create'
        this._view.buildEmptyForm(this._tableModel._tableName)
    }

    loadImportForm() {
        console.log('Load Import Form', this._tableModel._tableName)
        this._formType = 'create'
        this._view.buildImportForm(this._tableModel._tableName)
    }

    loadFilledForm(e) {
        let pk = e.currentTarget.cells[0].innerText
        console.log('Load Filled Form', this._tableModel._tableName, pk)
        this._formType = 'update'
        this._view.buildEmptyForm(this._tableModel._tableName)
        this._model.getDataById(this._tableModel._tableName, pk)
    }

    updateData() {
        if (this._formType === 'create') {

        }
        else if (this._formType === 'update') {
            this._model.saveDetail()
        }
    }
}