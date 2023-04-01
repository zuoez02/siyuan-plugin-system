export * from './classes';
import { PluginManifest } from '@/types';
import { CommandPanelPlugin } from './plugins/command-panel';
import { InternalSettingPlugin } from './plugins/setting';

export const internalPlugins: PluginManifest[] = [
    { key: 'setting', name: 'setting', plugin: InternalSettingPlugin, enabled: true, hidden: true, version: '1.0.0' },
    { key: 'commandPanel', name: 'commandPanel', plugin: CommandPanelPlugin, enabled: true, hidden: true, version: '1.0.0' },
];
