window.$ = window.jQuery = require('jquery')
const personOrm = require('../models/person_orm.js')
const TableModel = require('../models/table_model.js')
const TableView = require('../views/table_view.js')
const TableController = require('../controllers/table_controller.js')

let tableModel = new TableModel({
    'Admin': personOrm.admin,
    'Branch': personOrm.branch
})
let tableController = new TableController(
    tableModel,
    new TableView(tableModel, {})
);