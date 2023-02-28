import { inject, injectable } from "inversify";
import { getLocalStorage, setStorageVal } from "../api/server-api";
import { defaultConfig, PLUGIN_SYSTEM_PLUGIN, PLUGIN_SYSTEM_SAFE_MODE_ENABLED, PLUGIN_SYSTEM_THIRD_PARTY_PLUGIN } from "./plugin-config";
import { internalPlugins } from "../internal";
import { TYPES } from "../config";
import { IPluginFileManager, IStorageManager, PluginConfig, PluginEnableConfig, PluginManifest } from "../types";

@injectable()
export class StorageManager implements IStorageManager {
    private pluginFileManager: IPluginFileManager;

    private config: PluginConfig;

    private initialized: boolean;

    private internalPlugins: PluginManifest[];

    private thirdPartyPlugins: PluginManifest[];

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
        this.thirdPartyPlugins = await this.pluginFileManager.getAllPlugins();
        this.internalPlugins = [...internalPlugins];
        this.init3rdPartyEnabled();
        this.initInternalEnabled();    
        await this.savePluginsEnabled();

        this.initialized = true;
        return this;
    }

    private init3rdPartyEnabled() {
        const enabledPlugins = this.get(PLUGIN_SYSTEM_THIRD_PARTY_PLUGIN) as PluginEnableConfig[];
        for (const ep of enabledPlugins) {
            for (const p of this.thirdPartyPlugins) {
                if (p.key === ep.key) {
                    p.enabled = ep.enabled || false;
                    break;
                }
            }
        }
    }

    private initInternalEnabled() {
        const enabledPlugins = this.get(PLUGIN_SYSTEM_PLUGIN) as PluginEnableConfig[];
        for (const ep of enabledPlugins) {
            for (const p of this.internalPlugins) {
                if (p.key === ep.key) {
                    p.enabled = ep.enabled || false;
                    break;
                }
            }
        }
    }

    public getPlugins() {
        return [...this.internalPlugins, ...this.thirdPartyPlugins];
    }

    public getInternalPlugins() {
        return this.internalPlugins;
    }

    public getThirdPartyPlugins() {
        return this.thirdPartyPlugins;
    }

    public getPluginByKey(key) {
        return this.getPlugins().find((p) => p.key === key);
    }

    public async setPluginEnabled(key: string, enabled: boolean) {
        for (const p of [...this.internalPlugins, ...this.thirdPartyPlugins]) {
            if (p.key === key) {
                p.enabled = enabled;
                break;
            }
        }
        await this.savePluginsEnabled();
    }

    public async setSafeModeEnabled(enabled: boolean) {
        return this.set(PLUGIN_SYSTEM_SAFE_MODE_ENABLED, enabled);
    }

    public async savePluginsEnabled() {
        await this.set(PLUGIN_SYSTEM_PLUGIN, this.internalPlugins.map((p) => ({ key: p.key, enabled: p.enabled })));
        return this.set(PLUGIN_SYSTEM_THIRD_PARTY_PLUGIN, this.thirdPartyPlugins.map((p) => ({ key: p.key, enabled: p.enabled })));
    }
}
