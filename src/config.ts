export const PLUGIN_FOLDER = 'plugins';

export const VERSION = '__VERSION__';

export const VERSION_URL = 'https://gitee.com/zuoez02/siyuan-plugin-system/raw/main/VERSION';

export const SCRIPT_URL = 'https://gitee.com/zuoez02/siyuan-plugin-system/raw/main/main.js';

export const PLUGIN_SYS_ABS_PATH = '/data/widgets/插件系统/plugin.js';

export const config = () => ({ token: window.siyuan.config.api.token });

export const TYPES = {
    StorageManager: 'StorageManager',
    PluginSystem: 'PluginSystem',
    SystemManager: 'PluginSystemLocalManager',
    PluginLoader: 'PluginLoader',
    PluginFileManager: 'PluginFileManager',
    EventBus: 'EventBus',
    Shortcut: 'Shortcut',
    CommandManager: 'CommandManager',
    Store: 'Store',
    SettingManager: 'SettingManager',
};
