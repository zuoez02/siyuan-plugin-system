import { inject, injectable } from "inversify";
import { getLocalStorage, setStorageVal } from "../api/server-api";
import { defaultConfig, PLUGIN_SYSTEM_PLUGIN } from "./plugin-config";
import { internalPlugins } from "../internal";
import { PluginFileManager } from "./plugin-file-manager";
import { TYPES } from "../config";
import { IStorageManager, PluginManifest } from "../types";

@injectable()
export class StorageManager implements IStorageManager {
    private pluginFileManager: PluginFileManager;

    private config: any;

    private initialized;

    private plugins: PluginManifest[];

    constructor(@inject(TYPES.PluginFileManager) pluginFileManager) {
        this.config = Object.assign({}, defaultConfig);
        this.initialized = false;
        this.pluginFileManager = pluginFileManager;
    }

    public get(key: string) {
        return this.config[key];
    }

    public async set(key: string, val: any) {
        this.config[key] = val;
        return setStorageVal(key, val);
    }

    async initStorage() {
        if (this.initialized) {
            return this;
        }
        const all = await getLocalStorage();
        const configKeys = Object.keys(defaultConfig);
        for (const key of configKeys) {
            if (all[key] !== undefined) {
                this.config[key] = all[key];
            } else {
                await setStorageVal(key, defaultConfig[key]);
            }
        }
        // load all plugins
        const outsidePlugins = await this.pluginFileManager.getAllPlugins();
        const plugins = [...internalPlugins, ...outsidePlugins];
        const enabledPlugins = this.get(PLUGIN_SYSTEM_PLUGIN) as [{ key: string, enabled: boolean }];
        for (const ep of enabledPlugins) {
            for (const p of plugins) {
                if (p.key === ep.key) {
                    p.enabled = ep.enabled || false;
                    break;
                }
            }
        }
        this.plugins = plugins;
        await this.savePluginsEnabled();

        this.initialized = true;
        return this;
    }

    public getPlugins() {
        return this.plugins;
    }

    public getPluginByKey(key) {
        return this.plugins.find((p) => p.key === key);
    }

    public async setPluginEnabled(key: string, enabled: boolean) {
        for (const p of this.plugins) {
            if (p.key === key) {
                p.enabled = enabled;
                break;
            }
        }
        await this.savePluginsEnabled();
    }

    public async savePluginsEnabled() {
        this.set(PLUGIN_SYSTEM_PLUGIN, this.plugins.map((p) => ({ key: p.key, enabled: p.enabled })));
    }
}
