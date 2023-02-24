import { PROCESS_ENV } from "../config";

const path = require('path');

export const log = (...p) => {
    console.log(`[Plugin System] `, ...p)
};

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
