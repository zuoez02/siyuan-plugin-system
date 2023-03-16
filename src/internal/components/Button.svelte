<script lang="ts">
    export let onClick: () => void = null;
    export let disabled: boolean = false;
</script>

<button on:click={onClick} disabled={disabled} class="b3-button"><slot /></button>
