import { PluginLoader } from "./loader";

export class PluginSystem {
    pluginLoader: PluginLoader;

    constructor() {
        this.pluginLoader = new PluginLoader();
    }

    init() {
        this.pluginLoader.loadAllLocalPlugins();
    }
}