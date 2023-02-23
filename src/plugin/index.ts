import { PluginSystemLocalManager } from "../worker/local";
import { PluginLoader } from "./loader";

export class PluginSystem {
    pluginLoader: PluginLoader;
    pslm: PluginSystemLocalManager;

    constructor() {
        this.pluginLoader = new PluginLoader();
            // save plugin loader to storage
        this.pslm = new PluginSystemLocalManager();
    }

    init() {
        this.pluginLoader.loadAllLocalPlugins();
        this.pslm.localCacheInit();
        return this;
    }
}