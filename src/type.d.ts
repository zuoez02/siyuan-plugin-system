import { Plugin } from "./plugin/plugin";

export interface IPlugin {
    key: string;
    name: string;
    script?: string;
    enabled?: boolean;
    hidden?: boolean;
    description?: string;
    plugin?: new (...args: any) => Plugin;
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