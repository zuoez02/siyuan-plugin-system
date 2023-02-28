<script lang="ts">
    import { onMount } from "svelte";
    import { StorageManager } from "../../../plugin/storage-manager";
    import { container } from "../../../inversify";
    import { TYPES } from "../../../config";
    import { PluginSystem } from "../../../plugin";
    import { IPlugin } from "../../../type.d";

    const storageManager = container.get<StorageManager>(TYPES.StorageManager);
    const pluginSystem = container.get<PluginSystem>(TYPES.PluginSystem);

    let plugins: IPlugin[] = [];

    $: internalPlugins = plugins.filter((p) => p.plugin);
    $: outsidePlugins = plugins.filter((p) => p.script);

    const loadPlugins = () => {
        plugins = storageManager.getPlugins();
    };

    const onPluginEnabledChange = (key: string) => async (event) => {
        const checked = event.target.checked;
        await storageManager.setPluginEnabled(key, checked);
        if (checked) {
            pluginSystem.loadPlugin(key);
        } else {
            pluginSystem.unloadPlugin(key);
        }
    };

    onMount(() => {
        loadPlugins();
    });
</script>

<label class="b3-label fn__flex">
    <div class="fn__flex-1">
        内置插件
        {#each internalPlugins as plugin}
            {#if !plugin.hidden}
                <label class="fn__flex b3-label">
                    <div class="fn__flex-1">
                        {plugin.name}
                        <div class="b3-label__text">
                            {plugin.description || "无描述内容"}
                        </div>
                    </div>
                    <span class="fn__space" />
                    <input
                        class="b3-switch fn__flex-center"
                        id="fullWidth"
                        type="checkbox"
                        bind:checked={plugin.enabled}
                        on:change={onPluginEnabledChange(plugin.key)}
                    />
                </label>
            {/if}
        {/each}
    </div>
</label>

<label class="b3-label fn__flex">
    <div class="fn__flex-1">
        第三方插件
        {#each outsidePlugins as plugin}
            {#if !plugin.hidden}
                <label class="fn__flex b3-label">
                    <div class="fn__flex-1">
                        {plugin.name}
                        <div class="b3-label__text">
                            {plugin.description || "无描述内容"}
                        </div>
                    </div>
                    <span class="fn__space" />
                    <input
                        class="b3-switch fn__flex-center"
                        id="fullWidth"
                        type="checkbox"
                        bind:checked={plugin.enabled}
                        on:change={onPluginEnabledChange(plugin.key)}
                    />
                </label>
            {/if}
        {/each}
    </div>
</label>
