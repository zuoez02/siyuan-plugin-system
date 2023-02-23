import { PluginSystem } from './plugin';
import { localCacheInit } from './worker/local';

if (!window.pluginSystem) {
    console.log('Siyuan Plugin System loading...');
    window.pluginSystem = new PluginSystem().init();
    // save plugin loader to storage
    localCacheInit();
}
