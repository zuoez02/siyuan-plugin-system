<script lang="ts">
  import { onMount } from "svelte";
  import { StorageManager } from "../../../plugin/storage-manager";
  import { PLUGIN_SYSTEM_AUTO_UPDATE } from "../../../plugin/plugin-config";
  import { container } from "../../../inversify";
  import { TYPES } from "../../../config";

  const storageManager = container.get<StorageManager>(TYPES.StorageManager);

  let configs = [
    {
      label: "自动更新",
      tip: "从固定位置获取版本并更新本地存储的插件系统脚本",
      checked: true,
      type: "chcekbox",
      onChange: (event) => {
        storageManager.set(PLUGIN_SYSTEM_AUTO_UPDATE, event.target.checked);
      },
    },
  ];

  onMount(() => {
    const autoUpdate = storageManager.get(PLUGIN_SYSTEM_AUTO_UPDATE);
    configs[0].checked = autoUpdate;
  });
</script>

{#each configs as config}
  <label class="fn__flex b3-label">
    <div class="fn__flex-1">
      {config.label}
      <div class="b3-label__text">{config.tip}</div>
    </div>
    <span class="fn__space" />
    <input
      class="b3-switch fn__flex-center"
      id="fullWidth"
      type="checkbox"
      bind:checked={config.checked}
      on:change={config.onChange}
    />
  </label>
{/each}
