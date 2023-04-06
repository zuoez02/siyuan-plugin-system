import { injectable } from 'inversify';
import { ISettingManager, SettingRender } from '../types';

@injectable()
export class SettingManager implements ISettingManager {
    settingRenders: Map<string, SettingRender>;

    public constructor() {
        this.settingRenders = new Map();
    }

    registerSetting(pluginKey: string, settingRender: SettingRender) {
        this.settingRenders.set(pluginKey, settingRender);
    }

    unregisterSetting(key: string) {
        this.settingRenders.delete(key);
    }

    getSettingRenders() {
        const result: Array<{ key: string; value: SettingRender }> = [];
        this.settingRenders.forEach((value, key) => {
            result.push({ key, value });
        });
        return result;
    }
}
