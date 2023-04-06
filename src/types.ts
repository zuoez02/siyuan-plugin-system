export interface IPlugin {
    onload(): void;
    onunload(): void;
    registerCommand(command: IPluginCommand);
    registerSettingRender(settingRender: SettingRender);
    loadStorage(filename: string): Promise<Response>;
    writeStorage(filename: string, content: any): Promise<void>;
}

export interface PluginConstructor {
    new (): IPlugin;
}

export interface StorePluginManifest {
    key: string;
    name: string;
    description: string;
    author: string;
    version: string;
    url: string;
}

export interface StorePluginStatus extends StorePluginManifest {
    isExist: boolean;
    needUpgrade: boolean;
}

export interface PluginManifest {
    key: string;
    name: string;
    version: string;
    script?: string;
    enabled?: boolean;
    hidden?: boolean;
    description?: string;
    url?: string;
    author?: string;
    plugin?: new (...args: any) => IPlugin;
}

export interface IStorageManager {
    get(key: keyof PluginConfig): any;
    set(key: string, val: any): Promise<void>;
    initStorage(): Promise<IStorageManager>;
    getPlugins(): PluginManifest[];
    getInternalPlugins(): PluginManifest[];
    getThirdPartyPlugins(): PluginManifest[];
    getPluginByKey(key: string): PluginManifest | undefined;
    setPluginEnabled(key: string, enabled: boolean): Promise<void>;
    savePluginsEnabled(): Promise<void>;
    setSafeModeEnabled(enabled: boolean): Promise<void>;
    setPluginStorage(pluginKey: string, filename: string, content: any): Promise<void>;
    getPluginStorage(pluginKey: string, filename: string): Promise<Response>;
    uninstallPlugin(key: string): Promise<void>;
}

export interface ISystemManager {
    saveToLocal(p: string, content: string): Promise<void>;
    localCacheInit(): Promise<void>;
    delayAutoUpgrade(): void;
    tryUpgrade(): Promise<void>;
    getOnlineVersion(): Promise<string>;
    upgrade(): Promise<void>;
}

export interface IPluginSystem {
    init(): Promise<IPluginSystem>;
    loadPlugin(key: string): Promise<void>;
    unloadPlugin(key: string): Promise<void>;
    turnOffSafeMode(): Promise<void>;
    turnOnSafeMode(): Promise<void>;
}

export interface IPluginLoader {
    loadEnabledPlugins(plugins: PluginManifest[]): Promise<void>;
    loadAllInternalPlugins(): Promise<void>;
    loadAllLocalPlugins(): Promise<void>;
    loadPlugin(plugin: PluginManifest): Promise<void>;
    unloadPlugin(key: string): Promise<void>;
    generateRequiredModules(): void;
    unloadThirdPartyPlugins(plugins: PluginManifest[]): Promise<void>;
    loadThirdPartyEnabledPlugins(plugins: PluginManifest[]): Promise<void>;
}

export interface IPluginFileManager {
    scanPlugins(pluginFolder: string): Promise<string[]>;
    getFileContent(f: string): Promise<string>;
    getManifest(f: string): Promise<any>;
    getScript(f: string): Promise<string>;
    getAllPlugins(): Promise<PluginManifest[]>;
}

export interface ISettingTab {
    key: string;
    name: string;
    settings: ISetting[];
}

export interface ISetting<T extends ISettingType = any> {
    key: string;
    name: string;
    type: T;
    value: T extends 'boolean' ? boolean : T extends 'string' ? string : T extends 'array' ? Array<any> : T extends 'number' ? number : any;
}

export enum ISettingType {
    BOOLEAN = 'boolean',
    STRING = 'string',
    ARRAY = 'array',
    NUMBER = 'number',
}

export interface PluginEnableConfig {
    key: string;
    enabled: boolean;
}

export interface PluginConfig {
    PLUGIN_SYSTEM_SAFE_MODE_ENABLED: boolean;
    PLUGIN_SYSTEM_AUTO_UPDATE: boolean;
    PLUGIN_SYSTEM_PLUGIN: Array<PluginEnableConfig>;
    PLUGIN_SYSTEM_THIRD_PARTY_PLUGIN: Array<PluginEnableConfig>;
    PLUGIN_STORE_URL: string;
}

export type Listener = (...args: any) => void;

export interface IEventBus {
    on(eventName: string, callback: Listener): () => void;
    off(eventName: string, callback?: Listener): void;
    emit(eventName: string, ...args: any): void;
    destroy(): void;
}

export interface Command {
    plugin: string;
    pluginName: string;
    command: string;
    shortcut?: string;
    description?: string;
    callback: (...args) => any;
}

export interface IPluginCommand {
    command: string;
    shortcut?: string;
    description?: string;
    callback: (...args) => any;
}

export interface ICommandManager {
    registerCommand(command: Command);
    unregisterCommand(command: Command);
    unregisterCommandByPlugin(plugin: string);
    getCommands(): Command[];
}

export interface IShortcut {
    registerKeyboardEvent(shortcut: string, callback: (e: KeyboardEvent) => void);
    unregisterKeyboardEvent(shortcut: string);
    registerKeyboardEventFromPlugin(command: Command);
    unregisterKeyboardEventFromPlugin(command: Command);
}

export interface INotification {
    show(): void;
}

export interface INoticationOption {
    type: 'error' | 'info';
    message: string;
    timeout?: number;
}

export interface IStore {
    init(): Promise<void>;
    getStoreUrl(): string;
    getPlugins(): StorePluginManifest[];
    loadPlugins(): Promise<StorePluginManifest[]>;
    getPluginsWithStatus(): StorePluginManifest[];
    loadPluginsFromUrl(): Promise<void>;
    getPluginByUrl(url: string): Promise<{ manifest: string; mainJs: string }>;
    getPluginManifest(url: string): Promise<PluginManifest>;
    getPluginReadme(url: string): Promise<string>;
    downloadPlugin(key: string): Promise<any>;
}

export type SettingRender = (element: HTMLElement) => void;

export interface ISettingManager {
    registerSetting(key: string, settingRender: SettingRender): void;
    unregisterSetting(key: string): void;
    getSettingRenders(): Array<{ key: string; value: SettingRender }>;
}
