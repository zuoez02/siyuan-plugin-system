export * from './classes';
import { IPlugin } from '../type';
import InternalSettingPlugin from './plugins/setting';

export const internalPlugins: IPlugin[] = [
    { key: 'setting', name: '插件系统设置', plugin: InternalSettingPlugin, enabled: true, hidden: true },
];