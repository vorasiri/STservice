const EventEmitter = require('../event_emitter.js')
window.$ = window.jQuery = require('jquery');

module.exports = class NotificationView extends EventEmitter {
    constructor(model, elements) {
        super();
        this._model = model;
        this._elements = elements;

        // attach model listeners
        model.on('itemAdded', () => this.rebuildList())
            .on('itemRemoved', () => this.rebuildList());

    }

    show() {
        this.rebuildList();
    }

    rebuildList() {
        const list = this._elements.sidebar;
        list.length = 0;
        this._model.getItems().forEach(
            item => {
                if (item.length > 0) {
                    var catagory = 'Installation'
                    if (Object.keys(item).includes(catagory)) {
                        if ($(`#${catagory}`).length) { }
                        else list.append(`<h3> id=${catagory}>${catagory}</h3>`)
                        $(`#${catagory}`).append(`<h4> id=${item}>${item}</h3>`)
                    }
                    else {
                        list.append(`<h3> id=${item}>${item}</h3>`)
                    }
                }
            }
        )
        this._model.getItems().forEach(
            item => {
                item.forEach(
                    job => {
                        $(`${Object.keys(item)}`).append(this.notificationBlock(job))
                        //attach event listener
                        $(`#${job.type}_${job.type}_edit`).addEventListener('click',
                            e => this.emit('editButtonClicked', e));
                        $(`#${job.type}_${job.type}_confirm`).addEventListener('click',
                            e => this.emit('confirmButtonClicked', e));
                        $(`#${job.type}_${job.type}_dismiss`).addEventListener('click',
                            e => this.emit('dismissButtonClicked', e));
                    }
                )
            }
        )
    }

    notificationBlock(job) {
        if (typeof job !== NotificationBlock) {
            console.log('wrong data type')
        }
        else {
            var cardformat = ''
            cardformat += `<div class="card">
            <div class="jobID">
                <b>${job.id}</b>
            </div>
            <div class="jobDetail">
                นัดหมาย:${job.appointmentTime.format("dd/mm/yyyy HH:MM")}<br>
                ${job.customerName}<br>
                ${job.customerTel}<br>`

            if (job.type === 'info_delivery') {
                cardformat += `${this.deliveryProductRead(job.details[0], job.details[1], job.details[2])}`
            }
            else if (job.type.includes('installation')) {
                if (job.type.includes('sat')) {
                    cardformat += `${job.details[0]}/${job.details[1]}/${job.details[2]} = ${job.details[3]}<br>`
                }
                else {
                    cardformat += `${job.details[0]}/${job.details[1]}<br>`
                }
            }
            cardformat += `พนักงานติดตั้ง:${job.staffName}
            </div>
            <div class="groupbtn">
                <button id="${job.type}_${job.id}_edit" class="editbtn">แก้ไข</button>
                <button id="${job.type}_${job.id}_confirm" class="checkbtn">&#10003;</button>
                <button id="${job.type}_${job.id}_dismiss" class="crossbtn">&#10005;</button>
            </div>
            </div>`
            return cardformat
        }
    }

    deliveryProductRead(product, brand, model) {
        let spliter = ','
        let productArray = product.split(spliter)
        let brandArray = brand.split(spliter)
        let modelArray = model.split(spliter)

        var notiString = ''
        for (i = 0; i < productArray.length; i++) {
            notiString += `${productArray[i]}/${brandArray[i]}/${modelArray[i]}<br>`
        }

        return notiString
    }
}
