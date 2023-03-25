import { TYPES } from '@/config';
import { Command, ICommandManager } from '@/types';
import { Error, log, Warning } from '@/util';
import { inject, injectable } from 'inversify';
import { Shortcut } from './shortcut';

@injectable()
export class CommandManager implements ICommandManager {
    private shortcut: Shortcut;
    private commandList: Command[];

    public constructor(@inject(TYPES.Shortcut) shortcut) {
        this.commandList = [];
        this.shortcut = shortcut;
    }

    public registerCommand(command: Command) {
        if (
            this.commandList.some((com) => {
                com.plugin === command.plugin && com.command === command.command;
            })
        ) {
            return new Error('Command is already registered, do not register command repeatly');
        }
        if (
            command.shortcut &&
            this.commandList.some((com) => {
                com.shortcut === command.shortcut;
            })
        ) {
            return new Warning('shortcut has already registered');
        }
        this.commandList.push(command);
        this.shortcut.registerKeyboardEventFromPlugin(command);
        log(`Register plugin: ${command.plugin} command: ${command.command}`);
    }

    public unregisterCommandByPlugin(plugin: string) {
        for (let i = 0; i < this.commandList.length; i++) {
            if (plugin === this.commandList[i].plugin) {
                const com = this.commandList[i];
                log(`Unregister plugin: ${plugin} command: ${com.command}`);
                this.commandList.splice(i, 1);
                if (com.shortcut) {
                    this.shortcut.unregisterKeyboardEvent(com.shortcut);
                }
            }
        }
    }

    public unregisterCommand(command: Command) {
        for (let i = 0; i < this.commandList.length; i++) {
            if (command.command === this.commandList[i].command && command.plugin === this.commandList[i].plugin) {
                this.commandList.splice(i, 1);
                break;
            }
        }
        this.shortcut.registerKeyboardEventFromPlugin(command);
    }

    public getCommands(): Command[] {
        return this.commandList;
    }
}
