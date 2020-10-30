require('./event_emitter.js')
const notification = require("./json_information/notification_status.json")

class NotificationBlock {
    constructor(type, id, appointmentTime, customerName, customerTel, details, staffName) {
        this._type = type
        this._id = id
        this._appointmentTime = appointmentTime
        this._customerName = customerName
        this._customerTel = customerTel
        this.details = details || []
        this._staffName = staffName
    }
}

class NotificationModel extends EventEmitter {

    constructor(items) {
        super()
        this._items = items || {
            'deliveries': [],
            'acInstallations': [],
            'whInstallations': [],
            'satInstallations': [],
            'returns': [],
        }

    }

    getItems() {
        return this._items.slice()
    }

    addItem(type, item) {
        this._items[type].push(item)
        this.emit('itemAdded', item)
    }

    removeItem(type, item) {
        let index = this._items[type].findIndex(item)
        const item = this._items[type].splice(index, 1)[0]
        this.emit('itemRemoved', item);
    }
}
