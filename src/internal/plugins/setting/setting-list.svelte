<script lang="ts">
    import { onMount } from 'svelte';
    import { container } from '@/container';
    import { TYPES } from '@/config';
    import { IPluginSystem, IStorageManager, PluginManifest } from '@/types';
    import { PLUGIN_SYSTEM_SAFE_MODE_ENABLED } from '@/core/plugin-config';
    import { _ } from '@/util';

    const storageManager = container.get<IStorageManager>(TYPES.StorageManager);
    const pluginSystem = container.get<IPluginSystem>(TYPES.PluginSystem);

    let plugins: PluginManifest[] = [];

    $: outsidePlugins = plugins.filter((p) => p.script);

    const loadPlugins = () => {
        plugins = storageManager.getPlugins();
    };

    const onPluginEnabledChange = (key: string) => async (event) => {
        const safeMode = storageManager.get(PLUGIN_SYSTEM_SAFE_MODE_ENABLED);
        const checked = event.target.checked;
        await storageManager.setPluginEnabled(key, checked);
        if (safeMode) {
            return;
        }
        if (checked) {
            pluginSystem.loadPlugin(key);
        } else {
            pluginSystem.unloadPlugin(key);
        }
    };

    const uninstall = async (key: string, event: MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        await pluginSystem.unloadPlugin(key);
        await storageManager.uninstallPlugin(key);
        await storageManager.initStorage();
        loadPlugins();
    };

    onMount(async () => {
        await storageManager.initStorage();
        loadPlugins();
    });
</script>

<label class="b3-label fn__flex">
    <div class="fn__flex-1">
        {#each outsidePlugins as plugin}
            {#if !plugin.hidden}
                <label class="fn__flex b3-label">
                    <div class="plugin fn__flex-1">
                        {plugin.name}
                        {plugin.version}
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <span class="remove" on:click={(event) => uninstall(plugin.key, event)}>{_('uninstall')}</span>
                        <div class="b3-label__text">
                            {plugin.description || _('nodescription')}
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

<style>
    .plugin span.remove {
        display: none;
        color: var(--b3-theme-error);
        margin-left: 4px;
    }
    .plugin:hover span.remove {
        display: inline;
        cursor: pointer;
    }
    .plugin:hover span.remove:hover {
        text-decoration: underline;
    }
</style>
