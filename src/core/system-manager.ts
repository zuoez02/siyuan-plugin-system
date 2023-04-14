import { PLUGIN_SYS_ABS_PATH, SCRIPT_URL, VERSION, VERSION_URL } from '../config';
import { TYPES } from '../config';
import { _, log, reloadWindow, showInfoMessage } from '../util';
import { inject, injectable } from 'inversify';
import { PLUGIN_SYSTEM_AUTO_UPDATE } from './plugin-config';
import { IStorageManager, ISystemManager } from '../types';
import { FileClient } from '@/api/file-api';
import { migrate } from '@/util/migrate';
import { serverApi } from '@/api';
import { SemVer } from 'semver';
import { Notification } from '@/internal/classes/notification';

const pluginScriptPosition = PLUGIN_SYS_ABS_PATH;

@injectable()
export class SystemManager implements ISystemManager {
    storageMangager: IStorageManager;

    constructor(@inject(TYPES.StorageManager) storageManager) {
        this.storageMangager = storageManager;
    }

    public async saveToLocal(p: string, content: string) {
        FileClient.getInstanceApi().fileApi.putFile(p, content);
    }

    async localCacheInit() {
        try {
            const plugin = FileClient.getInstanceApi().fileApi.getFile(pluginScriptPosition);
            if (plugin !== null) {
                this.delayAutoUpgrade();
            }
            return;
        } catch (e) {
            log('Plugin system not found');
        }
        const script = window.siyuanPluginScript;
        if (!script) {
            return;
        }
        await this.saveToLocal(pluginScriptPosition, script);
        this.delayAutoUpgrade();
    }

    delayAutoUpgrade() {
        return false;
        setTimeout(() => {
            const autoUpdate = this.storageMangager.get(PLUGIN_SYSTEM_AUTO_UPDATE);
            if (!autoUpdate) {
                log('Auto Update skipped');
            } else {
                this.tryUpgrade();
            }
        }, 1000);
    }

    async tryUpgrade() {
        if (window.pluginSystemSource === 'bazzar') {
            log('Plugin installed from bazzar version, upgrade skip');
            this.compareWidgetVersion();
            return;
        }
        log('Try getting online version');
        const onlineVersion = await this.getOnlineVersion();
        if (onlineVersion !== VERSION) {
            showInfoMessage(`插件系统获取到最新版本 ${onlineVersion}，即将自动更新`);
            log('Online Version: ' + onlineVersion + ', local version: ' + VERSION);
            log('Downloading new version of Plugin System');
            this.upgrade();
        } else {
            log('Version is ' + VERSION + ', OK');
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
        migrate();

        showInfoMessage('插件系统升级中，即将自动重载...');
        await this.saveToLocal(pluginScriptPosition, script);
        log('Plugin system upgraded, reloading...');
        setTimeout(() => reloadWindow(), 3000);
    }

    async compareWidgetVersion() {
        const res = await serverApi.getBazzarWidget();
        const packages = res.packages;
        const ps = packages.find((p) => p.name === '插件系统');
        if (!ps) {
            return;
        }
        const latestVersion = ps.version;
        const result = new SemVer(VERSION).compare(latestVersion);
        if (result < 0) {
            new Notification({ message: _('new_version_widget'), type: 'info' }).show();
        }
    }
}
