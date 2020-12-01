window.$ = window.jQuery = require('jquery')
const TableModel = require('../models/table_model.js')
const TableView = require('../views/table_view.js')
const TableController = require('../controllers/table_controller.js')

let tableModel = new TableModel()
let tableController = new TableController(
    tableModel,
    new TableView(tableModel, {})
)