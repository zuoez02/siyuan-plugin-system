export * from './classes';
import { PluginManifest } from '@/types';
import { InternalSettingPlugin } from './plugins/setting';

export const internalPlugins: PluginManifest[] = [
    { key: 'setting', name: '插件系统设置', plugin: InternalSettingPlugin, enabled: true, hidden: true, version: '1.0.0' },
    // { key: 'commandPanel', name: '控制面板', plugin: CommandPanelPlugin, enabled: true, },
];
