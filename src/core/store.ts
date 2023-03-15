import { TYPES } from "@/config";
import { PLUGIN_STORE_URL } from "@/core/plugin-config";
import { StorePluginManifest, StorePluginStatus } from "@/types";
import axios from "axios";
import { inject, injectable } from "inversify";
import { IStorageManager } from "siyuan/types";
import semver, { rsort, SemVer } from 'semver';
import { writeFile } from "@/util/fs";
import { resolve } from "path";

@injectable()
export class Store {
    private plugins: StorePluginManifest[];
    private pluginStatus: StorePluginStatus[];

    constructor(@inject(TYPES.StorageManager) private storageManager) {
        this.plugins = [];
        this.pluginStatus = [];
        this.init();
    }

    public async init() {
        await this.loadPluginsFromUrl();
        const plugins = this.storageManager.getPlugins();
        const storePlugins: StorePluginStatus[] = [];
        for (const plugin of this.plugins) {
            const p: StorePluginStatus = { ...plugin, isExist: false, needUpgrade: false };
            const oldPlugin = plugins.find((p) => p.key === plugin.key);
            if (oldPlugin) {
                p.isExist = true;
                const pV = new SemVer(p.version);
                const oldPluginV = new SemVer(oldPlugin.version);
                if (pV.compare(oldPluginV) === 1) {
                    p.needUpgrade = true;
                }
            }
            storePlugins.push(p);
        }
        this.pluginStatus = storePlugins;
    }

    public getStoreUrl() {
        return this.storageManager.get(PLUGIN_STORE_URL);
    }

    public getPlugins() {
        return this.plugins;
    }

    public getPluginsWithStatus() {
        return this.pluginStatus;
    }

    public async loadPluginsFromUrl() {
        const storeUrl = this.getStoreUrl();
        if (!storeUrl) {
            return;
        }
        let res;
        try {
            res = await axios.get(storeUrl + '/plugins.json') as any;
        } catch (e) {
            console.error(e)
            return;
        }
        if (Array.isArray(res.data?.plugins)) {
            for (const pluginKey of res.data?.plugins) {
                const plugin = await this.getPluginManifest(`${storeUrl}/${pluginKey}`);
                this.plugins.push(plugin);
            }
        }
    }

    public async getPluginByUrl(url) {
        return Promise.all([this.getPluginManifest(url), this.getPluginMainJs(url)]).then((value) => {
            return {
                manifest: value[0],
                mainJs: value[1],
            }
        })
    }

    public async getPluginManifest(url: string) {
        try {
            const manifest = await axios.get(`${url}/manifest.json`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return manifest.data;
        } catch (e) {
            console.error(e);
            return null;
        }
    }

    public async getPluginMainJs(url: string) {
        // @ts-ignore
        window.axios = axios;
        try {
            const res = await axios.get(`${url}/main.js`, {
                headers: {
                    'Content-Type': 'text/plain',
                },
            });
            return res.data;
        } catch (e) {
            console.error(e);
            return null;
        }
    }

    public async downloadPlugin(key: string) {
        const files = await this.getPluginByUrl(`${this.getStoreUrl()}/${key}`);
        const manifestJson = files.manifest;
        const mainJs = files.mainJs;
        await writeFile(`/data/plugins/${key}`, null, true);
        await writeFile(`/data/plugins/${key}/manifest.json`, JSON.stringify(manifestJson), false);
        await writeFile(`/data/plugins/${key}/main.js`, mainJs, false);
    }
}