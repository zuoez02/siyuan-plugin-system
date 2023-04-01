<script lang="ts">
    import { TYPES } from '@/config';
    import { container } from '@/container';
    import { Store } from '@/core/store';
    import Button from '@/internal/components/Button.svelte';
    import { StorePluginStatus } from '@/types';
    import { StorePluginManifest } from '@/types';
    import { _ } from '@/util';
    import { onMount } from 'svelte';
    import SettingPreview from './setting-preview.svelte';

    const store = container.get<Store>(TYPES.Store);
    let plugins: StorePluginStatus[] = [];
    let loading = true;

    const loadingMap = {};

    onMount(async () => {
        plugins = await store.loadPlugins();
        loading = false;
    });

    const downloadPlugin = async (key: string) => {
        if (loadingMap[key]) {
            return;
        }
        try {
            loadingMap[key] = true;
            await store.downloadPlugin(key);
            const p = plugins.find((k) => k.key === key);
            if (p) {
                p.isExist = true;
                p.needUpgrade = false;
            }
        } finally {
            loadingMap[key] = false;
        }
    };

    let selectedPlugin: StorePluginManifest = null;

    const previewPlugin = (event: MouseEvent, plugin: StorePluginManifest) => {
        selectedPlugin = plugin;
        event.stopPropagation();
        event.preventDefault();
    };
</script>

<div class="b3-label fn__flex">
    {#if loading}
        <div>{_('loading')}</div>
    {:else if !selectedPlugin}
        <div class="fn__flex-1">
            {#each plugins as plugin}
                <!-- svelte-ignore a11y-label-has-associated-control -->
                <label class="fn__flex b3-label">
                    <div class="fn__flex-1">
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <!-- svelte-ignore a11y-invalid-attribute -->
                        <a href="javascript:void(0)" class="" on:click={(event) => previewPlugin(event, plugin)}>{plugin.name}</a>
                        {plugin.version}
                        <div class="b3-label__text">
                            {plugin.description || ''}
                        </div>
                    </div>
                    <span class="fn__space" />
                    {#if loadingMap[plugin.key]}
                        <Button disabled={true}>{_('downloading')}</Button>
                    {:else if plugin.isExist}
                        {#if plugin.needUpgrade}
                            <Button onClick={() => downloadPlugin(plugin.key)}>{_('upgrade')}</Button>
                        {:else}
                            <Button disabled={true}>{_('downloaded')}</Button>
                        {/if}
                    {:else}
                        <Button onClick={() => downloadPlugin(plugin.key)}>{_('download')}</Button>
                    {/if}
                </label>
            {/each}
        </div>
    {:else}
        <SettingPreview on:goback={() => selectedPlugin = null } plugin={selectedPlugin}></SettingPreview>
    {/if}
</div>
