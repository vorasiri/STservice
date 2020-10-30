require('./event_emitter.js')

class NotificationView extends EventEmitter {
    constructor(model, elements) {
        super();
        this._model = model;
        this._elements = elements;

        // attach model listeners
        model.on('itemAdded', () => this.rebuildList())
            .on('itemRemoved', () => this.rebuildList());

        // attach listeners to HTML controls of each card
        elements.list.addEventListener('change',
            e => this.emit('listModified', e.target.selectedIndex));
        elements.addButton.addEventListener('click',
            () => this.emit('addButtonClicked'));
        elements.delButton.addEventListener('click',
            () => this.emit('delButtonClicked'));
    }

    show() {
        this.rebuildList();
    }

    rebuildList() {
        var deliveries = []
        var acInstallations = []
        var whInstallations = []
        var satInstallations = []
        var returns = []
        const list = this._elements;
        list.length = 0;
        this._model.getHeaders().forEach(
            item => {
                if (item.size === 3){
                    list.append(`<h3 id=${item}>${item}</h3>`)
                }
                else if (item.size === 4){
                    list.append(`<h4 id=${item}>${item}</h4>`)
                }
            }
        )
        this._model.getItems().forEach(
            item => {
                if (item === 'deliveries') {
                    
                }
                else if (item === 'acInstallations') {

                }
                else if (item === 'whInstallations') {
                    
                }
                else if (item === 'satInstallations') {
                    
                }
                else if (item === 'returns') {
                    
                }
            }

            item => list.append(new Option(item)));
        
    }
}
