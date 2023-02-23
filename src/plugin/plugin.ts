export class Plugin {
    _id: string;
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onload(){}
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onunload(){}
}

export interface PluginConstructor {
    new (): Plugin
}

export interface PluginInfo {
    name: string;
    content: string;
}