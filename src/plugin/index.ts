import "reflect-metadata";
import { inject, injectable } from "inversify";
import { TYPES } from '../config';
import { IPluginLoader, IPluginSystem, IStorageManager, ISystemManager } from "../types";
import { PLUGIN_SYSTEM_SAFE_MODE_ENABLED } from "./plugin-config";
import { log } from "../util";

@injectable()
export class PluginSystem implements IPluginSystem {
    pluginLoader: IPluginLoader;
    pslm: ISystemManager;
    storageManager: IStorageManager;
    storageManagerProvider: () => Promise<IStorageManager>;

    constructor(@inject(TYPES.PluginLoader) pluginLoader, @inject(TYPES.SystemManager) pluginSystemLocalManager, @inject(TYPES.StorageManagerProvider) storageManagerProvider) {
        this.pluginLoader = pluginLoader;
        this.pslm = pluginSystemLocalManager;
        this.storageManagerProvider = storageManagerProvider;
    }

    async init() {
        this.storageManager = await this.storageManagerProvider();
        const internalPlugins = this.storageManager.getInternalPlugins();
        this.pluginLoader.loadEnabledPlugins(internalPlugins);
        log(`Loading internal enabled plugins: ${internalPlugins.map((p) => p.key).join(',')}`);
        const securityModeEnabled = this.storageManager.get(PLUGIN_SYSTEM_SAFE_MODE_ENABLED);
        if (!securityModeEnabled) {
            const plugins = this.storageManager.getThirdPartyPlugins();
            log(`Loading 3rd party enabled plugins: ${plugins.map((p) => p.key).join(',')}`);
            this.pluginLoader.loadEnabledPlugins(plugins);
        }
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

    async turnOffSafeMode() {
        this.storageManager.setSafeModeEnabled(false);
        const plugins = this.storageManager.getThirdPartyPlugins();
        return this.pluginLoader.loadEnabledPlugins(plugins);
    }

    async turnOnSafeMode() {
        this.storageManager.setSafeModeEnabled(true);
        const plugins = this.storageManager.getThirdPartyPlugins();
        return this.pluginLoader.unloadThirdPartyPlugins(plugins);
    }
}