export interface IPlugin {
    name: string;
    script: string;
}

declare global {
    interface Window {
        siyuan: any;
        require: any;
        pluginSystem?: any;
        siyuanPluginScript?: string;
    }
}