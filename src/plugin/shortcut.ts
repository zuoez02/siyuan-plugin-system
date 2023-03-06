import { TYPES } from "@/config";
import { Command, IEventBus, IShortcut } from "@/types";
import { log } from "@/util";
import hotkeys from 'hotkeys-js';
import { inject, injectable } from "inversify";

hotkeys.filter = function (event) {
    return true;
}

@injectable()
export class Shortcut implements IShortcut {
    private eventBus: IEventBus;

    private option = {
        capture: true,
    }

    public constructor(@inject(TYPES.EventBus) eventBus: IEventBus) {
        log('Initialize shortcut subsystem');
        this.eventBus = eventBus;
    }

    public registerKeyboardEvent(shortcut: string, callback: (e: KeyboardEvent) => void) {
        hotkeys(shortcut, this.option, callback);
        this.eventBus.on(shortcut.toString(), callback,);
    }

    public unregisterKeyboardEvent(shortcut: string) {
        hotkeys.unbind(shortcut);
        this.eventBus.off(shortcut.toString());
    }

    public registerKeyboardEventFromPlugin(command: Command) {
        if (command.shortcut && command.callback) {
            this.registerKeyboardEvent(command.shortcut, command.callback);
        }
    }

    public unregisterKeyboardEventFromPlugin(command: Command) {
        if (command.shortcut && command.callback) {
            this.unregisterKeyboardEvent(command.shortcut);
        }
    }
}
