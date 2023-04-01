<script lang="ts">
    import { container } from '@/container';
    import { IStore, PluginManifest } from '@/types';
    import { _ } from '@/util';
    import { onMount } from 'svelte';
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    let loading = true;

    export let plugin: PluginManifest;

    const getPluginReadme = async () => {
        readme = await container.get<IStore>('Store').getPluginReadme(plugin.key);
        loading = false;
    };

    let readme: string;

    const LuteMdConverter = window.Lute.New();

    $: previewHTML = () => {
        return readme ? LuteMdConverter.Md2HTML(readme) : '';
    };

    onMount(() => {
        getPluginReadme();
    });

    const goBack = () => {
        dispatch('goback');
    };
</script>

<div class="plugin-detail">
    <div class="plugin-basic">
        <div class="plugin-info">
            <div class="plugin-name">{plugin.name}</div>
            <div class="plugin-key">({plugin.key})</div>
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-missing-attribute -->
            <button class="go-back b3-button" on:click={() => goBack()}><svg class="go-back-icon"><use xlink:href="#iconBack" /></svg>{_('goBack')}</button>
        </div>
 
        <div class="plugin-manifest">
            {#if plugin.url}<div class="plugin-item">{_('url')}: <a href={plugin.url} target="_blank" rel="noreferrer">{plugin.url}</a></div> {/if}
            {#if plugin.author}<div class="plugin-item">{_('author')}: {plugin.author}</div> {/if}
            {#if plugin.version}<div class="plugin-item">{_('version')}: {plugin.version}</div> {/if}
            {#if plugin.description}<div class="plugin-item">{_('description')}: {plugin.description}</div> {/if}
        </div>
    </div>
    <hr/>
    <div class="plugin-readme b3-typography">
        {#if loading}
            <span>{_('readme')}</span>
        {:else}
            {@html previewHTML()}
        {/if}
    </div>
</div>

<style>
    .plugin-info {
        display: flex;
        align-items: center;
    }
    .plugin-detail {
        margin-top: 12px;
        width: 100%;
    }
    .plugin-name {
        display: inline;
        margin-right: 6px;
        font-size: 24px;
    }
    .plugin-key {
        display: inline;
        font-size: 16px;
    }
    .plugin-manifest {
        margin-top: 12px;
    }
    .plugin-readme {
        margin-top: 20px;
    }
    .go-back {
        margin-left: 12px;
        font-size: 12px;
        height: 24px;
    }
    .go-back-icon {
        height: 12px;
        width: 12px;
        margin-right: 4px;
    }
</style>
