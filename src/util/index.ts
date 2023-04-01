import { Notification } from '../internal/classes/notification';
import LoggerFactory, { LogLevelEnum } from 'zhi-log';
import { FileClient } from '@/api/file-api';

import zh_CN from '@/i18n/zh_CN.json';
import en_US from '@/i18n/en_US.json';

const factory = LoggerFactory.customLogFactory(LogLevelEnum.LOG_LEVEL_INFO, 'PluginSystem');
const pluginSystemLogger = factory.getLogger('plugin system');

export const log = (...p) => {
    pluginSystemLogger.info(...p);
};

export const sleep = async (t: number) => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(null), t);
    });
};

export const error = (...p) => pluginSystemLogger.error(...p);

export const reloadWindow = () => window.location.reload();

export const getCrossPlatformAppDataFolder = () => {
    const PROCESS_ENV = window.process?.env;
    let configFilePath;
    if (process.platform === 'darwin') {
        configFilePath = `${PROCESS_ENV.HOME}/Library/Application Support`;
    } else if (process.platform === 'win32') {
        // Roaming包含在APPDATA中了
        configFilePath = PROCESS_ENV.APPDATA;
    } else if (process.platform === 'linux') {
        configFilePath = PROCESS_ENV.HOME;
    }
    return configFilePath;
};

/**
 * genUUID  genernate UUID, copy from siyuan
 * @returns
 */
export const genUUID = () =>
    ([1e7].toString() + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
        (parseInt(c, 10) ^ (window.crypto.getRandomValues(new Uint32Array(1))[0] & (15 >> (parseInt(c, 10) / 4)))).toString(16)
    );

export function isDir(p: string) {
    throw new Error('can not get dir by path:' + p);
}

export async function isExists(p: string) {
    try {
        const res = await FileClient.getInstanceApi().fileApi.getFile(p);
        return res !== null;
    } catch {
        return false;
    }
}

export class Info {
    constructor(private message: string) {}
}
export class Error {
    constructor(private message: string) {}
}
export class Warning {
    constructor(private message: string) {}
}

export const showInfoMessage = (message: string, timeout?: number) => new Notification({ type: 'info', message, timeout }).show();
export const showErrorMessage = (message: string, timeout?: number) => new Notification({ type: 'error', message, timeout }).show();

export const getLogger = (name: string) => factory.getLogger(name);

const langs = {
    zh_CN,
    en_US,
};
const currentLang = window.siyuan.config.lang;

const lang = langs[currentLang] || en_US;

export const _ = (v: string): string => {
    return lang[v] || 'not defined';
};
