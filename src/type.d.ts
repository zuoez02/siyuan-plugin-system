export interface IPlugin {
    name: string;
    script: string;
}

// declare var process;

declare global {
    const __VERSION__: string;

    namespace NodeJS {
        interface ProcessEnv {
            HOME?: string;
        }
    }

    interface Window {
        theme?: any;
        siyuan: any;
        require: any;
        pluginSystem?: any;
        siyuanPluginScript?: string;
        pluginSystemVersion?: string;
    }
}