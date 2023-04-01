import { Plugin } from '@/api/plugin';
import { Dialog } from '@/internal/classes';
import { Shortcut } from '@/core/shortcut';
import CommandPanel__SvelteComponent_ from './command-panel.svelte';
import { _ } from '@/util';

export class CommandPanelPlugin extends Plugin {
    shortcut: Shortcut;

    onload(): void {
        this.registerCommand({
            command: 'Show command panel',
            description: _('show_command_panel'),
            shortcut: 'ctrl+shift+o,command+shift+o',
            callback: () => {
                this.showPanel();
            },
        });
    }

    showPanel() {
        Dialog.destroyAll();
        new Dialog({ content: '<div id="command-panel"></div>' });
        setImmediate(() => {
            new CommandPanel__SvelteComponent_({
                target: document.getElementById('command-panel'),
            });
        });
    }
}
