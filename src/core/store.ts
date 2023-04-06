import { TYPES } from '@/config';
import { PLUGIN_STORE_URL } from '@/core/plugin-config';
import { IStorageManager, IStore, StorePluginManifest, StorePluginStatus } from '@/types';
import { AxiosResponse } from 'axios';
import { inject, injectable } from 'inversify';
import { SemVer } from 'semver';
import { request, sleep } from '@/util';
import { FileClient } from '@/api/file-api';

@injectable()
export class Store implements IStore {
    private plugins: StorePluginManifest[];
    private pluginStatus: StorePluginStatus[];

    constructor(@inject<IStorageManager>(TYPES.StorageManager) private storageManager: IStorageManager) {
        this.plugins = [];
        this.pluginStatus = [];
    }

    public async init() {
        this.plugins = [];
        this.pluginStatus = [];
        await Promise.all([this.loadPluginsFromUrl(), this.storageManager.initStorage()]);
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
            res = await request.get(storeUrl + '/plugins.json', {
                headers: {
                    'Cache-Control': 'no-cache',
                },
            });
        } catch (e) {
            console.error(e);
            return;
        }
        const req = [];
        if (Array.isArray(res.data?.plugins)) {
            for (const pluginKey of res.data?.plugins || {}) {
                const plugin = this.getPluginManifest(`${storeUrl}/${pluginKey}`);
                req.push(plugin);
            }
        }
        this.plugins = await Promise.all(req);
    }

    public async getPluginByUrl(url: string) {
        return Promise.all([this.getPluginManifest(url), this.getPluginMainJs(url)]).then((value) => {
            return {
                manifest: value[0],
                mainJs: value[1],
            };
        });
    }

    public async getPluginManifest(url: string) {
        try {
            const manifest = await request.get(`${url}/manifest.json`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache',
                },
            });
            return manifest.data;
        } catch (e) {
            console.error(e);
            return null;
        }
    }

    public async getPluginMainJs(url: string) {
        try {
            const res = await request.get(`${url}/main.js`, {
                headers: {
                    'Content-Type': 'text/plain',
                    'Cache-Control': 'no-cache',
                },
            });
            return res.data;
        } catch (e) {
            console.error(e);
            return null;
        }
    }

    public async getPluginReadme(key: string) {
        const url = `${this.getStoreUrl()}/${key}`;
        try {
            const res = await request.get(`${url}/README.md`, {
                headers: {
                    'Content-Type': 'text/plain',
                    'Cache-Control': 'no-cache',
                },
            });
            return res.data as string;
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
