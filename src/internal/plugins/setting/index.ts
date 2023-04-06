import { Menu, MenuItem, Dialog } from '@/internal';
import * as clientApi from '@/api/client-api';
import { Plugin } from '@/api/plugin';
import Settings from './setting.svelte';
import { _ } from '@/util';

export class InternalSettingPlugin extends Plugin {
    constructor() {
        super();
    }
    svg =
        '<svg t="1679703027227" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="24715" width="200" height="200"><path d="M512 1023.99984a75.519988 75.519988 0 0 1-53.679992-22.207997L22.368077 565.455912c-29.487995-29.679995-29.487995-77.919988-0.064-107.519984l159.711975-159.839975a31.951995 31.951995 0 0 1 54.047991 28.207996 131.10398 131.10398 0 0 0-2.368 23.135996c0 69.951989 56.895991 128.11198 126.847981 128.11198 69.999989 0 121.119981-58.159991 121.119981-128.11198 0-70.079989-51.119992-127.07198-121.119981-127.07198a130.87998 130.87998 0 0 0-23.007997 2.384 31.759995 31.759995 0 0 1-33.919994-16.671998 31.999995 31.999995 0 0 1 5.743999-37.423994l148.895976-149.103976c28.847995-28.719996 78.719988-28.655996 107.423984-0.064l109.023983 109.183983C697.439971 59.887991 763.871961 8.479999 842.015948 8.479999c96.911985 0 175.743973 78.959988 175.743973 175.967972 0 78.239988-51.295992 144.719977-122.063981 167.471974l105.887984 105.951983a76.351988 76.351988 0 0 1 0.031999 107.551984L565.743992 1001.775843A75.759988 75.759988 0 0 1 512 1023.99984z" fill="" p-id="24716"></path></svg>';
    onload() {
        const internalSettingButton = document.createElement('button');
        internalSettingButton.setAttribute('aria-label', _('plugin_system'));
        internalSettingButton.classList.add('toolbar__item', 'b3-tooltips', 'b3-tooltips__sw');
        internalSettingButton.insertAdjacentHTML('beforeend', this.svg);
        internalSettingButton.addEventListener('click', (event) => {
            new Menu('internalSettingButton')
                .addItem(
                    new MenuItem({
                        label: _('plugin_system_setting'),
                        icon: 'iconEdit',
                        click: () => showSettingDialog(),
                    })
                )
                .addSeparator()
                .addItem(
                    new MenuItem({
                        label: _('reload'),
                        icon: 'iconRefresh',
                        click: () => window.location.reload(),
                    })
                )
                .showAtMouseEvent(event);
            event.stopPropagation();
        });
        clientApi.addToolbarRight(internalSettingButton);

        this.registerCommand({
            command: 'Show plugin system conifg',
            description: _('show_plugin_system_config'),
            shortcut: 'command+option+p',
            callback: () => showSettingDialog(),
        });
        this.registerCommand({
            command: 'Reload Window',
            description: _('reload_window'),
            callback: () => window.location.reload(),
        });
    }
}

function showSettingDialog() {
    new Dialog({
        title: _('plugin_system_setting'),
        content: '<div id="plugin-settings"></div>',
        width: '90vw',
        height: '80vh',
    });
    setTimeout(() => {
        new Settings({
            target: document.getElementById('plugin-settings'),
        });
    });
}
