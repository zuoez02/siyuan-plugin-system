<script lang="ts">
    import { ICommandManager, Command } from '@/types';
    import { Dialog } from '../../classes/dialog';
    import { onMount } from 'svelte';
    import { container } from '../../../container';
    import { _ } from '@/util';
    const commandManager = container.get<ICommandManager>('CommandManager');

    let commands: Command[] = [];

    let command = '';

    let currentIndex = 0;

    let result: Command[] = [];

    const onkeypress = (e: KeyboardEvent) => {
        if (e.keyCode === 13) {
            onEnter();
            return;
        }

        // moveUp
        if (e.keyCode === 38) {
            e.preventDefault();
            if (currentIndex === 0) {
                return;
            }
            currentIndex--;
            return;
        }
        // moveDown
        if (e.keyCode === 40) {
            const len = result.length;
            e.preventDefault();
            if (currentIndex >= len - 1) {
                return;
            }
            currentIndex++;
        }
    };

    const onEnter = () => {
        const com = result[currentIndex];
        Dialog.destroyAll();
        com.callback();
    };

    const onClick = (i: number) => {
        currentIndex = i;
        onEnter();
    };

    const hasContent = (v: string | undefined, c: string) => v && v.toLowerCase().indexOf(c.toLowerCase()) >= 0;

    $: {
        currentIndex = 0;
        if (!command) {
            result = commands;
        } else {
            result = commands.filter((c) => {
                return (
                    hasContent(c.plugin, command) ||
                    hasContent(c.pluginName, command) ||
                    hasContent(c.command, command) ||
                    hasContent(c.description, command)
                );
            });
        }
    }

    onMount(() => {
        commands = commandManager.getCommands();
        const el = document.getElementById('commandPanelInput');
        el.focus();
    });
</script>

<div class="fn__flex-column" style="border-radius: 4px;overflow: hidden;position: relative; width: max(80vw, 1000px)">
    <div class="b3-form__icon search__header">
        <svg
            style="left: 14px;"
            class="b3-form__icon-icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            width="200"
            height="200"
            ><path
                d="M64 112v800h896V112H64z m846 750H114V162h796v700zM234.6 688.8L411.3 512 234.6 335.2l35.4-35.4L482.1 512 269.9 724.1l-35.3-35.3z m554.8-10.2h-300v-50h300v50z"
            /></svg
        >
        <input
            id="commandPanelInput"
            class="b3-text-field b3-text-field--text fn__block b3-form__icon-input"
            bind:value={command}
            on:keydown={onkeypress}
        />
    </div>
    {#if result}
        {#each result as com, i}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div class={i === currentIndex ? 'command-selected command' : 'command'} on:click={() => onClick(i)}>
                <span class="command-plugin">{com.pluginName} {':'} </span>
                <span class="command-description">{com.command} {com.description || ''}</span>
                {#if com.shortcut}
                    <div class="command-shortcut">{_('shortcut')}: {com.shortcut}</div>
                {/if}
            </div>
        {/each}
    {/if}
</div>

<style>
    .command {
        padding: 8px 12px;
    }
    .command:hover {
        cursor: pointer;
        background-color: rgba(0, 0, 0, 0.2);
        color: var(--b3-theme-primary);
    }
    .command-selected {
        color: var(--b3-theme-primary);
        background-color: rgba(0, 0, 0, 0.2);
    }
    .command-plugin {
        font-size: 14px;
    }
    .command-shortcut {
        font-size: 12px;
        color: var(--color-text-3);
    }
</style>
