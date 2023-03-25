<script lang="ts">
    import { onMount } from 'svelte';
    import { defaultConfig, PLUGIN_STORE_URL, PLUGIN_SYSTEM_AUTO_UPDATE, PLUGIN_SYSTEM_SAFE_MODE_ENABLED } from '@/core/plugin-config';
    import { container } from '@/container';
    import { TYPES } from '@/config';
    import { IPluginSystem, IStorageManager } from '@/types';

    const storageManager = container.get<IStorageManager>(TYPES.StorageManager);
    const pluginSystem = container.get<IPluginSystem>(TYPES.PluginSystem);

    let configs = [
        {
            label: '安全模式',
            tip: '关闭安全模式允许第三方插件加载',
            checked: true,
            type: 'checkbox',
            onChange: (event) => {
                const checked = event.target.checked;
                if (checked) {
                    pluginSystem.turnOnSafeMode();
                } else {
                    pluginSystem.turnOffSafeMode();
                }
            },
        },
        {
            label: '自动更新',
            tip: '从固定位置获取版本并更新本地存储的插件系统脚本',
            checked: true,
            type: 'checkbox',
            onChange: (event) => {
                storageManager.set(PLUGIN_SYSTEM_AUTO_UPDATE, event.target.checked);
            },
        },
        {
            label: '插件商店地址',
            tip: `线上插件系统仓库地址, 默认为 ${defaultConfig.PLUGIN_STORE_URL}`,
            type: 'input',
            value: storageManager.get(PLUGIN_STORE_URL),
            onChange: (event) => {
                storageManager.set(PLUGIN_STORE_URL, event.target.value);
            },
        },
    ];

    onMount(() => {
        const securityMode = storageManager.get(PLUGIN_SYSTEM_SAFE_MODE_ENABLED);
        configs[0].checked = securityMode;
        const autoUpdate = storageManager.get(PLUGIN_SYSTEM_AUTO_UPDATE);
        configs[1].checked = autoUpdate;
    });
</script>

{#each configs as config}
    <label class="fn__flex b3-label config__item">
        <div class="fn__flex-1">
            {config.label}
            <div class="b3-label__text">{config.tip}</div>
        </div>
        <span class="fn__space" />
        {#if config.type === 'checkbox'}
            <input class="b3-switch fn__flex-center" type="checkbox" bind:checked={config.checked} on:change={config.onChange} />
        {:else if config.type === 'input'}
            <input class="b3-text-field fn__flex-center fn__size200" type="input" bind:value={config.value} on:change={config.onChange} />
        {/if}
    </label>
{/each}
