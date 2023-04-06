/* eslint-disable */
import { IPlugin, IPluginCommand, SettingRender } from '../types';

export class Plugin implements IPlugin {
    _id: string;
    onload() {}
    onunload() {}
    registerCommand(command: IPluginCommand) {}
    registerSettingRender(settingRender: SettingRender) {}
    async loadStorage(filename: string) {
        return null;
    }
    async writeStorage(filename: string, content: any) {}
}
