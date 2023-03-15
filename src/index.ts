import "reflect-metadata";

import { VERSION } from './config';
import { log } from './util';
import { container } from './container';
import { TYPES } from './config';
import { IPluginSystem, IStorageManager } from './types';

(async () => {
    if (!window.pluginSystem) {
        log('Siyuan Plugin System loading...');
        window.pluginSystemVersion = VERSION;
        const storageManager = container.get<IStorageManager>(TYPES.StorageManager);
        await storageManager.initStorage();
        
        window.pluginSystem = container.get<IPluginSystem>(TYPES.PluginSystem).init();
        window.pluginSystemIocContainer = container;
    }
    
})();
