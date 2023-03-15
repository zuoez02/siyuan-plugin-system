import { PluginConfig } from "../types";

export const PLUGIN_SYSTEM_AUTO_UPDATE = 'PLUGIN_SYSTEM_AUTO_UPDATE';
export const PLUGIN_SYSTEM_PLUGIN = 'PLUGIN_SYSTEM_PLUGIN';
export const PLUGIN_SYSTEM_THIRD_PARTY_PLUGIN = 'PLUGIN_SYSTEM_THIRD_PARTY_PLUGIN';
export const PLUGIN_SYSTEM_SAFE_MODE_ENABLED = 'PLUGIN_SYSTEM_SAFE_MODE_ENABLED';
export const PLUGIN_STORE_URL = 'PLUGIN_STORE_URL';

export const defaultConfig: PluginConfig = {
    [PLUGIN_SYSTEM_SAFE_MODE_ENABLED]: true,
    [PLUGIN_SYSTEM_AUTO_UPDATE]: true,
    [PLUGIN_SYSTEM_PLUGIN]: [{ key: 'setting', enabled: true }],
    [PLUGIN_SYSTEM_THIRD_PARTY_PLUGIN]: [],
    [PLUGIN_STORE_URL]: 'https://bitbucket.org/siyuan-plugin/siyuan-plugins/raw/main/',
}
