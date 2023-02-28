import { injectable } from 'inversify';
import { SIYUAN_DATA_PATH, PLUGIN_FOLDER } from '../config';
import { error, log } from "../util";

const fs = require('fs');
const path = require('path');

export const MANIFEST = 'manifest.json';

export const SCRIPT = 'main.js';

@injectable()
export class PluginFileManager {
    async scanPlugins(pluginFolder: string): Promise<string[]> {
        return new Promise((resolve, reject) => {
            fs.readdir(pluginFolder, (err, files) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(files.map((f) => path.resolve(pluginFolder, f)));
            })
        });
    }

    async getFileContent(f: string): Promise<string> {
        return new Promise((resolve, reject) => {
            fs.readFile(f, (err, data) => {
                if (err) {
                    reject(err);
                    return;
                }
                return resolve(data.toString('utf8'));
            });
        });
    }

    async getManifest(manifest: string) {
        const content = await this.getFileContent(manifest);
        try {
            return JSON.parse(content);
        } catch (e) {
            error('loading manifest: ' + manifest, e);
        }
    }

    async getScript(script: string) {
        return await this.getFileContent(script);
    }

    async getAllPlugins() {
        const plugins = await this.scanPlugins(path.join(SIYUAN_DATA_PATH, PLUGIN_FOLDER));
        if (!plugins || !plugins.length) {
            log("No plugin found in " + path.join(SIYUAN_DATA_PATH, PLUGIN_FOLDER));
            return;
        }
        const result: any[] = [];
        for (const p of plugins) {
            log('Loading plugin: ' + p);
            const [manifest, script] = await Promise.all([this.getManifest(path.join(p, MANIFEST)), this.getScript(path.join(p, SCRIPT))]);
            result.push({ ...manifest, script, enalbed: false, key: path.basename(p) });
        }
        return result;
    }
}