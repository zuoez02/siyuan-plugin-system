<script lang="ts">
    import { _ } from '@/util';
    import SettingCommon from './setting-common.svelte';
    import SettingList from './setting-list.svelte';
    import SettingStore from './setting-store.svelte';
    const menus = [
        {
            key: 'common',
            name: _('menu_common'),
            icon: '#iconSettings',
            component: SettingCommon,
        },
        {
            key: 'list',
            name: _('menu_list'),
            icon: '#iconSettings',
            component: SettingList,
        },
        {
            key: 'store',
            name: _('menu_store'),
            icon: '#iconSettings',
            component: SettingStore,
        },
    ];

    const setCurrentSelection = (menu) => (currentSelection = menu);

    let currentSelection = menus[0];
</script>

<div class="fn__flex-column" style="border-radius: 4px;overflow: auto;position: relative; height: 50vh">
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
                    <svg class="b3-list-item__graphic"><use xlink:href={menu.icon} /></svg><span class="b3-list-item__text">{menu.name}</span>
                </li>
            {/each}
        </ul>
        <div class="config__tab-container" style="height: unset !important;" data-name={currentSelection.key}>
            <svelte:component this={currentSelection.component} />
        </div>
    </div>
</div>
