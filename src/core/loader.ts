import { Plugin } from "../api/plugin";
import api from "../api";
import { IPluginCommand, ICommandManager, IPlugin, IPluginFileManager, IPluginLoader, PluginManifest } from "../types";
import { internalPlugins } from "../internal";
import { log } from "../util";
import { inject, injectable } from "inversify";
import { TYPES } from "../config";
import { container } from "@/container";

let components: { [key: string]: any };

@injectable()
export class PluginLoader implements IPluginLoader {

    pluginFileManager: IPluginFileManager;

    loadedPlugins: Map<string, IPlugin>;

    constructor(@inject(TYPES.PluginFileManager) pluginFileManager) {
        this.pluginFileManager = pluginFileManager;
        this.loadedPlugins = new Map();
    }

    async loadEnabledPlugins(plugins: PluginManifest[]) {
        if (!plugins || !plugins.length) {
            return;
        }
        for (const p of plugins) {
            if (!p.enabled) {
                continue;
            }
            await this.loadPlugin(p);
        };
    }

    async loadAllInternalPlugins() {
        internalPlugins.forEach((p) => {
            const plug = new p.plugin();
            if (!(plug instanceof Plugin)) {
                throw new Error(`Failed to load plugin ${p.name}`);
            }
            log(`Load internal plugin: ${p.key}(${p.name})`);
            plug.registerCommand = (command: IPluginCommand) => {
                const cm = container.get<ICommandManager>(TYPES.CommandManager);
                cm.registerCommand({
                    ...command,
                    plugin: p.key,
                    pluginName: p.name,
                });
            }
            plug.onload();
            this.loadedPlugins.set(p.key, plug);
        })
    }

    async loadAllLocalPlugins() {
        const plugins = await this.pluginFileManager.getAllPlugins();
        if (!plugins) {
            return;
        }
        for (const p of plugins) {
            await this.loadPlugin(p);
        }
    }

    async loadPlugin(plugin: PluginManifest) {
        if (!components) {
            this.generateRequiredModules();
        }
        if (!plugin.enabled || (!plugin.plugin && !plugin.script)) {
            return;
        }
        if (plugin.plugin) {
            // internal plugin
            const plug = new plugin.plugin();
            if (!(plug instanceof Plugin)) {
                throw new Error(`Failed to load plugin ${plugin.name}`);
            }
            log(`Load internal plugin: ${plugin.key}(${plugin.name})`);
            plug.registerCommand = (command: IPluginCommand) => {
                const cm = container.get<ICommandManager>(TYPES.CommandManager);
                cm.registerCommand({
                    ...command,
                    plugin: plugin.key,
                    pluginName: plugin.name,
                });
            }
            await plug.onload();
            this.loadedPlugins.set(plugin.key, plug);
            return;
        }
        const exports: { [key: string]: any } = {};
        const module = { exports };
        function run(script: string, name: string) {
            return eval("(function anonymous(require,module,exports){".concat(script, "\n})\n//# sourceURL=").concat(name, "\n"));
        }
        const __require = (name: string) => {
            if (components[name]) {
                return components[name];
            }
            throw new Error(`module ${name} not found`);
        };
        const pluginName = plugin.key;
        run(plugin.script, plugin.key)(__require, module, exports);
        let pluginConstructor;
        if (!(pluginConstructor = (module.exports || exports).default || module.exports)) {
            throw new Error(`Failed to load plugin ${pluginName}. No exports detected.`);
        }
        const plug = new pluginConstructor();
        if (!(plug instanceof Plugin)) {
            throw new Error(`Failed to load plugin ${pluginName}`);
        }
        plug.registerCommand = (command: IPluginCommand) => {
            const cm = container.get<ICommandManager>(TYPES.CommandManager);
            cm.registerCommand({
                ...command,
                plugin: plugin.key,
                pluginName,
            });
        }
        await plug.onload();
        this.loadedPlugins.set(plugin.key, plug);
    }

    async unloadPlugin(key: string) {
        const plugin = this.loadedPlugins.get(key);
        if (!plugin) {
            return;
        }
        await plugin.onunload();
        container.get<ICommandManager>(TYPES.CommandManager).unregisterCommandByPlugin(key);
        this.loadedPlugins.delete(key);
    }

    async unloadThirdPartyPlugins(plugins: PluginManifest[]) {
        const keys = plugins.filter((p) => p.enabled).map(p => p.key);
        for (const k of keys) {
            log(`unload third party plugin: ${k}`);
            await this.unloadPlugin(k);
        }
    }

    async loadThirdPartyEnabledPlugins(plugins: PluginManifest[]) {
        return this.loadEnabledPlugins(plugins);
    }

    generateRequiredModules() {
        components = {
            "siyuan": api,
        };
    }
}