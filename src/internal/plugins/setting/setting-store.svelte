<script lang="ts">
    import { TYPES } from "@/config";
    import { container } from "@/container";
    import { Store } from "@/core/store";
    import { StorePluginStatus } from "@/types";
    import { onMount } from "svelte";

    const store = container.get<Store>(TYPES.Store);
    let plugins: StorePluginStatus[] = [];

    const loadingMap = {};

    onMount(() => {
        plugins = store.getPluginsWithStatus();
    });

    const downloadPlugin = async (key: string) => {
        if (loadingMap[key]) {
            return;
        }
        loadingMap[key] = true;
        await store.downloadPlugin(key);
        loadingMap[key] = false;
    };
</script>

<label class="b3-label fn__flex">
    <div class="fn__flex-1">
        {#each plugins as plugin}
            <label class="fn__flex b3-label">
                <div class="fn__flex-1">
                    {plugin.name} {plugin.version}
                    <div class="b3-label__text">
                        {plugin.description || "无描述内容"}
                    </div>
                </div>
                <span class="fn__space" />
                {#if plugin.isExist}
                    {#if plugin.needUpgrade}
                        <button>升级</button>
                    {:else}
                        <button disabled>已下载</button>
                    {/if}
                {:else}
                    <button on:click={() => downloadPlugin(plugin.key)}>下载</button>
                {/if}
            </label>
        {/each}
    </div>
</label>
