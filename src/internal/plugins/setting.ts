import { Menu, MenuItem, Dialog } from '../../internal';
import * as clientApi from '../../api/client-api';
import { Plugin } from '../../api/plugin';
import Settings from './views/setting.svelte';

export default class InternalSettingPlugin extends Plugin {
    constructor() {
        super();
    }

    onload() {
        const internalSettingButton = document.createElement('button');
        internalSettingButton.classList.add('toolbar__item')
        internalSettingButton.insertAdjacentHTML('beforeend', '<svg><use xlink:href="#iconSettings"></use></svg>');
        internalSettingButton.addEventListener('click', (event) => {
            new Menu('internalSettingButton')
                .addItem(
                    new MenuItem({
                        label: '插件系统设置',
                        icon: 'iconEdit',
                        click: () => showSettingDialog(),
                    })
                )
                .addSeparator()
                .addItem(
                    new MenuItem({
                        label: '重载',
                        icon: 'iconRefresh',
                        click: () => window.location.reload(),
                    })
                )
                .showAtMouseEvent(event);
            event.stopPropagation();
        });
        clientApi.addToolbarRight(internalSettingButton);
    }

    onunload() {
        console.log('InternalSettingPluginUnload');
    }
}

function showSettingDialog() {
    new Dialog({
        title: '插件系统设置',
        content: '<div id="plugin-settings"></div>',
        width: '90vw',
        height: '50vh',
    });
    setTimeout(() => {
        new Settings({
            target: document.getElementById('plugin-settings'),
        })
    })
}