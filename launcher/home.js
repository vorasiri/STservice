window.$ = window.jQuery = require('jquery')
const personOrm = require('../models/person_orm.js')
const serviceOrm = require('../models/service_orm.js')
const itemOrm = require('../models/item_orm.js')
const TableModel = require('../models/table_model.js')
const TableView = require('../views/table_view.js')
const TableController = require('../controllers/table_controller.js')
const FormModel = require('../models/form_model.js')
const FormView = require('../views/form_view.js')
const FormController = require('../controllers/form_controller.js')
const NotificationModel = require('../models/notification_model.js')
const NotificationView = require('../views/notification_view.js')
const NotificationController = require('../controllers/notification_controller.js')

let orm = {
    personOrm,
    serviceOrm,
    itemOrm
}

let tableModel = new TableModel(orm)
let tableView = new TableView(tableModel, {})
let tableController = new TableController(
    tableModel,
    tableView
);

let formModel = new FormModel(orm)
let formController = new FormController(
    formModel,
    new FormView(formModel, {}),
    tableModel,
    tableView
)

let notificationModel = new NotificationModel()
let notificationController = new NotificationController(
    notificationModel,
    new NotificationView(notificationModel, {})
)