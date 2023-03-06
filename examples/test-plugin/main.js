const siyuan = require('siyuan');
const { Plugin, Menu, MenuItem } = siyuan;

class TestPlugin extends Plugin {
    constructor() {
        super();
    }

    onload() {
        const button = document.createElement('button');
        button.textContent = 'left';
        button.addEventListener('click', () => {
            new Menu('internalSettingButton')
                .addItem(
                    new MenuItem({
                        label: 'Hello World',
                        icon: 'iconEdit',
                        click: () => console.log('hello world'),
                    })
                )
                .showAtMouseEvent(event);
            event.stopPropagation();
        });
        siyuan.clientApi.addToolbarLeft(button);
        this.el = button;

        this.registerCommand({
            command: 'SayHello',
            shortcut: 'ctrl+a',
            callback: () => {
                console.log('hello');
            },
        })
    }

    onunload() {
        console.log('TestRemotePluginUnload');
        this.el && this.el.remove();
    }
}

module.exports = {
    default: TestPlugin,
};
