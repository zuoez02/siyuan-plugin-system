import { Plugin } from "./plugin";
import { apiGenerate } from "./api";
import { modules } from "./module";
import { getAllPlugins } from "../worker/plugin";
import { IPlugin } from "../type";

let components: { [key: string]: any };

export class PluginLoader {
    plugins: Map<string, Plugin>;

    constructor() {
        this.plugins = new Map();
    }

    async loadAllLocalPlugins() {
        const plugins = await getAllPlugins();
        if (!plugins) {
            return;
        }
        for (const p of plugins) {
            await this.loadPlugin(p);
        }
        plugins?.forEach(await this.loadPlugin);
    }

    async loadPlugin(plugin: IPlugin) {
        if (!components) {
            this.generateRequiredModules();
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
        const pluginName = plugin.name;
        run(plugin.script, plugin.name)(__require, module, exports);
        let pluginConstructor;
        if (!(pluginConstructor = (module.exports || exports).default || module.exports)) {
            throw new Error(`Failed to load plugin ${pluginName}. No exports detected.`);
        }
        const plug = new pluginConstructor();
        if (!(plug instanceof Plugin)) {
            throw new Error(`Failed to load plugin ${pluginName}`);
        }

        plug.onload();
        this.plugins.set(pluginName, plug);
    }

    async unloadPlugin(pluginName: string) {
        const plugin = this.plugins.get(pluginName);
        if (!plugin) {
            return;
        }
        await plugin.onunload();
        this.plugins.delete(pluginName);
    }

    generateRequiredModules() {
        components = {
            "siyuan": {
                ...modules,
                ...apiGenerate(),
            }
        };
    }
}