import { VERSION } from './config';
import { PluginSystem } from './plugin';
import { log } from './util';

if (!window.pluginSystem) {
    log('Siyuan Plugin System loading...');
    window.pluginSystemVersion = VERSION;
    window.pluginSystem = new PluginSystem().init();
}
