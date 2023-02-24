import { PLUGIN_SYS_ABS_PATH, SCRIPT_URL, VERSION, VERSION_URL } from "../config";
import { log, reloadWindow } from "../util";

const fs = require('fs');
const path = require('path');

const pluginScriptPosition = PLUGIN_SYS_ABS_PATH;

export class PluginSystemLocalManager {
    saveToLocal(p: string, content: string) {
        return new Promise((resolve, reject) => {
            const { writeFile } = fs;
            const { Buffer } = require('buffer');
            const data = new Uint8Array(Buffer.from(content));
            writeFile(p, data, (err) => {
                if (err) return reject(err);
                resolve('The file has been saved!');
            });
        })

    }

    createFile(p: string) {
        return new Promise((resolve, reject) => {
            fs.mkdir(path.dirname(p),
                { recursive: true }, (err) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve('Directory created successfully!');
                });
        })
    }

    async localCacheInit() {
       

        try {
            fs.statSync(pluginScriptPosition)
            setTimeout(() => {
                this.tryUpgrade();
            }, 1000);
            return;
        } catch (e) {
            log('Plugin system not found');
        }
        const script = window.siyuanPluginScript;
        if (!script) {
            return;
        }
        await this.createFile(pluginScriptPosition);
        await this.saveToLocal(pluginScriptPosition, script);
        setTimeout(() => {
            this.tryUpgrade();
        }, 1000);
    }

    async tryUpgrade() {
        log('Try getting online version');
        const onlineVersion = await this.getOnlineVersion()
        if (onlineVersion !== VERSION) {
            log('Online Version: ' + onlineVersion + ', local version: ' + VERSION);
            log('Downloading new version of Plugin System')
            this.upgrade();
        } else {
            log('Version is ' + VERSION + ', OK')
        }
    }

    async getOnlineVersion() {
        return fetch(VERSION_URL, { cache: 'no-cache' }).then((res) => res.text());
    }

    async upgrade() {
        const script = await fetch(SCRIPT_URL, { cache: 'no-cache' }).then((res) => res.text());
        if (!script) {
            return;
        }
        await this.createFile(pluginScriptPosition);
        await this.saveToLocal(pluginScriptPosition, script);
        log('Plugin system upgraded, reloading...');
        setTimeout(() => reloadWindow(), 3000);
    }
}