<script lang="ts">
    import { TYPES } from '@/config';
    import { container } from '@/container';
    import { Store } from '@/core/store';
    import Button from '@/internal/components/Button.svelte';
    import { StorePluginStatus } from '@/types';
    import { onMount } from 'svelte';

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
</script>

<div class="b3-label fn__flex">
    {#if loading}
        <div>加载中，请稍候</div>
    {:else}
        <div class="fn__flex-1">
            {#each plugins as plugin}
                <!-- svelte-ignore a11y-label-has-associated-control -->
                <label class="fn__flex b3-label">
                    <div class="fn__flex-1">
                        {plugin.name}
                        {plugin.version}
                        <div class="b3-label__text">
                            {plugin.description || '无描述内容'}
                        </div>
                    </div>
                    <span class="fn__space" />
                    {#if loadingMap[plugin.key]}
                        <Button disabled={true}>下载中...</Button>
                    {:else if plugin.isExist}
                        {#if plugin.needUpgrade}
                            <Button onClick={() => downloadPlugin(plugin.key)}>升级</Button>
                        {:else}
                            <Button disabled={true}>已下载</Button>
                        {/if}
                    {:else}
                        <Button onClick={() => downloadPlugin(plugin.key)}>下载</Button>
                    {/if}
                </label>
            {/each}
        </div>
    {/if}
</div>
