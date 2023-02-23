export interface IPlugin {
    name: string;
    script: string;
}

declare global {
    const __VERSION__: string;

    interface Window {
        siyuan: any;
        require: any;
        pluginSystem?: any;
        siyuanPluginScript?: string;
        pluginSystemVersion?: string;
    }
}