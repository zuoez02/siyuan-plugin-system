import { PluginSystem } from './plugin';

if (!window.pluginSystem) {
    console.log('Siyuan Plugin System loading...');
    window.pluginSystem = new PluginSystem().init();
}
