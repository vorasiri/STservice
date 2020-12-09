window.$ = window.jQuery = require('jquery')
const personOrm = require('../models/person_orm.js')
const serviceOrm = require('../models/service_orm.js')
const itemOrm = require('../models/item_orm.js')
const TableModel = require('../models/table_model.js')
const TableView = require('../views/table_view.js')
const TableController = require('../controllers/table_controller.js')

let tableModel = new TableModel({
    personOrm,
    serviceOrm,
    itemOrm
})
let tableController = new TableController(
    tableModel,
    new TableView(tableModel, {})
);