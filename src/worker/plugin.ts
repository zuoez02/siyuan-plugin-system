import { SIYUAN_DATA_PATH, PLUGIN_FOLDER } from '../config';
import { error, log } from "../util";

const fs = window.require('fs');
const path = window.require('path');

export const MANIFEST = 'manifest.json';

export const SCRIPT = 'main.js';

export const scanPlugins: (f: string) => Promise<string[]> = async (pluginFolder: string) => {
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

export const getFileContent: (f: string) => Promise<string> = async (f: string) => {
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

export const getManifest = async (manifest: string) => {
    const content = await getFileContent(manifest);
    try {
        return JSON.parse(content);
    } catch (e) {
        error('loading manifest: ' + manifest, e);
    }
}

export const getScript = async (script: string) => {
    return await getFileContent(script);
}

export const getAllPlugins = async () => {
    const plugins = await scanPlugins(path.join(SIYUAN_DATA_PATH, PLUGIN_FOLDER));
    if (!plugins || !plugins.length) {
        log("No plugin found in " + path.join(SIYUAN_DATA_PATH, PLUGIN_FOLDER));
        return;
    }
    const result: any[] = [];
    for (const p of plugins) {
        log('Loading plugin: ' + p);
        const [manifest, script] = await Promise.all([getManifest(path.join(p, MANIFEST)),getScript(path.join(p, SCRIPT))]);
        result.push({ ...manifest, script });
    }
    return result;
}