const EventEmitter = require('../event_emitter.js')

module.exports = class FormView extends EventEmitter {
    constructor(model, elements){
        super()
        this._model = model
        this._elements = elements

    }
}
