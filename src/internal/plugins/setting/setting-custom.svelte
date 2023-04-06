<script lang="ts">
    import { SettingRender } from '@/types';
    import { onMount } from 'svelte';

    let root: HTMLElement;

    export let render: SettingRender;

    $: {
        const el = document.getElementById('setting-custom-render');
        if (el) {
            if (root) {
                root.remove();
            }
            root = document.createElement('div');
            document.getElementById('setting-custom-render').appendChild(root);
            render(root);
        }
        
    }

    onMount(() => {
        root = document.createElement('div');
        document.getElementById('setting-custom-render').appendChild(root);
        render(root);
    });
    

</script>


<div id="setting-custom-render"></div>