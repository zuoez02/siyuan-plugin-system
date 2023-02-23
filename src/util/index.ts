const path = window.require('path');

export const log = (...p) => {
    console.log(`[Plugin System] `, ...p)
};

export const error = (...p) => console.error(`[Plugin System] `, ...p);

export const reloadWindow = () => window.location.reload();

export const getCrossPlatformAppDataFolder = () => {
    let configFilePath
    if (process.platform === "darwin") {
        configFilePath = path.join(
            window.process.env.HOME,
            "/Library/Application Support"
        )
    } else if (process.platform === "win32") {
        // Roaming包含在APPDATA中了
        configFilePath = window.process.env.APPDATA
    } else if (process.platform === "linux") {
        configFilePath = window.process.env.HOME
    }
    return configFilePath
};
