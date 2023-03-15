import "reflect-metadata";

import { VERSION } from './config';
import { log } from './util';
import { container } from './container';
import { TYPES } from './config';
import { IPluginSystem, IStorageManager } from './types';


if (!window.pluginSystem) {
    log('Siyuan Plugin System loading...');
    window.pluginSystemVersion = VERSION;
    window.pluginSystem = container.get<IPluginSystem>(TYPES.PluginSystem).init();
    window.pluginSystemIocContainer = container;
}
