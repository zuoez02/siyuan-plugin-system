export {};

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
        pluginSystemIocContainer?: any;
        pluginSystemSource?: string;
        Lute: any;
    }
}
