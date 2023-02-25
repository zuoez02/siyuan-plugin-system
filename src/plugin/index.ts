import "reflect-metadata";
import { inject, injectable } from "inversify";
import { PluginSystemLocalManager } from "../worker/plugin-system-local-manager";
import { PluginLoader } from "./loader";
import { StorageManager } from './storage-manager';
import { TYPES } from '../types';

@injectable()
export class PluginSystem {
    pluginLoader: PluginLoader;
    pslm: PluginSystemLocalManager;
    storageManager: StorageManager;
    storageManagerProvider: () => Promise<StorageManager>;

    constructor(@inject(TYPES.PluginLoader) pluginLoader, @inject(TYPES.PluginSystemLocalManager) pluginSystemLocalManager, @inject(TYPES.StorageManagerProvider) storageManagerProvider) {
        this.pluginLoader = pluginLoader;
        this.pslm = pluginSystemLocalManager;
        this.storageManagerProvider = storageManagerProvider;
    }

    async init() {
        this.storageManager = await this.storageManagerProvider();
        const plugins = this.storageManager.getPlugins();
        this.pluginLoader.loadEnabledPlugins(plugins);
        this.pslm.localCacheInit();
        return this;
    }

    async loadPlugin(key: string) {
        this.storageManager.setPluginEnabled(key, true);
        const plugin = this.storageManager.getPluginByKey(key);
        this.pluginLoader.loadPlugin(plugin);
    }

    async unloadPlugin(key: string) {
        this.storageManager.setPluginEnabled(key, false);
        this.pluginLoader.unloadPlugin(key);
    }
}