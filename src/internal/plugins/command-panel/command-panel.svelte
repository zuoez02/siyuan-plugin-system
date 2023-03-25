<script lang="ts">
    let command = '';

    const onkeypress = (e: KeyboardEvent) => {
        if (e.keyCode === 13) {
            onEnter();
        }
    };

    const onEnter = () => {
        console.log(command);
    };

    let result = [];
</script>

<div class="fn__flex-column" style="border-radius: 4px;overflow: hidden;position: relative">
    <div class="b3-form__icon search__header">
        <svg style="left: 14px;" class="b3-form__icon-icon"><use xlink:href="#iconSearch" /></svg><input
            class="b3-text-field b3-text-field--text fn__block b3-form__icon-input"
            bind:value={command}
            on:keypress={onkeypress}
        />
    </div>
    {#if result}
        <div class="fn__flex-1 fn__flex config__panel">
            {#each result as com}
                <div>{com}</div>
            {/each}
        </div>
    {/if}
</div>
