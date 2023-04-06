<script lang="ts">
    import { _ } from '@/util';
    import SettingCommon from './setting-common.svelte';
    import SettingList from './setting-list.svelte';
    import SettingStore from './setting-store.svelte';
    import { container } from '@/container';
    import { TYPES } from '@/config';
    import { ISettingManager, IStorageManager, SettingRender } from '@/types';
    import SettingCustom from './setting-custom.svelte';

    type Menu = { key: string; name: string; type: 'internal' | 'custom'; component?: any; render?: SettingRender; };

    const menus: Menu[] = [
        {
            key: 'common',
            name: _('menu_common'),
            type: 'internal',
            component: SettingCommon,
        },
        {
            key: 'list',
            name: _('menu_list'),
            type: 'internal',
            component: SettingList,
        },
        {
            key: 'store',
            name: _('menu_store'),
            type: 'internal',
            component: SettingStore,
        },
    ];

    const sm = container.get<ISettingManager>(TYPES.SettingManager);
    const sm1 = container.get<IStorageManager>(TYPES.StorageManager);
    const plugins = sm1.getThirdPartyPlugins();
    let settingRenders = sm.getSettingRenders();
    const getName = (key: string) => plugins.find((p) => p.key === key)?.name;
    
    $: thirdMenus = settingRenders.map((s) => {
        return {
            key: s.key,
            name: getName(s.key),
            component: SettingCommon,
            type: 'custom',
            render: s.value,
        };
    });

    const setCurrentSelection = (menu) => (currentSelection = menu);
    const updateMenus = () => {
        settingRenders = [...sm.getSettingRenders()];
    };
    let currentSelection = menus[0];
</script>

<div class="fn__flex-column" style="border-radius: 4px;overflow: auto;position: relative; height: 80vh">
    <div class="fn__flex-1 fn__flex config__panel">
        <ul class="b3-tab-bar b3-list b3-list--background" style="height: unset !important;">
            {#each menus as menu}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <li
                    data-name={menu.key}
                    class={currentSelection.key === menu.key
                        ? 'b3-list-item--focus b3-list-item b3-list-item--big'
                        : 'b3-list-item b3-list-item--big'} 
                    on:click={() => setCurrentSelection(menu)}
                >
                    <span class="b3-list-item__text">{menu.name}</span>
                </li>
            {/each}
            {#if thirdMenus.length > 0}
                <hr style="margin: 12px;">
            {/if}
            {#each thirdMenus as menu}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <li
                    data-name={menu.key}
                    class={currentSelection.key === menu.key
                        ? 'b3-list-item--focus b3-list-item b3-list-item--big'
                        : 'b3-list-item b3-list-item--big'} 
                    on:click={() => setCurrentSelection(menu)}
                >
                    <span class="b3-list-item__text">{menu.name}</span>
                </li>
            {/each}
        </ul>
        <div class="config__tab-container" style="height: unset !important;" data-name={currentSelection.key}>
            {#if currentSelection.type === 'internal'}
                <svelte:component this={currentSelection.component} on:update={() => updateMenus()} />
            {:else}
                <SettingCustom render={currentSelection.render} />
            {/if}
        </div>
    </div>
</div>
