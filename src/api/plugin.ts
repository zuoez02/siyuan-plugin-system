import { IPlugin, IPluginCommand } from "../types";

export class Plugin implements IPlugin {
    _id: string;
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onload(){}
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onunload(){}
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    registerCommand(command: IPluginCommand) {}
}
