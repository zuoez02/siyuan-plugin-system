import { Stats } from 'fs';
import { injectable } from 'inversify';
import { SIYUAN_DATA_PATH, PLUGIN_FOLDER } from '../config';
import { PluginManifest } from '../types';
import { error, isDir, isExists, log } from "../util";

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
                    resolve([]);
                    return;
                }
                resolve(files.filter((f) => {
                    return isDir(path.join(pluginFolder, f)) && isExists(path.join(pluginFolder, f, MANIFEST)) && isExists(path.join(pluginFolder, f, SCRIPT));
                })?.map((g) => path.resolve(pluginFolder, g)) || []);
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
            return null;
        }
    }

    async getScript(script: string) {
        return await this.getFileContent(script);
    }

    async getAllPlugins(): Promise<PluginManifest[]> {
        const plugins = await this.scanPlugins(path.join(SIYUAN_DATA_PATH, PLUGIN_FOLDER));
        if (!plugins || !plugins.length) {
            log("No plugin found in " + path.join(SIYUAN_DATA_PATH, PLUGIN_FOLDER));
            return [];
        }
        const result: PluginManifest[] = [];
        for (const p of plugins) {
            log('Reading plugin from filesystem: ' + p);
            const [manifest, script] = await Promise.all([this.getManifest(path.join(p, MANIFEST)), this.getScript(path.join(p, SCRIPT))]);
            result.push({ ...manifest, script, enabled: false, key: path.basename(p) });
        }
        return result || [];
    }
}