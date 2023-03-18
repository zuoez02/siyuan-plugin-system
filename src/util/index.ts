import { Notification } from "@/internal/classes/notification";
import type { Stats } from "fs";
import { PROCESS_ENV } from "../config";

const path = require('path');
const fs = require('fs');

export const log = (...p) => {
    console.log(`[Plugin System] `, ...p)
};

export const sleep = async (t: number) => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(null), t);
    })
}

export const error = (...p) => console.error(`[Plugin System] `, ...p);

export const reloadWindow = () => window.location.reload();

export const getCrossPlatformAppDataFolder = () => {
    let configFilePath
    if (process.platform === "darwin") {
        configFilePath = path.join(
            PROCESS_ENV.HOME,
            "/Library/Application Support"
        )
    } else if (process.platform === "win32") {
        // Roaming包含在APPDATA中了
        configFilePath = PROCESS_ENV.APPDATA
    } else if (process.platform === "linux") {
        configFilePath = PROCESS_ENV.HOME
    }
    return configFilePath
};

/**
 * genUUID  genernate UUID, copy from siyuan
 * @returns 
 */
export const genUUID = () => ([1e7].toString() + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (parseInt(c, 10) ^ (window.crypto.getRandomValues(new Uint32Array(1))[0] & (15 >> (parseInt(c, 10) / 4)))).toString(16)
);

export function isDir(p: string) {
    return fs.statSync(p).isDirectory();
}

export function isExists(p: string) {
    try {
        fs.statSync(p) as Stats;
        return true;
    } catch (e) {
        return false;
    }
}

abstract class Info {
    info: string;
    constructor(info: string) {
        this.info = info;
    }
}

export class Warning extends Info {}
export class Error extends Info {}

export const showInfoMessage = (message: string, timeout?: number) => new Notification({ type: 'info', message, timeout }).show();
export const showErrorMessage = (message: string, timeout?: number) => new Notification({ type: 'error', message, timeout }).show();