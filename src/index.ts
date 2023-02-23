import { VERSION } from './config';
import { PluginSystem } from './plugin';
import { log } from './util';
import { PluginSystemLocalManager } from './worker/local';

if (!window.pluginSystem) {
    log('Siyuan Plugin System loading...');
    window.pluginSystemVersion = VERSION;
    window.pluginSystem = new PluginSystem().init();
    // save plugin loader to storage
    new PluginSystemLocalManager().localCacheInit();
}
