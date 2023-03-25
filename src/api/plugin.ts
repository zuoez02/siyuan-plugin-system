/* eslint-disable */
import { IPlugin, IPluginCommand } from '../types';

export class Plugin implements IPlugin {
    _id: string;
    onload() {}
    onunload() {}
    registerCommand(command: IPluginCommand) {}
    async loadStorage(filename: string) {
        return null;
    }
    async writeStorage(filename: string, content: any) {}
}
