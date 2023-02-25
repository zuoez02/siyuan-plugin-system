<script lang="ts">
    import SettingCommon from "./setting-common.svelte";
</script>

<main>
    <div
        class="fn__flex-column"
        style="border-radius: 4px;overflow: hidden;position: relative"
    >
        <div class="fn__flex-1 fn__flex config__panel">
            <ul
                class="b3-tab-bar b3-list b3-list--background"
                style="height: unset !important;"
            >
                <li
                    data-name="editor"
                    class="b3-list-item--focus b3-list-item b3-list-item--big"
                >
                    <svg class="b3-list-item__graphic"
                        ><use xlink:href="#iconEdit" /></svg
                    ><span class="b3-list-item__text"
                        >通用配置</span
                    >
                </li>
            </ul>
            <div
                class="b3-tab-container"
                style="height: unset !important;"
                data-name="setting"
            >
                <SettingCommon />
            </div>
        </div>
    </div>
</main>
