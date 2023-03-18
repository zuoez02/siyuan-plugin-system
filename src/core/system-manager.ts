import { PLUGIN_SYS_ABS_PATH, SCRIPT_URL, VERSION, VERSION_URL } from "../config";
import { TYPES } from "../config";
import { log, reloadWindow, showInfoMessage } from "../util";
import { inject, injectable } from "inversify";
import { PLUGIN_SYSTEM_AUTO_UPDATE } from "./plugin-config";
import { IStorageManager, ISystemManager } from "../types";

const fs = require('fs');
const path = require('path');

const pluginScriptPosition = PLUGIN_SYS_ABS_PATH;

@injectable()
export class SystemManager implements ISystemManager {
    storageMangager: IStorageManager;

    constructor(@inject(TYPES.StorageManager) storageManager) {
        this.storageMangager = storageManager;
    }

    public async saveToLocal(p: string, content: string) {
        return new Promise<void>((resolve, reject) => {
            const { writeFile } = fs;
            const { Buffer } = require('buffer');
            const data = new Uint8Array(Buffer.from(content));
            writeFile(p, data, (err) => {
                if (err) return reject(err);
                resolve();
            });
        })

    }

    createFile(p: string) {
        return new Promise<string>((resolve, reject) => {
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
            this.delayAutoUpgrade();
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
        this.delayAutoUpgrade();
    }

    delayAutoUpgrade() {
        setTimeout(() => {
            const autoUpdate = this.storageMangager.get(PLUGIN_SYSTEM_AUTO_UPDATE);
            if (!autoUpdate) {
                log('Auto Update skipped')
            } else {
                this.tryUpgrade();
            }
        }, 1000);
    }

    async tryUpgrade() {
        log('Try getting online version');
        const onlineVersion = await this.getOnlineVersion()
        if (onlineVersion !== VERSION) {
            showInfoMessage(`插件系统获取到最新版本 ${onlineVersion}，即将自动更新`);
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
        showInfoMessage('插件系统升级中，即将自动重载...');
        await this.createFile(pluginScriptPosition);
        await this.saveToLocal(pluginScriptPosition, script);
        log('Plugin system upgraded, reloading...');
        setTimeout(() => reloadWindow(), 3000);
    }
}