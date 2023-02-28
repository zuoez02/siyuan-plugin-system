export * from './classes';
import { PluginManifest } from '../types';
import { InternalSettingPlugin } from './plugins/views/setting';

export const internalPlugins: PluginManifest[] = [
    { key: 'setting', name: '插件系统设置', plugin: InternalSettingPlugin, enabled: true, hidden: true },
];