import { TYPES } from '@/config';
import { PLUGIN_STORE_URL } from '@/core/plugin-config';
import { IStorageManager, StorePluginManifest, StorePluginStatus } from '@/types';
import axios, { AxiosResponse } from 'axios';
import { inject, injectable } from 'inversify';
import { SemVer } from 'semver';
import { sleep } from '@/util';
import { FileClient } from '@/api/file-api';

@injectable()
export class Store {
    private plugins: StorePluginManifest[];
    private pluginStatus: StorePluginStatus[];

    constructor(@inject<IStorageManager>(TYPES.StorageManager) private storageManager: IStorageManager) {
        this.plugins = [];
        this.pluginStatus = [];
    }

    public async init() {
        this.plugins = [];
        this.pluginStatus = [];
        await this.loadPluginsFromUrl();
        await this.storageManager.initStorage();
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

    public async loadPlugins() {
        await this.init();
        return this.getPluginsWithStatus();
    }

    public getPluginsWithStatus() {
        return this.pluginStatus;
    }

    public async loadPluginsFromUrl() {
        const storeUrl = this.getStoreUrl();
        if (!storeUrl) {
            return;
        }
        let res: AxiosResponse;
        try {
            res = await axios.get(storeUrl + '/plugins.json');
        } catch (e) {
            console.error(e);
            return;
        }
        if (Array.isArray(res.data?.plugins)) {
            for (const pluginKey of res.data?.plugins || {}) {
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
            };
        });
    }

    public async getPluginManifest(url: string) {
        try {
            const manifest = await axios.get(`${url}/manifest.json`, {
                headers: {
                    'Content-Type': 'application/json',
                },
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
        await sleep(500);
        const files = await this.getPluginByUrl(`${this.getStoreUrl()}/${key}`);
        const manifestJson = files.manifest;
        const mainJs = files.mainJs;
        return await Promise.all([
            FileClient.getInstanceApi().fileApi.putFile(`/data/plugins/${key}`, null, true),
            FileClient.getInstanceApi().fileApi.putFile(`/data/plugins/${key}/manifest.json`, JSON.stringify(manifestJson), false),
            FileClient.getInstanceApi().fileApi.putFile(`/data/plugins/${key}/main.js`, mainJs, false),
        ]);
    }
}
