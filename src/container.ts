import { Container } from 'inversify';
import { StorageManager } from './core/storage-manager';
import { PluginSystem } from './core';
import { TYPES } from './config';
import { SystemManager } from './core/system-manager';
import { PluginLoader } from './core/loader';
import { PluginFileManager } from './core/plugin-file-manager';
import {
    IStorageManager,
    ISystemManager,
    IPluginSystem,
    IPluginLoader,
    IPluginFileManager,
    IEventBus,
    IShortcut,
    ICommandManager,
    IStore,
} from './types';
import { EventBus } from './core/event-bus';
import { CommandManager } from './core/command-manager';
import { Shortcut } from './core/shortcut';
import { Store } from './core/store';

const container = new Container();
container.bind<IStorageManager>(TYPES.StorageManager).to(StorageManager).inSingletonScope();
container.bind<ISystemManager>(TYPES.SystemManager).to(SystemManager).inSingletonScope();
container.bind<IPluginSystem>(TYPES.PluginSystem).to(PluginSystem).inSingletonScope();
container.bind<IPluginLoader>(TYPES.PluginLoader).to(PluginLoader).inSingletonScope();
container.bind<IPluginFileManager>(TYPES.PluginFileManager).to(PluginFileManager).inSingletonScope();
container.bind<IEventBus>(TYPES.EventBus).to(EventBus);
container.bind<IShortcut>(TYPES.Shortcut).to(Shortcut).inSingletonScope();
container.bind<ICommandManager>(TYPES.CommandManager).to(CommandManager).inSingletonScope();
container.bind<IStore>(TYPES.Store).to(Store).inSingletonScope();

export { container };
