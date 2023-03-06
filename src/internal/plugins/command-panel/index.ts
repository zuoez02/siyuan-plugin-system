import { Plugin } from "@/api/plugin";
import { Dialog } from "@/internal/classes";
import { Shortcut } from "@/plugin/shortcut";
import CommandPanel__SvelteComponent_ from "./command-panel.svelte";

export class CommandPanelPlugin extends Plugin {
    shortcut: Shortcut;

    onload(): void {
        this.registerCommand({
            command: 'show command panel',
            shortcut: 'ctrl+shift+p',
            callback: () => {
                this.showPanel();
            }
        });
    }

    showPanel() {
        new Dialog({ content: '<div id="command-panel"></div>' });
        setImmediate(() => {
            new CommandPanel__SvelteComponent_({
                target: document.getElementById('command-panel'),
            });
        })
    }
}