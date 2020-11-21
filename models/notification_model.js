class Notification {
    constructor(type, id, appointmentTime, customerName, customerTel, details, staffName, status) {
        this._type = type
        this._id = id
        this._appointmentTime = appointmentTime
        this._customerName = customerName
        this._customerTel = customerTel
        this.details = details || []
        this._staffName = staffName
        this._status = status
    }
}

const EventEmitter = require('../event_emitter.js')

module.exports = class NotificationModel extends EventEmitter {

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

    confirmItem(type, id) {
        this._items[type].forEach(
            job => {
                if (job._id === id) {
                    job._status += 1
                }
            }
        )
    }

    dismissItem(type, id) {
        this._items[type].forEach(
            job => {
                if (job._id === id) {
                    job._status -= 1
                }
            }
        )
    }

    getItems() {
        return Object.entries(this._items)
    }

    addItem(type, item) {
        this._items[type].push(item)
        this.emit('itemAdded', item)
    }

    removeItem(type, item) {
        let index = this._items[type].findIndex(item)
        this._items[type].splice(index, 1)[0]
        this.emit('itemRemoved', item);
    }
}
