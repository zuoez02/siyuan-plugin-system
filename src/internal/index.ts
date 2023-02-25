export * from './classes';
import InternalSettingPlugin from './plugins/setting';

export const internalPlugins = [
    { key: 'setting', name: '设置', plugin: InternalSettingPlugin },
];