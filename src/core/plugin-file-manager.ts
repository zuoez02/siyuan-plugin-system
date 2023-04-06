import { FileClient } from '@/api/file-api';
import { injectable } from 'inversify';
import { PluginManifest } from '../types';
import { error, isExists, log } from '../util';

export const MANIFEST = 'manifest.json';

export const SCRIPT = 'main.js';

@injectable()
export class PluginFileManager {
    async scanPlugins(pluginFolder: string): Promise<string[]> {
        const res = await FileClient.getInstanceApi().fileApi.readDir(pluginFolder);
        if (!res) {
            return [];
        }
        const files = res;
        const result: string[] = [];
        for (const f of files) {
            if (f.name.startsWith('.')) {
                continue;
            }
            if (f.isDir && (await isExists(`/data/plugins/${f.name}/manifest.json`)) && (await isExists(`/data/plugins/${f.name}/main.js`))) {
                result.push(`/data/plugins/${f.name}`);
            }
        }
        return result;
    }

    async getFileContent(f: string): Promise<string> {
        const res = await FileClient.getInstanceApi().fileApi.getFile(f);
        return res || '';
    }

    async getManifest(manifest: string) {
        const content = await this.getFileContent(manifest);
        try {
            return JSON.parse(content);
        } catch (e) {
            error('loading manifest: ' + manifest, e);
            return null;
        }
    }

    async getScript(script: string) {
        return await this.getFileContent(script);
    }

    async getAllPlugins(): Promise<PluginManifest[]> {
        const plugins = await this.scanPlugins('/data/plugins');
        if (!plugins || !plugins.length) {
            log('No plugin found in ' + '/data/plugins');
            return [];
        }
        const req = [];
        for (const p of plugins) {
            log('Reading plugin from filesystem: ' + p);
            const key = this.getFolderName(p);
            const f = async () => {
                const [manifest, script] = await Promise.all([this.getManifest(`${p}/manifest.json`), this.getScript(`${p}/main.js`)]);
                return { ...manifest, script, enabled: false, key };
            };
            req.push(f());
        }
        const result: PluginManifest[] = await Promise.all(req);
        return result || [];
    }

    getFolderName(p) {
        const f = p.split('/');
        for (let i = f.length - 1; i >= 0; i--) {
            if (f[i]) {
                return f[i];
            }
        }
        return '';
    }
}
