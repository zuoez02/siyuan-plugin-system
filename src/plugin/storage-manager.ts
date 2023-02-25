import "reflect-metadata";
import { injectable } from "inversify";
import { getLocalStorage, setStorageVal } from "../worker/server-api";
import { defaultConfig, PLUGIN_SYSTEM_PLUGIN } from "./config";
import { IPlugin } from "../type";
import { getAllPlugins } from "../worker/plugin";
import { internalPlugins } from "../internal";


@injectable()
class StorageManager {
    private config: any;

    private initialized;

    private plugins: IPlugin[];

    constructor() {
        this.config = Object.assign({}, defaultConfig);
        this.initialized = false;
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
        const outsidePlugins = await getAllPlugins();
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

export { StorageManager }