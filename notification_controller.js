const EventEmitter = require('./event_emitter.js')

class NotificationController {
    constructor(model, view) {
        this._model = model;
        this._view = view;

        view.on('editButtonClicked', e => this.edit(e));
        view.on('confirmButtonClicked', e => this.confirm(e));
        view.on('dismissButtonClicked', e => this.dismiss(e));
    }

    confirm(e) {
        job = e.id.split('_')
        this._model.confirmItem(job[0], job[1])
        console.log(job[0], job[1], 'confirm clicked')
    }

    dismiss(e) {
        job = e.id.split('_')
        this._model.dismissItem(job[0], job[1]);
        console.log(job[0], job[1], 'dismiss clicked')
    }

    edit(e) {
        job = e.id.split('_')
        // display form (which not included in this partial of code)
    }
}

module.exports = NotificationController