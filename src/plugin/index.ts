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

    constructor(@inject(TYPES.PluginSystemLocalManager) pluginSystemLocalManager, @inject(TYPES.StorageManagerProvider) storageManagerProvider) {
        this.pluginLoader = new PluginLoader();
        this.pslm = pluginSystemLocalManager;
        this.storageManagerProvider = storageManagerProvider;
    }

    async init() {
        this.storageManager = await this.storageManagerProvider();
        this.pluginLoader.loadAllInternalPlugins();
        this.pluginLoader.loadAllLocalPlugins();
        this.pslm.localCacheInit();
        return this;
    }
}