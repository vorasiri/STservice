require('./event_emitter.js')
/**
 * The Model. Model stores items and notifies
 * observers about changes.
 */

class userModel extends EventEmitter{
    constructor(name, position) {
        super()
        this._name = name
        this._position = position
    }

    getName() {
        return this._name
    }

    setName()
}

class MainPageModel extends EventEmitter {
    constructor(user, mainAreas, notifications) {
        super()
        this._user = user
        this._mainAreas = mainAreas || []
        this._notifications = notifications || []
    }

    getUser() {
        return this._user
    }

    setUser(user) {
        this._user = user
    }

    getMainAreas() {
        return this._menus.slice()
    }

    addMainArea(mainArea) {
        this._mainAreas.push(mainArea)
        if (this._mainAreas.slice().length >= 2) {
            this._mainAreas.shift()
        }
    }

    getNotifications() {
        return this._menus.slice()
    }

    addNotification(notification) {
        this._notifications.push(notification)

    }
}

class FormModel extends EventEmitter {
    constructor(srcHtml, pageHeader) {
        super()
    }
}