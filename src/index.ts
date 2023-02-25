import { VERSION } from './config';
import { PluginSystem } from './plugin';
import { log } from './util';
import { container } from './inversify';
import { TYPES } from './types';

if (!window.pluginSystem) {
    log('Siyuan Plugin System loading...');
    window.pluginSystemVersion = VERSION;
    window.pluginSystem = container.get<PluginSystem>(TYPES.PluginSystem).init();
}
