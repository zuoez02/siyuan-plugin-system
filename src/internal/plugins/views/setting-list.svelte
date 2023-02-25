<script lang="ts">
    import { onMount } from "svelte";
    import { StorageManager } from "../../../plugin/storage-manager";
    import { container } from "../../../inversify";
    import { TYPES } from "../../../types";
    import { PluginSystem } from "../../../plugin";

    const storageManager = container.get<StorageManager>(TYPES.StorageManager);
    const pluginSystem = container.get<PluginSystem>(TYPES.PluginSystem);

    let plugins = [];

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

{#each plugins as plugin}
    {#if !plugin.hidden}
        <label class="fn__flex b3-label">
            <div class="fn__flex-1">
                {plugin.name}
                <div class="b3-label__text">{plugin.description || "无描述内容"}</div>
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
